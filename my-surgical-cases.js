/**
 * @file my-surgical-cases.js — Surgical Cases Module
 * @description Vista de lista quirúrgica del ECH EHR.
 *   Mock data → GET /api/v1/surgical/cases
 *   Angular 15: SurgicalCasesComponent (Standalone) + SurgicalCaseService
 */

/* ============================================================
 * MOCK DATA — SurgicalCaseDTO[]
 * Angular: reemplazar por HttpClient.get<SurgicalCaseDTO[]>('/api/v1/surgical/cases')
 * ============================================================ */
var surgicalCases = [
    {
        id: 201, name: 'María García López',  dob: '1958-03-14', age: 67, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '07:30',
        procedure: 'Total Knee Replacement (TKR)',
        orRoom: 'OR-1', status: 'In Theatre', estimatedDurationMin: 120, readiness: 100,
        alerts: ['Allergy: Penicillin', 'Anticoagulation'],
        surgeon: 'Dr. Fernández',  anesthesiologist: 'Dr. Prada',  department: 'Orthopedics'
    },
    {
        id: 202, name: 'Carlos Martínez Ruiz', dob: '1970-07-22', age: 55, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '08:00',
        procedure: 'Laparoscopic Cholecystectomy',
        orRoom: 'OR-2', status: 'In Theatre', estimatedDurationMin: 90, readiness: 100,
        alerts: [],
        surgeon: 'Dr. López',      anesthesiologist: 'Dr. Rueda',  department: 'General Surgery'
    },
    {
        id: 203, name: 'Elena Rodríguez Díaz', dob: '1985-11-03', age: 40, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '09:30',
        procedure: 'Appendectomy (Laparoscopic)',
        orRoom: 'OR-3', status: 'Ready', estimatedDurationMin: 75, readiness: 100,
        alerts: ['Allergy: Sulfa'],
        surgeon: 'Dr. Navarro',    anesthesiologist: 'Dr. Prada',  department: 'General Surgery'
    },
    {
        id: 204, name: 'José Antonio Pérez',   dob: '1962-01-19', age: 64, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '10:00',
        procedure: 'Coronary Artery Bypass Graft (CABG)',
        orRoom: 'OR-4', status: 'Pre-op Pending', estimatedDurationMin: 240, readiness: 60,
        alerts: ['DNR', 'Anticoagulation'],
        surgeon: 'Dr. Rory Rogers', anesthesiologist: 'Dr. Rueda', department: 'Cardiology'
    },
    {
        id: 205, name: 'Lucía Hernández Gil',  dob: '1990-05-30', age: 35, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '11:00',
        procedure: 'Thyroidectomy (Total)',
        orRoom: 'OR-1', status: 'Scheduled', estimatedDurationMin: 100, readiness: 30,
        alerts: ['Allergy: Latex'],
        surgeon: 'Dr. Moreno',     anesthesiologist: 'Dr. Prada',  department: 'Endocrinology'
    },
    {
        id: 206, name: 'Fernando Muñoz Vega',  dob: '1955-09-11', age: 70, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '12:30',
        procedure: 'Hip Arthroplasty',
        orRoom: 'OR-2', status: 'Scheduled', estimatedDurationMin: 110, readiness: 20,
        alerts: ['Allergy: Contrast', 'Anticoagulation'],
        surgeon: 'Dr. Fernández',  anesthesiologist: 'Dr. Rueda',  department: 'Orthopedics'
    },
    {
        id: 207, name: 'Ana Belén Torres',     dob: '1978-12-25', age: 47, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '13:00',
        procedure: 'Mastectomy (Left)',
        orRoom: 'OR-3', status: 'Requested', estimatedDurationMin: 150, readiness: 0,
        alerts: [],
        surgeon: 'Dr. Navarro',    anesthesiologist: 'Dr. Prada',  department: 'Oncology'
    },
    {
        id: 208, name: 'Miguel Ángel Soto',    dob: '1948-04-07', age: 77, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '07:00',
        procedure: 'Carotid Endarterectomy',
        orRoom: 'OR-4', status: 'Completed', estimatedDurationMin: 180, readiness: 100,
        alerts: ['DNR', 'Anticoagulation'],
        surgeon: 'Dr. López',      anesthesiologist: 'Dr. Rueda',  department: 'Vascular Surgery'
    },
    {
        id: 209, name: 'Isabel Romero Castro', dob: '1966-08-16', age: 59, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '06:30',
        procedure: 'Hysterectomy (Laparoscopic)',
        orRoom: 'OR-1', status: 'Completed', estimatedDurationMin: 130, readiness: 100,
        alerts: [],
        surgeon: 'Dr. Moreno',     anesthesiologist: 'Dr. Prada',  department: 'Gynaecology'
    },
    {
        id: 210, name: 'Pablo Jiménez Reyes',  dob: '1982-02-28', age: 44, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '14:00',
        procedure: 'Hernia Repair (Inguinal)',
        orRoom: 'OR-2', status: 'Scheduled', estimatedDurationMin: 60, readiness: 10,
        alerts: [],
        surgeon: 'Dr. Rory Rogers', anesthesiologist: 'Dr. Rueda', department: 'General Surgery'
    },
    {
        id: 211, name: 'Rosa María Delgado',   dob: '1973-06-09', age: 52, gender: 'Female',
        scheduledDate: '2026-03-22', scheduledTime: '15:00',
        procedure: 'Spinal Fusion (L4-L5)',
        orRoom: 'OR-3', status: 'Requested', estimatedDurationMin: 210, readiness: 0,
        alerts: ['Allergy: Iodine'],
        surgeon: 'Dr. Navarro',    anesthesiologist: 'Dr. Prada',  department: 'Neurosurgery'
    },
    {
        id: 212, name: 'Andrés Vargas Pinto',  dob: '1951-10-05', age: 74, gender: 'Male',
        scheduledDate: '2026-03-22', scheduledTime: '10:30',
        procedure: 'Prostatectomy (Robotic)',
        orRoom: 'OR-4', status: 'Cancelled', estimatedDurationMin: 180, readiness: 0,
        alerts: ['Anticoagulation', 'Allergy: NSAIDs'],
        surgeon: 'Dr. López',      anesthesiologist: 'Dr. Rueda',  department: 'Urology'
    }
];

