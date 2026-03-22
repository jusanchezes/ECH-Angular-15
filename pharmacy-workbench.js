/**
 * @file pharmacy-workbench.js — Pharmacy Dispensation Workbench Logic
 * @description Implements the Pharmacy Workbench module: dispensation queue tabs,
 *   context toolbar, high-density dispensation list, and right-side dual validation panel.
 *
 *   ANGULAR 15 MIGRATION:
 *   This file is replaced entirely by PharmacyWorkbenchComponent (Standalone):
 *     - PharmacyTabsComponent      → <p-tabMenu [model]="pwTabs">
 *     - PharmacyToolbarComponent   → <p-toolbar> with <p-dropdown> selects
 *     - PharmacyListComponent      → *ngFor over filteredLines
 *     - DispensingValidationComponent → fixed right-side panel column
 *
 *   DATA BINDING:
 *     GET /api/v1/pharmacy/dispensation-queue?warehouse=…&ward=… → DispensationQueueDTO
 *     POST /api/v1/pharmacy/confirm-dispense/{lineId}            → DispensationConfirmDTO
 *     POST /api/v1/pharmacy/flag-incident/{lineId}               → IncidentReportDTO
 */


/* ============================================================
 * MOCK DATA — Pharmacy Dispensation Queue
 * Angular: Replaced by PharmacyDataService.getDispensationQueue()
 * ============================================================ */
