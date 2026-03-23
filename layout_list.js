/**
 * @file layout_list.js — Modular List Layout Engine
 * @description Gestiona la inyección dinámica de los componentes de navegación
 *   específicos para las vistas de lista del EHR (Lista de Pacientes, Lista de Altas,
 *   Lista de UCI, etc.).
 *
 *   MODULARIDAD:
 *   Este archivo facilita la creación de nuevas listas simplemente cambiando el contenido
 *   de las pestañas en TAB_CONFIGS. Para crear una nueva lista (ej. Lista de Altas,
 *   Lista de UCI), basta con:
 *     1. Añadir una nueva entrada en TAB_CONFIGS con sus pestañas.
 *     2. Establecer el atributo data-list-type en el body del HTML correspondiente.
 *     3. El layout_list.js inyectará automáticamente la barra de pestañas y la toolbar.
 *
 *   ANGULAR 15 MIGRATION:
 *   En producción Angular 15, este archivo se reemplaza por:
 *     - TabBarComponent (Standalone) con PrimeNG <p-tabMenu>
 *     - ToolbarComponent (Standalone) con PrimeNG <p-toolbar>
 *     - PaginatorComponent con PrimeNG <p-paginator>
 *   Cada componente boundary está marcado con id attributes:
 *     id="tab-bar-component"   → <ech-tab-bar>
 *     id="toolbar-component"   → <ech-toolbar>
 *
 *   ICONOS DE ORDENACIÓN:
 *   Los iconos pi-sort-alt en los encabezados de la tabla son marcadores de posición
 *   (placeholders) para la lógica de sort de PrimeNG. En Angular, se reemplazan por
 *   p-sortableColumn con pSortableColumnIcon automáticos.
 */

/* ============================================================
 * CURRENT USER (simulated session — replace with auth token in Angular)
 * Angular: Reemplazado por AuthService.currentUser$ observable
 * ============================================================ */
var CURRENT_USER = { name: 'Dr. Rory Rogers', department: 'Cardiology' };

/* ============================================================
 * TAB CONFIGURATIONS
 * Define las pestañas disponibles para cada tipo de lista.
 * Para crear una nueva lista, añade una nueva clave aquí.
 * Angular: Reemplazado por MenuItem[] de PrimeNG TabMenu.
 * ============================================================ */
const TAB_CONFIGS = {
    'patient-list': [
        { id: 'loc-all',       label: 'All Inpatients',      i18n: 'TABS.LOC_ALL',       count: 12, active: true  }
    ],
    'discharge-list': [
        { id: 'pending-discharge', label: 'Pending Discharge', i18n: 'TABS.PENDING_DISCHARGE', count: 8,  active: true },
        { id: 'discharged-today',  label: 'Discharged Today',  i18n: 'TABS.DISCHARGED_TODAY',  count: 3,  active: false },
        { id: 'discharge-summary', label: 'Summary Pending',   i18n: 'TABS.SUMMARY_PENDING',   count: 2,  active: false }
    ],
    'icu-list': [
        { id: 'icu-current',       label: 'Current ICU',       i18n: 'TABS.ICU_CURRENT',       count: 6,  active: true },
        { id: 'icu-pending',       label: 'Pending Transfer',  i18n: 'TABS.ICU_PENDING',       count: 2,  active: false },
        { id: 'icu-discharged',    label: 'ICU Discharged',    i18n: 'TABS.ICU_DISCHARGED',    count: 4,  active: false }
    ],
    'ed-list': [
        { id: 'ed-all',            label: 'All',               i18n: 'TABS.ED_ALL',            count: 10, active: true },
    ],
    'day-hospital-list': [
        { id: 'loc-all',       label: 'All Day Cases',       i18n: 'TABS.LOC_ALL',       count: 14, active: true  },
        { id: 'loc-recent',    label: 'Recently Admitted',   i18n: 'TABS.LOC_RECENT',    count: 10, active: false },
        { id: 'loc-discharge', label: 'Planned Discharges',  i18n: 'TABS.LOC_DISCHARGE', count: 1,  active: false },
        { id: 'loc-icu',       label: 'ICU / PACU',          i18n: 'TABS.LOC_ICU',       count: 1,  active: false },
        { id: 'loc-surgery',   label: 'Patients in Surgery', i18n: 'TABS.LOC_SURGERY',   count: 0,  active: false }
    ]
};

