var opAppointments = [
    { id: 201, name: 'María García López',      dob: '1958-03-14', age: 67, gender: 'Female', mrn: '46283', scheduledTime: '08:30', visitType: 'Follow-up',           reason: 'Hypertension review',      status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: ['Allergy: Penicillin', 'High-Risk Meds'],  doctor: 'Dr. Rory Rogers',  room: 'Room 2',           department: 'Cardiology'       },
    { id: 202, name: 'Carlos Martínez Ruiz',    dob: '1970-07-22', age: 55, gender: 'Male',   mrn: '31874', scheduledTime: '09:00', visitType: 'New Patient',          reason: 'Chest pain evaluation',    status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: [],                                          doctor: 'Dr. Fernández',    room: 'Room 1',           department: 'Cardiology'       },
    { id: 203, name: 'Elena Rodríguez Díaz',    dob: '1985-11-03', age: 40, gender: 'Female', mrn: '52910', scheduledTime: '09:00', visitType: 'Specialist Referral',  reason: 'Joint inflammation',       status: 'Completed',       waitMin: 0,  delayMin: 5,  alerts: ['Allergy: Sulfa'],                          doctor: 'Dr. López',        room: 'Room 3',           department: 'Rheumatology'     },
    { id: 204, name: 'José Antonio Pérez',      dob: '1962-01-19', age: 64, gender: 'Male',   mrn: '18453', scheduledTime: '09:30', visitType: 'Follow-up',           reason: 'Diabetes management',     status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: ['High-Risk Meds', 'Fall Risk'],             doctor: 'Dr. Moreno',       room: 'Room 4',           department: 'Internal Medicine'},
    { id: 205, name: 'Lucía Hernández Gil',     dob: '1990-05-30', age: 35, gender: 'Female', mrn: '67021', scheduledTime: '09:30', visitType: 'Annual Check-up',     reason: 'Routine health review',    status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: [],                                          doctor: 'Dr. Rory Rogers',  room: 'Room 2',           department: 'Cardiology'       },
    { id: 206, name: 'Fernando Muñoz Vega',     dob: '1955-09-11', age: 70, gender: 'Male',   mrn: '29384', scheduledTime: '10:00', visitType: 'Post-op',             reason: 'Post-op knee review',     status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: ['Fall Risk', 'Pacemaker'],                  doctor: 'Dr. Navarro',      room: 'Consulting Room A', department: 'Oncology'         },
    { id: 207, name: 'Ana Belén Torres',        dob: '1978-12-25', age: 47, gender: 'Female', mrn: '74562', scheduledTime: '10:00', visitType: 'Follow-up',           reason: 'Thyroid levels check',    status: 'Completed',       waitMin: 0,  delayMin: 8,  alerts: [],                                          doctor: 'Dr. López',        room: 'Room 1',           department: 'Internal Medicine'},
    { id: 208, name: 'Miguel Ángel Soto',       dob: '1948-04-07', age: 77, gender: 'Male',   mrn: '38291', scheduledTime: '10:30', visitType: 'Specialist Referral', reason: 'Haematology review',      status: 'Completed',       waitMin: 0,  delayMin: 0,  alerts: ['DNR', 'Fall Risk'],                        doctor: 'Dr. Fernández',    room: 'Room 3',           department: 'Hematology'       },
    { id: 209, name: 'Isabel Romero Castro',    dob: '1966-08-16', age: 59, gender: 'Female', mrn: '91047', scheduledTime: '11:00', visitType: 'Review',              reason: 'Anaemia management',      status: 'In Consultation', waitMin: 8,  delayMin: 0,  alerts: ['Allergy: Iodine'],                         doctor: 'Dr. Rory Rogers',  room: 'Room 2',           department: 'Cardiology'       },
    { id: 210, name: 'Pablo Jiménez Reyes',     dob: '1982-02-28', age: 44, gender: 'Male',   mrn: '55673', scheduledTime: '11:00', visitType: 'Follow-up',           reason: 'Asthma control',          status: 'In Consultation', waitMin: 12, delayMin: 0,  alerts: ['High-Risk Meds'],                          doctor: 'Dr. Moreno',       room: 'Room 4',           department: 'Internal Medicine'},
    { id: 211, name: 'Rosa María Delgado',      dob: '1973-06-09', age: 52, gender: 'Female', mrn: '43802', scheduledTime: '11:30', visitType: 'New Patient',         reason: 'Referred for oncology',   status: 'Waiting',         waitMin: 14, delayMin: 0,  alerts: ['Allergy: Contrast', 'Neutropenia'],        doctor: 'Dr. Navarro',      room: 'Consulting Room B', department: 'Oncology'         },
    { id: 212, name: 'Andrés Vargas Pinto',     dob: '1951-10-05', age: 74, gender: 'Male',   mrn: '82736', scheduledTime: '11:30', visitType: 'Annual Check-up',     reason: 'Cardiovascular check',    status: 'Waiting',         waitMin: 7,  delayMin: 5,  alerts: ['Fall Risk', 'Isolation'],                  doctor: 'Dr. Rory Rogers',  room: 'Room 2',           department: 'Cardiology'       },
    { id: 213, name: 'Sofía Medina Ortiz',      dob: '1995-04-18', age: 30, gender: 'Female', mrn: '16254', scheduledTime: '12:00', visitType: 'Follow-up',           reason: 'Rheumatoid arthritis',    status: 'Waiting',         waitMin: 3,  delayMin: 0,  alerts: [],                                          doctor: 'Dr. López',        room: 'Room 3',           department: 'Rheumatology'     },
    { id: 214, name: 'Ramón Flores Aguilar',    dob: '1960-12-01', age: 65, gender: 'Male',   mrn: '60918', scheduledTime: '12:00', visitType: 'Post-op',             reason: 'Post-surgery follow-up',  status: 'Waiting',         waitMin: 21, delayMin: 10, alerts: ['Allergy: NSAIDs', 'Seizure Risk'],          doctor: 'Dr. Navarro',      room: 'Consulting Room C', department: 'Oncology'         },
    { id: 215, name: 'Laura Castillo Vidal',    dob: '1988-09-02', age: 37, gender: 'Female', mrn: '30571', scheduledTime: '12:30', visitType: 'Specialist Referral', reason: 'Persistent migraines',    status: 'Waiting',         waitMin: 5,  delayMin: 0,  alerts: [],                                          doctor: 'Dr. Fernández',    room: 'Room 1',           department: 'Hematology'       },
    { id: 216, name: 'Diego Molina Reyes',      dob: '1975-03-17', age: 51, gender: 'Male',   mrn: '77430', scheduledTime: '13:00', visitType: 'Follow-up',           reason: 'Hypertension review',     status: 'Arrived',         waitMin: 0,  delayMin: 0,  alerts: [],                                          doctor: 'Dr. Rory Rogers',  room: 'Room 2',           department: 'Cardiology'       },
    { id: 217, name: 'Carmen Herrera Blanco',   dob: '1952-07-28', age: 73, gender: 'Female', mrn: '19843', scheduledTime: '13:00', visitType: 'Review',              reason: 'Lipid panel results',     status: 'Arrived',         waitMin: 0,  delayMin: 0,  alerts: ['Fall Risk'],                               doctor: 'Dr. López',        room: 'Room 3',           department: 'Internal Medicine'},
    { id: 218, name: 'Javier Ortega Santos',    dob: '1967-11-14', age: 58, gender: 'Male',   mrn: '48205', scheduledTime: '13:30', visitType: 'Annual Check-up',     reason: 'Diabetes annual review',  status: 'Arrived',         waitMin: 0,  delayMin: 0,  alerts: ['High-Risk Meds', 'Allergy: Penicillin'],   doctor: 'Dr. Moreno',       room: 'Room 4',           department: 'Internal Medicine'}
];

