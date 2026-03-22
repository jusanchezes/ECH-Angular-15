/**
 * @file timeline-docs.js — Documents & Notes section for the Timeline page
 * @description Renders a filterable document table with inline preview panel
 *   and full reading modal, sourced from the current encounter documents.
 *   Angular equivalent: TimelineDocsComponent (standalone).
 */

var TL_DOCS_DATA = ClinicalDataService.getEncounterDocuments();

var tlCurrentQuickFilter = 'all';
var tlCurrentPreviewDocId = null;
var tlDocsSectionCollapsed = false;

/* -----------------------------------------------------------------------
   Filtering
----------------------------------------------------------------------- */
function tlGetFilteredDocs() {
    var docs = TL_DOCS_DATA;

    if (tlCurrentQuickFilter === 'notes-only') {
        docs = docs.filter(function(d) { return d.type.toLowerCase().indexOf('note') !== -1; });
    } else if (tlCurrentQuickFilter === 'documents-only') {
        docs = docs.filter(function(d) { return d.type.toLowerCase().indexOf('note') === -1; });
    } else if (tlCurrentQuickFilter === 'draft-only') {
        docs = docs.filter(function(d) { return d.status === 'draft'; });
    } else if (tlCurrentQuickFilter === 'signed-only') {
        docs = docs.filter(function(d) { return d.status === 'signed'; });
    } else if (tlCurrentQuickFilter === 'key-only') {
        docs = docs.filter(function(d) { return d.keyDocument === true; });
    }

    return docs;
}

/* -----------------------------------------------------------------------
   Status helpers (shared with doc-preview.css design)
----------------------------------------------------------------------- */
function tlGetStatusTag(status) {
    var map = {
        signed:   { cls: 'doc-status-signed',   label: 'Signed' },
        draft:    { cls: 'doc-status-draft',     label: 'Draft' },
        amended:  { cls: 'doc-status-amended',   label: 'Amended' },
        external: { cls: 'doc-status-external',  label: 'External' }
    };
    var s = map[status] || { cls: 'doc-status-draft', label: status };
    return '<span class="doc-status-tag ' + s.cls + '">' + s.label + '</span>';
}

function tlGetBannerHtml(status) {
    if (status === 'draft') {
        return '<div class="doc-preview-banner doc-preview-banner-draft"><i class="pi pi-pencil"></i> Draft — not yet signed</div>';
    }
    if (status === 'signed' || status === 'amended') {
        return '<div class="doc-preview-banner doc-preview-banner-signed"><i class="pi pi-lock"></i> Read-only — document is signed</div>';
    }
    if (status === 'external') {
        return '<div class="doc-preview-banner doc-preview-banner-external"><i class="pi pi-external-link"></i> External document</div>';
    }
    return '';
}

