/**
 * @file app.js — Timeline-Specific Logic
 * @description Prototype script for the EHR Patient Timeline view.
 *   Handles timeline rendering, filtering, and timeline-specific UI interactions.
 *   Shared shell functions (sidebar, header, banner, alerts, user menu) are in layout.js.
 *   Document preview/reading modal uses DocPreview (doc-preview-shared.js).
 *   Angular equivalent: TimelineComponent + TimelineDocumentAdapterService.
 */

/* ===========================================================================
   DOCUMENT ADAPTER — converts encounter documents into timeline entries
   Angular equivalent: TimelineDocumentAdapterService
   =========================================================================== */

var _TL_DOCS_DATA = ClinicalDataService.getEncounterDocuments();

/** Modal lifecycle controller for the reading modal (no preview pane on this page). */
var _tlPreviewCtrl = DocPreview.createController({
    getData:         function () { return _TL_DOCS_DATA; },
    previewPaneId:   '_tl_no_pane',
    previewBodyId:   '_tl_no_body',
    containerId:     '_tl_no_container',
    previewOpenClass: '',
    getPreviewFooterHtml: function () { return ''; },
    modalId:         'tl-doc-reading-modal',
    modalContentId:  'tl-doc-reading-content'
});

var _TL_DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var _TL_MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