/* ============================================================
 * STATE
 * ============================================================ */
var surgSortField   = null;
var surgSortAsc     = true;
var surgLocFilter   = 'loc-all';
var surgScopeFilter = 'all';
var surgSearchTerm  = '';

var SURG_STATUS_ORDER = [
    'Requested', 'Scheduled', 'Pre-op Pending', 'Ready', 'In Theatre', 'Completed', 'Cancelled'
];

/* ============================================================
 * INIT
 * ============================================================ */
function updateSurgTabCounts() {
    var all = surgicalCases;
    var counts = {
        'loc-all':       all.length,
        'loc-recent':    all.filter(function(c) {
            return c.status === 'Scheduled' || c.status === 'Pre-op Pending' || c.status === 'Requested';
        }).length,
        'loc-discharge': all.filter(function(c) { return c.status === 'Completed'; }).length,
        'loc-icu':       0,
        'loc-surgery':   all.filter(function(c) { return c.status === 'In Theatre'; }).length
    };
    Object.keys(counts).forEach(function(tabId) {
        var btn = document.querySelector('[data-tab-id="' + tabId + '"]');
        if (btn) {
            var badge = btn.querySelector('.tab-count');
            if (badge) badge.textContent = counts[tabId];
        }
    });
}

function initSurgicalCases() {
    var wardLabel = document.querySelector('[data-field="wardName"]');
    if (wardLabel) wardLabel.textContent = 'Surgical Cases';
    updateSurgTabCounts();
    renderSurgList();
    wireSurgTabs();
    wireSurgSearch();
}

/* ============================================================
 * SEARCH WIRING
 * ============================================================ */
function wireSurgSearch() {
    window.handleToolbarSearch = function (value) {
        surgSearchTerm = (value || '').toLowerCase();
        renderSurgList();
    };
}

/* ============================================================
 * TAB WIRING
 * ============================================================ */