/* -----------------------------------------------------------------------
   Table rendering
----------------------------------------------------------------------- */
function tlRenderDocTable() {
    var tbody = document.getElementById('tlDocTableBody');
    if (!tbody) return;

    var docs = tlGetFilteredDocs();

    if (tlCurrentPreviewDocId !== null && !docs.find(function(d) { return d.id === tlCurrentPreviewDocId; })) {
        tlCloseDocPreview();
    }

    if (docs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--ech-text-secondary)"><i class="pi pi-inbox" style="font-size:1.8rem;display:block;margin-bottom:8px"></i>No documents match the current filter</td></tr>';
        return;
    }

    tbody.innerHTML = docs.map(function(doc) {
        var keyStar = doc.keyDocument
            ? '<span class="doc-key-star" title="Key clinical document"><i class="pi pi-star-fill"></i></span>'
            : '';
        var statusTag = tlGetStatusTag(doc.status);
        var isActive = doc.id === tlCurrentPreviewDocId ? ' doc-row-active' : '';

        return '<tr class="ehr-row doc-table-row' + isActive + '" onclick="tlOpenDocPreview(\'' + doc.id + '\')">' +
            '<td class="tl-col-key">' + keyStar + '</td>' +
            '<td class="tl-col-name"><a href="#" class="doc-link" onclick="tlOpenDocPreview(\'' + doc.id + '\');return false">' + doc.name + '</a></td>' +
            '<td class="tl-col-author">' + doc.author + '</td>' +
            '<td class="tl-col-type">' + doc.type + '</td>' +
            '<td class="tl-col-date">' + doc.date + '</td>' +
            '<td class="tl-col-status">' + statusTag + '</td>' +
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
    chips.forEach(function(c) { c.classList.remove('active'); });
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
    if (icon) {
        icon.className = tlDocsSectionCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
    }
}

/* -----------------------------------------------------------------------
   Preview panel
----------------------------------------------------------------------- */
function tlOpenDocPreview(docId) {
    var doc = TL_DOCS_DATA.find(function(d) { return d.id === docId; });
    if (!doc) return;

    tlCurrentPreviewDocId = docId;

    var workspace = document.getElementById('tl-doc-workspace');
    var previewPane = document.getElementById('tl-doc-preview-pane');
    var previewBody = document.getElementById('tl-doc-preview-body');

    if (!workspace || !previewPane || !previewBody) return;

    previewPane.style.display = '';
    workspace.classList.add('preview-open');

    var encounterLine = doc.encounter
        ? '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Encounter</span><span>' + doc.encounter + '</span></div>'
        : '';

    previewBody.innerHTML =
        tlGetBannerHtml(doc.status) +
        '<div class="doc-preview-title">' + doc.name + '</div>' +
        '<div class="doc-preview-meta">' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Author</span><span>' + doc.author + '</span></div>' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Department</span><span>' + doc.department + '</span></div>' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Date</span><span>' + doc.date + '</span></div>' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Type</span><span>' + doc.type + '</span></div>' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Status</span><span>' + tlGetStatusTag(doc.status) + '</span></div>' +
            encounterLine +
        '</div>' +
        '<div class="doc-preview-divider"></div>' +
        '<div class="doc-preview-content">' + (doc.previewContent || 'No preview available.') + '</div>' +
        '<div class="doc-preview-footer">' +
            '<button class="doc-preview-footer-btn" onclick="tlHandleDocAction(\'download\',\'' + doc.id + '\')"><i class="pi pi-file-pdf"></i> Download PDF</button>' +
            '<button class="doc-preview-footer-btn" onclick="tlHandleDocAction(\'print\',\'' + doc.id + '\')"><i class="pi pi-print"></i> Print</button>' +
        '</div>';

    tlRenderDocTable();
}

function tlCloseDocPreview() {
    tlCurrentPreviewDocId = null;
    var workspace = document.getElementById('tl-doc-workspace');
    var previewPane = document.getElementById('tl-doc-preview-pane');
    if (workspace) workspace.classList.remove('preview-open');
    if (previewPane) previewPane.style.display = 'none';
    tlRenderDocTable();
}

/* -----------------------------------------------------------------------
   Reading modal (fixed overlay)
----------------------------------------------------------------------- */
function tlOpenReadingModal() {
    var doc = TL_DOCS_DATA.find(function(d) { return d.id === tlCurrentPreviewDocId; });
    if (!doc) return;

    var modal = document.getElementById('tl-doc-reading-modal');
    var content = document.getElementById('tl-doc-reading-content');
    if (!modal || !content) return;

    modal.style.display = '';

    var encounterLine = doc.encounter
        ? '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Encounter</span><span>' + doc.encounter + '</span></div>'
        : '';

    content.innerHTML =
        tlGetBannerHtml(doc.status) +
        '<div class="doc-reading-doc-title">' + doc.name + '</div>' +
        '<div class="doc-reading-doc-byline">' + doc.author + ' &nbsp;·&nbsp; ' + doc.department + ' &nbsp;·&nbsp; ' + doc.date + ' &nbsp;·&nbsp; ' + tlGetStatusTag(doc.status) + '</div>' +
        '<div class="doc-preview-meta" style="margin-bottom:20px">' +
            '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Type</span><span>' + doc.type + '</span></div>' +
            encounterLine +
        '</div>' +
        '<div class="doc-preview-divider"></div>' +
        '<div class="doc-reading-body">' + (doc.previewContent || 'No content available.') + '</div>';
}

function tlCloseReadingModal() {
    var modal = document.getElementById('tl-doc-reading-modal');
    if (modal) modal.style.display = 'none';
}

/* -----------------------------------------------------------------------
   Actions (prototype — console only)
----------------------------------------------------------------------- */
function tlHandleDocAction(action, docId) {
    var doc = TL_DOCS_DATA.find(function(d) { return d.id === docId; });
    if (!doc) return;
    console.log('Timeline doc action:', action, 'on "' + doc.name + '" (ID: ' + docId + ')');
}

/* -----------------------------------------------------------------------
   Init
----------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tlDocTableBody')) {
        tlRenderDocTable();
    }
});
