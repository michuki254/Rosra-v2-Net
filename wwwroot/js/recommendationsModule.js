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

            let selectedSolutions = [];
            let progressData = {};

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

                // Group by stream
                const streamGroups = {};
                selectedSolutions.forEach(solution => {
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

                sortedStreams.forEach(([streamName, streamData]) => {
                    html += `
                        <div class="stream-section">
                            <div class="stream-header">
                                <h3><i class="fas fa-chart-bar me-2"></i> ${streamName}</h3>
                                <span class="stream-rank">Rank #${streamData.rank}</span>
                            </div>
                    `;

                    // Sort gaps by priority
                    const sortedGaps = Object.entries(streamData.gaps)
                        .sort((a, b) => a[1].priority - b[1].priority);

                    sortedGaps.forEach(([gapType, gapData]) => {
                        const gapClass = gapType.toLowerCase();
                        html += `
                            <div class="gap-section">
                                <div class="gap-header">
                                    <div class="gap-info">
                                        <span class="gap-indicator ${gapClass}"></span>
                                        <span class="gap-title">${gapType}</span>
                                        <span class="gap-badge">(Priority ${gapData.priority})</span>
                                    </div>
                                    <span>${gapData.solutions.length} solution${gapData.solutions.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div class="gap-solutions-list">
                        `;

                        gapData.solutions.forEach(solution => {
                            html += renderSolutionCard(solution);
                        });

                        html += `
                                </div>
                            </div>
                        `;
                    });

                    html += `</div>`;
                });

                container.innerHTML = html;
            }

            // Render individual solution card
            function renderSolutionCard(solution) {
                const fullSolution = getCompleteSolution(solution.solutionId);
                if (!fullSolution) return '';

                const timelineClass = solution.timeline === '<1 year' ? 'quick' :
                                      solution.timeline === '1-3 years' ? 'medium' : 'long';

                return `
                    <div class="solution-card" data-solution-id="${solution.solutionId}">
                        <div class="solution-card-header" onclick="RecommendationsModule.toggleSolution('${solution.solutionId}')">
                            <div class="solution-title-section">
                                <div class="solution-id">${solution.solutionId}</div>
                                <div class="solution-title">${fullSolution.title}</div>
                                <div class="solution-meta">
                                    <span class="timeline-badge ${timelineClass}">${solution.timeline}</span>
                                    <span>${solution.streamName} | ${solution.gapType}</span>
                                </div>
                            </div>
                            <button class="solution-expand-btn" id="expand-btn-${solution.solutionId}">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <div class="solution-overview">
                            ${escapeForTemplate(fullSolution.overview?.whatThisSolves || (fullSolution.howItWorks ? fullSolution.howItWorks.substring(0, 300) + '...' : ''))}
                        </div>
                        <div class="solution-details" id="details-${solution.solutionId}">
                            ${renderDetailSections(fullSolution)}
                        </div>
                        <div class="solution-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="RecommendationsModule.copyToClipboard('${solution.solutionId}')">
                                <i class="fas fa-clipboard me-1"></i> Copy
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="RecommendationsModule.printSolution('${solution.solutionId}')">
                                <i class="fas fa-print me-1"></i> Print
                            </button>
                        </div>
                    </div>
                `;
            }

            // Helper function to escape content for safe embedding in template literals
            function escapeForTemplate(str) {
                if (!str) return '';
                return String(str)
                    .replace(/\\/g, '\\\\')
                    .replace(/`/g, '\\`')
                    .replace(/\${/g, '\\${');
            }

            // Render detail sections for a solution
            function renderDetailSections(solution) {
                let html = '';

                // Legal Essentials
                if (solution.legalEssentials && solution.legalEssentials.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-gavel"></i> Legal Essentials</span></div>';
                    html += '<div class="detail-section-content"><ul>';
                    html += solution.legalEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('');
                    html += '</ul></div></div>';
                }

                // How It Works
                if (solution.howItWorks) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-cogs"></i> How It Works</span></div>';
                    html += '<div class="detail-section-content"><p>' + escapeForTemplate(solution.howItWorks).replace(/\n/g, '<br>') + '</p></div>';
                    html += '</div>';
                }

                // Implementation Milestones
                if (solution.implementationMilestones && solution.implementationMilestones.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-tasks"></i> Implementation Milestones</span></div>';
                    html += '<div class="detail-section-content">';
                    html += solution.implementationMilestones.map((item, index) => '<div class="milestone-item"><span class="milestone-number">' + (index + 1) + '</span><span class="milestone-text">' + escapeForTemplate(item) + '</span></div>').join('');
                    html += '</div></div>';
                }

                // Administrative Essentials
                if (solution.administrativeEssentials && solution.administrativeEssentials.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-users-cog"></i> Administrative Essentials</span></div>';
                    html += '<div class="detail-section-content"><ul>';
                    html += solution.administrativeEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('');
                    html += '</ul></div></div>';
                }

                // When Not Applicable
                if (solution.whenNotApplicable && solution.whenNotApplicable.length > 0) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-exclamation-triangle"></i> When It May Not Be Applicable</span></div>';
                    html += '<div class="detail-section-content"><ul>';
                    html += solution.whenNotApplicable.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('');
                    html += '</ul></div></div>';
                }

                // Case Notes
                if (solution.caseNotes) {
                    html += '<div class="detail-section">';
                    html += '<div class="detail-section-header"><span class="detail-section-title"><i class="fas fa-book-open"></i> Case Notes & Resources</span></div>';
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
                const btn = document.getElementById(`expand-btn-${solutionId}`);

                if (details.classList.contains('expanded')) {
                    details.classList.remove('expanded');
                    btn.classList.remove('expanded');
                } else {
                    details.classList.add('expanded');
                    btn.classList.add('expanded');
                }
            }

            // Switch between views
            function switchView(viewName) {
                // Update buttons
                document.querySelectorAll('.view-toggle .btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.view === viewName);
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

                const quickWins = selectedSolutions.filter(s => s.timeline === '<1 year');
                const mediumTerm = selectedSolutions.filter(s => s.timeline === '1-3 years');
                const longTerm = selectedSolutions.filter(s => s.timeline === '3+ years');

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
                            ${solutions.map(s => `
                                <div class="timeline-item ${className}">
                                    <span class="timeline-item-id">${s.solutionId}</span>
                                    <span class="timeline-item-title">${s.title || getCompleteSolution(s.solutionId)?.title || 'Unknown'}</span>
                                    <span class="timeline-item-stream">${s.streamName}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Render progress view
            function renderProgressView() {
                const container = document.getElementById('progressContent');

                if (selectedSolutions.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>No solutions selected</p></div>';
                    return;
                }

                let html = '';

                selectedSolutions.forEach(solution => {
                    const fullSolution = getCompleteSolution(solution.solutionId);
                    const milestones = fullSolution?.implementationMilestones || [];
                    const solutionProgress = progressData[solution.solutionId] || {};

                    const completedCount = Object.values(solutionProgress).filter(v => v === 'completed').length;
                    const percentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

                    html += `
                        <div class="progress-solution">
                            <div class="progress-solution-header">
                                <span class="progress-solution-title">${solution.solutionId}: ${fullSolution?.title || 'Unknown'}</span>
                                <span class="progress-percentage">${percentage}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                            <div class="progress-milestones">
                                ${milestones.map((milestone, index) => {
                                    const status = solutionProgress[index] || 'not-started';
                                    return `
                                        <div class="progress-milestone ${status === 'completed' ? 'completed' : ''}">
                                            <div class="progress-milestone-check ${status === 'completed' ? 'completed' : ''}"
                                                 onclick="RecommendationsModule.toggleMilestone('${solution.solutionId}', ${index})">
                                                ${status === 'completed' ? '<i class="fas fa-check"></i>' : ''}
                                            </div>
                                            <span class="progress-milestone-text">${milestone}</span>
                                            <select class="progress-milestone-status ${status}"
                                                    onchange="RecommendationsModule.updateMilestoneStatus('${solution.solutionId}', ${index}, this.value)">
                                                <option value="not-started" ${status === 'not-started' ? 'selected' : ''}>Not Started</option>
                                                <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                                <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                                                <option value="blocked" ${status === 'blocked' ? 'selected' : ''}>Blocked</option>
                                            </select>
                                        </div>
                                    `;
                                }).join('')}
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

            // Export progress
            function exportProgress() {
                const data = {
                    exportDate: new Date().toISOString(),
                    solutions: selectedSolutions.map(s => ({
                        ...s,
                        progress: progressData[s.solutionId] || {}
                    }))
                };

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'rosra-implementation-progress.json';
                a.click();
                URL.revokeObjectURL(url);
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
                const format = document.getElementById('reportFormat').value;

                // Gather selected options
                const options = {
                    includeExecSummary: document.getElementById('includeExecSummary').checked,
                    includeGapAnalysis: document.getElementById('includeGapAnalysis').checked,
                    includeStreamPrioritization: document.getElementById('includeStreamPrioritization').checked,
                    includeGapSequencing: document.getElementById('includeGapSequencing').checked,
                    includeSelectedSolutions: document.getElementById('includeSelectedSolutions').checked,
                    includeSkippedSolutions: document.getElementById('includeSkippedSolutions').checked,
                    includeTimeline: document.getElementById('includeTimeline').checked,
                    includeResources: document.getElementById('includeResources').checked
                };

                if (format === 'html') {
                    generateHTMLReport(options);
                } else {
                    generatePDFReport(options);
                }

                // Close modal
                bootstrap.Modal.getInstance(document.getElementById('reportModal')).hide();
            }

            // Generate HTML report
            function generateHTMLReport(options) {
                let html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Revenue Enhancement Action Plan</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 40px; }
                            h1 { color: #1976D2; border-bottom: 3px solid #1976D2; padding-bottom: 10px; }
                            h2 { color: #2c3e50; margin-top: 30px; }
                            h3 { color: #555; }
                            .solution-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 15px 0; }
                            .solution-title { font-size: 1.2em; font-weight: bold; color: #1976D2; }
                            .section { margin: 20px 0; }
                            .section-title { font-weight: bold; color: #333; margin-bottom: 10px; }
                            ul { margin: 10px 0; padding-left: 25px; }
                            .milestone { display: flex; gap: 10px; margin: 8px 0; }
                            .milestone-num { background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
                            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666; }
                            @@media print { body { padding: 20px; } }
                        </style>
                    </head>
                    <body>
                        <h1>Revenue Enhancement Action Plan</h1>
                        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                `;

                if (options.includeExecSummary) {
                    html += `
                        <h2>Executive Summary</h2>
                        <p><strong>Total Solutions Selected:</strong> ${selectedSolutions.length}</p>
                        <p><strong>Quick Wins (&lt;1 year):</strong> ${selectedSolutions.filter(s => s.timeline === '<1 year').length}</p>
                        <p><strong>Medium Term (1-3 years):</strong> ${selectedSolutions.filter(s => s.timeline === '1-3 years').length}</p>
                        <p><strong>Long Term (3+ years):</strong> ${selectedSolutions.filter(s => s.timeline === '3+ years').length}</p>
                    `;
                }

                if (options.includeSelectedSolutions) {
                    html += `<h2>Selected Solutions</h2>`;

                    selectedSolutions.forEach(solution => {
                        const fullSolution = getCompleteSolution(solution.solutionId);
                        if (fullSolution) {
                            html += '<div class="solution-card">';
                            html += '<div class="solution-title">' + escapeForTemplate(solution.solutionId) + ': ' + escapeForTemplate(fullSolution.title) + '</div>';
                            html += '<p><strong>Stream:</strong> ' + escapeForTemplate(solution.streamName) + ' | <strong>Gap:</strong> ' + escapeForTemplate(solution.gapType) + ' | <strong>Timeline:</strong> ' + escapeForTemplate(solution.timeline) + '</p>';

                            if (fullSolution.overview?.whatThisSolves) {
                                html += '<div class="section"><div class="section-title">Overview</div><p>' + escapeForTemplate(fullSolution.overview.whatThisSolves) + '</p></div>';
                            }

                            if (fullSolution.legalEssentials?.length) {
                                html += '<div class="section"><div class="section-title">Legal Essentials</div><ul>';
                                html += fullSolution.legalEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('');
                                html += '</ul></div>';
                            }

                            if (fullSolution.implementationMilestones?.length) {
                                html += '<div class="section"><div class="section-title">Implementation Milestones</div>';
                                html += fullSolution.implementationMilestones.map((m, i) => '<div class="milestone"><span class="milestone-num">' + (i+1) + '</span><span>' + escapeForTemplate(m) + '</span></div>').join('');
                                html += '</div>';
                            }

                            if (fullSolution.administrativeEssentials?.length) {
                                html += '<div class="section"><div class="section-title">Administrative Essentials</div><ul>';
                                html += fullSolution.administrativeEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('');
                                html += '</ul></div>';
                            }

                            html += '</div>';
                        }
                    });
                }

                html += `
                        <div class="footer">
                            <p>Generated by ROSRA - Rapid Own-Source Revenue Analysis Tool</p>
                            <p>UN-Habitat</p>
                        </div>
                    </body>
                    </html>
                `;

                // Open in new window for printing
                const printWindow = window.open('', '_blank');
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => printWindow.print(), 500);
            }

            // Generate PDF report (simplified - opens print dialog)
            function generatePDFReport(options) {
                // For now, use the HTML report with print to PDF
                generateHTMLReport(options);
            }

            // Copy solution to clipboard
            function copyToClipboard(solutionId) {
                const fullSolution = getCompleteSolution(solutionId);
                if (!fullSolution) return;

                let text = `${solutionId}: ${fullSolution.title}\n\n`;

                if (fullSolution.overview?.whatThisSolves) {
                    text += `OVERVIEW\n${fullSolution.overview.whatThisSolves}\n\n`;
                }

                if (fullSolution.legalEssentials?.length) {
                    text += `LEGAL ESSENTIALS\n${fullSolution.legalEssentials.map((item, i) => `${i+1}. ${item}`).join('\n')}\n\n`;
                }

                if (fullSolution.implementationMilestones?.length) {
                    text += `IMPLEMENTATION MILESTONES\n${fullSolution.implementationMilestones.map((item, i) => `${i+1}. ${item}`).join('\n')}\n\n`;
                }

                navigator.clipboard.writeText(text).then(() => {
                    alert('Solution copied to clipboard!');
                });
            }

            // Print single solution
            function printSolution(solutionId) {
                const fullSolution = getCompleteSolution(solutionId);
                if (!fullSolution) return;

                const solution = selectedSolutions.find(s => s.solutionId === solutionId) || { streamName: '', gapType: '', timeline: '' };

                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${solutionId}: ${fullSolution.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
                            h1 { color: #1976D2; font-size: 1.5em; }
                            h2 { color: #333; font-size: 1.1em; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                            ul { margin: 10px 0; padding-left: 25px; }
                            .milestone { display: flex; gap: 10px; margin: 8px 0; }
                            .milestone-num { background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
                        </style>
                    </head>
                    <body>
                        <h1>${solutionId}: ${fullSolution.title}</h1>
                        <p><strong>Stream:</strong> ${solution.streamName} | <strong>Gap:</strong> ${solution.gapType} | <strong>Timeline:</strong> ${solution.timeline}</p>

                        ${fullSolution.overview?.whatThisSolves ? '<h2>Overview</h2><p>' + escapeForTemplate(fullSolution.overview.whatThisSolves) + '</p>' : ''}

                        ${fullSolution.legalEssentials?.length ? '<h2>Legal Essentials</h2><ul>' + fullSolution.legalEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('') + '</ul>' : ''}

                        ${fullSolution.howItWorks ? '<h2>How It Works</h2><p>' + escapeForTemplate(fullSolution.howItWorks).replace(/\n/g, '<br>') + '</p>' : ''}

                        ${fullSolution.implementationMilestones?.length ? '<h2>Implementation Milestones</h2>' + fullSolution.implementationMilestones.map((m, i) => '<div class="milestone"><span class="milestone-num">' + (i+1) + '</span><span>' + escapeForTemplate(m) + '</span></div>').join('') : ''}

                        ${fullSolution.administrativeEssentials?.length ? '<h2>Administrative Essentials</h2><ul>' + fullSolution.administrativeEssentials.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('') + '</ul>' : ''}

                        ${fullSolution.whenNotApplicable?.length ? '<h2>When It May Not Be Applicable</h2><ul>' + fullSolution.whenNotApplicable.map(item => '<li>' + escapeForTemplate(item) + '</li>').join('') + '</ul>' : ''}

                        ${fullSolution.caseNotes ? '<h2>Case Notes</h2><p><em>' + escapeForTemplate(fullSolution.caseNotes) + '</em></p>' : ''}
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
                switchView,
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
