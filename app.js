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
                    html += `<div class="tl-sub-item">`;

                    /* Description */
                    if (visibleColumns.description) {
                        if (entry.docId) {
                            const statusTag = DocPreview.getStatusTag(entry.docStatus);
                            html += `<span class="tl-description tl-doc-desc">` +
                                `<span class="tl-doc-link" onclick="tlOpenDocModal('${entry.docId}')">${entry.description}</span>` +
                                `<span class="tl-doc-meta">${entry.docType}&nbsp;·&nbsp;${statusTag}</span>` +
                                `</span>`;
                        } else {
                            html += `<span class="tl-description">${entry.description}</span>`;
                        }
                    }

                    /* Actions */
                    if (visibleColumns.actions) {
                        if (entry.docId) {
                            html += `<span class="tl-sub-actions">` +
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
