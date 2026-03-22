/**
 * @file nursing-workbench.js — Nursing Shift Task Manager Logic
 * @description Implements the Nursing Workbench module: shift task queue, ECH-style
 *   patient task list, right-side detail panel, and handoff mode.
 *
 *   ANGULAR 15 MIGRATION:
 *   This file is replaced entirely by NursingWorkbenchComponent (Standalone):
 *     - NursingTabsComponent  → <p-tabMenu [model]="tabs">
 *     - NursingToolbarComponent → <p-toolbar> with <p-dropdown> selects
 *     - NursingTaskListComponent → *ngFor over patients + tasks
 *     - NursingPanelComponent → <p-sidebar [(visible)]="panelOpen" position="right">
 *     - HandoffComponent → *ngIf on handoffMode$ BehaviorSubject
 *
 *   DATA BINDING:
 *     GET /api/v1/nursing/shift-tasks?ward=…&shift=…&nurse=… → NursingShiftDTO
 *     POST /api/v1/nursing/handoff/sign → HandoffSignatureDTO
 */

/* ============================================================
 * MOCK DATA — Nursing Shift
 * Angular: Replaced by NursingDataService.getShiftTasks()
 * ============================================================ */
var NW_DATA = {

    currentNurse: { id: 'n1', name: 'Ana Ruiz', label: 'Ana Ruiz (Me)' },

    wardOptions: [
        { value: '201-220', label: '201-220 (Internal)' },
        { value: '221-240', label: '221-240 (Cardiology)' },
        { value: '301-320', label: '301-320 (Surgical)' },
        { value: 'ICU',     label: 'ICU / PACU' }
    ],

    shiftOptions: [
        { value: 'morning',   label: 'Morning  07:00-15:00' },
        { value: 'afternoon', label: 'Afternoon 15:00-23:00' },
        { value: 'night',     label: 'Night  23:00-07:00' }
    ],

    nurseOptions: [
        { value: 'n1', label: 'Ana Ruiz (Me)' },
        { value: 'n2', label: 'M. Torres' },
        { value: 'n3', label: 'J. Lima' },
        { value: 'all', label: 'All Nurses' }
    ],

    patients: [
        {
            id: 46,
            room: '201-A',
            name: 'THOMAS MEYER WOOD',
            nurse: 'Ana Ruiz',
            acuity: 'Med',
            alerts: {
                sun:   { active: true,  icon: 'pi-sun',   tooltip: 'Isolation precautions active — contact precautions required' },
                flask: { active: false, icon: 'pi-flask',  tooltip: '' },
                bell:  { active: true,  icon: 'pi-bell',   tooltip: '2 medications pending — due within the next 30 minutes' }
            },
            tasks: [
                {
                    id: 't1',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'METOPROLOL TARTRATE 50mg TAB',
                    detail: 'Oral | BID | 22-03-26 / 05-04-26 (15 days)',
                    time: '10:00',
                    status: 'Due Soon',
                    statusClass: 'nw-status-due-soon',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Rory Rogers',
                        prescribed: '22/03/2026',
                        indication: 'Hypertension — rate control',
                        route: 'Oral',
                        frequency: 'BID',
                        notes: 'Hold if HR < 55 bpm or SBP < 90 mmHg. Reassess cardiac status before each dose.',
                        history: [
                            { time: '22-03  08:05', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'Patient tolerated well. No complaints.' },
                            { time: '21-03  20:10', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: '' },
                            { time: '21-03  08:00', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: 'BP pre-dose 132/84.' },
                            { time: '20-03  20:00', nurse: 'J. Lima',   action: 'Skipped',  dotClass: 'dot-skipped',   note: 'Patient NPO for procedure.' }
                        ]
                    }
                },
                {
                    id: 't2',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Respiratory Monitoring',
                    detail: 'Goal: Breathing adequate | Q2H',
                    time: '11:00',
                    status: 'Not Started',
                    statusClass: 'nw-status-not-started',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Rory Rogers',
                        prescribed: '20/03/2026',
                        indication: 'Post-operative respiratory assessment',
                        route: 'N/A',
                        frequency: 'Q2H',
                        notes: 'Document SpO2, respiratory rate, and breath sounds. Alert if SpO2 < 92%.',
                        history: [
                            { time: '22-03  09:00', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'SpO2 97%, RR 16, clear breath sounds bilaterally.' },
                            { time: '22-03  07:00', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'SpO2 96%, patient awake and cooperative.' }
                        ]
                    }
                },
                {
                    id: 't3',
                    type: 'diagnostic',
                    typeLabel: 'Diagnostic',
                    icon: 'pi-sync',
                    name: 'Blood Culture Collection',
                    detail: 'Specimen required before antibiotic dose',
                    time: 'ASAP',
                    status: 'In Progress',
                    statusClass: 'nw-status-in-progress',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Rory Rogers',
                        prescribed: '22/03/2026',
                        indication: 'Suspected bacteremia — fever 38.9°C',
                        route: 'Venipuncture',
                        frequency: 'STAT',
                        notes: '2 sets from 2 different sites. Collected prior to first antibiotic dose. Label with time of collection.',
                        history: [
                            { time: '22-03  09:30', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'Set 1 collected from right antecubital. Sent to lab.' }
                        ]
                    }
                }
            ]
        },
        {
            id: 47,
            room: '205-B',
            name: 'MARIA SANTOS FERREIRA',
            nurse: 'Ana Ruiz',
            acuity: 'High',
            alerts: {
                sun:   { active: false, icon: 'pi-sun',    tooltip: '' },
                flask: { active: true,  icon: 'pi-flask',  tooltip: 'Aspirin allergy documented — avoid all NSAIDs and aspirin-containing products' },
                bell:  { active: true,  icon: 'pi-bell',   tooltip: 'Critical lab: Potassium 5.8 mEq/L — physician notified at 08:42' }
            },
            tasks: [
                {
                    id: 't4',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'FUROSEMIDE 40mg IV',
                    detail: 'Intravenous | QD | 15-02-26 / 30-03-26 (43 days)',
                    time: '09:00',
                    status: 'Overdue',
                    statusClass: 'nw-status-overdue',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Elena Vasquez',
                        prescribed: '15/02/2026',
                        indication: 'Fluid management — CHF exacerbation',
                        route: 'IV Bolus',
                        frequency: 'QD',
                        notes: 'Monitor urine output. Hold if urine output < 30 mL/hr or K+ < 3.5. Daily weights.',
                        history: [
                            { time: '21-03  09:05', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'UO 480 mL/8h. Weight 68.4 kg.' },
                            { time: '20-03  09:00', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: '' }
                        ]
                    }
                },
                {
                    id: 't5',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Daily Weight — Fluid Balance',
                    detail: 'Goal: Weight reduction 0.5 kg/day | QD AM',
                    time: '07:00',
                    status: 'Completed',
                    statusClass: 'nw-status-completed',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Elena Vasquez',
                        prescribed: '15/02/2026',
                        indication: 'Fluid balance monitoring — CHF',
                        route: 'N/A',
                        frequency: 'QD AM',
                        notes: 'Weigh before breakfast, same scale, same clothing. Document in fluid balance chart.',
                        history: [
                            { time: '22-03  06:50', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'Weight: 71.2 kg (yesterday 71.8 kg). Net -0.6 kg.' }
                        ]
                    }
                },
                {
                    id: 't6',
                    type: 'diagnostic',
                    typeLabel: 'Diagnostic',
                    icon: 'pi-sync',
                    name: 'ECG 12-Lead',
                    detail: 'Baseline cardiac rhythm assessment',
                    time: '12:00',
                    status: 'Not Started',
                    statusClass: 'nw-status-not-started',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Elena Vasquez',
                        prescribed: '22/03/2026',
                        indication: 'Monitoring — known atrial fibrillation with RVR',
                        route: 'Non-invasive',
                        frequency: 'QD',
                        notes: 'Document rate and rhythm. Compare with prior ECG. Alert if rate > 110 or new ST changes.',
                        history: [
                            { time: '21-03  12:00', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: 'AF with rate 88 bpm. No ST changes. Reported to Dr. Vasquez.' }
                        ]
                    }
                }
            ]
        },
        {
            id: 48,
            room: '210-A',
            name: 'JAMES O\'BRIEN',
            nurse: 'Ana Ruiz',
            acuity: 'Low',
            alerts: {
                sun:   { active: false, icon: 'pi-sun',    tooltip: '' },
                flask: { active: false, icon: 'pi-flask',  tooltip: '' },
                bell:  { active: false, icon: 'pi-bell',   tooltip: '' }
            },
            tasks: [
                {
                    id: 't7',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'ENOXAPARIN 40mg SC',
                    detail: 'Subcutaneous | QD | 18-02-26 / 25-03-26 (35 days)',
                    time: '14:00',
                    status: 'Not Started',
                    statusClass: 'nw-status-not-started',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Henrik Larsson',
                        prescribed: '18/02/2026',
                        indication: 'DVT prophylaxis — post TKA',
                        route: 'Subcutaneous',
                        frequency: 'QD',
                        notes: 'Rotate injection sites. Monitor for signs of bleeding. Last dose 22-03 06:00.',
                        history: [
                            { time: '22-03  06:00', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'Left abdomen. No local reaction.' },
                            { time: '21-03  14:00', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: '' }
                        ]
                    }
                },
                {
                    id: 't8',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Wound Dressing — Surgical Site',
                    detail: 'Goal: Wound healing — no infection signs | QD',
                    time: '10:00',
                    status: 'Completed',
                    statusClass: 'nw-status-completed',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Henrik Larsson',
                        prescribed: '18/02/2026',
                        indication: 'Post TKA wound management',
                        route: 'Topical',
                        frequency: 'QD',
                        notes: 'Assess incision for erythema, warmth, discharge, dehiscence. Use sterile technique.',
                        history: [
                            { time: '22-03  10:05', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'Wound clean and dry. No erythema. Steri-strips intact. 8 cm incision healing well.' }
                        ]
                    }
                }
            ]
        },
        {
            id: 50,
            room: '212-B',
            name: 'ANNA KOWALSKI',
            nurse: 'Ana Ruiz',
            acuity: 'High',
            alerts: {
                sun:   { active: true,  icon: 'pi-sun',    tooltip: 'Fall risk — Morse score 65, bed alarm active' },
                flask: { active: false, icon: 'pi-flask',  tooltip: '' },
                bell:  { active: true,  icon: 'pi-bell',   tooltip: 'Insulin sliding scale — BGL 14.2 mmol/L at 08:00' }
            },
            tasks: [
                {
                    id: 't11',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'INSULIN GLARGINE 20 units SC',
                    detail: 'Subcutaneous | QD Bedtime | 10-03-26 / 31-03-26 (21 days)',
                    time: '07:00',
                    status: 'Overdue',
                    statusClass: 'nw-status-overdue',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Lisa Cheng',
                        prescribed: '10/03/2026',
                        indication: 'Type 2 DM — basal insulin regimen',
                        route: 'Subcutaneous',
                        frequency: 'QD Bedtime',
                        notes: 'Check BGL before administration. Hold if BGL < 5.0 mmol/L. Document site rotation.',
                        history: [
                            { time: '21-03  22:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'BGL 9.8 mmol/L pre-dose. Left abdomen.' },
                            { time: '20-03  22:00', nurse: 'M. Torres', action: 'Given',    dotClass: 'dot-given',     note: '' }
                        ]
                    }
                },
                {
                    id: 't12',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Blood Glucose Monitoring',
                    detail: 'Goal: BGL 6-10 mmol/L | QID (AC & HS)',
                    time: '12:00',
                    status: 'Not Started',
                    statusClass: 'nw-status-not-started',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Lisa Cheng',
                        prescribed: '10/03/2026',
                        indication: 'Diabetic monitoring — Type 2 DM',
                        route: 'Capillary',
                        frequency: 'QID',
                        notes: 'Document result. Apply sliding scale if BGL > 12. Notify if BGL < 4 or > 16 mmol/L.',
                        history: [
                            { time: '22-03  08:00', nurse: 'Ana Ruiz',  action: 'Given',    dotClass: 'dot-given',     note: 'BGL 14.2 mmol/L — sliding scale applied, Dr. Cheng notified.' },
                            { time: '22-03  06:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'BGL 8.6 mmol/L. Within target.' }
                        ]
                    }
                }
            ]
        },
        {
            id: 51,
            room: '220-A',
            name: 'RAFAEL MENDEZ Cruz',
            nurse: null,
            acuity: 'Low',
            alerts: {
                sun:   { active: false, icon: 'pi-sun',    tooltip: '' },
                flask: { active: true,  icon: 'pi-flask',  tooltip: 'Penicillin allergy — mild rash documented 2021' },
                bell:  { active: false, icon: 'pi-bell',   tooltip: '' }
            },
            tasks: [
                {
                    id: 't13',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'PARACETAMOL 1g IV',
                    detail: 'Intravenous | Q6H PRN | 21-03-26 / 24-03-26 (3 days)',
                    time: '12:00',
                    status: 'Not Started',
                    statusClass: 'nw-status-not-started',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Henrik Larsson',
                        prescribed: '21/03/2026',
                        indication: 'Post-operative pain management — appendectomy',
                        route: 'Intravenous',
                        frequency: 'Q6H PRN',
                        notes: 'Assess pain score before administration (NRS). Document response 30 min post-dose. Max 4g/day.',
                        history: [
                            { time: '22-03  06:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'NRS 5/10 pre-dose. Infused over 15 min without adverse events.' }
                        ]
                    }
                },
                {
                    id: 't14',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Post-op Wound Assessment',
                    detail: 'Goal: Surgical wound healing | Q shift',
                    time: '08:00',
                    status: 'Completed',
                    statusClass: 'nw-status-completed',
                    canCheck: true,
                    order: {
                        prescriber: 'Dr. Henrik Larsson',
                        prescribed: '21/03/2026',
                        indication: 'Post-appendectomy wound surveillance',
                        route: 'N/A',
                        frequency: 'Q shift',
                        notes: 'Inspect for erythema, oedema, exudate. Dressing intact? Document findings.',
                        history: [
                            { time: '22-03  07:30', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'Wound dry and intact. Small 3cm incision healing well. No signs of infection.' }
                        ]
                    }
                }
            ]
        },
        {
            id: 99,
            room: '215-A',
            name: 'ELENA GARCIA MORALES',
            nurse: null,
            acuity: 'Med',
            alerts: {
                sun:   { active: true,  icon: 'pi-sun',   tooltip: 'Contact isolation — MRSA positive wound culture' },
                flask: { active: true,  icon: 'pi-flask', tooltip: 'Morphine allergy — documented anaphylactic reaction 2019' },
                bell:  { active: false, icon: 'pi-bell',  tooltip: '' }
            },
            tasks: [
                {
                    id: 't9',
                    type: 'medication',
                    typeLabel: 'Medication',
                    icon: 'pi-stop-circle',
                    name: 'VANCOMYCIN 1.5g IV',
                    detail: 'Intravenous | Q12H | 20-03-26 / 03-04-26 (14 days)',
                    time: '08:00',
                    status: 'Overdue',
                    statusClass: 'nw-status-overdue',
                    canCheck: false,
                    order: {
                        prescriber: 'Dr. Marcus Webb',
                        prescribed: '20/03/2026',
                        indication: 'MRSA wound infection — per sensitivity report',
                        route: 'IV Infusion over 90 min',
                        frequency: 'Q12H',
                        notes: 'Infuse over 90 minutes minimum. Monitor for red man syndrome. Trough level due before 4th dose.',
                        history: [
                            { time: '21-03  20:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'No adverse reactions. Trough 14.2 mg/L.' },
                            { time: '21-03  08:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: '' }
                        ]
                    }
                },
                {
                    id: 't10',
                    type: 'care',
                    typeLabel: 'Care',
                    icon: 'pi-heart',
                    name: 'Isolation Precautions Check',
                    detail: 'Goal: Containment of MRSA | Q shift',
                    time: '08:00',
                    status: 'Overdue',
                    statusClass: 'nw-status-overdue',
                    canCheck: true,
                    order: {
                        prescriber: 'Infection Control',
                        prescribed: '20/03/2026',
                        indication: 'MRSA positive — contact isolation',
                        route: 'N/A',
                        frequency: 'Q shift',
                        notes: 'Verify: gown and gloves available at door, isolation sign posted, dedicated equipment in room.',
                        history: [
                            { time: '21-03  23:00', nurse: 'J. Lima',   action: 'Given',    dotClass: 'dot-given',     note: 'Isolation precautions intact. PPE stock replenished.' }
                        ]
                    }
                }
            ]
        }
    ],

    handoffVitals: {
        46: { bp: [128,130,127,132,129,128,131,130], hr: [72,74,71,75,73,70,72,74], spo2: [97,97,96,97,98,97,97,98] },
        47: { bp: [148,152,150,155,149,151,148,150], hr: [88,92,90,95,89,91,88,90], spo2: [94,93,95,94,95,96,95,94] },
        48: { bp: [120,122,119,121,118,120,121,122], hr: [65,67,66,68,65,64,66,67], spo2: [99,99,98,99,99,98,99,99] },
        50: { bp: [136,138,140,135,137,139,136,138], hr: [78,80,82,79,81,80,78,80], spo2: [96,95,96,97,96,96,95,96] },
        51: { bp: [118,120,117,119,116,118,120,119], hr: [68,70,69,71,68,67,69,70], spo2: [98,99,98,99,99,98,98,99] },
        99: { bp: [138,140,142,136,139,141,138,140], hr: [80,82,85,83,81,80,82,84], spo2: [96,96,97,96,95,96,97,96] }
    }
};