var PW_DATA = {

    warehouseOptions: [
        { value: 'central',   label: 'Central Pharmacy' },
        { value: 'satellite', label: 'Satellite – Ward 2' },
        { value: 'icu',       label: 'ICU Pharmacy' },
        { value: 'oncology',  label: 'Oncology Unit' }
    ],

    wardOptions: [
        { value: 'all',  label: 'All Units' },
        { value: '2E',   label: 'Ward 2E (Internal)' },
        { value: '3S',   label: 'Ward 3S (Surgical)' },
        { value: 'ICU',  label: 'ICU / PACU' },
        { value: 'ER',   label: 'Emergency' }
    ],

    tabs: [
        { id: 'pend-prep',    label: 'Pend. Prep',  count: 24, urgent: false },
        { id: 'urgent-prep',  label: 'Urgent Prep', count: 3,  urgent: true  },
        { id: 'prepared',     label: 'Prepared',    count: 12, urgent: false },
        { id: 'dispensed',    label: 'Dispensed',   count: 45, urgent: false }
    ],

    lines: [
        {
            id: 'dl1',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            patient: {
                name: 'THOMAS MEYER WOOD',
                ward: 'Ward 2E',
                room: 'Room 201-A',
                locationFull: 'Ward 2E | Room 201-A'
            },
            medication: {
                name: 'Heparin 5,000 U/mL',
                form: 'Vial 5 mL',
                frequency: 'Q12H'
            },
            status: 'urgent-prep',
            statusLabel: 'Urgent Prep',
            validation: {
                contraindications: [
                    'Severe Drug Interaction: Heparin + Warfarin.',
                    'eGFR < 45: High risk of accumulation.'
                ],
                quantity: {
                    clinicalNeed: '10 Vials (2/day × 5 days)',
                    logistics: '2 Boxes (5 vials each)',
                    total: '2 Boxes'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-circle', type: 'allergy',  tooltip: 'Penicillin Allergy — avoid beta-lactam antibiotics' },
                    { icon: 'pi-exclamation-triangle', type: 'warning', tooltip: 'Fall Risk — Morse score 65, bed alarm active' }
                ]
            }
        },
        {
            id: 'dl2',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            patient: {
                name: 'ANNA KOWALSKI',
                ward: 'Ward 2E',
                room: 'Room 212-B',
                locationFull: 'Ward 2E | Room 212-B'
            },
            medication: {
                name: 'Insulin Glargine 20 U SC',
                form: 'Pen 3 mL',
                frequency: 'QD Bedtime'
            },
            status: 'urgent-prep',
            statusLabel: 'Urgent Prep',
            validation: {
                contraindications: [
                    'BGL 14.2 mmol/L — sliding scale required before dosing.',
                    'No documented allergy — verify insulin pen is dedicated to patient.'
                ],
                quantity: {
                    clinicalNeed: '1 Pen (1 dose/day × 7 days)',
                    logistics: '1 Pen (300 U/pen)',
                    total: '1 Pen'
                },
                safetyMarkers: [
                    { icon: 'pi-sun', type: 'warning', tooltip: 'Fall Risk — Morse score 65, bed alarm active' },
                    { icon: 'pi-info-circle', type: 'info', tooltip: 'Diabetic patient — sliding scale protocol active' }
                ]
            }
        },
        {
            id: 'dl3',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            patient: {
                name: 'ELENA GARCIA MORALES',
                ward: 'Ward 2E',
                room: 'Room 215-A',
                locationFull: 'Ward 2E | Room 215-A'
            },
            medication: {
                name: 'Vancomycin 1.5g IV',
                form: 'Vial 1.5 g',
                frequency: 'Q12H'
            },
            status: 'urgent-prep',
            statusLabel: 'Urgent Prep',
            validation: {
                contraindications: [
                    'Morphine allergy documented — verify cross-reactivity risk.',
                    'MRSA infection — confirm sensitivity report before dispensing.'
                ],
                quantity: {
                    clinicalNeed: '14 Vials (2/day × 7 days)',
                    logistics: '1 Box (14 vials)',
                    total: '1 Box'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-circle', type: 'allergy', tooltip: 'Morphine Allergy — anaphylactic reaction documented 2019' },
                    { icon: 'pi-sun', type: 'allergy', tooltip: 'Contact Isolation — MRSA positive wound culture' }
                ]
            }
        },
        {
            id: 'dl4',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'JUAN PÉREZ',
                ward: 'Ward 2E',
                room: 'Room 312-B',
                locationFull: 'Ward 2E | Room 312-B'
            },
            medication: {
                name: 'Paracetamol 1g Comp',
                form: 'Box 20 units',
                frequency: 'Q8H'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '21 Tablets (3/day × 7 days)',
                    logistics: '1 Box (20 units) + 1 strip',
                    total: '2 Packs'
                },
                safetyMarkers: [
                    { icon: 'pi-info-circle', type: 'info', tooltip: 'Max 4g/day — verify other paracetamol-containing medications' }
                ]
            }
        },
        {
            id: 'dl5',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'JAMES O\'BRIEN',
                ward: 'Ward 2E',
                room: 'Room 210-A',
                locationFull: 'Ward 2E | Room 210-A'
            },
            medication: {
                name: 'Enoxaparin 40mg SC',
                form: 'Syringe 0.4 mL',
                frequency: 'QD'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '7 Syringes (1/day × 7 days)',
                    logistics: '1 Box (10 syringes)',
                    total: '1 Box'
                },
                safetyMarkers: [
                    { icon: 'pi-info-circle', type: 'info', tooltip: 'DVT prophylaxis post-TKA — monitor for bleeding signs' }
                ]
            }
        },
        {
            id: 'dl6',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'MARIA SANTOS FERREIRA',
                ward: 'Ward 2E',
                room: 'Room 205-B',
                locationFull: 'Ward 2E | Room 205-B'
            },
            medication: {
                name: 'Furosemide 40mg IV',
                form: 'Ampoule 4 mL',
                frequency: 'QD'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [
                    'Aspirin allergy documented — avoid NSAIDs concurrently.',
                    'K+ 5.8 mEq/L — hyperkalemia risk with concurrent ACEi.'
                ],
                quantity: {
                    clinicalNeed: '7 Ampoules (1/day × 7 days)',
                    logistics: '1 Box (10 ampoules)',
                    total: '1 Box'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-circle', type: 'allergy', tooltip: 'Aspirin Allergy — avoid all NSAIDs and aspirin-containing products' },
                    { icon: 'pi-exclamation-triangle', type: 'warning', tooltip: 'Critical Lab: K+ 5.8 mEq/L — physician notified at 08:42' }
                ]
            }
        },
        {
            id: 'dl7',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'RAFAEL MENDEZ CRUZ',
                ward: 'Ward 3S',
                room: 'Room 220-A',
                locationFull: 'Ward 3S | Room 220-A'
            },
            medication: {
                name: 'Paracetamol 1g IV',
                form: 'Bag 100 mL',
                frequency: 'Q6H PRN'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '4 Bags (PRN up to 4/day × 3 days)',
                    logistics: '1 Box (4 bags)',
                    total: '1 Box'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-circle', type: 'allergy', tooltip: 'Penicillin Allergy — mild rash documented 2021' }
                ]
            }
        },
        {
            id: 'dl8',
            tab: 'prepared',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'CARLOS VEGA RUIZ',
                ward: 'Ward 3S',
                room: 'Room 301-C',
                locationFull: 'Ward 3S | Room 301-C'
            },
            medication: {
                name: 'Metoprolol Tartrate 50mg',
                form: 'Tab',
                frequency: 'BID'
            },
            status: 'prepared',
            statusLabel: 'Prepared',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '30 Tablets (2/day × 15 days)',
                    logistics: '1 Box (30 tablets)',
                    total: '1 Box'
                },
                safetyMarkers: [
                    { icon: 'pi-info-circle', type: 'info', tooltip: 'Hold if HR < 55 bpm or SBP < 90 mmHg' }
                ]
            }
        },
        {
            id: 'dl9',
            tab: 'dispensed',
            warehouse: 'central',
            priority: 'normal',
            patient: {
                name: 'LUISA FERNÁNDEZ ALBA',
                ward: 'Ward 2E',
                room: 'Room 208-A',
                locationFull: 'Ward 2E | Room 208-A'
            },
            medication: {
                name: 'Amoxicillin 500mg',
                form: 'Capsule',
                frequency: 'TID'
            },
            status: 'dispensed',
            statusLabel: 'Dispensed',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '21 Capsules (3/day × 7 days)',
                    logistics: '1 Box (21 capsules)',
                    total: '1 Box'
                },
                safetyMarkers: []
            }
        }
    ]
};


