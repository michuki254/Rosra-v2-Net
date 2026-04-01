/**
 * ROSRA Solutions Database - Core API
 * Combines all solution data modules and provides unified access
 *
 * Dependencies (must be loaded before this file):
 * - solutionsData-PT-Compliance.js
 * - solutionsData-PT-Coverage.js
 * - solutionsData-PT-Valuation.js
 * - solutionsData-BL.js
 * - solutionsData-Generic.js
 */
(function(window) {
    'use strict';

    // Combine all solutions from data modules
    const ALL_SOLUTIONS = [
        ...(window.SolutionsDataPTCompliance || []),
        ...(window.SolutionsDataPTCoverage || []),
        ...(window.SolutionsDataPTValuation || []),
        ...(window.SolutionsDataBL || []),
        ...(window.SolutionsDataGeneric || [])
    ];

    // Index solutions by ID for fast lookup
    const SOLUTIONS_BY_ID = {};
    ALL_SOLUTIONS.forEach(s => {
        SOLUTIONS_BY_ID[s.solutionId] = s;
    });

    // Public API
    const SolutionsDatabase = {
        /**
         * Get all solutions
         * @returns {Array} All solutions
         */
        getAllSolutions: function() {
            return [...ALL_SOLUTIONS];
        },

        /**
         * Get solutions by stream
         * @param {string} stream - Stream name (e.g., 'Property Tax', 'Business License')
         * @returns {Array} Solutions for the stream
         */
        getSolutionsByStream: function(stream) {
            if (stream === 'Property Tax') {
                return [
                    ...(window.SolutionsDataPTCompliance || []),
                    ...(window.SolutionsDataPTCoverage || []),
                    ...(window.SolutionsDataPTValuation || [])
                ];
            } else if (stream === 'Business License') {
                return [...(window.SolutionsDataBL || [])];
            } else {
                // Return generic solutions for other streams, adapted with stream name
                return (window.SolutionsDataGeneric || []).map(s => ({
                    ...s,
                    stream: stream,
                    solutionId: s.solutionId.replace('GEN', this.getStreamPrefix(stream))
                }));
            }
        },

        /**
         * Get solutions by stream and gap type
         * @param {string} stream - Stream name
         * @param {string} gap - Gap type (Compliance, Coverage, Valuation, Liability)
         * @returns {Array} Solutions matching criteria
         */
        getSolutionsByStreamAndGap: function(stream, gap) {
            const gapLower = gap.toLowerCase();

            if (stream === 'Property Tax') {
                switch(gapLower) {
                    case 'compliance':
                        return [...(window.SolutionsDataPTCompliance || [])];
                    case 'coverage':
                        return [...(window.SolutionsDataPTCoverage || [])];
                    case 'valuation':
                        return [...(window.SolutionsDataPTValuation || [])];
                    default:
                        return [];
                }
            } else if (stream === 'Business License') {
                return (window.SolutionsDataBL || []).filter(s =>
                    s.gap.toLowerCase() === gapLower
                );
            } else {
                // Generic solutions for other streams
                return (window.SolutionsDataGeneric || [])
                    .filter(s => s.gap.toLowerCase() === gapLower)
                    .map(s => ({
                        ...s,
                        stream: stream,
                        solutionId: s.solutionId.replace('GEN', this.getStreamPrefix(stream))
                    }));
            }
        },

        /**
         * Get a specific solution by ID
         * @param {string} solutionId - Solution ID (e.g., 'PT-COM-01')
         * @returns {Object|null} Solution or null if not found
         */
        getSolutionById: function(solutionId) {
            return SOLUTIONS_BY_ID[solutionId] || null;
        },

        /**
         * Get solution count by stream and gap
         * @param {string} stream - Stream name
         * @param {string} gap - Gap type
         * @returns {number} Count of solutions
         */
        getSolutionCount: function(stream, gap) {
            return this.getSolutionsByStreamAndGap(stream, gap).length;
        },

        /**
         * Get gap types for a stream
         * @param {string} stream - Stream name
         * @returns {Array} Gap types available for the stream
         */
        getGapTypesForStream: function(stream) {
            if (stream === 'Property Tax') {
                return ['Compliance', 'Coverage', 'Valuation'];
            } else {
                return ['Compliance', 'Coverage', 'Liability'];
            }
        },

        /**
         * Get stream prefix for solution IDs
         * @param {string} stream - Stream name
         * @returns {string} Prefix (e.g., 'PT', 'BL', 'UF')
         */
        getStreamPrefix: function(stream) {
            const prefixes = {
                'Property Tax': 'PT',
                'Business License': 'BL',
                'User Fees': 'UF',
                'Parking Fees': 'PK',
                'Market Fees': 'MK',
                'Advertisement': 'AD',
                'Building Permits': 'BP'
            };
            return prefixes[stream] || 'GEN';
        },

        /**
         * Search solutions by text query
         * @param {string} query - Search query
         * @param {Object} filters - Optional filters {stream, gap, timeline, category}
         * @returns {Array} Matching solutions
         */
        searchSolutions: function(query, filters = {}) {
            const queryLower = (query || '').toLowerCase();

            let results = ALL_SOLUTIONS;

            // Apply filters
            if (filters.stream) {
                results = results.filter(s => s.stream === filters.stream);
            }
            if (filters.gap) {
                results = results.filter(s => s.gap.toLowerCase() === filters.gap.toLowerCase());
            }
            if (filters.timeline) {
                results = results.filter(s => s.timeline === filters.timeline);
            }
            if (filters.category) {
                results = results.filter(s => s.category === filters.category);
            }

            // Apply text search
            if (queryLower) {
                results = results.filter(s =>
                    s.title.toLowerCase().includes(queryLower) ||
                    s.shortTitle.toLowerCase().includes(queryLower) ||
                    s.solutionId.toLowerCase().includes(queryLower) ||
                    (s.overview?.whatThisSolves || '').toLowerCase().includes(queryLower) ||
                    (s.overview?.whatYouDo || '').toLowerCase().includes(queryLower)
                );
            }

            return results;
        },

        /**
         * Get solutions by timeline
         * @param {string} timeline - Timeline filter ('<1 year', '1-3 years', '3+ years')
         * @returns {Array} Solutions matching timeline
         */
        getSolutionsByTimeline: function(timeline) {
            return ALL_SOLUTIONS.filter(s => s.timeline === timeline);
        },

        /**
         * Get solutions grouped by timeline
         * @param {Array} solutions - Solutions to group (optional, defaults to all)
         * @returns {Object} Solutions grouped by timeline
         */
        groupSolutionsByTimeline: function(solutions = null) {
            const solutionsToGroup = solutions || ALL_SOLUTIONS;
            return {
                quickWins: solutionsToGroup.filter(s => s.timeline === '<1 year'),
                mediumTerm: solutionsToGroup.filter(s => s.timeline === '1-3 years'),
                longTerm: solutionsToGroup.filter(s => s.timeline === '3+ years')
            };
        },

        /**
         * Get unique categories
         * @param {string} stream - Optional stream filter
         * @returns {Array} Unique categories
         */
        getCategories: function(stream = null) {
            let solutions = stream ? this.getSolutionsByStream(stream) : ALL_SOLUTIONS;
            const categories = new Set(solutions.map(s => s.category).filter(Boolean));
            return Array.from(categories).sort();
        },

        /**
         * Get timeline badge CSS class
         * @param {string} timeline - Timeline value
         * @returns {string} CSS class name
         */
        getTimelineBadgeClass: function(timeline) {
            if (timeline === '<1 year') return 'bg-success';
            if (timeline === '1-3 years') return 'bg-warning text-dark';
            return 'bg-orange';
        },

        /**
         * Get gap color
         * @param {string} gap - Gap type
         * @returns {string} Color hex code
         */
        getGapColor: function(gap) {
            const colors = {
                'compliance': '#F44336',
                'coverage': '#FF9800',
                'valuation': '#2196F3',
                'liability': '#9C27B0'
            };
            return colors[gap.toLowerCase()] || '#9E9E9E';
        },

        /**
         * Get gap icon
         * @param {string} gap - Gap type
         * @returns {string} Bootstrap icon class
         */
        getGapIcon: function(gap) {
            const icons = {
                'compliance': 'bi-check-circle-fill',
                'coverage': 'bi-geo-alt-fill',
                'valuation': 'bi-currency-dollar',
                'liability': 'bi-receipt'
            };
            return icons[gap.toLowerCase()] || 'bi-circle-fill';
        },

        /**
         * Get statistics summary
         * @returns {Object} Statistics about the database
         */
        getStatistics: function() {
            return {
                total: ALL_SOLUTIONS.length,
                byStream: {
                    'Property Tax': {
                        total: (window.SolutionsDataPTCompliance || []).length +
                               (window.SolutionsDataPTCoverage || []).length +
                               (window.SolutionsDataPTValuation || []).length,
                        compliance: (window.SolutionsDataPTCompliance || []).length,
                        coverage: (window.SolutionsDataPTCoverage || []).length,
                        valuation: (window.SolutionsDataPTValuation || []).length
                    },
                    'Business License': {
                        total: (window.SolutionsDataBL || []).length,
                        compliance: (window.SolutionsDataBL || []).filter(s => s.gap === 'Compliance').length,
                        coverage: (window.SolutionsDataBL || []).filter(s => s.gap === 'Coverage').length,
                        liability: (window.SolutionsDataBL || []).filter(s => s.gap === 'Liability').length
                    },
                    'Generic': {
                        total: (window.SolutionsDataGeneric || []).length
                    }
                },
                byTimeline: {
                    quickWins: ALL_SOLUTIONS.filter(s => s.timeline === '<1 year').length,
                    mediumTerm: ALL_SOLUTIONS.filter(s => s.timeline === '1-3 years').length,
                    longTerm: ALL_SOLUTIONS.filter(s => s.timeline === '3+ years').length
                }
            };
        },

        /**
         * Check if full details exist for a solution
         * @param {string} solutionId - Solution ID
         * @returns {boolean} True if full details exist
         */
        hasFullDetails: function(solutionId) {
            const solution = this.getSolutionById(solutionId);
            return solution && solution.fullDetails && Object.keys(solution.fullDetails).length > 0;
        },

        /**
         * Get complete solution with full details
         * @param {string} solutionId - Solution ID
         * @returns {Object|null} Complete solution or null
         */
        getCompleteSolution: function(solutionId) {
            return this.getSolutionById(solutionId);
        },

        /**
         * Generate default full details for solutions without specific content
         * @param {Object} basicSolution - Basic solution object
         * @returns {Object} Full details structure
         */
        getDefaultFullDetails: function(basicSolution) {
            if (!basicSolution) return null;

            return {
                legalEssentials: [
                    'Review existing legal framework for authority to implement',
                    'Identify any regulatory changes needed',
                    'Ensure compliance with data protection requirements'
                ],
                howItWorks: basicSolution.overview?.whatYouDo || 'Implementation details to be determined based on local context.',
                implementationMilestones: [
                    'Assess current state and gaps',
                    'Design implementation approach',
                    'Secure necessary approvals and resources',
                    'Pilot in selected area',
                    'Roll out citywide with monitoring'
                ],
                administrativeEssentials: [
                    'Assign dedicated staff or team',
                    'Establish operating procedures',
                    'Create monitoring and reporting framework'
                ],
                whenNotApplicable: [
                    'Local context does not support this approach',
                    'Resources or capacity are insufficient',
                    'Legal framework does not permit'
                ],
                caseNotes: 'Adapt implementation to local context. Success depends on political support, adequate resources, and sustained commitment.',
                resources: []
            };
        }
    };

    // Expose to global scope
    window.SolutionsDatabase = SolutionsDatabase;

})(window);
