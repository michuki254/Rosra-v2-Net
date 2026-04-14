/**
 * ROSRA Full Solutions Database
 * Now acts as a thin wrapper delegating to SolutionsDatabase,
 * which contains full details inline in each card.
 *
 * This file is kept for backward compatibility with views that reference SolutionsFullDatabase.
 */
(function(window) {
    'use strict';

    const SolutionsFullDatabase = {
        // Get full details for a solution
        getFullDetails: function(solutionId) {
            if (typeof SolutionsDatabase !== 'undefined') {
                const solution = SolutionsDatabase.getSolutionById(solutionId);
                return solution ? solution.fullDetails : null;
            }
            return null;
        },

        // Check if full details exist
        hasFullDetails: function(solutionId) {
            if (typeof SolutionsDatabase !== 'undefined') {
                return SolutionsDatabase.hasFullDetails(solutionId);
            }
            return false;
        },

        // Get complete solution with full details
        getCompleteSolution: function(solutionId) {
            if (typeof SolutionsDatabase !== 'undefined') {
                return SolutionsDatabase.getCompleteSolution(solutionId);
            }
            return null;
        },

        // Generate default full details for solutions without specific content
        getDefaultFullDetails: function(basicSolution) {
            if (typeof SolutionsDatabase !== 'undefined') {
                return SolutionsDatabase.getDefaultFullDetails(basicSolution);
            }
            return null;
        },

        // Get all full details (returns an object keyed by solutionId)
        getAllFullDetails: function() {
            if (typeof SolutionsDatabase !== 'undefined') {
                const all = SolutionsDatabase.getAllSolutions();
                const result = {};
                all.forEach(s => {
                    if (s.fullDetails) {
                        result[s.solutionId] = s.fullDetails;
                    }
                });
                return result;
            }
            return {};
        }
    };

    window.SolutionsFullDatabase = SolutionsFullDatabase;
})(window);