function wireSurgTabs() {
    var origHandleTabClick = window.handleTabClick;
    window.handleTabClick = function (tabId) {
        if (tabId.startsWith('loc-')) {
            var buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(function (btn) { btn.classList.remove('tab-btn-active'); });
            var activeBtn = document.querySelector('[data-tab-id="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('tab-btn-active');
            surgLocFilter = tabId;
            renderSurgList();
        } else if (origHandleTabClick) {
            origHandleTabClick(tabId);
        }
    };

    var origHandleScopeChange = window.handleScopeChange;
    window.handleScopeChange = function (scope) {
        if (origHandleScopeChange) origHandleScopeChange(scope);
        surgScopeFilter = scope;
        renderSurgList();
    };
}

/* ============================================================
 * STATUS HELPERS
 * ============================================================ */
function getSurgStatusClass(status) {
    var map = {
        'Requested':      'surg-status-requested',
        'Scheduled':      'surg-status-scheduled',
        'Pre-op Pending': 'surg-status-preop',
        'Ready':          'surg-status-ready',
        'In Theatre':     'surg-status-intheatre',
        'Completed':      'surg-status-completed',
        'Cancelled':      'surg-status-cancelled'
    };
    return map[status] || '';
}

/* ============================================================
 * ALERT HELPERS (reuse day-hospital severity model)
 * ============================================================ */
function getSurgAlertSeverity(alert) {
    if (alert.includes('Allergy'))         return 'danger';
    if (alert === 'DNR')                   return 'dnr';
    if (alert === 'Anticoagulation')       return 'warning';
    return 'info';
}

function getSurgAlertIcon(alert) {
    if (alert.includes('Allergy'))         return 'pi-exclamation-circle';
    if (alert === 'DNR')                   return 'pi-ban';
    if (alert === 'Anticoagulation')       return 'pi-heart-fill';
    return 'pi-info-circle';
}

function renderSurgAlertChips(alerts) {
    if (!alerts || alerts.length === 0) return '<span class="no-alerts">\u2014</span>';

    var maxVisible = 3;
    var html = '';
    for (var i = 0; i < Math.min(alerts.length, maxVisible); i++) {
        var sev  = getSurgAlertSeverity(alerts[i]);
        var icon = getSurgAlertIcon(alerts[i]);
        html += '<span class="p-tag-custom p-tag-' + sev + '" data-tooltip="' + alerts[i] + '" title="' + alerts[i] + '">' +
                '<i class="pi ' + icon + '"></i>' +
                '</span> ';
    }
    if (alerts.length > maxVisible) {
        var remaining   = alerts.length - maxVisible;
        var tooltipText = alerts.slice(maxVisible).join(', ');
        html += '<span class="p-tag-custom p-tag-info ed-alert-overflow" data-tooltip="' + tooltipText + '" title="' + tooltipText + '">+' + remaining + '</span>';
    }
    return html;
}

/* ============================================================
 * READINESS BAR
 * ============================================================ */
function renderReadinessBar(pct, status) {
    if (status === 'Cancelled') {
        return '<span class="surg-readiness-na">N/A</span>';
    }
    var color = pct === 100 ? 'var(--ech-clinical-success)' :
                pct >= 60   ? 'var(--ech-warning)'          :
                              'var(--ech-primary)';
    return '<div class="surg-readiness-wrap" title="Readiness ' + pct + '%">' +
           '<div class="surg-readiness-bar" style="width:' + pct + '%; background:' + color + '"></div>' +
           '<span class="surg-readiness-label">' + pct + '%</span>' +
           '</div>';
}

/* ============================================================
 * DURATION FORMAT
 * ============================================================ */
function formatSurgMinutes(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
    if (h > 0) return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
    return m + 'm';
}

/* ============================================================
 * FILTERING & SORTING
 * ============================================================ */
function getFilteredSurgCases() {
    var list = surgicalCases.slice();

    if (surgLocFilter === 'loc-recent') {
        list = list.filter(function (c) {
            return c.status === 'Scheduled' || c.status === 'Pre-op Pending' || c.status === 'Requested';
        });
    } else if (surgLocFilter === 'loc-discharge') {
        list = list.filter(function (c) { return c.status === 'Completed'; });
    } else if (surgLocFilter === 'loc-icu') {
        list = list.filter(function () { return false; });
    } else if (surgLocFilter === 'loc-surgery') {
        list = list.filter(function (c) { return c.status === 'In Theatre'; });
    }

    if (surgScopeFilter === 'mine') {
        list = list.filter(function (c) {
            return c.surgeon === CURRENT_USER.name;
        });
    } else if (surgScopeFilter === 'dept') {
        list = list.filter(function (c) {
            return c.department === CURRENT_USER.department;
        });
    }

    if (surgSearchTerm) {
        list = list.filter(function (c) {
            var text = (c.name + ' ' + c.procedure + ' ' + c.orRoom + ' ' +
                        c.status + ' ' + c.surgeon).toLowerCase();
            return text.indexOf(surgSearchTerm) !== -1;
        });
    }

    if (surgSortField) {
        list.sort(function (a, b) {
            var va, vb;
            if (surgSortField === 'status') {
                va = SURG_STATUS_ORDER.indexOf(a.status);
                vb = SURG_STATUS_ORDER.indexOf(b.status);
            } else {
                va = a[surgSortField];
                vb = b[surgSortField];
            }
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return surgSortAsc ? -1 : 1;
            if (va > vb) return surgSortAsc ?  1 : -1;
            return 0;
        });
    }

    return list;
}

/* ============================================================
 * SORT ICON
 * ============================================================ */
function surgSortIcon(field) {
    var cls  = 'sort-icon';
    var icon = 'pi-sort-alt';
    if (surgSortField === field) {
        icon = surgSortAsc ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
        cls += ' ed-sort-active';
    }
    return '<i class="pi ' + icon + ' ' + cls +
           '" onclick="event.stopPropagation(); toggleSurgSort(\'' + field + '\')"></i>';
}

function toggleSurgSort(field) {
    if (surgSortField === field) {
        surgSortAsc = !surgSortAsc;
    } else {
        surgSortField = field;
        surgSortAsc   = true;
    }
    renderSurgList();
}

/* ============================================================
 * RENDER TABLE
 * ============================================================ */
function renderSurgList() {
    var container = document.getElementById('surgicalCasesContainer');
    if (!container) return;

    var mode = (typeof getListViewMode === 'function') ? getListViewMode() : 'list';
    var area = document.getElementById('patient-list-component');
    if (area) area.classList.toggle('view-cards-mode', mode === 'cards');
    if (mode === 'cards') {
        renderSurgCards();
        return;
    }

    var cases = getFilteredSurgCases();
    var html  = '';

    html += '<table class="patient-table w-full">';
    html += '<thead><tr>';
    html += '<th class="surg-col-datetime">Date / Time ' + surgSortIcon('scheduledTime') + '</th>';
    html += '<th class="col-patient">Patient</th>';
    html += '<th class="surg-col-procedure">Procedure ' + surgSortIcon('procedure') + '</th>';
    html += '<th class="surg-col-room">OR Room ' + surgSortIcon('orRoom') + '</th>';
    html += '<th class="col-ed-status">Status ' + surgSortIcon('status') + '</th>';
    html += '<th class="surg-col-duration">Duration</th>';
    html += '<th class="surg-col-readiness">Readiness</th>';
    html += '<th class="col-alerts">Alerts</th>';
    html += '<th class="surg-col-surgeon">Surgeon ' + surgSortIcon('surgeon') + '</th>';
    html += '<th class="col-actions">Actions</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    cases.forEach(function (sc) {
        var genderIcon  = sc.gender === 'Male' ? 'pi-mars' : 'pi-venus';
        var genderColor = sc.gender === 'Male' ? 'color:var(--ech-primary)' : 'color:#e91e63';
        var dateLabel   = sc.scheduledDate + ' ' + sc.scheduledTime;
        var rowClass    = sc.status === 'Cancelled' ? ' surg-row-cancelled' : '';

        html += '<tr class="patient-row cursor-pointer' + rowClass +
                '" onclick="openSurgDrawer(' + sc.id + ')" data-patient-id="' + sc.id + '">';

        html += '<td class="surg-col-datetime">' +
                '<span class="surg-date">' + sc.scheduledDate + '</span>' +
                '<span class="room-number surg-time">' + sc.scheduledTime + '</span>' +
                '</td>';

        html += '<td class="col-patient">' +
                '<span class="patient-name-cell">' + sc.name + '</span>' +
                '<span class="patient-sub-info">' + sc.age + 'y ' +
                '<i class="pi ' + genderIcon + '" style="' + genderColor + '; font-size:0.846rem"></i></span>' +
                '</td>';

        html += '<td class="surg-col-procedure"><span class="problem-text">' + sc.procedure + '</span></td>';

        html += '<td class="surg-col-room"><span class="room-number">' + sc.orRoom + '</span></td>';

        html += '<td class="col-ed-status">' +
                '<span class="day-status-pill ' + getSurgStatusClass(sc.status) + '">' + sc.status + '</span>' +
                '</td>';

        html += '<td class="surg-col-duration">' +
                '<span class="day-duration-remaining">' + formatSurgMinutes(sc.estimatedDurationMin) + '</span>' +
                '</td>';

        html += '<td class="surg-col-readiness">' + renderReadinessBar(sc.readiness, sc.status) + '</td>';

        html += '<td class="col-alerts">' + renderSurgAlertChips(sc.alerts) + '</td>';

        html += '<td class="surg-col-surgeon"><span class="physician-name">' + (sc.surgeon || '\u2014') + '</span></td>';

        html += '<td class="col-actions" onclick="event.stopPropagation()">';
        html += '<div class="row-actions-group">';
        html += '<button class="action-icon-btn" title="Open Chart" onclick="handleSurgAction(\'chart\',' + sc.id + ')"><i class="pi pi-eye"></i></button>';
        html += '<button class="action-icon-btn" title="Pre-op Checklist" onclick="handleSurgAction(\'checklist\',' + sc.id + ')"><i class="pi pi-check-square"></i></button>';
        html += '<button class="action-icon-btn" title="More Options" onclick="toggleSurgMenu(' + sc.id + ', event)"><i class="pi pi-ellipsis-v"></i></button>';
        html += '</div>';
        html += '<div class="row-dropdown" id="surgMenu_' + sc.id + '">';
        html += '<button class="row-dropdown-item" onclick="handleSurgAction(\'preop\',' + sc.id + ')"><i class="pi pi-list"></i> Pre-op Notes</button>';
        html += '<button class="row-dropdown-item" onclick="handleSurgAction(\'consent\',' + sc.id + ')"><i class="pi pi-file"></i> Consent Form</button>';
        html += '<button class="row-dropdown-item" onclick="handleSurgAction(\'reschedule\',' + sc.id + ')"><i class="pi pi-calendar"></i> Reschedule</button>';
        html += '<button class="row-dropdown-item row-dropdown-item-danger" onclick="handleSurgAction(\'cancel\',' + sc.id + ')"><i class="pi pi-times-circle"></i> Cancel Case</button>';
        html += '</div>';
        html += '</td>';

        html += '</tr>';
    });

    if (cases.length === 0) {
        html += '<tr><td colspan="10" class="surg-empty-state">' +
                '<i class="pi pi-inbox"></i> No surgical cases match the current filter.' +
                '</td></tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;

    var badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = cases.length;
}

