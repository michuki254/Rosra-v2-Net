/**
 * ROSRA Solutions Data - Property Tax Coverage
 * 13 cards: PT-COV-01 through PT-COV-13
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTCoverage = [

        // =====================================================================
        // A. Find missing properties quickly
        // =====================================================================

        {
            solutionId: 'PT-COV-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Run a quick property self-registration drive',
            shortTitle: 'Self-registration drive',
            timeline: '<1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Low',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                mainPurpose: 'Bring willing but currently unrecorded properties into the system quickly, while also refreshing stale contact information for properties that are already on the roll.',
                bestStartingPoint: 'A city that knows the roll is incomplete but needs an affordable, visible first step before larger fieldwork or digital reforms.',
                firstVisibleResult: 'A first wave of new records and corrected contact details within one billing cycle.',
                leadershipDecision: 'Approve one short registration form, a clear message that the exercise is for tax administration rather than titling, and one team to own intake and verification.',
                likelyLeadOwner: 'Revenue administration, supported by ward offices, front-office staff, and communications.',
                whatThisOptionDoes: 'This is often the lightest way to open the coverage problem. It does not solve every data weakness, but it gives the city a practical way to collect the minimum facts needed to create or refresh records. It also helps signal that the city is trying to widen the register in an orderly and understandable way rather than only pursuing arrears from those already inside the system.',
                mostUsefulWhen: [
                    'The city already suspects that many properties are missing or that contact details are out of date.',
                    'Ward offices, local counters, or a hotline can support taxpayers who need help completing a simple form.',
                    'Leadership wants an early move that shows momentum without waiting for a large procurement or citywide survey.'
                ],
                usuallyNotBestFirstMove: [],
                whatFullCardWouldPlan: 'A time-limited registration campaign with clear channels, a short form, a verification workflow, and a plan for folding the process into normal operations once the campaign ends.',
                oftenWorksBestAlongside: [
                    'PT-COV-11 on fixing simple record errors.',
                    'PT-COV-02 on cross-matching external data.',
                    'PT-COV-03 in areas where self-registration alone will miss too many properties.'
                ],
                politicalNote: 'The political risk is usually low to moderate, but the city still needs to show that new records will be handled fairly and that residents are not being drawn into a process they do not understand.'
            },
            fullDetails: {
                whyThisMatters: 'This is often the lightest way to open the coverage problem. It does not solve every data weakness, but it gives the city a practical way to collect the minimum facts needed to create or refresh records. It also helps signal that the city is trying to widen the register in an orderly and understandable way rather than only pursuing arrears from those already inside the system.',
                whenStrongFit: [
                    'The city already suspects that many properties are missing or that contact details are out of date.',
                    'Ward offices, local counters, or a hotline can support taxpayers who need help completing a simple form.',
                    'Leadership wants an early move that shows momentum without waiting for a large procurement or citywide survey.'
                ],
                whatToLineUpFirst: [
                    'Keep the first version of the form short. Ask only for the facts that the city is ready to store, verify, and use.',
                    'Decide who checks forms for duplicates, who approves new records, and how incomplete submissions will be followed up.',
                    'If trust is weak, pair the registration drive with basic outreach and visible help points rather than relying only on self-service channels.'
                ],
                designChoices: [
                    'Choose the submission mix carefully: paper at ward counters, assisted digital entry, online forms, USSD or SMS, or some combination.',
                    'Decide the minimum evidence required. For an early registration drive, the city often needs light verification rather than a document-heavy process.',
                    'Choose whether to run the drive citywide or first in wards where growth, poor records, or delivery problems are most visible.'
                ],
                practicalPath: {
                    first90Days: [
                        'Draft and test the short form, instructions, and privacy notice.',
                        'Choose the channels and train front-office or ward staff to explain the form consistently.',
                        'Pilot in one or two areas first so the city can see what fields cause confusion and where duplicate records are most likely.'
                    ],
                    sixTo12Months: [
                        'Run the campaign for a defined period and monitor submissions daily or weekly.',
                        'Verify records quickly enough that residents see a real outcome rather than a backlog.',
                        'Use the first results to identify where self-registration works well and where fieldwork or data matching is still needed.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Fold the form and its workflow into normal administration so the city can keep accepting new or corrected information.',
                        'Simplify or adjust the form based on the first campaign rather than freezing a poor design.',
                        'Use what the city learned to inform more targeted coverage work in harder areas.'
                    ]
                },
                legalInstitutional: [
                    'The city usually needs a clear legal basis to request property information for tax purposes and to explain how the information will be used.',
                    'The messaging should clearly separate tax registration from land titling or proof of ownership so the process does not create legal confusion.'
                ],
                capacitySystemsPartnerships: [
                    'A small verification team is critical; otherwise a registration drive simply creates a pile of unprocessed forms.',
                    'Basic duplicate checking, even in a spreadsheet-based system, matters from the start.',
                    'Communications and front-office staff need the same script so taxpayers hear one message.'
                ],
                risksAndSafeguards: [
                    'If the form asks for too much, the city will discourage participation and create a backlog.',
                    'If the city cannot process submissions quickly, public trust will fall and field staff will be blamed for a problem that is really administrative.',
                    'If the campaign sounds like a land-rights exercise, the city may trigger unnecessary fear or unrealistic expectations.'
                ],
                whatToMonitor: [
                    'Number of submissions received.',
                    'Share of submissions verified and either added or used to update an existing record.',
                    'Number of genuinely new properties added to the roll.',
                    'Number of contact details corrected and ready for later billing or notices.'
                ],
                connectionsToOtherCards: [
                    'This card usually works best alongside PT-COV-11 on fixing simple record errors.',
                    'PT-COV-02 on cross-matching external data can identify properties that did not self-register.',
                    'PT-COV-03 in areas where self-registration alone will miss too many properties.'
                ],
                questionsBeforeLaunch: [
                    'Which channels will actually reach missing owners or occupiers in your city?',
                    'What is the minimum information you truly need before opening a record?',
                    'Who will verify submissions, and how quickly can that team act?',
                    'How will the city explain that this is a tax-registration exercise rather than a titling exercise?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Cross-match with permits, utilities, and land records',
            shortTitle: 'Cross-match external data',
            timeline: '<1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low-Medium',
            category: 'Data Matching',
            sortOrder: 2,
            isActive: true,
            overview: {
                mainPurpose: 'Use existing data that other agencies already hold to identify properties or contacts that the tax roll is missing.',
                bestStartingPoint: 'A city where building permits, utility connections, land registry records, or business licences exist in usable form but have never been systematically compared with the property tax roll.',
                firstVisibleResult: 'A list of candidate properties that appear in at least one external source but not on the tax roll, ready for verification and follow-up.',
                leadershipDecision: 'Authorise data-sharing requests to the relevant agencies, assign one team to run the matching exercise, and agree on the workflow for converting confirmed matches into new tax records.',
                likelyLeadOwner: 'Revenue administration or IT unit, with cooperation from planning, utilities, and land registry.',
                whatThisOptionDoes: 'Cross-matching is one of the most cost-effective ways to find missing properties because it uses information that already exists. Rather than sending teams into the field or waiting for owners to come forward, the city compares its own roll against records that other agencies maintain for their own purposes. Every permit issued, every new water or electricity connection, and every land transfer is a signal that a taxable property may exist.',
                mostUsefulWhen: [
                    'Other agencies hold reasonably structured digital or paper records that can be extracted or reviewed.',
                    'The city suspects that many properties with permits or utility connections are not on the tax roll.',
                    'The city wants a desk-based first step before committing to fieldwork.'
                ],
                usuallyNotBestFirstMove: [
                    'The external data sources are known to be very poor quality or completely inaccessible.',
                    'There is no staff capacity to follow up on matches and convert them into verified records.'
                ],
                whatFullCardWouldPlan: 'A structured matching exercise covering the most promising data sources, a verification workflow for candidate properties, and an agreement to repeat the exercise periodically.',
                oftenWorksBestAlongside: [
                    'PT-COV-01 on self-registration, which catches willing owners that data matching may miss.',
                    'PT-COV-03 on targeted sweeps, which can verify matches and cover areas where external data is thin.',
                    'PT-COV-08 on linking the roll to permits, sales, and new service connections for ongoing maintenance.'
                ],
                politicalNote: 'Cross-matching is generally low sensitivity because it uses information agencies already hold. However, the city should be transparent about how the data will be used and ensure that data-sharing arrangements respect privacy rules.'
            },
            fullDetails: {
                whyThisMatters: 'Cross-matching is one of the most cost-effective ways to find missing properties because it uses information that already exists. Rather than sending teams into the field or waiting for owners to come forward, the city compares its own roll against records that other agencies maintain for their own purposes. Every permit issued, every new water or electricity connection, and every land transfer is a signal that a taxable property may exist. If those signals are never checked against the tax roll, the coverage gap quietly grows.',
                whenStrongFit: [
                    'Other agencies hold reasonably structured digital or paper records that can be extracted or reviewed.',
                    'The city suspects that many properties with permits or utility connections are not on the tax roll.',
                    'The city wants a desk-based first step before committing to fieldwork.',
                    'Leadership is willing to request data from sister agencies or utilities.'
                ],
                whatToLineUpFirst: [
                    'Identify the two or three most promising data sources based on coverage, quality, and accessibility.',
                    'Negotiate data-sharing agreements or formal requests with the relevant agencies.',
                    'Decide on the matching methodology: address-based, name-based, location-based, or a combination.',
                    'Assign a small team with the skills to clean, align, and compare datasets.'
                ],
                designChoices: [
                    'Start with the highest-quality, most accessible data source rather than trying to match everything at once.',
                    'Decide on the matching threshold: how close does a match need to be before the city follows up?',
                    'Choose whether to run a one-off exercise or set up a repeatable process from the start.',
                    'Decide how to handle partial matches that need field verification.'
                ],
                practicalPath: {
                    first90Days: [
                        'Map available data sources and assess their quality, format, and accessibility.',
                        'Negotiate access to the two or three most promising datasets.',
                        'Clean and standardise the data enough to run an initial comparison.',
                        'Run a pilot match in one area to test the methodology and estimate the yield.'
                    ],
                    sixTo12Months: [
                        'Extend the matching exercise to the full jurisdiction.',
                        'Verify candidate properties through desk checks or targeted field visits.',
                        'Convert confirmed matches into new tax records with proper documentation.',
                        'Document the process so it can be repeated without rebuilding from scratch.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Schedule regular repeat exercises, ideally quarterly or when new data extracts become available.',
                        'Use the results to identify which data sources are most productive and which areas have the largest gaps.',
                        'Feed insights into the design of more permanent data-sharing links under PT-COV-08.'
                    ]
                },
                legalInstitutional: [
                    'The city needs legal authority to request and use data from other agencies for tax purposes.',
                    'Data-sharing agreements should specify what data is shared, how it is used, and how long it is retained.',
                    'Privacy protections must be respected, especially when combining datasets from different sources.'
                ],
                capacitySystemsPartnerships: [
                    'A small data team with basic spreadsheet or database skills can run an initial exercise.',
                    'Relationships with counterparts in the data-holding agencies are essential for timely access.',
                    'If the city plans to automate matching, it will need IT support for data pipelines and exception handling.'
                ],
                risksAndSafeguards: [
                    'If the external data is poor quality, the matching exercise will produce many false positives and waste follow-up effort.',
                    'If the city cannot follow up on matches quickly, the exercise will look like wasted effort.',
                    'If data-sharing is informal rather than structured, it may break down when key contacts move on.'
                ],
                whatToMonitor: [
                    'Number of candidate matches identified from each data source.',
                    'Share of candidates verified and converted into new tax records.',
                    'Time from match identification to record creation.',
                    'Revenue generated from newly registered properties found through matching.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-01 on self-registration catches owners who come forward voluntarily.',
                    'PT-COV-03 on targeted sweeps can verify matches and fill gaps in areas where external data is thin.',
                    'PT-COV-08 on linking the roll to permits and connections builds on this exercise by making it continuous.',
                    'PT-COV-11 on fixing record errors is often needed to clean existing data before matching can work well.'
                ],
                questionsBeforeLaunch: [
                    'Which agencies hold the most useful data, and are they willing to share it?',
                    'What format is the data in, and how much cleaning will it need before matching?',
                    'Who will run the matching exercise, and do they have the skills to work with messy data?',
                    'How will the city follow up on matches and convert them into verified records?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Carry out a targeted street and neighbourhood sweep',
            shortTitle: 'Targeted street sweep',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Fieldwork',
            sortOrder: 3,
            isActive: true,
            overview: {
                mainPurpose: 'Send field teams into selected areas to identify properties that are missing from the tax roll and collect the minimum information needed to create new records.',
                bestStartingPoint: 'A city that has already tried desk-based approaches such as self-registration or data matching and knows that certain neighbourhoods still have large gaps that only physical inspection can close.',
                firstVisibleResult: 'A verified list of previously unregistered properties in the target area, with enough data to add them to the roll and issue initial bills.',
                leadershipDecision: 'Select the target areas, approve the fieldwork budget and timeline, assign a team lead, and agree on the minimum data to collect per property.',
                likelyLeadOwner: 'Revenue administration or valuation unit, supported by ward leaders and field supervisors.',
                whatThisOptionDoes: 'A targeted sweep puts eyes on the ground in areas where desk-based methods are not enough. It is more expensive than data matching or self-registration, but it catches properties that no existing database records and that no owner has volunteered. The key is to target the sweep rather than trying to cover the whole city at once, focusing on areas where growth has been fastest, where records are weakest, or where revenue leakage is most visible.',
                mostUsefulWhen: [
                    'The city knows which areas have the largest coverage gaps based on earlier analysis or local knowledge.',
                    'Desk-based methods have been tried and still leave significant gaps.',
                    'Field teams can be mobilised and supervised effectively.',
                    'The city wants to combine coverage work with basic data collection for valuation or addressing.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has not yet tried cheaper desk-based methods that might close part of the gap first.',
                    'There is no capacity to supervise field teams or process the data they collect.'
                ],
                whatFullCardWouldPlan: 'A phased fieldwork programme covering priority areas first, with clear data collection protocols, supervision arrangements, and a workflow for converting field findings into verified tax records.',
                oftenWorksBestAlongside: [
                    'PT-COV-02 on cross-matching, which can narrow down target areas and reduce the fieldwork needed.',
                    'PT-COV-04 on imagery, which can guide field teams to specific locations where new structures have appeared.',
                    'PT-COV-01 on self-registration, which can mop up willing owners before the sweep reaches their area.'
                ],
                politicalNote: 'Street sweeps are visible and can cause concern if residents feel they are being surveilled or targeted unfairly. Clear communication about the purpose, scope, and fairness of the exercise is essential. Ward leaders or local representatives should be briefed and ideally involved.'
            },
            fullDetails: {
                whyThisMatters: 'A targeted sweep puts eyes on the ground in areas where desk-based methods are not enough. It is more expensive than data matching or self-registration, but it catches properties that no existing database records and that no owner has volunteered. The key is to target the sweep rather than trying to cover the whole city at once, focusing on areas where growth has been fastest, where records are weakest, or where revenue leakage is most visible.',
                whenStrongFit: [
                    'The city knows which areas have the largest coverage gaps based on earlier analysis or local knowledge.',
                    'Desk-based methods have been tried and still leave significant gaps.',
                    'Field teams can be mobilised and supervised effectively.',
                    'The city wants to combine coverage work with basic data collection for valuation or addressing.'
                ],
                whatToLineUpFirst: [
                    'Select target areas using available data: permit records, imagery, utility connections, or local intelligence.',
                    'Design a short field form that collects only the information the city can process and use.',
                    'Recruit, equip, and train field teams, including clear rules on identification, conduct, and data handling.',
                    'Brief ward leaders and local representatives so the exercise is expected and understood.'
                ],
                designChoices: [
                    'Decide whether to use paper forms, mobile devices, or a combination for field data collection.',
                    'Choose whether to collect only coverage data or also gather basic valuation or addressing information while teams are in the field.',
                    'Decide the team structure: pairs for safety and mutual verification, with roving supervisors.',
                    'Set the scope for each phase: start with the areas where the yield is likely to be highest.'
                ],
                practicalPath: {
                    first90Days: [
                        'Analyse available data to select priority areas and estimate the number of properties to cover.',
                        'Design the field form, data collection protocol, and supervision arrangements.',
                        'Recruit, equip, and train field teams; pilot the process in one area to test the workflow.',
                        'Brief ward leaders and communicate the purpose of the exercise to the public in target areas.'
                    ],
                    sixTo12Months: [
                        'Roll out the sweep to the full set of priority areas in planned phases.',
                        'Process field data daily or weekly: verify, de-duplicate, and convert confirmed findings into new records.',
                        'Monitor team productivity, data quality, and the share of findings that convert into verified records.',
                        'Adjust the approach based on what the first phases reveal about coverage patterns and data quality.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Complete the remaining target areas and assess whether additional areas need attention.',
                        'Document lessons learned and establish a lighter-touch process for follow-up sweeps.',
                        'Feed the results into planning for ongoing coverage maintenance under PT-COV-09.',
                        'Use the data collected to support valuation, addressing, or service delivery improvements.'
                    ]
                },
                legalInstitutional: [
                    'Field teams need clear legal authority to visit properties and request basic information.',
                    'Teams must carry official identification and be able to explain the legal basis for the exercise.',
                    'The city should have a clear privacy policy for the data collected and share it with residents.'
                ],
                capacitySystemsPartnerships: [
                    'Field teams need training not just on data collection but on how to interact with residents professionally.',
                    'Supervisors are essential to maintain data quality and prevent fabrication or shortcuts.',
                    'A back-office team must be ready to process incoming data quickly so the exercise does not create an unmanageable backlog.'
                ],
                risksAndSafeguards: [
                    'If field teams are poorly supervised, data quality will be low and the exercise will need to be repeated.',
                    'If the city cannot process field data quickly, the sweep will lose momentum and credibility.',
                    'If the exercise is not well communicated, residents may resist or spread misinformation about its purpose.',
                    'Security risks for field teams in some areas may require adjustments to timing, team composition, or accompaniment.'
                ],
                whatToMonitor: [
                    'Number of properties visited and data forms completed per team per day.',
                    'Share of field findings verified and converted into new tax records.',
                    'Data quality indicators: completeness, consistency, and supervisor correction rates.',
                    'Coverage rate improvement in target areas before and after the sweep.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-02 on cross-matching can narrow down target areas before fieldwork begins.',
                    'PT-COV-04 on imagery can guide field teams to specific new structures.',
                    'PT-COV-01 on self-registration can capture willing owners before the sweep reaches their area.',
                    'PT-COV-09 on routine audits provides a lighter-touch maintenance process after the initial sweep.'
                ],
                questionsBeforeLaunch: [
                    'Which areas have the largest coverage gaps, and how do you know?',
                    'Can you recruit, train, and supervise field teams to a consistent standard?',
                    'What is the minimum data you need from the field to create a usable record?',
                    'How quickly can the back office process incoming data and convert it into verified records?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Use imagery to spot new buildings and extensions',
            shortTitle: 'Imagery-based detection',
            timeline: '1-3 years',
            deliveryDifficulty: 'Medium-High',
            politicalSensitivity: 'Medium',
            category: 'Technology',
            sortOrder: 4,
            isActive: true,
            overview: {
                mainPurpose: 'Use satellite, aerial, or drone imagery to detect new buildings, extensions, or land-use changes that are not reflected in the property tax roll.',
                bestStartingPoint: 'A city experiencing rapid growth or peri-urban expansion where field teams cannot keep up with the pace of new construction, and where imagery is available or affordable.',
                firstVisibleResult: 'A map of candidate structures or changes that do not appear in the current tax roll, ready for field verification.',
                leadershipDecision: 'Approve the imagery acquisition or access arrangement, assign a GIS-capable team or partner, and agree on how detected structures will be verified and added to the roll.',
                likelyLeadOwner: 'Revenue administration or planning department, with GIS or IT support and a field verification team.',
                whatThisOptionDoes: 'Imagery gives the city an eye in the sky that can scan large areas far more quickly than field teams. By comparing recent imagery against the existing roll or against earlier imagery, the city can spot new buildings, extensions, or land-use changes that may not have been reported or captured. This approach is especially powerful in fast-growing areas where construction outpaces the administrative system.',
                mostUsefulWhen: [
                    'The city is growing quickly and new construction is outpacing the roll update process.',
                    'Affordable imagery is available through government programmes, international partners, or commercial providers.',
                    'The city has or can access GIS skills for image analysis and change detection.',
                    'Field verification capacity exists to follow up on detected structures.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has no GIS capacity and no realistic plan to acquire it.',
                    'The main coverage problem is not new construction but missing records for long-standing properties.',
                    'The cost of imagery acquisition exceeds the likely revenue gain in the short term.'
                ],
                whatFullCardWouldPlan: 'An imagery acquisition and analysis programme, a change detection workflow, a field verification process for candidate structures, and a plan for periodic repeat imagery to keep the roll current.',
                oftenWorksBestAlongside: [
                    'PT-COV-03 on targeted sweeps, which can verify structures detected by imagery.',
                    'PT-COV-05 on building a citywide baseline inventory, which imagery can support.',
                    'PT-COV-08 on linking the roll to permits, which catches new construction that has permits but not tax records.'
                ],
                politicalNote: 'Imagery-based detection is generally accepted when it targets new construction and growth areas. However, the city should communicate clearly that the purpose is fair taxation rather than surveillance, and should be prepared for questions about privacy and data use.'
            },
            fullDetails: {
                whyThisMatters: 'Imagery gives the city an eye in the sky that can scan large areas far more quickly than field teams. By comparing recent imagery against the existing roll or against earlier imagery, the city can spot new buildings, extensions, or land-use changes that may not have been reported or captured. This approach is especially powerful in fast-growing areas where construction outpaces the administrative system. Without imagery, the city is relying entirely on self-reporting, permits, or infrequent field visits, all of which tend to lag behind reality.',
                whenStrongFit: [
                    'The city is growing quickly and new construction is outpacing the roll update process.',
                    'Affordable imagery is available through government programmes, international partners, or commercial providers.',
                    'The city has or can access GIS skills for image analysis and change detection.',
                    'Field verification capacity exists to follow up on detected structures.'
                ],
                whatToLineUpFirst: [
                    'Assess imagery options: satellite (e.g. Google Earth, Maxar, Planet), aerial photography, or drone surveys.',
                    'Determine whether the city needs to buy imagery or can access existing sources at low cost.',
                    'Identify or recruit GIS staff or a partner organisation with change detection skills.',
                    'Plan the field verification workflow for candidate structures detected by imagery.'
                ],
                designChoices: [
                    'Choose the imagery source based on cost, resolution, frequency, and coverage.',
                    'Decide whether to use manual visual comparison or invest in automated change detection tools.',
                    'Determine the analysis cycle: annual comparison, continuous monitoring, or triggered by known growth events.',
                    'Decide whether to analyse the whole city or focus on known growth corridors and peri-urban areas first.'
                ],
                practicalPath: {
                    first90Days: [
                        'Assess available imagery sources and their cost, quality, and update frequency.',
                        'Acquire or access baseline and recent imagery for a pilot area.',
                        'Run a pilot change detection exercise to estimate the yield and refine the methodology.',
                        'Plan the field verification process for candidate structures.'
                    ],
                    sixTo12Months: [
                        'Extend the analysis to priority growth areas across the city.',
                        'Verify candidate structures through targeted field visits and convert confirmed findings into new records.',
                        'Document the methodology so it can be repeated without rebuilding from scratch.',
                        'Assess the cost-effectiveness of the approach and adjust the imagery source or analysis method if needed.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Establish a regular imagery acquisition and analysis cycle, ideally annual or more frequent in high-growth areas.',
                        'Integrate imagery-based detection with other coverage tools such as permit matching and field sweeps.',
                        'Use accumulated imagery to build a time series that shows growth patterns and informs planning.',
                        'Explore whether automated detection tools or AI-assisted analysis can reduce the manual workload.'
                    ]
                },
                legalInstitutional: [
                    'The city should confirm that the use of aerial or satellite imagery for tax purposes is legally permitted.',
                    'Drone operations may require specific permits or approvals from aviation or security authorities.',
                    'Data retention and privacy policies should cover imagery and derived datasets.'
                ],
                capacitySystemsPartnerships: [
                    'GIS skills are essential; if the city lacks them, a partnership with a university, NGO, or commercial provider can fill the gap.',
                    'Field verification teams must be available to follow up on detected structures promptly.',
                    'IT infrastructure for storing and processing large imagery files may need investment.'
                ],
                risksAndSafeguards: [
                    'If imagery resolution is too low, the city will miss small structures or misidentify features.',
                    'If there is no field verification step, the city may create records for structures that are not taxable or do not exist.',
                    'If the analysis is a one-off, the investment will not pay off; the value comes from periodic repetition.',
                    'Cloud cover, shadow, and vegetation can reduce imagery quality in tropical or mountainous areas.'
                ],
                whatToMonitor: [
                    'Number of candidate structures detected per analysis cycle.',
                    'Share of candidates verified and converted into new tax records.',
                    'Cost per new property identified through imagery versus other methods.',
                    'Time from detection to record creation.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-03 on targeted sweeps can verify structures detected by imagery.',
                    'PT-COV-05 on building a citywide baseline inventory can use imagery as a foundation.',
                    'PT-COV-08 on linking the roll to permits catches permitted construction; imagery catches unpermitted construction.',
                    'PT-COV-13 on addressing can benefit from the spatial data generated by imagery analysis.'
                ],
                questionsBeforeLaunch: [
                    'What imagery is available, and what will it cost to acquire or access?',
                    'Does the city have GIS skills, or can it partner with an organisation that does?',
                    'How will detected structures be verified in the field?',
                    'Is the main coverage problem new construction, or are long-standing properties also missing?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-12',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Use a one-off registration amnesty carefully',
            shortTitle: 'Registration amnesty',
            timeline: '<1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium-High',
            category: 'Amnesty',
            sortOrder: 5,
            isActive: true,
            overview: {
                mainPurpose: 'Offer a time-limited period in which unregistered property owners can come forward without facing penalties for past non-registration, as a one-time bridge to a stricter enforcement regime.',
                bestStartingPoint: 'A city where a large share of properties has never been registered and where the threat of future enforcement is credible enough to motivate voluntary compliance during the amnesty window.',
                firstVisibleResult: 'A measurable increase in voluntary registrations during the amnesty period, giving the city a larger base before enforcement begins.',
                leadershipDecision: 'Approve the amnesty terms, set a firm end date, commit publicly to enforcement after the window closes, and assign a team to process registrations quickly.',
                likelyLeadOwner: 'Revenue administration, with political leadership providing public credibility and communications support.',
                whatThisOptionDoes: 'A registration amnesty lowers the barrier for owners who have been outside the system for years and may fear penalties, back-billing, or legal consequences. By offering a clean start for a limited period, the city can bring in a wave of voluntary registrations that would otherwise require expensive enforcement. However, amnesties carry real risks: they can reward non-compliance, undermine those who have been paying, and lose credibility if repeated.',
                mostUsefulWhen: [
                    'A large share of properties is unregistered and enforcement alone would be too slow or costly.',
                    'The city is about to launch a stricter enforcement regime and wants to give owners one last chance.',
                    'Political leadership is prepared to commit publicly to post-amnesty enforcement.',
                    'The city has the capacity to process a surge of registrations during the amnesty window.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has recently run an amnesty and another would signal that non-compliance is tolerated.',
                    'There is no credible enforcement plan for after the amnesty ends.',
                    'The coverage problem is mainly about data quality rather than owners avoiding registration.'
                ],
                whatFullCardWouldPlan: 'A time-limited amnesty campaign with clear terms, a surge processing plan, a communications strategy that emphasises the one-off nature, and a concrete enforcement plan for the post-amnesty period.',
                oftenWorksBestAlongside: [
                    'PT-COV-01 on self-registration, which provides the registration channels the amnesty will use.',
                    'PT-COV-03 on targeted sweeps, which can follow up in areas where voluntary registration remains low after the amnesty.',
                    'PT-COV-11 on fixing record errors, which can clean up data submitted during the amnesty surge.'
                ],
                politicalNote: 'Amnesties are politically sensitive. They must be framed as a fair, one-time opportunity rather than a reward for avoidance. If the city cannot enforce after the amnesty, the exercise will backfire and make future compliance harder.'
            },
            fullDetails: {
                whyThisMatters: 'A registration amnesty lowers the barrier for owners who have been outside the system for years and may fear penalties, back-billing, or legal consequences. By offering a clean start for a limited period, the city can bring in a wave of voluntary registrations that would otherwise require expensive enforcement. However, amnesties carry real risks: they can reward non-compliance, undermine those who have been paying, and lose credibility if repeated. The key is to use an amnesty as a one-time bridge to a stricter regime, not as a substitute for enforcement.',
                whenStrongFit: [
                    'A large share of properties is unregistered and enforcement alone would be too slow or costly.',
                    'The city is about to launch a stricter enforcement regime and wants to give owners one last chance to come forward.',
                    'Political leadership is prepared to commit publicly to post-amnesty enforcement.',
                    'The city has the capacity to process a surge of registrations during the amnesty window.'
                ],
                whatToLineUpFirst: [
                    'Define the amnesty terms clearly: what is forgiven, what is not, and when the window closes.',
                    'Prepare registration channels to handle a surge in submissions.',
                    'Draft the enforcement plan that will take effect after the amnesty, and be prepared to announce it.',
                    'Coordinate communications so the message reaches all target areas and communities.'
                ],
                designChoices: [
                    'Set a firm, non-extendable deadline. Extensions destroy credibility.',
                    'Decide what the amnesty covers: only penalties, or also back taxes? The narrower the waiver, the less it costs and the less it offends compliant taxpayers.',
                    'Choose whether to require a full registration or accept a simplified initial declaration that can be verified later.',
                    'Decide whether to offer the amnesty citywide or target it at specific areas or property types.'
                ],
                practicalPath: {
                    first90Days: [
                        'Design the amnesty terms and get political and legal approval.',
                        'Prepare registration channels, forms, and processing capacity for the expected surge.',
                        'Launch a communications campaign that reaches all target areas and explains the terms clearly.',
                        'Open the amnesty window and monitor registrations daily.'
                    ],
                    sixTo12Months: [
                        'Process amnesty registrations quickly and issue acknowledgements or tax IDs to new registrants.',
                        'Close the amnesty window on the announced date without extension.',
                        'Begin the post-amnesty enforcement programme, starting with areas where registration rates remained low.',
                        'Communicate enforcement actions publicly to reinforce the message that the amnesty was a one-time offer.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Evaluate the amnesty results: how many new registrations, what share of the gap was closed, and what revenue resulted.',
                        'Use the results to target remaining coverage work through sweeps, data matching, or other tools.',
                        'Resist pressure to repeat the amnesty. If coverage gaps persist, use other cards rather than another waiver.'
                    ]
                },
                legalInstitutional: [
                    'The amnesty needs a clear legal basis, whether through existing executive authority or a council resolution.',
                    'The terms must be precise about what is waived and what obligations remain.',
                    'The post-amnesty enforcement regime should be legally grounded and ready to activate.'
                ],
                capacitySystemsPartnerships: [
                    'Registration processing capacity must be scaled up for the amnesty period to avoid backlogs that undermine trust.',
                    'Communications need to reach informal settlements, peri-urban areas, and communities where trust in government is low.',
                    'Ward leaders and community organisations can help spread the message and assist with registration.'
                ],
                risksAndSafeguards: [
                    'If the amnesty is extended or repeated, it rewards non-compliance and punishes those who registered voluntarily.',
                    'If post-amnesty enforcement does not materialise, the exercise will have cost credibility without lasting gain.',
                    'If processing capacity is inadequate, the city will create a backlog that delays the benefits.',
                    'If the terms are unclear, disputes will arise about who qualified and what was waived.'
                ],
                whatToMonitor: [
                    'Number of new registrations during the amnesty period versus the pre-amnesty baseline.',
                    'Processing time from submission to confirmed registration.',
                    'Geographic and property-type distribution of amnesty registrations.',
                    'Post-amnesty enforcement actions and their impact on remaining coverage gaps.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-01 on self-registration provides the channels and forms the amnesty will use.',
                    'PT-COV-03 on targeted sweeps can follow up in areas where the amnesty did not close the gap.',
                    'PT-COV-11 on fixing record errors can clean up data submitted during the amnesty surge.',
                    'The enforcement plan after the amnesty may draw on several other coverage and compliance cards.'
                ],
                questionsBeforeLaunch: [
                    'Is leadership genuinely prepared to enforce after the amnesty ends?',
                    'Has the city run an amnesty recently, and if so, would another one undermine credibility?',
                    'Can the city process a surge in registrations without creating a backlog?',
                    'How will you communicate the amnesty to hard-to-reach owners and occupiers?'
                ]
            }
        },

        // =====================================================================
        // B. Put the register on firmer footing
        // =====================================================================

        {
            solutionId: 'PT-COV-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Build a citywide baseline property inventory',
            shortTitle: 'Citywide baseline inventory',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Medium',
            category: 'Inventory',
            sortOrder: 6,
            isActive: true,
            overview: {
                mainPurpose: 'Create a complete, geo-referenced inventory of every taxable property in the jurisdiction as a foundation for systematic tax administration.',
                bestStartingPoint: 'A city that has tried incremental coverage tools and still faces large, poorly understood gaps, or one that is building its property tax system from scratch and needs a comprehensive starting point.',
                firstVisibleResult: 'A geo-referenced database covering the full jurisdiction, showing every identified property with a unique identifier, location, basic characteristics, and an indication of whether it was previously on the roll.',
                leadershipDecision: 'Commit the budget and timeline for a multi-year programme, appoint a dedicated project manager, and agree on the data standards and scope before fieldwork begins.',
                likelyLeadOwner: 'Revenue administration or a dedicated project unit, with support from GIS, IT, planning, and field operations.',
                whatThisOptionDoes: 'A citywide baseline inventory is the most comprehensive approach to the coverage problem. Rather than picking off missing properties one area at a time, it aims to build a complete picture of all taxable properties across the jurisdiction. This is a significant investment, but it provides the foundation on which all other property tax functions depend: billing, valuation, collection, and exemption management.',
                mostUsefulWhen: [
                    'The city has no reliable estimate of how many taxable properties exist.',
                    'Incremental tools have been tried but the coverage gap remains large and poorly understood.',
                    'The city is willing to invest in a multi-year programme that will pay off over many budget cycles.',
                    'The inventory can also serve planning, addressing, or service delivery objectives, not just tax.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has not yet tried cheaper, faster tools that might close a significant part of the gap.',
                    'Budget and institutional capacity for a multi-year programme are not realistic.',
                    'The main problem is data quality or liability rules rather than missing properties.'
                ],
                whatFullCardWouldPlan: 'A phased, multi-year programme combining imagery analysis, field enumeration, data processing, and quality assurance to create a complete property inventory with unique identifiers and geo-references.',
                oftenWorksBestAlongside: [
                    'PT-COV-04 on imagery, which can provide the spatial foundation for the inventory.',
                    'PT-COV-07 on unique property IDs, which should be designed as part of the inventory.',
                    'PT-COV-13 on addressing, which can be built into the inventory process.'
                ],
                politicalNote: 'A citywide inventory is politically visible because of its cost and duration. Leadership needs to manage expectations about how long it will take and what interim benefits it will deliver. Phased delivery with visible milestones helps maintain support.'
            },
            fullDetails: {
                whyThisMatters: 'A citywide baseline inventory is the most comprehensive approach to the coverage problem. Rather than picking off missing properties one area at a time, it aims to build a complete picture of all taxable properties across the jurisdiction. This is a significant investment, but it provides the foundation on which all other property tax functions depend: billing, valuation, collection, and exemption management. Without a baseline, the city is always guessing about the size of the gap.',
                whenStrongFit: [
                    'The city has no reliable estimate of how many taxable properties exist.',
                    'Incremental tools have been tried but the coverage gap remains large and poorly understood.',
                    'The city is willing to invest in a multi-year programme that will pay off over many budget cycles.',
                    'The inventory can also serve planning, addressing, or service delivery objectives, not just tax.'
                ],
                whatToLineUpFirst: [
                    'Define data standards before fieldwork begins: what fields, what formats, what identifiers.',
                    'Secure multi-year budget commitment so the programme does not stall mid-way.',
                    'Appoint a dedicated project manager with authority to coordinate across departments.',
                    'Decide whether to use in-house teams, outsource to a contractor, or combine both.'
                ],
                designChoices: [
                    'Choose the enumeration methodology: field-first, imagery-first, or a combination.',
                    'Decide on the unique property identifier scheme and ensure it is compatible with other systems.',
                    'Set the data scope: coverage-only (minimum) versus coverage plus basic valuation data.',
                    'Phase the programme geographically, starting with areas where the yield or visibility is highest.'
                ],
                practicalPath: {
                    first90Days: [
                        'Define data standards, identifier scheme, and quality assurance protocols.',
                        'Acquire baseline imagery and existing datasets for the first phase areas.',
                        'Recruit, equip, and train the enumeration team or manage the procurement for an outsourced team.',
                        'Pilot the methodology in one area to test protocols and estimate productivity.'
                    ],
                    sixTo12Months: [
                        'Roll out enumeration across the first phase areas.',
                        'Process field data continuously: de-duplicate, verify, and load into the inventory database.',
                        'Report progress against milestones and adjust the approach based on early findings.',
                        'Begin using early-phase data for billing and revenue purposes to demonstrate value.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Complete remaining phases and close gaps identified during quality assurance.',
                        'Establish the maintenance process so the inventory does not degrade after completion.',
                        'Integrate the inventory with billing, valuation, and collection systems.',
                        'Evaluate the programme: coverage improvement, cost per property, and revenue impact.'
                    ]
                },
                legalInstitutional: [
                    'The programme needs clear legal authority for field enumeration and data collection.',
                    'Data standards should be formally adopted so they survive staff turnover.',
                    'The inventory should be designated as the official property register to avoid parallel systems.'
                ],
                capacitySystemsPartnerships: [
                    'A dedicated project team is essential; this cannot be run as a side project.',
                    'GIS and database skills are needed for data processing and quality assurance.',
                    'Partnerships with mapping agencies, universities, or international organisations can supplement capacity.',
                    'The IT platform for the inventory must be chosen early and must be maintainable after the project ends.'
                ],
                risksAndSafeguards: [
                    'If the budget is cut mid-programme, the city will have an incomplete inventory that is harder to use than a complete one.',
                    'If data standards are not set before fieldwork begins, the resulting data will be inconsistent and costly to clean.',
                    'If the maintenance plan is not in place when the inventory is complete, it will start degrading immediately.',
                    'If the programme takes too long without visible results, political support may erode.'
                ],
                whatToMonitor: [
                    'Number of properties enumerated per phase against the plan.',
                    'Data quality indicators: completeness, consistency, and error rates.',
                    'Cost per property enumerated.',
                    'Coverage rate improvement in completed areas.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-04 on imagery provides the spatial foundation.',
                    'PT-COV-07 on unique property IDs should be designed as part of the inventory.',
                    'PT-COV-13 on addressing can be integrated into the enumeration process.',
                    'PT-COV-09 on routine audits provides the maintenance mechanism after the inventory is complete.'
                ],
                questionsBeforeLaunch: [
                    'Can the city commit the budget for a multi-year programme?',
                    'Have cheaper incremental tools been tried first, and what gap remains?',
                    'Who will manage the programme, and do they have the authority and capacity?',
                    'What will the maintenance plan look like after the inventory is complete?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Clarify who should pay when ownership is unclear',
            shortTitle: 'Clarify liability rules',
            timeline: '<1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium-High',
            category: 'Liability',
            sortOrder: 7,
            isActive: true,
            overview: {
                mainPurpose: 'Ensure that every identifiable property has a clearly designated person or entity responsible for paying the property tax, even when formal ownership is uncertain, disputed, or unregistered.',
                bestStartingPoint: 'A city where a significant number of properties escape taxation because the roll lists no liable person, ownership is disputed, the owner is deceased, or the property is occupied but not formally owned.',
                firstVisibleResult: 'A clear rule, applied in practice, that allows the city to bill the occupier, user, or manager of a property when the legal owner cannot be identified or reached.',
                leadershipDecision: 'Adopt or clarify the liability rule in local regulations, train billing staff to apply it, and communicate the rule to the public so that occupiers understand their rights and obligations.',
                likelyLeadOwner: 'Revenue administration, with legal support and coordination with the land registry or valuation office.',
                whatThisOptionDoes: 'In many cities, a large number of properties are effectively untaxable because the roll has no identified liable person. Ownership may be informal, disputed, held by a deceased estate, or simply unrecorded. This card addresses the problem not by resolving ownership disputes but by clarifying that the city can and should bill whoever is benefiting from or controlling the property. The key principle is that every property should have a taxpayer, even if that taxpayer is not the legal owner.',
                mostUsefulWhen: [
                    'A significant share of properties has no identified liable person on the roll.',
                    'The city has legal authority to bill occupiers or users when the owner is unknown.',
                    'Billing staff are currently skipping properties because they do not know whom to bill.',
                    'Ownership records are poor and unlikely to improve quickly.'
                ],
                usuallyNotBestFirstMove: [
                    'The main coverage problem is missing properties rather than missing liable persons for known properties.',
                    'The legal framework does not allow billing anyone other than the registered owner.'
                ],
                whatFullCardWouldPlan: 'A clear liability rule adopted in regulations, a workflow for identifying and billing occupiers or users, training for billing staff, and a communications plan so residents understand the rule.',
                oftenWorksBestAlongside: [
                    'PT-COV-01 on self-registration, which can collect occupier information during the registration drive.',
                    'PT-COV-11 on fixing record errors, which can update records with the correct liable person.',
                    'PT-COV-07 on unique property IDs, which ensures each property record can carry a liability assignment.'
                ],
                politicalNote: 'Billing occupiers rather than owners can be sensitive. The city should frame the rule as a fairness measure: every property that receives city services should contribute, and occupiers who pay can recover from the owner. Clear communication and an accessible dispute process are essential.'
            },
            fullDetails: {
                whyThisMatters: 'In many cities, a large number of properties are effectively untaxable because the roll has no identified liable person. Ownership may be informal, disputed, held by a deceased estate, or simply unrecorded. This card addresses the problem not by resolving ownership disputes but by clarifying that the city can and should bill whoever is benefiting from or controlling the property. Without a clear liability rule, billing staff skip properties they cannot assign, and the coverage gap grows quietly.',
                whenStrongFit: [
                    'A significant share of properties has no identified liable person on the roll.',
                    'The city has legal authority (or can obtain it) to bill occupiers or users when the owner is unknown.',
                    'Billing staff are currently skipping properties because they do not know whom to bill.',
                    'Ownership records are poor and unlikely to improve quickly.'
                ],
                whatToLineUpFirst: [
                    'Review the legal framework to confirm or establish authority to bill occupiers, users, or managers.',
                    'Identify how many properties on the roll currently have no liable person and why.',
                    'Design the workflow for identifying and assigning a liable person when the owner is unknown.',
                    'Prepare the communications message so residents understand the rule and their rights.'
                ],
                designChoices: [
                    'Define the liability hierarchy: owner first, then occupier, then user or manager.',
                    'Decide whether the occupier\'s liability is primary or secondary (i.e., whether the city first tries to find the owner).',
                    'Choose whether to apply the rule to all properties immediately or to phase it in by area or property type.',
                    'Establish a dispute process so that occupiers who believe they should not be liable can challenge the assignment.'
                ],
                practicalPath: {
                    first90Days: [
                        'Review the legal framework and confirm or amend the liability rules.',
                        'Analyse the roll to identify properties with no liable person and categorise the reasons.',
                        'Design the assignment workflow and train billing staff.',
                        'Draft communications materials explaining the rule to the public.'
                    ],
                    sixTo12Months: [
                        'Apply the liability rule to the first batch of properties with missing liable persons.',
                        'Monitor billing outcomes: how many properties now have a liable person, how many bills are issued, and how many are disputed.',
                        'Adjust the workflow based on common problems or disputes encountered.',
                        'Extend the application to remaining properties.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Embed the liability rule into standard billing procedures so it is applied automatically for new records.',
                        'Use the results to inform data improvement efforts: where ownership information can be obtained, pursue it; where it cannot, ensure the occupier rule is applied consistently.',
                        'Report on the revenue impact and the reduction in properties with no liable person.'
                    ]
                },
                legalInstitutional: [
                    'The legal framework must clearly authorise billing of occupiers or users when the owner is unknown or unreachable.',
                    'Occupiers should have a legal right to recover the tax from the actual owner if the owner is later identified.',
                    'Notice requirements must be adapted so that bills reach the current occupier rather than an absent owner.'
                ],
                capacitySystemsPartnerships: [
                    'Billing staff need clear guidance and training on when and how to apply the occupier rule.',
                    'The billing system must be able to record and bill a liable person who is not the registered owner.',
                    'Coordination with the land registry can help identify ownership over time, even if the occupier rule is used in the interim.'
                ],
                risksAndSafeguards: [
                    'If the rule is applied without clear communication, occupiers may feel unfairly targeted.',
                    'If the dispute process is inaccessible, the rule may generate political backlash.',
                    'If billing staff apply the rule inconsistently, it will create perceptions of unfairness.',
                    'If the city does not also work on ownership records, the occupier rule may become a permanent substitute rather than a bridge.'
                ],
                whatToMonitor: [
                    'Number of properties with a liable person assigned under the new rule.',
                    'Number of bills issued to occupiers or users.',
                    'Dispute rate and outcomes for occupier-billed properties.',
                    'Revenue collected from previously unbilled properties.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-01 on self-registration can collect occupier information during the registration drive.',
                    'PT-COV-11 on fixing record errors can update records with the correct liable person.',
                    'PT-COV-07 on unique property IDs ensures each property record can carry a liability assignment.',
                    'PT-COV-03 on targeted sweeps can identify occupiers during field visits.'
                ],
                questionsBeforeLaunch: [
                    'Does the legal framework allow billing of occupiers when the owner is unknown?',
                    'How many properties currently have no liable person, and what are the main reasons?',
                    'Are billing staff prepared to apply the rule consistently and explain it to residents?',
                    'Is there an accessible dispute process for occupiers who believe they should not be liable?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Give each property one ID in one register',
            shortTitle: 'Unique property ID',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Low-Medium',
            category: 'Register',
            sortOrder: 8,
            isActive: true,
            overview: {
                mainPurpose: 'Assign every taxable property a single, unique identifier and maintain it in one authoritative register so that the city always knows exactly how many properties it has and can link each property to its billing, payment, and compliance history.',
                bestStartingPoint: 'A city where property records are scattered across multiple systems, spreadsheets, or paper files, with duplicates, gaps, and no reliable way to count the actual number of distinct properties.',
                firstVisibleResult: 'A de-duplicated register with unique IDs, giving the city for the first time an accurate count of distinct taxable properties and a foundation for reliable billing.',
                leadershipDecision: 'Commit to a single register as the authoritative source, approve the identifier scheme, and assign one team to own data quality and deduplication.',
                likelyLeadOwner: 'Revenue administration or IT, with support from valuation, land registry, and GIS.',
                whatThisOptionDoes: 'Many cities maintain property information in multiple overlapping systems: a billing register, a valuation roll, a land registry extract, spreadsheets in ward offices. Each may use different identifiers or none at all. The result is that no one knows the true count of distinct properties, duplicates inflate the roll or create confusion, and it is difficult to link a property to its full administrative history. This card solves that by giving each property one ID that follows it through every administrative process.',
                mostUsefulWhen: [
                    'The city has multiple overlapping property databases with no common identifier.',
                    'Duplicate records are inflating the roll or causing billing confusion.',
                    'The city needs a reliable count of distinct taxable properties for planning and benchmarking.',
                    'Other reform efforts, such as valuation or collection, need a clean register to build on.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has very few records and the immediate priority is simply finding properties, not organising them.',
                    'No one has the technical capacity to design or maintain an identifier scheme.'
                ],
                whatFullCardWouldPlan: 'A register consolidation programme that merges existing data sources, de-duplicates records, assigns unique IDs, and establishes the single register as the authoritative source with clear update procedures.',
                oftenWorksBestAlongside: [
                    'PT-COV-05 on building a citywide baseline inventory, which generates the data the register will hold.',
                    'PT-COV-13 on addressing, which provides a location reference that strengthens the identifier.',
                    'PT-COV-08 on linking the roll to permits and transfers, which keeps the register current.'
                ],
                politicalNote: 'This is primarily a technical reform with low political sensitivity. However, if the de-duplication exercise reveals that the roll has been significantly overstated or understated, the findings may need careful communication.'
            },
            fullDetails: {
                whyThisMatters: 'Many cities maintain property information in multiple overlapping systems: a billing register, a valuation roll, a land registry extract, spreadsheets in ward offices. Each may use different identifiers or none at all. The result is that no one knows the true count of distinct properties, duplicates inflate the roll or create confusion, and it is difficult to link a property to its full administrative history. A single register with unique IDs is the foundation for every other property tax function.',
                whenStrongFit: [
                    'The city has multiple overlapping property databases with no common identifier.',
                    'Duplicate records are inflating the roll or causing billing confusion.',
                    'The city needs a reliable count of distinct taxable properties for planning and benchmarking.',
                    'Other reform efforts, such as valuation or collection, need a clean register to build on.'
                ],
                whatToLineUpFirst: [
                    'Inventory all existing data sources that hold property information and assess their quality.',
                    'Design the unique identifier scheme: what format, what it encodes, and how it will be assigned.',
                    'Plan the de-duplication methodology: automated matching, manual review, or both.',
                    'Designate the single register as the authoritative source and communicate this to all units.'
                ],
                designChoices: [
                    'Choose between a meaningful identifier (encoding location or zone) and an arbitrary serial number. Serial numbers are simpler to maintain but carry less information.',
                    'Decide whether the ID will be linked to a spatial reference (parcel, building, or point) or remain non-spatial.',
                    'Determine the de-duplication threshold: how similar do two records need to be before they are flagged as potential duplicates?',
                    'Choose the platform for the single register: existing system, new database, or an upgraded version of the best current system.'
                ],
                practicalPath: {
                    first90Days: [
                        'Inventory all existing property data sources and assess their coverage, quality, and format.',
                        'Design the unique identifier scheme and de-duplication rules.',
                        'Extract and standardise data from the main sources in preparation for merging.',
                        'Pilot the de-duplication process in one area to calibrate the matching rules.'
                    ],
                    sixTo12Months: [
                        'Merge the main data sources into a single register, resolving duplicates and assigning unique IDs.',
                        'Verify the merged register against field reality in sample areas.',
                        'Establish update procedures so new records, changes, and deletions flow through the single register.',
                        'Begin using the register as the authoritative source for billing and other functions.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Complete the migration of all property data into the single register.',
                        'Retire or archive legacy systems to prevent parallel record-keeping.',
                        'Embed the unique ID into all property-related processes: billing, valuation, collection, permits.',
                        'Monitor data quality and run periodic de-duplication to catch new duplicates.'
                    ]
                },
                legalInstitutional: [
                    'The single register should be formally designated as the official property roll for tax purposes.',
                    'Data standards and update procedures should be documented and adopted as policy.',
                    'Access controls and audit trails are essential to maintain data integrity.'
                ],
                capacitySystemsPartnerships: [
                    'Data management and database skills are critical for the merging and de-duplication exercise.',
                    'A dedicated data quality team should own the register and manage ongoing maintenance.',
                    'Coordination with other agencies that hold property data is needed to align identifiers and avoid duplication.'
                ],
                risksAndSafeguards: [
                    'If the de-duplication is too aggressive, valid records may be merged incorrectly.',
                    'If legacy systems are not retired, parallel record-keeping will re-emerge.',
                    'If the identifier scheme is poorly designed, it may not scale or may conflict with other systems.',
                    'If no one owns data quality after the initial exercise, the register will degrade.'
                ],
                whatToMonitor: [
                    'Total number of distinct properties in the register versus previous estimates.',
                    'Number of duplicates identified and resolved.',
                    'Share of properties with complete, verified data.',
                    'Adoption of the unique ID across all property-related processes.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-05 on building a citywide baseline inventory generates the data the register will hold.',
                    'PT-COV-13 on addressing provides a location reference that strengthens the identifier.',
                    'PT-COV-08 on linking the roll to permits and transfers keeps the register current.',
                    'PT-COV-11 on fixing record errors is often needed as part of the consolidation process.'
                ],
                questionsBeforeLaunch: [
                    'How many separate systems or files currently hold property information?',
                    'Does the city have the data management skills to merge and de-duplicate them?',
                    'What identifier scheme will work across all property-related processes?',
                    'Who will own the register and maintain data quality after the initial consolidation?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-13',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Create a simple address and location reference for each property',
            shortTitle: 'Address and location reference',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Addressing',
            sortOrder: 9,
            isActive: true,
            overview: {
                mainPurpose: 'Give every property in the tax roll a usable address or location reference so that bills can be delivered, field teams can find properties, and records can be matched across systems.',
                bestStartingPoint: 'A city where many properties have no formal address, where addresses are inconsistent or ambiguous, or where field teams and postal services struggle to locate properties from the information on the roll.',
                firstVisibleResult: 'A standardised location reference for every property on the roll, whether a formal street address, a grid reference, a descriptive location, or a combination, that allows bills to be delivered and properties to be found.',
                leadershipDecision: 'Approve a pragmatic addressing standard that works for tax administration, assign a team to build and maintain the reference, and decide whether to align with any national addressing initiative.',
                likelyLeadOwner: 'Revenue administration or planning department, with support from GIS, postal services, and ward offices.',
                whatThisOptionDoes: 'Without a usable address or location reference, the city cannot reliably deliver bills, send field teams to the right property, or match records across systems. This card does not require a full national addressing programme. Instead, it focuses on creating a practical reference for every property on the roll that is good enough for tax administration purposes. This may be a formal address where one exists, supplemented by GPS coordinates, descriptive locations, or local landmarks where formal addresses are absent.',
                mostUsefulWhen: [
                    'Many properties on the roll have no address or an address that is too vague to be useful.',
                    'Bill delivery failure rates are high because addresses are wrong or incomplete.',
                    'Field teams cannot locate properties from the information available on the roll.',
                    'The city wants to match property records across systems but has no common location reference.'
                ],
                usuallyNotBestFirstMove: [
                    'The main coverage problem is finding missing properties rather than locating known ones.',
                    'A national addressing programme is already underway and the city should align with it rather than create a parallel system.'
                ],
                whatFullCardWouldPlan: 'A pragmatic addressing exercise that assigns a usable location reference to every property on the roll, establishes standards for recording addresses, and creates a maintenance process for keeping references current.',
                oftenWorksBestAlongside: [
                    'PT-COV-07 on unique property IDs, which the address or location reference complements.',
                    'PT-COV-05 on building a citywide baseline inventory, which can collect addressing data during enumeration.',
                    'PT-COV-03 on targeted sweeps, which can collect or verify addresses during field visits.'
                ],
                politicalNote: 'Addressing is generally low to medium sensitivity. However, street naming can be politically sensitive in some contexts, and the city should be prepared for requests to name or rename streets. A pragmatic approach focused on location references rather than formal street naming can avoid some of these issues.'
            },
            fullDetails: {
                whyThisMatters: 'Without a usable address or location reference, the city cannot reliably deliver bills, send field teams to the right property, or match records across systems. Many cities have properties on the roll with addresses that amount to little more than a ward name or a vague description. This makes billing uncertain, field visits inefficient, and data matching nearly impossible. A practical location reference is not a luxury; it is a basic requirement for functioning tax administration.',
                whenStrongFit: [
                    'Many properties on the roll have no address or an address that is too vague to be useful.',
                    'Bill delivery failure rates are high because addresses are wrong or incomplete.',
                    'Field teams cannot locate properties from the information available on the roll.',
                    'The city wants to match property records across systems but has no common location reference.'
                ],
                whatToLineUpFirst: [
                    'Assess the current state of addresses on the roll: how many are missing, vague, or inconsistent?',
                    'Define a pragmatic addressing standard that works for tax administration, even if it is not a full formal address.',
                    'Decide whether to collect GPS coordinates as a supplement or alternative to text addresses.',
                    'Check whether a national addressing initiative exists and whether alignment is required or beneficial.'
                ],
                designChoices: [
                    'Choose the addressing format: formal street address, grid reference, descriptive location, GPS coordinates, or a combination.',
                    'Decide whether to assign addresses during field visits, from imagery, or through a desk-based exercise using existing data.',
                    'Determine whether to build the reference into the existing register or create a separate addressing database linked by property ID.',
                    'Choose whether to tackle the whole roll at once or prioritise areas where addressing problems are worst.'
                ],
                practicalPath: {
                    first90Days: [
                        'Audit the current state of addresses on the roll and categorise the main problems.',
                        'Define the addressing standard and data format.',
                        'Pilot the approach in one area to test the method and estimate the effort required.',
                        'Coordinate with any national addressing initiative to ensure compatibility.'
                    ],
                    sixTo12Months: [
                        'Roll out the addressing exercise to priority areas, collecting or correcting addresses through field visits, desk review, or a combination.',
                        'Load address data into the register and link it to property IDs.',
                        'Test the usability of the new addresses for bill delivery and field navigation.',
                        'Train billing and field staff to use and maintain the address reference.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Complete the addressing exercise for the full roll.',
                        'Establish a maintenance process so new properties receive addresses at registration and address changes are captured.',
                        'Use the address reference to improve bill delivery, field operations, and data matching across systems.',
                        'Report on the improvement in delivery rates and field efficiency.'
                    ]
                },
                legalInstitutional: [
                    'If the city is assigning or formalising addresses, it may need legal authority to do so.',
                    'The addressing standard should be formally adopted so it is maintained consistently.',
                    'Alignment with national addressing standards, where they exist, may be required by law or beneficial for interoperability.'
                ],
                capacitySystemsPartnerships: [
                    'GIS skills are valuable for managing spatial references and GPS coordinates.',
                    'Field teams need training on collecting or verifying addresses accurately.',
                    'Partnerships with postal services, mapping agencies, or addressing initiatives can provide data and expertise.'
                ],
                risksAndSafeguards: [
                    'If the addressing standard is too ambitious, the exercise will stall or produce data that is too complex to maintain.',
                    'If addresses are collected but not maintained, they will degrade quickly in fast-growing areas.',
                    'If the addressing exercise is not linked to the property register, it will create a parallel dataset that drifts out of sync.',
                    'Street naming can be politically sensitive; a pragmatic approach using GPS or grid references may avoid this.'
                ],
                whatToMonitor: [
                    'Share of properties on the roll with a usable address or location reference.',
                    'Bill delivery success rate before and after the exercise.',
                    'Field team time to locate a property using the address reference.',
                    'Number of address corrections or updates processed per period.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-07 on unique property IDs, which the address reference complements and strengthens.',
                    'PT-COV-05 on building a citywide baseline inventory, which can collect addresses during enumeration.',
                    'PT-COV-03 on targeted sweeps, which can collect or verify addresses during field visits.',
                    'PT-COV-11 on fixing record errors, which often includes correcting address information.'
                ],
                questionsBeforeLaunch: [
                    'What share of properties on the roll currently have a usable address?',
                    'What addressing standard is practical for your city, given the current state of street naming and numbering?',
                    'Can GPS coordinates supplement or substitute for formal addresses where they are absent?',
                    'Is there a national addressing initiative that the city should align with?'
                ]
            }
        },

        // =====================================================================
        // C. Keep the roll connected to real-world events
        // =====================================================================

        {
            solutionId: 'PT-COV-08',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Link the roll to permits, sales, and new service connections',
            shortTitle: 'Link roll to event triggers',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Medium',
            category: 'Integration',
            sortOrder: 10,
            isActive: true,
            overview: {
                mainPurpose: 'Create permanent, systematic links between the property tax roll and the real-world events that signal when properties are built, modified, transferred, or connected to services, so the roll stays current automatically.',
                bestStartingPoint: 'A city that has achieved reasonable baseline coverage and now needs to prevent the roll from falling behind as new construction, transfers, and service connections occur.',
                firstVisibleResult: 'Automatic alerts or data feeds when a building permit is issued, a property is transferred, or a new utility connection is made, triggering a check against the tax roll.',
                leadershipDecision: 'Authorise data-sharing agreements with the relevant agencies, commit to the technical integration work, and assign a team to manage the data flows and follow up on exceptions.',
                likelyLeadOwner: 'Revenue administration or IT, with cooperation from planning, land registry, and utility providers.',
                whatThisOptionDoes: 'This card turns the one-off cross-matching exercise of PT-COV-02 into a permanent, ongoing process. Instead of periodically requesting data extracts and comparing them manually, the city builds systematic links so that every relevant event in another agency\'s system automatically generates a signal in the tax administration. The goal is to make it structurally difficult for a new property to exist, change hands, or receive services without appearing on the tax roll.',
                mostUsefulWhen: [
                    'The city has achieved reasonable baseline coverage and the priority is now keeping the roll current.',
                    'Building permits, land transfers, and utility connections are processed through reasonably digital systems.',
                    'The relevant agencies are willing to share data on an ongoing basis.',
                    'The city has the IT capacity to build and maintain data integration pipelines.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has not yet achieved baseline coverage and the immediate priority is finding existing missing properties.',
                    'The source systems are entirely paper-based with no realistic path to digitisation.',
                    'There is no IT capacity to build or maintain integrations.'
                ],
                whatFullCardWouldPlan: 'A programme to design, build, and operate ongoing data feeds from key agencies, with exception handling workflows, data quality monitoring, and governance arrangements to sustain the integrations over time.',
                oftenWorksBestAlongside: [
                    'PT-COV-02 on cross-matching, which serves as the manual precursor to the permanent links.',
                    'PT-COV-07 on unique property IDs, which provides the common identifier for matching across systems.',
                    'PT-COV-09 on routine audits, which catches any properties that slip through the automated links.'
                ],
                politicalNote: 'Integration is primarily a technical and institutional challenge. Political sensitivity is moderate because it requires inter-agency cooperation and data sharing, which can encounter bureaucratic resistance. Senior leadership may need to intervene to secure cooperation.'
            },
            fullDetails: {
                whyThisMatters: 'This card turns the one-off cross-matching exercise of PT-COV-02 into a permanent, ongoing process. Instead of periodically requesting data extracts and comparing them manually, the city builds systematic links so that every relevant event in another agency\'s system automatically generates a signal in the tax administration. Without these links, the roll starts falling behind the moment a coverage exercise ends, and the coverage gap quietly re-opens.',
                whenStrongFit: [
                    'The city has achieved reasonable baseline coverage and the priority is now keeping the roll current.',
                    'Building permits, land transfers, and utility connections are processed through reasonably digital systems.',
                    'The relevant agencies are willing to share data on an ongoing basis.',
                    'The city has the IT capacity to build and maintain data integration pipelines.'
                ],
                whatToLineUpFirst: [
                    'Identify the key event triggers: building permits, land transfers, new utility connections, business registrations.',
                    'Negotiate data-sharing agreements with each agency, specifying what data is shared, how often, and in what format.',
                    'Design the matching logic that connects incoming events to existing records or flags new properties.',
                    'Assign a team to manage the data flows, handle exceptions, and follow up on unmatched events.'
                ],
                designChoices: [
                    'Choose the integration method: real-time API feeds, periodic batch transfers, or manual extracts as a starting point.',
                    'Decide which event types to prioritise based on volume, reliability, and expected yield.',
                    'Design the exception handling workflow: what happens when an incoming event does not match any existing record?',
                    'Determine the governance structure: who resolves disputes when data from different sources conflicts?'
                ],
                practicalPath: {
                    first90Days: [
                        'Map all potential event sources and assess their digital readiness and willingness to share data.',
                        'Negotiate data-sharing agreements with the two or three highest-priority agencies.',
                        'Design the matching logic and exception handling workflow.',
                        'Build a pilot integration with the most accessible data source and test it in one area.'
                    ],
                    sixTo12Months: [
                        'Extend integrations to additional data sources as agreements and technical work are completed.',
                        'Process incoming events, matching them to the roll and following up on exceptions.',
                        'Monitor the volume, quality, and yield of each data feed.',
                        'Refine matching rules based on the types of exceptions encountered.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Consolidate all integrations into a stable, monitored pipeline.',
                        'Establish performance metrics and service-level agreements with data-sharing partners.',
                        'Use the integration data to identify systemic coverage gaps and inform other reform efforts.',
                        'Plan for technology upgrades as source systems evolve or are replaced.'
                    ]
                },
                legalInstitutional: [
                    'Data-sharing agreements need a clear legal foundation and should specify obligations, protections, and dispute resolution.',
                    'Privacy rules must be respected, especially when linking data from multiple sources.',
                    'The agreements should survive staff changes, requiring institutional rather than personal commitments.'
                ],
                capacitySystemsPartnerships: [
                    'IT skills for building and maintaining data integrations are essential.',
                    'A dedicated team or unit should own the integration pipeline and monitor data quality.',
                    'Relationships with counterparts in partner agencies need ongoing cultivation, not just initial agreement.',
                    'The city may need to invest in middleware or integration platforms if source systems use different technologies.'
                ],
                risksAndSafeguards: [
                    'If data-sharing agreements are informal, they will break down when contacts change.',
                    'If exception handling is not resourced, unmatched events will accumulate without follow-up.',
                    'If partner agencies change their systems without notice, integrations will break.',
                    'If the city over-relies on integrations and stops periodic audits, properties that bypass all tracked events will be missed.'
                ],
                whatToMonitor: [
                    'Volume of events received from each data source per period.',
                    'Match rate: share of incoming events that match an existing property record.',
                    'New properties identified through event triggers.',
                    'Exception backlog: number of unmatched events awaiting follow-up.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-02 on cross-matching is the manual precursor to the permanent links built here.',
                    'PT-COV-07 on unique property IDs provides the common identifier for matching across systems.',
                    'PT-COV-09 on routine audits catches properties that slip through the automated links.',
                    'PT-COV-04 on imagery catches new construction that may bypass permits and utility connections.'
                ],
                questionsBeforeLaunch: [
                    'Which agencies hold the event data you need, and are they willing to share it on an ongoing basis?',
                    'Are the source systems digital enough to support automated data feeds?',
                    'Does the city have the IT capacity to build and maintain integrations?',
                    'Who will manage the data flows and follow up on exceptions?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-09',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Put routine coverage audits on the calendar',
            shortTitle: 'Routine coverage audits',
            timeline: '<1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low',
            category: 'Maintenance',
            sortOrder: 11,
            isActive: true,
            overview: {
                mainPurpose: 'Schedule regular, systematic checks to ensure the property tax roll remains complete and accurate over time, catching new properties, demolitions, and changes that other processes may have missed.',
                bestStartingPoint: 'A city that has achieved reasonable baseline coverage through one or more initial exercises and now needs a sustainable way to keep the roll current without repeating expensive one-off programmes.',
                firstVisibleResult: 'A published audit schedule with defined areas, frequencies, and responsibilities, and the first completed audit cycle showing how many new properties were found and how many records needed correction.',
                leadershipDecision: 'Adopt a formal audit policy specifying the cycle, coverage, and reporting requirements, and allocate the recurring budget and staff time needed.',
                likelyLeadOwner: 'Revenue administration, with support from field operations and data management.',
                whatThisOptionDoes: 'Coverage degrades naturally over time as new properties are built, existing ones are modified or demolished, and records accumulate errors. Without routine audits, the city is relying entirely on self-reporting or event-triggered updates, both of which have gaps. Scheduled audits provide a safety net that catches what other processes miss and gives the city a regular measure of how well the roll matches reality.',
                mostUsefulWhen: [
                    'An initial coverage exercise has been completed and the city wants to maintain the gains.',
                    'The city has field capacity that can be scheduled for periodic audits without disrupting other work.',
                    'Leadership wants a regular measure of coverage quality to track performance and spot problems early.',
                    'Other maintenance tools such as event triggers and citizen reporting are in place but may not catch everything.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has not yet achieved baseline coverage and needs a larger initial exercise first.',
                    'There is no field capacity available for audits.'
                ],
                whatFullCardWouldPlan: 'A recurring audit programme with defined areas, frequencies, sampling methods, and reporting requirements, embedded in the annual work plan and budget.',
                oftenWorksBestAlongside: [
                    'PT-COV-08 on linking the roll to event triggers, which reduces the number of issues audits need to catch.',
                    'PT-COV-10 on letting residents report changes, which provides another channel for catching issues between audits.',
                    'PT-COV-11 on fixing record errors, which provides the workflow for correcting issues found during audits.'
                ],
                politicalNote: 'Routine audits are low political sensitivity because they are framed as maintenance rather than enforcement. However, the city should communicate the purpose clearly in audited areas to avoid causing alarm.'
            },
            fullDetails: {
                whyThisMatters: 'Coverage degrades naturally over time as new properties are built, existing ones are modified or demolished, and records accumulate errors. Without routine audits, the city is relying entirely on self-reporting or event-triggered updates, both of which have gaps. Scheduled audits provide a safety net that catches what other processes miss and gives the city a regular measure of how well the roll matches reality. They also send a signal that the city is actively maintaining its register, which can deter non-compliance.',
                whenStrongFit: [
                    'An initial coverage exercise has been completed and the city wants to maintain the gains.',
                    'The city has field capacity that can be scheduled for periodic audits without disrupting other work.',
                    'Leadership wants a regular measure of coverage quality to track performance and spot problems early.',
                    'Other maintenance tools such as event triggers and citizen reporting are in place but may not catch everything.'
                ],
                whatToLineUpFirst: [
                    'Define the audit cycle: which areas are audited when, and how often each area is revisited.',
                    'Choose the audit method: full enumeration of sample areas, comparison of imagery against the roll, or random spot checks.',
                    'Allocate recurring budget and staff time in the annual work plan.',
                    'Design the reporting format so audit results are comparable across areas and over time.'
                ],
                designChoices: [
                    'Choose between full enumeration of sample areas and random spot checks based on available capacity.',
                    'Decide the frequency: annual for high-growth areas, biennial or triennial for stable areas.',
                    'Determine whether audits are conducted by internal staff, outsourced, or a combination.',
                    'Design the escalation process for issues found: who follows up, how quickly, and what corrections are made.'
                ],
                practicalPath: {
                    first90Days: [
                        'Design the audit programme: areas, frequencies, methods, and reporting requirements.',
                        'Allocate budget and assign or recruit audit staff.',
                        'Develop audit protocols, checklists, and data collection tools.',
                        'Conduct the first audit cycle in one or two areas as a pilot.'
                    ],
                    sixTo12Months: [
                        'Roll out the audit programme according to the published schedule.',
                        'Process findings promptly: add new properties, correct records, and flag issues for follow-up.',
                        'Report results to leadership and use them to identify areas needing attention.',
                        'Adjust the audit methodology based on the first cycle\'s experience.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Complete the full audit cycle for all areas and begin the next cycle.',
                        'Track coverage metrics over time to show whether the roll is improving or degrading.',
                        'Use audit data to inform the focus of other coverage tools and resource allocation.',
                        'Embed the audit programme in the annual budget and work plan as a permanent activity.'
                    ]
                },
                legalInstitutional: [
                    'The city should have formal authority to conduct property audits and request information.',
                    'The audit programme should be adopted as policy so it survives changes in leadership or staff.',
                    'Audit results should be formally documented and used to update the official roll.'
                ],
                capacitySystemsPartnerships: [
                    'Field audit teams need training on protocols, data collection, and interaction with property owners.',
                    'A back-office team must process audit findings and update the roll promptly.',
                    'The audit programme should use the same data tools and systems as the main register to avoid duplication.'
                ],
                risksAndSafeguards: [
                    'If audits are planned but not resourced, they will be deferred indefinitely.',
                    'If findings are not processed promptly, the audit exercise will lose credibility and value.',
                    'If the audit is too infrequent, it will miss rapid changes in high-growth areas.',
                    'If audit teams are not well trained, they may produce poor-quality data that is not usable.'
                ],
                whatToMonitor: [
                    'Number of properties audited per cycle against the plan.',
                    'New properties found during audits as a share of the audited area.',
                    'Record corrections identified and processed.',
                    'Coverage rate trend over time as measured by successive audit cycles.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-08 on linking the roll to event triggers reduces the issues audits need to catch.',
                    'PT-COV-10 on letting residents report changes provides another input between audits.',
                    'PT-COV-11 on fixing record errors provides the workflow for correcting issues found during audits.',
                    'PT-COV-03 on targeted sweeps is a more intensive version of what audits do on a lighter, ongoing basis.'
                ],
                questionsBeforeLaunch: [
                    'Does the city have the field capacity to conduct audits on a recurring basis?',
                    'What is the right frequency for different types of areas?',
                    'How will audit findings be processed and turned into roll updates?',
                    'Is the budget committed as a recurring line item, not just a one-off allocation?'
                ]
            }
        },

        {
            solutionId: 'PT-COV-10',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Let residents report property changes easily',
            shortTitle: 'Citizen change reporting',
            timeline: '<1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Low',
            category: 'Citizen Reporting',
            sortOrder: 12,
            isActive: true,
            overview: {
                mainPurpose: 'Create simple, accessible channels through which residents can report property changes, new construction, demolitions, or errors in their records, helping the city keep the roll current between formal audits.',
                bestStartingPoint: 'A city that has reasonable baseline coverage but struggles to keep the roll current because changes are not reported or captured until the next formal exercise.',
                firstVisibleResult: 'An operational reporting channel (SMS, WhatsApp, web form, or counter) receiving and processing citizen reports of property changes.',
                leadershipDecision: 'Approve the reporting channels, assign a team to process incoming reports, and decide how quickly the city commits to acting on verified reports.',
                likelyLeadOwner: 'Revenue administration, with support from communications, IT, and front-office operations.',
                whatThisOptionDoes: 'Residents are often the first to know about property changes in their area: new buildings going up, subdivisions, demolitions, or ownership transfers. By giving them a simple way to report these changes, the city gains an additional source of information that supplements formal audits and event triggers. The approach also signals that the city values resident input and is committed to keeping records accurate.',
                mostUsefulWhen: [
                    'Residents have access to mobile phones or the internet and are willing to report changes.',
                    'The city has a way to verify and act on reports within a reasonable time.',
                    'Formal audit cycles are infrequent and event triggers do not catch all changes.',
                    'The city wants to build a collaborative relationship with residents around property information.'
                ],
                usuallyNotBestFirstMove: [
                    'The main coverage problem is a large baseline gap rather than ongoing changes being missed.',
                    'The city has no capacity to verify and act on citizen reports.'
                ],
                whatFullCardWouldPlan: 'A citizen reporting programme with defined channels, a processing workflow, verification procedures, and a feedback mechanism so reporters know their input was received and acted on.',
                oftenWorksBestAlongside: [
                    'PT-COV-09 on routine audits, which provides a formal check on areas between citizen reports.',
                    'PT-COV-08 on linking the roll to event triggers, which catches changes that residents may not report.',
                    'PT-COV-11 on fixing record errors, which provides the workflow for processing corrections based on citizen reports.'
                ],
                politicalNote: 'Citizen reporting is generally well received and low sensitivity. The city should ensure that reporting is genuinely easy and that reporters receive feedback, otherwise the channel will be seen as performative and trust will erode.'
            },
            fullDetails: {
                whyThisMatters: 'Residents are often the first to know about property changes in their area: new buildings going up, subdivisions, demolitions, or ownership transfers. By giving them a simple way to report these changes, the city gains an additional source of information that supplements formal audits and event triggers. Without this channel, the city relies entirely on its own observation capacity, which is limited by budget and staff time. Citizen reporting can fill gaps between formal processes at very low cost.',
                whenStrongFit: [
                    'Residents have access to mobile phones or the internet and are willing to report changes.',
                    'The city has a way to verify and act on reports within a reasonable time.',
                    'Formal audit cycles are infrequent and event triggers do not catch all changes.',
                    'The city wants to build a collaborative relationship with residents around property information.'
                ],
                whatToLineUpFirst: [
                    'Choose the reporting channels based on what residents actually use: SMS, WhatsApp, a web form, a phone hotline, or in-person counters.',
                    'Design a simple reporting form that captures the minimum information needed to investigate a report.',
                    'Assign a team to receive, verify, and process reports.',
                    'Decide on the feedback mechanism: how will the city tell reporters what happened with their report?'
                ],
                designChoices: [
                    'Choose the channel mix based on digital access and resident preferences in your city.',
                    'Decide whether to allow anonymous reports or require identification. Anonymous reporting may increase volume but reduce verifiability.',
                    'Determine whether to offer incentives for valid reports or rely on civic motivation.',
                    'Design the verification workflow: field visit, desk check, or automated cross-reference depending on the type of change reported.'
                ],
                practicalPath: {
                    first90Days: [
                        'Choose the reporting channels and design the submission form.',
                        'Set up the technical infrastructure: SMS shortcode, WhatsApp business account, web form, or hotline.',
                        'Train the receiving team on how to log, verify, and process reports.',
                        'Pilot the channel in one or two areas and publicise it through local media and ward offices.'
                    ],
                    sixTo12Months: [
                        'Extend the reporting channels to the full city with a broader communications campaign.',
                        'Process incoming reports promptly: verify, update the roll, and send feedback to reporters.',
                        'Track report volumes, verification rates, and the types of changes most commonly reported.',
                        'Adjust the channels and processing workflow based on experience.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Embed citizen reporting as a permanent channel in the city\'s property tax administration.',
                        'Use reporting data to identify areas where changes are happening fastest and may need more intensive audit.',
                        'Evaluate whether incentives or recognition for active reporters would increase participation.',
                        'Integrate citizen reports with other data sources for a more complete picture of property changes.'
                    ]
                },
                legalInstitutional: [
                    'The city should have authority to act on citizen-reported information for tax purposes.',
                    'Privacy protections should cover both the reporter and the property owner or occupier being reported.',
                    'The verification process should be documented so the city is not acting solely on unverified tips.'
                ],
                capacitySystemsPartnerships: [
                    'A small team dedicated to processing reports is essential; if reports are ignored, the channel will die.',
                    'The receiving system should log reports, track their status, and generate reminders for follow-up.',
                    'Communications staff can help publicise the channel and keep it visible.'
                ],
                risksAndSafeguards: [
                    'If reports are received but not acted on, the channel will lose credibility quickly.',
                    'If the city acts on unverified reports without investigation, it may create disputes or target innocent parties.',
                    'If the channel is not publicised effectively, report volumes will be too low to be useful.',
                    'If the feedback loop is missing, reporters will not know whether their effort made a difference.'
                ],
                whatToMonitor: [
                    'Number of reports received per channel per period.',
                    'Share of reports verified and resulting in a roll update.',
                    'Average time from report to verification and roll update.',
                    'Reporter satisfaction and repeat reporting rates.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-09 on routine audits provides a formal check between citizen reports.',
                    'PT-COV-08 on linking the roll to event triggers catches changes that residents may not report.',
                    'PT-COV-11 on fixing record errors provides the workflow for processing corrections from citizen reports.',
                    'PT-COV-01 on self-registration can be promoted through the same communication channels.'
                ],
                questionsBeforeLaunch: [
                    'Which channels will residents actually use to report changes in your city?',
                    'Who will process reports, and how quickly can they verify and act?',
                    'How will the city provide feedback to reporters?',
                    'What verification steps are needed before acting on a citizen report?'
                ]
            }
        },

        // =====================================================================
        // D. Correct errors and keep the register usable
        // =====================================================================

        {
            solutionId: 'PT-COV-11',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Coverage',
            title: 'Fix basic record errors quickly',
            shortTitle: 'Quick error correction',
            timeline: '<1 year',
            deliveryDifficulty: 'Low',
            politicalSensitivity: 'Low',
            category: 'Data Quality',
            sortOrder: 13,
            isActive: true,
            overview: {
                mainPurpose: 'Give the city a fast, delegated process for correcting routine errors in property records, such as misspelled names, wrong addresses, outdated contact details, or incorrect property use codes, without requiring senior approval for every change.',
                bestStartingPoint: 'A city where staff and taxpayers regularly encounter errors in property records but corrections are slow because every change requires multiple approvals, a formal application, or access to a system that only a few people can use.',
                firstVisibleResult: 'A visible reduction in the time it takes to correct a routine record error, from weeks or months to days, with an audit trail that maintains accountability.',
                leadershipDecision: 'Define which types of corrections front-line staff can make without senior approval, set the documentation standard, and establish a simple audit trail so corrections can be reviewed.',
                likelyLeadOwner: 'Revenue administration, with support from front-office operations, IT, and data management.',
                whatThisOptionDoes: 'Record errors are one of the most common and most frustrating problems in property tax administration. A misspelled name means a bill cannot be delivered. A wrong address means a field team visits the wrong location. An outdated phone number means the city cannot follow up on arrears. These are not complex problems, but in many cities they persist for months or years because the correction process is cumbersome, centralised, or simply not prioritised.',
                mostUsefulWhen: [
                    'Staff and taxpayers frequently report errors in property records.',
                    'Corrections are slow because of excessive approval requirements or limited system access.',
                    'Bill delivery failure rates or complaint volumes suggest that record quality is poor.',
                    'The city wants to improve taxpayer satisfaction and administrative efficiency quickly.'
                ],
                usuallyNotBestFirstMove: [
                    'The main coverage problem is missing properties rather than errors in existing records.',
                    'The errors are complex, such as disputed ownership or boundary conflicts, which require investigation rather than quick correction.'
                ],
                whatFullCardWouldPlan: 'A streamlined correction process with defined categories of routine errors, delegated authority for front-line staff, a simple audit trail, and regular quality reviews.',
                oftenWorksBestAlongside: [
                    'PT-COV-01 on self-registration, which often surfaces errors in existing records.',
                    'PT-COV-10 on citizen change reporting, which provides a channel for residents to flag errors.',
                    'PT-COV-09 on routine audits, which identifies errors that need correction.'
                ],
                politicalNote: 'Fixing record errors is politically easy and popular. Taxpayers appreciate faster corrections, and staff appreciate being empowered to solve problems. The main risk is if the delegation of authority is not accompanied by an audit trail, which could enable fraud.'
            },
            fullDetails: {
                whyThisMatters: 'Record errors are one of the most common and most frustrating problems in property tax administration. A misspelled name means a bill cannot be delivered. A wrong address means a field team visits the wrong location. An outdated phone number means the city cannot follow up on arrears. These are not complex problems, but in many cities they persist for months or years because the correction process is cumbersome, centralised, or simply not prioritised. Fixing this is one of the easiest wins in property tax administration.',
                whenStrongFit: [
                    'Staff and taxpayers frequently report errors in property records.',
                    'Corrections are slow because of excessive approval requirements or limited system access.',
                    'Bill delivery failure rates or complaint volumes suggest that record quality is poor.',
                    'The city wants to improve taxpayer satisfaction and administrative efficiency quickly.'
                ],
                whatToLineUpFirst: [
                    'Categorise the types of errors that occur most frequently and determine which are routine enough for delegated correction.',
                    'Define the documentation standard: what evidence is needed for each type of correction?',
                    'Set up the audit trail: every correction should be logged with the user, date, reason, and supporting evidence.',
                    'Train front-line staff on the new process and the boundaries of their delegated authority.'
                ],
                designChoices: [
                    'Define clear categories: routine corrections that front-line staff can make immediately versus substantive changes that require senior review.',
                    'Choose whether corrections are made in real time or batched for end-of-day processing.',
                    'Decide whether taxpayers can request corrections through multiple channels (counter, phone, online) or only in person.',
                    'Design the audit trail to be lightweight enough that staff actually use it, but detailed enough for meaningful review.'
                ],
                practicalPath: {
                    first90Days: [
                        'Categorise common errors and define the routine correction categories.',
                        'Design the correction workflow, documentation standard, and audit trail.',
                        'Train front-line staff and give them the system access or forms they need.',
                        'Pilot the process at one or two service points and monitor the volume and quality of corrections.'
                    ],
                    sixTo12Months: [
                        'Roll out the correction process to all service points.',
                        'Review the audit trail regularly to catch any problems with the delegated authority.',
                        'Track correction volumes and the impact on data quality, bill delivery rates, and complaint volumes.',
                        'Adjust the categories and process based on experience.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Embed the correction process as a permanent, routine part of property tax administration.',
                        'Use correction data to identify systemic data quality problems and address their root causes.',
                        'Expand the channels through which taxpayers can request corrections if demand supports it.',
                        'Report on the improvement in data quality and its effect on billing and collection.'
                    ]
                },
                legalInstitutional: [
                    'Delegated correction authority should be formally documented so staff are protected and accountable.',
                    'The audit trail should meet any legal requirements for record-keeping and data integrity.',
                    'The distinction between routine corrections and substantive changes should be clear in policy.'
                ],
                capacitySystemsPartnerships: [
                    'Front-line staff need system access or clear paper-based procedures to make corrections.',
                    'The billing or register system should support an audit trail for every change.',
                    'A supervisor or data quality team should review corrections periodically to maintain standards.'
                ],
                risksAndSafeguards: [
                    'If delegated authority is not accompanied by an audit trail, it could be exploited for fraud or favouritism.',
                    'If the categories are too narrow, staff will still feel unable to fix obvious errors.',
                    'If the categories are too broad, substantive changes may be made without proper review.',
                    'If corrections are not reflected in the system quickly, bills and notices will continue to use the wrong information.'
                ],
                whatToMonitor: [
                    'Number of corrections processed per period and average processing time.',
                    'Types of corrections: which errors are most common?',
                    'Audit trail review findings: any corrections outside the delegated scope or without proper documentation?',
                    'Impact on bill delivery rates, complaint volumes, and taxpayer satisfaction.'
                ],
                connectionsToOtherCards: [
                    'PT-COV-01 on self-registration often surfaces errors in existing records that this card can fix.',
                    'PT-COV-10 on citizen change reporting provides a channel for residents to flag errors.',
                    'PT-COV-09 on routine audits identifies errors that need correction.',
                    'PT-COV-07 on unique property IDs benefits from cleaner data that reduces duplication and confusion.'
                ],
                questionsBeforeLaunch: [
                    'What are the most common types of errors in your property records?',
                    'Which corrections are routine enough that front-line staff can handle them?',
                    'Does the system support an audit trail for every change?',
                    'How will you review corrections to ensure quality and prevent misuse?'
                ]
            }
        }

    ];

})(window);
