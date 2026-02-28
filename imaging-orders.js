/**
 * imaging-orders.js
 * ---------------------------------------------------------------------------
 * Imaging Orders data, rendering, and interactivity logic.
 *
 * Angular Migration Notes:
 * - This file will become an ImagingOrdersComponent with an ImagingService.
 * - RADIOLOGY_CATALOG will be replaced by an Observable from the Java REST API.
 * - Rendering functions will be replaced by *ngFor with PrimeNG templates.
 * ---------------------------------------------------------------------------
 */

(function () {

    var RADIOLOGY_CATALOG = [
        { id: 1, name: 'CT Abdomen/Pelvis w IV Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
        { id: 2, name: 'CT Chest w IV Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
        { id: 3, name: 'CT Head without Contrast', modality: 'CT', requiresContrast: false, contrastProtocol: 'None' },
        { id: 4, name: 'CT Angiography Chest (PE Protocol)', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV Only' },
        { id: 5, name: 'MRI Brain w/wo Contrast', modality: 'MRI', requiresContrast: true, contrastProtocol: 'IV Only' },
        { id: 6, name: 'MRI Lumbar Spine', modality: 'MRI', requiresContrast: false, contrastProtocol: 'None' },
        { id: 7, name: 'MRI Knee without Contrast', modality: 'MRI', requiresContrast: false, contrastProtocol: 'None' },
        { id: 8, name: 'XR Chest 1 View Portable', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
        { id: 9, name: 'XR Knee 2 Views', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
        { id: 10, name: 'XR Abdomen AP', modality: 'XR', requiresContrast: false, contrastProtocol: 'None' },
        { id: 11, name: 'US Abdomen Complete', modality: 'US', requiresContrast: false, contrastProtocol: 'None' },
        { id: 12, name: 'US Renal/Bladder', modality: 'US', requiresContrast: false, contrastProtocol: 'None' },
        { id: 13, name: 'CT Abdomen/Pelvis w IV+Oral Contrast', modality: 'CT', requiresContrast: true, contrastProtocol: 'IV+Oral' }
    ];

    var PATIENT_CONTEXT = {
        eGFR: 42,
        creatinine: 1.4,
        contrastAllergy: true
    };

    var activeModalityFilter = null;
    var selectedExam = null;
    var ordersCart = [];
    var selectedOrderIndex = -1;

    function getFilteredCatalog(searchText) {
        searchText = (searchText || '').toLowerCase();
        return RADIOLOGY_CATALOG.filter(function (item) {
            var matchesSearch = !searchText || item.name.toLowerCase().indexOf(searchText) !== -1;
            var matchesModality = !activeModalityFilter || item.modality === activeModalityFilter;
            return matchesSearch && matchesModality;
        });
    }

    function renderCatalog() {
        var list = document.getElementById('ioCatalogList');
        if (!list) return;
        var searchText = (document.getElementById('ioSearchInput') || {}).value || '';
        var filtered = getFilteredCatalog(searchText);

        if (filtered.length === 0) {
            list.innerHTML = '<div class="io-catalog-empty"><i class="pi pi-info-circle"></i> No exams found</div>';
            return;
        }

        list.innerHTML = filtered.map(function (item) {
            var activeClass = selectedExam && selectedExam.id === item.id ? ' io-catalog-item-active' : '';
            return '<div class="io-catalog-item' + activeClass + '" data-exam-id="' + item.id + '" onclick="ioSelectExam(' + item.id + ')">' +
                '<span class="io-catalog-item-name">' + item.name + '</span>' +
                '<span class="io-catalog-item-modality">' + item.modality + '</span>' +
                '</div>';
        }).join('');
    }

    function renderOrders() {
        var list = document.getElementById('ioOrdersList');
        if (!list) return;

        if (ordersCart.length === 0) {
            list.innerHTML = '<div class="io-orders-empty"><i class="pi pi-inbox"></i><span>No orders pending signature</span></div>';
            return;
        }

        list.innerHTML = ordersCart.map(function (o, idx) {
            var isSelected = idx === selectedOrderIndex ? ' io-order-item-active' : '';
            var priorityLabel = o.priority || 'Routine';
            var timingLabel = o.timing || 'Scheduled';
            var statusHtml = '';
            if (!o.clinicalIndication || o.clinicalIndication.trim() === '') {
                statusHtml = '<span class="io-order-status-error"><i class="pi pi-exclamation-circle"></i> Missing Indication</span>';
            } else {
                statusHtml = '<span class="io-order-status-ok"><i class="pi pi-check-circle"></i> Ready</span>';
            }
            return '<div class="io-order-item' + isSelected + '" onclick="ioSelectOrder(' + idx + ')">' +
                '<div class="io-order-item-info">' +
                    '<span class="io-order-item-name">' + o.name + '</span>' +
                    '<span class="io-order-item-detail">' + priorityLabel + ' | ' + timingLabel + '</span>' +
                '</div>' +
                '<div class="io-order-item-right">' +
                    statusHtml +
                    '<button class="io-order-remove" onclick="event.stopPropagation();ioRemoveOrder(' + idx + ')" title="Remove order" aria-label="Remove order"><i class="pi pi-trash"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function populateDetailForm(order) {
        var titleEl = document.getElementById('ioDetailExamName');
        if (titleEl) titleEl.textContent = order ? order.name : '—';

        var priorityEl = document.getElementById('ioPriority');
        var timingEl = document.getElementById('ioTiming');
        var indicationEl = document.getElementById('ioClinicalIndication');
        var contrastEl = document.getElementById('ioContrastProtocol');
        var creatinineEl = document.getElementById('ioCreatinine');
        var pregnancyEl = document.getElementById('ioPregnancyCheck');
        var portableEl = document.getElementById('ioPortable');
        var portableLabelEl = document.getElementById('ioPortableNote');

        if (priorityEl) priorityEl.value = order ? (order.priority || 'Routine') : 'Routine';
        if (timingEl) timingEl.value = order ? (order.timing || 'Scheduled') : 'Scheduled';
        if (indicationEl) indicationEl.value = order ? (order.clinicalIndication || '') : '';
        if (contrastEl) contrastEl.value = order ? (order.contrastProtocol || 'None') : 'None';
        if (pregnancyEl) pregnancyEl.value = order ? (order.pregnancyCheck || 'N/A') : 'N/A';
        if (portableEl) portableEl.checked = order ? !!order.portable : false;

        var examData = order ? RADIOLOGY_CATALOG.find(function (e) { return e.id === order.examId; }) : null;

        if (creatinineEl) {
            if (examData && examData.requiresContrast) {
                creatinineEl.value = PATIENT_CONTEXT.creatinine + ' (Low eGFR)';
            } else {
                creatinineEl.value = '';
            }
        }

        if (portableLabelEl) {
            if (examData && examData.modality === 'CT') {
                portableLabelEl.textContent = 'N/A for CT';
            } else {
                portableLabelEl.textContent = 'Yes';
            }
        }

        var alertEl = document.getElementById('ioContrastAlert');
        if (alertEl) {
            if (examData && examData.requiresContrast && PATIENT_CONTEXT.contrastAllergy) {
                alertEl.style.display = '';
            } else {
                alertEl.style.display = 'none';
            }
        }

        updateValidation();
    }

    function updateValidation() {
        var signBtn = document.getElementById('ioSignBtn');
        var errorSummary = document.getElementById('ioErrorSummary');
        var errors = [];

        if (ordersCart.length === 0) {
            errors.push('No orders in cart');
        }

        ordersCart.forEach(function (o, idx) {
            if (!o.clinicalIndication || o.clinicalIndication.trim() === '') {
                errors.push('Order ' + (idx + 1) + ': Missing clinical indication');
            }
        });

        if (signBtn) {
            signBtn.disabled = errors.length > 0;
        }

        var errorText = document.getElementById('ioErrorText');
        if (errorSummary) {
            if (errors.length > 0) {
                if (errorText) errorText.textContent = errors[0];
                errorSummary.style.display = '';
            } else {
                errorSummary.style.display = 'none';
            }
        }
    }

    function syncFormToOrder() {
        if (selectedOrderIndex < 0 || selectedOrderIndex >= ordersCart.length) return;
        var order = ordersCart[selectedOrderIndex];

        var priorityEl = document.getElementById('ioPriority');
        var timingEl = document.getElementById('ioTiming');
        var indicationEl = document.getElementById('ioClinicalIndication');
        var contrastEl = document.getElementById('ioContrastProtocol');
        var pregnancyEl = document.getElementById('ioPregnancyCheck');
        var portableEl = document.getElementById('ioPortable');

        if (priorityEl) order.priority = priorityEl.value;
        if (timingEl) order.timing = timingEl.value;
        if (indicationEl) order.clinicalIndication = indicationEl.value;
        if (contrastEl) order.contrastProtocol = contrastEl.value;
        if (pregnancyEl) order.pregnancyCheck = pregnancyEl.value;
        if (portableEl) order.portable = portableEl.checked;

        renderOrders();
        updateValidation();
    }

    window.ioFilterCatalog = function () {
        renderCatalog();
    };

    window.ioSetModalityFilter = function (btn) {
        var modality = btn.dataset.modality;
        var buttons = document.querySelectorAll('.io-modality-btn');
        if (modality === 'all' || activeModalityFilter === modality) {
            activeModalityFilter = null;
            buttons.forEach(function (b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.io-modality-btn[data-modality="all"]');
            if (allBtn) allBtn.classList.add('active');
        } else {
            activeModalityFilter = modality;
            buttons.forEach(function (b) {
                b.classList.toggle('active', b.dataset.modality === modality);
            });
        }
        renderCatalog();
    };

    window.ioSelectExam = function (id) {
        var exam = RADIOLOGY_CATALOG.find(function (e) { return e.id === id; });
        if (!exam) return;

        selectedExam = exam;

        var existingIndex = ordersCart.findIndex(function (o) { return o.examId === id; });
        if (existingIndex >= 0) {
            selectedOrderIndex = existingIndex;
            populateDetailForm(ordersCart[existingIndex]);
            renderCatalog();
            renderOrders();
            return;
        }

        var newOrder = {
            examId: exam.id,
            name: exam.name,
            modality: exam.modality,
            priority: 'Routine',
            timing: 'Scheduled',
            clinicalIndication: '',
            contrastProtocol: exam.contrastProtocol,
            pregnancyCheck: 'N/A',
            portable: false
        };

        ordersCart.push(newOrder);
        selectedOrderIndex = ordersCart.length - 1;

        renderCatalog();
        renderOrders();
        populateDetailForm(newOrder);
    };

    window.ioSelectOrder = function (idx) {
        if (idx < 0 || idx >= ordersCart.length) return;
        selectedOrderIndex = idx;
        var order = ordersCart[idx];
        selectedExam = RADIOLOGY_CATALOG.find(function (e) { return e.id === order.examId; }) || null;
        renderOrders();
        populateDetailForm(order);
        renderCatalog();
    };

    window.ioRemoveOrder = function (idx) {
        ordersCart.splice(idx, 1);
        if (selectedOrderIndex >= ordersCart.length) {
            selectedOrderIndex = ordersCart.length - 1;
        }
        if (selectedOrderIndex >= 0) {
            var order = ordersCart[selectedOrderIndex];
            selectedExam = RADIOLOGY_CATALOG.find(function (e) { return e.id === order.examId; }) || null;
            populateDetailForm(order);
        } else {
            selectedExam = null;
            populateDetailForm(null);
        }
        renderCatalog();
        renderOrders();
    };

    window.ioFormChange = function () {
        syncFormToOrder();
    };

    window.ioCancel = function () {
        window.location.href = 'diagnostic-tests.html';
    };

    window.ioReviewSign = function () {
        var errors = [];
        ordersCart.forEach(function (o, idx) {
            if (!o.clinicalIndication || o.clinicalIndication.trim() === '') {
                errors.push('Order ' + (idx + 1) + ' (' + o.name + '): Missing clinical indication');
            }
        });

        if (errors.length > 0) {
            alert('Cannot sign. Please fix:\n\n' + errors.join('\n'));
            return;
        }

        console.log('Signing imaging orders:', JSON.stringify(ordersCart, null, 2));
        alert('Orders signed successfully (' + ordersCart.length + ' order' + (ordersCart.length > 1 ? 's' : '') + ')');
        window.location.href = 'diagnostic-tests.html';
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderCatalog();
        renderOrders();
        populateDetailForm(null);

        var formFields = document.querySelectorAll('#ioForm select, #ioForm textarea, #ioForm input');
        formFields.forEach(function (el) {
            el.addEventListener('change', window.ioFormChange);
            el.addEventListener('input', window.ioFormChange);
        });
    });

})();
