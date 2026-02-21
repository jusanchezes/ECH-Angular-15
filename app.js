/**
 * @file app.js — Timeline-Specific Logic
 * @description Prototype script for the EHR Patient Timeline view.
 *   Handles timeline rendering, filtering, and timeline-specific UI interactions.
 *   Shared shell functions (sidebar, header, banner, alerts, user menu) are now in layout.js.
 *   In production Angular 15, this becomes TimelineComponent + TimelineService.
 *   Mock data (PatientData, TimelineData) will be replaced by Angular HttpClient
 *   calls to Java REST API endpoints returning DTOs.
 */

/** Mock patient context data. Angular: replaced by PatientService.getPatient() → PatientDTO from Java REST API */
const PatientData = {
    name: "THOMAS MEYER WOOD",
    dob: "11/07/1990",
    age: 35,
    gender: "Male",
    genderIcon: "pi-user",
    recId: 46,
    episode: 283,
    room: "Bed 201",
    department: "Adult Emergency",
    client: "CLIENTE 01",
    daysAdmitted: 514,
    allergies: [
        { label: "Penicillin Allergy", severity: "danger" },
        { label: "Latex Allergy", severity: "danger" }
    ],
    risks: [
        { label: "Fall Risk", severity: "warning" },
        { label: "VTE Risk", severity: "info" }
    ],
    dnr: true,
    hospital: "Healthcare Provider A1",
    ward: "Inpatients",
    currentDate: "20/02/2026",
    attendingPhysician: "Dr. Rory Rogers",
    serviceUnit: "A1MGCARD - Cardiology"
};

