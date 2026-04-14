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
            solutionId: 'NP-A-COV-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Easy First-Time Business Registration and Licensing',
            shortTitle: 'Simplified First Registration',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Offer a short, practical route for first-time entry into the municipal licensing system. Keep the first application focused on essential information such as activity, location, contact, and a small number of local checks, and let the business obtain at least a basic compliant status quickly. The goal is to lower the barrier so that businesses that would otherwise remain outside the system can enter it with minimal friction and begin building a compliance history.',
                mostUsefulWhen: [
                    'Many small businesses are operating without a licence, especially in neighbourhood centres, markets, and mixed-use areas.',
                    'The current first-time process is so complicated or intimidating that businesses stay outside the system rather than face it.',
                    'The municipality wants a visible, low-cost improvement that can widen the licensing base quickly without a major systems overhaul.'
                ],
                usuallyNotBestFirstMove: [
                    'National law leaves no room for local simplification of first-time licensing requirements.',
                    'The underlying register cannot yet create and track new accounts reliably, meaning simplified intake would feed into a broken back-end.'
                ],
                whatFullCardWouldPlan: 'Design a one-page first-entry form and decide which minimal documents are truly necessary. Open at least two intake channels, prepare a simple daily logging routine, run a short communication campaign, create the account, assign the business ID, issue the first bill or renewal date, and review the first weeks of applications to remove avoidable bottlenecks.',
                oftenWorksBestAlongside: [
                    'NP-A-COV-04 (Digital Licence Register and Unique Business IDs) so that new accounts feed directly into a reliable tracking system.',
                    'NP-A-COM-02 (Accessible Payment and Renewal Channels) so that newly registered businesses can pay easily from the start.',
                    'NP-A-COV-03 (Targeted Onboarding Drive) if the simplified registration is launched as part of a broader regularisation campaign.'
                ],
                politicalNote: 'Simplified first registration can be politically sensitive because it may appear to lower standards or let businesses off too easily. Frame it as bringing operators into a clearer local system rather than as a concession. Councillors and enforcement staff may need reassurance that this is the start of a compliance pathway, not the end of oversight.'
            },
            fullDetails: {
                overview: 'This solution creates a streamlined first-time licensing pathway that focuses on essential information and removes unnecessary barriers to entry. By making the first contact with the licensing system simple and non-threatening, the municipality can rapidly expand its licensing base and bring previously invisible businesses into the formal system. The approach recognises that a business inside the system with basic information is far more valuable for revenue and regulatory purposes than a business that remains entirely unknown.',
                implementationPath: [
                    'Design a one-page first-entry form and decide which minimal documents are truly necessary for a first licence or provisional licence. Strip out anything that can be collected later at renewal.',
                    'Open at least two intake channels, for example the central revenue office and ward or market points, and prepare a simple daily logging routine so every application is tracked from day one.',
                    'Run a short communication campaign explaining who should register, what the city is asking for, and what businesses receive immediately after applying. Use language that emphasises the benefit of being in the system.',
                    'Create the account, assign the business ID, issue the first bill or renewal date, and review the first weeks of applications to remove avoidable bottlenecks such as unnecessary queuing, unclear document requirements, or staff confusion about the new process.'
                ],
                legalInstitutionalEnablers: 'The city needs clear authority to accept a simplified first application or, where relevant, issue a temporary or provisional licence under existing rules. If this authority is unclear, a short council order or administrative circular is often enough to provide the legal basis. The key requirement is that the municipality can create a formal business account and assign an identifier without requiring the full set of documents or inspections that may apply to renewals or higher-risk activities.',
                administrativeSetup: 'Use a plain form, a short document checklist, and clear staff guidance. The process should create the business account immediately, assign a unique ID, and trigger the first bill or renewal date in the register. Staff at intake points need a simple decision tree: what to accept, what to defer, and when to escalate. The daily logging routine should capture the date, source, and outcome of each application so management can monitor volumes and spot problems early.',
                goodFitWhen: [
                    'Many small businesses are operating without a licence, especially in neighbourhood centres, markets, and mixed-use areas.',
                    'The current first-time process is so complicated or intimidating that businesses stay outside the system.',
                    'The municipality wants a visible, low-cost improvement that can widen the base quickly.'
                ],
                lessSuitableWhen: [
                    'National law leaves no room for local simplification of first-time licensing requirements.',
                    'The underlying register cannot yet create and track new accounts reliably.',
                    'The fee schedule is so complex that even a simplified form cannot easily determine the correct first charge.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. A coverage reform should widen the licensing base, not feel like a surprise enforcement raid on small operators.',
                    'Log the date and source of each new or corrected account so the city can challenge duplicates, disputes, and informal side deals later.',
                    'Frame it as bringing businesses into a clearer local system, not as a sudden crackdown on informality.',
                    'Ensure that the simplified pathway connects to the normal renewal cycle so that first-time registrants do not fall out of the system after their initial entry.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COV-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Business Listing Through Data-Sharing and Street Verification',
            shortTitle: 'Data-Sharing & Verification',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Moderate',
            category: 'Data',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Build or refresh the business list by combining what the municipality already knows with what partner agencies, utilities, market managers, or local associations know, then verify quickly in the street. Instead of starting from scratch, this approach treats discovery as a matching and confirmation exercise, using existing administrative footprints to find businesses that should be licensed but are not.',
                mostUsefulWhen: [
                    'Other offices or partners already hold partial business information, such as permit lists, market registers, utility records, or inspection records.',
                    'Business activity is concentrated enough that short verification visits are practical and cost-effective.',
                    'Staff can manage basic matching in Excel or another simple system without needing a large IT investment.'
                ],
                usuallyNotBestFirstMove: [
                    'Partner data are too weak, too old, or too poorly structured to be useful for matching purposes.',
                    'Politics or institutional conflict make data-sharing unrealistic in the short term, even with formal agreements in place.'
                ],
                whatFullCardWouldPlan: 'Map the best existing data sources, run simple matching to identify likely missing businesses, send small verification teams to confirm uncertain cases, and add, correct, or close accounts immediately after verification with a source log so the process can be repeated regularly.',
                oftenWorksBestAlongside: [
                    'NP-A-COV-01 (Easy First-Time Registration) so that newly discovered businesses can be registered quickly through a simplified process.',
                    'NP-A-COV-04 (Digital Licence Register) to ensure that verified business data feeds into a single reliable register.',
                    'NP-A-COV-05 (Rolling Roll Clean-Up) since the same data-sharing approach helps identify closed or dormant businesses as well as missing ones.'
                ],
                politicalNote: 'Data-sharing between agencies is usually less politically sensitive than enforcement or fee changes, but institutional turf issues can block progress. Show partner agencies that cleaner local business data also helps their own operational work, such as planning, regulation, and service delivery.'
            },
            fullDetails: {
                overview: 'This solution uses existing administrative data from multiple sources to identify businesses that are operating but not yet captured in the municipal licensing register. Rather than relying solely on field canvassing or self-registration, it treats coverage improvement as a data-matching problem. By cross-referencing permit files, market lists, utility connections, inspector notebooks, and association membership rolls, the municipality can generate a targeted list of likely unlicensed businesses and then verify only the uncertain cases in the field, making the discovery process faster and cheaper than a full enumeration.',
                implementationPath: [
                    'Map the best existing data sources, such as permit files, market lists, utility records, inspector notebooks, and association lists, and agree a basic data-sharing cycle with each source.',
                    'Run simple matching to identify likely missing businesses, duplicates, and obvious address or activity errors before field visits begin. This desk exercise often reveals more gaps than expected.',
                    'Send small verification teams to confirm only the uncertain cases so that staff effort is focused where the data are weakest, rather than visiting every business in the jurisdiction.',
                    'Add, correct, or close accounts immediately after verification and keep a source log so the process can be repeated every quarter or every half year without starting from scratch.'
                ],
                legalInstitutionalEnablers: 'The city should be able to receive and use non-sensitive data for local revenue administration. If needed, this is often handled through simple data-sharing agreements or memoranda of understanding with partner agencies. The legal requirement is usually modest: the municipality needs the authority to use external administrative data for the purpose of maintaining the licensing register, and partners need assurance that data will be used only for agreed purposes.',
                administrativeSetup: 'Assign a liaison in each relevant office or partner organisation, define a short matching rule that specifies what constitutes a likely match or mismatch, and keep a log of every new business added, corrected, or rejected after verification. The matching work can usually be done in a spreadsheet for a first round. Verification teams need a short field form, a clear area assignment, and a reporting deadline. Results should feed back into the register within days, not weeks.',
                goodFitWhen: [
                    'Other offices or partners already hold partial business information that can be matched against the licensing register.',
                    'Business activity is concentrated enough that short verification visits are practical.',
                    'Staff can manage basic matching in Excel or another simple system.'
                ],
                lessSuitableWhen: [
                    'Partner data are too weak, too old, or too fragmented to be useful for matching.',
                    'Politics or institutional conflict make data-sharing unrealistic in the short term.',
                    'The municipality has no capacity to follow up on verification results in a timely way.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. Verification visits should feel like an administrative update, not an enforcement action.',
                    'Log the date and source of each new or corrected account so the city has a defensible audit trail.',
                    'Where possible, show partner agencies that cleaner local business data also helps their own operational work, such as planning, public health regulation, or infrastructure provision.',
                    'Set realistic expectations for the first round. Data matching will not find every missing business, but it will usually find the most obvious gaps quickly and cheaply.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COV-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Targeted Onboarding Drive with Time-Bound Regularisation',
            shortTitle: 'Onboarding & Regularisation Drive',
            timeline: '6-12 months',
            deliveryDifficulty: 'Moderate to High',
            politicalSensitivity: 'Moderate',
            category: 'Campaign',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Run a focused campaign inviting unlicensed businesses to come forward within a fixed window, often paired with lighter entry conditions or limited relief from back-penalties. The campaign creates a clear before-and-after moment: businesses that register during the window get a fresh start, while those that do not face normal or enhanced enforcement afterwards.',
                mostUsefulWhen: [
                    'The municipality believes many businesses could register if the first step felt safer and more manageable.',
                    'Fear of back-charges or penalties is a major reason businesses remain outside the licensing roll.',
                    'New political leadership wants a visible reset before stronger enforcement begins.'
                ],
                usuallyNotBestFirstMove: [
                    'The municipality has repeated amnesties so often that businesses now expect to wait for the next one rather than comply.',
                    'The administration cannot process a sudden increase in applications without serious delays or errors.'
                ],
                whatFullCardWouldPlan: 'Define the regularisation offer clearly, prepare extra intake capacity, use targeted outreach through trader groups and local media, and close the campaign with a published cut-off date before shifting into normal enforcement.',
                oftenWorksBestAlongside: [
                    'NP-A-COV-01 (Easy First-Time Registration) to ensure that the onboarding process during the campaign window is genuinely simple.',
                    'NP-A-COM-03 (Graduated Enforcement for Non-Renewal) so there is a credible follow-up for businesses that do not come forward during the campaign.',
                    'NP-A-LIA-01 (Review and Simplify the Fee Schedule) if the campaign is an opportunity to introduce a clearer, fairer fee structure at the same time.'
                ],
                politicalNote: 'Regularisation campaigns can be politically attractive because they show action and produce visible results quickly. However, they can also be controversial if they appear to reward non-compliance. The key is to frame the campaign as a one-time reset, not a recurring amnesty, and to follow through credibly on enforcement after the window closes.'
            },
            fullDetails: {
                overview: 'This solution uses a time-limited campaign to bring unlicensed businesses into the formal system by temporarily reducing the barriers and costs of entry. The campaign defines a clear registration window, communicates it widely, provides extra intake capacity, and pairs the offer with a credible commitment to stronger enforcement after the window closes. It works best as a one-time or very infrequent event that creates a psychological break between the old informal status quo and a new normal of expected compliance.',
                implementationPath: [
                    'Define the regularisation offer clearly, including the registration window dates, any temporary penalty relief or simplified requirements, and what happens once the campaign ends. Put this in writing and get council or executive endorsement.',
                    'Prepare extra intake capacity at counters, ward offices, market offices, or mobile points so the campaign does not collapse under its own success. Estimate likely volumes and plan for surge staffing.',
                    'Use targeted outreach through trader groups, market leaders, business associations, and local radio so the message reaches operators outside formal channels. Personal communication through trusted intermediaries is often more effective than mass advertising.',
                    'Close the campaign with a published cut-off date and shift quickly into normal renewal monitoring and selective enforcement. The credibility of the campaign depends entirely on what happens after the window closes.'
                ],
                legalInstitutionalEnablers: 'The city needs legal room to waive or reduce past penalties for a defined period, if that is part of the offer. This usually requires a clear council resolution with a fixed cut-off date, published in the official manner required by local law. The resolution should specify exactly what is waived, for whom, and until when, so there is no ambiguity about the terms of the offer.',
                administrativeSetup: 'Pair the campaign with strong communication, surge capacity at counters or ward points, simple proof requirements, and a clear plan for what happens after the window closes. Registration teams need pre-printed forms, quick-reference guides for the campaign rules, and daily reporting to a central coordinator. Back-office staff need a fast-track workflow for processing campaign applications so the pipeline does not clog.',
                goodFitWhen: [
                    'The municipality believes many businesses could register if the first step felt safer and more manageable.',
                    'Fear of back-charges or penalties is a major reason businesses remain outside the roll.',
                    'New political leadership wants a visible reset before stronger enforcement.'
                ],
                lessSuitableWhen: [
                    'The municipality has repeated amnesties so often that businesses now expect to wait for the next one.',
                    'The administration cannot process a sudden increase in applications without serious delays or data quality problems.',
                    'There is no credible enforcement capability to deploy after the campaign window closes.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. The campaign should feel welcoming, not like a trap.',
                    'Log the date and source of each new or corrected account so the city has a clear record of who came forward during the campaign.',
                    'Publicly say early that this is the last easy entry window before normal enforcement resumes. Credibility depends on follow-through.',
                    'Do not extend the campaign window once it is published. Extensions signal that deadlines are negotiable and undermine future compliance messaging.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COV-04',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Digital Licence Register and Unique Business IDs',
            shortTitle: 'Digital Register & Business IDs',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Moderate',
            category: 'Systems',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Create a single digital register with a unique ID for each licensed business. This lets the municipality track first registration, renewal history, fees due, payments, inspections, and corrections in one place. The register becomes the single source of truth for who is licensed, what they owe, and whether they are compliant.',
                mostUsefulWhen: [
                    'The city relies on multiple paper lists or disconnected spreadsheets that cannot be reconciled.',
                    'The same business appears more than once under different names or locations, making accurate billing and enforcement impossible.',
                    'Renewal tracking is weak because there is no stable account history to refer to.'
                ],
                usuallyNotBestFirstMove: [
                    'The jurisdiction is so small that a digital system would add cost but little value over well-managed paper records.',
                    'There is no realistic local capacity to maintain even a basic digital register, including data entry, backup, and troubleshooting.'
                ],
                whatFullCardWouldPlan: 'Agree a minimum data model, clean and migrate existing records, set up simple workflows for registration, renewal, closure, dormancy, and reactivation, train users by role, test in one department or ward, and then deploy as the live register for billing and renewal control.',
                oftenWorksBestAlongside: [
                    'NP-A-COV-05 (Rolling Roll Clean-Up) since the register is only as good as the data it contains.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) so that the register directly drives correct and timely billing.',
                    'NP-A-COM-01 (Structured Renewal Reminders) since automated reminders depend on having a reliable register with contact data and renewal dates.'
                ],
                politicalNote: 'Digital register projects are generally popular with political leaders because they signal modernisation. The risk is over-promising: a register that is launched but not maintained, or that staff bypass in favour of old methods, can become a costly failure. Keep the scope realistic and invest as much in training and maintenance as in the technology itself.'
            },
            fullDetails: {
                overview: 'This solution builds the core infrastructure for modern licensing administration: a single digital register that assigns a unique identifier to every licensed business and tracks the full lifecycle from first registration through renewal, dormancy, reactivation, and closure. Without this foundation, every other improvement in billing, compliance, and revenue management is harder to implement and sustain. The register replaces fragmented paper lists and spreadsheets with a structured system that staff across departments can use consistently.',
                implementationPath: [
                    'Agree a minimum data model for the licensing register, including business ID, activity type, location, owner or contact, account status, renewal date, amount billed, and payment history. Resist the temptation to design the perfect model upfront; start with what is essential and expand later.',
                    'Clean and migrate existing paper or spreadsheet records, removing duplicates and deciding how dormant or uncertain accounts will be treated. This step is often the most time-consuming and should not be underestimated.',
                    'Set up simple workflows for new registration, renewal, closure, dormancy, reactivation, and change of activity so staff stop inventing their own methods. Each workflow should have clear steps, responsible roles, and expected timeframes.',
                    'Train users by role, test the system in one department or ward first, and only then use it as the live register for billing and renewal control. Running the old and new systems in parallel for a short period can reduce the risk of data loss during transition.'
                ],
                legalInstitutionalEnablers: 'Electronic records should be recognised for administrative use and the city should be able to assign a unique municipal business identifier. If existing law does not explicitly address digital records, a council resolution or administrative order may be needed to confirm that the digital register is the official record for licensing purposes. Data protection obligations should be addressed in the system design.',
                administrativeSetup: 'Prepare a migration and deduplication plan before any data enters the new system. Define user roles with appropriate access levels: data entry clerks, billing officers, inspectors, supervisors, and system administrators. Write simple standard operating procedures for adding, renewing, closing, and reactivating accounts. Keep backup and support arrangements realistic, including arrangements for what happens if the system goes down or the vendor becomes unavailable.',
                goodFitWhen: [
                    'The city relies on multiple paper lists or disconnected spreadsheets.',
                    'The same business appears more than once under different names or locations.',
                    'Renewal tracking is weak because there is no stable account history.'
                ],
                lessSuitableWhen: [
                    'The jurisdiction is so small that a digital system would add cost but little value.',
                    'There is no realistic local capacity to maintain even a basic digital register.',
                    'The municipality has already invested in a functioning register that needs improvement rather than replacement.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. Log the date and source of each new or corrected account.',
                    'Data migration is where most register projects succeed or fail. Budget adequate time and staff for cleaning existing records.',
                    'Avoid over-customisation. A simple system that staff actually use is worth far more than a sophisticated one that they bypass.',
                    'Plan for ongoing maintenance costs including hosting, support, updates, and staff turnover. A register without sustained maintenance will degrade within months.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COV-05',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Coverage',
            title: 'Rolling Business Roll Clean-Up and Dormancy Rules',
            shortTitle: 'Roll Clean-Up & Dormancy',
            timeline: '< 1 year, repeat each cycle',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Usually higher',
            category: 'Maintenance',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Keep the register realistic by checking regularly which businesses have closed, moved, changed activity, or become dormant. Good roll maintenance matters as much as finding new businesses because a bloated register full of dead accounts makes billing, enforcement, and revenue forecasting unreliable.',
                mostUsefulWhen: [
                    'The register contains many dead or duplicate accounts that distort billing and collection statistics.',
                    'Staff waste time billing businesses that no longer exist or chasing payments that will never be collected.',
                    'Management wants the roll to reflect real activity rather than historical accumulation of accounts that were never cleaned out.'
                ],
                usuallyNotBestFirstMove: [
                    'The register is so new or small that formal maintenance rules are unnecessary.',
                    'Staff capacity for even basic desk review is currently too thin to sustain a regular clean-up cycle.'
                ],
                whatFullCardWouldPlan: 'Create account-status codes with clear rules, review the register at fixed intervals using non-renewal lists and inspector notes, move doubtful accounts into a review queue, and publish simple internal reports on dormant, reactivated, and closed accounts.',
                oftenWorksBestAlongside: [
                    'NP-A-COV-04 (Digital Licence Register) since a digital register makes roll maintenance far more efficient.',
                    'NP-A-COV-02 (Data-Sharing and Street Verification) because the same data-matching methods that find missing businesses also help identify closed or dormant ones.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) since clean roll data is a prerequisite for accurate billing.'
                ],
                politicalNote: 'Removing accounts from the roll can be politically sensitive because it may appear to reduce the size of the licensing base or write off revenue. Frame roll maintenance as making the register more honest and the billing pipeline more realistic, not as giving up on revenue. Show management the cost of chasing phantom accounts versus the value of focusing effort on collectible revenue.'
            },
            fullDetails: {
                overview: 'This solution addresses the often-neglected maintenance side of coverage by establishing systematic rules and routines for keeping the business register accurate and current. An inflated register full of closed, dormant, or duplicate accounts undermines every downstream process: bills go to the wrong addresses, collection rates look worse than they are, enforcement effort is wasted on phantom targets, and management decisions are based on unreliable numbers. Regular roll clean-up ensures that the register reflects the real universe of licensed businesses and that every account in it represents a genuine compliance and revenue opportunity.',
                implementationPath: [
                    'Create a short set of account-status codes, for example active, dormant, seasonal, moved, merged, and closed, with clear rules for who can apply each one and what evidence is required.',
                    'Review the register at a fixed interval, such as quarterly or semi-annually, using non-renewal lists, returned notices, inspector notes, and targeted phone or street verification to identify accounts that need status changes.',
                    'Move doubtful accounts into a review queue rather than leaving them indefinitely in the live roll with no explanation. The review queue should have a defined resolution timeline so accounts do not sit in limbo forever.',
                    'Publish simple internal reports on dormant, reactivated, and closed accounts so management can see whether the roll is becoming more realistic over time and where the biggest data quality issues remain.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to suspend, close, or mark accounts dormant under clear administrative rules. This authority usually exists already but may need to be formalised through an administrative order that defines the criteria and process for each status change. The rules should include safeguards against improper closure, such as requiring supervisor approval for closing accounts above a certain value.',
                administrativeSetup: 'Use periodic desk review plus targeted field checks rather than attempting to verify every account in the field. Define a small set of change-of-status codes and keep a full audit trail for closures, mergers, and reactivations. Assign responsibility for the review cycle to a named officer or team, set a calendar for each review round, and report results to management. The process should also include a mechanism for businesses to notify the municipality of closure, change of activity, or relocation.',
                goodFitWhen: [
                    'The register contains many dead or duplicate accounts.',
                    'Staff waste time billing businesses that no longer exist.',
                    'Management wants the roll to reflect real activity rather than historical accumulation.'
                ],
                lessSuitableWhen: [
                    'The register is so new or small that formal maintenance rules are unnecessary.',
                    'Staff capacity for even basic desk review is currently too thin.',
                    'The municipality does not yet have a functioning register to maintain.'
                ],
                risksAndDesignNotes: [
                    'Keep the first contact proportionate. Log the date and source of each change for audit purposes.',
                    'Do not treat roll clean-up as a one-time project. The value comes from repeating the process on a regular cycle so the register stays current.',
                    'Be transparent about the difference between removing an account and writing off a debt. Closing a dormant account does not mean the municipality forgives any outstanding amount; it means the account is no longer actively billed.',
                    'Watch for staff who use dormancy codes to hide difficult accounts rather than working them. Supervisor review of status changes is essential.'
                ]
            }
        },

        // =============================================
        // LIABILITY APPLICATION CARDS (3)
        // =============================================

        {
            solutionId: 'NP-A-LIA-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability Application',
            title: 'Review and Simplify the Fee Schedule',
            shortTitle: 'Fee Schedule Simplification',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Moderate to High',
            category: 'Policy',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Review the current licence fee structure to ensure it is clear, applied consistently, and reflects the actual categories and rates the municipality intends. Simplifying or correcting the schedule is often a prerequisite for fair billing because staff cannot apply what they do not understand, and businesses cannot comply with what they cannot predict.',
                mostUsefulWhen: [
                    'The current schedule is long, outdated, or inconsistently applied across wards or offices.',
                    'Different offices or staff members apply different rates for similar businesses because the schedule is ambiguous.',
                    'Taxpayers cannot easily find out what they should be paying, which undermines voluntary compliance and creates opportunities for negotiation or corruption.'
                ],
                usuallyNotBestFirstMove: [
                    'The fee schedule was recently reviewed and is working well in practice.',
                    'The main problem is non-payment rather than incorrect billing, in which case compliance solutions may be more urgent.'
                ],
                whatFullCardWouldPlan: 'List all current fee lines, rates, and categories used in practice and compare them with the adopted schedule. Identify gaps, duplication, and common misapplication errors. Propose a streamlined schedule, adopt it through the required approval route, and update billing materials and staff guidance.',
                oftenWorksBestAlongside: [
                    'NP-A-LIA-02 (Improve Activity Classification) since a clearer schedule is only useful if businesses are assigned to the correct categories.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) so that the revised schedule feeds directly into correct and timely bills.',
                    'NP-A-COV-01 (Easy First-Time Registration) if the simplified schedule is launched alongside an effort to bring new businesses into the system.'
                ],
                politicalNote: 'Fee changes can trigger political pushback from business groups, councillors representing commercial areas, or opposition leaders looking for an issue. Involve stakeholders early and explain the fairness rationale. Where possible, show that simplification is about consistency and transparency rather than across-the-board increases. If the review reveals that some businesses have been underpaying, phase corrections over one or two cycles rather than applying large one-time adjustments.'
            },
            fullDetails: {
                overview: 'This solution addresses the foundation of the liability application gap: the fee schedule itself. If the schedule is unclear, outdated, or inconsistently interpreted, then every bill the municipality sends is potentially wrong, and every compliance action is potentially unfair. A fee schedule review strips the existing structure back to its essentials, removes obsolete categories, clarifies ambiguous rate bands, and produces a document that both staff and businesses can use with confidence. The result is not necessarily higher fees but more accurate, defensible, and consistently applied fees.',
                implementationPath: [
                    'List all current fee lines, rates, and categories used in practice and compare them with the legal or council-adopted schedule. This often reveals that practice has diverged significantly from the official document.',
                    'Identify gaps, duplication, outdated categories, and the most common misapplication errors. Talk to billing staff, inspectors, and counter officers to understand where the schedule causes confusion or disagreement in daily work.',
                    'Propose a streamlined schedule that staff can apply consistently and that the public can understand. Fewer categories with clearer definitions are usually better than many categories with blurred boundaries.',
                    'Adopt the revised schedule through the required local approval route and update billing systems, application forms, public notices, and communication materials to reflect the new schedule.'
                ],
                legalInstitutionalEnablers: 'Fee schedules usually require council or executive adoption. The city needs clear authority to set, revise, and publish the schedule, including the power to merge, split, or retire fee categories. Check whether the schedule revision triggers any public consultation or gazette requirements under local law.',
                administrativeSetup: 'Align the schedule with the register categories and billing system so that every category in the schedule corresponds to a code in the register and an amount in the billing workflow. Train all staff who classify businesses or set fee amounts, including counter staff, inspectors, and billing officers. Publish the schedule in a format that businesses can access, such as a poster at the revenue office, a page on the municipal website, or a printed leaflet available at registration points.',
                goodFitWhen: [
                    'The current schedule is long, outdated, or inconsistently applied.',
                    'Different offices apply different rates for similar businesses.',
                    'Taxpayers cannot easily find out what they should be paying.'
                ],
                lessSuitableWhen: [
                    'The fee schedule was recently reviewed and is working well.',
                    'The main problem is non-payment rather than incorrect billing.',
                    'Fee-setting authority rests entirely at the national level and the municipality has no room to adjust.'
                ],
                risksAndDesignNotes: [
                    'Fee changes can trigger political pushback. Involve stakeholders early and explain the fairness rationale.',
                    'Where the review reveals that some businesses have been underpaying, consider phasing corrections over one or two renewal cycles rather than applying large one-time adjustments.',
                    'Ensure the revised schedule is published and accessible before it takes effect. Businesses should not learn about a new fee from the bill itself.',
                    'Document the rationale for each change so the municipality can defend the schedule if challenged legally or politically.'
                ]
            }
        },

        {
            solutionId: 'NP-A-LIA-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability Application',
            title: 'Improve Activity Classification and Assignment',
            shortTitle: 'Activity Classification',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Moderate',
            category: 'Classification',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Ensure that each business is assigned to the correct activity class and fee band so that the bill matches what the schedule actually prescribes. Misclassification is one of the most common reasons for unfair or under-collected licence revenue because even a correct fee schedule produces wrong bills if businesses are placed in the wrong categories.',
                mostUsefulWhen: [
                    'The same type of business is classified differently in different wards or by different staff members.',
                    'Staff rely on personal judgement rather than defined rules when assigning activity codes and fee bands.',
                    'Revenue losses from misclassification are likely material based on sample checks or anecdotal evidence.'
                ],
                usuallyNotBestFirstMove: [
                    'Classification is already well managed and consistently applied across the municipality.',
                    'The fee schedule itself is the bigger problem, in which case NP-A-LIA-01 should come first.'
                ],
                whatFullCardWouldPlan: 'Compare the register against the fee schedule, run a sample audit to estimate the revenue effect of misclassification, correct the clearest cases, route borderline cases through a defined review process, and update staff guidance and training.',
                oftenWorksBestAlongside: [
                    'NP-A-LIA-01 (Review and Simplify the Fee Schedule) since classification rules and fee categories must align.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) so that corrected classifications flow through to correct bills at the next renewal.',
                    'NP-A-COV-05 (Rolling Roll Clean-Up) since misclassification is often discovered during roll maintenance.'
                ],
                politicalNote: 'Reclassification can feel punitive to businesses that have been paying a lower fee, even if the lower fee was never correct. Start with the clearest mismatches and communicate the change as a correction rather than an increase. Providing an appeal or review channel reduces the political temperature and protects staff from accusations of arbitrary action.'
            },
            fullDetails: {
                overview: 'This solution targets the assignment layer between the fee schedule and the individual business account. Even when the fee schedule is well designed, revenue is lost if businesses are placed in the wrong activity class or fee band. Misclassification can happen for many reasons: unclear category definitions, undertrained staff, outdated register entries, businesses that have changed activity since first registration, or deliberate mis-coding to keep fees low. This solution establishes clear classification rules, audits the existing register for mismatches, corrects the most material errors, and puts in place guidance and training to prevent recurrence.',
                implementationPath: [
                    'Compare the register\'s current activity codes against the fee schedule to see where businesses are misclassified or unclassified. Produce a gap report showing the most common discrepancies by category, ward, and fee band.',
                    'Run a sample audit to estimate how many businesses are in the wrong category and the likely revenue effect. Even a small sample of 50 to 100 accounts can reveal whether misclassification is a minor nuisance or a major revenue leak.',
                    'Correct the clearest cases administratively and route borderline cases through a defined review process with documentation and appeal rights. Prioritise high-value mismatches where the fee difference is significant.',
                    'Update staff guidance, training, and forms so classification rules are applied consistently for new registrations and renewals. Provide decision trees or lookup tables rather than relying on verbal instructions.'
                ],
                legalInstitutionalEnablers: 'The city usually already has the authority to classify businesses by activity for fee purposes. The legal issue is usually whether reclassification triggers notice or appeal rights for the affected business. Check local rules and ensure that the reclassification process includes appropriate notification and a channel for businesses to contest the change.',
                administrativeSetup: 'Define clear classification rules and examples, not just category labels. A label like "retail" is useless without guidance on what counts as retail versus wholesale, or how a business that does both should be classified. Provide field and counter staff with decision trees or lookup tables that link observable characteristics to the correct category code. Build classification checks into the renewal workflow so that each renewal is an opportunity to verify or update the activity code.',
                goodFitWhen: [
                    'The same type of business is classified differently in different wards.',
                    'Staff rely on personal judgement rather than defined rules.',
                    'Revenue losses from misclassification are likely material.'
                ],
                lessSuitableWhen: [
                    'Classification is already well managed.',
                    'The fee schedule itself is the bigger problem.',
                    'The register does not yet contain enough businesses to make classification a priority.'
                ],
                risksAndDesignNotes: [
                    'Reclassification can feel punitive if not explained clearly. Start with the clearest mismatches and communicate changes as corrections.',
                    'Provide an appeal or review channel so businesses can contest reclassification decisions. This protects staff as much as it protects businesses.',
                    'Track reclassification outcomes to build evidence of the revenue impact. This helps justify the effort and informs future schedule reviews.',
                    'Watch for staff who reclassify businesses downward in exchange for informal payments. Supervisor review of reclassification decisions is important.'
                ]
            }
        },

        {
            solutionId: 'NP-A-LIA-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Liability Application',
            title: 'Strengthen Renewal Billing and Fee Application',
            shortTitle: 'Renewal Billing Accuracy',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Moderate',
            category: 'Billing',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Ensure that renewal bills are generated correctly, on time, and for the right amount. Weak billing at renewal is a common source of revenue loss and compliance breakdown because businesses that do not receive a bill, or receive a bill with the wrong amount or wrong timing, are far less likely to pay.',
                mostUsefulWhen: [
                    'Many businesses are not billed at renewal, either because the process is manual and incomplete or because the register does not trigger bills reliably.',
                    'Bills arrive too late for the business to act on them before the renewal deadline.',
                    'Fee amounts on bills often do not match the adopted schedule because of calculation errors, outdated data, or manual overrides.'
                ],
                usuallyNotBestFirstMove: [
                    'Billing is already reliable and the problem is collection rather than invoicing, in which case compliance solutions may be more relevant.',
                    'The register is too incomplete to support reliable billing, in which case coverage solutions should come first.'
                ],
                whatFullCardWouldPlan: 'Review the current renewal cycle to find where bills go missing or wrong, standardise the process so every active account gets a timely bill, link billing to the register so classification and activity changes are reflected, and track billed versus collected amounts by category.',
                oftenWorksBestAlongside: [
                    'NP-A-LIA-01 (Review and Simplify the Fee Schedule) since accurate billing requires a clear and current schedule.',
                    'NP-A-LIA-02 (Improve Activity Classification) so that the classification feeding into the bill is correct.',
                    'NP-A-COM-01 (Structured Renewal Reminders) since the billing process should trigger the reminder sequence.'
                ],
                politicalNote: 'Improving billing accuracy is usually one of the less politically sensitive reforms because it is about administrative competence rather than policy change. However, if improved billing means that many businesses receive higher or unexpected bills for the first time, the municipality should prepare for pushback and have a clear explanation of why the bill changed.'
            },
            fullDetails: {
                overview: 'This solution focuses on the mechanics of getting the right bill to the right business at the right time for the right amount. It sounds simple but in many municipalities the renewal billing process is fragmented, manual, and error-prone: some accounts are missed entirely, some bills are calculated using outdated classifications or rates, and some arrive so late that the business has no reasonable opportunity to pay before the deadline. Fixing the billing pipeline is often the single highest-return administrative improvement a municipality can make in its licensing revenue, because it converts existing liability into actual demands for payment.',
                implementationPath: [
                    'Review the current renewal cycle and identify where bills are late, missing, or calculated incorrectly. Map the process from register data through bill generation to delivery and look for the specific points where errors or delays are introduced.',
                    'Standardise the renewal billing process so every active account receives a bill before the renewal date. Define the billing calendar, the data inputs, the calculation rules, and the delivery method for each account category.',
                    'Link renewal billing to the register so changes in activity, location, or classification are reflected in the next bill. If the register says a business changed from retail to wholesale, the next renewal bill should reflect the correct fee for the new classification.',
                    'Track billed versus collected amounts by category so management can see where the billing process still needs correction. This tracking also provides the baseline for measuring compliance improvements.'
                ],
                legalInstitutionalEnablers: 'Confirm the legal basis for the renewal fee and the required notice period. Some jurisdictions require that the bill be delivered a minimum number of days before the due date for it to be legally enforceable. Ensure the billing process meets any procedural requirements for content, format, and delivery method.',
                administrativeSetup: 'Automate or systematise bill generation where possible, even if automation means a well-structured spreadsheet formula rather than a full billing system. Train billing staff on the schedule, exemptions, and common error points. Establish a quality check on a sample of bills before each batch is sent. Create a reconciliation step that compares the number of active accounts in the register with the number of bills generated to catch gaps.',
                goodFitWhen: [
                    'Many businesses are not billed at renewal.',
                    'Bills arrive too late for the business to act on them.',
                    'Fee amounts on bills often do not match the adopted schedule.'
                ],
                lessSuitableWhen: [
                    'Billing is already reliable and the problem is collection rather than invoicing.',
                    'The register is too incomplete to support reliable billing.',
                    'The fee schedule itself is too unclear to generate correct bills, in which case NP-A-LIA-01 should come first.'
                ],
                risksAndDesignNotes: [
                    'Sending incorrect bills can damage trust faster than sending no bills at all. Check accuracy before scaling.',
                    'If improved billing produces a sudden increase in demand notices, prepare the counter and payment teams for higher volumes.',
                    'Track the reasons for billing errors, not just the error count. This helps target training and process fixes at the right points.',
                    'Consider sending a preview or test batch to a small group of businesses before rolling out to the full register, especially if the billing process has changed significantly.'
                ]
            }
        },

        // =============================================
        // COMPLIANCE CARDS (3)
        // =============================================

        {
            solutionId: 'NP-A-COM-01',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Structured Renewal Reminders and Follow-Up',
            shortTitle: 'Renewal Reminders',
            timeline: '< 1 year',
            deliveryDifficulty: 'Low to Moderate',
            politicalSensitivity: 'Usually higher',
            category: 'Communication',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Send short, timely reminders before and after the renewal due date so willing businesses do not lapse by habit or oversight. This is usually one of the cheapest and fastest compliance gains available because it targets the large group of businesses that intend to pay but need a nudge at the right moment.',
                mostUsefulWhen: [
                    'Many businesses are willing but late, suggesting that the problem is inattention or forgetfulness rather than refusal.',
                    'Phone or digital contact data exist for a reasonable share of licensees.',
                    'Management wants a low-cost compliance lift that can be implemented within weeks or months.'
                ],
                usuallyNotBestFirstMove: [
                    'Contact data are too thin to make reminders meaningful, with most businesses unreachable through available channels.',
                    'The city cannot suppress reminders once businesses renew, which will annoy compliant businesses and undermine trust.'
                ],
                whatFullCardWouldPlan: 'Design a reminder calendar with pre-deadline and post-deadline messages, choose the most effective channels, set stop rules so messages cease on payment, and link reminders to the register so only relevant accounts receive messages.',
                oftenWorksBestAlongside: [
                    'NP-A-COM-02 (Accessible Payment Channels) so that a business that receives a reminder can act on it immediately.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) since reminders are most effective when the underlying bill is correct.',
                    'NP-A-COM-03 (Graduated Enforcement) so that reminders are the first step in a credible compliance escalation.'
                ],
                politicalNote: 'Reminder systems are generally popular and low-risk politically. The sensitivity arises if reminders reach the wrong people, continue after payment, or are perceived as harassment. Invest in stop rules and data accuracy to avoid these problems. Businesses that receive a courteous, timely reminder are more likely to view the municipality as competent and fair.'
            },
            fullDetails: {
                overview: 'This solution implements a structured communication sequence around the licence renewal date to convert willing-but-late businesses into on-time payers. Research and practice consistently show that timely, personalised reminders are one of the most cost-effective compliance interventions available. The approach does not require new legal authority, major systems investment, or enforcement capacity. It requires accurate contact data, a disciplined calendar, clear messages, and reliable stop rules so that businesses are reminded when they need to be and left alone once they comply.',
                implementationPath: [
                    'Design a simple reminder calendar with at least one pre-deadline message (for example, 30 days before renewal) and one post-deadline message (for example, 7 days after the due date). Keep the sequence short and purposeful.',
                    'Choose the most effective channels based on what businesses actually use: SMS, WhatsApp, printed notice, email, or a combination. SMS is often the most reliable for broad reach; email works well for larger or more formal businesses.',
                    'Set a stop rule so messages cease once the business renews or enters an approved payment arrangement. This is critical. Businesses that pay and then receive another reminder will lose confidence in the system.',
                    'Link reminders to the register so only active, unbilled, or overdue accounts receive messages. This prevents wasted messages and avoids sending reminders to closed, dormant, or exempt accounts.'
                ],
                legalInstitutionalEnablers: 'Confirm that the city is authorised to use the chosen messaging channels for revenue administration and that privacy obligations are met. In most jurisdictions, sending a renewal reminder about an existing obligation does not require special legal authority, but the municipality should check whether there are restrictions on bulk SMS, data use, or commercial messaging platforms.',
                administrativeSetup: 'Someone must own the calendar and sending process, whether that is a billing officer, an IT unit, or an outsourced messaging provider. Help-desk and counter staff need the same scripts and dates that appear in the reminders so they can answer questions consistently. The contact database needs regular cleaning: remove invalid numbers, update changed contacts, and flag accounts with no reachable contact. Track message delivery rates and response rates to refine the approach over time.',
                goodFitWhen: [
                    'Many businesses are willing but late.',
                    'Phone or digital contact data exist for a reasonable share of licensees.',
                    'Management wants a low-cost compliance lift.'
                ],
                lessSuitableWhen: [
                    'Contact data are too thin to make reminders meaningful.',
                    'The city cannot suppress reminders once businesses renew.',
                    'The main compliance problem is refusal rather than forgetfulness.'
                ],
                risksAndDesignNotes: [
                    'Poor stop rules undermine trust quickly. A business that pays and then receives a late-payment reminder will lose confidence in the system.',
                    'Too many messages can feel like harassment. Keep the sequence short and the tone respectful.',
                    'Test messages on a small group before sending to the full register. Check for formatting errors, wrong amounts, and delivery failures.',
                    'Track which reminder in the sequence produces the most renewals. This helps optimise timing and reduce unnecessary messages.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COM-02',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Accessible Payment and Renewal Channels',
            shortTitle: 'Expanded Payment Channels',
            timeline: '< 1 year',
            deliveryDifficulty: 'Moderate',
            politicalSensitivity: 'Usually higher',
            category: 'Payments',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Make it easier for businesses to renew and pay by expanding beyond city headquarters to bank agents, mobile money, online channels, or ward counters. Reducing the physical and time cost of payment is one of the most direct ways to improve compliance because many businesses are willing to pay but find the process too inconvenient.',
                mostUsefulWhen: [
                    'Distance, queues, or office hours make renewal harder than it should be, especially for businesses outside the central business district.',
                    'Businesses already use banks, mobile money, or local agents for other payments and would use the same channels for licence fees if available.',
                    'The municipality has a functioning billing system that can generate unique payment references for each account.'
                ],
                usuallyNotBestFirstMove: [
                    'Connectivity is extremely weak and no trusted local payment network exists.',
                    'The city cannot reconcile payments across channels, meaning that money collected through new channels would be difficult to match to accounts.'
                ],
                whatFullCardWouldPlan: 'Map dominant payment habits, select partner channels, standardise the payment reference, launch with clear public instructions, and monitor queue reductions, failed transactions, and unmatched payments.',
                oftenWorksBestAlongside: [
                    'NP-A-COM-01 (Structured Renewal Reminders) so that reminders include instructions on how to use the new channels.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) since bills need to carry the correct payment reference for each channel.',
                    'NP-A-COV-04 (Digital Licence Register) because digital channels work best when linked to a register that can confirm and receipt payments automatically.'
                ],
                politicalNote: 'Expanding payment channels is generally popular with both businesses and political leaders because it visibly improves service. The risk is adding channels that the municipality cannot reconcile, which creates leakage and accountability gaps. Start with one or two well-tested channels and expand as reconciliation capacity improves.'
            },
            fullDetails: {
                overview: 'This solution reduces compliance friction by bringing payment closer to where businesses operate and how they already handle money. In many municipalities, the single biggest practical barrier to licence renewal is the payment process itself: a business owner must travel to a central office during working hours, queue, and pay in a specific way. Expanding payment channels to include mobile money, bank agents, online platforms, or decentralised ward counters removes this barrier and makes it possible for a business to renew its licence in minutes rather than losing half a working day.',
                implementationPath: [
                    'Map the dominant payment habits of licensed businesses and select the first partner institutions or local channels. Prioritise channels that businesses already trust and use for other transactions.',
                    'Standardise the payment reference so money can be traced back to the right account regardless of which channel is used. Every payment must carry a unique identifier that links to the business record in the register.',
                    'Launch channels with clear public instructions and test how quickly payments can be posted and receipted. The gap between payment and receipt confirmation is critical: businesses need to know their payment was received.',
                    'Monitor queue reductions at the central office, failed or rejected transactions, and unmatched payments that cannot be linked to an account. Use this data to refine channel selection and reconciliation processes.'
                ],
                legalInstitutionalEnablers: 'Confirm that local law allows revenue collection through third parties or digital payment providers. This usually requires a formal agreement with each provider that specifies settlement terms, fees, reporting requirements, and liability for errors. The municipality should also confirm that electronic receipts issued through partner channels are legally valid for the purpose of demonstrating compliance.',
                administrativeSetup: 'Back-office reconciliation is critical. Additional channels are only an advantage if staff can post and verify payments quickly. Define a daily reconciliation process for each channel, assign responsibility for matching payments to accounts, and establish escalation procedures for unmatched or disputed payments. Train counter staff on the new channels so they can answer questions and troubleshoot problems. Publish clear instructions at registration points, on bills, and through whatever communication channels the municipality uses.',
                goodFitWhen: [
                    'Distance, queues, or office hours make renewal harder than it should be.',
                    'Businesses already use banks, mobile money, or local agents for other payments.',
                    'The municipality has a functioning billing system that can generate unique payment references.'
                ],
                lessSuitableWhen: [
                    'Connectivity is extremely weak and no trusted local payment network exists.',
                    'The city cannot reconcile across channels.',
                    'The main barrier to compliance is not payment convenience but disagreement over the amount owed.'
                ],
                risksAndDesignNotes: [
                    'Adding too many channels too quickly can increase unmatched payments and create reconciliation backlogs.',
                    'Negotiate clear settlement terms with payment partners. Delayed settlement means the municipality is effectively lending money to the provider.',
                    'Monitor each channel\'s error rate and transaction cost. Shut down channels that generate more problems than they solve.',
                    'Ensure that all channels issue a receipt or confirmation that the business can use as proof of payment. Businesses will not trust a channel that takes their money without immediate confirmation.'
                ]
            }
        },

        {
            solutionId: 'NP-A-COM-03',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'A',
            gap: 'Compliance',
            title: 'Graduated Enforcement for Non-Renewal',
            shortTitle: 'Graduated Enforcement',
            timeline: '< 1 year to 1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Moderate to High',
            category: 'Enforcement',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use a clear, staged enforcement ladder from reminders to formal notices, penalties, and ultimately suspension or closure for businesses that persistently refuse to renew or pay. Graduated enforcement provides both the deterrent and the follow-through that make the rest of the compliance system credible.',
                mostUsefulWhen: [
                    'Businesses have learned that non-renewal carries little consequence, so voluntary compliance has eroded.',
                    'The legal framework already allows penalties and licence suspension but practice is inconsistent or non-existent.',
                    'Management wants to reinforce the renewal system with credible consequences after softer measures such as reminders and accessible payment have been tried.'
                ],
                usuallyNotBestFirstMove: [
                    'The city cannot yet issue reliable bills or deliver notices to the correct addresses, meaning enforcement would be built on a shaky foundation.',
                    'Enforcement is politically blocked by powerful interests or by a political leadership that is not willing to support action against non-compliant businesses.'
                ],
                whatFullCardWouldPlan: 'Define a short notice ladder with realistic timelines and consequences at each stage, apply penalties consistently with documentation, use selective visible enforcement on clear cases to demonstrate credibility, and coordinate with inspection, legal, and communications teams.',
                oftenWorksBestAlongside: [
                    'NP-A-COM-01 (Structured Renewal Reminders) since reminders should be the first step before enforcement escalates.',
                    'NP-A-COM-02 (Accessible Payment Channels) so that businesses facing enforcement have a convenient way to come into compliance.',
                    'NP-A-LIA-03 (Strengthen Renewal Billing) because enforcement is only defensible when the underlying bill is correct.'
                ],
                politicalNote: 'Enforcement is the most politically sensitive compliance tool. Poorly supervised enforcement can create corruption or selective targeting, where politically connected businesses are left alone while small operators are squeezed. Start with the largest and clearest cases of non-renewal, apply the process transparently, and ensure that the enforcement ladder includes genuine opportunities for the business to comply before the most severe consequences are applied.'
            },
            fullDetails: {
                overview: 'This solution establishes a formal, documented enforcement pathway for businesses that fail to renew their licences after reminders and billing have been exhausted. Without credible enforcement, the entire licensing system rests on voluntary compliance, which decays over time as businesses observe that non-renewal carries no real consequences. Graduated enforcement provides a structured escalation from administrative reminders through formal legal notices, financial penalties, and ultimately licence suspension or business closure orders. The key design principle is proportionality: each step is more serious than the last, and each step gives the business a clear opportunity to comply before the next escalation.',
                implementationPath: [
                    'Define a short notice ladder with realistic timelines and clear consequences at each stage. For example: Day 1 after deadline, friendly reminder; Day 30, formal notice with penalty warning; Day 60, penalty applied and suspension warning; Day 90, licence suspended or closure proceedings initiated.',
                    'Apply penalties consistently and document each step for defensibility. Every notice, penalty, and enforcement action should be logged in the business account record so the municipality can demonstrate that it followed due process if the action is challenged.',
                    'Use selective, visible enforcement on clear non-renewal cases to demonstrate credibility. Choose cases that are large enough to be noticed, clear enough to be defensible, and diverse enough to show that enforcement is not targeting one group or area.',
                    'Coordinate with inspection, legal, and communications teams to ensure follow-through. Enforcement fails if inspectors identify violations but legal staff do not act, or if penalties are imposed but not collected. Each function in the chain needs to understand its role and timeline.'
                ],
                legalInstitutionalEnablers: 'Confirm the legal basis for penalties, licence suspension, and closure for non-renewal. Ensure due process requirements are met at each stage, including adequate notice, opportunity to respond, and access to an appeal or review mechanism. Some jurisdictions require that enforcement actions be authorised by a specific official or committee. Map these requirements before designing the enforcement ladder.',
                administrativeSetup: 'Track enforcement actions in the register so each business account shows where it stands in the enforcement ladder. Train staff on scripts and documentation requirements for each stage. Define clear authority for who can escalate from one stage to the next, and ensure that escalation decisions are reviewed by a supervisor. Create reporting that shows management how many accounts are at each stage and how quickly cases move through the ladder.',
                goodFitWhen: [
                    'Businesses have learned that non-renewal carries little consequence.',
                    'The legal framework already allows penalties but practice is inconsistent.',
                    'Management wants to reinforce the renewal system.'
                ],
                lessSuitableWhen: [
                    'The city cannot yet issue reliable bills or deliver notices.',
                    'Enforcement is politically blocked.',
                    'The municipality has not yet tried softer compliance measures such as reminders and improved payment channels.'
                ],
                risksAndDesignNotes: [
                    'Poorly supervised enforcement can create corruption or selective targeting. Start with the largest and clearest cases.',
                    'Ensure that the enforcement ladder includes genuine opportunities for the business to comply at every stage before the next escalation.',
                    'Do not launch enforcement without adequate legal review. An enforcement action that is overturned on appeal damages credibility more than no enforcement at all.',
                    'Track enforcement outcomes including the share of cases that result in payment versus closure versus appeal. This data is essential for refining the process and demonstrating its fairness.'
                ]
            }
        }
    ];

})(window);
