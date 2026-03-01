/**
 * diagnostic-tests.js
 * ---------------------------------------------------------------------------
 * Clinical Orders data and rendering logic for the Diagnostic Tests module.
 * 
 * Angular Migration Notes:
 * - This file will become a DiagnosticTestsComponent with an OrdersService.
 * - ORDERS_DATA will be replaced by an Observable from the Java REST API.
 * - renderOrdersTable() will be replaced by *ngFor with p-table templates.
 * ---------------------------------------------------------------------------
 */

var ORDERS_DATA = ClinicalDataService.getDiagnosticTests();

let activeTestTypeFilter = 'all';

const TEST_TYPE_LABELS = {
    laboratory: 'Laboratory',
    radiology: 'Radiology',
    pathology: 'Pathology'
};

function setTestTypeFilter(btn) {
    const group = btn.closest('.select-button-group');
    group.querySelectorAll('.sb-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTestTypeFilter = btn.dataset.value;
    renderOrdersTable();
}

function getFilteredOrders() {
    if (activeTestTypeFilter === 'all') return ORDERS_DATA;
    return ORDERS_DATA.filter(o => o.type === activeTestTypeFilter);
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const filtered = getFilteredOrders();

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;padding:40px;color:var(--ech-text-secondary)">
                    <i class="pi pi-inbox" style="font-size:2rem;display:block;margin-bottom:8px"></i>
                    <span data-i18n="CO.EMPTY_STATE">No clinical orders found</span>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(order => {
        const typeLabel = TEST_TYPE_LABELS[order.type] || order.type;

        const resultDateHtml = order.resultDate
            ? `<span class="co-result-date-text">${order.resultDate}</span>`
            : '';

        const seeResultHtml = order.hasResult
            ? `<button class="co-icon-btn co-icon-btn-orange" title="See Result" onclick="handleOrderAction('seeResult',${order.id})"><i class="pi pi-file"></i></button>`
            : '';

        const accessWebHtml = order.accessWeb
            ? `<button class="co-icon-btn co-icon-btn-green" title="Access Web" onclick="handleOrderAction('accessWeb',${order.id})"><i class="pi pi-globe"></i></button>`
            : '';

        return `
            <tr class="ehr-row">
                <td class="col-co-date" data-field="requestDate">
                    <span class="co-date-tag">${order.requestDate}</span>
                </td>
                <td class="col-co-type" data-field="testType">
                    <span class="co-type-label co-type-${order.type}">${typeLabel}</span>
                </td>
                <td class="col-co-request" data-field="requestName">${order.request}</td>
                <td class="col-co-comment" data-field="comment">${order.comment}</td>
                <td class="col-co-see-request" data-field="seeRequest">
                    <button class="co-icon-btn co-icon-btn-blue" title="See Request" onclick="handleOrderAction('seeRequest',${order.id})">
                        <i class="pi pi-file"></i>
                    </button>
                </td>
                <td class="col-co-author" data-field="authorName">${order.author}</td>
                <td class="col-co-result-date" data-field="resultDate">${resultDateHtml}</td>
                <td class="col-co-see-result" data-field="seeResult">${seeResultHtml}</td>
                <td class="col-co-access-web" data-field="accessWeb">${accessWebHtml}</td>
                <td class="col-co-action" data-field="actionLink">
                    <button class="co-icon-btn co-icon-btn-link" title="Action" onclick="handleOrderAction('details',${order.id})">
                        <i class="pi pi-link"></i>
                    </button>
                </td>
            </tr>`;
    }).join('');
}

/**
 * Handles row-level actions on clinical orders.
 * Angular equivalent: EventEmitter bound to (click) in the template.
 * @param {string} action - The action identifier.
 * @param {number} orderId - The order ID from ClinicalOrderDTO.id.
 */
function handleOrderAction(action, orderId) {
    const order = ORDERS_DATA.find(o => o.id === orderId);
    if (!order) return;
    console.log(`Clinical Order action: ${action} on "${order.request}" (ID: ${orderId})`);
}

/**
 * Handles action bar button clicks for creating new exams.
 * Angular equivalent: Router navigation or Dialog service.
 * @param {string} examType - 'radiology' | 'laboratory' | 'pathology'
 */
function handleCreateExam(examType) {
    if (examType === 'radiology') {
        window.location.href = 'imaging-orders.html';
        return;
    }
    if (examType === 'laboratory') {
        window.location.href = 'laboratory-orders.html';
        return;
    }
    console.log(`Create new exam: ${examType}`);
}

document.addEventListener('DOMContentLoaded', function () {
    renderOrdersTable();
});
