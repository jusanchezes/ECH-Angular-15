/**
 * @file laboratory.js — Laboratory Results Viewer Logic
 * @description Renders a high-density lab results grid with discipline filtering,
 *   safety flags (H/L/Critical), sparkline trend icons, time-range filtering,
 *   and drill-down detail sidebar.
 *
 *   ANGULAR 15 MIGRATION:
 *   - LaboratoryResultsComponent (Standalone) with inject(LaboratoryService)
 *   - DisciplinePanelComponent for the left discipline selector
 *   - ResultsTableComponent with p-table, frozen columns, dynamic date columns
 *   - ResultDetailSidebarComponent using p-sidebar for drill-down
 */

(function () {

    var DISCIPLINES = [
        { id: 'chemistry', label: 'Chemistry / Bioquímica', i18n: 'LAB.DISC_CHEMISTRY' },
        { id: 'hematology', label: 'Hematology / Hemograma', i18n: 'LAB.DISC_HEMATOLOGY' },
        { id: 'blood-gas', label: 'Blood Gas / Gases', i18n: 'LAB.DISC_BLOOD_GAS' },
        { id: 'microbiology', label: 'Microbiology', i18n: 'LAB.DISC_MICROBIOLOGY' },
        { id: 'coagulation', label: 'Coagulation', i18n: 'LAB.DISC_COAGULATION' }
    ];

    var SAMPLE_DATES = [
        '28/02 08:15', '27/02 20:00', '27/02 08:00', '26/02 18:30', '26/02 06:00',
        '25/02 20:00', '25/02 08:00', '24/02 18:30', '24/02 06:00', '23/02 20:00'
    ];

    var ANALYTES = [
        {
            name: 'Sodium (Na+)', discipline: 'chemistry', unit: 'mEq/L', refRange: '135-145', refLow: 135, refHigh: 145,
            values: [138, 137, 139, 140, 141, 136, 138, 139, 140, 137],
            validatedBy: 'Dr. García', comments: 'Within normal range.'
        },
        {
            name: 'Potassium (K+)', discipline: 'chemistry', unit: 'mEq/L', refRange: '3.5-5.1', refLow: 3.5, refHigh: 5.1,
            values: [5.4, 4.9, 4.2, 3.8, 3.2, 4.0, 4.1, 3.9, 4.5, 4.3],
            validatedBy: 'Dr. López', comments: 'Recent value elevated — monitor renal function.'
        },
        {
            name: 'Glucose (Fast)', discipline: 'chemistry', unit: 'mg/dL', refRange: '70-100', refLow: 70, refHigh: 100,
            values: [250, 180, 110, 95, 88, 102, 98, 115, 130, 92],
            validatedBy: 'Dr. García', comments: 'Fasting glucose significantly elevated. Critical value notified.',
            isCritical: [true, true, false, false, false, false, false, false, false, false]
        },
        {
            name: 'Creatinine', discipline: 'chemistry', unit: 'mg/dL', refRange: '0.7-1.3', refLow: 0.7, refHigh: 1.3,
            values: [1.4, 1.3, 1.2, 1.1, 0.9, 1.0, 1.1, 1.2, 1.3, 1.1],
            validatedBy: 'Dr. Martínez', comments: 'Trending up — correlate with eGFR decline.'
        },
        {
            name: 'BUN', discipline: 'chemistry', unit: 'mg/dL', refRange: '7-20', refLow: 7, refHigh: 20,
            values: [22, 19, 18, 17, 15, 16, 18, 20, 21, 19],
            validatedBy: 'Dr. García', comments: 'Mildly elevated, consistent with renal status.'
        },
        {
            name: 'Calcium (Ca)', discipline: 'chemistry', unit: 'mg/dL', refRange: '8.5-10.5', refLow: 8.5, refHigh: 10.5,
            values: [9.2, 9.0, 9.1, 9.3, 9.4, 9.1, 8.9, 9.0, 9.2, 9.3],
            validatedBy: 'Dr. López', comments: 'Stable.'
        },
        {
            name: 'ALT (GPT)', discipline: 'chemistry', unit: 'U/L', refRange: '7-56', refLow: 7, refHigh: 56,
            values: [45, 42, 38, 35, 33, 30, 28, 32, 40, 44],
            validatedBy: 'Dr. Martínez', comments: 'Within reference range.'
        },
        {
            name: 'AST (GOT)', discipline: 'chemistry', unit: 'U/L', refRange: '10-40', refLow: 10, refHigh: 40,
            values: [38, 35, 30, 28, 25, 27, 29, 32, 36, 34],
            validatedBy: 'Dr. Martínez', comments: 'Within reference range.'
        },
        {
            name: 'Hemoglobin', discipline: 'hematology', unit: 'g/dL', refRange: '13.5-17.5', refLow: 13.5, refHigh: 17.5,
            values: [12.8, 13.0, 13.2, 13.5, 13.8, 14.0, 13.9, 13.6, 13.3, 13.1],
            validatedBy: 'Dr. Ruiz', comments: 'Slightly below lower limit — monitor for anemia.'
        },
        {
            name: 'Hematocrit', discipline: 'hematology', unit: '%', refRange: '38.3-48.6', refLow: 38.3, refHigh: 48.6,
            values: [36.5, 37.0, 37.8, 38.5, 39.2, 40.0, 39.5, 38.8, 38.0, 37.5],
            validatedBy: 'Dr. Ruiz', comments: 'Low — correlates with hemoglobin trend.'
        },
        {
            name: 'WBC', discipline: 'hematology', unit: '×10³/µL', refRange: '4.5-11.0', refLow: 4.5, refHigh: 11.0,
            values: [12.5, 11.8, 10.5, 9.8, 8.5, 7.2, 6.8, 7.5, 8.2, 9.0],
            validatedBy: 'Dr. Ruiz', comments: 'Downtrending from elevated peak — infection resolving.'
        },
        {
            name: 'Platelets', discipline: 'hematology', unit: '×10³/µL', refRange: '150-400', refLow: 150, refHigh: 400,
            values: [185, 190, 195, 200, 210, 215, 220, 218, 205, 198],
            validatedBy: 'Dr. Ruiz', comments: 'Within normal limits.'
        },
        {
            name: 'MCV', discipline: 'hematology', unit: 'fL', refRange: '80-100', refLow: 80, refHigh: 100,
            values: [88, 87, 89, 90, 88, 87, 86, 88, 89, 90],
            validatedBy: 'Dr. Ruiz', comments: 'Normocytic.'
        },
        {
            name: 'pH', discipline: 'blood-gas', unit: '', refRange: '7.35-7.45', refLow: 7.35, refHigh: 7.45,
            values: [7.38, 7.40, 7.42, 7.41, 7.39, 7.37, 7.36, 7.38, 7.40, 7.41],
            validatedBy: 'Dr. Patel', comments: 'Within normal range.'
        },
        {
            name: 'pCO2', discipline: 'blood-gas', unit: 'mmHg', refRange: '35-45', refLow: 35, refHigh: 45,
            values: [42, 40, 38, 39, 41, 43, 44, 42, 40, 39],
            validatedBy: 'Dr. Patel', comments: 'Normal ventilation.'
        },
        {
            name: 'pO2', discipline: 'blood-gas', unit: 'mmHg', refRange: '80-100', refLow: 80, refHigh: 100,
            values: [92, 95, 88, 90, 85, 82, 87, 91, 93, 89],
            validatedBy: 'Dr. Patel', comments: 'Adequate oxygenation.'
        },
        {
            name: 'HCO3', discipline: 'blood-gas', unit: 'mEq/L', refRange: '22-26', refLow: 22, refHigh: 26,
            values: [24, 23, 24, 25, 24, 23, 22, 23, 24, 25],
            validatedBy: 'Dr. Patel', comments: 'Normal bicarbonate.'
        },
        {
            name: 'Lactate', discipline: 'blood-gas', unit: 'mmol/L', refRange: '0.5-2.0', refLow: 0.5, refHigh: 2.0,
            values: [2.8, 2.2, 1.8, 1.5, 1.2, 1.0, 1.1, 1.3, 1.6, 1.9],
            validatedBy: 'Dr. Patel', comments: 'Elevated — was critical, now trending down.'
        },
        {
            name: 'Blood Culture', discipline: 'microbiology', unit: '', refRange: 'Negative', refLow: null, refHigh: null,
            values: ['Negative', 'Pending', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative'],
            validatedBy: 'Dr. Sánchez', comments: 'No growth at 48h.', isText: true
        },
        {
            name: 'Urine Culture', discipline: 'microbiology', unit: '', refRange: 'Negative', refLow: null, refHigh: null,
            values: ['E. coli >10⁵', 'Pending', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative', 'Negative'],
            validatedBy: 'Dr. Sánchez', comments: 'Positive — E. coli. Sensitivity report attached.', isText: true,
            textFlags: ['abnormal', 'pending', null, null, null, null, null, null, null, null]
        },
        {
            name: 'Procalcitonin', discipline: 'microbiology', unit: 'ng/mL', refRange: '<0.5', refLow: 0, refHigh: 0.5,
            values: [1.2, 0.8, 0.4, 0.3, 0.2, 0.15, 0.1, 0.12, 0.18, 0.22],
            validatedBy: 'Dr. Sánchez', comments: 'Downtrending — correlates with infection resolution.'
        },
        {
            name: 'PT (sec)', discipline: 'coagulation', unit: 'sec', refRange: '11-13.5', refLow: 11, refHigh: 13.5,
            values: [15.2, 14.8, 14.0, 13.5, 13.2, 12.8, 12.5, 12.9, 13.1, 13.3],
            validatedBy: 'Dr. Torres', comments: 'Elevated — patient on Warfarin therapy.'
        },
        {
            name: 'INR', discipline: 'coagulation', unit: '', refRange: '0.8-1.2', refLow: 0.8, refHigh: 1.2,
            values: [2.8, 2.5, 2.2, 2.0, 1.8, 1.5, 1.3, 1.4, 1.6, 1.7],
            validatedBy: 'Dr. Torres', comments: 'Therapeutic range for anticoagulation (target 2.0-3.0).'
        },
        {
            name: 'aPTT', discipline: 'coagulation', unit: 'sec', refRange: '25-35', refLow: 25, refHigh: 35,
            values: [38, 36, 34, 32, 30, 29, 28, 30, 32, 33],
            validatedBy: 'Dr. Torres', comments: 'Mildly prolonged — consistent with anticoagulation.'
        },
        {
            name: 'Fibrinogen', discipline: 'coagulation', unit: 'mg/dL', refRange: '200-400', refLow: 200, refHigh: 400,
            values: [320, 310, 300, 290, 285, 280, 275, 280, 290, 300],
            validatedBy: 'Dr. Torres', comments: 'Within normal limits.'
        }
    ];

    var currentDiscipline = 'chemistry';
    var currentTimeRange = 24;
    var showAbnormalOnly = false;
    var showCriticalOnly = false;
    var showTrendView = false;
    var searchTerm = '';

    function getVisibleDateCount() {
        if (currentTimeRange === 24) return 5;
        if (currentTimeRange === 48) return 7;
        return 10;
    }

    function getFlag(analyte, idx) {
        if (analyte.isText) {
            if (analyte.textFlags && analyte.textFlags[idx]) return analyte.textFlags[idx];
            return null;
        }
        var val = analyte.values[idx];
        if (val === null || val === undefined || val === '') return null;
        var isCrit = analyte.isCritical && analyte.isCritical[idx];
        if (isCrit) return 'critical';
        if (analyte.refHigh !== null && val > analyte.refHigh) return 'high';
        if (analyte.refLow !== null && val < analyte.refLow) return 'low';
        return null;
    }

    function hasAnyAbnormal(analyte) {
        var count = getVisibleDateCount();
        for (var i = 0; i < count; i++) {
            var f = getFlag(analyte, i);
            if (f) return true;
        }
        return false;
    }

    function hasAnyCritical(analyte) {
        var count = getVisibleDateCount();
        for (var i = 0; i < count; i++) {
            if (getFlag(analyte, i) === 'critical') return true;
        }
        return false;
    }

    function getTrendIcon(analyte) {
        if (analyte.isText) return '<span class="results-trend-icon results-trend-stable">—</span>';
        var vals = analyte.values.slice(0, 3).filter(function (v) { return v !== null && v !== undefined; });
        if (vals.length < 2) return '<span class="results-trend-icon results-trend-stable">—</span>';

        var hasCritical = analyte.isCritical && analyte.isCritical[0];
        if (hasCritical) return '<span class="results-trend-icon results-trend-critical"><i class="pi pi-exclamation-circle"></i></span>';

        var diff = vals[0] - vals[1];
        var pct = Math.abs(diff) / (Math.abs(vals[1]) || 1) * 100;

        if (pct < 3) return '<span class="results-trend-icon results-trend-stable">—</span>';
        if (diff > 0) return '<span class="results-trend-icon results-trend-up"><i class="pi pi-arrow-up-right"></i></span>';
        return '<span class="results-trend-icon results-trend-down"><i class="pi pi-arrow-down-right"></i></span>';
    }

    function getSparklineSVG(analyte) {
        if (analyte.isText) return '';
        var vals = analyte.values.slice(0, getVisibleDateCount()).filter(function (v) { return typeof v === 'number'; });
        if (vals.length < 2) return '';
        var reversed = vals.slice().reverse();
        var min = Math.min.apply(null, reversed);
        var max = Math.max.apply(null, reversed);
        var range = max - min || 1;
        var w = 60, h = 20;
        var points = reversed.map(function (v, i) {
            var x = (i / (reversed.length - 1)) * w;
            var y = h - ((v - min) / range) * h;
            return x.toFixed(1) + ',' + y.toFixed(1);
        }).join(' ');
        return '<svg class="results-sparkline" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<polyline points="' + points + '" fill="none" stroke="var(--ech-primary)" stroke-width="1.5" />' +
            '</svg>';
    }

    function renderDisciplines() {
        var list = document.getElementById('labDisciplineList');
        if (!list) return;
        list.innerHTML = DISCIPLINES.map(function (d) {
            var active = d.id === currentDiscipline ? ' active' : '';
            var count = ANALYTES.filter(function (a) { return a.discipline === d.id; }).length;
            return '<li class="results-panel-item' + active + '" onclick="labSelectDiscipline(\'' + d.id + '\')">' +
                '<span data-i18n="' + d.i18n + '">' + d.label + '</span>' +
                '<span class="results-panel-count">' + count + '</span>' +
                '</li>';
        }).join('');
    }

    function getFilteredAnalytes() {
        return ANALYTES.filter(function (a) {
            if (a.discipline !== currentDiscipline) return false;
            if (searchTerm && a.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1) return false;
            if (showCriticalOnly && !hasAnyCritical(a)) return false;
            if (showAbnormalOnly && !showCriticalOnly && !hasAnyAbnormal(a)) return false;
            return true;
        });
    }

    function renderTable() {
        var visibleDates = getVisibleDateCount();
        var dates = SAMPLE_DATES.slice(0, visibleDates);

        var thead = document.getElementById('labTableHead');
        var tbody = document.getElementById('labTableBody');
        if (!thead || !tbody) return;

        var headHtml = '<tr>' +
            '<th class="results-col-name results-col-sticky" data-i18n="LAB.COL_ANALYTE">Analyte</th>' +
            '<th class="results-col-ref" data-i18n="LAB.COL_REF_RANGE">Ref. Range</th>' +
            '<th class="results-col-trend" data-i18n="LAB.COL_TREND">Trend</th>';
        for (var d = 0; d < dates.length; d++) {
            headHtml += '<th class="results-col-date">' + dates[d] + '</th>';
        }
        headHtml += '</tr>';
        thead.innerHTML = headHtml;

        var analytes = getFilteredAnalytes();

        if (analytes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="' + (3 + visibleDates) + '" class="results-empty-row" data-i18n="LAB.NO_RESULTS">No results found for the current filters.</td></tr>';
            return;
        }

        var bodyHtml = '';
        for (var i = 0; i < analytes.length; i++) {
            var a = analytes[i];
            bodyHtml += '<tr>';
            bodyHtml += '<td class="results-col-name results-col-sticky"><strong>' + a.name + '</strong></td>';
            bodyHtml += '<td class="results-col-ref">' + a.refRange + '</td>';
            bodyHtml += '<td class="results-col-trend">' + (showTrendView ? getSparklineSVG(a) : getTrendIcon(a)) + '</td>';

            for (var j = 0; j < visibleDates; j++) {
                var val = a.values[j];
                var flag = getFlag(a, j);
                var cellClass = 'results-cell-value';
                var flagLabel = '';

                if (flag === 'critical') {
                    cellClass += ' results-cell-critical';
                    flagLabel = ' <span class="results-flag-critical">(!!)</span>';
                } else if (flag === 'high') {
                    cellClass += ' results-cell-high';
                    flagLabel = ' <span class="results-flag-high">(H)</span>';
                } else if (flag === 'low') {
                    cellClass += ' results-cell-low';
                    flagLabel = ' <span class="results-flag-low">(L)</span>';
                } else if (flag === 'abnormal') {
                    cellClass += ' results-cell-high';
                } else if (flag === 'pending') {
                    cellClass += ' results-cell-pending';
                }

                var displayVal = (val !== null && val !== undefined) ? val : '—';
                bodyHtml += '<td class="' + cellClass + '" onclick="labShowDetail(\'' + a.name.replace(/'/g, "\\'") + '\',' + j + ')">' +
                    displayVal + flagLabel + '</td>';
            }
            bodyHtml += '</tr>';
        }
        tbody.innerHTML = bodyHtml;
    }

    function updateCriticalCount() {
        var count = 0;
        for (var i = 0; i < ANALYTES.length; i++) {
            if (ANALYTES[i].isCritical) {
                for (var j = 0; j < ANALYTES[i].isCritical.length; j++) {
                    if (ANALYTES[i].isCritical[j]) { count++; break; }
                }
            }
        }
        var el = document.getElementById('labCriticalCount');
        if (el) el.textContent = count;
    }

    window.labSelectDiscipline = function (id) {
        currentDiscipline = id;
        renderDisciplines();
        renderTable();
    };

    window.labSetTimeRange = function (btn) {
        var range = parseInt(btn.getAttribute('data-range'), 10);
        currentTimeRange = range;
        var btns = document.querySelectorAll('.toolbar-segment-btn');
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
        btn.classList.add('active');
        renderTable();
    };

    window.labToggleAbnormal = function () {
        showAbnormalOnly = !showAbnormalOnly;
        if (!showAbnormalOnly) showCriticalOnly = false;
        document.getElementById('labBtnAbnormal').classList.toggle('active', showAbnormalOnly);
        document.getElementById('labBtnCritical').classList.toggle('active', showCriticalOnly);
        renderTable();
    };

    window.labToggleCritical = function () {
        showCriticalOnly = !showCriticalOnly;
        if (showCriticalOnly) showAbnormalOnly = true;
        document.getElementById('labBtnCritical').classList.toggle('active', showCriticalOnly);
        document.getElementById('labBtnAbnormal').classList.toggle('active', showAbnormalOnly);
        renderTable();
    };

    window.labToggleTrendView = function () {
        showTrendView = !showTrendView;
        document.getElementById('labBtnTrend').classList.toggle('active', showTrendView);
        renderTable();
    };

    window.labFilterBySearch = function (term) {
        searchTerm = term;
        renderTable();
    };

    window.labShowDetail = function (analyteName, dateIdx) {
        var analyte = null;
        for (var i = 0; i < ANALYTES.length; i++) {
            if (ANALYTES[i].name === analyteName) { analyte = ANALYTES[i]; break; }
        }
        if (!analyte) return;

        var val = analyte.values[dateIdx];
        var flag = getFlag(analyte, dateIdx);
        var date = SAMPLE_DATES[dateIdx];

        var flagText = '';
        if (flag === 'critical') flagText = '<span class="lab-flag-critical">CRITICAL</span>';
        else if (flag === 'high') flagText = '<span class="lab-flag-high">HIGH</span>';
        else if (flag === 'low') flagText = '<span class="lab-flag-low">LOW</span>';

        var html = '<div class="lab-detail-section">' +
            '<div class="lab-detail-analyte-name">' + analyte.name + '</div>' +
            '<div class="lab-detail-date"><i class="pi pi-calendar"></i> ' + date + '</div>' +
            '</div>' +
            '<div class="lab-detail-section">' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_VALUE">Value:</span> <span class="lab-detail-value">' + val + ' ' + (analyte.unit || '') + ' ' + flagText + '</span></div>' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_UNIT">Unit:</span> <span>' + (analyte.unit || 'N/A') + '</span></div>' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_REF_RANGE">Reference Range:</span> <span>' + analyte.refRange + '</span></div>' +
            '</div>' +
            '<div class="lab-detail-section">' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_COMMENTS">Lab Comments:</span></div>' +
            '<div class="lab-detail-comment">' + (analyte.comments || 'No comments.') + '</div>' +
            '</div>' +
            '<div class="lab-detail-section">' +
            '<div class="lab-detail-section-title" data-i18n="LAB.DETAIL_TRACEABILITY">Traceability</div>' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_VALIDATED_BY">Validated By:</span> <span>' + (analyte.validatedBy || 'N/A') + '</span></div>' +
            '<div class="lab-detail-row"><span class="lab-detail-label" data-i18n="LAB.DETAIL_VALIDATION_TIME">Validation Time:</span> <span>' + date + '</span></div>' +
            '</div>' +
            '<div class="lab-detail-section">' +
            '<div class="lab-detail-section-title" data-i18n="LAB.DETAIL_HISTORY">Historical Values</div>' +
            '<div class="lab-detail-sparkline-lg">' + getSparklineSVG(analyte) + '</div>' +
            '</div>';

        document.getElementById('labDetailTitle').textContent = analyte.name;
        document.getElementById('labDetailBody').innerHTML = html;
        document.getElementById('labDetailBackdrop').classList.add('lab-detail-open');
        document.getElementById('labDetailSidebar').classList.add('lab-detail-open');
    };

    window.labCloseDetail = function () {
        document.getElementById('labDetailBackdrop').classList.remove('lab-detail-open');
        document.getElementById('labDetailSidebar').classList.remove('lab-detail-open');
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderDisciplines();
        renderTable();
        updateCriticalCount();
    });

})();