/** Parses "DD/MM/YYYY HH:MM" → { dateLabel, time } for timeline grouping. */
function _tlParseDocDate(dateStr) {
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

/** Derives a role string from an author name for role-based filtering. */
function _tlDocRole(author) {
    var a = (author || '').toLowerCase();
    if (a.indexOf('nurs') === 0) return 'Nursing';
    if (a.indexOf('pharm') !== -1) return 'Pharmacy';
    if (a.indexOf('radiol') !== -1) return 'Radiology';
    return 'Physician';
}

/** Converts encounter documents into timeline date-group entries (type: 'Document'). */
function _tlGetDocumentGroups() {
    var groups = [];
    _TL_DOCS_DATA.forEach(function (doc) {
        var parsed    = _tlParseDocDate(doc.date);
        var entry = {
            time:        parsed.time,
            type:        'Document',
            dept:        doc.department,
            description: doc.name,
            author:      doc.author,
            role:        _tlDocRole(doc.author),
            card:        doc.encounter || doc.admission || '',
            actions:     ['View Document', 'Download PDF', 'Print'],
            docId:       doc.id,
            docType:     doc.type,
            docStatus:   doc.status
        };
        var group = groups.find(function (g) { return g.date === parsed.dateLabel; });
        if (group) {
            group.entries.push(entry);
        } else {
            groups.push({ date: parsed.dateLabel, entries: [entry] });
        }
    });
    groups.forEach(function (g) {
        g.entries.sort(function (a, b) { return a.time.localeCompare(b.time); });
    });
    return groups;
}

/** Opens the full reading modal for the given document ID. */
function tlOpenDocModal(docId) {
    _tlPreviewCtrl.openPreview(docId);
    _tlPreviewCtrl.openModal();
}

/** Closes the reading modal. */
function tlCloseReadingModal() {
    _tlPreviewCtrl.closeModal();
}

/** Prototype action handler — logs to console only. */
function tlHandleDocAction(action, docId) {
    var doc = _TL_DOCS_DATA.find(function (d) { return d.id === docId; });
    if (!doc) return;
    console.log('Timeline doc action:', action, 'on "' + doc.name + '" (ID: ' + docId + ')');
}

/* ===========================================================================
   DATA — load timeline and merge document entries
   =========================================================================== */

var PatientData  = ClinicalDataService.getPatient();
var TimelineData = ClinicalDataService.getTimeline();

(function mergeDocumentEntries() {
    var MONTH_MAP = {
        January:1, February:2, March:3, April:4, May:5, June:6,
        July:7, August:8, September:9, October:10, November:11, December:12
    };
    function parseDateGroupStr(dateStr) {
        var parts = (dateStr || '').split(' ');
        if (parts.length === 4) {
            return new Date(parseInt(parts[3], 10), (MONTH_MAP[parts[2]] || 1) - 1, parseInt(parts[1], 10));
        }
        return new Date(0);
    }

    _tlGetDocumentGroups().forEach(function (docGroup) {
        var existing = TimelineData.find(function (g) { return g.date === docGroup.date; });
        if (existing) {
            docGroup.entries.forEach(function (e) { existing.entries.push(e); });
            existing.entries.sort(function (a, b) { return a.time.localeCompare(b.time); });
        } else {
            TimelineData.push(docGroup);
        }
    });

    TimelineData.sort(function (a, b) {
        return parseDateGroupStr(a.date) - parseDateGroupStr(b.date);
    });
}());

/* ===========================================================================
   FILTER STATE
   Angular: managed by TimelineFilterService with BehaviorSubject observables
   =========================================================================== */

let currentTimeFilter  = 'full';
let currentRoleFilters = ['All'];
let currentTypeFilters = ['All'];
let searchQuery        = '';
let visibleColumns = {
    time: true, type: true, dept: true, description: true, card: true, actions: true
};

/* ===========================================================================
   RENDERING
   Angular: TimelineComponent template with <p-timeline> and async pipe
   =========================================================================== */

function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    const typeIconMap = {
        'Exam':     'pi-file',
        'Surgery':  'pi-heart',
        'Medication': 'pi-box',
        'Note':     'pi-pencil',
        'Images':   'pi-image',
        'Care':     'pi-shield',
        'Vitals':   'pi-chart-line',
        'Document': 'pi-file-text'
    };

    let html = '';
    const filteredData = filterTimelineData();

    if (filteredData.length === 0) {
        html = `<div class="p-3 text-center text-color-secondary"><i class="pi pi-info-circle"></i> No timeline entries match the current filters.</div>`;
    } else {
        filteredData.forEach(dateGroup => {
            html += `<div class="timeline-date-header"><i class="pi pi-calendar"></i> ${dateGroup.date}</div>`;
            html += `<div class="p-timeline p-timeline-vertical p-timeline-left">`;

            groupEntries(dateGroup.entries).forEach((group, idx, arr) => {
                const first  = group[0];
                const icon   = typeIconMap[first.type] || 'pi-circle';
                const isLast = idx === arr.length - 1;

                html += `<div class="p-timeline-event" data-type="${first.type}" data-role="${first.role}">`;

                /* --- time column --- */
                html += `<div class="p-timeline-event-opposite">`;
                if (visibleColumns.time) html += `<span class="tl-time">${first.time}</span>`;
                html += `</div>`;

                /* --- marker + connector --- */
                html += `<div class="p-timeline-event-separator">`;
                html += `<div class="p-timeline-event-marker" data-type-color="${first.type}"><i class="pi ${icon} tl-marker-icon"></i></div>`;
                if (!isLast) html += `<div class="p-timeline-event-connector"></div>`;
                html += `</div>`;

                /* --- card content --- */
                html += `<div class="p-timeline-event-content"><div class="tl-event-card">`;

                let headerParts = [];
                if (visibleColumns.type) headerParts.push(`<span class="tl-type tl-type-${first.type.toLowerCase()}"><i class="pi ${icon}"></i> ${first.type}</span>`);
                if (visibleColumns.dept) headerParts.push(`<span class="tl-dept">${first.dept}</span>`);
                headerParts.push(`<span class="tl-role">${first.author}</span>`);
                if (visibleColumns.card && first.card) headerParts.push(`<span class="tl-card-tag">${first.card}</span>`);
                html += `<div class="tl-event-header">${headerParts.join('<span class="tl-sep">·</span>')}</div>`;

                group.forEach(entry => {
                    if (entry.docId) {
                        html += `<div class="tl-sub-item tl-doc-row" onclick="tlOpenDocModal('${entry.docId}')" title="Open document">`;
                    } else {
                        html += `<div class="tl-sub-item">`;
                    }

                    /* Description */
                    if (visibleColumns.description) {
                        if (entry.docId) {
                            const statusTag = DocPreview.getStatusTag(entry.docStatus);
                            html += `<span class="tl-description tl-doc-desc">` +
                                `<span class="tl-doc-link">${entry.description}</span>` +
                                `<span class="tl-doc-meta">${entry.docType}&nbsp;·&nbsp;${statusTag}</span>` +
                                `</span>`;
                        } else {
                            html += `<span class="tl-description">${entry.description}</span>`;
                        }
                    }

                    /* Actions */
                    if (visibleColumns.actions) {
                        if (entry.docId) {
                            html += `<span class="tl-sub-actions" onclick="event.stopPropagation()">` +
                                `<span class="action-icon pi pi-ellipsis-v" onclick="toggleRowMenu(event, this)" title="Actions"></span>` +
                                `<div class="row-dropdown">` +
                                `<div class="rd-item" onclick="tlOpenDocModal('${entry.docId}')"><i class="pi pi-eye"></i> View Document</div>` +
                                `<div class="rd-item" onclick="tlHandleDocAction('download','${entry.docId}')"><i class="pi pi-file-pdf"></i> Download PDF</div>` +
                                `<div class="rd-item" onclick="tlHandleDocAction('print','${entry.docId}')"><i class="pi pi-print"></i> Print</div>` +
                                `</div></span>`;
                        } else {
                            html += `<span class="tl-sub-actions"><span class="action-icon pi pi-pencil" onclick="toggleRowMenu(event, this)" title="Actions"></span>`;
                            html += `<div class="row-dropdown">`;
                            entry.actions.forEach(a => {
                                html += `<div class="rd-item" onclick="handleAction('${a}', event)">${a}</div>`;
                            });
                            html += `</div></span>`;
                        }
                    }

                    html += `</div>`; /* tl-sub-item */
                });

                html += `</div></div></div>`; /* tl-event-card, p-timeline-event-content, p-timeline-event */
            });

            html += `</div>`; /* p-timeline */
        });
    }

    html += `<div class="load-more-bar"><button class="load-more-btn" onclick="handleLoadMore()"><i class="pi pi-arrow-down"></i> Load More</button></div>`;
    container.innerHTML = html;
}

