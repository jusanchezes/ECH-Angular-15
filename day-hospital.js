var dayPatients = [
    { id: 101, name: 'María García López', dob: '1958-03-14', age: 67, gender: 'Female', scheduledTime: '08:00', arrivalTime: '07:45', chair: 'C01', pathwayType: 'Chemo', phaseStatus: 'Infusing', estimatedDurationMin: 180, elapsedMin: 95, remainingMin: 85, alerts: ['Allergy: Penicillin', 'High-Risk Meds', 'Fall Risk'], flags: ['high-risk-meds'], assignedNurse: 'Ana Ruiz', orderingProvider: 'Dr. Fernández' },
    { id: 102, name: 'Carlos Martínez Ruiz', dob: '1970-07-22', age: 55, gender: 'Male', scheduledTime: '08:30', arrivalTime: '08:20', chair: 'C02', pathwayType: 'Iron Infusion', phaseStatus: 'Observation', estimatedDurationMin: 120, elapsedMin: 110, remainingMin: 10, alerts: [], flags: [], assignedNurse: 'Laura Sánchez', orderingProvider: 'Dr. López' },
    { id: 103, name: 'Elena Rodríguez Díaz', dob: '1985-11-03', age: 40, gender: 'Female', scheduledTime: '09:00', arrivalTime: '08:55', chair: 'C03', pathwayType: 'Biologic Infusion', phaseStatus: 'Premeds', estimatedDurationMin: 240, elapsedMin: 30, remainingMin: 210, alerts: ['Allergy: Sulfa', 'Isolation'], flags: ['isolation'], assignedNurse: 'Pedro Gómez', orderingProvider: 'Dr. Rory Rogers', department: 'Cardiology' },
    { id: 104, name: 'José Antonio Pérez', dob: '1962-01-19', age: 64, gender: 'Male', scheduledTime: '09:00', arrivalTime: '09:05', chair: 'Bay 1', pathwayType: 'Chemo', phaseStatus: 'Infusing', estimatedDurationMin: 300, elapsedMin: 60, remainingMin: 240, alerts: ['High-Risk Meds', 'DNR'], flags: ['high-risk-meds'], assignedNurse: 'Ana Ruiz', orderingProvider: 'Dr. Fernández' },
    { id: 105, name: 'Lucía Hernández Gil', dob: '1990-05-30', age: 35, gender: 'Female', scheduledTime: '09:30', arrivalTime: '09:25', chair: 'C04', pathwayType: 'Transfusion', phaseStatus: 'Labs Pending', estimatedDurationMin: 150, elapsedMin: 15, remainingMin: 135, alerts: ['Allergy: Latex'], flags: [], assignedNurse: 'Laura Sánchez', orderingProvider: 'Dr. Moreno' },
    { id: 106, name: 'Fernando Muñoz Vega', dob: '1955-09-11', age: 70, gender: 'Male', scheduledTime: '10:00', arrivalTime: null, chair: 'C05', pathwayType: 'Chemo', phaseStatus: 'Scheduled', estimatedDurationMin: 210, elapsedMin: 0, remainingMin: 210, alerts: ['Fall Risk', 'Pacemaker', 'Allergy: Contrast', 'Neutropenia'], flags: ['high-risk-meds'], assignedNurse: 'Pedro Gómez', orderingProvider: 'Dr. Fernández' },
    { id: 107, name: 'Ana Belén Torres', dob: '1978-12-25', age: 47, gender: 'Female', scheduledTime: '10:00', arrivalTime: '09:50', chair: 'C06', pathwayType: 'Biologic Infusion', phaseStatus: 'Pre-assessment', estimatedDurationMin: 180, elapsedMin: 20, remainingMin: 160, alerts: [], flags: [], assignedNurse: 'Carmen Vidal', orderingProvider: 'Dr. Rory Rogers', department: 'Cardiology' },
    { id: 108, name: 'Miguel Ángel Soto', dob: '1948-04-07', age: 77, gender: 'Male', scheduledTime: '07:30', arrivalTime: '07:25', chair: 'Bay 2', pathwayType: 'Transfusion', phaseStatus: 'Ready for Discharge', estimatedDurationMin: 120, elapsedMin: 120, remainingMin: 0, alerts: ['DNR', 'Fall Risk'], flags: [], assignedNurse: 'Ana Ruiz', orderingProvider: 'Dr. López' },
    { id: 109, name: 'Isabel Romero Castro', dob: '1966-08-16', age: 59, gender: 'Female', scheduledTime: '10:30', arrivalTime: null, chair: 'C07', pathwayType: 'Iron Infusion', phaseStatus: 'Scheduled', estimatedDurationMin: 90, elapsedMin: 0, remainingMin: 90, alerts: [], flags: [], assignedNurse: 'Laura Sánchez', orderingProvider: 'Dr. Moreno' },
    { id: 110, name: 'Pablo Jiménez Reyes', dob: '1982-02-28', age: 44, gender: 'Male', scheduledTime: '08:00', arrivalTime: '07:50', chair: 'C08', pathwayType: 'Chemo', phaseStatus: 'Completed', estimatedDurationMin: 180, elapsedMin: 180, remainingMin: 0, alerts: ['High-Risk Meds'], flags: ['high-risk-meds'], assignedNurse: 'Carmen Vidal', orderingProvider: 'Dr. Fernández' },
    { id: 111, name: 'Rosa María Delgado', dob: '1973-06-09', age: 52, gender: 'Female', scheduledTime: '11:00', arrivalTime: null, chair: 'C09', pathwayType: 'Chemo', phaseStatus: 'Scheduled', estimatedDurationMin: 240, elapsedMin: 0, remainingMin: 240, alerts: ['Allergy: Iodine'], flags: [], assignedNurse: 'Pedro Gómez', orderingProvider: 'Dr. Navarro' },
    { id: 112, name: 'Andrés Vargas Pinto', dob: '1951-10-05', age: 74, gender: 'Male', scheduledTime: '07:00', arrivalTime: '06:55', chair: 'Bay 3', pathwayType: 'Transfusion', phaseStatus: 'Completed', estimatedDurationMin: 150, elapsedMin: 150, remainingMin: 0, alerts: ['Fall Risk', 'Isolation', 'Allergy: NSAIDs', 'Seizure Risk'], flags: ['isolation'], assignedNurse: 'Ana Ruiz', orderingProvider: 'Dr. López' },
    { id: 113, name: 'Sofía Medina Ortiz', dob: '1995-04-18', age: 30, gender: 'Female', scheduledTime: '09:30', arrivalTime: '09:30', chair: 'C10', pathwayType: 'Biologic Infusion', phaseStatus: 'Infusing', estimatedDurationMin: 120, elapsedMin: 45, remainingMin: 75, alerts: [], flags: [], assignedNurse: 'Carmen Vidal', orderingProvider: 'Dr. Navarro' },
    { id: 114, name: 'Ramón Flores Aguilar', dob: '1960-12-01', age: 65, gender: 'Male', scheduledTime: '08:30', arrivalTime: null, chair: 'C11', pathwayType: 'Iron Infusion', phaseStatus: 'No-show', estimatedDurationMin: 90, elapsedMin: 0, remainingMin: 0, alerts: [], flags: [], assignedNurse: 'Laura Sánchez', orderingProvider: 'Dr. Moreno' }
];

