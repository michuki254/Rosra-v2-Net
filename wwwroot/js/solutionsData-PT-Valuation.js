/**
 * Property Tax - Valuation Solutions (7)
 * Full details for all valuation gap solutions
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTValuation = [
        {
            solutionId: 'PT-VAL-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'Method: Upgrade to zone-based notional values',
            shortTitle: 'Zone-Based Values',
            timeline: '1-3 years',
            category: 'Method',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Current values are arbitrary or outdated; no systematic basis for assessment.',
                whatYouDo: 'Divide city into value zones based on location; assign notional values per zone; apply to property characteristics.',
                whenThisFitsBest: 'Starting from flat-rate system; market data limited; quick improvement needed.',
                minimumEnablers: 'Zone mapping; value-setting methodology; legal authority; update process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to establish zone-based valuation',
                    'Zone boundary determination process',
                    'Value-setting criteria and procedures',
                    'Update/revision cycle requirements'
                ],
                howItWorks: 'Divide jurisdiction into zones based on location desirability (proximity to services, commercial centers, infrastructure). Assign base values per square meter to each zone. Calculate property value as: Zone base value × Property size × Use factor. This creates transparent, defensible values without requiring individual appraisals.',
                implementationMilestones: [
                    'Map zones based on location factors',
                    'Research market data to set zone values',
                    'Define use factors (residential, commercial, industrial)',
                    'Calculate values for all properties',
                    'Publish zone map and values for public comment',
                    'Implement with phased increases if needed'
                ],
                administrativeEssentials: [
                    'Zone boundary maintenance',
                    'Value update procedures',
                    'Public communication about zone system',
                    'Appeals handling for zone disputes'
                ],
                whenNotApplicable: [
                    'Already have good market-based values',
                    'Extreme variation within zones makes zoning impractical',
                    'Political constraints prevent any value increases'
                ],
                caseNotes: 'Zone-based systems are used successfully in many developing countries. They provide fairness and transparency while being administratively simple. Key is getting zone boundaries right.',
                resources: [
                    { title: 'IGC Property Tax Toolkit - Valuation Methods', url: 'https://www.theigc.org/collections/property-tax-diagnostic-toolkit' }
                ]
            }
        },
        {
            solutionId: 'PT-VAL-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'Method: Introduce points-based valuation (area-anchored)',
            shortTitle: 'Points-Based Valuation',
            timeline: '1-3 years',
            category: 'Method',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Need simple, transparent system that captures property differences without full market valuation.',
                whatYouDo: 'Develop points formula based on: location, size, use, construction quality; convert points to values.',
                whenThisFitsBest: 'Property characteristics data available; transparency valued; market data limited.',
                minimumEnablers: 'Property data; formula design; legal authority; calculator/system.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to use points-based methodology',
                    'Formula approval process',
                    'Point-to-value conversion rules',
                    'Update procedures'
                ],
                howItWorks: 'Create a scoring system: Location (1-10 points by zone), Size (points per sqm), Construction (points for quality/materials), Use (residential=1, commercial=2, etc.). Total points × monetary factor = assessed value. Formula is public and taxpayers can verify their calculation.',
                implementationMilestones: [
                    'Design points formula with stakeholder input',
                    'Test formula on sample properties',
                    'Collect/verify property characteristic data',
                    'Calculate values for all properties',
                    'Build calculator for public use',
                    'Implement with appeals process'
                ],
                administrativeEssentials: [
                    'Data maintenance',
                    'Calculator availability',
                    'Appeals handling',
                    'Periodic formula review'
                ],
                whenNotApplicable: [
                    'Property data is too poor',
                    'Market-based values work well',
                    'Formula complexity not accepted'
                ],
                caseNotes: 'Points systems are transparent and can be verified by taxpayers. Design requires balancing simplicity with accuracy.',
                resources: []
            }
        },
        {
            solutionId: 'PT-VAL-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'Method: Develop simplified mass appraisal ("CAMA-Lite")',
            shortTitle: 'Simplified Mass Appraisal',
            timeline: '1-3 years',
            category: 'Method',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Want market-based values but full CAMA is too complex or expensive.',
                whatYouDo: 'Use limited market data to develop simple regression models; apply to property characteristics.',
                whenThisFitsBest: 'Some sales data exists; analytical capacity available; intermediate approach wanted.',
                minimumEnablers: 'Sales data; property characteristics; statistical expertise; modeling tools.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to use statistical valuation',
                    'Data requirements and sources',
                    'Model validation standards',
                    'Appeal procedures for statistical values'
                ],
                howItWorks: 'Collect sales data for 1-2 years. Build simple regression model: Value = f(location, size, age, quality). Apply model to all properties to estimate market values. Validate model accuracy with holdout sample. Simpler than full CAMA but more accurate than flat rates.',
                implementationMilestones: [
                    'Establish sales data collection',
                    'Clean and analyze sales data',
                    'Build and validate regression model',
                    'Apply model to property database',
                    'Review and adjust outliers',
                    'Implement with disclosure of methodology'
                ],
                administrativeEssentials: [
                    'Ongoing sales data collection',
                    'Model maintenance expertise',
                    'Outlier review process',
                    'Periodic model recalibration'
                ],
                whenNotApplicable: [
                    'Too few sales for reliable model',
                    'No statistical expertise',
                    'Property data too incomplete'
                ],
                caseNotes: 'CAMA-Lite can achieve 80% of CAMA accuracy with 20% of the effort. Good stepping stone to full CAMA.',
                resources: []
            }
        },
        {
            solutionId: 'PT-VAL-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'Method: Deploy full CAMA / machine-learning valuation',
            shortTitle: 'Full CAMA System',
            timeline: '3+ years',
            category: 'Method',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Want accurate, defensible market values that update automatically.',
                whatYouDo: 'Implement computer-assisted mass appraisal system with statistical models or machine learning.',
                whenThisFitsBest: 'Active property market; good data; technical capacity; long-term commitment.',
                minimumEnablers: 'Comprehensive property and sales data; CAMA software; trained valuers; ongoing maintenance.'
            },
            fullDetails: {
                legalEssentials: [
                    'Market value standard in law',
                    'CAMA methodology authorization',
                    'Professional standards for valuers',
                    'Appeal rights and procedures'
                ],
                howItWorks: 'Full CAMA uses sophisticated statistical or machine learning models to estimate market values. Requires: comprehensive property database, robust sales data, professional valuers, specialized software. Models are calibrated annually and validated against actual sales.',
                implementationMilestones: [
                    'Assess readiness (data, capacity, legal)',
                    'Procure CAMA software',
                    'Build comprehensive property database',
                    'Establish sales data collection',
                    'Train valuation staff',
                    'Develop and calibrate models',
                    'Implement with public outreach'
                ],
                administrativeEssentials: [
                    'Dedicated valuation unit',
                    'Ongoing data collection',
                    'Annual model calibration',
                    'Quality assurance program'
                ],
                whenNotApplicable: [
                    'Weak property market',
                    'Insufficient data',
                    'No long-term capacity',
                    'Simpler methods suffice'
                ],
                caseNotes: 'Full CAMA is the gold standard but requires sustained investment. Many jurisdictions do well with simpler methods.',
                resources: []
            }
        },
        {
            solutionId: 'PT-VAL-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'System: Establish fixed revaluation cycles with annual indexing',
            shortTitle: 'Revaluation Cycles',
            timeline: '1-3 years',
            category: 'System',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Values become outdated; sporadic revaluations cause taxpayer shock.',
                whatYouDo: 'Set regular revaluation cycle (3-5 years); apply annual index between revaluations.',
                whenThisFitsBest: 'Valuation system exists; resources for periodic updates; index data available.',
                minimumEnablers: 'Legal authority for cycles and indexing; index selection; communication plan.'
            },
            fullDetails: {
                legalEssentials: [
                    'Revaluation cycle requirement in law',
                    'Indexing authority and methodology',
                    'Limits on annual increases',
                    'Notice requirements'
                ],
                howItWorks: 'Establish 3-5 year revaluation cycle where all properties are reassessed. Between revaluations, apply annual index (e.g., inflation, construction cost index) to maintain currency. Indexing prevents values from becoming stale and reduces shock at revaluation.',
                implementationMilestones: [
                    'Establish legal framework',
                    'Select appropriate index',
                    'Plan first revaluation cycle',
                    'Implement annual indexing',
                    'Communicate schedule to public'
                ],
                administrativeEssentials: [
                    'Revaluation planning and execution',
                    'Index application annually',
                    'Public communication',
                    'Appeals handling at revaluation'
                ],
                whenNotApplicable: [
                    'No valuation system yet',
                    'Political constraint on any increases',
                    'No suitable index available'
                ],
                caseNotes: 'Regular cycles reduce political battles and taxpayer shock. Indexing is less accurate than revaluation but maintains revenue.',
                resources: []
            }
        },
        {
            solutionId: 'PT-VAL-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'QA: Perform regular ratio studies & fairness checks',
            shortTitle: 'Ratio Studies',
            timeline: '1-3 years',
            category: 'QA',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'No way to know if values are accurate or fair; systematic errors persist.',
                whatYouDo: 'Conduct ratio studies comparing assessed values to sales prices; identify areas needing correction.',
                whenThisFitsBest: 'Sales data available; analytical capacity exists.',
                minimumEnablers: 'Sales data; ratio study methodology; correction process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Sales data access',
                    'Ratio study standards',
                    'Correction authority'
                ],
                howItWorks: 'Compare assessed values to actual sales prices. Calculate: median ratio (should be near target), coefficient of dispersion (should be low), price-related differential (should be near 1). Identify problem areas: under-assessed neighborhoods, regressive valuation, etc. Take corrective action.',
                implementationMilestones: [
                    'Establish sales data collection',
                    'Learn ratio study methodology',
                    'Conduct baseline study',
                    'Identify and correct problems',
                    'Make ratio studies routine'
                ],
                administrativeEssentials: [
                    'Sales data management',
                    'Analysis capability',
                    'Correction procedures'
                ],
                whenNotApplicable: [
                    'No sales data available',
                    'No analytical capacity',
                    'Flat-rate system with no values'
                ],
                caseNotes: 'Ratio studies are fundamental quality assurance. Even simple analysis can identify major problems.',
                resources: []
            }
        },
        {
            solutionId: 'PT-VAL-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Valuation',
            title: 'Governance: Publish rolls, run timely appeals, separate functions',
            shortTitle: 'Valuation Governance',
            timeline: '1-3 years',
            category: 'Governance',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Valuation process lacks transparency and accountability; disputes unresolved.',
                whatYouDo: 'Publish valuation rolls; establish independent appeal process; separate assessment from tax collection.',
                whenThisFitsBest: 'Governance reform is priority; capacity for institutional change.',
                minimumEnablers: 'Legal framework; institutional structures; appeal body; publication mechanisms.'
            },
            fullDetails: {
                legalEssentials: [
                    'Roll publication requirements',
                    'Appeal body composition and authority',
                    'Separation of functions',
                    'Timeline requirements'
                ],
                howItWorks: 'Three governance pillars: (1) Publish valuation roll so taxpayers can see their value and compare with neighbors; (2) Establish independent appeal body that is not part of revenue department; (3) Separate assessment function from billing/collection to reduce conflicts of interest.',
                implementationMilestones: [
                    'Establish roll publication requirements and channels',
                    'Create or designate independent appeal body',
                    'Define separation of functions',
                    'Implement governance reforms',
                    'Monitor and report on performance'
                ],
                administrativeEssentials: [
                    'Roll publication logistics',
                    'Appeal body administration',
                    'Function separation management'
                ],
                whenNotApplicable: [
                    'Very simple system with no values',
                    'Governance reform not politically feasible'
                ],
                caseNotes: 'Good governance builds legitimacy and public acceptance. Transparency and fair appeals are essential for sustainable property tax.',
                resources: []
            }
        }
    ];

})(window);