/* ============================================================
 * RENDER — CARD VIEW (Surgical Cases)
 * ============================================================ */
function renderSurgCards() {
    var container = document.getElementById('surgicalCasesContainer');
    if (!container) return;

    var cases = getFilteredSurgCases();
    var html  = '<div class="patient-card-grid">';

    if (cases.length === 0) {
        html += '<div class="pat-card-empty"><i class="pi pi-inbox"></i> No surgical cases match the current filter.</div>';
    } else {
        cases.forEach(function(sc) {
            var genderIcon    = sc.gender === 'Male' ? 'pi-mars' : 'pi-venus';
            var genderColor   = sc.gender === 'Male' ? 'color:var(--ech-primary)' : 'color:#e91e63';
            var rowClass      = sc.status === 'Cancelled' ? ' patient-card-cancelled' : '';
            var readinessColor = sc.readiness === 100 ? 'var(--ech-clinical-success, #2e7d32)' :
                                 sc.readiness >= 60   ? 'var(--ech-warning, #f9a825)' :
                                                        'var(--ech-primary, #1e88e5)';

            html += '<div class="patient-card' + rowClass + '" onclick="openSurgDrawer(' + sc.id + ')" data-patient-id="' + sc.id + '">';

            html += '<div class="patient-card-header">' +
                    '<div class="card-header-top">' +
                    '<span class="card-room"><i class="pi pi-building card-room-icon"></i>' + sc.orRoom + '</span>' +
                    '<span class="card-admission-date">' + sc.scheduledDate + ' ' + sc.scheduledTime + '</span>' +
                    '</div>' +
                    '<div class="card-patient-name">' + sc.name + '</div>' +
                    '</div>';

            html += '<div class="patient-card-body">';

            html += '<div class="card-row">' +
                    '<i class="pi ' + genderIcon + '" style="' + genderColor + '"></i>' +
                    '<span>' + sc.age + 'y</span>' +
                    '<span class="card-sep">|</span>' +
                    '<span>' + sc.department + '</span>' +
                    '</div>';

            html += '<div class="card-row card-problem-row">' +
                    '<span class="problem-text" style="max-width:100%;white-space:normal">' + sc.procedure + '</span>' +
                    '</div>';

            html += '<div class="card-row">' +
                    '<span class="card-label">Cirujano:</span> ' +
                    '<span class="physician-name">' + (sc.surgeon || '\u2014') + '</span>' +
                    '</div>';

            html += '<div class="card-row">' +
                    '<span class="card-label">Anestesiólogo:</span> ' +
                    '<span class="physician-name">' + (sc.anesthesiologist || '\u2014') + '</span>' +
                    '</div>';

            html += '<div class="card-row">' +
                    '<span class="card-label">Duración:</span> ' +
                    '<span>' + formatSurgMinutes(sc.estimatedDurationMin) + '</span>' +
                    '<span class="card-sep">|</span>' +
                    '<span class="day-status-pill ' + getSurgStatusClass(sc.status) + '">' + sc.status + '</span>' +
                    '</div>';

            if (sc.status !== 'Cancelled') {
                html += '<div class="card-row card-readiness-row">' +
                        '<span class="card-label">Readiness:</span>' +
                        '<div class="card-readiness-wrap"><div class="card-readiness-fill" style="width:' + sc.readiness + '%;background:' + readinessColor + '"></div></div>' +
                        '<span class="card-readiness-label">' + sc.readiness + '%</span>' +
                        '</div>';
            }

            html += '</div>';

            html += '<div class="patient-card-footer">' +
                    '<div class="card-footer-alerts">' + renderSurgAlertChips(sc.alerts) + '</div>' +
                    '<div class="card-footer-status">' +
                    '<button class="card-action-btn" onclick="event.stopPropagation(); openSurgDrawer(' + sc.id + ')" title="Ver detalle"><i class="pi pi-eye"></i></button>' +
                    '</div>' +
                    '</div>';

            html += '</div>';
        });
    }

    html += '</div>';
    container.innerHTML = html;

    var badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = cases.length;
}

