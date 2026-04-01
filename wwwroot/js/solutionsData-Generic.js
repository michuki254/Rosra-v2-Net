/**
 * Generic Solutions for User Fees and Other Non-Property Streams
 * These templates can be adapted for: Market Fees, Parking Fees, User Fees, etc.
 */
(function(window) {
    'use strict';

    window.SolutionsDataGeneric = [
        // Compliance Solutions
        {
            solutionId: 'GEN-COM-01',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Payment channels: Expand easy-to-access payment options',
            shortTitle: 'Diverse Payment Channels',
            timeline: '<1 year',
            category: 'Payments',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Limited payment points create barriers; users avoid payment.',
                whatYouDo: 'Add mobile money, bank agents, online payments; maintain field collection for remote areas.',
                whenThisFitsBest: 'Payment infrastructure exists; current channels are limited.',
                minimumEnablers: 'Payment partnerships; reconciliation system; user awareness.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to receive payments through third parties',
                    'Electronic receipt validity',
                    'Payment reconciliation requirements'
                ],
                howItWorks: 'Partner with mobile money providers, banks, and payment agents to accept fee payments. Each payment uses unique reference number. Payments are reconciled daily and credited to payer accounts. Maintain some field collection points for areas without digital access.',
                implementationMilestones: [
                    'Assess current payment channels and gaps',
                    'Negotiate partnerships with payment providers',
                    'Set up reconciliation systems',
                    'Train staff and publicize new options',
                    'Monitor channel usage and adjust'
                ],
                administrativeEssentials: [
                    'Payment provider management',
                    'Daily reconciliation',
                    'Channel performance monitoring'
                ],
                whenNotApplicable: [
                    'No payment infrastructure exists',
                    'Current channels work well'
                ],
                caseNotes: 'More payment options increase compliance by reducing transaction costs for payers.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-COM-02',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Enforcement: Implement graduated enforcement with visible consequences',
            shortTitle: 'Graduated Enforcement',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'No consequences for non-payment; users ignore demands.',
                whatYouDo: 'Develop enforcement ladder: reminders, warnings, service restrictions, legal action.',
                whenThisFitsBest: 'Legal authority exists; enforcement capacity available.',
                minimumEnablers: 'Legal framework; enforcement resources; tracking system.'
            },
            fullDetails: {
                legalEssentials: [
                    'Penalty authority',
                    'Service restriction authority',
                    'Due process requirements'
                ],
                howItWorks: 'Implement graduated response: Day +15 (friendly reminder), Day +30 (formal notice with penalty warning), Day +60 (penalty applied + service restriction warning), Day +90 (service restricted). Each step documented and communicated clearly.',
                implementationMilestones: [
                    'Review legal enforcement powers',
                    'Design enforcement ladder',
                    'Create notice templates',
                    'Train enforcement staff',
                    'Implement with monitoring'
                ],
                administrativeEssentials: [
                    'Enforcement tracking',
                    'Notice delivery',
                    'Penalty collection'
                ],
                whenNotApplicable: [
                    'No enforcement authority',
                    'No identifiable fee-payers'
                ],
                caseNotes: 'Graduated enforcement is fairer and more effective than random harsh actions.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-COM-03',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Communication: Run awareness campaigns on payment obligations',
            shortTitle: 'Public Awareness Campaigns',
            timeline: '<1 year',
            category: 'Communication',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Users unaware of obligations or deadlines; non-compliance due to ignorance.',
                whatYouDo: 'Conduct public awareness campaigns; use multiple channels; explain what fees fund.',
                whenThisFitsBest: 'Public awareness is low; communication budget available.',
                minimumEnablers: 'Communication resources; clear messaging; multiple channels.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority for public communications',
                    'Accuracy requirements'
                ],
                howItWorks: 'Design campaign explaining: what fee is for, who must pay, how to pay, when to pay, consequences of non-payment. Use radio, social media, posters, community meetings. Time campaigns around payment deadlines.',
                implementationMilestones: [
                    'Develop key messages',
                    'Identify target audiences and channels',
                    'Create campaign materials',
                    'Execute multi-channel campaign',
                    'Measure awareness and compliance changes'
                ],
                administrativeEssentials: [
                    'Campaign coordination',
                    'Material production',
                    'Channel management'
                ],
                whenNotApplicable: [
                    'No communication budget',
                    'Awareness already high'
                ],
                caseNotes: 'Education is particularly effective when introducing new fees or changes.',
                resources: []
            }
        },
        // Coverage Solutions
        {
            solutionId: 'GEN-COV-01',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Registration: Create simple user registration system',
            shortTitle: 'User Registration System',
            timeline: '<1 year',
            category: 'Registration',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'No systematic way to identify who should pay; users slip through cracks.',
                whatYouDo: 'Develop registration database; link to service access; enable self-registration.',
                whenThisFitsBest: 'Services can be linked to registration; data collection is feasible.',
                minimumEnablers: 'Database system; registration process; linkage mechanism.'
            },
            fullDetails: {
                legalEssentials: [
                    'Registration requirements',
                    'Data collection authority',
                    'Service linkage authority'
                ],
                howItWorks: 'Create database of fee-payers with unique IDs. Link registration to service access where possible. Enable self-registration online or at service points. Verify and maintain database accuracy.',
                implementationMilestones: [
                    'Design registration database',
                    'Define registration requirements',
                    'Create registration channels',
                    'Link to service delivery',
                    'Launch with publicity'
                ],
                administrativeEssentials: [
                    'Database maintenance',
                    'Registration processing',
                    'Service linkage management'
                ],
                whenNotApplicable: [
                    'No identifiable user population',
                    'Service access cannot be controlled'
                ],
                caseNotes: 'Registration is foundation for systematic fee collection.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-COV-02',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Data integration: Link with other databases to identify users',
            shortTitle: 'Database Integration',
            timeline: '<1 year',
            category: 'Data',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Fee-payers exist in other systems but are not captured for this revenue.',
                whatYouDo: 'Cross-match with property, business, utility databases; identify potential payers.',
                whenThisFitsBest: 'Related databases exist; matching is technically feasible.',
                minimumEnablers: 'Data access; matching tools; follow-up process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data sharing authority',
                    'Privacy protections',
                    'Follow-up authority'
                ],
                howItWorks: 'Identify other databases containing potential fee-payers. Cross-match against current payer database. Investigate mismatches. Follow up with unregistered users. Establish ongoing data feeds where possible.',
                implementationMilestones: [
                    'Identify relevant data sources',
                    'Negotiate data sharing',
                    'Conduct cross-match analysis',
                    'Follow up on identified users',
                    'Establish ongoing integration'
                ],
                administrativeEssentials: [
                    'Data management',
                    'Analysis capability',
                    'Follow-up capacity'
                ],
                whenNotApplicable: [
                    'No related databases',
                    'Legal barriers to sharing'
                ],
                caseNotes: 'Data integration leverages existing information to expand coverage.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-COV-03',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Field enumeration: Conduct systematic identification of fee-payers',
            shortTitle: 'Field Enumeration',
            timeline: '1-3 years',
            category: 'Field',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'No complete list of who should pay; manual identification needed.',
                whatYouDo: 'Organize field teams to identify and register fee-payers; update database.',
                whenThisFitsBest: 'Digital records incomplete; field access possible.',
                minimumEnablers: 'Field teams; data collection tools; supervisor oversight.'
            },
            fullDetails: {
                legalEssentials: [
                    'Enumeration authority',
                    'Data collection permissions',
                    'Registration authority'
                ],
                howItWorks: 'Deploy teams to systematically identify and register fee-payers. Record: identity, location, service usage, contact details. Update central database. Establish follow-up process for new identifications.',
                implementationMilestones: [
                    'Plan enumeration coverage',
                    'Train field teams',
                    'Execute enumeration',
                    'Process and verify data',
                    'Update fee-payer database'
                ],
                administrativeEssentials: [
                    'Field coordination',
                    'Data processing',
                    'Quality assurance'
                ],
                whenNotApplicable: [
                    'No field capacity',
                    'Users cannot be physically identified'
                ],
                caseNotes: 'Field enumeration is labor-intensive but reliable for establishing baseline.',
                resources: []
            }
        },
        // Liability Solutions
        {
            solutionId: 'GEN-LIA-01',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Rate review: Update fee schedules to reflect costs and capacity',
            shortTitle: 'Fee Schedule Review',
            timeline: '1-3 years',
            category: 'Policy',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Outdated fees do not cover costs; potential revenue unrealized.',
                whatYouDo: 'Review fee basis; update rates based on cost recovery or value; implement graduated structures.',
                whenThisFitsBest: 'Fees have not been updated recently; legal authority exists.',
                minimumEnablers: 'Fee-setting authority; cost/value data; rate design methodology.'
            },
            fullDetails: {
                legalEssentials: [
                    'Fee-setting authority',
                    'Cost recovery principles',
                    'Update procedures'
                ],
                howItWorks: 'Review current fee levels against: costs of service provision, comparable jurisdictions, ability to pay, revenue needs. Design updated fee structure. Phase in increases if large. Communicate rationale clearly.',
                implementationMilestones: [
                    'Analyze current fee structure',
                    'Assess costs and comparables',
                    'Design updated fee schedule',
                    'Obtain approval',
                    'Implement with communication'
                ],
                administrativeEssentials: [
                    'Fee analysis capability',
                    'Approval process management',
                    'Implementation coordination'
                ],
                whenNotApplicable: [
                    'Fees recently updated',
                    'Political constraints prevent increases'
                ],
                caseNotes: 'Regular fee review ensures revenue keeps pace with costs and inflation.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-LIA-02',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Classification: Ensure users are properly categorized for fee purposes',
            shortTitle: 'User Classification',
            timeline: '<1 year',
            category: 'Classification',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Users in wrong category; paying less than they should.',
                whatYouDo: 'Review classifications; establish clear criteria; conduct re-categorization.',
                whenThisFitsBest: 'Differentiated fee structure exists; misclassification suspected.',
                minimumEnablers: 'Classification criteria; verification capacity; data correction.'
            },
            fullDetails: {
                legalEssentials: [
                    'Classification authority',
                    'Reclassification procedures',
                    'Appeal rights'
                ],
                howItWorks: 'Review existing user classifications against actual usage or characteristics. Develop clear classification criteria. Conduct reclassification where needed. Update billing accordingly.',
                implementationMilestones: [
                    'Review current classifications',
                    'Develop clear criteria',
                    'Conduct reclassification review',
                    'Update database and billing',
                    'Handle appeals'
                ],
                administrativeEssentials: [
                    'Classification criteria',
                    'Review capacity',
                    'Appeals handling'
                ],
                whenNotApplicable: [
                    'Flat fee with no categories',
                    'Classification already accurate'
                ],
                caseNotes: 'Proper classification ensures appropriate fees. Small corrections can have significant revenue impact.',
                resources: []
            }
        },
        {
            solutionId: 'GEN-LIA-03',
            stream: 'Generic',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Metering/measurement: Improve measurement basis for usage-based fees',
            shortTitle: 'Usage Measurement',
            timeline: '1-3 years',
            category: 'Measurement',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Flat fees do not capture actual use; heavy users subsidized.',
                whatYouDo: 'Implement metering or measurement where feasible; link fees to actual usage.',
                whenThisFitsBest: 'Usage varies significantly; metering is technically feasible.',
                minimumEnablers: 'Metering equipment; reading capacity; billing system; maintenance.'
            },
            fullDetails: {
                legalEssentials: [
                    'Usage-based fee authority',
                    'Metering requirements',
                    'Billing based on meter readings'
                ],
                howItWorks: 'Install meters or establish measurement methodology. Take regular readings. Bill based on actual usage rather than flat amount. Ensure maintenance and calibration of meters.',
                implementationMilestones: [
                    'Assess metering feasibility and costs',
                    'Procure and install meters',
                    'Establish reading procedures',
                    'Update billing to usage-based',
                    'Maintain meters and monitor accuracy'
                ],
                administrativeEssentials: [
                    'Meter installation and maintenance',
                    'Reading procedures',
                    'Billing system updates'
                ],
                whenNotApplicable: [
                    'Metering cost exceeds benefit',
                    'Usage relatively uniform',
                    'No metering technology available'
                ],
                caseNotes: 'Usage-based fees are fairer and create conservation incentives. Key is reliable metering.',
                resources: []
            }
        }
    ];

})(window);
