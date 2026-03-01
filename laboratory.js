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

    var DISCIPLINES = ClinicalDataService.getLaboratoryDisciplines();
    var SAMPLE_DATES = ClinicalDataService.getLaboratorySampleDates();
    var ANALYTES = ClinicalDataService.getLaboratoryAnalytes();

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
