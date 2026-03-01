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
 * TAB CONFIGURATIONS
 * Define las pestañas disponibles para cada tipo de lista.
 * Para crear una nueva lista, añade una nueva clave aquí.
 * Angular: Reemplazado por MenuItem[] de PrimeNG TabMenu.
 * ============================================================ */
const TAB_CONFIGS = {
    'patient-list': [
        { id: 'arrivals-today',    label: 'Arrivals Today',    i18n: 'TABS.ARRIVALS_TODAY',    count: 12, active: true },
        { id: 'planned-arrivals',  label: 'Planned Arrivals',  i18n: 'TABS.PLANNED_ARRIVALS',  count: 5,  active: false },
        { id: 'all-inpatients',    label: 'All Inpatients',    i18n: 'TABS.ALL_INPATIENTS',    count: 48, active: false },
        { id: 'discharges-today',  label: 'Discharges Today',  i18n: 'TABS.DISCHARGES_TODAY',  count: 3,  active: false },
        { id: 'pending-admission', label: 'Pending Admission', i18n: 'TABS.PENDING_ADMISSION', count: 7,  active: false }
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

function handleToolbarSearch(value) {
    const badge = document.getElementById('toolbarSearchBadge');
    if (badge) {
        const count = value.length > 0 ? PatientListData.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase())
        ).length : PatientListData.length;
        badge.textContent = count;
    }
    if (typeof filterPatientList === 'function') {
        filterPatientList(value);
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