/* ============================================================
 * MODULE STATE
 * Angular: Becomes component properties / BehaviorSubjects
 * ============================================================ */
var PW_STATE = {
    activeTab: 'pend-prep',
    selectedWarehouse: 'central',
    selectedWard: 'all',
    searchQuery: '',
    selectedLineId: null
};


/* ============================================================
 * RENDER: TABS BAR
 * Angular: PharmacyTabsComponent template with p-tabMenu
 * ============================================================ */
function renderPWTabs() {
    var el = document.getElementById('pw-tabs-bar');
    if (!el) return;

    var tabsHtml = PW_DATA.tabs.map(function(tab) {
        var isActive  = tab.id === PW_STATE.activeTab;
        var urgentCls = tab.urgent ? ' pw-tab-urgent' : '';
        var activeCls = isActive ? ' pw-tab-active' : '';
        return '<button class="pw-tab' + urgentCls + activeCls + '" onclick="onPWTabClick(\'' + tab.id + '\')">'
            + tab.label
            + ' <span class="pw-tab-badge">' + tab.count + '</span>'
            + '</button>';
    }).join('');

    el.innerHTML = '<div class="pw-tabs-row">' + tabsHtml + '</div>';
}


/* ============================================================
 * RENDER: TOOLBAR
 * Angular: PharmacyToolbarComponent template
 * ============================================================ */