/** Mock timeline entries. Angular: replaced by TimelineService.getEntries() → TimelineEntryDTO[] from Java REST API */
const TimelineData = [
    {
        date: "Thursday 2 October 2025",
        entries: [
            { time: "17:44", type: "Exam", dept: "Radiology", description: "Contrast-Enhanced Ultrasound (CEUS) Requested", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] },
            { time: "17:44", type: "Exam", dept: "Radiology", description: "MRI of the Spine", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] },
            { time: "17:44", type: "Exam", dept: "Radiology", description: "Comparative Hip X-Ray", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "Delete", "View Details"] }
        ]
    },
    {
        date: "Thursday 9 October 2025",
        entries: [
            { time: "12:37", type: "Surgery", dept: "Cardiology", description: "Aortic Aneurysm Repair - Surgery Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Cancel", "View Details"] }
        ]
    },
    {
        date: "Wednesday 15 October 2025",
        entries: [
            { time: "10:52", type: "Images", dept: "Radiology", description: "CT Abdomen - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "Cardiology", actions: ["View Images", "View Details"] },
            { time: "10:52", type: "Images", dept: "Cardiology", description: "Holter Monitoring (24-Hour ECG Recording) - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["View Images", "View Details"] },
            { time: "11:14", type: "Exam", dept: "Laboratory", description: "Laboratory Test Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] },
            { time: "14:56", type: "Images", dept: "Laboratory", description: "Laboratory - Images Series", author: "Dr. Rory Rogers", role: "Physician", card: "Cardiology", actions: ["View Images"] },
            { time: "21:35", type: "Exam", dept: "Radiology", description: "Cervical Spine X-Ray Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] }
        ]
    },
    {
        date: "Thursday 16 October 2025",
        entries: [
            { time: "10:33", type: "Care", dept: "Nursing", description: "Establish optimal analgesic dosage for optimal pain relief - Every 24 Hours", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Details"] },
            { time: "10:33", type: "Surgery", dept: "Cardiology", description: "Cholecystectomy - Surgery Request", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Cancel", "View Details"] },
            { time: "14:20", type: "Medication", dept: "Nursing", description: "Enoxaparin 40mg SC administered", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View MAR"] },
            { time: "15:00", type: "Note", dept: "Adult Emergency", description: "Patient reviewed - stable overnight, oxygen 2L nasal cannula", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Delete"] },
            { time: "16:45", type: "Vitals", dept: "Nursing", description: "BP 128/82, HR 76, Temp 36.8°C, SpO2 97%", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["View Chart"] }
        ]
    },
    {
        date: "Friday 17 October 2025",
        entries: [
            { time: "08:00", type: "Note", dept: "Adult Emergency", description: "Morning round - Patient comfortable, no acute complaints", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "Delete"] },
            { time: "09:30", type: "Medication", dept: "Pharmacy", description: "Metoprolol 50mg PO administered", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View MAR"] },
            { time: "11:00", type: "Exam", dept: "Laboratory", description: "Complete Blood Count + Metabolic Panel", author: "Dr. Rory Rogers", role: "Physician", card: "A1MGCARD - Cardiology", actions: ["Edit", "View Results"] },
            { time: "14:15", type: "Care", dept: "Nursing", description: "Wound dressing change - Surgical site clean, no signs of infection", author: "Nurs. Adam Dixon", role: "Nursing", card: "A1MGCARD - Nursing", actions: ["Edit", "View Details"] }
        ]
    }
];

/** Timeline filter state. Angular: managed by TimelineFilterService with BehaviorSubject observables */
let currentTimeFilter = 'full';
let currentRoleFilters = ['All'];
let searchQuery = '';
let visibleColumns = {
    time: true,
    type: true,
    dept: true,
    description: true,
    card: true,
    actions: true
};

/** Renders the timeline view. Angular: replaced by TimelineComponent template with <p-timeline> and async pipe. @see TimelineService.getFilteredEntries() */
function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    let html = '';
    const filteredData = filterTimelineData();

    const typeIconMap = {
        'Exam': 'pi-file',
        'Surgery': 'pi-heart',
        'Medication': 'pi-box',
        'Note': 'pi-pencil',
        'Images': 'pi-image',
        'Care': 'pi-shield',
        'Vitals': 'pi-chart-line'
    };


    if (filteredData.length === 0) {
        html = `<div class="p-3 text-center text-color-secondary"><i class="pi pi-info-circle"></i> <span data-i18n="TIMELINE.NO_RESULTS">No timeline entries match the current filters.</span></div>`;
    } else {
        filteredData.forEach(dateGroup => {
            html += `<div class="timeline-date-header"><i class="pi pi-calendar"></i> ${dateGroup.date}</div>`;
            html += `<div class="p-timeline p-timeline-vertical p-timeline-left">`;

            const grouped = groupEntries(dateGroup.entries);

            grouped.forEach((group, idx) => {
                const first = group[0];
                const icon = typeIconMap[first.type] || 'pi-circle';
                const isLast = idx === grouped.length - 1;

                html += `<div class="p-timeline-event" data-type="${first.type}" data-role="${first.role}">`;

                html += `<div class="p-timeline-event-opposite">`;
                if (visibleColumns.time) html += `<span class="tl-time">${first.time}</span>`;
                html += `</div>`;

                html += `<div class="p-timeline-event-separator">`;
                html += `<div class="p-timeline-event-marker" data-type-color="${first.type}"><i class="pi ${icon} tl-marker-icon"></i></div>`;
                if (!isLast) html += `<div class="p-timeline-event-connector"></div>`;
                html += `</div>`;

                html += `<div class="p-timeline-event-content">`;
                html += `<div class="tl-event-card">`;

                let headerParts = [];
                if (visibleColumns.type) headerParts.push(`<span class="tl-type tl-type-${first.type.toLowerCase()}" data-i18n="TYPE.${first.type.toUpperCase()}"><i class="pi ${icon}"></i> ${first.type}</span>`);
                if (visibleColumns.dept) headerParts.push(`<span class="tl-dept">${first.dept}</span>`);
                headerParts.push(`<span class="tl-role">${first.author}</span>`);
                if (visibleColumns.card) headerParts.push(`<span class="tl-card-tag">${first.card}</span>`);
                html += `<div class="tl-event-header">${headerParts.join('<span class="tl-sep">·</span>')}</div>`;

                group.forEach(entry => {
                    html += `<div class="tl-sub-item">`;
                    if (visibleColumns.description) {
                        html += `<span class="tl-description">${entry.description}</span>`;
                    }
                    if (visibleColumns.actions) {
                        html += `<span class="tl-sub-actions"><span class="action-icon pi pi-pencil" onclick="toggleRowMenu(event, this)" data-i18n-title="ACTIONS.MENU_TITLE" title="Actions"></span>`;
                        html += `<div class="row-dropdown">`;
                        entry.actions.forEach(a => {
                            const actionKey = a.replace(/\s+/g, '_').toUpperCase();
                            html += `<div class="rd-item" onclick="handleAction('${a}', event)" data-i18n="ACTIONS.${actionKey}">${a}</div>`;
                        });
                        html += `</div></span>`;
                    }
                    html += `</div>`;
                });

                html += `</div>`;
                html += `</div>`;
                html += `</div>`;
            });

            html += `</div>`;
        });
    }

    html += `<div class="load-more-bar"><button class="load-more-btn" onclick="handleLoadMore()"><i class="pi pi-arrow-down"></i> <span data-i18n="TIMELINE.LOAD_MORE">Load More</span></button></div>`;
    container.innerHTML = html;
}

/** Groups timeline entries by time+type+author for visual clustering. Angular: pure pipe or utility in TimelineService */
function groupEntries(entries) {
    const groups = [];
    let currentGroup = null;

    entries.forEach(entry => {
        if (currentGroup && currentGroup[0].time === entry.time && currentGroup[0].type === entry.type && currentGroup[0].author === entry.author) {
            currentGroup.push(entry);
        } else {
            currentGroup = [entry];
            groups.push(currentGroup);
        }
    });

    return groups;
}

/** Filters timeline data by role and search query. Angular: replaced by TimelineFilterService.applyFilters() with combineLatest */
function filterTimelineData() {
    return TimelineData.map(dateGroup => {
        const filtered = dateGroup.entries.filter(entry => {
            const roleMatch = currentRoleFilters.includes('All') || currentRoleFilters.includes(entry.role);
            const searchMatch = !searchQuery || 
                entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.dept.toLowerCase().includes(searchQuery.toLowerCase());
            return roleMatch && searchMatch;
        });
        return { date: dateGroup.date, entries: filtered };
    }).filter(dg => dg.entries.length > 0);
}

/** Binds UI event listeners for filters and dropdowns. Angular: replaced by (click) and (input) template bindings + reactive forms */
function bindEvents() {
    document.querySelectorAll('.sb-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sb-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTimeFilter = this.dataset.value;
            renderTimeline();
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            renderTimeline();
        });
    }

    document.addEventListener('click', function(e) {
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


/** Toggles row-level action dropdown menu. Angular: PrimeNG p-menu with (click) binding */
function toggleRowMenu(event, el) {
    event.stopPropagation();
    const dd = el.nextElementSibling;
    document.querySelectorAll('.row-dropdown').forEach(d => {
        if (d !== dd) d.classList.remove('show');
    });
    dd.classList.toggle('show');
}

/** Toggles the role multi-select filter panel. Angular: replaced by PrimeNG p-multiSelect component */
function toggleMultiSelect() {
    const panel = document.getElementById('rolePanel');
    panel.classList.toggle('show');
}

/** Updates active role filters and re-renders timeline. Angular: ReactiveFormsModule with valueChanges observable */
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
    if (label) {
        label.textContent = currentRoleFilters.includes('All') ? 'All Roles' : currentRoleFilters.join(', ');
    }
    renderTimeline();
}

/** Toggles column visibility configuration panel. Angular: PrimeNG p-multiSelect for column chooser */
function toggleColumnPanel() {
    const panel = document.getElementById('columnPanel');
    panel.classList.toggle('show');
}

/** Toggles individual column visibility. Angular: bound to p-table [columns] property */
function toggleColumn(checkbox) {
    const col = checkbox.value;
    visibleColumns[col] = checkbox.checked;
    renderTimeline();
}

/** Handles row-level action clicks. Angular: replaced by ClinicalActionService.execute(action, entryId) */
function handleAction(action, event) {
    if (event) event.stopPropagation();
    console.log('Action triggered:', action);
}

/** Handles "Load More" pagination. Angular: TimelineService.loadNextPage() with scroll-based pagination */
function handleLoadMore() {
    console.log('Load more triggered');
}

/** Initializes timeline on page load. Angular: replaced by ngOnInit() in TimelineComponent */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('timelineContainer')) {
        renderTimeline();
    }
    bindEvents();
});
