/**
 * Business License Solutions (9)
 * Full details for all business license gap solutions
 */
(function(window) {
    'use strict';

    window.SolutionsDataBL = [
        // Compliance Solutions (3)
        {
            solutionId: 'BL-COM-01',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Billing & Reminders: Automate license renewal notices with mobile-friendly payment options',
            shortTitle: 'Automated Renewal Notices',
            timeline: '<1 year',
            category: 'Billing',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Businesses forget to renew; manual reminder processes miss many licensees.',
                whatYouDo: 'Send automated renewal reminders via SMS/email; provide mobile money payment; send escalating reminders.',
                whenThisFitsBest: 'Digital license database exists; mobile payment infrastructure available.',
                minimumEnablers: 'Contact database; SMS gateway; mobile money integration; renewal tracking.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to send electronic notices',
                    'Electronic payment acceptance',
                    'Renewal deadline requirements'
                ],
                howItWorks: 'System automatically sends renewal notices 60, 30, and 7 days before license expiry. Notices include: license details, renewal amount, payment options (mobile money, bank, online), deadline, and consequences of non-renewal. After expiry, send warning notices with penalty information.',
                implementationMilestones: [
                    'Verify/update business contact database',
                    'Set up SMS gateway and email system',
                    'Integrate with mobile money platforms',
                    'Configure automated reminder schedule',
                    'Test and launch with monitoring'
                ],
                administrativeEssentials: [
                    'Contact database maintenance',
                    'Reminder system monitoring',
                    'Payment reconciliation'
                ],
                whenNotApplicable: [
                    'No digital license database',
                    'Very low mobile/internet penetration'
                ],
                caseNotes: 'Automated reminders can increase on-time renewal rates by 20-30%. SMS is particularly effective.',
                resources: []
            }
        },
        {
            solutionId: 'BL-COM-02',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Enforcement: Implement visible compliance checks and graduated penalties',
            shortTitle: 'Compliance Enforcement',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Unlicensed businesses operate openly; no deterrent for non-compliance.',
                whatYouDo: 'Conduct regular compliance inspections; require visible license display; apply graduated penalties.',
                whenThisFitsBest: 'Enforcement capacity exists; legal framework supports penalties.',
                minimumEnablers: 'Inspection teams; penalty authority; tracking system; publicity.'
            },
            fullDetails: {
                legalEssentials: [
                    'Inspection authority',
                    'Display requirements',
                    'Penalty schedule in law/bylaw',
                    'Business closure authority for repeat offenders'
                ],
                howItWorks: 'Require all licensed businesses to display license prominently. Inspectors conduct regular sweeps checking for: valid license displayed, license matches business activity, license is current. Non-compliance triggers graduated response: warning, fine, increased fine, closure order.',
                implementationMilestones: [
                    'Establish/update display requirements',
                    'Train inspection teams',
                    'Develop inspection protocols and tracking',
                    'Launch compliance campaign with publicity',
                    'Apply enforcement consistently'
                ],
                administrativeEssentials: [
                    'Inspection scheduling and coverage',
                    'Violation tracking',
                    'Penalty collection',
                    'Appeals handling'
                ],
                whenNotApplicable: [
                    'No enforcement capacity',
                    'Legal framework inadequate'
                ],
                caseNotes: 'Visible enforcement creates deterrent effect. Consistency is more important than severity.',
                resources: []
            }
        },
        {
            solutionId: 'BL-COM-03',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Compliance',
            title: 'Simplification: Streamline renewal process to reduce compliance burden',
            shortTitle: 'Simplified Renewal',
            timeline: '<1 year',
            category: 'Simplification',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Complex renewal requirements create barriers; businesses give up on compliance.',
                whatYouDo: 'Simplify renewal requirements; enable online renewal; reduce documentation; accept self-declarations.',
                whenThisFitsBest: 'Current process is burdensome; digital infrastructure available.',
                minimumEnablers: 'Process authority; online platform; risk-based approach.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to accept self-declarations',
                    'Simplified documentation rules',
                    'Risk-based verification authority'
                ],
                howItWorks: 'For renewals (not new applications), simplify: accept self-declaration that business continues same activity, require only proof of payment and basic form, enable online submission, issue renewed license immediately upon payment. Conduct risk-based verification on sample.',
                implementationMilestones: [
                    'Review current renewal requirements',
                    'Identify simplification opportunities',
                    'Develop simplified forms and process',
                    'Build online renewal capability',
                    'Launch with publicity'
                ],
                administrativeEssentials: [
                    'Online platform management',
                    'Risk-based verification',
                    'Exception handling'
                ],
                whenNotApplicable: [
                    'Business type requires annual inspection',
                    'High-risk activities requiring verification'
                ],
                caseNotes: 'Simpler renewal encourages compliance. Risk-based approach focuses resources on high-risk cases.',
                resources: []
            }
        },
        // Coverage Solutions (3)
        {
            solutionId: 'BL-COV-01',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Registration: Launch one-stop business registration portal',
            shortTitle: 'One-Stop Registration',
            timeline: '1-3 years',
            category: 'Registration',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Businesses must visit multiple offices; informal sector avoids registration.',
                whatYouDo: 'Create unified registration portal; integrate with national business registry; enable online applications.',
                whenThisFitsBest: 'Digital infrastructure available; inter-agency cooperation possible.',
                minimumEnablers: 'Web platform; agency integration; unique business identifiers; workflow system.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority for unified registration',
                    'Data sharing with national registry',
                    'Business ID assignment rules'
                ],
                howItWorks: 'Create single portal where businesses can: register for local license, link to national business registration, pay fees, receive license. Portal connects to relevant departments for approvals. Reduces multiple visits to different offices.',
                implementationMilestones: [
                    'Map current registration processes',
                    'Design unified process and portal',
                    'Negotiate agency integration',
                    'Build and test portal',
                    'Launch with support services'
                ],
                administrativeEssentials: [
                    'Portal maintenance',
                    'Inter-agency coordination',
                    'Support for applicants'
                ],
                whenNotApplicable: [
                    'No digital infrastructure',
                    'Agency cooperation not possible'
                ],
                caseNotes: 'One-stop registration dramatically reduces compliance costs and brings informal businesses into the system.',
                resources: []
            }
        },
        {
            solutionId: 'BL-COV-02',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Field canvass: Conduct market-by-market business enumeration',
            shortTitle: 'Market Enumeration',
            timeline: '<1 year',
            category: 'Field',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Many informal businesses operate without licenses; no systematic identification.',
                whatYouDo: 'Send teams to markets and commercial areas; enumerate all businesses; facilitate on-site registration.',
                whenThisFitsBest: 'Large informal sector; field capacity available.',
                minimumEnablers: 'Field teams; mobile registration tools; market access; follow-up process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Enumeration authority',
                    'On-site registration authority',
                    'Simplified registration for informal sector'
                ],
                howItWorks: 'Teams systematically visit markets and commercial areas. For each business: record location, type, owner details; check license status; offer on-site registration with simplified process. Follow up on businesses that refuse. Build complete database of commercial activity.',
                implementationMilestones: [
                    'Plan enumeration coverage and schedule',
                    'Develop tools and simplified registration forms',
                    'Train teams on enumeration and registration',
                    'Execute market-by-market enumeration',
                    'Process registrations and update database'
                ],
                administrativeEssentials: [
                    'Field team coordination',
                    'Data processing',
                    'Registration completion'
                ],
                whenNotApplicable: [
                    'No field capacity',
                    'Security concerns in markets'
                ],
                caseNotes: 'Field enumeration is labor-intensive but effective for informal sector. Combine with simplified registration to maximize uptake.',
                resources: []
            }
        },
        {
            solutionId: 'BL-COV-03',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Coverage',
            title: 'Cross-matching: Link with utility connections and property data',
            shortTitle: 'Data Cross-Matching',
            timeline: '<1 year',
            category: 'Data',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'Businesses have utility connections but no license; data silos hide non-compliance.',
                whatYouDo: 'Cross-match business licenses against: commercial utility accounts, commercial property taxpayers, supplier databases.',
                whenThisFitsBest: 'Other databases accessible; matching capability exists.',
                minimumEnablers: 'Data sharing agreements; matching tools; follow-up workflow.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data sharing authority',
                    'Privacy protections',
                    'Follow-up procedures'
                ],
                howItWorks: 'Obtain data from: commercial electricity accounts, commercial property tax records, VAT registrations, bank business accounts. Match against license database. Investigate mismatches - businesses in other systems but not licensed. Follow up with registration requirement.',
                implementationMilestones: [
                    'Identify data sources',
                    'Negotiate data sharing agreements',
                    'Develop matching methodology',
                    'Conduct initial cross-match',
                    'Follow up on identified businesses'
                ],
                administrativeEssentials: [
                    'Data management',
                    'Matching analysis',
                    'Follow-up investigation'
                ],
                whenNotApplicable: [
                    'No accessible data sources',
                    'Data quality too poor'
                ],
                caseNotes: 'Cross-matching is cost-effective way to find unregistered businesses. Start with highest-quality data sources.',
                resources: []
            }
        },
        // Liability Solutions (3)
        {
            solutionId: 'BL-LIA-01',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Rate reform: Update fee schedules based on business activity and revenue',
            shortTitle: 'Fee Schedule Reform',
            timeline: '1-3 years',
            category: 'Policy',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Outdated flat fees ignore business capacity; revenue potential unrealized.',
                whatYouDo: 'Develop graduated fee structure based on business type, size, or turnover; update annually.',
                whenThisFitsBest: 'Legal authority for fee reform; business classification system exists.',
                minimumEnablers: 'Fee-setting authority; business data; rate design methodology; legal framework.'
            },
            fullDetails: {
                legalEssentials: [
                    'Fee-setting authority',
                    'Classification criteria',
                    'Annual update procedures',
                    'Appeal rights'
                ],
                howItWorks: 'Design fee structure based on: business type/activity (higher fees for higher-impact activities), size indicator (employees, floor space, turnover), location (premium for central business district). Publish fee schedule annually. Apply consistently.',
                implementationMilestones: [
                    'Review current fee structure',
                    'Analyze business population and capacity',
                    'Design graduated fee schedule',
                    'Obtain legal/political approval',
                    'Implement with communication campaign'
                ],
                administrativeEssentials: [
                    'Business classification',
                    'Size verification',
                    'Annual fee update process'
                ],
                whenNotApplicable: [
                    'Legal authority lacking',
                    'Business data insufficient',
                    'Political constraint on fee increases'
                ],
                caseNotes: 'Graduated fees are fairer and raise more revenue. Key is getting classification and verification right.',
                resources: []
            }
        },
        {
            solutionId: 'BL-LIA-02',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Classification: Improve business categorization to ensure appropriate fees',
            shortTitle: 'Business Classification',
            timeline: '<1 year',
            category: 'Classification',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Businesses misclassified into wrong fee categories; revenue leakage.',
                whatYouDo: 'Review classifications; train inspectors; conduct re-classification exercise; implement verification.',
                whenThisFitsBest: 'Multi-tier fee structure exists; misclassification is common.',
                minimumEnablers: 'Classification criteria; inspection capacity; data correction process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Classification criteria authority',
                    'Reclassification procedures',
                    'Appeal rights'
                ],
                howItWorks: 'Review existing business classifications against actual activities and size. Develop clear classification criteria with examples. Train inspectors on proper classification. Conduct reclassification exercise for suspicious cases. Update fees accordingly.',
                implementationMilestones: [
                    'Analyze current classification accuracy',
                    'Develop clear classification guidelines',
                    'Train staff on classification',
                    'Review and reclassify businesses',
                    'Update billing accordingly'
                ],
                administrativeEssentials: [
                    'Classification guidelines',
                    'Inspector training',
                    'Quality review process'
                ],
                whenNotApplicable: [
                    'Flat fee structure with no categories',
                    'No inspection capacity'
                ],
                caseNotes: 'Proper classification ensures businesses pay appropriate fees. Even small improvements can increase revenue significantly.',
                resources: []
            }
        },
        {
            solutionId: 'BL-LIA-03',
            stream: 'Business License',
            streamType: 'non-property',
            gap: 'Liability',
            title: 'Self-assessment: Introduce turnover-based self-declaration with audit',
            shortTitle: 'Turnover Self-Assessment',
            timeline: '1-3 years',
            category: 'Assessment',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Difficult to verify business revenue; manual assessment is costly.',
                whatYouDo: 'Allow businesses to self-declare turnover; apply rate to declared amount; conduct risk-based audits.',
                whenThisFitsBest: 'Larger businesses have records; audit capacity exists.',
                minimumEnablers: 'Legal framework; declaration system; audit capacity; penalty for false declaration.'
            },
            fullDetails: {
                legalEssentials: [
                    'Self-assessment authority',
                    'Declaration requirements',
                    'Audit authority',
                    'Penalties for false declaration'
                ],
                howItWorks: 'Businesses declare annual turnover (or appropriate proxy). Fee is calculated as: Declared turnover × rate (e.g., 0.1%). Revenue department conducts risk-based audits: select sample, cross-check with tax authority, verify records. False declarations result in penalties plus back-fees.',
                implementationMilestones: [
                    'Design self-assessment framework',
                    'Establish declaration requirements',
                    'Build audit capacity and methodology',
                    'Implement with pilot group',
                    'Roll out with compliance support'
                ],
                administrativeEssentials: [
                    'Declaration processing',
                    'Risk-based audit selection',
                    'Audit execution',
                    'Penalty enforcement'
                ],
                whenNotApplicable: [
                    'Most businesses have no records',
                    'No audit capacity',
                    'Legal framework inadequate'
                ],
                caseNotes: 'Self-assessment works for larger businesses with records. Risk-based audit provides deterrent without auditing everyone.',
                resources: []
            }
        }
    ];

})(window);
