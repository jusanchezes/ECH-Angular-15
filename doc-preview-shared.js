/**
 * @file doc-preview-shared.js — Shared Document Preview Utilities
 * @description Reusable rendering helpers and a configurable lifecycle controller for
 *   document preview panels and reading modals.
 *   Used by: documents.js, timeline-docs.js, and the Previous Visits inline script.
 *   Angular equivalent: DocumentPreviewService (@Injectable shared service).
 *
 *   Exported namespace: DocPreview
 *     Rendering helpers:
 *       .getStatusTag(status)              → status badge HTML string
 *       .getBannerHtml(status)             → draft/signed/external banner HTML string
 *       .parseDateStr(dateStr)             → Date object from "DD/MM/YYYY[ HH:MM]" string
 *       .buildPreviewBodyHtml(doc, footer) → full preview-pane body HTML
 *       .buildReadingContentHtml(doc)      → full reading-modal content area HTML
 *
 *     Lifecycle controller factory:
 *       .createController(config) → controller instance
 *         controller.getCurrentDocId()
 *         controller.openPreview(docId)
 *         controller.closePreview()
 *         controller.openModal()
 *         controller.closeModal()
 */

var DocPreview = (function () {

    /* ------------------------------------------------------------------
       Rendering helpers
    ------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------
       Lifecycle controller factory
    ------------------------------------------------------------------ */

    /**
     * Creates a page-agnostic controller for a preview panel and reading modal.
     *
     * @param {Object} config
     *   getData(): doc[]             — returns the current docs array
     *   previewPaneId: string        — ID of the preview pane element
     *   previewBodyId: string        — ID of the preview body element
     *   containerId: string          — ID of the outer workspace / split container
     *   previewOpenClass: string     — CSS class added to container when preview is open
     *   getPreviewFooterHtml(doc)    — function returning footer HTML for the preview body
     *   modalId: string              — ID of the reading modal element
     *   modalContentId: string       — ID of the modal content element
     *   hideContainerOnModal?: bool  — if true, hide the container when the modal opens
     *                                  (used on the Documents page where the modal
     *                                   replaces the table/preview workspace)
     *
     * @returns {Object} controller with the following methods:
     *   getCurrentDocId()     — returns the currently previewed doc ID (or null)
     *   openPreview(docId)    — show preview pane for the given doc
     *   closePreview()        — hide preview pane and clear active doc
     *   openModal()           — open reading modal for the current preview doc
     *   closeModal()          — close reading modal
     */
    function createController(config) {
        var _currentDocId = null;

        function findDoc(docId) {
            var docs = typeof config.getData === 'function' ? config.getData() : [];
            return docs.find(function (d) { return d.id === docId; });
        }

        return {
            getCurrentDocId: function () { return _currentDocId; },

            openPreview: function (docId) {
                var doc = findDoc(docId);
                if (!doc) return;
                _currentDocId = docId;

                var pane = document.getElementById(config.previewPaneId);
                var body = document.getElementById(config.previewBodyId);
                var container = document.getElementById(config.containerId);

                if (pane) pane.style.display = '';
                if (container && config.previewOpenClass) {
                    container.classList.add(config.previewOpenClass);
                }
                if (body) {
                    body.innerHTML = buildPreviewBodyHtml(doc, config.getPreviewFooterHtml(doc));
                }
            },

            closePreview: function () {
                _currentDocId = null;

                var pane = document.getElementById(config.previewPaneId);
                var container = document.getElementById(config.containerId);

                if (pane) pane.style.display = 'none';
                if (container && config.previewOpenClass) {
                    container.classList.remove(config.previewOpenClass);
                }
            },

            openModal: function () {
                var doc = findDoc(_currentDocId);
                if (!doc) return;

                if (config.hideContainerOnModal) {
                    var container = document.getElementById(config.containerId);
                    if (container) container.style.display = 'none';
                }

                var modal = document.getElementById(config.modalId);
                var content = document.getElementById(config.modalContentId);
                if (modal) modal.style.display = '';
                if (content) content.innerHTML = buildReadingContentHtml(doc);
            },

            closeModal: function () {
                var modal = document.getElementById(config.modalId);
                if (modal) modal.style.display = 'none';

                if (config.hideContainerOnModal) {
                    var container = document.getElementById(config.containerId);
                    if (container) container.style.display = '';
                }
            }
        };
    }

    /* ------------------------------------------------------------------
       Public API
    ------------------------------------------------------------------ */
    return {
        getStatusTag: getStatusTag,
        getBannerHtml: getBannerHtml,
        parseDateStr: parseDateStr,
        buildPreviewBodyHtml: buildPreviewBodyHtml,
        buildReadingContentHtml: buildReadingContentHtml,
        createController: createController
    };

})();
