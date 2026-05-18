/**
 * ROSRA Number Format — single source of truth for live thousands-separator
 * formatting on every numeric <input> across the app.
 *
 * Why this file exists: the old inline formatter in _PotentialEstimates queried
 * .number-format once at DOMContentLoaded. Streams added later (the user's
 * "+ Add stream" / "Add category" flow) miss that pass and render as raw 1000000
 * instead of 1,000,000 — exactly the v2-brief complaint in §7. This module wires
 * up document-level event delegation so any element with class="number-format"
 * gets the formatter the moment it lands in the DOM, no per-stream init needed.
 *
 * Behaviour:
 *   - On `input`: strips non-numeric characters (keeps one decimal point, sign
 *     prefix if present at start), then re-inserts thousand separators and
 *     restores caret position so users don't lose their place.
 *   - On `blur`: re-runs the format pass once more to clean up trailing
 *     decimal points and normalise leading zeros.
 *   - On `paste`: pastes go through the same sanitiser (commas/$ symbols/spaces
 *     stripped) so copy-paste from spreadsheets behaves cleanly.
 *
 * Skip rules:
 *   - Inputs with `readonly`/`disabled` are left alone (display values like
 *     auto-populated GRP shouldn't react to user typing).
 *   - Inputs with attribute `data-no-format` opt out explicitly.
 *
 * Exposed API:
 *   window.RosraNumberFormat.format(value, allowDecimals)  → "1,234,567.89"
 *   window.RosraNumberFormat.parse(value)                  → 1234567.89 (number)
 *
 * These helpers are intentionally global so partials and the report can call
 * them when rendering computed values to keep the display style consistent.
 */
(function (window, document) {
    'use strict';

    /**
     * Format a numeric string with thousand separators. Preserves a single
     * decimal point if present and `allowDecimals` is truthy.
     */
    function format(value, allowDecimals) {
        if (value === null || value === undefined) return '';
        var s = String(value);
        if (!s) return '';

        // Capture optional leading sign
        var sign = '';
        if (s.charAt(0) === '-' || s.charAt(0) === '+') {
            sign = s.charAt(0) === '-' ? '-' : '';
            s = s.slice(1);
        }

        // Strip everything except digits and one decimal point
        var cleaned = s.replace(/[^0-9.]/g, '');
        if (!cleaned) return sign;

        // If decimals not allowed, drop the dot and anything after
        if (!allowDecimals) {
            cleaned = cleaned.replace(/\..*$/, '');
        } else {
            // Keep only the first decimal point — second and beyond are noise
            var firstDot = cleaned.indexOf('.');
            if (firstDot !== -1) {
                cleaned = cleaned.slice(0, firstDot + 1) +
                          cleaned.slice(firstDot + 1).replace(/\./g, '');
            }
        }

        var parts = cleaned.split('.');
        // Trim leading zeros from the integer portion but keep at least one digit
        parts[0] = parts[0].replace(/^0+(?=\d)/, '');
        if (parts[0] === '') parts[0] = '0';
        // Apply thousand separators to integer portion
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return sign + parts.join('.');
    }

    /**
     * Parse a comma-formatted string back to a JS number. Empty/invalid → 0.
     */
    function parse(value) {
        if (value === null || value === undefined) return 0;
        var n = parseFloat(String(value).replace(/,/g, ''));
        return isFinite(n) ? n : 0;
    }

    /**
     * Detect whether an input should opt out: readonly/disabled/no-format flags.
     */
    function shouldSkip(el) {
        if (!el) return true;
        if (el.readOnly || el.disabled) return true;
        if (el.hasAttribute('data-no-format')) return true;
        return false;
    }

    /**
     * Whether decimals are allowed on this input. The `inputmode="numeric"` or
     * `data-integer-only="true"` attribute opts out of decimals.
     */
    function allowsDecimals(el) {
        if (el.hasAttribute('data-integer-only')) return false;
        if (el.getAttribute('inputmode') === 'numeric') return false;
        return true;
    }

    /**
     * Re-format the input value in place, preserving caret position so the
     * cursor stays where the user expects after the live re-render.
     */
    function reformat(el) {
        if (shouldSkip(el)) return;

        var oldValue = el.value;
        var caret = el.selectionStart;
        var decimals = allowsDecimals(el);
        var newValue = format(oldValue, decimals);

        if (newValue === oldValue) return;

        // Count digits to the left of caret before/after formatting so the
        // cursor lands at the same logical position even if commas shifted.
        var digitsBefore = oldValue.slice(0, caret).replace(/[^0-9.\-]/g, '').length;
        el.value = newValue;
        var newCaret = 0;
        var seen = 0;
        for (var i = 0; i < newValue.length; i++) {
            if (/[0-9.\-]/.test(newValue.charAt(i))) seen++;
            if (seen >= digitsBefore) { newCaret = i + 1; break; }
        }
        if (seen < digitsBefore) newCaret = newValue.length;

        try { el.setSelectionRange(newCaret, newCaret); } catch (e) { /* ignore on input types that don't support it */ }
    }

    /**
     * Event-delegated `input` handler. Fires for any .number-format input in
     * the document, including ones added after page load.
     */
    function onInput(e) {
        var t = e.target;
        if (!t || !t.classList || !t.classList.contains('number-format')) return;
        reformat(t);
    }

    /**
     * Final tidy on blur — re-run formatter to strip trailing decimal points
     * and apply leading-zero normalisation.
     */
    function onBlur(e) {
        var t = e.target;
        if (!t || !t.classList || !t.classList.contains('number-format')) return;
        if (shouldSkip(t)) return;
        // Trim trailing "."
        if (t.value && t.value.charAt(t.value.length - 1) === '.') {
            t.value = t.value.slice(0, -1);
        }
        var decimals = allowsDecimals(t);
        t.value = format(t.value, decimals);
    }

    /**
     * Sanitise pasted content through the same formatter so users can paste
     * "$1,234,567.89" from a spreadsheet and end up with "1,234,567.89".
     */
    function onPaste(e) {
        var t = e.target;
        if (!t || !t.classList || !t.classList.contains('number-format')) return;
        if (shouldSkip(t)) return;
        // Allow default paste then re-format on next tick
        setTimeout(function () { reformat(t); }, 0);
    }

    /**
     * Apply formatter to any pre-filled .number-format inputs already in the
     * DOM at script-load time. Server-rendered values like "1000000" become
     * "1,000,000" without the user needing to refocus.
     */
    function applyToExisting() {
        var inputs = document.querySelectorAll('input.number-format');
        for (var i = 0; i < inputs.length; i++) {
            var el = inputs[i];
            if (shouldSkip(el)) continue;
            if (!el.value) continue;
            var decimals = allowsDecimals(el);
            el.value = format(el.value, decimals);
        }
    }

    // Wire the delegated listeners on document — they survive partial swaps
    // (Add Stream / Add Category) without re-binding.
    document.addEventListener('input', onInput, true);
    document.addEventListener('blur', onBlur, true);
    document.addEventListener('paste', onPaste, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyToExisting);
    } else {
        applyToExisting();
    }

    // Also re-apply when streams are added dynamically — generic streams hit
    // this hook after their template is injected.
    document.addEventListener('rosra:streamAdded', applyToExisting);

    // Public API
    window.RosraNumberFormat = {
        format: format,
        parse: parse,
        applyToExisting: applyToExisting
    };
})(window, document);