function renderPWToolbar() {
    var el = document.getElementById('pw-toolbar');
    if (!el) return;

    var warehouseOptions = PW_DATA.warehouseOptions.map(function(o) {
        var selected = o.value === PW_STATE.selectedWarehouse ? ' selected' : '';
        return '<option value="' + o.value + '"' + selected + '>' + o.label + '</option>';
    }).join('');

    var wardOptions = PW_DATA.wardOptions.map(function(o) {
        var selected = o.value === PW_STATE.selectedWard ? ' selected' : '';
        return '<option value="' + o.value + '"' + selected + '>' + o.label + '</option>';
    }).join('');

    el.innerHTML = '<div class="pw-toolbar-inner">'
        + '<div class="pw-toolbar-left">'
        + '<span class="pw-filter-label">Warehouse:</span>'
        + '<select class="pw-filter-select" onchange="onPWWarehouseChange(this.value)">' + warehouseOptions + '</select>'
        + '<div class="pw-toolbar-separator"></div>'
        + '<span class="pw-filter-label">Ward:</span>'
        + '<select class="pw-filter-select" onchange="onPWWardChange(this.value)">' + wardOptions + '</select>'
        + '</div>'
        + '<div class="pw-toolbar-right">'
        + '<div class="pw-search-wrapper">'
        + '<i class="pi pi-search pw-search-icon"></i>'
        + '<input type="text" class="pw-search-input" placeholder="Search Patient/Drug..." value="' + escHtml(PW_STATE.searchQuery) + '" oninput="onPWSearch(this.value)">'
        + '</div>'
        + '</div>'
        + '</div>';
}


/* ============================================================
 * RENDER: DISPENSATION LIST
 * Angular: PharmacyListComponent with *ngFor and [class.pw-row-urgent]
 * ============================================================ */
function renderPWList() {
    var el = document.getElementById('pw-list');
    if (!el) return;

    var filtered = getPWFilteredLines();

    if (filtered.length === 0) {
        el.innerHTML = '<div class="pw-empty-state"><i class="pi pi-inbox"></i><span>No dispensation lines for this filter.</span></div>';
        return;
    }

    var rowsHtml = filtered.map(function(line) {
        var isUrgent  = line.priority === 'urgent';
        var isActive  = line.id === PW_STATE.selectedLineId;
        var urgentCls = isUrgent ? ' pw-row-urgent' : '';
        var activeCls = isActive ? ' pw-row-active' : '';

        var priIcon = isUrgent
            ? '<i class="pi pi-bolt pw-pri-icon pw-pri-urgent" title="Urgent"></i>'
            : '<i class="pi pi-clock pw-pri-icon pw-pri-normal" title="Normal"></i>';

        var statusCls = 'pw-status-' + line.status.replace(/-/g, '-');
        var statusBadge = '<span class="pw-status-badge ' + getPWStatusClass(line.status) + '">' + escHtml(line.statusLabel) + '</span>';

        return '<tr class="pw-row' + urgentCls + activeCls + '" onclick="onPWLineClick(\'' + line.id + '\')">'
            + '<td class="pw-col-pri-cell">' + priIcon + '</td>'
            + '<td>'
            + '<div class="pw-patient-name">' + escHtml(line.patient.name) + '</div>'
            + '<div class="pw-patient-location">' + escHtml(line.patient.ward + ' | ' + line.patient.room) + '</div>'
            + '</td>'
            + '<td>'
            + '<div class="pw-med-name">' + escHtml(line.medication.name) + '</div>'
            + '<div class="pw-med-detail">' + escHtml(line.medication.form + ' | ' + line.medication.frequency) + '</div>'
            + '</td>'
            + '<td class="pw-col-status-cell">' + statusBadge + '</td>'
            + '<td class="pw-col-actions-cell">'
            + '<button class="pw-action-btn" title="Dispense" onclick="event.stopPropagation(); onPWDispenseAction(\'' + line.id + '\')">'
            + '<i class="pi pi-send"></i>'
            + '</button>'
            + '</td>'
            + '</tr>';
    }).join('');

    el.innerHTML = '<table class="pw-table">'
        + '<thead>'
        + '<tr>'
        + '<th class="pw-col-pri">Pri</th>'
        + '<th>Patient &amp; Location</th>'
        + '<th>Medication</th>'
        + '<th class="pw-col-status">Status</th>'
        + '<th class="pw-col-actions">Actions</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>' + rowsHtml + '</tbody>'
        + '</table>';
}


