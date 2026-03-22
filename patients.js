/**
 * @file patients.js — Patient List Logic & Mock Data (Full Clinical Version)
 * @description Prototype script for the EHR Patient List view (index.html entry point).
 *   Renders a p-datatable-sm patient table with 11 clinical columns and click-to-navigate.
 *   In production Angular 15, this logic will be replaced by:
 *     - PatientListComponent with PrimeNG <p-table> and async pipe
 *     - PatientService for HTTP calls to Java REST API
 *   Mock data (PatientListData) will be replaced by PatientService.getPatients()
 *   returning PatientListDTO[] from the Java backend.
 *
 *   COLUMN STRUCTURE:
 *     1. Habitación        → AdmissionDTO.roomBed (negrita, azul)
 *     2. Admisión           → AdmissionDTO.admissionType (icono color: rojo urgencias, azul hospitalizado)
 *     3. Paciente           → PatientDTO.fullName + recordId + episodeNumber
 *     4. Edad/Sexo          → PatientDTO.age + gender (iconos pi-venus / pi-mars)
 *     5. Problema Médico    → DiagnosisDTO.primaryDiagnosis (texto truncado)
 *     6. Médico Responsable → StaffDTO.attendingPhysician (azul negrita)
 *     7. Payer              → InsuranceDTO.payerName
 *     8. Alertas            → PatientDTO.safetyAlerts[] (p-tag con iconos)
 *     9. Días de Estancia   → AdmissionDTO.daysAdmitted (número resaltado)
 *    10. Status             → StatusDTO (iconos Medicación, Órdenes, Vitals con dot-new)
 *    11. Acciones           → Icono vertical pi-ellipsis-v
 */

var patLocActiveFilter = 'loc-all';
var patScopeFilter     = 'all';
var patSearchTerm      = '';

function initPatientList() {
    wirePatientsFilters();
    renderPatientList();
}

/* ============================================================
 * WIRE FILTERS — location tabs + scope change
 * ============================================================ */
function wirePatientsFilters() {
    var origHandleTabClick = window.handleTabClick;
    window.handleTabClick = function(tabId) {
        if (tabId.startsWith('loc-')) {
            var buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(function(btn) { btn.classList.remove('tab-btn-active'); });
            var activeBtn = document.querySelector('[data-tab-id="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('tab-btn-active');
            patLocActiveFilter = tabId;
            renderPatientList();
        } else if (origHandleTabClick) {
            origHandleTabClick(tabId);
        }
    };

    var origHandleScopeChange = window.handleScopeChange;
    window.handleScopeChange = function(scope) {
        if (origHandleScopeChange) origHandleScopeChange(scope);
        patScopeFilter = scope;
        renderPatientList();
    };
}

/* ============================================================
 * FILTERING
 * ============================================================ */
function getFilteredPatients() {
    var list = ClinicalDataService.getPatientList().slice();

    if (patLocActiveFilter === 'loc-recent') {
        list = list.filter(function(p) { return p.daysAdmitted <= 3; });
    } else if (patLocActiveFilter === 'loc-discharge') {
        list = list.filter(function(p) { return p.plannedDischarge === true; });
    } else if (patLocActiveFilter === 'loc-icu') {
        list = list.filter(function(p) {
            return (p.room && p.room.toLowerCase().includes('icu')) ||
                   p.department === 'Intensive Care';
        });
    } else if (patLocActiveFilter === 'loc-surgery') {
        list = list.filter(function(p) { return p.inSurgery === true; });
    }

    if (patScopeFilter === 'mine') {
        list = list.filter(function(p) {
            return p.attendingPhysician === CURRENT_USER.name;
        });
    } else if (patScopeFilter === 'dept') {
        list = list.filter(function(p) {
            return p.department === CURRENT_USER.department ||
                   (p.serviceUnit && p.serviceUnit.includes(CURRENT_USER.department));
        });
    }

    if (patSearchTerm) {
        list = list.filter(function(p) {
            var text = (p.name + ' ' + (p.room || '') + ' ' + p.attendingPhysician + ' ' + p.medicalProblem).toLowerCase();
            return text.includes(patSearchTerm);
        });
    }

    return list;
}

/* ============================================================
 * ALERT HELPERS
 * ============================================================ */
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
    return 'pi-info-circle';
}

function getStatusIcon(status, type) {
    const icons = { meds: 'pi-box', orders: 'pi-file', vitals: 'pi-heart' };
    const icon = icons[type] || 'pi-circle';
    const dotNew = (status === 'new') ? '<span class="dot-new"></span>' : '';
    const dotAlert = (status === 'alert') ? '<span class="dot-alert"></span>' : '';
    let cls = 'status-icon';
    if (status === 'new') cls += ' status-new';
    if (status === 'alert') cls += ' status-alert';
    if (status === 'pending') cls += ' status-pending';
    return `<span class="${cls}" title="${type}: ${status}"><i class="pi ${icon}"></i>${dotNew}${dotAlert}</span>`;
}

/* ============================================================
 * RENDER
 * ============================================================ */