var opSortField = null;
var opSortAsc = true;
var opTabFilter = 'op-all';
var opScopeFilter = 'mine';
var opSearchTerm = '';

var OP_CURRENT_DATE = new Date(2026, 2, 22);

var OP_STATUS_ORDER = ['Arrived', 'Waiting', 'In Consultation', 'Completed', 'Cancelled'];

function opFormatNavDate(d) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yyyy = d.getFullYear();
    return days[d.getDay()] + ', ' + dd + '/' + mm + '/' + yyyy;
}

function opNavigateDay(delta) {
    OP_CURRENT_DATE = new Date(OP_CURRENT_DATE.getTime() + delta * 86400000);
    var label = document.getElementById('opDayLabel');
    if (label) label.textContent = opFormatNavDate(OP_CURRENT_DATE);
}

function renderOpToolbar() {
    var el = document.getElementById('toolbar-component');
    if (!el) return;
    el.innerHTML =
        '<div class="toolbar-inner">' +
            '<div class="toolbar-left">' +
                '<div class="scope-filter-group">' +
                    '<button class="scope-btn scope-btn-active" data-scope="mine" onclick="opHandleScopeChange(\'mine\')">' +
                        'My Patients' +
                    '</button>' +
                    '<button class="scope-btn" data-scope="dept" onclick="opHandleScopeChange(\'dept\')">' +
                        'My Department' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="toolbar-center">' +
                '<div class="op-day-nav">' +
                    '<button class="op-day-btn" onclick="opNavigateDay(-1)" title="Previous day"><i class="pi pi-chevron-left"></i></button>' +
                    '<span class="op-day-label" id="opDayLabel">' + opFormatNavDate(OP_CURRENT_DATE) + '</span>' +
                    '<button class="op-day-btn" onclick="opNavigateDay(1)" title="Next day"><i class="pi pi-chevron-right"></i></button>' +
                    '<button class="op-day-btn op-day-cal-btn" onclick="opOpenCalendar()" title="Pick date"><i class="pi pi-calendar"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="toolbar-right">' +
                '<div class="toolbar-search-wrapper">' +
                    '<i class="pi pi-search toolbar-search-icon"></i>' +
                    '<input type="text" class="toolbar-search-input" placeholder="Search Patient..." id="opSearch" oninput="filterOpList(this.value)">' +
                    '<span class="toolbar-search-badge" id="opSearchBadge">18</span>' +
                '</div>' +
                '<button class="op-walkin-btn" onclick="opAddWalkin()">' +
                    '<i class="pi pi-plus"></i> Add Walk-in' +
                '</button>' +
            '</div>' +
        '</div>';
}

