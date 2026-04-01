/**
 * Property Tax - Compliance Solutions (27)
 * Full details for all compliance gap solutions
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTCompliance = [
        {
            solutionId: 'PT-COM-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Billing: Automate plain-language bills with itemized calculations and unique payment reference',
            shortTitle: 'Clear and Accurate Bills',
            timeline: '1-3 years',
            category: 'Billing',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'In many cities, property tax bills are confusing and vague; taxpayers cannot verify assessments or see how to pay. This causes mistrust, disputes and late payments. Clear, easy-to-understand bills with itemised charges and unique payment references help taxpayers understand their obligations and reduce questions and delays.',
                whatYouDo: 'Modernise the billing system to generate accurate bills that show property value, rate, calculation, and any relief; assign a unique identifier for each bill; translate templates into local languages; and send bills in multiple formats—paper, email, SMS link or portal.',
                whenThisFitsBest: 'Property and valuation records are digitised or can be digitised; the city can work with a print or e-billing provider; there is a desire to improve transparency and trust.',
                minimumEnablers: 'Legal authority to issue electronic bills; reliable valuation and property register; ability to generate unique payment references; capacity to design and translate plain-language templates.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to issue electronic notices and recognise them as legally valid',
                    'Bylaw requiring a standard bill format and plain-language descriptions',
                    'Data-protection provisions for maintaining the property register and generating bills'
                ],
                howItWorks: 'Deploy or upgrade a billing system (software or spreadsheet) that automatically computes taxes from property attributes (value, rate, exemptions). The system pulls data from the property register to fill in each taxpayer\'s bill. Each bill should visually display the calculation – for example: "Land value (Ksh 500,000) × 1% rate = Ksh 5,000; hardship exemption (–Ksh 1,000) = Ksh 4,000 due." Use bold fonts or tables to make this easy to read. Embed a QR code or USSD code that, when scanned, opens the payment portal with the bill reference prefilled. Include deterrent language such as: "Note: Late payments incur a 10% penalty and 1% interest per month (bylaw §X). See enforcement schedule below."',
                implementationMilestones: [
                    'Digitise the register and assign unique IDs to each property; compile ownership and valuation data',
                    'Select and configure billing software to calculate taxes and generate standard notices',
                    'Draft plain-language templates explaining the calculation (value × rate − exemptions) and due date',
                    'Test and pilot the new bills in one ward; refine based on feedback',
                    'Roll out citywide, offering both digital and paper delivery and publicising the changes'
                ],
                administrativeEssentials: [
                    'Cross-department data cleaning and collaboration between valuation, IT and revenue units',
                    'Staff training on the new system and plain-language communication',
                    'Customer support (phone/email) for questions about the bill'
                ],
                whenNotApplicable: [
                    'There is no reliable property register or valuation base to build on',
                    'Digital infrastructure is extremely weak, preventing automated bill generation',
                    'Strong cultural resistance to electronic notices (consider phased introduction)',
                    'Very small municipalities with few properties can manage manual billing'
                ],
                caseNotes: 'In Garowe, Somalia, introducing an Integrated Financial Management Information System (IFMIS) to automate billing was transformative. After deploying IFMIS (replacing manual ledgers), the city\'s property tax revenue jumped 290% in five years. Tax invoices were sent electronically and paid via mobile codes, with real-time text confirmations to taxpayers.',
                resources: [
                    { title: 'IGC Property Tax Toolkit - Billing', url: 'https://www.theigc.org/collections/property-tax-diagnostic-toolkit' }
                ]
            }
        },
        {
            solutionId: 'PT-COM-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Delivery: Combine SMS/email/WhatsApp/portal with door-to-door delivery',
            shortTitle: 'Multi-Channel Bill Delivery',
            timeline: '<1 year',
            category: 'Delivery',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Physical bill delivery is slow, expensive, and unreliable. Many taxpayers never receive their bills, creating a convenient excuse for non-payment.',
                whatYouDo: 'Implement multi-channel bill delivery: SMS notifications with payment links, email with PDF attachments, WhatsApp messages, online portal access, while maintaining door-to-door delivery as backup for those without digital access.',
                whenThisFitsBest: 'Mobile phone penetration is high; contact information is available in property records; there is basic IT infrastructure.',
                minimumEnablers: 'Database of taxpayer contact details; SMS gateway or messaging platform; basic online portal; integration with billing system.'
            },
            fullDetails: {
                legalEssentials: [
                    'Legal recognition of electronic delivery as valid notice',
                    'Data protection compliance for storing and using contact details',
                    'Clear rules on when delivery is considered complete'
                ],
                howItWorks: 'Set up an integrated communication system that sends bills through multiple channels simultaneously. SMS messages contain a short link to view the full bill; emails include a PDF attachment; WhatsApp messages provide interactive options. The system tracks delivery status for each channel and escalates to physical delivery if digital channels fail.',
                implementationMilestones: [
                    'Collect and verify taxpayer contact information during registration or payment',
                    'Set up SMS gateway, email server, and WhatsApp Business API',
                    'Create message templates with unique payment references and links',
                    'Integrate with billing system for automated dispatch',
                    'Monitor delivery rates and adjust channel mix based on success rates'
                ],
                administrativeEssentials: [
                    'Dedicated staff to manage communication platforms',
                    'Process for updating contact details',
                    'Escalation workflow for failed deliveries'
                ],
                whenNotApplicable: [
                    'Very low mobile penetration or internet connectivity',
                    'No reliable contact database exists',
                    'Cultural preference for paper bills is very strong'
                ],
                caseNotes: 'Cities that have implemented multi-channel delivery typically see 20-30% improvement in on-time payment rates due to increased awareness and convenience.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Reminders: Send timed series of friendly-to-firm due-date reminders',
            shortTitle: 'Payment Reminder Sequence',
            timeline: '<1 year',
            category: 'Reminders',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers forget due dates or procrastinate. A single bill without follow-up yields low compliance.',
                whatYouDo: 'Design a reminder sequence: friendly reminder 30 days before due date, firm reminder at due date, warning of penalties after due date.',
                whenThisFitsBest: 'Billing system can schedule automated messages; taxpayer contact details are available.',
                minimumEnablers: 'Automated messaging capability; clear penalty schedule to communicate.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to send reminders via electronic channels',
                    'Clear penalty structure that can be communicated'
                ],
                howItWorks: 'Implement a scheduled reminder system with escalating tone: Day -30 (friendly reminder of upcoming due date), Day 0 (due date reminder with payment link), Day +7 (warning of imminent penalty), Day +30 (final warning before enforcement). Each message should be personalized with the taxpayer\'s name and amount due.',
                implementationMilestones: [
                    'Define reminder schedule and message content for each stage',
                    'Configure automated scheduling in billing/communication system',
                    'Test message delivery and timing accuracy',
                    'Launch with monitoring of response rates',
                    'Refine messaging based on payment behavior data'
                ],
                administrativeEssentials: [
                    'Message template approval process',
                    'Staff to handle inquiries generated by reminders',
                    'Analytics to track reminder effectiveness'
                ],
                whenNotApplicable: [
                    'No automated messaging capability',
                    'Contact database is very incomplete'
                ],
                caseNotes: 'Behavioral research shows that well-timed reminders can increase compliance by 10-15%. The key is consistency and escalating urgency.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Tracing: Stand up an undelivered-bill workflow',
            shortTitle: 'Undelivered Bill Tracing',
            timeline: '<1 year',
            category: 'Tracing',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Returned or undelivered bills create a backlog of unpaid accounts with no follow-up.',
                whatYouDo: 'Create a dedicated workflow to trace undelivered bills: investigate addresses, update records, attempt re-delivery, escalate to field teams.',
                whenThisFitsBest: 'High volume of returned mail; field staff available for follow-up.',
                minimumEnablers: 'Tracking system for bill delivery status; field team capacity.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority for field teams to visit properties',
                    'Data protection when investigating addresses'
                ],
                howItWorks: 'Create a queue of undelivered bills. For each: (1) Verify address in database, (2) Cross-check with other records (utilities, permits), (3) Attempt alternative contact methods, (4) If still unresolved, assign to field team for physical visit. Field teams confirm occupancy, update contact details, and deliver bill in person.',
                implementationMilestones: [
                    'Create tracking system for delivery status',
                    'Define workflow steps and responsibilities',
                    'Train field teams on tracing procedures',
                    'Establish performance targets for resolution',
                    'Regular reporting on undelivered bill rates'
                ],
                administrativeEssentials: [
                    'Dedicated staff or team for tracing',
                    'Field visit protocols and safety measures',
                    'Integration with property register for updates'
                ],
                whenNotApplicable: [
                    'Very low undelivered rate',
                    'No field capacity available'
                ],
                caseNotes: 'Systematic tracing can recover 30-50% of previously undeliverable accounts.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Payments: Offer easy ways to pay - mobile money, banks/agents, ward counters',
            shortTitle: 'Diverse Payment Channels',
            timeline: '<1 year',
            category: 'Payments',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'Limited payment channels force taxpayers to travel, queue, and lose productive time. This discourages payment.',
                whatYouDo: 'Partner with mobile money providers, banks, and payment agents; open ward-level collection points; enable online payments.',
                whenThisFitsBest: 'Mobile money ecosystem exists; banking infrastructure is accessible.',
                minimumEnablers: 'Integration with payment service providers; reconciliation system; receipting capability at all channels.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to receive payments through third-party agents',
                    'Legal status of electronic receipts',
                    'Framework for revenue sharing with payment providers'
                ],
                howItWorks: 'Integrate with major payment platforms (M-Pesa, bank transfers, card payments). Each bill includes a unique payment reference that works across all channels. Payments are reconciled daily and automatically credited to taxpayer accounts. Ward offices provide in-person payment for those without digital access.',
                implementationMilestones: [
                    'Identify and contract with payment service providers',
                    'Develop API integration for payment posting',
                    'Implement unique payment reference system',
                    'Test reconciliation across all channels',
                    'Train staff and publicize new payment options'
                ],
                administrativeEssentials: [
                    'Daily reconciliation process',
                    'Dispute resolution for payment issues',
                    'Staff training on new payment systems'
                ],
                whenNotApplicable: [
                    'No mobile money or banking infrastructure',
                    'Integration costs exceed potential benefits'
                ],
                caseNotes: 'Cities that expand payment channels typically see 15-25% increase in collection rates due to convenience.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Flexibility: Let eligible taxpayers clear bills in instalments',
            shortTitle: 'Instalment Payment Plans',
            timeline: '<1 year',
            category: 'Flexibility',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'Large lump-sum bills are unaffordable for some taxpayers, leading to non-payment.',
                whatYouDo: 'Offer structured instalment plans: quarterly, monthly, or customized schedules for qualifying taxpayers.',
                whenThisFitsBest: 'Billing system can track partial payments; clear eligibility criteria can be defined.',
                minimumEnablers: 'Legal authority to offer instalments; payment tracking system; default management process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to offer payment plans',
                    'Rules for interest/fees on instalments',
                    'Consequences for defaulting on instalment agreements'
                ],
                howItWorks: 'Taxpayers who meet eligibility criteria (e.g., residential property, no prior defaults) can request to pay in 2-4 instalments. The system generates a payment schedule with specific due dates. Reminders are sent before each instalment. If an instalment is missed, the full balance becomes due immediately.',
                implementationMilestones: [
                    'Define eligibility criteria and instalment options',
                    'Configure billing system to manage instalment schedules',
                    'Create application process for payment plans',
                    'Train staff on plan administration',
                    'Monitor default rates and adjust criteria'
                ],
                administrativeEssentials: [
                    'Application review process',
                    'Instalment tracking and reminders',
                    'Default follow-up procedures'
                ],
                whenNotApplicable: [
                    'Average bill amounts are already low',
                    'No system capability for partial payment tracking'
                ],
                caseNotes: 'Instalment plans can recover 40-60% of amounts that would otherwise go unpaid due to affordability issues.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Incentives: Offer small, time-boxed early-payment discount',
            shortTitle: 'Early Payment Discount',
            timeline: '<1 year',
            category: 'Incentives',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Without incentives, taxpayers delay payment until enforcement begins.',
                whatYouDo: 'Offer 2-5% discount for payment within first 30-60 days of billing; publicize the discount widely.',
                whenThisFitsBest: 'Compliance rates are moderate; early cash flow is valuable; discount can be absorbed.',
                minimumEnablers: 'Legal authority to offer discounts; billing system can apply discounts automatically.'
            },
            fullDetails: {
                legalEssentials: [
                    'Legal authority to offer early payment discounts',
                    'Clear rules on discount calculation and eligibility'
                ],
                howItWorks: 'Bills are issued with two amounts: the full amount and the discounted amount if paid by the early deadline. The discount is automatically applied if payment is received within the discount period. Heavily publicize the discount opportunity to maximize participation.',
                implementationMilestones: [
                    'Determine optimal discount rate and timeline',
                    'Obtain legal/political approval',
                    'Configure billing system for dual-amount display',
                    'Launch publicity campaign',
                    'Monitor uptake and revenue impact'
                ],
                administrativeEssentials: [
                    'Clear communication of discount terms',
                    'System to track discount eligibility',
                    'Analysis of discount program ROI'
                ],
                whenNotApplicable: [
                    'Compliance rates are already high',
                    'Cash flow timing is not a priority',
                    'Legal constraints prevent discounts'
                ],
                caseNotes: 'Well-designed early payment discounts typically achieve 15-20% participation and improve overall collections by accelerating cash flow.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-08',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Receipting: Guarantee official receipt for every payment',
            shortTitle: 'Official Payment Receipts',
            timeline: '<1 year',
            category: 'Receipting',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers worry about payments not being credited. Lack of receipts enables corruption.',
                whatYouDo: 'Ensure every payment generates an official, tamper-proof receipt with unique number; enable receipt verification.',
                whenThisFitsBest: 'Multiple payment channels exist; central payment recording system is in place.',
                minimumEnablers: 'Real-time payment recording; secure receipt numbering; verification capability.'
            },
            fullDetails: {
                legalEssentials: [
                    'Receipt format requirements',
                    'Electronic receipt validity',
                    'Audit trail requirements'
                ],
                howItWorks: 'Every payment, regardless of channel, generates an official receipt with: unique receipt number, taxpayer details, payment amount, date/time, and property reference. For electronic payments, receipts are sent via SMS/email immediately. Receipt numbers can be verified online or via USSD.',
                implementationMilestones: [
                    'Design secure receipt format with unique numbering',
                    'Implement receipt generation across all channels',
                    'Create verification system (online/USSD)',
                    'Train all collection points on receipting',
                    'Regular audits of receipt sequences'
                ],
                administrativeEssentials: [
                    'Secure receipt number allocation',
                    'Cross-channel receipt reconciliation',
                    'Fraud detection for duplicate receipts'
                ],
                whenNotApplicable: [
                    'Very informal collection with no tracking'
                ],
                caseNotes: 'Proper receipting is fundamental to accountability and taxpayer trust. It also enables accurate revenue reporting and reduces leakage.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-09',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Cash Controls: Tighten cash handling (two-person counts, daily banking)',
            shortTitle: 'Cash Handling Controls',
            timeline: '<1 year',
            category: 'Cash Controls',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Cash collections are vulnerable to theft and leakage. Poor controls erode revenue.',
                whatYouDo: 'Implement dual-control cash handling, same-day banking, secure transport, regular reconciliation, surprise audits.',
                whenThisFitsBest: 'Significant cash collections occur; current controls are weak.',
                minimumEnablers: 'Clear cash handling procedures; banking arrangements; audit capacity.'
            },
            fullDetails: {
                legalEssentials: [
                    'Internal control requirements',
                    'Handling of discrepancies',
                    'Consequences for violations'
                ],
                howItWorks: 'All cash is counted by two people, sealed in tamper-evident bags, and deposited same-day. Collection points have secure safes and documented handover procedures. Daily reconciliation compares receipts issued to cash collected. Surprise audits verify procedures are followed.',
                implementationMilestones: [
                    'Assess current cash handling vulnerabilities',
                    'Draft and approve cash handling procedures',
                    'Procure safes, bags, and transport arrangements',
                    'Train all staff handling cash',
                    'Implement daily reconciliation and surprise audits'
                ],
                administrativeEssentials: [
                    'Documented procedures and checklists',
                    'Dual-control staffing at collection points',
                    'Internal audit capacity'
                ],
                whenNotApplicable: [
                    'All collections are electronic',
                    'Cash handling is outsourced to banks'
                ],
                caseNotes: 'Strong cash controls can reduce leakage by 5-15% of cash collections.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-10',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Tracking: Run simple collections dashboard',
            shortTitle: 'Collections Dashboard',
            timeline: '<1 year',
            category: 'Tracking',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisSolves: 'Without real-time visibility, managers cannot identify problems or direct resources effectively.',
                whatYouDo: 'Create a dashboard showing: daily/weekly/monthly collections, ward-by-ward performance, arrears aging, collector productivity.',
                whenThisFitsBest: 'Payment data is captured electronically; management wants to use data.',
                minimumEnablers: 'Central payment database; basic reporting tools; defined KPIs.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data access permissions for dashboard users',
                    'Confidentiality of individual taxpayer data'
                ],
                howItWorks: 'Build a dashboard (Excel, Power BI, or custom) that refreshes daily with: total collections vs. target, collections by ward/zone, top collectors, aging of arrears, trend analysis. Managers use this for weekly reviews and resource allocation.',
                implementationMilestones: [
                    'Define key performance indicators',
                    'Set up data feeds from payment systems',
                    'Build dashboard with required visualizations',
                    'Train managers on dashboard use',
                    'Establish weekly review meetings using dashboard'
                ],
                administrativeEssentials: [
                    'Data quality assurance',
                    'Dashboard maintenance and updates',
                    'Regular review cadence'
                ],
                whenNotApplicable: [
                    'Collections not recorded electronically',
                    'Very small operation where dashboard adds no value'
                ],
                caseNotes: 'Data-driven management typically improves collection efficiency by 10-20%.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-11',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Notices: Use clear ladder of overdue notices',
            shortTitle: 'Graduated Notice Ladder',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisSolves: 'Defaulters face no consequences until arbitrary, harsh action. This is unfair and ineffective.',
                whatYouDo: 'Implement graduated notice sequence: friendly reminder, formal demand, final warning, enforcement notice with specific deadline and consequences.',
                whenThisFitsBest: 'Legal framework supports enforcement; notice templates exist or can be created.',
                minimumEnablers: 'Standard notice templates; delivery mechanism; tracking of notice status.'
            },
            fullDetails: {
                legalEssentials: [
                    'Legal requirements for notice content and delivery',
                    'Minimum waiting periods between notices',
                    'Required language for enforcement warnings'
                ],
                howItWorks: 'After the due date: Day +15 (first reminder - polite), Day +30 (second notice - formal demand), Day +60 (final warning - specific enforcement actions listed), Day +90 (enforcement notice - action will begin in 7 days). Each notice escalates in tone and specificity.',
                implementationMilestones: [
                    'Review legal requirements for notices',
                    'Draft notice templates for each stage',
                    'Configure automated notice scheduling',
                    'Train staff on notice procedures',
                    'Monitor notice effectiveness'
                ],
                administrativeEssentials: [
                    'Notice tracking system',
                    'Proof of delivery records',
                    'Escalation protocols'
                ],
                whenNotApplicable: [
                    'No legal authority for enforcement',
                    'No delivery capability'
                ],
                caseNotes: 'A clear, predictable enforcement ladder is more effective than random harsh actions. It gives taxpayers chances to comply while building legitimacy.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-12',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Penalties: Apply fair late-payment penalties consistently',
            shortTitle: 'Consistent Penalty Application',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 12,
            isActive: true,
            overview: {
                whatThisSolves: 'Inconsistent penalties create unfairness and reduce deterrent effect.',
                whatYouDo: 'Define clear penalty rates in regulations; apply automatically and consistently; ensure penalties are proportionate and publicized.',
                whenThisFitsBest: 'Legal authority for penalties exists; billing system can calculate automatically.',
                minimumEnablers: 'Clear penalty regulations; automated calculation; consistent application.'
            },
            fullDetails: {
                legalEssentials: [
                    'Penalty rates defined in law/bylaw',
                    'Caps on total penalties',
                    'Waiver authority and criteria'
                ],
                howItWorks: 'Penalties are defined clearly (e.g., 5% of outstanding amount plus 1% per month interest). The billing system automatically calculates and adds penalties on the day after due date. Penalties appear on subsequent statements with clear explanation.',
                implementationMilestones: [
                    'Review/update penalty regulations',
                    'Configure automated penalty calculation',
                    'Train staff - no manual penalty negotiation',
                    'Publicize penalty structure',
                    'Define narrow waiver criteria'
                ],
                administrativeEssentials: [
                    'Automated penalty calculation',
                    'Clear waiver approval process',
                    'Audit of penalty consistency'
                ],
                whenNotApplicable: [
                    'No legal authority for penalties',
                    'Penalties would cause severe hardship'
                ],
                caseNotes: 'The deterrent effect comes from consistency. If taxpayers believe penalties may be waived, the incentive to pay on time disappears.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-13',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Tax Clearance: Require certificate for property transfers',
            shortTitle: 'Tax Clearance for Transfers',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 13,
            isActive: true,
            overview: {
                whatThisSolves: 'Properties change hands while taxes remain unpaid; new owners inherit arrears or taxes are never collected.',
                whatYouDo: 'Require tax clearance certificate before property transfers are registered; integrate with land registry.',
                whenThisFitsBest: 'Land registry exists and functions; legal authority to require clearance.',
                minimumEnablers: 'Legal requirement for clearance; certificate issuance system; land registry integration.'
            },
            fullDetails: {
                legalEssentials: [
                    'Law requiring tax clearance for transfers',
                    'Definition of clearance requirements',
                    'Procedure for disputed cases'
                ],
                howItWorks: 'Before any property sale or transfer can be registered, the seller must obtain a tax clearance certificate showing all property taxes are paid. The certificate is valid for a limited period (e.g., 30 days). The land registry checks for valid clearance before processing transfers.',
                implementationMilestones: [
                    'Pass necessary legal amendments',
                    'Create clearance certificate system',
                    'Establish integration with land registry',
                    'Train land registry staff',
                    'Publicize new requirement'
                ],
                administrativeEssentials: [
                    'Quick turnaround for clearance issuance',
                    'Dispute resolution process',
                    'Integration with land registry systems'
                ],
                whenNotApplicable: [
                    'No functioning land registry',
                    'Informal transfers predominate',
                    'Legal change is not feasible'
                ],
                caseNotes: 'This is one of the most effective enforcement tools. It creates a natural trigger point and strong incentive to clear arrears before selling.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-14',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Tenant Pay-Over: Redirect rent for large arrears',
            shortTitle: 'Tenant Rent Redirection',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 14,
            isActive: true,
            overview: {
                whatThisSolves: 'Landlords with rental income ignore tax bills; tenants have no leverage.',
                whatYouDo: 'Enable legal mechanism for tenants to pay rent directly to tax authority to clear landlord arrears.',
                whenThisFitsBest: 'Legal framework exists or can be created; significant rental market.',
                minimumEnablers: 'Legal authority for rent redirection; tenant notification process; payment application rules.'
            },
            fullDetails: {
                legalEssentials: [
                    'Law enabling rent redirection',
                    'Tenant protection provisions',
                    'Process for landlord notification'
                ],
                howItWorks: 'After appropriate notices, the city issues a Tenant Pay-Over Notice requiring the tenant to pay rent directly to the city instead of the landlord until arrears are cleared. The tenant is protected from landlord retaliation. Payments are applied first to oldest arrears.',
                implementationMilestones: [
                    'Enact enabling legislation',
                    'Define criteria (minimum arrears amount, notice requirements)',
                    'Create tenant notification process',
                    'Set up payment receipt and application',
                    'Publicize as enforcement tool'
                ],
                administrativeEssentials: [
                    'Identification of rental properties',
                    'Tenant communication and protection',
                    'Payment tracking and application'
                ],
                whenNotApplicable: [
                    'Legal framework does not permit',
                    'Owner-occupied properties predominate',
                    'Tenant identification is difficult'
                ],
                caseNotes: 'Tenant pay-over is particularly effective for commercial properties with identifiable tenants and regular rent payments.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-15',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Withhold Services: Pause non-essential services until paid',
            shortTitle: 'Service Withholding',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 15,
            isActive: true,
            overview: {
                whatThisSolves: 'Defaulters continue to receive city services with no consequence.',
                whatYouDo: 'Link tax compliance to service delivery: withhold permits, licenses, approvals until taxes are current.',
                whenThisFitsBest: 'City controls valuable services; integration between systems is possible.',
                minimumEnablers: 'Legal authority; system integration; clear policy on which services.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to link tax status to service delivery',
                    'Definition of which services can be withheld',
                    'Appeal rights for affected taxpayers'
                ],
                howItWorks: 'Before issuing building permits, business licenses, or other city services, check tax compliance status. If taxes are in arrears beyond a threshold, service is denied until cleared. Essential services (water, sanitation) should not be withheld.',
                implementationMilestones: [
                    'Identify services that can be linked',
                    'Pass necessary policy/legal changes',
                    'Integrate tax system with service systems',
                    'Train frontline staff on verification',
                    'Publicize the policy'
                ],
                administrativeEssentials: [
                    'Real-time tax status checks',
                    'Clear service-by-service policy',
                    'Fast payment and clearance process'
                ],
                whenNotApplicable: [
                    'City does not control valuable services',
                    'Integration is technically impossible',
                    'Political will is lacking'
                ],
                caseNotes: 'This creates strong incentive for compliance without requiring direct enforcement action.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-16',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Liens: Record property-tax lien/encumbrance',
            shortTitle: 'Property Tax Liens',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 16,
            isActive: true,
            overview: {
                whatThisSolves: 'Tax debts have no security; owners can sell or mortgage without paying.',
                whatYouDo: 'Register tax liens on property titles; lien must be cleared before property can be transferred.',
                whenThisFitsBest: 'Land registry exists; legal framework for liens.',
                minimumEnablers: 'Legal authority to register liens; land registry integration; clearance process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Statutory lien authority',
                    'Priority of tax lien vs other encumbrances',
                    'Procedure for lien registration and release'
                ],
                howItWorks: 'After a defined arrears threshold is reached, the city registers a lien on the property title. This lien must be satisfied before the property can be sold or refinanced. Liens are released upon full payment.',
                implementationMilestones: [
                    'Ensure legal authority exists',
                    'Define criteria for lien registration',
                    'Establish process with land registry',
                    'Create lien tracking system',
                    'Implement release procedures'
                ],
                administrativeEssentials: [
                    'Integration with land registry',
                    'Lien tracking and management',
                    'Timely release upon payment'
                ],
                whenNotApplicable: [
                    'No formal land registry',
                    'Legal framework does not support',
                    'Most properties are informal'
                ],
                caseNotes: 'Liens provide security without immediate action and create strong incentive to clear arrears when selling.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-17',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Field Visits: Send trained collection teams',
            shortTitle: 'Field Collection Teams',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 17,
            isActive: true,
            overview: {
                whatThisSolves: 'Notices alone do not work on hard-to-reach or resistant defaulters.',
                whatYouDo: 'Deploy trained field collectors for high-value or chronic defaulters; equip with mobile devices for real-time updates.',
                whenThisFitsBest: 'Significant arrears exist; field staff can be trained and deployed.',
                minimumEnablers: 'Trained collection staff; mobile technology; clear protocols; safety measures.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority for field visits',
                    'Identification requirements for collectors',
                    'Conduct rules and prohibited actions'
                ],
                howItWorks: 'Assign chronic defaulters to field collectors. Collectors make personal visits with: official ID, current account statement, mobile payment capability. They negotiate payment or payment plans on site. All interactions are logged.',
                implementationMilestones: [
                    'Select and train field collection team',
                    'Develop visit protocols and scripts',
                    'Equip with mobile devices and payment capability',
                    'Assign accounts based on criteria',
                    'Track outcomes and adjust approach'
                ],
                administrativeEssentials: [
                    'Account assignment system',
                    'Performance tracking',
                    'Safety protocols',
                    'Supervision and quality control'
                ],
                whenNotApplicable: [
                    'Security concerns prevent field visits',
                    'No capacity to deploy collectors'
                ],
                caseNotes: 'Personal contact is often the most effective method for chronic defaulters. Success depends on proper training and professional conduct.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-18',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Utility Suspension: Suspend utilities for major defaulters',
            shortTitle: 'Utility Disconnection',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 18,
            isActive: true,
            overview: {
                whatThisSolves: 'Property owners ignore tax bills but value utility services.',
                whatYouDo: 'Partner with utility companies to suspend service for major tax defaulters; restore upon payment.',
                whenThisFitsBest: 'Legal authority exists; utility company cooperation; significant default amounts.',
                minimumEnablers: 'Legal framework; utility partnerships; data sharing agreements; restoration process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Legal authority to coordinate with utilities',
                    'Due process requirements before disconnection',
                    'Limitations on which utilities can be affected'
                ],
                howItWorks: 'After appropriate notices and a high arrears threshold, request utility company to suspend service. Water disconnection should generally be avoided for residential properties. Electricity disconnection for commercial properties is often effective.',
                implementationMilestones: [
                    'Establish legal authority',
                    'Negotiate agreements with utility companies',
                    'Define high threshold and due process',
                    'Create data sharing mechanism',
                    'Implement restoration process'
                ],
                administrativeEssentials: [
                    'Data sharing with utilities',
                    'Disconnection request process',
                    'Payment verification for restoration'
                ],
                whenNotApplicable: [
                    'No utility company cooperation',
                    'Legal framework prohibits',
                    'Humanitarian concerns'
                ],
                caseNotes: 'This is a powerful tool but should be used selectively for large commercial defaulters. Residential water disconnection raises humanitarian issues.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-19',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - Auction as Last Resort: Conduct tax sales',
            shortTitle: 'Tax Sale Auction',
            timeline: '1-3 years',
            category: 'Enforcement',
            sortOrder: 19,
            isActive: true,
            overview: {
                whatThisSolves: 'Without ultimate sanction, chronic defaulters have no real consequence.',
                whatYouDo: 'Establish legal process for tax sales; use sparingly for large, long-standing debts; ensure due process.',
                whenThisFitsBest: 'Legal framework exists; political will for enforcement; judicial support.',
                minimumEnablers: 'Legal authority; due process requirements; auction procedures; title transfer capability.'
            },
            fullDetails: {
                legalEssentials: [
                    'Statutory authority for tax sales',
                    'Due process requirements',
                    'Minimum notice periods',
                    'Redemption rights',
                    'Surplus distribution rules'
                ],
                howItWorks: 'After all other methods fail and arrears exceed a significant threshold (e.g., 5 years), initiate tax sale proceedings. Provide extensive notice and opportunity to pay. Conduct public auction with minimum bid covering arrears, penalties, and costs. Surplus (if any) goes to former owner.',
                implementationMilestones: [
                    'Review/establish legal framework',
                    'Define criteria (minimum arrears, time period)',
                    'Create transparent auction process',
                    'Conduct first sale with full publicity',
                    'Use deterrent effect, not routine use'
                ],
                administrativeEssentials: [
                    'Legal review for each case',
                    'Extensive documentation',
                    'Public auction procedures',
                    'Title transfer process'
                ],
                whenNotApplicable: [
                    'Legal framework does not exist',
                    'Political will is absent',
                    'Judicial system does not support'
                ],
                caseNotes: 'Tax sales should be rare but credible. One or two well-publicized sales can have significant deterrent effect.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-20',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Enforcement - One-Time Amnesty: Run short amnesty before stricter enforcement',
            shortTitle: 'One-Time Tax Amnesty',
            timeline: '<1 year',
            category: 'Enforcement',
            sortOrder: 20,
            isActive: true,
            overview: {
                whatThisSolves: 'Large arrears backlog makes enforcement difficult; some defaults were due to genuine hardship.',
                whatYouDo: 'Offer time-limited amnesty on penalties/interest; publicize that enforcement will intensify afterward; use once only.',
                whenThisFitsBest: 'Significant arrears exist; enforcement capacity is being built; one-time reset needed.',
                minimumEnablers: 'Political approval; clear terms; publicity campaign; enforcement capacity to follow.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to waive penalties/interest',
                    'Clear eligibility criteria',
                    'Time limits'
                ],
                howItWorks: 'Announce a 60-90 day period where: all penalties and interest are waived if principal is paid in full, OR a payment plan is established. After the amnesty, penalties and enforcement will be strictly applied. Publicize heavily.',
                implementationMilestones: [
                    'Design amnesty terms',
                    'Obtain political approval',
                    'Launch publicity campaign',
                    'Process applications efficiently',
                    'End amnesty and begin strict enforcement'
                ],
                administrativeEssentials: [
                    'Application processing',
                    'Payment plan monitoring',
                    'Post-amnesty enforcement'
                ],
                whenNotApplicable: [
                    'Recent amnesty was offered',
                    'Enforcement capacity does not exist',
                    'Political commitment to follow-through is weak'
                ],
                caseNotes: 'Amnesties work best as one-time events paired with credible enforcement afterward. Repeated amnesties train taxpayers to wait for the next one.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-21',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Support - Help Desk: Provide friendly help desk and hotline',
            shortTitle: 'Taxpayer Help Desk',
            timeline: '<1 year',
            category: 'Support',
            sortOrder: 21,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers with questions or problems cannot get help; frustration leads to non-compliance.',
                whatYouDo: 'Establish dedicated help desk: phone hotline, walk-in service, online chat; train staff to resolve issues.',
                whenThisFitsBest: 'Volume of inquiries is significant; staff can be trained; infrastructure exists.',
                minimumEnablers: 'Dedicated staff; phone/internet connectivity; knowledge base; escalation procedures.'
            },
            fullDetails: {
                legalEssentials: [
                    'Staff authority to access records',
                    'Confidentiality requirements',
                    'Escalation procedures'
                ],
                howItWorks: 'Create a single point of contact for all property tax inquiries. Staff are trained to: answer questions, explain bills, take payments, initiate corrections, escalate complex issues. Track all inquiries and resolution times.',
                implementationMilestones: [
                    'Identify space and staff',
                    'Create knowledge base and scripts',
                    'Set up phone and online channels',
                    'Train staff thoroughly',
                    'Monitor performance and satisfaction'
                ],
                administrativeEssentials: [
                    'Staffing and scheduling',
                    'Knowledge management',
                    'Performance metrics'
                ],
                whenNotApplicable: [
                    'Very small operation',
                    'No inquiry volume'
                ],
                caseNotes: 'Good customer service increases voluntary compliance. Problems resolved quickly don\'t become excuses for non-payment.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-22',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Support - Quick Corrections: Fix obvious billing errors fast',
            shortTitle: 'Quick Error Correction',
            timeline: '<1 year',
            category: 'Support',
            sortOrder: 22,
            isActive: true,
            overview: {
                whatThisSolves: 'Billing errors erode trust; taxpayers use errors as excuse not to pay.',
                whatYouDo: 'Empower front-line staff to correct obvious errors immediately; track error patterns to fix root causes.',
                whenThisFitsBest: 'Error rate is noticeable; staff have access to records.',
                minimumEnablers: 'Error correction authority; record access; audit trail; root cause analysis.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to make corrections',
                    'Documentation requirements',
                    'Approval thresholds'
                ],
                howItWorks: 'Define categories of errors that can be corrected immediately (name spelling, address, calculation errors). Front-line staff can fix these on the spot with proper documentation. Larger corrections require supervisor approval. Track all corrections to identify systemic issues.',
                implementationMilestones: [
                    'Define correction categories and thresholds',
                    'Train staff on correction authority',
                    'Implement correction tracking',
                    'Analyze patterns monthly',
                    'Fix root causes identified'
                ],
                administrativeEssentials: [
                    'Correction authority delegation',
                    'Audit trail',
                    'Pattern analysis'
                ],
                whenNotApplicable: [
                    'Error rate is very low',
                    'No front-line correction capability'
                ],
                caseNotes: 'Quick corrections build trust and remove excuses for non-payment. Tracking patterns helps improve data quality.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-23',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Support - Appeals: Offer clear, time-bound appeal process',
            shortTitle: 'Formal Appeals Process',
            timeline: '1-3 years',
            category: 'Support',
            sortOrder: 23,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers who disagree have no legitimate recourse; disputes fester and cause non-payment.',
                whatYouDo: 'Establish formal appeal process: clear grounds, submission requirements, timeline, independent review.',
                whenThisFitsBest: 'Valuation or assessment disputes are common; capacity for independent review exists.',
                minimumEnablers: 'Legal framework for appeals; review body; clear procedures; time limits.'
            },
            fullDetails: {
                legalEssentials: [
                    'Grounds for appeal',
                    'Filing requirements and deadlines',
                    'Composition of review body',
                    'Binding effect of decisions'
                ],
                howItWorks: 'Taxpayers can appeal within 30-60 days of receiving assessment. Appeals must state specific grounds. Independent review body (not revenue department) considers appeals. Decision is issued within defined time. Payment may be required pending appeal.',
                implementationMilestones: [
                    'Establish legal framework',
                    'Define appeal procedures',
                    'Create or designate review body',
                    'Train staff on appeal process',
                    'Monitor appeal volume and outcomes'
                ],
                administrativeEssentials: [
                    'Appeal intake and tracking',
                    'Evidence gathering',
                    'Review body administration'
                ],
                whenNotApplicable: [
                    'Very simple flat-rate system with no basis for dispute',
                    'No capacity for independent review'
                ],
                caseNotes: 'Fair appeals process builds legitimacy. Even if few appeals succeed, having the option increases acceptance.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-24',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Trust - Public Education: Explain what property tax funds',
            shortTitle: 'Public Education Campaign',
            timeline: '<1 year',
            category: 'Trust',
            sortOrder: 24,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers see no connection between taxes paid and services received.',
                whatYouDo: 'Run public education campaigns: what property tax funds, how rates are set, how to pay, where to get help.',
                whenThisFitsBest: 'Public awareness is low; communication channels exist; political support.',
                minimumEnablers: 'Communication budget; clear messaging; multiple channels (radio, social media, community meetings).'
            },
            fullDetails: {
                legalEssentials: [
                    'Approval for public communications',
                    'Accuracy requirements'
                ],
                howItWorks: 'Design campaign showing: "Your property tax funds roads, schools, clinics." Use infographics, radio spots, social media, community meetings. Time campaign around billing cycle. Feature local projects funded by property tax.',
                implementationMilestones: [
                    'Develop key messages and materials',
                    'Identify communication channels',
                    'Plan campaign timing',
                    'Execute multi-channel campaign',
                    'Measure awareness before and after'
                ],
                administrativeEssentials: [
                    'Communication staff or contractor',
                    'Material production',
                    'Channel partnerships'
                ],
                whenNotApplicable: [
                    'No communication budget',
                    'Services are visibly poor'
                ],
                caseNotes: 'Education works best when there are visible services to point to. Combine with "show the money" transparency efforts.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-25',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Trust - Show the Money: Publish "your taxes at work" reports',
            shortTitle: 'Tax-to-Service Transparency',
            timeline: '<1 year',
            category: 'Trust',
            sortOrder: 25,
            isActive: true,
            overview: {
                whatThisSolves: 'Taxpayers suspect funds are wasted or stolen; low trust reduces compliance.',
                whatYouDo: 'Publish regular reports showing: how much collected, what funded, projects completed; use simple infographics.',
                whenThisFitsBest: 'Budget data is available; political will for transparency.',
                minimumEnablers: 'Budget/expenditure data; communication capacity; political approval.'
            },
            fullDetails: {
                legalEssentials: [
                    'Budget transparency requirements',
                    'Approval for public reporting'
                ],
                howItWorks: 'Publish quarterly or annual reports: Total property tax collected, breakdown by ward, projects funded, with photos of completed works. Use simple charts and local language. Distribute widely - online, notice boards, radio.',
                implementationMilestones: [
                    'Compile revenue and expenditure data',
                    'Design simple report format',
                    'Create infographics',
                    'Distribute through multiple channels',
                    'Make this a regular practice'
                ],
                administrativeEssentials: [
                    'Data compilation',
                    'Report production',
                    'Distribution'
                ],
                whenNotApplicable: [
                    'Budget data is not available',
                    'Political will for transparency is lacking'
                ],
                caseNotes: 'Showing results builds trust and willingness to pay. Be honest about challenges too.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-26',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Trust - Participatory Budgeting: Let communities choose projects',
            shortTitle: 'Participatory Budgeting',
            timeline: '1-3 years',
            category: 'Trust',
            sortOrder: 26,
            isActive: true,
            overview: {
                whatThisSolves: 'Citizens feel disconnected from how taxes are spent; no sense of ownership.',
                whatYouDo: 'Allocate portion of property tax revenue to community-chosen projects; run participatory process.',
                whenThisFitsBest: 'Political support for participation; community organization exists; modest funds available.',
                minimumEnablers: 'Political commitment; facilitation capacity; project implementation ability; transparency.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to earmark funds',
                    'Rules for participatory process',
                    'Project eligibility criteria'
                ],
                howItWorks: 'Set aside 10-20% of property tax for community-chosen projects. Run ward-level meetings where residents propose and vote on projects. Implement winning projects with community involvement. Report back on results.',
                implementationMilestones: [
                    'Secure political commitment',
                    'Design participatory process',
                    'Allocate initial funding',
                    'Run first cycle of community meetings',
                    'Implement and report on projects'
                ],
                administrativeEssentials: [
                    'Facilitation capacity',
                    'Project management',
                    'Reporting and accountability'
                ],
                whenNotApplicable: [
                    'No political support',
                    'No funds available to allocate',
                    'No capacity to implement projects'
                ],
                caseNotes: 'Participatory budgeting builds strong ownership. Citizens who choose projects are more willing to fund them.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COM-27',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Compliance',
            title: 'Trust - Recognition & Accountability: Thank on-time payers, publish defaulters',
            shortTitle: 'Recognition & Accountability',
            timeline: '<1 year',
            category: 'Trust',
            sortOrder: 27,
            isActive: true,
            overview: {
                whatThisSolves: 'Good payers get no recognition; defaulters face no social consequence.',
                whatYouDo: 'Publicly thank compliant taxpayers; name-and-shame major commercial defaulters after due process.',
                whenThisFitsBest: 'Social pressure is effective; legal protection for publication; political will.',
                minimumEnablers: 'Legal authority to publish; due process before naming; communication channels.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to publish defaulter names',
                    'Due process requirements',
                    'Defamation protection'
                ],
                howItWorks: 'Positive: Thank early payers publicly, give certificates, honor top taxpayers. Negative: After due process, publish names of major commercial defaulters (not residential). Use newspaper, notice boards, social media.',
                implementationMilestones: [
                    'Design recognition program for good payers',
                    'Establish criteria for defaulter publication',
                    'Create due process safeguards',
                    'Launch recognition program',
                    'Begin selective defaulter publication'
                ],
                administrativeEssentials: [
                    'Recognition program administration',
                    'Due process for defaulter publication',
                    'Communication management'
                ],
                whenNotApplicable: [
                    'Legal constraints prevent publication',
                    'Social pressure is ineffective',
                    'Defaulter publication is politically impossible'
                ],
                caseNotes: 'Recognition is universally applicable. Defaulter publication is more sensitive and works best for commercial properties.',
                resources: []
            }
        }
    ];

})(window);
