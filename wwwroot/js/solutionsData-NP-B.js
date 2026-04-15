/**
 * ROSRA Solutions Data - Non-Property Subgroup B
 * Service fees and billed use charges
 * 14 cards organized by gap: Coverage (4), Liability (4), Compliance (6)
 */
(function(window) {
    'use strict';

    window.SolutionsDataNP_B = [

        // =============================================
        // COVERAGE CARDS (B1, B2, B3, B12)
        // =============================================

        {
            solutionId: 'B1',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Customer Census and Account Clean-Up',
            shortTitle: 'Customer Census',
            timeline: 'Less than a year to launch; 1-3 years to deepen',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Run a focused exercise to identify actual users and service points, reconcile them with the billing register, and fix obvious errors such as duplicate accounts, inactive users billed by mistake, or active users missing altogether. This is often the fastest way to improve fee coverage under current rules because it starts from the service relationship the city already manages.',
                mostUsefulWhen: [
                    'Many households or firms use the service but do not receive bills.',
                    'The current customer list is patchy, old, or split across several offices.',
                    'Informal growth has outpaced the service register.'
                ],
                usuallyNotBestFirstMove: [
                    'There is no practical definition yet of who counts as a user or service point under the current system.',
                    'The administration cannot act on census results after the enumeration.'
                ],
                politicalNote: 'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later. Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.',
                oftenWorksBestAlongside: [
                    'B2 (Link Accounts to Service Points, Maps, and Meter or Proxy Data) so that new accounts are anchored to physical service points.',
                    'B3 (Trigger New Accounts from Connections, Occupancy, or Service Activation) so that coverage gains are maintained automatically.',
                    'B12 (Change-of-User and Change-of-Occupancy Workflow) so that accounts stay current after the initial clean-up.'
                ]
            },
            fullDetails: {
                overview: 'Run a focused exercise to identify actual users and service points, reconcile them with the billing register, and fix obvious errors such as duplicate accounts, inactive users billed by mistake, or active users missing altogether. This is often the fastest way to improve fee coverage under current rules because it starts from the service relationship the city already manages.',
                implementationPath: [
                    'Combine existing customer files, service ledgers, meter books, paper lists, and route sheets into one working list before any field exercise starts.',
                    'Run a targeted census or account clean-up in phases, beginning with the highest-value zones, rapidly growing areas, or service areas with obvious discrepancies.',
                    'Create or confirm one account per service point or customer relationship, and record the basic facts needed for billing and follow-up.',
                    'Use the results to open missing accounts, close dead accounts, and plan a regular maintenance cycle rather than treating the census as a one-off.'
                ],
                legalInstitutionalEnablers: 'The city should have authority to collect and update user information for billing and service-administration purposes.',
                administrativeSetup: 'Use a short census form, route or zone sheets, and a reconciliation team that can decide quickly whether to add, merge, suspend, or correct each account found in the field.',
                goodFitWhen: [
                    'Many households or firms use the service but do not receive bills.',
                    'The current customer list is patchy, old, or split across several offices.',
                    'Informal growth has outpaced the service register.'
                ],
                lessSuitableWhen: [
                    'There is no practical definition yet of who counts as a user or service point under the current system.',
                    'The administration cannot act on census results after the enumeration.'
                ],
                risksAndDesignNotes: [
                    'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later.',
                    'Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.'
                ]
            }
        },

        {
            solutionId: 'B2',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Link Accounts to Service Points, Maps, and Meter or Proxy Data',
            shortTitle: 'Service Point Mapping',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Registration',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Connect each billing account to the physical service point, asset, or meter, and make that link visible on a map or service register. When the city can see exactly which standpipe, waste route, sewer connection, parking permit space, or facility belongs to which account, it becomes much harder for active users to remain invisible. This also improves day-to-day coordination between operations and revenue teams.',
                mostUsefulWhen: [
                    'Operations teams and revenue teams rely on different lists.',
                    'Field staff know locations but the billing system does not.',
                    'A weak link between account and service point is driving disputes or leakage.'
                ],
                usuallyNotBestFirstMove: [
                    'Service points are highly mobile or shared in a way that makes individual account linking impractical under the current model.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                politicalNote: 'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later. Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.',
                oftenWorksBestAlongside: [
                    'B1 (Customer Census and Account Clean-Up) to ensure accounts exist before linking them to service points.',
                    'B3 (Trigger New Accounts from Connections, Occupancy, or Service Activation) so that new service points automatically create linked accounts.',
                    'B13 (Meter Reading Discipline and Exception Review) where metered services are involved.'
                ]
            },
            fullDetails: {
                overview: 'Connect each billing account to the physical service point, asset, or meter, and make that link visible on a map or service register. When the city can see exactly which standpipe, waste route, sewer connection, parking permit space, or facility belongs to which account, it becomes much harder for active users to remain invisible. This also improves day-to-day coordination between operations and revenue teams.',
                implementationPath: [
                    'Map service points and accounts together, using parcel references, GPS points, meter numbers, route books, or proxy identifiers that staff can maintain.',
                    'Resolve the most damaging mismatches first, especially where one account covers several service points or several accounts cover one service point.',
                    'Decide what the authoritative link will be in each service, for example meter number, standpipe code, stall number, or parcel ID.',
                    'Use the linked database to improve billing, customer follow-up, and future account maintenance whenever the service point changes.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to link operational service data to billing data under normal privacy protections.',
                administrativeSetup: 'Create unique service point IDs, map them if possible, and reconcile regularly between engineering or operations units and the revenue team.',
                goodFitWhen: [
                    'Operations teams and revenue teams rely on different lists.',
                    'Field staff know locations but the billing system does not.',
                    'A weak link between account and service point is driving disputes or leakage.'
                ],
                lessSuitableWhen: [
                    'Service points are highly mobile or shared in a way that makes individual account linking impractical under the current model.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                risksAndDesignNotes: [
                    'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later.',
                    'Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.'
                ]
            }
        },

        {
            solutionId: 'B3',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Trigger New Accounts from Connections, Occupancy, or Service Activation',
            shortTitle: 'Account Triggers',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Make new accounts automatic wherever a clear trigger exists. When a user connects to a service, takes over a municipal stall, receives waste collection, begins using a slaughter facility, or activates another service point, that event should immediately create or update the billing account. This turns service growth into revenue without waiting for special clean-up drives.',
                mostUsefulWhen: [
                    'Service activation already happens through a formal step somewhere in the municipality.',
                    'New users are often missed because there is a slow or informal handover to billing.',
                    'Coverage gains from past campaigns fade quickly because new accounts are not created automatically.'
                ],
                usuallyNotBestFirstMove: [
                    'Service uptake happens almost entirely informally with no identifiable trigger or no office able to validate it.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                politicalNote: 'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later. Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.',
                oftenWorksBestAlongside: [
                    'B1 (Customer Census and Account Clean-Up) to ensure the baseline register is clean before triggers maintain it.',
                    'B12 (Change-of-User and Change-of-Occupancy Workflow) to handle changes in the user associated with a service point.',
                    'B4 (Tariff Application Clean-Up and Decision Rules) so that new accounts are assigned the correct tariff from the start.'
                ]
            },
            fullDetails: {
                overview: 'Make new accounts automatic wherever a clear trigger exists. When a user connects to a service, takes over a municipal stall, receives waste collection, begins using a slaughter facility, or activates another service point, that event should immediately create or update the billing account. This turns service growth into revenue without waiting for special clean-up drives.',
                implementationPath: [
                    'Identify which operational events should automatically trigger account creation, such as a new connection, first occupancy, reactivation, or service start.',
                    'Embed a short revenue step into that operational workflow so the account is created before the service is fully live.',
                    'Assign responsibility clearly so neither the service department nor the revenue department assumes the other side has opened the account.',
                    'Review trigger failures monthly and fix the workflow where new service points are still appearing without a billable account.'
                ],
                legalInstitutionalEnablers: 'The relevant office needs authority to pass the necessary user details to the billing authority, usually through a standing instruction or simple interdepartmental agreement.',
                administrativeSetup: 'Define the trigger list, use a short handover form or digital feed, and review monthly exceptions so the city can see where the trigger is not working.',
                goodFitWhen: [
                    'Service activation already happens through a formal step somewhere in the municipality.',
                    'New users are often missed because there is a slow or informal handover to billing.',
                    'Coverage gains from past campaigns fade quickly because new accounts are not created automatically.'
                ],
                lessSuitableWhen: [
                    'Service uptake happens almost entirely informally with no identifiable trigger or no office able to validate it.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                risksAndDesignNotes: [
                    'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later.',
                    'Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.'
                ]
            }
        },

        {
            solutionId: 'B12',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Coverage',
            title: 'Change-of-User and Change-of-Occupancy Workflow',
            shortTitle: 'Change-of-User Workflow',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Create a fast way to update the account when a user moves, a tenant changes, a stall changes hands, or a service point is subdivided or merged. Many coverage and arrears problems begin when the account no longer matches the current user. Fast change management protects both revenue and user trust.',
                mostUsefulWhen: [
                    'Arrears are often disputed because they relate to a previous user.',
                    'Properties, stalls, or service points change hands often.',
                    'Many users say the bill is not in the name of the person actually responsible.'
                ],
                usuallyNotBestFirstMove: [
                    'There is no practical way to verify who the current user is.',
                    'The service point itself is not clearly defined in the register.'
                ],
                politicalNote: 'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later. Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.',
                oftenWorksBestAlongside: [
                    'B1 (Customer Census and Account Clean-Up) to ensure accounts are clean before managing changes.',
                    'B2 (Link Accounts to Service Points, Maps, and Meter or Proxy Data) so that changes can be anchored to physical service points.',
                    'B9 (Reminder Calendar and Structured Arrears Follow-Up) to manage arrears during handover periods.'
                ]
            },
            fullDetails: {
                overview: 'Create a fast way to update the account when a user moves, a tenant changes, a stall changes hands, or a service point is subdivided or merged. Many coverage and arrears problems begin when the account no longer matches the current user. Fast change management protects both revenue and user trust.',
                implementationPath: [
                    'Create a simple change-of-user or change-of-occupancy form that can be submitted at service offices, municipal counters, or through a basic digital channel.',
                    'Decide what proof is sufficient to transfer or update the account and how outstanding balances are treated when a user changes.',
                    'Make sure the old account is closed or suspended correctly and that the new account starts with the right tariff and service basis.',
                    'Track the time between occupancy change and account update so the city can see where revenue is being lost during handover periods.'
                ],
                legalInstitutionalEnablers: 'The city needs authority to amend customer records on proof of occupancy, control, or service responsibility.',
                administrativeSetup: 'Use a short change form, a simple document checklist, a clear service standard for updates, and a full audit trail of every account change.',
                goodFitWhen: [
                    'Arrears are often disputed because they relate to a previous user.',
                    'Properties, stalls, or service points change hands often.',
                    'Many users say the bill is not in the name of the person actually responsible.'
                ],
                lessSuitableWhen: [
                    'There is no practical way to verify who the current user is.',
                    'The service point itself is not clearly defined in the register.'
                ],
                risksAndDesignNotes: [
                    'Do not create accounts that cannot be matched to a real service point, user, or occupancy event. Weak account creation can produce a second round of billing disputes later.',
                    'Where households are vulnerable, explain that better coverage is about fair billing and service continuity as much as it is about revenue.'
                ]
            }
        },

        // =============================================
        // LIABILITY CARDS (B4, B5, B6, B13)
        // =============================================

        {
            solutionId: 'B4',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability',
            title: 'Tariff Application Clean-Up and Decision Rules',
            shortTitle: 'Tariff Decision Rules',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Classification',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Produce a practical guide showing exactly which tariff applies to which user type, property type, service level, or activity. Many user-fee systems lose money because staff apply the wrong rule to mixed-use premises, commercial users, shared services, or special categories. A short decision guide can sharply reduce routine underbilling without changing the tariff itself.',
                mostUsefulWhen: [
                    'The same kinds of users are billed differently across wards or counters.',
                    'Frontline staff depend on informal judgment rather than clear written rules.',
                    'Billing disputes are common because users do not understand why one tariff was applied instead of another.'
                ],
                usuallyNotBestFirstMove: [
                    'The tariff schedule itself is so contradictory or outdated that it cannot be made workable without a formal revision.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                politicalNote: 'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language. Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.',
                oftenWorksBestAlongside: [
                    'B5 (Better Measurement of Use or Service Basis) so that tariff rules are applied against accurate usage data.',
                    'B6 (Standard Treatment of Exemptions, Lifeline Rules, and Special Cases) to handle the edge cases that decision rules alone cannot resolve.',
                    'B7 (Regular, Understandable Billing) so that corrected tariffs flow into clear bills.'
                ]
            },
            fullDetails: {
                overview: 'Produce a practical guide showing exactly which tariff applies to which user type, property type, service level, or activity. Many user-fee systems lose money because staff apply the wrong rule to mixed-use premises, commercial users, shared services, or special categories. A short decision guide can sharply reduce routine underbilling without changing the tariff itself.',
                implementationPath: [
                    'Review the tariff schedule and the most common charging situations to identify where staff are making inconsistent or ad hoc decisions.',
                    'Translate the formal tariff into a short operational guide that explains how to treat the most common categories, edge cases, and combinations of services.',
                    'Audit a sample of current accounts, correct the clearest misapplications, and document the reason for each change.',
                    'Use the first correction cycle to refine the guidance and identify where the schedule itself may later need policy reform.'
                ],
                legalInstitutionalEnablers: 'The city needs authority to issue administrative guidance under the existing tariff schedule. That is usually possible even when the formal tariff is fixed by law.',
                administrativeSetup: 'Prepare short decision notes with worked examples, train staff, and require supervisor review for ambiguous or high-value cases.',
                goodFitWhen: [
                    'The same kinds of users are billed differently across wards or counters.',
                    'Frontline staff depend on informal judgment rather than clear written rules.',
                    'Billing disputes are common because users do not understand why one tariff was applied instead of another.'
                ],
                lessSuitableWhen: [
                    'The tariff schedule itself is so contradictory or outdated that it cannot be made workable without a formal revision.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                risksAndDesignNotes: [
                    'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language.',
                    'Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.'
                ]
            }
        },

        {
            solutionId: 'B5',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability',
            title: 'Better Measurement of Use or Service Basis',
            shortTitle: 'Usage Measurement',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Rates',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Improve how the city measures the basis on which the fee is charged. Depending on the service, that may mean functioning meters, better meter reading, occupancy counts, bin counts, frontage measures, trip counts, or another practical proxy. Where the usage basis is weak, even a good tariff schedule will produce weak bills.',
                mostUsefulWhen: [
                    'Bills are based on rough guesswork rather than a consistent usage basis.',
                    'Actual service use varies widely across users but the billing system does not capture that difference.',
                    'There is strong public perception that charges are arbitrary.'
                ],
                usuallyNotBestFirstMove: [
                    'Measurement technology would cost more than the stream is likely to return.',
                    'Shared or intermittent service makes individual measurement impractical and no sensible proxy is available.'
                ],
                politicalNote: 'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language. Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.',
                oftenWorksBestAlongside: [
                    'B4 (Tariff Application Clean-Up and Decision Rules) so that better measurements feed into correctly applied tariffs.',
                    'B13 (Meter Reading Discipline and Exception Review) to maintain the quality of readings over time.',
                    'B7 (Regular, Understandable Billing) so that improved measurement translates into clearer bills.'
                ]
            },
            fullDetails: {
                overview: 'Improve how the city measures the basis on which the fee is charged. Depending on the service, that may mean functioning meters, better meter reading, occupancy counts, bin counts, frontage measures, trip counts, or another practical proxy. Where the usage basis is weak, even a good tariff schedule will produce weak bills.',
                implementationPath: [
                    'Identify where current charging relies on weak assumptions and decide whether better measurement should come from meters, route verification, occupancy counts, or another realistic proxy.',
                    'Pilot improved measurement in a manageable area before scaling, so the city can test whether the extra accuracy is worth the operating cost.',
                    'Define how readings or proxy measurements will be recorded, checked, and transferred into billing without creating new delays.',
                    'Review the results after one or two cycles and adjust the measurement approach before the city invests more widely.'
                ],
                legalInstitutionalEnablers: 'The municipality should have authority to inspect, record, and use the relevant measurement basis for billing.',
                administrativeSetup: 'Define a clear measurement protocol, equip field staff with simple tools, verify readings or proxies routinely, and document what happens when measurements fail or proxies are temporarily used.',
                goodFitWhen: [
                    'Bills are based on rough guesswork rather than a consistent usage basis.',
                    'Actual service use varies widely across users but the billing system does not capture that difference.',
                    'There is strong public perception that charges are arbitrary.'
                ],
                lessSuitableWhen: [
                    'Measurement technology would cost more than the stream is likely to return.',
                    'Shared or intermittent service makes individual measurement impractical and no sensible proxy is available.'
                ],
                risksAndDesignNotes: [
                    'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language.',
                    'Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.'
                ]
            }
        },

        {
            solutionId: 'B6',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability',
            title: 'Standard Treatment of Exemptions, Lifeline Rules, and Special Cases',
            shortTitle: 'Exemption Standards',
            timeline: 'Less than a year',
            politicalFeasibility: 'More sensitive',
            category: 'Classification',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Clarify who qualifies for lifeline tariffs, subsidies, exemptions, or other special treatment, and make sure those decisions are recorded properly. In many fee systems, the problem is not only low tariffs but uncontrolled exceptions that spread far beyond the intended group. Tightening the treatment of special cases can improve both fairness and revenue.',
                mostUsefulWhen: [
                    'Large numbers of accounts carry special flags but staff cannot explain the basis clearly.',
                    'Political or administrative discretion has widened relief well beyond the intended group.',
                    'There is frustration among regular payers that better-off users are receiving informal relief.'
                ],
                usuallyNotBestFirstMove: [
                    'Local politics treats discretionary fee relief as routine patronage and the leadership is not ready to tighten it.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                politicalNote: 'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language. Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion. The city should protect genuine low-income and vulnerable users while tightening uncontrolled relief for better-off users.',
                oftenWorksBestAlongside: [
                    'B4 (Tariff Application Clean-Up and Decision Rules) so that the main tariff is applied correctly before exceptions are tightened.',
                    'B7 (Regular, Understandable Billing) so that exemption changes are reflected clearly in bills.',
                    'B11 (Service-Linked Enforcement and Payment Arrangements) to ensure that vulnerable users are protected during enforcement.'
                ]
            },
            fullDetails: {
                overview: 'Clarify who qualifies for lifeline tariffs, subsidies, exemptions, or other special treatment, and make sure those decisions are recorded properly. In many fee systems, the problem is not only low tariffs but uncontrolled exceptions that spread far beyond the intended group. Tightening the treatment of special cases can improve both fairness and revenue.',
                implementationPath: [
                    'List all formal exemptions, lifeline rules, reduced tariffs, and special cases currently applied to the stream and decide what evidence is needed for each.',
                    'Create a single approval and review process so frontline staff are not informally deciding who receives relief.',
                    'Record every exempt or reduced account in a dedicated register linked to the customer account and note when it must be reviewed again.',
                    'Run periodic review of special cases so temporary relief does not silently become permanent underbilling.'
                ],
                legalInstitutionalEnablers: 'Every relief rule should have a written basis. Where existing rules are broad, the city can often still issue administrative guidance on evidence requirements and approval authority.',
                administrativeSetup: 'Keep an exception register, require supporting documents, and review exempt or subsidised accounts periodically so management can spot drift early.',
                goodFitWhen: [
                    'Large numbers of accounts carry special flags but staff cannot explain the basis clearly.',
                    'Political or administrative discretion has widened relief well beyond the intended group.',
                    'There is frustration among regular payers that better-off users are receiving informal relief.'
                ],
                lessSuitableWhen: [
                    'Local politics treats discretionary fee relief as routine patronage and the leadership is not ready to tighten it.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                risksAndDesignNotes: [
                    'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language.',
                    'Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.',
                    'The city should protect genuine low-income and vulnerable users while tightening uncontrolled relief for better-off users.'
                ]
            }
        },

        {
            solutionId: 'B13',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Liability',
            title: 'Meter Reading Discipline and Exception Review',
            shortTitle: 'Meter Reading Discipline',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Billing',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Where user fees depend on measured consumption or usage, strengthen the routine around readings, estimates, and abnormal cases. Many systems lose revenue not because tariffs are wrong, but because meters are not read on time, estimated bills continue for too long, or suspiciously low readings are never reviewed. A simple discipline on route planning, reading evidence, and exception review can materially improve the accuracy of billed charges.',
                mostUsefulWhen: [
                    'The service uses meters or another measurable usage basis.',
                    'Estimated billing has become common or prolonged.',
                    'Unusually low or erratic billed amounts are not being investigated.'
                ],
                usuallyNotBestFirstMove: [
                    'The service is not usage-based.',
                    'The metering base is so broken that operational rehabilitation must come before billing discipline.'
                ],
                politicalNote: 'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language. Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion. Users often accept stronger measurement discipline more easily than tariff changes because it can be framed as fairer billing rather than higher charges.',
                oftenWorksBestAlongside: [
                    'B5 (Better Measurement of Use or Service Basis) to improve the underlying measurement infrastructure.',
                    'B4 (Tariff Application Clean-Up and Decision Rules) so that accurate readings are matched to the correct tariff.',
                    'B7 (Regular, Understandable Billing) so that metered bills are issued on a reliable cycle.'
                ]
            },
            fullDetails: {
                overview: 'Where user fees depend on measured consumption or usage, strengthen the routine around readings, estimates, and abnormal cases. Many systems lose revenue not because tariffs are wrong, but because meters are not read on time, estimated bills continue for too long, or suspiciously low readings are never reviewed. A simple discipline on route planning, reading evidence, and exception review can materially improve the accuracy of billed charges.',
                implementationPath: [
                    'Set a fixed reading calendar by route or zone and define what counts as a missed read, estimated read, suspicious spike, or suspicious drop.',
                    'Require readers or route supervisors to record reasons for exceptions at the point of reading rather than reconstructing them later.',
                    'Re-read a sample of exceptions quickly so the city distinguishes genuine usage change from weak reading discipline or manipulation.',
                    'Use an exception review meeting after each cycle to improve routes, staffing, device set-up, or the proxy rules used when reads are missed.'
                ],
                legalInstitutionalEnablers: 'The city or service provider needs authority to access meters or other measurement points and to apply clear temporary estimation rules where readings cannot be obtained.',
                administrativeSetup: 'Define reading schedules, minimum evidence requirements, supervisor review of estimated bills, and exception reports for zero, very low, or highly volatile readings. Where digital tools are not available, even a paper route and exception log can help.',
                goodFitWhen: [
                    'The service uses meters or another measurable usage basis.',
                    'Estimated billing has become common or prolonged.',
                    'Unusually low or erratic billed amounts are not being investigated.'
                ],
                lessSuitableWhen: [
                    'The service is not usage-based.',
                    'The metering base is so broken that operational rehabilitation must come before billing discipline.'
                ],
                risksAndDesignNotes: [
                    'Customers resist tariff clean-up when they do not understand what changed. Bills and notices should explain the charging basis in plain language.',
                    'Protect lifeline users and statutory exemptions through separate approval and review rules rather than leaving them to ad hoc frontline discretion.',
                    'Users often accept stronger measurement discipline more easily than tariff changes because it can be framed as fairer billing rather than higher charges.'
                ]
            }
        },

        // =============================================
        // COMPLIANCE CARDS (B7, B8, B14, B9, B10, B11)
        // =============================================

        {
            solutionId: 'B7',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Regular, Understandable Billing',
            shortTitle: 'Clear Billing',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Billing',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Issue bills on a regular cycle and make them easy to read. Each bill should show the service, billing period, basis of charge, arrears carried forward, and what the user should do if something looks wrong. Irregular or confusing billing is one of the fastest ways to create arrears even when users are otherwise willing to pay.',
                mostUsefulWhen: [
                    'Users complain that they do not understand the charge.',
                    'Billing intervals are inconsistent or long gaps occur between cycles.',
                    'Arrears grow after missed or delayed billing runs.'
                ],
                usuallyNotBestFirstMove: [
                    'The register is too incomplete to support regular billing.',
                    'The underlying service-basis data are still too unreliable to produce credible bills.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                oftenWorksBestAlongside: [
                    'B8 (Easy Payment Channels and Manageable Payment Plans) so that clear bills are paired with easy ways to pay.',
                    'B9 (Reminder Calendar and Structured Arrears Follow-Up) to follow up when bills are not paid on time.',
                    'B10 (Receipts, Reconciliation, and Cash Controls) to ensure payments are properly recorded.'
                ]
            },
            fullDetails: {
                overview: 'Issue bills on a regular cycle and make them easy to read. Each bill should show the service, billing period, basis of charge, arrears carried forward, and what the user should do if something looks wrong. Irregular or confusing billing is one of the fastest ways to create arrears even when users are otherwise willing to pay.',
                implementationPath: [
                    'Set a regular billing calendar and keep it predictable enough that customers know when to expect a bill and when payment is due.',
                    'Redesign the bill so it states clearly what service is being charged, the basis of the charge, the due date, arrears if any, and how to pay or dispute it.',
                    'Check that bills can be matched reliably to the right customer or service point before the cycle is released.',
                    'Monitor returned bills, complaint patterns, and late-payment spikes to improve the bill layout and delivery process over time.'
                ],
                legalInstitutionalEnablers: 'The city needs authority to issue standard bills and, where relevant, recognise digital notices.',
                administrativeSetup: 'Maintain a stable billing calendar, use clear templates, and make sure every bill carries a usable account reference and contact point for questions or corrections.',
                goodFitWhen: [
                    'Users complain that they do not understand the charge.',
                    'Billing intervals are inconsistent or long gaps occur between cycles.',
                    'Arrears grow after missed or delayed billing runs.'
                ],
                lessSuitableWhen: [
                    'The register is too incomplete to support regular billing.',
                    'The underlying service-basis data are still too unreliable to produce credible bills.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.'
                ]
            }
        },

        {
            solutionId: 'B8',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Easy Payment Channels and Manageable Payment Plans',
            shortTitle: 'Payment Channels & Plans',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Payments',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Reduce the effort it takes to pay. Use ward counters, agents, banks, mobile money, or an online portal, and allow structured payment plans where the stream and legal framework permit. For many user-fee streams, the city gains more from easy payment and steady cash flow than from forcing everyone into one large, inconvenient transaction.',
                mostUsefulWhen: [
                    'Travel time, queues, or limited office hours are discouraging payment.',
                    'Users already use digital or agent-based payments for other services.',
                    'Arrears are linked to large lump-sum bills rather than refusal to pay anything at all.'
                ],
                usuallyNotBestFirstMove: [
                    'Connectivity is too weak and no workable agent network exists.',
                    'The administration cannot track instalment plans reliably.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match. When payment plans are introduced, frame them as a compliance tool for the willing, not a reward for chronic non-payers.',
                oftenWorksBestAlongside: [
                    'B7 (Regular, Understandable Billing) so that easy payment channels are paired with clear bills.',
                    'B10 (Receipts, Reconciliation, and Cash Controls) to ensure all payment channels reconcile properly.',
                    'B9 (Reminder Calendar and Structured Arrears Follow-Up) to direct users toward available payment options.'
                ]
            },
            fullDetails: {
                overview: 'Reduce the effort it takes to pay. Use ward counters, agents, banks, mobile money, or an online portal, and allow structured payment plans where the stream and legal framework permit. For many user-fee streams, the city gains more from easy payment and steady cash flow than from forcing everyone into one large, inconvenient transaction.',
                implementationPath: [
                    'Offer payment channels that reflect how households and businesses actually transact, such as counters, agents, mobile money, bank branches, or direct debit where feasible.',
                    'Pair easier payment with clear instalment or payment-plan rules for customers who can pay but struggle with one large bill.',
                    'Ensure every partial or full payment posts correctly against the account and that receipts are immediate and easy to verify.',
                    'Review uptake by payment channel and by customer type so the city can strengthen the channels that genuinely improve compliance.'
                ],
                legalInstitutionalEnablers: 'The city needs authority to use third-party payment channels and, where relevant, accept instalment arrangements.',
                administrativeSetup: 'Every payment must link clearly to the account, reconcile back to the ledger, and generate proof of payment. Payment-plan cases need a simple register and reminder system.',
                goodFitWhen: [
                    'Travel time, queues, or limited office hours are discouraging payment.',
                    'Users already use digital or agent-based payments for other services.',
                    'Arrears are linked to large lump-sum bills rather than refusal to pay anything at all.'
                ],
                lessSuitableWhen: [
                    'Connectivity is too weak and no workable agent network exists.',
                    'The administration cannot track instalment plans reliably.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                    'When payment plans are introduced, frame them as a compliance tool for the willing, not a reward for chronic non-payers.'
                ]
            }
        },

        {
            solutionId: 'B14',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Prepaid or Advance-Payment Options for Predictable Services',
            shortTitle: 'Prepaid Options',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Payments',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'For services with regular and predictable demand, allow users to maintain credit, prepay for a period, or use prepaid instruments where appropriate. This can reduce arrears, lower collection costs, and make payment feel more manageable, especially where households or firms already budget in small increments. It also helps the city collect earlier and reduces repeated chasing of the same accounts.',
                mostUsefulWhen: [
                    'Charges recur frequently and are easy for users to understand in advance.',
                    'Users already rely on mobile money or similar small, repeated payments.',
                    'Arrears are driven less by total unaffordability than by weak payment habits and frictions.'
                ],
                usuallyNotBestFirstMove: [
                    'The service basis changes unpredictably and cannot be meaningfully prepaid.',
                    'The administration cannot yet track credits or balances reliably.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match. This tends to work best when it is introduced as an additional option, not as the only way to pay.',
                oftenWorksBestAlongside: [
                    'B8 (Easy Payment Channels and Manageable Payment Plans) so that prepaid options complement other payment methods.',
                    'B7 (Regular, Understandable Billing) so that prepaid balances are reflected clearly in account statements.',
                    'B10 (Receipts, Reconciliation, and Cash Controls) to ensure prepaid credits are tracked and reconciled properly.'
                ]
            },
            fullDetails: {
                overview: 'For services with regular and predictable demand, allow users to maintain credit, prepay for a period, or use prepaid instruments where appropriate. This can reduce arrears, lower collection costs, and make payment feel more manageable, especially where households or firms already budget in small increments. It also helps the city collect earlier and reduces repeated chasing of the same accounts.',
                implementationPath: [
                    'Identify services where usage and payment are regular enough to support a prepaid, subscription, or advance-payment model without harming access.',
                    'Design the product carefully, including what the customer buys, how balances are checked, and how unused balances or disputes are handled.',
                    'Pilot in a limited area or customer group first so the city can test customer acceptance, reconciliation, and operational reliability.',
                    'Scale only after the city is confident that the prepaid or advance model reduces arrears without creating exclusion or confusion.'
                ],
                legalInstitutionalEnablers: 'The municipality needs clear authority to receive advance payment or stored credit and to define how unused balances, refunds, or account closure will be treated.',
                administrativeSetup: 'Start with a limited pilot, define how prepayments are posted to individual accounts, and ensure every top-up or advance payment generates proof. The accounting treatment should be clear before launch.',
                goodFitWhen: [
                    'Charges recur frequently and are easy for users to understand in advance.',
                    'Users already rely on mobile money or similar small, repeated payments.',
                    'Arrears are driven less by total unaffordability than by weak payment habits and frictions.'
                ],
                lessSuitableWhen: [
                    'The service basis changes unpredictably and cannot be meaningfully prepaid.',
                    'The administration cannot yet track credits or balances reliably.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                    'This tends to work best when it is introduced as an additional option, not as the only way to pay.'
                ]
            }
        },

        {
            solutionId: 'B9',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Reminder Calendar and Structured Arrears Follow-Up',
            shortTitle: 'Reminders & Arrears',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Billing',
            sortOrder: 12,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Add a simple reminder sequence before and after the due date and pair it with a clear arrears workflow so accounts do not sit untouched for months. This matters particularly for service-charge streams because arrears can build quietly while the service continues. A light but regular follow-up rhythm is often far more effective than occasional heavy enforcement drives.',
                mostUsefulWhen: [
                    'Many users pay only after repeated personal contact.',
                    'Due dates are not salient and missed payments become old before anyone acts.',
                    'The city has billing data but no structured way to work the overdue list.'
                ],
                usuallyNotBestFirstMove: [
                    'Contact information is largely missing and cannot be improved quickly.',
                    'The city lacks even a small team to own arrears follow-up.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                oftenWorksBestAlongside: [
                    'B7 (Regular, Understandable Billing) so that reminders follow a reliable billing cycle.',
                    'B8 (Easy Payment Channels and Manageable Payment Plans) so that reminded users can pay easily.',
                    'B11 (Service-Linked Enforcement and Payment Arrangements) as the next step when reminders alone do not work.'
                ]
            },
            fullDetails: {
                overview: 'Add a simple reminder sequence before and after the due date and pair it with a clear arrears workflow so accounts do not sit untouched for months. This matters particularly for service-charge streams because arrears can build quietly while the service continues. A light but regular follow-up rhythm is often far more effective than occasional heavy enforcement drives.',
                implementationPath: [
                    'Build a reminder sequence linked to the billing calendar, with simple messages before and after the due date and a clear tone progression.',
                    'Stop reminders automatically for accounts that have already paid so customers do not lose trust in the system.',
                    'Move unpaid accounts into a structured arrears queue with defined follow-up actions instead of letting them drift from one cycle to the next.',
                    'Use results by customer group and area to improve the reminder timing, message wording, and hand-off to stronger follow-up.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to issue reminders and arrears notices through the chosen channels.',
                administrativeSetup: 'Prepare templates, create a daily or weekly overdue list, define escalation trigger points, and stop reminders automatically once payment is posted.',
                goodFitWhen: [
                    'Many users pay only after repeated personal contact.',
                    'Due dates are not salient and missed payments become old before anyone acts.',
                    'The city has billing data but no structured way to work the overdue list.'
                ],
                lessSuitableWhen: [
                    'Contact information is largely missing and cannot be improved quickly.',
                    'The city lacks even a small team to own arrears follow-up.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.'
                ]
            }
        },

        {
            solutionId: 'B10',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Receipts, Reconciliation, and Cash Controls',
            shortTitle: 'Cash Controls',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Payments',
            sortOrder: 13,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Protect the money already being paid by making sure every payment gets an official receipt and every collection point reconciles back to the ledger and bank deposit. In many user-fee streams, leakage happens after the user has already paid. Strong cash and reconciliation controls therefore deserve to be treated as a revenue reform, not only as finance-office housekeeping.',
                mostUsefulWhen: [
                    'Many payments are still made in cash.',
                    'Users report that they paid but the system does not show it.',
                    'There are unexplained gaps between collections, deposits, and reported receipts.'
                ],
                usuallyNotBestFirstMove: [
                    'The stream is already fully cashless and well reconciled, though even then digital reconciliation still needs close review.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                oftenWorksBestAlongside: [
                    'B8 (Easy Payment Channels and Manageable Payment Plans) to ensure all channels have proper receipting.',
                    'B7 (Regular, Understandable Billing) so that payments can be matched to bills.',
                    'B9 (Reminder Calendar and Structured Arrears Follow-Up) to ensure that payment records are accurate before chasing arrears.'
                ]
            },
            fullDetails: {
                overview: 'Protect the money already being paid by making sure every payment gets an official receipt and every collection point reconciles back to the ledger and bank deposit. In many user-fee streams, leakage happens after the user has already paid. Strong cash and reconciliation controls therefore deserve to be treated as a revenue reform, not only as finance-office housekeeping.',
                implementationPath: [
                    'Standardise official receipts across all payment channels and make sure customers and staff can easily tell what a valid receipt looks like.',
                    'Reconcile cash, digital payments, and bank statements every day or every shift, depending on the volume and risk of the stream.',
                    'Separate collection, reconciliation, and supervisory approval roles as much as staffing allows, and use spot checks where staffing is thin.',
                    'Review discrepancies quickly and document how they were resolved so small control failures do not turn into routine leakage.'
                ],
                legalInstitutionalEnablers: 'Finance rules should require official receipts, reconciliation, and deposit procedures. If these are weak, a standing internal order can usually tighten practice quickly.',
                administrativeSetup: 'Use numbered or digital receipts, separate collection from reconciliation, carry out daily or same-week balancing, and review exceptions while evidence is still fresh.',
                goodFitWhen: [
                    'Many payments are still made in cash.',
                    'Users report that they paid but the system does not show it.',
                    'There are unexplained gaps between collections, deposits, and reported receipts.'
                ],
                lessSuitableWhen: [
                    'The stream is already fully cashless and well reconciled, though even then digital reconciliation still needs close review.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.'
                ]
            }
        },

        {
            solutionId: 'B11',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'B',
            gap: 'Compliance',
            title: 'Service-Linked Enforcement and Payment Arrangements',
            shortTitle: 'Service-Linked Enforcement',
            timeline: '1-3 years',
            politicalFeasibility: 'More sensitive',
            category: 'Enforcement',
            sortOrder: 14,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use the service relationship itself as leverage where the law allows. That may include suspension of non-essential service levels, refusal of selected new services, or formal payment arrangements before stronger enforcement. Service-linked enforcement works best when rules are transparent and vulnerable users are protected.',
                mostUsefulWhen: [
                    'Chronic arrears persist despite regular billing and reminders.',
                    'The municipality or utility controls access to the service or to related approvals.',
                    'Commercial or better-off users carry a large share of the debt.'
                ],
                usuallyNotBestFirstMove: [
                    'The service is an essential minimum that cannot lawfully or practically be interrupted.',
                    'Billing and operations data are too disconnected to support fair enforcement.'
                ],
                politicalNote: 'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment. Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match. Start with commercial or non-vulnerable accounts so the rule is seen as credible and proportionate.',
                oftenWorksBestAlongside: [
                    'B9 (Reminder Calendar and Structured Arrears Follow-Up) so that enforcement follows a clear reminder sequence.',
                    'B7 (Regular, Understandable Billing) so that enforcement is only applied to properly billed accounts.',
                    'B8 (Easy Payment Channels and Manageable Payment Plans) so that users facing enforcement have realistic payment options.'
                ]
            },
            fullDetails: {
                overview: 'Use the service relationship itself as leverage where the law allows. That may include suspension of non-essential service levels, refusal of selected new services, or formal payment arrangements before stronger enforcement. Service-linked enforcement works best when rules are transparent and vulnerable users are protected.',
                implementationPath: [
                    'Identify which services or approvals can legally be linked to payment status and which must remain protected because they are essential or rights-based.',
                    'Define a fair escalation path that starts with notices and payment arrangements before service restrictions or stronger sanctions are considered.',
                    'Create a hardship and dispute route so vulnerable users are not treated the same way as strategic non-payers.',
                    'Review the first cases carefully with service departments and leadership so the city applies the tool consistently and does not damage basic service legitimacy.'
                ],
                legalInstitutionalEnablers: 'The city needs clear authority for the chosen sanction or arrangement and due-process safeguards, especially where essential services are involved.',
                administrativeSetup: 'Define thresholds, issue warning notices, allow rapid reinstatement after payment or agreement, and keep an exemption list for critical users.',
                goodFitWhen: [
                    'Chronic arrears persist despite regular billing and reminders.',
                    'The municipality or utility controls access to the service or to related approvals.',
                    'Commercial or better-off users carry a large share of the debt.'
                ],
                lessSuitableWhen: [
                    'The service is an essential minimum that cannot lawfully or practically be interrupted.',
                    'Billing and operations data are too disconnected to support fair enforcement.'
                ],
                risksAndDesignNotes: [
                    'Essential-service enforcement needs hardship screening and clear political backing; otherwise the city can damage trust faster than it improves payment.',
                    'Receipts and reconciliation matter as much as reminders. People stop paying when posted balances and their own records do not match.',
                    'Start with commercial or non-vulnerable accounts so the rule is seen as credible and proportionate.'
                ]
            }
        }

    ];
})(window);
