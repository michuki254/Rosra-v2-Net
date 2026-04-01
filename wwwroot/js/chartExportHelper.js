/**
 * Chart Export Helper - Registry and capture for Chart.js instances
 * Used to capture chart images as base64 PNG for PDF/Excel export
 */
(function() {
    'use strict';

    // Global registry for Chart.js instances
    window.RosraChartRegistry = {};

    /**
     * Register a Chart.js instance for export capture
     * @param {string} canvasId - The canvas element ID
     * @param {Chart} chartInstance - The Chart.js instance
     */
    window.registerChart = function(canvasId, chartInstance) {
        if (canvasId && chartInstance) {
            window.RosraChartRegistry[canvasId] = chartInstance;
        }
    };

    /**
     * Unregister a chart (e.g., when destroyed)
     * @param {string} canvasId - The canvas element ID
     */
    window.unregisterChart = function(canvasId) {
        delete window.RosraChartRegistry[canvasId];
    };

    /**
     * Capture all registered charts as base64 PNG images
     * @returns {Object} Map of canvasId → base64 PNG string (without data:image/png;base64, prefix)
     */
    window.captureAllCharts = function() {
        var images = {};
        for (var canvasId in window.RosraChartRegistry) {
            if (window.RosraChartRegistry.hasOwnProperty(canvasId)) {
                try {
                    var chart = window.RosraChartRegistry[canvasId];
                    if (chart && chart.canvas && typeof chart.toBase64Image === 'function') {
                        var base64 = chart.toBase64Image('image/png', 1.0);
                        // Strip the data URI prefix to reduce payload size
                        images[canvasId] = base64.replace(/^data:image\/png;base64,/, '');
                    }
                } catch (e) {
                    console.warn('Failed to capture chart:', canvasId, e);
                }
            }
        }
        console.log('Captured', Object.keys(images).length, 'chart images for export');
        return images;
    };
})();
