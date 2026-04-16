/**
 * ROSRA Solutions Data - Property Tax Valuation
 * 10 cards: PT-VAL-01 through PT-VAL-10
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTValuation = [
        // ============================================================
        // A. Choose a workable assessment basis
        // ============================================================
        {
            solutionId: 'PT-VAL-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Start with an assessment method the city can actually keep current',
            shortTitle: 'Workable Assessment Basis',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium-High',
            politicalSensitivity: 'Medium',
            category: 'Assessment Method',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Choose an assessment basis that fits the city\u2019s data and capacity, rather than importing a technically elegant system that cannot be maintained. In many contexts this means starting with a simpler, rule-based method that can later become more market-linked as data improve.',
                mostUsefulWhen: [
                    'The current assessment method is too complex, opaque, or too stale to defend.',
                    'The city needs a more credible basis for billing without waiting for perfect market data.',
                    'Leaders want a reform that can actually be sustained operationally.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not redesign the assessment basis before confirming the property roll is usable enough to carry it.',
                    'This is not a minor tweak; it needs legal, technical, and political preparation.'
                ],
                oftenWorksBestAlongside: [
                    'Use simple location and property bands to improve fairness quickly',
                    'Revalue first where the money and change are concentrated',
                    'Build a citywide baseline property inventory'
                ],
                politicalNote: 'Assessment reforms can become politically sensitive because they change how fairness is judged, not just how much revenue is raised. The city usually needs plain explanations, visible logic, and a route for taxpayers to question obvious mistakes.'
            },
            fullDetails: {
                whyThisMatters: 'Many valuation reforms fail not because the idea was technically wrong, but because the city adopted a method that was too complex to update, explain, or defend. This card is about choosing a basis that fits the local data, staffing, market evidence, and political environment. In many cities that means beginning with a simpler, rule-based or notional-value method that can be applied consistently and then strengthened later, rather than jumping straight to an elegant model that the administration cannot maintain.',
                designChoices: 'Whether the city should stay with a simplified area- or rule-based method, move to a stronger banded system, or prepare for a more market-linked approach. How many variables the method should use so that it captures meaningful differences without becoming impossible to maintain. How the city will explain the chosen basis to taxpayers in language that feels fair and intelligible rather than expert-only.',
                practicalPath: {
                    first90Days: 'Map the current method, the legal authority around it, and the main reasons it is no longer working well. Test one or two feasible alternative approaches against a small sample of actual properties and local data. Prepare a short options note for leadership that compares methods not only by fairness and revenue effect but also by update burden and political risk.',
                    sixTo12Months: 'Select the preferred approach, define the core data fields it requires, and pilot it in one segment or one geography before citywide application. Use the pilot to see where the method breaks down operationally, not just where it performs well on paper. Prepare the public explanation and staff guidance early, because method changes trigger questions before they trigger revenue.',
                    twelveToTwentyFourMonths: 'Adopt the method formally and build it into the city\'s routine valuation and billing process. Set a review point after the first full cycle to decide whether the method should be adjusted, simplified further, or gradually strengthened. Use lessons from implementation to prepare the next step, such as richer evidence, better quality control, or more regular update cycles.'
                },
                legalInstitutional: 'Confirm who has legal authority to adopt or amend the assessment basis and whether local rules, council approval, or higher-level approval are required. Make sure the chosen method is documented clearly enough that later appeals or reviews can refer back to it. Where the valuation function is institutionally separate from billing or collection, clarify the responsibilities of each unit before rollout.',
                capacitySystemsPartnerships: 'The city needs at least one team that can translate policy choices into an operational rule set and data model. Frontline staff will need a plain-language explanation of the new basis because taxpayer questions will start as soon as bills change. If external advisers or contractors help design the method, the city should retain enough internal understanding to update it later.',
                risksAndSafeguards: 'The biggest risk is overreach: choosing a method that looks modern but collapses once local data or staffing limitations appear. If the city changes the method without explaining the fairness logic, taxpayers may interpret the reform as arbitrary or purely revenue driven. If the city keeps too many legacy exceptions while changing the core method, the result may be more confusion rather than more credibility.',
                whatToMonitor: 'Completion of the options review and pilot before formal adoption. Number of properties or segments that can be assessed consistently under the new method. Staff ability to explain the basis of assessment without escalation. Early complaint patterns showing where the chosen method is least understood or hardest to apply.',
                connectionsToOtherCards: 'Use simple location and property bands to improve fairness quickly. Revalue first where the money and change are concentrated. Build a citywide baseline property inventory.',
                questionsBeforeLaunch: [
                    'What method can the city actually update on a predictable cycle?',
                    'Which local data fields are dependable enough to carry the method?',
                    'Who must approve the method, and how long will that take?',
                    'How will the city explain the fairness logic behind the chosen basis?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Use simple location and property bands to improve fairness quickly',
            shortTitle: 'Location & Property Bands',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Banding',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Improve fairness by using simple bands based on factors such as location, use, size, or building type rather than treating very different properties too similarly. This is often the most practical first step toward a more defensible assessment system.',
                mostUsefulWhen: [
                    'The city currently uses coarse rules that ignore obvious value differences.',
                    'There is not yet enough market evidence for advanced modelling, but basic location and property data exist.',
                    'Management wants a visible fairness improvement without jumping straight to full mass valuation.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not create too many bands that the administration cannot explain or maintain.',
                    'This is weak where even the underlying property facts are highly unreliable.'
                ],
                oftenWorksBestAlongside: [
                    'Start with an assessment method the city can actually keep current',
                    'Update values between full revaluations'
                ],
                politicalNote: 'Assessment reforms can become politically sensitive because they change how fairness is judged, not just how much revenue is raised. The city usually needs plain explanations, visible logic, and a route for taxpayers to question obvious mistakes.'
            },
            fullDetails: {
                whyThisMatters: 'In many cities the assessment roll treats very different properties almost the same, or assigns values through opaque individual judgments that no one can reproduce. Simple banding by location, use, size, and building type lets the city introduce meaningful differentiation without requiring a full valuation exercise. It is faster to implement, easier to explain, and far more defensible than arbitrary flat rates or outdated individual assessments. Banding also creates a structured foundation that can later be refined into more precise methods as data and capacity improve.',
                designChoices: 'How many location zones or tiers should the city use, and what objective criteria will define zone boundaries, such as proximity to major roads, land values from market evidence, or existing administrative classifications. Whether bands should combine location with use type, building quality, or size, or whether each dimension should be handled separately. How the monetary value or rate will attach to each band, for example a fixed value per band, a rate per square metre that varies by band, or a multiplier applied to a base figure. Whether the banding structure should include an explicit mechanism for properties that straddle two bands or share mixed uses.',
                practicalPath: {
                    first90Days: 'Compile and cross-check the data fields that will define the bands, testing whether the data can actually separate properties into the intended groups. Develop a draft band structure with three to five location tiers and two to four use-type or building-type categories. Run the draft structure against the current roll to estimate the revenue impact and identify properties where the band assignment would be most contentious. Present the draft to leadership with a clear comparison to the current distribution of assessments, highlighting where the most visible fairness improvements and the most visible shifts in burden will occur.',
                    sixTo12Months: 'Finalise the band definitions, publish the criteria and zone map, and open a short public comment period. Assign every property in the roll to its band and cross-check for obvious misclassifications using whatever field data, imagery, or utility records are available. Train billing and front-counter staff to explain the banding logic, because early taxpayer questions will be high volume and emotionally charged. Issue the first bills under the new bands, ideally with a comparison insert showing the old and new basis so that taxpayers can see the reasoning.',
                    twelveToTwentyFourMonths: 'Review the first full billing cycle for band accuracy, collection outcomes, and complaint patterns. Adjust zone boundaries or band definitions where the initial structure clearly misclassified a significant number of properties. Begin collecting richer data, such as actual property dimensions, construction details, or local sales prices, that could support finer differentiation or a transition to a stronger assessment method in the next cycle. Document the banding methodology clearly enough that it can be updated or replicated by staff who were not involved in the original design.'
                },
                legalInstitutional: 'Determine whether banding can be introduced under the existing assessment authority or whether formal adoption by the council or a higher body is needed. Ensure the band definitions are published and legally referenced in the assessment notice so that taxpayers know the basis on which they are being assessed. If the city operates under a national or state-level valuation framework, confirm that simplified banding is a permitted method or identify the amendment path required.',
                capacitySystemsPartnerships: 'The billing or IT system must be able to store a band assignment for every property and apply different rates or values by band. Staff who interact with taxpayers need a one-page explanation and a lookup tool that shows which band a property falls in and why. GIS or mapping support is valuable for defining and communicating location zones, but where GIS is not available, clearly described neighbourhood or ward boundaries can serve as a starting point.',
                risksAndSafeguards: 'The main risk is that bands are drawn too coarsely or too finely. Too few bands and the system still looks unfair; too many and it becomes as hard to maintain as individual valuations. Boundary effects will generate complaints from taxpayers on the lower-value side of a zone line who believe they should be in the next zone up. If banding is presented as a technical step but the real effect is a large shift in who pays more and who pays less, the political backlash can be severe if the city has not prepared the narrative. Using objective, published criteria for zone and band boundaries is the strongest protection against accusations of favouritism.',
                whatToMonitor: 'Share of roll successfully assigned to bands without manual overrides. Revenue effect compared to the prior flat-rate or nominal-value method. Volume and nature of complaints and appeals related to band assignment. Horizontal equity metrics such as the spread of assessed values within each band.',
                connectionsToOtherCards: 'Start with an assessment method the city can actually keep current. Revalue first where the money and change are concentrated. Review exemptions, reliefs, and classifications that distort bills.',
                questionsBeforeLaunch: [
                    'Does the city have enough reliable property data to define bands that taxpayers will accept as fair?',
                    'How many bands are needed to capture the main property differences without overcomplicating the system?',
                    'Who will approve the band structure, and is public consultation required before adoption?',
                    'How will the city handle properties on the boundary between two bands?',
                    'What is the communication plan for explaining why individual bills will change?'
                ]
            }
        },

        // ============================================================
        // B. Strengthen valuation evidence and methods
        // ============================================================
        {
            solutionId: 'PT-VAL-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Revalue first where the money and change are concentrated',
            shortTitle: 'Phased Revaluation',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium-High',
            politicalSensitivity: 'High',
            category: 'Phased Revaluation',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Start revaluation in zones or segments where values, change, or revenue are concentrated, rather than trying to update everything at once. This makes the first revaluation more manageable and often delivers faster revenue and fairness gains.',
                mostUsefulWhen: [
                    'The city has clear hotspots of growth or high-value property.',
                    'Resources are too limited for an immediate citywide revaluation.',
                    'Leadership wants a phased route that shows results early.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not phase revaluation in a way that looks arbitrary or politically selective.',
                    'This is a poor fit if the city cannot explain how the first zones were chosen.'
                ],
                oftenWorksBestAlongside: [
                    'Bring sales, rents, and build-cost evidence into assessments',
                    'Put revaluations on a rolling cycle'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'A citywide revaluation is often the right goal but the wrong first step, because it takes too long, costs too much, and delays the revenue improvement that justifies the effort. Phased revaluation focuses initial resources on the segments of the roll where values are most outdated, where the revenue gain is largest, or where rapid development has made existing assessments visibly unfair. This approach delivers early results, builds institutional confidence, and generates the political and financial momentum needed to extend revaluation to the rest of the roll.',
                designChoices: 'Whether to phase by geography, by property use or type, by value tier, or by staleness of the existing assessment. How many phases the full revaluation should have and what the timeline is for completing all phases. Whether values in the non-revalued segments should be left unchanged, indexed, or adjusted in some interim way to maintain reasonable horizontal equity. Whether to use the phased revaluation to test a new assessment method before applying it citywide.',
                practicalPath: {
                    first90Days: 'Rank roll segments by a combination of revenue contribution, value staleness, and data availability. Select the first-phase target and define the revaluation approach, data requirements, and staffing plan for that segment. Estimate the revenue impact and bill-change distribution for the first phase so leadership can make an informed decision about timing and communication. Brief council members and key stakeholders on why phasing is being used and how fairness between phases will be managed.',
                    sixTo12Months: 'Execute the revaluation for the first-phase segment, collecting or verifying the data needed to assign updated values. Cross-check results using whatever market evidence, construction costs, or comparable assessments are available. Publish the new values for the first phase with a clear explanation of the method and the right to appeal. Begin planning the second phase while the first phase is still in the appeals and billing cycle.',
                    twelveToTwentyFourMonths: 'Complete billing under the new first-phase values and review the revenue outcome, complaint volume, and appeal results. Launch the second phase using lessons from the first, adjusting the method, data approach, or communication strategy as needed. Update interim values in the remaining segments if the gap between revalued and non-revalued areas is creating visible inequity. Report to leadership on the phased programme timeline and recommend any adjustments to scope or pace.'
                },
                legalInstitutional: 'Verify whether the law requires simultaneous citywide revaluation or permits phased rollouts. If phasing is not explicitly authorised, identify the strongest legal basis for proceeding, such as administrative discretion in the order of assessment updates. Ensure that the phased approach is documented in a policy or council resolution that can withstand legal challenge from taxpayers in the first-revalued segments who argue they are being treated unequally.',
                capacitySystemsPartnerships: 'The city needs a revaluation team or contractor capacity dedicated to the first phase, with clear terms of reference and quality standards. The billing system must be able to apply new values to one segment while retaining old values for the rest. If the city is using the phased revaluation to pilot a new method, the team should include both method-design and field-data capacity.',
                risksAndSafeguards: 'The most common risk is that the first phase triggers political resistance that stalls the remaining phases, leaving the roll partially updated and more unequal than before. Properties in the first-revalued segment may face large increases, so a transitional relief or phase-in mechanism should be considered. If phasing is by geography, boundary effects between revalued and non-revalued zones will be noticed and challenged. Clear, consistent criteria for phase selection are the best defence against accusations of targeting.',
                whatToMonitor: 'Revenue uplift from the first-phase segment compared to the pre-revaluation baseline. Number and outcome of appeals from the revalued segment. Time and cost per property in the revaluation process, which informs planning for subsequent phases. Public and political reaction, including media coverage and council feedback, that signals whether the next phase can proceed on schedule.',
                connectionsToOtherCards: 'Start with an assessment method the city can actually keep current. Bring sales, rents, and build-cost evidence into assessments. Put revaluations on a rolling cycle.',
                questionsBeforeLaunch: [
                    'Which segments of the roll are most out of date and most revenue-significant?',
                    'Does the legal framework permit phased revaluation, or does it require citywide action?',
                    'How will the city explain to taxpayers in the first phase why they are being revalued before everyone else?',
                    'What transitional relief or phase-in will apply to large value increases?',
                    'What is the timeline and trigger for launching the second phase?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Bring sales, rents, and build-cost evidence into assessments',
            shortTitle: 'Market Evidence Base',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'Medium',
            category: 'Evidence',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use market evidence\u2014sales, rents, construction costs, or land values\u2014to anchor assessments more credibly. Even if the city cannot yet run advanced models, better evidence helps move valuations closer to current realities and makes them easier to defend.',
                mostUsefulWhen: [
                    'Some usable market data exist but are not yet feeding the tax system.',
                    'The city wants a stronger evidence base before a wider revaluation.',
                    'Valuation disputes are partly driven by the sense that the numbers are detached from reality.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not overstate data quality; weak or biased market data can damage credibility.',
                    'This is not the first move where the city has no workable property register to attach evidence to.'
                ],
                oftenWorksBestAlongside: [
                    'Revalue first where the money and change are concentrated',
                    'Move to mass valuation when data and capacity allow'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'Assessments that are not anchored to observable evidence, whether from property sales, rental transactions, or construction costs, are difficult to defend, hard to update, and prone to systematic unfairness. Building an evidence base does not mean the city must immediately adopt full market-value assessment; it means collecting and using real-world data to make whatever method is in place more accurate and credible. Even a simple banded or area-based system becomes stronger when the bands and rates are calibrated against actual transaction data rather than guesswork or historical precedent.',
                designChoices: 'Whether to prioritise sales evidence, rental evidence, or construction-cost evidence, depending on which is most available and relevant to the local property market. How the evidence will be structured and stored so that it can be linked to property records and used analytically, not just filed. Whether the evidence base will be used to directly set values, to calibrate an existing banded or area-based system, or to serve as a quality-assurance check on existing assessments. How the city will handle market segments where evidence is thin, such as industrial properties, vacant land, or informal settlements.',
                practicalPath: {
                    first90Days: 'Audit existing data sources for sales, rents, and construction costs, noting coverage, reliability, and any systematic biases such as under-declaration of sale prices. Establish a working relationship with the institutions that hold the best data, such as the land registry, stamp-duty office, or utility providers. Design a simple data-collection template that captures the key fields, including property identifier, transaction type, date, price or rent, property characteristics, and location, and begin systematic collection. Run a preliminary analysis comparing available evidence against current assessed values to identify the largest gaps and the most obvious assessment errors.',
                    sixTo12Months: 'Build the evidence into a structured database linked to the property roll, even if coverage is still incomplete. Use the evidence base to recalibrate existing band values, area rates, or notional values, starting with the market segments where evidence is strongest. Identify and investigate cases where assessed values diverge sharply from market evidence, distinguishing between genuine assessment errors and data-quality issues. Publish a summary of the evidence methodology and how it is being used, because transparency about the basis of values is a key source of legitimacy.',
                    twelveToTwentyFourMonths: 'Expand evidence collection to cover market segments that were initially underrepresented. Use ratio analysis, comparing assessed values to evidence-based values, to measure and report on the accuracy and uniformity of the roll. Feed the evidence base into the next revaluation cycle or method upgrade, whether that is a refined banding system, a phased revaluation, or a move toward mass valuation. Establish the evidence-collection and maintenance process as a permanent function rather than a project, with clear responsibilities, quality standards, and an annual reporting cycle.'
                },
                legalInstitutional: 'Determine whether there is legal authority to require disclosure of sale prices, rents, or construction costs, and whether such data can be accessed from other government agencies without additional legislation. Ensure that the use of market evidence in the assessment process is consistent with the legal basis of the property tax, whether that is market value, annual rental value, or a statutory formula. Establish data-sharing agreements with agencies that hold transaction data, with appropriate confidentiality protections.',
                capacitySystemsPartnerships: 'The city needs at least one analyst who can work with transaction data, clean it, link it to property records, and produce calibration analysis. The property database or roll system must have fields to store evidence references and evidence-derived values alongside the official assessed values. Partnerships with land registries, notary offices, real-estate associations, or construction-cost databases can dramatically improve evidence coverage without requiring the city to collect everything itself.',
                risksAndSafeguards: 'The biggest risk is using poor-quality evidence as though it were good-quality evidence, for example treating under-declared sale prices at face value and concluding that properties are over-assessed. Evidence must be screened for reliability before it is used to adjust values. If the city begins using market evidence selectively, only where it produces higher values, taxpayers will quickly perceive the system as rigged. The evidence base should be used symmetrically, to correct both over-assessment and under-assessment. If evidence collection depends on a single source, such as stamp-duty records, any change in that source, for example a shift to self-assessment, can disrupt the entire programme.',
                whatToMonitor: 'Volume and coverage of evidence collected by property type and location. Ratio of assessed values to evidence-based values, tracked over time to see whether the gap is narrowing. Number of assessment corrections or recalibrations made as a direct result of evidence analysis. Timeliness and completeness of evidence collection, ensuring it does not fall behind the billing cycle.',
                connectionsToOtherCards: 'Start with an assessment method the city can actually keep current. Use simple location and property bands to improve fairness quickly. Move to mass valuation when data and capacity allow. Tighten valuation data and quality control.',
                questionsBeforeLaunch: [
                    'What types of market evidence already exist locally, and how reliable are they?',
                    'Can the city legally access sales, rental, or construction-cost data from other agencies?',
                    'Who will be responsible for ongoing evidence collection and quality assurance?',
                    'How will the evidence be used: to directly set values, to calibrate bands, or to audit existing assessments?',
                    'What will the city do in market segments where evidence is very thin?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Move to mass valuation when data and capacity allow',
            shortTitle: 'Mass Valuation',
            timeline: '2-4 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'High',
            category: 'Mass Valuation',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use structured mass valuation methods to produce values more accurately, efficiently, and consistently across large numbers of properties. This is the scalable option once the city has enough data, quality control, and institutional capacity to support it.',
                mostUsefulWhen: [
                    'The city has a reasonably complete property roll and growing market evidence.',
                    'Manual or parcel-by-parcel methods are too slow, inconsistent, or expensive.',
                    'There is a medium-term commitment to professionalising valuation.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not start here as a prestige project when data quality is still poor.',
                    'Advanced models are not a substitute for good property facts and political preparation.'
                ],
                oftenWorksBestAlongside: [
                    'Bring sales, rents, and build-cost evidence into assessments',
                    'Put revaluations on a rolling cycle',
                    'Tighten valuation data and quality control'
                ],
                politicalNote: 'The technical risk here is overreach. Cities sometimes jump to a sophisticated model before they have the data, quality control, or communications capacity to defend the results, which can weaken the whole reform.'
            },
            fullDetails: {
                whyThisMatters: 'Mass valuation, using statistical models or computer-assisted mass appraisal to estimate the value of every property on the roll, is the strongest way to achieve accurate, uniform, and defensible assessments at scale. But it only works if the city has a reasonably complete property roll, a usable evidence base, the institutional capacity to build and maintain models, and the political environment to absorb the value changes that result. This card is about making the transition to mass valuation once those prerequisites are in place, not about rushing into it before they are.',
                designChoices: 'Whether to use a sales-comparison approach, a cost approach, an income approach, or a hybrid, depending on the property types and evidence available. Whether to build models in-house, contract with specialist valuation firms, or use a blended model with external technical support and internal institutional ownership. How many property submarket segments the model should distinguish, balancing precision against the risk of overfitting or maintaining too many separate models. How the city will handle property types where evidence is thin, such as special-purpose properties, and whether those should be modelled, valued individually, or handled through simplified rules.',
                practicalPath: {
                    first90Days: 'Complete a formal readiness assessment covering data, evidence, capacity, systems, and legal authority. If readiness gaps exist, define the remediation plan and timeline before launching the modelling work. If the city is ready to proceed, issue the terms of reference for the modelling work, whether in-house or contracted, and establish the project governance structure. Identify the first property segment or submarket to be modelled as a pilot, chosen because it has the best data and evidence coverage.',
                    sixTo12Months: 'Build and calibrate the pilot model for the first segment, testing it against holdout evidence to assess accuracy, uniformity, and bias. Review the pilot results with leadership, highlighting the distribution of value changes and the expected revenue impact. Identify data-quality issues, evidence gaps, and model weaknesses that need to be addressed before scaling. Begin staff training on the model methodology, output interpretation, and appeal response, because operational readiness matters as much as model quality.',
                    twelveToTwentyFourMonths: 'Extend the model to additional segments, adjusting the approach based on pilot lessons. Run the full model against the complete roll and produce a draft set of new values for internal review before public release. Compare the new values to the old roll to identify the largest shifts and prepare transitional relief or phase-in rules where needed. Develop the public communication plan, appeal process, and front-counter guidance for the new values.'
                },
                legalInstitutional: 'Confirm that the legal framework supports mass valuation and defines the standard of value, whether market value, annual rental value, or another basis, clearly enough to anchor the models. Ensure that the institutional home for mass valuation is defined, whether that is a city valuation unit, a regional or national valuation agency, or a contracted service. Establish the legal basis for the appeal process under the new values, including timelines, burden of proof, and the standard of review.',
                capacitySystemsPartnerships: 'Mass valuation requires sustained technical capacity: at least one team with statistical or econometric skills, property-valuation knowledge, and data-management capability. The city needs a valuation system or database that can store property characteristics, model parameters, evidence links, and output values, and that can interface with the billing system. External partnerships with valuation firms, university research departments, or international technical-assistance providers can accelerate model development, but the city must retain enough internal understanding to maintain and update the models after the initial project ends.',
                risksAndSafeguards: 'The most common failure mode is launching mass valuation before the data and evidence base are ready, producing values that cannot withstand scrutiny. If the model is treated as a black box that only the original developer understands, the city will be unable to maintain it and the values will become stale within one cycle. Large value shifts concentrated in politically sensitive areas can trigger backlash that undermines not just the revaluation but the broader property tax system. Transitional relief, phase-in rules, and proactive communication are essential safeguards. If the model is poorly calibrated for certain property types, such as informal structures or vacant land, the resulting values may be less fair than the simpler method they replace.',
                whatToMonitor: 'Model accuracy metrics: median ratio, coefficient of dispersion, and price-related differential for each property segment. Share of the roll that the model can value within acceptable accuracy thresholds. Volume and outcome of appeals, with particular attention to whether appeals reveal systematic model weaknesses. Staff ability to explain model-derived values to taxpayers and appeal panels. Revenue impact compared to the pre-mass-valuation baseline.',
                connectionsToOtherCards: 'Start with an assessment method the city can actually keep current. Bring sales, rents, and build-cost evidence into assessments. Tighten valuation data and quality control. Put revaluations on a rolling cycle.',
                questionsBeforeLaunch: [
                    'Does the city have a sufficiently complete property roll and evidence base to support mass valuation?',
                    'Is there institutional capacity to build, maintain, and explain the models?',
                    'What is the realistic budget and timeline, including data preparation, modelling, communication, and appeals?',
                    'How will the city handle property types where evidence is thin?',
                    'What transitional relief or phase-in rules will apply to large value changes?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-10',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Tighten valuation data and quality control',
            shortTitle: 'Valuation Quality Control',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium-High',
            politicalSensitivity: 'Low-Medium',
            category: 'Quality Control',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Improve the consistency of valuation data, testing, and sign-off so that assessments are easier to defend and more consistent across similar properties. Quality control is often the difference between a reform that survives and one that collapses into distrust.',
                mostUsefulWhen: [
                    'Different teams or vintages of data produce visibly uneven assessments.',
                    'Management wants more confidence before scaling up valuation reform.',
                    'The city needs a way to spot and correct systematic errors, not just individual complaints.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not turn quality control into a bureaucratic layer with no practical tests or action.',
                    'This is secondary if the city still lacks the basic data needed for any credible assessment.'
                ],
                oftenWorksBestAlongside: [
                    'Move to mass valuation when data and capacity allow',
                    'Put revaluations on a rolling cycle'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'Even a well-designed assessment method will produce poor results if the data it relies on are inconsistent, incomplete, or unchecked. Quality control is about putting in place the definitions, processes, and feedback loops that keep the valuation roll accurate over time. This includes standardising how property characteristics are recorded, running systematic checks on assessment outputs, comparing assessed values to market evidence through ratio analysis, and creating structured ways for field staff, taxpayers, and other data sources to flag and correct errors. Quality control is not a one-off exercise; it is a permanent operational discipline.',
                designChoices: 'Whether quality control should focus first on input data, such as property characteristics, or on output values, such as assessed-to-market ratios, or both in parallel. How frequently spot checks, ratio tests, and data audits should be conducted, and whether they should be scheduled or triggered by events such as complaints, building permits, or market changes. Whether the city should establish formal accuracy and uniformity targets, such as a coefficient of dispersion below a specified threshold, and report against them publicly. How feedback from taxpayers, field staff, and other agencies will be channelled into the data-correction process rather than treated as one-off complaints.',
                practicalPath: {
                    first90Days: 'Conduct a baseline data-quality review by pulling a structured sample of records and checking them against available field data, imagery, or third-party sources. Document the most common error types and estimate their prevalence across the roll. Publish internal data standards for the core fields that the assessment method relies on, including clear definitions, allowed values, and recording guidance. Establish a simple error-reporting mechanism for staff who encounter data problems during their routine work.',
                    sixTo12Months: 'Implement a scheduled spot-check programme that covers a defined share of the roll each quarter, prioritising segments where errors are most common or revenue-significant. Run the first ratio study, comparing assessed values to available sales or rental evidence, and report the results internally with recommendations for correction. Begin using building permits, utility connections, and other administrative data as triggers for automatic data-quality checks on affected properties. Train field and office staff on the data standards and quality-control procedures, with practical examples of the most common errors and how to avoid or correct them.',
                    twelveToTwentyFourMonths: 'Embed quality control into the routine operational calendar, with defined responsibilities, reporting lines, and performance metrics. Use the results of ratio studies and spot checks to identify whether errors are random or systematic, and if systematic, trace them to their root cause, such as a training gap, a data-entry interface problem, or a flawed data source. Publish a quality-control summary as part of the annual valuation report, building public and political confidence in the accuracy of the roll. Feed quality-control findings into the next revaluation cycle, method review, or evidence-collection programme so that improvements compound rather than repeat.'
                },
                legalInstitutional: 'Ensure that the city has the authority to correct assessment errors administratively without requiring a formal appeal or council action. Where data is sourced from other agencies, establish data-sharing agreements that include quality expectations and update frequencies. If the valuation function is performed by a separate agency, define the quality-control responsibilities of each institution clearly.',
                capacitySystemsPartnerships: 'The city needs at least one analyst who can run ratio studies, sample audits, and data-quality reports. The property database should support data-validation rules, audit trails, and exception reports. Partnerships with agencies that hold complementary data, such as building-permit offices, utility providers, or land registries, can provide independent quality checks at low cost. If the city uses external contractors for valuation work, quality-control standards and acceptance criteria should be written into the contract.',
                risksAndSafeguards: 'The main risk is that quality control is established as a project but not maintained as a function, so that the roll degrades again after the initial cleanup. If quality control focuses only on catching errors after the fact rather than preventing them at the point of data entry, the workload will grow faster than the team can handle. If ratio studies reveal large systematic errors, the city must be prepared to act on the findings, including correcting values that are too high as well as those that are too low, to maintain credibility.',
                whatToMonitor: 'Share of roll records reviewed through spot checks each year. Ratio-study results: median ratio, coefficient of dispersion, and price-related differential, tracked over time. Error rates by type and by segment, showing whether quality is improving or static. Time from error detection to correction. Staff compliance with data standards.',
                connectionsToOtherCards: 'Bring sales, rents, and build-cost evidence into assessments. Move to mass valuation when data and capacity allow. Update values between full revaluations. Build a citywide baseline property inventory.',
                questionsBeforeLaunch: [
                    'What are the most common data errors in the current roll, and how prevalent are they?',
                    'Are there written data standards for the core fields the assessment method relies on?',
                    'Who is responsible for quality control, and do they have the time and tools to do it?',
                    'Can the city access external data sources to cross-check roll data?',
                    'Is there a mechanism to correct errors without requiring a formal appeal?'
                ]
            }
        },

        // ============================================================
        // C. Keep assessments current
        // ============================================================
        {
            solutionId: 'PT-VAL-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Update values between full revaluations',
            shortTitle: 'Interim Value Updates',
            timeline: '< 1 year',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Interim Updates',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Use simple interim adjustments\u2014such as indexation, area-value updates, or targeted recalibration\u2014to stop assessments from becoming stale between major revaluations. This helps preserve credibility and revenue without rerunning a full citywide exercise every year.',
                mostUsefulWhen: [
                    'Full revaluations are infrequent and assessments drift quickly.',
                    'The city needs a manageable way to keep bills from lagging too far behind reality.',
                    'There is at least some evidence base for interim adjustments.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not use formulaic updates to mask a deeply outdated base forever.',
                    'This is not appropriate where the starting values are so poor that they first need a real reset.'
                ],
                oftenWorksBestAlongside: [
                    'Use simple location and property bands to improve fairness quickly',
                    'Put revaluations on a rolling cycle'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'Between full revaluations, property values drift. Markets move, construction occurs, uses change, and the roll becomes increasingly stale. Interim updates, whether through indexation, factor adjustments, or targeted recalibration, keep assessed values closer to reality and prevent the large, politically difficult jumps that occur when values are only updated once a decade. Interim updates also protect the revenue base from being eroded by inflation or market growth that the frozen roll does not capture.',
                designChoices: 'Whether to apply a single uniform index to the entire roll or differentiated indices by property type, use, or location. Whether the index should be based on a national price indicator, a local construction-cost measure, a rental index, or a blended factor. Whether interim updates should be automatic, applying each year without further approval, or require annual council or administrative authorisation. Whether to cap annual increases to limit taxpayer impact, and if so, at what level and whether the cap should be fixed or linked to the index itself.',
                practicalPath: {
                    first90Days: 'Review available indices and select the one that best reflects local property-value changes while being publicly credible and independently produced. Analyse the impact of applying the index to the current roll, modelling the revenue effect and the distribution of bill changes by property type and location. Prepare a recommendation for leadership that includes the proposed index, the application method, any cap on annual increases, and the communication plan. If legal authority needs to be confirmed or obtained, begin that process immediately.',
                    sixTo12Months: 'Apply the first interim update to the roll and issue adjusted bills. Communicate the update clearly to taxpayers, explaining what the index is, why it is being used, and how it affects individual bills. Monitor the complaint volume and nature to identify whether the chosen index is producing results that taxpayers perceive as reasonable. Review the revenue impact and compare it to the projection.',
                    twelveToTwentyFourMonths: 'Continue annual application of the index, adjusting the factor each year based on the latest data. Review whether the index is keeping assessed values reasonably aligned with market reality or whether cumulative drift is appearing in certain segments. Use the interim-update period to prepare for the next full revaluation, treating interim updates as a bridge rather than a permanent substitute. Report publicly on the index, its effect, and the planned timeline for the next revaluation.'
                },
                legalInstitutional: 'Confirm whether existing law permits interim value adjustments and what form they must take, such as an annual council resolution, an administrative order, or an automatic statutory mechanism. If the law is silent or ambiguous, seek a formal legal opinion before applying the first update. Ensure that the adjustment method is documented and published so that taxpayers can verify their updated value.',
                capacitySystemsPartnerships: 'Interim updates are operationally simple if the billing system can apply a multiplier or factor to assessed values. The city needs access to the chosen index, ideally from an independent, publicly available source. Staff who handle taxpayer queries need to understand the index and be able to explain it in plain terms. If the city uses differentiated indices by segment, the data and analytical capacity to maintain multiple factors is needed.',
                risksAndSafeguards: 'If the chosen index does not reflect local property-market conditions well, values will drift in the wrong direction and the interim update will reduce rather than improve assessment accuracy. If increases are capped too tightly, the revenue benefit is lost; if uncapped, the political risk increases. If interim updates are applied for too many years without a full revaluation, the cumulative effect may be less fair than a revaluation because the index cannot capture differential changes across property types and locations. The city should set a clear policy that interim updates do not replace the need for periodic full revaluation.',
                whatToMonitor: 'Revenue change attributable to the interim update each year. Ratio of updated assessed values to available market evidence, tracking whether the index is keeping values aligned. Volume and nature of complaints related to the interim adjustment. Cumulative divergence between indexed values and actual market values over multiple years.',
                connectionsToOtherCards: 'Revalue first where the money and change are concentrated. Put revaluations on a rolling cycle. Tighten valuation data and quality control.',
                questionsBeforeLaunch: [
                    'What index or adjustment factor is available, credible, and relevant to local property values?',
                    'Does the legal framework permit interim value updates between full revaluations?',
                    'Should the update be uniform or differentiated by property type or location?',
                    'Will annual increases be capped, and if so, at what level?',
                    'How will the city communicate the update to taxpayers?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Put revaluations on a rolling cycle',
            shortTitle: 'Rolling Revaluation Cycle',
            timeline: '1-3 years',
            deliveryDifficulty: 'High',
            politicalSensitivity: 'High',
            category: 'Revaluation Cycle',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Move from sporadic, politically delayed revaluations to a predictable cycle with clear responsibility, budget, and timing. Regularity matters because equity and credibility decay when revaluations happen only after long gaps.',
                mostUsefulWhen: [
                    'The city has historically delayed revaluations until the system becomes politically or technically brittle.',
                    'Management wants to avoid future backlogs and spikes in tax change.',
                    'There is enough institutional stability to commit to a repeating cycle.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not announce a cycle that the city cannot finance or administratively sustain.',
                    'A rolling cycle is not useful if the city still lacks a workable valuation method.'
                ],
                oftenWorksBestAlongside: [
                    'Revalue first where the money and change are concentrated',
                    'Move to mass valuation when data and capacity allow',
                    'Update values between full revaluations'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'Most cities that have a property tax understand that revaluation is necessary, but few manage to do it on a regular, predictable schedule. Revaluations get delayed because they are expensive, politically sensitive, and operationally disruptive. The result is long intervals during which the roll becomes increasingly inaccurate and unfair, followed by a sudden revaluation that produces large value shifts and concentrated political opposition. A rolling revaluation cycle, where a defined portion of the roll is revalued each year on a fixed rotation, replaces the sporadic, crisis-driven pattern with a predictable operational routine that smooths costs, spreads political risk, and keeps the roll continuously fresh.',
                designChoices: 'How long the full rotation should be, typically three to six years depending on the size of the roll and the capacity available. Whether to rotate by geography, by property type, by value tier, or by some other criterion, and how to handle properties that straddle rotation boundaries. How to maintain reasonable equity between segments that were revalued recently and those still awaiting their turn, for example through interim indexation or adjustment factors. Whether to publish the full rotation schedule in advance so that taxpayers know when their area will be revalued.',
                practicalPath: {
                    first90Days: 'Define the rotation plan, including the number of annual segments, the sequence, and the criteria for assigning properties to each segment. Estimate the annual cost, staffing, and data requirements for each year of the cycle. Present the plan to leadership and council with a comparison to the cost and risk profile of continuing with ad-hoc revaluations. If legal amendments are needed, begin the drafting and consultation process immediately.',
                    sixTo12Months: 'Launch the first annual segment of the rolling cycle, applying the same revaluation methodology and quality standards that would be used in a full revaluation. Communicate to taxpayers in the first segment what is happening, why, and what their rights are. Begin preparing the second segment so that there is no gap between years. Establish the monitoring and reporting framework that will track the cycle\'s progress and performance over time.',
                    twelveToTwentyFourMonths: 'Complete the first segment and begin the second. Review the first-year results for accuracy, cost, complaint volume, and revenue impact, and adjust the approach for subsequent segments if needed. Apply interim indexation or adjustment factors to segments not yet reached by the cycle, so that the gap between recently revalued and not-yet-revalued areas does not grow too large. Report to council on the cycle\'s progress, reinforcing the institutional commitment to the schedule.'
                },
                legalInstitutional: 'Many legal frameworks assume or require simultaneous citywide revaluation, so adopting a rolling cycle may require legislative or regulatory amendment. The cycle should be established in law or formal policy rather than left to administrative discretion, so that future political pressure to delay or skip a year is harder to sustain. Define the legal date of valuation for each segment clearly, because staggered valuation dates create complexity for appeals and for maintaining equity across the roll.',
                capacitySystemsPartnerships: 'A rolling cycle requires permanent valuation capacity rather than periodic project mobilisation. The city needs a stable team of valuers, data analysts, and field inspectors, or a long-term contract with a valuation firm, sized to handle one annual segment per year. The property database must support tracking which properties have been revalued and when, and the billing system must apply different value-base dates for different segments. If the city partners with a national valuation agency or contracts with external firms, the contract terms should align with the cycle schedule and quality standards.',
                risksAndSafeguards: 'The most common risk is that the cycle is launched but then interrupted or abandoned after the first or second year due to budget pressure, political resistance, or leadership change. Embedding the cycle in law or formal policy, rather than relying on annual budget approval, is the strongest safeguard. If interim adjustments for non-revalued segments are not applied, the gap in values between recently revalued and not-yet-revalued areas will be visible and politically exploitable. If the cycle is too short, the annual workload may be unmanageable; if too long, the benefits of freshness are lost.',
                whatToMonitor: 'Whether each annual segment is completed on schedule and within budget. Accuracy and uniformity metrics for each revalued segment, using ratio studies where evidence is available. Revenue impact of each annual segment compared to the pre-revaluation baseline. Complaint and appeal volume and outcomes for each segment. Public and political acceptance of the rolling approach versus the prior ad-hoc pattern.',
                connectionsToOtherCards: 'Revalue first where the money and change are concentrated. Update values between full revaluations. Tighten valuation data and quality control. Bring sales, rents, and build-cost evidence into assessments.',
                questionsBeforeLaunch: [
                    'How many years should the full rotation take, given the size of the roll and available capacity?',
                    'Does the legal framework permit rolling revaluation, or is an amendment required?',
                    'How will the city maintain equity between recently revalued and not-yet-revalued segments?',
                    'Is the annual budget and staffing sufficient to sustain the cycle permanently?',
                    'How will the rotation schedule be communicated to taxpayers and stakeholders?'
                ]
            }
        },

        // ============================================================
        // D. Protect fairness in rule application and review
        // ============================================================
        {
            solutionId: 'PT-VAL-08',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Review exemptions, reliefs, and classifications that distort bills',
            shortTitle: 'Exemption & Relief Review',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium-High',
            politicalSensitivity: 'High',
            category: 'Exemption Review',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Check whether property classifications, exemptions, reliefs, or bands are being applied accurately and whether they still make sense in practice. In many cities, assessment fairness problems are partly driven by misclassification or overuse of special treatment rather than valuation alone.',
                mostUsefulWhen: [
                    'Too many properties appear to benefit from outdated or weakly controlled special treatment.',
                    'The city has evidence of classification disputes or revenue loss through relief misuse.',
                    'Leaders are open to tackling bill distortions as part of assessment reform.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not frame this as purely technical if the real issue is political protection of exemptions.',
                    'This is not the first move where the main problem is simply missing valuation data.'
                ],
                oftenWorksBestAlongside: [
                    'Create a clear, time-bound valuation review and appeal process',
                    'Send bills people can understand'
                ],
                politicalNote: 'Even when the issue looks administrative, special treatment often has political defenders. The city normally needs a careful evidence base and a clear fairness argument before tightening this area.'
            },
            fullDetails: {
                whyThisMatters: 'In many cities a significant share of the potential tax base is lost not because properties are unregistered or undervalued, but because they are exempt, receive a relief, or are classified in a way that reduces or eliminates their liability. Some of these provisions are intentional and well-targeted; others have accumulated over time, are poorly defined, are not verified, or are being exploited in ways that were never intended. Reviewing and tightening exemptions, reliefs, and classifications is one of the fastest ways to improve revenue equity and yield without changing the underlying valuation method or tax rate.',
                designChoices: 'Whether to conduct a comprehensive review of all exemptions and reliefs at once or to prioritise the provisions with the largest revenue cost or the most suspected abuse. Whether to tighten eligibility criteria, add periodic re-verification requirements, introduce sunset clauses, or cap the value of relief. Whether to consolidate multiple overlapping provisions into a simpler, more transparent framework. How to handle transitional arrangements for properties that will lose an exemption or relief under the revised rules.',
                practicalPath: {
                    first90Days: 'Complete the inventory of all exemptions, reliefs, and classifications, including the legal basis, the number of properties affected, and the estimated revenue cost or forgone revenue for each. Identify the three to five provisions with the largest revenue impact or the most suspected misuse. Pull a sample of properties under each priority provision and verify whether they still meet the eligibility criteria. Present the findings to leadership with options for reform, including the revenue potential, the legal pathway, and the political sensitivity of each option.',
                    sixTo12Months: 'Draft the revised rules for the priority provisions, including tighter eligibility criteria, re-verification requirements, and any transitional arrangements. Take the draft through the required legal and political approval process, which may involve council debate, public consultation, or legislative amendment depending on the provision. Notify affected property owners of the change, the new eligibility criteria, and the process for demonstrating continued eligibility. Begin re-verifying properties under the revised rules, starting with the highest-value or most obviously questionable cases.',
                    twelveToTwentyFourMonths: 'Complete the re-verification for all properties under the revised priority provisions and update the roll accordingly. Bill the properties that no longer qualify for the exemption or relief, with clear communication about the basis for the change. Extend the review to the remaining provisions, applying the same inventory-verify-reform approach. Establish a permanent process for periodic re-verification of all exemption and relief eligibility, rather than treating this as a one-off exercise. Report the revenue recovered and the fairness improvement to leadership and the public.'
                },
                legalInstitutional: 'Many exemptions are embedded in national or state law and cannot be changed locally; the review should clearly distinguish these from locally discretionary provisions. Where the city has discretion, confirm the process required to amend or revoke an exemption, which may involve council resolution, bylaw amendment, or regulatory change. Ensure that the re-verification and removal process includes due notice and a right to respond for affected property owners, to avoid legal challenge.',
                capacitySystemsPartnerships: 'The billing system must be able to flag and track exemptions, reliefs, and classifications by type and by property, and to generate reports on the number of properties and revenue cost for each provision. Staff who handle exemption applications and renewals need clear, written eligibility criteria and verification procedures. If re-verification requires field inspection, such as confirming that a property is still used for the exempt purpose, field-staff capacity must be planned. Partnerships with other government agencies, such as business registries or social-welfare departments, can help verify eligibility more efficiently than self-reporting alone.',
                risksAndSafeguards: 'Removing or tightening exemptions is politically sensitive because it creates identifiable losers, often including well-organised interest groups such as religious institutions, diplomatic missions, or politically connected businesses. The strongest safeguard is transparency: publishing the full inventory of exemptions with their revenue cost, so that the public can see the scale of the issue and the fairness rationale for reform. If the city removes exemptions without adequate notice or transitional arrangements, the backlash may prevent further reform. If re-verification is applied inconsistently, such as only to politically weak groups, the reform will lose credibility.',
                whatToMonitor: 'Number of properties reviewed and share found to be ineligible or misclassified. Revenue recovered from removing unjustified exemptions or reclassifying properties. Complaint and appeal volume from affected property owners. Ongoing compliance with re-verification schedules, ensuring the process does not lapse after the initial push.',
                connectionsToOtherCards: 'Use simple location and property bands to improve fairness quickly. Tighten valuation data and quality control. Create a clear, time-bound valuation review and appeal process. Build a citywide baseline property inventory.',
                questionsBeforeLaunch: [
                    'What is the full inventory of exemptions, reliefs, and preferential classifications, and what is the revenue cost of each?',
                    'Which provisions are mandatory under higher-level law and which are locally discretionary?',
                    'How is eligibility currently verified, and how often?',
                    'Which provisions have the largest revenue impact or the most suspected misuse?',
                    'What transitional arrangements will apply to properties that lose their exemption or relief?'
                ]
            }
        },
        {
            solutionId: 'PT-VAL-09',
            stream: 'Property Tax',
            streamType: 'property-based',
            subgroup: null,
            gap: 'Valuation',
            title: 'Create a clear, time-bound valuation review and appeal process',
            shortTitle: 'Valuation Appeals Process',
            timeline: '1-2 years',
            deliveryDifficulty: 'Medium',
            politicalSensitivity: 'Medium',
            category: 'Appeals',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisOptionDoes: 'Provide a simple administrative route for taxpayers to question values, classifications, or major factual assumptions within a clear time window. A credible review process makes valuation reform easier to defend and helps surface recurring errors.',
                mostUsefulWhen: [
                    'The city is introducing or refreshing assessments and expects objections.',
                    'Current complaints have no clear route except political escalation or court action.',
                    'Leaders want stronger legitimacy around valuation decisions.'
                ],
                usuallyNotBestFirstMove: [
                    'Do not create a formal appeal path without capacity to decide cases on time.',
                    'This is not a substitute for fixing obvious factual errors directly.'
                ],
                oftenWorksBestAlongside: [
                    'Review exemptions, reliefs, and classifications that distort bills',
                    'Set up a help desk and quick fixes for billing mistakes'
                ],
                politicalNote: 'Valuation reforms are usually easier to defend when they are presented as fairness and credibility measures, not simply as ways to raise more money. Sudden unexplained changes in bills tend to provoke resistance.'
            },
            fullDetails: {
                whyThisMatters: 'Taxpayers need a credible way to challenge their assessed values and property classifications. Without one, perceived unfairness festers into non-compliance, political opposition, and legal risk. A well-designed appeal process does more than resolve individual disputes; it provides a pressure valve that makes the rest of the valuation system politically sustainable, generates information about where the roll is weakest, and demonstrates that the city takes fairness seriously. But an appeal process that is too slow, too costly, or too opaque can be as damaging as having none at all.',
                designChoices: 'Whether to require an informal administrative review before allowing a formal appeal, which can resolve simple errors quickly and reduce the volume reaching the formal stage. How the appeal body will be constituted: a standing panel of independent members, rotating appointees, or a mix of technical valuers and lay members. Whether appeals should be heard on paper only, in person, or through a hybrid process. What the burden of proof should be: must the taxpayer show that the value is wrong, or must the city defend the value? Whether to allow group appeals where many properties in the same area or category raise the same objection.',
                practicalPath: {
                    first90Days: 'Map the current appeal process, if any, including average resolution time, volume, outcomes, and known bottlenecks. Design the target process with defined stages, time limits, documentation requirements, and decision criteria. Identify and recruit or designate the members of the appeal body, ensuring appropriate independence and expertise. Prepare the forms, guidance documents, and communication materials that taxpayers will need to understand and use the process.',
                    sixTo12Months: 'Launch the appeal process, timed to coincide with the issuance of new or updated assessment notices. Publicise the process widely, including the right to appeal, the time limits, and the steps involved, through bill inserts, online information, and front-counter displays. Process the first wave of appeals, tracking volume, nature, and resolution time to identify early bottlenecks. Provide feedback to the valuation team on the types of errors and objections that appeals are revealing, so that systematic issues can be addressed at the source.',
                    twelveToTwentyFourMonths: 'Review the first full cycle of the appeal process, analysing outcomes, resolution times, and taxpayer satisfaction. Identify whether the process is being used broadly or only by well-resourced taxpayers, and if access is uneven, consider simplification or outreach measures. Use appeal data to improve the valuation roll, treating appeals not just as individual corrections but as a quality-assurance signal. Refine the process based on experience, adjusting time limits, documentation requirements, or hearing formats as needed. Report publicly on appeal volumes, outcomes, and resolution times to build confidence in the system.'
                },
                legalInstitutional: 'The appeal process must be grounded in law or regulation, with clear provisions for the right to appeal, the time limits for filing and decision, the composition and authority of the appeal body, and the enforceability of its decisions. Where the valuation function is performed by a national or regional agency, the appeal route may need to align with that agency\'s procedures. Ensure that the appeal process does not suspend the obligation to pay tax while the appeal is pending, or if it does, establish clear rules about payment of the undisputed amount and interest on the disputed portion.',
                capacitySystemsPartnerships: 'The appeal body needs administrative support: scheduling, file management, decision drafting, and communication with taxpayers. The property database should track appeal status for each property, including filing date, stage, hearing date, decision, and any value adjustment, so that the billing system can apply corrections promptly. Staff who handle initial queries and informal reviews need training on the most common objection types and the authority to resolve clear errors without escalation. If the city expects a high volume of appeals, such as after a major revaluation, temporary surge capacity should be planned in advance.',
                risksAndSafeguards: 'If the appeal process is too easy and too generous, it can become a routine tax-reduction strategy rather than a fairness mechanism, eroding the valuation base. If it is too difficult or slow, taxpayers will not use it and the legitimacy benefit is lost. Time limits are the single most important design feature: without them, appeals accumulate, decisions are delayed, and the process loses credibility. If the appeal body lacks independence, such as when appeals are heard by the same unit that set the values, taxpayers will not trust the outcome even if the decisions are correct. If appeal outcomes are not fed back into the roll, the same errors will recur in the next cycle.',
                whatToMonitor: 'Number of appeals filed as a share of assessment notices issued. Average and maximum resolution time at each stage. Outcome distribution: upheld, reduced, increased, or dismissed. Revenue impact of appeal-driven value reductions. Whether appeal patterns reveal systematic valuation weaknesses by property type or location. Taxpayer satisfaction with the process, assessed through surveys or complaint analysis.',
                connectionsToOtherCards: 'Review exemptions, reliefs, and classifications that distort bills. Tighten valuation data and quality control. Start with an assessment method the city can actually keep current. Revalue first where the money and change are concentrated.',
                questionsBeforeLaunch: [
                    'Does a formal appeal process currently exist, and if so, what are its main weaknesses?',
                    'What time limits will apply at each stage, and are they enforceable?',
                    'Who will hear appeals, and is the body sufficiently independent to be credible?',
                    'How will appeal outcomes be fed back into the valuation roll to prevent recurring errors?',
                    'What happens to the tax obligation while an appeal is pending?'
                ]
            }
        }
    ];

})(window);
