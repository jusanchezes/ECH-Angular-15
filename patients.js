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

function initPatientList() {
    renderPatientList();
}

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

function navigateToPatient(patientId) {
    window.location.href = `timeline.html?patientId=${patientId}`;
}

document.addEventListener('DOMContentLoaded', initPatientList);
