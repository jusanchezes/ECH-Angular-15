var DOCUMENTS_DATA = ClinicalDataService.getDocuments();

var _docCtrl = DocPreview.createController({
    getData: function () { return DOCUMENTS_DATA; },
    previewPaneId: 'doc-preview-pane',
    previewBodyId: 'doc-preview-body',
    containerId: 'doc-workspace',
    previewOpenClass: 'preview-open',
    hideContainerOnModal: true,
    getPreviewFooterHtml: function (doc) {
        return '<div class="doc-preview-footer">' +
            '<button class="doc-preview-footer-btn" onclick="handleDocAction(\'download\',' + doc.id + ')"><i class="pi pi-file-pdf"></i> Download PDF</button>' +
            '<button class="doc-preview-footer-btn" onclick="handleDocAction(\'print\',' + doc.id + ')"><i class="pi pi-print"></i> Print</button>' +
            '</div>';
    },
    modalId: 'doc-reading-modal',
    modalContentId: 'doc-reading-content'
});

let currentFilter = 'all';
let currentQuickFilter = 'all';
let currentSearch = '';

function getFilteredDocuments() {
    let docs = DOCUMENTS_DATA;

    if (currentFilter === 'signed') {
        docs = docs.filter(d => d.status === 'signed' || d.status === 'amended');
    } else if (currentFilter !== 'all') {
        docs = docs.filter(d => d.category === currentFilter);
    }

    if (currentQuickFilter === 'current-encounter') {
        docs = docs.filter(d => d.encounter === 'ENC-2026-001');
    } else if (currentQuickFilter === 'current-admission') {
        docs = docs.filter(d => d.admission === 'ADM-2026-001');
    } else if (currentQuickFilter === 'all-history') {
        docs = docs.filter(d => d.encounter !== 'ENC-2026-001' && d.admission !== 'ADM-2026-001');
    } else if (currentQuickFilter === 'latest-reports') {
        docs = docs.slice().sort((a, b) => DocPreview.parseDateStr(b.date) - DocPreview.parseDateStr(a.date)).slice(0, 5);
    } else if (currentQuickFilter === 'draft-only') {
        docs = docs.filter(d => d.status === 'draft');
    } else if (currentQuickFilter === 'signed-only') {
        docs = docs.filter(d => d.status === 'signed');
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

    const currentId = _docCtrl.getCurrentDocId();
    if (currentId !== null && !docs.find(d => d.id === currentId)) {
        _docCtrl.closePreview();
    }

    if (docs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;padding:40px;color:var(--ech-text-secondary)">
                    <i class="pi pi-inbox" style="font-size:2rem;display:block;margin-bottom:8px"></i>
                    No documents found
                </td>
            </tr>`;
        return;
    }

    const activeId = _docCtrl.getCurrentDocId();

    tbody.innerHTML = docs.map(doc => {
        const keyStar = doc.keyDocument
            ? `<span class="doc-key-star" title="Key clinical document"><i class="pi pi-star-fill"></i></span>`
            : '';
        const statusTag = DocPreview.getStatusTag(doc.status);
        const accessIcon = doc.accessWeb
            ? '<span class="doc-access-icon doc-access-active"><i class="pi pi-globe"></i></span>'
            : '<span class="doc-access-icon doc-access-inactive"><i class="pi pi-globe"></i></span>';
        const deleteBtn = doc.status === 'draft'
            ? `<button class="doc-action-btn doc-action-delete" title="Delete" onclick="event.stopPropagation();handleDocAction('delete',${doc.id})"><i class="pi pi-trash"></i></button>`
            : '';
        const encounterLabel = doc.encounter || doc.admission
            ? `<span class="doc-encounter-badge">${doc.encounter || doc.admission}</span>`
            : '<span style="color:var(--ech-text-muted)">—</span>';
        const isActive = doc.id === activeId ? ' doc-row-active' : '';

        return `
            <tr class="ehr-row doc-table-row${isActive}" onclick="openDocPreview(${doc.id})">
                <td class="col-doc-key">${keyStar}</td>
                <td class="col-doc-name"><a href="#" class="doc-link" onclick="openDocPreview(${doc.id});return false">${doc.name}</a></td>
                <td class="col-doc-author">${doc.author}</td>
                <td class="col-doc-dept">${doc.department}</td>
                <td class="col-doc-type">${doc.type}</td>
                <td class="col-doc-date">${doc.date}</td>
                <td class="col-doc-status">${statusTag}</td>
                <td class="col-doc-encounter">${encounterLabel}</td>
                <td class="col-doc-access">${accessIcon}</td>
                <td class="col-doc-actions">
                    <div class="doc-actions-group">
                        <button class="doc-action-btn doc-action-download" title="Download PDF" onclick="event.stopPropagation();handleDocAction('download',${doc.id})"><i class="pi pi-file-pdf"></i></button>
                        ${deleteBtn}
                        <button class="doc-action-btn doc-action-share" title="Share" onclick="event.stopPropagation();handleDocAction('share',${doc.id})"><i class="pi pi-share-alt"></i></button>
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

function setQuickFilter(qf) {
    currentQuickFilter = qf;
    const chips = document.querySelectorAll('#docQuickFilters .doc-qf-chip');
    chips.forEach(c => c.classList.remove('active'));
    const active = document.querySelector(`#docQuickFilters .doc-qf-chip[data-qf="${qf}"]`);
    if (active) active.classList.add('active');
    renderDocumentTable();
}

function searchDocuments(value) {
    currentSearch = value;
    renderDocumentTable();
}

function openDocPreview(docId) {
    _docCtrl.openPreview(docId);
    renderDocumentTable();
}

function closeDocPreview() {
    _docCtrl.closePreview();
    renderDocumentTable();
}

function openReadingModal() {
    _docCtrl.openModal();
}

function closeReadingModal() {
    _docCtrl.closeModal();
}

function handleDocAction(action, docId) {
    const doc = DOCUMENTS_DATA.find(d => d.id === docId);
    if (!doc) return;
    console.log(`Document action: ${action} on "${doc.name}" (ID: ${docId})`);
}

document.addEventListener('DOMContentLoaded', function () {
    renderDocumentTable();
});