function renderPatientList() {
    const container = document.getElementById('patientListContainer');
    if (!container) return;

    const patients = getFilteredPatients();

    let html = '';
    html += `<table class="patient-table w-full">`;
    html += `<thead><tr>`;
    html += `<th class="col-room" data-i18n="PATIENTS.COL_ROOM">Hab. <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-admission" data-i18n="PATIENTS.COL_ADMISSION">Admisión <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-patient" data-i18n="PATIENTS.COL_PATIENT">Paciente <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-age-sex" data-i18n="PATIENTS.COL_AGE_SEX">Edad/Sexo <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-problem" data-i18n="PATIENTS.COL_PROBLEM">Problema Médico <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-physician" data-i18n="PATIENTS.COL_PHYSICIAN">Médico Resp. <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-payer" data-i18n="PATIENTS.COL_PAYER">Payer <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-alerts" data-i18n="PATIENTS.COL_ALERTS">Alertas</th>`;
    html += `<th class="col-days" data-i18n="PATIENTS.COL_DAYS">Días <i class="pi pi-sort-alt sort-icon"></i></th>`;
    html += `<th class="col-status" data-i18n="PATIENTS.COL_STATUS">Status</th>`;
    html += `<th class="col-actions" data-i18n="PATIENTS.COL_ACTIONS"></th>`;
    html += `</tr></thead>`;
    html += `<tbody>`;

    if (patients.length === 0) {
        html += `<tr><td colspan="11" class="pat-empty-state"><i class="pi pi-inbox"></i> No patients match the current filter.</td></tr>`;
    } else {
        patients.forEach(patient => {
            const genderIcon = patient.gender === 'Male' ? 'pi-mars' : 'pi-venus';
            const genderColor = patient.gender === 'Male' ? 'color: var(--ech-primary)' : 'color: #e91e63';
            const admissionIcon = patient.admissionType === 'emergency'
                ? '<i class="pi pi-bolt admission-icon admission-emergency" title="Urgencias"></i>'
                : '<i class="pi pi-home admission-icon admission-inpatient" title="Hospitalizado"></i>';

            const daysClass = patient.daysAdmitted > 30 ? 'days-highlight days-long' : (patient.daysAdmitted > 7 ? 'days-highlight days-medium' : 'days-highlight');

            html += `<tr class="patient-row cursor-pointer" onclick="navigateToPatient(${patient.id})" data-patient-id="${patient.id}">`;

            html += `<td class="col-room"><span class="room-number">${patient.room}</span></td>`;

            html += `<td class="col-admission">${admissionIcon}</td>`;

            html += `<td class="col-patient">
                        <span class="patient-name-cell">${patient.name}</span>
                        <span class="patient-sub-info">Rec ID ${patient.id} &middot; Ep. ${patient.episode}</span>
                     </td>`;

            html += `<td class="col-age-sex">
                        <span>${patient.age}</span>
                        <i class="pi ${genderIcon}" style="${genderColor}"></i>
                     </td>`;

            html += `<td class="col-problem"><span class="problem-text">${patient.medicalProblem}</span></td>`;

            html += `<td class="col-physician"><span class="physician-name">${patient.attendingPhysician}</span></td>`;

            html += `<td class="col-payer">${patient.payer}</td>`;

            html += `<td class="col-alerts">`;
            if (patient.alerts && patient.alerts.length > 0) {
                patient.alerts.forEach(alert => {
                    const severity = getAlertSeverity(alert);
                    const icon = getAlertIcon(alert);
                    html += `<span class="p-tag-custom p-tag-${severity}" title="${alert}"><i class="pi ${icon}"></i> ${alert}</span> `;
                });
            } else {
                html += `<span class="no-alerts">—</span>`;
            }
            html += `</td>`;

            html += `<td class="col-days"><span class="${daysClass}">${patient.daysAdmitted}</span></td>`;

            html += `<td class="col-status">
                        <div class="status-icons-group">
                            ${getStatusIcon(patient.statusMeds, 'meds')}
                            ${getStatusIcon(patient.statusOrders, 'orders')}
                            ${getStatusIcon(patient.statusVitals, 'vitals')}
                        </div>
                     </td>`;

            html += `<td class="col-actions">
                        <button class="row-action-btn" onclick="event.stopPropagation(); toggleRowMenu(${patient.id})" title="Acciones">
                            <i class="pi pi-ellipsis-v"></i>
                        </button>
                        <div class="row-dropdown" id="rowMenu-${patient.id}">
                            <button class="rd-item" onclick="event.stopPropagation(); handleRowAction('view', ${patient.id})"><i class="pi pi-eye"></i> Ver Detalle</button>
                            <button class="rd-item" onclick="event.stopPropagation(); handleRowAction('notes', ${patient.id})"><i class="pi pi-pencil"></i> Notas</button>
                            <button class="rd-item" onclick="event.stopPropagation(); handleRowAction('orders', ${patient.id})"><i class="pi pi-file"></i> Órdenes</button>
                            <button class="rd-item" onclick="event.stopPropagation(); handleRowAction('meds', ${patient.id})"><i class="pi pi-box"></i> Medicación</button>
                        </div>
                     </td>`;

            html += `</tr>`;
        });
    }

    html += `</tbody></table>`;
    container.innerHTML = html;

    const badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = patients.length;
}

function navigateToPatient(patientId) {
    window.location.href = `timeline.html?patientId=${patientId}`;
}

function toggleRowMenu(patientId) {
    document.querySelectorAll('.row-dropdown').forEach(menu => {
        if (menu.id !== `rowMenu-${patientId}`) menu.classList.remove('show');
    });
    const menu = document.getElementById(`rowMenu-${patientId}`);
    if (menu) menu.classList.toggle('show');
}

function handleRowAction(action, patientId) {
    document.querySelectorAll('.row-dropdown').forEach(m => m.classList.remove('show'));
    console.log('Row action:', action, 'for patient:', patientId);
    if (action === 'view') navigateToPatient(patientId);
}

function filterPatientList(searchTerm) {
    patSearchTerm = (searchTerm || '').toLowerCase();
    renderPatientList();
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.col-actions')) {
        document.querySelectorAll('.row-dropdown').forEach(m => m.classList.remove('show'));
    }
});

document.addEventListener('DOMContentLoaded', initPatientList);
