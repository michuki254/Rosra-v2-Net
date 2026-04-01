/**
 * ROSRA State Manager
 * Centralized state management for sharing data between Gap Analysis tabs and Prioritization
 *
 * This follows a pub/sub pattern similar to React Context or Redux
 * All stream data (Property Tax, Business License, Generic Streams) is stored here
 * Components subscribe to changes and get notified automatically
 */

(function(window) {
    'use strict';

    // Private state
    const state = {
        streams: [],           // Array of all revenue streams
        currencySymbol: '$',
        currencyCode: 'USD',
        lastUpdated: null
    };

    // Subscribers for state changes
    const subscribers = {
        streams: [],
        currency: [],
        all: []
    };

    // Stream type definitions
    const STREAM_TYPES = {
        PROPERTY_TAX: 'property-tax',
        BUSINESS_LICENSE: 'business-license',
        GENERIC: 'generic-stream'
    };

    // Gap type definitions
    const GAP_TYPES = {
        COMPLIANCE: 'compliance',
        COVERAGE: 'coverage',
        VALUATION: 'valuation',      // Property Tax specific
        LIABILITY: 'liability'        // Business License / Generic specific
    };

    /**
     * Generate a unique stream ID
     */
    function generateStreamId(type, index) {
        if (type === STREAM_TYPES.PROPERTY_TAX) return 'property-tax';
        if (type === STREAM_TYPES.BUSINESS_LICENSE) return 'business-license';
        return `generic-stream-${index || Date.now()}`;
    }

    /**
     * Create a new stream object with default values
     */
    function createStream(type, name, id) {
        const baseStream = {
            id: id || generateStreamId(type),
            name: name || 'New Stream',
            type: type,
            included: true,
            adjustedRank: null,

            // Revenue values
            currentRevenue: 0,
            potentialRevenue: 0,
            totalFunctionalGap: 0,

            // Gap breakdown
            complianceGap: 0,
            coverageGap: 0,

            // KPI Ratios (used for mode determination)
            complianceRatio: 0,
            coverageRatio: 0,

            // Gap priorities (for Step 2)
            gapPriorities: {
                compliance: 1,
                coverage: 2,
                third: 3  // valuation or liability depending on type
            },

            // Timestamps
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add type-specific gaps
        if (type === STREAM_TYPES.PROPERTY_TAX) {
            baseStream.valuationGap = 0;
            baseStream.mixedGapReg = 0;
            baseStream.mixedGapUnreg = 0;
            baseStream.valuationRatio = 0;
            baseStream.gapPriorities.third = 3; // Valuation is 3rd priority by default
            baseStream.thirdGapType = GAP_TYPES.VALUATION;
        } else {
            baseStream.liabilityGap = 0;
            baseStream.mixedGapCompliance = 0;
            baseStream.mixedGapCoverage = 0;
            baseStream.gapPriorities.third = 3; // Liability is 3rd priority by default
            baseStream.thirdGapType = GAP_TYPES.LIABILITY;
        }

        return baseStream;
    }

    /**
     * Notify all subscribers of a specific type
     */
    function notifySubscribers(type, data) {
        const typeSubscribers = subscribers[type] || [];
        const allSubscribers = subscribers.all || [];

        [...typeSubscribers, ...allSubscribers].forEach(callback => {
            try {
                callback(data, type);
            } catch (e) {
                console.error('RosraStateManager: Error in subscriber callback', e);
            }
        });
    }

    /**
     * Persist state to localStorage (for page refresh survival)
     */
    function persistToStorage() {
        try {
            localStorage.setItem('rosraState', JSON.stringify(state));
            console.log('RosraStateManager: State persisted to localStorage');
        } catch (e) {
            console.error('RosraStateManager: Error persisting to localStorage', e);
        }
    }

    /**
     * Load state from localStorage
     */
    function loadFromStorage() {
        try {
            const saved = localStorage.getItem('rosraState');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(state, parsed);
                console.log('RosraStateManager: State loaded from localStorage', state.streams.length, 'streams');
                return true;
            }
        } catch (e) {
            console.error('RosraStateManager: Error loading from localStorage', e);
        }
        return false;
    }

    // Public API
    const RosraStateManager = {
        // Constants
        STREAM_TYPES,
        GAP_TYPES,

        /**
         * Initialize the state manager
         * @param {boolean} loadSaved - Whether to load saved state from localStorage
         */
        init: function(loadSaved = true) {
            if (loadSaved) {
                loadFromStorage();
            }
            console.log('RosraStateManager: Initialized');
            return this;
        },

        /**
         * Subscribe to state changes
         * @param {string} type - 'streams', 'currency', or 'all'
         * @param {Function} callback - Function to call when state changes
         * @returns {Function} Unsubscribe function
         */
        subscribe: function(type, callback) {
            if (!subscribers[type]) {
                subscribers[type] = [];
            }
            subscribers[type].push(callback);

            // Return unsubscribe function
            return function() {
                const index = subscribers[type].indexOf(callback);
                if (index > -1) {
                    subscribers[type].splice(index, 1);
                }
            };
        },

        /**
         * Get all streams
         * @returns {Array} Copy of streams array
         */
        getStreams: function() {
            return [...state.streams];
        },

        /**
         * Get a specific stream by ID
         * @param {string} streamId
         * @returns {Object|null}
         */
        getStream: function(streamId) {
            const stream = state.streams.find(s => s.id === streamId);
            return stream ? { ...stream } : null;
        },

        /**
         * Get streams by type
         * @param {string} type - Stream type
         * @returns {Array}
         */
        getStreamsByType: function(type) {
            return state.streams.filter(s => s.type === type).map(s => ({ ...s }));
        },

        /**
         * Get only included streams (for prioritization)
         * @returns {Array}
         */
        getIncludedStreams: function() {
            return state.streams.filter(s => s.included).map(s => ({ ...s }));
        },

        /**
         * Add or update a stream
         * @param {Object} streamData - Stream data to add/update
         * @returns {Object} The added/updated stream
         */
        upsertStream: function(streamData) {
            const existingIndex = state.streams.findIndex(s => s.id === streamData.id);

            if (existingIndex > -1) {
                // Update existing stream
                state.streams[existingIndex] = {
                    ...state.streams[existingIndex],
                    ...streamData,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Add new stream
                const newStream = createStream(
                    streamData.type || STREAM_TYPES.GENERIC,
                    streamData.name,
                    streamData.id
                );
                Object.assign(newStream, streamData);
                state.streams.push(newStream);
            }

            state.lastUpdated = new Date().toISOString();
            persistToStorage();
            notifySubscribers('streams', state.streams);

            return this.getStream(streamData.id);
        },

        /**
         * Update specific fields of a stream
         * @param {string} streamId
         * @param {Object} updates - Fields to update
         */
        updateStream: function(streamId, updates) {
            const stream = state.streams.find(s => s.id === streamId);
            if (stream) {
                Object.assign(stream, updates, { updatedAt: new Date().toISOString() });
                state.lastUpdated = new Date().toISOString();
                persistToStorage();
                notifySubscribers('streams', state.streams);
            }
            return this.getStream(streamId);
        },

        /**
         * Remove a stream
         * @param {string} streamId
         */
        removeStream: function(streamId) {
            const index = state.streams.findIndex(s => s.id === streamId);
            if (index > -1) {
                state.streams.splice(index, 1);
                state.lastUpdated = new Date().toISOString();
                persistToStorage();
                notifySubscribers('streams', state.streams);
            }
        },

        /**
         * Update Property Tax data (convenience method)
         */
        updatePropertyTax: function(data) {
            return this.upsertStream({
                id: 'property-tax',
                name: 'Property Tax',
                type: STREAM_TYPES.PROPERTY_TAX,
                ...data
            });
        },

        /**
         * Update Business License data (convenience method)
         */
        updateBusinessLicense: function(data) {
            return this.upsertStream({
                id: 'business-license',
                name: 'Business License',
                type: STREAM_TYPES.BUSINESS_LICENSE,
                ...data
            });
        },

        /**
         * Add or update a generic stream (convenience method)
         * @param {number} index - Stream index
         * @param {Object} data - Stream data
         */
        updateGenericStream: function(index, data) {
            const streamId = `generic-stream-${index}`;
            return this.upsertStream({
                id: streamId,
                name: data.name || `Generic Stream ${index + 1}`,
                type: STREAM_TYPES.GENERIC,
                ...data
            });
        },

        /**
         * Set stream inclusion status
         * @param {string} streamId
         * @param {boolean} included
         */
        setStreamIncluded: function(streamId, included) {
            return this.updateStream(streamId, { included });
        },

        /**
         * Set stream adjusted rank
         * @param {string} streamId
         * @param {number|null} rank
         */
        setStreamRank: function(streamId, rank) {
            return this.updateStream(streamId, { adjustedRank: rank });
        },

        /**
         * Set gap priority for a stream
         * @param {string} streamId
         * @param {string} gapType - 'compliance', 'coverage', or 'valuation'/'liability'
         * @param {number} priority - 1, 2, or 3
         */
        setGapPriority: function(streamId, gapType, priority) {
            const stream = state.streams.find(s => s.id === streamId);
            if (stream) {
                stream.gapPriorities[gapType] = priority;
                stream.updatedAt = new Date().toISOString();
                state.lastUpdated = new Date().toISOString();
                persistToStorage();
                notifySubscribers('streams', state.streams);
            }
        },

        /**
         * Get currency settings
         */
        getCurrency: function() {
            return {
                symbol: state.currencySymbol,
                code: state.currencyCode
            };
        },

        /**
         * Set currency settings
         */
        setCurrency: function(symbol, code) {
            state.currencySymbol = symbol;
            state.currencyCode = code || state.currencyCode;
            persistToStorage();
            notifySubscribers('currency', { symbol, code });
        },

        /**
         * Calculate total functional gap across all included streams
         */
        getTotalFunctionalGap: function() {
            return state.streams
                .filter(s => s.included)
                .reduce((sum, s) => sum + (s.totalFunctionalGap || 0), 0);
        },

        /**
         * Get streams sorted by total functional gap (descending)
         * with default ranks assigned
         */
        getStreamsByGapRanking: function() {
            const sorted = this.getIncludedStreams()
                .sort((a, b) => b.totalFunctionalGap - a.totalFunctionalGap);

            return sorted.map((stream, index) => ({
                ...stream,
                defaultRank: index + 1,
                finalRank: stream.adjustedRank || (index + 1)
            }));
        },

        /**
         * Determine the prioritization mode for a stream based on KPI ratios
         * @param {string} streamId
         * @returns {string} 'revenue-potential', 'compliance-first', or 'overhaul'
         */
        getStreamMode: function(streamId) {
            const stream = this.getStream(streamId);
            if (!stream) return 'overhaul';

            const complianceRatio = stream.complianceRatio || 0;
            const coverageRatio = stream.coverageRatio || 0;

            if (complianceRatio >= 75) {
                return 'revenue-potential';
            } else if (coverageRatio >= 60) {
                return 'compliance-first';
            } else {
                return 'overhaul';
            }
        },

        /**
         * Get the master priority list combining all streams and gaps
         * @returns {Array} Sorted list of stream-gap combinations
         */
        getMasterPriorityList: function() {
            const includedStreams = this.getStreamsByGapRanking();
            const priorityList = [];

            includedStreams.forEach(stream => {
                // Get gaps for this stream
                const gaps = [
                    { type: 'compliance', amount: stream.complianceGap || 0, priority: stream.gapPriorities?.compliance || 1 },
                    { type: 'coverage', amount: stream.coverageGap || 0, priority: stream.gapPriorities?.coverage || 2 }
                ];

                // Add third gap based on stream type
                if (stream.type === STREAM_TYPES.PROPERTY_TAX) {
                    gaps.push({ type: 'valuation', amount: stream.valuationGap || 0, priority: stream.gapPriorities?.third || 3 });
                } else {
                    gaps.push({ type: 'liability', amount: stream.liabilityGap || 0, priority: stream.gapPriorities?.third || 3 });
                }

                // Add each gap to priority list
                gaps.forEach(gap => {
                    if (gap.amount > 0) {
                        priorityList.push({
                            streamId: stream.id,
                            streamName: stream.name,
                            streamRank: stream.finalRank,
                            gapType: gap.type,
                            gapAmount: gap.amount,
                            gapPriority: gap.priority,
                            // Combined sort key: stream rank * 10 + gap priority
                            sortKey: (stream.finalRank * 10) + gap.priority
                        });
                    }
                });
            });

            // Sort by combined sort key
            return priorityList.sort((a, b) => a.sortKey - b.sortKey);
        },

        /**
         * Clear all state
         */
        clear: function() {
            state.streams = [];
            state.lastUpdated = new Date().toISOString();
            localStorage.removeItem('rosraState');
            notifySubscribers('streams', state.streams);
        },

        /**
         * Export state as JSON (for debugging or saving)
         */
        exportState: function() {
            return JSON.stringify(state, null, 2);
        },

        /**
         * Import state from JSON
         */
        importState: function(jsonString) {
            try {
                const imported = JSON.parse(jsonString);
                Object.assign(state, imported);
                persistToStorage();
                notifySubscribers('streams', state.streams);
                notifySubscribers('currency', { symbol: state.currencySymbol, code: state.currencyCode });
                return true;
            } catch (e) {
                console.error('RosraStateManager: Error importing state', e);
                return false;
            }
        }
    };

    // Expose to global scope
    window.RosraStateManager = RosraStateManager;

    // Auto-initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => RosraStateManager.init());
    } else {
        RosraStateManager.init();
    }

})(window);