/* ============================================================
 * DRAWER — open / close / render
 * ============================================================ */
function openSurgDrawer(caseId) {
    var sc      = surgicalCases.find(function (c) { return c.id === caseId; });
    if (!sc) return;

    var drawer  = document.getElementById('surgDrawer');
    var overlay = document.getElementById('surgDrawerOverlay');
    var title   = document.getElementById('surgDrawerTitle');
    var body    = document.getElementById('surgDrawerBody');
    var actions = document.getElementById('surgDrawerActions');

    title.textContent = sc.name;

    var genderIcon = sc.gender === 'Male' ? 'pi-mars' : 'pi-venus';
    var html       = '';

    html += buildDrawerSection('Demographics',
        '<i class="pi ' + genderIcon + '"></i> ' + sc.age + 'y ' + sc.gender +
        ' &middot; DOB: ' + sc.dob);

    html += buildDrawerSection('Scheduled',
        sc.scheduledDate + ' at ' + sc.scheduledTime);

    html += buildDrawerSection('Procedure',
        '<span class="problem-text">' + sc.procedure + '</span>');

    html += buildDrawerSection('OR Room',
        '<span class="room-number">' + sc.orRoom + '</span>');

    html += buildDrawerSection('Status',
        '<span class="day-status-pill ' + getSurgStatusClass(sc.status) + '">' + sc.status + '</span>');

    html += buildDrawerSection('Estimated Duration',
        formatSurgMinutes(sc.estimatedDurationMin));

    html += buildDrawerSection('Pre-op Readiness',
        renderReadinessBar(sc.readiness, sc.status));

    html += buildDrawerSection('Surgeon',
        '<span class="physician-name">' + (sc.surgeon || '\u2014') + '</span>');

    html += buildDrawerSection('Anaesthesiologist',
        '<span class="physician-name">' + (sc.anesthesiologist || '\u2014') + '</span>');

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Clinical Alerts</div>';
    html += '<div class="ed-drawer-value ed-drawer-alerts">' + renderSurgAlertChips(sc.alerts) + '</div>';
    html += '</div>';

    body.innerHTML = html;

    var actHtml = '';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleSurgAction(\'chart\',' + sc.id + ')"><i class="pi pi-eye"></i> Open Chart</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleSurgAction(\'checklist\',' + sc.id + ')"><i class="pi pi-check-square"></i> Pre-op Checklist</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleSurgAction(\'consent\',' + sc.id + ')"><i class="pi pi-file"></i> Consent Form</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleSurgAction(\'preop\',' + sc.id + ')"><i class="pi pi-list"></i> Pre-op Notes</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleSurgAction(\'reschedule\',' + sc.id + ')"><i class="pi pi-calendar"></i> Reschedule</button>';
    actions.innerHTML = actHtml;

    drawer.classList.add('open');
    overlay.classList.add('show');
}

function buildDrawerSection(label, valueHtml) {
    return '<div class="ed-drawer-section">' +
           '<div class="ed-drawer-label">' + label + '</div>' +
           '<div class="ed-drawer-value">' + valueHtml + '</div>' +
           '</div>';
}

function closeSurgDrawer() {
    var drawer  = document.getElementById('surgDrawer');
    var overlay = document.getElementById('surgDrawerOverlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

/* ============================================================
 * ACTION HANDLERS
 * ============================================================ */
function handleSurgAction(action, caseId) {
    closeSurgDrawer();
    console.log('Surgical action:', action, 'for case:', caseId);
}

function toggleSurgMenu(caseId, event) {
    event.stopPropagation();
    var menuId  = 'surgMenu_' + caseId;
    var menu    = document.getElementById(menuId);
    if (!menu) return;
    var isOpen  = menu.classList.contains('show');
    document.querySelectorAll('.row-dropdown').forEach(function (m) { m.classList.remove('show'); });
    if (!isOpen) menu.classList.add('show');
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.col-actions')) {
        document.querySelectorAll('.row-dropdown').forEach(function (m) { m.classList.remove('show'); });
    }
});

/* ============================================================
 * STYLES — Surgical-specific tokens injected inline
 * No new CSS files. All via existing classes + inline style block.
 * ============================================================ */
(function injectSurgStyles() {
    var style = document.createElement('style');
    style.textContent = [
        /* Status soft-badges (same visual contract as day-status-pill) */
        '.surg-status-requested   { background:#f3e5f5; color:#6a1b9a; }',
        '.surg-status-scheduled   { background:#e3f2fd; color:#1565c0; }',
        '.surg-status-preop       { background:#fff8e1; color:#f57f17; }',
        '.surg-status-ready       { background:#e0f2f1; color:#00796b; }',
        '.surg-status-intheatre   { background:#e8eaf6; color:#283593; border-left:3px solid #283593; }',
        '.surg-status-completed   { background:#efebe9; color:#4e342e; }',
        '.surg-status-cancelled   { background:#fafafa; color:#9e9e9e; text-decoration:line-through; }',
        /* Row dim for cancelled */
        '.surg-row-cancelled td   { opacity:0.55; }',
        /* Column widths */
        '.surg-col-datetime       { width:110px; white-space:nowrap; }',
        '.surg-col-procedure      { min-width:180px; max-width:260px; }',
        '.surg-col-room           { width:72px; text-align:center; }',
        '.surg-col-duration       { width:70px; text-align:center; white-space:nowrap; }',
        '.surg-col-readiness      { width:110px; }',
        '.surg-col-surgeon        { width:120px; }',
        /* Date / Time sub-cells */
        '.surg-date               { display:block; font-size:0.923rem; color:var(--ech-text-secondary); }',
        '.surg-time               { display:block; margin-top:1px; }',
        /* Readiness bar */
        '.surg-readiness-wrap     { display:flex; align-items:center; gap:5px; }',
        '.surg-readiness-bar      { flex:1; height:5px; border-radius:3px; min-width:1px; }',
        '.surg-readiness-label    { font-size:0.923rem; color:var(--ech-text-secondary); white-space:nowrap; }',
        '.surg-readiness-na       { font-size:0.923rem; color:var(--ech-text-muted); }',
        /* Empty state */
        '.surg-empty-state        { text-align:center; padding:32px; color:var(--ech-text-muted); font-size:1.077rem; }',
        '.surg-empty-state .pi   { font-size:2rem; display:block; margin-bottom:8px; }'
    ].join('\n');
    document.head.appendChild(style);
})();

/* ============================================================
 * ENTRY POINT
 * ============================================================ */
document.addEventListener('DOMContentLoaded', initSurgicalCases);
