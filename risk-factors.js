const RISK_FACTORS_DATA = {
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
};

const CATEGORY_KEYS = ['allergies', 'conditions', 'procedures', 'family-history', 'social-history', 'infection-control', 'immunizations', 'devices', 'risk-assessments'];

let activeTab = 'summary';
let riskSearchQuery = '';

function getAllRecords() {
    const all = [];
    CATEGORY_KEYS.forEach(key => {
        (RISK_FACTORS_DATA[key] || []).forEach(record => {
            all.push({ ...record, category: key });
        });
    });
    return all;
}

function getSummaryRecords() {
    return getAllRecords().filter(r => r.status === 'active' && (r.severity === 'Severe' || r.alert));
}

function filterRecords(records) {
    if (!riskSearchQuery.trim()) return records;
    const q = riskSearchQuery.toLowerCase();
    return records.filter(r =>
        r.type.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q) ||
        r.riskFactor.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.date.toLowerCase().includes(q) ||
        r.severity.toLowerCase().includes(q)
    );
}

function getSeverityClass(severity) {
    switch (severity) {
        case 'Severe': return 'rf-severity-severe';
        case 'Moderate': return 'rf-severity-moderate';
        case 'Low': return 'rf-severity-low';
        default: return '';
    }
}

function renderRowsHTML(records, isInactive) {
    if (records.length === 0) {
        return `<tr><td colspan="10" class="rf-empty-state">
            <i class="pi pi-inbox"></i>
            <span data-i18n="RISK_FACTORS.NO_RECORDS">${isInactive ? 'No inactive records' : 'No records found'}</span>
        </td></tr>`;
    }
    return records.map(r => {
        const rowClass = isInactive ? 'rf-row rf-row-inactive' : 'rf-row';
        const severityClass = getSeverityClass(r.severity);
        const alertIcon = r.alert ? '<i class="pi pi-bell rf-alert-icon rf-alert-active"></i>' : '<i class="pi pi-bell rf-alert-icon rf-alert-inactive"></i>';
        const toggleLabel = isInactive ? 'Activate' : 'Deactivate';
        const toggleIcon = isInactive ? 'pi-check-circle' : 'pi-ban';
        return `<tr class="${rowClass}">
            <td>${r.type}</td>
            <td>${r.group}</td>
            <td>${r.riskFactor}</td>
            <td>${r.catalogued}</td>
            <td>${r.comment}</td>
            <td>${r.author}</td>
            <td>${r.date}</td>
            <td><span class="rf-severity-tag ${severityClass}">${r.severity}</span></td>
            <td>${alertIcon}</td>
            <td>
                <div class="rf-actions-group">
                    <button class="rf-action-btn" title="Edit" onclick="handleEditRecord(${r.id})"><i class="pi pi-pencil"></i></button>
                    <button class="rf-action-btn rf-action-deactivate" title="${toggleLabel}" onclick="handleToggleStatus(${r.id})"><i class="pi ${toggleIcon}"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function populateCategoryPanel(panelId) {
    const records = RISK_FACTORS_DATA[panelId] || [];
    const filtered = filterRecords(records);
    const activeRecords = filtered.filter(r => r.status === 'active');
    const inactiveRecords = filtered.filter(r => r.status === 'inactive');

    const activeBody = document.getElementById(panelId + '-active-body');
    const inactiveBody = document.getElementById(panelId + '-inactive-body');

    if (activeBody) activeBody.innerHTML = renderRowsHTML(activeRecords, false);
    if (inactiveBody) inactiveBody.innerHTML = renderRowsHTML(inactiveRecords, true);
}

function populateSummaryPanel() {
    const summaryRecords = filterRecords(getSummaryRecords());
    const activeRecords = summaryRecords.filter(r => r.status === 'active');
    const inactiveAll = filterRecords(getAllRecords().filter(r => r.status === 'inactive' && (r.severity === 'Severe' || r.alert)));

    const activeBody = document.getElementById('summary-active-body');
    const inactiveBody = document.getElementById('summary-inactive-body');

    if (activeBody) activeBody.innerHTML = renderRowsHTML(activeRecords, false);
    if (inactiveBody) inactiveBody.innerHTML = renderRowsHTML(inactiveAll, true);
}

function renderAllPanels() {
    populateSummaryPanel();
    CATEGORY_KEYS.forEach(key => populateCategoryPanel(key));
}

function switchTab(tabId) {
    activeTab = tabId;

    document.querySelectorAll('#rfTabs .sb-option').forEach(t => t.classList.remove('active'));
    const activeTabBtn = document.querySelector('#rfTabs .sb-option[data-tab="' + tabId + '"]');
    if (activeTabBtn) activeTabBtn.classList.add('active');

    document.querySelectorAll('.rf-tab-panel').forEach(p => p.classList.remove('rf-tab-panel-active'));
    const activePanel = document.getElementById('panel-' + tabId);
    if (activePanel) activePanel.classList.add('rf-tab-panel-active');
}

function searchRiskFactors(value) {
    riskSearchQuery = value;
    renderAllPanels();
}

function handleAddRiskFactor() {
    console.log('Add Risk Factor / Alert triggered');
}

function handleEditRecord(recordId) {
    const all = getAllRecords();
    const record = all.find(r => r.id === recordId);
    if (record) {
        console.log('Edit record:', record.riskFactor, '(ID:', recordId, ')');
    }
}

function handleToggleStatus(recordId) {
    let found = false;
    CATEGORY_KEYS.forEach(key => {
        (RISK_FACTORS_DATA[key] || []).forEach(r => {
            if (r.id === recordId) {
                r.status = r.status === 'active' ? 'inactive' : 'active';
                found = true;
                console.log('Toggled status:', r.riskFactor, '→', r.status);
            }
        });
    });
    if (found) renderAllPanels();
}

document.addEventListener('DOMContentLoaded', function() {
    var addBtn = document.getElementById('btnAddRiskFactor');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddRiskFactor);
    }
    renderAllPanels();
});
