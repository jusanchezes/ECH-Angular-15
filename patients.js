/**
 * @file patients.js — Patient List Logic & Mock Data
 * @description Prototype script for the EHR Patient List view (index.html entry point).
 *   Renders a p-datatable-sm patient table with click-to-navigate to patient timeline.
 *   In production Angular 15, this logic will be replaced by:
 *     - PatientListComponent with PrimeNG <p-table> and async pipe
 *     - PatientService for HTTP calls to Java REST API
 *   Mock data (PatientListData) will be replaced by PatientService.getPatients()
 *   returning PatientListDTO[] from the Java backend.
 */

/** Mock patient list data. Angular: replaced by PatientService.getPatients() → PatientListDTO[] from Java REST API */
const PatientListData = [
    {
        id: 46,
        name: "THOMAS MEYER WOOD",
        dob: "11/07/1990",
        age: 35,
        gender: "Male",
        room: "Bed 201",
        episode: 283,
        department: "Adult Emergency",
        attendingPhysician: "Dr. Rory Rogers",
        admissionDate: "25/05/2024",
        daysAdmitted: 514,
        alerts: ["Penicillin Allergy", "Latex Allergy", "Fall Risk", "VTE Risk", "DNR"]
    }
];

/** Initializes the patient list view. Angular: replaced by ngOnInit() in PatientListComponent */
function initPatientList() {
    renderPatientList();
}

/**
 * Renders the patient list as a high-density data table.
 * PrimeNG equivalent: <p-table> with p-sortableColumn and p-filter.
 * Angular: PatientListComponent template with *ngFor and async pipe.
 * Uses .p-datatable-sm class for 32px max row height per clinical density standard.
 */
function renderPatientList() {
    const container = document.getElementById('patientListContainer');
    if (!container) return;

    let html = '';
    html += `<div class="patient-list-header flex align-items-center justify-content-between p-3">`;
    html += `<h2 class="m-0" data-i18n="PATIENTS.LIST_TITLE"><i class="pi pi-users"></i> Patient List</h2>`;
    html += `<div class="flex align-items-center gap-2">`;
    html += `<input type="text" class="search-input" placeholder="Search patients..." data-i18n-placeholder="PATIENTS.SEARCH_PLACEHOLDER" id="patientSearch">`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="p-datatable p-datatable-sm">`;
    html += `<table class="patient-table w-full">`;
    html += `<thead><tr>`;
    html += `<th data-i18n="PATIENTS.COL_NAME">Patient Name</th>`;
    html += `<th data-i18n="PATIENTS.COL_DOB">Date of Birth</th>`;
    html += `<th data-i18n="PATIENTS.COL_AGE">Age</th>`;
    html += `<th data-i18n="PATIENTS.COL_GENDER">Gender</th>`;
    html += `<th data-i18n="PATIENTS.COL_ROOM">Room</th>`;
    html += `<th data-i18n="PATIENTS.COL_DEPARTMENT">Department</th>`;
    html += `<th data-i18n="PATIENTS.COL_PHYSICIAN">Attending Physician</th>`;
    html += `<th data-i18n="PATIENTS.COL_DAYS">Days</th>`;
    html += `<th data-i18n="PATIENTS.COL_ALERTS">Alerts</th>`;
    html += `</tr></thead>`;
    html += `<tbody>`;

    PatientListData.forEach(patient => {
        html += `<tr class="patient-row cursor-pointer" onclick="navigateToPatient(${patient.id})" data-patient-id="${patient.id}">`;
        html += `<td class="font-bold"><i class="pi pi-user text-primary-color mr-2"></i>${patient.name}</td>`;
        html += `<td>${patient.dob}</td>`;
        html += `<td>${patient.age}</td>`;
        html += `<td>${patient.gender}</td>`;
        html += `<td>${patient.room}</td>`;
        html += `<td>${patient.department}</td>`;
        html += `<td>${patient.attendingPhysician}</td>`;
        html += `<td>${patient.daysAdmitted}</td>`;
        html += `<td>`;
        patient.alerts.forEach(alert => {
            const severity = alert.includes('Allergy') ? 'danger' : (alert === 'DNR' ? 'dnr' : (alert.includes('Fall') ? 'warning' : 'info'));
            html += `<span class="p-tag-custom p-tag-${severity} mr-1 mb-1">${alert}</span>`;
        });
        html += `</td>`;
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    html += `</div>`;

    container.innerHTML = html;
}

/** Navigates to selected patient's timeline. Angular: replaced by Router.navigate(['/timeline', patientId]) */
function navigateToPatient(patientId) {
    window.location.href = `timeline.html?patientId=${patientId}`;
}

/** Initializes the patient list on page load. Angular: replaced by ngOnInit() lifecycle hook */
document.addEventListener('DOMContentLoaded', initPatientList);
