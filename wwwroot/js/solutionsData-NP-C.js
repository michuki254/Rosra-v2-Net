/**
 * ROSRA Solutions Data - Non-Property Subgroup C
 * Daily or point-of-collection charges
 * Cards organized by gap: Coverage (3), Liability (3), Compliance (8)
 */
(function(window) {
    'use strict';

    window.SolutionsDataNP_C = [

        // =============================================
        // COVERAGE CARDS (3): C1, C2, C13
        // =============================================

        {
            solutionId: 'C1',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Register Stalls, Bays, Tables, Routes, and Operating Points',
            shortTitle: 'Register Operating Points',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Start with the physical unit that generates the charge. Count and register market tables and stalls, parking bays, bus park slots, slaughter slabs, loading points, or other operating spaces, then link them to a payer or operator wherever possible. In high-frequency streams, a visible charge base is often more important than elaborate billing software.',
                mostUsefulWhen: [
                    'No one can say confidently how many chargeable points actually exist.',
                    'Supervisors rely on rough estimates rather than a mapped or numbered base.',
                    'Daily collections vary widely without any clear explanation.'
                ],
                usuallyNotBestFirstMove: [
                    'Operating points change so completely every day that no stable register is possible under the current mode of operation.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                politicalNote: 'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                oftenWorksBestAlongside: [
                    'C2 (Daily, Weekly, and Monthly Operator IDs or Permits) to link the registered points to identified payers.',
                    'C13 (Site Allocation Register and Occupancy Reconciliation) to keep the register aligned with actual occupancy over time.'
                ]
            },
            fullDetails: {
                overview: 'Start with the physical unit that generates the charge. Count and register market tables and stalls, parking bays, bus park slots, slaughter slabs, loading points, or other operating spaces, then link them to a payer or operator wherever possible. In high-frequency streams, a visible charge base is often more important than elaborate billing software.',
                implementationPath: [
                    'Map every site where charges can lawfully be collected, including stalls, tables, bays, loading points, routes, entrances, or working zones.',
                    'Record the operator or user normally associated with each site, even if the operating pattern changes during the week or season.',
                    'Assign simple site IDs that collectors and supervisors can use in daily work without needing complex technology.',
                    'Update the site register regularly so that new operating points, informal spill-overs, and abandoned sites are reflected quickly.'
                ],
                legalInstitutionalEnablers: 'The city needs authority to enumerate and identify chargeable municipal operating points under the relevant market, transport, parking, or public-space rules.',
                administrativeSetup: 'Use a mapped inventory, simple IDs, and a basic register showing location, type, operational status, and payer or operator where known. Update it routinely.',
                goodFitWhen: [
                    'No one can say confidently how many chargeable points actually exist.',
                    'Supervisors rely on rough estimates rather than a mapped or numbered base.',
                    'Daily collections vary widely without any clear explanation.'
                ],
                lessSuitableWhen: [
                    'Operating points change so completely every day that no stable register is possible under the current mode of operation.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                risksAndDesignNotes: [
                    'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                    'Seasonal and mobile operators need clear rules so the city does not double-charge or push activity further off-book.'
                ]
            }
        },

        {
            solutionId: 'C2',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Daily, Weekly, and Monthly Operator IDs or Permits',
            shortTitle: 'Operator IDs & Permits',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Give recurring users, traders, or operators a simple official ID, tag, or permit that matches the charge period they normally use. This makes it much easier for collectors and supervisors to know who should be paying, reduces repeat cash handling for frequent users, and helps distinguish authorised users from casual or unauthorised ones.',
                mostUsefulWhen: [
                    'The same traders or operators appear repeatedly at the same sites.',
                    'Markets or stands have a strong core of regular users.',
                    'Enforcement struggles because authorised and unauthorised users cannot be distinguished quickly in the field.'
                ],
                usuallyNotBestFirstMove: [
                    'The user base is almost entirely casual and short-term, so periodic IDs would add work without helping control.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                politicalNote: 'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                oftenWorksBestAlongside: [
                    'C1 (Register Stalls, Bays, Tables, Routes, and Operating Points) so IDs are linked to known operating points.',
                    'C12 (Monthly Passes or Subscriptions for Frequent Users) to convert regular daily payers to longer-period instruments.'
                ]
            },
            fullDetails: {
                overview: 'Give recurring users, traders, or operators a simple official ID, tag, or permit that matches the charge period they normally use. This makes it much easier for collectors and supervisors to know who should be paying, reduces repeat cash handling for frequent users, and helps distinguish authorised users from casual or unauthorised ones.',
                implementationPath: [
                    'Define the permit or ID products the city actually needs, for example daily, weekly, monthly, seasonal, or route-based authorisations.',
                    'Make the authorisation visible in practice through badges, stickers, tokens, QR codes, or colour-coded passes that supervisors can check quickly.',
                    'Link issuance to the operator record and the site or route where possible so the city can distinguish authorised from unauthorised activity.',
                    'Review the mix of permit types after the first operating cycles and adjust it if staff or users find it too rigid or easy to evade.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to issue local operating tags, permits, or IDs for the relevant space or activity.',
                administrativeSetup: 'Design a low-cost ID, keep a holder register, make display rules clear, and define how replacement, renewal, suspension, and reissue will work.',
                goodFitWhen: [
                    'The same traders or operators appear repeatedly at the same sites.',
                    'Markets or stands have a strong core of regular users.',
                    'Enforcement struggles because authorised and unauthorised users cannot be distinguished quickly in the field.'
                ],
                lessSuitableWhen: [
                    'The user base is almost entirely casual and short-term, so periodic IDs would add work without helping control.',
                    'There is too little operational capacity to verify additions and keep the newly expanded register accurate after the first push.'
                ],
                risksAndDesignNotes: [
                    'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                    'Seasonal and mobile operators need clear rules so the city does not double-charge or push activity further off-book.'
                ]
            }
        },

        {
            solutionId: 'C13',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Coverage',
            title: 'Site Allocation Register and Occupancy Reconciliation',
            shortTitle: 'Site Allocation & Reconciliation',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Registration',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Keep a live record of who is entitled to which stall, bay, table, route slot, or operating point, and compare it regularly to who is actually occupying or using it. In many markets, terminals, and parking areas, leakage begins when the physical space is known but the operator record drifts, informal subletting becomes normal, or vacant and occupied positions are not updated. A regular reconciliation closes that visibility gap.',
                mostUsefulWhen: [
                    'The city manages markets, parking bays, transport stages, or other assigned operating spaces.',
                    'Informal subletting, sharing, or abandoned allocations are common.',
                    'The chargeable place is visible, but the identity of the real payer is not always clear.'
                ],
                usuallyNotBestFirstMove: [
                    'The revenue stream is fully open-access and does not depend on identifiable spaces or slots.',
                    'The municipality has no influence over who uses the site.'
                ],
                politicalNote: 'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                oftenWorksBestAlongside: [
                    'C1 (Register Stalls, Bays, Tables, Routes, and Operating Points) to ensure the physical base is mapped first.',
                    'C2 (Daily, Weekly, and Monthly Operator IDs or Permits) so reconciliation can compare permits against actual occupancy.'
                ]
            },
            fullDetails: {
                overview: 'Keep a live record of who is entitled to which stall, bay, table, route slot, or operating point, and compare it regularly to who is actually occupying or using it. In many markets, terminals, and parking areas, leakage begins when the physical space is known but the operator record drifts, informal subletting becomes normal, or vacant and occupied positions are not updated. A regular reconciliation closes that visibility gap.',
                implementationPath: [
                    'Create one authoritative site-allocation register for markets, bays, transport stands, or other operating points and record who is officially assigned to each place.',
                    'Compare the allocation register with actual occupancy on the ground and document cases of subletting, sharing, abandonment, or informal take-over.',
                    'Correct the highest-value or most contested sites first so the city can stabilise the most important charging points.',
                    'Repeat the reconciliation on a routine basis so allocation decisions, occupancy, and billing stop drifting apart.'
                ],
                legalInstitutionalEnablers: 'The municipality should have authority to record allocations, verify actual occupancy, and suspend or reassign spaces under clear local rules where they are inactive or used without authorization.',
                administrativeSetup: 'Maintain a simple site map and allocation sheet, assign responsibility for updates, and run periodic walk-through checks. Every change of holder, vacancy, suspension, or reallocation should be logged with date and reason.',
                goodFitWhen: [
                    'The city manages markets, parking bays, transport stages, or other assigned operating spaces.',
                    'Informal subletting, sharing, or abandoned allocations are common.',
                    'The chargeable place is visible, but the identity of the real payer is not always clear.'
                ],
                lessSuitableWhen: [
                    'The revenue stream is fully open-access and does not depend on identifiable spaces or slots.',
                    'The municipality has no influence over who uses the site.'
                ],
                risksAndDesignNotes: [
                    'Coverage reforms can trigger disputes over territory, site allocation, and who is authorised to operate. Keep the operating-point register visible enough to reduce conflict.',
                    'Seasonal and mobile operators need clear rules so the city does not double-charge or push activity further off-book.',
                    'This is often sensitive where unofficial subletting has become tolerated, so start with clear communication and consistent documentation.'
                ]
            }
        },

        // =============================================
        // LIABILITY CARDS (3): C3, C4, C5
        // =============================================

        {
            solutionId: 'C3',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Public Display of Rates and Charge Rules',
            shortTitle: 'Public Rate Display',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Policy',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Put the approved rates where users can see them - at gates, in markets, at bus parks, in parking areas, at slaughterhouses, and on official municipal channels. State clearly what is payable, by whom, and how often. Public visibility reduces overcharging, undercharging, and bargaining at the point of collection.',
                mostUsefulWhen: [
                    'Users say they do not know the official rate.',
                    'Complaints about extortion or arbitrary charges are common.',
                    'Collectors and users often negotiate because the rules are not visible on site.'
                ],
                usuallyNotBestFirstMove: [
                    'The approved rates are themselves so confusing that public display alone would only reproduce the confusion.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                politicalNote: 'If collectors and users cannot see the approved rate, unofficial tariffs quickly reappear. Public display and supervisor checks must accompany any tariff reform.',
                oftenWorksBestAlongside: [
                    'C4 (Simple Tariff and Charge Matrix for Frontline Collectors) so both users and collectors work from the same reference.',
                    'C10 (Complaint Channel Against Off-Book Collection and Harassment) so users who see the posted rate can report overcharging.'
                ]
            },
            fullDetails: {
                overview: 'Put the approved rates where users can see them - at gates, in markets, at bus parks, in parking areas, at slaughterhouses, and on official municipal channels. State clearly what is payable, by whom, and how often. Public visibility reduces overcharging, undercharging, and bargaining at the point of collection.',
                implementationPath: [
                    'Confirm the officially approved rates and the units to which they apply, such as per day, per entry, per bay, per animal, or per stall.',
                    'Display those rates prominently at collection points, entrances, markets, and offices using formats that are readable to users and collectors alike.',
                    'Update the display immediately when rates change and remove outdated notices so staff cannot hide behind old boards.',
                    'Add a complaint number or verification point so users can challenge off-book charges or misinformation in real time.'
                ],
                legalInstitutionalEnablers: 'The approved tariff schedule must already exist and be available for disclosure.',
                administrativeSetup: 'Use durable boards or posters, update them whenever the approved rates change, and make sure the wording is simple enough for daily users to understand quickly.',
                goodFitWhen: [
                    'Users say they do not know the official rate.',
                    'Complaints about extortion or arbitrary charges are common.',
                    'Collectors and users often negotiate because the rules are not visible on site.'
                ],
                lessSuitableWhen: [
                    'The approved rates are themselves so confusing that public display alone would only reproduce the confusion.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                risksAndDesignNotes: [
                    'If collectors and users cannot see the approved rate, unofficial tariffs quickly reappear. Public display and supervisor checks must accompany any tariff reform.',
                    'Keep frontline charging rules simple enough for live collection conditions. Overly technical rate logic creates new leakage opportunities.'
                ]
            }
        },

        {
            solutionId: 'C4',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Simple Tariff and Charge Matrix for Frontline Collectors',
            shortTitle: 'Collector Charge Matrix',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Policy',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Give collectors a one-page operational matrix that translates the formal schedule into something usable in the field. It should show the chargeable unit, amount due, period covered, and any valid exception. This helps reduce frontline discretion and makes supervision easier because managers can compare what should have been charged with what was actually collected.',
                mostUsefulWhen: [
                    'Collectors rely on memory or informal practice.',
                    'The same site produces different charges depending on who is on duty.',
                    'Supervisors struggle to audit collections because they do not have a simple operational reference.'
                ],
                usuallyNotBestFirstMove: [
                    'The schedule changes so often, or the charge base is so unstable, that no practical operational matrix can be kept current.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                politicalNote: 'If collectors and users cannot see the approved rate, unofficial tariffs quickly reappear. Public display and supervisor checks must accompany any tariff reform.',
                oftenWorksBestAlongside: [
                    'C3 (Public Display of Rates and Charge Rules) so both collectors and users work from the same published rates.',
                    'C9 (Supervisor Spot Checks, Rotation, and Exception Review) so the matrix is enforced through active supervision.'
                ]
            },
            fullDetails: {
                overview: 'Give collectors a one-page operational matrix that translates the formal schedule into something usable in the field. It should show the chargeable unit, amount due, period covered, and any valid exception. This helps reduce frontline discretion and makes supervision easier because managers can compare what should have been charged with what was actually collected.',
                implementationPath: [
                    'Translate the formal rates into a short tariff matrix that shows collectors exactly what to charge in the most common situations.',
                    'Use worked examples for awkward cases, such as shared stalls, multiple loads, partial days, special market days, or mixed uses.',
                    'Train collectors and supervisors together so the same rule is applied across shifts and sites.',
                    'Review collector questions and dispute cases after launch and simplify the matrix further wherever staff still rely on personal interpretation.'
                ],
                legalInstitutionalEnablers: 'Usually no major legal change is needed if the matrix simply translates the approved schedule into operational form.',
                administrativeSetup: 'Field-test the matrix, keep version control tight, and train collectors and supervisors together so everyone uses the same reference.',
                goodFitWhen: [
                    'Collectors rely on memory or informal practice.',
                    'The same site produces different charges depending on who is on duty.',
                    'Supervisors struggle to audit collections because they do not have a simple operational reference.'
                ],
                lessSuitableWhen: [
                    'The schedule changes so often, or the charge base is so unstable, that no practical operational matrix can be kept current.',
                    'The city cannot yet prove the charging basis well enough to defend corrections and explain them clearly to affected users.'
                ],
                risksAndDesignNotes: [
                    'If collectors and users cannot see the approved rate, unofficial tariffs quickly reappear. Public display and supervisor checks must accompany any tariff reform.',
                    'Keep frontline charging rules simple enough for live collection conditions. Overly technical rate logic creates new leakage opportunities.'
                ]
            }
        },

        {
            solutionId: 'C5',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Liability',
            title: 'Digital Tickets, Handheld Devices, or Prepaid Tokens',
            shortTitle: 'Digital Collection Tools',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Infrastructure',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Replace informal cash collection with a tool that records the transaction at the moment it happens. Depending on context, that may mean handheld devices, QR-coded tickets, prepaid tokens, or mobile payment confirmations. The point is not technology for its own sake, but stronger control over what was paid, who received it, and what period or site it covered.',
                mostUsefulWhen: [
                    'Manual receipts are easy to recycle or fake.',
                    'Supervisors cannot verify collections quickly enough to act.',
                    'The same users or sites generate repeated cash transactions every day.'
                ],
                usuallyNotBestFirstMove: [
                    'Technology costs would exceed the size of the stream.',
                    'Electricity or connectivity are too weak and no workable offline solution exists.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C6 (Numbered Receipts and Tight Collector Controls) as an interim manual control before digital rollout.',
                    'C8 (Shift-, Route-, and Site-Level Dashboards) to use digital transaction data for operational management.'
                ]
            },
            fullDetails: {
                overview: 'Replace informal cash collection with a tool that records the transaction at the moment it happens. Depending on context, that may mean handheld devices, QR-coded tickets, prepaid tokens, or mobile payment confirmations. The point is not technology for its own sake, but stronger control over what was paid, who received it, and what period or site it covered.',
                implementationPath: [
                    'Choose the simplest digital collection tool that fits the environment, whether handheld devices, e-tickets, QR passes, prepaid tokens, or a hybrid approach.',
                    'Pilot in sites where transaction volume and supervisory capacity are high enough to test the tool properly.',
                    'Link each digital transaction to a collector, site, shift, or route so the city can reconcile expected and actual collections.',
                    'Scale gradually and only after the city has solved device support, battery, connectivity, and exception handling.'
                ],
                legalInstitutionalEnablers: 'Electronic records and digital receipts should be recognised for municipal collection purposes.',
                administrativeSetup: 'Choose a tool that fits local connectivity and maintenance capacity, train staff well, and tie the system back to the site register and treasury reconciliation process.',
                goodFitWhen: [
                    'Manual receipts are easy to recycle or fake.',
                    'Supervisors cannot verify collections quickly enough to act.',
                    'The same users or sites generate repeated cash transactions every day.'
                ],
                lessSuitableWhen: [
                    'Technology costs would exceed the size of the stream.',
                    'Electricity or connectivity are too weak and no workable offline solution exists.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.',
                    'Do not promise that automation alone will solve leakage. It needs to sit alongside supervision and clear operational controls.'
                ]
            }
        },

        // =============================================
        // COMPLIANCE CARDS (8): C6, C7, C8, C9, C10, C14, C11, C12
        // =============================================

        {
            solutionId: 'C6',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Numbered Receipts and Tight Collector Controls',
            shortTitle: 'Numbered Receipts & Controls',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Enforcement',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Where digital tools are not yet realistic, tighten the manual system. Use numbered receipts, controlled book issuance, collector assignment logs, and verified end-of-day balancing. This is the minimum control package for cash-heavy high-frequency streams and can often be introduced much faster than a full digital system.',
                mostUsefulWhen: [
                    'Collections are still largely manual.',
                    'Receipt recycling or unofficial tickets are suspected.',
                    'The city needs a fast control improvement before any larger technology roll-out.'
                ],
                usuallyNotBestFirstMove: [
                    'None in the short run, though a fully manual system will still have limits once the stream grows.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C7 (Cash-Light Collection and Same-Day Reconciliation) to reduce the time cash stays in the field.',
                    'C9 (Supervisor Spot Checks, Rotation, and Exception Review) to verify that receipt controls are being followed.'
                ]
            },
            fullDetails: {
                overview: 'Where digital tools are not yet realistic, tighten the manual system. Use numbered receipts, controlled book issuance, collector assignment logs, and verified end-of-day balancing. This is the minimum control package for cash-heavy high-frequency streams and can often be introduced much faster than a full digital system.',
                implementationPath: [
                    'Introduce official numbered receipts or e-receipts and make every collector accountable for the specific range or device session assigned to them.',
                    'Require opening and closing balances for each collector and track voids, spoiled receipts, and missing numbers explicitly.',
                    'Use surprise checks during live collection periods rather than relying only on end-of-day paperwork.',
                    'Treat receipt control as a core anti-leakage reform, not as a clerical side issue.'
                ],
                legalInstitutionalEnablers: 'Finance rules should already require official receipts and custody of receipt books. If not, an internal order can usually tighten this quickly.',
                administrativeSetup: 'Keep a serial control log, record which book is issued to which collector, and require daily balancing with supervisor verification.',
                goodFitWhen: [
                    'Collections are still largely manual.',
                    'Receipt recycling or unofficial tickets are suspected.',
                    'The city needs a fast control improvement before any larger technology roll-out.'
                ],
                lessSuitableWhen: [
                    'None in the short run, though a fully manual system will still have limits once the stream grows.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.'
                ]
            }
        },

        {
            solutionId: 'C7',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Cash-Light Collection and Same-Day Reconciliation',
            shortTitle: 'Cash-Light & Same-Day Reconciliation',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Payments',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Reduce the time cash stays in the field and reconcile every site or shift to expected collections as quickly as possible. In high-frequency streams, leakage often happens in small amounts that are hard to trace later. Fast reconciliation narrows that window and lets management act while the evidence is still fresh.',
                mostUsefulWhen: [
                    'Many collection points operate simultaneously.',
                    'Collectors travel with cash for long periods.',
                    'Management sees gaps only long after the shift or market day has closed.'
                ],
                usuallyNotBestFirstMove: [
                    'Collection points are extremely remote and transport or banking access makes a tight cycle impossible, though even then a short controlled cycle is better than a loose one.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C6 (Numbered Receipts and Tight Collector Controls) to strengthen the manual control layer.',
                    'C8 (Shift-, Route-, and Site-Level Dashboards) to make reconciliation results visible to management.'
                ]
            },
            fullDetails: {
                overview: 'Reduce the time cash stays in the field and reconcile every site or shift to expected collections as quickly as possible. In high-frequency streams, leakage often happens in small amounts that are hard to trace later. Fast reconciliation narrows that window and lets management act while the evidence is still fresh.',
                implementationPath: [
                    'Move as much collection as practical into bank, mobile, token, or other traceable channels while recognising that some cash handling may remain necessary.',
                    'Where cash remains, require same-day or shift-end balancing and prompt deposit under a written routine.',
                    'Separate the counting, recording, and supervisory review steps wherever staffing allows, even if that means simple rotation rather than full segregation.',
                    'Review sites with repeated balancing issues and decide whether the answer is stronger supervision, better tools, or moving that site faster toward cash-light collection.'
                ],
                legalInstitutionalEnablers: 'Finance rules should set clear timelines for deposit and reconciliation.',
                administrativeSetup: 'Use same-day or next-day deposit rules, shift sheets, settlement reports, and an exception list for unexplained shortfalls that need immediate review.',
                goodFitWhen: [
                    'Many collection points operate simultaneously.',
                    'Collectors travel with cash for long periods.',
                    'Management sees gaps only long after the shift or market day has closed.'
                ],
                lessSuitableWhen: [
                    'Collection points are extremely remote and transport or banking access makes a tight cycle impossible, though even then a short controlled cycle is better than a loose one.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.'
                ]
            }
        },

        {
            solutionId: 'C8',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Shift-, Route-, and Site-Level Dashboards',
            shortTitle: 'Operational Dashboards',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Monitoring',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Build a simple dashboard, even in Excel, showing expected versus actual collections by market, route, parking zone, bus stand, or shift. High-frequency streams need close operational visibility because leakage is dispersed and difficult to see from headline totals alone. A dashboard helps supervisors spot which site or shift has become abnormal and direct follow-up where it matters most.',
                mostUsefulWhen: [
                    'The city has many small collection points.',
                    'Leadership cannot tell where leakage is arising.',
                    'Supervisors want easier comparisons across sites or shifts but currently work from raw receipts only.'
                ],
                usuallyNotBestFirstMove: [
                    'Source data are too weak or too delayed to make site-level comparisons meaningful.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C7 (Cash-Light Collection and Same-Day Reconciliation) to feed timely data into the dashboard.',
                    'C9 (Supervisor Spot Checks, Rotation, and Exception Review) to act on what the dashboard reveals.'
                ]
            },
            fullDetails: {
                overview: 'Build a simple dashboard, even in Excel, showing expected versus actual collections by market, route, parking zone, bus stand, or shift. High-frequency streams need close operational visibility because leakage is dispersed and difficult to see from headline totals alone. A dashboard helps supervisors spot which site or shift has become abnormal and direct follow-up where it matters most.',
                implementationPath: [
                    'Decide the minimum dashboard fields, such as site, shift, collector, expected amount, actual amount, variance, and unusual events.',
                    'Produce the dashboard at a rhythm managers can really use, often daily for large sites and weekly for smaller ones.',
                    'Use the dashboard to trigger operational questions, such as why one route consistently underperforms or why one shift generates unusually many voids.',
                    'Keep the first version simple and stable so staff actually trust and use it.'
                ],
                legalInstitutionalEnablers: 'No special legal reform is normally needed beyond the city\u2019s standard authority for internal reporting.',
                administrativeSetup: 'Use consistent site codes, ensure data entry is regular, and name one officer or supervisor who owns the dashboard and the follow-up discussion around it.',
                goodFitWhen: [
                    'The city has many small collection points.',
                    'Leadership cannot tell where leakage is arising.',
                    'Supervisors want easier comparisons across sites or shifts but currently work from raw receipts only.'
                ],
                lessSuitableWhen: [
                    'Source data are too weak or too delayed to make site-level comparisons meaningful.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.'
                ]
            }
        },

        {
            solutionId: 'C9',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Supervisor Spot Checks, Rotation, and Exception Review',
            shortTitle: 'Spot Checks & Rotation',
            timeline: 'Less than a year',
            politicalFeasibility: 'Usually higher',
            category: 'Enforcement',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use routine field supervision to verify that collectors are in place, using the right rates, issuing official receipts, and reporting the right amounts. Rotate staff or routes periodically where corruption risks are high. This is especially important where personal control of one site can slowly turn into informal ownership of that revenue point.',
                mostUsefulWhen: [
                    'The same collectors stay at the same sites for long periods.',
                    'Reports of unofficial arrangements are common.',
                    'There are large unexplained differences in collections across shifts or routes.'
                ],
                usuallyNotBestFirstMove: [
                    'Staffing is so thin that real supervision is impossible, though this is often exactly why leakage remains entrenched.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C6 (Numbered Receipts and Tight Collector Controls) so spot checks can verify receipt usage.',
                    'C8 (Shift-, Route-, and Site-Level Dashboards) so supervisors can target checks based on data.'
                ]
            },
            fullDetails: {
                overview: 'Use routine field supervision to verify that collectors are in place, using the right rates, issuing official receipts, and reporting the right amounts. Rotate staff or routes periodically where corruption risks are high. This is especially important where personal control of one site can slowly turn into informal ownership of that revenue point.',
                implementationPath: [
                    'Prepare a rotation and spot-check plan that is visible to supervisors and difficult for collectors to predict in detail.',
                    'Define which exceptions supervisors must review, such as sudden drops in collections, repeated missing receipts, or unusual adjustments.',
                    'Record every spot check in a short standard form and feed the findings back into training, disciplinary action, or redesign of routes and shifts.',
                    'Rotate staff and supervisors often enough to disrupt entrenched arrangements but not so often that no one understands the site.'
                ],
                legalInstitutionalEnablers: 'The city needs clear supervisory authority over collectors and deployment arrangements.',
                administrativeSetup: 'Prepare a spot-check checklist, a route-rotation plan, and a short exception-review process that links directly to corrective action or discipline.',
                goodFitWhen: [
                    'The same collectors stay at the same sites for long periods.',
                    'Reports of unofficial arrangements are common.',
                    'There are large unexplained differences in collections across shifts or routes.'
                ],
                lessSuitableWhen: [
                    'Staffing is so thin that real supervision is impossible, though this is often exactly why leakage remains entrenched.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.'
                ]
            }
        },

        {
            solutionId: 'C10',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Complaint Channel Against Off-Book Collection and Harassment',
            shortTitle: 'Complaint Channel',
            timeline: 'Less than a year',
            politicalFeasibility: 'Moderate',
            category: 'Monitoring',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Give traders, drivers, and daily users a simple way to report unofficial charges, duplicate payment demands, or harassment. A complaint channel only works if users can identify the collector or receipt and if management responds visibly. Used well, it adds another layer of control in streams where abuses are otherwise hard to detect from the office.',
                mostUsefulWhen: [
                    'Frequent allegations of harassment or unofficial collection undermine trust.',
                    'The municipality wants to show it is serious about collector conduct.',
                    'Users can realistically identify who collected, where, and when.'
                ],
                usuallyNotBestFirstMove: [
                    'Users do not trust the city enough to complain and there is no realistic plan for visible follow-up.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C3 (Public Display of Rates and Charge Rules) so users know what the correct charge should be.',
                    'C9 (Supervisor Spot Checks, Rotation, and Exception Review) so complaints feed into the supervisory system.'
                ]
            },
            fullDetails: {
                overview: 'Give traders, drivers, and daily users a simple way to report unofficial charges, duplicate payment demands, or harassment. A complaint channel only works if users can identify the collector or receipt and if management responds visibly. Used well, it adds another layer of control in streams where abuses are otherwise hard to detect from the office.',
                implementationPath: [
                    'Create a complaint route that users can access quickly, for example phone, WhatsApp, market office, or stand manager, and publicise it at the point of collection.',
                    'Allow anonymous or protected reporting where harassment or intimidation is a real risk.',
                    'Define a short review process so complaints are acknowledged quickly and obvious abuse can be investigated while memories are fresh.',
                    'Publish visible action on substantiated complaints so users see that the channel matters.'
                ],
                legalInstitutionalEnablers: 'The municipality must be able to investigate staff misconduct and protect complainant information appropriately.',
                administrativeSetup: 'Set up a hotline or WhatsApp number, keep a complaint log, define response times, and communicate back enough results to show the channel is real.',
                goodFitWhen: [
                    'Frequent allegations of harassment or unofficial collection undermine trust.',
                    'The municipality wants to show it is serious about collector conduct.',
                    'Users can realistically identify who collected, where, and when.'
                ],
                lessSuitableWhen: [
                    'Users do not trust the city enough to complain and there is no realistic plan for visible follow-up.',
                    'The administration cannot yet issue reliable notices, post payments accurately, or distinguish inability to pay from deliberate non-compliance.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.',
                    'If complaints are invited but not acted on, trust can fall further. This card only works when management will actually intervene.'
                ]
            }
        },

        {
            solutionId: 'C14',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Oversight of Outsourced or Association-Based Collection',
            shortTitle: 'Outsourced Collection Oversight',
            timeline: 'Less than a year',
            politicalFeasibility: 'Moderate',
            category: 'Monitoring',
            sortOrder: 12,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Where daily charges are collected by contractors, associations, cooperatives, or other delegated actors, strengthen the control framework around them. Many high-frequency charges leak not because tariffs are unclear, but because delegated collectors operate with weak remittance rules, little reconciliation, poor visibility over receipts, or informal side arrangements. A tighter contract and oversight structure can protect revenue without immediately bringing all collection back in-house.',
                mostUsefulWhen: [
                    'The city relies on third parties or organised groups to collect or remit daily fees.',
                    'Revenue performance depends heavily on the honesty and discipline of external collectors.',
                    'Complaints, unofficial receipts, or unexplained remittance gaps are common.'
                ],
                usuallyNotBestFirstMove: [
                    'Collection is fully in-house and closely supervised already.',
                    'The city lacks the ability to monitor or enforce contract terms even when they exist.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C6 (Numbered Receipts and Tight Collector Controls) to strengthen receipt discipline within outsourced arrangements.',
                    'C10 (Complaint Channel Against Off-Book Collection and Harassment) so users can report abuses by delegated collectors.'
                ]
            },
            fullDetails: {
                overview: 'Where daily charges are collected by contractors, associations, cooperatives, or other delegated actors, strengthen the control framework around them. Many high-frequency charges leak not because tariffs are unclear, but because delegated collectors operate with weak remittance rules, little reconciliation, poor visibility over receipts, or informal side arrangements. A tighter contract and oversight structure can protect revenue without immediately bringing all collection back in-house.',
                implementationPath: [
                    'Map every outsourced, franchised, or association-based collection arrangement and gather the contract terms, remittance rules, reporting obligations, and enforcement clauses.',
                    'Define what the municipality must still control directly, such as rate-setting, receipt standards, daily reporting, and audit rights.',
                    'Require routine performance and reconciliation reports from the collecting party and compare them with site activity and field observation.',
                    'Use the findings to tighten contracts, reset incentives, or terminate arrangements that consistently leak revenue or undermine user protection.'
                ],
                legalInstitutionalEnablers: 'The municipality needs clear contractual or regulatory authority to set remittance rules, documentation standards, audit rights, sanctions, and termination conditions for delegated collectors.',
                administrativeSetup: 'Use a standard contract, daily or shift-based reconciliation, required display of approved tariffs, numbered or digital receipts, spot checks, and a complaint channel that bypasses the collector. Review performance regularly rather than only at contract renewal.',
                goodFitWhen: [
                    'The city relies on third parties or organised groups to collect or remit daily fees.',
                    'Revenue performance depends heavily on the honesty and discipline of external collectors.',
                    'Complaints, unofficial receipts, or unexplained remittance gaps are common.'
                ],
                lessSuitableWhen: [
                    'Collection is fully in-house and closely supervised already.',
                    'The city lacks the ability to monitor or enforce contract terms even when they exist.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.',
                    'This reform often matters most where outsourced collection is politically connected; management should prepare for resistance and rely on documented controls rather than informal understandings.'
                ]
            }
        },

        {
            solutionId: 'C11',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Graduated Enforcement for Non-Payers and Unauthorised Operators',
            shortTitle: 'Graduated Enforcement',
            timeline: 'Less than a year',
            politicalFeasibility: 'More sensitive',
            category: 'Enforcement',
            sortOrder: 13,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Apply a clear ladder of action against those who use the space or service without paying or who operate outside the authorised local system. Depending on the legal framework, that may mean warning first, then denial of access, suspension of allocation, impounding of equipment, or another proportionate sanction. In these streams, enforcement must be visible enough to deter evasion but disciplined enough not to turn into abuse.',
                mostUsefulWhen: [
                    'Many users evade by shifting place or time to avoid payment.',
                    'Authorised users resent visible free-riding.',
                    'The current system relies on repeated warnings that have little effect.'
                ],
                usuallyNotBestFirstMove: [
                    'No lawful sanction exists.',
                    'Visible enforcement would create major conflict because the political backing is not there.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C3 (Public Display of Rates and Charge Rules) so enforcement is backed by visible, published rules.',
                    'C10 (Complaint Channel Against Off-Book Collection and Harassment) so enforcement does not itself become a source of abuse.'
                ]
            },
            fullDetails: {
                overview: 'Apply a clear ladder of action against those who use the space or service without paying or who operate outside the authorised local system. Depending on the legal framework, that may mean warning first, then denial of access, suspension of allocation, impounding of equipment, or another proportionate sanction. In these streams, enforcement must be visible enough to deter evasion but disciplined enough not to turn into abuse.',
                implementationPath: [
                    'Define a graduated response for non-payers and unauthorised operators that starts with warning and regularisation and only later moves to stronger action.',
                    'Separate routine inability to pay from deliberate refusal, organised evasion, or repeated unauthorised occupation of chargeable space.',
                    'Train supervisors and enforcement staff to document each action carefully so the city can defend its decisions and avoid informal side payments.',
                    'Review enforcement patterns by site and operator type so the city can see whether action is credible, proportionate, and even-handed.'
                ],
                legalInstitutionalEnablers: 'The city needs clear sanction powers under the relevant market, transport, parking, or public-space rules.',
                administrativeSetup: 'Document each enforcement step, authorise the right officers, and define how access is restored after compliance so enforcement stays rules-based.',
                goodFitWhen: [
                    'Many users evade by shifting place or time to avoid payment.',
                    'Authorised users resent visible free-riding.',
                    'The current system relies on repeated warnings that have little effect.'
                ],
                lessSuitableWhen: [
                    'No lawful sanction exists.',
                    'Visible enforcement would create major conflict because the political backing is not there.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.',
                    'Early action should focus on repeat evaders and clearly unauthorised operators, not on one-off mistakes or vulnerable users.'
                ]
            }
        },

        {
            solutionId: 'C12',
            stream: 'Non-Property',
            streamType: 'non-property',
            subgroup: 'C',
            gap: 'Compliance',
            title: 'Monthly Passes or Subscriptions for Frequent Users',
            shortTitle: 'Monthly Passes & Subscriptions',
            timeline: '1-3 years',
            politicalFeasibility: 'Moderate',
            category: 'Payments',
            sortOrder: 14,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'For users who pay repeatedly, such as traders with fixed pitches or frequent commercial vehicle operators, move from daily manual collection to a monthly pass, subscription, or prepaid balance where possible. This lowers transaction costs, reduces cash handling, and lets supervisors focus on verifying possession of the pass rather than recollecting the same small charge every day.',
                mostUsefulWhen: [
                    'A large share of the stream comes from repeat users.',
                    'Daily collection consumes too much staff time relative to the amount collected.',
                    'The underlying charge base is stable enough to support a longer-period pass.'
                ],
                usuallyNotBestFirstMove: [
                    'User turnover is too high.',
                    'Passes would be easily shared or traded and the municipality has no realistic control method.'
                ],
                politicalNote: 'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                oftenWorksBestAlongside: [
                    'C2 (Daily, Weekly, and Monthly Operator IDs or Permits) to build on an existing permit or ID system.',
                    'C5 (Digital Tickets, Handheld Devices, or Prepaid Tokens) to support digital verification of passes.'
                ]
            },
            fullDetails: {
                overview: 'For users who pay repeatedly, such as traders with fixed pitches or frequent commercial vehicle operators, move from daily manual collection to a monthly pass, subscription, or prepaid balance where possible. This lowers transaction costs, reduces cash handling, and lets supervisors focus on verifying possession of the pass rather than recollecting the same small charge every day.',
                implementationPath: [
                    'Identify the user groups who make frequent repeat payments and test whether a monthly pass, subscription, or bundled product would reduce friction and leakage.',
                    'Price the pass so it is attractive enough to shift behaviour but still protects revenue and does not create unfair subsidies for already dominant users.',
                    'Make the pass easy to verify in the field and link it clearly to the user, route, bay, or site where relevant.',
                    'Monitor use, fraud attempts, and renewal behaviour to decide whether the pass product should expand, change, or be withdrawn.'
                ],
                legalInstitutionalEnablers: 'The municipality needs authority to offer a longer-period permit or prepaid arrangement under the current tariff framework.',
                administrativeSetup: 'Maintain a holder register, use a clear verification method, and define refund, cancellation, and misuse rules so passes do not become tradable loopholes.',
                goodFitWhen: [
                    'A large share of the stream comes from repeat users.',
                    'Daily collection consumes too much staff time relative to the amount collected.',
                    'The underlying charge base is stable enough to support a longer-period pass.'
                ],
                lessSuitableWhen: [
                    'User turnover is too high.',
                    'Passes would be easily shared or traded and the municipality has no realistic control method.'
                ],
                risksAndDesignNotes: [
                    'The largest risk is often collector leakage, not unwillingness to pay. Control, reconciliation, and complaint channels should move in parallel with any enforcement changes.',
                    'Sanctions must be visible but proportionate, especially where daily access to a stall, bay, or route is tied closely to livelihood.'
                ]
            }
        }

    ];

})(window);