/* ===========================================================================
   FILTERING
   Angular: TimelineFilterService.applyFilters() with combineLatest
   =========================================================================== */

function filterTimelineData() {
    return TimelineData.map(dateGroup => {
        const filtered = dateGroup.entries.filter(entry => {
            const roleMatch = currentRoleFilters.includes('All') || currentRoleFilters.includes(entry.role);
            const typeMatch = currentTypeFilters.includes('All') || currentTypeFilters.includes(entry.type);
            const searchMatch = !searchQuery ||
                entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.dept.toLowerCase().includes(searchQuery.toLowerCase());
            return roleMatch && typeMatch && searchMatch;
        });
        return { date: dateGroup.date, entries: filtered };
    }).filter(dg => dg.entries.length > 0);
}

/* ===========================================================================
   GROUPING
   Angular: pure pipe in TimelineService
   =========================================================================== */

function groupEntries(entries) {
    const groups = [];
    let currentGroup = null;
    entries.forEach(entry => {
        if (currentGroup &&
            currentGroup[0].time   === entry.time &&
            currentGroup[0].type   === entry.type &&
            currentGroup[0].author === entry.author) {
            currentGroup.push(entry);
        } else {
            currentGroup = [entry];
            groups.push(currentGroup);
        }
    });
    return groups;
}

/* ===========================================================================
   EVENT BINDING
   Angular: (click) / (input) template bindings + reactive forms
   =========================================================================== */

