        // Recommendations Module
        const RecommendationsModule = (function() {
            'use strict';

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
            }

            // Load selected solutions from form field (primary) with localStorage fallback
            function loadSelectedSolutions() {
                try {
                    // Use FormStateManager for form field binding (best practice)
                    if (typeof FormStateManager !== 'undefined') {
                        const data = FormStateManager.getData('rosraSelectedSolutions');
                        if (data && Array.isArray(data)) {
                            selectedSolutions = data;
                            console.log('Recommendations: Loaded', selectedSolutions.length, 'solutions from FormStateManager');
                            return;
                        }
                    }

                    // Fallback to localStorage
                    const stored = localStorage.getItem('rosraSelectedSolutions');
                    if (stored) {
                        selectedSolutions = JSON.parse(stored);
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
                    html += `
                        <div class="stream-section" data-stream-key="${streamKey}">
                            <div class="stream-header" onclick="RecommendationsModule.toggleStream('${streamKey}')" style="cursor:pointer;">
                                <h3><i class="bi bi-bar-chart-fill me-2"></i> ${streamName}</h3>
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <span class="stream-rank">Rank #${streamData.rank}</span>
                                    <button type="button" class="stream-toggle-btn" id="stream-icon-${streamKey}" aria-label="Collapse ${streamName}" title="Collapse" onclick="event.stopPropagation(); RecommendationsModule.toggleStream('${streamKey}')">
                                        <i class="bi bi-dash-lg"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="stream-body" id="stream-body-${streamKey}">
                    `;

                    // Sort gaps by priority
                    const sortedGaps = Object.entries(streamData.gaps)
                        .sort((a, b) => a[1].priority - b[1].priority);

                    sortedGaps.forEach(([gapType, gapData], gapIdx) => {
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

                // Difficulty/sensitivity badges
                const diffBadge = fullSolution.deliveryDifficulty ? '<span class="badge bg-light text-dark border ms-1" style="font-size:0.65rem;">' + escapeForTemplate(fullSolution.deliveryDifficulty) + '</span>' : '';
                const polBadge = fullSolution.politicalSensitivity ? '<span class="badge bg-light text-dark border ms-1" style="font-size:0.65rem;">Pol: ' + escapeForTemplate(fullSolution.politicalSensitivity) + '</span>' : '';

                const fullIdLabel = buildFullIdLabel(solution.solutionId, fullSolution);

                return `
                    <div class="solution-card" data-solution-id="${solution.solutionId}">
                        <div class="solution-card-header" onclick="RecommendationsModule.toggleSolution('${solution.solutionId}')">
                            <div class="solution-title-section">
                                <div class="solution-id">${escapeForTemplate(fullIdLabel)}</div>
                                <div class="solution-title">${fullSolution.title}</div>
                                <div class="solution-meta">
                                    <span class="timeline-badge ${timelineClass}">${solution.timeline}</span>
                                    ${diffBadge}${polBadge}
                                    <span>${solution.streamName} | ${solution.gapType}</span>
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

            // Generate report
            function generateReport() {
                console.log('[Report] generateReport() called');
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

                    const html = buildReportHtml(options);
                    console.log('[Report] html built, length=', html.length);

                    const modalEl = document.getElementById('reportModal');
                    const genBtn = modalEl ? modalEl.querySelector('.modal-footer .btn-primary') : null;
                    const originalBtnHtml = genBtn ? genBtn.innerHTML : null;
                    if (genBtn) {
                        genBtn.disabled = true;
                        genBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating…';
                    }

                    const closeModal = () => {
                        if (genBtn) {
                            genBtn.disabled = false;
                            if (originalBtnHtml !== null) genBtn.innerHTML = originalBtnHtml;
                        }
                        const inst = modalEl && window.bootstrap ? bootstrap.Modal.getInstance(modalEl) : null;
                        if (inst) { try { inst.hide(); } catch (_) {} }
                    };

                    const dispatch = () => {
                        console.log('[Report] dispatching format=', format);
                        // Server-attached downloads (HTML blob / base64 PDF) take ~100 ms for HTML
                        // and ~2-3 s for PDF rendering. Close the modal after a short delay so the
                        // user sees the "Generating…" state confirm their click worked.
                        if (format === 'html') {
                            downloadReportHtml(html);
                            setTimeout(closeModal, 400);
                        } else if (format === 'pdf') {
                            // downloadReportPdf is async internally; it logs "PDF built, posting to
                            // server…" when the form is submitted. We close shortly after that.
                            downloadReportPdf(html, closeModal);
                        } else {
                            printReportHtml(html);
                            setTimeout(closeModal, 400);
                        }
                    };

                    dispatch();
                } catch (err) {
                    console.error('[Report] generateReport failed', err);
                    alert('Report generation failed: ' + (err && err.message ? err.message : err));
                    const modalEl = document.getElementById('reportModal');
                    const genBtn = modalEl ? modalEl.querySelector('.modal-footer .btn-primary') : null;
                    if (genBtn) { genBtn.disabled = false; }
                }
            }

            // Download the report as a standalone .html file via the server,
            // so browsers honor the Content-Disposition: attachment response.
            function downloadReportHtml(html) {
                const dateStamp = new Date().toISOString().slice(0, 10);
                downloadViaServer(html, `rosra-action-plan-${dateStamp}.html`, 'text/html; charset=utf-8', 'utf8');
            }

            // Post the built HTML to the server, which renders it to PDF via headless
            // Chromium (Playwright) and returns the file as a normal attachment download.
            // This replaces the earlier client-side html2pdf path, which silently produced
            // blank captures in some browsers.
            function downloadReportPdf(html, onDone) {
                console.log('[Report] downloadReportPdf() start, html length=', html.length);
                const dateStamp = new Date().toISOString().slice(0, 10);
                const filename = `rosra-action-plan-${dateStamp}.pdf`;
                const finish = () => { try { if (typeof onDone === 'function') onDone(); } catch (_) {} };

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
                form.action = '/Rosra/RenderReportPdf';
                form.target = FRAME_ID;
                form.enctype = 'application/x-www-form-urlencoded';
                form.acceptCharset = 'UTF-8';
                form.style.display = 'none';

                const fields = { html: html, filename: filename };
                for (const k in fields) {
                    const i = document.createElement('input');
                    i.type = 'hidden';
                    i.name = k;
                    i.value = fields[k];
                    form.appendChild(i);
                }

                document.body.appendChild(form);
                console.log('[Report] posting HTML to /Rosra/RenderReportPdf for Playwright render');
                form.submit();
                setTimeout(() => { try { form.remove(); } catch (_) {} }, 30000);

                // Close the modal once the request is committed; the attachment download
                // proceeds in the hidden iframe without interrupting the page.
                setTimeout(finish, 400);
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

                const styles = `
                    body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #243746; margin: 0; padding: 40px; max-width: 1040px; margin-left: auto; margin-right: auto; line-height: 1.5; }
                    h1 { color: #00689D; margin: 0 0 4px 0; font-size: 1.9rem; }
                    h2 { color: #00689D; border-bottom: 2px solid #00689D; padding-bottom: 6px; margin-top: 34px; }
                    h3 { color: #1a3a52; margin-top: 22px; margin-bottom: 6px; }
                    h4 { color: #2c4a63; margin: 14px 0 4px 0; font-size: 1rem; }
                    h5 { color: #5d7a8f; margin: 10px 0 4px 0; font-size: 0.9rem; }
                    .cover { padding-bottom: 16px; border-bottom: 3px solid #00689D; margin-bottom: 16px; }
                    .cover .subtitle { color: #5d7a8f; font-size: 0.95rem; }
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
                    .tl-block { border-left: 4px solid #10b981; padding: 12px 14px; margin: 12px 0; background: #f0fdf4; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
                    .tl-block.medium { border-color: #f59e0b; background: #fffbeb; }
                    .tl-block.long { border-color: #0369a1; background: #f0f7fc; }
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
                    @@page { size: A4; margin: 18mm 14mm; }
                    @@media print {
                        body { padding: 0; }
                        .r-card, .tl-block, .pr-block { page-break-inside: avoid; }
                        h2 { page-break-before: auto; }
                    }
                `;

                let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Revenue Enhancement Action Plan</title>
<style>${styles}</style>
</head>
<body>
<div class="cover">
    <h1>Revenue Enhancement Action Plan</h1>
    <div class="subtitle">Generated ${esc(new Date().toLocaleDateString())} &middot; ROSRA &middot; UN-Habitat</div>
</div>`;

                // Shared helper for the gap-related sections below
                const pct = (part, whole) => whole > 0 ? Math.round((part / whole) * 100) : 0;

                if (options.includeExecSummary) {
                    html += `<h2>Executive Summary</h2>
<div class="stat-grid">
    <div class="stat"><div class="v">${total}</div><div class="l">Solutions Selected</div></div>
    <div class="stat"><div class="v">${quickWins.length}</div><div class="l">Quick Wins (&lt;1 year)</div></div>
    <div class="stat"><div class="v">${mediumTerm.length}</div><div class="l">Medium Term (1-3 years)</div></div>
    <div class="stat"><div class="v">${longTerm.length}</div><div class="l">Long Term (3+ years)</div></div>
</div>`;
                }

                // ===== Gap Analysis Results =====
                if (options.includeGapAnalysis) {
                    const streams = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getStreams() : [];
                    html += `<h2>Gap Analysis Results</h2>`;
                    if (!streams.length) {
                        html += `<p><em>No revenue stream data captured.</em></p>`;
                    } else {
                        // Aggregate totals across all streams
                        const thirdOf = s => (s.type === 'property-tax') ? (s.valuationGap || 0) : (s.liabilityGap || 0);
                        const totals = streams.reduce((a, s) => ({
                            currentRevenue: a.currentRevenue + (s.currentRevenue || 0),
                            potentialRevenue: a.potentialRevenue + (s.potentialRevenue || 0),
                            totalGap: a.totalGap + (s.totalFunctionalGap || 0),
                            compliance: a.compliance + (s.complianceGap || 0),
                            coverage: a.coverage + (s.coverageGap || 0),
                            third: a.third + thirdOf(s)
                        }), { currentRevenue: 0, potentialRevenue: 0, totalGap: 0, compliance: 0, coverage: 0, third: 0 });

                        const collectionRate = pct(totals.currentRevenue, totals.potentialRevenue);

                        // --- Top-line KPI strip ---
                        html += `<div class="stat-grid">
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(totals.currentRevenue))}</div><div class="l">Current Revenue</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(totals.potentialRevenue))}</div><div class="l">Potential Revenue</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(totals.totalGap))}</div><div class="l">Total Functional Gap</div></div>
    <div class="stat"><div class="v">${collectionRate}%</div><div class="l">Collection Rate</div></div>
</div>`;

                        // --- Overview table with Potential + % of Potential + totals row ---
                        html += `<h3>Stream Overview</h3>
<table class="report-table">
<thead><tr>
    <th style="text-align:left">Stream</th>
    <th style="text-align:left">Type</th>
    <th style="text-align:right">Current</th>
    <th style="text-align:right">Potential</th>
    <th style="text-align:right">Gap</th>
    <th style="text-align:right">Gap % of Potential</th>
</tr></thead><tbody>`;
                        streams.forEach(s => {
                            const gapPct = pct(s.totalFunctionalGap || 0, s.potentialRevenue || 0);
                            const typeLabel = (s.type || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                            html += `<tr>
    <td>${esc(s.name || s.id || '')}${s.included === false ? ' <span class="badge">excluded</span>' : ''}</td>
    <td>${esc(typeLabel)}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(s.currentRevenue || 0))}</td>
    <td style="text-align:right">${esc(formatCurrencyCompact(s.potentialRevenue || 0))}</td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</strong></td>
    <td style="text-align:right">${gapPct}%</td>
</tr>`;
                        });
                        html += `<tr class="tr-totals">
    <td colspan="2"><strong>Total</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.currentRevenue))}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.potentialRevenue))}</strong></td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(totals.totalGap))}</strong></td>
    <td style="text-align:right"><strong>${pct(totals.totalGap, totals.potentialRevenue)}%</strong></td>
</tr>
</tbody></table>`;

                        // --- Per-stream gap breakdown with proportional bars + KPI ratios ---
                        html += `<h3>Gap Breakdown by Stream</h3>`;
                        streams.forEach(s => {
                            const thirdLabel = (s.type === 'property-tax') ? 'Valuation' : 'Liability';
                            const third = thirdOf(s);
                            const streamGapTotal = (s.complianceGap || 0) + (s.coverageGap || 0) + third;
                            const ofGap = v => pct(v, streamGapTotal);

                            const bar = (label, amount, color) => `
        <div class="gap-bar-row">
            <div class="gap-bar-label">${esc(label)}</div>
            <div class="gap-bar"><div class="gap-bar-fill" style="width:${ofGap(amount)}%;background:${color}"></div></div>
            <div class="gap-bar-amount">${esc(formatCurrencyCompact(amount))} <span class="gap-bar-pct">(${ofGap(amount)}%)</span></div>
        </div>`;

                            const ratioChip = (label, value, suffix) =>
                                value != null && !isNaN(value)
                                    ? `<span class="gap-ratio"><span class="gap-ratio-l">${esc(label)}</span><strong>${Math.round(value)}${esc(suffix || '%')}</strong></span>`
                                    : '';

                            html += `<div class="gap-card">
    <div class="gap-card-head">
        <div class="gap-card-title">${esc(s.name || '')}${s.included === false ? ' <span class="badge">excluded</span>' : ''}</div>
        <div class="gap-card-headline">Total Gap: <strong>${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</strong></div>
    </div>
    <div class="gap-bars">
        ${bar('Compliance', s.complianceGap || 0, '#00689D')}
        ${bar('Coverage', s.coverageGap || 0, '#10b981')}
        ${bar(thirdLabel, third, '#f59e0b')}
    </div>
    <div class="gap-ratios">
        ${ratioChip('Compliance Ratio', s.complianceRatio)}
        ${ratioChip('Coverage Ratio', s.coverageRatio)}
        ${s.type === 'property-tax' ? ratioChip('Valuation Ratio', s.valuationRatio) : ''}
    </div>
</div>`;
                        });
                    }
                }

                // ===== Stream Prioritization =====
                if (options.includeStreamPrioritization) {
                    const ranked = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getStreamsByGapRanking() : [];
                    html += `<h2>Stream Prioritization</h2>`;
                    if (!ranked.length) {
                        html += `<p><em>No streams included for prioritization.</em></p>`;
                    } else {
                        const modeLabel = {
                            'revenue-potential': 'Revenue Potential',
                            'compliance-first': 'Compliance First',
                            'overhaul': 'Overhaul'
                        };
                        const modeClass = {
                            'revenue-potential': 'mode-rp',
                            'compliance-first': 'mode-cf',
                            'overhaul': 'mode-oh'
                        };
                        const modeCounts = ranked.reduce((acc, s) => {
                            const m = RosraStateManager.getStreamMode(s.id);
                            acc[m] = (acc[m] || 0) + 1;
                            return acc;
                        }, {});
                        const totalRankedGap = ranked.reduce((a, s) => a + (s.totalFunctionalGap || 0), 0);
                        const topStream = ranked[0];
                        const dominantMode = Object.keys(modeCounts).sort((a, b) => modeCounts[b] - modeCounts[a])[0];
                        const maxGap = Math.max(1, ...ranked.map(s => s.totalFunctionalGap || 0));

                        // KPI strip
                        html += `<div class="stat-grid">
    <div class="stat"><div class="v">${ranked.length}</div><div class="l">Streams Prioritized</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(totalRankedGap))}</div><div class="l">Total Gap To Address</div></div>
    <div class="stat"><div class="v">${esc(topStream?.name || '—')}</div><div class="l">Top Priority</div></div>
    <div class="stat"><div class="v">${esc(modeLabel[dominantMode] || '—')}</div><div class="l">Dominant Mode</div></div>
</div>`;

                        // Ranked table with visual rank pill, gap share, and adjustment flag
                        html += `<h3>Prioritized Streams</h3>
<table class="report-table">
<thead><tr>
    <th style="text-align:center;width:50px">#</th>
    <th style="text-align:left">Stream</th>
    <th style="text-align:left">Type</th>
    <th style="text-align:right">Total Gap</th>
    <th style="text-align:left;min-width:140px">Share of Gap</th>
    <th style="text-align:left">Mode</th>
</tr></thead><tbody>`;
                        ranked.forEach(s => {
                            const mode = RosraStateManager.getStreamMode(s.id);
                            const share = pct(s.totalFunctionalGap || 0, totalRankedGap);
                            const barPct = Math.max(2, Math.round(((s.totalFunctionalGap || 0) / maxGap) * 100));
                            const typeLabel = (s.type || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                            const adjusted = (s.adjustedRank && s.adjustedRank !== s.defaultRank)
                                ? ` <span class="badge" title="Manually adjusted from rank ${s.defaultRank}">adjusted</span>`
                                : '';
                            html += `<tr>
    <td style="text-align:center"><span class="rank-pill">${esc(String(s.finalRank))}</span></td>
    <td><strong>${esc(s.name || '')}</strong>${adjusted}</td>
    <td>${esc(typeLabel)}</td>
    <td style="text-align:right"><strong>${esc(formatCurrencyCompact(s.totalFunctionalGap || 0))}</strong></td>
    <td>
        <div class="share-row">
            <div class="share-bar"><div class="share-bar-fill" style="width:${barPct}%"></div></div>
            <div class="share-pct">${share}%</div>
        </div>
    </td>
    <td><span class="mode-chip ${modeClass[mode] || ''}">${esc(modeLabel[mode] || mode || '')}</span></td>
</tr>`;
                        });
                        html += `</tbody></table>`;

                        // Mode legend
                        html += `<div class="mode-legend">
    <strong>Prioritization modes:</strong>
    <span><span class="mode-chip mode-rp">Revenue Potential</span> compliance already ≥ 75%</span>
    <span><span class="mode-chip mode-cf">Compliance First</span> coverage ≥ 60% but compliance low</span>
    <span><span class="mode-chip mode-oh">Overhaul</span> both coverage and compliance need work</span>
</div>`;
                    }
                }

                // ===== Gap Sequencing =====
                if (options.includeGapSequencing) {
                    const priority = (typeof RosraStateManager !== 'undefined') ? RosraStateManager.getMasterPriorityList() : [];
                    html += `<h2>Gap Sequencing</h2>`;
                    if (!priority.length) {
                        html += `<p><em>No sequenced gaps available.</em></p>`;
                    } else {
                        const gapTypeColor = {
                            compliance: '#00689D',
                            coverage: '#10b981',
                            valuation: '#f59e0b',
                            liability: '#f59e0b'
                        };
                        const totalGap = priority.reduce((a, p) => a + (p.gapAmount || 0), 0);
                        const topThree = priority.slice(0, 3).reduce((a, p) => a + (p.gapAmount || 0), 0);
                        const largest = priority.reduce((m, p) => (p.gapAmount || 0) > (m.gapAmount || 0) ? p : m, priority[0]);
                        const maxAmount = Math.max(1, ...priority.map(p => p.gapAmount || 0));

                        // KPI strip
                        html += `<div class="stat-grid">
    <div class="stat"><div class="v">${priority.length}</div><div class="l">Gaps in Sequence</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(totalGap))}</div><div class="l">Cumulative Gap</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(topThree))}</div><div class="l">Top 3 Combined</div></div>
    <div class="stat"><div class="v">${esc(formatCurrencyCompact(largest?.gapAmount || 0))}</div><div class="l">Largest Single Gap</div></div>
</div>`;

                        // Grouped by stream, preserving the overall sequence order
                        const grouped = [];
                        const byStreamId = new Map();
                        priority.forEach(p => {
                            if (!byStreamId.has(p.streamId)) {
                                const group = { streamId: p.streamId, streamName: p.streamName, streamRank: p.streamRank, items: [] };
                                byStreamId.set(p.streamId, group);
                                grouped.push(group);
                            }
                            byStreamId.get(p.streamId).items.push(p);
                        });

                        html += `<h3>Sequence by Stream</h3>`;
                        let runningIndex = 0;
                        let runningTotal = 0;
                        grouped.forEach(group => {
                            const groupTotal = group.items.reduce((a, p) => a + (p.gapAmount || 0), 0);
                            html += `<div class="seq-group">
    <div class="seq-group-head">
        <span class="rank-pill">${esc(String(group.streamRank))}</span>
        <div class="seq-group-title">${esc(group.streamName || '')}</div>
        <div class="seq-group-total">Stream Gap Total: <strong>${esc(formatCurrencyCompact(groupTotal))}</strong></div>
    </div>`;
                            group.items.forEach(p => {
                                runningIndex++;
                                runningTotal += (p.gapAmount || 0);
                                const barPct = Math.max(3, Math.round(((p.gapAmount || 0) / maxAmount) * 100));
                                const color = gapTypeColor[p.gapType] || '#55697a';
                                const cumulativePct = pct(runningTotal, totalGap);
                                html += `<div class="seq-item">
    <div class="seq-item-index">#${runningIndex}</div>
    <div class="seq-item-priority">P${esc(String(p.gapPriority || ''))}</div>
    <div class="seq-item-type" style="text-transform:capitalize">${esc(p.gapType || '')}</div>
    <div class="seq-item-bar"><div class="seq-item-bar-fill" style="width:${barPct}%;background:${color}"></div></div>
    <div class="seq-item-amount">${esc(formatCurrencyCompact(p.gapAmount || 0))}</div>
    <div class="seq-item-cum">${cumulativePct}% cum.</div>
</div>`;
                            });
                            html += `</div>`;
                        });
                    }
                }

                // ===== Solution Cards =====
                if (options.includeSelectedSolutions) {
                    html += `<h2>Solution Cards</h2>`;
                    if (!selectedSolutions.length) {
                        html += `<p><em>No solutions selected.</em></p>`;
                    } else {
                        selectedSolutions.forEach(solution => {
                            const fs = getCompleteSolution(solution.solutionId);
                            if (!fs) return;
                            const fullId = buildFullIdLabel(solution.solutionId, fs);
                            const ov = fs.overview || {};
                            const fd = fs.fullDetails || {};
                            const overviewText = ov.whatThisOptionDoes || ov.whatThisSolves || fd.whyThisMatters || '';
                            const diff = fs.deliveryDifficulty ? `<span class="badge">Difficulty: ${esc(fs.deliveryDifficulty)}</span>` : '';
                            const pol = fs.politicalSensitivity ? `<span class="badge">Political: ${esc(fs.politicalSensitivity)}</span>` : '';
                            const time = solution.timeline ? `<span class="badge">Timeline: ${esc(solution.timeline)}</span>` : '';

                            html += `<div class="r-card">
    <div class="r-card-head">
        <div class="r-card-id">${esc(fullId)}</div>
        <div class="r-card-title">${esc(fs.title || '')}</div>
        <div class="r-meta">${time}${diff}${pol}<span class="badge">${esc(solution.streamName || fs.stream || '')}</span><span class="badge">${esc(solution.gapType || fs.gap || '')}</span></div>
    </div>`;
                            if (overviewText) html += `<div class="r-section"><h4>Overview</h4><p>${esc(overviewText)}</p></div>`;
                            html += renderReportSection('Why This Matters', fd.whyThisMatters);
                            html += renderReportSection('When This Is A Strong Fit', fd.whenStrongFit || ov.mostUsefulWhen);
                            html += renderReportSection('What To Line Up First', fd.whatToLineUpFirst);
                            html += renderReportSection('Design Choices To Settle Early', fd.designChoices);
                            html += renderPracticalPath(fd.practicalPath);
                            html += renderReportSection('Legal & Institutional Points', fd.legalInstitutional || fs.legalEssentials);
                            html += renderReportSection('Capacity, Systems & Partnerships', fd.capacitySystemsPartnerships || fs.administrativeEssentials);
                            html += renderReportSection('Main Risks & Safeguards', fd.risksAndSafeguards || fs.whenNotApplicable);
                            html += renderReportSection('What To Monitor', fd.whatToMonitor);
                            html += renderReportSection('Connections To Other Cards', fd.connectionsToOtherCards);
                            html += renderReportSection('Questions To Settle Before Launch', fd.questionsBeforeLaunch);
                            // Fallback to any legacy fields
                            if (!fd.practicalPath && fs.implementationMilestones?.length) {
                                html += renderReportSection('Implementation Milestones', fs.implementationMilestones);
                            }
                            html += `</div>`;
                        });
                    }
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
