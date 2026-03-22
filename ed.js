var edPatients = [];
var edSortField = null;
var edSortAsc = true;
var edActiveFilter = 'ed-all';
var edHighRiskOnly = false;
var edSearchTerm = '';

function initEDList() {
    edPatients = ClinicalDataService.getEDPatientList();
    var wardLabel = document.querySelector('[data-field="wardName"]');
    if (wardLabel) wardLabel.textContent = 'Emergency Department';
    renderEDList();
    injectHighRiskToggle();
    wireEDTabs();
    wireEDSearch();
}

function wireEDSearch() {
    window.handleToolbarSearch = function (value) {
        filterPatientList(value);
    };
}

function getAcuityClass(esi) {
    if (esi === 1) return 'ed-acuity-1';
    if (esi === 2) return 'ed-acuity-2';
    if (esi === 3) return 'ed-acuity-3';
    if (esi === 4) return 'ed-acuity-4';
    return 'ed-acuity-5';
}

function getAcuityLabel(esi) {
    var labels = { 1: 'Resuscitation', 2: 'Emergent', 3: 'Urgent', 4: 'Less Urgent', 5: 'Non-Urgent' };
    return labels[esi] || 'Unknown';
}

function getStatusClass(status) {
    var map = {
        'Waiting': 'ed-status-waiting',
        'In Triage': 'ed-status-triage',
        'In Room': 'ed-status-inroom',
        'With Provider': 'ed-status-provider',
        'Imaging': 'ed-status-imaging',
        'Lab': 'ed-status-lab',
        'Dispo': 'ed-status-dispo'
    };
    return map[status] || '';
}

function formatLOS(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return (h > 0 ? h + 'h ' : '') + (m < 10 ? '0' : '') + m + 'm';
}

function getLOSClass(minutes) {
    if (minutes >= 240) return 'days-highlight days-long';
    if (minutes >= 120) return 'days-highlight days-medium';
    return 'days-highlight';
}

function getAlertSeverity(alert) {
    if (alert.includes('Allergy') || alert.includes('High-Risk')) return 'danger';
    if (alert === 'DNR' || alert === 'Isolation') return 'dnr';
    if (alert.includes('Fall') || alert.includes('Pressure') || alert.includes('Seizure') || alert.includes('Neutropenia')) return 'warning';
    return 'info';
}

function getAlertIcon(alert) {
    if (alert === 'DNR') return 'pi-ban';
    if (alert === 'Isolation') return 'pi-lock';
    if (alert.includes('Allergy')) return 'pi-exclamation-circle';
    if (alert.includes('Fall') || alert.includes('Seizure')) return 'pi-exclamation-triangle';
    if (alert === 'Pacemaker') return 'pi-heart';
    return 'pi-info-circle';
}

function renderAlertChips(alerts) {
    if (!alerts || alerts.length === 0) return '<span class="no-alerts">—</span>';

    var maxVisible = 3;
    var html = '';

    for (var i = 0; i < Math.min(alerts.length, maxVisible); i++) {
        var severity = getAlertSeverity(alerts[i]);
        var icon = getAlertIcon(alerts[i]);
        html += '<span class="p-tag-custom p-tag-' + severity + '" data-tooltip="' + alerts[i] + '"><i class="pi ' + icon + '"></i></span> ';
    }

    if (alerts.length > maxVisible) {
        var remaining = alerts.length - maxVisible;
        var tooltipText = alerts.slice(maxVisible).join(', ');
        html += '<span class="p-tag-custom p-tag-info ed-alert-overflow" data-tooltip="' + tooltipText + '">+' + remaining + '</span>';
    }

    return html;
}

function renderTaskFlags(patient) {
    var html = '<div class="status-icons-group">';
    var labStatus = patient.labsPending ? 'new' : 'ok';
    var imgStatus = patient.imagingPending ? 'alert' : 'ok';
    var medStatus = patient.medsDue ? 'pending' : 'ok';

    html += renderTaskIcon(labStatus, 'labs', 'pi-flask');
    html += renderTaskIcon(imgStatus, 'imaging', 'pi-image');
    html += renderTaskIcon(medStatus, 'meds', 'pi-box');
    html += '</div>';
    return html;
}