/* ============================================================
 * SELECT DROPDOWN CONFIGS
 * Opciones de los dropdowns con checkboxes del toolbar.
 * Scope: visibilidad (todos / mis pacientes / mi dpto.)
 * Location: tipo de ubicación clínica (UCi, cirugía, etc.)
 * Angular: Reemplazado por <p-multiSelect> de PrimeNG.
 * ============================================================ */
const SCOPE_DROPDOWN_OPTIONS = [
    { id: 'all',  label: 'All Patients',  checked: true  },
    { id: 'mine', label: 'My Patients',   checked: false },
    { id: 'dept', label: 'My Department', checked: false }
];

const LOCATION_FILTER_CONFIGS = {
    'patient-list': [
        { id: 'loc-all',       label: 'All',                  count: 12, checked: true  },
        { id: 'loc-recent',    label: 'Recently Admitted',     count: 3,  checked: false },
        { id: 'loc-discharge', label: 'Planned Discharges',    count: 2,  checked: false },
        { id: 'loc-icu',       label: 'ICU / PACU',            count: 1,  checked: false },
        { id: 'loc-surgery',   label: 'Patients in Surgery',   count: 1,  checked: false }
    ]
};

/* ============================================================
 * SELECT DROPDOWN STATE
 * Mantiene el estado de selección de cada dropdown.
 * Angular: Reemplazado por FormControl en ToolbarComponent.
 * ============================================================ */
const DROPDOWN_STATE = {};

/* ============================================================
 * PAGINATION STATE
 * Angular: Reemplazado por PaginatorState en PatientListComponent
 * ============================================================ */
let currentPage = 1;
const totalPages = 4;

/* ============================================================
 * TAB BAR RENDERER
 * Inyecta la franja de pestañas con fondo grisáceo y botón de configuración.
 * Angular: TabBarComponent con PrimeNG <p-tabMenu [model]="tabs">
 * ============================================================ */
function renderTabBar() {
    const el = document.getElementById('tab-bar-component');
    if (!el) return;

    const listType = document.body.getAttribute('data-list-type') || 'patient-list';
    const tabs = TAB_CONFIGS[listType] || TAB_CONFIGS['patient-list'];

    const tabButtons = tabs.map(tab => {
        const activeClass = tab.active ? ' tab-btn-active' : '';
        const countBadge = tab.count !== undefined ? `<span class="tab-count">${tab.count}</span>` : '';
        return `<button class="tab-btn${activeClass}" data-tab-id="${tab.id}" data-i18n="${tab.i18n}" onclick="handleTabClick('${tab.id}')">
                    ${tab.label} ${countBadge}
                </button>`;
    }).join('\n            ');

    el.innerHTML = `
        <div class="tab-bar-inner">
            <div class="tab-bar-tabs">
                ${tabButtons}
            </div>
            <div class="tab-bar-actions">
                <button class="tab-config-btn" onclick="handleTabConfig()" title="Configure Tabs" data-i18n-title="TABS.CONFIGURE">
                    <i class="pi pi-cog"></i>
                </button>
            </div>
        </div>`;
}

/* ============================================================
 * SELECT DROPDOWN BUILDER
 * Genera el HTML de un dropdown con checkboxes y OK/Cancel.
 * Angular: Cada instancia → <p-multiSelect> en ToolbarComponent.
 * ============================================================ */
function buildSelectDropdownHtml(dropdownId, triggerLabel, options) {
    const optionsHtml = options.map(function(opt) {
        const isChecked = DROPDOWN_STATE[dropdownId]
            ? DROPDOWN_STATE[dropdownId].tempChecked.has(opt.id)
            : opt.checked;
        const countHtml = (opt.count !== undefined)
            ? `<span class="ech-select-option-count">${opt.count}</span>`
            : '';
        return `<label class="ech-select-option">
                        <input type="checkbox" value="${opt.id}"${isChecked ? ' checked' : ''}
                               onchange="handleSelectChange('${dropdownId}', '${opt.id}', this.checked)">
                        ${opt.label}${countHtml}
                    </label>`;
    }).join('\n                    ');

    const isOpen = DROPDOWN_STATE[dropdownId] && DROPDOWN_STATE[dropdownId].open;

    return `<div class="ech-select-dropdown${isOpen ? ' open' : ''}" id="${dropdownId}">
                <button class="ech-select-trigger ml-[3px] mr-[3px]"
                        onclick="event.stopPropagation(); toggleSelectDropdown('${dropdownId}')">
                    <span id="${dropdownId}-label">${triggerLabel}</span>
                    <i class="pi pi-chevron-down ech-select-chevron"></i>
                </button>
                <div class="ech-select-panel" onclick="event.stopPropagation()">
                    <div class="ech-select-panel-header">
                        <span>Select:</span>
                        <i class="pi pi-chevron-up"></i>
                    </div>
                    <div class="ech-select-options">
                        ${optionsHtml}
                    </div>
                    <div class="ech-select-footer">
                        <button class="ech-select-ok"
                                onclick="applySelectDropdown('${dropdownId}')">OK</button>
                        <button class="ech-select-cancel"
                                onclick="cancelSelectDropdown('${dropdownId}')">Cancel</button>
                    </div>
                </div>
            </div>`;
}

