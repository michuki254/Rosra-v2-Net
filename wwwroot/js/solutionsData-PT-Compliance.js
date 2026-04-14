/**
 * ROSRA Solutions Data - Property Tax Compliance
 * 17 cards: PT-COM-01 through PT-COM-17
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTCompliance = [

        // =====================================================================
        // A. MAKE BILLS AND REMINDERS WORK
        // =====================================================================

        {
            solutionId: 'PT-COM-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Send bills people can understand',
            shortTitle: 'Clear Bills',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low',
            category: 'Billing',
            sortOrder: 1,
            isActive: true,
            overview: {
                mainPurpose: 'Replace confusing, error-prone or inconsistent property tax bills with clear, standardized notices that show taxpayers exactly what they owe, why they owe it, and how to pay.',
                bestStartingPoint: 'Start by auditing the current bill: collect samples from several wards, list the complaints taxpayers raise most often, and identify the data fields that are missing or wrong. Then redesign the template with plain language, an itemized calculation, and a unique payment reference.',
                firstVisibleResult: 'Within the first billing cycle after rollout, front-desk complaints about bill errors and "I don\'t understand my bill" inquiries should drop noticeably, and call centre or help-desk staff should be able to resolve queries faster because the bill itself answers most questions.',
                leadershipDecision: 'Leaders must decide on the level of itemization (showing assessed value, rate, exemptions, and net amount on every bill) and whether to invest in bilingual or multilingual templates where the population requires it.',
                likelyLeadOwner: 'Revenue department billing unit, with IT support for template generation and data integration from the property register and valuation roll.',
                whatThisOptionDoes: 'Redesigns the property tax bill template so that each notice shows the property identifier, owner name, assessed value, applicable rate, any exemptions or adjustments, net amount due, due date, penalty schedule, and at least one easy payment channel with a unique reference code. The bill is written in plain language and can be understood without specialist knowledge.',
                mostUsefulWhen: [
                    'Billing errors, unexplained amounts, or taxpayer confusion are common sources of complaint or non-payment.',
                    'Assessment, ownership, or exemption data already exist in digital form but the city is not presenting them clearly to taxpayers.',
                    'Leadership wants a stronger foundation for reminders, payment channels, and later enforcement, all of which depend on a credible bill.',
                    'The city is preparing to introduce or expand digital payment options and needs a unique reference on every bill.'
                ],
                usuallyNotBestFirstMove: [
                    'The property register is so incomplete that most bills would go to wrong addresses or missing owners; fix coverage first.',
                    'Valuation data is absent or wildly inaccurate, meaning the amounts on the bill would not be defensible even if the format were perfect.',
                    'The city issues fewer than a few hundred bills per year and can manage individually drafted notices without a standardized template.'
                ],
                whatFullCardWouldPlan: 'A full implementation plan would cover template design workshops with taxpayer feedback, IT specifications for pulling data from the register and valuation roll, a pilot in one or two wards, a feedback loop to fix errors before city-wide rollout, staff training on the new format, and a communication campaign explaining the redesigned bill to the public.',
                oftenWorksBestAlongside: [
                    'PT-COM-02 (Make sure bills actually reach taxpayers) because a clear bill that never arrives still produces zero compliance.',
                    'PT-COM-03 (Reminder messages) because reminders reference the bill and reinforce its content.',
                    'PT-COM-04 (Easy payment channels) because the bill should advertise every available way to pay.',
                    'PT-COM-15 (Help desk) because even good bills generate some queries, and a help desk resolves them quickly.'
                ],
                politicalNote: 'Clear bills are almost universally popular with taxpayers and elected officials. The only political risk arises if improved clarity reveals how much tax has increased or exposes inconsistencies in how exemptions have been applied.'
            },
            fullDetails: {
                whyThisMatters: 'A city cannot expect steady payment when bills are confusing, inconsistent, or hard to verify. Clear bills are the basic translation layer between the property register, the assessment process, and the taxpayer. They help taxpayers see that the demand is rule-based, they reduce avoidable disputes, and they make reminders and enforcement easier to defend. International evidence consistently shows that taxpayer understanding of the bill is one of the strongest predictors of voluntary compliance.',
                whenStrongFit: [
                    'Taxpayer surveys or front-desk data show that a significant share of complaints relate to unclear or incorrect bills.',
                    'The city already holds reasonable property and valuation data in digital form but produces bills that omit key information.',
                    'Leadership is planning to roll out digital payments, reminders, or enforcement and needs each bill to carry a unique reference.',
                    'A new billing cycle or fiscal year is approaching, providing a natural moment to introduce a redesigned template.'
                ],
                whatToLineUpFirst: [
                    'Confirm that property register and valuation data are accurate enough that bills generated from them will be broadly correct.',
                    'Agree on the legal requirements for a valid bill (which fields must appear, what language, signature or seal requirements).',
                    'Secure IT capacity to generate bills from the database and embed a unique payment reference for each taxpayer.',
                    'Draft the new template and test it with a small group of taxpayers for readability before printing at scale.'
                ],
                designChoices: [
                    'Level of itemization: show just the net amount, or break out assessed value, rate, exemptions, and penalty schedule line by line.',
                    'Language: single language or bilingual/multilingual depending on population needs.',
                    'Payment reference format: numeric code, QR code, USSD string, or all three.',
                    'Delivery-ready format: design for envelope-window printing, SMS-friendly summary, or both.',
                    'Branding: whether to include the city crest, mayor signature, or service-delivery pledge to build legitimacy.'
                ],
                practicalPath: {
                    first90Days: [
                        'Collect 50-100 sample bills from different wards and catalogue the most common errors, omissions, and taxpayer complaints.',
                        'Convene a small design team (revenue, IT, communications) to draft a new template with plain-language explanations.',
                        'Test the draft with 20-30 taxpayers from different literacy levels and income groups; revise based on feedback.',
                        'Confirm that the billing system can populate all required fields from existing data and flag records with missing information.'
                    ],
                    sixTo12Months: [
                        'Pilot the new bill in one or two wards during the next billing cycle; track complaint rates, payment speed, and help-desk volume.',
                        'Fix data-quality issues surfaced by the pilot (wrong names, missing addresses, incorrect exemptions).',
                        'Train front-desk and call-centre staff to explain the new bill format and handle common queries.',
                        'Prepare for city-wide rollout by scaling print production, SMS gateway capacity, or portal display.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Roll out the redesigned bill to all wards; run a short public information campaign explaining the new format.',
                        'Compare complaint rates, on-time payment rates, and average days to payment before and after the new bill.',
                        'Refine the template annually based on taxpayer feedback and emerging payment channel options.',
                        'Integrate the bill template with reminder and enforcement letter sequences so messaging is consistent.'
                    ]
                },
                legalInstitutional: [
                    'Review the revenue code or bylaws to confirm minimum content requirements for a legally valid property tax notice.',
                    'If electronic bills are planned, ensure legislation recognizes electronic delivery as valid legal notice.',
                    'Establish a formal approval process for bill template changes so that future edits do not accidentally omit required fields.',
                    'Confirm data-protection compliance for displaying property values and owner names on the bill.'
                ],
                capacitySystemsPartnerships: [
                    'IT unit or vendor capable of modifying the billing module to output the new template from the property database.',
                    'Print vendor or in-house print shop that can handle the volume and envelope-window alignment.',
                    'SMS or email gateway if digital bill delivery is included.',
                    'Communications or graphic design support for layout, readability testing, and multilingual translation.'
                ],
                risksAndSafeguards: [
                    'Risk: Data errors become more visible on a clear bill, embarrassing the city. Safeguard: Run a data-cleaning pass before the first print run and set up a fast-track correction process.',
                    'Risk: Taxpayers see the itemized calculation and dispute the assessed value. Safeguard: Ensure the appeals process is ready and referenced on the bill.',
                    'Risk: Template redesign delays the billing cycle. Safeguard: Set a hard deadline for template sign-off and fall back to the old format if the new one is not ready.',
                    'Risk: Multilingual bills increase print costs. Safeguard: Use digital channels for secondary languages and print only the primary language.'
                ],
                whatToMonitor: [
                    'Share of bills generated without errors (target: above 95% within two cycles).',
                    'Number of "bill unclear" complaints per 1,000 bills issued, compared to the prior year.',
                    'Average number of days from bill issuance to first payment, tracked by ward.',
                    'Help-desk call volume related to billing questions in the weeks after bill distribution.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-02 (Bill delivery): A clear bill must also be delivered; these two cards are a natural pair.',
                    'PT-COM-03 (Reminders): Reminder messages reference the bill amount and due date; consistency matters.',
                    'PT-COM-04 (Payment channels): The bill advertises payment options; add new channels to the bill as they launch.',
                    'PT-COM-07 (Receipting): The unique payment reference on the bill should match the receipt, creating a closed loop.',
                    'PT-COM-15 (Help desk): Even good bills produce queries; a help desk handles them without clogging the revenue office.'
                ],
                questionsBeforeLaunch: [
                    'Can the billing system reliably populate every field on the new template from existing data, or are there gaps that need filling first?',
                    'Has the new bill been tested with taxpayers who have low literacy or who speak a minority language?',
                    'Is the appeals process ready to handle a potential spike in valuation queries once taxpayers see itemized calculations?',
                    'Does the print or digital delivery timeline allow the new bill to be issued on schedule for the upcoming fiscal year?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Make sure bills actually reach taxpayers',
            shortTitle: 'Bill Delivery',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low-Medium',
            category: 'Delivery',
            sortOrder: 2,
            isActive: true,
            overview: {
                mainPurpose: 'Close the gap between bills generated and bills received by taxpayers, using multiple delivery channels and tracking delivery success so that no taxpayer can credibly claim they were never notified.',
                bestStartingPoint: 'Measure the current delivery failure rate by comparing bills dispatched to bills returned or unacknowledged. Then map available channels (post, hand delivery, SMS, email, WhatsApp, portal) and match each taxpayer segment to the most reliable channel.',
                firstVisibleResult: 'Within one billing cycle, the share of taxpayers who acknowledge receiving a bill (by paying, calling, or logging in) should rise measurably, and the "I never got a bill" excuse at enforcement stage should decline.',
                leadershipDecision: 'Leaders must decide how much to invest in multi-channel delivery versus relying on a single method, and whether to accept electronic delivery as legally sufficient notice.',
                likelyLeadOwner: 'Revenue department operations unit, working with IT for digital channels and ward administrators for physical delivery.',
                whatThisOptionDoes: 'Establishes a multi-channel bill delivery system that combines physical delivery (post or hand delivery) with digital channels (SMS with payment link, email with PDF, WhatsApp, taxpayer portal). Each delivery is tracked, and undelivered bills trigger a tracing workflow so that the city can demonstrate due diligence in notification.',
                mostUsefulWhen: [
                    'A large share of bills are never received, either because addresses are wrong, postal service is unreliable, or taxpayers are absent.',
                    'The city relies on a single delivery method that has a high failure rate.',
                    'Mobile phone penetration is high enough that SMS or WhatsApp can serve as a primary or backup channel.',
                    'The city is preparing to enforce penalties or legal action and needs proof that taxpayers were properly notified.'
                ],
                usuallyNotBestFirstMove: [
                    'The bill itself is so confusing or inaccurate that delivering it will generate more complaints than payments; fix the bill first (PT-COM-01).',
                    'The property register has very few valid addresses or contact details; invest in data collection before delivery optimization.',
                    'The city has fewer than a few hundred taxpayers and can manage personal delivery without a system.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover channel selection and cost analysis, integration with the billing system for automated dispatch, delivery tracking and reporting dashboards, an undelivered-bill tracing workflow, legal review of electronic notice validity, and a taxpayer contact-data improvement campaign.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because delivering a confusing bill wastes the delivery effort.',
                    'PT-COM-03 (Reminders) because reminders serve as a secondary confirmation that the bill was received.',
                    'PT-COM-10 (Overdue notice ladder) because enforcement letters depend on proof of prior delivery.',
                    'PT-COM-15 (Help desk) because some delivery failures are reported by taxpayers who received a neighbour\'s bill or a bill with wrong details.'
                ],
                politicalNote: 'Improving delivery is generally seen as a fairness measure. The only sensitivity arises if hand delivery by ward officials is perceived as intimidation, or if digital delivery excludes elderly or low-income taxpayers who lack phones.'
            },
            fullDetails: {
                whyThisMatters: 'Fair collection starts with credible notice. If a large share of taxpayers never receives a bill, late-payment penalties and stronger enforcement will look arbitrary, and courts or ombudsmen may side with the taxpayer. Reliable delivery also closes the most common loophole for deliberate non-payers: the claim that they were never informed. In many cities, delivery failure rates of 30-50% are common, meaning the city is effectively forgiving a third or more of its tax base before enforcement even begins.',
                whenStrongFit: [
                    'Delivery failure rates exceed 20% based on returned mail, unclaimed portal bills, or low payment rates despite accurate billing.',
                    'Mobile phone ownership is above 60% in the jurisdiction, making SMS or WhatsApp viable backup channels.',
                    'The city is about to launch or strengthen enforcement and needs a defensible record of notification.',
                    'Taxpayer contact data (phone numbers, emails) exist in the register or can be collected during the next payment cycle.'
                ],
                whatToLineUpFirst: [
                    'Audit current delivery performance: what share of bills dispatched result in a payment, query, or acknowledgment?',
                    'Inventory taxpayer contact data: how many records have a valid phone number, email, or verified physical address?',
                    'Confirm legal requirements for valid notice: does the law require physical delivery, or is electronic notice acceptable?',
                    'Identify and budget for delivery channels: SMS gateway costs, postal rates, hand-delivery logistics, portal hosting.'
                ],
                designChoices: [
                    'Primary channel: physical post, hand delivery by ward staff, or digital-first with physical as backup.',
                    'Tracking method: delivery receipts for physical, read receipts or click tracking for digital, payment as implicit confirmation.',
                    'Escalation trigger: how many days after dispatch before an unacknowledged bill triggers the tracing workflow.',
                    'Contact-data collection: mandatory phone number at next payment, voluntary update campaign, or cross-reference with utility records.'
                ],
                practicalPath: {
                    first90Days: [
                        'Measure the current delivery success rate by analysing payment rates, returned mail, and help-desk "never received" complaints.',
                        'Collect or verify taxpayer phone numbers and emails during any in-person interaction (payment, query, permit application).',
                        'Set up an SMS gateway and test bulk message delivery with a sample of 500-1,000 taxpayers.',
                        'Design a simple tracking spreadsheet or dashboard that logs dispatch date, channel, and acknowledgment for each bill.'
                    ],
                    sixTo12Months: [
                        'For the next billing cycle, dispatch bills through at least two channels per taxpayer (e.g., physical plus SMS).',
                        'Monitor delivery and acknowledgment rates by channel and ward; identify the worst-performing areas.',
                        'Implement an undelivered-bill tracing workflow: after 14 days with no acknowledgment, re-attempt via alternative channel or assign to ward staff for physical visit.',
                        'Report delivery performance to leadership monthly and flag wards where delivery failure exceeds a threshold.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Refine channel mix based on data: shift resources toward channels with the highest delivery-to-payment conversion.',
                        'Integrate delivery tracking into the billing system so that dispatch, acknowledgment, and payment are visible on a single screen.',
                        'Publish delivery statistics as part of the city\'s transparency reporting to build public confidence.',
                        'Set a target to reduce the undelivered rate below 10% and monitor progress quarterly.'
                    ]
                },
                legalInstitutional: [
                    'Review whether the revenue code requires physical delivery or allows electronic notice; if amendment is needed, prepare a bylaw.',
                    'Establish rules for when delivery is deemed complete (e.g., SMS sent to registered number counts as notice after 7 days).',
                    'Ensure data-protection compliance for storing and using taxpayer phone numbers and email addresses.',
                    'Create a standard delivery log that can serve as evidence in enforcement or court proceedings.'
                ],
                capacitySystemsPartnerships: [
                    'SMS gateway provider with bulk-messaging capability and delivery-receipt reporting.',
                    'Ward administrators or community leaders who can support physical delivery and tracing in hard-to-reach areas.',
                    'IT capacity to integrate dispatch and tracking with the billing system.',
                    'Postal service or courier agreement for reliable physical delivery where needed.'
                ],
                risksAndSafeguards: [
                    'Risk: SMS messages are ignored or treated as spam. Safeguard: Use a recognized sender name, keep messages short, and include a clear call to action with payment link.',
                    'Risk: Hand delivery by ward staff is seen as intimidation. Safeguard: Train delivery staff on respectful interaction and provide them with official identification.',
                    'Risk: Contact data is outdated, leading to messages going to wrong recipients. Safeguard: Verify contact data at every taxpayer touchpoint and flag stale records.',
                    'Risk: Delivery costs exceed budget. Safeguard: Prioritize digital channels for lower-cost delivery and reserve physical delivery for high-value accounts or enforcement-stage taxpayers.'
                ],
                whatToMonitor: [
                    'Delivery success rate by channel: share of bills acknowledged (payment, call, click) within 30 days of dispatch.',
                    'Undelivered-bill tracing resolution rate: share of undelivered bills resolved within 60 days.',
                    'Cost per successful delivery by channel, to guide future budget allocation.',
                    'Reduction in "I never got a bill" claims at enforcement stage, compared to prior year.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): Delivery is wasted if the bill is confusing; these two cards form the billing foundation.',
                    'PT-COM-03 (Reminders): Reminders serve as a secondary delivery confirmation and reinforce the bill message.',
                    'PT-COM-10 (Overdue notice ladder): Enforcement letters must reference prior delivery; the tracking log provides proof.',
                    'PT-COM-12 (Visit major defaulters): Physical visits can double as delivery confirmation for high-value cases.'
                ],
                questionsBeforeLaunch: [
                    'What share of taxpayer records have at least one valid contact method (address, phone, or email)?',
                    'Does the law recognize electronic delivery as valid notice, or is a bylaw amendment needed?',
                    'Is there budget for an SMS gateway and bulk messaging, or will the city rely on free channels like WhatsApp?',
                    'Who will manage the undelivered-bill tracing workflow, and do they have the authority to assign ward staff to follow up?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Use reminder messages before and after due dates',
            shortTitle: 'Payment Reminders',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low',
            politicalSensitivity: 'Low',
            category: 'Reminders',
            sortOrder: 3,
            isActive: true,
            overview: {
                mainPurpose: 'Nudge willing-but-forgetful taxpayers into paying on time by sending a short sequence of reminder messages that escalate in urgency from friendly to firm around the due date.',
                bestStartingPoint: 'Map the current billing calendar, identify the due date, and design three to five message templates at fixed intervals (e.g., 30 days before, 7 days before, due date, 7 days after, 30 days after). Secure an SMS or messaging channel and test with a small batch.',
                firstVisibleResult: 'Within the first reminder cycle, on-time payment rates should increase by 5-15%, particularly among smaller residential taxpayers who were simply forgetting or procrastinating.',
                leadershipDecision: 'Leaders need to approve the message tone and frequency, particularly the post-due-date messages that reference penalties, to ensure they are firm but not threatening.',
                likelyLeadOwner: 'Revenue department billing or communications unit, with IT support for scheduling and the SMS gateway.',
                whatThisOptionDoes: 'Establishes an automated or semi-automated sequence of reminder messages sent to taxpayers at defined intervals before and after the payment due date. Pre-due-date messages are friendly and informational; post-due-date messages reference penalties, interest, and the next enforcement step. Each message includes the amount due and a payment link or reference.',
                mostUsefulWhen: [
                    'A large share of taxpayers eventually pay but do so late, suggesting willingness but poor timing or forgetfulness.',
                    'The city already has taxpayer phone numbers or email addresses from the property register or prior payment records.',
                    'An SMS gateway or WhatsApp Business API is available or can be set up cheaply.',
                    'The city has a clear penalty schedule that can be referenced in the messages to add urgency.'
                ],
                usuallyNotBestFirstMove: [
                    'Most non-payment is deliberate refusal rather than forgetfulness; reminders alone will not solve deep resistance.',
                    'The city does not have reliable contact data for most taxpayers; invest in contact-data collection first.',
                    'Bills have not been sent at all or are so inaccurate that reminding people about a wrong amount will cause backlash.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover message template design and approval, SMS gateway procurement, scheduling rules, integration with the billing system, A/B testing of message wording, tracking of reminder-to-payment conversion, and a feedback loop to refine timing and content.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the reminder references the bill and its details.',
                    'PT-COM-02 (Bill delivery) because taxpayers who received the bill are more likely to respond to reminders.',
                    'PT-COM-04 (Easy payment channels) because the reminder should include a direct payment link.',
                    'PT-COM-06 (Early-payment discount) because the pre-due-date reminder can advertise the discount deadline.'
                ],
                politicalNote: 'Reminder messages are low-risk politically. Taxpayers generally appreciate the courtesy. The only caution is avoiding language that feels harassing, especially in post-due-date messages to vulnerable populations.'
            },
            fullDetails: {
                whyThisMatters: 'A reminder system is often the cheapest and fastest way to improve compliance among taxpayers who are willing to pay but late by habit, oversight, or poor timing. Behavioral research across dozens of countries shows that well-timed, personalized reminders increase on-time payment by 5-15% with minimal cost. The messages also signal that the city is watching, which deters casual non-compliance. Without reminders, a single bill issuance is the city\'s only touchpoint with the taxpayer, and if that bill is lost or forgotten, the city has no second chance until enforcement.',
                whenStrongFit: [
                    'Payment data shows a large share of revenue arriving 30-90 days late, suggesting willingness but poor timing.',
                    'The city holds phone numbers for at least 50% of taxpayers and can reach them via SMS or messaging apps.',
                    'SMS or WhatsApp gateway costs are affordable relative to the expected revenue uplift.',
                    'The billing calendar has a clear due date that can anchor the reminder sequence.'
                ],
                whatToLineUpFirst: [
                    'Verify that taxpayer contact data (phone numbers, emails) is available and reasonably current.',
                    'Select and contract an SMS gateway or messaging platform that supports bulk scheduling and delivery receipts.',
                    'Draft message templates for each stage of the sequence and get leadership approval on tone and content.',
                    'Confirm the penalty schedule so that post-due-date messages can reference specific consequences accurately.'
                ],
                designChoices: [
                    'Number of messages: a three-message sequence (pre, due date, post) or a five-message sequence with two pre and two post reminders.',
                    'Tone escalation: purely informational at every stage, or escalating from friendly to firm to warning.',
                    'Personalization depth: just the amount due and due date, or include property address, owner name, and payment history.',
                    'Channel: SMS only, or add WhatsApp, email, and automated voice calls for different segments.',
                    'Opt-out: whether to allow taxpayers to opt out of reminders (not recommended for statutory obligations but may be required by communications regulations).'
                ],
                practicalPath: {
                    first90Days: [
                        'Analyse payment timing data to identify the share of taxpayers who pay late versus those who never pay; size the reminder opportunity.',
                        'Select an SMS gateway provider and negotiate bulk rates; test delivery to a sample of 500 numbers.',
                        'Draft five message templates: 30 days before (friendly), 7 days before (informational), due date (urgent), 7 days after (warning), 30 days after (final notice with penalty reference).',
                        'Get leadership sign-off on message content, especially the post-due-date language.'
                    ],
                    sixTo12Months: [
                        'Launch the reminder sequence for the current or next billing cycle; send to all taxpayers with valid phone numbers.',
                        'Track open rates, click-through on payment links, and conversion to payment within 7 days of each message.',
                        'A/B test variations: different send times, different wording, inclusion of the mayor\'s name, or social-norm messaging ("80% of your neighbours have already paid").',
                        'Report results to leadership monthly, highlighting the revenue uplift attributable to reminders.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Refine the sequence based on data: adjust timing, drop underperforming messages, strengthen high-converting ones.',
                        'Expand to additional channels (WhatsApp, email) for taxpayers who do not respond to SMS.',
                        'Integrate reminder scheduling into the billing system so that reminders are triggered automatically when bills are issued.',
                        'Use reminder response data to segment taxpayers: those who respond to reminders (keep nudging), those who never respond (escalate to enforcement).'
                    ]
                },
                legalInstitutional: [
                    'Confirm that sending SMS or electronic reminders about tax obligations is permitted under communications and data-protection laws.',
                    'Ensure that post-due-date messages accurately state the penalty and interest rules as enacted in the revenue code.',
                    'Establish that reminders do not constitute legal notice for enforcement purposes (they supplement, not replace, formal notices).',
                    'Create an audit trail of messages sent, in case a taxpayer disputes having been informed.'
                ],
                capacitySystemsPartnerships: [
                    'SMS gateway provider with scheduling, personalization, and delivery-receipt capabilities.',
                    'IT integration to pull amount due, due date, and contact details from the billing system into the message template.',
                    'Staff capacity to handle increased payment-related calls after each reminder batch is sent.',
                    'Analytics capability to track reminder-to-payment conversion and report on ROI.'
                ],
                risksAndSafeguards: [
                    'Risk: Reminders sent with wrong amounts due to data errors. Safeguard: Validate data before each batch and include a help-desk number for corrections.',
                    'Risk: Taxpayers perceive frequent messages as harassment. Safeguard: Limit to five messages per billing cycle and use respectful, official language.',
                    'Risk: SMS costs exceed the revenue uplift. Safeguard: Track cost-per-payment-converted and discontinue channels that do not pay for themselves.',
                    'Risk: Vulnerable taxpayers are distressed by penalty warnings. Safeguard: Include information about installment plans or hardship provisions in post-due-date messages.'
                ],
                whatToMonitor: [
                    'Payment conversion rate within 7 days of each reminder message.',
                    'On-time payment rate compared to the same period in the prior year.',
                    'SMS delivery success rate (messages actually received versus sent).',
                    'Help-desk call volume in the days following each reminder batch.',
                    'Cost per additional payment collected through the reminder program.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): Reminders reinforce the bill; if the bill is confusing, reminders will generate complaints rather than payments.',
                    'PT-COM-04 (Easy payment channels): Every reminder should include a direct payment link or reference code.',
                    'PT-COM-06 (Early-payment discount): Pre-due-date reminders should highlight the discount deadline.',
                    'PT-COM-10 (Overdue notice ladder): Reminders are the soft end of the escalation; the overdue ladder is the formal end.',
                    'PT-COM-11 (Late-payment penalties): Post-due-date reminders reference the penalty schedule, so the two cards must be consistent.'
                ],
                questionsBeforeLaunch: [
                    'What share of taxpayers have a valid, current phone number in the billing database?',
                    'Has the penalty schedule been confirmed and published, so that post-due-date messages are accurate?',
                    'Is there budget for SMS gateway costs, and what is the break-even number of additional payments needed?',
                    'Who will monitor delivery rates and payment conversions after each batch, and how quickly can message content be adjusted?'
                ]
            }
        },

        // =====================================================================
        // B. MAKE PAYMENT EASY AND TRUSTWORTHY
        // =====================================================================

        {
            solutionId: 'PT-COM-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Add easy payment channels close to the taxpayer',
            shortTitle: 'Easy Payment Channels',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low',
            category: 'Payment',
            sortOrder: 4,
            isActive: true,
            overview: {
                mainPurpose: 'Reduce the time, cost, and effort taxpayers spend making a payment by offering multiple convenient channels including mobile money, bank transfers, agent networks, and ward-level counters, so that paying is easier than avoiding payment.',
                bestStartingPoint: 'Inventory the current payment channels available to taxpayers, calculate the average travel time and queue time for each, and identify the mobile money and banking platforms already in widespread use in the jurisdiction. Then negotiate integration with one or two platforms for a quick win.',
                firstVisibleResult: 'Within three to six months of adding a new channel, payment volume through that channel should be visible, and overall on-time payment rates should begin rising, particularly among taxpayers in areas far from the central revenue office.',
                leadershipDecision: 'Leaders must decide which channels to prioritize, how much to invest in integration, and whether to accept the transaction fees charged by mobile money or banking partners.',
                likelyLeadOwner: 'Revenue department with IT and finance support, plus partnership management with mobile money operators or banks.',
                whatThisOptionDoes: 'Expands the number and type of payment channels available to property taxpayers beyond the central revenue office counter. Options include mobile money (M-Pesa, Airtel Money), bank transfers, agent banking networks, USSD-based payment, online portal, and ward-level collection points. Each channel uses the unique payment reference from the bill to ensure automatic reconciliation.',
                mostUsefulWhen: [
                    'Taxpayers must currently travel long distances or queue for hours to make a payment at the central office.',
                    'Mobile money penetration is high and taxpayers are comfortable making payments via phone.',
                    'The billing system already generates unique payment references that can be used across channels.',
                    'Non-payment surveys or anecdotal evidence suggest that inconvenience is a major barrier.'
                ],
                usuallyNotBestFirstMove: [
                    'The billing system cannot generate unique payment references, making reconciliation across channels impossible.',
                    'Mobile money and banking infrastructure are very weak in the jurisdiction.',
                    'The primary barrier to payment is not inconvenience but rather refusal, affordability, or lack of billing; address those first.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover channel selection and cost-benefit analysis, technical integration with billing and reconciliation systems, partnership agreements with mobile money operators and banks, a taxpayer communication campaign about new payment options, staff training, and a monitoring framework for channel performance.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the bill must advertise the available payment channels and include the reference code.',
                    'PT-COM-03 (Reminders) because reminder messages should include a direct payment link for the new channels.',
                    'PT-COM-07 (Receipting) because every channel must issue a receipt to build trust.',
                    'PT-COM-08 (Cash handling controls) because more channels mean more reconciliation points.'
                ],
                politicalNote: 'Expanding payment channels is popular with taxpayers and usually welcomed by elected officials. The main political risk is if transaction fees reduce net revenue or if a channel fails and payments are lost.'
            },
            fullDetails: {
                whyThisMatters: 'Payment friction is one of the most underestimated causes of non-compliance. When paying requires a half-day trip to a distant office, standing in a long queue, and dealing with unhelpful staff, many taxpayers who are otherwise willing to pay simply do not. Every additional hour of inconvenience raises the effective cost of compliance beyond the tax itself. By contrast, when payment is as easy as sending a mobile money transfer from home, the barrier drops to near zero. Cities that have expanded payment channels in East Africa, South Asia, and Latin America consistently report 15-30% increases in collection rates.',
                whenStrongFit: [
                    'The city has only one or two payment locations, and taxpayers in outlying wards face significant travel costs.',
                    'Mobile money usage is already common for other transactions (utilities, phone credit, person-to-person transfers).',
                    'The billing system supports unique payment references, enabling automatic crediting across channels.',
                    'The city is willing to absorb or pass through reasonable transaction fees for the convenience benefit.'
                ],
                whatToLineUpFirst: [
                    'Ensure every bill carries a unique payment reference that works across all channels.',
                    'Identify the two or three most widely used payment platforms in the jurisdiction and open negotiations.',
                    'Set up or upgrade the reconciliation system so that payments from any channel are posted to the correct taxpayer account within 24 hours.',
                    'Budget for integration costs, transaction fees, and any hardware needed for ward-level counters.'
                ],
                designChoices: [
                    'Channel priority: mobile money first (lowest barrier) or bank integration first (higher value per transaction).',
                    'Fee absorption: city absorbs transaction fees, taxpayer pays, or split depending on channel.',
                    'Ward counters: staffed daily, weekly market days only, or mobile collection teams on a rotation.',
                    'Online portal: full self-service with payment history, or simple pay-now page linked from the bill.',
                    'Agent networks: use existing mobile money agents, or recruit dedicated tax-collection agents in each ward.'
                ],
                practicalPath: {
                    first90Days: [
                        'Survey taxpayers on preferred payment methods and willingness to pay through mobile money.',
                        'Negotiate a pilot agreement with the dominant mobile money provider (e.g., M-Pesa paybill number).',
                        'Configure the billing system to generate payment references compatible with the mobile money platform.',
                        'Test end-to-end: bill generation, mobile payment, reconciliation, and receipt issuance with 100 taxpayers.'
                    ],
                    sixTo12Months: [
                        'Launch the mobile money channel city-wide, advertised on every bill and reminder message.',
                        'Add a second channel (bank transfer or online portal) to capture taxpayers who prefer those options.',
                        'Set up ward-level collection points for in-person payment, operating at least on market days.',
                        'Monitor daily reconciliation accuracy and fix any mismatches within 48 hours.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Analyse channel usage data to determine which channels have the highest uptake and lowest cost per transaction.',
                        'Phase out underperforming channels and invest in scaling the best performers.',
                        'Integrate payment history into a taxpayer-facing portal so property owners can see their account status at any time.',
                        'Negotiate lower transaction fees based on volume as mobile money payments scale up.'
                    ]
                },
                legalInstitutional: [
                    'Confirm legal authority to receive tax payments through third-party agents and electronic platforms.',
                    'Establish the legal status of electronic receipts generated by mobile money platforms.',
                    'Create a framework for revenue-sharing or fee arrangements with payment service providers.',
                    'Ensure that payments received through any channel have the same legal standing as over-the-counter payments.'
                ],
                capacitySystemsPartnerships: [
                    'IT capacity to integrate billing system APIs with mobile money and banking platforms.',
                    'Finance unit capable of daily multi-channel reconciliation.',
                    'Partnership agreements with mobile money operators, banks, and agent network managers.',
                    'Ward-level staff trained to operate collection points and issue receipts using handheld devices or receipt books.'
                ],
                risksAndSafeguards: [
                    'Risk: Payment is made but not reconciled, and the taxpayer is still shown as owing. Safeguard: Automated reconciliation with exception alerts and a 48-hour resolution target.',
                    'Risk: Transaction fees erode net revenue. Safeguard: Negotiate volume-based fee reductions and compare net collection gain against fee cost.',
                    'Risk: Fraud through fake payment confirmations. Safeguard: Validate every payment against the mobile money provider\'s API before crediting the taxpayer account.',
                    'Risk: Ward-level cash collection creates corruption opportunities. Safeguard: Prefer cashless channels; where cash is collected, enforce daily deposit and reconciliation rules (see PT-COM-08).'
                ],
                whatToMonitor: [
                    'Payment volume and value by channel, tracked weekly.',
                    'Reconciliation accuracy: share of payments posted correctly within 24 hours.',
                    'Average time-to-payment from bill issuance, compared to the prior year.',
                    'Transaction fee cost as a percentage of revenue collected, by channel.',
                    'Taxpayer satisfaction with payment convenience, measured through periodic surveys.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): Bills must list all available payment channels and include the reference code.',
                    'PT-COM-03 (Reminders): Reminder messages should include a direct mobile-money payment link.',
                    'PT-COM-07 (Receipting): Every channel must produce a verifiable receipt.',
                    'PT-COM-08 (Cash handling controls): More channels mean more reconciliation complexity; controls must keep pace.',
                    'PT-COM-09 (Collections tracking): Weekly tracking must include data from all channels.'
                ],
                questionsBeforeLaunch: [
                    'Can the billing system generate payment references that work with the target mobile money platform\'s format?',
                    'What transaction fees will the mobile money provider charge, and who will absorb them?',
                    'Is the reconciliation system capable of handling daily multi-channel payment posting?',
                    'Are ward-level collection points feasible given staffing, security, and connectivity constraints?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Allow payment in installments for eligible taxpayers',
            shortTitle: 'Installment Plans',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Payment',
            sortOrder: 5,
            isActive: true,
            overview: {
                mainPurpose: 'Enable taxpayers who cannot afford a single lump-sum payment to clear their bill over two to four scheduled installments, recovering revenue that would otherwise be lost entirely to non-payment due to affordability constraints.',
                bestStartingPoint: 'Analyse payment data to estimate how many taxpayers are not paying because of lump-sum affordability barriers versus other reasons. Then design a simple installment schedule (e.g., quarterly) with clear eligibility rules, and configure the billing system to track partial payments.',
                firstVisibleResult: 'Within one billing cycle, taxpayers who previously paid nothing because the full amount was unaffordable should begin making first-installment payments, and total revenue collected should increase even though individual payments are smaller.',
                leadershipDecision: 'Leaders must decide on eligibility criteria (all taxpayers, or only residential below a threshold), the number of installments, whether interest is charged on the deferred balance, and consequences for missing an installment.',
                likelyLeadOwner: 'Revenue department billing unit, with finance and legal input on installment terms and default rules.',
                whatThisOptionDoes: 'Introduces a structured installment payment option where eligible taxpayers can split their annual property tax bill into two, three, or four equal payments at defined intervals. The billing system generates an installment schedule with specific due dates for each payment. Reminders are sent before each installment. If an installment is missed, the remaining balance may become immediately due.',
                mostUsefulWhen: [
                    'Analysis of non-payment suggests that a meaningful share of taxpayers are willing but unable to pay in a single lump sum.',
                    'Average property tax bills are large relative to household income, particularly for residential properties.',
                    'The billing system can track partial payments and generate installment-specific reminders.',
                    'The city prefers to recover partial revenue from struggling taxpayers rather than nothing at all.'
                ],
                usuallyNotBestFirstMove: [
                    'Average bill amounts are already very small (under a few dollars), making installments unnecessary and administratively costly.',
                    'The billing system cannot track partial payments or generate installment schedules.',
                    'Non-payment is driven by refusal or lack of billing rather than affordability.',
                    'The city has no capacity to follow up on missed installments, which would undermine the program\'s credibility.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover eligibility criteria design, installment schedule options, system configuration for partial-payment tracking, legal framework for installment agreements, default rules and enforcement, taxpayer communication, and monitoring of uptake and completion rates.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the bill should explain the installment option clearly.',
                    'PT-COM-03 (Reminders) because each installment due date needs its own reminder.',
                    'PT-COM-04 (Easy payment channels) because installment payments must be convenient to sustain compliance over multiple dates.',
                    'PT-COM-11 (Late-payment penalties) because the penalty framework must be adapted for installment schedules.'
                ],
                politicalNote: 'Installment plans are moderately sensitive. They are popular with taxpayers, but elected officials may worry about setting a precedent, reducing urgency, or appearing to lower the tax burden. Clear communication that the full amount is still owed, just spread over time, helps manage this.'
            },
            fullDetails: {
                whyThisMatters: 'Lump-sum payment requirements are a significant barrier to compliance in many developing-country cities where household incomes are irregular and property tax bills represent a large one-time expense. When a taxpayer who owes the equivalent of two weeks\' income receives a single bill with a single due date, the rational response may be to ignore it entirely and hope for the best. Installment plans convert these zero-payers into partial and eventually full payers. Evidence from multiple countries shows that installment options can recover 40-60% of revenue that would otherwise go uncollected from the affordability-constrained segment.',
                whenStrongFit: [
                    'Payment data shows that many taxpayers pay nothing rather than a partial amount, suggesting affordability barriers.',
                    'The average residential property tax bill exceeds 1-2% of median monthly household income.',
                    'The billing system supports partial-payment tracking and can generate installment schedules.',
                    'The city has the administrative capacity to manage installment agreements and follow up on defaults.'
                ],
                whatToLineUpFirst: [
                    'Analyse non-payment patterns to estimate the share attributable to affordability versus other causes.',
                    'Define eligibility criteria: property type, bill amount threshold, payment history, or application-based.',
                    'Configure the billing system to split a bill into installments, track payments against each installment, and trigger reminders.',
                    'Draft the legal terms for installment agreements, including consequences for default.'
                ],
                designChoices: [
                    'Number of installments: two (semi-annual), three (every four months), or four (quarterly).',
                    'Interest on deferred balance: zero interest to maximize uptake, or modest interest to reflect time value of money.',
                    'Eligibility: automatic for all taxpayers, or application-based with means testing.',
                    'Default consequences: remaining balance due immediately, loss of installment privilege for next year, or standard penalty and enforcement.',
                    'Arrears inclusion: whether taxpayers with past-due balances can also access installment plans for both current and arrears.'
                ],
                practicalPath: {
                    first90Days: [
                        'Analyse payment and non-payment data to estimate how many taxpayers would benefit from installments.',
                        'Design the installment schedule and eligibility criteria; get legal and leadership approval.',
                        'Configure the billing system to generate installment schedules and track partial payments.',
                        'Draft taxpayer-facing materials explaining the installment option, eligibility, and application process.'
                    ],
                    sixTo12Months: [
                        'Launch the installment option at the start of the next billing cycle; advertise on bills, at payment points, and through reminders.',
                        'Track enrollment rates, first-installment payment rates, and overall revenue impact.',
                        'Send reminders before each installment due date and follow up promptly on missed installments.',
                        'Adjust eligibility criteria or schedule if uptake is too low or too high relative to expectations.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Evaluate completion rates: what share of taxpayers who started installment plans completed all payments?',
                        'Compare total revenue collected with and without the installment option to quantify the net gain.',
                        'Refine default rules based on experience: are consequences too harsh (deterring enrollment) or too lenient (encouraging gaming)?',
                        'Consider extending installment options to arrears recovery as a way to bring long-term defaulters back into compliance.'
                    ]
                },
                legalInstitutional: [
                    'Confirm legal authority to accept partial payments and defer the balance without waiving the full obligation.',
                    'Draft standard installment agreement terms covering payment schedule, interest, and default consequences.',
                    'Ensure that installment agreements do not interfere with lien or enforcement rights if the taxpayer defaults.',
                    'Establish clear rules on how installment payments are applied (current year first, or oldest arrears first).'
                ],
                capacitySystemsPartnerships: [
                    'Billing system capable of splitting bills, tracking partial payments, and generating installment-specific reminders.',
                    'Staff trained to explain installment options, process applications, and manage defaults.',
                    'Finance unit prepared to manage cash-flow implications of deferred revenue.',
                    'IT support for system configuration and ongoing maintenance of installment tracking.'
                ],
                risksAndSafeguards: [
                    'Risk: Taxpayers who would have paid in full now choose installments, deferring revenue without increasing compliance. Safeguard: Offer a small early-payment discount (PT-COM-06) to reward full payment.',
                    'Risk: High default rates on later installments reduce net collections. Safeguard: Send reminders before each installment and enforce default rules consistently.',
                    'Risk: Administrative cost of managing installments exceeds the revenue gained. Safeguard: Automate as much as possible and set a minimum bill threshold for installment eligibility.',
                    'Risk: Political perception that the city is "going soft" on tax. Safeguard: Communicate that the full amount is still owed and that installments are a collection tool, not a concession.'
                ],
                whatToMonitor: [
                    'Installment enrollment rate: share of eligible taxpayers who opt for installments.',
                    'Completion rate: share of enrolled taxpayers who make all scheduled installment payments.',
                    'Net revenue impact: total revenue collected with installments compared to the counterfactual.',
                    'Default rate and recovery: share of missed installments and revenue recovered through follow-up.',
                    'Administrative cost per installment plan managed.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): The bill should clearly explain the installment option.',
                    'PT-COM-03 (Reminders): Each installment due date needs its own reminder message.',
                    'PT-COM-06 (Early-payment discount): Discounts and installments should be positioned as complementary, not conflicting.',
                    'PT-COM-11 (Late-payment penalties): The penalty framework must accommodate installment schedules.',
                    'PT-COM-15 (Help desk): Staff must be trained to explain installment terms and process applications.'
                ],
                questionsBeforeLaunch: [
                    'How many taxpayers are estimated to benefit from installments based on current non-payment and income data?',
                    'Can the billing system track partial payments and generate installment-specific reminders?',
                    'What are the cash-flow implications of deferred revenue, and can the city budget accommodate them?',
                    'What happens when a taxpayer misses an installment, and is the city prepared to enforce the default rules?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Offer a small early-payment discount',
            shortTitle: 'Early-Payment Discount',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low',
            politicalSensitivity: 'Medium',
            category: 'Incentives',
            sortOrder: 6,
            isActive: true,
            overview: {
                mainPurpose: 'Accelerate payment timing by offering a modest discount (typically 2-5%) for taxpayers who pay the full amount within an early window, improving cash flow and reducing the number of accounts that need reminders or enforcement.',
                bestStartingPoint: 'Analyse the current distribution of payment timing to estimate how many taxpayers would shift to early payment for a given discount. Then model the revenue trade-off: the discount cost versus savings on enforcement and the time value of earlier cash.',
                firstVisibleResult: 'In the first billing cycle with the discount, a measurable share of taxpayers should pay within the early window, and the city should receive a larger share of total revenue in the first month after billing.',
                leadershipDecision: 'Leaders must set the discount percentage and the eligibility window, balancing the revenue cost of the discount against the compliance and cash-flow benefits.',
                likelyLeadOwner: 'Revenue department, with finance input on fiscal impact and legal input on the authority to offer discounts.',
                whatThisOptionDoes: 'Introduces a time-limited discount on the property tax bill for taxpayers who pay the full amount before a specified early deadline. The discount is advertised on the bill, in reminders, and through public campaigns. The billing system automatically applies the discount if payment is received within the eligibility window and charges the full amount thereafter.',
                mostUsefulWhen: [
                    'A significant share of taxpayers eventually pay but do so late, suggesting that incentives could shift timing.',
                    'The city values early cash flow for budget execution and planning purposes.',
                    'The discount amount is small enough that the net revenue gain from higher compliance exceeds the discount cost.',
                    'The billing system can automatically calculate and apply the discount based on payment date.'
                ],
                usuallyNotBestFirstMove: [
                    'Most non-payment is due to inability to pay rather than timing; discounts do not help taxpayers who cannot afford the bill at all.',
                    'The penalty and enforcement framework is so weak that taxpayers face no consequences for late payment; fix enforcement before adding discounts.',
                    'The city cannot afford even a small reduction in the assessed amount for fiscal reasons.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover discount percentage selection, eligibility window definition, fiscal impact modelling, billing system configuration, legal authority confirmation, public communication strategy, and a monitoring framework to evaluate whether the discount is producing a net revenue gain.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the bill should prominently display both the discounted and full amounts.',
                    'PT-COM-03 (Reminders) because pre-due-date reminders should highlight the discount deadline.',
                    'PT-COM-05 (Installment plans) because discounts and installments serve different taxpayer segments and should coexist.',
                    'PT-COM-11 (Late-payment penalties) because discounts for early payment and penalties for late payment create a symmetrical incentive structure.'
                ],
                politicalNote: 'Early-payment discounts are moderately sensitive. Some officials view them as giving away revenue, while others see them as smart cash-flow management. The key political message is that the discount pays for itself through reduced enforcement costs and faster revenue collection.'
            },
            fullDetails: {
                whyThisMatters: 'An early-payment discount harnesses a well-established behavioral insight: people respond more strongly to a visible, time-limited gain than to a distant, uncertain penalty. For the city, the discount accelerates cash flow, reduces the stock of accounts requiring follow-up, and lowers enforcement costs. For the taxpayer, it offers a tangible reward for prompt action. When the discount is set correctly (typically 2-5%), the net fiscal impact is positive because the revenue that would have arrived late or not at all arrives early and with certainty.',
                whenStrongFit: [
                    'Payment timing data shows that 30% or more of revenue arrives after the due date, suggesting a large pool of "late but willing" taxpayers.',
                    'The city has a functioning billing and payment system that can automatically apply discounts based on payment date.',
                    'Budget projections would benefit from more predictable, front-loaded revenue.',
                    'The discount can be paired with a penalty for late payment, creating a carrot-and-stick framework.'
                ],
                whatToLineUpFirst: [
                    'Model the fiscal impact: at a given discount rate, how much revenue is foregone versus how much additional or earlier revenue is gained?',
                    'Confirm legal authority to offer discounts; some revenue codes require specific provisions.',
                    'Configure the billing system to show two amounts on the bill: discounted amount if paid by the early deadline, and full amount if paid later.',
                    'Design the communication campaign: bills, posters, social media, and reminder messages should all feature the discount deadline.'
                ],
                designChoices: [
                    'Discount percentage: 2%, 3%, or 5% are common; higher discounts attract more early payers but cost more per payer.',
                    'Eligibility window: 30 days from bill issuance, 60 days, or a fixed calendar date.',
                    'Scope: all taxpayers, or only those paying the current year\'s bill in full (excluding those with arrears).',
                    'Interaction with installments: should taxpayers on installment plans be eligible for a discount on the first installment?',
                    'Sunset clause: annual review of the discount to assess whether it is still producing a net gain.'
                ],
                practicalPath: {
                    first90Days: [
                        'Analyse payment timing data to estimate the share of taxpayers likely to shift to early payment for a 3% or 5% discount.',
                        'Build a simple fiscal model comparing discount cost to enforcement cost savings and time value of earlier revenue.',
                        'Get legal and leadership approval for the discount percentage and eligibility window.',
                        'Configure the billing system to display both discounted and full amounts on every bill.'
                    ],
                    sixTo12Months: [
                        'Launch the discount with the next billing cycle; advertise prominently on bills, reminders, posters, and social media.',
                        'Track early-payment rates weekly and compare to the same period in prior years.',
                        'Monitor the share of taxpayers who just miss the deadline and adjust communication timing if needed.',
                        'Report the net fiscal impact to leadership after the first billing cycle.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Evaluate whether the discount produced a net revenue gain or loss and adjust the percentage if needed.',
                        'Consider reducing the discount if compliance culture improves and early payment becomes habitual.',
                        'Integrate the discount with the penalty framework to create a seamless carrot-and-stick schedule.',
                        'Publish results as part of the city\'s transparency reporting to build public confidence.'
                    ]
                },
                legalInstitutional: [
                    'Confirm or enact legal authority to offer early-payment discounts on property tax.',
                    'Define the discount in a bylaw or council resolution specifying the percentage, eligibility window, and conditions.',
                    'Ensure the discount does not create legal conflicts with valuation or rate-setting provisions.',
                    'Establish an annual review clause so the discount can be adjusted or terminated based on performance.'
                ],
                capacitySystemsPartnerships: [
                    'Billing system capable of calculating and applying the discount automatically based on payment date.',
                    'Communication capacity to publicize the discount through multiple channels.',
                    'Finance unit prepared to manage the cash-flow and reporting implications.',
                    'Analytical capacity to evaluate the discount\'s fiscal impact after each billing cycle.'
                ],
                risksAndSafeguards: [
                    'Risk: Taxpayers who already pay on time get a windfall, reducing revenue without changing behavior. Safeguard: Set the discount low enough that the gain from new early payers exceeds the cost of discounting existing ones.',
                    'Risk: The discount becomes permanent and politically difficult to remove. Safeguard: Include a sunset clause and annual review requirement.',
                    'Risk: Taxpayers perceive the discount as proof that the original amount was inflated. Safeguard: Frame the discount as a reward for promptness, not a price reduction.',
                    'Risk: Elite taxpayers capture most of the benefit. Safeguard: Consider capping the discount at a maximum absolute amount.'
                ],
                whatToMonitor: [
                    'Early-payment rate: share of total bills paid within the discount window.',
                    'Revenue timing: share of total annual revenue collected in the first month after billing.',
                    'Net fiscal impact: discount cost versus enforcement cost savings and time value of earlier cash.',
                    'Discount take-up by taxpayer segment: residential versus commercial, high-value versus low-value.',
                    'Year-over-year trend: is the discount attracting genuinely new early payers, or just rewarding the same group?'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): The bill must clearly display the discount amount, deadline, and full amount side by side.',
                    'PT-COM-03 (Reminders): Pre-due-date reminders should highlight the approaching discount deadline.',
                    'PT-COM-05 (Installment plans): Position discounts for lump-sum payers and installments for those who need flexibility.',
                    'PT-COM-11 (Late-payment penalties): Discounts and penalties together create a symmetrical incentive around the due date.',
                    'PT-COM-16 (Show where the money goes): Linking the discount to visible service delivery can reinforce the value proposition.'
                ],
                questionsBeforeLaunch: [
                    'What discount percentage yields a positive net fiscal impact based on the city\'s payment timing data?',
                    'Does the revenue code allow discounts, or is a bylaw amendment required?',
                    'Can the billing system automatically apply the discount based on payment date?',
                    'How will the discount be publicized to maximize awareness and uptake?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Issue receipts every time and publish official payment channels',
            shortTitle: 'Receipting and Transparency',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low',
            politicalSensitivity: 'Low',
            category: 'Receipting',
            sortOrder: 7,
            isActive: true,
            overview: {
                mainPurpose: 'Ensure that every property tax payment, regardless of channel, generates a verifiable receipt, and that taxpayers know which channels are official, eliminating the space for fraud, leakage, and corrupt intermediaries.',
                bestStartingPoint: 'Audit the current receipting process: how many channels issue receipts, what format are they in, can taxpayers verify their payment was credited? Then standardize the receipt format, publish the list of official channels, and close any channels that cannot issue receipts.',
                firstVisibleResult: 'Within one billing cycle, every taxpayer who pays should receive a receipt referencing their unique payment code, and the city should be able to reconcile 100% of payments against receipts within 48 hours.',
                leadershipDecision: 'Leaders must decide whether to accept only electronic receipts (for better control) or to maintain paper receipt books alongside, and whether to close any collection point that cannot produce a standardized receipt.',
                likelyLeadOwner: 'Revenue department internal controls unit, with IT support for electronic receipting and communications support for publicizing official channels.',
                whatThisOptionDoes: 'Standardizes the receipting process across all payment channels so that every payment generates a numbered, verifiable receipt tied to the taxpayer\'s unique payment reference. The city publishes a definitive list of official payment channels (with logos, phone numbers, and locations) and warns taxpayers not to pay through any unlisted channel. Receipts can be verified online or via USSD to confirm the payment was recorded.',
                mostUsefulWhen: [
                    'There are reports or suspicions of revenue leakage, fake receipts, or payments collected by unauthorized intermediaries.',
                    'Taxpayers lack confidence that their payments are being recorded, which discourages voluntary compliance.',
                    'The city has multiple payment channels but no consistent receipting standard across them.',
                    'Leadership wants to build trust as a foundation for compliance campaigns or enforcement.'
                ],
                usuallyNotBestFirstMove: [
                    'There is only one payment channel (central office counter) with adequate receipting; the priority is to add channels, not fix receipting.',
                    'The city has no electronic systems and would need to build them from scratch just to issue standard receipts.',
                    'Revenue leakage is negligible; other compliance barriers (billing, delivery, convenience) are more important.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover receipt format standardization, electronic receipting system deployment, verification mechanism (online or USSD), publication of official channels, staff training, fraud-detection protocols, and a public awareness campaign about receipt verification.',
                oftenWorksBestAlongside: [
                    'PT-COM-04 (Easy payment channels) because every new channel must be brought under the receipting standard.',
                    'PT-COM-08 (Cash handling controls) because receipting is the primary tool for preventing cash leakage.',
                    'PT-COM-09 (Collections tracking) because receipts feed the weekly tracking system.',
                    'PT-COM-16 (Show where the money goes) because trustworthy receipting supports the broader transparency agenda.'
                ],
                politicalNote: 'Receipting reform is low-risk politically and high-impact for trust. Taxpayers welcome proof of payment, and honest staff welcome protection against false accusations. The only resistance comes from those who benefit from the current lack of controls.'
            },
            fullDetails: {
                whyThisMatters: 'A receipt is the taxpayer\'s proof that they have discharged their obligation and the city\'s proof that the revenue was collected. When receipts are absent, inconsistent, or unverifiable, three problems arise. First, taxpayers lose trust that their money reaches the city, which suppresses voluntary compliance. Second, revenue leakage through unrecorded collections becomes invisible. Third, enforcement against non-payers is undermined because they can claim they paid. A standardized, verifiable receipting system closes all three gaps and is one of the cheapest investments a city can make in compliance infrastructure.',
                whenStrongFit: [
                    'Audits or spot checks reveal discrepancies between payments reported by collection points and amounts deposited in the city account.',
                    'Taxpayers report paying through intermediaries who do not provide receipts or whose receipts look unofficial.',
                    'The city has multiple payment channels with different receipting formats, making reconciliation difficult.',
                    'Trust in the revenue authority is low, and taxpayers cite concern about corruption as a reason for non-payment.'
                ],
                whatToLineUpFirst: [
                    'Design a standard receipt format that includes the taxpayer\'s unique payment reference, amount, date, channel, and a verification code.',
                    'Deploy or upgrade electronic receipting at all official payment channels, or at minimum, issue sequentially numbered paper receipts with carbon copies.',
                    'Build a receipt verification mechanism: a simple web page or USSD code where taxpayers can enter their receipt number and confirm the payment was recorded.',
                    'Publish and widely distribute the list of official payment channels with clear branding.'
                ],
                designChoices: [
                    'Electronic only versus hybrid: electronic receipts at digital channels, numbered paper receipt books at manual collection points.',
                    'Verification method: online lookup, USSD code, SMS reply, or QR code scan.',
                    'Receipt content: minimal (amount, date, reference) or detailed (property address, assessment year, remaining balance).',
                    'Official channel branding: city logo, specific colors, or hologram on paper receipts.',
                    'Fraud reporting: include a phone number or hotline on the receipt for reporting suspicious collection activity.'
                ],
                practicalPath: {
                    first90Days: [
                        'Audit current receipting across all channels: format, numbering, reconciliation process, and gap analysis.',
                        'Design the standard receipt template and verification mechanism.',
                        'Procure electronic receipting capability for the highest-volume channels; issue numbered receipt books for the rest.',
                        'Compile and publish the list of official payment channels with clear branding and contact information.'
                    ],
                    sixTo12Months: [
                        'Roll out standardized receipting at all channels; close any collection point that cannot produce compliant receipts.',
                        'Launch the receipt verification service (web page, USSD, or SMS) and publicize it on bills, posters, and social media.',
                        'Run monthly reconciliation audits comparing receipts issued to payments deposited in the city account.',
                        'Investigate and resolve any discrepancies within 7 days.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Analyse verification usage: how many taxpayers are checking their receipts, and what issues are being flagged?',
                        'Reduce paper receipt usage as electronic channels grow and taxpayers gain confidence in digital receipts.',
                        'Integrate receipting data into the collections dashboard for real-time visibility.',
                        'Report receipt reconciliation results publicly as part of the transparency agenda.'
                    ]
                },
                legalInstitutional: [
                    'Confirm the legal requirements for a valid tax receipt and ensure the new standard meets them.',
                    'Establish legal recognition of electronic receipts as equivalent to paper receipts.',
                    'Create a bylaw or administrative order requiring all official collection points to issue standardized receipts.',
                    'Establish penalties for unauthorized collection or issuance of fraudulent receipts.'
                ],
                capacitySystemsPartnerships: [
                    'IT system for electronic receipt generation, numbering, and verification.',
                    'Procurement of pre-numbered receipt books for manual collection points.',
                    'Staff training on the new receipting standard and reconciliation procedures.',
                    'Communication campaign design and distribution capacity.'
                ],
                risksAndSafeguards: [
                    'Risk: Fake receipts that mimic the new standard. Safeguard: Include a unique verification code on every receipt and promote the verification service heavily.',
                    'Risk: Collection points resist the new standard because it eliminates opportunities for leakage. Safeguard: Frame the change as staff protection and use surprise audits to ensure compliance.',
                    'Risk: Taxpayers do not use the verification service. Safeguard: Make verification easy (one-step USSD) and incentivize it initially (e.g., entry into a prize draw).',
                    'Risk: System downtime prevents receipt issuance. Safeguard: Maintain paper receipt books as backup at every collection point.'
                ],
                whatToMonitor: [
                    'Receipt issuance rate: share of payments that generate a standardized receipt (target: 100%).',
                    'Reconciliation accuracy: discrepancy between receipts issued and payments deposited, by channel and period.',
                    'Verification usage: number of taxpayers checking their receipts via the verification service.',
                    'Fraud reports: number and nature of suspicious collection activity reports received.',
                    'Taxpayer trust indicators: survey responses on confidence that payments are properly recorded.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-04 (Easy payment channels): Every channel must meet the receipting standard.',
                    'PT-COM-08 (Cash handling controls): Receipting is the first line of defense against cash leakage.',
                    'PT-COM-09 (Collections tracking): Receipt data feeds the weekly collections tracker.',
                    'PT-COM-16 (Show where the money goes): Trustworthy receipting is the foundation of fiscal transparency.',
                    'PT-COM-01 (Clear bills): The receipt should reference the bill and confirm the correct amount was paid.'
                ],
                questionsBeforeLaunch: [
                    'Can every official payment channel issue a standardized receipt, or do some need upgrading first?',
                    'Is there a receipt verification mechanism in place, or does one need to be built?',
                    'Has the list of official payment channels been published and communicated to taxpayers?',
                    'What is the current reconciliation gap between receipts issued and payments deposited?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-08',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Tighten cash handling and daily reconciliation',
            shortTitle: 'Cash Controls',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Low-Medium',
            category: 'Controls',
            sortOrder: 8,
            isActive: true,
            overview: {
                mainPurpose: 'Minimize revenue leakage between the point of collection and the city treasury by enforcing strict cash-handling procedures, daily reconciliation of all collections against receipts, and same-day or next-day deposit rules.',
                bestStartingPoint: 'Map every point where cash is collected, identify the current deposit and reconciliation schedule, and estimate the leakage risk by comparing collections reported to deposits made. Then tighten rules and introduce daily reconciliation.',
                firstVisibleResult: 'Within two to three months, the gap between reported collections and bank deposits should narrow measurably, and surprise audits should find fewer discrepancies.',
                leadershipDecision: 'Leaders must decide how aggressive to be: same-day deposit requirement or next-day, mandatory segregation of duties, and consequences for staff who violate cash-handling rules.',
                likelyLeadOwner: 'Internal audit or revenue department finance controller, with support from the city treasurer and IT for reconciliation tools.',
                whatThisOptionDoes: 'Establishes or strengthens cash-handling protocols at every collection point, including segregation of duties (person collecting is not the person depositing), daily counting and reconciliation against receipts, same-day or next-day bank deposit requirements, surprise cash counts, and escalating disciplinary consequences for discrepancies.',
                mostUsefulWhen: [
                    'Cash collections are significant (even where digital payments exist, some taxpayers pay cash at ward offices or counters).',
                    'Audits or spot checks have revealed discrepancies between collections and deposits.',
                    'Staff turnover or limited oversight at ward-level collection points creates leakage risk.',
                    'The city is expanding payment channels (PT-COM-04) and needs controls to keep pace.'
                ],
                usuallyNotBestFirstMove: [
                    'Cash collections are negligible because most taxpayers pay electronically; controls already exist and work.',
                    'The primary compliance problem is that taxpayers are not paying at all, not that collections are being lost.',
                    'There is only one collection point with adequate supervision; the priority is expanding channels, not tightening controls.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover cash-handling policy drafting, segregation of duties design, daily reconciliation procedures, surprise audit protocols, deposit logistics, disciplinary framework, staff training, and monitoring dashboards.',
                oftenWorksBestAlongside: [
                    'PT-COM-07 (Receipting) because standardized receipts are the primary reconciliation tool.',
                    'PT-COM-09 (Collections tracking) because daily reconciliation data feeds the weekly tracking system.',
                    'PT-COM-04 (Easy payment channels) because promoting cashless channels reduces the cash that needs to be controlled.',
                    'PT-COM-16 (Show where the money goes) because tight controls build public confidence that revenue is not being stolen.'
                ],
                politicalNote: 'Cash-handling reform is low-to-medium sensitivity. It is popular with the public but may face resistance from staff who benefit from weak controls. Leadership support and consistent enforcement of consequences are critical.'
            },
            fullDetails: {
                whyThisMatters: 'Cash leakage is one of the most common and preventable causes of the gap between what taxpayers pay and what the city treasury receives. In many developing-country municipalities, cash passes through multiple hands between collection and deposit, with weak controls at each stage. Even small leakage rates compound into significant losses over a fiscal year. Tight cash handling is not just about catching theft; it is about creating a system where theft is difficult, detectable, and punished, which deters it from occurring in the first place.',
                whenStrongFit: [
                    'A meaningful share of property tax is still collected in cash at counters, ward offices, or by field collectors.',
                    'Internal audit has flagged discrepancies between collections reported and amounts deposited.',
                    'The city is expanding collection points and needs a control framework that scales with the number of channels.',
                    'Public trust is low because of perceived or actual corruption in revenue collection.'
                ],
                whatToLineUpFirst: [
                    'Map every cash collection point: central office, ward offices, field collectors, market-day counters.',
                    'Review current cash-handling rules and identify gaps: who counts, who deposits, how often, who reconciles.',
                    'Establish or strengthen the segregation of duties principle: the person who collects cash should not also reconcile or deposit.',
                    'Procure basic equipment: cash boxes, receipt books (if not yet standardized), and secure deposit bags.'
                ],
                designChoices: [
                    'Deposit frequency: same-day deposit, next-morning deposit, or end-of-week (least preferred).',
                    'Reconciliation method: manual comparison of receipt totals to cash counted, or electronic system with automated matching.',
                    'Surprise audit frequency: weekly, bi-weekly, or random (recommended for deterrence).',
                    'Escalation for discrepancies: verbal warning, written warning, suspension, or immediate referral to internal audit, depending on the size.',
                    'Cash reduction strategy: set a target date for eliminating cash collection entirely at certain points.'
                ],
                practicalPath: {
                    first90Days: [
                        'Conduct a baseline assessment: compare cash collected to cash deposited over the past 6-12 months to estimate the current leakage rate.',
                        'Draft or update the cash-handling policy covering segregation of duties, counting, reconciliation, deposit, and consequences.',
                        'Train all collection staff on the new policy and provide the necessary equipment (secure cash boxes, deposit bags, reconciliation forms).',
                        'Begin daily reconciliation at all collection points and weekly reporting to the finance controller.'
                    ],
                    sixTo12Months: [
                        'Institute surprise cash counts at random intervals at every collection point.',
                        'Investigate and resolve every discrepancy above a defined threshold within 72 hours.',
                        'Enforce disciplinary consequences consistently for the first violations to establish credibility.',
                        'Promote cashless payment channels to gradually reduce the volume of cash that needs to be managed.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Review leakage rates after 12 months and compare to the baseline.',
                        'Consider closing the highest-risk cash collection points and redirecting taxpayers to electronic or bank-based channels.',
                        'Integrate cash reconciliation data into the city\'s financial reporting system.',
                        'Publish leakage reduction results internally to reinforce the culture of accountability.'
                    ]
                },
                legalInstitutional: [
                    'Adopt or update a financial regulation or administrative order specifying cash-handling procedures for revenue collection.',
                    'Define the disciplinary framework for cash-handling violations, including the threshold for referral to law enforcement.',
                    'Ensure that internal audit has the authority and resources to conduct surprise cash counts.',
                    'Establish a whistleblower protection mechanism for staff who report irregularities.'
                ],
                capacitySystemsPartnerships: [
                    'Internal audit unit with trained staff for surprise counts and investigations.',
                    'Basic equipment: secure cash boxes, pre-numbered receipt books, deposit bags, and reconciliation forms.',
                    'Banking partner agreement for daily or next-day deposits, including from remote ward offices.',
                    'IT support for automated reconciliation if electronic receipting is in place.'
                ],
                risksAndSafeguards: [
                    'Risk: Staff resist new controls and slow-walk implementation. Safeguard: Leadership publicly endorses the policy and enforces consequences from day one.',
                    'Risk: Surprise audits are leaked in advance. Safeguard: Randomize audit schedules, use auditors from different wards, and keep the schedule confidential.',
                    'Risk: Daily deposit is impractical for remote ward offices. Safeguard: Allow next-day deposit but require secure overnight storage and double-count at deposit.',
                    'Risk: Focus on controls discourages staff from collecting at all. Safeguard: Pair controls with recognition for high-performing collectors and improve working conditions.'
                ],
                whatToMonitor: [
                    'Cash leakage rate: discrepancy between collections reported and deposits made, tracked monthly.',
                    'Daily reconciliation compliance: share of collection points submitting reconciliation reports on time.',
                    'Surprise audit findings: frequency and size of discrepancies discovered.',
                    'Disciplinary actions taken: number and outcomes, to confirm that consequences are being enforced.',
                    'Cash versus electronic payment ratio: progress toward reducing cash dependency.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-07 (Receipting): Standardized receipts are the foundation of cash reconciliation.',
                    'PT-COM-04 (Easy payment channels): Expanding electronic channels reduces cash volume and leakage risk.',
                    'PT-COM-09 (Collections tracking): Daily reconciliation data feeds the weekly tracking system.',
                    'PT-COM-12 (Visit major defaulters): Field collectors visiting defaulters need strict cash-handling rules.',
                    'PT-COM-16 (Show where the money goes): Demonstrating tight controls supports the trust-building agenda.'
                ],
                questionsBeforeLaunch: [
                    'What is the estimated current leakage rate based on reconciliation data and audit findings?',
                    'Does the city have the authority and will to enforce disciplinary consequences for cash-handling violations?',
                    'Can all collection points make same-day or next-day deposits given their proximity to banking facilities?',
                    'Is there an internal audit function with the independence and capacity to conduct surprise cash counts?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-09',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Track collections and arrears every week',
            shortTitle: 'Weekly Collections Tracking',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Low',
            category: 'Monitoring',
            sortOrder: 9,
            isActive: true,
            overview: {
                mainPurpose: 'Give revenue managers real-time visibility into how much has been collected, from whom, through which channels, and how much remains outstanding, enabling rapid course corrections and accountability for results.',
                bestStartingPoint: 'Build a simple weekly dashboard (even a spreadsheet) that shows total billed, total collected, collection rate by ward, top defaulters, and arrears aging. Circulate it to the revenue director and ward supervisors every Monday morning.',
                firstVisibleResult: 'Within the first month, managers should be able to identify underperforming wards and channels, take corrective action, and see the collection trend line in near real time rather than waiting for end-of-quarter reports.',
                leadershipDecision: 'Leaders must decide on the reporting frequency (weekly recommended), the key metrics, who receives the report, and whether ward-level performance will be publicized or kept internal.',
                likelyLeadOwner: 'Revenue department monitoring and evaluation unit or the revenue director\'s office, with IT support for data extraction.',
                whatThisOptionDoes: 'Establishes a regular (weekly) reporting cycle that tracks property tax collections by ward, channel, taxpayer category, and time period. The report includes billed amounts, payments received, collection rates, arrears aging, top defaulters, and channel performance. It is distributed to senior management and ward supervisors and discussed in a brief weekly meeting to drive accountability and action.',
                mostUsefulWhen: [
                    'Revenue data exists in the billing and payment systems but is not being compiled into actionable management reports.',
                    'The revenue director cannot answer basic questions like "how much have we collected this month?" without a manual exercise.',
                    'Ward supervisors or collection staff are not held accountable for results because there is no performance baseline.',
                    'The city is launching multiple compliance initiatives and needs to see which ones are producing results.'
                ],
                usuallyNotBestFirstMove: [
                    'The billing system is so basic that it cannot produce reliable data on billings and collections.',
                    'There is only one ward and a few hundred taxpayers, making weekly tracking unnecessary.',
                    'The city has no enforcement or follow-up capacity, so tracking will reveal problems but there is no ability to act on them.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover dashboard design, data sources and extraction, reporting frequency and distribution, performance benchmarks, the weekly review meeting structure, escalation procedures for underperforming areas, and integration with enforcement workflows.',
                oftenWorksBestAlongside: [
                    'PT-COM-07 (Receipting) and PT-COM-08 (Cash controls) because accurate tracking depends on complete receipt and reconciliation data.',
                    'PT-COM-10 (Overdue notice ladder) because the tracker identifies which taxpayers need to move to the next enforcement stage.',
                    'PT-COM-12 (Visit major defaulters) because the tracker identifies the top defaulters for field visits.',
                    'PT-COM-04 (Easy payment channels) because channel-level tracking shows which payment options are working.'
                ],
                politicalNote: 'Collections tracking is a purely internal management tool with no political sensitivity. The only risk is if ward-level performance data is leaked or used punitively rather than constructively.'
            },
            fullDetails: {
                whyThisMatters: 'What gets measured gets managed. Without regular, timely data on collections and arrears, revenue managers are flying blind. They cannot identify underperforming areas, they cannot hold staff accountable, they cannot see the impact of new initiatives, and they cannot intervene before problems become entrenched. A weekly tracking rhythm transforms property tax management from reactive (looking at annual results after the fact) to proactive (spotting and fixing problems in real time). Cities that introduce weekly tracking consistently report that the act of measurement itself improves performance, even before any new enforcement measures are added.',
                whenStrongFit: [
                    'The billing and payment systems hold data that is not being compiled into management reports.',
                    'Revenue managers rely on end-of-quarter or end-of-year reporting and have no in-cycle visibility.',
                    'The city is launching or operating multiple compliance initiatives and needs to attribute results.',
                    'Ward supervisors or collection staff lack performance targets and accountability.'
                ],
                whatToLineUpFirst: [
                    'Identify the data sources: billing system (amounts billed by ward and category), payment system (amounts collected by channel and date), and property register (arrears aging).',
                    'Design the dashboard template with the key metrics: billed, collected, collection rate, arrears, top defaulters, channel performance.',
                    'Assign a person or team to compile the dashboard weekly and distribute it by a fixed day (e.g., Monday morning).',
                    'Establish a brief (15-30 minute) weekly meeting where the revenue director and ward supervisors review the dashboard and agree on actions.'
                ],
                designChoices: [
                    'Reporting frequency: weekly for active billing periods, bi-weekly or monthly for off-peak periods.',
                    'Dashboard format: spreadsheet, printed report, online dashboard, or all three depending on audience.',
                    'Metrics: collection rate by ward, channel split, arrears aging (30/60/90/120+ days), top 20 defaulters, week-over-week trend.',
                    'Distribution: revenue director only, plus ward supervisors, plus elected officials, or restricted to operational staff.',
                    'Benchmarking: compare wards against each other, current year against prior year, or both.'
                ],
                practicalPath: {
                    first90Days: [
                        'Extract historical billing and payment data and produce the first baseline dashboard showing current collection rates and arrears by ward.',
                        'Design the weekly dashboard template with input from the revenue director on which metrics matter most.',
                        'Assign responsibility for dashboard compilation and set the weekly publication schedule.',
                        'Hold the first weekly review meeting; set performance targets for each ward and collection channel.'
                    ],
                    sixTo12Months: [
                        'Maintain the weekly cycle without interruption; consistency is more important than sophistication.',
                        'Refine the dashboard based on user feedback: add ward-level drill-downs, channel performance, or enforcement pipeline tracking.',
                        'Use the dashboard to identify the top 50 defaulters each month and refer them to the enforcement workflow.',
                        'Report monthly collection trends to city leadership with commentary on what is driving results.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Automate data extraction so the dashboard is populated without manual effort.',
                        'Integrate the dashboard with the enforcement workflow so that overdue accounts automatically flow into the notice ladder.',
                        'Benchmark the city\'s collection rate against peer cities and national averages.',
                        'Use multi-year trend data to set realistic annual revenue targets and hold the revenue department accountable.'
                    ]
                },
                legalInstitutional: [
                    'No specific legal changes are typically needed for internal management reporting.',
                    'Ensure that access to individual taxpayer data in the dashboard complies with data-protection rules.',
                    'If ward-level performance will be published externally, confirm that this does not violate any confidentiality provisions.',
                    'Establish an information-security protocol for the dashboard, especially if it contains names of top defaulters.'
                ],
                capacitySystemsPartnerships: [
                    'Data extraction capability from the billing and payment systems (IT or database staff).',
                    'Spreadsheet or dashboard software (Excel, Google Sheets, Power BI, or a custom web dashboard).',
                    'A dedicated analyst or officer responsible for weekly compilation and quality checks.',
                    'Revenue director commitment to conduct the weekly review meeting without fail.'
                ],
                risksAndSafeguards: [
                    'Risk: Dashboard data is inaccurate due to reconciliation delays. Safeguard: Align the dashboard cycle with the reconciliation cycle and flag any unreconciled amounts.',
                    'Risk: The weekly meeting becomes a blame session rather than a problem-solving forum. Safeguard: Focus the meeting on actions and support needed, not on punishing underperformers.',
                    'Risk: Dashboard is produced but not acted on. Safeguard: Require each weekly meeting to produce a written action list with owners and deadlines.',
                    'Risk: Staff game the metrics (e.g., posting backdated payments). Safeguard: Cross-check dashboard data with bank deposits and audit trails.'
                ],
                whatToMonitor: [
                    'Collection rate by ward: weekly and cumulative year-to-date.',
                    'Arrears aging: distribution of unpaid amounts across 30/60/90/120+ day buckets.',
                    'Channel performance: share of collections by channel and trend over time.',
                    'Top defaulter list: whether the same names persist week over week (indicating enforcement inaction).',
                    'Action completion rate from weekly meetings: share of agreed actions completed by the next meeting.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-07 (Receipting) and PT-COM-08 (Cash controls): Accurate tracking depends on complete and reconciled receipt data.',
                    'PT-COM-10 (Overdue notice ladder): The tracker identifies overdue accounts that need to advance through the enforcement pipeline.',
                    'PT-COM-11 (Late-payment penalties): Tracking monitors whether penalties are being applied on schedule.',
                    'PT-COM-12 (Visit major defaulters): The top-defaulter list from the tracker drives the field-visit priority list.',
                    'PT-COM-04 (Easy payment channels): Channel-level data shows which payment options taxpayers actually use.'
                ],
                questionsBeforeLaunch: [
                    'Can billing and payment data be extracted reliably on a weekly basis from existing systems?',
                    'Who will be responsible for compiling the dashboard, and do they have the time and skills?',
                    'Is the revenue director committed to holding and acting on a weekly review meeting?',
                    'Are performance targets defined for each ward and channel, so the dashboard has benchmarks to compare against?'
                ]
            }
        },

        // =====================================================================
        // C. ESCALATE FAIRLY AND CREDIBLY
        // =====================================================================

        {
            solutionId: 'PT-COM-10',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Use a clear overdue notice ladder',
            shortTitle: 'Overdue Notice Ladder',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Low',
            category: 'Enforcement',
            sortOrder: 10,
            isActive: true,
            overview: {
                mainPurpose: 'Create a predictable, documented sequence of escalating notices for overdue property tax accounts, so that every taxpayer goes through the same steps before stronger enforcement, making the process fair, transparent, and legally defensible.',
                bestStartingPoint: 'Map the current process: what happens after a bill goes unpaid? If the answer is "nothing consistent," design a simple three-to-four-step ladder (reminder, first formal notice, second formal notice, referral to enforcement) with defined time intervals and escalating language.',
                firstVisibleResult: 'Within two billing cycles, a larger share of overdue accounts should be resolved at the early stages of the ladder (after the first or second notice), reducing the number that need expensive enforcement action.',
                leadershipDecision: 'Leaders must approve the ladder stages, time intervals, and the escalation language, particularly the point at which the city references penalties, liens, or legal action.',
                likelyLeadOwner: 'Revenue department enforcement or compliance unit, with legal review of notice language and IT support for scheduling.',
                whatThisOptionDoes: 'Establishes a formal, timed sequence of notices for overdue property tax accounts. Each stage has a defined template, a delivery method, and a specific interval after the due date. The ladder typically runs: friendly reminder (Day 7), first formal overdue notice (Day 30), second notice with penalty warning (Day 60), final notice before enforcement referral (Day 90). The system tracks which stage each taxpayer is at and automatically generates the next notice on schedule.',
                mostUsefulWhen: [
                    'The city currently has no systematic follow-up after the initial bill, or follow-up is ad hoc and inconsistent.',
                    'A significant number of taxpayers pay when reminded but the city is not sending structured follow-up.',
                    'The city wants to build a legal record of notice before escalating to penalties, liens, or court action.',
                    'Leadership wants enforcement to be seen as fair and rule-based rather than arbitrary.'
                ],
                usuallyNotBestFirstMove: [
                    'Bills are not being sent in the first place; fix billing and delivery before building an overdue ladder.',
                    'The city has no enforcement powers to reference in later-stage notices, making the ladder a series of empty threats.',
                    'There is only a handful of defaulters who are better handled through individual negotiation.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover ladder stage design, notice templates and legal review, scheduling and automation, delivery methods for each stage, tracking and reporting, integration with the penalty and enforcement frameworks, and staff training.',
                oftenWorksBestAlongside: [
                    'PT-COM-03 (Reminders) which serve as the soft precursor to the formal overdue ladder.',
                    'PT-COM-11 (Late-payment penalties) because the notices reference the penalty schedule.',
                    'PT-COM-09 (Collections tracking) which identifies the overdue accounts that enter the ladder.',
                    'PT-COM-12 (Visit major defaulters) which is the enforcement action at the end of the ladder for large accounts.'
                ],
                politicalNote: 'A clear notice ladder is politically safe because it demonstrates fairness and due process. Taxpayers who eventually face enforcement cannot claim they were not warned. The key is consistency: applying the ladder to everyone, including politically connected individuals.'
            },
            fullDetails: {
                whyThisMatters: 'An overdue notice ladder serves three critical functions. First, it recovers revenue from the "nudgeable" segment of defaulters, those who will pay once they realize the city is serious but who ignore a single bill. Second, it builds the legal and procedural record needed to justify stronger enforcement actions like penalties, liens, or court proceedings. Third, it signals to all taxpayers that the city monitors compliance and follows up systematically, which deters casual non-payment. Without a ladder, the city jumps from bill to enforcement with nothing in between, which is both unfair and ineffective.',
                whenStrongFit: [
                    'Payment data shows that many taxpayers pay late when reminded, suggesting a large "persuadable" segment.',
                    'The city has enforcement powers (penalties, liens, clearance requirements) but needs a documented notice trail before invoking them.',
                    'Current follow-up is inconsistent: some wards send reminders, others do nothing, creating inequity.',
                    'Leadership wants to escalate enforcement but needs to demonstrate that taxpayers were given fair warning.'
                ],
                whatToLineUpFirst: [
                    'Define the ladder stages: how many notices, at what intervals after the due date, with what content and tone.',
                    'Draft notice templates for each stage and have them reviewed by legal counsel.',
                    'Ensure the billing system (or a parallel workflow tool) can track which stage each taxpayer is at and generate the next notice on schedule.',
                    'Confirm delivery methods for each stage: SMS for early stages, registered letter for formal stages, personal service for final notice.'
                ],
                designChoices: [
                    'Number of stages: three (friendly, formal, final) or four (adding a penalty-activation notice).',
                    'Intervals: short cycle (7/30/60/90 days) for urgency, or longer cycle (30/60/90/120 days) for a more measured approach.',
                    'Tone escalation: purely factual throughout, or progressively firmer with explicit references to consequences.',
                    'Delivery method escalation: SMS for early stages, physical letter for middle stages, personal delivery for the final notice.',
                    'Automation level: fully automated with system-generated notices, or semi-automated with staff approval at each stage.'
                ],
                practicalPath: {
                    first90Days: [
                        'Analyse the current overdue portfolio: how many accounts are 30/60/90/120+ days past due?',
                        'Design the ladder: define stages, intervals, notice content, and delivery methods.',
                        'Draft notice templates and get legal approval for the language, especially the penalty and enforcement references.',
                        'Configure the billing system or workflow tool to track ladder stages and generate notices.'
                    ],
                    sixTo12Months: [
                        'Launch the ladder for all accounts overdue from the current billing cycle.',
                        'Track conversion rates at each stage: what share of overdue accounts pay after each notice?',
                        'Refine notice language based on conversion data; test variations (social norms, specific consequences, personal tone).',
                        'Ensure that accounts reaching the final stage are actually referred to enforcement, not just left in the queue.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Evaluate the ladder\'s overall impact on collection rates and arrears reduction.',
                        'Adjust intervals and content based on one full year of data.',
                        'Integrate the ladder with the penalty system so that penalties are applied automatically at the correct stage.',
                        'Publish aggregate enforcement statistics (notices sent, payments received, accounts enforced) as part of transparency reporting.'
                    ]
                },
                legalInstitutional: [
                    'Confirm that the notice templates meet legal requirements for valid demand and notification.',
                    'Ensure that the notice record is sufficient to support later enforcement actions (penalties, liens, court).',
                    'Establish rules for how notices are served (post, personal delivery, electronic) and the evidentiary standard for each.',
                    'Create a process for taxpayers to respond to notices (dispute, request installment, provide updated information).'
                ],
                capacitySystemsPartnerships: [
                    'Billing system or workflow tool capable of tracking ladder stages and auto-generating notices.',
                    'SMS gateway for early-stage digital notices.',
                    'Print and postal capacity for formal written notices.',
                    'Staff or contractors for personal delivery of final-stage notices.'
                ],
                risksAndSafeguards: [
                    'Risk: Notices are sent but never followed through to enforcement, teaching taxpayers to ignore them. Safeguard: Enforce the final stage consistently, even if only for a small number of high-profile cases initially.',
                    'Risk: The ladder becomes so long that taxpayers learn to wait until the last notice. Safeguard: Apply penalties at an early stage (e.g., after the second notice) to create real cost for delay.',
                    'Risk: Vulnerable taxpayers are frightened by enforcement language. Safeguard: Include information about installment plans, exemptions, and the help desk on every notice.',
                    'Risk: The system generates notices for accounts with active disputes or exemptions. Safeguard: Build exception handling for disputed or exempt accounts.'
                ],
                whatToMonitor: [
                    'Conversion rate at each ladder stage: share of accounts that pay within 14 days of each notice.',
                    'Escalation rate: share of accounts that progress through the entire ladder to the enforcement stage.',
                    'Average time from first overdue notice to payment.',
                    'Notice delivery success rate by method (SMS, post, personal delivery).',
                    'Referral-to-action rate at the final stage: share of referred accounts where enforcement is actually initiated.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-03 (Reminders): Reminders are the informal precursor; the overdue ladder is the formal escalation.',
                    'PT-COM-11 (Late-payment penalties): Penalties are triggered at defined ladder stages.',
                    'PT-COM-12 (Visit major defaulters): The final ladder stage feeds into the field-visit priority list.',
                    'PT-COM-13 (Tax clearance for transfers): Overdue notices should mention that unpaid tax blocks property transfers.',
                    'PT-COM-09 (Collections tracking): The weekly tracker identifies new overdue accounts entering the ladder.'
                ],
                questionsBeforeLaunch: [
                    'How many overdue accounts currently exist, and what is the aging distribution?',
                    'Can the billing system track ladder stages and generate notices automatically, or is manual processing required?',
                    'Has legal counsel approved the notice templates, especially the enforcement and penalty language?',
                    'Is there genuine intent and capacity to follow through on enforcement for accounts that complete the entire ladder?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-11',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Apply late-payment penalties consistently',
            shortTitle: 'Late-Payment Penalties',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Medium',
            category: 'Enforcement',
            sortOrder: 11,
            isActive: true,
            overview: {
                mainPurpose: 'Ensure that paying late is more expensive than paying on time by consistently applying statutory penalties and interest to overdue accounts, creating a credible financial consequence for non-compliance.',
                bestStartingPoint: 'Review the current penalty provisions in the revenue code, check whether penalties are actually being applied in the billing system, and if not, configure the system to calculate and add penalties automatically at the defined intervals.',
                firstVisibleResult: 'Within one billing cycle, taxpayers who receive overdue notices with penalty amounts added should begin paying earlier to avoid the surcharge, and the city should collect additional revenue from late-payment fees on those who still pay late.',
                leadershipDecision: 'Leaders must decide on the penalty rate and structure (flat fee, percentage surcharge, compounding interest, or combination), whether to apply it uniformly or allow discretionary waivers, and how aggressively to publicize the penalty.',
                likelyLeadOwner: 'Revenue department compliance unit, with legal counsel to confirm the penalty framework and IT to automate penalty calculation.',
                whatThisOptionDoes: 'Activates and enforces the late-payment penalty provisions in the revenue code by configuring the billing system to automatically add penalties and interest to overdue property tax accounts at defined intervals. Penalties are communicated on overdue notices, shown on the taxpayer\'s account balance, and collected alongside the principal. Waivers are limited to defined criteria and require managerial approval.',
                mostUsefulWhen: [
                    'The law provides for late-payment penalties but they are not being applied, creating a de facto amnesty for late payers.',
                    'Payment timing data shows a large share of revenue arriving well after the due date.',
                    'Taxpayers face no financial consequence for paying late, removing the urgency to comply on time.',
                    'The city is building a broader enforcement framework and needs penalties as the first credible escalation.'
                ],
                usuallyNotBestFirstMove: [
                    'Penalties are already applied consistently and the problem is non-payment rather than late payment.',
                    'The penalty rate in the law is so low that it has no deterrent effect; a legislative change is needed first.',
                    'Most non-payment is among the poorest taxpayers who cannot pay even the base amount; adding penalties will not help.',
                    'Billing and delivery are so weak that many taxpayers genuinely do not know they owe tax; fix notification first.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover penalty framework review, system configuration for automatic calculation, waiver policy and approval process, communication strategy, staff training, monitoring of penalty revenue and compliance impact, and a feedback loop to adjust the rate if needed.',
                oftenWorksBestAlongside: [
                    'PT-COM-10 (Overdue notice ladder) because notices reference the penalty schedule and create the timeline.',
                    'PT-COM-06 (Early-payment discount) because together they create a symmetrical incentive around the due date.',
                    'PT-COM-03 (Reminders) because pre-due-date reminders warn of upcoming penalties.',
                    'PT-COM-05 (Installment plans) because the penalty framework should accommodate installment schedules.'
                ],
                politicalNote: 'Penalties are moderately sensitive. They are essential for enforcement credibility but can generate complaints from late-paying taxpayers, especially if applied inconsistently or perceived as unfair. The strongest political defense is universal, automatic application with no discretionary waivers.'
            },
            fullDetails: {
                whyThisMatters: 'A penalty framework is the price mechanism that makes timeliness matter. Without financial consequences for late payment, the due date is merely a suggestion, and rational taxpayers delay as long as possible. Consistent penalty application shifts the calculus: the longer you wait, the more you pay. This is not about punishment; it is about creating the same incentive structure that every utility company and lender uses to encourage on-time payment. Cities that activate and enforce dormant penalty provisions typically see 10-20% improvement in on-time payment within two billing cycles.',
                whenStrongFit: [
                    'The revenue code already includes penalty provisions, but they are not being applied in practice.',
                    'A large share of eventual payers pays 30+ days late, suggesting that penalties would shift timing behavior.',
                    'The billing system can calculate and apply penalties automatically without manual intervention.',
                    'Leadership is willing to enforce penalties universally, including on politically connected taxpayers.'
                ],
                whatToLineUpFirst: [
                    'Review the penalty provisions in the revenue code: rate, structure, accrual rules, and any waiver provisions.',
                    'Configure the billing system to calculate penalties automatically at defined intervals (e.g., 2% surcharge on Day 31, plus 1% per month thereafter).',
                    'Draft the penalty section of overdue notices so taxpayers understand exactly what they will owe and when.',
                    'Establish a waiver policy: under what circumstances can a penalty be waived, who approves, and what documentation is required?'
                ],
                designChoices: [
                    'Penalty structure: flat surcharge (e.g., 5% on the overdue amount), compounding interest (e.g., 1% per month), or both.',
                    'Accrual start date: immediately after the due date, after a grace period, or after the first formal overdue notice.',
                    'Waiver policy: no waivers (strongest deterrent), limited waivers for documented hardship, or blanket amnesty periods (not recommended).',
                    'Cap on penalties: maximum total penalty as a percentage of the original bill to avoid runaway balances on very old arrears.',
                    'Communication: whether to show the running penalty balance on the taxpayer\'s account in real time.'
                ],
                practicalPath: {
                    first90Days: [
                        'Review the legal penalty framework and confirm the city\'s authority to apply penalties.',
                        'Audit current practice: are penalties being applied? If so, consistently? If not, why not?',
                        'Configure the billing system to calculate and add penalties automatically.',
                        'Draft penalty communication for overdue notices and bills, clearly explaining the rate, schedule, and consequences.'
                    ],
                    sixTo12Months: [
                        'Activate automatic penalty application for all new overdue accounts from the current billing cycle.',
                        'Communicate widely: bills, notices, posters, social media, and community meetings should all reference the penalty schedule.',
                        'Monitor the impact on payment timing: are more taxpayers paying before penalties kick in?',
                        'Process and track penalty waiver requests; keep the approval rate low and document every waiver.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Evaluate the net revenue impact: penalty revenue collected plus improvement in on-time payment rates.',
                        'Address old arrears: decide whether to apply penalties retroactively to accumulated arrears or offer a one-time settlement.',
                        'Adjust penalty rates if data shows the current rate is too low to deter or too high to be politically sustainable.',
                        'Integrate penalty data into the weekly collections dashboard for ongoing monitoring.'
                    ]
                },
                legalInstitutional: [
                    'Confirm the statutory basis for late-payment penalties and interest in the revenue code or bylaws.',
                    'Ensure the penalty rate and structure are clearly gazetted or published as required by law.',
                    'Establish legal authority for penalty waivers and define the criteria and approval process.',
                    'Confirm that penalties can be collected alongside the principal through the same enforcement mechanisms.'
                ],
                capacitySystemsPartnerships: [
                    'Billing system capable of automatic penalty calculation and accrual at defined intervals.',
                    'Staff trained on the penalty framework, waiver policy, and how to explain penalties to taxpayers.',
                    'Legal counsel available to defend penalty application in appeals or disputes.',
                    'Communication capacity to publicize the penalty schedule before the first bills go out.'
                ],
                risksAndSafeguards: [
                    'Risk: Penalties are applied selectively, creating a perception of unfairness. Safeguard: Automate penalty application so that every overdue account is treated identically.',
                    'Risk: Penalty waivers become routine, undermining the deterrent effect. Safeguard: Require written justification and managerial approval for every waiver, and report waiver rates monthly.',
                    'Risk: Penalties accumulate on accounts of genuinely poor taxpayers who cannot pay. Safeguard: Include information about hardship exemptions and installment plans on every penalty notice.',
                    'Risk: Taxpayers challenge penalties in court. Safeguard: Ensure the legal basis is clear, the notice record is complete, and the penalty rate is reasonable compared to commercial benchmarks.'
                ],
                whatToMonitor: [
                    'On-time payment rate: share of bills paid before penalties accrue, compared to prior year.',
                    'Penalty revenue collected: total amount of penalties and interest collected.',
                    'Waiver rate: share of penalty amounts waived, by reason and approver.',
                    'Average days to payment: whether payment timing is shifting earlier after penalty activation.',
                    'Dispute and appeal volume related to penalties.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-10 (Overdue notice ladder): Penalties are activated at defined ladder stages.',
                    'PT-COM-06 (Early-payment discount): Discounts and penalties create a carrot-and-stick incentive around the due date.',
                    'PT-COM-03 (Reminders): Pre-due-date reminders warn of the penalty that will apply after the deadline.',
                    'PT-COM-05 (Installment plans): The penalty framework must accommodate installment schedules.',
                    'PT-COM-13 (Tax clearance): Outstanding penalties should be included in the clearance requirement.'
                ],
                questionsBeforeLaunch: [
                    'Does the revenue code include clear penalty provisions, and are they adequate to create a real deterrent?',
                    'Can the billing system calculate and apply penalties automatically at the correct intervals?',
                    'Is leadership willing to enforce penalties universally, including on politically connected taxpayers?',
                    'Has the communication campaign been prepared so that taxpayers know about the penalty schedule before it takes effect?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-12',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Visit major defaulters in person',
            shortTitle: 'Defaulter Field Visits',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium-High',
            category: 'Enforcement',
            sortOrder: 12,
            isActive: true,
            overview: {
                mainPurpose: 'Recover large overdue amounts from top defaulters through structured, documented in-person visits that communicate the seriousness of the city\'s intent and offer a last opportunity to pay before formal enforcement.',
                bestStartingPoint: 'Pull the top 50-100 defaulters by amount owed from the collections tracker, confirm that each has completed the overdue notice ladder, and train a small team to conduct professional, documented visits with a standardized script and settlement offer.',
                firstVisibleResult: 'Within 30-60 days of the first round of visits, a meaningful share of visited defaulters should make full or partial payment, and word-of-mouth should create a deterrent effect among other large taxpayers.',
                leadershipDecision: 'Leaders must decide on the threshold for field visits (e.g., top 50 by amount owed), the team composition (revenue staff, legal, police escort if needed), and the settlement terms offered during the visit.',
                likelyLeadOwner: 'Revenue department enforcement unit, with legal support and coordination with the city administration.',
                whatThisOptionDoes: 'Deploys trained enforcement teams to visit the properties or offices of the largest property tax defaulters. Each visit follows a standard protocol: present identification, state the purpose, present the account history and total owed (including penalties), offer payment options (full payment, installment plan, date-certain commitment), document the visit and the taxpayer\'s response, and explain the next enforcement step if payment is not made. Visits are authorized, documented, and reviewed.',
                mostUsefulWhen: [
                    'A small number of high-value defaulters account for a disproportionate share of total arrears.',
                    'These defaulters have completed the overdue notice ladder but have not responded.',
                    'The city wants to demonstrate enforcement capacity and create a deterrent effect beyond the visited accounts.',
                    'Written notices have proven insufficient for this segment, who are unlikely to pay without personal confrontation.'
                ],
                usuallyNotBestFirstMove: [
                    'The overdue notice ladder has not been deployed, so defaulters have not been formally warned.',
                    'The city has no enforcement powers beyond the visit itself (no penalties, no liens, no clearance requirements), making the visit an empty gesture.',
                    'The defaulters are genuinely unable to pay rather than unwilling; visits will not produce revenue and may be seen as harassment.',
                    'There is no standardized protocol, risking unprofessional conduct that damages the city\'s reputation.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover defaulter selection criteria, team composition and training, visit protocol and script, documentation requirements, settlement authority, escalation if the visit fails, legal review, safety procedures, and monitoring of visit outcomes.',
                oftenWorksBestAlongside: [
                    'PT-COM-10 (Overdue notice ladder) which provides the documented notice history that precedes the visit.',
                    'PT-COM-09 (Collections tracking) which identifies the top defaulters for targeting.',
                    'PT-COM-13 (Tax clearance) and PT-COM-14 (Property charges) which give the visit credibility by referencing future enforcement steps.',
                    'PT-COM-05 (Installment plans) which gives the visit team a practical settlement offer to make.'
                ],
                politicalNote: 'Defaulter visits are politically sensitive, especially when the defaulters are wealthy, well-connected, or politically influential. The strongest protection is a standardized, transparent process applied based on objective criteria (amount owed), not personal targeting. Leadership must be prepared to defend visits to high-profile individuals.'
            },
            fullDetails: {
                whyThisMatters: 'In most cities, a small number of large defaulters account for a disproportionate share of total arrears. These taxpayers are often not poor or confused; they are making a calculated bet that the city will not enforce. Written notices confirm that bet when they go unanswered. An in-person visit changes the dynamic: it demonstrates that the city knows who owes, where they are, and how much is owed, and that enforcement has moved from paperwork to action. Beyond the direct revenue recovered from visited defaulters, the deterrent effect on other large taxpayers can be substantial, as word spreads quickly that the city is visiting non-payers.',
                whenStrongFit: [
                    'The top 50-100 defaulters collectively owe more than all small defaulters combined.',
                    'These accounts have been through the full overdue notice ladder without response.',
                    'The city has enforcement tools (penalties, liens, clearance) that the visit team can reference as next steps.',
                    'Leadership is willing to authorize visits to any defaulter, regardless of social or political status.'
                ],
                whatToLineUpFirst: [
                    'Compile and verify the top-defaulter list: confirm amounts owed, notice history, and current address or business location.',
                    'Select and train the visit team: revenue enforcement officers, possibly accompanied by legal staff.',
                    'Develop the visit protocol: identification, scripted opening, account presentation, settlement offer, documentation form, and closure.',
                    'Get legal clearance for the visit protocol and confirm that the team has the authority to make settlement offers on site.'
                ],
                designChoices: [
                    'Selection threshold: top 50 by amount, all accounts above a monetary threshold, or a combination.',
                    'Team composition: two revenue officers, revenue plus legal, or revenue plus ward administrator for local legitimacy.',
                    'Settlement authority: can the team agree to an installment plan on the spot, or must it be approved by a supervisor?',
                    'Documentation: written visit report, photograph of the property, taxpayer signature on the visit form.',
                    'Escalation timeline: how many days after an unsuccessful visit before the account is referred to the next enforcement step?'
                ],
                practicalPath: {
                    first90Days: [
                        'Extract the top-100 defaulter list from the collections tracker and verify each account.',
                        'Train a visit team of 4-6 officers on the protocol, including communication skills, conflict de-escalation, and documentation.',
                        'Conduct a pilot round of 10-20 visits to test the protocol and refine the approach.',
                        'Document outcomes: payments received, installment agreements signed, disputes raised, and accounts requiring escalation.'
                    ],
                    sixTo12Months: [
                        'Scale to visit all top-100 defaulters over a 3-month period, with weekly progress reviews.',
                        'Track results rigorously: total revenue recovered, share of visited accounts that pay, average time from visit to payment.',
                        'Publicize the program in general terms (number of visits conducted, revenue recovered) to create a deterrent effect.',
                        'Refer non-responsive accounts to the next enforcement step (liens, clearance blocks, or legal action).'
                    ],
                    twelveToTwentyFourMonths: [
                        'Make defaulter visits a routine quarterly activity, not a one-time campaign.',
                        'Expand the list to include the next tier of defaulters as top-tier accounts are resolved.',
                        'Evaluate the cost-effectiveness: revenue recovered per visit hour and per officer deployed.',
                        'Integrate visit scheduling and reporting into the billing system and collections dashboard.'
                    ]
                },
                legalInstitutional: [
                    'Confirm the legal authority for revenue officers to visit properties and present demands.',
                    'Ensure the visit protocol complies with privacy, trespass, and harassment laws.',
                    'Establish clear rules for when and how a visit can be conducted (business hours, identification requirements, no entry without consent).',
                    'Define the legal standing of any installment agreement signed during the visit.'
                ],
                capacitySystemsPartnerships: [
                    'A dedicated enforcement team of at least 4-6 trained officers.',
                    'Transport: vehicles for reaching properties across the jurisdiction.',
                    'Documentation tools: printed account summaries, visit report forms, and ideally a tablet for recording outcomes.',
                    'Legal support for drafting settlement agreements and handling disputes arising from visits.'
                ],
                risksAndSafeguards: [
                    'Risk: Visits are perceived as intimidation or harassment. Safeguard: Standardize the protocol, require two officers per visit, maintain a professional tone, and document every interaction.',
                    'Risk: Influential defaulters use political connections to block visits. Safeguard: Apply selection criteria objectively and secure advance leadership approval for the list.',
                    'Risk: Officers are bribed or intimidated during visits. Safeguard: Send teams of two, rotate team composition, and require written reports reviewed by a supervisor.',
                    'Risk: Visited taxpayers dispute the amount owed. Safeguard: Bring a printed account statement and offer the help desk for formal disputes.'
                ],
                whatToMonitor: [
                    'Revenue recovered from visited accounts within 30 and 60 days of the visit.',
                    'Conversion rate: share of visited defaulters who make payment or sign an installment agreement.',
                    'Deterrent effect: change in payment behavior among non-visited large taxpayers after the program is publicized.',
                    'Visit completion rate: share of planned visits actually conducted on schedule.',
                    'Complaints or incidents arising from visits.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-09 (Collections tracking): The tracker identifies the top-defaulter list for visit targeting.',
                    'PT-COM-10 (Overdue notice ladder): Visits follow the completion of the notice ladder.',
                    'PT-COM-05 (Installment plans): The visit team can offer installment agreements on site.',
                    'PT-COM-13 (Tax clearance) and PT-COM-14 (Property charges): These are the next steps referenced if the visit does not produce payment.',
                    'PT-COM-08 (Cash controls): If any payments are collected in cash during visits, strict cash-handling rules apply.'
                ],
                questionsBeforeLaunch: [
                    'Is the top-defaulter list verified, and do all accounts have a complete overdue notice history?',
                    'Is the visit team trained on the protocol, including professional communication and conflict de-escalation?',
                    'Has leadership approved the defaulter list and committed to supporting visits regardless of who is on it?',
                    'What enforcement steps are available if the visit does not produce payment, and are they ready to activate?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-13',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Require tax clearance for transfers and key permits',
            shortTitle: 'Tax Clearance Requirement',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'High',
            category: 'Enforcement',
            sortOrder: 13,
            isActive: true,
            overview: {
                mainPurpose: 'Create a powerful compliance incentive by requiring proof of property tax payment as a condition for property transfers, building permits, business licenses, or other government services that property owners value.',
                bestStartingPoint: 'Identify the highest-impact transaction where a clearance requirement can be legally and practically inserted (property transfers are usually the best), draft the legal instrument, and work with the lands registry or approvals office to embed the check in their workflow.',
                firstVisibleResult: 'Within the first year of enforcement, property owners seeking to sell, transfer, or develop their properties will begin clearing their arrears to obtain the tax clearance certificate, generating one-time revenue recovery and establishing an ongoing compliance incentive.',
                leadershipDecision: 'Leaders must decide which transactions require clearance, whether the requirement applies to all arrears (including historical) or only recent years, and how to handle cases where clearance delays an otherwise urgent transaction.',
                likelyLeadOwner: 'Revenue department, in coordination with the lands registry, planning department, and any other agency whose approval process will include the clearance check.',
                whatThisOptionDoes: 'Establishes a legal requirement that property owners must present a tax clearance certificate (showing no outstanding property tax) before completing specified transactions such as property transfers, subdivision, building permits, or business license renewals. The revenue department issues the certificate after verifying the owner\'s account is current. The requirement is embedded in the approval workflows of partner agencies.',
                mostUsefulWhen: [
                    'Property transactions are common and property owners have a strong incentive to complete them quickly.',
                    'A significant amount of arrears has accumulated that the standard notice-and-penalty approach has not collected.',
                    'The lands registry or permits office has a functional workflow where a clearance check can be inserted.',
                    'Legal authority exists or can be enacted to require tax clearance for specified transactions.'
                ],
                usuallyNotBestFirstMove: [
                    'Property transactions are rare or informal, so the clearance check would affect very few people.',
                    'The billing and account management system cannot reliably confirm whether a taxpayer is current, leading to false blocks.',
                    'The legal framework does not support a clearance requirement and legislative change is not feasible in the near term.',
                    'The revenue department cannot process clearance requests quickly, which would delay legitimate transactions and generate political backlash.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover legal framework, inter-agency agreements, clearance workflow design, IT integration, processing-time standards, dispute resolution for contested accounts, transitional arrangements for existing arrears, and a taxpayer communication campaign.',
                oftenWorksBestAlongside: [
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-11 (Penalties) because the clearance requirement gives teeth to the enforcement framework.',
                    'PT-COM-09 (Collections tracking) because the tracker identifies the accounts most likely to be affected by clearance requirements.',
                    'PT-COM-05 (Installment plans) because taxpayers with large arrears may need a payment plan to clear their accounts.',
                    'PT-COM-15 (Help desk) because the clearance process will generate queries and disputes that need quick resolution.'
                ],
                politicalNote: 'Tax clearance is highly politically sensitive. Property owners, developers, and their political allies will resist it as an obstacle to transactions. Success depends on framing the requirement as a fairness measure (everyone pays their share), ensuring fast processing so that compliant taxpayers are not delayed, and leadership willingness to withstand pressure from influential defaulters.'
            },
            fullDetails: {
                whyThisMatters: 'Tax clearance requirements are one of the most powerful compliance tools available because they link payment to something the property owner wants more than they want to avoid the tax. A property sale, a building permit, or a business license has direct economic value, and the tax clearance becomes a minor cost in comparison. The requirement also creates a self-enforcing system: the partner agency (lands registry, planning office) becomes a compliance checkpoint, reducing the burden on the revenue department. In cities that have successfully implemented clearance requirements, arrears recovery rates for affected transactions approach 90-100%.',
                whenStrongFit: [
                    'Property market activity is moderate to high, with regular transfers, subdivisions, or development applications.',
                    'Accumulated arrears are large and growing despite notice and penalty efforts.',
                    'The lands registry or planning department has a formal approval workflow where a clearance step can be added.',
                    'Legal authority for clearance exists or leadership is willing to push for the necessary legislation.'
                ],
                whatToLineUpFirst: [
                    'Confirm or enact the legal authority to require tax clearance for specified transactions.',
                    'Sign inter-agency agreements with the lands registry, planning department, and other relevant agencies defining the clearance workflow.',
                    'Build or procure the system for issuing clearance certificates: real-time account lookup, certificate generation, and verification.',
                    'Set a processing-time standard (e.g., clearance certificate issued within 3 business days of application) and staff the unit to meet it.'
                ],
                designChoices: [
                    'Scope of transactions: property transfers only, or also building permits, business licenses, utility connections, and loan approvals.',
                    'Arrears scope: clearance requires payment of all historical arrears, or only the most recent 3-5 years.',
                    'Processing time: same-day for current accounts, or standard 3-day turnaround with expedited processing available.',
                    'Partial clearance: whether a taxpayer can obtain clearance by entering a formal installment agreement for remaining arrears.',
                    'Verification: digital verification (partner agency checks online in real time) or paper certificate presented by the applicant.'
                ],
                practicalPath: {
                    first90Days: [
                        'Review the legal framework: does existing law support a clearance requirement, or is new legislation needed?',
                        'Identify the highest-impact transaction for the first clearance requirement (usually property transfers).',
                        'Meet with the lands registry or relevant agency to map their approval workflow and identify where the clearance check fits.',
                        'Design the clearance certificate format, issuance process, and verification mechanism.'
                    ],
                    sixTo12Months: [
                        'Enact or formalize the legal instrument requiring tax clearance for the selected transactions.',
                        'Set up the clearance unit within the revenue department: staff, systems, processing-time targets.',
                        'Train partner-agency staff on the clearance check and verification process.',
                        'Communicate the new requirement widely: through property professional associations, legal firms, and media.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Launch the clearance requirement for property transfers; monitor processing times and arrears recovery.',
                        'Resolve bottleneck cases: taxpayers with disputed accounts, deceased owners, or unclear ownership.',
                        'Evaluate arrears recovery: how much revenue has been collected through the clearance pathway?',
                        'Consider extending the requirement to additional transactions (building permits, business licenses) based on success.'
                    ]
                },
                legalInstitutional: [
                    'Enact or amend legislation to require tax clearance for specified property transactions.',
                    'Draft inter-agency memoranda of understanding defining each agency\'s role in the clearance process.',
                    'Establish an appeals process for taxpayers who believe the clearance block is in error.',
                    'Define transitional rules for existing arrears: full payment required, or installment plan acceptable for clearance?'
                ],
                capacitySystemsPartnerships: [
                    'Online system for clearance requests, account verification, certificate generation, and partner-agency verification.',
                    'Staffed clearance unit with defined processing-time targets.',
                    'Inter-agency data sharing: the partner agency must be able to verify a clearance certificate\'s authenticity.',
                    'Legal support for handling disputes and exceptional cases.'
                ],
                risksAndSafeguards: [
                    'Risk: Clearance delays legitimate transactions, generating complaints and political pressure. Safeguard: Set a 3-day processing standard and staff accordingly; compliant taxpayers should be cleared instantly.',
                    'Risk: Corruption in the clearance process (certificates issued without payment). Safeguard: Digitize and audit the process; require digital verification by the partner agency.',
                    'Risk: Property owners avoid formal transactions to bypass the requirement. Safeguard: Monitor informal transfer rates and strengthen registration requirements.',
                    'Risk: Taxpayers with genuinely disputed accounts are unfairly blocked. Safeguard: Allow conditional clearance subject to a dispute-resolution timeline.'
                ],
                whatToMonitor: [
                    'Clearance certificates issued per month and the arrears collected to obtain them.',
                    'Processing time: average and maximum days from application to certificate issuance.',
                    'Arrears recovery attributable to the clearance requirement.',
                    'Complaint and dispute volume related to clearance blocks.',
                    'Impact on property transaction volumes: whether the clearance requirement is discouraging formal transactions.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-11 (Penalties): The clearance requirement gives real consequences to the enforcement framework.',
                    'PT-COM-14 (Property charges): Liens and clearance requirements work in tandem to block transactions until tax is paid.',
                    'PT-COM-05 (Installment plans): Taxpayers with large arrears may need an installment plan to obtain clearance.',
                    'PT-COM-15 (Help desk): Clearance-related queries will increase and need fast resolution.',
                    'PT-COM-12 (Visit major defaulters): Visits can inform large defaulters about the upcoming clearance requirement as additional motivation.'
                ],
                questionsBeforeLaunch: [
                    'Does the legal framework support a clearance requirement, or is legislation needed?',
                    'Can the revenue department issue clearance certificates within 3 business days?',
                    'Is the account management system reliable enough that clearance blocks will not hit compliant taxpayers by mistake?',
                    'Has the partner agency (lands registry, planning department) agreed to embed the clearance check in their workflow?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-14',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Register unpaid tax as a charge against the property',
            shortTitle: 'Property Tax Liens',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Medium-High',
            category: 'Enforcement',
            sortOrder: 14,
            isActive: true,
            overview: {
                mainPurpose: 'Secure the city\'s claim on unpaid property tax by registering a legal charge (lien) against the property, which must be cleared before the property can be sold, transferred, or used as collateral, ensuring that the debt follows the property rather than the person.',
                bestStartingPoint: 'Confirm the legal basis for registering tax liens, identify the top defaulter accounts where the owed amounts justify the administrative effort, and work with the lands registry to establish the lien-registration workflow.',
                firstVisibleResult: 'Within the first year, property owners who discover liens on their titles (usually when attempting a transaction) will clear their arrears to remove the lien, and the existence of the lien program will deter future non-payment among property owners who plan to sell or borrow.',
                leadershipDecision: 'Leaders must decide on the threshold for lien registration (minimum arrears amount), the legal process and costs, whether to pursue lien foreclosure for the most extreme cases, and how to handle politically sensitive properties.',
                likelyLeadOwner: 'Revenue department legal and enforcement unit, in coordination with the lands registry and city attorney.',
                whatThisOptionDoes: 'Registers a formal legal charge against properties with significant unpaid tax arrears. The lien appears on the property\'s title record at the lands registry and must be satisfied (tax paid in full, including penalties) before the title can be transferred, the property can be mortgaged, or the lien can be removed. For extreme cases, the lien may eventually support foreclosure proceedings.',
                mostUsefulWhen: [
                    'Large arrears have accumulated on specific properties despite repeated notices and penalty application.',
                    'The legal framework supports tax liens and the lands registry can record them.',
                    'The property market is active enough that a lien creates a real obstacle for the owner.',
                    'The city wants a durable enforcement tool that persists even if the property changes hands.'
                ],
                usuallyNotBestFirstMove: [
                    'The city has not yet attempted basic enforcement (notices, penalties, visits); liens should be a later-stage tool.',
                    'The lands registry cannot practically record liens, or property titles are largely informal.',
                    'Arrears amounts are too small to justify the legal and administrative cost of lien registration.',
                    'The legal framework does not support tax liens and legislation is not feasible in the near term.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover legal framework for lien creation and registration, inter-agency agreement with the lands registry, lien-registration workflow and costs, notification requirements before lien registration, lien-release process upon payment, foreclosure procedures for extreme cases, staff training, and monitoring.',
                oftenWorksBestAlongside: [
                    'PT-COM-13 (Tax clearance) because clearance requirements and liens are complementary: clearance blocks transactions, liens block titles.',
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-12 (Defaulter visits) because the lien is the next enforcement step after notices and visits fail.',
                    'PT-COM-05 (Installment plans) because a payment plan may be offered as an alternative to lien registration.',
                    'PT-COM-11 (Penalties) because the lien amount should include accumulated penalties and interest.'
                ],
                politicalNote: 'Property liens are politically sensitive because they restrict ownership rights and, in extreme cases, can lead to foreclosure. The political defense is that liens protect the city\'s revenue and create equity: compliant taxpayers should not subsidize defaulters. Graduated and proportionate application, with liens reserved for significant arrears after multiple warnings, reduces political risk.'
            },
            fullDetails: {
                whyThisMatters: 'A tax lien is one of the strongest enforcement tools available because it attaches the debt to the property rather than the person. Even if the owner ignores notices, avoids visits, and refuses to pay penalties, the lien remains on the title and will eventually need to be resolved, typically when the owner tries to sell, refinance, or transfer the property. The lien also protects the city\'s interest in cases where the owner is judgment-proof (no other assets) or changes: the debt follows the property. In jurisdictions where property markets are active and title registration is functioning, liens have a very high eventual recovery rate.',
                whenStrongFit: [
                    'Significant arrears have accumulated on properties whose owners have ignored all prior enforcement steps.',
                    'The lands registry maintains a functioning title register where liens can be recorded and discovered.',
                    'The legal framework supports tax lien registration, or enabling legislation can be enacted.',
                    'The property market is active enough that owners care about encumbrances on their titles.'
                ],
                whatToLineUpFirst: [
                    'Confirm the legal authority to register tax liens and the specific legal requirements (notice, hearing, registration fee).',
                    'Negotiate a process with the lands registry for lien registration, search, and release.',
                    'Identify the accounts that meet the threshold for lien registration and verify the amounts owed.',
                    'Draft notification templates informing property owners that a lien will be registered if payment is not made within a specified period.'
                ],
                designChoices: [
                    'Threshold: minimum arrears amount for lien eligibility (high enough to justify the cost, low enough to be meaningful).',
                    'Pre-lien notice period: how many days\' notice before the lien is registered (30, 60, or 90 days).',
                    'Lien scope: covers all outstanding arrears plus penalties and interest, or capped at a defined period.',
                    'Foreclosure option: whether extreme cases can lead to forced sale, and the legal and political feasibility.',
                    'Lien release: immediate upon full payment, or within a defined processing period.'
                ],
                practicalPath: {
                    first90Days: [
                        'Review the legal framework for tax liens: authority, process, costs, and any gaps requiring legislative action.',
                        'Meet with the lands registry to design the lien-registration and lien-release workflow.',
                        'Identify the first batch of properties eligible for lien registration (e.g., top 50 by arrears amount).',
                        'Send pre-lien notification letters to these property owners, offering 60 days to pay or enter a payment plan.'
                    ],
                    sixTo12Months: [
                        'Register liens on properties whose owners did not respond to pre-lien notices.',
                        'Track payment recoveries prompted by lien registration or pre-lien notification.',
                        'Process lien-release requests from owners who have cleared their accounts.',
                        'Publicize the lien program (without naming individual properties) to create a deterrent effect.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Expand the program to additional properties that meet the threshold criteria.',
                        'Evaluate the cost-effectiveness: revenue recovered versus legal and administrative costs.',
                        'Address long-standing liens where owners have neither paid nor attempted to transact, and consider escalation options.',
                        'Integrate lien status into the billing system so that account managers can see lien information alongside payment history.'
                    ]
                },
                legalInstitutional: [
                    'Enact or confirm legislation authorizing the registration of tax liens on property titles.',
                    'Define the legal process: notice requirements, hearing rights, registration procedure, priority of the lien relative to other encumbrances.',
                    'Establish the lien-release process: how quickly must the lien be removed after full payment?',
                    'Define foreclosure procedures for extreme cases, if the law supports it, including judicial oversight and surplus proceeds rules.'
                ],
                capacitySystemsPartnerships: [
                    'Legal staff to prepare lien-registration filings and handle disputes.',
                    'Inter-agency agreement with the lands registry for efficient lien registration and release.',
                    'Billing system integration to track lien status and trigger notifications.',
                    'Budget for registration fees and legal costs.'
                ],
                risksAndSafeguards: [
                    'Risk: Liens are registered on properties with disputed ownership or contested tax amounts. Safeguard: Require verified account review before any lien is filed, and allow expedited dispute resolution.',
                    'Risk: The lands registry is too slow or disorganized to register and release liens efficiently. Safeguard: Pilot with a small batch and negotiate processing timelines before scaling up.',
                    'Risk: Lien foreclosure is politically untenable and the lien becomes a toothless encumbrance. Safeguard: Even without foreclosure, liens block transactions and borrowing, which provides sufficient incentive for most owners.',
                    'Risk: Liens disproportionately affect low-income owners with inherited properties and accumulated arrears. Safeguard: Offer installment plans and hardship provisions before registering liens.'
                ],
                whatToMonitor: [
                    'Number of liens registered and the total arrears amount they represent.',
                    'Revenue recovered from pre-lien notifications (owners who pay to avoid the lien).',
                    'Revenue recovered from lien registrations (owners who pay to remove the lien).',
                    'Lien processing time: days from filing to registration, and days from payment to release.',
                    'Dispute volume and outcomes related to liens.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-13 (Tax clearance): Clearance and liens are complementary tools; clearance blocks the transaction, the lien blocks the title.',
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-12 (Defaulter visits): Liens are the next step after these measures fail.',
                    'PT-COM-11 (Penalties): The lien amount includes accumulated penalties and interest.',
                    'PT-COM-05 (Installment plans): Offering a payment plan before lien registration provides a fair off-ramp.',
                    'PT-COM-09 (Collections tracking): Lien-related revenue should be tracked separately to measure the program\'s effectiveness.'
                ],
                questionsBeforeLaunch: [
                    'Does the legal framework support tax lien registration, or is legislation needed?',
                    'Can the lands registry register and release liens within an acceptable timeframe?',
                    'What is the minimum arrears threshold for lien eligibility, and how many properties meet it?',
                    'Is leadership prepared to support lien registration on high-profile properties?'
                ]
            }
        },

        // =====================================================================
        // D. SUPPORT TAXPAYERS AND FIX AVOIDABLE PROBLEMS
        // =====================================================================

        {
            solutionId: 'PT-COM-15',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Set up a help desk and quick fixes for billing mistakes',
            shortTitle: 'Help Desk and Corrections',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Low',
            category: 'Support',
            sortOrder: 15,
            isActive: true,
            overview: {
                mainPurpose: 'Give taxpayers a single, accessible point of contact to ask questions, report billing errors, request corrections, and resolve disputes quickly, so that avoidable problems do not become reasons for non-payment.',
                bestStartingPoint: 'Catalogue the most common taxpayer complaints and queries, assign a phone line and an email or WhatsApp number, train two to three staff to handle the top 10 query types, and publicize the help desk on every bill and notice.',
                firstVisibleResult: 'Within the first month, taxpayers should begin using the help desk, and correction turnaround times should be measurably shorter than the old process of visiting the revenue office in person.',
                leadershipDecision: 'Leaders must decide on the help desk\'s scope (billing queries only or all property tax matters), staffing level, channel mix (phone, email, WhatsApp, walk-in), and the authority of help-desk staff to make corrections without supervisor approval.',
                likelyLeadOwner: 'Revenue department customer service or operations unit, with IT support for query tracking and knowledge-base tools.',
                whatThisOptionDoes: 'Establishes a dedicated help desk that taxpayers can reach by phone, email, WhatsApp, or walk-in to ask questions about their property tax bill, report errors, request corrections, check their account balance, and file formal disputes. The help desk uses a simple query-tracking system to log every contact, categorize it, and track resolution. Staff are authorized to make routine corrections (name, address, payment allocation) on the spot, with a defined escalation path for more complex issues.',
                mostUsefulWhen: [
                    'Taxpayer complaints about billing errors, confusion, or lack of responsiveness are common and contribute to non-payment.',
                    'The revenue office is overwhelmed with walk-in queries that could be handled more efficiently by phone or message.',
                    'The city is launching new billing formats, payment channels, or enforcement measures that will generate questions.',
                    'Leadership wants to demonstrate a customer-service orientation as part of a broader compliance and trust-building effort.'
                ],
                usuallyNotBestFirstMove: [
                    'There are very few taxpayers and the revenue director can handle all queries personally.',
                    'The primary problem is not confusion or errors but fundamental issues with coverage, valuation, or billing that need to be fixed first.',
                    'There is no budget for even a minimal help-desk staffing allocation.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover help-desk setup (channels, staffing, hours), query-tracking system, staff training on the top 20 query types, authority matrix for corrections, escalation procedures, performance standards (response time, resolution time), taxpayer communication about the help desk, and monitoring and continuous improvement.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the help desk handles residual queries that even good bills generate.',
                    'PT-COM-04 (Easy payment channels) because help-desk staff guide taxpayers to the right payment channel.',
                    'PT-COM-10 (Overdue notice ladder) because overdue notices should include the help-desk number for disputed bills.',
                    'PT-COM-16 (Show where the money goes) because the help desk can share information about how revenue is used.'
                ],
                politicalNote: 'A help desk is universally popular. Taxpayers appreciate being heard, and elected officials can point to the help desk as evidence of government responsiveness. There is no meaningful political risk.'
            },
            fullDetails: {
                whyThisMatters: 'Every property tax system generates errors, confusion, and disputes. Names are misspelled, addresses are wrong, exemptions are not applied, payments are credited to the wrong account, and taxpayers do not understand their bills. Without a help desk, each of these small problems becomes a reason not to pay, because the taxpayer has no easy way to get it fixed. The help desk converts these barriers into resolved queries: the taxpayer calls, the problem is fixed, and the payment follows. Help desks also generate invaluable intelligence about systemic problems (e.g., "50% of calls are about missing exemptions" signals a process failure that needs fixing at the source).',
                whenStrongFit: [
                    'Revenue office staff spend a large share of their time handling walk-in queries that could be resolved by phone or message.',
                    'Taxpayer complaints and billing errors are a significant contributor to non-payment or late payment.',
                    'The city is launching reforms (new bill format, new payment channels, enforcement) that will generate questions.',
                    'Query-tracking data would help leadership identify and fix systemic issues.'
                ],
                whatToLineUpFirst: [
                    'Designate a phone number, email address, and WhatsApp number for the help desk and publicize them.',
                    'Recruit or assign 2-3 staff with good communication skills and train them on the top 20 query types.',
                    'Set up a simple query-tracking system (even a shared spreadsheet) to log every contact, category, status, and resolution.',
                    'Define the authority matrix: what corrections can help-desk staff make on the spot, and what requires escalation?'
                ],
                designChoices: [
                    'Channels: phone only, or also email, WhatsApp, SMS, and walk-in counter.',
                    'Hours: business hours only, extended hours, or 24/7 (not usually needed for property tax).',
                    'Authority: staff can correct name, address, and payment allocation on the spot; valuation disputes and exemption changes require escalation.',
                    'Technology: shared spreadsheet for tracking, or a proper ticketing system (e.g., open-source helpdesk software).',
                    'Performance standard: answer within 30 seconds, resolve routine queries on the first contact, complex queries within 5 business days.'
                ],
                practicalPath: {
                    first90Days: [
                        'Set up the help-desk phone line, email, and WhatsApp number.',
                        'Train 2-3 staff on the top 20 query types, using a simple FAQ and decision tree.',
                        'Create the query-tracking log and begin recording every contact.',
                        'Publicize the help desk on all bills, notices, and the city website.'
                    ],
                    sixTo12Months: [
                        'Analyse query data monthly: what are the top complaint categories, and what is the average resolution time?',
                        'Use the data to identify systemic issues and fix them at the source (e.g., if many calls are about missing exemptions, fix the exemption process).',
                        'Refine the FAQ and decision tree based on actual queries.',
                        'Report help-desk performance to leadership monthly: volume, resolution rate, and satisfaction scores if collected.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Scale the help desk if volume warrants (additional staff, extended hours, or a callback system for peak periods).',
                        'Introduce a taxpayer satisfaction survey (one question after each interaction) to track service quality.',
                        'Automate routine queries (account balance lookup, payment status) through an IVR system or chatbot.',
                        'Integrate help-desk data into the collections dashboard for a unified view of taxpayer interactions.'
                    ]
                },
                legalInstitutional: [
                    'No specific legal changes are typically needed to set up a help desk.',
                    'Ensure that help-desk staff have read access to the billing and payment systems so they can answer queries.',
                    'Define the authority matrix clearly: what corrections require supervisor or legal approval.',
                    'Establish data-protection protocols for handling taxpayer information over the phone or WhatsApp.'
                ],
                capacitySystemsPartnerships: [
                    'Dedicated staff (minimum 2-3) with good communication skills and property tax knowledge.',
                    'Phone system capable of handling the expected call volume (may need a basic call-queue system).',
                    'Access to the billing and payment systems for real-time account lookup.',
                    'Query-tracking tool (spreadsheet or ticketing software).'
                ],
                risksAndSafeguards: [
                    'Risk: Help desk is overwhelmed during billing season and callers cannot get through. Safeguard: Staff up temporarily during peak periods, use a callback system, and promote self-service options.',
                    'Risk: Help-desk staff make corrections that introduce new errors. Safeguard: Require supervisor review for changes above a defined threshold.',
                    'Risk: The help desk becomes a complaint box without resolution authority. Safeguard: Give staff clear authority for routine corrections and fast escalation paths for complex issues.',
                    'Risk: Taxpayer data is mishandled in phone or WhatsApp interactions. Safeguard: Train staff on data-protection protocols and verify caller identity before sharing account details.'
                ],
                whatToMonitor: [
                    'Query volume by channel and category, tracked weekly.',
                    'First-contact resolution rate: share of queries resolved without escalation.',
                    'Average resolution time for routine and escalated queries.',
                    'Top query categories: trends that signal systemic issues needing upstream fixes.',
                    'Taxpayer satisfaction: feedback scores or complaints about the help-desk experience.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): The help desk handles residual queries that even well-designed bills generate.',
                    'PT-COM-02 (Bill delivery): Taxpayers who did not receive a bill often contact the help desk first.',
                    'PT-COM-04 (Easy payment channels): Help-desk staff guide taxpayers to the right payment option.',
                    'PT-COM-10 (Overdue notice ladder): Overdue notices should include the help-desk number.',
                    'PT-COM-13 (Tax clearance): Clearance-related queries will flow to the help desk.'
                ],
                questionsBeforeLaunch: [
                    'Are 2-3 staff available and trained to handle property tax queries by phone and message?',
                    'Is a phone number and WhatsApp number set up and published on all bills and notices?',
                    'Is a query-tracking system in place to log every contact and measure resolution performance?',
                    'Are help-desk staff authorized to make routine corrections (name, address, payment allocation) without supervisor approval?'
                ]
            }
        },

        // =====================================================================
        // E. BUILD TRUST AROUND PAYMENT AND REFORM
        // =====================================================================

        {
            solutionId: 'PT-COM-16',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Show taxpayers where the money goes',
            shortTitle: 'Revenue Transparency',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Medium',
            category: 'Trust',
            sortOrder: 16,
            isActive: true,
            overview: {
                mainPurpose: 'Strengthen voluntary compliance by showing taxpayers clearly and regularly how their property tax payments are used for local services and infrastructure, closing the perception gap between payment and benefit.',
                bestStartingPoint: 'Identify 3-5 concrete, visible projects or services funded by property tax revenue (road repairs, street lighting, waste collection, school maintenance), document them with photos and costs, and publish them through the same channels used for billing.',
                firstVisibleResult: 'Within one to two billing cycles, taxpayer surveys or anecdotal feedback should show increased awareness of how property tax revenue is used, and payment rates should begin improving, particularly among taxpayers who previously cited "I don\'t see what I get" as a reason for non-payment.',
                leadershipDecision: 'Leaders must decide how transparent to be about revenue allocation (total budget versus project-specific spending), whether to link property tax specifically to popular services, and how to handle the inevitably critical scrutiny of spending efficiency.',
                likelyLeadOwner: 'Communications unit in coordination with the revenue department and the public works or service delivery departments that spend the revenue.',
                whatThisOptionDoes: 'Establishes a regular practice of communicating to taxpayers how property tax revenue is allocated and spent. This may include: a one-page insert in the tax bill showing last year\'s revenue and how it was spent; a poster in each ward listing local projects funded by property tax; social media posts highlighting completed projects; an annual "taxpayer report" summarizing revenue, spending, and service delivery outcomes.',
                mostUsefulWhen: [
                    'Taxpayer surveys or anecdotal evidence show that many residents do not believe the city uses their money well.',
                    'The city has visible, tangible projects or services that can be linked to property tax funding.',
                    'Trust in local government is low and leadership wants to build confidence as part of a compliance push.',
                    'The city is about to raise rates, expand the roll, or launch enforcement, and needs to justify why the tax matters.'
                ],
                usuallyNotBestFirstMove: [
                    'The city cannot point to any visible service improvements funded by property tax; making claims without evidence will backfire.',
                    'Revenue is pooled at a higher level of government and the local authority has no control over spending.',
                    'The spending situation is genuinely problematic (widespread mismanagement) and transparency would reveal more problems than it solves; fix spending first.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover content development (identifying and documenting funded projects), communication channels (bill inserts, posters, social media, community meetings), production and distribution, frequency (annual or more often), audience segmentation, and impact measurement.',
                oftenWorksBestAlongside: [
                    'PT-COM-01 (Clear bills) because the bill itself is the highest-reach communication channel.',
                    'PT-COM-17 (Taxpayer information campaign) because transparency messaging is a core component of the broader campaign.',
                    'PT-COM-07 (Receipting) because trustworthy receipting supports the message that revenue is properly managed.',
                    'PT-COM-03 (Reminders) because reminder messages can include a brief note about what the tax funds.'
                ],
                politicalNote: 'Revenue transparency is moderately sensitive. Elected officials generally welcome the opportunity to showcase projects, but transparency also invites scrutiny of spending quality and efficiency. The best approach is honest, specific reporting rather than vague claims, and a willingness to acknowledge areas where improvement is needed.'
            },
            fullDetails: {
                whyThisMatters: 'The single most common reason taxpayers give for not paying property tax in developing countries is "I don\'t see what I get." This perception, whether accurate or not, breaks the social contract between the taxpayer and the government. Revenue transparency rebuilds this contract by making the link between payment and benefit visible and concrete. Research from multiple countries shows that when taxpayers can see specific projects funded by their tax payments, willingness to pay increases significantly, sometimes by 10-20%. Transparency also creates accountability pressure on the spending side: once the city commits to showing where the money goes, it faces stronger incentives to spend wisely.',
                whenStrongFit: [
                    'Non-payment surveys cite "I don\'t see the benefit" or "the money is wasted" as top reasons for non-compliance.',
                    'The city has recently completed or is actively delivering visible projects (roads, lighting, drainage, clinics) that can be linked to property tax revenue.',
                    'A billing or rate reform is planned, and taxpayers need to understand why the tax matters.',
                    'Communication channels to reach taxpayers (bills, SMS, social media, community meetings) are already in place.'
                ],
                whatToLineUpFirst: [
                    'Work with the finance and public works departments to identify 3-5 specific, visible expenditures funded by property tax revenue.',
                    'Document each project with photographs, costs, location, and beneficiary information.',
                    'Design communication materials: a one-page bill insert, ward-level posters, and social media templates.',
                    'Get leadership approval for the messaging, including how to handle questions about spending efficiency.'
                ],
                designChoices: [
                    'Scope: total property tax revenue and top-level allocation, or project-by-project detail.',
                    'Frequency: annual report, quarterly updates, or continuous social media presence.',
                    'Channels: bill insert (highest reach), ward posters, social media, community meetings, or all of the above.',
                    'Attribution: "your property tax funded this road" (direct link) or "local revenue, including property tax, supports these services" (broader framing).',
                    'Engagement: one-way reporting, or interactive (taxpayer can vote on spending priorities or ask questions).'
                ],
                practicalPath: {
                    first90Days: [
                        'Identify and document 3-5 visible projects or services funded by property tax revenue.',
                        'Design a one-page bill insert showing total revenue collected and how it was spent, with photographs.',
                        'Create ward-level posters listing local projects funded by property tax.',
                        'Draft social media content (posts, photos, short videos) for a 4-week launch campaign.'
                    ],
                    sixTo12Months: [
                        'Include the bill insert in the next billing cycle; distribute posters to ward offices and community centers.',
                        'Run the social media campaign and track engagement (shares, comments, reach).',
                        'Conduct a brief taxpayer survey to measure awareness of how property tax revenue is used, before and after the campaign.',
                        'Use feedback to refine messaging: what resonates most, what questions are people asking?'
                    ],
                    twelveToTwentyFourMonths: [
                        'Publish an annual "taxpayer report" summarizing the year\'s revenue, spending, and service delivery outcomes.',
                        'Expand to ward-level reporting so taxpayers can see what was spent in their area.',
                        'Link transparency reporting to the next billing cycle: "last year you funded X; this year we plan Y."',
                        'Evaluate the impact on payment rates: are wards with stronger transparency messaging showing better compliance?'
                    ]
                },
                legalInstitutional: [
                    'No specific legal changes are usually needed for transparency reporting.',
                    'Ensure that spending data used in communications is consistent with official financial reports.',
                    'Establish an editorial review process so that published figures are accurate and defensible.',
                    'Consider making an annual taxpayer report a formal policy commitment to ensure continuity across political cycles.'
                ],
                capacitySystemsPartnerships: [
                    'Communications or public relations staff to produce materials.',
                    'Coordination with public works and service delivery departments for project information and photographs.',
                    'Print production for bill inserts and posters; social media management capability.',
                    'Budget for production and distribution of materials.'
                ],
                risksAndSafeguards: [
                    'Risk: Taxpayers challenge the spending claims or demand more detailed accounting. Safeguard: Use audited figures, be specific, and include a contact point for questions.',
                    'Risk: The materials highlight spending in some wards but not others, creating resentment. Safeguard: Include ward-level information or at least city-wide figures that benefit all areas.',
                    'Risk: Opposition politicians use the transparency as ammunition to criticize spending. Safeguard: Present facts honestly and acknowledge areas for improvement.',
                    'Risk: The effort is a one-time campaign with no follow-up, eroding credibility. Safeguard: Commit to annual publication and build it into the billing-cycle calendar.'
                ],
                whatToMonitor: [
                    'Taxpayer awareness: share of surveyed taxpayers who can name at least one project funded by property tax.',
                    'Payment rates in the period following the transparency campaign, compared to the same period in prior years.',
                    'Social media engagement: reach, shares, and sentiment of transparency content.',
                    'Complaint tone shift: are "I don\'t see what I get" complaints declining in help-desk records?',
                    'Media coverage: whether the transparency effort generates positive or negative press.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-01 (Clear bills): The bill is the highest-reach channel for transparency messaging.',
                    'PT-COM-17 (Taxpayer information campaign): Transparency messaging is a core component of the broader campaign.',
                    'PT-COM-07 (Receipting): Trustworthy receipting supports the message that revenue is properly managed.',
                    'PT-COM-03 (Reminders): Reminder messages can include a brief note about what the tax funds.',
                    'PT-COM-06 (Early-payment discount): Transparency paired with a discount creates a powerful dual incentive.'
                ],
                questionsBeforeLaunch: [
                    'Can the city point to specific, visible projects or services clearly funded by property tax revenue?',
                    'Are the spending figures accurate, auditable, and consistent with official financial reports?',
                    'Is leadership comfortable with the scrutiny that transparency will invite?',
                    'Are communication channels (bill inserts, social media, posters) ready to deliver the message to a wide audience?'
                ]
            }
        },

        {
            solutionId: 'PT-COM-17',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Compliance',
            title: 'Run a wider taxpayer information and confidence campaign',
            shortTitle: 'Taxpayer Confidence Campaign',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low-Medium',
            politicalSensitivity: 'Medium',
            category: 'Communication',
            sortOrder: 17,
            isActive: true,
            overview: {
                mainPurpose: 'Build broad public understanding of and support for the property tax system through a sustained, multi-channel communication campaign that explains the tax, addresses common misconceptions, and creates social expectations around compliance.',
                bestStartingPoint: 'Conduct or review any available taxpayer attitude survey to identify the top misconceptions and barriers. Then design a phased campaign starting with factual messaging (what the tax is, who pays, how to pay) and progressing to motivational messaging (community benefit, peer compliance, fairness).',
                firstVisibleResult: 'Within three to six months, public awareness of the property tax rules and payment process should increase measurably, and the narrative around the tax should begin shifting from "unfair burden" toward "civic contribution."',
                leadershipDecision: 'Leaders must decide on the campaign\'s tone and key messages, the budget, the role of elected officials as campaign champions, and whether to include messaging about enforcement alongside the positive content.',
                likelyLeadOwner: 'Communications unit with revenue department input on content and the mayor\'s or governor\'s office for political endorsement.',
                whatThisOptionDoes: 'Designs and executes a sustained, multi-channel public communication campaign about property tax. The campaign has multiple phases: awareness (what the tax is and how it works), motivation (what it funds and why it matters), instruction (how to pay, where to get help), and social norms (most of your neighbours are paying; join them). Channels include radio, social media, posters, community meetings, religious leader endorsements, school outreach, and bill inserts.',
                mostUsefulWhen: [
                    'Public understanding of the property tax is low, with widespread misconceptions about who owes, how much, and why.',
                    'Compliance rates are well below potential despite adequate billing and payment infrastructure.',
                    'The city is launching or has recently completed reforms (new billing, new channels, new enforcement) and needs to communicate the changes.',
                    'Trust in local government is a barrier to compliance and leadership wants to invest in changing the narrative.'
                ],
                usuallyNotBestFirstMove: [
                    'Basic infrastructure (billing, delivery, payment) is not yet in place, so the campaign would tell people to pay but they cannot easily do so.',
                    'The city has serious governance or corruption problems that a campaign cannot cover; fix the fundamentals first.',
                    'The budget is extremely tight and every dollar is better spent on billing system improvements or enforcement than on communication.'
                ],
                whatFullCardWouldPlan: 'A full plan would cover audience segmentation, message development and testing, channel strategy, production, phased rollout, engagement with community leaders and influencers, alignment with the billing calendar, and impact measurement through awareness and compliance tracking.',
                oftenWorksBestAlongside: [
                    'PT-COM-16 (Show where the money goes) because transparency messaging is the strongest content for the campaign.',
                    'PT-COM-01 (Clear bills) and PT-COM-04 (Easy payment channels) because the campaign should tell people how to pay, not just why.',
                    'PT-COM-06 (Early-payment discount) because the campaign can publicize the discount as an additional incentive.',
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-11 (Penalties) because the campaign should also signal that enforcement is real.'
                ],
                politicalNote: 'A taxpayer confidence campaign is moderately sensitive. It can be a powerful tool for elected officials to build support, but it can also backfire if the public perceives it as propaganda or if the city\'s track record on service delivery does not match the campaign\'s promises. Authenticity and honesty are essential.'
            },
            fullDetails: {
                whyThisMatters: 'Property tax compliance is not just a billing and enforcement problem; it is also a beliefs and norms problem. In many cities, non-payment is normalized because taxpayers believe that others are not paying, that the money is wasted, that the tax is unfair, or that there are no consequences. A well-designed communication campaign addresses each of these beliefs with evidence and social proof. Research on tax morale consistently shows that public communication can shift norms and increase voluntary compliance, particularly when combined with tangible improvements in service delivery and enforcement. The campaign is not a substitute for good systems and enforcement; it is the connective tissue that makes them work better.',
                whenStrongFit: [
                    'Taxpayer surveys show widespread misconceptions about the tax (who owes, how much, how it is used, what happens if you do not pay).',
                    'Compliance rates are well below potential despite functional billing, payment, and enforcement systems.',
                    'The city has positive stories to tell (completed projects, improved services, enforcement actions) that can anchor the campaign.',
                    'Community leaders, religious leaders, or media figures are willing to support the campaign as champions.'
                ],
                whatToLineUpFirst: [
                    'Conduct or review a taxpayer attitude survey to identify the top misconceptions and barriers.',
                    'Develop key messages addressing each barrier: fairness, benefit, ease of payment, and consequences of non-payment.',
                    'Test messages with focus groups representing different taxpayer segments.',
                    'Identify and recruit campaign champions: the mayor, ward leaders, religious figures, respected business owners.'
                ],
                designChoices: [
                    'Campaign phases: awareness only, or a phased approach (awareness, motivation, instruction, social norms).',
                    'Channels: mass media (radio, TV, newspapers), social media, community meetings, posters, bill inserts, or a mix.',
                    'Tone: purely informational, aspirational (building our city together), or including deterrence (enforcement is real).',
                    'Duration: one-time blitz around billing season, or sustained year-round presence.',
                    'Champions: elected officials (political risk if unpopular), community leaders (trusted but limited reach), or celebrity endorsers.'
                ],
                practicalPath: {
                    first90Days: [
                        'Review or conduct a taxpayer attitude survey to identify the top 5 barriers to compliance.',
                        'Develop key messages and test them with 3-4 focus groups from different demographics.',
                        'Design campaign materials: radio spots, social media posts, posters, and a bill insert.',
                        'Recruit campaign champions and brief them on key messages.'
                    ],
                    sixTo12Months: [
                        'Launch the campaign to coincide with the billing cycle, starting with awareness and instruction messaging.',
                        'Progress to motivation messaging (what the tax funds, community benefit) and social norms messaging (compliance rates, peer behavior).',
                        'Monitor reach and engagement by channel; adjust spending toward the highest-performing channels.',
                        'Hold community meetings in 5-10 wards to supplement mass media with face-to-face engagement.'
                    ],
                    twelveToTwentyFourMonths: [
                        'Conduct a follow-up taxpayer survey to measure changes in awareness, attitudes, and stated willingness to pay.',
                        'Compare compliance rates in high-exposure and low-exposure areas to estimate the campaign\'s impact.',
                        'Refresh campaign content annually with new projects, new stories, and updated compliance data.',
                        'Institutionalize the campaign as an annual activity aligned with the billing calendar, not a one-off.'
                    ]
                },
                legalInstitutional: [
                    'No specific legal changes are needed for a communication campaign.',
                    'Ensure that any compliance data cited (e.g., "80% of residents have paid") is accurate and defensible.',
                    'If using specific taxpayer data or stories, obtain consent and comply with data-protection regulations.',
                    'Establish an editorial review process to ensure all campaign materials are accurate and politically appropriate.'
                ],
                capacitySystemsPartnerships: [
                    'Communications staff or agency for campaign design, production, and management.',
                    'Budget for media buying (radio, social media ads), printing (posters, inserts), and community events.',
                    'Partnerships with local media outlets for editorial coverage and public service announcements.',
                    'Survey capability (or partnership with a research organization) for baseline and follow-up attitude measurement.'
                ],
                risksAndSafeguards: [
                    'Risk: The campaign promises benefits that the city does not deliver, destroying credibility. Safeguard: Only feature projects that are completed or visibly underway; never over-promise.',
                    'Risk: Opposition politicians attack the campaign as propaganda. Safeguard: Focus on facts and verified data; invite cross-party endorsement.',
                    'Risk: The campaign raises awareness but taxpayers still cannot pay easily. Safeguard: Ensure billing, payment channels, and help desk are ready before launching the campaign.',
                    'Risk: Campaign fatigue if the same messages are repeated without fresh content. Safeguard: Plan new content for each phase and refresh annually.'
                ],
                whatToMonitor: [
                    'Public awareness: share of surveyed residents who know the property tax rules, payment channels, and consequences of non-payment.',
                    'Attitude shift: change in the share of respondents who agree that property tax is fair and worthwhile.',
                    'Compliance rates during and after the campaign period, compared to prior years.',
                    'Campaign reach: number of people reached by channel (radio listenership, social media impressions, meeting attendance).',
                    'Cost per additional payment: campaign cost divided by the estimated number of additional payments attributable to the campaign.'
                ],
                connectionsToOtherCards: [
                    'PT-COM-16 (Show where the money goes): Transparency content is the campaign\'s most powerful material.',
                    'PT-COM-01 (Clear bills): Campaign messaging should align with and reinforce the information on the bill.',
                    'PT-COM-04 (Easy payment channels): Campaign materials must include clear instructions on how and where to pay.',
                    'PT-COM-06 (Early-payment discount): The campaign can publicize the discount as an additional reason to pay promptly.',
                    'PT-COM-10 (Overdue notice ladder) and PT-COM-11 (Penalties): Campaign messaging should include enforcement information to balance the positive content with deterrence.'
                ],
                questionsBeforeLaunch: [
                    'Has a taxpayer attitude survey been conducted to identify the specific beliefs and misconceptions the campaign needs to address?',
                    'Are billing, payment, and help-desk systems ready so that taxpayers who respond to the campaign can follow through?',
                    'Is there budget for a sustained campaign, or only a one-time effort?',
                    'Are campaign champions (mayor, community leaders, media) committed and briefed on the key messages?'
                ]
            }
        }

    ];

})(window);