function opHandleScopeChange(scope) {
    document.querySelectorAll('#toolbar-component .scope-btn').forEach(function (btn) {
        btn.classList.toggle('scope-btn-active', btn.getAttribute('data-scope') === scope);
    });
    opScopeFilter = scope;
    renderOpList();
}

function opOpenCalendar() {
    console.log('Calendar picker opened');
}

function opAddWalkin() {
    console.log('Add Walk-in clicked');
}

function updateOpTabCounts() {
    var all = opAppointments;
    var counts = {
        'op-all':            all.length,
        'op-arrived':        all.filter(function (a) { return a.status === 'Arrived'; }).length,
        'op-waiting':        all.filter(function (a) { return a.status === 'Waiting'; }).length,
        'op-inconsultation': all.filter(function (a) { return a.status === 'In Consultation'; }).length,
        'op-completed':      all.filter(function (a) { return a.status === 'Completed'; }).length
    };
    Object.keys(counts).forEach(function (tabId) {
        var btn = document.querySelector('[data-tab-id="' + tabId + '"]');
        if (btn) {
            var badge = btn.querySelector('.tab-count');
            if (badge) badge.textContent = counts[tabId];
        }
    });
}

function wireOpTabs() {
    var origHandleTabClick = window.handleTabClick;
    window.handleTabClick = function (tabId) {
        if (tabId.startsWith('op-')) {
            document.querySelectorAll('.tab-btn').forEach(function (btn) {
                btn.classList.remove('tab-btn-active');
            });
            var activeBtn = document.querySelector('[data-tab-id="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('tab-btn-active');
            opTabFilter = tabId;
            renderOpList();
        } else if (origHandleTabClick) {
            origHandleTabClick(tabId);
        }
    };
}

function getOpStatusClass(status) {
    var map = {
        'Arrived':        'op-status-arrived',
        'Waiting':        'op-status-waiting',
        'In Consultation':'op-status-inconsultation',
        'Completed':      'op-status-completed',
        'Cancelled':      'op-status-cancelled'
    };
    return map[status] || '';
}

function getOpAlertSeverity(alert) {
    if (alert.includes('Allergy') || alert.includes('High-Risk')) return 'danger';
    if (alert === 'DNR' || alert === 'Isolation') return 'dnr';
    if (alert.includes('Fall') || alert.includes('Seizure') || alert.includes('Neutropenia')) return 'warning';
    return 'info';
}

function getOpAlertIcon(alert) {
    if (alert === 'DNR') return 'pi-ban';
    if (alert === 'Isolation') return 'pi-lock';
    if (alert.includes('Allergy')) return 'pi-exclamation-circle';
    if (alert.includes('Fall') || alert.includes('Seizure')) return 'pi-exclamation-triangle';
    if (alert === 'Pacemaker') return 'pi-heart';
    return 'pi-info-circle';
}

function renderOpAlertChips(alerts) {
    if (!alerts || alerts.length === 0) return '<span class="no-alerts">\u2014</span>';
    var maxVisible = 2;
    var html = '';
    for (var i = 0; i < Math.min(alerts.length, maxVisible); i++) {
        var severity = getOpAlertSeverity(alerts[i]);
        var icon = getOpAlertIcon(alerts[i]);
        html += '<span class="p-tag-custom p-tag-' + severity + '" title="' + alerts[i] + '"><i class="pi ' + icon + '"></i></span> ';
    }
    if (alerts.length > maxVisible) {
        var remaining = alerts.length - maxVisible;
        var tooltipText = alerts.slice(maxVisible).join(', ');
        html += '<span class="p-tag-custom p-tag-info ed-alert-overflow" title="' + tooltipText + '">+' + remaining + '</span>';
    }
    return html;
}

function formatOpWaitDelay(appt) {
    if (appt.status === 'Completed') return '<span class="op-wait-done">\u2014</span>';
    if (appt.delayMin > 0) {
        return '<span class="op-delay-badge">' + appt.delayMin + ' min late</span>';
    }
    if (appt.waitMin > 0) {
        return '<span class="op-wait-text">' + appt.waitMin + ' min waiting</span>';
    }
    return '<span class="op-wait-done">\u2014</span>';
}

function getFilteredOpAppointments() {
    var list = opAppointments.slice();

    if (opTabFilter === 'op-arrived') {
        list = list.filter(function (a) { return a.status === 'Arrived'; });
    } else if (opTabFilter === 'op-waiting') {
        list = list.filter(function (a) { return a.status === 'Waiting'; });
    } else if (opTabFilter === 'op-inconsultation') {
        list = list.filter(function (a) { return a.status === 'In Consultation'; });
    } else if (opTabFilter === 'op-completed') {
        list = list.filter(function (a) { return a.status === 'Completed'; });
    }

    if (opScopeFilter === 'mine') {
        list = list.filter(function (a) { return a.doctor === CURRENT_USER.name; });
    } else if (opScopeFilter === 'dept') {
        list = list.filter(function (a) { return a.department === CURRENT_USER.department; });
    }

    if (opSearchTerm) {
        list = list.filter(function (a) {
            var text = (a.name + ' ' + a.mrn + ' ' + a.visitType + ' ' + a.reason + ' ' + a.doctor + ' ' + a.room + ' ' + a.status).toLowerCase();
            return text.includes(opSearchTerm);
        });
    }

    if (opSortField) {
        list.sort(function (a, b) {
            var va, vb;
            if (opSortField === 'status') {
                va = OP_STATUS_ORDER.indexOf(a.status);
                vb = OP_STATUS_ORDER.indexOf(b.status);
            } else {
                va = a[opSortField];
                vb = b[opSortField];
            }
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return opSortAsc ? -1 : 1;
            if (va > vb) return opSortAsc ? 1 : -1;
            return 0;
        });
    }

    return list;
}

function filterOpList(searchTerm) {
    opSearchTerm = (searchTerm || '').toLowerCase();
    renderOpList();
}

function opSortIcon(field) {
    var cls = 'sort-icon';
    var icon = 'pi-sort-alt';
    if (opSortField === field) {
        icon = opSortAsc ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
        cls += ' ed-sort-active';
    }
    return '<i class="pi ' + icon + ' ' + cls + '" onclick="event.stopPropagation(); toggleOpSort(\'' + field + '\')" title="Sort"></i>';
}

function toggleOpSort(field) {
    if (opSortField === field) {
        opSortAsc = !opSortAsc;
    } else {
        opSortField = field;
        opSortAsc = true;
    }
    renderOpList();
}

function renderOpList() {
    var container = document.getElementById('opContainer');
    if (!container) return;

    var appts = getFilteredOpAppointments();
    var html = '';

    html += '<table class="patient-table w-full">';
    html += '<thead><tr>';
    html += '<th class="op-col-time">Time ' + opSortIcon('scheduledTime') + '</th>';
    html += '<th class="col-patient">Patient</th>';
    html += '<th class="op-col-visittype">Visit Type</th>';
    html += '<th class="op-col-reason">Reason</th>';
    html += '<th class="col-ed-status">Status ' + opSortIcon('status') + '</th>';
    html += '<th class="op-col-waitdelay">Wait / Delay</th>';
    html += '<th class="col-alerts">Alerts</th>';
    html += '<th class="op-col-doctor">Doctor</th>';
    html += '<th class="op-col-room">Room</th>';
    html += '<th class="col-actions">Actions</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    if (appts.length === 0) {
        html += '<tr><td colspan="10" class="pat-empty-state"><i class="pi pi-inbox"></i> No appointments match the current filter.</td></tr>';
    }

    appts.forEach(function (appt) {
        var genderIcon = appt.gender === 'Male' ? 'pi-mars' : 'pi-venus';
        var genderColor = appt.gender === 'Male' ? 'color: var(--ech-primary)' : 'color: #e91e63';
        var statusClass = getOpStatusClass(appt.status);
        var hasDelay = appt.delayMin > 0;
        var rowExtraClass = hasDelay ? ' op-row-delayed' : '';

        html += '<tr class="patient-row cursor-pointer' + rowExtraClass + '" onclick="openOpDrawer(' + appt.id + ')" data-patient-id="' + appt.id + '">';

        html += '<td class="op-col-time"><span class="room-number">' + appt.scheduledTime + '</span></td>';

        html += '<td class="col-patient">';
        html += '<span class="patient-name-cell">' + appt.name + '</span>';
        html += '<span class="patient-sub-info">' + appt.age + 'Y / ' + appt.gender + ' <i class="pi ' + genderIcon + '" style="' + genderColor + '; font-size: 0.846rem"></i> | MRN: ' + appt.mrn + '</span>';
        html += '</td>';

        html += '<td class="op-col-visittype"><span class="problem-text">' + appt.visitType + '</span></td>';

        html += '<td class="op-col-reason"><span class="problem-text">' + appt.reason + '</span></td>';

        html += '<td class="col-ed-status"><span class="op-status-pill ' + statusClass + '">' + appt.status + '</span></td>';

        html += '<td class="op-col-waitdelay">' + formatOpWaitDelay(appt) + '</td>';

        html += '<td class="col-alerts">' + renderOpAlertChips(appt.alerts) + '</td>';

        html += '<td class="op-col-doctor"><span class="physician-name">' + appt.doctor + '</span></td>';

        html += '<td class="op-col-room"><span class="room-number">' + appt.room + '</span></td>';

        html += '<td class="col-actions">';
        html += '<button class="row-action-btn" title="Open Chart" onclick="event.stopPropagation(); opHandleAction(\'chart\',' + appt.id + ')"><i class="pi pi-file-edit"></i></button>';
        html += '<button class="row-action-btn" title="Add Note" onclick="event.stopPropagation(); opHandleAction(\'note\',' + appt.id + ')"><i class="pi pi-pencil"></i></button>';
        html += '</td>';

        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    var badge = document.getElementById('opSearchBadge');
    if (badge) badge.textContent = appts.length;
}

function openOpDrawer(apptId) {
    var appt = opAppointments.find(function (a) { return a.id === apptId; });
    if (!appt) return;

    document.querySelectorAll('.patient-row').forEach(function (r) { r.classList.remove('row-selected'); });
    var row = document.querySelector('[data-patient-id="' + apptId + '"]');
    if (row) row.classList.add('row-selected');

    var drawer = document.getElementById('opDrawer');
    var overlay = document.getElementById('opDrawerOverlay');
    var title = document.getElementById('opDrawerTitle');
    var body = document.getElementById('opDrawerBody');
    var actions = document.getElementById('opDrawerActions');

    title.textContent = appt.name;

    var genderIcon = appt.gender === 'Male' ? 'pi-mars' : 'pi-venus';
    var statusClass = getOpStatusClass(appt.status);

    var html = '';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Demographics</div>';
    html += '<div class="ed-drawer-value"><i class="pi ' + genderIcon + '"></i> ' + appt.age + 'y ' + appt.gender + ' &middot; DOB: ' + appt.dob + ' &middot; MRN: <strong>' + appt.mrn + '</strong></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Appointment</div>';
    html += '<div class="ed-drawer-value">Scheduled: <strong>' + appt.scheduledTime + '</strong> &middot; ' + appt.visitType + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Reason for Visit</div>';
    html += '<div class="ed-drawer-value">' + appt.reason + '</div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Status</div>';
    html += '<div class="ed-drawer-value"><span class="op-status-pill ' + statusClass + '">' + appt.status + '</span></div>';
    html += '</div>';

    if (appt.waitMin > 0 || appt.delayMin > 0) {
        html += '<div class="ed-drawer-section">';
        html += '<div class="ed-drawer-label">Wait / Delay</div>';
        html += '<div class="ed-drawer-value">' + formatOpWaitDelay(appt) + '</div>';
        html += '</div>';
    }

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Doctor</div>';
    html += '<div class="ed-drawer-value"><span class="physician-name">' + appt.doctor + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Room</div>';
    html += '<div class="ed-drawer-value"><span class="room-number">' + appt.room + '</span></div>';
    html += '</div>';

    html += '<div class="ed-drawer-section">';
    html += '<div class="ed-drawer-label">Department</div>';
    html += '<div class="ed-drawer-value">' + appt.department + '</div>';
    html += '</div>';

    if (appt.alerts && appt.alerts.length > 0) {
        html += '<div class="ed-drawer-section">';
        html += '<div class="ed-drawer-label">Alerts</div>';
        html += '<div class="ed-drawer-value ed-drawer-alerts">' + renderOpAlertChips(appt.alerts) + '</div>';
        html += '</div>';
    }

    body.innerHTML = html;

    var actHtml = '';
    actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'chart\',' + appt.id + ')"><i class="pi pi-file-edit"></i> Open Chart</button>';
    actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'vitals\',' + appt.id + ')"><i class="pi pi-heart"></i> Record Vitals</button>';
    if (appt.status === 'Waiting') {
        actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'arrive\',' + appt.id + ')"><i class="pi pi-sign-in"></i> Mark Arrived</button>';
    }
    if (appt.status === 'Arrived' || appt.status === 'Waiting') {
        actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'start\',' + appt.id + ')"><i class="pi pi-play"></i> Start Consultation</button>';
    }
    if (appt.status !== 'Completed' && appt.status !== 'Cancelled') {
        actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'complete\',' + appt.id + ')"><i class="pi pi-check"></i> Mark Completed</button>';
    }
    actHtml += '<button class="ed-drawer-action-btn" onclick="opHandleAction(\'note\',' + appt.id + ')"><i class="pi pi-pencil"></i> Add Note</button>';
    actions.innerHTML = actHtml;

    drawer.classList.add('open');
    overlay.classList.add('show');
}

function closeOpDrawer() {
    var drawer = document.getElementById('opDrawer');
    var overlay = document.getElementById('opDrawerOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.querySelectorAll('.patient-row').forEach(function (r) { r.classList.remove('row-selected'); });
}

function opHandleAction(action, apptId) {
    closeOpDrawer();
    console.log('Outpatient action:', action, 'for appointment:', apptId);
}

function initOutpatient() {
    var wardLabel = document.querySelector('[data-field="wardName"]');
    if (wardLabel) wardLabel.textContent = 'Outpatient Appointments';
    renderOpToolbar();
    updateOpTabCounts();
    renderOpList();
    wireOpTabs();
}

document.addEventListener('DOMContentLoaded', initOutpatient);
