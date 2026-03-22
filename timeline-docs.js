/**
 * @file timeline-docs.js — Documents & Notes section for the Timeline page
 * @description Renders a filterable document table with inline preview panel
 *   and full reading modal, sourced from the current encounter documents.
 *   Delegates lifecycle management to DocPreview.createController()
 *   (doc-preview-shared.js) and rendering helpers to DocPreview.* utilities.
 *   Angular equivalent: TimelineDocsComponent (standalone).
 */

var TL_DOCS_DATA = ClinicalDataService.getEncounterDocuments();

var _tlPreviewCtrl = DocPreview.createController({
    getData: function () { return TL_DOCS_DATA; },
    previewPaneId: 'tl-doc-preview-pane',
    previewBodyId: 'tl-doc-preview-body',
    containerId: 'tl-doc-workspace',
    previewOpenClass: 'preview-open',
    getPreviewFooterHtml: function (doc) {
        return '<div class="doc-preview-footer">' +
            '<button class="doc-preview-footer-btn" onclick="tlHandleDocAction(\'download\',\'' + doc.id + '\')"><i class="pi pi-file-pdf"></i> Download PDF</button>' +
            '<button class="doc-preview-footer-btn" onclick="tlHandleDocAction(\'print\',\'' + doc.id + '\')"><i class="pi pi-print"></i> Print</button>' +
            '</div>';
    },
    modalId: 'tl-doc-reading-modal',
    modalContentId: 'tl-doc-reading-content'
});

var tlCurrentQuickFilter = 'all';
var tlDocsSectionCollapsed = false;

/* -----------------------------------------------------------------------
   Clinical note types (for Notes Only / Documents Only filter)
----------------------------------------------------------------------- */
var TL_NOTE_TYPES = ['nursing note', 'progress note', 'doctor note', 'clinical note'];

/* -----------------------------------------------------------------------
   Filtering
----------------------------------------------------------------------- */
function tlGetFilteredDocs() {
    var docs = TL_DOCS_DATA;

    if (tlCurrentQuickFilter === 'notes-only') {
        docs = docs.filter(function (d) { return TL_NOTE_TYPES.indexOf(d.type.toLowerCase()) !== -1; });
    } else if (tlCurrentQuickFilter === 'documents-only') {
        docs = docs.filter(function (d) { return TL_NOTE_TYPES.indexOf(d.type.toLowerCase()) === -1; });
    } else if (tlCurrentQuickFilter === 'draft-only') {
        docs = docs.filter(function (d) { return d.status === 'draft'; });
    } else if (tlCurrentQuickFilter === 'signed-only') {
        docs = docs.filter(function (d) { return d.status === 'signed'; });
    } else if (tlCurrentQuickFilter === 'latest') {
        docs = docs.slice().sort(function (a, b) {
            return DocPreview.parseDateStr(b.date) - DocPreview.parseDateStr(a.date);
        }).slice(0, 5);
    }

    return docs;
}

/* -----------------------------------------------------------------------
   Encounter / admission label helper
----------------------------------------------------------------------- */
function tlEncounterLabel(doc) {
    if (doc.encounter || doc.admission) {
        return '<span class="doc-encounter-badge">' + (doc.encounter || doc.admission) + '</span>';
    }
    return '<span style="color:var(--ech-text-muted)">—</span>';
}

