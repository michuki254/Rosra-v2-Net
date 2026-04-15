/**
 * ROSRA Solutions Data - Non-Property Subgroup A
 * Business licences and recurrent operating permits
 * Cards organized by gap: Coverage, Liability Application, Compliance
 */
(function(window) {
    'use strict';

    window.SolutionsDataNP_A = [

        // =============================================
        // COVERAGE CARDS (5)
        // =============================================

        {
            solutionId: 'A1',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Easy First-Time Business Registration and Licensing',
            shortTitle: 'Simplified First Registration',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Offer a short, practical route for first-time entry into the municipal licensing system. Keep the first application focused on essential information such as activity, location, contact, and a small number of local checks, and let the business obtain at least a basic compliant status quickly. This is often the fastest way to bring willing but unregistered businesses into the system without waiting for a large structural reform.',
                mostUsefulWhen: [
                    'Many small businesses are operating without a licence, especially in neighbourhood centres, markets, and mixed-use areas.',
                    'The current first-time process is so complicated or intimidating that businesses stay outside the system.',
                    'The municipality wants a visible, low-cost improvement that can widen the base quickly.'
                ],
                usuallyNotBestFirstMove: [
                    'National law leaves no room for local simplification.',
                    'The underlying register cannot yet create and track new accounts reliably.'
                ],
                politicalNote: 'Keep the first contact proportionate. A coverage reform should widen the licensing base, not feel like a surprise enforcement raid on small operators. Log the date and source of each new or corrected account so the city can challenge duplicates, disputes, and informal side deals later. Frame it as bringing businesses into a clearer local system, not as a sudden crackdown on informality.',
                oftenWorksBestAlongside: [
                    'A7 (Digital Licence Register and Unique Business IDs) so that new accounts feed directly into a reliable tracking system.',
                    'A9 (Easy Renewal and Payment Channels) so that newly registered businesses can pay easily from the start.',
                    'A3 (Targeted Onboarding Drive) if the simplified registration is launched as part of a broader regularisation campaign.'
                ]
            },
            fullDetails: {
                overview: 'Offer a short, practical route for first-time entry into the municipal licensing system. Keep the first application focused on essential information such as activity, location, contact, and a small number of local checks, and let the business obtain at least a basic compliant status quickly. This is often the fastest way to bring willing but unregistered businesses into the system without waiting for a large structural reform.',
                implementationPath: [
                    'Design a one-page first-entry form and decide which minimal documents are truly necessary for a first licence or provisional licence.',
                    'Open at least two intake channels, for example the central revenue office and ward or market points, and prepare a simple daily logging routine.',
                    'Run a short communication campaign explaining who should register, what the city is asking for, and what businesses receive immediately after applying.',
                    'Create the account, assign the business ID, issue the first bill or renewal date, and review the first weeks of applications to remove avoidable bottlenecks.'
                ],
                legalInstitutionalEnablers: 'The city needs clear authority to accept a simplified first application or, where relevant, issue a temporary or provisional licence under existing rules. If this is unclear, a short council order or administrative circular is often enough.',
                administrativeSetup: 'Use a plain form, a short document checklist, and clear staff guidance. The process should create the business account immediately, assign a unique ID, and trigger the first bill or renewal date in the register.',
                goodFitWhen: [
                    'Many small businesses are operating without a licence, especially in neighbourhood centres, markets, and mixed-use areas.',
                    'The current first-time process is so complicated or intimidating that businesses stay outside the system.',
                    'The municipality wants a visible, low-cost improvement that can widen the base quickly.'
                ],
                lessSuitableWhen: [
                    'National law leaves no room for local simplification.',
                    'The underlying register cannot yet create and track new accounts reliably.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. A coverage reform should widen the licensing base, not feel like a surprise enforcement raid on small operators.',
                    'Log the date and source of each new or corrected account so the city can challenge duplicates, disputes, and informal side deals later.',
                    'Frame it as bringing businesses into a clearer local system, not as a sudden crackdown on informality.'
                ]
            }
        },

        {
            solutionId: 'A2',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Business Listing Through Data-Sharing and Street Verification',
            shortTitle: 'Data-Sharing and Street Verification',
            timeline: 'Less than a year',
            politicalFeasibility: 'Moderate',
            category: 'Registration',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Build or refresh the business list by combining what the municipality already knows with what partner agencies, utilities, market managers, or local associations know, then verify quickly in the street.',
                mostUsefulWhen: [
                    'Other offices hold partial business information.',
                    'Business activity is concentrated enough for verification visits.',
                    'Staff can manage basic matching.'
                ],
                usuallyNotBestFirstMove: [
                    'Partner data are too weak.',
                    'Politics or institutional conflict make data-sharing unrealistic.'
                ],
                politicalNote: 'Keep the first contact proportionate. Log the date and source. Where possible, show partner agencies that cleaner data helps their own work.',
                oftenWorksBestAlongside: [
                    'A1 (Easy First-Time Business Registration and Licensing) to register newly discovered businesses.',
                    'A7 (Digital Licence Register and Unique Business IDs) to store and deduplicate the results.',
                    'A12 (Rolling Business Roll Clean-Up and Dormancy Rules) to keep the refreshed list accurate over time.'
                ]
            },
            fullDetails: {
                overview: 'Build or refresh the business list by combining what the municipality already knows with what partner agencies, utilities, market managers, or local associations know, then verify quickly in the street.',
                implementationPath: [
                    'Map the best existing data sources and agree a basic data-sharing cycle.',
                    'Run simple matching to identify likely missing businesses, duplicates, and obvious errors.',
                    'Send small verification teams to confirm only the uncertain cases.',
                    'Add, correct, or close accounts immediately after verification.'
                ],
                legalInstitutionalEnablers: 'The city should be able to receive and use non-sensitive data for local revenue administration through simple data-sharing agreements or MoUs.',
                administrativeSetup: 'Assign a liaison in each relevant office, define a short matching rule, and keep a log.',
                goodFitWhen: [
                    'Other offices hold partial business information.',
                    'Business activity is concentrated enough for verification visits.',
                    'Staff can manage basic matching.'
                ],
                lessSuitableWhen: [
                    'Partner data are too weak.',
                    'Politics or institutional conflict make data-sharing unrealistic.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate.',
                    'Log the date and source.',
                    'Where possible, show partner agencies that cleaner data helps their own work.'
                ]
            }
        },

        {
            solutionId: 'A3',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Targeted Onboarding Drive with Time-Bound Regularisation',
            shortTitle: 'Targeted Onboarding Drive',
            timeline: '6-12 months',
            politicalFeasibility: 'Moderate',
            category: 'Registration',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Run a focused campaign inviting unlicensed businesses to come forward within a fixed window, often paired with lighter entry conditions or limited relief from back-penalties.',
                mostUsefulWhen: [
                    'The municipality believes many businesses could register if the first step felt safer.',
                    'Fear of back-charges is a major reason businesses remain outside.',
                    'New political leadership wants a visible reset.'
                ],
                usuallyNotBestFirstMove: [
                    'The municipality has repeated amnesties so often that businesses expect to wait.',
                    'The administration cannot process a sudden increase.'
                ],
                politicalNote: 'Keep the first contact proportionate. Log the date and source. Publicly say early that this is the last easy entry window before normal enforcement resumes.',
                oftenWorksBestAlongside: [
                    'A1 (Easy First-Time Business Registration and Licensing) to simplify the intake process during the campaign.',
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to ensure new registrants are followed up after the campaign.',
                    'A11 (Graduated Enforcement for Non-Renewal and Non-Payment) to follow through after the window closes.'
                ]
            },
            fullDetails: {
                overview: 'Run a focused campaign inviting unlicensed businesses to come forward within a fixed window, often paired with lighter entry conditions or limited relief from back-penalties.',
                implementationPath: [
                    'Define the regularisation offer clearly.',
                    'Prepare extra intake capacity.',
                    'Use targeted outreach through trader groups, market leaders, associations, and local radio.',
                    'Close the campaign with a published cut-off date and shift into normal monitoring.'
                ],
                legalInstitutionalEnablers: 'The city needs legal room to waive or reduce past penalties for a defined period, usually requiring a clear council resolution and a fixed cut-off date.',
                administrativeSetup: 'Pair the campaign with strong communication, surge capacity, simple proof requirements, and a clear plan for what happens after.',
                goodFitWhen: [
                    'The municipality believes many businesses could register if the first step felt safer.',
                    'Fear of back-charges is a major reason businesses remain outside.',
                    'New political leadership wants a visible reset.'
                ],
                lessSuitableWhen: [
                    'The municipality has repeated amnesties so often that businesses expect to wait.',
                    'The administration cannot process a sudden increase.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate.',
                    'Log the date and source.',
                    'Publicly say early that this is the last easy entry window before normal enforcement resumes.'
                ]
            }
        },

        {
            solutionId: 'A7',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Digital Licence Register and Unique Business IDs',
            shortTitle: 'Digital Licence Register',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Registration',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Create a single digital register with a unique ID for each licensed business. This lets the municipality track first registration, renewal history, fees due, payments, inspections, and corrections in one place.',
                mostUsefulWhen: [
                    'The city relies on multiple paper lists or disconnected spreadsheets.',
                    'Same business appears more than once.',
                    'Renewal tracking is weak.'
                ],
                usuallyNotBestFirstMove: [
                    'Jurisdiction is too small for digital system value.',
                    'No realistic local capacity.'
                ],
                politicalNote: 'Keep the first contact proportionate. Log the date and source.',
                oftenWorksBestAlongside: [
                    'A1 (Easy First-Time Business Registration and Licensing) to feed new accounts into the register.',
                    'A12 (Rolling Business Roll Clean-Up and Dormancy Rules) to keep the register accurate.',
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to drive renewal workflows from the register.'
                ]
            },
            fullDetails: {
                overview: 'Create a single digital register with a unique ID for each licensed business. This lets the municipality track first registration, renewal history, fees due, payments, inspections, and corrections in one place.',
                implementationPath: [
                    'Agree a minimum data model.',
                    'Clean and migrate existing records.',
                    'Set up simple workflows for registration, renewal, closure, dormancy, reactivation.',
                    'Train users by role, test in one department first.'
                ],
                legalInstitutionalEnablers: 'Electronic records should be recognised for administrative use and the city should be able to assign a unique municipal business identifier.',
                administrativeSetup: 'Prepare a migration and deduplication plan, define user roles, write simple procedures.',
                goodFitWhen: [
                    'The city relies on multiple paper lists or disconnected spreadsheets.',
                    'Same business appears more than once.',
                    'Renewal tracking is weak.'
                ],
                lessSuitableWhen: [
                    'Jurisdiction is too small for digital system value.',
                    'No realistic local capacity.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate.',
                    'Log the date and source.'
                ]
            }
        },

        {
            solutionId: 'A12',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Rolling Business Roll Clean-Up and Dormancy Rules',
            shortTitle: 'Roll Clean-Up and Dormancy',
            timeline: 'Less than a year; repeat',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Keep the register realistic by checking regularly which businesses have closed, moved, changed activity, or become dormant.',
                mostUsefulWhen: [
                    'Register contains many dead or duplicate accounts.',
                    'Staff cannot tell whether non-renewal reflects evasion or closure.',
                    'Seasonal businesses create confusion.'
                ],
                usuallyNotBestFirstMove: [
                    'No practical way to verify whether businesses are still operating.',
                    'Local economy is so mobile that dormancy rules would constantly lag.'
                ],
                politicalNote: 'Keep the first contact proportionate. Log the date and source.',
                oftenWorksBestAlongside: [
                    'A7 (Digital Licence Register and Unique Business IDs) to manage status codes digitally.',
                    'A2 (Business Listing Through Data-Sharing and Street Verification) to verify uncertain cases.',
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to trigger dormancy review when renewals are missed.'
                ]
            },
            fullDetails: {
                overview: 'Keep the register realistic by checking regularly which businesses have closed, moved, changed activity, or become dormant.',
                implementationPath: [
                    'Create account-status codes (active, dormant, seasonal, moved, merged, closed).',
                    'Review the register at fixed intervals.',
                    'Move doubtful accounts into a review queue.',
                    'Publish internal reports on dormant, reactivated, and closed accounts.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to suspend, close, or mark accounts dormant under clear administrative rules.',
                administrativeSetup: 'Use periodic desk review plus targeted field checks, define change-of-status codes, keep audit trail.',
                goodFitWhen: [
                    'Register contains many dead or duplicate accounts.',
                    'Staff cannot tell whether non-renewal reflects evasion or closure.',
                    'Seasonal businesses create confusion.'
                ],
                lessSuitableWhen: [
                    'No practical way to verify whether businesses are still operating.',
                    'Local economy is so mobile that dormancy rules would constantly lag.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate.',
                    'Log the date and source.'
                ]
            }
        },

        // =============================================
        // LIABILITY APPLICATION CARDS (4)
        // =============================================

        {
            solutionId: 'A4',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability',
            title: 'Clear Activity Classification and Decision Rules',
            shortTitle: 'Activity Classification Rules',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Classification',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Replace ad hoc classification with a short operational guide that helps staff place each business in the correct activity class. The guide should handle common borderline cases, mixed activities, home-based businesses, and seasonal operations in a predictable way.',
                mostUsefulWhen: [
                    'Similar businesses charged differently across wards.',
                    'Staff rely on personal judgment.',
                    'Classification disputes are common.'
                ],
                usuallyNotBestFirstMove: [
                    'The approved schedule is itself too vague.',
                    'The city cannot prove the charging basis.'
                ],
                politicalNote: 'The main operational risk is uneven treatment. Where politically connected firms are part of the problem, start with sectors where legal evidence is strongest.',
                oftenWorksBestAlongside: [
                    'A5 (Fee-Band Clean-Up and Standard Application of the Schedule) to correct fee bands after classification is clearer.',
                    'A14 (Risk-Based Inspection and Reclassification Checks) to verify classifications in the field.',
                    'A6 (Control Routine Waivers, Discounts, and Exceptions) to limit informal overrides of correct classification.'
                ]
            },
            fullDetails: {
                overview: 'Replace ad hoc classification with a short operational guide that helps staff place each business in the correct activity class. The guide should handle common borderline cases, mixed activities, home-based businesses, and seasonal operations in a predictable way.',
                implementationPath: [
                    'Review existing schedule and identify confusion points.',
                    'Create operational guide with examples, decision tree, mandatory evidence checks.',
                    'Train frontline staff and supervisors together.',
                    'Require second-level review for difficult cases, revise guide yearly.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to issue administrative guidance under the existing schedule.',
                administrativeSetup: 'Prepare decision tree with worked examples, brief staff training, supervisor review for complex cases.',
                goodFitWhen: [
                    'Similar businesses charged differently across wards.',
                    'Staff rely on personal judgment.',
                    'Classification disputes are common.'
                ],
                lessSuitableWhen: [
                    'The approved schedule is itself too vague.',
                    'The city cannot prove the charging basis.'
                ],
                risksAndDesignNotes: [
                    'The main operational risk is uneven treatment.',
                    'Where politically connected firms are part of the problem, start with sectors where legal evidence is strongest.'
                ]
            }
        },

        {
            solutionId: 'A5',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability',
            title: 'Fee-Band Clean-Up and Standard Application of the Schedule',
            shortTitle: 'Fee-Band Clean-Up',
            timeline: 'Less than a year',
            politicalFeasibility: 'Moderate',
            category: 'Classification',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Review how current fee bands are being applied in practice and correct routine underbilling caused by wrong bands, outdated turnover proxies, weak evidence standards, or legacy informal arrangements.',
                mostUsefulWhen: [
                    'Known businesses paying less than schedule suggests.',
                    'Legacy practices override formal rules.',
                    'Revenue is flat across very different businesses.'
                ],
                usuallyNotBestFirstMove: [
                    'No credible information on business size.',
                    'Political leadership unwilling to touch connected cases.'
                ],
                politicalNote: 'Uneven treatment risk. Start with sectors where underbilling is obvious and easier to defend publicly.',
                oftenWorksBestAlongside: [
                    'A4 (Clear Activity Classification and Decision Rules) to ensure businesses are in the right class before adjusting bands.',
                    'A6 (Control Routine Waivers, Discounts, and Exceptions) to prevent informal overrides from undermining corrections.',
                    'A14 (Risk-Based Inspection and Reclassification Checks) to verify the corrections in the field.'
                ]
            },
            fullDetails: {
                overview: 'Review how current fee bands are being applied in practice and correct routine underbilling caused by wrong bands, outdated turnover proxies, weak evidence standards, or legacy informal arrangements.',
                implementationPath: [
                    'Sample accounts from likely under-banded sectors.',
                    'Define a correction workflow with documentation.',
                    'Re-band clearest cases first.',
                    'Prepare wider clean-up plan.'
                ],
                legalInstitutionalEnablers: 'The city must have access to the approved fee schedule and authority to correct accounts under it.',
                administrativeSetup: 'Use targeted sample first, keep corrections log, require supervisor sign-off, use standard notice language.',
                goodFitWhen: [
                    'Known businesses paying less than schedule suggests.',
                    'Legacy practices override formal rules.',
                    'Revenue is flat across very different businesses.'
                ],
                lessSuitableWhen: [
                    'No credible information on business size.',
                    'Political leadership unwilling to touch connected cases.'
                ],
                risksAndDesignNotes: [
                    'Uneven treatment risk.',
                    'Start with sectors where underbilling is obvious and easier to defend publicly.'
                ]
            }
        },

        {
            solutionId: 'A6',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability',
            title: 'Control Routine Waivers, Discounts, and Exceptions',
            shortTitle: 'Control Waivers and Exceptions',
            timeline: 'Less than a year',
            politicalFeasibility: 'More sensitive',
            category: 'Classification',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Require every waiver, discount, or special treatment to be grounded in a written rule and recorded against the account. Many licensing systems lose revenue not because the schedule is weak, but because informal exceptions become normal practice.',
                mostUsefulWhen: [
                    'Staff or politicians frequently grant special treatment.',
                    'Difficult to explain different amounts.',
                    'Revenue leakage concentrated in exemptions.'
                ],
                usuallyNotBestFirstMove: [
                    'Leadership unwilling to constrain discretionary relief.',
                    'Can\'t prove charging basis.'
                ],
                politicalNote: 'Uneven treatment risk. This is often less about technical reform and more about readiness to reduce informal discretion.',
                oftenWorksBestAlongside: [
                    'A4 (Clear Activity Classification and Decision Rules) to ensure classification is correct before controlling exceptions.',
                    'A5 (Fee-Band Clean-Up and Standard Application of the Schedule) to ensure the base charge is right.',
                    'A11 (Graduated Enforcement for Non-Renewal and Non-Payment) to follow up where exceptions are removed.'
                ]
            },
            fullDetails: {
                overview: 'Require every waiver, discount, or special treatment to be grounded in a written rule and recorded against the account. Many licensing systems lose revenue not because the schedule is weak, but because informal exceptions become normal practice.',
                implementationPath: [
                    'List every formal and informal exception.',
                    'Limit approval authority to named officers with written reasons.',
                    'Create exception register linked to account.',
                    'Review register monthly.'
                ],
                legalInstitutionalEnablers: 'Clarify which exceptions are allowed and who can approve them.',
                administrativeSetup: 'Maintain exception register, require written justification, review waived amounts monthly.',
                goodFitWhen: [
                    'Staff or politicians frequently grant special treatment.',
                    'Difficult to explain different amounts.',
                    'Revenue leakage concentrated in exemptions.'
                ],
                lessSuitableWhen: [
                    'Leadership unwilling to constrain discretionary relief.',
                    'Can\'t prove charging basis.'
                ],
                risksAndDesignNotes: [
                    'Uneven treatment risk.',
                    'This is often less about technical reform and more about readiness to reduce informal discretion.'
                ]
            }
        },

        {
            solutionId: 'A14',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability',
            title: 'Risk-Based Inspection and Reclassification Checks',
            shortTitle: 'Risk-Based Inspection',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Classification',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use a simple risk model to focus limited inspection effort on businesses most likely to be misclassified, under-banded, or operating outside the licensed activity.',
                mostUsefulWhen: [
                    'Inspection staff limited.',
                    'Underbilling concentrated in certain sectors.',
                    'City has enough account data for risk signals.'
                ],
                usuallyNotBestFirstMove: [
                    'No realistic inspection mandate.',
                    'Register too thin for credible risk signals.'
                ],
                politicalNote: 'Uneven treatment risk. Risk-based inspection is easier to defend than blanket raids because the city can explain the focus.',
                oftenWorksBestAlongside: [
                    'A4 (Clear Activity Classification and Decision Rules) to define what correct classification looks like.',
                    'A5 (Fee-Band Clean-Up and Standard Application of the Schedule) to correct bands after inspection findings.',
                    'A7 (Digital Licence Register and Unique Business IDs) to feed inspection results back into the register.'
                ]
            },
            fullDetails: {
                overview: 'Use a simple risk model to focus limited inspection effort on businesses most likely to be misclassified, under-banded, or operating outside the licensed activity.',
                implementationPath: [
                    'Choose risk markers for likely under-billing.',
                    'Generate short inspection lists from those markers.',
                    'During inspection, verify activity, scale, and evidence.',
                    'Update register, issue corrected bills, review risk model.'
                ],
                legalInstitutionalEnablers: 'The municipality needs inspection powers and authority to update the account where verified activity differs.',
                administrativeSetup: 'Start with simple risk criteria. Inspectors should record findings in standard format that feeds back into register.',
                goodFitWhen: [
                    'Inspection staff limited.',
                    'Underbilling concentrated in certain sectors.',
                    'City has enough account data for risk signals.'
                ],
                lessSuitableWhen: [
                    'No realistic inspection mandate.',
                    'Register too thin for credible risk signals.'
                ],
                risksAndDesignNotes: [
                    'Uneven treatment risk.',
                    'Risk-based inspection is easier to defend than blanket raids because the city can explain the focus.'
                ]
            }
        },

        // =============================================
        // COMPLIANCE CARDS (5)
        // =============================================

        {
            solutionId: 'A8',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Renewal Calendar with Automatic Notices and Bills',
            shortTitle: 'Automatic Renewal Notices',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Compliance',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Move renewal from a passive process to an active one. Generate renewal notices automatically before expiry, state clearly what is due, and spell out how and where to pay.',
                mostUsefulWhen: [
                    'Many businesses renew late or only after inspection pressure.',
                    'Expiry dates exist but don\'t drive follow-up.',
                    'Businesses say they were never reminded.'
                ],
                usuallyNotBestFirstMove: [
                    'Register doesn\'t hold reliable renewal dates.',
                    'No practical way to reach businesses.'
                ],
                politicalNote: 'Stronger enforcement only works if notices, bills, and payment channels are reliable. Keep a quick correction route.',
                oftenWorksBestAlongside: [
                    'A9 (Easy Renewal and Payment Channels) to make it easy for businesses to act on the notice.',
                    'A7 (Digital Licence Register and Unique Business IDs) to generate renewal lists automatically.',
                    'A11 (Graduated Enforcement for Non-Renewal and Non-Payment) to follow up when reminders are ignored.'
                ]
            },
            fullDetails: {
                overview: 'Move renewal from a passive process to an active one. Generate renewal notices automatically before expiry, state clearly what is due, and spell out how and where to pay.',
                implementationPath: [
                    'Create standard renewal calendar.',
                    'Use register to generate renewal lists automatically.',
                    'Send notices through SMS, WhatsApp, email, paper, noticeboards.',
                    'Review each cycle to adjust.'
                ],
                legalInstitutionalEnablers: 'Authority to issue standard renewal notices, including digital reminders.',
                administrativeSetup: 'Maintain renewal calendar, simple message templates, daily/weekly paid/unpaid view.',
                goodFitWhen: [
                    'Many businesses renew late or only after inspection pressure.',
                    'Expiry dates exist but don\'t drive follow-up.',
                    'Businesses say they were never reminded.'
                ],
                lessSuitableWhen: [
                    'Register doesn\'t hold reliable renewal dates.',
                    'No practical way to reach businesses.'
                ],
                risksAndDesignNotes: [
                    'Stronger enforcement only works if notices, bills, and payment channels are reliable.',
                    'Keep a quick correction route.'
                ]
            }
        },

        {
            solutionId: 'A9',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Easy Renewal and Payment Channels',
            shortTitle: 'Easy Renewal and Payment',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Compliance',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Give businesses several practical ways to renew and pay, such as ward counters, mobile money, banks, or an online portal. Where possible, combine renewal confirmation and payment into one simple workflow.',
                mostUsefulWhen: [
                    'Long queues discourage on-time renewal.',
                    'Businesses already use mobile or agent-based payments.',
                    'Traders lose work time travelling.'
                ],
                usuallyNotBestFirstMove: [
                    'Connectivity too weak.',
                    'City cannot reconcile payments to accounts.'
                ],
                politicalNote: 'Stronger enforcement only works if channels are reliable. Keep quick correction route. Where trust is weak, start with few clearly branded official channels.',
                oftenWorksBestAlongside: [
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to drive businesses to the payment channels.',
                    'A7 (Digital Licence Register and Unique Business IDs) to link each payment to the correct account.',
                    'A13 (Simplified Renewal for Stable, Low-Risk Businesses) to reduce the renewal burden for qualifying businesses.'
                ]
            },
            fullDetails: {
                overview: 'Give businesses several practical ways to renew and pay, such as ward counters, mobile money, banks, or an online portal. Where possible, combine renewal confirmation and payment into one simple workflow.',
                implementationPath: [
                    'Remove unnecessary steps from renewal.',
                    'Offer several payment channels.',
                    'Ensure each payment updates account and generates receipt.',
                    'Track share of renewals by channel.'
                ],
                legalInstitutionalEnablers: 'Legal room to use third-party payment channels and digital receipts.',
                administrativeSetup: 'Every payment must link to business ID, reconcile back to register, generate proof. Publicly list authorised channels.',
                goodFitWhen: [
                    'Long queues discourage on-time renewal.',
                    'Businesses already use mobile or agent-based payments.',
                    'Traders lose work time travelling.'
                ],
                lessSuitableWhen: [
                    'Connectivity too weak.',
                    'City cannot reconcile payments to accounts.'
                ],
                risksAndDesignNotes: [
                    'Stronger enforcement only works if channels are reliable.',
                    'Keep quick correction route.',
                    'Where trust is weak, start with few clearly branded official channels.'
                ]
            }
        },

        {
            solutionId: 'A13',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Simplified Renewal for Stable, Low-Risk Businesses',
            shortTitle: 'Simplified Renewal',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Compliance',
            sortOrder: 12,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'For businesses whose location, activity, and fee band rarely change, issue a pre-filled renewal or simple renewal confirmation instead of making them restart the process each year.',
                mostUsefulWhen: [
                    'Many small businesses are stable year to year.',
                    'Renewal queues long.',
                    'Municipality wants better compliance without enforcement pressure.'
                ],
                usuallyNotBestFirstMove: [
                    'Register too unreliable for pre-filled renewals.',
                    'Frequent misclassification means full review needed.'
                ],
                politicalNote: 'Stronger enforcement only works if channels are reliable. Keep quick correction route. This is often popular because it is seen as cutting unnecessary bureaucracy.',
                oftenWorksBestAlongside: [
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to trigger the simplified renewal automatically.',
                    'A9 (Easy Renewal and Payment Channels) to let businesses confirm and pay in one step.',
                    'A7 (Digital Licence Register and Unique Business IDs) to hold the previous-year data needed for pre-filling.'
                ]
            },
            fullDetails: {
                overview: 'For businesses whose location, activity, and fee band rarely change, issue a pre-filled renewal or simple renewal confirmation instead of making them restart the process each year.',
                implementationPath: [
                    'Define which businesses qualify.',
                    'Pre-populate renewal information.',
                    'Use light-touch verification.',
                    'Remove businesses from simplified route if risk indicators appear.'
                ],
                legalInstitutionalEnablers: 'Authority to rely on self-confirmation for unchanged businesses, subject to later audit.',
                administrativeSetup: 'Register needs clean previous-year record, change declaration field, and way to flag cases for review.',
                goodFitWhen: [
                    'Many small businesses are stable year to year.',
                    'Renewal queues long.',
                    'Municipality wants better compliance without enforcement pressure.'
                ],
                lessSuitableWhen: [
                    'Register too unreliable for pre-filled renewals.',
                    'Frequent misclassification means full review needed.'
                ],
                risksAndDesignNotes: [
                    'Stronger enforcement only works if channels are reliable.',
                    'Keep quick correction route.',
                    'This is often popular because it is seen as cutting unnecessary bureaucracy.'
                ]
            }
        },

        {
            solutionId: 'A10',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Link Licence Compliance to Permits, Inspections, and Sector Approvals',
            shortTitle: 'Link Licence to Other Approvals',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Compliance',
            sortOrder: 13,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Make licence status matter in other municipal touchpoints. Require an up-to-date licence or clearance for selected permits, market allocations, signage approvals, inspections, or other sector approvals.',
                mostUsefulWhen: [
                    'Businesses interact with other departments.',
                    'Municipality has active permit or inspection functions.',
                    'Leadership ready to coordinate across departments.'
                ],
                usuallyNotBestFirstMove: [
                    'Most activity is informal and outside municipal touchpoints.',
                    'Departments unwilling to cooperate.'
                ],
                politicalNote: 'Stronger enforcement only works if channels are reliable. Keep quick correction route. This works best when presented as orderly city management, not as a revenue grab.',
                oftenWorksBestAlongside: [
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to ensure businesses know their licence status.',
                    'A9 (Easy Renewal and Payment Channels) so businesses can quickly get compliant when prompted.',
                    'A7 (Digital Licence Register and Unique Business IDs) to enable real-time status checks across departments.'
                ]
            },
            fullDetails: {
                overview: 'Make licence status matter in other municipal touchpoints. Require an up-to-date licence or clearance for selected permits, market allocations, signage approvals, inspections, or other sector approvals.',
                implementationPath: [
                    'Identify external approvals that matter most.',
                    'Define a simple tax-status check.',
                    'Create fast route for routine cases.',
                    'Review exception cases with partner offices.'
                ],
                legalInstitutionalEnablers: 'Departments need a by-law, administrative circular, or MoU for licence status checks.',
                administrativeSetup: 'Set up simple clearance workflow, agree service standards, brief business groups.',
                goodFitWhen: [
                    'Businesses interact with other departments.',
                    'Municipality has active permit or inspection functions.',
                    'Leadership ready to coordinate across departments.'
                ],
                lessSuitableWhen: [
                    'Most activity is informal and outside municipal touchpoints.',
                    'Departments unwilling to cooperate.'
                ],
                risksAndDesignNotes: [
                    'Stronger enforcement only works if channels are reliable.',
                    'Keep quick correction route.',
                    'This works best when presented as orderly city management, not as a revenue grab.'
                ]
            }
        },

        {
            solutionId: 'A11',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Graduated Enforcement for Non-Renewal and Non-Payment',
            shortTitle: 'Graduated Enforcement',
            timeline: 'Less than a year',
            politicalFeasibility: 'More sensitive',
            category: 'Compliance',
            sortOrder: 14,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use a clear ladder of action \u2014 reminder, formal demand, final notice, targeted visit, and then a proportionate sanction if the business still ignores the municipality.',
                mostUsefulWhen: [
                    'Many businesses on register but don\'t renew or pay.',
                    'Current enforcement is irregular.',
                    'City wants firmer response without jumping to closure.'
                ],
                usuallyNotBestFirstMove: [
                    'No practical sanction beyond reminders.',
                    'Political leadership unwilling to act.'
                ],
                politicalNote: 'Stronger enforcement only works if channels are reliable. Keep quick correction route. Start with cases easier to defend publicly.',
                oftenWorksBestAlongside: [
                    'A8 (Renewal Calendar with Automatic Notices and Bills) to ensure the notice ladder starts with proper reminders.',
                    'A9 (Easy Renewal and Payment Channels) so businesses have no excuse for non-payment.',
                    'A3 (Targeted Onboarding Drive) to give businesses a final chance before enforcement escalates.'
                ]
            },
            fullDetails: {
                overview: 'Use a clear ladder of action \u2014 reminder, formal demand, final notice, targeted visit, and then a proportionate sanction if the business still ignores the municipality.',
                implementationPath: [
                    'Design notice ladder with clear timelines.',
                    'Define light-touch vs faster treatment based on arrears age, size, repeat behaviour.',
                    'Train enforcement staff on documentation and due process.',
                    'Publish end-of-cycle summary.'
                ],
                legalInstitutionalEnablers: 'Authority for notices, late penalties, temporary closure, or other existing sanctions.',
                administrativeSetup: 'Standard templates, case log, target larger or repeat arrears first.',
                goodFitWhen: [
                    'Many businesses on register but don\'t renew or pay.',
                    'Current enforcement is irregular.',
                    'City wants firmer response without jumping to closure.'
                ],
                lessSuitableWhen: [
                    'No practical sanction beyond reminders.',
                    'Political leadership unwilling to act.'
                ],
                risksAndDesignNotes: [
                    'Stronger enforcement only works if channels are reliable.',
                    'Keep quick correction route.',
                    'Start with cases easier to defend publicly.'
                ]
            }
        }

    ];

})(window);
