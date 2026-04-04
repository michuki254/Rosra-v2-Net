/**
 * Top-Down Analysis PDF Export
 * Reads data from the DOM, builds a print-ready HTML page, and opens browser print dialog.
 */
$(document).ready(function () {
    $('#exportTopDownPdfBtn').click(function () {
        function getVal(id) {
            var el = document.getElementById(id);
            return el ? el.textContent.trim() : '-';
        }

        // Capture chart images as base64
        var chartImages = {};
        if (typeof window.captureAllCharts === 'function') {
            chartImages = window.captureAllCharts();
        }

        function chartImg(canvasId, height) {
            var h = height || 250;
            // Check registry for the chart and try direct canvas capture if registry capture failed
            if (!chartImages[canvasId] && window.RosraChartRegistry && window.RosraChartRegistry[canvasId]) {
                try {
                    var chart = window.RosraChartRegistry[canvasId];
                    if (chart && typeof chart.toBase64Image === 'function') {
                        var b64 = chart.toBase64Image('image/png', 1.0);
                        chartImages[canvasId] = b64.replace(/^data:image\/png;base64,/, '');
                    }
                } catch (e) { /* skip */ }
            }
            // Also try raw canvas capture as fallback
            if (!chartImages[canvasId]) {
                var canvas = document.getElementById(canvasId);
                if (canvas && canvas.tagName === 'CANVAS' && canvas.width > 0 && canvas.height > 0) {
                    try {
                        var b64 = canvas.toDataURL('image/png');
                        chartImages[canvasId] = b64.replace(/^data:image\/png;base64,/, '');
                    } catch (e) { /* skip */ }
                }
            }
            if (chartImages[canvasId] && chartImages[canvasId].length > 100) {
                return '<img src="data:image/png;base64,' + chartImages[canvasId] + '" style="width:100%;max-height:' + h + 'px;object-fit:contain;" />';
            }
            return '<div style="background:#f1f3f5;padding:30px;text-align:center;color:#868e96;border-radius:8px;font-size:12px;">Chart not available — ensure the Top-Down tab is visible before exporting</div>';
        }

        // Read all data from the page
        var country = $('#country option:selected').text().trim() || '-';
        var region = $('#region option:selected').text().trim() || '-';
        var city = $('#city option:selected').text().trim() || '-';
        var financialYear = $('#financialYear').val() || '-';
        var currency = getVal('selectedCurrencyDisplay') || '-';
        var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol() : '$';
        var incomeLevel = getVal('incomeLevel') || $('#incomeLevel').val() || '-';
        var govType = getVal('governmentType') || $('#governmentType').val() || '-';

        // Peer SNG metrics
        var actualOSR = getVal('m2ActualOSRTop');
        var subnationalGDP = getVal('m2SubnationalGDPTop');
        var frontierMult = getVal('m2FrontierMultiplierTop');
        var subjectMult = getVal('m2SubjectMultiplierTop');
        var osrPotential = getVal('m2OSRPotentialTop');
        var osrGap = getVal('m2OSRGapTop');
        var perfIndex = getVal('m2PerformanceIndexTop');
        var resultText = getVal('module2ResultTextTop');

        // Cross-country
        var sngRevPC = getVal('sngRevenuePerCapita');
        var peerBenchFund = getVal('peerBenchmarkFunding');
        var fundIdx = getVal('fundingIndex');
        var fundHead = getVal('fundingHeadroom');
        var nonGrants = getVal('nonGrantsShare');
        var peerBenchAuto = getVal('peerBenchmarkAutonomy');
        var autoIdx = getVal('autonomyIndex');
        var distBench = getVal('distanceFromBenchmark');
        var posRel = getVal('positionRelative');
        var ccResultText = getVal('analysisResultText');
        var hasCrossCountry = sngRevPC !== '-' && sngRevPC !== '';

        var html = '<!DOCTYPE html><html><head><title>Top-Down Analysis - ' + country + '</title>';
        html += '<style>';
        html += 'body { font-family: "Segoe UI", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 30px; color: #212529; }';
        html += 'h1 { color: #00689D; font-size: 24px; margin-bottom: 4px; }';
        html += '.subtitle { color: #6c757d; font-size: 13px; margin-bottom: 20px; }';
        html += '.header-line { height: 3px; background: #00b2e3; margin-bottom: 25px; }';
        html += '.card { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }';
        html += '.card-header { background: #00689D; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; }';
        html += '.card-header.cyan { background: #00b2e3; }';
        html += '.card-header .badge { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 8px; }';
        html += '.card-body { padding: 0; }';
        html += '.field-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0; }';
        html += '.field { padding: 10px 16px; border-bottom: 1px solid #f1f3f5; }';
        html += '.field-label { font-size: 10px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }';
        html += '.field-value { font-size: 14px; font-weight: 500; margin-top: 2px; }';
        html += '.metric-row { display: flex; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid #f1f3f5; }';
        html += '.metric-row:last-child { border-bottom: none; }';
        html += '.metric-label { font-size: 12px; }';
        html += '.metric-value { font-size: 13px; font-weight: 600; }';
        html += '.metric-row.highlight { background: #FFF3E0; }';
        html += '.metric-row.blue { background: #EBF5FB; }';
        html += '.metric-row.teal { background: #E0F2F1; }';
        html += '.metric-row.light-blue { background: #DBEAFE; }';
        html += '.result-box { background: #FFF8E1; border: 1px solid #FFE082; border-radius: 8px; padding: 14px 16px; margin: 16px 0; }';
        html += '.result-title { font-weight: 700; font-size: 12px; color: #E65100; margin-bottom: 6px; }';
        html += '.result-text { font-size: 12px; line-height: 1.5; color: #333; }';
        html += '.charts-row { display: flex; flex-direction: column; gap: 20px; margin: 16px 0; }';
        html += '.chart-box { text-align: center; }';
        html += '.chart-title { font-size: 11px; font-weight: 600; color: #333; margin-bottom: 6px; }';
        html += '.section-divider { margin: 30px 0 20px; }';
        html += '.section-title { font-size: 18px; font-weight: 700; color: #00689D; }';
        html += '.section-desc { font-size: 11px; color: #6c757d; }';
        html += '.footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6; font-size: 10px; color: #868e96; text-align: center; }';
        html += '.gap-value { color: #E65100; font-weight: 700; }';
        html += '@media print { body { padding: 15px; } .card { break-inside: avoid; } .chart-box { break-inside: avoid; } .result-box { break-inside: avoid; } .section-divider { break-after: avoid; } .charts-row { break-inside: avoid; } .metric-row { break-inside: avoid; } }';
        html += '</style></head><body>';

        // Header
        html += '<h1>Top-Down Analysis Report</h1>';
        html += '<div class="subtitle">' + country + (region !== '-' ? ' &gt; ' + region : '') + (city !== '-' ? ' &gt; ' + city : '') + '  |  Financial Year: ' + financialYear + '  |  Currency: ' + currency + ' (' + currencySymbol + ')</div>';
        html += '<div class="header-line"></div>';

        // Data Input Card
        html += '<div class="card">';
        html += '<div class="card-header">Data Input Summary</div>';
        html += '<div class="card-body"><div class="field-grid">';
        html += '<div class="field"><div class="field-label">Country</div><div class="field-value">' + country + '</div></div>';
        html += '<div class="field"><div class="field-label">Financial Year</div><div class="field-value">' + financialYear + '</div></div>';
        html += '<div class="field"><div class="field-label">Currency</div><div class="field-value">' + currency + ' (' + currencySymbol + ')</div></div>';
        html += '<div class="field"><div class="field-label">Income Level</div><div class="field-value">' + incomeLevel + '</div></div>';
        html += '<div class="field"><div class="field-label">Region/State</div><div class="field-value">' + region + '</div></div>';
        html += '<div class="field"><div class="field-label">City/Municipality</div><div class="field-value">' + city + '</div></div>';
        html += '<div class="field"><div class="field-label">Government Type</div><div class="field-value">' + govType + '</div></div>';
        html += '</div></div></div>';

        // Within-Country OSR Frontier
        html += '<div class="card">';
        html += '<div class="card-header cyan">Within-Country OSR Frontier (Peer SNGs) <span class="badge">Primary Analysis</span></div>';
        html += '<div class="card-body">';
        html += '<div class="metric-row"><span class="metric-label">Own Source Revenues (OSRs) per capita</span><span class="metric-value">' + actualOSR + '</span></div>';
        html += '<div class="metric-row"><span class="metric-label">Subnational GDP per capita</span><span class="metric-value">' + subnationalGDP + '</span></div>';
        html += '<div class="metric-row blue"><span class="metric-label"><strong>Peer frontier multiplier</strong> (Top-20% avg OSR/GDP per capita)</span><span class="metric-value"><strong>' + frontierMult + '</strong></span></div>';
        html += '<div class="metric-row"><span class="metric-label">Subject multiplier</span><span class="metric-value">' + subjectMult + '</span></div>';
        html += '<div class="metric-row light-blue"><span class="metric-label"><strong>Frontier benchmark per capita</strong></span><span class="metric-value"><strong>' + osrPotential + '</strong></span></div>';
        html += '<div class="metric-row highlight"><span class="metric-label"><strong>Gap to frontier benchmark</strong></span><span class="metric-value gap-value">' + osrGap + '</span></div>';
        html += '<div class="metric-row teal"><span class="metric-label"><strong>Performance Index</strong></span><span class="metric-value"><strong>' + perfIndex + '</strong></span></div>';
        html += '</div></div>';

        // Charts
        html += '<div class="charts-row">';
        html += '<div class="chart-box"><div class="chart-title">OSR/GDP Multiplier Comparison</div>' + chartImg('peerSngChartTop', 280) + '</div>';
        html += '<div class="chart-box"><div class="chart-title">Current OSR vs Frontier Benchmark</div>' + chartImg('actualVsPotentialChart', 280) + '</div>';
        html += '</div>';

        // Result text
        if (resultText && resultText !== '-') {
            html += '<div class="result-box"><div class="result-title">Within-Country OSR Frontier Result</div><div class="result-text">' + resultText + '</div></div>';
        }

        // Cross-Country
        if (hasCrossCountry) {
            html += '<div class="section-divider"><div class="section-title">Cross-Country Fiscal Analysis</div>';
            html += '<div class="section-desc">Compare your country\'s position in the global fiscal decentralisation space</div></div>';

            // A. Funding
            html += '<div class="card">';
            html += '<div class="card-header cyan">A &nbsp; Funding Decentralization Frontier</div>';
            html += '<div class="card-body">';
            html += '<div class="metric-row"><span class="metric-label">SNG revenue per capita</span><span class="metric-value">' + sngRevPC + '</span></div>';
            html += '<div class="metric-row blue"><span class="metric-label"><strong>Peer benchmark (top-20% avg)</strong></span><span class="metric-value"><strong>' + peerBenchFund + '</strong></span></div>';
            html += '<div class="metric-row teal"><span class="metric-label"><strong>Funding index</strong></span><span class="metric-value"><strong>' + fundIdx + '</strong></span></div>';
            html += '<div class="metric-row light-blue"><span class="metric-label"><strong>Funding headroom (USD per capita)</strong></span><span class="metric-value"><strong>' + fundHead + '</strong></span></div>';
            html += '</div></div>';

            // B. Autonomy
            html += '<div class="card">';
            html += '<div class="card-header cyan">B &nbsp; Subnational Revenue Autonomy</div>';
            html += '<div class="card-body">';
            html += '<div class="metric-row"><span class="metric-label">Non-grants share of SNG revenue (%)</span><span class="metric-value">' + nonGrants + '</span></div>';
            html += '<div class="metric-row blue"><span class="metric-label"><strong>Peer benchmark (top-20% avg)</strong></span><span class="metric-value"><strong>' + peerBenchAuto + '</strong></span></div>';
            html += '<div class="metric-row teal"><span class="metric-label"><strong>Autonomy index</strong></span><span class="metric-value"><strong>' + autoIdx + '</strong></span></div>';
            html += '<div class="metric-row"><span class="metric-label">Distance from peer benchmark (% pts)</span><span class="metric-value">' + distBench + '</span></div>';
            html += '<div class="metric-row highlight"><span class="metric-label"><strong>Position relative to peer benchmark</strong></span><span class="metric-value gap-value">' + posRel + '</span></div>';
            html += '</div></div>';

            // Fiscal chart
            html += '<div style="margin:16px 0;text-align:center;">';
            html += '<div class="chart-title">Position in Fiscal Decentralisation Space</div>';
            html += chartImg('fiscalDecentralisationChart', 320);
            html += '</div>';

            // CC result text
            if (ccResultText && ccResultText !== '-') {
                html += '<div class="result-box"><div class="result-title">Cross-Country Fiscal Analysis Result</div><div class="result-text">' + ccResultText + '</div></div>';
            }
        }

        // Footer
        html += '<div class="footer">Generated by ROSRA - Rapid Own-Source Revenue Analysis Tool | UN-Habitat | ' + new Date().toLocaleDateString() + '</div>';
        html += '</body></html>';

        // Open in new window and trigger print
        var printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(function () { printWindow.print(); }, 500);
    });
});
