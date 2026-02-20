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

function init() {
    renderTimeline();
    bindEvents();
}

function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    let html = '';
    const filteredData = filterTimelineData();

    filteredData.forEach(dateGroup => {
        html += `<div class="timeline-date-header"><i class="pi pi-calendar"></i> ${dateGroup.date}</div>`;

        dateGroup.entries.forEach(entry => {
            const typeIconMap = {
                'Exam': 'pi-file',
                'Surgery': 'pi-heart',
                'Medication': 'pi-box',
                'Note': 'pi-pencil',
                'Images': 'pi-image',
                'Care': 'pi-shield',
                'Vitals': 'pi-chart-line'
            };
            const icon = typeIconMap[entry.type] || 'pi-circle';

            html += `<div class="timeline-row" data-type="${entry.type}" data-role="${entry.role}">`;
            if (visibleColumns.time) html += `<div class="tl-time">${entry.time}</div>`;
            if (visibleColumns.type) html += `<div class="tl-type"><i class="pi ${icon}"></i> ${entry.type}</div>`;
            if (visibleColumns.dept) html += `<div class="tl-dept">${entry.dept}</div>`;
            if (visibleColumns.description) html += `<div class="tl-description">${entry.description}<div class="tl-author"><i class="pi pi-user"></i> ${entry.author}</div></div>`;
            if (visibleColumns.card) html += `<div class="tl-card-tag">${entry.card}</div>`;
            if (visibleColumns.actions) {
                html += `<div class="tl-actions"><span class="action-icon pi pi-pencil" onclick="toggleRowMenu(event, this)"></span>`;
                html += `<div class="row-dropdown">`;
                entry.actions.forEach(a => {
                    html += `<div class="rd-item" onclick="handleAction('${a}', event)">${a}</div>`;
                });
                html += `</div></div>`;
            }
            html += `</div>`;
        });
    });

    if (filteredData.length === 0) {
        html = `<div style="padding: 20px; text-align: center; color: var(--ech-text-secondary);"><i class="pi pi-info-circle"></i> No timeline entries match the current filters.</div>`;
    }

    html += `<div class="load-more-bar"><button class="load-more-btn" onclick="handleLoadMore()"><i class="pi pi-arrow-down"></i> Load More</button></div>`;
    container.innerHTML = html;
    updateGridColumns();
}

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

function updateGridColumns() {
    const cols = [];
    if (visibleColumns.time) cols.push('55px');
    if (visibleColumns.type) cols.push('95px');
    if (visibleColumns.dept) cols.push('100px');
    if (visibleColumns.description) cols.push('1fr');
    if (visibleColumns.card) cols.push('80px');
    if (visibleColumns.actions) cols.push('30px');

    document.querySelectorAll('.timeline-row').forEach(row => {
        row.style.gridTemplateColumns = cols.join(' ');
    });
}

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
        if (!e.target.closest('.split-btn') && !e.target.closest('.split-dropdown')) {
            document.querySelectorAll('.split-dropdown').forEach(d => d.classList.remove('show'));
        }
        if (!e.target.closest('.multi-select-wrapper')) {
            document.querySelectorAll('.multi-select-panel').forEach(d => d.classList.remove('show'));
        }
        if (!e.target.closest('.column-toggle-wrapper')) {
            document.querySelectorAll('.column-panel').forEach(d => d.classList.remove('show'));
        }
        if (e.target.classList.contains('alert-menu-overlay')) {
            e.target.classList.remove('show');
        }
        if (e.target.classList.contains('sidebar-overlay')) {
            closeSidebar();
        }
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

function toggleSplitMenu() {
    const dd = document.getElementById('splitDropdown');
    dd.classList.toggle('show');
}

function toggleRowMenu(event, el) {
    event.stopPropagation();
    const dd = el.nextElementSibling;
    document.querySelectorAll('.row-dropdown').forEach(d => {
        if (d !== dd) d.classList.remove('show');
    });
    dd.classList.toggle('show');
}

function toggleMultiSelect() {
    const panel = document.getElementById('rolePanel');
    panel.classList.toggle('show');
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
    if (label) {
        label.textContent = currentRoleFilters.includes('All') ? 'All Roles' : currentRoleFilters.join(', ');
    }
    renderTimeline();
}

function toggleColumnPanel() {
    const panel = document.getElementById('columnPanel');
    panel.classList.toggle('show');
}

function toggleColumn(checkbox) {
    const col = checkbox.value;
    visibleColumns[col] = checkbox.checked;
    renderTimeline();
}

function toggleAlertMenu() {
    const overlay = document.getElementById('alertOverlay');
    overlay.classList.toggle('show');
}

function handleAction(action, event) {
    if (event) event.stopPropagation();
    console.log('Action triggered:', action);
}

function handleLoadMore() {
    console.log('Load more triggered');
}

function handleQuickAction(action) {
    console.log('Quick action:', action);
}

document.addEventListener('DOMContentLoaded', init);
