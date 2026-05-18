        // Recommendations Module
        const RecommendationsModule = (function() {
            'use strict';

            // Pre-cache branding assets as base64 data URLs so the PDF cover page
            // works even when HtmlToPdfService blocks outbound network. Logos are
            // served from the same origin so canvas reads are not tainted. PNG/JPG
            // go through canvas; SVG is fetched as text and inlined directly so the
            // crisp vector survives PDF rasterisation.
            const _reportAssets = {};
            function _cacheRasterAsset(key, url) {
                const img = new Image();
                img.onload = function () {
                    try {
                        const c = document.createElement('canvas');
                        c.width = img.naturalWidth;
                        c.height = img.naturalHeight;
                        c.getContext('2d').drawImage(img, 0, 0);
                        _reportAssets[key] = c.toDataURL('image/png');
                    } catch (_) { /* skip on failure */ }
                };
                img.onerror = function () { /* skip */ };
                img.src = url;
            }
            function _cacheSvgAsset(key, url) {
                fetch(url).then(r => r.ok ? r.text() : '')
                    .then(svg => { if (svg) _reportAssets[key] = svg; })
                    .catch(() => { /* skip */ });
            }
            // Fonts must be inlined as data: URIs in the PDF HTML because
            // HtmlToPdfService blocks all outbound network. Fetch each woff2,
            // convert to base64 once, stash on _reportAssets.fonts[key].
            _reportAssets.fonts = {};
            function _cacheFontAsset(key, url) {
                fetch(url).then(r => r.ok ? r.arrayBuffer() : null)
                    .then(buf => {
                        if (!buf) return;
                        let bin = '';
                        const bytes = new Uint8Array(buf);
                        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
                        _reportAssets.fonts[key] = 'data:font/woff2;base64,' + btoa(bin);
                    })
                    .catch(() => { /* skip */ });
            }
            _cacheSvgAsset('unHabitatLogo', '/images/logo-white.svg');     // centered brand mark at top
            _cacheRasterAsset('sdg11Logo',     '/images/SDG_11.png');     // alignment chip
            _cacheRasterAsset('cityBg',        '/images/cities/nairobi.jpg'); // silhouette background
            // Editorial type system for the PDF: Playfair Display (display)
            // + Inter (body / UI / tabular numbers).
            _cacheFontAsset('inter400',    '/fonts/inter-400.woff2');
            _cacheFontAsset('inter500',    '/fonts/inter-500.woff2');
            _cacheFontAsset('inter600',    '/fonts/inter-600.woff2');
            _cacheFontAsset('inter700',    '/fonts/inter-700.woff2');
            _cacheFontAsset('inter800',    '/fonts/inter-800.woff2');
            _cacheFontAsset('playfair600', '/fonts/playfair-600.woff2');
            _cacheFontAsset('playfair700', '/fonts/playfair-700.woff2');
            _cacheFontAsset('playfair800', '/fonts/playfair-800.woff2');

            // Builds the @font-face CSS block from whatever fonts loaded.
            // Returns '' if nothing was cached so we fall back to system fonts.
            function _buildFontFaceCss() {
                const f = _reportAssets.fonts || {};
                const face = (family, weight, key) => {
                    if (!f[key]) return '';
                    return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('${f[key]}') format('woff2');}`;
                };
                return [
                    face('Inter', 400, 'inter400'),
                    face('Inter', 500, 'inter500'),
                    face('Inter', 600, 'inter600'),
                    face('Inter', 700, 'inter700'),
                    face('Inter', 800, 'inter800'),
                    face('Playfair Display', 600, 'playfair600'),
                    face('Playfair Display', 700, 'playfair700'),
                    face('Playfair Display', 800, 'playfair800')
                ].join('');
            }

            // Currency symbol from AppContext (single source of truth)
            let currencySymbol = '$';

            function getCurrencyFromContext() {
                if (typeof AppContext !== 'undefined') {
                    return AppContext.get('currencySymbol') || '$';
                }
                return localStorage.getItem('selectedCurrencySymbol') || '$';
            }

            // Format currency helper (for future use)
            function formatCurrency(amount) {
                return currencySymbol + ' ' + new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            }

            // Compact currency formatter for report tables — e.g. 12,500,000 → "12.5M", 8,200 → "8.2K".
            // Uses Intl.NumberFormat's compact notation so readers scan large figures quickly.
            function formatCurrencyCompact(amount) {
                const n = Number(amount) || 0;
                // Numbers under 1,000 look odd in compact notation ("45") — keep them plain.
                if (Math.abs(n) < 1000) {
                    return currencySymbol + ' ' + new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(n);
                }
                const compact = new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1
                }).format(n);
                return currencySymbol + ' ' + compact;
            }

            let selectedSolutions = [];
            let progressData = {};
            let timelineFilter = 'all'; // 'all' | '<1 year' | '1-3 years' | '3+ years'

            // Return the currently visible solutions based on the active timeline filter
            function getFilteredSolutions() {
                if (timelineFilter === 'all') return selectedSolutions;
                return selectedSolutions.filter(s => s.timeline === timelineFilter);
            }

            // Sync the active state on the summary filter cards
            function updateSummaryFilterUI() {
                document.querySelectorAll('.recommendations-summary .summary-card').forEach(card => {
                    card.classList.toggle('active', card.dataset.filter === timelineFilter);
                });
            }

            // Click handler for the summary cards — toggles timeline filter
            function filterByTimeline(timeline) {
                if (!timeline || timeline === timelineFilter) {
                    timelineFilter = 'all';
                } else {
                    timelineFilter = timeline;
                }
                updateSummaryFilterUI();

                // Re-render whichever view is currently visible
                const activeView = document.querySelector('.view-toggle-btn.active');
                const viewName = activeView ? activeView.dataset.view : 'cards';
                if (viewName === 'timeline') {
                    renderTimelineView();
                } else if (viewName === 'progress') {
                    renderProgressView();
                } else {
                    renderSolutionCards();
                }
            }

            // Initialize module
            function init() {
                // Get initial currency from AppContext
                currencySymbol = getCurrencyFromContext();
                console.log('Recommendations: Initial currency symbol:', currencySymbol);

                loadSelectedSolutions();
                loadProgressData();
                renderSolutionCards();
                updateSummaryStats();

                // Subscribe to currency changes from AppContext
                if (typeof AppContext !== 'undefined') {
                    AppContext.subscribe('currencySymbol', function(newSymbol) {
                        console.log('Recommendations: Currency changed to', newSymbol);
                        currencySymbol = newSymbol || '$';
                        // Re-render if needed (currently no currency values displayed)
                    });
                }

                // Re-filter and re-render when stream inclusion changes in Prioritization
                if (typeof RosraStateManager !== 'undefined' && RosraStateManager.subscribe) {
                    RosraStateManager.subscribe('streams', function() {
                        loadSelectedSolutions();
                        renderSolutionCards();
                        updateSummaryStats();
                    });
                }
            }

            // Defensive normaliser — in case older saved selections still carry
            // raw timeline strings from the solution cards ("< 1 year",
            // "Less than a year", "6-12 months", "1-2 years", …), coerce them
            // onto the three canonical buckets this module filters on so the
            // Timeline view and summary counts render correctly.
            function canonicalizeTimeline(raw) {
                if (typeof window.canonicalizeTimeline === 'function') {
                    return window.canonicalizeTimeline(raw);
                }
                if (!raw) return '1-3 years';
                const s = String(raw).toLowerCase().trim();
                if (s.includes('90 day')
                    || s.includes('less than a year')
                    || /<\s*1\s*year/.test(s)
                    || /6\s*-\s*12\s*month/.test(s)
                    || s.startsWith('less than')) {
                    return '<1 year';
                }
                if (/3\s*\+/.test(s) || /3\s*-\s*5\s*year/.test(s)) {
                    return '3+ years';
                }
                return '1-3 years';
            }

            function normaliseSelections(arr) {
                return rehydrateStreamNames(
                    (arr || []).map(s => ({ ...s, timeline: canonicalizeTimeline(s && s.timeline) }))
                );
            }

            // Saved selections for non-property cards carry streamName="Non-Property"
            // because that's the streamType label on the solution card in the DB.
            // The user, however, owns one or more generic streams (Daily Market Fee,
            // Signage Permit, …) each tied to a subgroup (A/B/C). Without a remap
            // every non-property selection collapses into a single "Non-Property"
            // block in the render below, hiding the user's actual stream names.
            //
            // This rehydrate pass tries to recover the real stream name:
            //   1. derive a subgroup for the selection (own field → solutionId prefix)
            //   2. find a user stream in RosraStateManager with the matching subgroup
            //   3. swap streamName to the user's stream name (and stamp subgroup back)
            //
            // If state has no subgroup info yet (older sessions saved before the
            // gap-analysis save bug was fixed), we fall back to a descriptive
            // subgroup label so the three buckets at least appear as separate
            // sections instead of one giant "Non-Property" mound.
            function rehydrateStreamNames(arr) {
                if (!Array.isArray(arr) || arr.length === 0) return arr;

                // Build subgroup → user-stream-name lookup from RosraStateManager.
                // First match wins; if two user streams share a subgroup the second
                // collapses into the first (same behaviour as the save-time mapping).
                const subgroupToUserStream = new Map();
                try {
                    if (typeof RosraStateManager !== 'undefined') {
                        RosraStateManager.getStreams().forEach(s => {
                            const sub = s && s.subgroup;
                            if (sub && s.name && s.name !== 'Non-Property' && !subgroupToUserStream.has(sub)) {
                                subgroupToUserStream.set(sub, { name: s.name, rank: s.adjustedRank || null });
                            }
                        });
                    }
                } catch (_) { /* ignore */ }

                function inferSubgroup(sel) {
                    if (sel.subgroup) return String(sel.subgroup).toUpperCase();
                    const id = String(sel.solutionId || '');
                    // NP-A-COV-01 / NP-B-LIA-01 style first
                    let m = id.match(/^NP-([ABC])-/i);
                    if (m) return m[1].toUpperCase();
                    // Bare A/B/C prefix (A1, A12, B14, C3 …)
                    m = id.match(/^([ABC])\d/i);
                    if (m) return m[1].toUpperCase();
                    return null;
                }

                return arr.map(sel => {
                    if (!sel || sel.streamName !== 'Non-Property') return sel;
                    const sub = inferSubgroup(sel);
                    if (!sub) return sel;

                    const userStream = subgroupToUserStream.get(sub);
                    if (userStream) {
                        return {
                            ...sel,
                            streamName: userStream.name,
                            subgroup: sub,
                            streamRank: sel.streamRank || userStream.rank || 999
                        };
                    }
                    // State has no user stream with this subgroup — leave the entry
                    // alone so the upstream bug is visible rather than masked.
                    return sel;
                });
            }

            // Build a map: streamName -> Set of gap-types the user marked (Remove)
            // in the Step 2 Gap Sequencing table. Reads from FormStateManager
            // (preferred) or the localStorage fallback that Prioritization writes
            // to via savePrioritizationState().
            //
            // Note: FormStateManager.getData reads the server-rendered hidden
            // form field first. For sample / saved reports that field carries a
            // *legacy* shape ({ streams: [...] }) with no `gapPrioritization`
            // array. We must fall through to localStorage in that case — that's
            // where the user's client-side priority changes actually land.
            function getRemovedGapsByStream() {
                let priState = null;
                try {
                    if (typeof FormStateManager !== 'undefined') {
                        priState = FormStateManager.getData('prioritizationState');
                    }
                    if (!priState || !Array.isArray(priState.gapPrioritization)) {
                        const raw = localStorage.getItem('prioritizationState');
                        if (raw) {
                            const fromLocal = JSON.parse(raw);
                            if (fromLocal && Array.isArray(fromLocal.gapPrioritization)) {
                                priState = fromLocal;
                            }
                        }
                    }
                } catch (_) { priState = null; }

                if (!priState || !Array.isArray(priState.gapPrioritization)) return new Map();
                if (typeof RosraStateManager === 'undefined') return new Map();

                // Map streamId -> streamName via RosraStateManager so we can match
                // the streamName carried on each saved selection.
                const idToName = new Map(RosraStateManager.getStreams().map(s => [s.id, s.name]));

                const removed = new Map();
                priState.gapPrioritization.forEach(entry => {
                    const name = idToName.get(entry.streamId);
                    if (!name || !Array.isArray(entry.currentSequence)) return;
                    // Lowercase everything we put in the Set — the lookup at the call
                    // site uses .toLowerCase() to compare against saved selectedSolutions
                    // (which carry capitalised gapType like "Compliance"). If we left
                    // the values capitalised, the lookup would always miss and removed
                    // gap-types would silently still appear in Recommendations.
                    const removedTypes = new Set(
                        entry.currentSequence
                            .filter(seq => seq && seq.removed)
                            .map(seq => String(seq.type || '').toLowerCase())
                            .filter(t => t && t !== 'remove')
                    );
                    // Also infer "this gap-type isn't planned" from the active set:
                    // a gap-type is removed if it doesn't appear in any non-removed slot.
                    const activeTypes = new Set(
                        entry.currentSequence
                            .filter(seq => seq && !seq.removed && seq.type && seq.type !== 'Remove')
                            .map(seq => String(seq.type).toLowerCase())
                    );
                    ['compliance', 'coverage', 'valuation', 'liability'].forEach(t => {
                        if (!activeTypes.has(t)) removedTypes.add(t);
                    });
                    removed.set(name, removedTypes);
                });
                return removed;
            }

            // Drop solutions belonging to streams the user excluded in Prioritization (step 2),
            // OR whose gap-type was set to (Remove) in the Gap Sequencing table.
            // Anything excluded at either level should produce no recommendations.
            function filterByIncludedStreams(solutions) {
                if (!Array.isArray(solutions) || typeof RosraStateManager === 'undefined') return solutions || [];
                const streams = RosraStateManager.getStreams();
                if (!streams.length) return solutions;

                const excludedNames = new Set(streams.filter(s => s.included === false).map(s => s.name));
                const removedGapsByStream = getRemovedGapsByStream();

                if (excludedNames.size === 0 && removedGapsByStream.size === 0) return solutions;

                return solutions.filter(s => {
                    if (excludedNames.has(s.streamName)) return false;
                    const removedSet = removedGapsByStream.get(s.streamName);
                    // removedSet entries are lowercased; saved selectedSolutions
                    // carry capitalised gapType (e.g. "Compliance"), so compare
                    // case-insensitively to match the lowercase set.
                    if (removedSet && s.gapType && removedSet.has(String(s.gapType).toLowerCase())) return false;
                    return true;
                });
            }

            // Load selected solutions from form field (primary) with localStorage fallback
            function loadSelectedSolutions() {
                try {
                    // Use FormStateManager for form field binding (best practice)
                    if (typeof FormStateManager !== 'undefined') {
                        const data = FormStateManager.getData('rosraSelectedSolutions');
                        if (data && Array.isArray(data)) {
                            selectedSolutions = filterByIncludedStreams(normaliseSelections(data));
                            console.log('Recommendations: Loaded', selectedSolutions.length, 'solutions from FormStateManager');
                            return;
                        }
                    }

                    // Fallback to localStorage
                    const stored = localStorage.getItem('rosraSelectedSolutions');
                    if (stored) {
                        selectedSolutions = filterByIncludedStreams(normaliseSelections(JSON.parse(stored)));
                        console.log('Recommendations: Loaded', selectedSolutions.length, 'solutions from localStorage (fallback)');
                    }
                } catch (e) {
                    console.error('Error loading selected solutions:', e);
                    selectedSolutions = [];
                }
            }

            // Load progress data from form field (primary) with localStorage fallback
            function loadProgressData() {
                try {
                    // Use FormStateManager for form field binding (best practice)
                    if (typeof FormStateManager !== 'undefined') {
                        const data = FormStateManager.getData('rosraImplementationProgress');
                        if (data && typeof data === 'object') {
                            progressData = data;
                            console.log('Recommendations: Loaded progress data from FormStateManager');
                            return;
                        }
                    }

                    // Fallback to localStorage
                    const stored = localStorage.getItem('rosraImplementationProgress');
                    if (stored) {
                        progressData = JSON.parse(stored);
                        console.log('Recommendations: Loaded progress data from localStorage (fallback)');
                    }
                } catch (e) {
                    console.error('Error loading progress data:', e);
                    progressData = {};
                }
            }

            // Save progress data to form field (primary) and localStorage (backup)
            function saveProgressData() {
                try {
                    // Use FormStateManager for form field binding (best practice)
                    if (typeof FormStateManager !== 'undefined') {
                        FormStateManager.setData('rosraImplementationProgress', progressData);
                        console.log('Recommendations: Saved progress data via FormStateManager');
                    } else {
                        // Fallback to localStorage only
                        localStorage.setItem('rosraImplementationProgress', JSON.stringify(progressData));
                    }
                } catch (e) {
                    console.error('Error saving progress data:', e);
                }
            }

            // Update summary statistics
            function updateSummaryStats() {
                const total = selectedSolutions.length;
                const quickWins = selectedSolutions.filter(s => s.timeline === '<1 year').length;
                const mediumTerm = selectedSolutions.filter(s => s.timeline === '1-3 years').length;
                const longTerm = selectedSolutions.filter(s => s.timeline === '3+ years').length;

                document.getElementById('totalSelectedCount').textContent = total;
                document.getElementById('quickWinsCount').textContent = quickWins;
                document.getElementById('mediumTermCount').textContent = mediumTerm;
                document.getElementById('longTermCount').textContent = longTerm;
            }

            // Render solution cards grouped by stream and gap
            /**
             * v2 brief §10 — compute a "collapse plan" for the visible streams to
             * avoid printing the same solution package twice when two non-property
             * streams sit in the same NPT subgroup (A/B/C) AND share gap profiles.
             *
             * The plan is a Map streamName -> { kind, anchorName, sharedGaps, categoryLabel }
             *   kind = 'full'    : render every gap/card normally
             *   kind = 'sameAs'  : Scenario A — render a "Same as <anchor>" note only,
             *                      no cards. Used when subgroup + gap profile fully match.
             *   kind = 'partial' : Scenario C — drop gaps shared with the anchor and
             *                      render a reference note at the top; render any
             *                      gap unique to this stream.
             *
             * Property Tax (subgroup unset, name ~ /property tax/i) ALWAYS gets 'full'
             * and is never used as an anchor for NPT streams — Scenario E in the brief.
             * Different subgroup or non-overlapping gaps → 'full' (Scenarios B and D).
             *
             * Streams are walked in rank order. The first stream in any (subgroup,
             * gap) bucket becomes the anchor; later streams collapse against it.
             */
            function computeCollapsePlan(visibleSolutions) {
                const plan = new Map();
                if (!visibleSolutions.length) return plan;

                // Build per-stream metadata: subgroup, gapTypes Set, rank
                const meta = new Map();
                visibleSolutions.forEach(s => {
                    const name = s.streamName || 'Other';
                    if (!meta.has(name)) {
                        meta.set(name, {
                            name: name,
                            subgroup: s.subgroup || null,
                            rank: s.streamRank || 999,
                            gapTypes: new Set(),
                            isPropertyTax: !s.subgroup && /property\s*tax/i.test(name)
                        });
                    }
                    meta.get(name).gapTypes.add(s.gapType || 'Other');
                });

                const ordered = [...meta.values()].sort((a, b) => a.rank - b.rank);

                ordered.forEach(curr => {
                    // Property tax / unclassified streams are never collapsed (Scenario E).
                    if (curr.isPropertyTax || !curr.subgroup) {
                        plan.set(curr.name, { kind: 'full' });
                        return;
                    }

                    // Look for an earlier-rendered FULL stream with same subgroup and
                    // some gap overlap. Anchor must itself be rendered in full so the
                    // "Same as X" reference actually points somewhere with cards.
                    let anchor = null;
                    let intersect = null;
                    for (const prev of ordered) {
                        if (prev === curr) break;
                        if (prev.subgroup !== curr.subgroup) continue; // Scenario D
                        const prevPlan = plan.get(prev.name);
                        if (!prevPlan || prevPlan.kind !== 'full') continue;
                        const overlap = new Set([...curr.gapTypes].filter(g => prev.gapTypes.has(g)));
                        if (overlap.size === 0) continue; // no overlap → render in full

                        anchor = prev;
                        intersect = overlap;
                        break;
                    }

                    if (!anchor) {
                        plan.set(curr.name, { kind: 'full' });
                        return;
                    }

                    // Resolve category label via StreamClassification when available.
                    let categoryLabel = '';
                    try {
                        if (typeof StreamClassification !== 'undefined') {
                            categoryLabel = StreamClassification.getSubgroupShortLabel(curr.subgroup) || '';
                        }
                    } catch (_) { /* ignore */ }

                    const allCurrentGapsShared = [...curr.gapTypes].every(g => intersect.has(g));
                    if (allCurrentGapsShared) {
                        // Scenario A — every gap this stream cares about is already
                        // covered by the anchor. Just point to the anchor.
                        plan.set(curr.name, {
                            kind: 'sameAs',
                            anchorName: anchor.name,
                            sharedGaps: intersect,
                            categoryLabel: categoryLabel
                        });
                    } else {
                        // Scenario C — partial overlap. Drop shared gaps, render
                        // the unique ones, prepend a reference note for the shared.
                        plan.set(curr.name, {
                            kind: 'partial',
                            anchorName: anchor.name,
                            sharedGaps: intersect,
                            categoryLabel: categoryLabel
                        });
                    }
                });

                return plan;
            }

            /**
             * Render a "Same as / shared reform guidance" callout. Used by the
             * sameAs and partial scenarios in the collapse plan.
             */
            function renderCollapseNote(planEntry) {
                const strings = (window.RosraStrings || {});
                const headingText = escapeForTemplate(strings.duplicateSameAsHeading || 'Shared reform guidance');
                const anchorHtml = '<span class="collapse-note__anchor">' + escapeForTemplate(planEntry.anchorName) + '</span>';
                const cat = escapeForTemplate(planEntry.categoryLabel || 'similar revenue stream');
                const gapList = escapeForTemplate(
                    [...(planEntry.sharedGaps || [])].map(g => String(g).toLowerCase()).join(', ')
                );

                if (planEntry.kind === 'sameAs') {
                    const tpl = strings.duplicateFullCollapse
                        || 'Same as {0}. This stream is also a {1} and shares a similar gap profile, so the relevant reform options are the same. Please refer to the solution package shown under {0}.';
                    // Manual {0}/{1} substitution — anchor inserted as bold HTML.
                    const body = tpl
                        .replace(/\{0\}/g, anchorHtml)
                        .replace(/\{1\}/g, cat);
                    return '<div class="collapse-note">'
                         + '<span class="collapse-note__heading">' + headingText + '</span>'
                         + body
                         + '</div>';
                }

                // partial
                const tpl = strings.duplicatePartialCollapse
                    || 'Some recommended actions for this stream are the same as those shown under {0}, because both streams share the same category and {2} gap. Only additional or different recommendations are shown here.';
                const body = tpl
                    .replace(/\{0\}/g, anchorHtml)
                    .replace(/\{1\}/g, cat)
                    .replace(/\{2\}/g, gapList || 'overlapping');
                return '<div class="collapse-note collapse-note--partial">'
                     + '<span class="collapse-note__heading">' + headingText + '</span>'
                     + body
                     + '</div>';
            }

            function renderSolutionCards() {
                const container = document.getElementById('solutionCardsContainer');
                const noSelectionsMsg = document.getElementById('noSelectionsMessage');

                if (selectedSolutions.length === 0) {
                    noSelectionsMsg.style.display = 'block';
                    container.innerHTML = '';
                    return;
                }

                noSelectionsMsg.style.display = 'none';

                const visibleSolutions = getFilteredSolutions();
                if (visibleSolutions.length === 0) {
                    container.innerHTML = `<div class="empty-state"><p>No solutions match the current filter. <a href="#" onclick="event.preventDefault(); RecommendationsModule.filterByTimeline('all');">Clear filter</a>.</p></div>`;
                    return;
                }

                // v2 brief §10 — compute the duplicate-collapse plan up front so
                // the render loop below can pick the right rendering for each stream.
                const collapsePlan = computeCollapsePlan(visibleSolutions);

                // Group by stream
                const streamGroups = {};
                visibleSolutions.forEach(solution => {
                    const streamName = solution.streamName || 'Other';
                    if (!streamGroups[streamName]) {
                        streamGroups[streamName] = {
                            rank: solution.streamRank || 999,
                            gaps: {}
                        };
                    }
                    const gapType = solution.gapType || 'Other';
                    if (!streamGroups[streamName].gaps[gapType]) {
                        streamGroups[streamName].gaps[gapType] = {
                            priority: solution.gapPriority || 999,
                            solutions: []
                        };
                    }
                    streamGroups[streamName].gaps[gapType].solutions.push(solution);
                });

                // Sort streams by rank
                const sortedStreams = Object.entries(streamGroups)
                    .sort((a, b) => a[1].rank - b[1].rank);

                let html = '';

                sortedStreams.forEach(([streamName, streamData], streamIdx) => {
                    const streamKey = 'stream-' + streamIdx;
                    const planEntry = collapsePlan.get(streamName) || { kind: 'full' };

                    html += `
                        <div class="stream-section" data-stream-key="${streamKey}">
                            <div class="stream-header" onclick="RecommendationsModule.toggleStream('${streamKey}')" style="cursor:pointer;">
                                <h3><i class="bi bi-bar-chart-fill me-2"></i> ${streamName}</h3>
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <span class="stream-rank">Rank #${streamData.rank}</span>
                                    <button type="button" class="stream-toggle-btn" id="stream-icon-${streamKey}" aria-label="Expand ${streamName}" title="Expand" onclick="event.stopPropagation(); RecommendationsModule.toggleStream('${streamKey}')">
                                        <i class="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="stream-body" id="stream-body-${streamKey}" style="display:none;">
                    `;

                    // Scenario A — fully collapsed. Render just the note, skip all gap/card output.
                    if (planEntry.kind === 'sameAs') {
                        html += renderCollapseNote(planEntry);
                        html += `</div></div>`;
                        return;
                    }

                    // Scenario C — partial overlap. Prepend the reference note and
                    // filter out gap-types already shown under the anchor.
                    if (planEntry.kind === 'partial') {
                        html += renderCollapseNote(planEntry);
                    }
                    const sharedGapsLower = planEntry.kind === 'partial' && planEntry.sharedGaps
                        ? new Set([...planEntry.sharedGaps].map(g => String(g).toLowerCase()))
                        : null;

                    // Sort gaps by priority
                    const sortedGaps = Object.entries(streamData.gaps)
                        .sort((a, b) => a[1].priority - b[1].priority);

                    sortedGaps.forEach(([gapType, gapData], gapIdx) => {
                        // Skip gap-types that the anchor already covers (Scenario C).
                        if (sharedGapsLower && sharedGapsLower.has(String(gapType).toLowerCase())) return;
                        const gapClass = gapType.toLowerCase();
                        const gapKey = streamKey + '-gap-' + gapIdx;
                        html += `
                            <div class="gap-section">
                                <div class="gap-header" onclick="RecommendationsModule.toggleGap('${gapKey}')" style="cursor:pointer;">
                                    <div class="gap-info">
                                        <span class="gap-indicator ${gapClass}"></span>
                                        <span class="gap-title">${gapType}</span>
                                        <span class="gap-badge">(Priority ${gapData.priority})</span>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span>${gapData.solutions.length} solution${gapData.solutions.length !== 1 ? 's' : ''}</span>
                                        <button type="button" class="gap-toggle-btn" id="gap-icon-${gapKey}" aria-label="Collapse ${gapType}" title="Collapse" onclick="event.stopPropagation(); RecommendationsModule.toggleGap('${gapKey}')">
                                            <i class="bi bi-dash-lg"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="gap-solutions-list" id="gap-body-${gapKey}">
                        `;

                        gapData.solutions.forEach(solution => {
                            html += renderSolutionCard(solution);
                        });

                        html += `
                                </div>
                            </div>
                        `;
                    });

                    html += `</div></div>`;
                });

                container.innerHTML = html;
            }

            // Render individual solution card
            function renderSolutionCard(solution) {
                const fullSolution = getCompleteSolution(solution.solutionId);
                if (!fullSolution) return '';

                const timelineClass = solution.timeline === '<1 year' ? 'quick' :
                                      solution.timeline === '1-3 years' ? 'medium' : 'long';

                // Get overview text — new format uses whatThisOptionDoes or whyThisMatters, old uses whatThisSolves
                const ov = fullSolution.overview || {};
                const fd = fullSolution.fullDetails || {};
                const overviewText = ov.whatThisOptionDoes || ov.whatThisSolves || fd.whyThisMatters || '';

                // v2 brief §8.3 — Timeline + Feasibility get prominent badges at the
                // top of every card. Feasibility derives from politicalFeasibility
                // (higher/moderate/lower); fall back to politicalSensitivity if the
                // newer field isn't set in the underlying solution data.
                const feasRaw = String(fullSolution.politicalFeasibility || fullSolution.politicalSensitivity || '').toLowerCase();
                let feasClass = 'moderate';
                let feasLabel = fullSolution.politicalFeasibility || fullSolution.politicalSensitivity || '—';
                if (feasRaw.indexOf('higher') >= 0 || feasRaw.indexOf('high') >= 0) {
                    feasClass = 'higher';
                } else if (feasRaw.indexOf('lower') >= 0 || feasRaw.indexOf('sensitive') >= 0 || feasRaw.indexOf('low') >= 0) {
                    feasClass = 'sensitive';
                }
                const diffBadge = fullSolution.deliveryDifficulty
                    ? '<span class="rec-badge rec-badge--difficulty" title="Delivery difficulty"><span class="rec-badge-label">Effort</span>' + escapeForTemplate(fullSolution.deliveryDifficulty) + '</span>'
                    : '';

                const fullIdLabel = buildFullIdLabel(solution.solutionId, fullSolution);

                return `
                    <div class="solution-card" data-solution-id="${solution.solutionId}"
                         data-timeline="${escapeForTemplate(solution.timeline || '')}"
                         data-political="${escapeForTemplate(fullSolution.politicalFeasibility || '')}"
                         data-gap="${escapeForTemplate(String(solution.gapType || '').toLowerCase())}">
                        <div class="solution-card-header" onclick="RecommendationsModule.toggleSolution('${solution.solutionId}')">
                            <div class="solution-title-section">
                                <div class="solution-id">${escapeForTemplate(fullIdLabel)}</div>
                                <div class="solution-title">${fullSolution.title}</div>
                                <div class="solution-meta">
                                    <span class="rec-badge rec-badge--timeline timeline-${timelineClass}">
                                        <span class="rec-badge-label">Timeline</span>${escapeForTemplate(solution.timeline || '—')}
                                    </span>
                                    <span class="rec-badge rec-badge--feasibility feasibility-${feasClass}">
                                        <span class="rec-badge-label">Feasibility</span>${escapeForTemplate(feasLabel)}
                                    </span>
                                    <span class="rec-badge rec-badge--stream">
                                        <span class="rec-badge-label">Stream</span>${escapeForTemplate(solution.streamName || '—')}
                                    </span>
                                    <span class="rec-badge rec-badge--gap">
                                        <span class="rec-badge-label">Gap</span>${escapeForTemplate(solution.gapType || '—')}
                                    </span>
                                    ${diffBadge}
                                </div>
                            </div>
                            <button type="button" class="solution-expand-btn" id="expand-btn-${solution.solutionId}">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <div class="solution-overview">
                            ${escapeForTemplate(overviewText)}
                        </div>
                        <div class="solution-details" id="details-${solution.solutionId}">
                            ${renderDetailSections(fullSolution)}
                        </div>
                        <div class="solution-actions">
                            <button type="button" class="btn btn-sm btn-outline-info" id="toggle-btn-${solution.solutionId}" onclick="RecommendationsModule.toggleSolution('${solution.solutionId}')">
                                <i class="fas fa-chevron-down me-1"></i> <span class="toggle-label">Expand Details</span>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="RecommendationsModule.copyToClipboard('${solution.solutionId}')">
                                <i class="fas fa-clipboard me-1"></i> Copy
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="RecommendationsModule.printSolution('${solution.solutionId}')">
                                <i class="fas fa-print me-1"></i> Print
                            </button>
                        </div>
                    </div>
                `;
            }

            // Build the expanded ID label shown on the card header, e.g.
            // "PT-COM-01" -> "Property Tax – Compliance – 01"
            // "A1"        -> "Non-Property A – Coverage – 1"
            function buildFullIdLabel(solutionId, fullSolution) {
                if (!fullSolution) return solutionId || '';
                const stream = fullSolution.stream || '';
                const gap = fullSolution.gap || '';
                const subgroup = fullSolution.subgroup || '';
                const numMatch = String(solutionId || '').match(/(\d+)\s*$/);
                const number = numMatch ? numMatch[1] : solutionId;
                const streamLabel = subgroup ? `${stream} ${subgroup}` : stream;
                const parts = [streamLabel, gap, number].filter(Boolean);
                return parts.length ? parts.join(' – ') : (solutionId || '');
            }

            // Helper function to escape content for safe embedding in template literals
            function escapeForTemplate(str) {
                if (!str) return '';
                return String(str)
                    .replace(/\\/g, '\\\\')
                    .replace(/`/g, '\\`')
                    .replace(/\${/g, '\\${');
            }

            // Replace inline card references like "PT-COM-02 (Bill delivery)" or bare "PT-COM-02"
            // with the full solution title, so non-expert readers see plain language.
            function expandCardRefs(text) {
                if (!text) return text;
                // Pattern: stream code + optional parenthetical short name. Matches PT-COM-02, PT-VAL-10, NP-A-01, A6, B12, etc.
                const pattern = /\b([A-Z]{2,3}(?:-[A-Z]{1,4})?-\d{1,3}|[A-Z]\d{1,2})(?:\s*\(([^)]*)\))?/g;
                return String(text).replace(pattern, (match, code) => {
                    const sol = typeof SolutionsDatabase !== 'undefined' ? SolutionsDatabase.getSolutionById(code) : null;
                    if (sol && sol.title) return sol.title;
                    return match; // Unknown code — leave untouched.
                });
            }

            // Helper: render list or string content for detail sections
            function renderListOrText(val) {
                if (!val) return '';
                if (Array.isArray(val)) return '<ul>' + val.map(item => '<li>' + escapeForTemplate(expandCardRefs(item)) + '</li>').join('') + '</ul>';
                return '<p>' + escapeForTemplate(expandCardRefs(val)).replace(/\n/g, '<br>') + '</p>';
            }

            // Render detail sections for a solution (supports old and new card formats)
            function renderDetailSections(solution) {
                let html = '';
                const fd = solution.fullDetails || {};
                const ov = solution.overview || {};

                // New format: Why This Card Matters
                const whyMatters = fd.whyThisMatters;
                if (whyMatters) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-lightbulb"></i> Why This Card Matters</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(whyMatters) + '</div></div>';
                }

                // New format: When This Is a Strong Fit (NP schema uses goodFitWhen)
                const whenFit = fd.whenStrongFit || fd.goodFitWhen;
                if (whenFit && whenFit.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-check-circle"></i> When This Is a Strong Fit</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(whenFit) + '</div></div>';
                }

                // NP schema: When This May Not Be the Right First Move
                const lessSuitable = fd.lessSuitableWhen;
                if (lessSuitable && lessSuitable.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-exclamation-circle"></i> When This May Not Be the Right First Move</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(lessSuitable) + '</div></div>';
                }

                // New format: What to Line Up First
                const lineUp = fd.whatToLineUpFirst;
                if (lineUp && lineUp.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-list-check"></i> What to Line Up First</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(lineUp) + '</div></div>';
                }

                // New format: Design Choices to Settle Early
                const design = fd.designChoices;
                if (design && design.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-gear"></i> Design Choices to Settle Early</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(design) + '</div></div>';
                }

                // Practical Implementation Path — PT uses phased object, NP uses flat implementationPath array
                const path = fd.practicalPath;
                const implPath = fd.implementationPath;
                if (path) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-signpost-split"></i> Practical Implementation Path</span></div>';
                    html += '<div class="detail-section-content">';
                    if (path.first90Days && path.first90Days.length > 0) {
                        html += '<strong>First 90 days</strong>' + renderListOrText(path.first90Days);
                    }
                    if (path.sixTo12Months && path.sixTo12Months.length > 0) {
                        html += '<strong>6 to 12 months</strong>' + renderListOrText(path.sixTo12Months);
                    }
                    if (path.twelveToTwentyFourMonths && path.twelveToTwentyFourMonths.length > 0) {
                        html += '<strong>12 to 24 months and beyond</strong>' + renderListOrText(path.twelveToTwentyFourMonths);
                    }
                    html += '</div></div>';
                } else if (implPath && implPath.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-signpost-split"></i> Practical Implementation Path</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(implPath) + '</div></div>';
                }

                // New format: Legal and Institutional Points (NP uses legalInstitutionalEnablers)
                const legal = fd.legalInstitutional || fd.legalInstitutionalEnablers || solution.legalEssentials;
                if (legal && legal.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-building"></i> Legal and Institutional Points</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(legal) + '</div></div>';
                }

                // New format: Capacity, Systems, and Partnership Needs (NP uses administrativeSetup)
                const capacity = fd.capacitySystemsPartnerships || fd.administrativeSetup || solution.administrativeEssentials;
                if (capacity && capacity.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-people"></i> Capacity, Systems, and Partnership Needs</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(capacity) + '</div></div>';
                }

                // New format: Main Risks and Practical Safeguards (NP uses risksAndDesignNotes)
                const risks = fd.risksAndSafeguards || fd.risksAndDesignNotes || solution.whenNotApplicable;
                if (risks && risks.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-exclamation-triangle"></i> Main Risks and Practical Safeguards</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(risks) + '</div></div>';
                }

                // NP schema: Political Note (lives on overview, not fullDetails)
                if (ov.politicalNote) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-flag"></i> Political Note</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(ov.politicalNote) + '</div></div>';
                }

                // New format: What to Monitor
                const monitor = fd.whatToMonitor;
                if (monitor && monitor.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-graph-up"></i> What to Monitor</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(monitor) + '</div></div>';
                }

                // New format: How This Card Connects to Other Cards (NP stores on overview.oftenWorksBestAlongside)
                const connections = fd.connectionsToOtherCards || ov.oftenWorksBestAlongside;
                if (connections && connections.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-diagram-3"></i> How This Connects to Other Cards</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(connections) + '</div></div>';
                }

                // New format: Questions to Settle Before Launch
                const questions = fd.questionsBeforeLaunch;
                if (questions && questions.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-question-circle"></i> Questions to Settle Before Launch</span></div>';
                    html += '<div class="detail-section-content">' + renderListOrText(questions) + '</div></div>';
                }

                // Legacy fallback: How It Works (old format)
                if (!whyMatters && solution.howItWorks) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-gear"></i> How It Works</span></div>';
                    html += '<div class="detail-section-content"><p>' + escapeForTemplate(solution.howItWorks).replace(/\n/g, '<br>') + '</p></div>';
                    html += '</div>';
                }

                // Legacy fallback: Implementation Milestones (old format)
                if (!path && solution.implementationMilestones && solution.implementationMilestones.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-list-task"></i> Implementation Milestones</span></div>';
                    html += '<div class="detail-section-content">';
                    html += solution.implementationMilestones.map((item, index) => '<div class="milestone-item"><span class="milestone-number">' + (index + 1) + '</span><span class="milestone-text">' + escapeForTemplate(item) + '</span></div>').join('');
                    html += '</div></div>';
                }

                // Legacy fallback: Case Notes (old format)
                if (solution.caseNotes) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="bi bi-book"></i> Case Notes</span></div>';
                    html += '<div class="detail-section-content"><div class="case-notes">' + escapeForTemplate(solution.caseNotes) + '</div></div>';
                    html += '</div>';
                }

                return html;
            }

            // Get complete solution with full details
            function getCompleteSolution(solutionId) {
                if (typeof SolutionsFullDatabase !== 'undefined') {
                    return SolutionsFullDatabase.getCompleteSolution(solutionId);
                } else if (typeof SolutionsDatabase !== 'undefined') {
                    return SolutionsDatabase.getSolutionById(solutionId);
                }
                return null;
            }

            // Toggle solution details
            function toggleSolution(solutionId) {
                const details = document.getElementById(`details-${solutionId}`);
                if (!details) {
                    console.warn('toggleSolution: details element not found for', solutionId);
                    return;
                }
                const btn = document.getElementById(`expand-btn-${solutionId}`);
                const toggleBtn = document.getElementById(`toggle-btn-${solutionId}`);

                const willExpand = !details.classList.contains('expanded');
                details.classList.toggle('expanded', willExpand);
                // Force the computed display via inline style as well, in case a stylesheet override hides it.
                details.style.display = willExpand ? 'block' : 'none';
                if (btn) btn.classList.toggle('expanded', willExpand);

                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('i');
                    const label = toggleBtn.querySelector('.toggle-label');
                    if (icon) icon.className = willExpand ? 'fas fa-chevron-up me-1' : 'fas fa-chevron-down me-1';
                    if (label) label.textContent = willExpand ? 'Collapse' : 'Expand Details';
                }

                if (willExpand) {
                    // Bring the newly-revealed content into view so the user sees it expand.
                    requestAnimationFrame(() => {
                        details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    });
                }
            }

            // Toggle stream section (Property Tax / Business License / etc.)
            function toggleStream(streamKey) {
                const body = document.getElementById('stream-body-' + streamKey);
                const btn = document.getElementById('stream-icon-' + streamKey);
                if (!body) return;
                const willExpand = body.style.display === 'none';
                body.style.display = willExpand ? '' : 'none';
                if (btn) {
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = willExpand ? 'bi bi-dash-lg' : 'bi bi-plus-lg';
                    btn.setAttribute('title', willExpand ? 'Collapse' : 'Expand');
                    btn.setAttribute('aria-label', willExpand ? 'Collapse' : 'Expand');
                }
            }

            // Toggle gap section (Compliance / Coverage / Valuation)
            function toggleGap(gapKey) {
                const body = document.getElementById('gap-body-' + gapKey);
                const btn = document.getElementById('gap-icon-' + gapKey);
                if (!body) return;
                const willExpand = body.style.display === 'none';
                body.style.display = willExpand ? '' : 'none';
                if (btn) {
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = willExpand ? 'bi bi-dash-lg' : 'bi bi-plus-lg';
                    btn.setAttribute('title', willExpand ? 'Collapse' : 'Expand');
                    btn.setAttribute('aria-label', willExpand ? 'Collapse' : 'Expand');
                }
            }

            // Switch between views
            function switchView(viewName) {
                // Update buttons
                document.querySelectorAll('.view-toggle .view-toggle-btn').forEach(btn => {
                    const isActive = btn.dataset.view === viewName;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });

                // Update panels
                document.querySelectorAll('.view-panel').forEach(panel => {
                    panel.style.display = 'none';
                });

                const activePanel = document.getElementById(viewName + 'View');
                if (activePanel) {
                    activePanel.style.display = 'block';

                    // Render content for the view
                    if (viewName === 'timeline') {
                        renderTimelineView();
                    } else if (viewName === 'progress') {
                        renderProgressView();
                    }
                }
            }

            // Render timeline view
            function renderTimelineView() {
                const container = document.getElementById('timelineContent');

                const visible = getFilteredSolutions();
                const quickWins = visible.filter(s => s.timeline === '<1 year');
                const mediumTerm = visible.filter(s => s.timeline === '1-3 years');
                const longTerm = visible.filter(s => s.timeline === '3+ years');

                let html = '';

                if (quickWins.length > 0) {
                    html += renderTimelineSection('Quick Wins', 'Less than 1 year', 'quick', quickWins);
                }
                if (mediumTerm.length > 0) {
                    html += renderTimelineSection('Medium Term', '1-3 years', 'medium', mediumTerm);
                }
                if (longTerm.length > 0) {
                    html += renderTimelineSection('Long Term', '3+ years', 'long', longTerm);
                }

                if (html === '') {
                    html = '<div class="empty-state"><p>No solutions selected</p></div>';
                }

                container.innerHTML = html;
            }

            // Render timeline section
            function renderTimelineSection(title, subtitle, className, solutions) {
                return `
                    <div class="timeline-section">
                        <div class="timeline-section-header ${className}">
                            <div class="timeline-section-icon ${className}">
                                <i class="fas fa-${className === 'quick' ? 'bolt' : className === 'medium' ? 'calendar-alt' : 'clock'}"></i>
                            </div>
                            <div>
                                <div class="timeline-section-title">${title}</div>
                                <div style="font-size: 0.85rem; color: #6c757d;">${subtitle} - ${solutions.length} solution${solutions.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        <div class="timeline-items">
                            ${solutions.map(s => {
                                const fs = getCompleteSolution(s.solutionId);
                                const idLabel = buildFullIdLabel(s.solutionId, fs);
                                return `
                                <div class="timeline-item ${className}">
                                    <span class="timeline-item-id">${escapeForTemplate(idLabel)}</span>
                                    <span class="timeline-item-title">${s.title || (fs && fs.title) || 'Unknown'}</span>
                                    <span class="timeline-item-stream">${s.streamName}</span>
                                </div>
                            `;}).join('')}
                        </div>
                    </div>
                `;
            }

            // Extract milestones from a solution (handles old and new card formats)
            // Returns array of { label: string, phase: string|null, items: string[] }
            function extractMilestoneGroups(fullSolution) {
                const fd = fullSolution?.fullDetails || {};
                const groups = [];

                // Coerce a value that may be an array, string, or nullish into a string[]
                const toItems = (v) => {
                    if (!v) return [];
                    if (Array.isArray(v)) return v.filter(x => x != null && String(x).trim().length > 0).map(String);
                    // Split a long string on newlines first, then fall back to sentences; keep it as one item if neither splits well.
                    const s = String(v).trim();
                    if (!s) return [];
                    const byLines = s.split(/\r?\n+/).map(x => x.trim()).filter(Boolean);
                    if (byLines.length > 1) return byLines;
                    const bySentences = s.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
                    return bySentences.length > 1 ? bySentences : [s];
                };

                // New PT format: practicalPath with 3 phases
                if (fd.practicalPath) {
                    const path = fd.practicalPath;
                    const p1 = toItems(path.first90Days);
                    const p2 = toItems(path.sixTo12Months);
                    const p3 = toItems(path.twelveToTwentyFourMonths);
                    if (p1.length) groups.push({ phase: 'First 90 days', items: p1 });
                    if (p2.length) groups.push({ phase: '6 to 12 months', items: p2 });
                    if (p3.length) groups.push({ phase: '12 to 24 months+', items: p3 });
                }

                // NP format: implementationPath or implementationMilestones (flat arrays in fullDetails)
                if (groups.length === 0) {
                    const implPath = toItems(fd.implementationPath);
                    if (implPath.length) groups.push({ phase: null, items: implPath });
                }
                if (groups.length === 0) {
                    const implMs = toItems(fd.implementationMilestones);
                    if (implMs.length) groups.push({ phase: null, items: implMs });
                }

                // Legacy format: implementationMilestones directly on the solution object
                if (groups.length === 0) {
                    const legacyMs = toItems(fullSolution?.implementationMilestones);
                    if (legacyMs.length) groups.push({ phase: null, items: legacyMs });
                }

                return groups;
            }

            // Flatten milestone groups into a single indexed list for progress tracking
            function flattenMilestones(groups) {
                const flat = [];
                groups.forEach(g => {
                    g.items.forEach(item => {
                        flat.push({ text: item, phase: g.phase });
                    });
                });
                return flat;
            }

            // Render progress view
            function renderProgressView() {
                const container = document.getElementById('progressContent');

                if (selectedSolutions.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No solutions selected</p></div>';
                    return;
                }

                const visibleSolutions = getFilteredSolutions();
                if (visibleSolutions.length === 0) {
                    container.innerHTML = `<div class="empty-state"><p>No solutions match the current filter. <a href="#" onclick="event.preventDefault(); RecommendationsModule.filterByTimeline('all');">Clear filter</a>.</p></div>`;
                    return;
                }

                let html = '';

                visibleSolutions.forEach(solution => {
                    const fullSolution = getCompleteSolution(solution.solutionId);
                    const milestoneGroups = extractMilestoneGroups(fullSolution);
                    const flatMilestones = flattenMilestones(milestoneGroups);
                    const solutionProgress = progressData[solution.solutionId] || {};

                    const completedCount = Object.values(solutionProgress).filter(v => v === 'completed').length;
                    const totalCount = flatMilestones.length;
                    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                    // Determine progress bar color based on percentage
                    const barColor = percentage === 100 ? '#28a745' : percentage >= 50 ? '#007bff' : '#ffc107';

                    const titleText = fullSolution?.title || 'Unknown';
                    const contextParts = [solution.streamName, solution.gapType].filter(Boolean);
                    const contextText = contextParts.length ? ' — ' + contextParts.join(' · ') : '';

                    html += `
                        <div class="progress-solution">
                            <div class="progress-solution-header">
                                <span class="progress-solution-title">${escapeForTemplate(titleText)}${escapeForTemplate(contextText)}</span>
                                <span class="progress-percentage">${percentage}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${barColor}"></div>
                            </div>
                            <div class="progress-milestones">
                    `;

                    // Render milestones with phase headers
                    let milestoneIndex = 0;
                    milestoneGroups.forEach(group => {
                        // Show phase header if phased (practicalPath)
                        if (group.phase) {
                            const phaseIcon = group.phase.includes('90') ? 'bi-lightning' :
                                              group.phase.includes('6 to') ? 'bi-calendar-event' : 'bi-calendar-range';
                            html += `
                                <div class="progress-phase-header" style="margin-top: 0.75rem; margin-bottom: 0.25rem; padding: 0.35rem 0.5rem; background: #f0f4f8; border-radius: 4px; font-weight: 600; font-size: 0.8rem; color: #495057;">
                                    <i class="bi ${phaseIcon} me-1"></i>${group.phase}
                                </div>
                            `;
                        }

                        group.items.forEach(milestoneText => {
                            const idx = milestoneIndex;
                            const status = solutionProgress[idx] || 'not-started';
                            html += `
                                <div class="progress-milestone ${status === 'completed' ? 'completed' : ''}">
                                    <div class="progress-milestone-check ${status === 'completed' ? 'completed' : ''}"
                                         onclick="RecommendationsModule.toggleMilestone('${solution.solutionId}', ${idx})">
                                        ${status === 'completed' ? '<i class="fas fa-check"></i>' : ''}
                                    </div>
                                    <span class="progress-milestone-text">${escapeForTemplate(milestoneText)}</span>
                                    <select class="progress-milestone-status ${status}"
                                            onchange="RecommendationsModule.updateMilestoneStatus('${solution.solutionId}', ${idx}, this.value)">
                                        <option value="not-started" ${status === 'not-started' ? 'selected' : ''}>Not Started</option>
                                        <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                                        <option value="blocked" ${status === 'blocked' ? 'selected' : ''}>Blocked</option>
                                    </select>
                                </div>
                            `;
                            milestoneIndex++;
                        });
                    });

                    if (flatMilestones.length === 0) {
                        html += '<p class="text-muted small ms-3">No implementation milestones defined for this card.</p>';
                    }

                    html += `
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = html;
            }

            // Toggle milestone completion
            function toggleMilestone(solutionId, milestoneIndex) {
                if (!progressData[solutionId]) {
                    progressData[solutionId] = {};
                }

                const currentStatus = progressData[solutionId][milestoneIndex] || 'not-started';
                progressData[solutionId][milestoneIndex] = currentStatus === 'completed' ? 'not-started' : 'completed';

                saveProgressData();
                renderProgressView();
            }

            // Update milestone status
            function updateMilestoneStatus(solutionId, milestoneIndex, status) {
                if (!progressData[solutionId]) {
                    progressData[solutionId] = {};
                }
                progressData[solutionId][milestoneIndex] = status;
                saveProgressData();
                renderProgressView();
            }

            // Reset all progress
            function resetAllProgress() {
                if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                    progressData = {};
                    saveProgressData();
                    renderProgressView();
                }
            }

            // Build flat rows (one per milestone) used by CSV/Excel exports
            function buildProgressExportRows() {
                const rows = [];
                selectedSolutions.forEach(s => {
                    const fullSolution = getCompleteSolution(s.solutionId);
                    const milestoneGroups = extractMilestoneGroups(fullSolution);
                    const flatMilestones = flattenMilestones(milestoneGroups);
                    const solProgress = progressData[s.solutionId] || {};
                    const fullIdLabel = buildFullIdLabel(s.solutionId, fullSolution);
                    const title = (fullSolution && fullSolution.title) || s.title || '';

                    if (flatMilestones.length === 0) {
                        rows.push({
                            fullName: fullIdLabel,
                            shortId: s.solutionId,
                            title: title,
                            stream: (fullSolution && fullSolution.stream) || s.streamName || '',
                            gap: (fullSolution && fullSolution.gap) || s.gapType || '',
                            timeline: s.timeline || (fullSolution && fullSolution.timeline) || '',
                            phase: '',
                            milestone: '',
                            status: ''
                        });
                        return;
                    }

                    flatMilestones.forEach((m, idx) => {
                        rows.push({
                            fullName: fullIdLabel,
                            shortId: s.solutionId,
                            title: title,
                            stream: (fullSolution && fullSolution.stream) || s.streamName || '',
                            gap: (fullSolution && fullSolution.gap) || s.gapType || '',
                            timeline: s.timeline || (fullSolution && fullSolution.timeline) || '',
                            phase: m.phase || '',
                            milestone: m.text || '',
                            status: solProgress[idx] || 'not-started'
                        });
                    });
                });
                return rows;
            }

            function csvEscape(val) {
                const s = val == null ? '' : String(val);
                if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
                return s;
            }

            function triggerDownload(blob, filename) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            // Route a download through the server so the browser receives a real
            // Content-Disposition: attachment response. This bypasses the JS-blob
            // download path that some browsers / extensions silently block.
            //
            // Submits a hidden POST form targeted at a hidden iframe so the current
            // page doesn't navigate. The server (RosraController.DownloadAttachment)
            // echoes the bytes back as an attachment with the requested filename.
            function downloadViaServer(content, filename, contentType, encoding) {
                const FRAME_ID = 'rosraServerDownloadFrame';
                let iframe = document.getElementById(FRAME_ID);
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = FRAME_ID;
                    iframe.name = FRAME_ID;
                    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px;';
                    document.body.appendChild(iframe);
                }

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/Rosra/DownloadAttachment';
                form.target = FRAME_ID;
                form.enctype = 'application/x-www-form-urlencoded';
                form.style.display = 'none';

                const fields = {
                    content: content,
                    filename: filename,
                    contentType: contentType || 'application/octet-stream',
                    encoding: encoding || 'utf8'
                };
                // DownloadAttachment is now [Authorize] + [ValidateAntiForgeryToken] (audit F-21).
                const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
                if (tokenInput && tokenInput.value) {
                    fields['__RequestVerificationToken'] = tokenInput.value;
                }
                for (const k in fields) {
                    const i = document.createElement('input');
                    i.type = 'hidden';
                    i.name = k;
                    i.value = fields[k];
                    form.appendChild(i);
                }

                document.body.appendChild(form);
                form.submit();
                // Leave the form attached briefly; cleanup after the response is committed
                setTimeout(() => { try { form.remove(); } catch (_) {} }, 30000);
            }

            // Convert a Blob to a base64 string (without the `data:...;base64,` prefix)
            function blobToBase64(blob) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = String(reader.result || '');
                        const idx = result.indexOf(',');
                        resolve(idx >= 0 ? result.slice(idx + 1) : result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            // Export progress in the requested format ('csv' | 'excel')
            function exportProgress(format) {
                const fmt = (format || 'csv').toLowerCase();
                const rows = buildProgressExportRows();
                const headers = ['Full Name', 'Short ID', 'Title', 'Stream', 'Gap', 'Timeline', 'Phase', 'Milestone', 'Status'];
                const dateStamp = new Date().toISOString().slice(0, 10);

                if (fmt === 'excel' || fmt === 'xls' || fmt === 'xlsx') {
                    const esc = (s) => String(s == null ? '' : s)
                        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    let html = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">'
                             + '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml>'
                             + '<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
                             + '<x:Name>Progress</x:Name><x:WorksheetOptions><x:DisplayGridlines/>'
                             + '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>'
                             + '</xml><![endif]--></head><body><table border="1">';
                    html += '<tr>' + headers.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr>';
                    rows.forEach(r => {
                        html += '<tr>'
                             + '<td>' + esc(r.fullName) + '</td>'
                             + '<td>' + esc(r.shortId) + '</td>'
                             + '<td>' + esc(r.title) + '</td>'
                             + '<td>' + esc(r.stream) + '</td>'
                             + '<td>' + esc(r.gap) + '</td>'
                             + '<td>' + esc(r.timeline) + '</td>'
                             + '<td>' + esc(r.phase) + '</td>'
                             + '<td>' + esc(r.milestone) + '</td>'
                             + '<td>' + esc(r.status) + '</td>'
                             + '</tr>';
                    });
                    html += '</table></body></html>';
                    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
                    triggerDownload(blob, `rosra-implementation-progress-${dateStamp}.xls`);
                    return;
                }

                // CSV (default)
                const lines = [headers.join(',')];
                rows.forEach(r => {
                    lines.push([
                        csvEscape(r.fullName),
                        csvEscape(r.shortId),
                        csvEscape(r.title),
                        csvEscape(r.stream),
                        csvEscape(r.gap),
                        csvEscape(r.timeline),
                        csvEscape(r.phase),
                        csvEscape(r.milestone),
                        csvEscape(r.status)
                    ].join(','));
                });
                const csv = '\ufeff' + lines.join('\r\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                triggerDownload(blob, `rosra-implementation-progress-${dateStamp}.csv`);
            }

            // Go to Overview Selection
            function goToOverviewSelection() {
                window.location.href = '/Rosra?activeTab=overview-selection';
            }

            // Open report modal
            function openReportModal() {
                const modal = new bootstrap.Modal(document.getElementById('reportModal'));
                modal.show();
            }

            // Wait for the WoFi estimator result to populate window.__RosraWofiResult.
            // The "Current revenue + estimated gap = potential" chart lives in the
            // top-down tab — when the user generates the report from another tab,
            // its hidden canvas can't be captured via toBase64Image, so the report
            // builder's SVG fallback depends on the raw numbers in __RosraWofiResult.
            // This helper ensures those numbers are available before HTML is built.
            function ensureWofiResult(timeoutMs) {
                return new Promise(function (resolve) {
                    var deadline = Date.now() + (timeoutMs || 5000);
                    var have = function () {
                        var r = window.__RosraWofiResult;
                        return r && typeof r.potentialOsr === 'number' && r.potentialOsr > 0;
                    };
                    if (have()) return resolve();
                    // Kick off the estimator if it hasn't been run/finished yet.
                    if (typeof window.RosraWofiRunEstimator === 'function') {
                        try { window.RosraWofiRunEstimator(); } catch (_) {}
                    }
                    (function poll() {
                        if (have()) return resolve();
                        if (Date.now() >= deadline) return resolve();
                        setTimeout(poll, 100);
                    })();
                });
            }

            // Generate report
            async function generateReport() {
                console.log('[Report] generateReport() called');
                const modalEl = document.getElementById('reportModal');
                const genBtn = modalEl ? modalEl.querySelector('.modal-footer .btn-primary') : null;
                const originalBtnHtml = genBtn ? genBtn.innerHTML : null;
                if (genBtn) {
                    genBtn.disabled = true;
                    genBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating…';
                }

                try {
                    const format = document.getElementById('reportFormat').value;
                    console.log('[Report] format=', format);

                    const checked = (id, dflt) => {
                        const el = document.getElementById(id);
                        return el ? el.checked : dflt;
                    };
                    const options = {
                        includeExecSummary: checked('includeExecSummary', true),
                        includeGapAnalysis: checked('includeGapAnalysis', false),
                        includeStreamPrioritization: checked('includeStreamPrioritization', false),
                        includeGapSequencing: checked('includeGapSequencing', false),
                        includeSelectedSolutions: checked('includeSelectedSolutions', true),
                        includeSkippedSolutions: checked('includeSkippedSolutions', false),
                        includeTimeline: checked('includeTimeline', true),
                        includeProgressTracker: checked('includeProgressTracker', true),
                        includeResources: checked('includeResources', false)
                    };
                    console.log('[Report] options=', options);

                    // Block until WoFi numbers are available (or timeout) so the
                    // "Current revenue + estimated gap = potential" chart is
                    // rendered into the export instead of being silently skipped.
                    if (options.includeExecSummary) {
                        await ensureWofiResult(5000);
                        console.log('[Report] WoFi result ready=', !!window.__RosraWofiResult);
                    }

                    const html = buildReportHtml(options);
                    console.log('[Report] html built, length=', html.length);

                    const closeModal = () => {
                        if (genBtn) {
                            genBtn.disabled = false;
                            if (originalBtnHtml !== null) genBtn.innerHTML = originalBtnHtml;
                        }
                        const inst = modalEl && window.bootstrap ? bootstrap.Modal.getInstance(modalEl) : null;
                        if (inst) { try { inst.hide(); } catch (_) {} }
                    };

                    console.log('[Report] dispatching format=', format);
                    if (format === 'html') {
                        downloadReportHtml(html);
                        setTimeout(closeModal, 400);
                    } else if (format === 'pdf') {
                        downloadReportPdf(html, closeModal);
                    } else {
                        printReportHtml(html);
                        setTimeout(closeModal, 400);
                    }
                } catch (err) {
                    console.error('[Report] generateReport failed', err);
                    alert('Report generation failed: ' + (err && err.message ? err.message : err));
                    if (genBtn) {
                        genBtn.disabled = false;
                        if (originalBtnHtml !== null) genBtn.innerHTML = originalBtnHtml;
                    }
                }
            }

            // Download the report as a standalone .html file via the server,
            // so browsers honor the Content-Disposition: attachment response.
            function downloadReportHtml(html) {
                downloadViaServer(html, _brandedReportFilename('html'), 'text/html; charset=utf-8', 'utf8');
            }

            // Build a branded report filename from the Local Government Profile fields.
            // Format: ROSRA_Revenue-Action-Plan_<City>_<Country>_<YYYY-MM-DD>.<ext>
            // Falls back gracefully if the user hasn't filled in those fields.
            function _brandedReportFilename(ext) {
                const get = id => {
                    const el = document.getElementById(id);
                    return el && el.value && el.value.trim() ? el.value.trim() : '';
                };
                const slug = s => (s || '')
                    .replace(/[^a-zA-Z0-9\s-]/g, '')   // strip punctuation
                    .replace(/\s+/g, '-')              // spaces → hyphens
                    .replace(/-+/g, '-')               // collapse repeats
                    .replace(/^-|-$/g, '')             // trim leading/trailing hyphens
                    .substring(0, 30);                 // cap each segment

                const dateStamp    = new Date().toISOString().slice(0, 10);
                const cityOrRegion = slug(get('city') || get('region'));
                const country      = slug(get('country'));

                const parts = ['ROSRA', 'Revenue-Action-Plan'];
                if (cityOrRegion) parts.push(cityOrRegion);
                if (country)      parts.push(country);
                parts.push(dateStamp);
                return parts.join('_') + '.' + (ext || 'pdf');
            }

            // ----- Centered intro popup + bottom-right progress toast -----
            // UX: clicking "Generate Report" first shows a centered popup so the
            // user is sure their click registered. After ~3 s the popup slides
            // out and a small progress card slides into the bottom-right corner
            // with an animated bar (fake-easing because the server doesn't stream
            // progress; jumps to 100% when the PDF blob actually arrives).
            function _ensureReportOverlayStyles() {
                if (document.getElementById('rosraReportLoadingStyles')) return;
                const s = document.createElement('style');
                s.id = 'rosraReportLoadingStyles';
                s.textContent = `
#rosraReportLoadingOverlay {
    position: fixed; inset: 0;
    background: rgba(15, 39, 66, 0.55);
    backdrop-filter: blur(2px);
    z-index: 20000;
    display: flex; align-items: center; justify-content: center;
    animation: rosra-fade-in 0.2s ease-out;
}
#rosraReportLoadingOverlay.is-hiding { animation: rosra-fade-out 0.3s ease-in forwards; }
#rosraReportLoadingOverlay .rosra-loading-card {
    background: #ffffff; border-radius: 14px;
    padding: 32px 40px; text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    max-width: 440px;
    font-family: 'Segoe UI', system-ui, sans-serif;
}
#rosraReportLoadingOverlay .rosra-loading-spinner {
    width: 48px; height: 48px; margin: 0 auto 18px;
    border: 4px solid #e0f2fe;
    border-top-color: #00B2E3;
    border-radius: 50%;
    animation: rosra-spin 0.8s linear infinite;
}
#rosraReportLoadingOverlay .rosra-loading-title {
    font-size: 1.15rem; font-weight: 700; color: #0f2742;
    margin-bottom: 6px;
}
#rosraReportLoadingOverlay .rosra-loading-sub {
    font-size: 0.88rem; color: #64748b; line-height: 1.5;
}

