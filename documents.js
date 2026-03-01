const DOCUMENTS_DATA = [
    {
        id: 1,
        name: 'TTO_INP_CARD_Dr.Rory Rogers',
        author: 'Dr.Rory Rogers',
        department: 'Cardiology',
        type: 'TTO Report',
        date: '25/09/2025 13:02',
        status: 'signed',
        accessWeb: true,
        category: 'reports'
    },
    {
        id: 2,
        name: 'Doctor Transfer Out of Hospital',
        author: 'Dr.Rory Rogers',
        department: 'Cardiology',
        type: 'Medical Report',
        date: '16/09/2025 14:13',
        status: 'draft',
        accessWeb: false,
        category: 'reports'
    },
    {
        id: 3,
        name: 'DISCHARGE_EMR_EMER_Dr.Rory Rogers',
        author: 'Dr.Rory Rogers',
        department: 'Adult Emergency',
        type: 'Discharge Report',
        date: '23/09/2024 14:07',
        status: 'signed',
        accessWeb: true,
        category: 'reports'
    },
    {
        id: 4,
        name: 'Informed Consent Surgery_Dr.Martinez',
        author: 'Dr.Ana Martinez',
        department: 'General Surgery',
        type: 'Consent Form',
        date: '10/01/2026 09:30',
        status: 'signed',
        accessWeb: true,
        category: 'informed-consent'
    },
    {
        id: 5,
        name: 'Consent_Anesthesia_Regional',
        author: 'Dr.James Wilson',
        department: 'Anesthesiology',
        type: 'Consent Form',
        date: '10/01/2026 08:45',
        status: 'signed',
        accessWeb: false,
        category: 'informed-consent'
    },
    {
        id: 6,
        name: 'Lab_Results_CBC_Panel',
        author: 'Lab Technician',
        department: 'Laboratory',
        type: 'Lab Report',
        date: '18/02/2026 10:20',
        status: 'signed',
        accessWeb: true,
        category: 'various'
    },
    {
        id: 7,
        name: 'Digital_History_Cardiology_2025',
        author: 'Dr.Rory Rogers',
        department: 'Cardiology',
        type: 'Clinical History',
        date: '01/02/2026 11:00',
        status: 'draft',
        accessWeb: false,
        category: 'digital-history'
    },
    {
        id: 8,
        name: 'Nursing_Assessment_Initial',
        author: 'Nurse Sarah Thompson',
        department: 'Adult Emergency',
        type: 'Nursing Report',
        date: '15/02/2026 16:45',
        status: 'signed',
        accessWeb: true,
        category: 'various'
    }
];

let currentFilter = 'all';
let currentSearch = '';

function getFilteredDocuments() {
    let docs = DOCUMENTS_DATA;

    if (currentFilter === 'signed') {
        docs = docs.filter(d => d.status === 'signed');
    } else if (currentFilter !== 'all') {
        docs = docs.filter(d => d.category === currentFilter);
    }

    if (currentSearch.trim()) {
        const q = currentSearch.toLowerCase();
        docs = docs.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.author.toLowerCase().includes(q) ||
            d.department.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        );
    }

    return docs;
}

function renderDocumentTable() {
    const tbody = document.getElementById('docTableBody');
    const badge = document.getElementById('docCountBadge');
    if (!tbody) return;

    const docs = getFilteredDocuments();
    if (badge) badge.textContent = docs.length;

    if (docs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:40px;color:var(--ech-text-secondary)">
                    <i class="pi pi-inbox" style="font-size:2rem;display:block;margin-bottom:8px"></i>
                    No documents found
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = docs.map(doc => {
        const statusClass = doc.status === 'signed' ? 'doc-status-signed' : 'doc-status-draft';
        const statusLabel = doc.status === 'signed' ? 'Signed' : 'Draft';
        const accessIcon = doc.accessWeb
            ? '<span class="doc-access-icon doc-access-active"><i class="pi pi-globe"></i></span>'
            : '<span class="doc-access-icon doc-access-inactive"><i class="pi pi-globe"></i></span>';
        const deleteBtn = doc.status === 'draft'
            ? `<button class="doc-action-btn doc-action-delete" title="Delete" onclick="handleDocAction('delete',${doc.id})"><i class="pi pi-trash"></i></button>`
            : '';

        return `
            <tr class="ehr-row">
                <td class="col-doc-name"><a href="#" class="doc-link" onclick="handleDocAction('open',${doc.id});return false">${doc.name}</a></td>
                <td class="col-doc-author">${doc.author}</td>
                <td class="col-doc-dept">${doc.department}</td>
                <td class="col-doc-type">${doc.type}</td>
                <td class="col-doc-date">${doc.date}</td>
                <td class="col-doc-status"><span class="doc-status-tag ${statusClass}">${statusLabel}</span></td>
                <td class="col-doc-access">${accessIcon}</td>
                <td class="col-doc-actions">
                    <div class="doc-actions-group">
                        <button class="doc-action-btn doc-action-download" title="Download PDF" onclick="handleDocAction('download',${doc.id})"><i class="pi pi-file-pdf"></i></button>
                        ${deleteBtn}
                        <button class="doc-action-btn doc-action-share" title="Share" onclick="handleDocAction('share',${doc.id})"><i class="pi pi-share-alt"></i></button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

function filterDocuments(filter) {
    currentFilter = filter;
    const tabs = document.querySelectorAll('#docTabs .sb-option');
    tabs.forEach(t => t.classList.remove('active'));
    const active = document.querySelector(`#docTabs .sb-option[data-filter="${filter}"]`);
    if (active) active.classList.add('active');
    renderDocumentTable();
}

function searchDocuments(value) {
    currentSearch = value;
    renderDocumentTable();
}

function handleDocAction(action, docId) {
    const doc = DOCUMENTS_DATA.find(d => d.id === docId);
    if (!doc) return;
    console.log(`Document action: ${action} on "${doc.name}" (ID: ${docId})`);
}

document.addEventListener('DOMContentLoaded', function() {
    renderDocumentTable();
});
