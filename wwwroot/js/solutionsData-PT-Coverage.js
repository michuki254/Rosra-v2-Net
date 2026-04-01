/**
 * Property Tax - Coverage Solutions (19)
 * Full details for all coverage gap solutions
 */
(function(window) {
    'use strict';

    window.SolutionsDataPTCoverage = [
        {
            solutionId: 'PT-COV-01',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Registration: Launch simple property self-registration portal',
            shortTitle: 'Self-Registration Portal',
            timeline: '<1 year',
            category: 'Registration',
            sortOrder: 1,
            isActive: true,
            overview: {
                whatThisSolves: 'Property owners cannot easily register; registration requires visits to multiple offices.',
                whatYouDo: 'Create online/mobile portal for property owners to self-register; collect basic information; verify and add to roll.',
                whenThisFitsBest: 'Internet access is available; owners are motivated to register (e.g., for services).',
                minimumEnablers: 'Web/mobile platform; verification process; data entry capacity.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to accept electronic registration',
                    'Data requirements for valid registration',
                    'Verification procedures'
                ],
                howItWorks: 'Create a simple web form/mobile app where property owners enter: location, size, use type, owner details, contact information. Include map-based location selection. Staff verify submissions against available data and conduct spot checks. Verified properties are added to the roll.',
                implementationMilestones: [
                    'Design registration form with minimum required fields',
                    'Build/configure web portal and mobile interface',
                    'Establish verification workflow',
                    'Launch with publicity campaign',
                    'Monitor submissions and verification rates'
                ],
                administrativeEssentials: [
                    'Staff for verification',
                    'Data entry and quality control',
                    'Helpdesk for questions'
                ],
                whenNotApplicable: [
                    'No internet/mobile access',
                    'No verification capacity',
                    'Owners have no incentive to register'
                ],
                caseNotes: 'Self-registration works best when linked to service access or tax clearance requirements. Make it easier to register than to avoid registration.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-02',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Data cross-matching: Compare permits, land registry, utilities',
            shortTitle: 'Data Cross-Matching',
            timeline: '<1 year',
            category: 'Data',
            sortOrder: 2,
            isActive: true,
            overview: {
                whatThisSolves: 'Unregistered properties have records in other systems that are not being used.',
                whatYouDo: 'Cross-match property roll against: building permits, land registry, utility connections, business licenses.',
                whenThisFitsBest: 'Other databases exist and can be accessed; data quality is reasonable.',
                minimumEnablers: 'Data sharing agreements; matching capability; follow-up process for new finds.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data sharing authority',
                    'Privacy protections',
                    'Inter-agency agreements'
                ],
                howItWorks: 'Obtain data extracts from: building permits (new construction), land registry (property ownership), utility companies (service connections), business licenses (commercial properties). Match against property register using address and owner name. Investigate non-matches to identify unregistered properties.',
                implementationMilestones: [
                    'Identify data sources and negotiate access',
                    'Develop matching methodology',
                    'Conduct initial cross-match exercise',
                    'Follow up on potential unregistered properties',
                    'Establish regular cross-matching schedule'
                ],
                administrativeEssentials: [
                    'Data management capacity',
                    'Investigation staff',
                    'Ongoing data sharing relationships'
                ],
                whenNotApplicable: [
                    'No other databases exist',
                    'Data quality too poor for matching',
                    'Legal barriers to data sharing'
                ],
                caseNotes: 'Cross-matching is cost-effective for finding missing properties. Start with highest-quality data sources.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-03',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Field canvass: Run ward-level door-to-door sweeps',
            shortTitle: 'Door-to-Door Canvassing',
            timeline: '1-3 years',
            category: 'Field',
            sortOrder: 3,
            isActive: true,
            overview: {
                whatThisSolves: 'Many properties are not in any database; only physical inspection finds them.',
                whatYouDo: 'Organize systematic ward-by-ward canvass; identify all properties; collect basic information; update register.',
                whenThisFitsBest: 'Register is significantly incomplete; field capacity exists or can be mobilized.',
                minimumEnablers: 'Field teams; data collection tools (tablets/forms); supervisor oversight; data entry.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority for property inspection',
                    'Identification requirements for canvassers',
                    'Data collection permissions'
                ],
                howItWorks: 'Divide city into enumeration areas. Teams of 2-3 canvassers systematically visit every plot, recording: presence of structures, apparent use, owner/occupant information if available, GPS coordinates. Data is reviewed, quality-checked, and matched against existing register. New properties are added.',
                implementationMilestones: [
                    'Plan enumeration areas and logistics',
                    'Recruit and train canvassers',
                    'Develop data collection tools and protocols',
                    'Execute canvass ward-by-ward',
                    'Process data and update register'
                ],
                administrativeEssentials: [
                    'Field team management',
                    'Quality control and supervision',
                    'Data processing capacity',
                    'Follow-up for incomplete information'
                ],
                whenNotApplicable: [
                    'No field capacity',
                    'Security concerns',
                    'Register is already complete'
                ],
                caseNotes: 'Physical canvassing is labor-intensive but reliable. Consider combining with other data collection (e.g., valuation data).',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-04',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Remote sensing: Use satellite/aerial/drone imagery',
            shortTitle: 'Satellite/Drone Imagery',
            timeline: '1-3 years',
            category: 'Technology',
            sortOrder: 4,
            isActive: true,
            overview: {
                whatThisSolves: 'Field canvass is slow and expensive; imagery can identify structures faster.',
                whatYouDo: 'Acquire satellite or drone imagery; use image analysis to identify structures; compare against register.',
                whenThisFitsBest: 'Urban area with defined boundaries; imagery is available or affordable.',
                minimumEnablers: 'Imagery access; GIS capability; change detection tools; verification process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to use aerial imagery',
                    'Privacy considerations',
                    'Data retention rules'
                ],
                howItWorks: 'Acquire recent high-resolution satellite or drone imagery. Use GIS tools to identify building footprints. Compare detected structures against property register. Flag potential unregistered properties for field verification. Use periodic imagery to detect new construction.',
                implementationMilestones: [
                    'Assess imagery options and costs',
                    'Acquire baseline imagery',
                    'Develop or procure analysis tools',
                    'Match structures to register',
                    'Verify and register new properties'
                ],
                administrativeEssentials: [
                    'GIS/remote sensing expertise',
                    'Verification field capacity',
                    'Regular imagery updates'
                ],
                whenNotApplicable: [
                    'Dense informal settlements where structures are hard to distinguish',
                    'No GIS capacity',
                    'Cost exceeds benefit'
                ],
                caseNotes: 'Satellite imagery is increasingly affordable. Consider partnerships with mapping organizations.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-05',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Baseline mapping: Complete citywide survey and mapping',
            shortTitle: 'Citywide Baseline Survey',
            timeline: '1-3 years',
            category: 'Mapping',
            sortOrder: 5,
            isActive: true,
            overview: {
                whatThisSolves: 'No complete inventory of taxable properties exists; planning is guesswork.',
                whatYouDo: 'Conduct comprehensive survey of all properties; create geo-referenced property map; establish baseline.',
                whenThisFitsBest: 'Starting from scratch or major gaps; resources available for comprehensive exercise.',
                minimumEnablers: 'Survey teams; GIS platform; mapping expertise; data management system.'
            },
            fullDetails: {
                legalEssentials: [
                    'Survey authority',
                    'Data standards',
                    'Baseline establishment procedures'
                ],
                howItWorks: 'Comprehensive effort to map and register every property in the jurisdiction. Combines satellite imagery, field verification, and data collection. Each property receives unique identifier and geo-coordinates. Creates foundation for ongoing maintenance.',
                implementationMilestones: [
                    'Design survey methodology and data standards',
                    'Acquire/produce base maps',
                    'Conduct field surveys by zone',
                    'Process and quality-check data',
                    'Establish property register database'
                ],
                administrativeEssentials: [
                    'Project management',
                    'Field teams and supervision',
                    'GIS and data management',
                    'Quality assurance'
                ],
                whenNotApplicable: [
                    'Recent comprehensive survey exists',
                    'Resources are insufficient',
                    'Incremental approaches are more practical'
                ],
                caseNotes: 'A baseline survey is a significant investment but provides foundation for years of property tax administration.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-06',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Liability rule: Bill owner where known; otherwise bill occupier',
            shortTitle: 'Owner/Occupier Billing Rule',
            timeline: '<1 year',
            category: 'Policy',
            sortOrder: 6,
            isActive: true,
            overview: {
                whatThisSolves: 'Unknown ownership blocks taxation; properties go untaxed indefinitely.',
                whatYouDo: 'Establish clear rule: bill registered owner; if unknown, bill occupier; occupier can recover from owner.',
                whenThisFitsBest: 'Ownership records are incomplete; legal authority to bill occupiers.',
                minimumEnablers: 'Legal framework; billing system flexibility; occupier identification process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to bill occupiers',
                    'Occupier rights to recover from owner',
                    'Notice requirements'
                ],
                howItWorks: 'Change billing policy: First attempt to bill registered owner. If owner unknown or untraceable, bill the occupier. Occupier is notified they can recover from actual owner. This ensures no property escapes taxation due to ownership uncertainty.',
                implementationMilestones: [
                    'Review/amend legal framework',
                    'Update billing procedures',
                    'Train staff on new policy',
                    'Communicate policy to public',
                    'Monitor implementation'
                ],
                administrativeEssentials: [
                    'Occupier identification',
                    'Billing system updates',
                    'Dispute handling'
                ],
                whenNotApplicable: [
                    'Legal framework does not permit',
                    'Occupier identification is impossible'
                ],
                caseNotes: 'This simple policy change can bring many properties into taxation that were previously skipped.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-07',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Digital register: Build official digital property register',
            shortTitle: 'Digital Property Register',
            timeline: '1-3 years',
            category: 'Systems',
            sortOrder: 7,
            isActive: true,
            overview: {
                whatThisSolves: 'Paper records are incomplete, inaccessible, and hard to update.',
                whatYouDo: 'Digitize existing records; create structured database; establish unique identifiers; enable updates.',
                whenThisFitsBest: 'Paper records exist; digitization capacity available; ongoing maintenance planned.',
                minimumEnablers: 'Database system; data entry capacity; quality control; backup procedures.'
            },
            fullDetails: {
                legalEssentials: [
                    'Digital records authority',
                    'Data standards requirements',
                    'Update procedures'
                ],
                howItWorks: 'Convert paper property records to structured digital database. Each property gets unique ID. Fields include: location, owner, size, use, valuation basis. System allows queries, updates, and report generation. Establish backup and security procedures.',
                implementationMilestones: [
                    'Design database structure',
                    'Set up database system',
                    'Digitize existing records',
                    'Quality check and de-duplicate',
                    'Establish update procedures'
                ],
                administrativeEssentials: [
                    'Database administration',
                    'Data entry staff',
                    'Quality control',
                    'IT support'
                ],
                whenNotApplicable: [
                    'No records exist to digitize',
                    'No IT capacity',
                    'No maintenance capability'
                ],
                caseNotes: 'Digital register is foundation for modern property tax administration. Plan for ongoing maintenance from the start.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-08',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'System connections: Connect register to permits, land registry',
            shortTitle: 'System Integration',
            timeline: '1-3 years',
            category: 'Integration',
            sortOrder: 8,
            isActive: true,
            overview: {
                whatThisSolves: 'Property register becomes outdated as soon as created; changes not captured.',
                whatYouDo: 'Create data feeds from building permits, land registry, utilities; automatically flag new properties.',
                whenThisFitsBest: 'Other systems are digital; API/data sharing is possible.',
                minimumEnablers: 'System interoperability; data sharing agreements; matching logic; workflow for new entries.'
            },
            fullDetails: {
                legalEssentials: [
                    'Inter-system data sharing authority',
                    'Data governance framework',
                    'Update protocols'
                ],
                howItWorks: 'Establish automated data feeds: When building permit issued, flag for property register. When land transfer recorded, update ownership. When new utility connection made, verify property registration. System alerts staff to review and process changes.',
                implementationMilestones: [
                    'Map data flows between systems',
                    'Negotiate data sharing agreements',
                    'Develop integration interfaces',
                    'Test automated data exchange',
                    'Establish exception handling procedures'
                ],
                administrativeEssentials: [
                    'Integration maintenance',
                    'Exception handling staff',
                    'Data quality monitoring'
                ],
                whenNotApplicable: [
                    'Source systems are not digital',
                    'No technical integration capability',
                    'Data sharing prohibited'
                ],
                caseNotes: 'Integration keeps register current with minimal effort. Start with highest-value integrations (land registry, permits).',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-09',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Coverage check-ups: Schedule periodic mini-audits',
            shortTitle: 'Periodic Coverage Audits',
            timeline: '<1 year',
            category: 'Maintenance',
            sortOrder: 9,
            isActive: true,
            overview: {
                whatThisSolves: 'Coverage gaps re-emerge over time without ongoing verification.',
                whatYouDo: 'Schedule quarterly or annual mini-surveys in selected areas; compare field findings to register.',
                whenThisFitsBest: 'Initial coverage exercise is complete; maintenance mode needed.',
                minimumEnablers: 'Field capacity; sampling methodology; follow-up process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Audit authority',
                    'Access rights for verification'
                ],
                howItWorks: 'Select sample areas each quarter for verification. Field teams compare actual structures to register. New, modified, or demolished properties are flagged. Updates are processed. Track coverage metrics over time.',
                implementationMilestones: [
                    'Design sampling methodology',
                    'Schedule regular audit cycles',
                    'Train verification teams',
                    'Conduct audits and process findings',
                    'Report on coverage trends'
                ],
                administrativeEssentials: [
                    'Audit planning and scheduling',
                    'Field verification capacity',
                    'Data update processing'
                ],
                whenNotApplicable: [
                    'No baseline exists',
                    'No field capacity'
                ],
                caseNotes: 'Regular audits maintain coverage and deter non-registration. Focus on high-growth areas.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-10',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Transaction triggers: Require tax-clearance for transfers',
            shortTitle: 'Transfer Tax Clearance',
            timeline: '1-3 years',
            category: 'Triggers',
            sortOrder: 10,
            isActive: true,
            overview: {
                whatThisSolves: 'Property changes hands without being added to tax roll.',
                whatYouDo: 'Require proof of tax registration before property transfer; integrate with land registry.',
                whenThisFitsBest: 'Land registry functions; legal authority exists.',
                minimumEnablers: 'Legal requirement; registry integration; clearance issuance process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Registration requirement for transfers',
                    'Land registry integration authority',
                    'Clearance procedures'
                ],
                howItWorks: 'Before any property transfer is registered, seller must show property is registered for tax and current. If not registered, property must be added before transfer proceeds. This catches unregistered properties at transaction point.',
                implementationMilestones: [
                    'Establish legal requirement',
                    'Create clearance certificate process',
                    'Integrate with land registry',
                    'Train registry staff',
                    'Monitor compliance'
                ],
                administrativeEssentials: [
                    'Clearance issuance',
                    'Registry coordination',
                    'Exception handling'
                ],
                whenNotApplicable: [
                    'No land registry',
                    'Informal transfers dominate',
                    'Legal change not feasible'
                ],
                caseNotes: 'Transaction triggers are self-enforcing. Every sale brings property onto the roll.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-11',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Coverage refresh program: Institutionalise 2-3-year cycle',
            shortTitle: 'Coverage Refresh Cycle',
            timeline: '1-3 years',
            category: 'Program',
            sortOrder: 11,
            isActive: true,
            overview: {
                whatThisSolves: 'One-off exercises create temporary improvement; coverage degrades over time.',
                whatYouDo: 'Establish permanent program with defined cycle: systematic area reviews, new development identification.',
                whenThisFitsBest: 'Initial coverage work is done; ongoing resources can be allocated.',
                minimumEnablers: 'Dedicated budget; permanent staff or contractors; performance metrics.'
            },
            fullDetails: {
                legalEssentials: [
                    'Ongoing coverage authority',
                    'Budget allocation',
                    'Performance standards'
                ],
                howItWorks: 'Divide jurisdiction into zones. Each zone is systematically reviewed every 2-3 years. Between reviews, new developments are captured through permits and data matching. Coverage rate is tracked and reported.',
                implementationMilestones: [
                    'Design refresh cycle and zones',
                    'Establish dedicated unit or contract',
                    'Develop protocols and targets',
                    'Begin systematic reviews',
                    'Report coverage metrics'
                ],
                administrativeEssentials: [
                    'Dedicated staff/budget',
                    'Planning and scheduling',
                    'Performance monitoring'
                ],
                whenNotApplicable: [
                    'No ongoing resources',
                    'Coverage is already maintained well'
                ],
                caseNotes: 'Institutionalized coverage maintenance prevents backsliding and maintains revenue base.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-12',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Tell-us-a-change channels: Provide SMS/WhatsApp/web for updates',
            shortTitle: 'Public Change Reporting',
            timeline: '<1 year',
            category: 'Channels',
            sortOrder: 12,
            isActive: true,
            overview: {
                whatThisSolves: 'Property changes (new buildings, subdivisions, ownership) are not reported.',
                whatYouDo: 'Create easy channels for public to report changes; verify and update register.',
                whenThisFitsBest: 'Mobile penetration is high; incentives for reporting exist.',
                minimumEnablers: 'Communication channels; verification process; update workflow.'
            },
            fullDetails: {
                legalEssentials: [
                    'Authority to receive and act on tips',
                    'Confidentiality provisions',
                    'Verification requirements'
                ],
                howItWorks: 'Publicize channels for reporting property changes: SMS number, WhatsApp, web form, hotline. Public can report new construction, unauthorized changes, or ownership transfers. Tips are verified and register updated. Consider rewards for valid tips.',
                implementationMilestones: [
                    'Set up reporting channels',
                    'Create verification workflow',
                    'Publicize channels',
                    'Process and act on tips',
                    'Track tip volume and outcomes'
                ],
                administrativeEssentials: [
                    'Channel monitoring',
                    'Verification capacity',
                    'Response tracking'
                ],
                whenNotApplicable: [
                    'No mobile/internet access',
                    'Cultural barriers to reporting'
                ],
                caseNotes: 'Crowdsourcing coverage information supplements official channels. Make reporting easy and consider incentives.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-13',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Quick corrections desk: Fix names, addresses quickly',
            shortTitle: 'Quick Corrections Desk',
            timeline: '<1 year',
            category: 'Support',
            sortOrder: 13,
            isActive: true,
            overview: {
                whatThisSolves: 'Minor errors (names, addresses) persist because corrections are difficult.',
                whatYouDo: 'Establish streamlined process for routine corrections; delegate authority to front-line staff.',
                whenThisFitsBest: 'Correction requests are common; staff can be empowered.',
                minimumEnablers: 'Correction authority; record access; audit trail.'
            },
            fullDetails: {
                legalEssentials: [
                    'Correction authority delegation',
                    'Documentation requirements',
                    'Audit trail'
                ],
                howItWorks: 'Front-line staff can correct minor errors (spelling, address format, contact details) immediately with supporting documentation. No supervisor approval needed for routine items. All corrections logged for audit.',
                implementationMilestones: [
                    'Define correction categories and limits',
                    'Train staff on procedures',
                    'Set up logging system',
                    'Delegate authority',
                    'Monitor correction volume and quality'
                ],
                administrativeEssentials: [
                    'Staff training',
                    'Correction logging',
                    'Quality review'
                ],
                whenNotApplicable: [
                    'Very few correction requests',
                    'No front-line access to records'
                ],
                caseNotes: 'Easy corrections improve data quality and customer satisfaction. Empower staff while maintaining audit trail.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-14',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Roll appeals: Establish time-bound appeal process',
            shortTitle: 'Registration Appeals',
            timeline: '1-3 years',
            category: 'Appeals',
            sortOrder: 14,
            isActive: true,
            overview: {
                whatThisSolves: 'Property owners cannot challenge incorrect registration; disputes remain unresolved.',
                whatYouDo: 'Create formal appeal process for registration issues: wrong property, wrong owner, exemption claims.',
                whenThisFitsBest: 'Disputes are common; independent review capacity exists.',
                minimumEnablers: 'Legal framework; review body; clear procedures; time limits.'
            },
            fullDetails: {
                legalEssentials: [
                    'Appeal grounds and procedures',
                    'Review body composition',
                    'Decision authority and finality'
                ],
                howItWorks: 'Property owners can appeal registration decisions within defined period. Grounds include: property incorrectly identified, wrong ownership recorded, exemption should apply. Independent body reviews and decides. Decisions are binding.',
                implementationMilestones: [
                    'Establish legal framework',
                    'Define appeal procedures',
                    'Create or designate review body',
                    'Publicize appeal rights',
                    'Process appeals within time limits'
                ],
                administrativeEssentials: [
                    'Appeal intake',
                    'Evidence gathering',
                    'Review body support',
                    'Decision implementation'
                ],
                whenNotApplicable: [
                    'Very few disputes',
                    'No review capacity'
                ],
                caseNotes: 'Formal appeals process provides fairness and reduces ad-hoc disputes.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-15',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Registration outreach + amnesty: Run targeted campaign',
            shortTitle: 'Registration Amnesty',
            timeline: '<1 year',
            category: 'Outreach',
            sortOrder: 15,
            isActive: true,
            overview: {
                whatThisSolves: 'Property owners are unaware of registration requirement or fear penalties for past non-registration.',
                whatYouDo: 'Run time-limited campaign: publicize registration requirement; offer penalty waiver for voluntary registration.',
                whenThisFitsBest: 'Large informal sector; goodwill exists; enforcement will follow.',
                minimumEnablers: 'Campaign resources; amnesty authority; registration capacity; follow-up enforcement.'
            },
            fullDetails: {
                legalEssentials: [
                    'Amnesty authority',
                    'Registration requirements',
                    'Post-amnesty enforcement'
                ],
                howItWorks: 'Announce time-limited period where: no penalties for past non-registration, simple registration process, help available. After amnesty ends, enforcement intensifies for unregistered properties.',
                implementationMilestones: [
                    'Design amnesty terms',
                    'Plan outreach campaign',
                    'Set up registration capacity',
                    'Execute campaign',
                    'Transition to enforcement'
                ],
                administrativeEssentials: [
                    'Campaign coordination',
                    'Registration processing',
                    'Enforcement preparation'
                ],
                whenNotApplicable: [
                    'Recent amnesty offered',
                    'No enforcement capacity',
                    'Coverage already high'
                ],
                caseNotes: 'Amnesty works as one-time reset paired with credible enforcement afterward.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-16',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Data standards & de-duplication: Adopt simple field standards',
            shortTitle: 'Data Standards',
            timeline: '<1 year',
            category: 'Quality',
            sortOrder: 16,
            isActive: true,
            overview: {
                whatThisSolves: 'Inconsistent data entry creates duplicates and errors; matching is impossible.',
                whatYouDo: 'Define data standards: address format, name format, property identifiers; run de-duplication exercise.',
                whenThisFitsBest: 'Digital register exists; data quality issues are evident.',
                minimumEnablers: 'Data standards document; de-duplication tools; data cleaning capacity.'
            },
            fullDetails: {
                legalEssentials: [
                    'Data standards authority',
                    'Update procedures'
                ],
                howItWorks: 'Define standard formats for key fields: addresses, names, property IDs. Clean existing data to match standards. Implement validation rules in data entry. Run de-duplication to merge duplicate records.',
                implementationMilestones: [
                    'Develop data standards document',
                    'Assess current data quality',
                    'Clean and standardize existing data',
                    'Implement validation rules',
                    'De-duplicate records'
                ],
                administrativeEssentials: [
                    'Data management expertise',
                    'Cleaning capacity',
                    'Ongoing enforcement of standards'
                ],
                whenNotApplicable: [
                    'No digital register',
                    'Data is already standardized'
                ],
                caseNotes: 'Good data quality is foundation for all other activities. Invest in standards early.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-17',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Role-based access & audit trails: Restrict who can edit',
            shortTitle: 'Access Controls',
            timeline: '<1 year',
            category: 'Security',
            sortOrder: 17,
            isActive: true,
            overview: {
                whatThisSolves: 'Unauthorized changes to property records enable fraud and errors.',
                whatYouDo: 'Implement role-based access controls; log all changes with user, time, reason; regular audit reviews.',
                whenThisFitsBest: 'Digital system exists; multiple users have access.',
                minimumEnablers: 'System access controls; audit logging; review process.'
            },
            fullDetails: {
                legalEssentials: [
                    'Access control requirements',
                    'Audit trail retention',
                    'Review procedures'
                ],
                howItWorks: 'Define user roles with specific permissions (view only, update, approve). All changes logged with user ID, timestamp, reason. Regular review of access and changes. Investigate anomalies.',
                implementationMilestones: [
                    'Define roles and permissions',
                    'Configure system access controls',
                    'Implement audit logging',
                    'Train users',
                    'Establish review process'
                ],
                administrativeEssentials: [
                    'Access administration',
                    'Log review',
                    'Anomaly investigation'
                ],
                whenNotApplicable: [
                    'Paper-based system',
                    'Single user'
                ],
                caseNotes: 'Access controls and audit trails are essential for data integrity and fraud prevention.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-18',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Property information committee & MOUs: Set up cross-agency body',
            shortTitle: 'Inter-Agency Coordination',
            timeline: '1-3 years',
            category: 'Governance',
            sortOrder: 18,
            isActive: true,
            overview: {
                whatThisSolves: 'Property information is fragmented across agencies; no coordination.',
                whatYouDo: 'Establish inter-agency committee: land, planning, utilities, tax; sign MOUs for data sharing.',
                whenThisFitsBest: 'Multiple agencies hold property data; political support for coordination.',
                minimumEnablers: 'Political mandate; agency participation; data sharing framework.'
            },
            fullDetails: {
                legalEssentials: [
                    'Committee authority',
                    'MOU framework',
                    'Data governance'
                ],
                howItWorks: 'Create formal committee with representatives from: revenue, land registry, planning, utilities, survey. Meet regularly to coordinate data sharing, resolve issues, and improve coverage. Sign MOUs defining data sharing terms.',
                implementationMilestones: [
                    'Obtain political mandate',
                    'Identify participating agencies',
                    'Establish committee and terms of reference',
                    'Negotiate and sign MOUs',
                    'Begin regular coordination'
                ],
                administrativeEssentials: [
                    'Committee secretariat',
                    'Meeting coordination',
                    'MOU monitoring'
                ],
                whenNotApplicable: [
                    'No political support',
                    'Single agency holds all data'
                ],
                caseNotes: 'Coordination is often the biggest challenge. Formal structures help sustain cooperation.',
                resources: []
            }
        },
        {
            solutionId: 'PT-COV-19',
            stream: 'Property Tax',
            streamType: 'property-based',
            gap: 'Coverage',
            title: 'Public coverage indicators: Publish quarterly statistics',
            shortTitle: 'Coverage Reporting',
            timeline: '<1 year',
            category: 'Transparency',
            sortOrder: 19,
            isActive: true,
            overview: {
                whatThisSolves: 'No accountability for coverage performance; problems hidden.',
                whatYouDo: 'Define and publish coverage metrics: properties registered, estimated total, coverage ratio by area.',
                whenThisFitsBest: 'Basic data exists; political will for transparency.',
                minimumEnablers: 'Data availability; estimation methodology; publication channel.'
            },
            fullDetails: {
                legalEssentials: [
                    'Reporting requirements',
                    'Publication authority'
                ],
                howItWorks: 'Define coverage metrics: registered properties, estimated total properties, coverage ratio, new registrations. Publish quarterly. Show breakdown by ward/zone. Track trends over time.',
                implementationMilestones: [
                    'Define metrics and estimation methodology',
                    'Establish baseline',
                    'Create reporting format',
                    'Begin quarterly publication',
                    'Use data to drive improvements'
                ],
                administrativeEssentials: [
                    'Data compilation',
                    'Report production',
                    'Publication'
                ],
                whenNotApplicable: [
                    'No baseline exists',
                    'Political will lacking'
                ],
                caseNotes: 'Public reporting creates accountability and shows progress. Even imperfect estimates are useful.',
                resources: []
            }
        }
    ];

})(window);
