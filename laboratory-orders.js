/**
 * laboratory-orders.js
 * ---------------------------------------------------------------------------
 * Laboratory Orders data, rendering, and interactivity logic.
 *
 * Angular Migration Notes:
 * - This file will become a LaboratoryOrdersComponent with a LabService.
 * - LAB_CATALOG will be replaced by an Observable from the Java REST API.
 * - Rendering functions will be replaced by *ngFor with PrimeNG templates.
 * ---------------------------------------------------------------------------
 */

(function () {

    var LAB_CATALOG = [
        { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', specimenType: 'Blood', defaultVolume: '4 mL', fastingRequired: false, isCoagulation: false },
        { id: 2, name: 'Hemoglobin A1c', category: 'Hematology', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: false },
        { id: 3, name: 'Reticulocyte Count', category: 'Hematology', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: false },
        { id: 4, name: 'Basic Metabolic Panel (BMP)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
        { id: 5, name: 'Comprehensive Metabolic Panel (CMP)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
        { id: 6, name: 'Lipid Panel', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '5 mL', fastingRequired: true, isCoagulation: false },
        { id: 7, name: 'Blood Culture (Aerobic/Anaerobic)', category: 'Microbiology', specimenType: 'Blood', defaultVolume: '10 mL', fastingRequired: false, isCoagulation: false },
        { id: 8, name: 'Urine Culture & Sensitivity', category: 'Microbiology', specimenType: 'Urine', defaultVolume: '10 mL', fastingRequired: false, isCoagulation: false },
        { id: 9, name: 'Wound Culture & Gram Stain', category: 'Microbiology', specimenType: 'Swab', defaultVolume: 'N/A', fastingRequired: false, isCoagulation: false },
        { id: 10, name: 'INR / Prothrombin Time (PT)', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
        { id: 11, name: 'Partial Thromboplastin Time (PTT)', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
        { id: 12, name: 'D-Dimer', category: 'Coagulation', specimenType: 'Blood', defaultVolume: '3 mL', fastingRequired: false, isCoagulation: true },
        { id: 13, name: 'Urinalysis (UA)', category: 'Urinalysis', specimenType: 'Urine', defaultVolume: '30 mL', fastingRequired: false, isCoagulation: false },
        { id: 14, name: 'Urine Microalbumin/Creatinine Ratio', category: 'Urinalysis', specimenType: 'Urine', defaultVolume: '15 mL', fastingRequired: false, isCoagulation: false },
        { id: 15, name: 'Thyroid Stimulating Hormone (TSH)', category: 'Chemistry', specimenType: 'Blood', defaultVolume: '4 mL', fastingRequired: false, isCoagulation: false }
    ];

    var PATIENT_CONTEXT = {
        activeAnticoagulants: [
            { name: 'Warfarin', dose: '5 mg', frequency: 'Daily' }
        ],
        lastINR: 2.8,
        bleedingRisk: 'Moderate'
    };

    var activeCategoryFilter = null;
    var selectedExam = null;
    var ordersCart = [];
    var selectedOrderIndex = -1;

    function getFilteredCatalog(searchText) {
        searchText = (searchText || '').toLowerCase();
        return LAB_CATALOG.filter(function (item) {
            var matchesSearch = !searchText || item.name.toLowerCase().indexOf(searchText) !== -1;
            var matchesCategory = !activeCategoryFilter || item.category === activeCategoryFilter;
            return matchesSearch && matchesCategory;
        });
    }

    function renderCatalog() {
        var list = document.getElementById('loCatalogList');
        if (!list) return;
        var searchText = (document.getElementById('loSearchInput') || {}).value || '';
        var filtered = getFilteredCatalog(searchText);

        if (filtered.length === 0) {
            list.innerHTML = '<div class="io-catalog-empty"><i class="pi pi-info-circle"></i> No tests found</div>';
            return;
        }

        list.innerHTML = filtered.map(function (item) {
            var activeClass = selectedExam && selectedExam.id === item.id ? ' io-catalog-item-active' : '';
            return '<div class="io-catalog-item' + activeClass + '" data-exam-id="' + item.id + '" onclick="loSelectExam(' + item.id + ')">' +
                '<span class="io-catalog-item-name">' + item.name + '</span>' +
                '<span class="io-catalog-item-modality">' + item.category + '</span>' +
                '</div>';
        }).join('');
    }

    function renderOrders() {
        var list = document.getElementById('loOrdersList');
        if (!list) return;

        if (ordersCart.length === 0) {
            list.innerHTML = '<div class="io-orders-empty"><i class="pi pi-inbox"></i><span>No orders pending signature</span></div>';
            return;
        }

        list.innerHTML = ordersCart.map(function (o, idx) {
            var isSelected = idx === selectedOrderIndex ? ' io-order-item-active' : '';
            var tagsHtml = '';

            if (o.fastingRequired) {
                tagsHtml += '<span class="lo-tag-fasting"><i class="pi pi-clock"></i> Fasting</span>';
            }
            if (o.priority === 'STAT') {
                tagsHtml += '<span class="lo-tag-stat"><i class="pi pi-bolt"></i> STAT</span>';
            }

            var statusHtml = '';
            var missingFields = getMissingFields(o);
            if (missingFields.length > 0) {
                statusHtml = '<span class="io-order-status-error"><i class="pi pi-exclamation-circle"></i> Missing ' + missingFields.length + '</span>';
            } else {
                statusHtml = '<span class="io-order-status-ok"><i class="pi pi-check-circle"></i> Ready</span>';
            }

            return '<div class="io-order-item' + isSelected + '" onclick="loSelectOrder(' + idx + ')">' +
                '<div class="io-order-item-info">' +
                    '<span class="io-order-item-name">' + o.name + '</span>' +
                    '<span class="io-order-item-detail">' + (o.priority || 'Routine') + ' | ' + (o.frequency || 'Once') + '</span>' +
                    '<div class="lo-order-tags">' + tagsHtml + '</div>' +
                '</div>' +
                '<div class="io-order-item-right">' +
                    statusHtml +
                    '<button class="io-order-remove" onclick="event.stopPropagation();loRemoveOrder(' + idx + ')" title="Remove order" aria-label="Remove order"><i class="pi pi-trash"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function getMissingFields(order) {
        var missing = [];
        if (!order.specimenType || order.specimenType.trim() === '') {
            missing.push('Specimen Type');
        }
        if (!order.requestedDate || order.requestedDate.trim() === '') {
            missing.push('Requested Date/Time');
        }
        if (!order.clinicalIndication || order.clinicalIndication.trim() === '') {
            missing.push('Clinical Indication');
        }
        if (order.fastingRequired && (!order.fastingDuration || order.fastingDuration.trim() === '')) {
            missing.push('Fasting Duration');
        }
        return missing;
    }

    function populateDetailForm(order) {
        var titleEl = document.getElementById('loDetailExamName');
        if (titleEl) titleEl.textContent = order ? order.name : '—';

        var priorityEl = document.getElementById('loPriority');
        var requestedDateEl = document.getElementById('loRequestedDate');
        var frequencyEl = document.getElementById('loFrequency');
        var specimenTypeEl = document.getElementById('loSpecimenType');
        var collectionMethodEl = document.getElementById('loCollectionMethod');
        var volumeEl = document.getElementById('loVolumeRequired');
        var fastingEl = document.getElementById('loFastingRequired');
        var fastingDurationEl = document.getElementById('loFastingDuration');
        var fastingDurationGroup = document.getElementById('loFastingDurationGroup');
        var indicationEl = document.getElementById('loClinicalIndication');

        if (priorityEl) priorityEl.value = order ? (order.priority || 'Routine') : 'Routine';
        if (requestedDateEl) requestedDateEl.value = order ? (order.requestedDate || '') : '';
        if (frequencyEl) frequencyEl.value = order ? (order.frequency || 'Once') : 'Once';
        if (specimenTypeEl) specimenTypeEl.value = order ? (order.specimenType || '') : '';
        if (collectionMethodEl) collectionMethodEl.value = order ? (order.collectionMethod || 'Nurse') : 'Nurse';
        if (volumeEl) volumeEl.value = order ? (order.volumeRequired || '') : '';
        if (fastingEl) fastingEl.value = order ? (order.fastingRequired ? 'Yes' : 'No') : 'No';
        if (indicationEl) indicationEl.value = order ? (order.clinicalIndication || '') : '';

        if (fastingDurationGroup) {
            if (order && order.fastingRequired) {
                fastingDurationGroup.style.display = '';
            } else {
                fastingDurationGroup.style.display = 'none';
            }
        }
        if (fastingDurationEl) fastingDurationEl.value = order ? (order.fastingDuration || '8') : '8';

        var alertEl = document.getElementById('loCoagAlert');
        if (alertEl) {
            var examData = order ? LAB_CATALOG.find(function (e) { return e.id === order.examId; }) : null;
            if (examData && examData.isCoagulation && PATIENT_CONTEXT.activeAnticoagulants.length > 0) {
                var medsHtml = PATIENT_CONTEXT.activeAnticoagulants.map(function (med) {
                    return med.name + ' ' + med.dose + ' (' + med.frequency + ')';
                }).join(', ');
                var alertContent = document.getElementById('loCoagAlertMeds');
                if (alertContent) alertContent.textContent = medsHtml;
                alertEl.style.display = '';
            } else {
                alertEl.style.display = 'none';
            }
        }

        updateValidation();
    }

    function updateValidation() {
        var signBtn = document.getElementById('loSignBtn');
        var errorSummary = document.getElementById('loErrorSummary');
        var errors = [];

        if (ordersCart.length === 0) {
            errors.push('No orders in cart');
        }

        ordersCart.forEach(function (o, idx) {
            var missing = getMissingFields(o);
            missing.forEach(function (field) {
                errors.push('Order ' + (idx + 1) + ': Missing ' + field);
            });
        });

        if (signBtn) {
            signBtn.disabled = errors.length > 0;
        }

        var errorText = document.getElementById('loErrorText');
        if (errorSummary) {
            if (errors.length > 0) {
                if (errorText) errorText.textContent = errors.length + ' error(s): ' + errors[0];
                errorSummary.style.display = '';
            } else {
                errorSummary.style.display = 'none';
            }
        }
    }

    function syncFormToOrder() {
        if (selectedOrderIndex < 0 || selectedOrderIndex >= ordersCart.length) return;
        var order = ordersCart[selectedOrderIndex];

        var priorityEl = document.getElementById('loPriority');
        var requestedDateEl = document.getElementById('loRequestedDate');
        var frequencyEl = document.getElementById('loFrequency');
        var specimenTypeEl = document.getElementById('loSpecimenType');
        var collectionMethodEl = document.getElementById('loCollectionMethod');
        var fastingEl = document.getElementById('loFastingRequired');
        var fastingDurationEl = document.getElementById('loFastingDuration');
        var indicationEl = document.getElementById('loClinicalIndication');

        if (priorityEl) order.priority = priorityEl.value;
        if (requestedDateEl) order.requestedDate = requestedDateEl.value;
        if (frequencyEl) order.frequency = frequencyEl.value;
        if (specimenTypeEl) order.specimenType = specimenTypeEl.value;
        if (collectionMethodEl) order.collectionMethod = collectionMethodEl.value;
        if (fastingEl) {
            order.fastingRequired = fastingEl.value === 'Yes';
            var fastingDurationGroup = document.getElementById('loFastingDurationGroup');
            if (fastingDurationGroup) {
                fastingDurationGroup.style.display = order.fastingRequired ? '' : 'none';
            }
        }
        if (fastingDurationEl) order.fastingDuration = fastingDurationEl.value;
        if (indicationEl) order.clinicalIndication = indicationEl.value;

        var volumeEl = document.getElementById('loVolumeRequired');
        if (specimenTypeEl && volumeEl) {
            var examData = LAB_CATALOG.find(function (e) { return e.id === order.examId; });
            if (examData) {
                volumeEl.value = examData.defaultVolume;
                order.volumeRequired = examData.defaultVolume;
            }
        }

        renderOrders();
        updateValidation();
    }

    window.loFilterCatalog = function () {
        renderCatalog();
    };

    window.loSetCategoryFilter = function (btn) {
        var category = btn.dataset.category;
        var buttons = document.querySelectorAll('.io-modality-btn');
        if (category === 'all' || activeCategoryFilter === category) {
            activeCategoryFilter = null;
            buttons.forEach(function (b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.io-modality-btn[data-category="all"]');
            if (allBtn) allBtn.classList.add('active');
        } else {
            activeCategoryFilter = category;
            buttons.forEach(function (b) {
                b.classList.toggle('active', b.dataset.category === category);
            });
        }
        renderCatalog();
    };

    window.loSelectExam = function (id) {
        var exam = LAB_CATALOG.find(function (e) { return e.id === id; });
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
            category: exam.category,
            priority: 'Routine',
            requestedDate: '',
            frequency: 'Once',
            specimenType: exam.specimenType,
            collectionMethod: 'Nurse',
            volumeRequired: exam.defaultVolume,
            fastingRequired: exam.fastingRequired,
            fastingDuration: exam.fastingRequired ? '8' : '',
            clinicalIndication: ''
        };

        ordersCart.push(newOrder);
        selectedOrderIndex = ordersCart.length - 1;

        renderCatalog();
        renderOrders();
        populateDetailForm(newOrder);
    };

    window.loSelectOrder = function (idx) {
        if (idx < 0 || idx >= ordersCart.length) return;
        selectedOrderIndex = idx;
        var order = ordersCart[idx];
        selectedExam = LAB_CATALOG.find(function (e) { return e.id === order.examId; }) || null;
        renderOrders();
        populateDetailForm(order);
        renderCatalog();
    };

    window.loRemoveOrder = function (idx) {
        ordersCart.splice(idx, 1);
        if (selectedOrderIndex >= ordersCart.length) {
            selectedOrderIndex = ordersCart.length - 1;
        }
        if (selectedOrderIndex >= 0) {
            var order = ordersCart[selectedOrderIndex];
            selectedExam = LAB_CATALOG.find(function (e) { return e.id === order.examId; }) || null;
            populateDetailForm(order);
        } else {
            selectedExam = null;
            populateDetailForm(null);
        }
        renderCatalog();
        renderOrders();
    };

    window.loFormChange = function () {
        syncFormToOrder();
    };

    window.loCancel = function () {
        window.location.href = 'diagnostic-tests.html';
    };

    window.loReviewSign = function () {
        var errors = [];
        ordersCart.forEach(function (o, idx) {
            var missing = getMissingFields(o);
            missing.forEach(function (field) {
                errors.push('Order ' + (idx + 1) + ' (' + o.name + '): Missing ' + field);
            });
        });

        if (errors.length > 0) {
            alert('Cannot sign. Please fix:\n\n' + errors.join('\n'));
            return;
        }

        console.log('Signing laboratory orders:', JSON.stringify(ordersCart, null, 2));
        alert('Orders signed successfully (' + ordersCart.length + ' order' + (ordersCart.length > 1 ? 's' : '') + ')');
        window.location.href = 'diagnostic-tests.html';
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderCatalog();
        renderOrders();
        populateDetailForm(null);

        var formFields = document.querySelectorAll('#loForm select, #loForm textarea, #loForm input');
        formFields.forEach(function (el) {
            el.addEventListener('change', window.loFormChange);
            el.addEventListener('input', window.loFormChange);
        });
    });

})();