/* -----------------------------------------------------------------------
   Table rendering
----------------------------------------------------------------------- */
function tlRenderDocTable() {
    var tbody = document.getElementById('tlDocTableBody');
    if (!tbody) return;

    var docs = tlGetFilteredDocs();
    var activeId = _tlPreviewCtrl.getCurrentDocId();

    if (activeId !== null && !docs.find(function (d) { return d.id === activeId; })) {
        _tlPreviewCtrl.closePreview();
        activeId = null;
    }

    if (docs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--ech-text-secondary)"><i class="pi pi-inbox" style="font-size:1.8rem;display:block;margin-bottom:8px"></i>No documents match the current filter</td></tr>';
        return;
    }

    tbody.innerHTML = docs.map(function (doc) {
        var keyStar = doc.keyDocument
            ? '<span class="doc-key-star" title="Key clinical document"><i class="pi pi-star-fill"></i></span>'
            : '';
        var statusTag = DocPreview.getStatusTag(doc.status);
        var isActive = doc.id === activeId ? ' doc-row-active' : '';

        return '<tr class="ehr-row doc-table-row' + isActive + '" onclick="tlOpenDocPreview(\'' + doc.id + '\')">' +
            '<td class="tl-col-key">' + keyStar + '</td>' +
            '<td class="tl-col-name"><a href="#" class="doc-link" onclick="tlOpenDocPreview(\'' + doc.id + '\');return false">' + doc.name + '</a></td>' +
            '<td class="tl-col-author">' + doc.author + '</td>' +
            '<td class="tl-col-dept">' + doc.department + '</td>' +
            '<td class="tl-col-type">' + doc.type + '</td>' +
            '<td class="tl-col-date">' + doc.date + '</td>' +
            '<td class="tl-col-status">' + statusTag + '</td>' +
            '<td class="tl-col-encounter">' + tlEncounterLabel(doc) + '</td>' +
            '<td class="tl-col-actions">' +
                '<div class="doc-actions-group">' +
                    '<button class="doc-action-btn doc-action-download" title="Download PDF" onclick="event.stopPropagation();tlHandleDocAction(\'download\',\'' + doc.id + '\')"><i class="pi pi-file-pdf"></i></button>' +
                    '<button class="doc-action-btn doc-action-share" title="Print" onclick="event.stopPropagation();tlHandleDocAction(\'print\',\'' + doc.id + '\')"><i class="pi pi-print"></i></button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');
}

/* -----------------------------------------------------------------------
   Quick filter chips
----------------------------------------------------------------------- */
function tlSetQuickFilter(qf) {
    tlCurrentQuickFilter = qf;
    var chips = document.querySelectorAll('#tlDocQuickFilters .doc-qf-chip');
    chips.forEach(function (c) { c.classList.remove('active'); });
    var active = document.querySelector('#tlDocQuickFilters .doc-qf-chip[data-qf="' + qf + '"]');
    if (active) active.classList.add('active');
    tlRenderDocTable();
}

/* -----------------------------------------------------------------------
   Collapse / expand section
----------------------------------------------------------------------- */
function tlToggleDocsSection() {
    tlDocsSectionCollapsed = !tlDocsSectionCollapsed;
    var body = document.getElementById('tl-docs-body');
    var icon = document.getElementById('tlDocsToggleIcon');
    if (body) body.classList.toggle('collapsed', tlDocsSectionCollapsed);
    if (icon) icon.className = tlDocsSectionCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
}

/* -----------------------------------------------------------------------
   Preview panel — delegates lifecycle to _tlPreviewCtrl
----------------------------------------------------------------------- */
function tlOpenDocPreview(docId) {
    _tlPreviewCtrl.openPreview(docId);
    tlRenderDocTable();
}

function tlCloseDocPreview() {
    _tlPreviewCtrl.closePreview();
    tlRenderDocTable();
}

/* -----------------------------------------------------------------------
   Reading modal — delegates lifecycle to _tlPreviewCtrl
----------------------------------------------------------------------- */
function tlOpenReadingModal() {
    _tlPreviewCtrl.openModal();
}

function tlCloseReadingModal() {
    _tlPreviewCtrl.closeModal();
}

/* -----------------------------------------------------------------------
   Actions (prototype — console only)
----------------------------------------------------------------------- */
function tlHandleDocAction(action, docId) {
    var doc = TL_DOCS_DATA.find(function (d) { return d.id === docId; });
    if (!doc) return;
    console.log('Timeline doc action:', action, 'on "' + doc.name + '" (ID: ' + docId + ')');
}

/* -----------------------------------------------------------------------
   Init
----------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('tlDocTableBody')) {
        tlRenderDocTable();
    }
});
