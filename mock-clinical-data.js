/**
 * =============================================================================
 * @file mock-clinical-data.js — Centralized Mock Clinical Data (EHR Redesign)
 * =============================================================================
 *
 * CONTRATO REST / DTO — Ver API_contracts.md para especificación completa
 * -----------------------------------------------------------------------
 * Este objeto simula los DTOs Java servidos por la API REST /api/v1/*.
 * Cada propiedad coincide 1:1 con el campo del DTO y el data-field del HTML.
 *
 * Endpoint principal:
 *   GET /api/v1/clinical/context/{patientId} → PatientClinicalContextDTO
 *
 * Sub-DTOs mapeados (ver API_contracts.md §2–§20 para tipado completo):
 *   - PatientListDTO[]               → GET /api/v1/patients
 *   - PatientListDTO                 → GET /api/v1/patients/{id}
 *   - TimelineEntryGroupDTO[]        → GET /api/v1/clinical/timeline/{patientId}
 *   - LaboratoryContextDTO           → GET /api/v1/clinical/laboratory/{patientId}
 *   - MeasurementsContextDTO         → GET /api/v1/clinical/measurements/{patientId}
 *   - RiskFactorsContextDTO          → GET /api/v1/clinical/risk-factors/{patientId}
 *   - ClinicalOrderDTO[]             → GET /api/v1/clinical/diagnostic-tests/{patientId}
 *   - MedicationContextDTO           → GET /api/v1/clinical/medication/{patientId}
 *   - CarePlanTaskDTO[]              → GET /api/v1/clinical/care-plans/{patientId}
 *   - ClinicalDocumentDTO[]          → GET /api/v1/clinical/documents/{patientId}
 *   - ProtocolDTO[]                  → GET /api/v1/clinical/protocols/{patientId}
 *   - PatientSummaryDTO              → GET /api/v1/clinical/summary/{patientId}/*
 *   - NurseNotesContextDTO           → GET /api/v1/clinical/nurse-notes/{patientId}
 *   - PreviousVisitDTO[]             → GET /api/v1/clinical/previous-visits/{patientId}
 *   - LabCatalogItemDTO[]            → GET /api/v1/catalogs/laboratory
 *   - RadiologyCatalogItemDTO[]      → GET /api/v1/catalogs/radiology
 *   - DisciplineDTO[]                → GET /api/v1/catalogs/laboratory/disciplines
 *
 * Para producción:
 *   Sustituir MockClinicalData por llamadas HttpClient.get() a los endpoints
 *   REST listados arriba. Cada sub-DTO se mapea 1:1 con la estructura aquí
 *   definida. Consultar API_contracts.md para interfaces TypeScript y tipado Java.
 *
 * =============================================================================
 */