/* ============================================================
 * TOOLBAR RENDERER
 * Inyecta la barra de herramientas ampliada con paginación,
 * iconos de acción y buscador con badge.
 * Angular: ToolbarComponent con PrimeNG <p-toolbar>
 * ============================================================ */
function renderToolbar() {
    const el = document.getElementById('toolbar-component');
    if (!el) return;

    const listType = document.body.getAttribute('data-list-type') || '';
    const isPatientList = listType === 'patient-list';
    const isEDList = listType === 'ed-list';

    let filterControlsHtml = '';
    if (isPatientList) {
        initDropdownState('scope-dropdown', SCOPE_DROPDOWN_OPTIONS);
        const scopeLabel = getDropdownLabel('scope-dropdown', SCOPE_DROPDOWN_OPTIONS);
        filterControlsHtml += buildSelectDropdownHtml(
            'scope-dropdown', scopeLabel, SCOPE_DROPDOWN_OPTIONS
        );

        const locationOptions = LOCATION_FILTER_CONFIGS[listType];
        if (locationOptions) {
            initDropdownState('location-dropdown', locationOptions);
            const locationLabel = getDropdownLabel('location-dropdown', locationOptions);
            filterControlsHtml += buildSelectDropdownHtml(
                'location-dropdown', locationLabel, locationOptions
            );
        }
    } else if (!isEDList) {
        filterControlsHtml = `
                <div class="scope-filter-group">
                    <button class="scope-btn scope-btn-active" data-scope="all" onclick="handleScopeChange('all')">
                        <i class="pi pi-users"></i> All Patients
                    </button>
                    <button class="scope-btn" data-scope="mine" onclick="handleScopeChange('mine')">
                        <i class="pi pi-user"></i> My Patients
                    </button>
                    <button class="scope-btn" data-scope="dept" onclick="handleScopeChange('dept')">
                        <i class="pi pi-building"></i> My Department
                    </button>
                </div>`;
    }

    const savedMode = getListViewMode();
    const supportsCardView = CARD_VIEW_SUPPORTED.indexOf(listType) !== -1;
    const viewToggleHtml = supportsCardView ? `
                <div class="view-toggle-group">
                    <button class="view-toggle-btn${savedMode !== 'cards' ? ' view-toggle-active' : ''}"
                            id="viewToggleList" onclick="setListView('list')" title="List View">
                        <i class="pi pi-list"></i>
                    </button>
                    <button class="view-toggle-btn${savedMode === 'cards' ? ' view-toggle-active' : ''}"
                            id="viewToggleCards" onclick="setListView('cards')" title="Card View">
                        <i class="pi pi-th-large"></i>
                    </button>
                </div>` : '';

    const edDayNavHtml = isEDList ? `
                <div class="op-day-nav">
                    <button class="op-day-btn" onclick="edNavigateDay(-1)" title="Previous day"><i class="pi pi-chevron-left"></i></button>
                    <span class="op-day-label" id="edDayLabel">${(typeof edFormatNavDate === 'function' && typeof ED_CURRENT_DATE !== 'undefined') ? edFormatNavDate(ED_CURRENT_DATE) : ''}</span>
                    <button class="op-day-btn" onclick="edNavigateDay(1)" title="Next day"><i class="pi pi-chevron-right"></i></button>
                    <button class="op-day-btn op-day-cal-btn" onclick="edOpenCalendar()" title="Pick date"><i class="pi pi-calendar"></i></button>
                </div>` : `
                <button class="toolbar-action-btn" onclick="handleToolbarAction('pdf')" title="Export PDF" data-i18n-title="TOOLBAR.EXPORT_PDF">
                    <i class="pi pi-file-pdf"></i>
                </button>
                <button class="toolbar-action-btn" onclick="handleToolbarAction('filter')" title="Advanced Filter" data-i18n-title="TOOLBAR.FILTER">
                    <i class="pi pi-filter"></i>
                </button>
                <button class="toolbar-action-btn" onclick="handleToolbarAction('folder')" title="Manage Lists" data-i18n-title="TOOLBAR.MANAGE_LISTS">
                    <i class="pi pi-folder"></i>
                </button>`;

    el.innerHTML = `
        <div class="toolbar-inner">
            <div class="toolbar-left">
                <div class="toolbar-pagination">
                    <button class="pagination-btn" onclick="goToPage(1)" title="First Page" data-i18n-title="TOOLBAR.FIRST_PAGE">
                        <i class="pi pi-angle-double-left"></i>
                    </button>
                    <button class="pagination-btn" onclick="goToPage(currentPage - 1)" title="Previous Page" data-i18n-title="TOOLBAR.PREV_PAGE">
                        <i class="pi pi-angle-left"></i>
                    </button>
                    <span class="pagination-info" id="paginationInfo">
                        <span class="pagination-current" id="paginationCurrent">${currentPage}</span>
                        <span class="pagination-separator">/</span>
                        <span class="pagination-total">${totalPages}</span>
                    </span>
                    <button class="pagination-btn" onclick="goToPage(currentPage + 1)" title="Next Page" data-i18n-title="TOOLBAR.NEXT_PAGE">
                        <i class="pi pi-angle-right"></i>
                    </button>
                    <button class="pagination-btn" onclick="goToPage(totalPages)" title="Last Page" data-i18n-title="TOOLBAR.LAST_PAGE">
                        <i class="pi pi-angle-double-right"></i>
                    </button>
                </div>
                ${filterControlsHtml}
            </div>
            <div class="toolbar-center">
                ${edDayNavHtml}
            </div>
            <div class="toolbar-right">
                ${viewToggleHtml}
                <div class="toolbar-search-wrapper">
                    <i class="pi pi-search toolbar-search-icon"></i>
                    <input type="text" class="toolbar-search-input" placeholder="Search..." data-i18n-placeholder="TOOLBAR.SEARCH_PLACEHOLDER" id="toolbarSearch" oninput="handleToolbarSearch(this.value)">
                    <span class="toolbar-search-badge" id="toolbarSearchBadge">12</span>
                </div>
            </div>
        </div>`;
}

