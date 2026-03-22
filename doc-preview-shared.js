/**
 * @file doc-preview-shared.js — Shared Document Preview Utilities
 * @description Reusable functions for document preview panels and reading modals.
 *   Used by: documents.js, timeline-docs.js, and the Previous Visits inline script.
 *   Angular equivalent: DocumentPreviewService (@Injectable shared service).
 *
 *   Exported namespace: DocPreview
 *     .getStatusTag(status)              → status badge HTML string
 *     .getBannerHtml(status)             → draft/signed/external banner HTML string
 *     .parseDateStr(dateStr)             → Date object from "DD/MM/YYYY[ HH:MM]" string
 *     .buildPreviewBodyHtml(doc, footer) → full preview-pane body HTML
 *     .buildReadingContentHtml(doc)      → full reading-modal content area HTML
 */

var DocPreview = (function () {

    /** Returns a status badge span for a given document status value. */
    function getStatusTag(status) {
        var map = {
            signed:   { cls: 'doc-status-signed',   label: 'Signed' },
            draft:    { cls: 'doc-status-draft',     label: 'Draft' },
            amended:  { cls: 'doc-status-amended',   label: 'Amended' },
            external: { cls: 'doc-status-external',  label: 'External' }
        };
        var s = map[status] || { cls: 'doc-status-draft', label: status };
        return '<span class="doc-status-tag ' + s.cls + '">' + s.label + '</span>';
    }

    /** Returns the draft / signed / external alert banner HTML (or empty string). */
    function getBannerHtml(status) {
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

    /** Parses "DD/MM/YYYY[ HH:MM]" → Date. Returns epoch on failure. */
    function parseDateStr(dateStr) {
        var parts = (dateStr || '').split(/[\/ ]/);
        if (parts.length >= 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(0);
    }

    /**
     * Builds the complete preview-pane body HTML for a document.
     * @param {Object} doc         - Document data object.
     * @param {string} footerHtml  - Caller-supplied footer markup (action buttons).
     *                               Pass '' or omit for no footer.
     * @returns {string} Inner HTML for the .doc-preview-body element.
     */
    function buildPreviewBodyHtml(doc, footerHtml) {
        var encounterLine = (doc.encounter || doc.admission)
            ? '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Encounter</span><span>' + (doc.encounter || doc.admission) + '</span></div>'
            : '';

        return getBannerHtml(doc.status) +
            '<div class="doc-preview-title">' + doc.name + '</div>' +
            '<div class="doc-preview-meta">' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Author</span><span>' + doc.author + '</span></div>' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Department</span><span>' + doc.department + '</span></div>' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Date</span><span>' + doc.date + '</span></div>' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Type</span><span>' + doc.type + '</span></div>' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Status</span><span>' + getStatusTag(doc.status) + '</span></div>' +
                encounterLine +
            '</div>' +
            '<div class="doc-preview-divider"></div>' +
            '<div class="doc-preview-content">' + (doc.previewContent || 'No preview content available.') + '</div>' +
            (footerHtml || '');
    }

    /**
     * Builds the full reading-modal content area HTML for a document.
     * @param {Object} doc - Document data object.
     * @returns {string} Inner HTML for the .doc-reading-content element.
     */
    function buildReadingContentHtml(doc) {
        var encounterLine = (doc.encounter || doc.admission)
            ? '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Encounter / Admission</span><span>' + (doc.encounter || doc.admission) + '</span></div>'
            : '';

        return getBannerHtml(doc.status) +
            '<div class="doc-reading-doc-title">' + doc.name + '</div>' +
            '<div class="doc-reading-doc-byline">' + doc.author + ' &nbsp;·&nbsp; ' + doc.department + ' &nbsp;·&nbsp; ' + doc.date + ' &nbsp;·&nbsp; ' + getStatusTag(doc.status) + '</div>' +
            '<div class="doc-preview-meta" style="margin-bottom:20px">' +
                '<div class="doc-preview-meta-row"><span class="doc-preview-meta-label">Type</span><span>' + doc.type + '</span></div>' +
                encounterLine +
            '</div>' +
            '<div class="doc-preview-divider"></div>' +
            '<div class="doc-reading-body">' + (doc.previewContent || 'No preview content available.') + '</div>';
    }

    return {
        getStatusTag: getStatusTag,
        getBannerHtml: getBannerHtml,
        parseDateStr: parseDateStr,
        buildPreviewBodyHtml: buildPreviewBodyHtml,
        buildReadingContentHtml: buildReadingContentHtml
    };

})();