function bindEvents() {
    /* Time filter */
    document.querySelectorAll('.sb-option').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.sb-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTimeFilter = this.dataset.value;
            renderTimeline();
        });
    });

    /* Search */
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchQuery = this.value;
            renderTimeline();
        });
    }

    /* Close open panels on outside click */
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.tl-actions')) {
            document.querySelectorAll('.row-dropdown').forEach(d => d.classList.remove('show'));
        }
        if (!e.target.closest('.multi-select-wrapper')) {
            document.querySelectorAll('.multi-select-panel').forEach(d => d.classList.remove('show'));
        }
        if (!e.target.closest('.column-toggle-wrapper')) {
            document.querySelectorAll('.column-panel').forEach(d => d.classList.remove('show'));
        }
    });
}

/* ===========================================================================
   UI CONTROLS — role filter, type filter, column visibility
   =========================================================================== */

function toggleRowMenu(event, el) {
    event.stopPropagation();
    const dd = el.nextElementSibling;
    document.querySelectorAll('.row-dropdown').forEach(d => { if (d !== dd) d.classList.remove('show'); });
    dd.classList.toggle('show');
}

function toggleMultiSelect() {
    document.getElementById('rolePanel').classList.toggle('show');
}

function updateRoleFilter(checkbox) {
    const val = checkbox.value;
    if (val === 'All') {
        if (checkbox.checked) {
            currentRoleFilters = ['All'];
            document.querySelectorAll('#rolePanel input[type="checkbox"]').forEach(cb => {
                cb.checked = cb.value === 'All';
            });
        }
    } else {
        const allCb = document.querySelector('#rolePanel input[value="All"]');
        if (allCb) allCb.checked = false;
        currentRoleFilters = currentRoleFilters.filter(r => r !== 'All');
        if (checkbox.checked) {
            currentRoleFilters.push(val);
        } else {
            currentRoleFilters = currentRoleFilters.filter(r => r !== val);
        }
        if (currentRoleFilters.length === 0) {
            currentRoleFilters = ['All'];
            if (allCb) allCb.checked = true;
        }
    }
    const label = document.getElementById('roleLabel');
    if (label) label.textContent = currentRoleFilters.includes('All') ? 'All Roles' : currentRoleFilters.join(', ');
    renderTimeline();
}

function toggleTypeSelect() {
    document.getElementById('typePanel').classList.toggle('show');
}

function updateTypeFilter(checkbox) {
    const val = checkbox.value;
    if (val === 'All') {
        if (checkbox.checked) {
            currentTypeFilters = ['All'];
            document.querySelectorAll('#typePanel input[type="checkbox"]').forEach(cb => {
                cb.checked = cb.value === 'All';
            });
        }
    } else {
        const allCb = document.querySelector('#typePanel input[value="All"]');
        if (allCb) allCb.checked = false;
        currentTypeFilters = currentTypeFilters.filter(t => t !== 'All');
        if (checkbox.checked) {
            currentTypeFilters.push(val);
        } else {
            currentTypeFilters = currentTypeFilters.filter(t => t !== val);
        }
        if (currentTypeFilters.length === 0) {
            currentTypeFilters = ['All'];
            if (allCb) allCb.checked = true;
        }
    }
    const label = document.getElementById('typeLabel');
    if (label) label.textContent = currentTypeFilters.includes('All') ? 'All Types' : currentTypeFilters.join(', ');
    renderTimeline();
}

function toggleColumnPanel() {
    document.getElementById('columnPanel').classList.toggle('show');
}

function toggleColumn(checkbox) {
    visibleColumns[checkbox.value] = checkbox.checked;
    renderTimeline();
}

function handleAction(action, event) {
    if (event) event.stopPropagation();
    console.log('Action triggered:', action);
}

function handleLoadMore() {
    console.log('Load more triggered');
}

/* ===========================================================================
   INIT
   Angular: ngOnInit() in TimelineComponent
   =========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('timelineContainer')) {
        renderTimeline();
    }
    bindEvents();
});

/* ===========================================================================
   NOTE EDITOR — Physical Examination Progress Note
   Fixed bottom panel with rich-text toolbar.
   Angular equivalent: NoteEditorPanelComponent
   =========================================================================== */