/* ============================================================
 * SELECT DROPDOWN STATE HELPERS
 * Inicialización y lectura del estado de cada dropdown.
 * ============================================================ */

function initDropdownState(dropdownId, options) {
    if (DROPDOWN_STATE[dropdownId]) return;
    DROPDOWN_STATE[dropdownId] = {
        open: false,
        appliedChecked: new Set(options.filter(o => o.checked).map(o => o.id)),
        tempChecked:    new Set(options.filter(o => o.checked).map(o => o.id))
    };
}

function getDropdownLabel(dropdownId, options) {
    const state = DROPDOWN_STATE[dropdownId];
    if (!state) {
        const defaultOpt = options.find(o => o.checked);
        return defaultOpt ? defaultOpt.label : 'Select...';
    }
    const checked = state.appliedChecked;
    if (checked.size === 0) return 'Select...';
    if (checked.size === 1) {
        const opt = options.find(o => checked.has(o.id));
        return opt ? opt.label : 'Select...';
    }
    return checked.size + ' selected';
}

/* ============================================================
 * EVENT HANDLERS
 * Angular: Reemplazados por métodos del componente con EventEmitter
 * ============================================================ */

function handleTabClick(tabId) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('tab-btn-active'));
    const activeBtn = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('tab-btn-active');
    console.log('Tab selected:', tabId);
}

function handleTabConfig() {
    console.log('Tab configuration opened');
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    const currentEl = document.getElementById('paginationCurrent');
    if (currentEl) currentEl.textContent = currentPage;
    console.log('Navigate to page:', currentPage);
}

function handleToolbarAction(action) {
    console.log('Toolbar action:', action);
}

/* ============================================================
 * SELECT DROPDOWN INTERACTION HANDLERS
 * Angular: Reemplazados por (onChange) / (onPanelHide) de p-multiSelect
 * ============================================================ */