function renderTaskIcon(status, type, icon) {
    var dotNew = (status === 'new') ? '<span class="dot-new"></span>' : '';
    var dotAlert = (status === 'alert') ? '<span class="dot-alert"></span>' : '';
    var cls = 'status-icon';
    if (status === 'new') cls += ' status-new';
    if (status === 'alert') cls += ' status-alert';
    if (status === 'pending') cls += ' status-pending';
    return '<span class="' + cls + '" title="' + type + ': ' + status + '"><i class="pi ' + icon + '"></i>' + dotNew + dotAlert + '</span>';
}

function getFilteredPatients() {
    var list = edPatients.slice();

    if (edActiveFilter === 'ed-waiting') {
        list = list.filter(function (p) { return p.location.toLowerCase().includes('waiting'); });
    } else if (edActiveFilter === 'ed-inroom') {
        list = list.filter(function (p) {
            return !p.location.toLowerCase().includes('waiting') && p.status !== 'Dispo';
        });
    } else if (edActiveFilter === 'ed-dispo') {
        list = list.filter(function (p) { return p.status === 'Dispo'; });
    } else if (edActiveFilter === 'ed-high-acuity') {
        list = list.filter(function (p) { return p.triageAcuity <= 2; });
    }

    if (edHighRiskOnly) {
        list = list.filter(function (p) {
            return p.triageAcuity <= 2 || (p.alerts && p.alerts.length > 0);
        });
    }

    if (edSearchTerm) {
        list = list.filter(function (p) {
            var text = (p.name + ' ' + p.chiefComplaint + ' ' + p.location).toLowerCase();
            return text.includes(edSearchTerm);
        });
    }

    if (edSortField) {
        list.sort(function (a, b) {
            var va = a[edSortField];
            var vb = b[edSortField];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return edSortAsc ? -1 : 1;
            if (va > vb) return edSortAsc ? 1 : -1;
            return 0;
        });
    }

    return list;
}