/* ============================================================
 * RENDER: VALIDATION PANEL (Right side)
 * Angular: DispensingValidationComponent with @Input() line
 * ============================================================ */
function renderPWPanel(lineId) {
    var el = document.getElementById('pw-validation-panel');
    if (!el) return;

    if (!lineId) {
        el.innerHTML = '<div class="pw-panel-header">Dispensing Validation</div>'
            + '<div class="pw-panel-empty">'
            + '<i class="pi pi-arrow-left"></i>'
            + '<span>Select a dispensation line to validate</span>'
            + '</div>';
        return;
    }

    var line = PW_DATA.lines.find(function(l) { return l.id === lineId; });
    if (!line) { renderPWPanel(null); return; }

    var val = line.validation;

    /* Contraindications block */
    var contraindicationsHtml = '';
    if (val.contraindications && val.contraindications.length > 0) {
        var items = val.contraindications.map(function(c) {
            return '<li>' + escHtml(c) + '</li>';
        }).join('');
        contraindicationsHtml = '<div class="pw-contraindications">'
            + '<div class="pw-contraindications-title"><i class="pi pi-exclamation-triangle"></i> Contraindications</div>'
            + '<ul class="pw-contraindications-list">' + items + '</ul>'
            + '</div>';
    }

    /* Quantity Logic block */
    var quantityHtml = '<div class="pw-quantity-logic">'
        + '<div class="pw-quantity-title"><i class="pi pi-info-circle"></i> Dispensing Quantity Logic</div>'
        + '<div class="pw-quantity-row"><strong>Clinical Need:</strong> ' + escHtml(val.quantity.clinicalNeed) + '</div>'
        + '<div class="pw-quantity-row"><strong>Logistics:</strong> ' + escHtml(val.quantity.logistics) + '</div>'
        + '<div class="pw-quantity-total">Total to Dispense: ' + escHtml(val.quantity.total) + '</div>'
        + '</div>';

    /* Safety Markers block */
    var safetyHtml = '';
    if (val.safetyMarkers && val.safetyMarkers.length > 0) {
        var icons = val.safetyMarkers.map(function(m) {
            return '<span class="pw-safety-icon pw-safety-' + m.type + '">'
                + '<i class="pi ' + m.icon + '"></i>'
                + '<span class="pw-tooltip">' + escHtml(m.tooltip) + '</span>'
                + '</span>';
        }).join('');
        safetyHtml = '<div class="pw-safety-markers">'
            + '<div class="pw-safety-title">Safety Markers</div>'
            + '<div class="pw-safety-icons">' + icons + '</div>'
            + '</div>';
    }

    el.innerHTML = '<div class="pw-panel-header">Dispensing Validation</div>'
        + '<div class="pw-panel-body">'
        + '<div class="pw-delivery-location">'
        + '<div class="pw-delivery-label">Delivery Location</div>'
        + '<div class="pw-delivery-value">' + escHtml(line.patient.locationFull) + '</div>'
        + '</div>'
        + contraindicationsHtml
        + quantityHtml
        + safetyHtml
        + '</div>'
        + '<div class="pw-panel-footer">'
        + '<button class="pw-footer-btn pw-footer-btn-primary" onclick="onPWConfirm(\'' + line.id + '\')">'
        + '<i class="pi pi-print"></i> Confirm &amp; Print Label'
        + '</button>'
        + '<button class="pw-footer-btn pw-footer-btn-danger" onclick="onPWFlagIncident(\'' + line.id + '\')">'
        + '<i class="pi pi-flag"></i> Flag Incident'
        + '</button>'
        + '</div>';
}


/* ============================================================
 * HELPERS
 * ============================================================ */

/** Returns the CSS class for a given status key */
function getPWStatusClass(status) {
    var map = {
        'urgent-prep': 'pw-status-urgent-prep',
        'pend-prep':   'pw-status-pend-prep',
        'prepared':    'pw-status-prepared',
        'dispensed':   'pw-status-dispensed'
    };
    return map[status] || 'pw-status-pend-prep';
}

