/**
 * ROSRA Solutions Data - Non-Property Subgroup B
 * Service fees and billed use charges
 * Cards organized by gap: Coverage, Liability Application, Compliance
 */
(function(window) {
    'use strict';

    window.SolutionsDataNP_B = [
        // =====================================================================
        // COVERAGE CARDS (finding and registering service users/accounts)
        // =====================================================================
        {
            solutionId: 'NP-B-COV-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Register Service Users Through Connection and Account Records',
            shortTitle: 'Connection-Based Registration',
            timeline: '<1 year',
            politicalBarrier: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Use existing service connection, account, or tenancy records to identify users who should be paying service fees but are not yet in the billing system. This is often the fastest way to widen coverage for billed service charges because the data already exist in operational departments.',
                whatYouDo: 'Map the most complete data sources, compare against the billing register, verify uncertain cases, and add confirmed users immediately.',
                whenThisFitsBest: 'Service connections exist but many users are not billed. Utility or account data are more current than the billing register. Staff can run basic matching.',
                minimumEnablers: 'Access to utility or service connection records; basic data matching capability; billing register that can accept new entries.'
            },
            fullDetails: {
                legalEssentials: [
                    'The city should be able to use operational service records for billing purposes',
                    'Data-sharing arrangements with utilities or service departments may be needed',
                    'Confirm authority to add users to billing register based on service connection evidence'
                ],
                howItWorks: 'Map the most complete data sources (utility connections, tenancy lists, service accounts) and agree a basic matching cycle. Compare against the billing register to identify likely unregistered or unbilled users. Verify uncertain cases through desk checks, phone calls, or short field visits. Add confirmed users to the billing register immediately and set the first bill date.',
                implementationMilestones: [
                    'Map the most complete data sources (utility connections, tenancy lists, service accounts) and agree a basic matching cycle',
                    'Compare against the billing register to identify likely unregistered or unbilled users',
                    'Verify uncertain cases through desk checks, phone calls, or short field visits',
                    'Add confirmed users to the billing register immediately and set the first bill date'
                ],
                administrativeEssentials: [
                    'Assign a liaison in each relevant department',
                    'Define matching rules and keep a source log',
                    'Maintain a record of which source was used for each new registration'
                ],
                whenNotApplicable: [
                    'No reliable service records exist',
                    'The service itself is too informal to track',
                    'Billing register already matches operational records well'
                ],
                caseNotes: 'False matches can create billing disputes. Verify before activating accounts. Start with the highest-confidence matches and expand gradually.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-COV-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Targeted Field Verification of Service Points',
            shortTitle: 'Field Verification',
            timeline: '1-2 years',
            politicalBarrier: 'Moderate',
            category: 'Registration',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Use supervised field visits to identify and verify service users, tenants, or facility users who are not yet in the billing system, especially in areas where desk-based matching cannot reach.',
                whatYouDo: 'Select priority areas, deploy small supervised teams, record findings in a standard format, and load them into the register promptly.',
                whenThisFitsBest: 'Desk-based matching leaves significant gaps. New connections or informal extensions are common. Physical verification is needed to confirm service use.',
                minimumEnablers: 'Supervisory capacity for field teams; standard data capture forms; fast route from findings into the register.'
            },
            fullDetails: {
                legalEssentials: [
                    'Field teams need clear identification and authority to collect information for billing purposes',
                    'Confirm legal basis for door-to-door or site-level data collection',
                    'Ensure privacy and data protection compliance for field-gathered information'
                ],
                howItWorks: 'Select priority areas where unbilled service use is likely highest. Deploy small supervised teams to verify service connections, occupancy, or use. Record findings in a standard format and load into the register promptly. Use findings to estimate remaining gaps and plan further coverage work.',
                implementationMilestones: [
                    'Select priority areas where unbilled service use is likely highest',
                    'Deploy small supervised teams to verify service connections, occupancy, or use',
                    'Record findings in a standard format and load into the register promptly',
                    'Use findings to estimate remaining gaps and plan further coverage work'
                ],
                administrativeEssentials: [
                    'Strong supervision matters more than team size',
                    'Results need a fast route into the register',
                    'Quality-check a sample of field returns before loading'
                ],
                whenNotApplicable: [
                    'Coverage is already reasonable from desk-based sources',
                    'Field access is restricted or unsafe',
                    'The service is not physically verifiable at the point of use'
                ],
                caseNotes: 'Poorly explained visits can create resistance. Weak supervision leads to inconsistent data. Announce visits through community leaders where possible.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-COV-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Maintain the Service User Register Through Event Triggers',
            shortTitle: 'Event-Triggered Updates',
            timeline: '1-3 years',
            politicalBarrier: 'Moderate',
            category: 'Registration',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Link the billing register to routine operational events — new connections, disconnections, tenancy changes, facility bookings — so that coverage stays current without repeated manual clean-ups.',
                whatYouDo: 'Identify reliable trigger events, negotiate data-sharing arrangements, define the workflow from trigger to billing record, and review exceptions monthly.',
                whenThisFitsBest: 'Service operations already generate usable event data. The city wants continuous maintenance rather than periodic clean-ups. Partner departments are willing to cooperate.',
                minimumEnablers: 'Reliable event data from operational departments; data-sharing agreements; named liaisons; a stable register backbone.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data-sharing agreements or administrative orders to formalise event-triggered updates',
                    'Confirm authority to update billing records based on operational events',
                    'Define responsibilities for data quality between departments'
                ],
                howItWorks: 'Identify the most reliable trigger events (new service connections, meter installations, tenancy contracts). Negotiate a routine data-sharing arrangement with the relevant operational department. Define the workflow from trigger event to confirmed billing record. Review exception cases monthly and refine matching rules.',
                implementationMilestones: [
                    'Identify the most reliable trigger events (new service connections, meter installations, tenancy contracts)',
                    'Negotiate a routine data-sharing arrangement with the relevant operational department',
                    'Define the workflow from trigger event to confirmed billing record',
                    'Review exception cases monthly and refine matching rules'
                ],
                administrativeEssentials: [
                    'Named liaisons in each department',
                    'A small exception-review routine',
                    'One stable register backbone that all triggers feed into'
                ],
                whenNotApplicable: [
                    'Service delivery is too informal to generate reliable trigger events',
                    'Basic record matching is still too weak to support automated updates',
                    'Partner departments are unwilling or unable to share event data'
                ],
                caseNotes: 'Ambitious agreements that never become operational are a common failure mode. Start with one trigger and one partner department, prove it works, then expand. Weak matching rules create bad updates — test before scaling.',
                resources: []
            }
        },

        // =====================================================================
        // LIABILITY APPLICATION CARDS (correct fee schedules and billing)
        // =====================================================================
        {
            solutionId: 'NP-B-LIA-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability Application',
            title: 'Review and Correct the Service Fee Schedule',
            shortTitle: 'Fee Schedule Correction',
            timeline: '<1 year',
            politicalBarrier: 'Moderate to High',
            category: 'Rates',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Review the current fee structure for the billed service to ensure rates, categories, and exemptions are clear, current, and consistently applied. Fee schedule problems are one of the most common reasons service charges underperform.',
                whatYouDo: 'List all current fee lines, compare against the legally adopted schedule, propose corrections or simplifications, and update all billing materials.',
                whenThisFitsBest: 'The schedule is outdated, confusing, or inconsistently applied. Different offices apply different rates for similar users. Revenue losses from incorrect fee application are likely material.',
                minimumEnablers: 'Access to the current adopted fee schedule; billing data to identify discrepancies; authority to propose corrections through the required approval route.'
            },
            fullDetails: {
                legalEssentials: [
                    'Service fee schedules typically require formal adoption',
                    'Changes may require public notice or council approval',
                    'Confirm the legal route for schedule corrections versus new fee adoption'
                ],
                howItWorks: 'List all current fee lines, rates, exemptions, and any differentiated tariffs in use. Compare against the legally adopted schedule and identify gaps, errors, or outdated categories. Propose corrections or simplifications and adopt through the required approval route. Update all billing materials, systems, and staff guidance.',
                implementationMilestones: [
                    'List all current fee lines, rates, exemptions, and any differentiated tariffs in use',
                    'Compare against the legally adopted schedule and identify gaps, errors, or outdated categories',
                    'Propose corrections or simplifications and adopt through the required approval route',
                    'Update all billing materials, systems, and staff guidance'
                ],
                administrativeEssentials: [
                    'Align the schedule with the billing system',
                    'Train all staff involved in rate application',
                    'Maintain a single authoritative version of the adopted schedule'
                ],
                whenNotApplicable: [
                    'Fees were recently reviewed and are working well',
                    'The main problem is non-payment rather than incorrect billing',
                    'The fee schedule is clear and consistently applied'
                ],
                caseNotes: 'Fee increases can trigger public resistance. Present changes as corrections for fairness, not revenue grabs. Simplification often matters more than rate changes.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-LIA-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability Application',
            title: 'Improve User Classification and Tariff Assignment',
            shortTitle: 'Tariff Classification',
            timeline: '<1 year',
            politicalBarrier: 'Moderate',
            category: 'Classification',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Ensure each service user is assigned to the correct tariff band or user category so bills match the adopted schedule. Misclassification is a common source of under-billing.',
                whatYouDo: 'Audit a sample of accounts, correct clear misclassification cases, update classification rules and staff guidance, and build checks into account setup and review.',
                whenThisFitsBest: 'Similar users are billed at different rates. Staff rely on informal judgement. Revenue losses from misclassification are likely.',
                minimumEnablers: 'Clear classification criteria in the adopted schedule; access to account records for sampling; authority to correct billing classifications.'
            },
            fullDetails: {
                legalEssentials: [
                    'The city usually has authority to correct billing classifications',
                    'Notice requirements may apply when reclassifying existing accounts',
                    'Confirm appeal or review rights for reclassified users'
                ],
                howItWorks: 'Audit a sample of accounts to identify misclassification patterns. Correct clear cases administratively. Update classification rules and staff guidance. Build classification checks into new account setup and periodic review.',
                implementationMilestones: [
                    'Audit a sample of accounts to identify misclassification patterns',
                    'Correct clear cases administratively',
                    'Update classification rules and staff guidance',
                    'Build classification checks into new account setup and periodic review'
                ],
                administrativeEssentials: [
                    'Clear classification criteria with examples',
                    'Decision tools for frontline staff',
                    'Periodic audit of classification accuracy'
                ],
                whenNotApplicable: [
                    'Classification is already well managed',
                    'The fee schedule itself needs fixing first (fix the schedule before fixing classification)',
                    'Only one tariff band exists — no classification needed'
                ],
                caseNotes: 'Reclassification can feel punitive. Start with the clearest mismatches and explain the fairness logic. Users paying less than they should are more sensitive than those already paying correctly.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-LIA-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability Application',
            title: 'Strengthen Billing Accuracy and Cycle Discipline',
            shortTitle: 'Billing Discipline',
            timeline: '<1 year',
            politicalBarrier: 'Low to Moderate',
            category: 'Billing',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'Ensure bills are generated correctly, on time, and for the right amount each billing cycle. Weak billing discipline is one of the most common reasons service fee revenue underperforms.',
                whatYouDo: 'Review the current billing cycle, standardise the process, link billing to the register, and track billed versus collected amounts by category.',
                whenThisFitsBest: 'Many accounts are not billed each cycle. Bills arrive late or with wrong amounts. Fee amounts do not match the adopted schedule.',
                minimumEnablers: 'A billing system or process that can be standardised; a register current enough to support billing; staff capacity to run the cycle on schedule.'
            },
            fullDetails: {
                legalEssentials: [
                    'Confirm billing authority and procedural requirements for the service charge',
                    'Ensure bill format meets any legal notice requirements',
                    'Confirm rules for billing adjustments and corrections'
                ],
                howItWorks: 'Review the current billing cycle and identify where bills are late, missing, or incorrectly calculated. Standardise the process so every active account receives a bill on schedule. Link billing to the register so account changes flow into the next bill. Track billed versus collected amounts by category to identify persistent billing errors.',
                implementationMilestones: [
                    'Review the current billing cycle and identify where bills are late, missing, or incorrectly calculated',
                    'Standardise the process so every active account receives a bill on schedule',
                    'Link billing to the register so account changes flow into the next bill',
                    'Track billed versus collected amounts by category to identify persistent billing errors'
                ],
                administrativeEssentials: [
                    'Automate or systematise bill generation',
                    'Train billing staff on schedules and common errors',
                    'Monthly reconciliation of billed versus collected amounts'
                ],
                whenNotApplicable: [
                    'Billing is reliable and the problem is collection',
                    'The register is too incomplete to support billing — fix coverage first',
                    'The fee schedule itself is the problem — fix rates first'
                ],
                caseNotes: 'Incorrect bills damage trust faster than missing bills. Test accuracy before scaling. A reliable billing cycle is the foundation for compliance work — without it, reminders and enforcement have nothing to build on.',
                resources: []
            }
        },

        // =====================================================================
        // COMPLIANCE CARDS (getting billed users to actually pay)
        // =====================================================================
        {
            solutionId: 'NP-B-COM-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Structured Payment Reminders and Overdue Follow-Up',
            shortTitle: 'Reminders & Follow-Up',
            timeline: '<1 year',
            politicalBarrier: 'Usually higher',
            category: 'Billing',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Send timely reminders before and after payment due dates and follow up systematically on overdue accounts. This is usually one of the cheapest and fastest compliance gains for billed service charges.',
                whatYouDo: 'Design a reminder calendar, choose effective channels, set stop rules for paid accounts, and escalate systematically from reminders to formal notices to consequences.',
                whenThisFitsBest: 'Many users are willing but late. Contact data exist. Management wants a low-cost compliance lift.',
                minimumEnablers: 'Contact data for billed users; messaging channels (SMS, email, or physical notice); ability to suppress reminders after payment.'
            },
            fullDetails: {
                legalEssentials: [
                    'Confirm messaging channel authorisation and privacy compliance',
                    'Ensure reminder content meets any legal notice requirements',
                    'Confirm authority to impose late-payment consequences referenced in reminders'
                ],
                howItWorks: 'Design a reminder calendar with pre-deadline and post-deadline messages. Choose effective channels for the user base. Set stop rules for paid accounts. Link reminders to account status so only active overdue accounts receive messages. Escalate systematically from reminders to formal notices to consequences.',
                implementationMilestones: [
                    'Design a reminder calendar with pre-deadline and post-deadline messages',
                    'Choose effective channels for the user base (SMS, email, physical notice)',
                    'Set stop rules for paid accounts to avoid sending reminders after payment',
                    'Link reminders to account status so only active overdue accounts receive messages',
                    'Escalate systematically from reminders to formal notices to consequences'
                ],
                administrativeEssentials: [
                    'Calendar ownership and template management',
                    'Help-desk alignment so staff can respond to reminder-triggered queries',
                    'Monitoring of reminder effectiveness by channel and user segment'
                ],
                whenNotApplicable: [
                    'Contact data are too thin to reach most users',
                    'The city cannot suppress reminders after payment',
                    'Billing itself is unreliable — fix billing before adding reminders'
                ],
                caseNotes: 'Poor stop rules undermine trust. Too many messages feel like harassment. Start with a simple two-step calendar (pre-deadline and post-deadline) and add steps as capacity grows.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-COM-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Easy and Trustworthy Payment Channels',
            shortTitle: 'Payment Channels',
            timeline: '<1 year',
            politicalBarrier: 'Usually higher',
            category: 'Payments',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Make payment easier by expanding beyond city offices to bank agents, mobile money, online portals, or local counters, while maintaining strong receipting and reconciliation.',
                whatYouDo: 'Map existing payment habits, select partner channels, standardise payment references, launch with clear instructions, and issue receipts for every payment.',
                whenThisFitsBest: 'Queues or distance make payment difficult. Users already use mobile money or banks for other payments. The city wants to reduce cash handling risks.',
                minimumEnablers: 'Viable payment partners; standard payment reference system; back-office reconciliation capacity; user awareness channels.'
            },
            fullDetails: {
                legalEssentials: [
                    'Confirm authority for third-party collection',
                    'Simple agreements with payment providers',
                    'Electronic receipt validity and format requirements'
                ],
                howItWorks: 'Map existing payment habits and select first partner channels. Standardise payment references for reliable matching. Launch with clear instructions and monitor posting speed. Issue receipts for every payment and publish authorised channels.',
                implementationMilestones: [
                    'Map existing payment habits and select first partner channels',
                    'Standardise payment references for reliable matching',
                    'Launch with clear instructions and monitor posting speed',
                    'Issue receipts for every payment and publish authorised channels'
                ],
                administrativeEssentials: [
                    'Back-office reconciliation is critical — assign dedicated capacity',
                    'Standard receipt format across all channels',
                    'Channel performance monitoring and user feedback'
                ],
                whenNotApplicable: [
                    'No viable payment partners in the area',
                    'The city cannot reconcile multiple channels',
                    'Current payment channels already work well for users'
                ],
                caseNotes: 'Too many channels without reconciliation capacity increases unmatched payments. Start with one or two high-impact partners, prove reconciliation works, then expand.',
                resources: []
            }
        },
        {
            solutionId: 'NP-B-COM-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Graduated Enforcement Including Service-Linked Consequences',
            shortTitle: 'Service-Linked Enforcement',
            timeline: '<1 year to 1-3 years',
            politicalBarrier: 'Moderate to High',
            category: 'Enforcement',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Use a staged enforcement ladder that can include service-related consequences such as service restriction, disconnection, or deposit requirements for persistent non-payers. Service-linked enforcement is often more effective than financial penalties alone for billed utility and service charges.',
                whatYouDo: 'Define a clear escalation ladder, apply consequences consistently starting with the largest cases, document each step, and coordinate with operational departments.',
                whenThisFitsBest: 'Non-payment carries little practical consequence currently. Service delivery is formal enough that restriction is operationally possible. The legal framework supports service-linked enforcement.',
                minimumEnablers: 'Legal authority for service restriction or disconnection; due process protections; vulnerable user safeguards; coordination between billing and operations teams.'
            },
            fullDetails: {
                legalEssentials: [
                    'Confirm authority for service restriction or disconnection',
                    'Ensure due process and notice requirements are met at each escalation step',
                    'Protect vulnerable users through explicit safeguards and exemptions'
                ],
                howItWorks: 'Define a clear escalation ladder from reminders through formal notices, penalties, and service-linked consequences. Apply consequences consistently starting with the largest and clearest cases. Document each enforcement step. Coordinate with operational departments that manage the service.',
                implementationMilestones: [
                    'Define a clear escalation ladder from reminders through formal notices, penalties, and service-linked consequences',
                    'Apply consequences consistently starting with the largest and clearest cases',
                    'Document each enforcement step and maintain audit trail',
                    'Coordinate with operational departments that manage the service'
                ],
                administrativeEssentials: [
                    'Register-based tracking of enforcement actions',
                    'Coordination between billing and operations teams',
                    'Vulnerable user identification and protection protocols'
                ],
                whenNotApplicable: [
                    'Service delivery is too informal for restriction to be operationally possible',
                    'Enforcement is politically blocked or legally unsupported',
                    'Vulnerable user protections are not in place',
                    'Billing and registration are too weak to support enforcement — fix those first'
                ],
                caseNotes: 'Service disconnection is politically sensitive. Must protect vulnerable users explicitly. Poor targeting can create backlash. Start with large commercial accounts where the case is clearest, and publicise results to create a deterrent effect.',
                resources: []
            }
        }
    ];
})(window);
