// =============================================================================
// rosraTabFlushers.js
//
// Central registry that lets each ROSRA tab register a `flushState()` function.
// The Save click, the 60-second auto-save, and the beforeunload handler all
// call `RosraTabFlushers.flushAll()` before serializing the form. Each
// flusher's job is to copy in-memory tab state (drag-ranked priorities, gap
// sequences, selection toggles, etc.) into the matching hidden <input> on the
// form so the POST captures it.
//
// Why a registry: previously, Index.cshtml had a single
// `collectTabDataFromLocalStorage` that hardcoded the shape of every tab's
// state. That overwrote richer data the tabs themselves had already produced
// (notably Prioritization's {streamCustomizations, gapPrioritization} shape).
// With a registry, each tab owns its own flush and there is no central
// clobberer.
// =============================================================================

(function (global) {
    'use strict';

    var flushers = [];

    function register(name, fn) {
        if (typeof fn !== 'function') {
            console.warn('[RosraTabFlushers] register: ignored non-function for', name);
            return;
        }
        // Replace existing flusher with the same name (idempotent re-registration
        // is convenient when a partial re-renders).
        var existing = flushers.findIndex(function (f) { return f.name === name; });
        if (existing >= 0) {
            flushers[existing] = { name: name, fn: fn };
        } else {
            flushers.push({ name: name, fn: fn });
        }
    }

    function flushAll() {
        var errors = [];
        flushers.forEach(function (f) {
            try {
                f.fn();
            } catch (e) {
                // Don't let one bad flusher stop the rest. Save still proceeds.
                console.error('[RosraTabFlushers] flusher "' + f.name + '" threw:', e);
                errors.push({ name: f.name, error: e });
            }
        });
        if (window.__rosraDebug) {
            console.log('[RosraTabFlushers] flushed', flushers.length, 'tab(s)',
                errors.length ? '(' + errors.length + ' threw)' : '');
        }
        return { flushed: flushers.length, errors: errors };
    }

    function list() {
        return flushers.map(function (f) { return f.name; });
    }

    global.RosraTabFlushers = {
        register: register,
        flushAll: flushAll,
        list: list
    };
})(window);
