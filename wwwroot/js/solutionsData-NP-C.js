/**
 * ROSRA Solutions Data - Non-Property Subgroup C
 * Daily or point-of-collection charges
 * Cards organized by gap: Coverage, Liability Application, Compliance
 */
(function(window) {
    'use strict';

    window.SolutionsDataNP_C = [
        // ───────────────────────────────────────────────────────────────
        // COVERAGE SOLUTIONS (3)
        // Identifying and counting who should pay
        // ───────────────────────────────────────────────────────────────
        {
            solutionId: 'NP-C-COV-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Count and Register Daily Payers at Collection Points',
            shortTitle: 'Count & Register Payers',
            timeline: '<1 year',
            politicalResistance: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Establish a reliable count of daily users, vendors, vehicles, or other payers at each collection point. For daily charges, the coverage problem is often not that payers are unknown individually, but that no one knows how many there are or should be each day. A simple count or registration system at the point of collection is the starting point for understanding the real base.',
                whatYouDo: 'Choose pilot collection points where daily activity is highest and most visible. Introduce a simple count or registration method — numbered tickets, sign-in sheets, headcounts, or gate counts — that can be checked by supervisors. Compare the count against actual collections to estimate leakage. Expand the method to more collection points once the first round has stabilised.',
                whenThisFitsBest: 'No one knows how many vendors, vehicles, or users are present each day. Collections appear lower than expected given visible activity. Management wants a baseline before reforming fee levels.',
                minimumEnablers: 'Basic counting tools (numbered tickets, sign-in sheets, or clickers); supervisory staff for spot-checks; a way to compare counts against cash collected.'
            },
            fullDetails: {
                legalEssentials: [
                    'The city usually has authority to register users at municipal facilities and collection points',
                    'No new legislation typically required for counting or registration at existing facilities'
                ],
                howItWorks: 'Choose pilot collection points where daily activity is highest and most visible. Introduce a simple count or registration method — numbered tickets, sign-in sheets, headcounts, or gate counts — that can be checked by supervisors. Compare the count against actual collections to estimate leakage. Expand the method to more collection points once the first round has stabilised.',
                implementationMilestones: [
                    'Choose pilot collection points where daily activity is highest and most visible',
                    'Introduce a simple count or registration method — numbered tickets, sign-in sheets, headcounts, or gate counts',
                    'Establish supervisory spot-check routine to verify counts',
                    'Compare the count against actual collections to estimate leakage',
                    'Expand the method to more collection points once the first round has stabilised'
                ],
                administrativeEssentials: [
                    'Supervisory spot-checks are critical — the count method must be simple enough to apply daily',
                    'Daily reconciliation of count versus cash collected',
                    'Simple exception reports when counts and collections diverge significantly'
                ],
                whenNotApplicable: [
                    'Activity is too dispersed or mobile to count practically',
                    'Collections are already well supervised and reconciled against known user numbers'
                ],
                caseNotes: 'Counts only matter if someone acts on discrepancies. Without supervision, counts are easily gamed. Start with the busiest, most visible collection points where the gap between visible activity and reported revenue is largest.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-COV-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Map and Formalise Collection Points',
            shortTitle: 'Map Collection Points',
            timeline: '<1 year to 1-2 years',
            politicalResistance: 'Moderate',
            category: 'Registration',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Identify, list, and formalise all collection points where daily charges should be levied. In many cities, some collection points are known but not formally managed, while others are entirely informal. Formalising the collection map is a coverage and control measure.',
                whatYouDo: 'List all known collection points and compare against the official schedule. Visit each point to verify activity levels, infrastructure, and current collection arrangements. Decide which points should be formalised, which need better controls, and which are too small to manage. Update the official collection-point register and assign named supervisors.',
                whenThisFitsBest: 'Many collection points are informal or unmanaged. Revenue from known points varies inexplicably. New facilities or markets have been added without updating the collection system.',
                minimumEnablers: 'Authority to designate and manage collection points; field staff to visit and verify; an official register to update.'
            },
            fullDetails: {
                legalEssentials: [
                    'The city needs authority to designate and manage collection points',
                    'Some points may need formalisation through council resolution',
                    'Assignment of named supervisory responsibility may require administrative order'
                ],
                howItWorks: 'List all known collection points and compare against the official schedule. Visit each point to verify activity levels, infrastructure, and current collection arrangements. Decide which points should be formalised, which need better controls, and which are too small to manage. Update the official collection-point register and assign named supervisors.',
                implementationMilestones: [
                    'List all known collection points and compare against the official schedule',
                    'Visit each point to verify activity levels, infrastructure, and current collection arrangements',
                    'Decide which points should be formalised, which need better controls, and which are too small to manage',
                    'Update the official collection-point register and assign named supervisors',
                    'Install basic collection infrastructure (gates, booths, ticket systems) where needed'
                ],
                administrativeEssentials: [
                    'Each point needs a named responsible person',
                    'Collection infrastructure (gates, booths, ticket systems) should match the fee type',
                    'Register must be kept current as points are added, closed, or reorganised'
                ],
                whenNotApplicable: [
                    'All collection points are already well documented and managed',
                    'Activity is too dispersed for point-based management'
                ],
                caseNotes: 'Formalisation can displace informal operators if not handled carefully. Focus on revenue management, not exclusion. Start with the largest and most active points where the revenue opportunity is clearest.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-COV-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Maintain Collection-Point Coverage Through Periodic Review',
            shortTitle: 'Periodic Coverage Review',
            timeline: '<1 year, repeat',
            politicalResistance: 'Low to Moderate',
            category: 'Maintenance',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Schedule periodic reviews of collection points to check whether all active points are covered, whether new ones have emerged, and whether closed or underperforming points should be removed from the register.',
                whatYouDo: 'Set a review calendar (quarterly or biannual). Compare expected versus actual collection at each point. Investigate significant discrepancies through field visits. Update the register and reassign supervisory responsibilities as needed.',
                whenThisFitsBest: 'Collection points change over time. New markets, parking areas, or facilities emerge. Management wants routine maintenance rather than occasional clean-ups.',
                minimumEnablers: 'A small team to run the review; simple reporting to management; management commitment to act on findings.'
            },
            fullDetails: {
                legalEssentials: [
                    'Generally no new legal authority needed',
                    'Administrative order or internal instruction is usually sufficient to establish the review cycle'
                ],
                howItWorks: 'Set a review calendar (quarterly or biannual). Compare expected versus actual collection at each point. Investigate significant discrepancies through field visits. Update the register and reassign supervisory responsibilities as needed.',
                implementationMilestones: [
                    'Set a review calendar — quarterly or biannual depending on the pace of change',
                    'Compare expected versus actual collection at each point',
                    'Investigate significant discrepancies through field visits',
                    'Update the register and reassign supervisory responsibilities as needed',
                    'Report findings and actions to management after each cycle'
                ],
                administrativeEssentials: [
                    'A small team to run the review',
                    'Simple reporting template for management',
                    'Clear authority to update the register and reassign supervisory duties'
                ],
                whenNotApplicable: [
                    'The number of collection points is very small and stable',
                    'Revenue is already well tracked and discrepancies are caught quickly'
                ],
                caseNotes: 'Reviews without follow-up become performative. Act on findings promptly. The value of the review is in the management response, not the report itself.',
                resources: []
            }
        },

        // ───────────────────────────────────────────────────────────────
        // LIABILITY APPLICATION SOLUTIONS (3)
        // Correct fee levels and application
        // ───────────────────────────────────────────────────────────────
        {
            solutionId: 'NP-C-LIA-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Review and Update Daily Fee Rates',
            shortTitle: 'Update Fee Rates',
            timeline: '<1 year',
            politicalResistance: 'Moderate to High',
            category: 'Policy',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Review the daily fee schedule to ensure rates are current, fair, and consistently applied across collection points. Outdated or inconsistently applied daily rates are a common source of revenue loss.',
                whatYouDo: 'List all current daily fee rates by type (vendor, vehicle, user) and compare with the adopted schedule. Identify where rates are outdated, inconsistently applied, or misaligned with facility costs. Propose corrections and adopt through the required approval route. Update collection materials, signage, and staff guidance.',
                whenThisFitsBest: 'Rates have not been reviewed for several years. Different collectors apply different rates at the same point. Revenue per user has declined in real terms.',
                minimumEnablers: 'Current fee schedule; authority to propose rate changes; council or executive approval route; signage and collector guidance materials.'
            },
            fullDetails: {
                legalEssentials: [
                    'Fee rates usually require formal adoption — changes need council or executive approval',
                    'The adopted schedule must be publicly available',
                    'Transitional arrangements may be needed if rate increases are significant'
                ],
                howItWorks: 'List all current daily fee rates by type (vendor, vehicle, user) and compare with the adopted schedule. Identify where rates are outdated, inconsistently applied, or misaligned with facility costs. Propose corrections and adopt through the required approval route. Update collection materials, signage, and staff guidance at every point.',
                implementationMilestones: [
                    'List all current daily fee rates by type and compare with the adopted schedule',
                    'Identify where rates are outdated, inconsistently applied, or misaligned with facility costs',
                    'Propose corrections and present for approval',
                    'Adopt the revised schedule through the required approval route',
                    'Update signage, collection materials, and staff guidance at every collection point'
                ],
                administrativeEssentials: [
                    'Update signage and collector guidance at every point',
                    'Train supervisors on the new rates',
                    'Monitor initial implementation for consistent application'
                ],
                whenNotApplicable: [
                    'Rates were recently reviewed and adopted',
                    'The problem is collection discipline rather than fee levels'
                ],
                caseNotes: 'Rate increases can trigger resistance. Explain changes in terms of fairness and service quality. Pair rate updates with visible improvements at collection points where possible.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-LIA-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Standardise Fee Categories and Collection Rules',
            shortTitle: 'Standardise Fee Categories',
            timeline: '<1 year',
            politicalResistance: 'Moderate',
            category: 'Classification',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Ensure that fee categories at each collection point are clear, that collectors know which rate applies to each user type, and that exceptions or discounts are controlled rather than informal.',
                whatYouDo: 'Define clear fee categories for each collection point (e.g., small vendor, large vendor, vehicle by type). Create simple lookup cards or charts that collectors can reference. Audit a sample of transactions to check whether categories are applied correctly. Remove or formalise any informal discounts or exceptions.',
                whenThisFitsBest: 'Collectors apply different rates to similar users. Informal discounts are common. Revenue per transaction varies unexpectedly.',
                minimumEnablers: 'Authority to define fee categories; visual aids for collectors; supervisory capacity for spot-checks.'
            },
            fullDetails: {
                legalEssentials: [
                    'Category definitions usually fall within the city\'s existing fee-setting authority',
                    'Formalising or removing informal discounts may require administrative directive',
                    'Published schedule should list all categories clearly'
                ],
                howItWorks: 'Define clear fee categories for each collection point (e.g., small vendor, large vendor, vehicle by type). Create simple lookup cards or charts that collectors can reference on site. Audit a sample of transactions to check whether categories are applied correctly. Remove or formalise any informal discounts or exceptions.',
                implementationMilestones: [
                    'Define clear fee categories for each collection point type',
                    'Create simple lookup cards or charts that collectors can reference',
                    'Distribute visual aids and train collectors and supervisors',
                    'Audit a sample of transactions to check whether categories are applied correctly',
                    'Remove or formalise any informal discounts or exceptions'
                ],
                administrativeEssentials: [
                    'Visual aids at collection points — laminated cards, wall charts, or mobile references',
                    'Training for collectors on category application',
                    'Spot checks by supervisors to verify correct categorisation'
                ],
                whenNotApplicable: [
                    'Categories are already clear and well applied across all points',
                    'The fee schedule itself needs updating first — standardise after rates are corrected'
                ],
                caseNotes: 'Removing informal discounts can upset regular users. Explain the fairness rationale — the same user type should pay the same fee regardless of who is collecting.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-LIA-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Improve Collection Infrastructure and Ticketing',
            shortTitle: 'Infrastructure & Ticketing',
            timeline: '<1 year to 1-3 years',
            politicalResistance: 'Moderate',
            category: 'Infrastructure',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'Improve the physical infrastructure and ticketing systems at collection points to reduce leakage, improve accountability, and make fee application more consistent. This includes controlled entry points, numbered tickets or tokens, electronic payment, and simple transaction records.',
                whatYouDo: 'Assess which collection points have the weakest infrastructure and highest leakage risk. Introduce numbered tickets, tokens, or electronic recording where feasible. Install gates, booths, or controlled entry where layout allows. Reconcile ticket/token counts against cash daily.',
                whenThisFitsBest: 'Collections rely entirely on trust and cash. No transaction records exist. Leakage is suspected but unquantifiable.',
                minimumEnablers: 'Budget for infrastructure improvements; procurement capacity; daily reconciliation procedures; supervisory staff.'
            },
            fullDetails: {
                legalEssentials: [
                    'May require procurement processes for equipment',
                    'Electronic payment may need regulatory compliance',
                    'Ticket or token systems should be authorised as official receipts'
                ],
                howItWorks: 'Assess which collection points have the weakest infrastructure and highest leakage risk. Introduce numbered tickets, tokens, or electronic recording where feasible. Install gates, booths, or controlled entry where layout allows. Reconcile ticket/token counts against cash daily.',
                implementationMilestones: [
                    'Assess which collection points have the weakest infrastructure and highest leakage risk',
                    'Design and procure appropriate ticketing or token systems',
                    'Install gates, booths, or controlled entry where layout allows',
                    'Introduce numbered tickets, tokens, or electronic recording at priority points',
                    'Establish daily reconciliation of ticket/token counts against cash collected'
                ],
                administrativeEssentials: [
                    'Daily reconciliation between tickets/tokens and cash',
                    'Secure storage for unused tickets or tokens',
                    'Supervisory checks to verify reconciliation is done and acted on'
                ],
                whenNotApplicable: [
                    'Activity is too dispersed for physical infrastructure',
                    'Revenue is too low to justify the investment in infrastructure'
                ],
                caseNotes: 'Infrastructure alone does not solve leakage if supervision is weak. Pair infrastructure improvements with supervisory reforms. Start with the highest-revenue points where the return on investment is clearest.',
                resources: []
            }
        },

        // ───────────────────────────────────────────────────────────────
        // COMPLIANCE SOLUTIONS (3)
        // Getting daily payers to actually pay
        // ───────────────────────────────────────────────────────────────
        {
            solutionId: 'NP-C-COM-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Strengthen On-Site Supervision and Cash Controls',
            shortTitle: 'Supervision & Cash Controls',
            timeline: '<1 year',
            politicalResistance: 'Moderate',
            category: 'Enforcement',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Improve the supervision of daily fee collection by introducing supervisory spot-checks, daily cash reconciliation, separation of duties, and simple exception reporting. For point-of-collection charges, supervision and cash control are often more important than reminders or enforcement ladders because the compliance gap is primarily a leakage and control problem rather than a willingness-to-pay problem.',
                whatYouDo: 'Assign named supervisors to high-revenue collection points. Introduce daily cash reconciliation routines. Separate collection, counting, and banking duties where possible. Run unannounced spot-checks and act on discrepancies quickly.',
                whenThisFitsBest: 'Cash collections vary without explanation. No daily reconciliation exists. Collectors operate without supervision for long periods.',
                minimumEnablers: 'Named supervisory staff; written day-end procedures; separation of duties between collection and banking; management commitment to act on exceptions.'
            },
            fullDetails: {
                legalEssentials: [
                    'Internal supervisory authority is usually sufficient',
                    'Cash handling rules may already exist but be unenforced — review and reactivate',
                    'Disciplinary procedures should be clear and enforceable'
                ],
                howItWorks: 'Assign named supervisors to high-revenue collection points. Introduce daily cash reconciliation routines — every collector accounts for their collections at end of shift. Separate collection, counting, and banking duties where possible so that no single person handles the full chain. Run unannounced spot-checks and act on discrepancies quickly.',
                implementationMilestones: [
                    'Assign named supervisors to high-revenue collection points',
                    'Introduce daily cash reconciliation routines with written day-end procedures',
                    'Separate collection, counting, and banking duties where possible',
                    'Run unannounced spot-checks at priority points',
                    'Establish an exception escalation route and act on discrepancies quickly'
                ],
                administrativeEssentials: [
                    'Written day-end procedure for every collector',
                    'Named supervisory responsibility at each high-revenue point',
                    'Exception escalation route — who to report to when discrepancies are found'
                ],
                whenNotApplicable: [
                    'Collections are already well supervised with functioning reconciliation',
                    'All payments are electronic and automatically reconciled'
                ],
                caseNotes: 'Supervision reform can encounter staff resistance. Start with the highest-revenue points where the impact is greatest and the case for reform is clearest. Consistency and follow-through matter more than the specific method.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-COM-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Introduce or Expand Electronic and Traceable Payment',
            shortTitle: 'Electronic & Traceable Payment',
            timeline: '<1 year to 1-3 years',
            politicalResistance: 'Moderate',
            category: 'Payments',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Shift daily collections from untraceable cash toward electronic, ticketed, or otherwise traceable methods. This reduces leakage, improves accountability, and makes collection data more reliable for management decisions.',
                whatYouDo: 'Assess which collection points have the volume and connectivity to support electronic payment. Pilot one traceable method (mobile money, pre-paid tokens, electronic tickets) at a high-volume point. Compare revenue and transaction counts against the cash-only baseline. Expand to more points based on results.',
                whenThisFitsBest: 'Cash leakage is suspected. Users already use mobile money or digital payments for other transactions. Management wants better transaction data.',
                minimumEnablers: 'Adequate connectivity at collection points; a mobile money or electronic payment provider; reconciliation capacity; willingness to pilot before scaling.'
            },
            fullDetails: {
                legalEssentials: [
                    'Electronic payment may need regulatory compliance',
                    'Ensure fee receipts are legally recognised regardless of payment method',
                    'Data protection requirements for electronic transaction records'
                ],
                howItWorks: 'Assess which collection points have the volume and connectivity to support electronic payment. Pilot one traceable method (mobile money, pre-paid tokens, electronic tickets) at a high-volume point. Compare revenue and transaction counts against the cash-only baseline. Expand to more points based on results.',
                implementationMilestones: [
                    'Assess which collection points have the volume and connectivity to support electronic payment',
                    'Select and contract a payment provider or technology partner',
                    'Pilot one traceable method at a high-volume collection point',
                    'Compare revenue and transaction counts against the cash-only baseline',
                    'Expand to more points based on pilot results'
                ],
                administrativeEssentials: [
                    'Technical support for the payment system',
                    'Reconciliation between electronic and any remaining cash channels',
                    'Backup procedures for system failures or connectivity outages'
                ],
                whenNotApplicable: [
                    'Connectivity is too weak for electronic methods at most collection points',
                    'Users strongly prefer cash and have no access to electronic payment methods',
                    'Revenue per point is too low to justify the technology investment'
                ],
                caseNotes: 'Technology alone does not solve leakage if supervision is weak. Ensure backup procedures for system failures. The pilot should run long enough to produce reliable comparison data — at least two to three months.',
                resources: []
            }
        },
        {
            solutionId: 'NP-C-COM-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Accountability Reporting and Revenue Benchmarking',
            shortTitle: 'Revenue Benchmarking',
            timeline: '<1 year',
            politicalResistance: 'Low to Moderate',
            category: 'Monitoring',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Use simple daily or weekly reporting to compare expected and actual revenue at each collection point. Revenue benchmarking is the main management tool for point-of-collection charges because it makes leakage visible and allows management to act before losses accumulate.',
                whatYouDo: 'Set expected daily or weekly revenue benchmarks for each collection point based on counts, capacity, and historical data. Require collectors or supervisors to report actual collections daily. Compare expected versus actual collections weekly and flag significant discrepancies. Investigate flagged points and act on findings.',
                whenThisFitsBest: 'Revenue varies inexplicably across similar collection points. No regular comparison or benchmarking exists. Management discovers shortfalls too late.',
                minimumEnablers: 'Baseline data (counts, capacity, or historical collections) for setting benchmarks; a simple reporting mechanism; one person to compile and circulate the weekly report; management commitment to respond.'
            },
            fullDetails: {
                legalEssentials: [
                    'Internal reporting authority is usually sufficient',
                    'No external legal change typically needed',
                    'Benchmarks should be based on transparent, defensible methodology'
                ],
                howItWorks: 'Set expected daily or weekly revenue benchmarks for each collection point based on counts, capacity, and historical data. Require collectors or supervisors to report actual collections daily. Compare expected versus actual collections weekly and flag significant discrepancies. Investigate flagged points and act on findings.',
                implementationMilestones: [
                    'Set expected daily or weekly revenue benchmarks for each collection point',
                    'Require collectors or supervisors to report actual collections daily',
                    'Assign one person to compile and circulate a weekly comparison report',
                    'Flag significant discrepancies between expected and actual collections',
                    'Investigate flagged points and act on findings within the same week'
                ],
                administrativeEssentials: [
                    'One person to compile and circulate the weekly report',
                    'Management commitment to act on discrepancies — the report is only useful if it triggers a response',
                    'Benchmark methodology that is understood and accepted by supervisors'
                ],
                whenNotApplicable: [
                    'Revenue is already well tracked and discrepancies are caught quickly',
                    'Collection points are too few to benchmark meaningfully'
                ],
                caseNotes: 'Benchmarks only matter if management responds to discrepancies. Without follow-through, reporting becomes performative. Start with simple benchmarks based on available data and refine over time — do not wait for perfect data before beginning.',
                resources: []
            }
        }
    ];

})(window);
