/**
 * ROSRA Solutions Data - Property Tax Compliance
 * Generated from approved solution-card DOCX files.
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTCompliance = [
    {
        "solutionId": "PT-COM-01",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Send bills people can understand",
        "shortTitle": "Clear Bills",
        "timeline": "1–2 years",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Low",
        "category": "Billing",
        "sortOrder": 1,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Issue clear, standard bills that explain in plain language what is due, why it is due, when it is due, and how it can be paid. Better bills reduce disputes, make reminders and enforcement more credible, and help taxpayers see the system as rule-based rather than arbitrary.",
            "mostUsefulWhen": [
                "Billing errors or confusion are common.",
                "Valuation or ownership data exist but are not translated into understandable bills.",
                "The city wants a stronger base for reminders, payment, and enforcement."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A standard bill format and at least a basic billing database or generator.",
                "Staff who can explain the new bill and answer common questions."
            ],
            "usuallyNotBestFirstMove": [
                "Do not overinvest in bill redesign if the underlying register is still badly broken.",
                "This is not enough by itself when bills never reach taxpayers."
            ],
            "politicalNote": "Most compliance reforms rise or fall on consistency. Taxpayers quickly notice whether the city applies the rule across the roll or only in selected cases.",
            "whatFullCardWouldPlan": "The full card would help the city plan the bill template, the calculation display, the data requirements, the testing process, and the supporting scripts staff will need when taxpayers ask for explanations.",
            "oftenWorksBestAlongside": [
                "Make sure bills actually reach taxpayers",
                "Use reminder messages before and after due dates",
                "Set up a help desk and quick fixes for billing mistakes."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A city cannot expect steady payment when bills are confusing, inconsistent, or hard to verify. Clear bills are the basic translation layer between the property register, the assessment process, and the taxpayer. They help taxpayers see that the demand is rule-based, they reduce avoidable disputes, and they make reminders and enforcement easier to defend. In practice, a clearer bill is often one of the fastest ways to make the whole collection chain feel more credible.",
            "whenStrongFit": [
                "Billing errors, unexplained amounts, or taxpayer confusion are common.",
                "Assessment, ownership, or exemption data already exist, but the city is not presenting them in a simple way.",
                "Leadership wants a stronger base for reminders, payment channels, and later enforcement."
            ],
            "whatToLineUpFirst": [
                "Start with one standard bill layout that can work across all wards and taxpayer groups; avoid designing different formats for each office.",
                "If the billing database is still weak, pilot the new bill on a narrower segment first, such as high-value properties or one ward, rather than waiting for perfect citywide data.",
                "Agree who owns the bill template, who approves content changes, and who will answer taxpayer questions once the new format goes live."
            ],
            "designChoices": [
                "How much detail should appear on the face of the bill, and how much should move to an annex, insert, or back page.",
                "Whether the bill should show only the current amount due or also show the assessment basis, exemptions, prior balance, and payment history.",
                "Which languages, symbols, and payment instructions are needed so the bill works for ordinary taxpayers rather than only technical staff."
            ],
            "practicalPath": {
                "first90Days": [
                    "Audit the current bill and identify the most common points of confusion, missing fields, and manual workarounds.",
                    "Draft one plain-language template, test it with frontline staff and a small group of taxpayers, and simplify the wording before launch.",
                    "Confirm the minimum data fields needed to generate the bill consistently, including property ID, owner name, amount due, due date, and payment channels."
                ],
                "sixTo12Months": [
                    "Run the new bill format in a pilot area or taxpayer segment and track the questions it generates at the counter or help desk.",
                    "Adjust the layout, wording, and calculation display based on real use rather than internal assumptions.",
                    "Train staff on a short explanation script so taxpayers hear the same answer regardless of which office they contact."
                ],
                "twelveToTwentyFourMonths": [
                    "Expand the template across the full roll and stop parallel use of outdated local formats.",
                    "Build the bill format into routine system updates so future changes to rates, exemptions, or payment channels do not create new confusion.",
                    "Use what the city learns from complaints and help-desk traffic to improve both the bill and the underlying data."
                ]
            },
            "legalInstitutional": [
                "Check whether current law or regulations prescribe the content or delivery format of the bill; if they do, align the redesign with that rule or adjust the rule first.",
                "Clarify which unit has formal responsibility for bill issuance, because ownership is often split awkwardly between valuation, revenue, and IT functions.",
                "If electronic billing is planned, confirm that the chosen notice format is legally recognised or adopt a short local rule to support it."
            ],
            "capacitySystemsPartnerships": [
                "The city needs at least a basic billing database or bill generator; a highly advanced system is not required at the start, but consistent data fields are.",
                "Front-office and call-centre staff must be briefed before the first bills go out, otherwise the redesigned bill can create more pressure rather than less.",
                "If exemptions or arrears are shown on the bill, the underlying records must be reliable enough that staff can explain them confidently."
            ],
            "risksAndSafeguards": [
                "If the bill tries to show too much at once, taxpayers may be overwhelmed rather than better informed; keep the first version simpler than internal teams initially want.",
                "If the presentation is improved but the underlying account data remain visibly wrong, taxpayers may become even more frustrated because the bill looks authoritative but is still inaccurate.",
                "If each office continues to tweak the format informally, the reform will unravel; lock the template and route later changes through one owner."
            ],
            "whatToMonitor": [
                "Share of bills generated in the standard format rather than older local versions.",
                "Volume and type of taxpayer questions or complaints linked to bill comprehension.",
                "Number of manual bill corrections required after issuance.",
                "Share of bills that display all core information fields correctly."
            ],
            "connectionsToOtherCards": [
                "Make sure bills actually reach taxpayers.",
                "Use reminder messages before and after due dates.",
                "Set up a help desk and quick fixes for billing mistakes."
            ],
            "questionsBeforeLaunch": [
                "What is the shortest explanation of the bill that an ordinary taxpayer in your city should be able to follow?",
                "Which fields on the current bill generate the most confusion or mistrust?",
                "Who will own future changes to the template once the first version is launched?",
                "Can staff explain the amount due consistently without improvising?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-02",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Make sure bills actually reach taxpayers",
        "shortTitle": "Bill Delivery",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Low–Medium",
        "category": "Delivery",
        "sortOrder": 2,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Use a practical mix of digital delivery and hand delivery so that taxpayers actually receive their bills. A city cannot credibly enforce or penalise non-payment if large numbers of taxpayers never got a notice in the first place.",
            "mostUsefulWhen": [
                "The city hears frequent claims that bills never arrived.",
                "Digital access is mixed, so one channel alone is not enough.",
                "The administration wants a fairer basis for reminders and enforcement."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Recognition of the chosen notice channels and a simple dispatch plan.",
                "A way to log undelivered notices and feed corrections back into the register."
            ],
            "usuallyNotBestFirstMove": [
                "Do not rely only on digital delivery where phone or email data are weak.",
                "This will not solve deeper data problems if names and addresses are consistently wrong."
            ],
            "politicalNote": "Most compliance reforms rise or fall on consistency. Taxpayers quickly notice whether the city applies the rule across the roll or only in selected cases.",
            "whatFullCardWouldPlan": "The full card would help the city plan the right delivery mix, the route or dispatch logic, proof-of-delivery rules, and the follow-up process for undelivered bills.",
            "oftenWorksBestAlongside": [
                "Use reminder messages before and after due dates",
                "Fix basic record errors quickly",
                "Use a clear overdue notice ladder."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Fair collection starts with credible notice. If a large share of taxpayers never receives a bill, late-payment penalties and stronger enforcement will look arbitrary, even when the city is legally in the right. A practical delivery system therefore matters almost as much as the bill itself. In many cities the best answer is not one channel but a mix: digital delivery where contacts are strong, plus physical delivery or local collection points where they are not.",
            "whenStrongFit": [
                "The city hears frequent claims that bills never arrived or arrived too late to act on.",
                "Digital access is uneven, so a purely electronic approach would leave important groups out.",
                "Management wants a cleaner and fairer basis for reminders, penalties, and enforcement."
            ],
            "whatToLineUpFirst": [
                "Begin by identifying the strongest available delivery channels for each part of the city rather than assuming one channel can serve everyone.",
                "If addresses and contact details are weak, combine delivery reform with a simple process for capturing corrections during the cycle.",
                "Create one dispatch log from the start so the city can see what was sent, what bounced, and what still requires follow-up."
            ],
            "designChoices": [
                "How much of the roll should receive digital notices, and when a paper or hand-delivered notice remains necessary.",
                "What counts as acceptable proof of delivery for different channels, especially before stronger enforcement steps.",
                "Whether ward staff, contracted couriers, postal services, or revenue officers should handle physical delivery in different areas."
            ],
            "practicalPath": {
                "first90Days": [
                    "Map the current delivery routes and identify where bills fail most often: wrong contacts, late printing, weak dispatch, or weak proof of delivery.",
                    "Clean the easiest contact fields first, especially phone numbers and the addresses of high-value accounts.",
                    "Draft a simple hybrid delivery plan that states which channel will be used for which taxpayer groups and how exceptions will be logged."
                ],
                "sixTo12Months": [
                    "Pilot the delivery mix in a limited geography and track what share of notices arrive successfully through each channel.",
                    "Train delivery staff or local counter staff on what information to capture when a notice is undeliverable or a taxpayer offers corrected details.",
                    "Create a standing loop for undelivered notices so corrections feed back into the register instead of remaining in field notebooks."
                ],
                "twelveToTwentyFourMonths": [
                    "Move the hybrid process into routine operations and budget for repeat delivery rather than treating it as a one-off campaign.",
                    "Use delivery data to refine the citywide mix, for example by increasing digital dispatch where contacts prove reliable and reducing wasted paper runs where they do not.",
                    "Link proof of delivery and undelivered cases directly to the overdue notice ladder so escalation is based on real information."
                ]
            },
            "legalInstitutional": [
                "Confirm which delivery channels are legally recognised today and whether digital notices need an explicit local rule or administrative instruction.",
                "If delivery is contracted out or delegated to ward teams, set clear responsibility for data protection, proof of delivery, and handling of returned notices.",
                "Where security or access is sensitive, agree in advance how field teams will identify themselves and how residents can verify legitimacy."
            ],
            "capacitySystemsPartnerships": [
                "A practical dispatch owner is essential; delivery usually fails when printing, dispatch, and follow-up sit in separate teams with no single manager.",
                "The city needs a simple way to merge contact corrections from delivery back into the operational register.",
                "If physical delivery is used, local route knowledge matters as much as formal maps, especially in settlements with weak addressing."
            ],
            "risksAndSafeguards": [
                "Over-reliance on one channel can exclude major taxpayer groups; the first design should be deliberately hybrid where access is mixed.",
                "If proof-of-delivery rules are vague, the city may think it has given notice when it has not, weakening later enforcement.",
                "If undelivered cases are logged but never corrected, the city will repeat the same failure every billing cycle."
            ],
            "whatToMonitor": [
                "Share of bills successfully delivered by each channel.",
                "Number and share of undelivered notices that are corrected and resent.",
                "Time from bill generation to completed dispatch.",
                "Share of enforcement-stage accounts with usable proof that notice was sent."
            ],
            "connectionsToOtherCards": [
                "Send bills people can understand.",
                "Use reminder messages before and after due dates.",
                "Use a clear overdue notice ladder."
            ],
            "questionsBeforeLaunch": [
                "Which parts of the city need a physical channel even if digital delivery expands?",
                "What proof of delivery will the city rely on before escalating to penalties or stronger action?",
                "Who will own the undelivered log and make sure corrections are actually used?",
                "How will the city explain legitimate delivery channels so taxpayers can distinguish them from informal collectors?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-03",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Use reminder messages before and after due dates",
        "shortTitle": "Payment Reminders",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low",
        "politicalSensitivity": "Low",
        "category": "Reminders",
        "sortOrder": 3,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Send short, time-bound reminders shortly before and after due dates so willing taxpayers do not slide into late payment by default. Reminder routines are cheap, visible, and often generate one of the fastest compliance gains.",
            "mostUsefulWhen": [
                "Many taxpayers mean to pay but leave it too late.",
                "Phone or digital contact data exist for a reasonable share of taxpayers.",
                "Management wants a low-cost, quick compliance lift."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A basic list of unpaid accounts and a way to send messages or letters in batches.",
                "Simple, legally safe message templates with consistent wording."
            ],
            "usuallyNotBestFirstMove": [
                "Do not over-message taxpayers if the city cannot suppress reminders once people pay.",
                "This is weak where contact data are too thin to make reminders meaningful."
            ],
            "politicalNote": "Most compliance reforms rise or fall on consistency. Taxpayers quickly notice whether the city applies the rule across the roll or only in selected cases.",
            "whatFullCardWouldPlan": "The full card would help the city plan the reminder calendar, the message tone at each stage, the stop rules once payment arrives, and the data fields needed for low-cost bulk reminders.",
            "oftenWorksBestAlongside": [
                "Make sure bills actually reach taxpayers",
                "Apply late-payment penalties consistently."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A reminder system is often the cheapest and fastest way to improve compliance among taxpayers who are willing to pay but late by habit, oversight, or poor timing. It works best when it is predictable, timed around the due date, and linked to real account status so paid accounts stop receiving messages. Good reminder practice also prepares the ground for later escalation: taxpayers can see that the city gave clear, repeated notice before adding penalties or using stronger tools.",
            "whenStrongFit": [
                "Many taxpayers appear willing but pay late or only after repeated prompting.",
                "The city has usable phone numbers, email addresses, or other contact channels for a meaningful share of the roll.",
                "Management wants an early compliance gain that does not require heavy legal or operational change."
            ],
            "whatToLineUpFirst": [
                "Start with a small, repeatable reminder calendar rather than an elaborate communications strategy that staff cannot maintain.",
                "If account suppression is weak, begin with one or two reminder stages only, so the city does not send repeated messages to taxpayers who have already paid.",
                "Use the first round to test which channels actually reach taxpayers rather than assuming the cheapest channel will be the most effective."
            ],
            "designChoices": [
                "Which reminder stages matter most in your context: before the due date, just after it, or both.",
                "How the tone should change from friendly prompt to firmer overdue message without sounding erratic or threatening.",
                "Whether reminders should be uniform or adapted for different groups such as large debtors, installment-plan taxpayers, or recently corrected accounts."
            ],
            "practicalPath": {
                "first90Days": [
                    "Choose a simple calendar, such as one message shortly before the due date and one or two shortly after it.",
                    "Prepare short templates in plain language and make sure they match the amounts, due dates, and payment channels shown on the bill.",
                    "Set a basic stop rule so messages cease once a payment posts or a taxpayer enters an approved payment plan."
                ],
                "sixTo12Months": [
                    "Run the reminder sequence for one cycle and monitor delivery, response, and complaint rates.",
                    "Adjust timing and wording based on which messages appear to trigger payment and which only trigger confusion.",
                    "Link the reminders to the help desk so staff can handle the predictable increase in routine questions."
                ],
                "twelveToTwentyFourMonths": [
                    "Embed the reminder calendar into routine billing operations rather than leaving it as an ad hoc communication activity.",
                    "Refine the taxpayer segments and stop rules as the data improve, so reminders become more targeted over time.",
                    "Use reminder results to decide which accounts need only low-cost nudges and which should move more quickly into formal overdue follow-up."
                ]
            },
            "legalInstitutional": [
                "Confirm that the city is authorised to use the chosen messaging channels for tax administration and that privacy obligations are met.",
                "Where bulk SMS or email is outsourced, set simple contractual rules for message security, timing, and data use.",
                "Ensure the reminder content does not imply enforcement steps that the city is not yet ready or authorised to apply."
            ],
            "capacitySystemsPartnerships": [
                "The city needs a current list of unpaid accounts and a reliable way to suppress reminders once payment arrives.",
                "Someone must own the calendar, message templates, and day-to-day sending process; reminder systems fail when they are nobody’s core job.",
                "Help-desk staff need the same scripts and dates that appear in the reminders so the taxpayer journey feels coherent."
            ],
            "risksAndSafeguards": [
                "Poor stop rules can undermine trust quickly because taxpayers resent receiving reminders after they have already paid.",
                "Too many messages can feel like harassment and create political pushback; fewer, better-timed reminders are usually stronger than constant contact.",
                "If reminders reference the wrong amount or wrong deadline, they amplify rather than reduce confusion."
            ],
            "whatToMonitor": [
                "Delivery rate of reminders by channel.",
                "Payment rate after each reminder stage.",
                "Number of complaints about repeated or inaccurate reminders.",
                "Share of paid accounts that still received a message because suppression failed."
            ],
            "connectionsToOtherCards": [
                "Make sure bills actually reach taxpayers.",
                "Apply late-payment penalties consistently.",
                "Show taxpayers where the money goes."
            ],
            "questionsBeforeLaunch": [
                "What is the smallest reminder sequence the city can run reliably every cycle?",
                "Which channels have enough coverage to matter without creating major extra cost?",
                "How will the city stop reminders once payment posts?",
                "Who will review reminder performance and change the calendar if response is weak?",
                "B. Make payment easy and trustworthy"
            ]
        }
    },
    {
        "solutionId": "PT-COM-04",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Add easy payment channels close to the taxpayer",
        "shortTitle": "Easy Payment Channels",
        "timeline": "< 1 year to launch",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Low",
        "category": "Payment",
        "sortOrder": 4,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Expand payment beyond city headquarters by using bank agents, mobile money, online channels, or nearby ward counters. Making payment easier usually improves compliance faster than adding tougher enforcement on top of an inconvenient payment system.",
            "mostUsefulWhen": [
                "Queues, distance, or office hours make paying harder than it should be.",
                "Residents already use banks, mobile money, or local agents for other payments.",
                "The city wants to shift money into channels that are easier to reconcile."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Simple agreements with payment providers or a clear local counter process.",
                "A property ID or bill reference that lets payments be matched back to accounts."
            ],
            "usuallyNotBestFirstMove": [
                "Do not add many channels before there is a clear way to post payments correctly.",
                "This is a poor fit where connectivity is extremely weak and no trusted local payment network exists."
            ],
            "politicalNote": "These reforms may look technical, but they are central to trust. It is hard to justify tougher enforcement if taxpayers still face confusing channels, poor receipts, or weak control over where money goes.",
            "whatFullCardWouldPlan": "The full card would help the city plan which channels to prioritise, how to partner with banks or mobile operators, how payments will be posted and reconciled, and how the city will communicate safe payment routes.",
            "oftenWorksBestAlongside": [
                "Issue receipts every time and publish official payment channels",
                "Tighten cash handling and daily reconciliation."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Even a well-designed bill will not convert into payment if the act of paying remains slow, distant, or uncertain. Easier payment channels reduce friction, extend reach beyond city headquarters, and often improve trust because they shift more money into channels that can be tracked and reconciled. In many settings, this is a more productive early investment than jumping straight to harsher enforcement while taxpayers still face inconvenient or opaque payment options.",
            "whenStrongFit": [
                "Distance, queues, or office hours make payment harder than it needs to be.",
                "Residents already use banks, agents, mobile money, or local counters for other routine payments.",
                "The city wants to improve convenience while also reducing leakage and posting errors."
            ],
            "whatToLineUpFirst": [
                "Choose the first channels with two tests in mind: taxpayers will use them, and the city can reconcile them safely.",
                "If the city cannot yet connect digital payments directly to the ledger, start with a small number of channels and a disciplined daily posting routine.",
                "Do not wait for a full enterprise system; a strong payment reference and a practical reconciliation process can support early expansion."
            ],
            "designChoices": [
                "Which channels should open first: bank branches, agent networks, mobile money, web portals, ward counters, or pop-up drives.",
                "Whether each channel will charge taxpayers a fee, and if so, how the city will communicate that clearly.",
                "How the property ID, bill number, or payment reference will be structured so money can be traced back to the right account."
            ],
            "practicalPath": {
                "first90Days": [
                    "Map the dominant payment habits in the city and select the first partner institutions or local channels accordingly.",
                    "Standardise the payment reference and confirm that it appears clearly on the bill, the counter script, and the digital payment instructions.",
                    "Negotiate practical reporting arrangements with partners so payment data arrive in a format the city can actually use."
                ],
                "sixTo12Months": [
                    "Launch the first channels in parallel with clear public instructions and test how quickly payments can be posted and receipted.",
                    "Monitor queue reductions, failed transactions, and unmatched payments so the city can fix operational problems early.",
                    "Adjust staff guidance and taxpayer instructions based on the most common mistakes in the first payment cycle."
                ],
                "twelveToTwentyFourMonths": [
                    "Expand only after the first channels are working consistently; more channels are not better if the back office cannot keep up.",
                    "Bring channel performance into routine weekly reporting so managers can see which routes generate revenue and which generate exceptions.",
                    "Periodically review whether some channels should be reduced, replaced, or strengthened based on use, cost, and control."
                ]
            },
            "legalInstitutional": [
                "Confirm that local law or financial regulations allow revenue collection through third parties, local counters, or digital providers.",
                "Use simple agreements or memoranda to define settlement timelines, responsibilities for failed transactions, and data-sharing rules.",
                "Clarify who is accountable for authorising payment channels and for suspending unsafe or unofficial ones."
            ],
            "capacitySystemsPartnerships": [
                "Back-office reconciliation is critical; additional channels are only an advantage if staff can post and verify payments quickly.",
                "Payment providers and ward counter staff need short, standard instructions on references, receipts, and escalation of errors.",
                "The city should maintain one current list of authorised channels and one simple route for taxpayers to report suspicious collections."
            ],
            "risksAndSafeguards": [
                "Adding too many channels too quickly can increase unmatched payments and erode confidence.",
                "Unofficial agents or ambiguous instructions can create leakage and reputational damage if the city does not publicise authorised channels clearly.",
                "If a new channel works poorly during the first weeks, distrust can spread faster than the city can correct it."
            ],
            "whatToMonitor": [
                "Share of collections by payment channel.",
                "Number and value of unmatched or wrongly posted payments.",
                "Average time from payment to posting on the taxpayer account.",
                "Queue time or travel burden for taxpayers compared with the old arrangement."
            ],
            "connectionsToOtherCards": [
                "Issue receipts every time and publish official payment channels.",
                "Tighten cash handling and daily reconciliation.",
                "Track collections and arrears every week."
            ],
            "questionsBeforeLaunch": [
                "Which channels are closest to the way taxpayers already prefer to pay?",
                "Can the city reconcile and receipt the first channels safely before opening more?",
                "What payment reference will reliably connect money back to the right account?",
                "How will taxpayers know which channels are official and which are not?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-05",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Allow payment in installments for eligible taxpayers",
        "shortTitle": "Installment Plans",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Medium",
        "category": "Payment",
        "sortOrder": 5,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Let taxpayers who struggle with annual lump sums pay in smaller, scheduled installments under clear rules. This helps the willing stay inside the system and can reduce avoidable arrears without weakening the bill itself.",
            "mostUsefulWhen": [
                "Many taxpayers are willing but cash-constrained.",
                "Large annual bills push otherwise-compliant households into arrears.",
                "Leadership wants a fairness measure that still protects revenue."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A simple legal or administrative basis for payment plans.",
                "A register that tracks installments and reactivates penalties when plans fail."
            ],
            "usuallyNotBestFirstMove": [
                "Do not open broad installment plans if the city cannot track partial payments reliably.",
                "This should not become a disguised waiver for chronic non-payers."
            ],
            "politicalNote": "This measure is easiest to defend when it is clearly targeted at taxpayers who are willing but financially stretched. Without guardrails, it can be criticised as softness toward chronic non-payers.",
            "whatFullCardWouldPlan": "The full card would help the city plan eligibility rules, payment-plan agreements, tracking of partial payments, and the conditions under which penalties resume if a plan fails.",
            "oftenWorksBestAlongside": [
                "Apply late-payment penalties consistently",
                "Set up a help desk and quick fixes for billing mistakes."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Some taxpayers do not default because they reject the tax; they default because the annual lump sum hits at the wrong moment or in too large an amount. Well-designed installment plans allow these taxpayers to remain inside the system while protecting the underlying liability. The key is structure: the city needs clear eligibility, a visible payment schedule, and an automatic return to ordinary enforcement if the plan fails.",
            "whenStrongFit": [
                "Many taxpayers appear willing to pay but struggle with one large annual bill.",
                "Households or small owners are falling into arrears because timing, not total liability, is the main barrier.",
                "Leadership wants a fairness measure that helps the willing without writing off the tax."
            ],
            "whatToLineUpFirst": [
                "Keep the first version tightly bounded, such as owner-occupiers, pensioners, or another clearly defined group, so the city can manage the process.",
                "If system capacity is weak, start with a paper or spreadsheet register for approved plans before automating more complex plan logic.",
                "Set a small number of rules that staff can apply consistently, rather than a long case-by-case discretion model."
            ],
            "designChoices": [
                "Which taxpayers should qualify automatically, which should apply, and which should remain outside the scheme.",
                "Whether the city will require a down payment, how many installments it will allow, and when penalties restart if a payment is missed.",
                "How installment plans will be displayed on the account so that reminders, penalties, and collection visits do not clash with an active plan."
            ],
            "practicalPath": {
                "first90Days": [
                    "Identify the main taxpayer groups for whom cash-flow timing is a real problem and decide whether the city wants a narrow or broad first scheme.",
                    "Prepare a short agreement form and a simple ledger process for recording the approved plan, due dates, and consequences of default.",
                    "Train frontline staff on the difference between an installment plan and a waiver so taxpayers receive one consistent message."
                ],
                "sixTo12Months": [
                    "Pilot the scheme on a limited group and monitor whether taxpayers complete the plan or simply postpone default.",
                    "Refine the eligibility and the down-payment rule if the city is admitting too many weak cases or excluding too many viable ones.",
                    "Ensure that installment accounts appear correctly in reminder and overdue systems."
                ],
                "twelveToTwentyFourMonths": [
                    "Bring approved plans into the routine account-management system so the process is not dependent on one officer or one spreadsheet.",
                    "Review annually whether the scheme is helping the intended taxpayers or drifting into a general delay culture.",
                    "Use the results to decide whether to keep the scheme narrow, expand it slightly, or tighten the guardrails."
                ]
            },
            "legalInstitutional": [
                "Check whether local rules already permit payment plans or whether a short local instrument is needed to formalise them.",
                "Clarify who may approve a plan and under what conditions, because informal promises at the counter often create later disputes.",
                "If penalties are suspended while a taxpayer stays on plan, that rule should be stated clearly and applied consistently."
            ],
            "capacitySystemsPartnerships": [
                "The city needs a register of all approved plans, due dates, amounts paid, and missed installments.",
                "Staff must know how to explain the scheme without implying that any taxpayer can negotiate liability informally.",
                "The help desk and overdue teams need visibility on plan status so they do not send contradictory messages."
            ],
            "risksAndSafeguards": [
                "If eligibility is too loose, the city can accidentally create a general expectation that everyone may delay payment without consequence.",
                "If partial payments are not posted correctly, the scheme can create more complaints than it resolves.",
                "If missed plans do not trigger a return to ordinary penalties and enforcement, the city loses credibility quickly."
            ],
            "whatToMonitor": [
                "Number of taxpayers admitted to the scheme.",
                "Share of approved plans completed on schedule.",
                "Value of arrears prevented or resolved through plans.",
                "Share of failed plans that moved promptly back into ordinary enforcement."
            ],
            "connectionsToOtherCards": [
                "Apply late-payment penalties consistently.",
                "Set up a help desk and quick fixes for billing mistakes.",
                "Offer a small early-payment discount."
            ],
            "questionsBeforeLaunch": [
                "Which taxpayer groups is the city trying to help, and why are they struggling now?",
                "What is the minimum down payment that makes the plan credible?",
                "How will staff know when a plan is active, failed, or completed?",
                "What safeguard will prevent installment plans from becoming informal waivers?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-06",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Offer a small early-payment discount",
        "shortTitle": "Early-Payment Discount",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low",
        "politicalSensitivity": "Medium",
        "category": "Incentives",
        "sortOrder": 6,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Offer a modest, time-limited discount for taxpayers who pay early. This can pull revenue forward, build a habit of prompt payment, and create a positive signal before tougher arrears follow-up begins.",
            "mostUsefulWhen": [
                "The city wants more cash earlier in the year.",
                "Many taxpayers can pay on time but need a reason to do so quickly.",
                "Leaders prefer light nudges before stronger enforcement."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Authority to offer the discount and a system that can display the discounted amount clearly.",
                "Basic revenue modelling so the city knows the cost of the incentive."
            ],
            "usuallyNotBestFirstMove": [
                "Do not offer large discounts that erode the tax base.",
                "This is not a good first move where the problem is not timing but inability to pay or poor bill delivery."
            ],
            "politicalNote": "The political question is usually whether the city is giving up too much revenue or favouring taxpayers who can already pay quickly. Small, tightly bounded discounts are generally easier to defend than generous ones.",
            "whatFullCardWouldPlan": "The full card would help the city plan the discount size, the timing window, the revenue implications, the display on the bill, and the communications needed so taxpayers understand that the offer is modest and time-bound.",
            "oftenWorksBestAlongside": [
                "Send bills people can understand; Use reminder messages before and after due dates.",
                "Controls and transparent handling of money",
                "These options are less visible to taxpayers, but they are essential for trust, internal discipline, and protecting revenue once money starts coming in."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A modest early-payment discount can bring cash in sooner, reward prompt behaviour, and create a positive signal before arrears follow-up begins. Its value is usually not the size of the discount itself but the habit it helps create. For that reason, the city should treat it as a bounded behavioural tool, not a major fiscal instrument: small, time-limited, clearly explained, and reviewed against its revenue cost.",
            "whenStrongFit": [
                "The city needs a higher share of collections earlier in the fiscal year.",
                "Many taxpayers can pay on time but tend to delay because there is no practical advantage in paying quickly.",
                "Leadership prefers to combine light incentives with later firmness rather than relying only on penalties."
            ],
            "whatToLineUpFirst": [
                "Model the likely revenue effect before announcing the discount; even a small incentive should be a conscious budget choice.",
                "If the billing system is weak, start with one simple discount window rather than multiple deadlines or differentiated rates.",
                "Prepare a clear public explanation that the discount is limited and does not change the liability for taxpayers who pay later."
            ],
            "designChoices": [
                "How large the discount should be, and whether it should apply to the full bill, only current-year tax, or only taxpayers with no prior arrears.",
                "What time window is long enough to influence behaviour but short enough to accelerate cash flow.",
                "Whether the city wants the offer to apply universally or only to selected taxpayer groups or payment channels."
            ],
            "practicalPath": {
                "first90Days": [
                    "Estimate the likely uptake and fiscal cost using recent collection patterns.",
                    "Confirm the legal route for the discount and set the exact dates and eligibility conditions.",
                    "Update the bill template and payment instructions so the discounted amount and the standard amount are both easy to understand."
                ],
                "sixTo12Months": [
                    "Launch the discount with reminders that emphasise the date, the amount saved, and the authorised ways to pay.",
                    "Monitor uptake during the first weeks and check whether the pattern is genuinely shifting payment forward or simply rewarding taxpayers who would have paid early anyway.",
                    "Correct any bill-display or posting problems immediately, because even minor confusion can undermine the credibility of the offer."
                ],
                "twelveToTwentyFourMonths": [
                    "Review whether the discount improved timing enough to justify its cost and decide whether to keep, reduce, or retire it.",
                    "If retained, embed it in the annual billing calendar so the city does not renegotiate the same question every cycle.",
                    "Use what the city learns to sharpen the mix of positive nudges and firmer overdue action."
                ]
            },
            "legalInstitutional": [
                "Confirm that local law or regulations allow the city to grant a discount on timely payment and define the scope of that authority clearly.",
                "Set the terms by a formal rule or notice rather than by informal practice so staff and taxpayers understand that it is bounded and time-specific.",
                "Ensure that the rule does not accidentally create ambiguity for taxpayers with arrears, partial payments, or active installment plans."
            ],
            "capacitySystemsPartnerships": [
                "The billing and posting process must be able to show the discounted amount correctly and stop applying it after the window closes.",
                "Finance staff should be able to track the cost of the incentive separately from normal collection trends.",
                "Help-desk staff need short explanations for common questions, including whether the discount stacks with other arrangements."
            ],
            "risksAndSafeguards": [
                "If the discount is too generous, the city may simply give away revenue with little behavioural gain.",
                "If eligibility rules are unclear, taxpayers may feel misled or treated inconsistently.",
                "If the city repeats or expands the incentive casually, taxpayers may start waiting for the next offer instead of paying on time."
            ],
            "whatToMonitor": [
                "Share of bills paid within the discount window.",
                "Net revenue effect compared with prior collection timing.",
                "Average payment date for current-year bills.",
                "Number of taxpayer complaints or corrections linked to discount eligibility."
            ],
            "connectionsToOtherCards": [
                "Send bills people can understand.",
                "Use reminder messages before and after due dates.",
                "Allow payment in installments for eligible taxpayers."
            ],
            "questionsBeforeLaunch": [
                "What problem is the city actually trying to solve: payment timing, arrears, or political visibility?",
                "How small can the discount be while still being noticed?",
                "Which taxpayers will be included or excluded, and why?",
                "How will the city explain the difference between an early-payment incentive and a waiver?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-07",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Issue receipts every time and publish official payment channels",
        "shortTitle": "Receipting and Transparency",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low",
        "politicalSensitivity": "Low",
        "category": "Receipting",
        "sortOrder": 7,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Make official receipts mandatory for every payment and publicise the channels that are authorised to receive tax money. This reduces leakage, protects taxpayers, and makes the payment system feel safer and more legitimate.",
            "mostUsefulWhen": [
                "Taxpayers worry that payments are not being recorded properly.",
                "Money is collected through multiple counters or third parties.",
                "The city wants a visible anti-leakage reform with immediate trust value."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A standard receipt format and a rule that every payment must produce proof.",
                "A public list of authorised channels and a way to report suspicious collections."
            ],
            "usuallyNotBestFirstMove": [
                "This should not be treated as a substitute for reconciliation and cash controls.",
                "Do not multiply receipt formats in ways that confuse taxpayers and staff."
            ],
            "politicalNote": "These reforms may look technical, but they are central to trust. It is hard to justify tougher enforcement if taxpayers still face confusing channels, poor receipts, or weak control over where money goes.",
            "whatFullCardWouldPlan": "The full card would help the city plan which channels to prioritise, how to partner with banks or mobile operators, how payments will be posted and reconciled, and how the city will communicate safe payment routes.",
            "oftenWorksBestAlongside": [
                "Add easy payment channels close to the taxpayer",
                "Tighten cash handling and daily reconciliation."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Trust rises when taxpayers can prove that they paid and can easily see which channels are authorised to receive tax money. Mandatory receipting and a visible list of official payment channels are therefore basic anti-leakage reforms as well as customer-service reforms. They reduce space for unofficial collectors, protect honest staff, and make it easier for the city to ask taxpayers to pay through safer, traceable routes.",
            "whenStrongFit": [
                "Taxpayers worry that money disappears, is misdirected, or is not posted correctly.",
                "Payments are collected through several counters, agents, or partner institutions.",
                "The city wants a visible reform that protects both revenue and taxpayer confidence."
            ],
            "whatToLineUpFirst": [
                "Begin with one standard receipt rule that applies across all channels, rather than different local practices by office or payment point.",
                "If a fully digital receipt is not yet realistic, start with serialised paper or hybrid receipts and one clear rule for how they are logged.",
                "Publish the list of official payment routes before widening collection activity, so taxpayers can recognise legitimate channels."
            ],
            "designChoices": [
                "Whether the city will use only digital receipts, only paper receipts, or a hybrid arrangement during transition.",
                "How taxpayers can verify that a channel is official and report suspicious collectors or fake receipts.",
                "How much receipt detail should be shown on the spot versus in the back-office posting record."
            ],
            "practicalPath": {
                "first90Days": [
                    "Standardise the receipt format and include the basic identifiers taxpayers need: date, amount, property reference, and payment channel.",
                    "List all currently authorised payment channels and remove outdated or ambiguous ones before the public campaign starts.",
                    "Brief all staff and partner agents that no payment is complete until the taxpayer receives proof."
                ],
                "sixTo12Months": [
                    "Launch the standard receipt and channel list together so the message is easy to understand.",
                    "Monitor the first cycle for missing receipts, duplicate serial numbers, or confusion about which channels remain valid.",
                    "Create a simple complaint route for taxpayers who paid without receiving proof or who suspect an unofficial collector."
                ],
                "twelveToTwentyFourMonths": [
                    "Update the channel list routinely and make sure old posters, handbills, or website pages do not keep circulating once routes change.",
                    "Bring receipt issuance and verification into routine supervision, audits, and staff performance checks.",
                    "Use trends from complaints and verification requests to tighten payment controls further."
                ]
            },
            "legalInstitutional": [
                "Check whether financial regulations already make receipting mandatory and, if so, ensure practice matches the rule.",
                "If third parties collect on behalf of the city, include clear receipting and posting obligations in their agreements.",
                "Clarify sanctions for staff or agents who take money outside authorised channels or fail to issue proof."
            ],
            "capacitySystemsPartnerships": [
                "The city needs reliable control over receipt books, digital receipt ranges, or other numbering systems.",
                "Public communications matter: taxpayers must know where to look for the official list and how to challenge suspicious demands.",
                "Back-office staff need a way to trace a receipt number back to a ledger entry when problems arise."
            ],
            "risksAndSafeguards": [
                "Multiple receipt formats can confuse taxpayers and make fraud easier; simplify rather than proliferate.",
                "If the official channel list is not kept current, the city may unintentionally legitimise unsafe routes.",
                "If complaints are invited but never answered, the reform can backfire by highlighting problems without resolving them."
            ],
            "whatToMonitor": [
                "Share of payments that generated a valid receipt.",
                "Number of complaints about missing or suspicious receipts.",
                "Number of taxpayers using authorised versus unofficial channels, where that can be observed.",
                "Time taken to verify or resolve a receipt-related complaint."
            ],
            "connectionsToOtherCards": [
                "Add easy payment channels close to the taxpayer.",
                "Tighten cash handling and daily reconciliation.",
                "Track collections and arrears every week."
            ],
            "questionsBeforeLaunch": [
                "How will the city make the official channel list visible in every ward or payment point?",
                "What proof should every taxpayer expect to receive, regardless of channel?",
                "Who controls receipt numbering and investigates irregularities?",
                "How will suspicious payment requests be reported and acted on?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-08",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Tighten cash handling and daily reconciliation",
        "shortTitle": "Cash Controls",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Low–Medium",
        "category": "Controls",
        "sortOrder": 8,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Introduce simple controls such as daily balancing, quick bank deposits, separation of duties, and routine reconciliation between receipts, bankings, and the ledger. These controls protect revenue and strengthen confidence that tougher collection efforts will not simply leak away.",
            "mostUsefulWhen": [
                "Cash is still common or audits have flagged leakage risks.",
                "Different people can currently collect, record, and bank money without checks.",
                "Management wants stronger discipline before scaling up collections."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A simple written cash and reconciliation procedure.",
                "Named supervisory responsibility for exceptions and missing money."
            ],
            "usuallyNotBestFirstMove": [
                "Do not rely on manual discipline alone if the real problem is that payments are never posted correctly.",
                "This is less urgent in fully cashless environments, though reconciliation still matters."
            ],
            "politicalNote": "These reforms may look technical, but they are central to trust. It is hard to justify tougher enforcement if taxpayers still face confusing channels, poor receipts, or weak control over where money goes.",
            "whatFullCardWouldPlan": "The full card would help the city plan the day-end procedure, segregation of duties, banking rules, exception reporting, and the management checks that reduce leakage risk.",
            "oftenWorksBestAlongside": [
                "Issue receipts every time and publish official payment channels",
                "Track collections and arrears every week."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "This card is about protecting the revenue once money starts to move. Daily balancing, prompt banking, separation of duties, and simple exception reporting are not glamorous, but they are often what determines whether improved billing and payment reforms actually translate into cash in the treasury. They also matter politically: taxpayers and leaders are much less willing to support firmer collection when basic controls still appear weak.",
            "whenStrongFit": [
                "Cash is still common, or audits have already flagged leakage, delays, or missing reconciliations.",
                "The same staff can currently collect, record, and bank money with too little supervision.",
                "Management wants stronger discipline before expanding collection channels or enforcement."
            ],
            "whatToLineUpFirst": [
                "Start with a written day-end routine that staff can follow every day, not with a very large manual that nobody uses.",
                "If full segregation of duties is not immediately possible in a small office, introduce supervisory checks and rotation while the city works toward a stronger structure.",
                "Prioritise the sites or channels with the highest cash volume first, because that is where control gains matter fastest."
            ],
            "designChoices": [
                "Whether deposits should occur the same day or next day, and which exceptions are acceptable in practice.",
                "Which tasks must be separated immediately: collecting, reconciling, approving write-offs, banking, and ledger changes.",
                "How exceptions will be escalated, documented, and reviewed by management rather than handled informally."
            ],
            "practicalPath": {
                "first90Days": [
                    "Map the current cash path from taxpayer to treasury and identify the most exposed points where money or records can go astray.",
                    "Draft a short standard operating procedure covering receipt issuance, cash counts, banking, reconciliation, and exception reporting.",
                    "Assign named supervisory responsibility so that breaks in the chain trigger action rather than remaining invisible."
                ],
                "sixTo12Months": [
                    "Train staff on the routine and test it with live transactions, especially at the busiest payment points.",
                    "Introduce daily or near-daily reconciliation and review the first exception reports centrally so patterns become visible quickly.",
                    "Run spot checks and short management reviews during the first months to reinforce the new discipline."
                ],
                "twelveToTwentyFourMonths": [
                    "Embed the routine into standing office management, audits, and staff rotation rather than relying on one reform-minded supervisor.",
                    "Strengthen the control environment over time by reducing unnecessary cash handling and shifting volume into safer channels.",
                    "Use weekly reporting to compare payment, banking, and reconciliation trends across offices and channels."
                ]
            },
            "legalInstitutional": [
                "Check existing financial rules on cash custody, banking timelines, and reconciliation frequency; many cities already have the rules but do not apply them consistently.",
                "Clarify who may approve adjustments after reconciliation differences are found, and require that such approvals are documented.",
                "Where third parties or agents handle cash, define settlement and verification obligations clearly in writing."
            ],
            "capacitySystemsPartnerships": [
                "The city needs secure storage, standard bank deposit forms, and a simple ledger or spreadsheet that ties receipts to deposits and postings.",
                "Supervisors need time and authority to review exceptions; reconciliation fails when anomalies are noticed but never escalated.",
                "IT and finance teams should align on how digital and cash channels feed the same control process."
            ],
            "risksAndSafeguards": [
                "If the process becomes overcomplicated, staff may revert to informal shortcuts; start with the most important checks and enforce them well.",
                "If responsibility is blurred, missing money can be everybody’s problem and therefore nobody’s problem.",
                "If management tolerates repeated reconciliation breaks without response, the control reform quickly loses credibility."
            ],
            "whatToMonitor": [
                "Number and value of unreconciled differences by week.",
                "Average delay between receipt, banking, and ledger posting.",
                "Share of payment points following the day-end procedure correctly.",
                "Frequency and resolution time of exception reports."
            ],
            "connectionsToOtherCards": [
                "Issue receipts every time and publish official payment channels.",
                "Track collections and arrears every week.",
                "Add easy payment channels close to the taxpayer."
            ],
            "questionsBeforeLaunch": [
                "Which control breaks create the greatest risk today: counting, banking, posting, or adjustment approval?",
                "Can the city separate the highest-risk duties immediately, and if not, what interim controls will substitute?",
                "Who will review exceptions every week and what action will follow?",
                "How quickly can the city move volume away from the riskiest cash-heavy arrangements?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-09",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Track collections and arrears every week",
        "shortTitle": "Weekly Collections Tracking",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Low",
        "category": "Monitoring",
        "sortOrder": 9,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Use a simple dashboard or weekly report to track how much has been billed, collected, and left outstanding by ward, payment channel, or taxpayer segment. Visibility changes behaviour inside the administration and makes it easier to target follow-up intelligently.",
            "mostUsefulWhen": [
                "Managers currently learn too late that collection is off track.",
                "Performance varies across wards or teams and needs to be compared.",
                "The city has basic digital or spreadsheet capacity."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Routine access to billing and payment data, even if only through spreadsheets.",
                "One named person to refresh the dashboard and circulate it."
            ],
            "usuallyNotBestFirstMove": [
                "Do not build a dashboard before source data are at least reasonably reliable.",
                "This is not the first move where basic billing and payment records are still chaotic."
            ],
            "politicalNote": "Most compliance reforms rise or fall on consistency. Taxpayers quickly notice whether the city applies the rule across the roll or only in selected cases.",
            "whatFullCardWouldPlan": "The full card would help the city plan the weekly indicators, data sources, accountability meetings, and the practical way managers will use the dashboard to target follow-up rather than just admire the numbers.",
            "oftenWorksBestAlongside": [
                "Tighten cash handling and daily reconciliation; Visit major defaulters in person.",
                "Escalation and enforcement",
                "These cards move from softer follow-up into stronger compliance tools. They work best once billing, delivery, and payment basics already function reasonably well."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Collection performance improves when managers can see it in time to act. A weekly dashboard or standing performance report makes it harder for arrears to accumulate quietly and easier to compare wards, teams, or channels. It also helps focus scarce enforcement effort on the cases that matter most. This is therefore less a technology card than a management-discipline card: the value comes from using the numbers to drive decisions.",
            "whenStrongFit": [
                "Managers currently discover shortfalls too late in the cycle.",
                "Collection performance varies by ward, payment channel, or team and needs to be compared openly.",
                "The city has at least basic spreadsheet or digital capacity and wants more structured management follow-up."
            ],
            "whatToLineUpFirst": [
                "Keep the first dashboard simple and decision-oriented; managers need a few reliable indicators more than a complex visual product.",
                "If source data are still messy, start with a manual weekly report on core indicators while the city cleans up the feed.",
                "Decide in advance who will receive the report and what meeting or action it should trigger, otherwise the dashboard becomes passive reporting."
            ],
            "designChoices": [
                "Which indicators matter most in the first year: billed, collected, outstanding, recovery by channel, top debtors, or ward-by-ward performance.",
                "Whether the city wants one citywide report plus annexes, or separate views for different management levels.",
                "How the report will distinguish current-year slippage from older arrears so the city does not mix two different problems."
            ],
            "practicalPath": {
                "first90Days": [
                    "Identify the smallest set of indicators that would help managers make better weekly decisions.",
                    "Map where each number will come from and test whether it can be produced regularly without heroic manual effort.",
                    "Assign one named analyst or officer to refresh and circulate the report every week."
                ],
                "sixTo12Months": [
                    "Run the report through several weekly cycles and use it in management meetings, even if the first versions are simple.",
                    "Check which indicators lead to action and which merely decorate the page, then simplify the product accordingly.",
                    "Introduce basic comparison by ward, team, or channel so lagging areas become visible."
                ],
                "twelveToTwentyFourMonths": [
                    "Link the weekly report to overdue workflows, field visits, and channel management so it becomes part of operational discipline.",
                    "Improve automation gradually only after managers are already using the report consistently.",
                    "Review periodically whether the dashboard should widen to include installation plans, lien cases, or large-debtor actions."
                ]
            },
            "legalInstitutional": [
                "No major legal change is normally needed, but the city should clarify who may see different levels of taxpayer detail and how aggregated information can be circulated safely.",
                "If the report will be used for staff performance management, set that expectation clearly rather than letting it emerge informally.",
                "Confirm how arrears definitions will be applied so different offices are comparing the same thing."
            ],
            "capacitySystemsPartnerships": [
                "The city needs routine access to billing and payment data, even if through weekly extracts rather than a live system.",
                "Someone must own the indicator definitions, otherwise different teams will calculate the same figure differently.",
                "Managers need a fixed review rhythm; the dashboard will not matter if nobody is expected to respond to it."
            ],
            "risksAndSafeguards": [
                "If source data are unreliable, a polished dashboard can create false confidence; improve reliability first or keep the first version simple and caveated.",
                "Too many indicators can hide the few that actually matter.",
                "If the city publishes comparisons internally without support or follow-through, staff may game the numbers rather than improve performance."
            ],
            "whatToMonitor": [
                "Timeliness of the weekly report.",
                "Share of indicators produced without manual correction.",
                "Management actions triggered by the report, such as targeted follow-up or field visits.",
                "Change over time in collection performance for wards or channels highlighted as lagging."
            ],
            "connectionsToOtherCards": [
                "Tighten cash handling and daily reconciliation.",
                "Visit major defaulters in person.",
                "Use a clear overdue notice ladder."
            ],
            "questionsBeforeLaunch": [
                "Which three to five indicators would most change management behaviour right now?",
                "Who will refresh the report every week, and what happens if it is late?",
                "What meeting or action will follow the report each cycle?",
                "How will the city separate current-year collection problems from older arrears?",
                "C. Escalate fairly and credibly"
            ]
        }
    },
    {
        "solutionId": "PT-COM-10",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Use a clear overdue notice ladder",
        "shortTitle": "Overdue Notice Ladder",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Low",
        "category": "Enforcement",
        "sortOrder": 10,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Adopt a staged overdue process—reminder, formal demand, final notice—so that taxpayers get clear warnings and the administration builds a defensible path to stronger action. This is one of the simplest ways to make enforcement feel fair and consistent.",
            "mostUsefulWhen": [
                "Arrears follow-up is ad hoc or too informal.",
                "The city wants stronger enforcement without jumping straight to harsh measures.",
                "There is a need to document due process before penalties or legal action."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Clear templates, timelines, and rules on when an account moves to the next stage.",
                "A way to record that each notice was sent or delivered."
            ],
            "usuallyNotBestFirstMove": [
                "Do not rely on notice escalation if bills themselves are not reaching taxpayers.",
                "This adds little if staff ignore the timetable and do not follow through."
            ],
            "politicalNote": "The city normally gets the best results when it can show that ordinary taxpayers had a fair chance to pay before penalties or stronger action began. Consistency matters more than drama.",
            "whatFullCardWouldPlan": "The full card would help the city plan the notice templates, timing, delivery proof, escalation rules, and the hand-off from soft reminders to formal enforcement.",
            "oftenWorksBestAlongside": [
                "Make sure bills actually reach taxpayers",
                "Apply late-payment penalties consistently."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A good overdue process gives taxpayers several clear chances to respond and gives the administration a defensible route from soft follow-up to stronger action. That matters both operationally and politically. When notices escalate in a predictable order, the city can show that it acted fairly and consistently before adding charges or using heavier enforcement tools. The key is not the number of letters; it is the discipline of moving accounts through the same sequence every cycle.",
            "whenStrongFit": [
                "Arrears follow-up is ad hoc, inconsistent, or too informal.",
                "The city wants to strengthen compliance without jumping straight to highly coercive measures.",
                "There is a need to document due process before penalties, field visits, liens, or court-linked action."
            ],
            "whatToLineUpFirst": [
                "Make the first ladder short and realistic; a sequence that staff can complete is stronger than a long one they cannot sustain.",
                "If proof of delivery is weak, build that into the notice design and record-keeping from the beginning.",
                "Link the ladder to actual account status so paid accounts stop moving forward automatically."
            ],
            "designChoices": [
                "How many stages the ladder should contain and what each stage is meant to achieve.",
                "Which channels will be used at each stage, and when stronger proof of delivery becomes necessary.",
                "When an account should move out of the notice ladder and into penalties, field follow-up, or stronger enforcement."
            ],
            "practicalPath": {
                "first90Days": [
                    "Draft the reminder, formal demand, and final notice templates in plain language and make the consequences of inaction clear.",
                    "Set the timetable for each stage and align it with billing dates, reminder messages, and penalty triggers.",
                    "Create a simple log so the city can see which accounts are at which stage and what proof exists."
                ],
                "sixTo12Months": [
                    "Pilot the ladder on a manageable set of overdue accounts and check whether the timing and wording produce responses.",
                    "Refine the hand-off points between each stage so staff are not improvising on difficult cases.",
                    "Train frontline staff and managers on what each notice means and what action should follow."
                ],
                "twelveToTwentyFourMonths": [
                    "Embed the ladder into routine arrears management and stop relying on ad hoc personal judgment for common cases.",
                    "Use the weekly arrears report to see where accounts are getting stuck and whether notice stages need adjustment.",
                    "Periodically review whether the ladder is still proportionate once other tools such as payment plans or clearances mature."
                ]
            },
            "legalInstitutional": [
                "Confirm that notice periods, content requirements, and methods of service align with local law or regulations.",
                "Clarify whether each stage is an administrative notice only or whether some steps carry specific legal effect for later enforcement.",
                "Where third parties deliver final notices, define proof and custody responsibilities clearly."
            ],
            "capacitySystemsPartnerships": [
                "The city needs reliable account status, current contact data, and a way to stop escalation after payment or correction.",
                "Notice templates, logs, and proof of delivery should be standardised across offices.",
                "Managers must monitor whether cases are actually moving through the ladder and not stalling after the first notice."
            ],
            "risksAndSafeguards": [
                "If the city sends warnings but fails to follow through, compliance can worsen because taxpayers learn the ladder is not serious.",
                "If the wording is overly threatening too early, the city may generate political resistance without gaining extra payment.",
                "If notices reference the wrong amount or wrong channel, they can strengthen taxpayer resistance rather than compliance."
            ],
            "whatToMonitor": [
                "Number and share of overdue accounts at each notice stage.",
                "Payment or contact rate after each stage.",
                "Share of final notices with usable proof of delivery.",
                "Average time accounts spend in the ladder before resolution or escalation."
            ],
            "connectionsToOtherCards": [
                "Make sure bills actually reach taxpayers.",
                "Apply late-payment penalties consistently.",
                "Visit major defaulters in person."
            ],
            "questionsBeforeLaunch": [
                "What are the minimum stages the city can apply consistently every cycle?",
                "At which point does the city need stronger proof of delivery?",
                "Who decides when an account moves from notices into stronger action?",
                "What will the city do if large numbers of accounts stall at one stage?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-11",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Apply late-payment penalties consistently",
        "shortTitle": "Late-Payment Penalties",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Medium",
        "category": "Enforcement",
        "sortOrder": 11,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Use modest, clear late-payment charges and apply them predictably. The value is not in very high rates; it is in showing that delay has a cost and that the same rule applies across the roll.",
            "mostUsefulWhen": [
                "Taxpayers have learned that paying late carries little practical consequence.",
                "The legal framework already allows penalties but practice is inconsistent.",
                "Management wants to reinforce the overdue notice ladder."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A clear legal basis and a transparent penalty schedule.",
                "A billing or ledger process that adds the charges correctly and visibly."
            ],
            "usuallyNotBestFirstMove": [
                "Do not use large or arbitrary surcharges that become politically toxic or economically unrealistic.",
                "This is weak where the city cannot calculate or post penalties correctly."
            ],
            "politicalNote": "The city normally gets the best results when it can show that ordinary taxpayers had a fair chance to pay before penalties or stronger action began. Consistency matters more than drama.",
            "whatFullCardWouldPlan": "The full card would help the city plan the penalty schedule, system logic, waiver rules if any, and the communications needed so that the measure feels predictable rather than arbitrary.",
            "oftenWorksBestAlongside": [
                "Use a clear overdue notice ladder",
                "Allow payment in installments for eligible taxpayers."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Penalties matter most when they are predictable, visible, and applied across the roll. Very high rates usually add noise and resentment. Modest charges, posted accurately and backed by a clear notice sequence, are often more effective because they show that delaying payment has a cost and that the city is serious about collecting on time. This card is therefore about disciplined application, not about designing punitive rates for their own sake.",
            "whenStrongFit": [
                "Taxpayers have learned that paying late carries little practical consequence.",
                "The legal framework already allows penalties or interest, but practice is inconsistent or poorly communicated.",
                "Management wants a stronger bridge between reminders, overdue notices, and more serious enforcement."
            ],
            "whatToLineUpFirst": [
                "Keep the first penalty structure simple enough that the city can calculate and post it correctly every cycle.",
                "If hardship relief or waivers are allowed, define them narrowly and transparently before wide application begins.",
                "Make sure the city can explain the penalty logic clearly on the bill, notice, or account statement."
            ],
            "designChoices": [
                "Whether the city will use a one-off surcharge, periodic interest, or both.",
                "How high the penalty should be before it becomes politically hard to defend or practically impossible to collect.",
                "What, if any, waiver route will exist for documented hardship, error, or approved installment plans."
            ],
            "practicalPath": {
                "first90Days": [
                    "Confirm the legal basis, the rate or cap, and the date on which the penalty starts to apply.",
                    "Test the posting process on sample accounts so staff can see how the charge appears on the ledger and taxpayer-facing documents.",
                    "Prepare short explanations for staff and taxpayers that link the penalty to the overdue notice ladder."
                ],
                "sixTo12Months": [
                    "Apply the penalty to a live batch of overdue accounts and verify accuracy before wider roll-out.",
                    "Track the first complaint patterns carefully; early misunderstandings often show where the bill or notice wording is still unclear.",
                    "Monitor whether penalties are actually changing behaviour or simply accumulating on already uncollectible accounts."
                ],
                "twelveToTwentyFourMonths": [
                    "Review periodically whether the penalty rate, cap, or waiver practice is still proportionate and effective.",
                    "Use account data to distinguish taxpayers who respond to penalties from those who need a stronger or different enforcement route.",
                    "Keep the penalty rule stable enough that taxpayers see it as predictable rather than discretionary."
                ]
            },
            "legalInstitutional": [
                "Check the local legal instrument carefully, especially the authorised rate, cap, and any procedural requirements before a penalty may be added.",
                "If waivers are possible, set the grounds and approval authority clearly so ad hoc political intervention does not hollow out the rule.",
                "Ensure that penalties attach to the correct legal liability and do not conflict with approved payment-plan terms."
            ],
            "capacitySystemsPartnerships": [
                "The city needs a ledger or billing process that can add the charge correctly and show it separately from principal tax.",
                "Help-desk and revenue staff need the same explanation of when penalties begin, how they accumulate, and when they stop.",
                "Managers should be able to see penalty posting and waiver trends, not just the total amount billed."
            ],
            "risksAndSafeguards": [
                "Large or poorly explained penalties can produce strong resistance and encourage political pressure for blanket waivers.",
                "If penalties are posted inaccurately, the city may spend more time correcting them than collecting them.",
                "If the city waives penalties casually for well-connected cases, the rule will quickly lose legitimacy."
            ],
            "whatToMonitor": [
                "Share of overdue accounts to which the penalty was posted correctly.",
                "Payment response after penalty application.",
                "Number and value of waivers, by reason.",
                "Penalty revenue collected versus penalty balances merely added to arrears."
            ],
            "connectionsToOtherCards": [
                "Use a clear overdue notice ladder.",
                "Allow payment in installments for eligible taxpayers.",
                "Visit major defaulters in person."
            ],
            "questionsBeforeLaunch": [
                "What penalty structure can the city apply accurately and defend publicly?",
                "Will the city allow waivers, and if so, on what narrow grounds?",
                "How will staff explain the penalty to taxpayers who contact the city?",
                "What evidence will show whether the penalty is changing behaviour rather than only increasing balances?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-12",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Visit major defaulters in person",
        "shortTitle": "Defaulter Field Visits",
        "timeline": "< 1 year to pilot",
        "deliveryDifficulty": "Medium",
        "politicalSensitivity": "Medium–High",
        "category": "Enforcement",
        "sortOrder": 12,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Send trained teams to the largest defaulters to deliver final notices, confirm contact details, request payment, or agree short, recorded payment arrangements. Used selectively, in-person follow-up can unlock large arrears and signal that the city is serious.",
            "mostUsefulWhen": [
                "A small number of accounts make up a large share of arrears.",
                "Paper notices alone are being ignored by high-value defaulters.",
                "The city can manage staff safety and supervision."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A clear large-debtor list, officer identification, and visit scripts.",
                "Strong cash and receipting controls if any on-the-spot payment is allowed."
            ],
            "usuallyNotBestFirstMove": [
                "Do not use this widely for many small accounts; it is a targeted tool.",
                "Avoid field visits where staff safety, corruption, or political interference cannot be managed."
            ],
            "politicalNote": "This works best when the city is visibly even-handed and starts with the largest, clearest cases. If field visits appear selective or politically influenced, the signal can quickly turn negative.",
            "whatFullCardWouldPlan": "The full card would help the city plan how to identify priority debtors, organise field visits safely, record outcomes, manage on-the-spot payments if allowed, and decide when to escalate further.",
            "oftenWorksBestAlongside": [
                "Track collections and arrears every week",
                "Use a clear overdue notice ladder",
                "Register unpaid tax as a charge against the property."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A small number of accounts often represent a large share of total arrears. Where notices and penalties are being ignored, in-person visits can convert those cases faster than treating them like ordinary mass accounts. They also send a visible signal that the city is willing to follow through on serious debt. This tool should remain selective: it works best on clear, high-value cases where the debt is large, the facts are strong, and the visit can be managed safely and professionally.",
            "whenStrongFit": [
                "A relatively small number of high-value accounts make up a large share of arrears.",
                "Formal notices alone are being ignored by major debtors.",
                "The city can manage staff safety, supervision, and the integrity of any field collection or negotiation process."
            ],
            "whatToLineUpFirst": [
                "Start with a ranked large-debtor list and a small pilot team; do not attempt wide field action on many small debts.",
                "If on-the-spot payment is risky, make the visit about delivery, verification, and rapid redirection to safe payment channels rather than cash collection.",
                "Define in advance which visit outcomes count as success: immediate payment, signed arrangement, verified contact update, or formal escalation."
            ],
            "designChoices": [
                "What threshold makes a debtor worth a visit in your context.",
                "Whether teams may collect on the spot, or only deliver final demands and agree short, documented arrangements.",
                "How officers will be paired, supervised, and supported in more sensitive or politically exposed cases."
            ],
            "practicalPath": {
                "first90Days": [
                    "Build a large-debtor list using the weekly arrears report and clean the data before teams go into the field.",
                    "Prepare officer IDs, visit scripts, standard forms, and if needed, coordination with security actors or local leadership.",
                    "Brief staff on acceptable conduct, documentation, cash rules if any, and the escalation route for hostile or disputed cases."
                ],
                "sixTo12Months": [
                    "Run visits on a pilot set of high-value accounts and review each case outcome promptly.",
                    "Update the account record after each visit so the next step is based on what actually happened, not on stale assumptions.",
                    "Check whether the city is getting more value from payment, better contact information, or faster escalation, and adapt the visit strategy accordingly."
                ],
                "twelveToTwentyFourMonths": [
                    "Institutionalise the approach only for debt tiers where it clearly pays off; keep it selective and data-led.",
                    "Use results from visits to decide which cases need stronger backstops such as tax clearance checks or registry-based action.",
                    "Periodically refresh the large-debtor criteria so field effort remains focused on the most material cases."
                ]
            },
            "legalInstitutional": [
                "Confirm that officers have legal authority to deliver notices, request information, and, where allowed, receive payments or sign arrangements.",
                "Where any money may be collected during a visit, the receipting and cash-control rules must be explicit and enforced tightly.",
                "Clarify how disputes raised in the field should be routed so officers do not promise corrections or waivers beyond their authority."
            ],
            "capacitySystemsPartnerships": [
                "The city needs a safe visit protocol, a supervisory chain, and a way to record outcomes immediately.",
                "Field teams should have access to current account data and clear instructions on what counts as payment, promise, dispute, or refusal.",
                "Back-office staff must act quickly on the results; a visit loses value if the next formal step is delayed for weeks."
            ],
            "risksAndSafeguards": [
                "Poorly supervised visits can create corruption, coercion, or political allegations very quickly.",
                "If the city uses the tool on many small accounts, staff effort will be diluted and the signal weakened.",
                "If officers visit weak or disputed cases first, the city may spend political capital without securing meaningful recovery."
            ],
            "whatToMonitor": [
                "Number and value of large-debtor visits completed.",
                "Immediate payment or arrangement rate after visits.",
                "Share of visit outcomes entered into the system within a defined period.",
                "Revenue recovered or escalated from the top arrears segment."
            ],
            "connectionsToOtherCards": [
                "Track collections and arrears every week.",
                "Use a clear overdue notice ladder.",
                "Register unpaid tax as a charge against the property."
            ],
            "questionsBeforeLaunch": [
                "Which accounts are material enough to justify staff time and political attention?",
                "Will visits focus on payment, verification, or both?",
                "What safety and integrity rules must officers follow in the field?",
                "What happens within one week of a failed visit?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-13",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Require tax clearance for transfers and key permits",
        "shortTitle": "Tax Clearance Requirement",
        "timeline": "1–3 years",
        "deliveryDifficulty": "High",
        "politicalSensitivity": "High",
        "category": "Enforcement",
        "sortOrder": 13,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Make tax compliance a condition for property transfers and, where suitable, for key permits or licence renewals. This is one of the strongest non-court enforcement tools because it ties payment to transactions owners care about.",
            "mostUsefulWhen": [
                "Property transfers, permits, or licences move through reasonably formal channels.",
                "Leadership is prepared to back a harder compliance rule with inter-agency cooperation.",
                "The city needs leverage beyond reminders and penalties."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A legal route to require clearance and cooperation from the relevant registry or permitting office.",
                "A fast process to verify balances and issue or refuse clearances."
            ],
            "usuallyNotBestFirstMove": [
                "Do not start here if the city cannot issue clearances quickly and predictably.",
                "This is a weak fit where most relevant transactions happen outside formal systems."
            ],
            "politicalNote": "These are stronger compliance tools and usually need clear political backing. They are powerful precisely because they touch transactions people care about, so delays, opacity, or favouritism can become politically costly very quickly.",
            "whatFullCardWouldPlan": "The full card would help the city plan the legal route, clearance certificate workflow, service standards, coordination with registries or permitting offices, and the appeals path for disputed balances.",
            "oftenWorksBestAlongside": [
                "Register unpaid tax as a charge against the property",
                "Link the roll to permits, sales, and new service connections."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Tax clearance works because it links compliance to transactions that owners, developers, and businesses care about. It can therefore become one of the strongest non-court collection tools in a property-tax system. But it only works well when it is fast, rule-based, and coordinated across agencies. If clearance is slow, opaque, or politically selective, the city can create a new bottleneck without gaining credibility. This card is about building a practical compliance gate, not just announcing a harder rule.",
            "whenStrongFit": [
                "Property transfers, building permits, business permits, or similar transactions pass through reasonably formal channels.",
                "Leadership is willing to support a stronger compliance tool that requires inter-agency cooperation.",
                "The city needs leverage that goes beyond reminders, penalties, and routine collection visits."
            ],
            "whatToLineUpFirst": [
                "Begin with one or two high-value transaction points rather than trying to connect every possible permit or registry action at once.",
                "If the city cannot yet issue a clearance quickly, fix the service standard first; a hard legal rule without a functioning workflow often backfires.",
                "Where registry or permit processes sit outside city control, start with a memorandum or pilot arrangement while longer legal change is pursued."
            ],
            "designChoices": [
                "Which transactions should require clearance first: transfers, building permits, occupancy approvals, business licences, or another limited set.",
                "How long a clearance certificate remains valid and what account checks it should cover.",
                "What route taxpayers can use when they dispute the balance but need a fast decision because a transaction is pending."
            ],
            "practicalPath": {
                "first90Days": [
                    "Map the most promising choke points and choose the first process where a compliance check would be both feasible and high value.",
                    "Design a simple tax-clearance certificate and the internal workflow for verifying balances and issuing, withholding, or conditioning the clearance.",
                    "Agree a service standard and identify the office or desk that will handle urgent transaction-linked requests."
                ],
                "sixTo12Months": [
                    "Pilot the requirement with one partner office and monitor turnaround time, dispute volumes, and staff workarounds.",
                    "Train partner agency staff on when to ask for clearance, how to verify authenticity, and where to send applicants with tax issues.",
                    "Refine the workflow before wider roll-out, especially if the pilot reveals delays or weak data matching."
                ],
                "twelveToTwentyFourMonths": [
                    "Expand to additional transaction points only after the first one works predictably.",
                    "Bring clearance requests and refusals into routine reporting so management can see whether the tool is recovering revenue or only creating delay.",
                    "Use experience from early clearances to decide whether a stronger registry backstop, such as liens or encumbrances, is also needed."
                ]
            },
            "legalInstitutional": [
                "The city needs a clear legal or regulatory basis to require clearance for the chosen transaction, or a formal inter-agency arrangement where the law already permits it.",
                "Clarify appeal or review rights for cases where taxpayers challenge the outstanding balance.",
                "Protect the process from informal override by defining who may issue, refuse, or suspend a clearance."
            ],
            "capacitySystemsPartnerships": [
                "The clearance desk needs current account data, strong identity and property matching, and an explicit turnaround target.",
                "Partner agencies must know exactly when clearance is required and who bears responsibility for checking it.",
                "Help-desk and valuation teams need a fast route for resolving factual corrections that could otherwise block legitimate transactions."
            ],
            "risksAndSafeguards": [
                "If service standards are weak, the city can quickly turn tax clearance into a corruption or delay risk.",
                "If formal transactions are uncommon, the revenue effect may be small despite the political effort required.",
                "If high-value actors can bypass the rule informally, the city loses credibility faster than if it had not launched the tool at all."
            ],
            "whatToMonitor": [
                "Number and value of taxes settled through the clearance process.",
                "Average time to issue or refuse a clearance.",
                "Number of disputed-balance cases raised through transaction workflows.",
                "Compliance rate at the transaction points where clearance is required."
            ],
            "connectionsToOtherCards": [
                "Register unpaid tax as a charge against the property.",
                "Link the roll to permits, sales, and new service connections.",
                "Visit major defaulters in person."
            ],
            "questionsBeforeLaunch": [
                "Which transaction points give the city the strongest leverage with the least operational risk?",
                "Can the city verify balances and issue clearances quickly enough to defend the rule?",
                "What appeal path will exist for urgent but disputed cases?",
                "Which agency relationships need to be formalised before launch?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-14",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Register unpaid tax as a charge against the property",
        "shortTitle": "Property Tax Liens",
        "timeline": "1–3 years",
        "deliveryDifficulty": "High",
        "politicalSensitivity": "Medium–High",
        "category": "Enforcement",
        "sortOrder": 14,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Record unpaid tax as a legal charge, lien, or encumbrance against the property so that the debt stays attached to the asset until it is settled. This protects the public claim without requiring immediate seizure.",
            "mostUsefulWhen": [
                "A functioning land or title registry exists.",
                "Large arrears sit on valuable properties that may be transferred or refinanced later.",
                "The city wants a serious enforcement backstop that is less abrupt than auction."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A legal basis to record and release the charge, plus coordination with the registry.",
                "Careful case selection and accurate property identification."
            ],
            "usuallyNotBestFirstMove": [
                "Do not treat this as an early move where titles are largely informal or disputed.",
                "It is not worth it for small debts where filing costs exceed likely recovery."
            ],
            "politicalNote": "These are stronger compliance tools and usually need clear political backing. They are powerful precisely because they touch transactions people care about, so delays, opacity, or favouritism can become politically costly very quickly.",
            "whatFullCardWouldPlan": "The full card would help the city plan case selection, registry coordination, legal notices, filing and release procedures, and the safeguards needed so the tool is used seriously and not casually.",
            "oftenWorksBestAlongside": [
                "Require tax clearance for transfers and key permits; Visit major defaulters in person.",
                "Support and fast problem resolution",
                "These cards reduce avoidable non-payment by helping the city answer questions and fix straightforward mistakes quickly."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A charge, lien, or encumbrance on the property turns tax debt into a claim that follows the asset. This makes it harder for large arrears simply to sit untouched until ownership changes or a new transaction occurs. It is not a casual first-step enforcement tool. It works best as a serious backstop for higher-value, well-documented debts where the property can be identified clearly and the city is prepared to manage the legal and registry process carefully.",
            "whenStrongFit": [
                "A functioning land or title registry exists and can record charges or encumbrances.",
                "Large arrears sit on valuable properties that may later be transferred, refinanced, or regularised.",
                "The city wants a serious enforcement backstop that is less immediate and politically sharper than auction."
            ],
            "whatToLineUpFirst": [
                "Begin with a narrow class of cases where the debt is large, the property identification is strong, and the chances of later recovery are realistic.",
                "If titles are only partially formal, focus first on the properties and registry segments where the tool is genuinely workable.",
                "Do not open filing widely until the city can also release charges promptly when debts are paid."
            ],
            "designChoices": [
                "What debt threshold should trigger filing, and whether repeated non-payment, debtor behaviour, or property value should also matter.",
                "How the city will distinguish between owner-occupied homes, abandoned properties, commercial assets, and socially sensitive cases.",
                "Whether the city will file automatically after a defined notice ladder or only after management review of each case."
            ],
            "practicalPath": {
                "first90Days": [
                    "Review the legal basis and the registry process carefully, including what information must be on file before a charge can be recorded.",
                    "Build a short list of candidate cases and verify the debt, property reference, owner identity, and notice history before filing begins.",
                    "Design the filing, tracking, and release workflow so the city does not create unresolved encumbrances by accident."
                ],
                "sixTo12Months": [
                    "File the first cases on a pilot basis and review the administrative burden closely.",
                    "Check how registry staff interpret the filing requirements and where delays or mismatches arise.",
                    "Use the pilot to refine the debt threshold, notice package, and case-selection criteria."
                ],
                "twelveToTwentyFourMonths": [
                    "Expand only once the city has proven it can file and release charges accurately and without excessive delay.",
                    "Bring lien or charge status into the weekly large-debtor monitoring system so follow-up is not lost.",
                    "Use the experience to decide whether the tool should remain highly selective or become a broader backstop for a defined debt tier."
                ]
            },
            "legalInstitutional": [
                "The legal basis must be unambiguous on the city’s power to register, maintain, and release the charge.",
                "Define who approves filing, who communicates with the registry, and who certifies discharge once the debt is settled.",
                "If the law provides priority rules or interaction with mortgages and other claims, the city should understand those implications before filing cases widely."
            ],
            "capacitySystemsPartnerships": [
                "The city needs accurate property IDs, clean debt records, and staff who can prepare filings carefully.",
                "Registry coordination is not optional; one weak link can create long delays or invalid filings.",
                "Customer-facing teams need a clear explanation of what the charge means and what the taxpayer must do to have it removed."
            ],
            "risksAndSafeguards": [
                "Weak case preparation can expose the city to challenge and slow release of legitimate transactions.",
                "If the city uses the tool on small debts, filing costs and political friction may outweigh recovery value.",
                "If releases are slow after payment, the city can generate significant mistrust and complaints from taxpayers who have already settled."
            ],
            "whatToMonitor": [
                "Number and value of charges filed.",
                "Share of filed cases later settled, transferred, or otherwise resolved.",
                "Average time from payment to release of the charge.",
                "Administrative cost and staff time per filed case."
            ],
            "connectionsToOtherCards": [
                "Require tax clearance for transfers and key permits.",
                "Visit major defaulters in person.",
                "Use a clear overdue notice ladder."
            ],
            "questionsBeforeLaunch": [
                "Which debts are material enough to justify a registry-based enforcement step?",
                "Can the city identify those properties and owners with enough confidence to file cleanly?",
                "How quickly will the city release a charge once payment arrives?",
                "What protections are needed for socially sensitive cases?",
                "D. Support taxpayers and fix avoidable problems"
            ]
        }
    },
    {
        "solutionId": "PT-COM-15",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Set up a help desk and quick fixes for billing mistakes",
        "shortTitle": "Help Desk and Corrections",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Low",
        "category": "Support",
        "sortOrder": 15,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Create a visible help desk and a fast correction path for simple billing mistakes such as wrong names, wrong addresses, duplicate accounts, or misposted payments. This stops small errors from turning willing taxpayers into defaulters.",
            "mostUsefulWhen": [
                "Front counters and phones are full of simple billing questions and factual errors.",
                "The city wants a trust-building measure that also improves collection.",
                "Many disputes can be resolved administratively without a formal appeal."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A simple service desk function and authority to correct defined error types.",
                "A correction log so changes are visible and auditable."
            ],
            "usuallyNotBestFirstMove": [
                "Do not send basic factual fixes into a slow formal dispute route.",
                "This will not solve deep valuation disagreements by itself."
            ],
            "politicalNote": "Most compliance reforms rise or fall on consistency. Taxpayers quickly notice whether the city applies the rule across the roll or only in selected cases.",
            "whatFullCardWouldPlan": "The full card would help the city plan the service desk setup, scripts, correction categories, response times, escalation routes, and the audit trail for changes.",
            "oftenWorksBestAlongside": [
                "Send bills people can understand; Make sure bills actually reach taxpayers; Fix basic record errors quickly.",
                "Support and trust",
                "These options improve compliance more indirectly, by making the city’s use of revenue and treatment of taxpayers easier to understand and defend."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "A city loses willing taxpayers when straightforward mistakes remain unresolved for too long. A visible help desk and a fast route for correcting basic factual errors keep ordinary frustration from hardening into non-payment or political complaint. This card is deliberately narrower than a full appeal system. It is about solving simple, repeatable problems quickly, with a visible audit trail and a clear line between a factual correction and a deeper valuation or legal dispute.",
            "whenStrongFit": [
                "Counters, phones, or ward offices are flooded with routine billing questions and factual errors.",
                "Many taxpayers could be kept compliant if simple mistakes were fixed faster.",
                "Leadership wants a trust-building move that also protects collection performance."
            ],
            "whatToLineUpFirst": [
                "Define a short list of correction types that can be fixed administratively, such as wrong name, wrong contact, duplicate account, or misposted payment.",
                "If capacity is tight, start with one central desk or one pilot ward and track the demand before expanding.",
                "Set a short service standard from the beginning so staff and taxpayers know the desk is meant for fast fixes, not long investigations."
            ],
            "designChoices": [
                "Which issues count as a quick factual correction and which should be escalated to valuation review, legal review, or a formal complaint route.",
                "Which channels the desk will use: walk-in only, phone, email, WhatsApp, ward counters, or a mix.",
                "What documentary proof is needed for common corrections so the process remains quick but defensible."
            ],
            "practicalPath": {
                "first90Days": [
                    "List the most common billing mistakes from recent complaint records or frontline experience.",
                    "Prepare simple request forms, a correction log, and short scripts for staff.",
                    "Assign who may approve each correction type and how the change will be reflected back into billing and the core register."
                ],
                "sixTo12Months": [
                    "Run the service desk and measure the first wave of demand by error type, turnaround time, and repeat complaints.",
                    "Refine the categories and documentation requirements so the process does not become overdesigned.",
                    "Link recurring error types back to the teams responsible for billing, data entry, or payment posting so root causes are not ignored."
                ],
                "twelveToTwentyFourMonths": [
                    "Institutionalise the desk as a routine front-office function and align it with reminders, billing changes, and taxpayer communications.",
                    "Use correction patterns to improve the bill template, register maintenance, or payment-posting procedures.",
                    "If demand remains high, decide whether to decentralise some fixes to ward level or keep quality control central."
                ]
            },
            "legalInstitutional": [
                "Confirm the legal basis for administrative correction of factual errors and distinguish it from formal appeal rights.",
                "Ensure that every correction leaves an audit trail showing what changed, who approved it, and on what evidence.",
                "Where corrections affect amounts due, clarify how revised bills or credits will be issued."
            ],
            "capacitySystemsPartnerships": [
                "The desk needs account lookup access, basic authority to correct defined fields, and a simple escalation route for harder cases.",
                "Staff need practical scripts, not just technical rules, because they often handle frustrated taxpayers first.",
                "Back-office teams must process approved corrections quickly, otherwise the desk becomes a visible promise with no operational effect."
            ],
            "risksAndSafeguards": [
                "If the city routes too many issues into the quick-fix channel, staff will be overwhelmed and taxpayers will still wait.",
                "If corrections are made without a log, the desk can become a source of untraceable privilege or error.",
                "If the desk solves symptoms but the city never fixes recurring upstream problems, complaint volume will not fall."
            ],
            "whatToMonitor": [
                "Number of correction requests by type.",
                "Average turnaround time for defined quick-fix categories.",
                "Repeat complaint rate on the same account after a correction.",
                "Share of corrections that required escalation because they were outside the desk’s mandate."
            ],
            "connectionsToOtherCards": [
                "Send bills people can understand.",
                "Make sure bills actually reach taxpayers.",
                "Fix basic record errors quickly."
            ],
            "questionsBeforeLaunch": [
                "Which mistakes create the most avoidable non-payment today?",
                "What can be corrected quickly without opening a full review process?",
                "Who will approve and log each correction type?",
                "How will recurring errors be fed back into system improvement?",
                "E. Build trust around payment and reform"
            ]
        }
    },
    {
        "solutionId": "PT-COM-16",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Show taxpayers where the money goes",
        "shortTitle": "Revenue Transparency",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Medium",
        "category": "Trust",
        "sortOrder": 16,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Publish simple, credible information about what property tax revenue funds, and link visible projects or service improvements to that revenue where possible. This is not a substitute for enforcement, but it strengthens tax morale and makes compliance messages easier to defend.",
            "mostUsefulWhen": [
                "Trust in local government is weak or rumours about misuse are common.",
                "The city can point to visible projects or service improvements.",
                "Leaders want compliance to rest on both credibility and fairness."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "Basic revenue and spending information that can be communicated simply and honestly.",
                "Coordination between finance, communications, and service departments."
            ],
            "usuallyNotBestFirstMove": [
                "Do not overclaim what tax revenue has funded; trust falls quickly when claims feel exaggerated.",
                "This should not be treated as a replacement for fixing billing, payment, or enforcement."
            ],
            "politicalNote": "Trust-building messages help only when they remain honest and concrete. They are most persuasive when the city can point to visible results and avoid exaggerated claims about what one revenue stream alone has funded.",
            "whatFullCardWouldPlan": "The full card would help the city plan a credible reporting format, project examples, communications timing, and the coordination needed so that trust-building messages remain factual and defensible.",
            "oftenWorksBestAlongside": [
                "Use reminder messages before and after due dates",
                "Set up a help desk and quick fixes for billing mistakes."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "Compliance is easier to defend when taxpayers can see credible links between revenue and visible local results. This card is not about overpromising that one revenue stream pays for everything. It is about disciplined transparency: showing in simple terms what property-tax revenue supports, where the city has used it visibly, and how the collection effort relates to service credibility. In low-trust environments, that can make reminders and enforcement easier to accept.",
            "whenStrongFit": [
                "Trust in local government is weak or rumours about misuse are common.",
                "The city can point to visible projects, maintenance work, or service improvements that residents recognise.",
                "Leadership wants compliance to rest on both fairness and credibility, not only on penalties."
            ],
            "whatToLineUpFirst": [
                "Start with claims the city can prove easily and visually; a small number of credible examples is stronger than a long list of doubtful ones.",
                "If financial reporting is still weak, begin with simple aggregated figures and project examples while improving the back-office data over time.",
                "Coordinate messages across finance, communications, and service departments so the story is consistent."
            ],
            "designChoices": [
                "Whether the city will communicate through bill inserts, posters, ward meetings, radio, social media, project signage, or a combination.",
                "How specific the city should be about individual projects versus broader service categories such as roads, drainage, or street lighting.",
                "How often the message should be refreshed so it remains current and believable."
            ],
            "practicalPath": {
                "first90Days": [
                    "Identify a short set of visible projects or service outputs that can be linked credibly to the city’s revenue effort.",
                    "Prepare a simple reporting format that shows what was collected, what broad uses were financed, and what residents can see on the ground.",
                    "Choose the first communication channels and brief political and administrative leaders on the boundaries of what should and should not be claimed."
                ],
                "sixTo12Months": [
                    "Publish the first materials and test whether taxpayers understand them or see them as generic public relations.",
                    "Adjust the examples, visuals, and language based on real reactions from taxpayers and frontline staff.",
                    "Coordinate the timing with billing or reminder cycles so the transparency message supports actual collection work."
                ],
                "twelveToTwentyFourMonths": [
                    "Repeat the reporting rhythm routinely, even if the first versions are simple, so transparency feels like a practice and not a campaign.",
                    "Expand from project examples into broader service explanations only when the data are strong enough to support that move.",
                    "Use citizen questions and media reaction to improve both the message and the underlying financial reporting."
                ]
            },
            "legalInstitutional": [
                "No major legal change is usually needed, but the city should respect rules on publication of budget and expenditure information.",
                "Be careful not to imply earmarking where the legal budget system does not actually earmark property-tax receipts.",
                "Clarify who signs off on public figures and project claims before publication."
            ],
            "capacitySystemsPartnerships": [
                "The city needs basic, timely revenue and spending information and a communications function that can translate it into plain language.",
                "Service departments must verify any project or maintenance examples used publicly.",
                "Front-office staff should know the main examples so they can reinforce the message consistently."
            ],
            "risksAndSafeguards": [
                "Overclaiming is the biggest risk: once taxpayers conclude the city is exaggerating, trust falls rather than rises.",
                "If the city highlights only showcase projects while everyday service quality remains poor, the message may feel selective or political.",
                "If the message is too abstract, taxpayers may not connect it to their own neighbourhood or experience."
            ],
            "whatToMonitor": [
                "Reach of the reporting materials across the main communication channels.",
                "Taxpayer understanding or recall of at least one concrete example of tax-funded service or project output.",
                "Changes in help-desk questions or public sentiment after transparency messaging.",
                "Whether on-time payment improves in areas where trust messaging is strongest."
            ],
            "connectionsToOtherCards": [
                "Run a wider taxpayer information and confidence campaign.",
                "Use reminder messages before and after due dates.",
                "Set up a help desk and quick fixes for billing mistakes."
            ],
            "questionsBeforeLaunch": [
                "What can the city say truthfully and simply about where the money goes?",
                "Which visible examples will ordinary taxpayers recognise immediately?",
                "How will the city avoid exaggerating the role of one revenue stream?",
                "Who will verify public claims before they are released?"
            ]
        }
    },
    {
        "solutionId": "PT-COM-17",
        "stream": "Property Tax",
        "streamType": "property-based",
        "subgroup": null,
        "gap": "Compliance",
        "title": "Run a wider taxpayer information and confidence campaign",
        "shortTitle": "Taxpayer Confidence Campaign",
        "timeline": "< 1 year",
        "deliveryDifficulty": "Low–Medium",
        "politicalSensitivity": "Medium",
        "category": "Communication",
        "sortOrder": 17,
        "isActive": true,
        "overview": {
            "whatThisOptionDoes": "Run a clear, repeated information campaign that explains what the property tax is for, what has changed, how bills are calculated, where and how to pay, how to correct mistakes, and what happens if people do not pay. This is broader than a one-off media announcement. It is a practical effort to reduce confusion before it hardens into resistance or non-payment.",
            "mostUsefulWhen": [
                "The city is changing bills, payment channels, enforcement practice, or assessment methods and wants less confusion.",
                "Rumours, mistrust, or low tax literacy are weakening payment culture.",
                "Leaders want taxpayers to experience reform as a fairer and clearer system, not just a harder one."
            ],
            "whatUsuallyNeedsToBeInPlaceFirst": [
                "A small set of messages that are factually correct, short, and consistent across departments.",
                "Channels that reach different audiences, such as radio, ward meetings, help desks, SMS, social media, and inserts with bills."
            ],
            "usuallyNotBestFirstMove": [
                "Do not use communications as a substitute for fixing bad bills, missing notices, or weak customer support.",
                "It will backfire if the city makes claims it cannot support or promises service improvements it cannot deliver."
            ],
            "politicalNote": "This option is often most useful just before and during change. Its credibility depends less on polish than on honesty, repetition, and visible links to real improvements in billing, payment, customer support, or service delivery.",
            "whatFullCardWouldPlan": "The full card would help the city plan the message set, the campaign calendar, the audience segments, the channels, the spokespersons, and the way the campaign should connect to help desks, reminders, and visible reform milestones.",
            "oftenWorksBestAlongside": [
                "Show taxpayers where the money goes; Send bills people can understand; Set up a help desk and quick fixes for billing mistakes.",
                "Valuation and assessment accuracy",
                "These cards help the city improve how property tax bills are assessed within the current legal framework. The emphasis is on methods the administration can actually maintain, better data, more regular updates, and fairer treatment across taxpayers.",
                "These cards assume the city is trying to improve assessment accuracy within the current legal framework. In this stream, fairness, communication, and operational realism matter as much as technical design.",
                "Choose a workable assessment basis",
                "These cards are about choosing an assessment approach that is not only technically sound but also realistic for the city to maintain over time."
            ]
        },
        "fullDetails": {
            "whyThisMatters": "When the city changes bills, payment channels, enforcement practice, or assessment methods, confusion can spread faster than the reform itself. A wider taxpayer information and confidence campaign helps prevent that. It explains what is changing, why it is changing, how taxpayers can comply, where they can get help, and what fairness safeguards exist. Done well, it reduces rumours, supports frontline staff, and makes the whole collection reform feel more coherent rather than more aggressive.",
            "whenStrongFit": [
                "The city is changing billing, payment, enforcement, or assessment practice and wants less confusion and resistance.",
                "Tax literacy is low, rumours are common, or mistrust is undermining payment culture.",
                "Leadership wants taxpayers to experience reform as a clearer and fairer system, not only a harder one."
            ],
            "whatToLineUpFirst": [
                "Start with a short, disciplined message set and repeat it across many channels; taxpayers need consistency more than sophistication.",
                "If the city is making several changes at once, sequence the messages so taxpayers are not overwhelmed.",
                "Tie the campaign to real service points such as help desks, bills, ward meetings, and reminders, rather than treating it as a stand-alone media exercise."
            ],
            "designChoices": [
                "Which audience groups need tailored messages: owner-occupiers, landlords, businesses, older taxpayers, new taxpayers, or local leaders.",
                "Which channels will carry the campaign best in your context: radio, ward meetings, SMS, social media, bill inserts, or local associations.",
                "Who should speak for the reform so the message carries both administrative credibility and political legitimacy."
            ],
            "practicalPath": {
                "first90Days": [
                    "List the changes taxpayers need to understand now and group them into a small number of messages.",
                    "Choose the first channels and prepare standard talking points for staff, leaders, and partner institutions.",
                    "Align the campaign calendar with key reform milestones such as first bills, opening of new payment channels, or start of stricter overdue follow-up."
                ],
                "sixTo12Months": [
                    "Run the campaign through multiple channels and monitor which questions or rumours keep returning.",
                    "Adjust the language where taxpayers still misunderstand the purpose of the reform or the steps they need to take.",
                    "Use the help desk, ward meetings, and social media feedback as live intelligence on what the city still needs to explain better."
                ],
                "twelveToTwentyFourMonths": [
                    "Repeat the campaign around the moments that matter most each year, rather than treating it as a one-off launch.",
                    "Refresh the message set as reforms mature so the campaign remains tied to real changes and service improvements.",
                    "Use what the city learns from taxpayer reaction to improve not just communications but also the design of bills, notices, and support channels."
                ]
            },
            "legalInstitutional": [
                "No major legal reform is usually required, but public claims about rules, penalties, and rights must match the actual legal framework precisely.",
                "Clarify who approves public messaging when reforms touch sensitive areas such as penalties, valuations, or enforcement.",
                "Where partner agencies or local leaders repeat the message, brief them on the same approved content."
            ],
            "capacitySystemsPartnerships": [
                "The city needs one small coordination point for messages, spokespeople, timing, and feedback.",
                "Help-desk, ward, and communications teams should work from the same FAQs and escalation routes.",
                "If reform milestones slip, the campaign must adapt quickly rather than continue to promise steps that are not actually ready."
            ],
            "risksAndSafeguards": [
                "Communications can backfire when the city promises improvements or safeguards it cannot deliver in practice.",
                "Too much campaign polish without practical support channels can make the reform feel manipulative rather than clear.",
                "If different departments explain the reform differently, the campaign will generate more confusion instead of less."
            ],
            "whatToMonitor": [
                "Reach of the campaign by channel and audience group.",
                "Top recurring taxpayer questions before and after campaign stages.",
                "Use of help-desk or support channels during the campaign period.",
                "Change in payment behaviour or complaint volume after major campaign milestones."
            ],
            "connectionsToOtherCards": [
                "Show taxpayers where the money goes.",
                "Send bills people can understand.",
                "Set up a help desk and quick fixes for billing mistakes."
            ],
            "questionsBeforeLaunch": [
                "What are the few messages taxpayers most need to hear right now?",
                "Which channels reach taxpayers who are least likely to understand the reform without extra help?",
                "Who will act as credible spokespersons for the reform?",
                "How will the city know when the message is still not landing?"
            ]
        }
    }
];

})(window);
