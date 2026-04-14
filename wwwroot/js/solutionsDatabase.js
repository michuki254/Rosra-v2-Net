/**
 * ROSRA Solutions Database - Core API
 * Combines all solution data modules and provides unified access
 *
 * Dependencies (must be loaded before this file):
 * - solutionsData-PT-Compliance.js
 * - solutionsData-PT-Coverage.js
 * - solutionsData-PT-Valuation.js
 * - solutionsData-NP-A.js (Business licences and recurrent operating permits)
 * - solutionsData-NP-B.js (Service fees and billed use charges)
 * - solutionsData-NP-C.js (Daily or point-of-collection charges)
 * - solutionsData-BL.js (legacy, kept for backward compatibility)
 * - solutionsData-Generic.js (legacy, kept for backward compatibility)
 * - streamClassification.js
 */
(function(window) {
    'use strict';

    // Combine all solutions from data modules
    const ALL_SOLUTIONS = [
        ...(window.SolutionsDataPTCompliance || []),
        ...(window.SolutionsDataPTCoverage || []),
        ...(window.SolutionsDataPTValuation || []),
        ...(window.SolutionsDataNP_A || []),
        ...(window.SolutionsDataNP_B || []),
        ...(window.SolutionsDataNP_C || []),
        // Legacy arrays kept for backward compat with old saved reports
        ...(window.SolutionsDataBL || []),
        ...(window.SolutionsDataGeneric || [])
    ];

    // Index solutions by ID for fast lookup
    const SOLUTIONS_BY_ID = {};
    ALL_SOLUTIONS.forEach(s => {
        SOLUTIONS_BY_ID[s.solutionId] = s;
    });

    // Legacy ID mapping: old IDs -> new IDs for backward compatibility
    const LEGACY_ID_MAP = {
        'BL-COM-01': 'NP-A-COM-01',
        'BL-COM-02': 'NP-A-COM-02',
        'BL-COM-03': 'NP-A-COM-03',
        'BL-COV-01': 'NP-A-COV-01',
        'BL-COV-02': 'NP-A-COV-02',
        'BL-COV-03': 'NP-A-COV-03',
        'BL-LIA-01': 'NP-A-LIA-01',
        'BL-LIA-02': 'NP-A-LIA-02',
        'BL-LIA-03': 'NP-A-LIA-03'
    };

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
         * Get solutions by stream, with subgroup-aware filtering for non-property streams
         * @param {string} stream - Stream name (e.g., 'Property Tax', 'Business License', or custom name)
         * @param {string} [subgroup] - Non-property subgroup code ('A', 'B', or 'C')
         * @returns {Array} Solutions for the stream
         */
        getSolutionsByStream: function(stream, subgroup) {
            if (stream === 'Property Tax') {
                return [
                    ...(window.SolutionsDataPTCompliance || []),
                    ...(window.SolutionsDataPTCoverage || []),
                    ...(window.SolutionsDataPTValuation || [])
                ];
            }

            // For non-property streams, use subgroup to select the right card set
            if (subgroup) {
                return this.getSolutionsBySubgroup(subgroup).map(s => ({
                    ...s,
                    stream: stream
                }));
            }

            // Legacy fallback: Business License without subgroup
            if (stream === 'Business License') {
                // Try new subgroup A first, fall back to legacy BL data
                const npA = window.SolutionsDataNP_A || [];
                if (npA.length > 0) {
                    return npA.map(s => ({ ...s, stream: stream }));
                }
                return [...(window.SolutionsDataBL || [])];
            }

            // No subgroup provided for a non-property stream — return empty
            // The UI should enforce classification before showing cards
            return [];
        },

        /**
         * Get solutions by subgroup
         * @param {string} subgroup - Subgroup code ('A', 'B', or 'C')
         * @returns {Array} Solutions for the subgroup
         */
        getSolutionsBySubgroup: function(subgroup) {
            switch (subgroup) {
                case 'A': return [...(window.SolutionsDataNP_A || [])];
                case 'B': return [...(window.SolutionsDataNP_B || [])];
                case 'C': return [...(window.SolutionsDataNP_C || [])];
                default: return [];
            }
        },

        /**
         * Get solutions by subgroup and gap type
         * @param {string} subgroup - Subgroup code ('A', 'B', or 'C')
         * @param {string} gap - Gap type (Coverage, Liability, Compliance)
         * @returns {Array} Solutions matching criteria
         */
        getSolutionsBySubgroupAndGap: function(subgroup, gap) {
            const gapLower = gap.toLowerCase().replace(' application', '');
            return this.getSolutionsBySubgroup(subgroup).filter(s =>
                s.gap.toLowerCase().replace(' application', '') === gapLower
            );
        },

        /**
         * Get solutions by stream and gap type, with optional subgroup for non-property
         * @param {string} stream - Stream name
         * @param {string} gap - Gap type (Compliance, Coverage, Valuation, Liability)
         * @param {string} [subgroup] - Non-property subgroup code
         * @returns {Array} Solutions matching criteria
         */
        getSolutionsByStreamAndGap: function(stream, gap, subgroup) {
            const gapLower = gap.toLowerCase().replace(' application', '');

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
            }

            // Non-property: use subgroup-aware filtering
            if (subgroup) {
                return this.getSolutionsBySubgroupAndGap(subgroup, gap).map(s => ({
                    ...s,
                    stream: stream
                }));
            }

            // Legacy fallback for Business License
            if (stream === 'Business License') {
                const npA = window.SolutionsDataNP_A || [];
                if (npA.length > 0) {
                    return npA.filter(s => s.gap.toLowerCase().replace(' application', '') === gapLower)
                        .map(s => ({ ...s, stream: stream }));
                }
                return (window.SolutionsDataBL || []).filter(s =>
                    s.gap.toLowerCase() === gapLower
                );
            }

            return [];
        },

        /**
         * Get a specific solution by ID, with legacy ID resolution
         * @param {string} solutionId - Solution ID (e.g., 'PT-COM-01')
         * @returns {Object|null} Solution or null if not found
         */
        getSolutionById: function(solutionId) {
            // Try direct lookup first
            let solution = SOLUTIONS_BY_ID[solutionId];
            if (solution) return solution;

            // Try legacy ID mapping
            const newId = LEGACY_ID_MAP[solutionId];
            if (newId) {
                return SOLUTIONS_BY_ID[newId] || null;
            }

            // Try pattern-based legacy resolution (e.g., GEN-COM-01 -> generic)
            if (solutionId && solutionId.startsWith('GEN-')) {
                // Legacy generic IDs — no direct mapping, return null
                return null;
            }

            return null;
        },

        /**
         * Get solution count by stream and gap
         * @param {string} stream - Stream name
         * @param {string} gap - Gap type
         * @param {string} [subgroup] - Non-property subgroup code
         * @returns {number} Count of solutions
         */
        getSolutionCount: function(stream, gap, subgroup) {
            return this.getSolutionsByStreamAndGap(stream, gap, subgroup).length;
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
         * @returns {string} Prefix
         */
        getStreamPrefix: function(stream) {
            const prefixes = {
                'Property Tax': 'PT',
                'Business License': 'BL'
            };
            return prefixes[stream] || 'NP';
        },

        /**
         * Search solutions by text query
         * @param {string} query - Search query
         * @param {Object} filters - Optional filters {stream, gap, timeline, category, subgroup}
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
            if (filters.subgroup) {
                results = results.filter(s => s.subgroup === filters.subgroup);
            }

            // Apply text search
            if (queryLower) {
                results = results.filter(s =>
                    s.title.toLowerCase().includes(queryLower) ||
                    s.shortTitle.toLowerCase().includes(queryLower) ||
                    s.solutionId.toLowerCase().includes(queryLower) ||
                    (s.overview?.whatThisOptionDoes || '').toLowerCase().includes(queryLower) ||
                    (s.overview?.mainPurpose || '').toLowerCase().includes(queryLower) ||
                    (s.fullDetails?.whyThisMatters || '').toLowerCase().includes(queryLower)
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
            const npA = window.SolutionsDataNP_A || [];
            const npB = window.SolutionsDataNP_B || [];
            const npC = window.SolutionsDataNP_C || [];

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
                    'Non-Property A': {
                        total: npA.length,
                        compliance: npA.filter(s => s.gap === 'Compliance').length,
                        coverage: npA.filter(s => s.gap === 'Coverage').length,
                        liability: npA.filter(s => s.gap === 'Liability').length
                    },
                    'Non-Property B': {
                        total: npB.length,
                        compliance: npB.filter(s => s.gap === 'Compliance').length,
                        coverage: npB.filter(s => s.gap === 'Coverage').length,
                        liability: npB.filter(s => s.gap === 'Liability').length
                    },
                    'Non-Property C': {
                        total: npC.length,
                        compliance: npC.filter(s => s.gap === 'Compliance').length,
                        coverage: npC.filter(s => s.gap === 'Coverage').length,
                        liability: npC.filter(s => s.gap === 'Liability').length
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
                whyThisMatters: basicSolution.overview?.whatThisOptionDoes || 'Implementation details to be determined based on local context.',
                whenStrongFit: basicSolution.overview?.mostUsefulWhen || ['Context-dependent — assess local conditions'],
                whatToLineUpFirst: ['Assess current state and gaps', 'Identify necessary approvals and resources'],
                designChoices: ['Adapt implementation approach to local context'],
                practicalPath: {
                    first90Days: ['Assess current state and design approach'],
                    sixTo12Months: ['Pilot in selected area and refine'],
                    twelveToTwentyFourMonths: ['Scale based on pilot results']
                },
                legalInstitutional: ['Review existing legal framework for authority to implement'],
                capacitySystemsPartnerships: ['Assign dedicated staff or team', 'Establish operating procedures'],
                risksAndSafeguards: ['Adapt to local context', 'Monitor implementation closely'],
                whatToMonitor: ['Implementation progress against plan', 'Early results and adjustment needs'],
                connectionsToOtherCards: [],
                questionsBeforeLaunch: ['Is the city ready for this reform?', 'What resources are available?']
            };
        }
    };

    // Expose to global scope
    window.SolutionsDatabase = SolutionsDatabase;

})(window);