/* Bottom-right progress card — appears after the centred popup hides */
#rosraReportProgressToast {
    position: fixed; right: 24px; bottom: 24px;
    width: 340px;
    background: #ffffff;
    border-radius: 12px;
    padding: 14px 18px 16px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
    z-index: 19000;
    font-family: 'Segoe UI', system-ui, sans-serif;
    animation: rosra-slide-up 0.3s ease-out;
}
#rosraReportProgressToast.is-hiding { animation: rosra-slide-down 0.3s ease-in forwards; }
#rosraReportProgressToast .rosra-toast-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 10px;
}
#rosraReportProgressToast .rosra-toast-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid #e0f2fe;
    border-top-color: #00B2E3;
    border-radius: 50%;
    animation: rosra-spin 0.8s linear infinite;
    flex-shrink: 0;
}
#rosraReportProgressToast.is-done .rosra-toast-spinner {
    border-color: #10b981; border-top-color: #10b981;
    animation: none;
}
#rosraReportProgressToast .rosra-toast-title {
    font-weight: 700; color: #0f2742; font-size: 0.92rem;
    flex: 1; line-height: 1.2;
}
#rosraReportProgressToast .rosra-progress-pct {
    font-size: 0.82rem; font-weight: 600; color: #00689D;
    font-variant-numeric: tabular-nums; min-width: 36px; text-align: right;
}
#rosraReportProgressToast.is-done .rosra-progress-pct { color: #10b981; }
#rosraReportProgressToast .rosra-progress-track {
    background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;
}
#rosraReportProgressToast .rosra-progress-bar {
    height: 100%; width: 0%;
    background: #00B2E3;
    transition: width 0.4s ease-out;
    border-radius: 3px;
}
#rosraReportProgressToast.is-done .rosra-progress-bar {
    background: #10b981;
}
#rosraReportProgressToast .rosra-toast-sub {
    font-size: 0.78rem; color: #64748b;
    margin-top: 8px; line-height: 1.4;
}