var _noteEditorExpanded = false;

/**
 * Opens the note editor panel, populates the author from the active patient
 * data, and gives focus to the contenteditable area.
 */
function openNoteEditor() {
    var panel = document.getElementById('noteEditorPanel');
    if (!panel) return;

    /* Populate patient and author names from the clinical data service */
    var patient = PatientData;
    var authorName  = (patient && patient.attendingPhysician) ? patient.attendingPhysician : 'Physician';
    var patientName = (patient && patient.name) ? patient.name : '';
    var authorEl  = document.getElementById('noteEditorAuthorName');
    var patientEl = document.getElementById('noteEditorPatientName');
    if (authorEl)  authorEl.textContent  = authorName;
    if (patientEl) patientEl.textContent = patientName;

    panel.classList.add('open');
    _noteEditorExpanded = false;
    panel.classList.remove('expanded');
    /* Reset expand button active state */
    var expandBtn = document.getElementById('neTbExpand');
    if (expandBtn) expandBtn.classList.remove('active');

    /* Add padding to timeline so content isn't hidden behind the panel */
    var timelineArea = document.getElementById('timeline-area');
    if (timelineArea) timelineArea.style.paddingBottom = '350px';

    /* Give focus to the editable area after the slide animation */
    setTimeout(function () {
        var body = document.getElementById('noteEditorBody');
        if (body) body.focus();
        noteEditorUpdateStatus();
    }, 300);

    /* Attach selectionchange listener once — update status whenever selection
       changes while the editor panel is open (more reliable than keyup/mouseup) */
    if (!openNoteEditor._selectionListenerAttached) {
        document.addEventListener('selectionchange', function () {
            var panel = document.getElementById('noteEditorPanel');
            var body  = document.getElementById('noteEditorBody');
            if (panel && panel.classList.contains('open') && body) {
                /* Only update if selection is inside the editor body */
                var sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                    var node = sel.getRangeAt(0).startContainer;
                    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
                    if (body.contains(node)) {
                        noteEditorUpdateStatus();
                        noteEditorRefreshToolbarState();
                    }
                }
            }
        });
        openNoteEditor._selectionListenerAttached = true;
    }
}

/**
 * Closes (slides down) the note editor panel.
 * Content is preserved so the clinician can reopen without losing work.
 */
function closeNoteEditor() {
    var panel = document.getElementById('noteEditorPanel');
    if (panel) {
        panel.classList.remove('open');
    }
    /* Restore timeline padding */
    var timelineArea = document.getElementById('timeline-area');
    if (timelineArea) timelineArea.style.paddingBottom = '';
}

/**
 * Executes a document.execCommand formatting command against the
 * contenteditable note body.
 * @param {string} cmd - execCommand command name
 */
function noteEditorCmd(cmd) {
    var body = document.getElementById('noteEditorBody');
    if (!body) return;
    body.focus();
    document.execCommand(cmd, false, null);
    noteEditorUpdateStatus();
    noteEditorRefreshToolbarState();
}

/**
 * Applies a block-level heading or format via the Format dropdown.
 * @param {string} tag - HTML tag name ('h1', 'h2', 'p', 'pre', etc.)
 */
function noteEditorFormat(tag) {
    var body = document.getElementById('noteEditorBody');
    if (!body) return;
    body.focus();
    document.execCommand('formatBlock', false, '<' + tag + '>');
    noteEditorUpdateStatus();
}

/**
 * Handles the Format <select> dropdown change.
 * @param {HTMLSelectElement} selectEl
 */
function noteEditorFormatBlock(selectEl) {
    var tag = selectEl.value;
    if (!tag) return;
    noteEditorFormat(tag);
    /* Reset the select to placeholder after applying */
    setTimeout(function () { selectEl.value = ''; }, 100);
}

/**
 * Changes the font size of the selected text.
 * @param {number} size - execCommand fontSize value (1-7)
 */
