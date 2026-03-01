/**
 * @file measurements.js — Measurements Flowchart Logic
 * @description Renders a dynamic flowsheet grid for clinical parameters.
 *   Groups panel on the left, time-based data table on the right.
 *   Supports time-scale switching, date navigation, threshold alerts,
 *   hover tooltips, and a registration modal.
 *   Includes Abnormal/Critical filtering and Trend view (sparklines).
 *
 *   ANGULAR 15 MIGRATION:
 *   - MeasurementsComponent (Standalone) with inject(VitalSignsService)
 *   - FlowsheetTableComponent for the p-table grid
 *   - RegisterVitalSignsDialogComponent for the PrimeNG p-dialog form
 */

(function () {
    var GROUPS = [
        { id: 'all', label: 'All', i18n: 'MEASUREMENTS.GROUP_ALL' },
        { id: 'vital-signs', label: 'Vital Signs', i18n: 'MEASUREMENTS.GROUP_VITAL_SIGNS' },
        { id: 'fluids-balance', label: 'Fluids Balance', i18n: 'MEASUREMENTS.GROUP_FLUIDS_BALANCE' },
        { id: 'pulmonary', label: 'Pulmonary - Mech. Vent.', i18n: 'MEASUREMENTS.GROUP_PULMONARY' },
        { id: 'respiratory', label: 'Respiratory - Lung Mech.', i18n: 'MEASUREMENTS.GROUP_RESPIRATORY' },
        { id: 'neurological', label: 'Neurological', i18n: 'MEASUREMENTS.GROUP_NEUROLOGICAL' }
    ];

    var PARAMETERS = {
        'vital-signs': [
            { name: 'Blood Pressure (mmHg)', field: 'bp', unit: 'mmHg', low: null, high: null, isBP: true },
            { name: 'Oxygen saturation (%)', field: 'spo2', unit: '%', low: 90, high: 100 },
            { name: 'Heart Rate (bpm)', field: 'hr', unit: 'bpm', low: 60, high: 100 },
            { name: 'Temperature (°C)', field: 'temp', unit: '°C', low: 36.0, high: 37.5 }
        ],
        'fluids-balance': [
            { name: 'Uresis (ml)', field: 'uresis', unit: 'ml', low: 30, high: 400 },
            { name: 'IV Intake (ml)', field: 'ivIntake', unit: 'ml', low: null, high: null },
            { name: 'Oral Intake (ml)', field: 'oralIntake', unit: 'ml', low: null, high: null },
            { name: 'Total Balance (ml)', field: 'totalBalance', unit: 'ml', low: -500, high: 500 }
        ],
        'pulmonary': [
            { name: 'FiO2 (%)', field: 'fio2', unit: '%', low: 21, high: 60 },
            { name: 'PEEP (cmH2O)', field: 'peep', unit: 'cmH2O', low: 0, high: 10 },
            { name: 'Tidal Volume (ml)', field: 'tidalVol', unit: 'ml', low: 350, high: 600 },
            { name: 'RR (rpm)', field: 'rr', unit: 'rpm', low: 12, high: 20 }
        ],
        'respiratory': [
            { name: 'Compliance (ml/cmH2O)', field: 'compliance', unit: 'ml/cmH2O', low: 50, high: 100 },
            { name: 'Resistance (cmH2O/L/s)', field: 'resistance', unit: 'cmH2O/L/s', low: null, high: 15 },
            { name: 'Peak Pressure (cmH2O)', field: 'peakPressure', unit: 'cmH2O', low: null, high: 30 }
        ],
        'neurological': [
            { name: 'Glasgow Score', field: 'glasgow', unit: '', low: 13, high: 15 },
            { name: 'Pupil Response', field: 'pupil', unit: '', low: null, high: null, isText: true },
            { name: 'RASS Score', field: 'rass', unit: '', low: -1, high: 1 }
        ]
    };

    var THRESHOLDS_BP = { sysLow: 90, sysHigh: 180, diaLow: 50, diaHigh: 110 };
    var CRITICAL_BP = { sysLow: 80, sysHigh: 200, diaLow: 40, diaHigh: 120 };

    var NURSES = ['Dr. Garcia', 'Nurse Smith', 'Nurse Johnson', 'Dr. Patel', 'Nurse Williams'];

    var currentGroup = 'vital-signs';
    var currentScale = 240;
    var currentDate = new Date(2025, 7, 19);
    var mockDataCache = {};

    var showAbnormalOnly = false;
    var showCriticalOnly = false;
    var showTrendView = false;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function formatDate(d) {
        return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function generateTimeSlots(scaleMinutes) {
        var slots = [];
        var step = scaleMinutes;
        if (step >= 1440) step = 60;
        var count = Math.floor(1440 / step);
        if (count < 1) count = 1;
        if (count > 96) count = 96;
        for (var i = 0; i < count; i++) {
            var totalMin = i * step;
            var h = Math.floor(totalMin / 60);
            var m = totalMin % 60;
            slots.push(pad(h) + ':' + pad(m));
        }
        return slots;
    }

    function seededRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function generateMockData(groupId, date, slots) {
        var key = groupId + '_' + date.toISOString().slice(0, 10) + '_' + slots.join(',');
        if (mockDataCache[key]) return mockDataCache[key];

        var params = PARAMETERS[groupId];
        var data = {};
        var daySeed = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

        params.forEach(function (param, pIdx) {
            data[param.field] = {};
            slots.forEach(function (slot, sIdx) {
                var seed = daySeed + pIdx * 1000 + sIdx * 7;
                var r = seededRandom(seed);
                var appear = r > 0.2;
                if (!appear) { data[param.field][slot] = null; return; }

                var val;
                if (param.isBP) {
                    var sys = Math.round(110 + seededRandom(seed + 1) * 100);
                    var dia = Math.round(50 + seededRandom(seed + 2) * 60);
                    val = sys + '/' + dia;
                } else if (param.isText) {
                    var texts = ['Reactive', 'Sluggish', 'Fixed', 'Reactive', 'Reactive'];
                    val = texts[Math.floor(seededRandom(seed + 3) * texts.length)];
                } else if (param.field === 'temp') {
                    val = (36.0 + seededRandom(seed + 4) * 2.5).toFixed(1);
                } else if (param.field === 'hr') {
                    val = Math.round(65 + seededRandom(seed + 5) * 50);
                } else if (param.field === 'spo2') {
                    val = Math.round(88 + seededRandom(seed + 6) * 12);
                } else if (param.field === 'uresis') {
                    val = Math.round(20 + seededRandom(seed + 7) * 380);
                } else if (param.field === 'ivIntake') {
                    val = Math.round(50 + seededRandom(seed + 8) * 200);
                } else if (param.field === 'oralIntake') {
                    val = Math.round(seededRandom(seed + 9) * 300);
                } else if (param.field === 'totalBalance') {
                    val = Math.round(-300 + seededRandom(seed + 10) * 800);
                } else if (param.field === 'fio2') {
                    val = Math.round(21 + seededRandom(seed + 11) * 60);
                } else if (param.field === 'peep') {
                    val = Math.round(seededRandom(seed + 12) * 15);
                } else if (param.field === 'tidalVol') {
                    val = Math.round(300 + seededRandom(seed + 13) * 400);
                } else if (param.field === 'rr') {
                    val = Math.round(10 + seededRandom(seed + 14) * 18);
                } else if (param.field === 'compliance') {
                    val = Math.round(40 + seededRandom(seed + 15) * 70);
                } else if (param.field === 'resistance') {
                    val = Math.round(5 + seededRandom(seed + 16) * 15);
                } else if (param.field === 'peakPressure') {
                    val = Math.round(15 + seededRandom(seed + 17) * 25);
                } else if (param.field === 'glasgow') {
                    val = Math.round(8 + seededRandom(seed + 18) * 7);
                } else if (param.field === 'rass') {
                    val = Math.round(-3 + seededRandom(seed + 19) * 6);
                } else {
                    val = Math.round(seededRandom(seed + 20) * 100);
                }

                var nurseIdx = Math.floor(seededRandom(seed + 50) * NURSES.length);
                var sec = Math.floor(seededRandom(seed + 51) * 60);
                data[param.field][slot] = {
                    value: val,
                    nurse: NURSES[nurseIdx],
                    second: pad(sec)
                };
            });
        });

        mockDataCache[key] = data;
        return data;
    }

    function isAlert(param, val) {
        if (val === null || val === undefined) return false;
        if (param.isBP) {
            var parts = String(val).split('/');
            if (parts.length !== 2) return false;
            var sys = parseInt(parts[0], 10);
            var dia = parseInt(parts[1], 10);
            return sys < THRESHOLDS_BP.sysLow || sys > THRESHOLDS_BP.sysHigh ||
                   dia < THRESHOLDS_BP.diaLow || dia > THRESHOLDS_BP.diaHigh;
        }
        if (param.isText) return val === 'Fixed' || val === 'Sluggish';
        var n = parseFloat(val);
        if (isNaN(n)) return false;
        if (param.low !== null && n < param.low) return true;
        if (param.high !== null && n > param.high) return true;
        return false;
    }

    function isCritical(param, val) {
        if (val === null || val === undefined) return false;
        if (param.isBP) {
            var parts = String(val).split('/');
            if (parts.length !== 2) return false;
            var sys = parseInt(parts[0], 10);
            var dia = parseInt(parts[1], 10);
            return sys < CRITICAL_BP.sysLow || sys > CRITICAL_BP.sysHigh ||
                   dia < CRITICAL_BP.diaLow || dia > CRITICAL_BP.diaHigh;
        }
        if (param.isText) return val === 'Fixed';
        var n = parseFloat(val);
        if (isNaN(n)) return false;
        if (param.field === 'spo2') return n < 85;
        if (param.field === 'hr') return n < 40 || n > 150;
        if (param.field === 'temp') return n < 35.0 || n > 39.5;
        if (param.field === 'glasgow') return n <= 8;
        if (param.low !== null && param.high !== null) {
            var range = param.high - param.low;
            return n < (param.low - range * 0.3) || n > (param.high + range * 0.3);
        }
        return false;
    }

    function getActiveParams() {
        if (currentGroup === 'all') {
            var all = [];
            var groupKeys = Object.keys(PARAMETERS);
            for (var i = 0; i < groupKeys.length; i++) {
                all = all.concat(PARAMETERS[groupKeys[i]]);
            }
            return all;
        }
        return PARAMETERS[currentGroup] || [];
    }

    function getActiveData(slots) {
        if (currentGroup === 'all') {
            var merged = {};
            var groupKeys = Object.keys(PARAMETERS);
            for (var i = 0; i < groupKeys.length; i++) {
                var gData = generateMockData(groupKeys[i], currentDate, slots);
                for (var field in gData) {
                    if (gData.hasOwnProperty(field)) {
                        merged[field] = gData[field];
                    }
                }
            }
            return merged;
        }
        return generateMockData(currentGroup, currentDate, slots);
    }

    function msHasAnyAbnormal(param, data, slots) {
        for (var i = 0; i < slots.length; i++) {
            var cell = data[param.field] ? data[param.field][slots[i]] : null;
            if (cell && cell.value !== null && cell.value !== undefined) {
                if (isAlert(param, cell.value)) return true;
            }
        }
        return false;
    }

    function msHasAnyCritical(param, data, slots) {
        for (var i = 0; i < slots.length; i++) {
            var cell = data[param.field] ? data[param.field][slots[i]] : null;
            if (cell && cell.value !== null && cell.value !== undefined) {
                if (isCritical(param, cell.value)) return true;
            }
        }
        return false;
    }

    function msGetTrendIcon(param, data, slots) {
        if (param.isText) return '<span class="ms-trend-icon ms-trend-stable">—</span>';

        var vals = [];
        for (var i = 0; i < slots.length; i++) {
            var cell = data[param.field] ? data[param.field][slots[i]] : null;
            if (cell && cell.value !== null && cell.value !== undefined) {
                var v;
                if (param.isBP) {
                    v = parseFloat(String(cell.value).split('/')[0]);
                } else {
                    v = parseFloat(cell.value);
                }
                if (!isNaN(v)) vals.push({ value: v, raw: cell.value });
            }
        }

        if (vals.length < 2) return '<span class="ms-trend-icon ms-trend-stable">—</span>';

        var latest = vals[vals.length - 1];
        var prev = vals[vals.length - 2];

        if (isCritical(param, latest.raw)) {
            return '<span class="ms-trend-icon ms-trend-critical"><i class="pi pi-exclamation-circle"></i></span>';
        }

        var diff = latest.value - prev.value;
        var pct = Math.abs(diff) / (Math.abs(prev.value) || 1) * 100;

        if (pct < 3) return '<span class="ms-trend-icon ms-trend-stable">—</span>';
        if (diff > 0) return '<span class="ms-trend-icon ms-trend-up"><i class="pi pi-arrow-up-right"></i></span>';
        return '<span class="ms-trend-icon ms-trend-down"><i class="pi pi-arrow-down-right"></i></span>';
    }

    function msGetSparklineSVG(param, data, slots) {
        if (param.isText) return '';

        var vals = [];
        for (var i = 0; i < slots.length; i++) {
            var cell = data[param.field] ? data[param.field][slots[i]] : null;
            if (cell && cell.value !== null && cell.value !== undefined) {
                var v;
                if (param.isBP) {
                    v = parseFloat(String(cell.value).split('/')[0]);
                } else {
                    v = parseFloat(cell.value);
                }
                if (!isNaN(v)) vals.push(v);
            }
        }

        if (vals.length < 2) return '';
        var min = Math.min.apply(null, vals);
        var max = Math.max.apply(null, vals);
        var range = max - min || 1;
        var w = 60, h = 20;
        var points = vals.map(function (v, i) {
            var x = (i / (vals.length - 1)) * w;
            var y = h - ((v - min) / range) * h;
            return x.toFixed(1) + ',' + y.toFixed(1);
        }).join(' ');
        return '<svg class="ms-sparkline" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<polyline points="' + points + '" fill="none" stroke="var(--ech-primary)" stroke-width="1.5" />' +
            '</svg>';
    }

    function getFilteredParams(params, data, slots) {
        if (!showAbnormalOnly && !showCriticalOnly) return params;
        return params.filter(function (param) {
            if (showCriticalOnly) return msHasAnyCritical(param, data, slots);
            if (showAbnormalOnly) return msHasAnyAbnormal(param, data, slots);
            return true;
        });
    }

    function renderGroups() {
        var list = document.getElementById('msGroupList');
        list.innerHTML = '';
        GROUPS.forEach(function (g) {
            var li = document.createElement('li');
            li.className = 'ms-group-item' + (g.id === currentGroup ? ' active' : '');
            li.setAttribute('data-group', g.id);
            li.setAttribute('data-i18n', g.i18n);
            li.textContent = g.label;
            li.onclick = function () { msSelectGroup(g.id); };
            list.appendChild(li);
        });
    }

    function renderTable() {
        var slots = generateTimeSlots(currentScale);
        var params = getActiveParams();
        var data = getActiveData(slots);

        var filtered = getFilteredParams(params, data, slots);

        var thead = document.getElementById('msTableHead');
        var headHtml = '<tr><th class="ms-param-col" data-i18n="MEASUREMENTS.COL_PARAMETER">Parameter</th>';
        if (showTrendView) {
            headHtml += '<th class="ms-col-trend" data-i18n="MEASUREMENTS.COL_TREND">Trend</th>';
        }
        slots.forEach(function (s) {
            headHtml += '<th class="ms-time-col">' + s + '</th>';
        });
        headHtml += '</tr>';
        thead.innerHTML = headHtml;

        var tbody = document.getElementById('msTableBody');

        if (filtered.length === 0) {
            var colSpan = 1 + (showTrendView ? 1 : 0) + slots.length;
            tbody.innerHTML = '<tr><td colspan="' + colSpan + '" class="ms-empty-row" data-i18n="MEASUREMENTS.NO_RESULTS">No results found for the current filters.</td></tr>';
            return;
        }

        var bodyHtml = '';
        filtered.forEach(function (param) {
            bodyHtml += '<tr><td class="ms-param-col">' + param.name + '</td>';
            if (showTrendView) {
                bodyHtml += '<td class="ms-col-trend">' + msGetSparklineSVG(param, data, slots) + '</td>';
            }
            slots.forEach(function (slot) {
                var cell = data[param.field] ? data[param.field][slot] : null;
                if (cell && cell.value !== null && cell.value !== undefined) {
                    var critical = isCritical(param, cell.value);
                    var alert = isAlert(param, cell.value);
                    var cls = critical ? 'ms-cell-critical' : (alert ? 'ms-cell-alert' : '');
                    bodyHtml += '<td class="' + cls + '" data-nurse="' + cell.nurse + '" data-time="' + slot + ':' + cell.second + '">' + cell.value + '</td>';
                } else {
                    bodyHtml += '<td class="ms-cell-empty">-</td>';
                }
            });
            bodyHtml += '</tr>';
        });
        tbody.innerHTML = bodyHtml;

        attachTooltips();
    }

    function renderDateLabel() {
        var el = document.getElementById('msDateLabel');
        el.textContent = formatDate(currentDate);
    }

    function attachTooltips() {
        var tooltip = document.getElementById('msTooltip');
        var cells = document.querySelectorAll('#msTableBody td[data-nurse]');
        cells.forEach(function (cell) {
            cell.addEventListener('mouseenter', function (e) {
                var nurse = cell.getAttribute('data-nurse');
                var time = cell.getAttribute('data-time');
                tooltip.textContent = 'Registered by ' + nurse + ' at ' + time;
                tooltip.style.display = 'block';
                positionTooltip(e);
            });
            cell.addEventListener('mousemove', function (e) {
                positionTooltip(e);
            });
            cell.addEventListener('mouseleave', function () {
                tooltip.style.display = 'none';
            });
        });
    }

    function positionTooltip(e) {
        var tooltip = document.getElementById('msTooltip');
        tooltip.style.left = (e.clientX + 12) + 'px';
        tooltip.style.top = (e.clientY - 28) + 'px';
    }

    function renderModalForm() {
        var modalParams;
        if (currentGroup === 'all') {
            modalParams = PARAMETERS['vital-signs'];
        } else {
            modalParams = PARAMETERS[currentGroup];
        }
        var groupLabel = currentGroup === 'all' ? 'All' : GROUPS.find(function (g) { return g.id === currentGroup; }).label;
        var body = document.getElementById('msModalBody');
        var html = '<div style="margin-bottom:10px;font-size:1rem;color:var(--ech-text-secondary);" data-i18n="MEASUREMENTS.REGISTER_GROUP_LABEL">Group: <strong>' + groupLabel + '</strong></div>';
        modalParams.forEach(function (param) {
            if (param.isText) {
                html += '<div class="ms-form-row">';
                html += '<label class="ms-form-label">' + param.name + '</label>';
                html += '<select class="ms-form-input" data-field="' + param.field + '">';
                html += '<option value="">--</option>';
                html += '<option>Reactive</option><option>Sluggish</option><option>Fixed</option>';
                html += '</select>';
                html += '<span class="ms-form-unit">' + param.unit + '</span>';
                html += '</div>';
            } else if (param.isBP) {
                html += '<div class="ms-form-row">';
                html += '<label class="ms-form-label">' + param.name + '</label>';
                html += '<input type="number" class="ms-form-input" placeholder="Systolic" data-field="bpSys" style="max-width:80px;">';
                html += '<span>/</span>';
                html += '<input type="number" class="ms-form-input" placeholder="Diastolic" data-field="bpDia" style="max-width:80px;">';
                html += '<span class="ms-form-unit">' + param.unit + '</span>';
                html += '</div>';
            } else {
                html += '<div class="ms-form-row">';
                html += '<label class="ms-form-label">' + param.name + '</label>';
                html += '<input type="number" class="ms-form-input" data-field="' + param.field + '" step="0.1">';
                html += '<span class="ms-form-unit">' + param.unit + '</span>';
                html += '</div>';
            }
        });
        body.innerHTML = html;
    }

    window.msSelectGroup = function (groupId) {
        currentGroup = groupId;
        renderGroups();
        renderTable();
    };

    window.msSetScale = function (btn) {
        currentScale = parseInt(btn.getAttribute('data-scale'), 10);
        var btns = document.querySelectorAll('.ms-scale-btn');
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderTable();
    };

    window.msNavDate = function (dir) {
        currentDate = new Date(currentDate.getTime() + dir * 86400000);
        renderDateLabel();
        renderTable();
    };

    window.msToggleAbnormal = function () {
        showAbnormalOnly = !showAbnormalOnly;
        if (!showAbnormalOnly) showCriticalOnly = false;
        document.getElementById('msBtnAbnormal').classList.toggle('active', showAbnormalOnly);
        document.getElementById('msBtnCritical').classList.toggle('active', showCriticalOnly);
        renderTable();
    };

    window.msToggleCritical = function () {
        showCriticalOnly = !showCriticalOnly;
        if (showCriticalOnly) showAbnormalOnly = true;
        document.getElementById('msBtnCritical').classList.toggle('active', showCriticalOnly);
        document.getElementById('msBtnAbnormal').classList.toggle('active', showAbnormalOnly);
        renderTable();
    };

    window.msToggleTrendView = function () {
        showTrendView = !showTrendView;
        document.getElementById('msBtnTrend').classList.toggle('active', showTrendView);
        renderTable();
    };

    window.msOpenRegister = function () {
        renderModalForm();
        document.getElementById('msModal').classList.add('visible');
    };

    window.msCloseRegister = function () {
        document.getElementById('msModal').classList.remove('visible');
    };

    window.msSaveRegister = function () {
        console.log('[Measurements] Save registration — placeholder');
        window.msCloseRegister();
    };

    renderGroups();
    renderDateLabel();
    renderTable();
})();
