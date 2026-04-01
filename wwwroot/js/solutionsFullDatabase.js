/**
 * ROSRA Full Solutions Database
 * Contains complete solution details including Legal Essentials, Implementation Milestones, etc.
 */

(function(window) {
    'use strict';

    // Full solution details for Property Tax - Compliance
    const PT_COMPLIANCE_FULL = {
        'PT-COM-01': {
            legalEssentials: [
                'Authority to issue electronic notices and recognise them as legally valid',
                'Bylaw requiring a standard bill format and plain-language descriptions',
                'Data-protection provisions for maintaining the property register and generating bills'
            ],
            howItWorks: `Deploy or upgrade a billing system (software or spreadsheet) that automatically computes taxes from property attributes (value, rate, exemptions). The system pulls data from the property register to fill in each taxpayer's bill.

Each bill should visually display the calculation - for example: "Land value (500,000) x 1% rate = 5,000; hardship exemption (-1,000) = 4,000 due."

Use bold fonts or tables to make this easy to read. Embed a QR code or USSD code that, when scanned, opens the payment portal with the bill reference prefilled.

Include deterrent language such as: "Note: Late payments incur a 10% penalty and 1% interest per month (bylaw section X). See enforcement schedule below." This links to the enforcement "ladder" - i.e., scheduled reminders and notices that escalate.`,
            implementationMilestones: [
                'Digitise the register and assign unique IDs to each property; compile ownership and valuation data',
                'Select and configure billing software to calculate taxes and generate standard notices',
                'Draft plain-language templates explaining the calculation (value x rate - exemptions) and due date',
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
            caseNotes: `In Garowe, Somalia, introducing an Integrated Financial Management Information System (IFMIS) to automate billing was transformative. After deploying IFMIS (replacing manual ledgers), the city's property tax revenue jumped 290% in five years. Tax invoices were sent electronically and paid via mobile codes, with real-time text confirmations to taxpayers.`,
            resources: [
                { title: 'Garowe IFMIS Case Study', url: '#' },
                { title: 'Plain Language Bill Templates', url: '#' }
            ]
        },
        'PT-COM-02': {
            legalEssentials: [
                'Recognition of electronic notices as valid; update any by-law that requires paper delivery',
                'Legal basis for collection and use of phone numbers/email addresses for tax administration',
                'Explicit authority for door-to-door delivery by municipal staff or contractors'
            ],
            howItWorks: `Maintain an up-to-date contact database. For digital dispatch, use an SMS gateway or mass-messaging tool to send reminders of the new bill, including a PDF or link to the invoice.

For physical delivery, organize ward-level teams to hand-deliver bills in person. Equip teams with printed bills and ID badges. Have recipients sign a delivery log.

Track delivery status centrally. For undelivered items, trigger the tracing workflow (see PT-COM-04).`,
            implementationMilestones: [
                'Compile/update contact lists from the register, utilities and other sources',
                'Send digital bills (SMS/email) to all available contacts',
                'Plan door-to-door routes for wards with low digital reach',
                'Deliver paper bills; collect receipt signatures',
                'Log undelivered cases for follow-up'
            ],
            administrativeEssentials: [
                'A dispatch unit with messaging software and field logistics capacity',
                'Training for enumerators on customer service and data privacy',
                'An integrated log to capture delivery status'
            ],
            whenNotApplicable: [
                'Areas with no mobile coverage (rely on physical only)',
                'Legal prohibitions on SMS/email notices',
                'Insecurity or severe health crises hindering door-to-door delivery'
            ],
            caseNotes: `Garowe's tax office combined digital and in-person delivery. Officials note that many residents still prefer receiving a physical notice. This dual approach led to higher retrieval of bills and faster payment.`,
            resources: [
                { title: 'Multi-Channel Delivery Guide', url: '#' }
            ]
        },
        'PT-COM-03': {
            legalEssentials: [
                'Authority to send reminder communications to taxpayers',
                'Clear penalty schedule that can be communicated in reminders',
                'Data protection compliance for contact information usage'
            ],
            howItWorks: `Design a reminder sequence that escalates in tone:
- 30 days before due: Friendly reminder with payment link
- Due date: Firm reminder noting deadline has arrived
- 7 days after: Warning of pending penalties
- 30 days after: Final notice before enforcement action

Automate the sequence using the billing system or messaging platform. Personalize messages with amount due and payment options.`,
            implementationMilestones: [
                'Draft reminder templates at each escalation level',
                'Configure automated scheduling in billing/messaging system',
                'Test with pilot group and measure response rates',
                'Refine messaging based on what drives payments',
                'Roll out to all taxpayers'
            ],
            administrativeEssentials: [
                'Automated messaging capability integrated with billing system',
                'Staff to monitor delivery and response rates',
                'Process to handle replies and queries from reminders'
            ],
            whenNotApplicable: [
                'No reliable contact database exists',
                'Legal restrictions on automated messaging',
                'Very small number of taxpayers (manual follow-up may suffice)'
            ],
            caseNotes: `Behavioral research shows that well-timed reminders can increase tax compliance by 10-20%. The most effective reminders include: specific amounts due, clear deadlines, easy payment links, and mention of consequences for non-payment.`,
            resources: [
                { title: 'Behavioral Insights for Tax Collection', url: '#' }
            ]
        },
        'PT-COM-04': {
            legalEssentials: [
                'Authority to investigate and update taxpayer address records',
                'Legal basis for field visits to verify addresses',
                'Data protection requirements for address verification'
            ],
            howItWorks: `Create a dedicated workflow for returned or undelivered bills:
1. Flag undelivered bills in the system
2. Investigate using alternative data sources (utilities, neighbors, ward officials)
3. Attempt re-delivery with corrected address
4. If still undeliverable, escalate to field investigation
5. Update records with verified information`,
            implementationMilestones: [
                'Define criteria for "undeliverable" bills',
                'Create investigation checklist and data sources to consult',
                'Train staff on tracing procedures',
                'Establish field team for physical address verification',
                'Implement tracking dashboard for undelivered cases'
            ],
            administrativeEssentials: [
                'Dedicated staff or workflow for tracing',
                'Access to alternative address data sources',
                'Field capacity for physical verification'
            ],
            whenNotApplicable: [
                'Very low volume of returned mail',
                'No field capacity available',
                'Addresses are mostly informal/informal settlements'
            ],
            caseNotes: `Cities with systematic tracing workflows recover 15-25% of previously undeliverable bills. Key success factors: quick turnaround (within billing cycle), use of multiple data sources, and integration with address update processes.`,
            resources: []
        },
        'PT-COM-05': {
            legalEssentials: [
                'Authority to partner with payment service providers',
                'Regulations on electronic payments and receipting',
                'Consumer protection requirements for payment channels'
            ],
            howItWorks: `Expand payment accessibility through multiple channels:
- Mobile money: Partner with major providers (M-Pesa, etc.)
- Banks: Enable payment at any bank branch
- Agents: Use existing bank agent networks
- Ward counters: Open local collection points
- Online: Enable payment via web portal

Ensure all channels issue valid receipts and reconcile to central system same-day.`,
            implementationMilestones: [
                'Identify and contract with payment service providers',
                'Integrate payment channels with central billing system',
                'Train staff on reconciliation procedures',
                'Publicize new payment options to taxpayers',
                'Monitor channel usage and resolve issues'
            ],
            administrativeEssentials: [
                'Partnership agreements with payment providers',
                'Daily reconciliation process',
                'Customer support for payment issues'
            ],
            whenNotApplicable: [
                'No mobile money or banking infrastructure',
                'Very rural area with no payment agents',
                'Extremely low digital/financial literacy'
            ],
            caseNotes: `After introducing mobile money payments, Mzuzu City Council in Malawi saw payment compliance increase by 35%. The convenience factor was cited as the primary driver, with taxpayers no longer needing to travel to city offices during working hours.`,
            resources: [
                { title: 'Mobile Payment Integration Guide', url: '#' }
            ]
        },
        'PT-COM-06': {
            legalEssentials: [
                'Legal authority to offer instalment payment plans',
                'Regulations on interest/penalties during instalment period',
                'Default and cancellation provisions'
            ],
            howItWorks: `Offer structured payment plans for taxpayers who cannot pay in full:
- Define eligibility criteria (e.g., outstanding amount thresholds)
- Standard plans: quarterly, monthly, or 6-month schedules
- Require formal agreement with payment schedule
- Apply reduced or waived penalties for compliant instalments
- Automatic default triggers if payments missed`,
            implementationMilestones: [
                'Define instalment plan options and eligibility criteria',
                'Create application and agreement forms',
                'Configure billing system to track partial payments',
                'Train staff on plan management',
                'Establish default management procedures'
            ],
            administrativeEssentials: [
                'System to track instalment schedules and payments',
                'Staff to approve and monitor plans',
                'Default management and escalation process'
            ],
            whenNotApplicable: [
                'Legal framework does not allow instalments',
                'Billing system cannot track partial payments',
                'Administrative capacity insufficient for plan management'
            ],
            caseNotes: `Instalment plans can increase total collection by making payment affordable. Key success factors: clear terms, automatic reminders for each instalment, and swift action on defaults.`,
            resources: []
        },
        'PT-COM-07': {
            legalEssentials: [
                'Authority to offer discounts on tax obligations',
                'Clear regulations on discount percentage and timing',
                'Budget approval for foregone revenue'
            ],
            howItWorks: `Offer time-limited discount for early payment:
- Typical discount: 2-5% for payment within first 30-60 days
- Communicate discount prominently on bill
- Automatic calculation in billing system
- Track uptake and revenue impact`,
            implementationMilestones: [
                'Obtain approval for discount program',
                'Configure billing system to apply discount',
                'Update bill templates to highlight discount',
                'Publicize through multiple channels',
                'Monitor uptake and adjust if needed'
            ],
            administrativeEssentials: [
                'Billing system capability for automatic discounts',
                'Communication of discount to taxpayers',
                'Tracking and reporting on discount usage'
            ],
            whenNotApplicable: [
                'Compliance is already very high',
                'Discount would create significant revenue loss',
                'Legal framework does not permit discounts'
            ],
            caseNotes: `Early payment discounts typically increase on-time payment by 10-15%. The psychological effect of "saving money" motivates action. However, discounts should be modest to avoid revenue loss.`,
            resources: []
        },
        'PT-COM-08': {
            legalEssentials: [
                'Requirements for official receipt format and content',
                'Anti-fraud provisions for receipt numbering',
                'Record retention requirements'
            ],
            howItWorks: `Ensure every payment generates a valid, verifiable receipt:
- Unique receipt number from controlled sequence
- Payment details: amount, date, payer, property reference
- Verification mechanism (QR code or online lookup)
- Secure printing or digital issuance`,
            implementationMilestones: [
                'Design secure receipt format with verification features',
                'Implement controlled numbering sequence',
                'Enable real-time receipt issuance at all payment points',
                'Create verification portal or hotline',
                'Train all payment handlers on proper receipting'
            ],
            administrativeEssentials: [
                'Secure receipt stock management',
                'Real-time payment recording',
                'Verification capability for taxpayers'
            ],
            whenNotApplicable: [
                'All payments are digital with automatic confirmation',
                'Very small jurisdiction with low corruption risk'
            ],
            caseNotes: `Proper receipting is foundational for revenue integrity. In multiple jurisdictions, introduction of secure, verifiable receipts has reduced leakage by 15-30%.`,
            resources: []
        },
        'PT-COM-09': {
            legalEssentials: [
                'Internal control requirements for cash handling',
                'Banking regulations and deposit requirements',
                'Audit authority for cash operations'
            ],
            howItWorks: `Implement robust cash controls:
- Two-person rule for cash counting
- Same-day or next-day banking requirement
- Secure transport arrangements
- Daily reconciliation of collections to deposits
- Regular surprise audits`,
            implementationMilestones: [
                'Review current cash handling procedures',
                'Develop improved control procedures',
                'Train all cash handlers on new procedures',
                'Establish daily reconciliation routine',
                'Implement audit program'
            ],
            administrativeEssentials: [
                'Dual-control procedures',
                'Banking arrangements',
                'Internal audit capacity'
            ],
            whenNotApplicable: [
                'All payments are electronic',
                'Very small cash collection volume'
            ],
            caseNotes: `Cash leakage can consume 10-20% of collections in poorly controlled environments. Basic controls like dual custody and same-day banking can reduce this dramatically.`,
            resources: []
        },
        'PT-COM-10': {
            legalEssentials: [
                'Data access permissions for dashboard users',
                'Data protection requirements',
                'Reporting requirements to oversight bodies'
            ],
            howItWorks: `Create management dashboard showing:
- Daily/weekly/monthly collections vs. targets
- Ward-by-ward performance
- Arrears aging (30/60/90+ days)
- Collector productivity
- Top defaulters

Update automatically from payment system. Enable drill-down to individual cases.`,
            implementationMilestones: [
                'Define key performance indicators',
                'Design dashboard layout and reports',
                'Connect to payment data sources',
                'Train managers on dashboard use',
                'Establish regular review meetings using dashboard'
            ],
            administrativeEssentials: [
                'Data integration capability',
                'Dashboard tool or development capacity',
                'Management commitment to data-driven decisions'
            ],
            whenNotApplicable: [
                'Payment data is not captured electronically',
                'Management not ready to use data'
            ],
            caseNotes: `Dashboards enable evidence-based management. Cities that implement performance tracking typically see 10-20% improvement in collections within the first year.`,
            resources: []
        },
        'PT-COM-11': {
            legalEssentials: [
                'Authority to issue formal demand notices',
                'Legal requirements for notice content and delivery',
                'Time limits before escalation to next stage'
            ],
            howItWorks: `Implement graduated notice sequence:
1. Friendly reminder: "Your payment is overdue"
2. Formal demand: Official notice with amount and deadline
3. Final warning: Clear statement of pending enforcement
4. Enforcement notice: Specific action to be taken

Each notice should clearly state consequences of continued non-payment.`,
            implementationMilestones: [
                'Draft notice templates at each level',
                'Define trigger criteria and timing for each stage',
                'Configure automated notice generation',
                'Establish delivery tracking',
                'Train staff on notice procedures'
            ],
            administrativeEssentials: [
                'Standard notice templates',
                'Automated or systematic notice generation',
                'Delivery and tracking mechanism'
            ],
            whenNotApplicable: [
                'Legal framework does not support formal demands',
                'No enforcement capacity to back up notices'
            ],
            caseNotes: `Graduated enforcement creates fair warning while building deterrent effect. Studies show that specific, credible consequences mentioned in notices increase payment rates by 15-25%.`,
            resources: []
        },
        'PT-COM-12': {
            legalEssentials: [
                'Authority to impose late payment penalties',
                'Regulations specifying penalty rates and calculation',
                'Appeal or waiver provisions'
            ],
            howItWorks: `Apply consistent penalties for late payment:
- Define penalty rate (e.g., 10% of tax due plus 1% monthly interest)
- Automatic calculation in billing system
- Apply consistently to all defaulters
- Communicate penalties clearly on bills and notices`,
            implementationMilestones: [
                'Review/update penalty regulations',
                'Configure automatic penalty calculation',
                'Update bill and notice templates',
                'Train staff on penalty application',
                'Monitor and report on penalty collections'
            ],
            administrativeEssentials: [
                'Clear penalty regulations',
                'Automated calculation capability',
                'Consistent application procedures'
            ],
            whenNotApplicable: [
                'Legal framework does not allow penalties',
                'Political resistance to penalty enforcement'
            ],
            caseNotes: `Penalties must be proportionate and consistently applied. Arbitrary or excessive penalties undermine legitimacy. The goal is deterrence, not revenue maximization.`,
            resources: []
        },
        'PT-COM-13': {
            legalEssentials: [
                'Authority to require tax clearance for property transfers',
                'Integration requirements with land registry',
                'Liability transfer provisions'
            ],
            howItWorks: `Require tax clearance before property transfer:
- Land registry checks for clearance certificate
- No transfer without current tax status
- Clearance issued upon payment of all arrears
- Or transfer with explicit assumption of tax debt`,
            implementationMilestones: [
                'Establish legal requirement for clearance',
                'Develop clearance certificate format',
                'Integrate with land registry process',
                'Train registry staff on requirements',
                'Publicize requirement to property market'
            ],
            administrativeEssentials: [
                'Certificate issuance capability',
                'Registry integration or checking process',
                'Clear procedures for complex cases'
            ],
            whenNotApplicable: [
                'No functioning land registry',
                'Informal property market dominates',
                'Legal framework does not support'
            ],
            caseNotes: `Tax clearance requirements are one of the most effective enforcement tools, leveraging the property transaction to ensure tax compliance. Implementation requires registry cooperation.`,
            resources: []
        },
        'PT-COM-17': {
            legalEssentials: [
                'Authority for field collection activities',
                'Staff identification and authorization requirements',
                'Safety and conduct regulations'
            ],
            howItWorks: `Deploy trained field collectors for difficult cases:
- Target high-value or chronic defaulters
- Equip with mobile devices for real-time access
- Authority to collect payment or negotiate
- Clear protocols for escalation`,
            implementationMilestones: [
                'Select and train field collection team',
                'Equip with mobile technology',
                'Develop visit protocols and scripts',
                'Establish safety procedures',
                'Implement tracking and reporting'
            ],
            administrativeEssentials: [
                'Trained collection staff',
                'Mobile technology',
                'Clear protocols and safety measures'
            ],
            whenNotApplicable: [
                'Very low default rates',
                'Security concerns for field staff',
                'No capacity for field operations'
            ],
            caseNotes: `Personal visits are highly effective for chronic defaulters. The personal contact often resolves issues that letters cannot address. However, proper training is essential.`,
            resources: []
        },
        'PT-COM-20': {
            legalEssentials: [
                'Authority to waive penalties/interest',
                'Clear terms and conditions for amnesty',
                'Time limits and one-time nature'
            ],
            howItWorks: `Offer limited-time amnesty before stricter enforcement:
- Waive penalties and interest for payment within amnesty period
- Publicize widely that enforcement will intensify afterward
- Use as one-time reset, not recurring program
- Build enforcement capacity during amnesty`,
            implementationMilestones: [
                'Obtain political approval for amnesty',
                'Define clear terms (who qualifies, what is waived)',
                'Run intensive publicity campaign',
                'Process amnesty payments efficiently',
                'Prepare enforcement for post-amnesty period'
            ],
            administrativeEssentials: [
                'Political support',
                'Publicity resources',
                'Capacity to process high volume during amnesty'
            ],
            whenNotApplicable: [
                'Recent amnesty was offered (creates expectation)',
                'No enforcement capacity to follow',
                'Political will for enforcement is weak'
            ],
            caseNotes: `Amnesties work best as a one-time reset before credible enforcement. Repeated amnesties train taxpayers to wait for the next one. Always follow with visible enforcement.`,
            resources: []
        },
        'PT-COM-21': {
            legalEssentials: [
                'Authority to provide taxpayer services',
                'Data protection for personal information',
                'Service standards and accountability'
            ],
            howItWorks: `Establish taxpayer support services:
- Phone hotline for questions
- Walk-in service desk
- Online chat or email support
- Knowledge base for common questions
- Escalation for complex issues`,
            implementationMilestones: [
                'Define service channels to offer',
                'Recruit and train support staff',
                'Develop knowledge base and FAQs',
                'Set up phone/online systems',
                'Establish service standards and monitoring'
            ],
            administrativeEssentials: [
                'Dedicated support staff',
                'Communication infrastructure',
                'Knowledge base and training'
            ],
            whenNotApplicable: [
                'Very small taxpayer base',
                'No resources for dedicated support'
            ],
            caseNotes: `Good taxpayer service reduces complaints, resolves issues quickly, and builds trust. Many non-payment issues stem from confusion that good service can address.`,
            resources: []
        },
        'PT-COM-24': {
            legalEssentials: [
                'Authority for public communications',
                'Budget for communication activities',
                'Transparency requirements'
            ],
            howItWorks: `Run public education campaigns:
- Explain what property tax funds (roads, schools, etc.)
- Show how rates are set
- Explain how to pay
- Publicize where to get help
- Use multiple channels: radio, social media, community meetings`,
            implementationMilestones: [
                'Develop key messages and materials',
                'Identify communication channels',
                'Train staff on messaging',
                'Launch campaign',
                'Monitor and adjust based on feedback'
            ],
            administrativeEssentials: [
                'Communication budget',
                'Clear messaging',
                'Multiple channels'
            ],
            whenNotApplicable: [
                'Public awareness is already high',
                'No communication budget'
            ],
            caseNotes: `Public education builds legitimacy and voluntary compliance. Messages connecting taxes to visible services are most effective. Use local languages and accessible formats.`,
            resources: []
        },
        'PT-COM-25': {
            legalEssentials: [
                'Transparency requirements',
                'Budget disclosure rules',
                'Data accuracy requirements'
            ],
            howItWorks: `Publish regular reports showing:
- How much collected
- What it funded (projects, services)
- Projects completed
- Use simple infographics
- Distribute through multiple channels`,
            implementationMilestones: [
                'Define report format and content',
                'Gather budget/expenditure data',
                'Develop simple, visual presentation',
                'Establish publication schedule',
                'Distribute and publicize'
            ],
            administrativeEssentials: [
                'Budget/expenditure data access',
                'Communication capacity',
                'Political approval'
            ],
            whenNotApplicable: [
                'Political resistance to transparency',
                'Budget data not available'
            ],
            caseNotes: `Transparency reports build trust and compliance. When taxpayers see their money at work, they are more likely to pay. Simple, visual formats work best.`,
            resources: []
        }
    };

    // Full solution details for Property Tax - Coverage (selected key solutions)
    const PT_COVERAGE_FULL = {
        'PT-COV-01': {
            legalEssentials: [
                'Authority to accept self-registration for tax purposes',
                'Data protection for personal information',
                'Verification requirements'
            ],
            howItWorks: `Create accessible registration portal:
- Online form for property details
- Mobile-friendly interface
- SMS confirmation
- Follow-up verification process
- Integration with property roll`,
            implementationMilestones: [
                'Develop registration form and platform',
                'Create verification workflow',
                'Launch and publicize portal',
                'Process registrations and verify',
                'Add verified properties to roll'
            ],
            administrativeEssentials: [
                'Web/mobile platform',
                'Verification staff',
                'Data entry capacity'
            ],
            whenNotApplicable: [
                'Very low internet access',
                'No incentive for voluntary registration'
            ],
            caseNotes: `Self-registration portals work best when combined with incentives (e.g., required for services) and outreach campaigns.`,
            resources: []
        },
        'PT-COV-02': {
            legalEssentials: [
                'Data sharing agreements with other agencies',
                'Privacy protections for shared data',
                'Authority to use third-party data for tax purposes'
            ],
            howItWorks: `Cross-match property roll against:
- Building permits issued
- Land registry records
- Utility connections (water, electricity)
- Business licenses at commercial properties

Identify mismatches and investigate.`,
            implementationMilestones: [
                'Identify data sources and obtain access',
                'Develop matching methodology',
                'Run initial matching exercise',
                'Investigate and verify mismatches',
                'Add confirmed properties to roll'
            ],
            administrativeEssentials: [
                'Data access agreements',
                'Matching tools/capability',
                'Investigation capacity'
            ],
            whenNotApplicable: [
                'Other databases do not exist or are inaccessible',
                'Data quality too poor for matching'
            ],
            caseNotes: `Data cross-matching can identify 10-30% additional properties at low cost. Best results come from multiple data sources and systematic follow-up.`,
            resources: []
        },
        'PT-COV-03': {
            legalEssentials: [
                'Authority for field enumeration',
                'Data collection requirements',
                'Privacy protections'
            ],
            howItWorks: `Organize systematic ward-by-ward canvass:
- Deploy trained enumerators with mobile devices
- Walk every street, identify every property
- Collect: location, type, size, ownership if known
- Update property register with findings`,
            implementationMilestones: [
                'Recruit and train enumeration teams',
                'Develop data collection tools',
                'Plan ward-by-ward schedule',
                'Execute canvass with quality control',
                'Process data and update register'
            ],
            administrativeEssentials: [
                'Field teams',
                'Mobile data collection tools',
                'Supervisor oversight',
                'Data entry capacity'
            ],
            whenNotApplicable: [
                'Security constraints',
                'No field capacity',
                'Register already comprehensive'
            ],
            caseNotes: `Field canvassing remains the most reliable way to achieve complete coverage, especially for informal properties. Combine with technology for efficiency.`,
            resources: []
        },
        'PT-COV-07': {
            legalEssentials: [
                'Authority to maintain digital property records',
                'Data protection requirements',
                'Record retention requirements'
            ],
            howItWorks: `Build comprehensive digital register:
- Digitize existing paper records
- Create structured database
- Assign unique property identifiers
- Link to GIS if possible
- Establish update procedures`,
            implementationMilestones: [
                'Assess current records and data quality',
                'Design database structure',
                'Digitize and clean existing data',
                'Establish ongoing maintenance procedures',
                'Train staff on system use'
            ],
            administrativeEssentials: [
                'Database system',
                'Data entry capacity',
                'Quality control',
                'Ongoing maintenance plan'
            ],
            whenNotApplicable: [
                'No paper records exist',
                'No capacity for digitization',
                'System cannot be maintained'
            ],
            caseNotes: `Digital registers are foundational for modern property tax administration. They enable automation, analysis, and integration with other systems.`,
            resources: []
        }
    };

    // Full solution details for Property Tax - Valuation (selected key solutions)
    const PT_VALUATION_FULL = {
        'PT-VAL-01': {
            legalEssentials: [
                'Authority to establish valuation zones',
                'Legal basis for notional/presumptive values',
                'Update and appeal provisions'
            ],
            howItWorks: `Implement zone-based valuation:
- Divide city into value zones based on location quality
- Assign notional land values per zone
- Apply multipliers for property characteristics
- Update zones and values periodically`,
            implementationMilestones: [
                'Analyze city areas and define zones',
                'Set initial zone values based on available data',
                'Develop property characteristic multipliers',
                'Calculate and publish valuations',
                'Establish update cycle'
            ],
            administrativeEssentials: [
                'Zone mapping capability',
                'Valuation methodology',
                'Communication and publication'
            ],
            whenNotApplicable: [
                'Market-based valuation is required by law',
                'City is too homogeneous for zoning',
                'Full CAMA system already in place'
            ],
            caseNotes: `Zone-based systems provide a practical intermediate step between flat rates and full market valuation. They capture location differences while remaining simple to administer.`,
            resources: []
        },
        'PT-VAL-05': {
            legalEssentials: [
                'Authority for periodic revaluation',
                'Authority for index-based adjustments',
                'Notice and appeal requirements'
            ],
            howItWorks: `Establish predictable revaluation cycle:
- Full revaluation every 3-5 years
- Annual index adjustment between revaluations
- Clear communication of timing and methodology
- Phase in large increases if needed`,
            implementationMilestones: [
                'Establish legal framework for cycles',
                'Select appropriate index for annual adjustments',
                'Develop communication plan',
                'Implement first cycle',
                'Monitor and refine'
            ],
            administrativeEssentials: [
                'Revaluation capacity',
                'Index data source',
                'Communication capability'
            ],
            whenNotApplicable: [
                'No revaluation capacity',
                'Political resistance to regular updates',
                'Stable property values'
            ],
            caseNotes: `Regular revaluation cycles prevent values from becoming outdated and reduce taxpayer shock from sudden large increases.`,
            resources: []
        }
    };

    // Full solution details for Business License - Compliance
    const BL_COMPLIANCE_FULL = {
        'BL-COM-01': {
            legalEssentials: [
                'Authority to send electronic renewal notices',
                'Mobile payment authorization',
                'Data protection compliance'
            ],
            howItWorks: `Automate the renewal process:
- Send SMS/email reminders before license expiry
- Include link to mobile payment
- Escalate reminders as expiry approaches
- Issue digital license upon payment`,
            implementationMilestones: [
                'Build/update license database with contact info',
                'Configure automated reminder system',
                'Integrate mobile payment option',
                'Test and launch for upcoming renewals',
                'Monitor and optimize based on results'
            ],
            administrativeEssentials: [
                'Contact database',
                'SMS gateway or messaging platform',
                'Mobile money integration'
            ],
            whenNotApplicable: [
                'No digital license database',
                'Very low mobile penetration',
                'No mobile payment infrastructure'
            ],
            caseNotes: `Automated reminders can increase renewal rates by 20-30%. The key is timing - reminders 30, 14, and 7 days before expiry are most effective.`,
            resources: []
        },
        'BL-COM-02': {
            legalEssentials: [
                'Authority for compliance inspections',
                'Penalty schedule for non-compliance',
                'Due process requirements'
            ],
            howItWorks: `Implement visible enforcement:
- Require license display at business premises
- Conduct regular compliance inspections
- Apply graduated penalties for violations
- Publicize enforcement actions`,
            implementationMilestones: [
                'Train inspection teams',
                'Develop inspection protocols',
                'Implement tracking system',
                'Launch compliance campaign',
                'Monitor and adjust'
            ],
            administrativeEssentials: [
                'Inspection teams',
                'Penalty authority',
                'Tracking system'
            ],
            whenNotApplicable: [
                'No inspection capacity',
                'Legal framework does not support enforcement',
                'Political resistance to enforcement'
            ],
            caseNotes: `Visible enforcement creates deterrent effect. Even modest enforcement can significantly improve compliance when combined with publicity.`,
            resources: []
        },
        'BL-COM-03': {
            legalEssentials: [
                'Authority to simplify requirements',
                'Risk-based regulation framework',
                'Self-declaration provisions'
            ],
            howItWorks: `Streamline renewal to reduce burden:
- Enable online renewal
- Reduce documentation requirements
- Accept self-declarations for low-risk businesses
- Process renewals faster`,
            implementationMilestones: [
                'Map current renewal process and identify pain points',
                'Design simplified process',
                'Develop online platform',
                'Pilot and refine',
                'Roll out and communicate changes'
            ],
            administrativeEssentials: [
                'Process design authority',
                'Online platform capability',
                'Risk-based approach'
            ],
            whenNotApplicable: [
                'Current process is already streamlined',
                'Legal requirements mandate complexity',
                'No capacity for online services'
            ],
            caseNotes: `Simplification can dramatically increase compliance. Businesses that find the process easy are much more likely to renew on time.`,
            resources: []
        }
    };

    // Full solution details for Business License - Coverage
    const BL_COVERAGE_FULL = {
        'BL-COV-01': {
            legalEssentials: [
                'Authority for unified registration',
                'Inter-agency data sharing',
                'Business identity requirements'
            ],
            howItWorks: `Create one-stop registration:
- Single portal for all business registration needs
- Integration with national business registry
- Online application and payment
- Automatic license issuance for qualifying businesses`,
            implementationMilestones: [
                'Map current registration requirements',
                'Design unified process',
                'Build or procure portal',
                'Integrate with partner agencies',
                'Launch and publicize'
            ],
            administrativeEssentials: [
                'Web platform',
                'Agency coordination',
                'Workflow system'
            ],
            whenNotApplicable: [
                'No inter-agency cooperation possible',
                'Very low internet access',
                'Complex legal requirements prevent integration'
            ],
            caseNotes: `One-stop shops can dramatically improve registration rates by reducing complexity. Success requires genuine inter-agency cooperation.`,
            resources: []
        },
        'BL-COV-02': {
            legalEssentials: [
                'Authority for field enumeration',
                'Market access permissions',
                'Data collection requirements'
            ],
            howItWorks: `Conduct market-by-market enumeration:
- Deploy teams to markets and commercial areas
- Identify all operating businesses
- Record basic information
- Facilitate on-site registration`,
            implementationMilestones: [
                'Identify target areas',
                'Train enumeration teams',
                'Develop mobile registration tools',
                'Execute enumeration',
                'Follow up on registrations'
            ],
            administrativeEssentials: [
                'Field teams',
                'Mobile registration capability',
                'Market access coordination'
            ],
            whenNotApplicable: [
                'Security constraints',
                'No field capacity',
                'All businesses already registered'
            ],
            caseNotes: `Field enumeration is essential for reaching informal businesses. On-site registration dramatically increases completion rates.`,
            resources: []
        },
        'BL-COV-03': {
            legalEssentials: [
                'Data sharing agreements',
                'Privacy protections',
                'Authority to use third-party data'
            ],
            howItWorks: `Cross-match business licenses against:
- Commercial utility accounts
- Commercial property taxpayers
- Supplier databases
- National tax registration

Identify businesses operating without licenses.`,
            implementationMilestones: [
                'Identify data sources',
                'Obtain data access',
                'Develop matching methodology',
                'Execute matching',
                'Follow up on identified businesses'
            ],
            administrativeEssentials: [
                'Data access agreements',
                'Matching tools',
                'Follow-up capacity'
            ],
            whenNotApplicable: [
                'Other databases not accessible',
                'Data quality too poor',
                'Legal barriers to data sharing'
            ],
            caseNotes: `Data cross-matching is a cost-effective way to identify unlicensed businesses. Utility data is often the most useful source.`,
            resources: []
        }
    };

    // Full solution details for Business License - Liability
    const BL_LIABILITY_FULL = {
        'BL-LIA-01': {
            legalEssentials: [
                'Authority to set license fees',
                'Legal framework for graduated fees',
                'Annual update provisions'
            ],
            howItWorks: `Update fee structure:
- Review current fees vs. business capacity
- Develop graduated structure based on type/size/turnover
- Update annually for inflation
- Communicate changes clearly`,
            implementationMilestones: [
                'Analyze current fees and gaps',
                'Design new fee structure',
                'Obtain legal/political approval',
                'Implement in billing system',
                'Communicate to businesses'
            ],
            administrativeEssentials: [
                'Fee-setting authority',
                'Business data',
                'Rate design methodology'
            ],
            whenNotApplicable: [
                'No authority to change fees',
                'Political resistance to increases',
                'Current fees are adequate'
            ],
            caseNotes: `Fee reform should balance revenue potential with compliance incentives. Graduated fees are fairer and can increase total revenue.`,
            resources: []
        },
        'BL-LIA-02': {
            legalEssentials: [
                'Classification criteria in law/regulation',
                'Authority to reclassify',
                'Appeal provisions'
            ],
            howItWorks: `Improve business categorization:
- Review classification criteria
- Train inspectors on proper classification
- Conduct reclassification exercise
- Implement verification at renewal`,
            implementationMilestones: [
                'Review current classifications',
                'Develop clear criteria and training',
                'Execute reclassification',
                'Update billing system',
                'Monitor ongoing accuracy'
            ],
            administrativeEssentials: [
                'Classification criteria',
                'Inspection capacity',
                'Data correction capability'
            ],
            whenNotApplicable: [
                'Flat fee structure',
                'Classifications already accurate',
                'No inspection capacity'
            ],
            caseNotes: `Misclassification is a common source of revenue leakage. Regular review and inspector training are essential.`,
            resources: []
        },
        'BL-LIA-03': {
            legalEssentials: [
                'Authority for self-assessment',
                'Audit powers',
                'Penalties for false declaration'
            ],
            howItWorks: `Implement turnover-based self-declaration:
- Businesses declare annual turnover
- Fee calculated as percentage of declared amount
- Risk-based audit program
- Penalties for under-declaration`,
            implementationMilestones: [
                'Design declaration form and process',
                'Establish audit selection criteria',
                'Build audit capacity',
                'Implement and communicate',
                'Execute audits and enforce'
            ],
            administrativeEssentials: [
                'Declaration system',
                'Audit capacity',
                'Penalty enforcement'
            ],
            whenNotApplicable: [
                'Most businesses have no records',
                'No audit capacity',
                'Legal framework does not support'
            ],
            caseNotes: `Self-assessment works for larger businesses with records. The key is credible audit threat. Start with largest businesses.`,
            resources: []
        }
    };

    // Generic solutions full details
    const GENERIC_FULL = {
        'GEN-COM-01': {
            legalEssentials: [
                'Authority for electronic payments',
                'Partnership agreements with providers',
                'Receipting requirements'
            ],
            howItWorks: `Expand payment options:
- Mobile money integration
- Bank payment enablement
- Agent network utilization
- Field collection for remote areas`,
            implementationMilestones: [
                'Identify payment partners',
                'Negotiate and sign agreements',
                'Integrate systems',
                'Train staff and publicize',
                'Monitor and optimize'
            ],
            administrativeEssentials: [
                'Payment partnerships',
                'Reconciliation system',
                'User communication'
            ],
            whenNotApplicable: [
                'No payment infrastructure exists',
                'Very small collection volume'
            ],
            caseNotes: `Payment accessibility is often the biggest barrier to compliance. Multiple convenient options can significantly increase collections.`,
            resources: []
        },
        'GEN-COM-02': {
            legalEssentials: [
                'Authority for enforcement actions',
                'Graduated penalty framework',
                'Due process requirements'
            ],
            howItWorks: `Implement graduated enforcement:
- Reminders and warnings
- Service restrictions
- Formal legal action
- Clear communication at each stage`,
            implementationMilestones: [
                'Define enforcement ladder',
                'Develop procedures for each stage',
                'Build capacity for enforcement',
                'Implement and publicize',
                'Monitor effectiveness'
            ],
            administrativeEssentials: [
                'Legal framework',
                'Enforcement resources',
                'Tracking system'
            ],
            whenNotApplicable: [
                'No enforcement authority',
                'No capacity for enforcement',
                'Political resistance'
            ],
            caseNotes: `Enforcement must be credible to be effective. Start with cases that can be completed successfully to build reputation.`,
            resources: []
        },
        'GEN-COM-03': {
            legalEssentials: [
                'Authority for public communication',
                'Budget for campaigns',
                'Accuracy requirements'
            ],
            howItWorks: `Run awareness campaigns:
- Explain what fees fund
- Show services delivered
- Communicate payment options
- Use multiple channels`,
            implementationMilestones: [
                'Develop key messages',
                'Create materials',
                'Select channels',
                'Execute campaign',
                'Monitor impact'
            ],
            administrativeEssentials: [
                'Communication budget',
                'Clear messaging',
                'Multiple channels'
            ],
            whenNotApplicable: [
                'Awareness already high',
                'No communication budget'
            ],
            caseNotes: `Public awareness campaigns build legitimacy and voluntary compliance. Local languages and accessible formats are essential.`,
            resources: []
        },
        'GEN-COV-01': {
            legalEssentials: [
                'Authority for user registration',
                'Data protection requirements',
                'Service linkage provisions'
            ],
            howItWorks: `Create registration system:
- Simple registration process
- Link to service access
- Enable self-registration
- Integrate with billing`,
            implementationMilestones: [
                'Design registration process',
                'Build or configure system',
                'Link to services',
                'Launch and publicize',
                'Maintain and update'
            ],
            administrativeEssentials: [
                'Database system',
                'Registration process',
                'Service linkage'
            ],
            whenNotApplicable: [
                'Services cannot be linked to registration',
                'Very small user base'
            ],
            caseNotes: `Registration systems are foundational for coverage. Service linkage provides incentive for registration.`,
            resources: []
        },
        'GEN-COV-02': {
            legalEssentials: [
                'Data sharing agreements',
                'Privacy protections',
                'Use of third-party data'
            ],
            howItWorks: `Cross-match with other databases:
- Property records
- Business licenses
- Utility connections
- Identify potential users`,
            implementationMilestones: [
                'Identify data sources',
                'Obtain access',
                'Develop matching',
                'Execute and follow up',
                'Integrate findings'
            ],
            administrativeEssentials: [
                'Data access',
                'Matching tools',
                'Follow-up capacity'
            ],
            whenNotApplicable: [
                'Other databases not available',
                'Poor data quality'
            ],
            caseNotes: `Data integration is cost-effective for identifying users. Start with highest-quality data sources.`,
            resources: []
        },
        'GEN-COV-03': {
            legalEssentials: [
                'Authority for field enumeration',
                'Data collection requirements',
                'Privacy protections'
            ],
            howItWorks: `Conduct field identification:
- Deploy trained teams
- Systematic coverage of areas
- Record user information
- Update database`,
            implementationMilestones: [
                'Plan coverage areas',
                'Train teams',
                'Equip with tools',
                'Execute enumeration',
                'Process and integrate data'
            ],
            administrativeEssentials: [
                'Field teams',
                'Data collection tools',
                'Quality control'
            ],
            whenNotApplicable: [
                'Security constraints',
                'No field capacity',
                'Data sources adequate'
            ],
            caseNotes: `Field enumeration is labor-intensive but necessary for complete coverage, especially in informal areas.`,
            resources: []
        },
        'GEN-LIA-01': {
            legalEssentials: [
                'Authority to set/update fees',
                'Rate design framework',
                'Update provisions'
            ],
            howItWorks: `Update fee schedules:
- Review current fees vs. costs/value
- Design appropriate rate structure
- Implement graduated fees if warranted
- Update regularly`,
            implementationMilestones: [
                'Analyze current fees',
                'Design updated structure',
                'Obtain approval',
                'Implement',
                'Communicate changes'
            ],
            administrativeEssentials: [
                'Fee-setting authority',
                'Cost/value data',
                'Rate design capability'
            ],
            whenNotApplicable: [
                'No authority to change fees',
                'Fees recently updated',
                'Political constraints'
            ],
            caseNotes: `Fee updates should be regular and predictable. Communicating the rationale builds acceptance.`,
            resources: []
        },
        'GEN-LIA-02': {
            legalEssentials: [
                'Classification criteria',
                'Authority to reclassify',
                'Appeal provisions'
            ],
            howItWorks: `Ensure proper categorization:
- Review classification criteria
- Verify current classifications
- Correct errors
- Maintain accuracy`,
            implementationMilestones: [
                'Review criteria',
                'Assess current accuracy',
                'Correct misclassifications',
                'Establish ongoing verification',
                'Monitor'
            ],
            administrativeEssentials: [
                'Clear criteria',
                'Verification capacity',
                'Data correction capability'
            ],
            whenNotApplicable: [
                'Flat fee structure',
                'Classifications accurate',
                'No differentiation needed'
            ],
            caseNotes: `Classification accuracy is essential for fairness and revenue. Regular review catches drift.`,
            resources: []
        },
        'GEN-LIA-03': {
            legalEssentials: [
                'Authority for metering',
                'Billing based on usage',
                'Meter reading requirements'
            ],
            howItWorks: `Implement usage measurement:
- Install meters where feasible
- Establish reading schedule
- Bill based on actual usage
- Maintain meters`,
            implementationMilestones: [
                'Assess metering feasibility',
                'Procure and install meters',
                'Establish reading process',
                'Integrate with billing',
                'Maintain and calibrate'
            ],
            administrativeEssentials: [
                'Metering equipment',
                'Reading capacity',
                'Billing system integration'
            ],
            whenNotApplicable: [
                'Metering not feasible',
                'Cost exceeds benefit',
                'Usage is uniform'
            ],
            caseNotes: `Usage-based fees are fairer and can increase revenue where usage varies significantly. Start with largest users.`,
            resources: []
        }
    };

    // Merge all full details
    const ALL_FULL_DETAILS = {
        ...PT_COMPLIANCE_FULL,
        ...PT_COVERAGE_FULL,
        ...PT_VALUATION_FULL,
        ...BL_COMPLIANCE_FULL,
        ...BL_COVERAGE_FULL,
        ...BL_LIABILITY_FULL,
        ...GENERIC_FULL
    };

    // Public API
    const SolutionsFullDatabase = {
        // Get full details for a solution
        getFullDetails: function(solutionId) {
            return ALL_FULL_DETAILS[solutionId] || null;
        },

        // Check if full details exist
        hasFullDetails: function(solutionId) {
            return !!ALL_FULL_DETAILS[solutionId];
        },

        // Get complete solution with full details
        getCompleteSolution: function(solutionId) {
            // Get basic solution from SolutionsDatabase
            if (typeof SolutionsDatabase !== 'undefined') {
                const basic = SolutionsDatabase.getSolutionById(solutionId);
                if (basic) {
                    const full = ALL_FULL_DETAILS[solutionId] || this.getDefaultFullDetails(basic);
                    return { ...basic, ...full };
                }
            }
            return null;
        },

        // Generate default full details for solutions without specific content
        getDefaultFullDetails: function(basicSolution) {
            return {
                legalEssentials: [
                    'Review legal framework for implementation authority',
                    'Ensure regulatory requirements are met',
                    'Establish necessary bylaws or procedures'
                ],
                howItWorks: basicSolution.overview?.whatYouDo || 'Implement systematic approach to address the identified gap.',
                implementationMilestones: [
                    'Assess current situation and requirements',
                    'Design implementation approach',
                    'Build necessary capacity and systems',
                    'Pilot and test',
                    'Roll out and monitor'
                ],
                administrativeEssentials: [
                    'Staff training and capacity building',
                    'System or process development',
                    'Ongoing monitoring and maintenance'
                ],
                whenNotApplicable: [
                    'Insufficient resources or capacity',
                    'Legal or regulatory barriers',
                    'Context-specific constraints'
                ],
                caseNotes: 'Implementation experience varies by context. Adapt approach based on local conditions and available resources.',
                resources: []
            };
        },

        // Get all full details
        getAllFullDetails: function() {
            return { ...ALL_FULL_DETAILS };
        }
    };

    // Expose to global scope
    window.SolutionsFullDatabase = SolutionsFullDatabase;

})(window);