@keyframes rosra-spin { to { transform: rotate(360deg); } }
@keyframes rosra-fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes rosra-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes rosra-slide-up   { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes rosra-slide-down { from { transform: translateY(0); opacity: 1; } to { transform: translateY(28px); opacity: 0; } }`;
                document.head.appendChild(s);
            }

            function _showReportOverlay(title, sub) {
                _ensureReportOverlayStyles();
                const existing = document.getElementById('rosraReportLoadingOverlay');
                if (existing) existing.remove();
                const el = document.createElement('div');
                el.id = 'rosraReportLoadingOverlay';
                el.setAttribute('role', 'alert');
                el.setAttribute('aria-live', 'assertive');
                el.innerHTML = `<div class="rosra-loading-card">
                    <div class="rosra-loading-spinner"></div>
                    <div class="rosra-loading-title">${title}</div>
                    <div class="rosra-loading-sub">${sub}</div>
                </div>`;
                document.body.appendChild(el);
                return el;
            }

            function _hideReportOverlay() {
                const el = document.getElementById('rosraReportLoadingOverlay');
                if (!el) return;
                el.classList.add('is-hiding');
                setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
            }

            // ---- Bottom-right progress toast ----
            let _progressInterval = null;
            let _progressPct = 0;

            function _showReportProgressToast(sub) {
                _ensureReportOverlayStyles();
                const existing = document.getElementById('rosraReportProgressToast');
                if (existing) existing.remove();
                const el = document.createElement('div');
                el.id = 'rosraReportProgressToast';
                el.setAttribute('role', 'status');
                el.setAttribute('aria-live', 'polite');
                el.innerHTML = `
                    <div class="rosra-toast-head">
                        <span class="rosra-toast-spinner"></span>
                        <span class="rosra-toast-title">Generating PDF report</span>
                        <span class="rosra-progress-pct">0%</span>
                    </div>
                    <div class="rosra-progress-track"><div class="rosra-progress-bar"></div></div>
                    <div class="rosra-toast-sub">${sub || 'Almost there…'}</div>`;
                document.body.appendChild(el);
                return el;
            }

            function _updateReportProgress(pct) {
                _progressPct = Math.max(0, Math.min(100, pct));
                const el = document.getElementById('rosraReportProgressToast');
                if (!el) return;
                const bar = el.querySelector('.rosra-progress-bar');
                const label = el.querySelector('.rosra-progress-pct');
                if (bar) bar.style.width = _progressPct + '%';
                if (label) label.textContent = Math.round(_progressPct) + '%';
            }

            function _startReportProgressAnimation() {
                _progressPct = 0;
                _updateReportProgress(0);
                // Fake-ease from 0 to 85% over ~30 s — slow start, faster middle,
                // taper off so we don't pin at 100% before the PDF is actually ready.
                _progressInterval = setInterval(() => {
                    let inc = 0;
                    if (_progressPct < 25)      inc = 1.6;
                    else if (_progressPct < 55) inc = 0.9;
                    else if (_progressPct < 75) inc = 0.45;
                    else if (_progressPct < 85) inc = 0.18;
                    else                        return;
                    _updateReportProgress(_progressPct + inc);
                }, 400);
            }

            function _completeReportProgress(title, sub) {
                if (_progressInterval) { clearInterval(_progressInterval); _progressInterval = null; }
                _updateReportProgress(100);
                const el = document.getElementById('rosraReportProgressToast');
                if (el) {
                    el.classList.add('is-done');
                    if (title) {
                        const t = el.querySelector('.rosra-toast-title');
                        if (t) t.textContent = title;
                    }
                    if (sub) {
                        const s = el.querySelector('.rosra-toast-sub');
                        if (s) s.textContent = sub;
                    }
                }
            }

            function _hideReportProgressToast() {
                if (_progressInterval) { clearInterval(_progressInterval); _progressInterval = null; }
                const el = document.getElementById('rosraReportProgressToast');
                if (!el) return;
                el.classList.add('is-hiding');
                setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
            }

            // POST the built HTML to the server (Playwright renders it to PDF),
            // wait for the PDF blob, trigger download. UX: centered popup for
            // ~3 s for click confirmation, then transitions to a bottom-right
            // progress card while the server renders.
            async function downloadReportPdf(html, onDone) {
                console.log('[Report] downloadReportPdf() start, html length=', html.length);
                const filename = _brandedReportFilename('pdf');
                const finish = () => { try { if (typeof onDone === 'function') onDone(); } catch (_) {} };

                // Close the Bootstrap modal first so the overlay/toast is unobstructed.
                finish();
                _showReportOverlay(
                    'Generating your PDF report…',
                    'Building cover, charts and tables. Progress will continue in the bottom-right corner.'
                );

                let fetchDone = false;
                let toastShown = false;

                // After 3 s, hand off from the centered popup to the corner toast
                // — but only if the fetch is still in flight. If the server was
                // fast and we already finished, skip the toast entirely.
                const handoffTimer = setTimeout(() => {
                    if (fetchDone) return;
                    _hideReportOverlay();
                    _showReportProgressToast('Rendering the report on the server. This usually takes 5–10 seconds.');
                    _startReportProgressAnimation();
                    toastShown = true;
                }, 3000);

                const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
                const fd = new FormData();
                if (tokenInput && tokenInput.value) {
                    fd.append('__RequestVerificationToken', tokenInput.value);
                }
                fd.append('html', html);
                fd.append('filename', filename);

                console.log('[Report] posting HTML to /Rosra/RenderReportPdf for Playwright render');
                try {
                    const res = await fetch('/Rosra/RenderReportPdf', {
                        method: 'POST',
                        body: fd,
                        credentials: 'same-origin'
                    });
                    if (!res.ok) {
                        const body = await res.text().catch(() => '');
                        throw new Error(`Server returned ${res.status} ${res.statusText}${body ? ' — ' + body.slice(0, 200) : ''}`);
                    }
                    const blob = await res.blob();
                    fetchDone = true;
                    clearTimeout(handoffTimer);

                    if (toastShown) {
                        _completeReportProgress('Report ready', 'Your download is starting…');
                    } else {
                        _hideReportOverlay();
                    }

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        try { URL.revokeObjectURL(url); } catch (_) {}
                        try { a.remove(); } catch (_) {}
                    }, 2000);

                    // Let the user see the 100% / "Report ready" state briefly
                    // before the toast disappears.
                    if (toastShown) {
                        setTimeout(_hideReportProgressToast, 1500);
                    }

                    console.log('[Report] PDF download triggered', { bytes: blob.size });
                } catch (err) {
                    fetchDone = true;
                    clearTimeout(handoffTimer);
                    console.error('[Report] PDF generation failed', err);
                    _hideReportOverlay();
                    _hideReportProgressToast();
                    alert('Failed to generate PDF report.\n\n' + (err && err.message ? err.message : err));
                }
            }

            // Print via a hidden iframe (no popup window, not blocked)
            function printReportHtml(html) {
                console.log('[Report] printReportHtml() creating iframe');
                const existing = document.getElementById('rosraReportPrintFrame');
                if (existing) existing.remove();

                const iframe = document.createElement('iframe');
                iframe.id = 'rosraReportPrintFrame';
                iframe.setAttribute('aria-hidden', 'true');
                iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;';
                document.body.appendChild(iframe);

                let printed = false;
                const doPrint = () => {
                    if (printed) return;
                    printed = true;
                    console.log('[Report] invoking iframe print');
                    try {
                        const win = iframe.contentWindow;
                        win.focus();
                        win.print();
                    } catch (err) {
                        console.error('[Report] Print failed', err);
                        alert('Unable to open the print dialog. Try the HTML download option instead.');
                    }
                };

                iframe.onload = doPrint;

                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doc.open();
                    doc.write(html);
                    doc.close();
                } catch (err) {
                    console.error('[Report] iframe write failed', err);
                    alert('Could not prepare print document: ' + (err.message || err));
                    return;
                }

                // Fallback: some browsers don't fire load after document.write
                setTimeout(doPrint, 700);
            }

            // ---- Report builder helpers ----
            function esc(v) {
                if (v == null) return '';
                return String(v)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            }

            function renderReportList(val) {
                if (!val) return '';
                if (Array.isArray(val)) {
                    const items = val.filter(x => x != null && String(x).trim().length);
                    if (!items.length) return '';
                    return '<ul>' + items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';
                }
                const s = String(val).trim();
                return s ? '<p>' + esc(s).replace(/\n/g, '<br>') + '</p>' : '';
            }

            function renderReportSection(title, val) {
                const body = renderReportList(val);
                return body ? `<div class="r-section"><h4>${esc(title)}</h4>${body}</div>` : '';
            }

            function renderPracticalPath(path) {
                if (!path) return '';
                const p1 = renderReportList(path.first90Days);
                const p2 = renderReportList(path.sixTo12Months);
                const p3 = renderReportList(path.twelveToTwentyFourMonths);
                if (!p1 && !p2 && !p3) return '';
                let h = '<div class="r-section"><h4>Practical Implementation Path</h4>';
                if (p1) h += '<h5>First 90 days</h5>' + p1;
                if (p2) h += '<h5>6 to 12 months</h5>' + p2;
                if (p3) h += '<h5>12 to 24 months and beyond</h5>' + p3;
                h += '</div>';
                return h;
            }

            function statusPillHtml(status) {
                const s = (status || 'not-started').toLowerCase();
                const label = s === 'not-started' ? 'Not Started'
                    : s === 'in-progress' ? 'In Progress'
                    : s === 'completed' ? 'Completed'
                    : s === 'blocked' ? 'Blocked'
                    : status;
                return `<span class="r-status r-status-${s}">${esc(label)}</span>`;
            }

            // Build the report HTML string from the selected options
            function buildReportHtml(options) {
                const total = selectedSolutions.length;
                const quickWins = selectedSolutions.filter(s => s.timeline === '<1 year');
                const mediumTerm = selectedSolutions.filter(s => s.timeline === '1-3 years');
                const longTerm = selectedSolutions.filter(s => s.timeline === '3+ years');

                const fontFaceCss = _buildFontFaceCss();
                const styles = `
                    ${fontFaceCss}
                    /* Drop the root font size from the browser default (16 px) to a
                       conventional report scale of 14 px. Every rem in the report
                       inherits this base, so the entire hierarchy scales down
                       proportionally without per-rule tweaks. */
                    html { font-size: 14px; }
                    body { font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif; color: #243746; margin: 0; padding: 40px; max-width: 1040px; margin-left: auto; margin-right: auto; line-height: 1.55; font-feature-settings: 'tnum' 1, 'kern' 1, 'liga' 1; -webkit-font-smoothing: antialiased; }
                    h1, h2, h3, .qa-section-title, .qa-block-title, .cover-title, .cover-country .name { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
                    h1 { color: #00689D; margin: 0 0 4px 0; font-size: 2.1rem; font-weight: 700; letter-spacing: -0.01em; }
                    h2 { color: #00689D; border-bottom: 2px solid #00689D; padding-bottom: 6px; margin-top: 34px; font-weight: 700; letter-spacing: -0.005em; }
                    h3 { color: #1a3a52; margin-top: 22px; margin-bottom: 6px; font-weight: 700; }
                    h4 { color: #2c4a63; margin: 14px 0 4px 0; font-size: 1rem; font-weight: 600; }
                    h5 { color: #5d7a8f; margin: 10px 0 4px 0; font-size: 0.9rem; font-weight: 600; }
                    /* ======================= COVER PAGE ======================= */
                    /* Sized to its content + page-break-after so it occupies exactly
                       one PDF page. A previous min-height + flex layout pushed the
                       footer past the page boundary into a phantom second page. */
                    .cover-page {
                        position: relative;
                        margin: -40px -40px 40px;
                        padding: 48px 60px 36px;
                        background: #00B2E3;
                        color: #ffffff;
                        overflow: hidden;
                        page-break-after: always;
                        break-after: page;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .cover-skyline {
                        position: absolute; left: 0; right: 0; bottom: 130px;
                        width: 100%; height: 180px; opacity: 0.16;
                        pointer-events: none;
                    }
                    /* City photo silhouette overlay — sits under the gradient but above
                       the base color so the cityscape reads as a faint texture. */
                    .cover-bg-photo {
                        position: absolute; inset: 0;
                        background-size: cover; background-position: center;
                        opacity: 0.22;
                        filter: grayscale(40%) contrast(1.05) brightness(0.9);
                        mix-blend-mode: luminosity;
                        pointer-events: none;
                        z-index: 0;
                    }
                    .cover-top {
                        display: flex; justify-content: center; align-items: center;
                        position: relative; z-index: 2;
                        margin-bottom: 12px;
                    }
                    .cover-logo { height: 140px; width: auto; display: block; }
                    .cover-logo svg { height: 140px; width: auto; display: block; }
                    .cover-body {
                        position: relative; z-index: 2;
                        padding: 24px 0;
                    }
                    .cover-tag {
                        display: inline-block; font-size: 0.72rem; letter-spacing: 0.2em;
                        text-transform: uppercase; font-weight: 700;
                        background: rgba(255, 255, 255, 0.18); padding: 6px 14px; border-radius: 999px;
                        margin-bottom: 22px; align-self: flex-start;
                    }
                    .cover-title {
                        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
                        font-size: 3.2rem; font-weight: 700; line-height: 1.06; margin: 0;
                        letter-spacing: -0.01em; max-width: 700px;
                        color: #ffffff; border: none; padding: 0;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    }
                    .cover-sub {
                        font-family: 'Inter', 'Segoe UI', sans-serif;
                        font-size: 1.05rem; font-weight: 400; line-height: 1.5;
                        margin-top: 12px; max-width: 640px; opacity: 0.94;
                        letter-spacing: 0;
                    }
                    .cover-country {
                        display: flex; align-items: center; gap: 18px; margin-top: 42px;
                        background: rgba(255, 255, 255, 0.14);
                        backdrop-filter: blur(6px);
                        border-radius: 14px; padding: 16px 22px;
                        align-self: flex-start; max-width: 460px;
                        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
                    }
                    .cover-country .flag {
                        width: 80px; height: 60px; object-fit: cover; border-radius: 8px;
                        box-shadow: 0 0 0 1px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.18);
                        flex-shrink: 0;
                    }
                    .cover-country .placeholder {
                        width: 80px; height: 60px; border-radius: 8px;
                        background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center;
                        font-size: 32px; flex-shrink: 0;
                    }
                    .cover-country .name {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 1.6rem; font-weight: 700; line-height: 1.1;
                        letter-spacing: -0.005em;
                    }
                    .cover-country .region {
                        font-size: 1rem; opacity: 0.9; margin-top: 4px;
                    }
                    .cover-meta {
                        display: flex; gap: 28px; flex-wrap: wrap;
                        margin-top: 32px; font-size: 0.9rem; opacity: 0.92;
                    }
                    .cover-meta-item .l { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.75; }
                    .cover-meta-item .v { font-size: 1.05rem; font-weight: 700; margin-top: 2px; }
                    .cover-footer {
                        position: relative; z-index: 2;
                        margin-top: 28px; padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.28);
                    }
                    .cover-footer-text { font-size: 0.85rem; line-height: 1.45; opacity: 0.9; max-width: 720px; }
                    /* SDG 11 alignment chip — bottom of the body section so it sits
                       just above the footer rule. */
                    .cover-sdg {
                        display: inline-flex; align-items: center; gap: 14px;
                        margin-top: 32px; padding: 12px 18px;
                        background: rgba(255, 255, 255, 0.14); border-radius: 12px;
                        align-self: flex-start; max-width: 460px;
                    }
                    .cover-sdg img { height: 56px; width: 56px; border-radius: 6px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
                    .cover-sdg .l { font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.85; font-weight: 700; }
                    .cover-sdg .v { font-size: 0.95rem; font-weight: 600; margin-top: 2px; line-height: 1.3; }
                    /* Legacy class kept so older code that references .cover still compiles */
                    .cover { display: none; }
                    .cover .subtitle { display: none; }

                    /* ======================= PAGE-2 (Quick Analysis) ======================= */
                    /* Wraps the Local Government Profile + the Actual vs Potential chart
                       as a single branded page that visually echoes the cover. Forces a
                       page break after so subsequent sections (Gap Analysis etc.) land on
                       page 3+. */
                    .qa-page {
                        position: relative;
                        margin: 0 -40px 36px;
                        padding: 28px 60px 36px;
                        background: #ffffff;
                        page-break-after: always;
                        break-after: page;
                    }
                    .qa-section-label {
                        display: inline-flex; align-items: center; gap: 12px;
                        font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
                        font-weight: 700; color: #00689D;
                        margin-bottom: 8px;
                    }
                    .qa-section-label::before {
                        content: ''; display: inline-block;
                        width: 36px; height: 2px; background: #00B2E3;
                    }
                    .qa-section-title {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 2.4rem; font-weight: 700; color: #0f2742;
                        margin: 0 0 6px; line-height: 1.12; letter-spacing: -0.015em;
                        border: none; padding: 0;
                    }
                    .qa-section-sub {
                        font-family: 'Inter', 'Segoe UI', sans-serif;
                        color: #5d7a8f; font-size: 1rem; max-width: 720px; margin: 0 0 28px;
                        line-height: 1.55;
                    }
                    .qa-block-title {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 1.35rem; font-weight: 700; color: #0f2742;
                        margin: 28px 0 4px; letter-spacing: -0.01em;
                    }
                    .qa-block-sub {
                        color: #64748b; font-size: 0.88rem; margin: 0 0 14px;
                    }
                    .qa-chart-card {
                        border-radius: 14px;
                        padding: 18px 22px 14px;
                        background: #f8fafc;
                        page-break-inside: avoid; break-inside: avoid;
                    }
                    .qa-chart-card .units-strip {
                        display: flex; justify-content: space-between; align-items: baseline;
                        margin-bottom: 8px;
                    }
                    .qa-chart-card .units-strip .title {
                        font-size: 1rem; font-weight: 700; color: #0f2742;
                    }
                    .qa-chart-card .units-strip .units {
                        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em;
                        text-transform: uppercase; color: #64748b;
                    }
                    .stat-grid { display: flex; flex-wrap: nowrap; gap: 10px; margin: 14px 0 4px 0; }
                    .stat { flex: 1 1 0; min-width: 0; background: #f0f7fc; border: 1px solid #cce1ee; border-radius: 8px; padding: 10px 14px; }
                    .stat .v { font-size: 1.4rem; font-weight: 700; color: #00689D; line-height: 1.1; word-break: break-word; }
                    .stat .l { font-size: 0.74rem; color: #55697a; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px; }
                    .r-card { border: 1px solid #dbe6f0; border-radius: 10px; padding: 16px 18px; margin: 14px 0; page-break-inside: avoid; background: #ffffff; box-shadow: 0 2px 4px rgba(15, 40, 70, 0.04); }
                    .r-card-head { border-bottom: 1px solid #eaf1f7; padding-bottom: 8px; margin-bottom: 10px; }
                    .r-card-id { display: inline-block; font-family: 'Roboto Mono', Consolas, monospace; background: #e0f2fe; color: #00689D; font-weight: 700; font-size: 0.8rem; padding: 2px 8px; border-radius: 6px; }
                    .r-card-title { font-size: 1.12rem; font-weight: 700; color: #1a3a52; margin-top: 4px; }
                    .r-meta { font-size: 0.82rem; color: #5d7a8f; margin-top: 4px; }
                    .r-meta .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; background: #f0f4f8; border: 1px solid #d5dee6; margin-right: 6px; font-size: 0.74rem; }
                    .r-section { margin: 10px 0; }
                    .r-section p, .r-section li { font-size: 0.92rem; }
                    .r-section ul { margin: 4px 0 8px 0; padding-left: 22px; }
                    .tl-block { padding: 12px 14px; margin: 12px 0; background: #f0fdf4; border-radius: 8px; page-break-inside: avoid; }
                    .tl-block.medium { background: #fffbeb; }
                    .tl-block.long { background: #f0f7fc; }
                    .tl-title { font-weight: 700; color: #1a3a52; margin: 0 0 6px 0; font-size: 1rem; }
                    .tl-sub { font-size: 0.82rem; color: #55697a; margin-bottom: 8px; }
                    .tl-item { padding: 6px 0; border-top: 1px dashed #d9e2ea; font-size: 0.9rem; }
                    .tl-item:first-of-type { border-top: none; }
                    .tl-item .tl-item-id { display: inline-block; font-family: 'Roboto Mono', monospace; font-size: 0.78rem; color: #00689D; margin-right: 8px; }
                    .pr-block { border: 1px solid #dbe6f0; border-radius: 10px; padding: 12px 14px; margin: 12px 0; page-break-inside: avoid; }
                    .pr-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }
                    .pr-title { font-weight: 700; color: #1a3a52; font-size: 1rem; }
                    .pr-pct { font-weight: 700; color: #00689D; }
                    .pr-bar { height: 8px; background: #e9eff5; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
                    .pr-bar-fill { height: 100%; background: #00689D; }
                    .pr-phase { font-weight: 600; color: #55697a; font-size: 0.82rem; margin: 8px 0 4px 0; text-transform: uppercase; letter-spacing: 0.04em; }
                    .pr-m { display: flex; gap: 10px; align-items: flex-start; padding: 5px 0; font-size: 0.9rem; border-top: 1px dashed #eaf1f7; }
                    .pr-m:first-of-type { border-top: none; }
                    .r-status { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
                    .r-status-not-started { background: #f0f4f8; color: #55697a; }
                    .r-status-in-progress { background: #fff4e0; color: #c26500; }
                    .r-status-completed { background: #e2fbe8; color: #1f8a3a; }
                    .r-status-blocked { background: #ffe5e5; color: #b52626; }
                    .report-table { width: 100%; border-collapse: collapse; margin: 12px 0 4px 0; font-size: 0.88rem; }
                    .report-table th { background: #f0f7fc; color: #00689D; border-bottom: 2px solid #00689D; padding: 8px 10px; font-weight: 600; }
                    .report-table td { border-bottom: 1px solid #eaf1f7; padding: 7px 10px; vertical-align: top; }
                    .report-table tr:nth-child(even) td { background: #fafcfe; }
                    .report-table tr.tr-totals td { background: #e0f2fe; border-top: 2px solid #00689D; border-bottom: none; color: #00689D; }
                    .report-skipped-list { margin: 10px 0 4px 0; padding-left: 22px; }
                    .report-skipped-list li { font-size: 0.88rem; margin-bottom: 4px; }
                    .gap-card { border: 1px solid #dbe6f0; border-radius: 10px; padding: 14px 16px; margin: 12px 0; page-break-inside: avoid; background: #ffffff; }
                    .gap-card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid #eaf1f7; padding-bottom: 8px; margin-bottom: 10px; }
                    .gap-card-title { font-size: 1rem; font-weight: 700; color: #1a3a52; }
                    .gap-card-headline { font-size: 0.9rem; color: #55697a; }
                    .gap-card-headline strong { color: #00689D; font-size: 1.05rem; }
                    .gap-bars { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
                    .gap-bar-row { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; }
                    .gap-bar-label { flex: 0 0 110px; color: #2c4a63; font-weight: 600; }
                    .gap-bar { flex: 1; height: 10px; background: #eef3f8; border-radius: 5px; overflow: hidden; }
                    .gap-bar-fill { height: 100%; border-radius: 5px; }
                    .gap-bar-amount { flex: 0 0 140px; text-align: right; color: #243746; font-variant-numeric: tabular-nums; }
                    .gap-bar-pct { color: #7a8a99; font-size: 0.8rem; }
                    .gap-ratios { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
                    .gap-ratio { background: #f0f7fc; border: 1px solid #cce1ee; border-radius: 6px; padding: 4px 10px; font-size: 0.82rem; color: #243746; }
                    .gap-ratio-l { color: #55697a; margin-right: 6px; }
                    .rank-pill { display: inline-block; min-width: 26px; padding: 2px 8px; border-radius: 50%; background: #00689D; color: #fff; font-weight: 700; font-size: 0.82rem; text-align: center; line-height: 1.2; }
                    .share-row { display: flex; align-items: center; gap: 8px; }
                    .share-bar { flex: 1; height: 8px; background: #eef3f8; border-radius: 4px; overflow: hidden; min-width: 60px; }
                    .share-bar-fill { height: 100%; background: #00689D; border-radius: 4px; }
                    .share-pct { font-size: 0.82rem; color: #55697a; min-width: 36px; text-align: right; font-variant-numeric: tabular-nums; }

                    /* === Stream Prioritization (page 4) — uses .report-table to match page 3's gap breakdown === */
                    .prio-explainer {
                        background: #f0f7fc;
                        border-radius: 10px; padding: 16px 20px;
                        margin: 18px 0 8px;
                    }
                    .prio-explainer-title {
                        color: #00689D; font-weight: 700; font-size: 1rem;
                        margin-bottom: 10px;
                    }
                    .prio-explainer p { margin: 0 0 8px; font-size: 0.88rem; line-height: 1.55; color: #475569; }
                    .prio-explainer p:last-child { margin-bottom: 0; }

                    .report-table tr.row-excluded td { color: #94a3b8; }
                    .prio-rank {
                        display: inline-flex; align-items: center; justify-content: center;
                        width: 28px; height: 28px; border-radius: 50%;
                        color: #ffffff; font-weight: 700; font-size: 0.85rem; line-height: 1;
                    }
                    .prio-rank-1 { background: #F59E0B; }
                    .prio-rank-2 { background: #94A3B8; }
                    .prio-rank-3 { background: #EA580C; }
                    .prio-rank-n { background: #00689D; }
                    .prio-stream-dot {
                        display: inline-block; width: 10px; height: 10px;
                        border-radius: 2px; margin-right: 10px;
                        vertical-align: middle;
                    }
                    .prio-em { color: #cbd5e1; font-weight: 600; }
                    .prio-status {
                        display: inline-flex; align-items: center;
                        padding: 4px 12px; border: 1px solid #e2e8f0;
                        border-radius: 6px; background: #ffffff;
                        font-size: 0.78rem; color: #475569; font-weight: 500;
                    }
                    .prio-status.status-exclude { color: #94a3b8; background: #f8fafc; }

                    /* === Recommendations Summary (page 6) === */
                    .rec-detail-header { margin: 28px 0 12px; }

                    .rec-card {
                        background: #ffffff; border-radius: 12px;
                        padding: 18px 22px 14px; margin: 14px 0 18px;
                        border: 1px solid #e5e7eb;
                        page-break-inside: avoid; break-inside: avoid;
                    }
                    .rec-card-head {
                        display: flex; align-items: flex-start; gap: 14px;
                        margin-bottom: 8px;
                    }
                    .rec-card-no {
                        flex: 0 0 36px; height: 36px;
                        background: #00689D;
                        color: #ffffff; font-weight: 700; font-size: 1rem;
                        border-radius: 50%; line-height: 36px; text-align: center;
                    }
                    .rec-card-titleblock { flex: 1; min-width: 0; }
                    .rec-card-id {
                        display: inline-block;
                        font-family: 'Roboto Mono', Consolas, monospace;
                        background: #e0f2fe; color: #00689D;
                        font-weight: 700; font-size: 0.72rem;
                        padding: 2px 8px; border-radius: 5px;
                        margin-bottom: 4px;
                    }
                    .rec-card-title {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 1.25rem; font-weight: 700; color: #0f2742;
                        line-height: 1.25; letter-spacing: -0.005em;
                    }
                    .rec-card-meta {
                        display: flex; flex-wrap: wrap; gap: 6px;
                        margin: 6px 0 12px;
                    }
                    .rec-pill {
                        display: inline-block; padding: 3px 10px;
                        border-radius: 12px; font-size: 0.72rem;
                        font-weight: 600; letter-spacing: 0.02em;
                        background: #f1f5f9; color: #475569;
                        border: 1px solid #e2e8f0;
                    }
                    .rec-pill-quick  { background: #e2fbe8; color: #1f8a3a; border-color: #bfe8c8; }
                    .rec-pill-mid    { background: #fff4e0; color: #c26500; border-color: #f5d6a8; }
                    .rec-pill-long   { background: #fde7e7; color: #b52626; border-color: #f5c1c1; }
                    .rec-pill-diff   { background: #f1f5f9; color: #334155; }
                    .rec-pill-pol    { background: #fef3c7; color: #92400e; border-color: #fde68a; }
                    .rec-pill-stream { background: #e0f2fe; color: #00689D; border-color: #cce1ee; }
                    .rec-pill-gap    { background: #f0f9ff; color: #0f2742; border-color: #cce1ee; }

                    .rec-card-overview {
                        font-size: 0.92rem; line-height: 1.55; color: #243746;
                        background: #f8fafc; border-radius: 8px;
                        padding: 12px 16px; margin: 10px 0 14px;
                    }
                    .rec-card .r-section { margin: 10px 0 6px; }
                    .rec-card .r-section h4 {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 0.95rem; font-weight: 700; color: #0f2742;
                        margin: 8px 0 4px;
                    }
                    .rec-card .r-section h5 {
                        font-size: 0.78rem; font-weight: 700; color: #00689D;
                        text-transform: uppercase; letter-spacing: 0.04em;
                        margin: 10px 0 4px;
                    }
                    .rec-card .r-section ul, .rec-card .r-section ol {
                        margin: 4px 0 4px 18px; padding-left: 4px;
                    }
                    .rec-card .r-section li {
                        font-size: 0.88rem; color: #243746;
                        margin: 2px 0; line-height: 1.5;
                    }
                    .rec-card .r-section p {
                        font-size: 0.88rem; color: #243746;
                        line-height: 1.55; margin: 4px 0;
                    }

                    /* Gap Prioritization (page 5) — priority cell uses a small
                       coloured circle (P1 green / P2 grey / P3 red) plus the
                       gap-type name and the amount in cyan beneath. */
                    .prio-pb {
                        display: inline-flex; align-items: center; justify-content: center;
                        width: 22px; height: 22px; border-radius: 50%;
                        color: #ffffff; font-weight: 700; font-size: 0.72rem;
                        line-height: 1; margin-right: 8px; flex-shrink: 0;
                    }
                    .prio-pb-1 { background: #10B981; }
                    .prio-pb-2 { background: #94A3B8; }
                    .prio-pb-3 { background: #EF4444; }
                    .prio-pcell { display: flex; align-items: center; }
                    .prio-pcell-body { display: flex; flex-direction: column; line-height: 1.3; }
                    .prio-pcell-type { font-weight: 600; color: #1f2937; font-size: 0.85rem; }
                    .prio-pcell-amount { font-size: 0.78rem; color: #00689D; font-weight: 600; }
                    .mode-chip-upper { text-transform: uppercase; letter-spacing: 0.02em; }
                    .mode-chip { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 0.76rem; font-weight: 600; border: 1px solid transparent; }
                    .mode-rp { background: #e2fbe8; color: #1f8a3a; border-color: #bfe8c8; }
                    .mode-cf { background: #fff4e0; color: #c26500; border-color: #f5d6a8; }
                    .mode-oh { background: #ffe5e5; color: #b52626; border-color: #f5c1c1; }
                    .mode-legend { margin-top: 10px; padding: 10px 14px; background: #fafcfe; border: 1px solid #dbe6f0; border-radius: 8px; font-size: 0.82rem; color: #55697a; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
                    .mode-legend strong { color: #1a3a52; margin-right: 4px; }
                    .mode-legend span .mode-chip { margin-right: 6px; }
                    .seq-group { border: 1px solid #dbe6f0; border-radius: 10px; padding: 10px 14px; margin: 12px 0; background: #ffffff; page-break-inside: avoid; }
                    .seq-group-head { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #eaf1f7; padding-bottom: 8px; margin-bottom: 8px; }
                    .seq-group-title { flex: 1; font-weight: 700; color: #1a3a52; font-size: 1rem; }
                    .seq-group-total { font-size: 0.82rem; color: #55697a; }
                    .seq-group-total strong { color: #00689D; }
                    .seq-item { display: flex; align-items: center; gap: 10px; padding: 5px 0; font-size: 0.85rem; }
                    .seq-item + .seq-item { border-top: 1px dashed #eaf1f7; }
                    .seq-item-index { flex: 0 0 30px; color: #7a8a99; font-size: 0.78rem; }
                    .seq-item-priority { flex: 0 0 30px; font-weight: 700; color: #00689D; font-size: 0.8rem; }
                    .seq-item-type { flex: 0 0 100px; color: #2c4a63; font-weight: 600; }
                    .seq-item-bar { flex: 1; height: 8px; background: #eef3f8; border-radius: 4px; overflow: hidden; min-width: 60px; }
                    .seq-item-bar-fill { height: 100%; border-radius: 4px; }
                    .seq-item-amount { flex: 0 0 90px; text-align: right; color: #243746; font-variant-numeric: tabular-nums; }
                    .seq-item-cum { flex: 0 0 80px; text-align: right; color: #7a8a99; font-size: 0.76rem; font-variant-numeric: tabular-nums; }
                    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid #dbe6f0; font-size: 0.82rem; color: #5d7a8f; }

                    /* --- Page-break control for PDF / print ---
                       Chromium honors both the modern break-* and legacy page-break-* properties.
                       Setting both keeps us safe across renderers. */
                    body { orphans: 3; widows: 3; }
                    h1, h2, h3, h4, h5 { break-after: avoid; page-break-after: avoid; }
                    h2, h3 { break-inside: avoid; page-break-inside: avoid; }
                    .r-card, .tl-block, .pr-block, .gap-card, .seq-group, .stat-grid, .mode-legend {
                        break-inside: avoid; page-break-inside: avoid;
                    }
                    .r-section { break-inside: avoid; page-break-inside: avoid; }
                    .r-card-head, .pr-head, .gap-card-head, .seq-group-head {
                        break-after: avoid; page-break-after: avoid;
                    }
                    li { break-inside: avoid; page-break-inside: avoid; }
                    .report-table { break-inside: auto; }
                    .report-table thead { display: table-header-group; }
                    .report-table tfoot { display: table-footer-group; }
                    .report-table tr { break-inside: avoid; page-break-inside: avoid; }

                    @@page { size: A4; margin: 18mm 14mm; }
                    @@media print {
                        body { padding: 0; }
                    }
                `;

                let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Revenue Enhancement Action Plan</title>
<style>${styles}</style>
</head>
<body>`;

                // ===== Branded cover page =====
                // First page of the report: full-bleed cyan gradient with UN-Habitat
                // branding, big report title, country/region card (with flag),
                // and an SDG 11 alignment chip. Renders before everything else.
                (function () {
                    const covCountrySel = document.getElementById('country');
                    const covOpt = covCountrySel ? covCountrySel.options[covCountrySel.selectedIndex] : null;
                    const covFlagCode = covOpt ? (covOpt.dataset.flag || '') : '';
                    const covCountryName = (document.getElementById('country')?.value || '').trim();
                    const covRegionName = (document.getElementById('region')?.value || '').trim();
                    const covFinYear = (document.getElementById('financialYear')?.value || '').trim();

                    // Prefer cached flag data URL (works in PDF), else fall back to CDN.
                    const covCached = window._cachedCountryFlag;
                    const covFlagSrc = (covCached && covCached.code === covFlagCode && covCached.dataUrl)
                        ? covCached.dataUrl
                        : (covFlagCode ? `https://flagcdn.com/w160/${covFlagCode}.png` : '');
                    const covFlagHtml = covFlagSrc
                        ? `<img class="flag" src="${covFlagSrc}" alt="${esc(covCountryName)}">`
                        : `<div class="placeholder">🏛</div>`;

                    const covDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                    // UN-Habitat white SVG inlined directly so the crisp vector survives
                    // PDF rasterisation (raster logos blur a touch at high DPI).
                    const covLogoUn = _reportAssets.unHabitatLogo
                        ? `<div class="cover-logo" aria-label="UN-Habitat">${_reportAssets.unHabitatLogo}</div>`
                        : `<div style="font-weight:800;letter-spacing:0.04em;font-size:1.2rem;">UN ✦ HABITAT</div>`;
                    // Nairobi-style city photo as a faint silhouette behind the gradient.
                    const covBgPhoto = _reportAssets.cityBg
                        ? `<div class="cover-bg-photo" style="background-image:url('${_reportAssets.cityBg}');"></div>`
                        : '';
                    // SDG 11 — "Sustainable Cities and Communities" alignment chip.
                    const covSdgChip = _reportAssets.sdg11Logo
                        ? `<div class="cover-sdg">
            <img src="${_reportAssets.sdg11Logo}" alt="SDG 11">
            <div>
                <div class="l">Aligned with SDG</div>
                <div class="v">Sustainable Cities &amp; Communities</div>
            </div>
        </div>`
                        : '';

                    html += `<section class="cover-page">
    ${covBgPhoto}
    <div class="cover-top">
        ${covLogoUn}
    </div>
    <div class="cover-body">
        <span class="cover-tag">Revenue Optimization</span>
        <h1 class="cover-title">Revenue Enhancement<br>Action Plan</h1>
        <p class="cover-sub">A tailored, evidence-based plan to close the gap between current own-source revenue collection and what your local government could realistically collect.</p>
        <div class="cover-country">
            ${covFlagHtml}
            <div>
                <div class="name">${esc(covCountryName) || 'Country not selected'}</div>
                ${covRegionName ? `<div class="region">${esc(covRegionName)}</div>` : ''}
            </div>
        </div>
        <div class="cover-meta">
            <div class="cover-meta-item"><div class="l">Generated</div><div class="v">${esc(covDate)}</div></div>
            ${covFinYear ? `<div class="cover-meta-item"><div class="l">Financial Year</div><div class="v">${esc(covFinYear)}</div></div>` : ''}
        </div>
        ${covSdgChip}
    </div>
    <div class="cover-footer">
        <div class="cover-footer-text">Prepared with ROSRA — a UN-Habitat assessment tool for sub-national governments. Outputs in this report reflect the inputs and prioritisation decisions captured during the assessment.</div>
    </div>
</section>`;
                })();
                html += ``;

                // Shared helper for the gap-related sections below
                const pct = (part, whole) => whole > 0 ? Math.round((part / whole) * 100) : 0;

                // ===== Quick Analysis =====
                // Local Government Profile (card with country flag + key fields)
                // plus the "What you collect vs what you could collect" chart.
                // Mirrors the snapshot the user sees on the first analysis tab.
                if (options.includeExecSummary) {
                    const val = id => {
                        const el = document.getElementById(id);
                        return el && el.value && el.value.trim() ? el.value : '—';
                    };
                    // Read the 2-letter ISO flag code from the selected <option>'s dataset
                    // (loadCountries() stores it via countryFlagCodes[name]).
                    const countrySel = document.getElementById('country');
                    const selectedOpt = countrySel ? countrySel.options[countrySel.selectedIndex] : null;
                    const flagCode = selectedOpt ? (selectedOpt.dataset.flag || '') : '';
                    const countryName = val('country');
                    const regionName  = val('region');
                    // Prefer the pre-cached base64 flag (set by updateHeaderCountryChip
                    // when the country was selected) — that survives the server-side
                    // PDF render, which blocks outbound network for SSRF reasons.
                    // Fall back to the live CDN URL for HTML downloads / browsers.
                    const cachedFlag = window._cachedCountryFlag;
                    const flagSrc = (cachedFlag && cachedFlag.code === flagCode && cachedFlag.dataUrl)
                        ? cachedFlag.dataUrl
                        : (flagCode ? `https://flagcdn.com/w160/${flagCode}.png` : '');
                    const flagHtml = flagSrc
                        ? `<img src="${flagSrc}" alt="${countryName}" style="width:64px;height:48px;object-fit:cover;border-radius:6px;box-shadow:0 0 0 1px rgba(0,0,0,0.12),0 2px 4px rgba(0,0,0,0.08);flex-shrink:0;">`
                        : `<div style="width:64px;height:48px;border-radius:6px;background:#e6f9fc;display:flex;align-items:center;justify-content:center;color:#00689D;font-size:24px;flex-shrink:0;">🏛</div>`;

                    const symbol = val('currencySymbol');
                    const code = val('currency');
                    const currencyDisplay = (symbol !== '—' && code !== '—') ? `${symbol} · ${code}`
                        : (symbol !== '—' ? symbol : (code !== '—' ? code : '—'));

                    const statCells = [
                        { label: 'Financial Year',           value: val('financialYear') },
                        { label: 'Currency',                 value: currencyDisplay },
                        { label: 'Own-Source Revenue (OSR)', value: val('actualOsr') },
                        { label: 'Gross Regional Product',   value: val('gdpPerCapita') },
                        { label: 'Population',               value: val('population') }
                    ].map(s => `<div style="flex:1 1 30%;min-width:140px;background:#f8fafc;border-radius:8px;padding:10px 14px;">
        <div style="font-size:0.72rem;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;font-weight:600;margin-bottom:4px;">${s.label}</div>
        <div style="font-size:1.05rem;font-weight:700;color:#1f2937;">${s.value}</div>
    </div>`).join('');

                    // Build a single-line breadcrumb of the gov-unit hierarchy: country
                    // first, then Level 1 (region), Level 2 (city), Level 3 (extra unit).
                    // Each subsequent token only appears if filled.
                    const cityName = val('city');
                    const lvl3Name = val('govUnitLevel3');
                    const hierarchy = [
                        countryName !== '—' ? countryName : null,
                        regionName !== '—' ? regionName : null,
                        cityName !== '—' ? cityName : null,
                        lvl3Name !== '—' ? lvl3Name : null
                    ].filter(Boolean);
                    const hierarchyLine = hierarchy.length
                        ? hierarchy.join(' &middot; ')
                        : 'Country not selected';

                    const lgpCard = `<div style="margin:0 0 18px;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#00B2E3;padding:20px 24px;color:#ffffff;display:flex;align-items:center;gap:18px;">
        ${flagHtml}
        <div style="flex:1;min-width:0;font-family:'Playfair Display',Georgia,serif;font-size:1.65rem;font-weight:700;line-height:1.15;letter-spacing:-0.005em;">${hierarchyLine}</div>
    </div>
    <div style="padding:14px 0 0;display:flex;flex-wrap:wrap;gap:10px;">
        ${statCells}
    </div>
</div>`;

                    // Capture the "What you collect vs what you could collect" view.
                    // Two strategies (in order):
                    //   1. Chart.js registered instance via window.RosraChartRegistry —
                    //      best result, but only present when the user has triggered the
                    //      peer-SNG analysis at least once.
                    //   2. CSS fallback chart built from the #m2*Top KPI DOM elements
                    //      (Actual OSR / Potential OSR / Gap). These get populated by the
                    //      same JS that renders the Chart.js chart, so they're available
                    //      whenever the chart would have been.
                    let chartImg = '';
                    const reg = window.RosraChartRegistry || {};
                    const chartInstance = reg['actualVsPotentialChart'];
                    if (chartInstance && typeof chartInstance.toBase64Image === 'function') {
                        try {
                            const dataUrl = chartInstance.toBase64Image('image/png', 1.0);
                            if (dataUrl && dataUrl.length > 2500) {
                                chartImg = `<div class="qa-chart-card">
    <div class="units-strip">
        <div class="title">What you collect vs what you could collect</div>
    </div>
    <img src="${dataUrl}" alt="What you collect vs what you could collect" style="max-width:100%;height:auto;display:block;">
</div>`;
                            }
                        } catch (_) { /* skip */ }
                    }

                    // SVG fallback if Chart.js instance was unavailable / empty.
                    // Renders a vertical stacked-bar chart that visually mirrors the
                    // Performance vs Peers chart: cyan Actual bar + cyan/orange stacked
                    // Potential bar, with y-axis gridlines, value labels above each bar,
                    // a dashed connector at the Actual level, a gap bracket on the right,
                    // and a "AMOUNTS IN <CUR> (B)" header. SVG is preferred over <img>
                    // because PDF renderers preserve vector fidelity at any zoom.
                    if (!chartImg) {
                        const text = id => {
                            const el = document.getElementById(id);
                            return el ? (el.textContent || '').trim() : '';
                        };
                        const parseShort = s => {
                            if (!s || s === '-') return null;
                            const m = String(s).replace(/[\s,]/g, '').match(/([\d.]+)\s*([KMB]?)/i);
                            if (!m) return null;
                            const n = parseFloat(m[1]);
                            if (isNaN(n)) return null;
                            const suf = (m[2] || '').toUpperCase();
                            return suf === 'B' ? n * 1e9 : suf === 'M' ? n * 1e6 : suf === 'K' ? n * 1e3 : n;
                        };
                        // Multi-source value resolution:
                        // 1. window.__RosraWofiResult — set by _PotentialEstimates
                        //    after the WoFi estimator returns. Authoritative when
                        //    present because it carries raw numbers, not formatted
                        //    text. Survives a hidden tab / 0-size canvas.
                        // 2. WoFi tile DOM (#wofiPotentialValue / #wofiGapValue /
                        //    #wofiFrontierIndexValue) — c9d37f2 replaced the
                        //    legacy peer-SNG first-analysis panel with WoFi.
                        // 3. Legacy peer-SNG tile IDs (#m2ActualOSRTop / …) —
                        //    only populated if the old peer-SNG flow still runs.
                        let actualText, potentialText, gapText, perfText;
                        let actualN = null, potentialN = null;

                        const wofiCache = window.__RosraWofiResult;
                        if (wofiCache && typeof wofiCache.potentialOsr === 'number' && wofiCache.potentialOsr > 0) {
                            actualN    = Number(wofiCache.actualOsr) || 0;
                            potentialN = Number(wofiCache.potentialOsr) || 0;
                            const gapN = Number(wofiCache.osrGap) || Math.max(0, potentialN - actualN);
                            const curSym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol() : '';
                            const fmt = n => {
                                if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
                                if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
                                if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
                                return Math.round(n).toLocaleString();
                            };
                            const sp = curSym ? curSym + ' ' : '';
                            actualText    = sp + fmt(actualN);
                            potentialText = sp + fmt(potentialN);
                            gapText       = sp + fmt(gapN);
                            const idx = typeof wofiCache.frontierIndex === 'number' ? Math.round(wofiCache.frontierIndex * 100) : null;
                            perfText      = idx != null ? idx + '%' : '';
                        } else {
                            // DOM fallback path
                            const wofiPotText = text('wofiPotentialValue');
                            const wofiGapText = text('wofiGapValue');
                            const wofiPotN = parseShort(wofiPotText);
                            const wofiGapN = parseShort(wofiGapText);
                            if (wofiPotN != null && wofiPotN > 0) {
                                const inputEl = document.getElementById('actualOsr');
                                const inputVal = inputEl ? parseFloat(String(inputEl.value || '').replace(/[\s,]/g, '')) : NaN;
                                actualN = (!isNaN(inputVal) && inputVal > 0)
                                    ? inputVal
                                    : (wofiGapN != null ? Math.max(0, wofiPotN - wofiGapN) : null);
                                potentialN = wofiPotN;
                                actualText    = (typeof getCurrencySymbol === 'function' ? getCurrencySymbol() + ' ' : '') + (actualN >= 1e9 ? (actualN / 1e9).toFixed(2) + 'B' : actualN >= 1e6 ? (actualN / 1e6).toFixed(2) + 'M' : actualN.toLocaleString());
                                potentialText = wofiPotText;
                                gapText       = wofiGapText;
                                perfText      = text('wofiFrontierIndexValue');
                            } else {
                                actualText    = text('m2ActualOSRTop');
                                potentialText = text('m2OSRPotentialTop');
                                gapText       = text('m2OSRGapTop');
                                perfText      = text('m2PerformanceIndexTop');
                                actualN    = parseShort(actualText);
                                potentialN = parseShort(potentialText);
                            }
                        }

                        if (actualN != null && potentialN != null && potentialN > 0) {
                            // Round the y-axis max up to the next nice tick so the bars don't
                            // touch the top edge of the chart area.
                            const niceMax = (() => {
                                const v = potentialN * 1.2;
                                const mag = Math.pow(10, Math.floor(Math.log10(v)));
                                const norm = v / mag;
                                const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
                                return niceNorm * mag;
                            })();
                            // 5 horizontal gridlines, spaced evenly between 0 and niceMax.
                            const ticks = 5;
                            const W = 760, H = 380;
                            const padL = 80, padR = 170, padT = 50, padB = 50;
                            const chartW = W - padL - padR;
                            const chartH = H - padT - padB;
                            const yFor = v => padT + chartH - (v / niceMax) * chartH;
                            // Match the website's number formatting: 2 decimals for B/M.
                            const fmtShort = n => {
                                if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
                                if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
                                if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
                                return Math.round(n).toLocaleString();
                            };
                            // Currency symbol from the form (fall back to LCU)
                            const curSym = document.getElementById('currencySymbol')?.value || '';
                            const curPrefix = curSym ? curSym + ' ' : '';
                            const unitsLabel = 'AMOUNTS IN ' + (curSym ? curSym.toUpperCase() : 'LCU') + ' (B)';
                            // Gap as a percentage of potential — same calc as the website's
                            // "X% of top-peer level" label on the gap bracket.
                            const gapN = potentialN - actualN;
                            const gapPctOfPotential = potentialN > 0
                                ? Math.round((gapN / potentialN) * 100) + '%'
                                : null;

                            // Build y-axis tick lines + labels
                            let gridSvg = '';
                            for (let i = 0; i <= ticks; i++) {
                                const v = (i / ticks) * niceMax;
                                const y = yFor(v);
                                gridSvg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#eef0f3" stroke-width="1"/>`;
                                gridSvg += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" font-weight="700" fill="#1f2937">${fmtShort(v)}</text>`;
                            }

                            const barW = 120;
                            const xActual = padL + chartW * 0.28 - barW / 2;
                            const xPotential = padL + chartW * 0.72 - barW / 2;

                            const yActualTop = yFor(actualN);
                            const yPotentialTop = yFor(potentialN);
                            const yPotentialGapBottom = yFor(actualN);

                            // Gap bracket on the right of the Potential bar
                            const bracketX = xPotential + barW + 18;
                            const bracketTop = yPotentialTop;
                            const bracketBot = yPotentialGapBottom;
                            const bracketMid = (bracketTop + bracketBot) / 2;
                            const pctText = gapPctOfPotential ? `${gapPctOfPotential} of top-peer level` : '';

                            // Dashed connector from Actual top across to Potential cyan top
                            const connectorY = yActualTop;
                            const connector = `<line x1="${xActual + barW}" y1="${connectorY}" x2="${xPotential}" y2="${connectorY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>`;

                            chartImg = `<div class="qa-chart-card">
    <div class="units-strip">
        <div class="title">What you collect vs what you could collect</div>
        <div class="units">${unitsLabel}</div>
    </div>
    <div>
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:'Inter','Segoe UI',Arial,sans-serif;font-feature-settings:'tnum';">
            ${gridSvg}
            ${connector}
            <!-- Actual bar (cyan, full height) -->
            <rect x="${xActual}" y="${yActualTop}" width="${barW}" height="${chartH - (yActualTop - padT)}" fill="#00b2e3"/>
            <text x="${xActual + barW / 2}" y="${yActualTop - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="#1f2937">${curPrefix}${fmtShort(actualN)}</text>
            <text x="${xActual + barW / 2}" y="${(yActualTop + (padT + chartH)) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">${fmtShort(actualN)}</text>
            <!-- Potential bar: cyan base + orange gap on top -->
            <rect x="${xPotential}" y="${yPotentialGapBottom}" width="${barW}" height="${chartH - (yPotentialGapBottom - padT)}" fill="#00b2e3"/>
            <rect x="${xPotential}" y="${yPotentialTop}" width="${barW}" height="${yPotentialGapBottom - yPotentialTop}" fill="#FD9D24"/>
            <text x="${xPotential + barW / 2}" y="${yPotentialTop - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="#1f2937">${curPrefix}${fmtShort(potentialN)}</text>
            <text x="${xPotential + barW / 2}" y="${(yPotentialTop + yPotentialGapBottom) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">${fmtShort(gapN)}</text>
            <text x="${xPotential + barW / 2}" y="${(yPotentialGapBottom + (padT + chartH)) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">${fmtShort(actualN)}</text>
            <!-- Gap bracket -->
            <path d="M ${bracketX - 6} ${bracketTop} L ${bracketX} ${bracketTop} L ${bracketX} ${bracketBot} L ${bracketX - 6} ${bracketBot}" stroke="#FD9D24" stroke-width="1.5" fill="none"/>
            <text x="${bracketX + 8}" y="${bracketMid - 6}" font-size="12" font-weight="700" fill="#FD9D24">Gap</text>
            <text x="${bracketX + 8}" y="${bracketMid + 12}" font-size="14" font-weight="700" fill="#FD9D24">${fmtShort(gapN)}</text>
            ${pctText ? `<text x="${bracketX + 8}" y="${bracketMid + 32}" font-size="11" font-weight="500" fill="#94a3b8">${pctText}</text>` : ''}
            <!-- X-axis baseline -->
            <line x1="${padL}" y1="${padT + chartH}" x2="${W - padR}" y2="${padT + chartH}" stroke="#1f2937" stroke-width="1"/>
            <!-- X-axis labels -->
            <text x="${xActual + barW / 2}" y="${padT + chartH + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="#1f2937">Actual revenue</text>
            <text x="${xPotential + barW / 2}" y="${padT + chartH + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="#1f2937">Potential revenue</text>
        </svg>
    </div>
</div>`;
                        }
                    }

                    html += `<section class="qa-page">
    <div class="qa-section-label">Section 01 &middot; Snapshot</div>
    <h2 class="qa-section-title">Local Government Profile</h2>
    <p class="qa-section-sub">A snapshot of the assessment context — the city, its fiscal indicators, and the headline gap between current and potential own-source revenue.</p>
    ${lgpCard}
    ${chartImg}
</section>`;
                }

                // ===== Gap Analysis Results =====
                // Section page (page 3): branded section header, "Revenue Gap by
                // Stream" horizontal-stacked-bar chart (mirrors the Prioritization
                // tab's first chart), then a streams × gap-type breakdown table.
                // Wrapped in .qa-page so it forces a page-break after.
                if (options.includeGapAnalysis) {
                    const rawStreams = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getStreams() : [];
                    // Drop empty placeholder streams: every generic stream gets a
                    // unique internal id but users can leave a slot unfilled,
                    // which produces a row with no gap data anywhere. Hide those
                    // here so the chart + table aren't padded with zero-rows.
                    const streams = rawStreams.filter(s =>
                        (s.totalFunctionalGap || 0) > 0 ||
                        (s.complianceGap     || 0) > 0 ||
                        (s.coverageGap       || 0) > 0 ||
                        (s.valuationGap      || 0) > 0 ||
                        (s.liabilityGap      || 0) > 0 ||
                        (s.currentRevenue    || 0) > 0 ||
                        (s.potentialRevenue  || 0) > 0
                    );
                    html += `<div class="qa-page">
    <div class="qa-section-label">SECTION 02 &middot; GAP ANALYSIS</div>
    <h1 class="qa-section-title">Gap Analysis Results</h1>`;

                    if (!streams.length) {
                        html += `<p class="qa-section-sub">No revenue stream data captured.</p></div>`;
                    } else {
                        const thirdOf      = s => (s.type === 'property-tax') ? (s.valuationGap || 0) : (s.liabilityGap || 0);
                        const thirdLabelOf = s => (s.type === 'property-tax') ? 'Valuation' : 'Liability';
                        const totals = streams.reduce((a, s) => ({
                            currentRevenue:   a.currentRevenue   + (s.currentRevenue   || 0),
                            potentialRevenue: a.potentialRevenue + (s.potentialRevenue || 0),
                            totalGap:         a.totalGap         + (s.totalFunctionalGap || 0),
                            compliance:       a.compliance       + (s.complianceGap    || 0),
                            coverage:         a.coverage         + (s.coverageGap      || 0),
                            third:            a.third            + thirdOf(s)
                        }), { currentRevenue: 0, potentialRevenue: 0, totalGap: 0, compliance: 0, coverage: 0, third: 0 });

                        const curSym = getCurrencyFromContext() || '$';

                        // Compact "B/M/K" formatter with 2 decimals — matches the
                        // Quick Analysis chart so values read consistently across pages.
                        const fmtGap = n => {
                            const v = Number(n) || 0;
                            if (Math.abs(v) >= 1e9) return (v/1e9).toFixed(2) + 'B';
                            if (Math.abs(v) >= 1e6) return (v/1e6).toFixed(2) + 'M';
                            if (Math.abs(v) >= 1e3) return (v/1e3).toFixed(2) + 'K';
                            return Math.round(v).toString();
                        };

                        html += `<p class="qa-section-sub">Streams ranked by total functional gap, broken out by gap type. Each bar's length is the stream's share of the largest gap; colour segments show how that gap composes across Compliance, Coverage, and Valuation / Liability.</p>`;

                        // --- SVG horizontal stacked bar chart (editorial) ---
                        // Mirrors the Prioritization tab's gapParetoChart but is
                        // rendered as inline SVG so it survives the network-blocked
                        // PDF pipeline. Polished with x-axis gridlines, per-row
                        // % share, larger bars, and totals in the legend.
                        const sortedStreams = [...streams].sort((a, b) => (b.totalFunctionalGap || 0) - (a.totalFunctionalGap || 0));
                        const maxGap = Math.max(1, ...sortedStreams.map(s => s.totalFunctionalGap || 0));

                        const W         = 720;
                        const padX      = 18;
                        const padTop    = 68;   // legend + sublegend totals
                        const xAxisH    = 32;   // tick labels + axis line
                        const labelColW = 200;
                        const valueColW = 110;
                        const rowH      = 52;   // tall rows: stream name + % subtitle + bar
                        const barH      = 22;   // chunkier bars
                        const chartW    = W - labelColW - valueColW - padX * 2;
                        const H         = padTop + xAxisH + sortedStreams.length * rowH;
                        const xBarStart = padX + labelColW;
                        const yAxisBase = padTop + sortedStreams.length * rowH;

                        const colCompliance = '#00689D';
                        const colCoverage   = '#10b981';
                        const colThird      = '#f59e0b';

                        // --- Legend with totals (matches the breakdown table footer) ---
                        const legendEntry = (x, color, label, amount) => `
        <rect x="${x}"       y="16"  width="11" height="11" fill="${color}" rx="2"/>
        <text x="${x + 17}"  y="25"  font-size="11" font-weight="600" fill="#1f2937">${esc(label)}</text>
        <text x="${x + 17}"  y="40"  font-size="10" font-weight="500" fill="#64748b">${esc(curSym)} ${esc(fmtGap(amount))}</text>`;

                        const legend = `<g font-family="'Inter','Segoe UI',sans-serif">
        ${legendEntry(padX,        colCompliance, 'Compliance',           totals.compliance)}
        ${legendEntry(padX + 150,  colCoverage,   'Coverage',             totals.coverage)}
        ${legendEntry(padX + 290,  colThird,      'Valuation / Liability', totals.third)}
    </g>`;

                        // --- X-axis: 5 evenly spaced ticks (0, 25%, 50%, 75%, 100%) ---
                        const tickCount = 5;
                        const niceMax   = maxGap;
                        const axisTicks = Array.from({ length: tickCount }, (_, i) => {
                            const frac = i / (tickCount - 1);
                            return {
                                x: xBarStart + frac * chartW,
                                val: niceMax * frac
                            };
                        });

                        const gridLines = axisTicks.map(t => `
        <line x1="${t.x.toFixed(2)}" y1="${padTop - 6}" x2="${t.x.toFixed(2)}" y2="${yAxisBase}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="2,3"/>`).join('');

                        const axisLabels = axisTicks.map(t => `
        <text x="${t.x.toFixed(2)}" y="${yAxisBase + 18}" text-anchor="middle" font-size="10" font-weight="500" fill="#94a3b8">${esc(curSym)} ${esc(fmtGap(t.val))}</text>`).join('');

                        const axisLine = `<line x1="${xBarStart}" y1="${yAxisBase + 2}" x2="${xBarStart + chartW}" y2="${yAxisBase + 2}" stroke="#cbd5e1" stroke-width="1"/>`;

                        // --- Rows ---
                        const rows = sortedStreams.map((s, i) => {
                            const y          = padTop + i * rowH;
                            const total      = s.totalFunctionalGap || 0;
                            const cw         = (s.complianceGap || 0) / maxGap * chartW;
                            const ow         = (s.coverageGap   || 0) / maxGap * chartW;
                            const tw         = thirdOf(s)             / maxGap * chartW;
                            const sharePct   = totals.totalGap > 0 ? Math.round(total / totals.totalGap * 100) : 0;
                            const xLabel     = padX + labelColW - 12;
                            const xValue     = padX + labelColW + chartW + 8;
                            const yName      = y + 14;
                            const yShare     = y + 28;
                            const yBar       = y + 32;
                            const rawLabel   = s.name || s.id || '';
                            const labelText  = rawLabel.length > 30 ? rawLabel.slice(0, 29) + '…' : rawLabel;
                            const excluded   = s.included === false;

                            // Inline segment labels (only if segment is wide enough)
                            const inlineLabel = (x, w, value, color) => {
                                if (w < 42) return '';
                                return `<text x="${(x + w/2).toFixed(2)}" y="${yBar + barH/2 + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">${esc(fmtGap(value))}</text>`;
                            };

                            return `<g font-family="'Inter','Segoe UI',sans-serif">
        <text x="${xLabel}" y="${yName}"  text-anchor="end" font-size="13" font-weight="700" fill="#0f2742">${esc(labelText)}${excluded ? ' <tspan font-size="9" fill="#94a3b8" font-weight="600"> · EXCL.</tspan>' : ''}</text>
        <text x="${xLabel}" y="${yShare}" text-anchor="end" font-size="10" font-weight="500" fill="#64748b">${sharePct}% of total gap</text>

        <rect x="${xBarStart}"            y="${yBar}" width="${cw.toFixed(2)}" height="${barH}" fill="${colCompliance}" rx="3"/>
        <rect x="${xBarStart + cw}"       y="${yBar}" width="${ow.toFixed(2)}" height="${barH}" fill="${colCoverage}"   rx="3"/>
        <rect x="${xBarStart + cw + ow}"  y="${yBar}" width="${tw.toFixed(2)}" height="${barH}" fill="${colThird}"      rx="3"/>
        ${inlineLabel(xBarStart,           cw, s.complianceGap || 0)}
        ${inlineLabel(xBarStart + cw,      ow, s.coverageGap   || 0)}
        ${inlineLabel(xBarStart + cw + ow, tw, thirdOf(s))}

        <text x="${xValue}" y="${yBar + barH/2 + 5}" font-size="13" font-weight="700" fill="#0f2742">${esc(curSym)} ${esc(fmtGap(total))}</text>
    </g>`;
                        }).join('');

                        html += `<div class="qa-chart-card">
    <div class="units-strip">
        <div class="title">Revenue Gap by Stream</div>
        <div class="units">AMOUNTS IN ${esc(curSym)}</div>
    </div>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:'Inter','Segoe UI',Arial,sans-serif;font-feature-settings:'tnum';">
        ${gridLines}
        ${legend}
        ${rows}
        ${axisLine}
        ${axisLabels}
    </svg>
</div>`;

                        // --- Streams × Gap-type breakdown table ---
                        // Type column was redundant with Stream (every stream
                        // already carries a self-describing name like "ParkingFee"
                        // or "BusinessLicense"), so we dropped it. The third
                        // gap column is labelled per-row as "Valuation" for
                        // property tax and "Liability" for everything else.
                        html += `<h3 class="qa-block-title">Streams &amp; Gaps Breakdown</h3>
<table class="report-table">
<thead><tr>
    <th style="text-align:left">Stream</th>
    <th style="text-align:right">Compliance</th>
    <th style="text-align:right">Coverage</th>
    <th style="text-align:right">Valuation / Liability</th>
    <th style="text-align:right">Total Gap</th>
</tr></thead><tbody>`;
                        sortedStreams.forEach(s => {
                            html += `<tr>
    <td>${esc(s.name || s.id || '')}${s.included === false ? ' <span class="badge">excluded</span>' : ''}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(s.complianceGap || 0))}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(s.coverageGap   || 0))}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(thirdOf(s)))} <span style="color:#7a8a99;font-size:0.78rem;">(${esc(thirdLabelOf(s))})</span></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</strong></td>
</tr>`;
                        });
                        html += `<tr class="tr-totals">
    <td><strong>Total</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.compliance))}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.coverage))}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.third))}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.totalGap))}</strong></td>
</tr>
</tbody></table>`;

                        html += `</div>`; // close .qa-page
                    }
                }

                // ===== Stream Prioritization =====
                // Section page (page 4): same editorial wrapper as pages 2 & 3.
                // Shows each included stream with its final rank, mode chip,
                // gap share bar, and any manual override marker.
                //
                // IMPORTANT: ranks here MUST match the website's Prioritization
                // tab. The state manager's getStreamsByGapRanking() sets
                // finalRank = adjustedRank || defaultRank, which produces wrong
                // (and sometimes duplicate) ranks when any stream is manually
                // adjusted. We replicate _Prioritization.cshtml's
                // calculateFinalRankings() logic here: weave adjusted streams
                // into their adjusted slots first, then fill the remaining
                // ranks with auto-sorted streams.
                if (options.includeStreamPrioritization) {
                    const allStreams = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getStreams() : [];
                    // Faithful port of _Prioritization.cshtml's render pipeline:
                    //
                    //   1. assignDefaultRanks() — sort the full populated stream set
                    //      by totalFunctionalGap desc, write defaultRank = idx+1 on
                    //      every stream (including excluded ones). (cshtml line ~1316)
                    //   2. For included streams, manualRank = adjustedRank || defaultRank.
                    //      (cshtml line 1403)
                    //   3. Stable-sort the included streams by manualRank — ties keep
                    //      original-array order. This is the key step that makes a
                    //      manually-set rank tie with an auto stream's default rank,
                    //      and the original order wins. (cshtml line 1410)
                    //   4. Renumber sequentially 1..N for display. (cshtml line 1412)
                    const populated = allStreams.filter(s => (parseFloat(s.totalFunctionalGap) || 0) > 0);
                    const byGap = populated.slice().sort((a, b) => (b.totalFunctionalGap || 0) - (a.totalFunctionalGap || 0));
                    byGap.forEach((s, i) => { s._defaultRank = i + 1; });

                    const includedStreams = populated.filter(s => s.included !== false);
                    includedStreams.forEach(s => {
                        s._manualRank = (s.adjustedRank != null) ? s.adjustedRank : s._defaultRank;
                    });

                    const ordered = includedStreams.slice().sort((a, b) => (a._manualRank || 999) - (b._manualRank || 999));
                    const ranked = ordered.map((s, i) => ({ ...s, finalRank: i + 1 }));

                    html += `<div class="qa-page">
    <div class="qa-section-label">SECTION 03 &middot; STREAM PRIORITIZATION</div>
    <h1 class="qa-section-title">Stream Prioritization</h1>`;

                    if (!ranked.length) {
                        html += `<p class="qa-section-sub">No streams included for prioritization.</p></div>`;
                    } else {
                        const totalRankedGap = ranked.reduce((a, s) => a + (s.totalFunctionalGap || 0), 0);
                        const maxGap = Math.max(1, ...ranked.map(s => s.totalFunctionalGap || 0));
                        // 1-decimal share so the table reads identically to the website.
                        const share1 = (part, whole) => whole > 0 ? (part / whole * 100).toFixed(1) : '0.0';

                        // Stream colour-dot palette mirrors _Prioritization.cshtml's
                        // streamColors map + generic palette (fixed cyan for property
                        // tax, orange for business license, cycling palette for
                        // generic streams).
                        const genericPalette = ['#00689D', '#10b981', '#EF4444', '#A855F7'];
                        const streamDotColor = (s) => {
                            if (s.id === 'property-tax')     return '#2BB8E2';
                            if (s.id === 'business-license') return '#F59E0B';
                            if (s.id && s.id.startsWith('generic-stream-')) {
                                const idx = parseInt(s.id.split('-').pop(), 10) || 0;
                                return genericPalette[idx % genericPalette.length];
                            }
                            return '#94a3b8';
                        };
                        // Podium colours for the first three ranks (gold / silver /
                        // bronze) — matches the website's coloured rank pills.
                        const rankClass = (r) => r === 1 ? 'prio-rank-1' : r === 2 ? 'prio-rank-2' : r === 3 ? 'prio-rank-3' : 'prio-rank-n';

                        // --- "What is Stream Prioritization?" explainer ---
                        html += `<div class="prio-explainer">
    <div class="prio-explainer-title">What is Stream Prioritization?</div>
    <p>Stream Prioritization ranks your revenue streams by their <strong>Total Functional Gap</strong> &mdash; the difference between current collection and what could realistically be collected if administration were strengthened.</p>
    <p><strong>Why it matters:</strong> Most cities have several revenue streams but limited reform capacity. Tackling the streams with the biggest gaps first generates the largest revenue uplift per unit of effort.</p>
    <p><strong>How to read this table:</strong> Rows are pre-ranked from largest gap to smallest. Streams marked <em>Excluded</em> have been dropped from share calculations and the downstream recommendations because they don't apply to this local government (e.g. a service the municipality doesn't provide).</p>
</div>`;

                        // --- Prioritization table — uses .report-table (same as
                        // page 3's Streams & Gaps Breakdown) for a consistent look ---
                        const renderIncludedRow = (s) => {
                            const share  = share1(s.totalFunctionalGap || 0, totalRankedGap);
                            const barPct = Math.max(2, Math.round(((s.totalFunctionalGap || 0) / maxGap) * 100));
                            return `<tr>
    <td style="text-align:center;width:50px"><span class="prio-rank ${rankClass(s.finalRank)}">${esc(String(s.finalRank))}</span></td>
    <td><span class="prio-stream-dot" style="background:${streamDotColor(s)}"></span><strong>${esc(s.name || '')}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</strong></td>
    <td style="text-align:right;width:60px">${share}%</td>
    <td style="width:170px">
        <div class="share-bar" style="min-width:120px"><div class="share-bar-fill" style="width:${barPct}%"></div></div>
    </td>
    <td style="width:90px"><span class="prio-status">Include</span></td>
</tr>`;
                        };

                        // Excluded streams (still populated, just dropped from prioritization)
                        const excludedPopulated = populated.filter(s => s.included === false);
                        const renderExcludedRow = (s) => `<tr class="row-excluded">
    <td style="text-align:center"><span class="prio-em">&mdash;</span></td>
    <td><span class="prio-stream-dot" style="background:${streamDotColor(s)};opacity:0.5"></span>${esc(s.name || '')}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</td>
    <td style="text-align:right"><span class="prio-em">&mdash;</span></td>
    <td><span class="prio-em">&mdash;</span></td>
    <td><span class="prio-status status-exclude">Exclude</span></td>
</tr>`;

                        html += `<table class="report-table">
<thead><tr>
    <th style="width:50px;text-align:center">Rank</th>
    <th>Stream</th>
    <th style="text-align:right;width:110px">Total Gap</th>
    <th style="text-align:right;width:60px">Share</th>
    <th style="width:170px">&nbsp;</th>
    <th style="width:90px">Status</th>
</tr></thead>
<tbody>
    ${ranked.map(renderIncludedRow).join('')}
    ${excludedPopulated.map(renderExcludedRow).join('')}
    <tr class="tr-totals">
        <td style="text-align:center"><span class="prio-em">&mdash;</span></td>
        <td><strong>Total (Included Streams)</strong></td>
        <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totalRankedGap))}</strong></td>
        <td style="text-align:right"><strong>100%</strong></td>
        <td>&nbsp;</td>
        <td><span class="prio-em">&mdash;</span></td>
    </tr>
</tbody>
</table>`;

                        html += `</div>`; // close .qa-page
                    }
                }

                // ===== Gap Prioritization =====
                // Section page (page 5): editorial header + explainer card + a
                // streams × priorities matrix that mirrors the website's
                // "Gap Sequencing by Stream & Gap Amounts by Priority" table.
                // (Internally still gated by includeGapSequencing; the user-
                // facing name is "Gap Prioritization" to match the site.)
                if (options.includeGapSequencing) {
                    const priority = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getMasterPriorityList() : [];

                    // Re-rank streams with the same algorithm as page 4 so the
                    // ranks shown here stay consistent across pages.
                    const allStreamsGP = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getStreams() : [];
                    const populatedGP = allStreamsGP.filter(s => (parseFloat(s.totalFunctionalGap) || 0) > 0);
                    populatedGP.slice().sort((a, b) => (b.totalFunctionalGap || 0) - (a.totalFunctionalGap || 0))
                        .forEach((s, i) => { s._defaultRank = i + 1; });
                    const includedGP = populatedGP.filter(s => s.included !== false);
                    includedGP.forEach(s => { s._manualRank = (s.adjustedRank != null) ? s.adjustedRank : s._defaultRank; });
                    const rankedGP = includedGP.slice().sort((a, b) => (a._manualRank || 999) - (b._manualRank || 999))
                        .map((s, i) => ({ ...s, finalRank: i + 1 }));

                    // Group priority items by streamId, then map onto each ranked stream.
                    const byStreamId = new Map();
                    priority.forEach(p => {
                        if (!byStreamId.has(p.streamId)) byStreamId.set(p.streamId, []);
                        byStreamId.get(p.streamId).push(p);
                    });

                    const streamRows = rankedGP.map(s => {
                        const items = byStreamId.get(s.id) || [];
                        const byPri = {};
                        items.forEach(it => { byPri[it.gapPriority] = it; });
                        return {
                            id: s.id,
                            name: s.name,
                            rank: s.finalRank,
                            mode: RosraStateManager.getStreamMode(s.id),
                            p1: byPri[1] || null,
                            p2: byPri[2] || null,
                            p3: byPri[3] || null
                        };
                    });

                    html += `<div class="qa-page">
    <div class="qa-section-label">SECTION 04 &middot; GAP PRIORITIZATION</div>
    <h1 class="qa-section-title">Gap Prioritization</h1>`;

                    if (!streamRows.length || !priority.length) {
                        html += `<p class="qa-section-sub">No sequenced gaps available.</p></div>`;
                    } else {
                        const modeLabel = {
                            'revenue-potential': 'Revenue Potential',
                            'compliance-first':  'Compliance First',
                            'overhaul':          'Overhaul'
                        };
                        const modeClass = {
                            'revenue-potential': 'mode-rp',
                            'compliance-first':  'mode-cf',
                            'overhaul':          'mode-oh'
                        };
                        const genericPaletteGP = ['#00689D', '#10b981', '#EF4444', '#A855F7'];
                        const streamDotColorGP = (id) => {
                            if (id === 'property-tax')     return '#2BB8E2';
                            if (id === 'business-license') return '#F59E0B';
                            if (id && id.startsWith('generic-stream-')) {
                                const idx = parseInt(id.split('-').pop(), 10) || 0;
                                return genericPaletteGP[idx % genericPaletteGP.length];
                            }
                            return '#94a3b8';
                        };
                        const rankClassGP = (r) => r === 1 ? 'prio-rank-1' : r === 2 ? 'prio-rank-2' : r === 3 ? 'prio-rank-3' : 'prio-rank-n';
                        const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

                        // --- "What is Gap Prioritization?" explainer ---
                        html += `<div class="prio-explainer">
    <div class="prio-explainer-title">What is Gap Prioritization?</div>
    <p>Gap Prioritization breaks each prioritized revenue stream down by the <strong>type of gap</strong> driving its underperformance &mdash; Compliance, Coverage, Valuation/Liability, or the mixed combinations &mdash; and lets you sequence which gaps to tackle first within each stream.</p>
    <p><strong>Why it matters:</strong> A stream's overall gap may look the same on the surface, but a Compliance gap (people billed but not paying) needs very different reforms from a Coverage gap (units not even on the books) or a Valuation gap (assessed below market value). Sequencing tells the reform team where to start.</p>
    <p>Pick one of three <strong>modes</strong> per stream &mdash; Revenue Potential (biggest dollar gap first), Compliance First (collect what's already billed), or Overhaul (re-engineer the whole stream) &mdash; and ROSRA suggests an opening priority order. The team can override any cell to fit local capacity and politics, or remove a gap-type that's not feasible.</p>
</div>`;

                        // --- Streams × Priorities table (uses .report-table) ---
                        const renderPriCell = (priNum, item) => {
                            if (!item) return '<span class="prio-em">&mdash;</span>';
                            return `<div class="prio-pcell">
        <span class="prio-pb prio-pb-${priNum}">${priNum}</span>
        <div class="prio-pcell-body">
            <div class="prio-pcell-type">${esc(cap(item.gapType || ''))}</div>
            <div class="prio-pcell-amount">${esc(formatCurrencyCompact(item.gapAmount || 0))}</div>
        </div>
    </div>`;
                        };

                        html += `<table class="report-table">
<thead><tr>
    <th style="width:50px;text-align:center">Rank</th>
    <th>Stream</th>
    <th style="width:130px">Mode</th>
    <th>Priority 1</th>
    <th>Priority 2</th>
    <th>Priority 3</th>
</tr></thead>
<tbody>`;
                        streamRows.forEach(row => {
                            html += `<tr>
    <td style="text-align:center"><span class="prio-rank ${rankClassGP(row.rank)}">${row.rank}</span></td>
    <td><span class="prio-stream-dot" style="background:${streamDotColorGP(row.id)}"></span><strong>${esc(row.name)}</strong></td>
    <td><span class="mode-chip mode-chip-upper ${modeClass[row.mode] || ''}">${esc(modeLabel[row.mode] || row.mode || '')}</span></td>
    <td>${renderPriCell(1, row.p1)}</td>
    <td>${renderPriCell(2, row.p2)}</td>
    <td>${renderPriCell(3, row.p3)}</td>
</tr>`;
                        });
                        html += `</tbody></table>`;

                        html += `</div>`; // close .qa-page
                    }
                }

                // ===== Recommendations Summary =====
                // v2 brief §5: the action-plan report does NOT reproduce the
                // solution catalogue. Section is now a single short paragraph
                // pointing the reader back to the live Recommendations page.
                // The platform URL is built from window.location.origin at
                // generation time so the link is clickable in the PDF and
                // resolves to whichever environment (localhost / dev / prod)
                // the user is on when they export.
                if (options.includeSelectedSolutions) {
                    const platformOrigin = (typeof window !== 'undefined' && window.location && window.location.origin)
                        ? window.location.origin
                        : '';
                    const recommendationsUrl = platformOrigin
                        ? platformOrigin + '/Rosra#recommendations'
                        : '/Rosra#recommendations';
                    const recommendationsDisplay = platformOrigin
                        ? platformOrigin.replace(/^https?:\/\//, '') + '/Rosra'
                        : '/Rosra';

                    html += `<div class="qa-page">
    <div class="qa-section-label">SECTION 05 &middot; RECOMMENDATIONS</div>
    <h1 class="qa-section-title">Recommended Solutions</h1>
    <p class="qa-section-sub">Based on your prioritized streams and gap types, ROSRA has identified the reform options most relevant to this assessment. This report does not reproduce the full solution catalogue. To review each solution &mdash; including implementation steps, timeline, feasibility considerations, stakeholders and monitoring guidance &mdash; open the Recommendations page of the platform.</p>
    <a class="rec-platform-cta" href="${esc(recommendationsUrl)}" target="_blank" rel="noopener" style="display:block;margin-top:24px;padding:18px 22px;background:linear-gradient(135deg,#E6F4FB 0%,#F0FAFD 100%);border:1.5px solid #00B2E3;border-radius:12px;text-decoration:none;color:#0F2742;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
            <div>
                <div style="font-weight:700;font-size:1.05rem;color:#00689D;letter-spacing:0.01em;">Open Recommendations on the ROSRA platform &rarr;</div>
                <div style="font-size:0.85rem;color:#475569;margin-top:4px;font-family:'Courier New',monospace;">${esc(recommendationsDisplay)}</div>
            </div>
        </div>
    </a>
</div>`;
                }

                // ===== Solutions Not Selected (Summary Only) =====
                if (options.includeSkippedSolutions) {
                    const catalog = (typeof SolutionsDatabase !== 'undefined') ? SolutionsDatabase.getAllSolutions() : [];
                    const selectedIds = new Set(selectedSolutions.map(s => s.solutionId));
                    const skipped = catalog.filter(s => !selectedIds.has(s.solutionId));
                    html += `<h2>Solutions Not Selected</h2>`;
                    if (!skipped.length) {
                        html += `<p><em>All catalog solutions were selected.</em></p>`;
                    } else {
                        html += `<p class="r-meta">${skipped.length} of ${catalog.length} catalog solutions were not selected.</p>`;
                        html += `<ul class="report-skipped-list">`;
                        skipped.forEach(s => {
                            const fullId = buildFullIdLabel(s.solutionId, s);
                            const stream = s.stream || '';
                            const gap = s.gap || '';
                            html += `<li><span class="r-card-id">${esc(fullId)}</span> ${esc(s.title || '')}` +
                                (stream || gap ? ` <span class="r-meta">&middot; ${esc(stream)}${stream && gap ? ' &middot; ' : ''}${esc(gap)}</span>` : '') +
                                `</li>`;
                        });
                        html += `</ul>`;
                    }
                }

                // ===== Timeline View =====
                if (options.includeTimeline) {
                    html += `<h2>Timeline View</h2>`;
                    const tlBlock = (cls, title, subtitle, items) => {
                        if (!items.length) return '';
                        let out = `<div class="tl-block ${cls}">
    <div class="tl-title">${esc(title)} &middot; ${items.length} solution${items.length !== 1 ? 's' : ''}</div>
    <div class="tl-sub">${esc(subtitle)}</div>`;
                        items.forEach(s => {
                            const fs = getCompleteSolution(s.solutionId);
                            const fullId = buildFullIdLabel(s.solutionId, fs);
                            const t = fs?.title || s.title || '';
                            out += `<div class="tl-item"><span class="tl-item-id">${esc(fullId)}</span>${esc(t)}</div>`;
                        });
                        out += `</div>`;
                        return out;
                    };
                    const any = quickWins.length + mediumTerm.length + longTerm.length;
                    if (any === 0) html += `<p><em>No timeline data.</em></p>`;
                    html += tlBlock('quick', 'Quick Wins', 'Less than 1 year', quickWins);
                    html += tlBlock('medium', 'Medium Term', '1-3 years', mediumTerm);
                    html += tlBlock('long', 'Long Term', '3+ years', longTerm);
                }

                // ===== Progress Tracker =====
                if (options.includeProgressTracker) {
                    html += `<h2>Progress Tracker</h2>`;
                    if (!selectedSolutions.length) {
                        html += `<p><em>No solutions selected.</em></p>`;
                    } else {
                        selectedSolutions.forEach(solution => {
                            const fs = getCompleteSolution(solution.solutionId);
                            if (!fs) return;
                            const fullId = buildFullIdLabel(solution.solutionId, fs);
                            const groups = extractMilestoneGroups(fs);
                            const flat = flattenMilestones(groups);
                            const solProgress = progressData[solution.solutionId] || {};
                            const completed = Object.values(solProgress).filter(v => v === 'completed').length;
                            const pct = flat.length ? Math.round((completed / flat.length) * 100) : 0;

                            html += `<div class="pr-block">
    <div class="pr-head">
        <div>
            <div class="pr-title">${esc(fs.title || '')}</div>
            <div class="r-meta"><span class="r-card-id">${esc(fullId)}</span></div>
        </div>
        <div class="pr-pct">${pct}%</div>
    </div>
    <div class="pr-bar"><div class="pr-bar-fill" style="width:${pct}%"></div></div>`;

                            if (!flat.length) {
                                html += `<p><em>No milestones defined for this solution.</em></p>`;
                            } else {
                                let idx = 0;
                                groups.forEach(group => {
                                    if (group.phase) html += `<div class="pr-phase">${esc(group.phase)}</div>`;
                                    group.items.forEach(text => {
                                        const status = solProgress[idx] || 'not-started';
                                        html += `<div class="pr-m"><div style="flex:1">${esc(text)}</div>${statusPillHtml(status)}</div>`;
                                        idx++;
                                    });
                                });
                            }
                            html += `</div>`;
                        });
                    }
                }

                // ===== Resource Requirements =====
                // Consolidates the "Capacity, Systems & Partnerships" bullets across every
                // selected solution so decision-makers see in one place what staffing, tech,
                // and partners the plan actually needs.
                if (options.includeResources) {
                    html += `<h2>Resource Requirements</h2>`;
                    if (!selectedSolutions.length) {
                        html += `<p><em>No solutions selected.</em></p>`;
                    } else {
                        let rendered = 0;
                        selectedSolutions.forEach(solution => {
                            const fs = getCompleteSolution(solution.solutionId);
                            if (!fs) return;
                            const fd = fs.fullDetails || {};
                            const items = fd.capacitySystemsPartnerships || fs.administrativeEssentials;
                            const list = renderReportList(items);
                            if (!list) return;
                            const fullId = buildFullIdLabel(solution.solutionId, fs);
                            html += `<div class="r-card">
    <div class="r-card-head">
        <div class="r-card-id">${esc(fullId)}</div>
        <div class="r-card-title">${esc(fs.title || '')}</div>
    </div>
    <div class="r-section">${list}</div>
</div>`;
                            rendered++;
                        });
                        if (!rendered) {
                            html += `<p><em>No resource requirements captured for the selected solutions.</em></p>`;
                        }
                    }
                }

                html += `<div class="footer">
    Generated by ROSRA &middot; Rapid Own-Source Revenue Analysis Tool &middot; UN-Habitat
</div>
</body>
</html>`;

                return html;
            }

            // Copy solution to clipboard
            function copyToClipboard(solutionId) {
                const fullSolution = getCompleteSolution(solutionId);
                if (!fullSolution) return;

                const ov = fullSolution.overview || {};
                const fd = fullSolution.fullDetails || {};
                const overviewText = ov.whatThisOptionDoes || ov.whatThisSolves || '';

                const parts = [`${solutionId}: ${fullSolution.title}`, ''];
                if (overviewText) parts.push('OVERVIEW', overviewText, '');

                const add = (title, val) => {
                    const t = listToText(val);
                    if (t) parts.push(title, t, '');
                };

                add('WHY THIS CARD MATTERS', fd.whyThisMatters);
                add('WHEN THIS IS A STRONG FIT', fd.whenStrongFit);
                add('WHAT TO LINE UP FIRST', fd.whatToLineUpFirst);
                add('DESIGN CHOICES TO SETTLE EARLY', fd.designChoices);

                if (fd.practicalPath) {
                    const p = fd.practicalPath;
                    const pathLines = [];
                    if (p.first90Days?.length) pathLines.push('First 90 days:', listToText(p.first90Days));
                    if (p.sixTo12Months?.length) pathLines.push('6 to 12 months:', listToText(p.sixTo12Months));
                    if (p.twelveToTwentyFourMonths?.length) pathLines.push('12 to 24 months and beyond:', listToText(p.twelveToTwentyFourMonths));
                    if (pathLines.length) parts.push('PRACTICAL IMPLEMENTATION PATH', pathLines.join('\n'), '');
                }

                add('LEGAL AND INSTITUTIONAL POINTS', fd.legalInstitutional || fullSolution.legalEssentials);
                add('CAPACITY, SYSTEMS, AND PARTNERSHIP NEEDS', fd.capacitySystemsPartnerships || fullSolution.administrativeEssentials);
                add('MAIN RISKS AND PRACTICAL SAFEGUARDS', fd.risksAndSafeguards || fullSolution.whenNotApplicable);
                add('WHAT TO MONITOR', fd.whatToMonitor);
                add('HOW THIS CONNECTS TO OTHER CARDS', fd.connectionsToOtherCards);
                add('QUESTIONS TO SETTLE BEFORE LAUNCH', fd.questionsBeforeLaunch);

                if (!fd.whyThisMatters && fullSolution.howItWorks) parts.push('HOW IT WORKS', fullSolution.howItWorks, '');
                if (!fd.practicalPath && fullSolution.implementationMilestones?.length) add('IMPLEMENTATION MILESTONES', fullSolution.implementationMilestones);
                if (fullSolution.caseNotes) parts.push('CASE NOTES', fullSolution.caseNotes, '');

                navigator.clipboard.writeText(parts.join('\n')).then(() => {
                    alert('Solution copied to clipboard!');
                });
            }

            // Helpers for printable/copy output that support both new and legacy card formats
            function listToHtml(val) {
                if (!val) return '';
                if (Array.isArray(val)) {
                    return val.length ? '<ul>' + val.map(i => '<li>' + escapeForTemplate(i) + '</li>').join('') + '</ul>' : '';
                }
                return '<p>' + escapeForTemplate(String(val)).replace(/\n/g, '<br>') + '</p>';
            }

            function section(title, contentHtml) {
                return contentHtml ? '<h2>' + escapeForTemplate(title) + '</h2>' + contentHtml : '';
            }

            function listToText(val) {
                if (!val) return '';
                if (Array.isArray(val)) return val.map((i, idx) => (idx + 1) + '. ' + i).join('\n');
                return String(val);
            }

            // Print single solution
            function printSolution(solutionId) {
                const fullSolution = getCompleteSolution(solutionId);
                if (!fullSolution) return;

                const solution = selectedSolutions.find(s => s.solutionId === solutionId) || { streamName: '', gapType: '', timeline: '' };
                const ov = fullSolution.overview || {};
                const fd = fullSolution.fullDetails || {};
                const overviewText = ov.whatThisOptionDoes || ov.whatThisSolves || '';

                let body = '';
                body += section('Overview', overviewText ? '<p>' + escapeForTemplate(overviewText).replace(/\n/g, '<br>') + '</p>' : '');

                // New format sections
                body += section('Why This Card Matters', listToHtml(fd.whyThisMatters));
                body += section('When This Is a Strong Fit', listToHtml(fd.whenStrongFit));
                body += section('What to Line Up First', listToHtml(fd.whatToLineUpFirst));
                body += section('Design Choices to Settle Early', listToHtml(fd.designChoices));

                if (fd.practicalPath) {
                    const p = fd.practicalPath;
                    let path = '';
                    if (p.first90Days?.length) path += '<h3 style="font-size:1em;margin-top:12px;">First 90 days</h3>' + listToHtml(p.first90Days);
                    if (p.sixTo12Months?.length) path += '<h3 style="font-size:1em;margin-top:12px;">6 to 12 months</h3>' + listToHtml(p.sixTo12Months);
                    if (p.twelveToTwentyFourMonths?.length) path += '<h3 style="font-size:1em;margin-top:12px;">12 to 24 months and beyond</h3>' + listToHtml(p.twelveToTwentyFourMonths);
                    body += section('Practical Implementation Path', path);
                }

                body += section('Legal and Institutional Points', listToHtml(fd.legalInstitutional || fullSolution.legalEssentials));
                body += section('Capacity, Systems, and Partnership Needs', listToHtml(fd.capacitySystemsPartnerships || fullSolution.administrativeEssentials));
                body += section('Main Risks and Practical Safeguards', listToHtml(fd.risksAndSafeguards || fullSolution.whenNotApplicable));
                body += section('What to Monitor', listToHtml(fd.whatToMonitor));
                body += section('How This Connects to Other Cards', listToHtml(fd.connectionsToOtherCards));
                body += section('Questions to Settle Before Launch', listToHtml(fd.questionsBeforeLaunch));

                // Legacy fallbacks
                if (!fd.whyThisMatters && fullSolution.howItWorks) {
                    body += section('How It Works', '<p>' + escapeForTemplate(fullSolution.howItWorks).replace(/\n/g, '<br>') + '</p>');
                }
                if (!fd.practicalPath && fullSolution.implementationMilestones?.length) {
                    body += section('Implementation Milestones',
                        fullSolution.implementationMilestones.map((m, i) => '<div class="milestone"><span class="milestone-num">' + (i + 1) + '</span><span>' + escapeForTemplate(m) + '</span></div>').join(''));
                }
                if (fullSolution.caseNotes) {
                    body += section('Case Notes', '<p><em>' + escapeForTemplate(fullSolution.caseNotes) + '</em></p>');
                }

                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${solutionId}: ${fullSolution.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b; }
                            h1 { color: #1976D2; font-size: 1.5em; margin-bottom: 4px; }
                            h2 { color: #333; font-size: 1.1em; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 22px; }
                            ul { margin: 10px 0; padding-left: 25px; }
                            li { margin: 4px 0; line-height: 1.5; }
                            .meta { color: #555; margin-bottom: 18px; font-size: 0.95em; }
                            .milestone { display: flex; gap: 10px; margin: 8px 0; }
                            .milestone-num { background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
                        </style>
                    </head>
                    <body>
                        <h1>${escapeForTemplate(solutionId)}: ${escapeForTemplate(fullSolution.title)}</h1>
                        <p class="meta"><strong>Stream:</strong> ${escapeForTemplate(solution.streamName)} &nbsp;|&nbsp; <strong>Gap:</strong> ${escapeForTemplate(solution.gapType)} &nbsp;|&nbsp; <strong>Timeline:</strong> ${escapeForTemplate(solution.timeline)}${fullSolution.deliveryDifficulty ? ' &nbsp;|&nbsp; <strong>Difficulty:</strong> ' + escapeForTemplate(fullSolution.deliveryDifficulty) : ''}${fullSolution.politicalSensitivity ? ' &nbsp;|&nbsp; <strong>Political sensitivity:</strong> ' + escapeForTemplate(fullSolution.politicalSensitivity) : ''}</p>
                        ${body || '<p><em>No detail content available for this card.</em></p>'}
                    </body>
                    </html>
                `;

                const printWindow = window.open('', '_blank');
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => printWindow.print(), 500);
            }

            // Public API
            return {
                init,
                toggleSolution,
                toggleStream,
                toggleGap,
                switchView,
                filterByTimeline,
                toggleMilestone,
                updateMilestoneStatus,
                resetAllProgress,
                exportProgress,
                goToOverviewSelection,
                openReportModal,
                generateReport,
                copyToClipboard,
                printSolution
            };
        })();

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        RecommendationsModule.init();
    });