/* ============================================================
 * MODULE STATE
 * Angular: Becomes component properties / BehaviorSubjects
 * ============================================================ */
var NW_STATE = {
    activeTab: 'my-patients',
    selectedWard: '201-220',
    selectedShift: 'morning',
    selectedNurse: 'n1',
    searchQuery: '',
    panelOpen: false,
    panelTask: null,
    panelPatient: null,
    handoffSigned: false,
    handoffTimestamp: ''
};


/* ============================================================
 * UTILITY — determine which patients to show per tab
 * Angular: Replaced by a computed signal / pipe
 * ============================================================ */
function getFilteredPatients(tabId) {
    var all = NW_DATA.patients;

    if (tabId === 'my-patients') {
        return all.filter(function(p) { return p.nurse !== null; });
    }
    if (tabId === 'unassigned') {
        return all.filter(function(p) { return p.nurse === null; });
    }
    if (tabId === 'overdue') {
        return all.filter(function(p) {
            return p.tasks.some(function(t) { return t.status === 'Overdue'; });
        });
    }
    if (tabId === 'handoff') {
        return all;
    }
    return all;
}

function applySearch(patients) {
    var q = NW_STATE.searchQuery.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(function(p) {
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.room.toLowerCase().includes(q)) return true;
        return p.tasks.some(function(t) {
            return t.name.toLowerCase().includes(q) || t.detail.toLowerCase().includes(q);
        });
    });
}