function toggleSelectDropdown(dropdownId) {
    const state = DROPDOWN_STATE[dropdownId];
    if (!state) return;

    const isCurrentlyOpen = state.open;

    closeAllDropdowns();

    if (!isCurrentlyOpen) {
        state.open = true;
        state.tempChecked = new Set(state.appliedChecked);
        const el = document.getElementById(dropdownId);
        if (el) {
            el.classList.add('open');
            el.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                cb.checked = state.tempChecked.has(cb.value);
            });
        }
    }
}

function handleSelectChange(dropdownId, optionId, checked) {
    const state = DROPDOWN_STATE[dropdownId];
    if (!state) return;
    if (checked) {
        state.tempChecked.add(optionId);
    } else {
        state.tempChecked.delete(optionId);
    }
}

function applySelectDropdown(dropdownId) {
    const state = DROPDOWN_STATE[dropdownId];
    if (!state) return;

    state.appliedChecked = new Set(state.tempChecked);
    state.open = false;

    const el = document.getElementById(dropdownId);
    if (el) el.classList.remove('open');

    const options = dropdownId === 'scope-dropdown'
        ? SCOPE_DROPDOWN_OPTIONS
        : (LOCATION_FILTER_CONFIGS[document.body.getAttribute('data-list-type')] || []);

    const labelEl = document.getElementById(dropdownId + '-label');
    if (labelEl) labelEl.textContent = getDropdownLabel(dropdownId, options);

    console.log('Dropdown applied:', dropdownId, [...state.appliedChecked]);
}

function cancelSelectDropdown(dropdownId) {
    const state = DROPDOWN_STATE[dropdownId];
    if (!state) return;
    state.tempChecked = new Set(state.appliedChecked);
    state.open = false;
    const el = document.getElementById(dropdownId);
    if (el) el.classList.remove('open');
}

function handleScopeChange(scope) {
    document.querySelectorAll('.scope-btn[data-scope]').forEach(function(btn) {
        btn.classList.toggle('scope-btn-active', btn.getAttribute('data-scope') === scope);
    });
    console.log('Scope changed:', scope);
}

function closeAllDropdowns() {
    Object.keys(DROPDOWN_STATE).forEach(function(id) {
        DROPDOWN_STATE[id].open = false;
    });
    document.querySelectorAll('.ech-select-dropdown.open').forEach(function(el) {
        el.classList.remove('open');
    });
}

function handleToolbarSearch(value) {
    if (typeof filterPatientList === 'function') {
        filterPatientList(value);
    } else if (typeof filterDayList === 'function') {
        filterDayList(value);
    } else if (typeof filterSurgList === 'function') {
        filterSurgList(value);
    }
}

/* ============================================================
 * VIEW TOGGLE — List / Cards
 * Supported for: patient-list, surgical-list, ed-list
 * Angular: @Input() viewMode: 'list' | 'cards' in PatientListComponent
 * ============================================================ */
var CARD_VIEW_SUPPORTED = ['patient-list', 'surgical-list', 'ed-list'];

function getListViewMode() {
    var listType = document.body.getAttribute('data-list-type') || 'patient-list';
    return localStorage.getItem('ech_view_' + listType) || 'list';
}

function setListView(mode) {
    var listType = document.body.getAttribute('data-list-type') || 'patient-list';
    localStorage.setItem('ech_view_' + listType, mode);

    var btnList = document.getElementById('viewToggleList');
    var btnCards = document.getElementById('viewToggleCards');
    if (btnList) {
        btnList.classList.toggle('view-toggle-active', mode === 'list');
    }
    if (btnCards) {
        btnCards.classList.toggle('view-toggle-active', mode === 'cards');
    }

    var area = document.getElementById('patient-list-component');
    if (area) area.classList.toggle('view-cards-mode', mode === 'cards');

    if (listType === 'patient-list' && typeof renderPatientList === 'function') {
        renderPatientList();
    } else if (listType === 'surgical-list' && typeof renderSurgList === 'function') {
        renderSurgList();
    } else if (listType === 'ed-list' && typeof renderEDList === 'function') {
        renderEDList();
    }
}

/* ============================================================
 * INITIALIZATION
 * Angular: Reemplazado por ngOnInit() en el componente padre
 * ============================================================ */
function initListLayout() {
    renderTabBar();
    renderToolbar();
    document.addEventListener('click', closeAllDropdowns);
}

document.addEventListener('DOMContentLoaded', initListLayout);
