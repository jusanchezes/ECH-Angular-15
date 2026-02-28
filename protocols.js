/**
 * protocols.js
 * ---------------------------------------------------------------------------
 * Protocols data and rendering logic for the Protocols module.
 *
 * Angular Migration Notes:
 * - This file will become a ProtocolsComponent with a ProtocolsService.
 * - PROTOCOLS_DATA will be replaced by an Observable from the Java REST API.
 * - renderProtocolsTable() will be replaced by *ngFor with p-table templates.
 * ---------------------------------------------------------------------------
 */

/** @type {Array<Object>} Mock protocols data — maps to ProtocolDTO */
const PROTOCOLS_DATA = [
    {
        id: 1,
        creationDate: '15/01/2026',
        protocolName: 'Acute Coronary Syndrome Pathway',
        author: 'Dr. Rory Rogers',
        department: 'Cardiology',
        status: 'Open',
        endDate: ''
    },
    {
        id: 2,
        creationDate: '03/12/2025',
        protocolName: 'Post-Operative Recovery Protocol',
        author: 'Dr. Sarah Mitchell',
        department: 'General Surgery',
        status: 'Closed',
        endDate: '28/02/2026'
    },
    {
        id: 3,
        creationDate: '22/11/2025',
        protocolName: 'Stroke Management Pathway',
        author: 'Dr. James Chen',
        department: 'Neurology',
        status: 'Open',
        endDate: ''
    }
];

let selectedProtocolId = null;
let searchTerm = '';

function filterProtocols() {
    if (!searchTerm) return PROTOCOLS_DATA;
    const term = searchTerm.toLowerCase();
    return PROTOCOLS_DATA.filter(p =>
        p.protocolName.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.department.toLowerCase().includes(term)
    );
}

function renderProtocolsTable() {
    const tbody = document.getElementById('protocolsTableBody');
    if (!tbody) return;

    const filtered = filterProtocols();

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:40px;color:var(--ech-text-secondary)">
                    <i class="pi pi-inbox" style="font-size:2rem;display:block;margin-bottom:8px"></i>
                    <span data-i18n="PROTO.EMPTY_STATE">No protocols found</span>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(protocol => {
        const isOpen = protocol.status === 'Open';
        const isClosed = protocol.status === 'Closed';
        const isSelected = protocol.id === selectedProtocolId;
        const rowClass = isSelected ? 'co-row proto-row-selected' : 'co-row';
        const statusClass = isOpen ? 'proto-status-open' : (isClosed ? 'proto-status-closed' : '');

        return `
            <tr class="${rowClass}" onclick="selectProtocolRow(${protocol.id})">
                <td class="col-proto-action" data-field="action">
                    <button class="co-icon-btn proto-edit-icon" title="Edit Protocol" onclick="event.stopPropagation();handleProtocolAction('edit',${protocol.id})">
                        <i class="pi pi-pencil"></i>
                    </button>
                </td>
                <td class="col-proto-date" data-field="creationDate">${protocol.creationDate}</td>
                <td class="col-proto-name" data-field="protocolName">
                    <span class="proto-name-link">${protocol.protocolName}</span>
                </td>
                <td class="col-proto-author" data-field="author">${protocol.author}</td>
                <td class="col-proto-dept" data-field="department">${protocol.department}</td>
                <td class="col-proto-status ${statusClass}" data-field="status">${protocol.status}</td>
                <td class="col-proto-enddate" data-field="endDate">${protocol.endDate}</td>
            </tr>`;
    }).join('');
}

function selectProtocolRow(id) {
    selectedProtocolId = (selectedProtocolId === id) ? null : id;
    renderProtocolsTable();
}

function handleProtocolAction(action, protocolId) {
    const protocol = PROTOCOLS_DATA.find(p => p.id === protocolId);
    if (!protocol) return;
    console.log(`[Protocols] Action: ${action}, Protocol: ${protocol.protocolName} (ID: ${protocolId})`);
}

function handleAddProtocol() {
    console.log('[Protocols] Add Protocol clicked');
}

function handleProtocolSearch(input) {
    searchTerm = input.value.trim();
    renderProtocolsTable();
}

document.addEventListener('DOMContentLoaded', function () {
    renderProtocolsTable();
});