/* ============================================================
 * RENDER: TABS BAR
 * Angular: <p-tabMenu [model]="tabs" [activeItem]="activeTab">
 * ============================================================ */
var NW_TABS = [
    { id: 'my-patients', label: 'My Patients', count: 4, icon: null },
    { id: 'unassigned',  label: 'Unassigned',  count: 2, icon: null },
    { id: 'overdue',     label: 'Overdue',     count: 3, icon: null },
    { id: 'handoff',     label: 'Handoff',     count: null, icon: 'pi-refresh' }
];

function renderNWTabs() {
    var el = document.getElementById('nw-tabs-bar');
    if (!el) return;

    var html = '<div class="nw-tabs-row">';
    NW_TABS.forEach(function(tab) {
        var activeClass = NW_STATE.activeTab === tab.id ? ' nw-tab-active' : '';
        var badge = tab.count !== null
            ? '<span class="nw-tab-badge">' + tab.count + '</span>'
            : '';
        var iconHtml = tab.icon
            ? '<i class="pi ' + tab.icon + ' nw-tab-icon"></i>'
            : '';
        html += '<button class="nw-tab' + activeClass + '" data-tab="' + tab.id + '" onclick="nwSwitchTab(\'' + tab.id + '\')">'
             + tab.label + ' ' + badge + iconHtml
             + '</button>';
    });
    html += '</div>';
    el.innerHTML = html;
}


