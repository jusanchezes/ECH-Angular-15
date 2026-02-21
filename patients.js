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
    },
    {
        id: 47,
        name: "MARIA SANTOS FERREIRA",
        dob: "23/03/1958",
        age: 67,
        gender: "Female",
        room: "Bed 105",
        episode: 412,
        department: "Cardiology",
        attendingPhysician: "Dr. Elena Vasquez",
        admissionDate: "10/02/2026",
        daysAdmitted: 11,
        alerts: ["Aspirin Allergy", "Fall Risk", "Pressure Ulcer Risk"]
    },
    {
        id: 48,
        name: "JAMES O'BRIEN",
        dob: "15/11/1975",
        age: 50,
        gender: "Male",
        room: "Bed 302",
        episode: 198,
        department: "Orthopedics",
        attendingPhysician: "Dr. Henrik Larsson",
        admissionDate: "18/02/2026",
        daysAdmitted: 3,
        alerts: ["VTE Risk"]
    },
    {
        id: 49,
        name: "ANNA KOWALSKI",
        dob: "02/09/1945",
        age: 80,
        gender: "Female",
        room: "Bed 410",
        episode: 567,
        department: "Internal Medicine",
        attendingPhysician: "Dr. Rory Rogers",
        admissionDate: "05/01/2026",
        daysAdmitted: 47,
        alerts: ["Iodine Allergy", "Fall Risk", "VTE Risk", "DNR", "Isolation"]
    },
    {
        id: 50,
        name: "LUCAS BERNARD MARTIN",
        dob: "30/06/2002",
        age: 23,
        gender: "Male",
        room: "Bed 208",
        episode: 89,
        department: "Adult Emergency",
        attendingPhysician: "Dr. Sofia Chen",
        admissionDate: "19/02/2026",
        daysAdmitted: 2,
        alerts: []
    },
    {
        id: 51,
        name: "FATIMA AL-RASHID",
        dob: "14/12/1983",
        age: 42,
        gender: "Female",
        room: "Bed 115",
        episode: 334,
        department: "Oncology",
        attendingPhysician: "Dr. Marcus Webb",
        admissionDate: "28/01/2026",
        daysAdmitted: 24,
        alerts: ["Morphine Allergy", "Neutropenia Risk"]
    },
    {
        id: 52,
        name: "PETER JOHANSSON",
        dob: "08/04/1968",
        age: 57,
        gender: "Male",
        room: "ICU 03",
        episode: 621,
        department: "Intensive Care",
        attendingPhysician: "Dr. Elena Vasquez",
        admissionDate: "17/02/2026",
        daysAdmitted: 4,
        alerts: ["Sulfa Allergy", "Fall Risk", "VTE Risk", "High-Risk Meds"]
    },
    {
        id: 53,
        name: "CAROLINA SILVA DUARTE",
        dob: "19/01/1992",
        age: 34,
        gender: "Female",
        room: "Bed 207",
        episode: 156,
        department: "Obstetrics",
        attendingPhysician: "Dr. Amara Okonkwo",
        admissionDate: "20/02/2026",
        daysAdmitted: 1,
        alerts: ["Latex Allergy"]
    },
    {
        id: 54,
        name: "HEINRICH MÜLLER",
        dob: "25/07/1940",
        age: 85,
        gender: "Male",
        room: "Bed 501",
        episode: 445,
        department: "Geriatrics",
        attendingPhysician: "Dr. Henrik Larsson",
        admissionDate: "12/12/2025",
        daysAdmitted: 71,
        alerts: ["Penicillin Allergy", "Fall Risk", "Pressure Ulcer Risk", "VTE Risk", "DNR"]
    },
    {
        id: 55,
        name: "YUKI TANAKA",
        dob: "03/05/1971",
        age: 54,
        gender: "Female",
        room: "Bed 306",
        episode: 278,
        department: "Neurology",
        attendingPhysician: "Dr. Sofia Chen",
        admissionDate: "14/02/2026",
        daysAdmitted: 7,
        alerts: ["Seizure Risk", "Fall Risk"]
    },
    {
        id: 56,
        name: "AHMED HASSAN IBRAHIM",
        dob: "11/10/1955",
        age: 70,
        gender: "Male",
        room: "Bed 402",
        episode: 503,
        department: "Cardiology",
        attendingPhysician: "Dr. Elena Vasquez",
        admissionDate: "02/02/2026",
        daysAdmitted: 19,
        alerts: ["Contrast Dye Allergy", "VTE Risk", "High-Risk Meds"]
    },
    {
        id: 57,
        name: "SOPHIE DUBOIS",
        dob: "28/08/1999",
        age: 26,
        gender: "Female",
        room: "Bed 112",
        episode: 91,
        department: "Pulmonology",
        attendingPhysician: "Dr. Marcus Webb",
        admissionDate: "16/02/2026",
        daysAdmitted: 5,
        alerts: ["Asthma", "Latex Allergy"]
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
    html += `<input type="text" class="search-input fs-xs" placeholder="Search patients..." data-i18n-placeholder="PATIENTS.SEARCH_PLACEHOLDER" id="patientSearch">`;
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
            const severity = alert.includes('Allergy') || alert.includes('High-Risk') ? 'danger' : (alert === 'DNR' ? 'dnr' : (alert.includes('Fall') || alert.includes('Pressure') || alert.includes('Seizure') ? 'warning' : 'info'));
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

/** Toggles the three-dots user menu dropdown. Angular: UserMenuComponent with OverlayPanel or p-menu */
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    const overlay = document.getElementById('userMenuOverlay');
    if (dropdown && overlay) {
        dropdown.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

/** Handles user menu option clicks. Angular: UserMenuService.execute(action) */
function handleUserMenuAction(action) {
    toggleUserMenu();
    console.log('User menu action:', action);
}

/** Initializes the patient list on page load. Angular: replaced by ngOnInit() lifecycle hook */
document.addEventListener('DOMContentLoaded', initPatientList);
