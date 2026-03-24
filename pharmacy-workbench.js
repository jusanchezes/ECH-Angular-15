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
        /* ── URGENT PREP ─────────────────────────────────────── */
        {
            id: 'dl1',
            patientId: 'pt1',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            comment: 'Intervención: ajustar dosis por eGFR < 45. Contactar médico.',
            patient: {
                name: 'THOMAS MEYER WOOD',
                age: 67,
                sex: 'M',
                episode: '2024-00312',
                ward: 'Ward 2E',
                room: 'Room 201-A',
                locationFull: 'Ward 2E | Room 201-A'
            },
            medication: {
                name: 'Heparin 5,000 U/mL',
                dose: '5,000 U',
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
            id: 'dl10',
            patientId: 'pt1',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            comment: '',
            patient: {
                name: 'THOMAS MEYER WOOD',
                age: 67,
                sex: 'M',
                episode: '2024-00312',
                ward: 'Ward 2E',
                room: 'Room 201-A',
                locationFull: 'Ward 2E | Room 201-A'
            },
            medication: {
                name: 'Warfarin 5mg',
                dose: '5 mg',
                form: 'Tab',
                frequency: 'QD'
            },
            status: 'urgent-prep',
            statusLabel: 'Urgent Prep',
            validation: {
                contraindications: [
                    'Severe Drug Interaction: Warfarin + Heparin — monitor INR closely.'
                ],
                quantity: {
                    clinicalNeed: '7 Tablets (1/day × 7 days)',
                    logistics: '1 Strip (10 tablets)',
                    total: '1 Strip'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-triangle', type: 'warning', tooltip: 'INR monitoring required daily — target 2.0–3.0' }
                ]
            }
        },
        {
            id: 'dl2',
            patientId: 'pt2',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            comment: '',
            patient: {
                name: 'ANNA KOWALSKI',
                age: 54,
                sex: 'F',
                episode: '2024-00589',
                ward: 'Ward 2E',
                room: 'Room 212-B',
                locationFull: 'Ward 2E | Room 212-B'
            },
            medication: {
                name: 'Insulin Glargine 20 U SC',
                dose: '20 U',
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
            patientId: 'pt3',
            tab: 'urgent-prep',
            warehouse: 'central',
            priority: 'urgent',
            comment: 'Intervención: verificar sensibilidad MRSA antes de dispensar.',
            patient: {
                name: 'ELENA GARCIA MORALES',
                age: 42,
                sex: 'F',
                episode: '2024-00741',
                ward: 'Ward 2E',
                room: 'Room 215-A',
                locationFull: 'Ward 2E | Room 215-A'
            },
            medication: {
                name: 'Vancomycin 1.5g IV',
                dose: '1.5 g',
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
        /* ── PEND. PREP ──────────────────────────────────────── */
        {
            id: 'dl4',
            patientId: 'pt4',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'JUAN PÉREZ',
                age: 71,
                sex: 'M',
                episode: '2024-01023',
                ward: 'Ward 2E',
                room: 'Room 312-B',
                locationFull: 'Ward 2E | Room 312-B'
            },
            medication: {
                name: 'Paracetamol 1g Comp',
                dose: '1 g',
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
            id: 'dl12',
            patientId: 'pt4',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'JUAN PÉREZ',
                age: 71,
                sex: 'M',
                episode: '2024-01023',
                ward: 'Ward 2E',
                room: 'Room 312-B',
                locationFull: 'Ward 2E | Room 312-B'
            },
            medication: {
                name: 'Omeprazole 20mg',
                dose: '20 mg',
                form: 'Capsule',
                frequency: 'QD'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [],
                quantity: {
                    clinicalNeed: '7 Capsules (1/day × 7 days)',
                    logistics: '1 Strip (14 capsules)',
                    total: '1 Strip'
                },
                safetyMarkers: []
            }
        },
        {
            id: 'dl5',
            patientId: 'pt5',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'JAMES O\'BRIEN',
                age: 58,
                sex: 'M',
                episode: '2024-01187',
                ward: 'Ward 2E',
                room: 'Room 210-A',
                locationFull: 'Ward 2E | Room 210-A'
            },
            medication: {
                name: 'Enoxaparin 40mg SC',
                dose: '40 mg',
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
            patientId: 'pt6',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: 'Intervención: K+ 5.8 mEq/L — revisar electrolitos con médico.',
            patient: {
                name: 'MARIA SANTOS FERREIRA',
                age: 63,
                sex: 'F',
                episode: '2024-01251',
                ward: 'Ward 2E',
                room: 'Room 205-B',
                locationFull: 'Ward 2E | Room 205-B'
            },
            medication: {
                name: 'Furosemide 40mg IV',
                dose: '40 mg',
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
            id: 'dl11',
            patientId: 'pt6',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'MARIA SANTOS FERREIRA',
                age: 63,
                sex: 'F',
                episode: '2024-01251',
                ward: 'Ward 2E',
                room: 'Room 205-B',
                locationFull: 'Ward 2E | Room 205-B'
            },
            medication: {
                name: 'Spironolactone 25mg',
                dose: '25 mg',
                form: 'Tab',
                frequency: 'QD'
            },
            status: 'pend-prep',
            statusLabel: 'Pend. Prep',
            validation: {
                contraindications: [
                    'K+ 5.8 mEq/L — hyperkalemia risk elevated with spironolactone.'
                ],
                quantity: {
                    clinicalNeed: '7 Tablets (1/day × 7 days)',
                    logistics: '1 Strip (10 tablets)',
                    total: '1 Strip'
                },
                safetyMarkers: [
                    { icon: 'pi-exclamation-triangle', type: 'warning', tooltip: 'Hyperkalemia Risk: K+ 5.8 mEq/L — monitor electrolytes daily' }
                ]
            }
        },
        {
            id: 'dl7',
            patientId: 'pt7',
            tab: 'pend-prep',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'RAFAEL MENDEZ CRUZ',
                age: 45,
                sex: 'M',
                episode: '2024-01389',
                ward: 'Ward 3S',
                room: 'Room 220-A',
                locationFull: 'Ward 3S | Room 220-A'
            },
            medication: {
                name: 'Paracetamol 1g IV',
                dose: '1 g',
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
        /* ── PREPARED ────────────────────────────────────────── */
        {
            id: 'dl8',
            patientId: 'pt8',
            tab: 'prepared',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'CARLOS VEGA RUIZ',
                age: 55,
                sex: 'M',
                episode: '2024-01502',
                ward: 'Ward 3S',
                room: 'Room 301-C',
                locationFull: 'Ward 3S | Room 301-C'
            },
            medication: {
                name: 'Metoprolol Tartrate 50mg',
                dose: '50 mg',
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
        /* ── DISPENSED ───────────────────────────────────────── */
        {
            id: 'dl9',
            patientId: 'pt9',
            tab: 'dispensed',
            warehouse: 'central',
            priority: 'normal',
            comment: '',
            patient: {
                name: 'LUISA FERNÁNDEZ ALBA',
                age: 38,
                sex: 'F',
                episode: '2024-01634',
                ward: 'Ward 2E',
                room: 'Room 208-A',
                locationFull: 'Ward 2E | Room 208-A'
            },
            medication: {
                name: 'Amoxicillin 500mg',
                dose: '500 mg',
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
 * RENDER: DISPENSATION LIST  (grouped by patient)
 * Angular: PharmacyListComponent with *ngFor over patientGroups,
 *          nested *ngFor over group.lines
 * ============================================================ */
function renderPWList() {
    var el = document.getElementById('pw-list');
    if (!el) return;

    var filtered = getPWFilteredLines();

    if (filtered.length === 0) {
        el.innerHTML = '<div class="pw-empty-state"><i class="pi pi-inbox"></i><span>No dispensation lines for this filter.</span></div>';
        return;
    }

    /* ── 1. Group lines by patientId, preserving first-appearance order ── */
    var patientOrder = [];
    var patientMap   = {};
    filtered.forEach(function(line) {
        var pid = line.patientId || line.id;
        if (!patientMap[pid]) {
            patientMap[pid] = { patient: line.patient, lines: [], highestPriority: 'normal' };
            patientOrder.push(pid);
        }
        patientMap[pid].lines.push(line);
        if (line.priority === 'urgent') patientMap[pid].highestPriority = 'urgent';
    });

    /* ── 2. Build HTML for each patient group ── */
    var rowsHtml = patientOrder.map(function(pid) {
        var group       = patientMap[pid];
        var p           = group.patient;
        var isUrgentGrp = group.highestPriority === 'urgent';

        /* Patient header row */
        var hdrCls  = 'pw-patient-header' + (isUrgentGrp ? ' pw-patient-header-urgent' : '');
        var metaTxt = p.age + 'y · ' + p.sex + ' · Ep.\u00a0' + escHtml(p.episode);

        var headerHtml = '<tr class="' + hdrCls + '">'
            + '<td colspan="4" class="pw-patient-header-cell">'
            + '<div class="pw-ph-row">'
            + '<div class="pw-ph-info">'
            + '<span class="pw-ph-name">' + escHtml(p.name) + '</span>'
            + '<span class="pw-ph-meta">' + metaTxt + '</span>'
            + '</div>'
            + '<div class="pw-ph-location">'
            + '<span class="pw-ph-ward">' + escHtml(p.ward) + '</span>'
            + '<span class="pw-ph-room"><i class="pi pi-map-marker"></i> ' + escHtml(p.room) + '</span>'
            + '</div>'
            + '</div>'
            + '</td>'
            + '</tr>';

        /* Drug sub-rows */
        var drugRowsHtml = group.lines.map(function(line) {
            var isUrgent = line.priority === 'urgent';
            var isActive = line.id === PW_STATE.selectedLineId;

            var rowCls = 'pw-drug-row'
                + (isUrgent ? ' pw-drug-row-urgent' : '')
                + (isActive ? ' pw-drug-row-active' : '');

            var priIcon = isUrgent
                ? '<i class="pi pi-bolt pw-pri-icon pw-pri-urgent" title="Urgent"></i>'
                : '<i class="pi pi-clock pw-pri-icon pw-pri-normal" title="Normal"></i>';

            var statusBadge = '<span class="pw-status-badge ' + getPWStatusClass(line.status) + '">'
                + escHtml(line.statusLabel) + '</span>';

            var doseHtml = line.medication.dose
                ? '<span class="pw-drug-dose">\u00b7 ' + escHtml(line.medication.dose) + '</span>'
                : '';

            var commentHtml = line.comment
                ? '<span class="pw-comment-icon" title="' + escHtml(line.comment) + '">'
                    + '<i class="pi pi-comment"></i>'
                    + '</span>'
                : '';

            return '<tr class="' + rowCls + '" onclick="onPWLineClick(\'' + line.id + '\')">'
                + '<td class="pw-col-pri-cell">' + priIcon + '</td>'
                + '<td class="pw-drug-content-cell">'
                + '<div class="pw-drug-name-row">'
                + '<span class="pw-med-name">' + escHtml(line.medication.name) + '</span>'
                + doseHtml
                + commentHtml
                + '</div>'
                + '<div class="pw-med-detail">'
                + escHtml(line.medication.form + ' | ' + line.medication.frequency)
                + '</div>'
                + '</td>'
                + '<td class="pw-col-status-cell">' + statusBadge + '</td>'
                + '<td class="pw-col-actions-cell">'
                + '<button class="pw-action-btn" title="Dispense"'
                + ' onclick="event.stopPropagation(); onPWDispenseAction(\'' + line.id + '\')">'
                + '<i class="pi pi-send"></i>'
                + '</button>'
                + '</td>'
                + '</tr>';
        }).join('');

        return headerHtml + drugRowsHtml;
    }).join('');

    el.innerHTML = '<table class="pw-table">'
        + '<thead>'
        + '<tr>'
        + '<th class="pw-col-pri">Pri</th>'
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