/* ============================================================
 * RENDER: TOOLBAR
 * Angular: <p-toolbar> with <p-dropdown> selects
 * ============================================================ */
function renderNWToolbar() {
    var el = document.getElementById('nw-toolbar');
    if (!el) return;

    var wardOptions = NW_DATA.wardOptions.map(function(o) {
        return '<option value="' + o.value + '"' + (NW_STATE.selectedWard === o.value ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');

    var shiftOptions = NW_DATA.shiftOptions.map(function(o) {
        return '<option value="' + o.value + '"' + (NW_STATE.selectedShift === o.value ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');

    var nurseOptions = NW_DATA.nurseOptions.map(function(o) {
        return '<option value="' + o.value + '"' + (NW_STATE.selectedNurse === o.value ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');

    el.innerHTML = '<div class="nw-toolbar-inner">'
        + '<div class="nw-toolbar-left">'
        + '<span class="nw-filter-label">Ward:</span>'
        + '<select class="nw-filter-select" onchange="nwSetWard(this.value)">' + wardOptions + '</select>'
        + '<div class="nw-toolbar-separator"></div>'
        + '<span class="nw-filter-label">Shift:</span>'
        + '<select class="nw-filter-select" onchange="nwSetShift(this.value)">' + shiftOptions + '</select>'
        + '<div class="nw-toolbar-separator"></div>'
        + '<span class="nw-filter-label">Nurse:</span>'
        + '<select class="nw-filter-select" onchange="nwSetNurse(this.value)">' + nurseOptions + '</select>'
        + '</div>'
        + '<div class="nw-toolbar-right">'
        + '<div class="nw-search-wrapper">'
        + '<i class="pi pi-search nw-search-icon"></i>'
        + '<input type="text" class="nw-search-input" placeholder="Search Patient/Task…" value="' + NW_STATE.searchQuery + '" oninput="nwSetSearch(this.value)">'
        + '</div>'
        + '</div>'
        + '</div>';
}


/* ============================================================
 * RENDER: PATIENT TASK LIST
 * Angular: *ngFor over patients | async pipe; nested *ngFor over tasks
 * ============================================================ */
function buildAlertIcon(info) {
    var activeClass = info.active ? ' nw-alert-active' : '';
    if (info.icon === 'pi-bell' && info.active) activeClass += ' nw-alert-bell';
    var tooltipHtml = info.tooltip
        ? '<span class="nw-tooltip">' + info.tooltip + '</span>'
        : '';
    return '<span class="nw-alert-icon' + activeClass + '" title="">'
        + '<i class="pi ' + info.icon + '"></i>'
        + tooltipHtml
        + '</span>';
}

function buildStatusChip(task) {
    return '<span class="nw-status-chip ' + task.statusClass + '">' + task.status + '</span>';
}

function buildTaskActions(task) {
    var html = '<div class="nw-task-actions">';
    if (task.canCheck) {
        html += '<button class="nw-task-action-btn nw-task-check-btn" onclick="event.stopPropagation(); nwQuickComplete(\'' + task.id + '\')" title="Quick Complete"><i class="pi pi-check"></i></button>';
    }
    html += '<button class="nw-task-action-btn" onclick="event.stopPropagation(); nwOpenPanel(\'' + task.id + '\')" title="More options"><i class="pi pi-ellipsis-v"></i></button>';
    html += '</div>';
    return html;
}

function buildTaskRow(task, patientId) {
    return '<div class="nw-task-row nw-type-' + task.type + '" data-task-id="' + task.id + '" data-patient-id="' + patientId + '" onclick="nwOpenPanel(\'' + task.id + '\')">'
        + '<div class="nw-task-type-cell"><i class="pi ' + task.icon + '"></i></div>'
        + '<div class="nw-task-type-label">' + task.typeLabel + '</div>'
        + '<div class="nw-task-info">'
        +   '<div class="nw-task-name">' + task.name + '</div>'
        +   '<div class="nw-task-detail">' + task.detail + '</div>'
        + '</div>'
        + '<div class="nw-task-time">' + task.time + '</div>'
        + '<div class="nw-task-status">' + buildStatusChip(task) + '</div>'
        + buildTaskActions(task)
        + '</div>';
}

function buildPatientBlock(patient) {
    var alerts = patient.alerts;
    var alertsHtml = buildAlertIcon(alerts.sun) + buildAlertIcon(alerts.flask) + buildAlertIcon(alerts.bell);

    var nurseHtml = patient.nurse
        ? '<span class="nw-patient-nurse"><i class="pi pi-user"></i> ' + patient.nurse + '</span>'
        : '<span class="nw-patient-nurse nw-nurse-unassigned"><i class="pi pi-exclamation-circle"></i> Unassigned</span>';

    var acuityClass = 'nw-acuity-' + (patient.acuity ? patient.acuity.toLowerCase() : 'low');
    var acuityHtml = '<span class="nw-acuity-badge ' + acuityClass + '">Acuity: ' + (patient.acuity || 'Low') + '</span>';

    var tasksHtml = patient.tasks.map(function(t) {
        return buildTaskRow(t, patient.id);
    }).join('');

    return '<div class="nw-patient-block" data-patient-id="' + patient.id + '">'
        + '<div class="nw-patient-header">'
        +   '<span class="nw-patient-id">' + patient.room + ' | ' + patient.name + '</span>'
        +   '<div class="nw-patient-alerts">' + alertsHtml + '</div>'
        +   '<div class="nw-patient-spacer"></div>'
        +   '<div class="nw-patient-meta">' + nurseHtml + acuityHtml + '</div>'
        + '</div>'
        + tasksHtml
        + '</div>';
}

function renderNWTaskList() {
    var el = document.getElementById('nw-content');
    if (!el) return;

    var patients = getFilteredPatients(NW_STATE.activeTab);
    patients = applySearch(patients);

    if (patients.length === 0) {
        el.innerHTML = '<div class="nw-empty-state">'
            + '<i class="pi pi-inbox"></i>'
            + '<div class="nw-empty-state-title">No tasks found</div>'
            + '<div class="nw-empty-state-desc">Try adjusting your filters or search query.</div>'
            + '</div>';
        return;
    }

    el.innerHTML = patients.map(buildPatientBlock).join('');
}


/* ============================================================
 * RENDER: TASK DETAIL PANEL
 * Angular: <p-sidebar [(visible)]="panelOpen" position="right" styleClass="nw-panel">
 * ============================================================ */
function renderNWPanel(task, patient) {
    var panel = document.getElementById('nwPanel');
    if (!panel) return;

    var iconClass = {
        medication: 'pi-stop-circle',
        care: 'pi-heart',
        diagnostic: 'pi-sync'
    }[task.type] || 'pi-circle';

    var typeIconClass = 'nw-panel-type-icon nw-panel-type-' + (task.type || 'default');

    var historyHtml = '';
    if (task.order.history && task.order.history.length > 0) {
        historyHtml = '<ul class="nw-history-list">'
            + task.order.history.map(function(h) {
                var actionClass = h.action === 'Given' ? 'action-given' : (h.action === 'Skipped' ? 'action-skipped' : 'action-not-given');
                return '<li class="nw-history-item">'
                    + '<div class="nw-history-dot ' + h.dotClass + '"></div>'
                    + '<div class="nw-history-content">'
                    +   '<div class="nw-history-meta">'
                    +     '<span class="nw-history-time">' + h.time + '</span>'
                    +     '<span class="nw-history-nurse">' + h.nurse + '</span>'
                    +     '<span class="nw-history-action ' + actionClass + '">' + h.action + '</span>'
                    +   '</div>'
                    +   (h.note ? '<div class="nw-history-note">' + h.note + '</div>' : '')
                    + '</div>'
                    + '</li>';
            }).join('')
            + '</ul>';
    } else {
        historyHtml = '<p class="nw-history-empty">No previous administrations recorded this episode.</p>';
    }

    panel.innerHTML = '<div class="nw-panel-header">'
        + '<div class="nw-panel-title"><i class="pi ' + iconClass + ' ' + typeIconClass + '"></i> ' + task.typeLabel + ' Order</div>'
        + '<button class="nw-panel-close" onclick="closeTaskPanel()"><i class="pi pi-times"></i></button>'
        + '</div>'
        + '<div class="nw-panel-body">'
        +   '<div class="nw-panel-section">'
        +     '<div class="nw-panel-section-title">Patient</div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Room / Name</span><span class="nw-panel-field-value">' + patient.room + ' — ' + patient.name + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Nurse</span><span class="nw-panel-field-value">' + (patient.nurse || 'Unassigned') + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Acuity</span><span class="nw-panel-field-value">' + (patient.acuity || 'Low') + '</span></div>'
        +   '</div>'
        +   '<div class="nw-panel-section">'
        +     '<div class="nw-panel-section-title">Order Detail</div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Drug / Task</span><span class="nw-panel-field-value">' + task.name + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Route</span><span class="nw-panel-field-value">' + task.order.route + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Frequency</span><span class="nw-panel-field-value">' + task.order.frequency + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Prescribed by</span><span class="nw-panel-field-value">' + task.order.prescriber + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Prescribed</span><span class="nw-panel-field-value">' + task.order.prescribed + '</span></div>'
        +     '<div class="nw-panel-field"><span class="nw-panel-field-label">Indication</span><span class="nw-panel-field-value">' + task.order.indication + '</span></div>'
        +     (task.order.notes ? '<div class="nw-panel-field"><span class="nw-panel-field-label">Notes</span><span class="nw-panel-field-value nw-panel-notes-value">' + task.order.notes + '</span></div>' : '')
        +   '</div>'
        +   '<div class="nw-panel-section">'
        +     '<div class="nw-panel-section-title">Execution History</div>'
        +     historyHtml
        +   '</div>'
        + '</div>'
        + '<div class="nw-panel-actions">'
        +   '<button class="nw-panel-btn nw-panel-btn-complete" onclick="nwPanelAction(\'complete\')"><i class="pi pi-check-circle"></i> Complete</button>'
        +   '<button class="nw-panel-btn" onclick="nwPanelAction(\'document\')"><i class="pi pi-pencil"></i> Document</button>'
        +   '<button class="nw-panel-btn nw-panel-btn-skip" onclick="nwPanelAction(\'skip\')"><i class="pi pi-ban"></i> Skip</button>'
        +   '<button class="nw-panel-btn" onclick="nwPanelAction(\'reassign\')"><i class="pi pi-user-edit"></i> Reassign</button>'
        + '</div>';
}


/* ============================================================
 * RENDER: HANDOFF MODE
 * Angular: HandoffComponent with p-table and SVG sparklines
 * ============================================================ */
function buildSparklineSVG(values, color, min, max) {
    var w = 80, h = 22, pad = 2;
    var range = (max - min) || 1;
    var n = values.length;
    var stepX = (w - 2 * pad) / (n - 1);

    var points = values.map(function(v, i) {
        var x = pad + i * stepX;
        var y = h - pad - ((v - min) / range) * (h - 2 * pad);
        return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');

    return '<svg width="' + w + '" height="' + h + '" class="nw-sparkline-svg" viewBox="0 0 ' + w + ' ' + h + '">'
        + '<polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>'
        + '<circle cx="' + (pad + (n-1) * stepX).toFixed(1) + '" cy="' + (h - pad - ((values[n-1] - min) / range) * (h - 2 * pad)).toFixed(1) + '" r="3" fill="' + color + '"/>'
        + '</svg>';
}

function buildSparklineCell(vitals) {
    if (!vitals) return '<span class="nw-sparkline-empty">—</span>';

    var bpMin = Math.min.apply(null, vitals.bp) - 5;
    var bpMax = Math.max.apply(null, vitals.bp) + 5;
    var hrMin = Math.min.apply(null, vitals.hr) - 3;
    var hrMax = Math.max.apply(null, vitals.hr) + 3;
    var spo2Min = 90;
    var spo2Max = 100;

    return '<div class="nw-sparkline-wrap">'
        + '<div class="nw-sparkline-row"><span class="nw-sparkline-label">BP</span>'  + buildSparklineSVG(vitals.bp,   '#1e88e5', bpMin, bpMax)   + '</div>'
        + '<div class="nw-sparkline-row"><span class="nw-sparkline-label">HR</span>'  + buildSparklineSVG(vitals.hr,   '#e91e63', hrMin, hrMax)   + '</div>'
        + '<div class="nw-sparkline-row"><span class="nw-sparkline-label">SpO2</span>'+ buildSparklineSVG(vitals.spo2, '#2e7d32', spo2Min, spo2Max)+ '</div>'
        + '</div>';
}

function buildHandoffTableRow(patient) {
    var planned = patient.tasks.length;
    var executed = patient.tasks.filter(function(t) { return t.status === 'Completed'; }).length;
    var inprogress = patient.tasks.filter(function(t) { return t.status === 'In Progress'; }).length;
    var pending = patient.tasks.filter(function(t) { return t.status === 'Not Started' || t.status === 'Due Soon'; }).length;
    var overdue = patient.tasks.filter(function(t) { return t.status === 'Overdue'; }).length;

    var vitals = NW_DATA.handoffVitals[patient.id] || null;

    return '<tr>'
        + '<td><span class="nw-hf-patient">' + patient.room + ' — ' + patient.name + '</span></td>'
        + '<td class="nw-hf-center"><span class="nw-hf-num planned">' + planned + '</span></td>'
        + '<td class="nw-hf-center"><span class="nw-hf-num executed">' + executed + '</span></td>'
        + '<td class="nw-hf-center"><span class="nw-hf-num pending">' + pending + '</span></td>'
        + '<td class="nw-hf-center"><span class="nw-hf-num overdue">' + overdue + '</span></td>'
        + '<td class="nw-sparkline-cell">' + buildSparklineCell(vitals) + '</td>'
        + '</tr>';
}

function renderHandoffMode() {
    var el = document.getElementById('nw-handoff');
    if (!el) return;

    var patients = NW_DATA.patients;

    var rowsHtml = patients.map(buildHandoffTableRow).join('');

    var signBtnHtml = NW_STATE.handoffSigned
        ? '<button class="nw-btn-sign signed" disabled><i class="pi pi-check-circle"></i> Handoff Signed</button>'
          + '<span class="nw-sign-timestamp show"><i class="pi pi-clock"></i> ' + NW_STATE.handoffTimestamp + ' — Ana Ruiz</span>'
        : '<button class="nw-btn-sign" onclick="nwSignHandoff()"><i class="pi pi-lock"></i> Accept &amp; Sign Handoff</button>'
          + '<span class="nw-sign-timestamp" id="nwSignTimestamp"></span>';

    el.innerHTML = '<div class="nw-handoff-header">'
        + '<div class="nw-handoff-title"><i class="pi pi-refresh"></i> Shift Handoff<span class="nw-handoff-shift-badge">Morning 07:00 – 15:00</span></div>'
        + '</div>'
        + '<div class="nw-handoff-table-wrapper">'
        + '<table class="nw-handoff-table">'
        + '<thead><tr>'
        +   '<th>Patient</th>'
        +   '<th class="nw-th-center">Planned</th>'
        +   '<th class="nw-th-center">Executed</th>'
        +   '<th class="nw-th-center">Pending</th>'
        +   '<th class="nw-th-center">Overdue</th>'
        +   '<th>Vitals Trend (8h)</th>'
        + '</tr></thead>'
        + '<tbody>' + rowsHtml + '</tbody>'
        + '</table>'
        + '</div>'
        + '<div class="nw-handoff-sign-row">'
        +   '<div class="nw-handoff-sign-info"><i class="pi pi-info-circle"></i> By signing you confirm the accuracy of this shift record and legally transfer responsibility to the incoming nurse.</div>'
        +   signBtnHtml
        + '</div>';
}


/* ============================================================
 * TAB SWITCHING
 * Angular: (activeItemChange) on p-tabMenu → router navigate or ngIf
 * ============================================================ */
function nwSwitchTab(tabId) {
    NW_STATE.activeTab = tabId;

    var isHandoff = (tabId === 'handoff');

    var contentEl = document.getElementById('nw-content');
    var handoffEl = document.getElementById('nw-handoff');
    var toolbarEl = document.getElementById('nw-toolbar');

    if (isHandoff) {
        if (contentEl) contentEl.classList.add('nw-hidden');
        if (handoffEl) { handoffEl.classList.remove('nw-hidden'); renderHandoffMode(); }
        if (toolbarEl) toolbarEl.classList.add('nw-toolbar-hidden');
    } else {
        if (contentEl) contentEl.classList.remove('nw-hidden');
        if (handoffEl) handoffEl.classList.add('nw-hidden');
        if (toolbarEl) toolbarEl.classList.remove('nw-toolbar-hidden');
        renderNWTaskList();
    }

    renderNWTabs();
}


/* ============================================================
 * TOOLBAR EVENT HANDLERS
 * Angular: Component methods bound with (change)
 * ============================================================ */
function nwSetWard(val)  { NW_STATE.selectedWard  = val; }
function nwSetShift(val) { NW_STATE.selectedShift = val; }
function nwSetNurse(val) { NW_STATE.selectedNurse = val; renderNWTaskList(); }

function nwSetSearch(val) {
    NW_STATE.searchQuery = val;
    renderNWTaskList();
}


/* ============================================================
 * PANEL OPEN / CLOSE
 * Angular: NursingPanelComponent @Output panelOpen = new EventEmitter()
 * ============================================================ */
function nwOpenPanel(taskId) {
    var task = null;
    var patient = null;

    NW_DATA.patients.some(function(p) {
        var found = p.tasks.find(function(t) { return t.id === taskId; });
        if (found) { task = found; patient = p; return true; }
        return false;
    });

    if (!task || !patient) return;

    NW_STATE.panelOpen = true;
    NW_STATE.panelTask = task;
    NW_STATE.panelPatient = patient;

    renderNWPanel(task, patient);

    var overlay = document.getElementById('nwPanelOverlay');
    var panel   = document.getElementById('nwPanel');
    if (overlay) overlay.classList.add('show');
    if (panel)   panel.classList.add('open');
}

function closeTaskPanel() {
    NW_STATE.panelOpen = false;
    var overlay = document.getElementById('nwPanelOverlay');
    var panel   = document.getElementById('nwPanel');
    if (overlay) overlay.classList.remove('show');
    if (panel)   panel.classList.remove('open');
}


/* ============================================================
 * PANEL ACTION HANDLERS
 * Angular: NursingPanelComponent methods, emit (actionComplete)
 * ============================================================ */
function nwPanelAction(action) {
    if (!NW_STATE.panelTask) return;
    var task = NW_STATE.panelTask;

    if (action === 'complete') {
        task.status = 'Completed';
        task.statusClass = 'nw-status-completed';
        task.order.history.unshift({
            time: '22-03 ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            nurse: NW_DATA.currentNurse.name,
            action: 'Given',
            dotClass: 'dot-given',
            note: 'Completed via panel action.'
        });
        closeTaskPanel();
        renderNWTaskList();
    } else if (action === 'skip') {
        task.status = 'Skipped';
        task.statusClass = 'nw-status-skipped';
        task.order.history.unshift({
            time: '22-03 ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            nurse: NW_DATA.currentNurse.name,
            action: 'Skipped',
            dotClass: 'dot-skipped',
            note: 'Skipped via panel action.'
        });
        closeTaskPanel();
        renderNWTaskList();
    } else if (action === 'document') {
        console.log('Document action for task:', task.id);
        alert('Documentation form would open here (Angular: router.navigate to /nursing/document/' + task.id + ')');
    } else if (action === 'reassign') {
        console.log('Reassign action for task:', task.id);
        alert('Nurse reassignment dialog would open here (Angular: p-dialog with NursePickerComponent)');
    }
}


/* ============================================================
 * QUICK COMPLETE (checkmark button in task row)
 * Angular: Directive or method on task row with stopPropagation()
 * ============================================================ */
function nwQuickComplete(taskId) {
    var task = null;
    NW_DATA.patients.some(function(p) {
        var found = p.tasks.find(function(t) { return t.id === taskId; });
        if (found) { task = found; return true; }
        return false;
    });
    if (!task) return;
    task.status = 'Completed';
    task.statusClass = 'nw-status-completed';
    task.order.history.unshift({
        time: '22-03 ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        nurse: NW_DATA.currentNurse.name,
        action: 'Given',
        dotClass: 'dot-given',
        note: 'Quick completed.'
    });
    renderNWTaskList();
}


/* ============================================================
 * HANDOFF SIGNATURE
 * Angular: HandoffService.signHandoff() → POST /api/v1/nursing/handoff/sign
 * ============================================================ */
function nwSignHandoff() {
    var now = new Date();
    NW_STATE.handoffSigned = true;
    NW_STATE.handoffTimestamp = now.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    renderHandoffMode();
}


/* ============================================================
 * INITIALIZATION
 * Angular: ngOnInit() in NursingWorkbenchComponent
 * ============================================================ */
function initNursingWorkbench() {
    renderNWTabs();
    renderNWToolbar();
    renderNWTaskList();
}

document.addEventListener('DOMContentLoaded', initNursingWorkbench);
