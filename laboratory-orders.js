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

    var LAB_CATALOG = ClinicalDataService.getLabCatalog();
    var LAB_PROFILES = ClinicalDataService.getLabProfiles();
    var PATIENT_CONTEXT = ClinicalDataService.getLabOrdersContext() || {};

    var FAVORITES_KEY = 'lo_favorite_tests';

    var activeCategoryFilter = null;
    var showFavoritesOnly = false;
    var selectedExam = null;
    var ordersCart = [];
    var selectedOrderIndex = -1;

    var profileDropdownOpen = false;
    var selectedProfileId = null;

    function getFavoriteIds() {
        try {
            return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveFavoriteIds(ids) {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
        } catch (e) {}
    }

    function isFavorite(examId) {
        return getFavoriteIds().indexOf(examId) !== -1;
    }

    function toggleFavorite(examId) {
        var ids = getFavoriteIds();
        var idx = ids.indexOf(examId);
        if (idx === -1) {
            ids.push(examId);
        } else {
            ids.splice(idx, 1);
        }
        saveFavoriteIds(ids);
    }

    function getFilteredCatalog(searchText) {
        searchText = (searchText || '').toLowerCase();
        var favoriteIds = getFavoriteIds();
        return LAB_CATALOG.filter(function (item) {
            var matchesSearch = !searchText || item.name.toLowerCase().indexOf(searchText) !== -1;
            var matchesCategory = !activeCategoryFilter || item.category === activeCategoryFilter;
            var matchesFavorites = !showFavoritesOnly || favoriteIds.indexOf(item.id) !== -1;
            return matchesSearch && matchesCategory && matchesFavorites;
        });
    }

    function renderCatalog() {
        var list = document.getElementById('loCatalogList');
        if (!list) return;
        var searchText = (document.getElementById('loSearchInput') || {}).value || '';
        var filtered = getFilteredCatalog(searchText);

        if (filtered.length === 0) {
            var emptyMsg = showFavoritesOnly
                ? '<div class="io-catalog-empty"><i class="pi pi-star"></i> No favorite tests yet. Click the star on any test to add it.</div>'
                : '<div class="io-catalog-empty"><i class="pi pi-info-circle"></i> No tests found</div>';
            list.innerHTML = emptyMsg;
            return;
        }

        list.innerHTML = filtered.map(function (item) {
            var activeClass = selectedExam && selectedExam.id === item.id ? ' io-catalog-item-active' : '';
            var fav = isFavorite(item.id);
            var favClass = fav ? ' lo-fav-star-active' : '';
            var favIcon = fav ? 'pi-star-fill' : 'pi-star';
            return '<div class="io-catalog-item' + activeClass + '" data-exam-id="' + item.id + '" onclick="loSelectExam(' + item.id + ')">' +
                '<button class="lo-fav-star' + favClass + '" onclick="event.stopPropagation();loToggleFavorite(' + item.id + ')" title="Toggle favorite" aria-label="Toggle favorite">' +
                    '<i class="pi ' + favIcon + '"></i>' +
                '</button>' +
                '<span class="io-catalog-item-name">' + item.name + '</span>' +
                '<span class="io-catalog-item-modality">' + item.category + '</span>' +
                '</div>';
        }).join('');
    }

    function renderProfileList() {
        var list = document.getElementById('loProfileList');
        if (!list) return;
        list.innerHTML = LAB_PROFILES.map(function (profile) {
            var isSelected = selectedProfileId === profile.id;
            var testCount = profile.testIds.length;
            return '<div class="lo-profile-item' + (isSelected ? ' lo-profile-item-selected' : '') + '" onclick="loSelectProfile(\'' + profile.id + '\')">' +
                '<div class="lo-profile-item-check">' +
                    '<span class="lo-profile-checkbox' + (isSelected ? ' lo-profile-checkbox-checked' : '') + '">' +
                        (isSelected ? '<i class="pi pi-check"></i>' : '') +
                    '</span>' +
                '</div>' +
                '<div class="lo-profile-item-info">' +
                    '<span class="lo-profile-item-name">' + profile.name + '</span>' +
                    '<span class="lo-profile-item-desc">' + profile.description + ' &mdash; ' + testCount + ' test' + (testCount !== 1 ? 's' : '') + '</span>' +
                '</div>' +
            '</div>';
        }).join('');

        var applyBtn = document.getElementById('loProfileApplyBtn');
        if (applyBtn) {
            applyBtn.disabled = !selectedProfileId;
        }
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

    window.loToggleFavorite = function (examId) {
        toggleFavorite(examId);
        renderCatalog();
    };

    window.loToggleFavoritesFilter = function () {
        showFavoritesOnly = !showFavoritesOnly;
        var btn = document.getElementById('loFavoritesFilterBtn');
        if (btn) {
            btn.classList.toggle('active', showFavoritesOnly);
        }
        if (showFavoritesOnly) {
            activeCategoryFilter = null;
            var categoryBtns = document.querySelectorAll('.io-modality-btn:not(#loFavoritesFilterBtn)');
            categoryBtns.forEach(function (b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.io-modality-btn[data-category="all"]');
            if (allBtn) allBtn.classList.remove('active');
        }
        renderCatalog();
    };

    window.loSetCategoryFilter = function (btn) {
        if (showFavoritesOnly) {
            showFavoritesOnly = false;
            var favBtn = document.getElementById('loFavoritesFilterBtn');
            if (favBtn) favBtn.classList.remove('active');
        }
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

    window.loToggleProfileDropdown = function () {
        if (profileDropdownOpen) {
            loCloseProfileDropdown();
        } else {
            profileDropdownOpen = true;
            selectedProfileId = null;
            renderProfileList();
            var panel = document.getElementById('loProfilePanel');
            var btn = document.getElementById('loProfileBtn');
            var chevron = document.getElementById('loProfileChevron');
            if (panel) panel.classList.add('lo-profile-panel-open');
            if (btn) btn.setAttribute('aria-expanded', 'true');
            if (chevron) chevron.classList.add('lo-profile-chevron-open');
        }
    };

    window.loCloseProfileDropdown = function () {
        profileDropdownOpen = false;
        var panel = document.getElementById('loProfilePanel');
        var btn = document.getElementById('loProfileBtn');
        var chevron = document.getElementById('loProfileChevron');
        if (panel) panel.classList.remove('lo-profile-panel-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (chevron) chevron.classList.remove('lo-profile-chevron-open');
    };

    window.loSelectProfile = function (profileId) {
        selectedProfileId = profileId;
        renderProfileList();
    };

    window.loApplyProfile = function () {
        if (!selectedProfileId) return;
        var profile = LAB_PROFILES.find(function (p) { return p.id === selectedProfileId; });
        if (!profile) return;

        profile.testIds.forEach(function (testId) {
            var exam = LAB_CATALOG.find(function (e) { return e.id === testId; });
            if (!exam) return;
            var existingIndex = ordersCart.findIndex(function (o) { return o.examId === testId; });
            if (existingIndex >= 0) return;
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
        });

        selectedOrderIndex = ordersCart.length > 0 ? ordersCart.length - 1 : -1;
        if (selectedOrderIndex >= 0) {
            var lastOrder = ordersCart[selectedOrderIndex];
            selectedExam = LAB_CATALOG.find(function (e) { return e.id === lastOrder.examId; }) || null;
            populateDetailForm(lastOrder);
        }

        loCloseProfileDropdown();
        selectedProfileId = null;
        renderCatalog();
        renderOrders();
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

        document.addEventListener('click', function (e) {
            if (!profileDropdownOpen) return;
            var wrapper = document.getElementById('loProfileDropdownWrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                loCloseProfileDropdown();
            }
        });
    });

})();
