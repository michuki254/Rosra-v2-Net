/**
 * ROSRA Stream Classification Constants
 * Defines non-property revenue stream subgroups, subtypes, and quick templates
 */
(function(window) {
    'use strict';

    const StreamClassification = {
        // Three non-property subgroups
        SUBGROUPS: [
            {
                code: 'A',
                label: 'Business licences and recurrent operating permits',
                shortLabel: 'Business Licences & Permits',
                description: 'Revenues linked to registration, authorization, licensing, or recurring renewal that allow a business, operator, or activity to operate legally on a continuing basis.',
                examples: ['general business licence', 'sanitary permit', 'signage permit', 'operator permit', 'market operating permit'],
                unitExamples: 'businesses, establishments, operators',
                icon: 'bi-shop',
                color: '#2196F3'
            },
            {
                code: 'B',
                label: 'Service fees and billed use charges',
                shortLabel: 'Service Fees & Billed Charges',
                description: 'Revenues linked to a municipal service, facility, tenancy, or account, where the local government usually issues a periodic bill, invoice, rent charge, or other account-based charge.',
                examples: ['solid waste fee', 'water charge', 'sewerage fee', 'municipal rent', 'stall rent', 'public-facility use charge'],
                unitExamples: 'users, accounts, service points, tenants',
                icon: 'bi-receipt',
                color: '#FF9800'
            },
            {
                code: 'C',
                label: 'Daily or point-of-collection charges',
                shortLabel: 'Daily / Point-of-Collection',
                description: 'Revenues collected directly at the point where the activity, use, or transaction takes place, usually on site and often per day, per trip, per visit, per vehicle, per user, or per transaction, rather than through periodic billing.',
                examples: ['daily market fee', 'parking fee', 'bus park fee', 'slaughterhouse fee', 'hawker fee', 'loading fee'],
                unitExamples: 'vendors, vehicles, stalls, trips, payers, collection points',
                icon: 'bi-cash-coin',
                color: '#4CAF50'
            }
        ],

        // Subtypes keyed by subgroup code
        SUBTYPES: {
            'A': [
                'General business licence',
                'Trade or professional licence',
                'Food, health, or sanitary permit',
                'Signage or advertising permit',
                'Transport or operator permit',
                'Tourism, hospitality, or entertainment permit',
                'Other recurrent business or operating permit'
            ],
            'B': [
                'Solid waste fee',
                'Water charge',
                'Sewerage or sanitation fee',
                'Municipal rent or lease charge',
                'Market stall rent',
                'Public facility or service use charge',
                'Other billed recurring service fee'
            ],
            'C': [
                'Daily market fee',
                'Parking fee',
                'Bus, taxi, or transport stand fee',
                'Slaughterhouse or abattoir fee',
                'Hawker or street trader fee',
                'Loading or unloading fee',
                'Entry or access fee',
                'Other recurrent point-of-collection charge'
            ]
        },

        // 7 quick templates
        QUICK_TEMPLATES: [
            {
                id: 'general-business-licence',
                name: 'General Business Licence',
                subgroup: 'A',
                subtype: 'General business licence',
                defaultStreamName: 'Business Licence',
                icon: 'bi-briefcase',
                description: 'Annual or periodic business registration and licensing'
            },
            {
                id: 'advertising-signage-permit',
                name: 'Advertising / Signage Permit',
                subgroup: 'A',
                subtype: 'Signage or advertising permit',
                defaultStreamName: 'Advertising Permit',
                icon: 'bi-megaphone',
                description: 'Permits for signage, billboards, and advertising'
            },
            {
                id: 'solid-waste-fee',
                name: 'Solid Waste Fee',
                subgroup: 'B',
                subtype: 'Solid waste fee',
                defaultStreamName: 'Solid Waste Fee',
                icon: 'bi-trash3',
                description: 'Periodic billing for waste collection services'
            },
            {
                id: 'market-stall-rent',
                name: 'Market Stall Rent',
                subgroup: 'B',
                subtype: 'Market stall rent',
                defaultStreamName: 'Market Stall Rent',
                icon: 'bi-shop-window',
                description: 'Periodic rent for allocated market stalls'
            },
            {
                id: 'daily-market-fee',
                name: 'Daily Market Fee',
                subgroup: 'C',
                subtype: 'Daily market fee',
                defaultStreamName: 'Daily Market Fee',
                icon: 'bi-cart3',
                description: 'Daily fee collected on site from market vendors'
            },
            {
                id: 'parking-fee',
                name: 'Parking Fee',
                subgroup: 'C',
                subtype: 'Parking fee',
                defaultStreamName: 'Parking Fee',
                icon: 'bi-p-circle',
                description: 'Per-use or daily parking charges collected on site'
            },
            {
                id: 'other',
                name: 'Other Non-Property Stream',
                subgroup: null,
                subtype: null,
                defaultStreamName: '',
                icon: 'bi-plus-circle-dotted',
                description: 'Manually classify any other non-property revenue stream'
            }
        ],

        // Helper functions
        getSubgroup: function(code) {
            return this.SUBGROUPS.find(s => s.code === code) || null;
        },

        getSubgroupLabel: function(code) {
            const sg = this.getSubgroup(code);
            return sg ? sg.label : 'Unclassified';
        },

        getSubgroupShortLabel: function(code) {
            const sg = this.getSubgroup(code);
            return sg ? sg.shortLabel : 'Unclassified';
        },

        getSubtypesForSubgroup: function(code) {
            return this.SUBTYPES[code] || [];
        },

        getUnitExamples: function(code) {
            const sg = this.getSubgroup(code);
            return sg ? sg.unitExamples : 'units';
        },

        getSubgroupIcon: function(code) {
            const sg = this.getSubgroup(code);
            return sg ? sg.icon : 'bi-question-circle';
        },

        getSubgroupColor: function(code) {
            const sg = this.getSubgroup(code);
            return sg ? sg.color : '#666';
        },

        getTemplate: function(id) {
            return this.QUICK_TEMPLATES.find(t => t.id === id) || null;
        }
    };

    window.StreamClassification = StreamClassification;
})(window);
