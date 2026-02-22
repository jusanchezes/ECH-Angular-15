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

const PatientListData = [
    {
        id: 46,
        name: "THOMAS MEYER WOOD",
        dob: "11/07/1990",
        age: 35,
        gender: "Male",
        room: "201",
        episode: 283,
        department: "Adult Emergency",
        attendingPhysician: "Dr. Rory Rogers",
        admissionDate: "25/05/2024",
        daysAdmitted: 514,
        admissionType: "emergency",
        medicalProblem: "Fractura de fémur abierta con complicación vascular",
        payer: "Adeslas Premium",
        alerts: ["Penicillin Allergy", "Latex Allergy", "Fall Risk", "VTE Risk", "DNR"],
        statusMeds: "new",
        statusOrders: "pending",
        statusVitals: "ok"
    },
    {
        id: 47,
        name: "MARIA SANTOS FERREIRA",
        dob: "23/03/1958",
        age: 67,
        gender: "Female",
        room: "105",
        episode: 412,
        department: "Cardiology",
        attendingPhysician: "Dr. Elena Vasquez",
        admissionDate: "10/02/2026",
        daysAdmitted: 11,
        admissionType: "inpatient",
        medicalProblem: "Insuficiencia cardíaca congestiva descompensada NYHA III",
        payer: "Sanitas",
        alerts: ["Aspirin Allergy", "Fall Risk", "Pressure Ulcer Risk"],
        statusMeds: "ok",
        statusOrders: "new",
        statusVitals: "alert"
    },
    {
        id: 48,
        name: "JAMES O'BRIEN",
        dob: "15/11/1975",
        age: 50,
        gender: "Male",
        room: "302",
        episode: 198,
        department: "Orthopedics",
        attendingPhysician: "Dr. Henrik Larsson",
        admissionDate: "18/02/2026",
        daysAdmitted: 3,
        admissionType: "inpatient",
        medicalProblem: "Artroplastia total de rodilla izquierda postoperatorio",
        payer: "DKV Seguros",
        alerts: ["VTE Risk"],
        statusMeds: "ok",
        statusOrders: "ok",
        statusVitals: "new"
    },
    {
        id: 49,
        name: "ANNA KOWALSKI",
        dob: "02/09/1945",
        age: 80,
        gender: "Female",
        room: "410",
        episode: 567,
        department: "Internal Medicine",
        attendingPhysician: "Dr. Rory Rogers",
        admissionDate: "05/01/2026",
        daysAdmitted: 47,
        admissionType: "inpatient",
        medicalProblem: "Neumonía nosocomial con insuficiencia respiratoria",
        payer: "Mapfre Salud",
        alerts: ["Iodine Allergy", "Fall Risk", "VTE Risk", "DNR", "Isolation"],
        statusMeds: "new",
        statusOrders: "new",
        statusVitals: "alert"
    },
    {
        id: 50,
        name: "LUCAS BERNARD MARTIN",
        dob: "30/06/2002",
        age: 23,
        gender: "Male",
        room: "208",
        episode: 89,
        department: "Adult Emergency",
        attendingPhysician: "Dr. Sofia Chen",
        admissionDate: "19/02/2026",
        daysAdmitted: 2,
        admissionType: "emergency",
        medicalProblem: "Apendicitis aguda perforada",
        payer: "Asisa",
        alerts: [],
        statusMeds: "ok",
        statusOrders: "pending",
        statusVitals: "ok"
    },
    {
        id: 51,
        name: "FATIMA AL-RASHID",
        dob: "14/12/1983",
        age: 42,
        gender: "Female",
        room: "115",
        episode: 334,
        department: "Oncology",
        attendingPhysician: "Dr. Marcus Webb",
        admissionDate: "28/01/2026",
        daysAdmitted: 24,
        admissionType: "inpatient",
        medicalProblem: "Carcinoma ductal infiltrante mama izquierda - Ciclo 3 QT",
        payer: "Cigna Health",
        alerts: ["Morphine Allergy", "Neutropenia Risk"],
        statusMeds: "new",
        statusOrders: "ok",
        statusVitals: "ok"
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
        admissionType: "emergency",
        medicalProblem: "Infarto agudo de miocardio STEMI anterior extenso",
        payer: "AXA Salud",
        alerts: ["Sulfa Allergy", "Fall Risk", "VTE Risk", "High-Risk Meds"],
        statusMeds: "alert",
        statusOrders: "new",
        statusVitals: "alert"
    },
    {
        id: 53,
        name: "CAROLINA SILVA DUARTE",
        dob: "19/01/1992",
        age: 34,
        gender: "Female",
        room: "207",
        episode: 156,
        department: "Obstetrics",
        attendingPhysician: "Dr. Amara Okonkwo",
        admissionDate: "20/02/2026",
        daysAdmitted: 1,
        admissionType: "inpatient",
        medicalProblem: "Parto prematuro amenaza - 32 semanas gestación",
        payer: "Sanitas",
        alerts: ["Latex Allergy"],
        statusMeds: "ok",
        statusOrders: "ok",
        statusVitals: "new"
    },
    {
        id: 54,
        name: "HEINRICH MÜLLER",
        dob: "25/07/1940",
        age: 85,
        gender: "Male",
        room: "501",
        episode: 445,
        department: "Geriatrics",
        attendingPhysician: "Dr. Henrik Larsson",
        admissionDate: "12/12/2025",
        daysAdmitted: 71,
        admissionType: "inpatient",
        medicalProblem: "Demencia vascular con agitación psicomotriz",
        payer: "Mutua Madrileña",
        alerts: ["Penicillin Allergy", "Fall Risk", "Pressure Ulcer Risk", "VTE Risk", "DNR"],
        statusMeds: "new",
        statusOrders: "pending",
        statusVitals: "ok"
    },
    {
        id: 55,
        name: "YUKI TANAKA",
        dob: "03/05/1971",
        age: 54,
        gender: "Female",
        room: "306",
        episode: 278,
        department: "Neurology",
        attendingPhysician: "Dr. Sofia Chen",
        admissionDate: "14/02/2026",
        daysAdmitted: 7,
        admissionType: "inpatient",
        medicalProblem: "Ictus isquémico ACM derecha en evolución",
        payer: "Adeslas Básico",
        alerts: ["Seizure Risk", "Fall Risk"],
        statusMeds: "ok",
        statusOrders: "new",
        statusVitals: "alert"
    },
    {
        id: 56,
        name: "AHMED HASSAN IBRAHIM",
        dob: "11/10/1955",
        age: 70,
        gender: "Male",
        room: "402",
        episode: 503,
        department: "Cardiology",
        attendingPhysician: "Dr. Elena Vasquez",
        admissionDate: "02/02/2026",
        daysAdmitted: 19,
        admissionType: "inpatient",
        medicalProblem: "Fibrilación auricular con respuesta ventricular rápida",
        payer: "MUFACE",
        alerts: ["Contrast Dye Allergy", "VTE Risk", "High-Risk Meds"],
        statusMeds: "new",
        statusOrders: "ok",
        statusVitals: "ok"
    },
    {
        id: 57,
        name: "SOPHIE DUBOIS",
        dob: "28/08/1999",
        age: 26,
        gender: "Female",
        room: "112",
        episode: 91,
        department: "Pulmonology",
        attendingPhysician: "Dr. Marcus Webb",
        admissionDate: "16/02/2026",
        daysAdmitted: 5,
        admissionType: "emergency",
        medicalProblem: "Crisis asmática severa con insuficiencia respiratoria",
        payer: "DKV Seguros",
        alerts: ["Asthma", "Latex Allergy"],
        statusMeds: "ok",
        statusOrders: "pending",
        statusVitals: "new"
    }
];

function initPatientList() {
    renderPatientList();
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

function renderPatientList() {
    const container = document.getElementById('patientListContainer');
    if (!container) return;

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

    PatientListData.forEach(patient => {
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
        if (patient.alerts.length > 0) {
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

    html += `</tbody></table>`;

    container.innerHTML = html;
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
    const rows = document.querySelectorAll('.patient-row');
    let visibleCount = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = !searchTerm || text.includes(searchTerm.toLowerCase());
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    const badge = document.getElementById('toolbarSearchBadge');
    if (badge) badge.textContent = visibleCount;
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.col-actions')) {
        document.querySelectorAll('.row-dropdown').forEach(m => m.classList.remove('show'));
    }
});

document.addEventListener('DOMContentLoaded', initPatientList);