function renderEDList() {
    var container = document.getElementById('edListContainer');
    if (!container) return;

    var patients = getFilteredPatients();
    var html = '';

    html += '<table class="patient-table w-full">';
    html += '<thead><tr>';
    html += '<th class="col-room">Location ' + sortIcon('location') + '</th>';
    html += '<th class="col-patient">Patient</th>';
    html += '<th class="col-acuity ed-col-acuity">ESI ' + sortIcon('triageAcuity') + '</th>';
    html += '<th class="col-problem">Chief Complaint</th>';
    html += '<th class="col-ed-status">Status</th>';
    html += '<th class="col-days">LOS ' + sortIcon('LOSMinutes') + '</th>';
    html += '<th class="col-alerts">Alerts</th>';
    html += '<th class="col-status">Tasks</th>';
    html += '<th class="col-actions"></th>';
    html += '</tr></thead>';
    html += '<tbody>';

    patients.forEach(function (patient) {
        var genderIcon = patient.gender === 'Male' ? 'pi-mars' : 'pi-venus';
        var genderColor = patient.gender === 'Male' ? 'color: var(--ech-primary)' : 'color: #e91e63';

        html += '<tr class="patient-row cursor-pointer" onclick="openEDDrawer(' + patient.id + ')" data-patient-id="' + patient.id + '">';

        html += '<td class="col-room"><span class="room-number">' + patient.location + '</span></td>';

        html += '<td class="col-patient">';
        html += '<span class="patient-name-cell">' + patient.name + '</span>';
        html += '<span class="patient-sub-info">' + patient.age + 'y <i class="pi ' + genderIcon + '" style="' + genderColor + '; font-size: 0.846rem"></i></span>';
        html += '</td>';

        html += '<td class="col-acuity ed-col-acuity"><span class="ed-acuity-badge ' + getAcuityClass(patient.triageAcuity) + '" title="' + getAcuityLabel(patient.triageAcuity) + '">ESI ' + patient.triageAcuity + '</span></td>';

        html += '<td class="col-problem"><span class="problem-text">' + patient.chiefComplaint + '</span></td>';

        html += '<td class="col-ed-status"><span class="ed-status-pill ' + getStatusClass(patient.status) + '">' + patient.status + '</span></td>';

        html += '<td class="col-days"><span class="' + getLOSClass(patient.LOSMinutes) + '">' + formatLOS(patient.LOSMinutes) + '</span></td>';

        html += '<td class="col-alerts">' + renderAlertChips(patient.alerts) + '</td>';

        html += '<td class="col-status">' + renderTaskFlags(patient) + '</td>';

        html += '<td class="col-actions">';
        html += '<button class="row-action-btn" onclick="event.stopPropagation(); toggleEDRowMenu(' + patient.id + ')" title="Actions">';
        html += '<i class="pi pi-ellipsis-v"></i>';
        html += '</button>';
        html += '<div class="row-dropdown" id="edRowMenu-' + patient.id + '">';
        html += '<button class="rd-item" onclick="event.stopPropagation(); handleEDRowAction(\'chart\', ' + patient.id + ')"><i class="pi pi-eye"></i> Open Chart</button>';
        html += '<button class="rd-item" onclick="event.stopPropagation(); handleEDRowAction(\'notes\', ' + patient.id + ')"><i class="pi pi-pencil"></i> Notes</button>';
        html += '<button class="rd-item" onclick="event.stopPropagation(); handleEDRowAction(\'orders\', ' + patient.id + ')"><i class="pi pi-file"></i> Orders</button>';
        html += '<button class="rd-item" onclick="event.stopPropagation(); handleEDRowAction(\'meds\', ' + patient.id + ')"><i class="pi pi-box"></i> Medication</button>';
        html += '</div>';
        html += '</td>';

        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    updateBadgeCount(patients.length);
}

function sortIcon(field) {
    var cls = 'sort-icon';
    var icon = 'pi-sort-alt';
    if (edSortField === field) {
        icon = edSortAsc ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
        cls += ' ed-sort-active';
    }
    return '<i class="pi ' + icon + ' ' + cls + '" onclick="event.stopPropagation(); toggleEDSort(\'' + field + '\')"></i>';
}

function toggleEDSort(field) {
    if (edSortField === field) {
        edSortAsc = !edSortAsc;
    } else {
        edSortField = field;
        edSortAsc = true;
    }
    renderEDList();
}

function wireEDTabs() {
    var origHandleTabClick = window.handleTabClick;
    window.handleTabClick = function (tabId) {
        if (tabId.startsWith('ed-')) {
            var buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(function (btn) { btn.classList.remove('tab-btn-active'); });
            var activeBtn = document.querySelector('[data-tab-id="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('tab-btn-active');
            edActiveFilter = tabId;
            renderEDList();
        } else if (origHandleTabClick) {
            origHandleTabClick(tabId);
        }
    };
}

function injectHighRiskToggle() {
    var toolbar = document.querySelector('.toolbar-center');
    if (!toolbar) return;

    var toggle = document.createElement('button');
    toggle.className = 'toolbar-action-btn ed-high-risk-toggle';
    toggle.title = 'High-Risk Only';
    toggle.id = 'edHighRiskBtn';
    toggle.innerHTML = '<i class="pi pi-exclamation-triangle"></i>';
    toggle.onclick = function () {
        edHighRiskOnly = !edHighRiskOnly;
        toggle.classList.toggle('ed-toggle-active', edHighRiskOnly);
        renderEDList();
    };
    toolbar.appendChild(toggle);
}

function updateBadgeCount(count) {
    var badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = count;
}

function filterPatientList(searchTerm) {
    edSearchTerm = (searchTerm || '').toLowerCase();
    renderEDList();
}

function openEDDrawer(patientId) {
    var patient = edPatients.find(function (p) { return p.id === patientId; });
    if (!patient) return;

    var drawer = document.getElementById('edDrawer');
    var overlay = document.getElementById('edDrawerOverlay');
    var title = document.getElementById('edDrawerTitle');
    var body = document.getElementById('edDrawerBody');

    title.textContent = patient.name;

    var genderIcon = patient.gender === 'Male' ? 'pi-mars' : 'pi-venus';

    var html = '';
    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Demographics</div>';
    html += '<div class="ed-drawer-value"><i class="pi ' + genderIcon + '"></i> ' + patient.age + 'y ' + patient.gender + ' &middot; DOB: ' + patient.dob + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Triage Acuity</div>';
    html += '<div class="ed-drawer-value"><span class="ed-acuity-badge ' + getAcuityClass(patient.triageAcuity) + '">ESI ' + patient.triageAcuity + '</span> ' + getAcuityLabel(patient.triageAcuity) + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Chief Complaint</div>';
    html += '<div class="ed-drawer-value">' + patient.chiefComplaint + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Location</div>';
    html += '<div class="ed-drawer-value">' + patient.location + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Status</div>';
    html += '<div class="ed-drawer-value"><span class="ed-status-pill ' + getStatusClass(patient.status) + '">' + patient.status + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Attending Physician</div>';
    html += '<div class="ed-drawer-value"><span class="physician-name">' + patient.attendingPhysician + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Length of Stay</div>';
    html += '<div class="ed-drawer-value">' + formatLOS(patient.LOSMinutes) + ' (Arrived ' + patient.arrivalTime + ')</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Alerts</div>';
    html += '<div class="ed-drawer-value ed-drawer-alerts">' + renderAlertChips(patient.alerts) + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Pending Tasks</div>';
    html += '<div class="ed-drawer-value">';
    if (patient.labsPending) html += '<span class="p-tag-custom p-tag-info"><i class="pi pi-flask"></i> Labs Pending</span> ';
    if (patient.imagingPending) html += '<span class="p-tag-custom p-tag-warning"><i class="pi pi-image"></i> Imaging Pending</span> ';
    if (patient.medsDue) html += '<span class="p-tag-custom p-tag-danger"><i class="pi pi-box"></i> Meds Due</span> ';
    if (!patient.labsPending && !patient.imagingPending && !patient.medsDue) html += '<span class="no-alerts">None</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-actions">';
    html += '<button class="ed-drawer-action-btn" onclick="handleEDRowAction(\'chart\', ' + patient.id + ')"><i class="pi pi-eye"></i> Open Patient Chart</button>';
    html += '<button class="ed-drawer-action-btn" onclick="handleEDRowAction(\'notes\', ' + patient.id + ')"><i class="pi pi-pencil"></i> Clinical Notes</button>';
    html += '<button class="ed-drawer-action-btn" onclick="handleEDRowAction(\'orders\', ' + patient.id + ')"><i class="pi pi-file"></i> Orders</button>';
    html += '<button class="ed-drawer-action-btn" onclick="handleEDRowAction(\'meds\', ' + patient.id + ')"><i class="pi pi-box"></i> Medication</button>';
    html += '</div>';

    body.innerHTML = html;

    drawer.classList.add('open');
    overlay.classList.add('show');
}

function closeEDDrawer() {
    var drawer = document.getElementById('edDrawer');
    var overlay = document.getElementById('edDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

function toggleEDRowMenu(patientId) {
    document.querySelectorAll('.row-dropdown').forEach(function (menu) {
        if (menu.id !== 'edRowMenu-' + patientId) menu.classList.remove('show');
    });
    var menu = document.getElementById('edRowMenu-' + patientId);
    if (menu) menu.classList.toggle('show');
}

function handleEDRowAction(action, patientId) {
    document.querySelectorAll('.row-dropdown').forEach(function (m) { m.classList.remove('show'); });
    closeEDDrawer();
    console.log('ED action:', action, 'for patient:', patientId);
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.col-actions')) {
        document.querySelectorAll('.row-dropdown').forEach(function (m) { m.classList.remove('show'); });
    }
});

document.addEventListener('DOMContentLoaded', initEDList);