var MockClinicalData = {

    patients: [
        {
            id: 46,
            name: "THOMAS MEYER WOOD",
            dob: "11/07/1990",
            age: 35,
            gender: "Male",
            genderIcon: "pi-user",
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
            statusVitals: "ok",
            client: "CLIENTE 01",
            hospital: "Healthcare Provider A1",
            ward: "Inpatients",
            currentDate: "20/02/2026",
            serviceUnit: "A1MGCARD - Cardiology",
            allergies: [
                { label: "Penicillin Allergy", severity: "danger" },
                { label: "Latex Allergy", severity: "danger" }
            ],
            risks: [
                { label: "Fall Risk", severity: "warning" },
                { label: "VTE Risk", severity: "info" }
            ],
            dnr: true
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
            statusVitals: "new",
            plannedDischarge: true
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
            statusVitals: "ok",
            inSurgery: true
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
            statusVitals: "new",
            plannedDischarge: true
        }
    ],

    patientClinicalContext: {
        46: {

            timeline: [
                {
                    date: "Thursday 2 October 2025",
                    entries: [
                        { time: "17:44", type: "Exam", dept: "Radiology", description: "Contrast-Enhanced Ultrasound (CEUS) Requested", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] },
                        { time: "17:44", type: "Exam", dept: "Radiology", description: "MRI of the Spine", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] },
                        { time: "17:44", type: "Exam", dept: "Radiology", description: "Comparative Hip X-Ray", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] }
                    ]
                },
                {
                    date: "Thursday 9 October 2025",
                    entries: [
                        { time: "12:37", type: "Surgery", dept: "Cardiology", description: "Aortic Aneurysm Repair - Surgery Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Cancel", "View Details"] }
                    ]
                },
                {
                    date: "Wednesday 15 October 2025",
                    entries: [
                        { time: "10:52", type: "Images", dept: "Radiology", description: "CT Abdomen - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "Cardiology", actions: ["View Images", "View Details"] },
                        { time: "10:52", type: "Images", dept: "Cardiology", description: "Holter Monitoring (24-Hour ECG Recording) - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["View Images", "View Details"] },
                        { time: "11:14", type: "Exam", dept: "Laboratory", description: "Laboratory Test Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] },
                        { time: "14:56", type: "Images", dept: "Laboratory", description: "Laboratory - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "Cardiology", actions: ["View Images"] },
                        { time: "21:35", type: "Exam", dept: "Radiology", description: "Cervical Spine X-Ray Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] }
                    ]
                },
                {
                    date: "Thursday 16 October 2025",
                    entries: [
                        { time: "10:33", type: "Care", dept: "Nursing", description: "Establish optimal analgesic dosage for optimal pain relief - Every 24 Hours", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] },
                        { time: "10:33", type: "Surgery", dept: "Cardiology", description: "Cholecystectomy - Surgery Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Cancel", "View Details"] },
                        { time: "14:20", type: "Medication", dept: "Nursing", description: "Enoxaparin 40mg SC administered", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View MAR"] },
                        { time: "15:00", type: "Note", dept: "Adult Emergency", description: "Patient reviewed - stable overnight, oxygen 2L nasal cannula", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Delete"] },
                        { time: "16:45", type: "Vitals", dept: "Nursing", description: "BP 128/82, HR 76, Temp 36.8°C, SpO2 97%", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["View Chart"] }
                    ]
                },
                {
                    date: "Friday 17 October 2025",
                    entries: [
                        { time: "08:00", type: "Note", dept: "Adult Emergency", description: "Morning round - Patient comfortable, no acute complaints", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Delete"] },
                        { time: "09:30", type: "Medication", dept: "Pharmacy", description: "Metoprolol 50mg PO administered", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View MAR"] },
                        { time: "11:00", type: "Exam", dept: "Laboratory", description: "Complete Blood Count + Metabolic Panel", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Results"] },
                        { time: "14:15", type: "Care", dept: "Nursing", description: "Wound dressing change - Surgical site clean, no signs of infection", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View Details"] }
                    ]
                }
            ],

            laboratory: {
                disciplines: [
                    { id: 'chemistry', label: 'Chemistry / Bioquímica', i18n: 'LAB.DISC_CHEMISTRY' },
                    { id: 'hematology', label: 'Hematology / Hemograma', i18n: 'LAB.DISC_HEMATOLOGY' },
                    { id: 'blood-gas', label: 'Blood Gas / Gases', i18n: 'LAB.DISC_BLOOD_GAS' },
                    { id: 'microbiology', label: 'Microbiology', i18n: 'LAB.DISC_MICROBIOLOGY' },
                    { id: 'coagulation', label: 'Coagulation', i18n: 'LAB.DISC_COAGULATION' }
                ],
                sampleDates: [
                    '28/02 08:15', '27/02 20:00', '27/02 08:00', '26/02 18:30', '26/02 06:00',
                    '25/02 20:00', '25/02 08:00', '24/02 18:30', '24/02 06:00', '23/02 20:00'
                ],
                analytes: [
                    { name: 'Sodium (Na+)', discipline: 'chemistry', unit: 'mEq/L', refRange: '135-145', refLow: 135, refHigh: 145, values: [138, 137, 139, 140, 141, 136, 138, 139, 140, 137], validatedBy: 'Dr. García', comments: 'Within normal range.' },
                    { name: 'Potassium (K+)', discipline: 'chemistry', unit: 'mEq/L', refRange: '3.5-5.1', refLow: 3.5, refHigh: 5.1, values: [5.4, 4.9, 4.2, 3.8, 3.2, 4.0, 4.1, 3.9, 4.5, 4.3], validatedBy: 'Dr. López', comments: 'Recent value elevated — monitor renal function.' },
                    { name: 'Glucose (Fast)', discipline: 'chemistry', unit: 'mg/dL', refRange: '70-100', refLow: 70, refHigh: 100, values: [250, 180, 110, 95, 88, 102, 98, 115, 130, 92], validatedBy: 'Dr. García', comments: 'Fasting glucose significantly elevated. Critical value notified.', isCritical: [true, true, false, false, false, false, false, false, false, false] },
                    { name: 'Creatinine', discipline: 'chemistry', unit: 'mg/dL', refRange: '0.7-1.3', refLow: 0.7, refHigh: 1.3, values: [1.4, 1.3, 1.2, 1.1, 0.9, 1.0, 1.1, 1.2, 1.3, 1.1], validatedBy: 'Dr. Martínez', comments: 'Trending up — correlate with eGFR decline.' },
                    { name: 'BUN', discipline: 'chemistry', unit: 'mg/dL', refRange: '7-20', refLow: 7, refHigh: 20, values: [22, 19, 18, 17, 15, 16, 18, 20, 21, 19], validatedBy: 'Dr. García', comments: 'Mildly elevated, consistent with renal status.' },
                    { name: 'Calcium (Ca)', discipline: 'chemistry', unit: 'mg/dL', refRange: '8.5-10.5', refLow: 8.5, refHigh: 10.5, values: [9.2, 9.0, 9.1, 9.3, 9.4, 9.1, 8.9, 9.0, 9.2, 9.3], validatedBy: 'Dr. López', comments: 'Stable.' },
                    { name: 'ALT (GPT)', discipline: 'chemistry', unit: 'U/L', refRange: '7-56', refLow: 7, refHigh: 56, values: [45, 42, 38, 35, 33, 30, 28, 32, 40, 44], validatedBy: 'Dr. Martínez', comments: 'Within reference range.' },
                    { name: 'AST (GOT)', discipline: 'chemistry', unit: 'U/L', refRange: '10-40', refLow: 10, refHigh: 40, values: [38, 35, 30, 28, 25, 27, 29, 32, 36, 34], validatedBy: 'Dr. Martínez', comments: 'Within reference range.' },
                    { name: 'Hemoglobin', discipline: 'hematology', unit: 'g/dL', refRange: '13.5-17.5', refLow: 13.5, refHigh: 17.5, values: [12.8, 13.0, 13.2, 13.5, 13.8, 14.0, 13.9, 13.6, 13.3, 13.1], validatedBy: 'Dr. Ruiz', comments: 'Slightly below lower limit — monitor for anemia.' },
                    { name: 'Hematocrit', discipline: 'hematology', unit: '%', refRange: '38.3-48.6', refLow: 38.3, refHigh: 48.6, values: [36.5, 37.0, 37.8, 38.5, 39.2, 40.0, 39.5, 38.8, 38.0, 37.5], validatedBy: 'Dr. Ruiz', comments: 'Low — correlates with hemoglobin trend.' },
                    { name: 'WBC', discipline: 'hematology', unit: '×10³/µL', refRange: '4.5-11.0', refLow: 4.5, refHigh: 11.0, values: [12.5, 11.8, 10.5, 9.8, 8.5, 7.2, 6.8, 7.5, 8.2, 9.0], validatedBy: 'Dr. Ruiz', comments: 'Downtrending from elevated peak — infection resolving.' },
                    { name: 'Platelets', discipline: 'hematology', unit: '×10³/µL', refRange: '150-400', refLow: 150, refHigh: 400, values: [185, 190, 195, 200, 210, 215, 220, 218, 205, 198], validatedBy: 'Dr. Ruiz', comments: 'Within normal limits.' },
                    { name: 'MCV', discipline: 'hematology', unit: 'fL', refRange: '80-100', refLow: 80, refHigh: 100, values: [88, 87, 89, 90, 88, 87, 86, 88, 89, 90], validatedBy: 'Dr. Ruiz', comments: 'Normocytic.' },
                    { name: 'pH', discipline: 'blood-gas', unit: '', refRange: '7.35-7.45', refLow: 7.35, refHigh: 7.45, values: [7.38, 7.40, 7.42, 7.41, 7.39, 7.37, 7.36, 7.38, 7.40, 7.41], validatedBy: 'Dr. Patel', comments: 'Within normal range.' },
                    { name: 'pCO2', discipline: 'blood-gas', unit: 'mmHg', refRange: '35-45', refLow: 35, refHigh: 45, values: [42, 40, 38, 39, 41, 43, 44, 42, 40, 39], validatedBy: 'Dr. Patel', comments: 'Normal ventilation.' },
                    { name: 'pO2', discipline: 'blood-gas', unit: 'mmHg', refRange: '80-100', refLow: 80, refHigh: 100, values: [92, 95, 88, 90, 85, 82, 87, 91, 93, 89], validatedBy: 'Dr. Patel', comments: 'Adequate oxygenation.' },
                    { name: 'HCO3', discipline: 'blood-gas', unit: 'mEq/L', refRange: '22-26', refLow: 22, refHigh: 26, values: [24, 23, 24, 25, 24, 23, 22, 23, 24, 25], validatedBy: 'Dr. Patel', comments: 'Normal bicarbonate.' },
                    { name: 'Lactate', discipline: 'blood-gas', unit: 'mmol/L', refRange: '0.5-2.0', refLow: 0.5, refHigh: 2.0, values: [2.8, 2.2, 1.8, 1.5, 1.2, 1.0, 1.1, 1.3, 1.6, 1.9], validatedBy: 'Dr. Patel', comments: 'Elevated — was critical, now trending down.' },
                    { name: 'Blood Culture', discipline: 'microbiology', unit: '', refRange: 'Negative', refLow: null, refHigh: null, values: ['Negative', 'Pending', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative'], validatedBy: 'Dr. Sánchez', comments: 'No growth at 48h.', isText: true },
                    { name: 'Urine Culture', discipline: 'microbiology', unit: '', refRange: 'Negative', refLow: null, refHigh: null, values: ['E. coli >10⁵', 'Pending', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative'], validatedBy: 'Dr. Sánchez', comments: 'Positive — E. coli. Sensitivity report attached.', isText: true, textFlags: ['abnormal', 'pending', null, null, null, null, null, null, null, null] },
                    { name: 'Procalcitonin', discipline: 'microbiology', unit: 'ng/mL', refRange: '<0.5', refLow: 0, refHigh: 0.5, values: [1.2, 0.8, 0.4, 0.3, 0.2, 0.15, 0.1, 0.12, 0.18, 0.22], validatedBy: 'Dr. Sánchez', comments: 'Downtrending — correlates with infection resolution.' },
                    { name: 'PT (sec)', discipline: 'coagulation', unit: 'sec', refRange: '11-13.5', refLow: 11, refHigh: 13.5, values: [15.2, 14.8, 14.0, 13.5, 13.2, 12.8, 12.5, 12.9, 13.1, 13.3], validatedBy: 'Dr. Torres', comments: 'Elevated — patient on Warfarin therapy.' },
                    { name: 'INR', discipline: 'coagulation', unit: '', refRange: '0.8-1.2', refLow: 0.8, refHigh: 1.2, values: [2.8, 2.5, 2.2, 2.0, 1.8, 1.5, 1.3, 1.4, 1.6, 1.7], validatedBy: 'Dr. Torres', comments: 'Therapeutic range for anticoagulation (target 2.0-3.0).' },
                    { name: 'aPTT', discipline: 'coagulation', unit: 'sec', refRange: '25-35', refLow: 25, refHigh: 35, values: [38, 36, 34, 32, 30, 29, 28, 30, 32, 33], validatedBy: 'Dr. Torres', comments: 'Mildly prolonged — consistent with anticoagulation.' },
                    { name: 'Fibrinogen', discipline: 'coagulation', unit: 'mg/dL', refRange: '200-400', refLow: 200, refHigh: 400, values: [320, 310, 300, 290, 285, 280, 275, 280, 290, 300], validatedBy: 'Dr. Torres', comments: 'Within normal limits.' }
                ]
            },

            measurements: {
                groups: [
                    { id: 'all', label: 'All', i18n: 'MEASUREMENTS.GROUP_ALL' },
                    { id: 'vital-signs', label: 'Vital Signs', i18n: 'MEASUREMENTS.GROUP_VITAL_SIGNS' },
                    { id: 'fluids-balance', label: 'Fluids Balance', i18n: 'MEASUREMENTS.GROUP_FLUIDS_BALANCE' },
                    { id: 'pulmonary', label: 'Pulmonary - Mech. Vent.', i18n: 'MEASUREMENTS.GROUP_PULMONARY' },
                    { id: 'respiratory', label: 'Respiratory - Lung Mech.', i18n: 'MEASUREMENTS.GROUP_RESPIRATORY' },
                    { id: 'neurological', label: 'Neurological', i18n: 'MEASUREMENTS.GROUP_NEUROLOGICAL' }
                ],
                parameters: {
                    'vital-signs': [
                        { name: 'Blood Pressure (mmHg)', field: 'bp', unit: 'mmHg', low: null, high: null, isBP: true },
                        { name: 'Oxygen saturation (%)', field: 'spo2', unit: '%', low: 90, high: 100 },
                        { name: 'Heart Rate (bpm)', field: 'hr', unit: 'bpm', low: 60, high: 100 },
                        { name: 'Temperature (°C)', field: 'temp', unit: '°C', low: 36.0, high: 37.5 }
                    ],
                    'fluids-balance': [
                        { name: 'Uresis (ml)', field: 'uresis', unit: 'ml', low: 30, high: 400 },
                        { name: 'IV Intake (ml)', field: 'ivIntake', unit: 'ml', low: null, high: null },
                        { name: 'Oral Intake (ml)', field: 'oralIntake', unit: 'ml', low: null, high: null },
                        { name: 'Total Balance (ml)', field: 'totalBalance', unit: 'ml', low: -500, high: 500 }
                    ],
                    'pulmonary': [
                        { name: 'FiO2 (%)', field: 'fio2', unit: '%', low: 21, high: 60 },
                        { name: 'PEEP (cmH2O)', field: 'peep', unit: 'cmH2O', low: 0, high: 10 },
                        { name: 'Tidal Volume (ml)', field: 'tidalVol', unit: 'ml', low: 350, high: 600 },
                        { name: 'RR (rpm)', field: 'rr', unit: 'rpm', low: 12, high: 20 }
                    ],
                    'respiratory': [
                        { name: 'Compliance (ml/cmH2O)', field: 'compliance', unit: 'ml/cmH2O', low: 50, high: 100 },
                        { name: 'Resistance (cmH2O/L/s)', field: 'resistance', unit: 'cmH2O/L/s', low: null, high: 15 },
                        { name: 'Peak Pressure (cmH2O)', field: 'peakPressure', unit: 'cmH2O', low: null, high: 30 }
                    ],
                    'neurological': [
                        { name: 'Glasgow Score', field: 'glasgow', unit: '', low: 13, high: 15 },
                        { name: 'Pupil Response', field: 'pupil', unit: '', low: null, high: null, isText: true },
                        { name: 'RASS Score', field: 'rass', unit: '', low: -1, high: 1 }
                    ]
                },
                thresholdsBP: { sysLow: 90, sysHigh: 180, diaLow: 50, diaHigh: 110 },
                criticalBP: { sysLow: 80, sysHigh: 200, diaLow: 40, diaHigh: 120 },
                nurses: ['Dr. Garcia', 'Nurse Smith', 'Nurse Johnson', 'Dr. Patel', 'Nurse Williams']
            },

            riskFactors: {
                allergies: [
                    { id: 1, type: 'Drug', group: 'Medication Allergy', riskFactor: 'Penicillin', catalogued: 'Yes', comment: 'Anaphylactic reaction reported in 2018', author: 'Dr. Rory Rogers', date: '15/03/2023', severity: 'Severe', alert: true, status: 'active' },
                    { id: 2, type: 'Drug', group: 'Medication Allergy', riskFactor: 'Sulfonamides', catalogued: 'Yes', comment: 'Skin rash and urticaria', author: 'Dr. Ana Martinez', date: '22/06/2024', severity: 'Moderate', alert: true, status: 'active' },
                    { id: 3, type: 'Environmental', group: 'Contact Allergy', riskFactor: 'Latex', catalogued: 'Yes', comment: 'Contact dermatitis on exposure', author: 'Dr. Rory Rogers', date: '10/01/2023', severity: 'Severe', alert: true, status: 'active' },
                    { id: 4, type: 'Food', group: 'Food Allergy', riskFactor: 'Shellfish', catalogued: 'Yes', comment: 'Mild gastrointestinal symptoms, resolved', author: 'Dr. James Wilson', date: '05/09/2019', severity: 'Low', alert: false, status: 'inactive' }
                ],
                conditions: [
                    { id: 5, type: 'Chronic', group: 'Cardiovascular', riskFactor: 'Essential Hypertension', catalogued: 'Yes', comment: 'Stage 2, on dual therapy', author: 'Dr. Rory Rogers', date: '12/11/2020', severity: 'Moderate', alert: false, status: 'active' },
                    { id: 6, type: 'Chronic', group: 'Metabolic', riskFactor: 'Type 2 Diabetes Mellitus', catalogued: 'Yes', comment: 'HbA1c 7.2%, on Metformin 1000mg BD', author: 'Dr. Ana Martinez', date: '03/05/2021', severity: 'Moderate', alert: true, status: 'active' },
                    { id: 7, type: 'Chronic', group: 'Cardiovascular', riskFactor: 'Atrial Fibrillation', catalogued: 'Yes', comment: 'Paroxysmal, on anticoagulation', author: 'Dr. Rory Rogers', date: '18/08/2024', severity: 'Severe', alert: true, status: 'active' },
                    { id: 8, type: 'Acute', group: 'Respiratory', riskFactor: 'Community-Acquired Pneumonia', catalogued: 'Yes', comment: 'Resolved after IV antibiotics course', author: 'Dr. James Wilson', date: '20/02/2024', severity: 'Low', alert: false, status: 'inactive' }
                ],
                procedures: [
                    { id: 9, type: 'Surgical', group: 'Cardiac Surgery', riskFactor: 'Coronary Artery Bypass Graft (CABG)', catalogued: 'Yes', comment: 'Triple vessel CABG, uneventful recovery', author: 'Dr. Rory Rogers', date: '25/09/2023', severity: 'Moderate', alert: false, status: 'active' },
                    { id: 10, type: 'Diagnostic', group: 'Cardiac Catheterization', riskFactor: 'Left Heart Catheterization', catalogued: 'Yes', comment: 'LAD 70% stenosis identified', author: 'Dr. Rory Rogers', date: '10/09/2023', severity: 'Low', alert: false, status: 'active' },
                    { id: 11, type: 'Surgical', group: 'General Surgery', riskFactor: 'Appendectomy', catalogued: 'Yes', comment: 'Laparoscopic, no complications', author: 'Dr. Ana Martinez', date: '14/03/2015', severity: 'Low', alert: false, status: 'inactive' }
                ],
                'family-history': [
                    { id: 12, type: 'Genetic', group: 'Cardiovascular', riskFactor: 'Father — Myocardial Infarction at age 52', catalogued: 'Yes', comment: 'First-degree relative, premature CAD', author: 'Dr. Rory Rogers', date: '12/11/2020', severity: 'Severe', alert: true, status: 'active' },
                    { id: 13, type: 'Genetic', group: 'Metabolic', riskFactor: 'Mother — Type 2 Diabetes Mellitus', catalogued: 'Yes', comment: 'Diagnosed at age 45', author: 'Dr. Rory Rogers', date: '12/11/2020', severity: 'Moderate', alert: false, status: 'active' },
                    { id: 14, type: 'Genetic', group: 'Oncology', riskFactor: 'Brother — Colon Cancer at age 60', catalogued: 'Yes', comment: 'Screening recommended from age 40', author: 'Dr. Ana Martinez', date: '05/06/2022', severity: 'Moderate', alert: true, status: 'active' },
                    { id: 15, type: 'Genetic', group: 'Neurological', riskFactor: 'Grandmother — Alzheimer Disease', catalogued: 'No', comment: 'Late onset, no current screening', author: 'Dr. James Wilson', date: '01/01/2019', severity: 'Low', alert: false, status: 'inactive' }
                ],
                'social-history': [
                    { id: 16, type: 'Habit', group: 'Tobacco Use', riskFactor: 'Former Smoker (20 pack-years)', catalogued: 'Yes', comment: 'Quit in 2018, no relapse', author: 'Dr. Rory Rogers', date: '15/03/2020', severity: 'Moderate', alert: false, status: 'active' },
                    { id: 17, type: 'Habit', group: 'Alcohol Use', riskFactor: 'Social Drinker (5-10 units/week)', catalogued: 'Yes', comment: 'Within low-risk guidelines', author: 'Dr. Rory Rogers', date: '15/03/2020', severity: 'Low', alert: false, status: 'active' },
                    { id: 18, type: 'Occupation', group: 'Occupational Hazard', riskFactor: 'Construction Worker — Asbestos Exposure', catalogued: 'Yes', comment: 'Exposed 1995-2005, under pulmonary surveillance', author: 'Dr. Ana Martinez', date: '08/07/2021', severity: 'Severe', alert: true, status: 'active' },
                    { id: 19, type: 'Habit', group: 'Substance Use', riskFactor: 'Recreational Cannabis Use', catalogued: 'Yes', comment: 'Discontinued 2017', author: 'Dr. James Wilson', date: '10/04/2018', severity: 'Low', alert: false, status: 'inactive' }
                ],
                'infection-control': [
                    { id: 20, type: 'Colonization', group: 'MDRO', riskFactor: 'MRSA Colonization (Nasal)', catalogued: 'Yes', comment: 'Decolonization protocol completed, last swab negative', author: 'Dr. Ana Martinez', date: '02/12/2024', severity: 'Severe', alert: true, status: 'active' },
                    { id: 21, type: 'Exposure', group: 'Blood-Borne', riskFactor: 'Hepatitis B — Immune (Vaccinated)', catalogued: 'Yes', comment: 'Anti-HBs > 100 mIU/mL', author: 'Dr. Rory Rogers', date: '20/01/2020', severity: 'Low', alert: false, status: 'active' },
                    { id: 22, type: 'Infection', group: 'Respiratory', riskFactor: 'COVID-19 Infection', catalogued: 'Yes', comment: 'Mild course, fully recovered Dec 2023', author: 'Dr. James Wilson', date: '15/12/2023', severity: 'Low', alert: false, status: 'inactive' }
                ],
                immunizations: [
                    { id: 23, type: 'Vaccine', group: 'Respiratory', riskFactor: 'Influenza Vaccine 2025-2026', catalogued: 'Yes', comment: 'Quadrivalent, administered Oct 2025', author: 'Nurs. Sarah Thompson', date: '10/10/2025', severity: 'Low', alert: false, status: 'active' },
                    { id: 24, type: 'Vaccine', group: 'Respiratory', riskFactor: 'COVID-19 Booster (Bivalent)', catalogued: 'Yes', comment: 'Updated XBB.1.5 formulation', author: 'Nurs. Sarah Thompson', date: '15/09/2025', severity: 'Low', alert: false, status: 'active' },
                    { id: 25, type: 'Vaccine', group: 'Hepatitis', riskFactor: 'Hepatitis B Vaccine (3-dose series)', catalogued: 'Yes', comment: 'Completed series, seroconverted', author: 'Dr. Rory Rogers', date: '01/06/2019', severity: 'Low', alert: false, status: 'active' },
                    { id: 26, type: 'Vaccine', group: 'Pneumococcal', riskFactor: 'Pneumococcal Vaccine (PPSV23)', catalogued: 'Yes', comment: 'Due for PCV20 booster in 2026', author: 'Dr. Ana Martinez', date: '05/03/2021', severity: 'Low', alert: false, status: 'inactive' }
                ],
                devices: [
                    { id: 27, type: 'Implant', group: 'Cardiac', riskFactor: 'Drug-Eluting Stent — LAD (Xience Sierra)', catalogued: 'Yes', comment: 'Placed during PCI Sept 2023, dual antiplatelet ongoing', author: 'Dr. Rory Rogers', date: '25/09/2023', severity: 'Moderate', alert: true, status: 'active' },
                    { id: 28, type: 'Device', group: 'Orthopedic', riskFactor: 'Left Knee Prosthesis (Total Replacement)', catalogued: 'Yes', comment: 'Cemented TKR, Feb 2022, good function', author: 'Dr. Ana Martinez', date: '14/02/2022', severity: 'Low', alert: false, status: 'active' },
                    { id: 29, type: 'Implant', group: 'Dental', riskFactor: 'Dental Implants (2 units, mandibular)', catalogued: 'No', comment: 'Placed 2019, no issues reported', author: 'Dr. James Wilson', date: '20/05/2019', severity: 'Low', alert: false, status: 'inactive' }
                ],
                'risk-assessments': [
                    { id: 30, type: 'Assessment', group: 'Fall Risk', riskFactor: 'Morse Fall Scale — Score 55 (High Risk)', catalogued: 'Yes', comment: 'Fall precautions in place, bed alarm active', author: 'Nurs. Adam Dixon', date: '20/02/2026', severity: 'Severe', alert: true, status: 'active' },
                    { id: 31, type: 'Assessment', group: 'VTE Risk', riskFactor: 'Padua Score — 6 (High Risk)', catalogued: 'Yes', comment: 'On prophylactic Enoxaparin 40mg SC daily', author: 'Dr. Rory Rogers', date: '20/02/2026', severity: 'Severe', alert: true, status: 'active' },
                    { id: 32, type: 'Assessment', group: 'Pressure Injury', riskFactor: 'Braden Scale — Score 16 (Mild Risk)', catalogued: 'Yes', comment: 'Repositioning every 2h, skin intact', author: 'Nurs. Adam Dixon', date: '20/02/2026', severity: 'Moderate', alert: false, status: 'active' },
                    { id: 33, type: 'Assessment', group: 'Nutrition', riskFactor: 'MUST Score — 0 (Low Risk)', catalogued: 'Yes', comment: 'Adequate oral intake, no weight loss', author: 'Nurs. Sarah Thompson', date: '18/02/2026', severity: 'Low', alert: false, status: 'inactive' }
                ]
            },

            diagnosticTests: [
                { id: 1, requestDate: '27/11/25', request: 'BILIRUBIN, SGPT, HDL, GLUCOSE, FBC', comment: 'Routine metabolic panel', author: 'Dr.Rory Rogers', resultDate: null, hasResult: false, accessWeb: false, type: 'laboratory' },
                { id: 2, requestDate: '16/10/25', request: 'MRI OF THE BRAIN', comment: '', author: 'Dr.Rory Rogers', resultDate: '15/10/2025 14:56', hasResult: true, accessWeb: true, type: 'radiology' },
                { id: 3, requestDate: '16/09/25', request: 'CT ABDOMEN', comment: '', author: 'Dr.Rory Rogers', resultDate: '15/10/2025 10:53', hasResult: true, accessWeb: true, type: 'radiology' },
                { id: 4, requestDate: '02/10/25', request: 'MRI OF THE SPINE', comment: '', author: 'Nurs.Adam Dixon', resultDate: null, hasResult: false, accessWeb: false, type: 'radiology' }
            ],

            medication: {
                mar: [
                    { drug: 'AMOXICILLINA 500mg CAPSULE', dose: '500mg', freq: 'TID', route: 'Oral', startDate: '20-12-26', endDate: '23-12-26', days: '2 days', condition: 'Before meal', category: 'current', highAlert: false, prnReason: null, slots: { '08:00': { status: 'given', value: '500mg', time: '08:12' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'due', value: '-' }, '16:00': { status: 'given', value: '500mg', time: '16:05' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'due', value: '-' } } },
                    { drug: 'INSULINA ASPART', dose: '6 U', freq: 'TID', route: 'SC', startDate: '20-12-26', endDate: '23-12-26', days: '2 days', condition: 'Mobile Scale | AC', category: 'current', highAlert: true, prnReason: null, slots: { '08:00': { status: 'given', value: '6 U', time: '07:55' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'hold', value: 'HOLD', reason: 'Gluc: 85' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'due', value: '-' }, '22:00': { status: 'empty' } } },
                    { drug: 'ENOXAPARINA 40mg JERINGA', dose: '40mg', freq: 'QD', route: 'SC', startDate: '18-12-26', endDate: '28-12-26', days: '10 days', condition: 'Night', category: 'current', highAlert: true, prnReason: null, slots: { '08:00': { status: 'empty' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'due', value: '-' } } },
                    { drug: 'METOPROLOL TARTRATE 50mg TAB', dose: '50mg', freq: 'BID', route: 'Oral', startDate: '15-12-26', endDate: '30-12-26', days: '15 days', condition: null, category: 'current', highAlert: false, prnReason: null, slots: { '08:00': { status: 'given', value: '50mg', time: '08:20' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'due', value: '-' }, '22:00': { status: 'empty' } } },
                    { drug: 'OMEPRAZOL 20mg CAPSULE', dose: '20mg', freq: 'QD', route: 'Oral', startDate: '10-12-26', endDate: '10-01-27', days: '31 days', condition: 'Before breakfast', category: 'current', highAlert: false, prnReason: null, slots: { '08:00': { status: 'given', value: '20mg', time: '07:45' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'empty' } } },
                    { drug: 'PARACETAMOL 1g IV', dose: '1g', freq: 'PRN', route: 'IV', startDate: '20-12-26', endDate: '25-12-26', days: '5 days', condition: 'Max Q6H', category: 'prn', highAlert: false, prnReason: 'Pain > 4 VAS', slots: { '08:00': { status: 'given', value: '1g', time: '08:30' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'given', value: '1g', time: '14:45' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'empty' } } },
                    { drug: 'FUROSEMIDA 20mg AMP', dose: '20mg', freq: 'BID', route: 'IV', startDate: '19-12-26', endDate: '26-12-26', days: '7 days', condition: null, category: 'current', highAlert: false, prnReason: null, slots: { '08:00': { status: 'given', value: '20mg', time: '08:10' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'due', value: '-' }, '22:00': { status: 'empty' } } },
                    { drug: 'CLORURO POTÁSICO 600mg TAB', dose: '600mg', freq: 'TID', route: 'Oral', startDate: '19-12-26', endDate: '26-12-26', days: '7 days', condition: 'With meals', category: 'current', highAlert: true, prnReason: null, slots: { '08:00': { status: 'given', value: '600mg', time: '08:15' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'given', value: '600mg', time: '14:10' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'due', value: '-' } } },
                    { drug: 'MORPHINE SULFATE 5mg AMP', dose: '5mg', freq: 'PRN', route: 'IV', startDate: '20-12-26', endDate: '23-12-26', days: '3 days', condition: 'Max Q4H | Slow push', category: 'prn', highAlert: true, prnReason: 'Pain > 7 VAS', slots: { '08:00': { status: 'empty' }, '10:00': { status: 'given', value: '5mg', time: '10:20' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'empty' } } },
                    { drug: 'ATORVASTATIN 40mg TAB', dose: '40mg', freq: 'QD', route: 'Oral', startDate: '01-12-26', endDate: '01-03-27', days: '90 days', condition: 'Night', category: 'scheduled', highAlert: false, prnReason: null, slots: { '08:00': { status: 'empty' }, '10:00': { status: 'empty' }, '12:00': { status: 'empty' }, '14:00': { status: 'empty' }, '16:00': { status: 'empty' }, '18:00': { status: 'empty' }, '20:00': { status: 'empty' }, '22:00': { status: 'due', value: '-' } } }
                ]
            },

            carePlans: [
                { task: 'Respiratory Monitoring', detail: 'Goal: Breathing adequate | Q2H', icon: 'pi-cloud', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:11', status: 'completed' }, '10:00': { time: '10:05', status: 'completed' }, '12:00': { time: '12:02', status: 'completed' }, '14:00': { time: 'MISSING', status: 'overdue' }, '16:00': { time: '--', status: 'pending' }, '18:00': { time: '--', status: 'pending' }, '20:00': { time: null, status: 'empty' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Subclavian Care', detail: 'Cleaning and dressing | Q24H', icon: 'pi-heart', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '-', status: 'empty' }, '10:00': { time: '10:20', status: 'completed' }, '12:00': { time: '-', status: 'empty' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: null, status: 'empty' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: null, status: 'empty' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Oral Hygiene', detail: 'Teeth brushing + mouthwash | Q8H', icon: 'pi-filter', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:30', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: null, status: 'empty' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: '--', status: 'pending' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: null, status: 'empty' }, '22:00': { time: '--', status: 'pending' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Bed Bath', detail: 'Full bed bath + skin check | Q24H', icon: 'pi-filter', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: null, status: 'empty' }, '10:00': { time: '09:15', status: 'completed' }, '12:00': { time: null, status: 'empty' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: null, status: 'empty' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: null, status: 'empty' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Mobilisation', detail: 'Chair transfer + walking 10m | Q4H', icon: 'pi-directions', category: 'scheduled', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:45', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: '12:30', status: 'completed' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: '--', status: 'pending' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: '--', status: 'pending' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Fall Risk Assessment', detail: 'Morse scale reassessment | Q12H', icon: 'pi-shield', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:00', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: null, status: 'empty' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: null, status: 'empty' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: '--', status: 'pending' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Pain Assessment', detail: 'VAS scale + intervention | Q4H', icon: 'pi-exclamation-circle', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:20', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: '12:15', status: 'completed' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: '--', status: 'pending' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: '--', status: 'pending' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Nutrition Intake', detail: 'Meal intake % + fluid balance | Q8H', icon: 'pi-apple', category: 'scheduled', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: null, status: 'empty' }, '10:00': { time: '09:00', status: 'completed' }, '12:00': { time: null, status: 'empty' }, '14:00': { time: 'MISSING', status: 'overdue' }, '16:00': { time: null, status: 'empty' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: null, status: 'empty' }, '22:00': { time: '--', status: 'pending' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Urine Output', detail: 'Catheter care + output Q4H', icon: 'pi-trash', category: 'current', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:00', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: '12:05', status: 'completed' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: '--', status: 'pending' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: '--', status: 'pending' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } },
                { task: 'Wound Dressing Change', detail: 'Abdominal wound, Betadine | Q12H', icon: 'pi-heart', category: 'prn', slots: { '06:00': { time: null, status: 'empty' }, '08:00': { time: '08:40', status: 'completed' }, '10:00': { time: null, status: 'empty' }, '12:00': { time: null, status: 'empty' }, '14:00': { time: null, status: 'empty' }, '16:00': { time: null, status: 'empty' }, '18:00': { time: null, status: 'empty' }, '20:00': { time: '--', status: 'pending' }, '22:00': { time: null, status: 'empty' }, '00:00': { time: null, status: 'empty' } } }
            ],

            documents: [
                { id: 1, name: 'Admission Note — Cardiology', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'Admission Note', date: '18/03/2026 09:15', status: 'signed', accessWeb: true, category: 'reports', keyDocument: true, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'Patient admitted with acute chest pain and dyspnea on exertion. ECG shows sinus tachycardia with ST depression in leads V4–V6. Initial troponin elevated at 0.42 ng/mL. Patient haemodynamically stable on admission. IV access established, oxygen commenced at 2L/min via nasal cannula. Cardiology registrar reviewed. Plan: serial ECGs, repeat troponin at 6h, commence dual antiplatelet therapy pending cardiology review.' },
                { id: 2, name: 'Initial Assessment — Anamnesis', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'Anamnesis', date: '18/03/2026 10:30', status: 'signed', accessWeb: true, category: 'reports', keyDocument: true, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'Chief complaint: chest pain radiating to left arm, onset 2 hours prior to admission. PMHx: hypertension (10 years), type 2 diabetes mellitus (diagnosed 2015), prior CABG March 2019. Medications on admission: Ramipril 5mg OD, Metformin 1g BD, Aspirin 75mg OD. No known drug allergies. Social: non-smoker, occasional alcohol. Lives with spouse. Retired.' },
                { id: 3, name: 'Physical Examination', author: 'Dr. Ana Martinez', department: 'Cardiology', type: 'Physical Examination', date: '18/03/2026 11:00', status: 'signed', accessWeb: false, category: 'reports', keyDocument: true, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'General: alert and oriented, in moderate distress. BP: 158/96 mmHg, HR: 98 bpm, RR: 20/min, Temp: 36.8°C, SpO2: 94% on 2L O2. CVS: S3 gallop present, no murmurs. Respiratory: mild bilateral basal crackles. Abdomen: soft, non-tender. Extremities: bilateral peripheral oedema grade II. Neurological: grossly intact.' },
                { id: 4, name: 'Barthel Index Assessment', author: 'Nurse Sarah Thompson', department: 'Cardiology', type: 'Barthel Index', date: '19/03/2026 08:00', status: 'signed', accessWeb: false, category: 'various', keyDocument: true, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'Total Barthel Index Score: 65 / 100 — Moderate dependence. Feeding: 10/10. Bathing: 0/5. Grooming: 5/5. Dressing: 5/10. Bowels: 10/10. Bladder: 10/10. Toilet use: 5/10. Bed/chair transfers: 10/15. Mobility on level: 10/15. Stairs: 0/10. Assessment completed by Nurse Sarah Thompson. Physiotherapy referral initiated.' },
                { id: 5, name: 'Discharge Summary — Cardiology', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'Discharge Summary', date: '22/03/2026 14:30', status: 'draft', accessWeb: false, category: 'reports', keyDocument: true, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'DRAFT IN PROGRESS — Patient treated for NSTEMI (Non-ST Elevation Myocardial Infarction) with successful PCI to the right coronary artery (RCA). Post-procedure troponin trending down: 0.42 → 0.18 → 0.06 ng/mL. Echocardiogram: EF 48%, mild hypokinesis of the inferior wall. Patient discharged with dual antiplatelet therapy (Aspirin 75mg + Clopidogrel 75mg for 12 months). Cardiology OPD follow-up in 6 weeks.' },
                { id: 6, name: 'Informed Consent — Surgery', author: 'Dr. Ana Martinez', department: 'General Surgery', type: 'Consent Form', date: '10/01/2026 09:30', status: 'signed', accessWeb: true, category: 'informed-consent', keyDocument: false, encounter: null, admission: null, previewContent: 'Patient consented to laparoscopic cholecystectomy under general anaesthesia. Risks discussed: bleeding, infection, bile duct injury (<0.5%), conversion to open procedure (5%), DVT. Alternative management (conservative / ERCP) discussed. Patient understood, had opportunity to ask questions, and gave written informed consent.' },
                { id: 7, name: 'Consent — Regional Anaesthesia', author: 'Dr. James Wilson', department: 'Anesthesiology', type: 'Consent Form', date: '10/01/2026 08:45', status: 'signed', accessWeb: false, category: 'informed-consent', keyDocument: false, encounter: null, admission: null, previewContent: 'Patient consented to epidural regional anaesthesia for peri-operative pain management. Procedure explained including risks: headache (1%), nerve damage (<0.1%), infection. Patient denies allergy to local anaesthetics. No anticoagulants in last 12h. Patient agrees to procedure and signs consent.' },
                { id: 8, name: 'TTO Report — Cardiology', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'TTO Report', date: '25/09/2025 13:02', status: 'amended', accessWeb: true, category: 'reports', keyDocument: false, encounter: null, admission: 'ADM-2025-043', previewContent: 'To Take Out medications (amended 25/09/2025): Ramipril 5mg OD (increased from 2.5mg), Bisoprolol 5mg OD, Atorvastatin 40mg at night, Aspirin 75mg OD, Clopidogrel 75mg OD. Amended to add Furosemide 20mg OD for 4 weeks. GP to review renal function at 2 weeks. Cardiology outpatient follow-up booked: 05/11/2025.' },
                { id: 9, name: 'Transfer Report — Out of Hospital', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'Transfer Report', date: '16/09/2025 14:13', status: 'draft', accessWeb: false, category: 'reports', keyDocument: false, encounter: null, admission: 'ADM-2025-043', previewContent: 'DRAFT — Transfer to St. Mary Rehabilitation Unit arranged for 18/09/2025. Patient stable, ambulatory with one-person assist. Active medical issues: heart failure (compensated), T2DM, hypertension. Pending results: echocardiogram booked 20/09/2025. Medications transferred as per current MAR. Rehabilitation goals: functional independence, cardiac exercise programme.' },
                { id: 10, name: 'Discharge Report — Emergency Dept', author: 'Dr. Rory Rogers', department: 'Adult Emergency', type: 'Discharge Report', date: '23/09/2024 14:07', status: 'external', accessWeb: true, category: 'various', keyDocument: false, encounter: null, admission: null, previewContent: 'External document received from County General Hospital Emergency Department. Patient presented 22/09/2024 with acute NSTEMI. Stabilised and transferred to this institution for PCI. Original treating physician: Dr. O\'Brien (County General). See attached scanned external record for full details.' },
                { id: 11, name: 'CBC Lab Panel Results', author: 'Lab Technician', department: 'Laboratory', type: 'Lab Report', date: '18/03/2026 10:20', status: 'signed', accessWeb: true, category: 'various', keyDocument: false, encounter: 'ENC-2026-001', admission: 'ADM-2026-001', previewContent: 'WBC: 11.2 × 10³/μL (H), Hgb: 11.8 g/dL (L), Plt: 210 × 10³/μL. Neutrophils 78%, Lymphocytes 14%. CRP: 45.3 mg/L (H). Troponin I: 0.42 ng/mL (H) — repeated at 0.18 at 6h. eGFR: 62 mL/min (mild CKD). HbA1c: 7.4% (Feb 2026). Potassium: 3.9 mmol/L. Sodium: 138 mmol/L.' },
                { id: 12, name: 'Digital History — Cardiology 2025', author: 'Dr. Rory Rogers', department: 'Cardiology', type: 'Clinical History', date: '01/02/2026 11:00', status: 'draft', accessWeb: false, category: 'digital-history', keyDocument: false, encounter: null, admission: null, previewContent: 'DRAFT — Longitudinal cardiac history since 2019. CABG (triple vessel) performed March 2019 at this institution. Annual echocardiography: EF 55% (2020), 52% (2021), 50% (2023), 48% (Feb 2026) — mild progressive decline. Stress test 2024: no reversible ischaemia. Current antianginal regime: Bisoprolol, Ramipril, statin. Diabetes control suboptimal (HbA1c 7.4%).' }
            ],

            protocols: [
                { id: 1, creationDate: '15/01/2026', protocolName: 'Acute Coronary Syndrome Pathway', author: 'Dr. Rory Rogers', department: 'Cardiology', status: 'Open', endDate: '' },
                { id: 2, creationDate: '03/12/2025', protocolName: 'Post-Operative Recovery Protocol', author: 'Dr. Sarah Mitchell', department: 'General Surgery', status: 'Closed', endDate: '28/02/2026' },
                { id: 3, creationDate: '22/11/2025', protocolName: 'Stroke Management Pathway', author: 'Dr. James Chen', department: 'Neurology', status: 'Open', endDate: '' }
            ],

            summary: {
                alertsRisks: [
                    { id: 1, name: 'Fall Risk (High)', date: '23/02/26', doctor: 'Dr. Rogers', status: 'acknowledged' },
                    { id: 2, name: 'Pressure Injury Risk', date: '24/02/26', doctor: 'Nurse Adam', status: 'pending' }
                ],
                activeMedications: [
                    { id: 1, name: 'Enoxaparin 40mg SC', highRisk: true, lastAdmin: '08:15 AM', nextAdmin: '08:00 PM' },
                    { id: 2, name: 'Bisoprolol 2.5mg PO', highRisk: false, lastAdmin: '08:00 AM', nextAdmin: 'Tomorrow' }
                ],
                recentNotes: [
                    { id: 1, title: 'Progress Note', specialty: 'Cardiology', excerpt: 'Patient reports slight improvement in dyspnea. Bibasilar crackles persist...' }
                ],
                activeProblems: [
                    { id: 1, name: 'Heart Failure with Preserved EF', status: 'Active' },
                    { id: 2, name: 'Chronic Kidney Disease Stage 3', status: 'Active' }
                ],
                problemsLastUpdate: 'Last update: 25/02/26 10:00 (Dr. Rogers)',
                vitalsSnapshot: {
                    bp: { value: '115/75', trend: 'down' },
                    hr: { value: '92', trend: 'up' },
                    temp: { value: '37.1 °C', trend: null },
                    spo2: { value: '94%', detail: '(NC 2L)', trend: null },
                    balance: { value: '+550 mL', trend: null },
                    urine: { value: '1200 mL', trend: null }
                },
                pendingResults: [
                    { id: 1, name: 'Potassium: 5.8 (H)', type: 'abnormal' },
                    { id: 2, name: 'Troponin I (Serial)', type: 'pending' }
                ]
            },

            nurseNotes: {
                handoffItems: [
                    { id: 'sbar', label: 'SBAR Summary', status: 'done' },
                    { id: 'events', label: 'Shift Events', status: 'pending' }
                ],
                shiftChecklist: [
                    { id: 'ivLines', label: 'IV Lines', status: 'done' },
                    { id: 'catheters', label: 'Catheters', status: 'pending' },
                    { id: 'woundCare', label: 'Wound Care Tasks', status: 'pending' },
                    { id: 'turnReposition', label: 'Turn & Reposition', status: 'done' }
                ],
                medicationsDue: [
                    { id: 1, time: '8:00 AM', name: 'Med A', highRisk: true },
                    { id: 2, time: '9:00 AM', name: 'Med B', highRisk: false },
                    { id: 3, time: '10:00 AM', name: 'Med C', highRisk: false }
                ],
                quickAssessments: {
                    gcs: 0,
                    rass: 0,
                    painScore: 0
                }
            },

            previousVisits: [
                { episodeDate: '30/01/24', episodeType: 'CARD', alerts: [ { name: 'Fall Risk (18/02/2025)', doctor: 'Dr. Rory Rogers' }, { name: 'Latex Allergy (23/09/2024)', doctor: 'Dr. Rory Rogers' } ], diagnoses: [ { code: 'A029', name: 'Salmonella infection', status: 'Active' }, { code: 'D709', name: 'Neutropenia', status: 'Active' }, { code: '', name: 'Complete miscarriage', status: 'Resolved' } ], medications: [ { name: 'Enoxaparin 40mg', highRisk: true, lastDose: '14:01' }, { name: 'Bisoprolol 2.5mg', highRisk: false, lastDose: '08:15' } ], vitalsSnapshot: { bp: '110/70', hr: '92', spo2: '94%', temp: '37.2', urine: '800ml', balance: '-250ml' }, pendingTests: [ { name: 'Blood Culture', status: 'Pending' }, { name: 'CRP 120 mg/L', status: 'Abnormal' } ] },
                { episodeDate: '17/07/24', episodeType: 'INPATIENTS CARD' },
                { episodeDate: '27/03/25', episodeType: 'IMED' },
                { episodeDate: '02/04/25', episodeType: 'IMED' },
                { episodeDate: '08/09/25', episodeType: 'CARD' }
            ],

            labOrdersContext: {
                activeAnticoagulants: [ { name: 'Warfarin', dose: '5 mg', frequency: 'Daily' } ],
                lastINR: 2.8,
                bleedingRisk: 'Moderate'
            },

            imagingOrdersContext: {
                eGFR: 42,
                creatinine: 1.4,
                contrastAllergy: true
            }
        }
    },

    edPatients: [
        {
            id: 101,
            name: "ROBERT CHEN",
            dob: "15/03/1955",
            age: 70,
            gender: "Male",
            location: "Resus Bay 1",
            department: "Emergency",
            attendingPhysician: "Dr. Sofia Chen",
            triageAcuity: 1,
            chiefComplaint: "Cardiac arrest — ROSC achieved in field",
            arrivalTime: "06:12",
            LOSMinutes: 248,
            status: "With Provider",
            alerts: ["Aspirin Allergy", "DNR", "Fall Risk", "High-Risk Meds", "Pacemaker"],
            labsPending: true,
            imagingPending: true,
            medsDue: true
        },
        {
            id: 102,
            name: "MARIA GONZALEZ",
            dob: "22/08/1978",
            age: 47,
            gender: "Female",
            location: "Bed 3",
            department: "Emergency",
            attendingPhysician: "Dr. Rory Rogers",
            triageAcuity: 2,
            chiefComplaint: "Chest pain with ST elevation on ECG",
            arrivalTime: "07:45",
            LOSMinutes: 155,
            status: "Imaging",
            alerts: ["Iodine Allergy", "VTE Risk"],
            labsPending: true,
            imagingPending: true,
            medsDue: false
        },
        {
            id: 103,
            name: "AHMED HASSAN",
            dob: "10/01/1990",
            age: 36,
            gender: "Male",
            location: "Bed 7",
            department: "Emergency",
            attendingPhysician: "Dr. Elena Vasquez",
            triageAcuity: 2,
            chiefComplaint: "Severe dyspnea with oxygen sat 82%",
            arrivalTime: "08:30",
            LOSMinutes: 110,
            status: "Lab",
            alerts: ["Penicillin Allergy", "Seizure Risk"],
            labsPending: true,
            imagingPending: false,
            medsDue: true
        },
        {
            id: 104,
            name: "SARAH WILLIAMS",
            dob: "05/06/2000",
            age: 25,
            gender: "Female",
            location: "Bed 12",
            department: "Emergency",
            attendingPhysician: "Dr. Marcus Webb",
            triageAcuity: 3,
            chiefComplaint: "Abdominal pain RLQ — suspect appendicitis",
            arrivalTime: "09:15",
            LOSMinutes: 65,
            status: "With Provider",
            alerts: ["Latex Allergy"],
            labsPending: true,
            imagingPending: true,
            medsDue: false
        },
        {
            id: 105,
            name: "JEAN-PIERRE DUPONT",
            dob: "18/11/1962",
            age: 63,
            gender: "Male",
            location: "Bed 5",
            department: "Emergency",
            attendingPhysician: "Dr. Sofia Chen",
            triageAcuity: 3,
            chiefComplaint: "Laceration left forearm — 8 cm, deep",
            arrivalTime: "09:50",
            LOSMinutes: 30,
            status: "In Room",
            alerts: [],
            labsPending: false,
            imagingPending: false,
            medsDue: false
        },
        {
            id: 106,
            name: "YUKI TANAKA",
            dob: "27/04/1985",
            age: 40,
            gender: "Female",
            location: "Waiting Room",
            department: "Emergency",
            attendingPhysician: "Dr. Amara Okonkwo",
            triageAcuity: 3,
            chiefComplaint: "Migraine with aura — no improvement with OTC meds",
            arrivalTime: "10:05",
            LOSMinutes: 15,
            status: "Waiting",
            alerts: ["Morphine Allergy", "Pressure Ulcer Risk"],
            labsPending: false,
            imagingPending: false,
            medsDue: false
        },
        {
            id: 107,
            name: "DAVID ERIKSSON",
            dob: "03/09/1970",
            age: 55,
            gender: "Male",
            location: "Bed 9",
            department: "Emergency",
            attendingPhysician: "Dr. Henrik Larsson",
            triageAcuity: 4,
            chiefComplaint: "Ankle sprain — twisted while jogging",
            arrivalTime: "08:00",
            LOSMinutes: 140,
            status: "Dispo",
            alerts: [],
            labsPending: false,
            imagingPending: false,
            medsDue: false
        },
        {
            id: 108,
            name: "PRIYA PATEL",
            dob: "12/07/1995",
            age: 30,
            gender: "Female",
            location: "Waiting Room",
            department: "Emergency",
            attendingPhysician: "Dr. Amara Okonkwo",
            triageAcuity: 4,
            chiefComplaint: "Sore throat and low-grade fever x 3 days",
            arrivalTime: "10:10",
            LOSMinutes: 10,
            status: "In Triage",
            alerts: [],
            labsPending: false,
            imagingPending: false,
            medsDue: false
        },
        {
            id: 109,
            name: "ELENA ROMANOVA",
            dob: "21/02/1988",
            age: 38,
            gender: "Female",
            location: "Waiting Room",
            department: "Emergency",
            attendingPhysician: "Dr. Rory Rogers",
            triageAcuity: 5,
            chiefComplaint: "Prescription refill — ran out of hypertension meds",
            arrivalTime: "10:15",
            LOSMinutes: 5,
            status: "Waiting",
            alerts: [],
            labsPending: false,
            imagingPending: false,
            medsDue: false
        },
        {
            id: 110,
            name: "MICHAEL OKONKWO",
            dob: "09/12/1950",
            age: 75,
            gender: "Male",
            location: "Bed 2",
            department: "Emergency",
            attendingPhysician: "Dr. Elena Vasquez",
            triageAcuity: 5,
            chiefComplaint: "Minor dog bite on hand — no active bleeding",
            arrivalTime: "09:30",
            LOSMinutes: 50,
            status: "Dispo",
            alerts: ["Fall Risk"],
            labsPending: false,
            imagingPending: false,
            medsDue: true
        }
    ],

    catalogs: {
        labCatalog: [
            { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', specimenType: 'Blood', defaultVolume: '4 mL', fastingRequired: false, isCoagulation: false },
            { id: 2, name: 'Hemoglobin A1c', category: 'Hematology', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: false },
            { id: 3, name: 'Reticulocyte Count', category: 'Hematology', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: false },
            { id: 4, name: 'Basic Metabolic Panel (BMP)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
            { id: 5, name: 'Comprehensive Metabolic Panel (CMP)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
            { id: 6, name: 'Lipid Panel', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
            { id: 7, name: 'Blood Culture (Aerobic/Anaerobic)', category: 'Microbiology', specimenType: 'Blood', defaultVolume: '10 mL', fastingRequired: false, isCoagulation: false },
            { id: 8, name: 'Urine Culture & Sensitivity', category: 'Microbiology', specimenType: 'Urine', defaultVolume: '10 mL', fastingRequired: false, isCoagulation: false },
            { id: 9, name: 'Wound Culture & Gram Stain', category: 'Microbiology', specimenType: 'Swab', defaultVolume: 'N/A', fastingRequired: false, isCoagulation: false },
            { id: 10, name: 'INR / Prothrombin Time (PT)', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
            { id: 11, name: 'Partial Thromboplastin Time (PTT)', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
            { id: 12, name: 'D-Dimer', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
            { id: 13, name: 'Urinalysis (UA)', category: 'Urinalysis', specimenType: 'Urine', defaultVolume: '30 mL', fastingRequired: false, isCoagulation: false },
            { id: 14, name: 'Urine Microalbumin/Creatinine Ratio', category: 'Urinalysis', specimenType: 'Urine', defaultVolume: '15 mL', fastingRequired: false, isCoagulation: false },
            { id: 15, name: 'Thyroid Stimulating Hormone (TSH)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '4 mL', fastingRequired: false, isCoagulation: false }
        ],
        radiologyCatalog: [
            { id: 1, name: 'CT Abdomen/Pelvis w IV Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
            { id: 2, name: 'CT Chest w IV Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
            { id: 3, name: 'CT Head without Contrast', modality: 'CT', requiresContrast: false, contrastProtocol: 'None' },
            { id: 4, name: 'CT Angiography Chest (PE Protocol)', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
            { id: 5, name: 'MRI Brain w/wo Contrast', modality: 'MRI', requiresContrast: true, contrastProtocol: 'IV Only' },
            { id: 6, name: 'MRI Lumbar Spine', modality: 'MRI', requiresContrast: false, contrastProtocol: 'None' },
            { id: 7, name: 'MRI Knee without Contrast', modality: 'MRI', requiresContrast: false, contrastProtocol: 'None' },
            { id: 8, name: 'XR Chest 1 View Portable', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
            { id: 9, name: 'XR Knee 2 Views', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
            { id: 10, name: 'XR Abdomen AP', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
            { id: 11, name: 'US Abdomen Complete', modality: 'US', requiresContrast: false, contrastProtocol: 'None' },
            { id: 12, name: 'US Renal/Bladder', modality: 'US', requiresContrast: false, contrastProtocol: 'None' },
            { id: 13, name: 'CT Abdomen/Pelvis w IV+Oral Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV+Oral' }
        ]
    }
};