var daySortField = null;
var daySortAsc = true;
var dayLocFilter = 'loc-all';
var dayHighRiskOnly = false;
var daySearchTerm = '';
var dayScopeFilter = 'all';

var DAY_PHASE_ORDER = ['Scheduled', 'Arrived', 'Pre-assessment', 'Labs Pending', 'Premeds', 'Infusing', 'Observation', 'Ready for Discharge', 'Completed', 'No-show'];

function initDayHospital() {
    var wardLabel = document.querySelector('[data-field="wardName"]');
    if (wardLabel) wardLabel.textContent = 'Day Hospital';
    renderDayList();
    injectDayHighRiskToggle();
    wireDayTabs();
    wireDaySearch();
}

function wireDaySearch() {
    window.handleToolbarSearch = function (value) {
        filterPatientList(value);
    };
}

function filterPatientList(searchTerm) {
    daySearchTerm = (searchTerm || '').toLowerCase();
    renderDayList();
}

function wireDayTabs() {
    var origHandleTabClick = window.handleTabClick;
    window.handleTabClick = function (tabId) {
        if (tabId.startsWith('loc-')) {
            var buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(function (btn) { btn.classList.remove('tab-btn-active'); });
            var activeBtn = document.querySelector('[data-tab-id="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('tab-btn-active');
            dayLocFilter = tabId;
            renderDayList();
        } else if (origHandleTabClick) {
            origHandleTabClick(tabId);
        }
    };

    var origHandleScopeChange = window.handleScopeChange;
    window.handleScopeChange = function (scope) {
        if (origHandleScopeChange) origHandleScopeChange(scope);
        dayScopeFilter = scope;
        renderDayList();
    };
}

function injectDayHighRiskToggle() {
    var toolbar = document.querySelector('.toolbar-center');
    if (!toolbar) return;

    var toggle = document.createElement('button');
    toggle.className = 'toolbar-action-btn ed-high-risk-toggle';
    toggle.title = 'High-Risk Only';
    toggle.id = 'dayHighRiskBtn';
    toggle.innerHTML = '<i class="pi pi-exclamation-triangle"></i>';
    toggle.onclick = function () {
        dayHighRiskOnly = !dayHighRiskOnly;
        toggle.classList.toggle('ed-toggle-active', dayHighRiskOnly);
        renderDayList();
    };
    toolbar.appendChild(toggle);
}

function getDayStatusClass(status) {
    var map = {
        'Scheduled': 'day-status-scheduled',
        'Arrived': 'day-status-arrived',
        'Pre-assessment': 'day-status-preassessment',
        'Labs Pending': 'day-status-labspending',
        'Premeds': 'day-status-premeds',
        'Infusing': 'day-status-infusing',
        'Observation': 'day-status-observation',
        'Ready for Discharge': 'day-status-ready',
        'Completed': 'day-status-completed',
        'No-show': 'day-status-noshow'
    };
    return map[status] || '';
}

function getDayAlertSeverity(alert) {
    if (alert.includes('Allergy') || alert.includes('High-Risk')) return 'danger';
    if (alert === 'DNR' || alert === 'Isolation') return 'dnr';
    if (alert.includes('Fall') || alert.includes('Pressure') || alert.includes('Seizure') || alert.includes('Neutropenia')) return 'warning';
    return 'info';
}

function getDayAlertIcon(alert) {
    if (alert === 'DNR') return 'pi-ban';
    if (alert === 'Isolation') return 'pi-lock';
    if (alert.includes('Allergy')) return 'pi-exclamation-circle';
    if (alert.includes('Fall') || alert.includes('Seizure')) return 'pi-exclamation-triangle';
    if (alert === 'Pacemaker') return 'pi-heart';
    return 'pi-info-circle';
}

function renderDayAlertChips(alerts) {
    if (!alerts || alerts.length === 0) return '<span class="no-alerts">\u2014</span>';

    var maxVisible = 3;
    var html = '';

    for (var i = 0; i < Math.min(alerts.length, maxVisible); i++) {
        var severity = getDayAlertSeverity(alerts[i]);
        var icon = getDayAlertIcon(alerts[i]);
        html += '<span class="p-tag-custom p-tag-' + severity + '" title="' + alerts[i] + '"><i class="pi ' + icon + '"></i> ' + alerts[i] + '</span> ';
    }

    if (alerts.length > maxVisible) {
        var remaining = alerts.length - maxVisible;
        var tooltipText = alerts.slice(maxVisible).join(', ');
        html += '<span class="p-tag-custom p-tag-info ed-alert-overflow" title="' + tooltipText + '">+' + remaining + '</span>';
    }

    return html;
}

function formatDayDuration(elapsedMin, remainingMin, estimatedDurationMin) {
    if (remainingMin <= 0 && elapsedMin >= estimatedDurationMin) {
        return '<span class="day-duration-elapsed">' + formatMinutes(estimatedDurationMin) + '</span>';
    }
    if (elapsedMin === 0) {
        return '<span class="day-duration-remaining">ETA ' + formatMinutes(estimatedDurationMin) + '</span>';
    }
    return '<span class="day-duration-elapsed">' + formatMinutes(elapsedMin) + '</span>' +
           '<span class="day-duration-remaining"> / ' + formatMinutes(remainingMin) + ' left</span>';
}

function formatMinutes(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
    if (h > 0) return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
    return m + 'm';
}

function getFilteredDayPatients() {
    var list = dayPatients.slice();

    if (dayLocFilter === 'loc-recent') {
        list = list.filter(function (p) { return p.arrivalTime !== null; });
    } else if (dayLocFilter === 'loc-discharge') {
        list = list.filter(function (p) { return p.phaseStatus === 'Ready for Discharge'; });
    } else if (dayLocFilter === 'loc-icu') {
        list = list.filter(function (p) { return p.phaseStatus === 'Observation'; });
    } else if (dayLocFilter === 'loc-surgery') {
        list = list.filter(function (p) { return false; });
    }

    if (dayScopeFilter === 'mine') {
        list = list.filter(function (p) {
            return p.orderingProvider === CURRENT_USER.name;
        });
    } else if (dayScopeFilter === 'dept') {
        list = list.filter(function (p) {
            return p.department === CURRENT_USER.department;
        });
    }

    if (dayHighRiskOnly) {
        list = list.filter(function (p) {
            var hasAlerts = p.alerts && p.alerts.length > 0;
            var hasIsolation = p.flags && p.flags.indexOf('isolation') !== -1;
            var hasHighRisk = p.flags && p.flags.indexOf('high-risk-meds') !== -1;
            return hasAlerts || hasIsolation || hasHighRisk;
        });
    }

    if (daySearchTerm) {
        list = list.filter(function (p) {
            var text = (p.name + ' ' + p.chair + ' ' + p.pathwayType + ' ' + p.phaseStatus).toLowerCase();
            return text.includes(daySearchTerm);
        });
    }

    if (daySortField) {
        list.sort(function (a, b) {
            var va, vb;
            if (daySortField === 'phaseStatus') {
                va = DAY_PHASE_ORDER.indexOf(a.phaseStatus);
                vb = DAY_PHASE_ORDER.indexOf(b.phaseStatus);
            } else {
                va = a[daySortField];
                vb = b[daySortField];
            }
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return daySortAsc ? -1 : 1;
            if (va > vb) return daySortAsc ? 1 : -1;
            return 0;
        });
    }

    return list;
}

function daySortIcon(field) {
    var cls = 'sort-icon';
    var icon = 'pi-sort-alt';
    if (daySortField === field) {
        icon = daySortAsc ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
        cls += ' ed-sort-active';
    }
    return '<i class="pi ' + icon + ' ' + cls + '" onclick="event.stopPropagation(); toggleDaySort(\'' + field + '\')"></i>';
}

function toggleDaySort(field) {
    if (daySortField === field) {
        daySortAsc = !daySortAsc;
    } else {
        daySortField = field;
        daySortAsc = true;
    }
    renderDayList();
}

function renderDayList() {
    var container = document.getElementById('dayHospitalContainer');
    if (!container) return;

    var patients = getFilteredDayPatients();
    var html = '';

    html += '<table class="patient-table w-full">';
    html += '<thead><tr>';
    html += '<th class="day-col-time">Time ' + daySortIcon('scheduledTime') + '</th>';
    html += '<th class="col-patient">Patient</th>';
    html += '<th class="day-col-chair">Chair/Bay ' + daySortIcon('chair') + '</th>';
    html += '<th class="day-col-pathway">Pathway</th>';
    html += '<th class="col-ed-status">Status ' + daySortIcon('phaseStatus') + '</th>';
    html += '<th class="day-col-duration">Duration ' + daySortIcon('remainingMin') + '</th>';
    html += '<th class="col-alerts">Alerts</th>';
    html += '<th class="day-col-nurse">Nurse</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    patients.forEach(function (patient) {
        var genderIcon = patient.gender === 'Male' ? 'pi-mars' : 'pi-venus';
        var genderColor = patient.gender === 'Male' ? 'color: var(--ech-primary)' : 'color: #e91e63';

        html += '<tr class="patient-row cursor-pointer" onclick="openDayDrawer(' + patient.id + ')" data-patient-id="' + patient.id + '">';

        html += '<td class="day-col-time"><span class="room-number">' + patient.scheduledTime + '</span></td>';

        html += '<td class="col-patient">';
        html += '<span class="patient-name-cell">' + patient.name + '</span>';
        html += '<span class="patient-sub-info">' + patient.age + 'y <i class="pi ' + genderIcon + '" style="' + genderColor + '; font-size: 0.846rem"></i></span>';
        html += '</td>';

        html += '<td class="day-col-chair"><span class="room-number">' + patient.chair + '</span></td>';

        html += '<td class="day-col-pathway"><span class="problem-text">' + patient.pathwayType + '</span></td>';

        html += '<td class="col-ed-status"><span class="day-status-pill ' + getDayStatusClass(patient.phaseStatus) + '">' + patient.phaseStatus + '</span></td>';

        html += '<td class="day-col-duration"><div class="day-duration-bar">' + formatDayDuration(patient.elapsedMin, patient.remainingMin, patient.estimatedDurationMin) + '</div></td>';

        html += '<td class="col-alerts">' + renderDayAlertChips(patient.alerts) + '</td>';

        html += '<td class="day-col-nurse"><span class="physician-name">' + (patient.assignedNurse || '\u2014') + '</span></td>';

        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    updateDayBadgeCount(patients.length);
}

function updateDayBadgeCount(count) {
    var badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = count;
}

function openDayDrawer(patientId) {
    var patient = dayPatients.find(function (p) { return p.id === patientId; });
    if (!patient) return;

    var drawer = document.getElementById('dayDrawer');
    var overlay = document.getElementById('dayDrawerOverlay');
    var title = document.getElementById('dayDrawerTitle');
    var body = document.getElementById('dayDrawerBody');
    var actions = document.getElementById('dayDrawerActions');

    title.textContent = patient.name;

    var genderIcon = patient.gender === 'Male' ? 'pi-mars' : 'pi-venus';

    var html = '';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Demographics</div>';
    html += '<div class="ed-drawer-value"><i class="pi ' + genderIcon + '"></i> ' + patient.age + 'y ' + patient.gender + ' &middot; DOB: ' + patient.dob + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Schedule</div>';
    html += '<div class="ed-drawer-value">Scheduled: ' + patient.scheduledTime + (patient.arrivalTime ? ' &middot; Arrived: ' + patient.arrivalTime : ' &middot; <em>Not yet arrived</em>') + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Chair / Bay</div>';
    html += '<div class="ed-drawer-value"><span class="room-number">' + patient.chair + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Treatment</div>';
    html += '<div class="ed-drawer-value">' + patient.pathwayType + ' &middot; Est. ' + formatMinutes(patient.estimatedDurationMin) + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Current Status</div>';
    html += '<div class="ed-drawer-value"><span class="day-status-pill ' + getDayStatusClass(patient.phaseStatus) + '">' + patient.phaseStatus + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Status Timeline</div>';
    html += '<ul class="day-timeline-list">';
    var currentIdx = DAY_PHASE_ORDER.indexOf(patient.phaseStatus);
    for (var i = 0; i < DAY_PHASE_ORDER.length - 1; i++) {
        var phase = DAY_PHASE_ORDER[i];
        var cls = '';
        if (i < currentIdx) cls = 'day-timeline-done';
        else if (i === currentIdx) cls = 'day-timeline-active';
        html += '<li class="' + cls + '">' + phase + '</li>';
    }
    html += '</ul>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Ordering Provider</div>';
    html += '<div class="ed-drawer-value"><span class="physician-name">' + (patient.orderingProvider || '\u2014') + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Assigned Nurse</div>';
    html += '<div class="ed-drawer-value"><span class="physician-name">' + (patient.assignedNurse || '\u2014') + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Alerts</div>';
    html += '<div class="ed-drawer-value ed-drawer-alerts">' + renderDayAlertChips(patient.alerts) + '</div>';
    html += '</div>';

    body.innerHTML = html;

    var actHtml = '';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleDayAction(\'chart\', ' + patient.id + ')"><i class="pi pi-eye"></i> Open Chart</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleDayAction(\'vitals\', ' + patient.id + ')"><i class="pi pi-heart"></i> Record Vitals</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleDayAction(\'start\', ' + patient.id + ')"><i class="pi pi-play"></i> Start Infusion</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleDayAction(\'complete\', ' + patient.id + ')"><i class="pi pi-check"></i> Mark Completed</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="handleDayAction(\'note\', ' + patient.id + ')"><i class="pi pi-pencil"></i> Add Note</button>';
    actions.innerHTML = actHtml;

    drawer.classList.add('open');
    overlay.classList.add('show');
}

function closeDayDrawer() {
    var drawer = document.getElementById('dayDrawer');
    var overlay = document.getElementById('dayDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

function handleDayAction(action, patientId) {
    closeDayDrawer();
    console.log('Day Hospital action:', action, 'for patient:', patientId);
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.col-actions')) {
        document.querySelectorAll('.row-dropdown').forEach(function (m) { m.classList.remove('show'); });
    }
});

document.addEventListener('DOMContentLoaded', initDayHospital);
