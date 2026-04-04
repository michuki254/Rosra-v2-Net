/**
 * Bottom-Up Analysis PDF Export (Gap Analysis + Prioritization)
 * Order matches the frontend exactly:
 *   Per stream: KPIs → Revenue Table → Matrix → Gap Table → Charts
 *   Then: Summary Totals → Prioritization
 */
$(document).ready(function () {
    $('#exportBottomUpPdfBtn').click(function () {

        function g(id) {
            var el = document.getElementById(id);
            return el ? el.textContent.trim() : '-';
        }

        var chartImages = {};
        if (typeof window.captureAllCharts === 'function') chartImages = window.captureAllCharts();

        function chartImg(canvasId, h) {
            h = h || 300;
            if (!chartImages[canvasId] && window.RosraChartRegistry && window.RosraChartRegistry[canvasId]) {
                try { var b = window.RosraChartRegistry[canvasId].toBase64Image('image/png', 1.0); chartImages[canvasId] = b.replace(/^data:image\/png;base64,/, ''); } catch (e) {}
            }
            if (!chartImages[canvasId]) {
                var c = document.getElementById(canvasId);
                if (c && c.tagName === 'CANVAS' && c.width > 0) try { chartImages[canvasId] = c.toDataURL('image/png').replace(/^data:image\/png;base64,/, ''); } catch (e) {}
            }
            if (chartImages[canvasId] && chartImages[canvasId].length > 100)
                return '<img src="data:image/png;base64,' + chartImages[canvasId] + '" style="width:100%;max-height:' + h + 'px;object-fit:contain;" />';
            return '';
        }

        function buildMatrix(title, yTop, yMid, yBot, xLeft, xMid, xRight,
            tlVal, trVal, mlVal, mrVal, blVal, brVal,
            tlLbl, trLbl, mlLbl, mrLbl, blLbl, brLbl) {
            var m = '<div class="matrix-card"><h3>' + title + '</h3>';
            m += '<div class="matrix-wrap"><div class="matrix-y">';
            m += '<div><b>' + yTop + '</b><br><small>Estimated</small></div>';
            m += '<div><b>' + yMid + '</b><br><small>Registered</small></div>';
            m += '<div><b>' + yBot + '</b><br><small>Compliant</small></div></div>';
            m += '<div class="matrix-grid">';
            m += '<div class="mc" style="background:#FF9800;"><small>' + tlLbl + '</small><b>' + tlVal + '</b></div>';
            m += '<div class="mc" style="background:#E91E63;"><small>' + trLbl + '</small><b>' + trVal + '</b></div>';
            m += '<div class="mc big" style="background:#F44336;"><small>' + mlLbl + '</small><b>' + mlVal + '</b></div>';
            m += '<div class="mc big" style="background:#9C27B0;"><small>' + mrLbl + '</small><b>' + mrVal + '</b></div>';
            m += '<div class="mc" style="background:#4CAF50;"><small>' + blLbl + '</small><b>' + blVal + '</b></div>';
            m += '<div class="mc" style="background:#2196F3;"><small>' + brLbl + '</small><b>' + brVal + '</b></div>';
            m += '</div></div>';
            m += '<div class="matrix-x"><span>' + xLeft + '</span><span>Avg. Billed: <b>' + xMid + '</b></span><span>' + xRight + '</span></div></div>';
            return m;
        }

        function gapTable(title, rows) {
            var t = '<div class="card"><div class="card-hdr">' + title + '</div><table><thead><tr><th>Gap Type</th><th class="r">Amount</th><th class="r">%</th></tr></thead><tbody>';
            rows.forEach(function (r) {
                var cls = r[3] ? ' class="total"' : '';
                t += '<tr' + cls + '><td>' + r[0] + '</td><td class="r">' + r[1] + '</td><td class="r">' + r[2] + '</td></tr>';
            });
            t += '</tbody></table></div>';
            return t;
        }

        function revenueTable(title, rows) {
            var t = '<div class="card"><div class="card-hdr cyan">' + title + '</div><table><thead><tr><th>Component</th><th class="r">Amount</th><th class="r">%</th></tr></thead><tbody>';
            rows.forEach(function (r) {
                var cls = r[3] ? ' class="total"' : (r[4] ? ' class="gap"' : '');
                t += '<tr' + cls + '><td>' + r[0] + '</td><td class="r">' + r[1] + '</td><td class="r">' + r[2] + '</td></tr>';
            });
            t += '</tbody></table></div>';
            return t;
        }

        var cs = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol() : '$';
        var country = $('#country option:selected').text().trim() || '-';
        var region = $('#region option:selected').text().trim() || '-';

        // ========== BUILD HTML ==========
        var html = '<!DOCTYPE html><html><head><title>Bottom-Up Gap Analysis</title><style>';
        html += 'body{font-family:"Segoe UI",Arial,sans-serif;max-width:920px;margin:0 auto;padding:25px;color:#212529;font-size:11px;}';
        html += 'h1{color:#00689D;font-size:22px;margin-bottom:2px;} h2{color:#00689D;font-size:15px;margin:22px 0 8px;border-bottom:2px solid #00b2e3;padding-bottom:5px;} h3{font-size:12px;color:#333;margin:12px 0 6px;}';
        html += '.sub{color:#6c757d;font-size:11px;margin-bottom:16px;} .hl{height:3px;background:#00b2e3;margin-bottom:18px;}';
        html += '.card{border:1px solid #e2e8f0;border-radius:6px;margin-bottom:14px;overflow:hidden;}';
        html += '.card-hdr{padding:7px 12px;font-weight:700;font-size:12px;color:#fff;background:#00689D;} .card-hdr.cyan{background:#00b2e3;} .card-hdr.green{background:#10b981;} .card-hdr.orange{background:#f59e0b;color:#212529;}';
        html += 'table{width:100%;border-collapse:collapse;font-size:11px;} th{background:#f8f9fa;font-size:9px;text-transform:uppercase;letter-spacing:.5px;padding:6px 8px;text-align:left;border-bottom:2px solid #dee2e6;} td{padding:5px 8px;border-bottom:1px solid #f1f3f5;}';
        html += '.r{text-align:right;} .total td{background:#EBF5FB;font-weight:700;border-top:2px solid #dee2e6;} .gap td:nth-child(2){color:#E65100;font-weight:600;}';
        html += '.kpi{display:flex;gap:10px;margin:10px 0;} .kpi-c{flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;text-align:center;} .kpi-l{font-size:9px;color:#6c757d;text-transform:uppercase;font-weight:600;} .kpi-v{font-size:16px;font-weight:700;color:#4c6ef5;margin-top:2px;}';
        html += '.kpi-v.green{color:#10b981;} .kpi-v.red{color:#e53e3e;} .kpi-v.orange{color:#f59e0b;}';
        // Matrix styles
        html += '.matrix-card{border:1px solid #e2e8f0;border-radius:6px;padding:12px;margin:12px 0;break-inside:avoid;}';
        html += '.matrix-wrap{display:flex;gap:6px;} .matrix-y{display:flex;flex-direction:column;justify-content:space-between;width:70px;text-align:right;font-size:9px;color:#6c757d;padding:2px 0;}';
        html += '.matrix-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1.8fr auto;gap:2px;}';
        html += '.mc{color:#fff;padding:8px;border-radius:3px;text-align:center;display:flex;flex-direction:column;justify-content:center;} .mc small{font-size:9px;opacity:.9;} .mc b{font-size:12px;} .mc.big{padding:14px;} .mc.big b{font-size:14px;}';
        html += '.matrix-x{display:flex;justify-content:space-between;padding-left:76px;margin-top:4px;font-size:9px;color:#6c757d;}';
        html += '.chart-sec{text-align:center;margin:10px 0;break-inside:avoid;} .chart-t{font-size:10px;font-weight:600;margin-bottom:4px;}';
        html += '.section{margin-bottom:22px;page-break-inside:avoid;}';
        html += '.footer{margin-top:25px;padding-top:12px;border-top:1px solid #dee2e6;font-size:9px;color:#868e96;text-align:center;}';
        html += '@media print{body{padding:12px;} .card,.matrix-card,.chart-sec,.section{break-inside:avoid;} h2{break-after:avoid;}}';
        html += '</style></head><body>';

        html += '<h1>Bottom-Up Gap Analysis Report</h1>';
        html += '<div class="sub">' + country + (region !== '-' ? ' &gt; ' + region : '') + '  |  Currency: ' + cs + '  |  ' + new Date().toLocaleDateString() + '</div><div class="hl"></div>';

        // ===== PROPERTY TAX =====
        html += '<div class="section"><h2>Property Tax Gap Analysis</h2>';
        // 1. KPIs
        html += '<div class="kpi">';
        html += '<div class="kpi-c"><div class="kpi-l">Compliance Ratio</div><div class="kpi-v">' + g('complianceRatioValue') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Coverage Ratio</div><div class="kpi-v">' + g('coverageRatioValue') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Valuation Ratio</div><div class="kpi-v">' + g('valuationRatioValue') + '</div></div>';
        html += '</div>';
        // 2. Revenue Table
        html += revenueTable('Potential Revenue Breakdown', [
            ['Revenue to Date', g('tableRevenueToDate'), g('tableRevenueToDatePct')],
            ['Compliance Gap', g('tableComplianceGap'), g('tableComplianceGapPct'), false, true],
            ['Coverage Gap', g('tableCoverageGap'), g('tableCoverageGapPct'), false, true],
            ['Valuation Gap', g('tableValuationGap'), g('tableValuationGapPct'), false, true],
            ['Mixed Gap (Registered)', g('tableMixedGapReg'), g('tableMixedGapRegPct')],
            ['Mixed Gap (Unregistered)', g('tableMixedGapUnreg'), g('tableMixedGapUnregPct')],
            ['Total Potential Revenue', g('tableTotalPotential'), '100%', true]
        ]);
        // 3. Matrix
        html += buildMatrix('Property Tax Revenue Matrix',
            g('matrixEstimatedLabel'), g('matrixRegisteredLabel'), g('matrixCompliantLabel'),
            g('matrixOriginLabel'), g('matrixAvgBilledLabel'), g('matrixAvgMarketLabel'),
            g('matrixCoverageGapVal'), g('matrixMixedUnregVal'),
            g('matrixComplianceGapVal'), g('matrixMixedRegVal'),
            g('matrixActualRevenueVal'), g('matrixValuationGapVal'),
            'Coverage Gap', 'Mixed (Cov.+Val.)', 'Compliance Gap', 'Mixed (Comp.+Val.)', 'Actual Revenue', 'Valuation Gap');
        // 4. Admin Gap Table
        html += gapTable('Administrative Gap Breakdown', [
            ['Compliance Gap', g('admComplianceGap'), g('admComplianceGapPct')],
            ['Coverage Gap', g('admCoverageGap'), g('admCoverageGapPct')],
            ['Valuation Gap', g('admValuationGap'), g('admValuationGapPct')],
            ['Mixed (Registered)', g('admMixedGapReg'), g('admMixedGapRegPct')],
            ['Mixed (Unregistered)', g('admMixedGapUnreg'), g('admMixedGapUnregPct')],
            ['Total Administrative Gap', g('tableTotalAdmGap'), '100%', true]
        ]);
        // 5. Charts
        var c1 = chartImg('potentialRevenueChart', 250), c2 = chartImg('adminGapChart', 250);
        if (c1) html += '<div class="chart-sec"><div class="chart-t">Potential Revenue Distribution</div>' + c1 + '</div>';
        if (c2) html += '<div class="chart-sec"><div class="chart-t">Administrative Gap Breakdown</div>' + c2 + '</div>';
        html += '</div>';

        // ===== BUSINESS LICENSE =====
        html += '<div class="section"><h2>Business License Gap Analysis</h2>';
        html += '<div class="kpi">';
        html += '<div class="kpi-c"><div class="kpi-l">Compliance Ratio</div><div class="kpi-v">' + g('blComplianceRatioValue') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Coverage Ratio</div><div class="kpi-v">' + g('blCoverageRatioValue') + '</div></div>';
        html += '</div>';
        html += revenueTable('Potential Revenue Breakdown', [
            ['Revenue to Date', g('blTableRevenueToDate'), g('blTableRevenueToDatePct')],
            ['Compliance Gap', g('blTableComplianceGap'), g('blTableComplianceGapPct'), false, true],
            ['Coverage Gap', g('blTableCoverageGap'), g('blTableCoverageGapPct'), false, true],
            ['Liability Gap', g('blTableLiabilityGap'), g('blTableLiabilityGapPct'), false, true],
            ['Mixed (Compliance)', g('blTableMixedGapCompliance'), g('blTableMixedGapCompliancePct')],
            ['Mixed (Coverage)', g('blTableMixedGapCoverage'), g('blTableMixedGapCoveragePct')],
            ['Total Potential Revenue', g('blTableTotalPotential'), '100%', true]
        ]);
        html += buildMatrix('Business License Revenue Matrix',
            g('blMatrixEstimatedLabel'), g('blMatrixRegisteredLabel'), g('blMatrixCompliantLabel'),
            g('blMatrixOriginLabel'), g('blMatrixAvgBilledLabel'), g('blMatrixAchievableLabel'),
            g('blMatrixCoverageGapVal'), g('blMatrixMixedCoverageVal'),
            g('blMatrixComplianceGapVal'), g('blMatrixMixedComplianceVal'),
            g('blMatrixActualRevenueVal'), g('blMatrixLiabilityGapVal'),
            'Coverage Gap', 'Mixed (Cov.+Liab.)', 'Compliance Gap', 'Mixed (Comp.+Liab.)', 'Actual Revenue', 'Liability Gap');
        html += gapTable('Functional Gap Breakdown', [
            ['Compliance Gap', g('blGapComplianceGap'), g('blGapComplianceGapPct')],
            ['Coverage Gap', g('blGapCoverageGap'), g('blGapCoverageGapPct')],
            ['Liability Gap', g('blGapLiabilityGap'), g('blGapLiabilityGapPct')],
            ['Mixed (Compliance)', g('blGapMixedGapCompliance'), g('blGapMixedGapCompliancePct')],
            ['Mixed (Coverage)', g('blGapMixedGapCoverage'), g('blGapMixedGapCoveragePct')],
            ['Total Functional Gap', g('blTableTotalFunctionalGap'), '100%', true]
        ]);
        c1 = chartImg('blPotentialRevenueChart', 250); c2 = chartImg('blGapBreakdownChart', 250);
        if (c1) html += '<div class="chart-sec"><div class="chart-t">Potential Revenue Distribution</div>' + c1 + '</div>';
        if (c2) html += '<div class="chart-sec"><div class="chart-t">Functional Gap Breakdown</div>' + c2 + '</div>';
        html += '</div>';

        // ===== GENERIC STREAMS =====
        if (typeof RosraStateManager !== 'undefined' && RosraStateManager.getIncludedStreams) {
            RosraStateManager.getIncludedStreams().forEach(function (stream) {
                if (stream.type === 'propertyTax' || stream.type === 'license') return;
                var sid = stream.id || stream.streamId;
                if (!sid) return;
                html += '<div class="section"><h2>' + (stream.name || sid) + ' Gap Analysis</h2>';
                html += '<div class="kpi"><div class="kpi-c"><div class="kpi-l">Compliance</div><div class="kpi-v">' + g(sid + 'ComplianceRatioValue') + '</div></div>';
                html += '<div class="kpi-c"><div class="kpi-l">Coverage</div><div class="kpi-v">' + g(sid + 'CoverageRatioValue') + '</div></div></div>';
                html += revenueTable('Potential Revenue Breakdown', [
                    ['Revenue to Date', g(sid + 'TableRevenueToDate'), g(sid + 'TableRevenueToDatePct')],
                    ['Compliance Gap', g(sid + 'TableComplianceGap'), g(sid + 'TableComplianceGapPct'), false, true],
                    ['Coverage Gap', g(sid + 'TableCoverageGap'), g(sid + 'TableCoverageGapPct'), false, true],
                    ['Liability Gap', g(sid + 'TableLiabilityGap'), g(sid + 'TableLiabilityGapPct'), false, true],
                    ['Total Potential', g(sid + 'TableTotalPotential'), '100%', true]
                ]);
                html += buildMatrix((stream.name || sid) + ' Revenue Matrix',
                    g(sid + 'MatrixEstimatedLabel'), g(sid + 'MatrixRegisteredLabel'), g(sid + 'MatrixCompliantLabel'),
                    g(sid + 'MatrixOriginLabel'), g(sid + 'MatrixAvgBilledLabel'), g(sid + 'MatrixAchievableLabel'),
                    g(sid + 'MatrixCoverageGapVal'), g(sid + 'MatrixMixedCoverageVal'),
                    g(sid + 'MatrixComplianceGapVal'), g(sid + 'MatrixMixedComplianceVal'),
                    g(sid + 'MatrixActualRevenueVal'), g(sid + 'MatrixLiabilityGapVal'),
                    'Coverage Gap', 'Mixed (Cov.+Liab.)', 'Compliance Gap', 'Mixed (Comp.+Liab.)', 'Actual Revenue', 'Liability Gap');
                html += gapTable('Functional Gap Breakdown', [
                    ['Compliance Gap', g(sid + 'GapComplianceGap'), g(sid + 'GapComplianceGapPct')],
                    ['Coverage Gap', g(sid + 'GapCoverageGap'), g(sid + 'GapCoverageGapPct')],
                    ['Liability Gap', g(sid + 'GapLiabilityGap'), g(sid + 'GapLiabilityGapPct')],
                    ['Total Functional Gap', g(sid + 'TotalFunctionalGap'), '100%', true]
                ]);
                var sc1 = chartImg(sid + 'PotentialRevenueChart', 250), sc2 = chartImg(sid + 'GapBreakdownChart', 250);
                if (sc1) html += '<div class="chart-sec"><div class="chart-t">Revenue Distribution</div>' + sc1 + '</div>';
                if (sc2) html += '<div class="chart-sec"><div class="chart-t">Gap Breakdown</div>' + sc2 + '</div>';
                html += '</div>';
            });
        }

        // ===== REVENUE GAP SUMMARY =====
        html += '<div class="section"><h2>Revenue Gap Summary</h2>';
        html += '<div class="kpi">';
        html += '<div class="kpi-c"><div class="kpi-l">Current Revenue</div><div class="kpi-v green">' + g('totalCurrentRevenue') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Potential Revenue</div><div class="kpi-v">' + g('totalPotentialRevenue') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Total Revenue Gap</div><div class="kpi-v red">' + g('totalRevenueGap') + '</div></div>';
        html += '</div>';
        var tc = chartImg('totalGapChart', 280);
        if (tc) html += '<div class="chart-sec"><div class="chart-t">Gap Distribution by Source</div>' + tc + '</div>';
        html += '</div>';

        // ===== PRIORITIZATION =====
        html += '<div class="section"><h2>Stream Prioritization</h2>';
        html += '<div class="kpi">';
        html += '<div class="kpi-c"><div class="kpi-l">Total Streams</div><div class="kpi-v">' + g('statTotalStreams') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Included</div><div class="kpi-v green">' + g('statIncludedStreams') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Total Gap</div><div class="kpi-v">' + g('statTotalGap') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Included Gap</div><div class="kpi-v orange">' + g('statIncludedGap') + '</div></div>';
        html += '</div>';

        // Final Streams Table (read from DOM)
        var fb = document.getElementById('finalStreamBody');
        if (fb && fb.rows.length > 0) {
            html += '<div class="card"><div class="card-hdr green">Final Prioritized Streams</div><table><thead><tr><th>Rank</th><th>Stream</th><th class="r">Gap Amount</th><th class="r">Share %</th></tr></thead><tbody>';
            for (var i = 0; i < fb.rows.length; i++) {
                var c = fb.rows[i].cells;
                if (c.length >= 4) html += '<tr><td>' + c[0].textContent.trim() + '</td><td>' + c[1].textContent.trim() + '</td><td class="r">' + c[2].textContent.trim() + '</td><td class="r">' + c[3].textContent.trim() + '</td></tr>';
            }
            html += '<tr class="total"><td colspan="2">Total Included Gap</td><td class="r" colspan="2">' + g('totalIncludedGap') + '</td></tr>';
            html += '</tbody></table></div>';
        }

        var pb = chartImg('gapBarChart', 280), pp = chartImg('gapPieChart', 250);
        if (pb) html += '<div class="chart-sec"><div class="chart-t">Gap by Stream</div>' + pb + '</div>';
        if (pp) html += '<div class="chart-sec"><div class="chart-t">Gap Distribution</div>' + pp + '</div>';

        // Gap Sequencing
        html += '<h2>Gap Prioritization & Sequencing</h2>';
        html += '<div class="kpi">';
        html += '<div class="kpi-c"><div class="kpi-l">Streams</div><div class="kpi-v">' + g('gapStatTotalStreams') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Combinations</div><div class="kpi-v">' + g('gapStatTotalCombinations') + '</div></div>';
        html += '<div class="kpi-c"><div class="kpi-l">Active Gaps</div><div class="kpi-v green">' + g('gapStatActiveGaps') + '</div></div>';
        html += '</div>';

        var sb = document.getElementById('gapSequencingBody');
        if (sb && sb.rows.length > 0) {
            html += '<div class="card"><div class="card-hdr orange">Gap Sequencing by Stream</div><table><thead><tr><th>#</th><th>Stream</th><th>Mode</th><th>Priority 1</th><th>Priority 2</th><th>Priority 3</th></tr></thead><tbody>';
            for (var j = 0; j < sb.rows.length; j++) {
                var sc = sb.rows[j].cells; html += '<tr>';
                for (var k = 0; k < sc.length && k < 6; k++) html += '<td>' + sc[k].textContent.trim() + '</td>';
                html += '</tr>';
            }
            html += '</tbody></table></div>';
        }

        var mb = document.getElementById('masterPriorityBody');
        if (mb && mb.rows.length > 0) {
            html += '<div class="card"><div class="card-hdr">Master Priority List</div><table><thead><tr><th>#</th><th>Stream</th><th>Gap Type</th><th class="r">Amount</th></tr></thead><tbody>';
            for (var m = 0; m < mb.rows.length; m++) {
                var mc = mb.rows[m].cells;
                if (mc.length >= 4) html += '<tr><td>' + mc[0].textContent.trim() + '</td><td>' + mc[1].textContent.trim() + '</td><td>' + mc[2].textContent.trim() + '</td><td class="r">' + mc[3].textContent.trim() + '</td></tr>';
            }
            html += '</tbody></table></div>';
        }
        html += '</div>';

        // Footer
        html += '<div class="footer">Generated by ROSRA - Rapid Own-Source Revenue Analysis Tool | UN-Habitat | ' + new Date().toLocaleDateString() + '</div>';
        html += '</body></html>';

        var pw = window.open('', '_blank');
        pw.document.write(html);
        pw.document.close();
        pw.focus();
        setTimeout(function () { pw.print(); }, 600);
    });
});
