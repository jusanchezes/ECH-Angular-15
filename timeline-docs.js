/**
 * @file timeline-docs.js — Document entries for the Timeline feed
 * @description Converts encounter documents into TimelineEntryGroupDTO-compatible
 *   entries so they appear inline in the chronological timeline alongside
 *   Exam, Note, Medication, etc. entries.
 *   Manages the full reading modal via DocPreview.createController().
 *   Angular equivalent: slim adapter service used by TimelineComponent.
 */

var TL_DOCS_DATA = ClinicalDataService.getEncounterDocuments();

/* ------------------------------------------------------------------
   Modal controller — no preview pane on this page; dummy IDs are
   passed for pane/body/container so createController gracefully
   no-ops those elements while still managing the reading modal.
------------------------------------------------------------------ */
var _tlPreviewCtrl = DocPreview.createController({
    getData: function () { return TL_DOCS_DATA; },
    previewPaneId: '_tl_no_pane',
    previewBodyId: '_tl_no_body',
    containerId:   '_tl_no_container',
    previewOpenClass: '',
    getPreviewFooterHtml: function () { return ''; },
    modalId: 'tl-doc-reading-modal',
    modalContentId: 'tl-doc-reading-content'
});

/* ------------------------------------------------------------------
   Date helpers
------------------------------------------------------------------ */
var _TL_DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var _TL_MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

/** Parses "DD/MM/YYYY[ HH:MM]" → { dateLabel, time } */
function tlParsDocDate(dateStr) {
    var parts = (dateStr || '').split(/[\/ ]/);
    if (parts.length < 3) return { dateLabel: dateStr, time: '00:00' };
    var d = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var y = parseInt(parts[2], 10);
    var t = parts[3] || '00:00';
    var dt = new Date(y, m, d);
    var label = _TL_DAY_NAMES[dt.getDay()] + ' ' + d + ' ' + _TL_MONTH_NAMES[m] + ' ' + y;
    return { dateLabel: label, time: t };
}

/** Derives a role from an author name for role-based filtering. */
function tlDocRole(author) {
    var a = (author || '').toLowerCase();
    if (a.indexOf('nurs') === 0) return 'Nursing';
    if (a.indexOf('pharm') !== -1) return 'Pharmacy';
    if (a.indexOf('radiol') !== -1) return 'Radiology';
    return 'Physician';
}

/* ------------------------------------------------------------------
   Convert encounter documents → timeline date-group entries.
   Called by app.js before rendering to merge into TimelineData.
------------------------------------------------------------------ */
function tlGetDocumentTimelineEntries() {
    var groups = [];

    TL_DOCS_DATA.forEach(function (doc) {
        var parsed  = tlParsDocDate(doc.date);
        var dateLabel = parsed.dateLabel;
        var time      = parsed.time;
        var role      = tlDocRole(doc.author);

        var entry = {
            time:        time,
            type:        'Document',
            dept:        doc.department,
            description: doc.name,
            author:      doc.author,
            role:        role,
            card:        doc.encounter || doc.admission || '',
            actions:     ['View Document', 'Download PDF', 'Print'],
            docId:       doc.id,
            docType:     doc.type,
            docStatus:   doc.status
        };

        var group = groups.find(function (g) { return g.date === dateLabel; });
        if (group) {
            group.entries.push(entry);
        } else {
            groups.push({ date: dateLabel, entries: [entry] });
        }
    });

    /* Sort entries within each group by time */
    groups.forEach(function (g) {
        g.entries.sort(function (a, b) { return a.time.localeCompare(b.time); });
    });

    return groups;
}

/* ------------------------------------------------------------------
   Modal actions — opens the reading modal directly for a given docId.
   Called from timeline entry click handlers rendered by app.js.
------------------------------------------------------------------ */
function tlOpenDocModal(docId) {
    _tlPreviewCtrl.openPreview(docId);
    _tlPreviewCtrl.openModal();
}

function tlCloseReadingModal() {
    _tlPreviewCtrl.closeModal();
}

function tlHandleDocAction(action, docId) {
    var doc = TL_DOCS_DATA.find(function (d) { return d.id === docId; });
    if (!doc) return;
    console.log('Timeline doc action:', action, 'on "' + doc.name + '" (ID: ' + docId + ')');
}