function noteEditorFontSize(size) {
    var body = document.getElementById('noteEditorBody');
    if (!body) return;
    body.focus();
    document.execCommand('fontSize', false, size);
    noteEditorUpdateStatus();
}

/**
 * Toggles the editor between normal and expanded (taller) mode.
 */
function noteEditorToggleExpand() {
    var panel = document.getElementById('noteEditorPanel');
    var btn   = document.getElementById('neTbExpand');
    if (!panel) return;
    _noteEditorExpanded = !_noteEditorExpanded;
    panel.classList.toggle('expanded', _noteEditorExpanded);
    if (btn) btn.classList.toggle('active', _noteEditorExpanded);
    /* Adjust timeline bottom padding to match new panel height */
    var timelineArea = document.getElementById('timeline-area');
    if (timelineArea) {
        timelineArea.style.paddingBottom = _noteEditorExpanded ? '540px' : '350px';
    }
}

/**
 * Opens a minimal print dialog containing only the note body content.
 */
function noteEditorPrint() {
    var body = document.getElementById('noteEditorBody');
    if (!body) return;
    var content = body.innerHTML || '';
    var win = window.open('', '_blank', 'width=700,height=500');
    if (!win) return;
    win.document.write(
        '<!DOCTYPE html><html><head><title>Progress Note</title>' +
        '<style>body{font-family:Arial,sans-serif;font-size:13px;padding:20px;color:#333}' +
        'h1{font-size:1.3em}h2{font-size:1.1em}pre{background:#f5f5f5;padding:8px}</style>' +
        '</head><body>' + content + '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
    win.close();
}

/**
 * Inserts a structured medical history template snippet at the cursor
 * position inside the note body.
 */
function noteEditorInsertMedHistory() {
    var body = document.getElementById('noteEditorBody');
    if (!body) return;
    body.focus();

    var patient = PatientData;
    var name    = patient ? patient.name : 'Patient';
    var dob     = patient ? patient.dob  : '';
    var problem = patient ? patient.medicalProblem : '';

    var snippet =
        '<h2>Medical History</h2>' +
        '<p><strong>Patient:</strong> ' + name + (dob ? ' &nbsp;|&nbsp; DOB: ' + dob : '') + '</p>' +
        '<p><strong>Chief complaint:</strong> ' + (problem || '') + '</p>' +
        '<p><strong>Allergies:</strong> ' +
        (patient && patient.alerts ? patient.alerts.join(', ') : 'None known') + '</p>' +
        '<p><strong>Current medications:</strong> </p>' +
        '<p><strong>Past medical history:</strong> </p>' +
        '<hr>';

    document.execCommand('insertHTML', false, snippet);
    noteEditorUpdateStatus();
}

/**
 * Updates the status bar text to reflect the current cursor context
 * (tag name of the element containing the cursor).
 */
function noteEditorUpdateStatus() {
    var statusBar = document.getElementById('noteEditorStatusBar');
    if (!statusBar) return;
    var sel = window.getSelection();
    var tag = 'body';
    if (sel && sel.rangeCount > 0) {
        var node = sel.getRangeAt(0).startContainer;
        /* Walk up to the nearest element */
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        var body = document.getElementById('noteEditorBody');
        /* Collect ancestor tags up to (but not including) the editor body */
        var tags = [];
        while (node && node !== body && node.nodeType === Node.ELEMENT_NODE) {
            tags.unshift(node.tagName.toLowerCase());
            node = node.parentNode;
        }
        if (tags.length > 0) tag = tags.join(' > ');
    }
    statusBar.textContent = tag;
}

/**
 * Refreshes the active/inactive state of the B / I / U / S toolbar buttons
 * based on the current selection's computed formatting state.
 */
function noteEditorRefreshToolbarState() {
    var cmds = { bold: 'neTbBold', italic: 'neTbItalic', underline: 'neTbUnder', strikeThrough: 'neTbStrike' };
    Object.keys(cmds).forEach(function (cmd) {
        var btn = document.getElementById(cmds[cmd]);
        if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
    });
}