/** Filters lines by active tab, warehouse, ward, and search query */
function getPWFilteredLines() {
    var q = PW_STATE.searchQuery.toLowerCase().trim();
    return PW_DATA.lines.filter(function(line) {
        if (line.tab !== PW_STATE.activeTab) return false;
        if (PW_STATE.selectedWarehouse !== 'all' && line.warehouse && line.warehouse !== PW_STATE.selectedWarehouse) return false;
        if (PW_STATE.selectedWard !== 'all' && line.patient.ward.indexOf(PW_STATE.selectedWard) === -1) return false;
        if (q) {
            var haystack = (line.patient.name + ' ' + line.medication.name).toLowerCase();
            if (haystack.indexOf(q) === -1) return false;
        }
        return true;
    });
}

/** Returns the count of lines matching a given tab under current warehouse/ward/search filters */
function getPWTabCount(tabId) {
    var q = PW_STATE.searchQuery.toLowerCase().trim();
    return PW_DATA.lines.filter(function(line) {
        if (line.tab !== tabId) return false;
        if (PW_STATE.selectedWarehouse !== 'all' && line.warehouse && line.warehouse !== PW_STATE.selectedWarehouse) return false;
        if (PW_STATE.selectedWard !== 'all' && line.patient.ward.indexOf(PW_STATE.selectedWard) === -1) return false;
        if (q) {
            var haystack = (line.patient.name + ' ' + line.medication.name).toLowerCase();
            if (haystack.indexOf(q) === -1) return false;
        }
        return true;
    }).length;
}

/** Escapes HTML special characters to prevent XSS */
function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


/* ============================================================
 * EVENT HANDLERS
 * Angular: Component methods bound to (click) / (change) events
 * ============================================================ */

/** Switches the active tab and re-renders the list */
function onPWTabClick(tabId) {
    PW_STATE.activeTab = tabId;
    PW_STATE.selectedLineId = null;
    renderPWTabs();
    renderPWList();
    renderPWPanel(null);
}

/** Updates the selected warehouse filter */
function onPWWarehouseChange(value) {
    PW_STATE.selectedWarehouse = value;
    PW_STATE.selectedLineId = null;
    renderPWList();
    renderPWPanel(null);
}

/** Updates the selected ward filter */
function onPWWardChange(value) {
    PW_STATE.selectedWard = value;
    PW_STATE.selectedLineId = null;
    renderPWList();
    renderPWPanel(null);
}

/** Updates search query and re-renders the list */
function onPWSearch(value) {
    PW_STATE.searchQuery = value;
    PW_STATE.selectedLineId = null;
    renderPWList();
    renderPWPanel(null);
}

/** Selects a dispensation line and shows the validation panel */
function onPWLineClick(lineId) {
    PW_STATE.selectedLineId = (PW_STATE.selectedLineId === lineId) ? null : lineId;
    renderPWList();
    renderPWPanel(PW_STATE.selectedLineId);
}

/** Handles the dispense action from the row action button */
function onPWDispenseAction(lineId) {
    PW_STATE.selectedLineId = lineId;
    renderPWList();
    renderPWPanel(lineId);
}

/** Confirm & Print Label action */
function onPWConfirm(lineId) {
    console.log('[PW] Confirm & Print Label — line:', lineId);
    /* Angular: PharmacyService.confirmDispense(lineId).subscribe(…) */
}

/** Flag Incident action */
function onPWFlagIncident(lineId) {
    console.log('[PW] Flag Incident — line:', lineId);
    /* Angular: IncidentService.flagIncident(lineId).subscribe(…) */
}


/* ============================================================
 * INITIALIZATION
 * Angular: ngOnInit() lifecycle hook
 * ============================================================ */
function initPharmacyWorkbench() {
    renderPWTabs();
    renderPWToolbar();
    renderPWList();
    renderPWPanel(null);
}

document.addEventListener('DOMContentLoaded', initPharmacyWorkbench);
