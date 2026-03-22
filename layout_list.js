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
        { id: 'loc-all',       label: 'All Inpatients',      i18n: 'TABS.LOC_ALL',       count: 12, active: true  },
        { id: 'loc-recent',    label: 'Recently Admitted',   i18n: 'TABS.LOC_RECENT',    count: 3,  active: false },
        { id: 'loc-discharge', label: 'Planned Discharges',  i18n: 'TABS.LOC_DISCHARGE', count: 2,  active: false },
        { id: 'loc-icu',       label: 'ICU / PACU',          i18n: 'TABS.LOC_ICU',       count: 1,  active: false },
        { id: 'loc-surgery',   label: 'Patients in Surgery', i18n: 'TABS.LOC_SURGERY',   count: 1,  active: false }
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
        { id: 'ed-waiting',        label: 'Waiting Room',      i18n: 'TABS.ED_WAITING',        count: 3,  active: false },
        { id: 'ed-inroom',         label: 'In Room',           i18n: 'TABS.ED_IN_ROOM',        count: 5,  active: false },
        { id: 'ed-dispo',          label: 'Dispo',             i18n: 'TABS.ED_DISPO',          count: 2,  active: false },
        { id: 'ed-high-acuity',    label: 'High Acuity',       i18n: 'TABS.ED_HIGH_ACUITY',    count: 3,  active: false }
    ],
    'day-hospital-list': [
        { id: 'loc-all',       label: 'All Day Cases',       i18n: 'TABS.LOC_ALL',       count: 14, active: true  },
        { id: 'loc-recent',    label: 'Recently Admitted',   i18n: 'TABS.LOC_RECENT',    count: 10, active: false },
        { id: 'loc-discharge', label: 'Planned Discharges',  i18n: 'TABS.LOC_DISCHARGE', count: 1,  active: false },
        { id: 'loc-icu',       label: 'ICU / PACU',          i18n: 'TABS.LOC_ICU',       count: 1,  active: false },
        { id: 'loc-surgery',   label: 'Patients in Surgery', i18n: 'TABS.LOC_SURGERY',   count: 0,  active: false }
    ],
    'surgical-list': [
        { id: 'loc-all',       label: 'All Cases',           i18n: 'TABS.LOC_ALL',       count: 12, active: true  },
        { id: 'loc-recent',    label: 'Recently Admitted',   i18n: 'TABS.LOC_RECENT',    count: 5,  active: false },
        { id: 'loc-discharge', label: 'Planned Discharges',  i18n: 'TABS.LOC_DISCHARGE', count: 2,  active: false },
        { id: 'loc-icu',       label: 'ICU / PACU',          i18n: 'TABS.LOC_ICU',       count: 0,  active: false },
        { id: 'loc-surgery',   label: 'In Theatre',          i18n: 'TABS.LOC_SURGERY',   count: 2,  active: false }
    ],
    'outpatient-list': [
        { id: 'op-all',            label: 'All',              i18n: 'TABS.OP_ALL',            count: 18, active: true  },
        { id: 'op-arrived',        label: 'Arrived',          i18n: 'TABS.OP_ARRIVED',        count: 3,  active: false },
        { id: 'op-waiting',        label: 'Waiting',          i18n: 'TABS.OP_WAITING',        count: 5,  active: false },
        { id: 'op-inconsultation', label: 'In Consultation',  i18n: 'TABS.OP_INCONSULTATION', count: 2,  active: false },
        { id: 'op-completed',      label: 'Completed',        i18n: 'TABS.OP_COMPLETED',      count: 8,  active: false }
    ]
};

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
 * TOOLBAR RENDERER
 * Inyecta la barra de herramientas ampliada con paginación,
 * iconos de acción y buscador con badge.
 * Angular: ToolbarComponent con PrimeNG <p-toolbar>
 * ============================================================ */
function renderToolbar() {
    const el = document.getElementById('toolbar-component');
    if (!el) return;

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
                </div>
            </div>
            <div class="toolbar-center">
                <button class="toolbar-action-btn" onclick="handleToolbarAction('pdf')" title="Export PDF" data-i18n-title="TOOLBAR.EXPORT_PDF">
                    <i class="pi pi-file-pdf"></i>
                </button>
                <button class="toolbar-action-btn" onclick="handleToolbarAction('filter')" title="Advanced Filter" data-i18n-title="TOOLBAR.FILTER">
                    <i class="pi pi-filter"></i>
                </button>
                <button class="toolbar-action-btn" onclick="handleToolbarAction('folder')" title="Manage Lists" data-i18n-title="TOOLBAR.MANAGE_LISTS">
                    <i class="pi pi-folder"></i>
                </button>
            </div>
            <div class="toolbar-right">
                <div class="toolbar-search-wrapper">
                    <i class="pi pi-search toolbar-search-icon"></i>
                    <input type="text" class="toolbar-search-input" placeholder="Search..." data-i18n-placeholder="TOOLBAR.SEARCH_PLACEHOLDER" id="toolbarSearch" oninput="handleToolbarSearch(this.value)">
                    <span class="toolbar-search-badge" id="toolbarSearchBadge">12</span>
                </div>
            </div>
        </div>`;
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

function handleScopeChange(scope) {
    document.querySelectorAll('.scope-btn').forEach(function(btn) {
        btn.classList.toggle('scope-btn-active', btn.getAttribute('data-scope') === scope);
    });
    console.log('Scope changed:', scope);
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
 * INITIALIZATION
 * Angular: Reemplazado por ngOnInit() en el componente padre
 * ============================================================ */
function initListLayout() {
    renderTabBar();
    renderToolbar();
}

document.addEventListener('DOMContentLoaded', initListLayout);
