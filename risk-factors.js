var RISK_FACTORS_DATA = ClinicalDataService.getRiskFactors();

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
        const rowClass = isInactive ? 'ehr-row rf-row rf-row-inactive' : 'ehr-row rf-row';
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
