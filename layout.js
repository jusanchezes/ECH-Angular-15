/**
 * @file layout.js — Modular Layout Engine (The "Brain")
 * @description Dynamically injects shared shell components (Header, Sidebar, Clinical Banner,
 *   Alert Overlay) into placeholder elements on each page. This eliminates HTML duplication
 *   across all 12 pages and centralizes shell logic in one file.
 *
 *   ANGULAR 15 MIGRATION:
 *   In production Angular 15, this file is replaced entirely by Angular's component architecture:
 *     - HeaderComponent (Standalone) with inject(AuthService, NotificationService)
 *     - SidebarComponent (Standalone) with inject(SidebarService) using BehaviorSubject
 *     - ClinicalBannerComponent (Standalone) with inject(PatientService)
 *     - AlertPanelComponent (Standalone) with inject(NotificationService)
 *     - UserMenuComponent (Standalone) with PrimeNG OverlayPanel or p-menu
 *   Each component boundary is marked with id attributes matching the Angular selector convention:
 *     id="header-component"    → <ech-header>
 *     id="sidebar-component"   → <ech-sidebar>
 *     id="banner-component"    → <ech-clinical-banner>
 *     id="alert-panel"         → <ech-alert-panel>
 *
 *   DATA BINDING:
 *   All dynamic values use data-field="dtoFieldName" attributes that map directly to Java DTOs:
 *     data-field="userName"        → UserDTO.fullName
 *     data-field="userService"     → UserDTO.serviceName
 *     data-field="userDepartment"  → UserDTO.departmentName
 *     data-field="wardName"        → WardDTO.wardName
 *     data-field="patientName"     → PatientDTO.fullName
 *     data-field="allergyList"     → PatientDTO.safetyAlerts[]
 *   Angular: These become {{ patient.fullName }} template bindings with async pipe.
 *
 *   REM SCALING:
 *   The entire EHR scales via a single CSS root: html { font-size: 13px; }
 *   All layout.js-generated markup uses rem-based classes (.fs-xs, .fs-md, .fs-lg)
 *   so changing the root font-size in theme-overrides.css rescales the full application.
 *   Recommended: 13px for 14" clinical workstations, 15px for tablets, 12px for ultra-dense mode.
 */

/* ============================================================
 * NAVIGATION CONFIG
 * Defines sidebar menu items. Angular: replaced by RouteConfig[]
 * with routerLink and routerLinkActive directives.
 * ============================================================ */
const NAV_ITEMS = [
    { href: 'patient-summary.html',  icon: 'pi-chart-bar',           label: 'Doctor Overview',  i18n: 'NAV.PATIENT_SUMMARY' },
    { href: 'nurse-notes.html',      icon: 'pi-pencil',              label: 'Nurse Overview',      i18n: 'NAV.NURSE_NOTES' },
    { href: 'timeline.html',        icon: 'pi-home',                  label: 'Timeline',         i18n: 'NAV.GENERAL_VIEW' },
    { href: 'previous-visits.html',  icon: 'pi-history',              label: 'Previous Visits',  i18n: 'NAV.PREVIOUS_VISITS' },
    { href: 'risk-factors.html',     icon: 'pi-exclamation-triangle', label: 'Risk Factors',     i18n: 'NAV.RISK_FACTORS' },
    { href: 'diagnostic-tests.html', icon: 'pi-search',              label: 'Diagnostic Tests', i18n: 'NAV.DIAGNOSTIC_TESTS' },
    { href: 'laboratory.html',      icon: 'pi-table',               label: 'Laboratory Results', i18n: 'NAV.LABORATORY_RESULTS' },
    { href: 'documents.html',        icon: 'pi-file',                label: 'Documents',        i18n: 'NAV.DOCUMENTS' },
    { href: 'medication.html',       icon: 'pi-box',                 label: 'Medication',       i18n: 'NAV.MEDICATION' },
    { href: 'care-plans.html',       icon: 'pi-heart',               label: 'Care Plans',       i18n: 'NAV.CARE_PLANS' },
    { href: 'measurements.html',     icon: 'pi-chart-line',          label: 'Measurements',     i18n: 'NAV.MEASUREMENTS' },
    { href: 'protocols.html',        icon: 'pi-book',                label: 'Protocols',        i18n: 'NAV.PROTOCOLS' }
];

/** User menu options for the three-dots dropdown. Angular: PrimeNG MenuItem[] */
const USER_MENU_ITEMS = [
    { action: 'change-center', icon: 'pi-building',    label: 'Cambiar Centro sanitario', i18n: 'MENU.CHANGE_CENTER' },
    { action: 'datetime',      icon: 'pi-clock',       label: '04/03/2026',         i18n: 'MENU.DATETIME', dataField: 'currentDateTime' },
    { action: 'preferences',   icon: 'pi-cog',         label: 'Preferencias',             i18n: 'MENU.PREFERENCES' },
    { action: 'view-config',   icon: 'pi-cog',         label: 'Herramienta de Configuración de Vistas', i18n: 'MENU.VIEW_CONFIG' },
    { action: 'refresh',       icon: 'pi-refresh',     label: 'Refrescar inicio',         i18n: 'MENU.REFRESH' },
    { action: 'about',         icon: 'pi-info-circle', label: 'Acerca de',                i18n: 'MENU.ABOUT' },
    { action: 'logout',        icon: 'pi-power-off',   label: 'Salir',                    i18n: 'MENU.LOGOUT', danger: true }
];

/* ============================================================
 * COMPONENT RENDERERS
 * Each function generates the innerHTML for a placeholder element.
 * Angular: Each becomes a Standalone Component with its own template.
 * ============================================================ */

/**
 * Renders the top bar header with hospital context, notifications, and user identity.
 * @param {Object} options
 * @param {boolean} options.showHamburger - Whether to show the mobile hamburger button (true for patient-context pages)
 * Angular: HeaderComponent — inject(AuthService) for user, inject(NotificationService) for alerts
 */
function renderHeader(options = {}) {
    const el = document.getElementById('header-component');
    if (!el) return;

    const hamburger = options.showHamburger
        ? `<div class="hamburger hamburger-btn hidden lg:hidden" onclick="toggleSidebar()">
               <i class="pi pi-bars icon-lg text-primary-color"></i>
           </div>`
        : '';

    const menuItems = USER_MENU_ITEMS.map(item => {
        const cls = item.danger ? 'menu-option menu-option-danger' : 'menu-option';
        const content = item.dataField
            ? `<i class="pi ${item.icon}"></i> <span data-field="${item.dataField}">${item.label}</span>`
            : `<i class="pi ${item.icon}"></i> ${item.label}`;
        return `<button class="${cls}" onclick="handleUserMenuAction('${item.action}')" data-i18n="${item.i18n}">${content}</button>`;
    }).join('\n                        ');

    el.innerHTML = `
            <div class="top-bar-left flex align-items-center gap-2">
                ${hamburger}
                <a href="index.html" class="logo flex align-items-center gap-1" style="text-decoration:none;color:inherit">
                    <i class="pi pi-shield"></i>
                    <span data-i18n="APP.TITLE">ECH</span>
                </a>
            </div>
            <div class="top-bar-center flex align-items-center gap-1">
                <i class="pi pi-building"></i>
                <!-- data-field="wardName": maps to WardDTO.wardName from Java REST API -->
                <span data-field="wardName" data-i18n="HEADER.WARD">Inpatients</span>
            </div>
            <div class="top-bar-right flex align-items-center gap-2">
                <div class="notification-btn" onclick="toggleAlertMenu()" data-i18n-title="HEADER.ALERTS_TITLE" title="Alerts & Messages">
                    <i class="pi pi-bell text-color-secondary icon-md"></i>
                    <!-- data-field="alertCount": maps to NotificationDTO.alertCount -->
                    <span class="badge-count" data-field="alertCount">3</span>
                </div>
                <div class="notification-btn" data-i18n-title="HEADER.MESSAGES_TITLE" title="Messages">
                    <i class="pi pi-envelope text-color-secondary icon-md"></i>
                    <!-- data-field="messageCount": maps to NotificationDTO.messageCount -->
                    <span class="badge-count" data-field="messageCount">1</span>
                </div>
                <div class="notification-btn" data-i18n-title="HEADER.HELP_TITLE" title="Help">
                    <i class="pi pi-question-circle icon-md text-primary-color"></i>
                </div>
                <div class="user-info">
                    <span class="user-name" data-field="userName">Dr. Rory Rogers</span>
                    <span class="user-detail"><span data-field="userService">Service of Healthcare Provider A1</span> | <span data-field="userDepartment">Adult Emergency</span></span>
                </div>
                <div class="user-menu-wrapper">
                    <button class="user-menu-toggle" onclick="toggleUserMenu()" data-i18n-title="HEADER.USER_MENU" title="User Menu">
                        <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <div class="user-menu-dropdown" id="userMenuDropdown">
                        ${menuItems}
                    </div>
                </div>
                <div class="user-menu-overlay" id="userMenuOverlay" onclick="toggleUserMenu()"></div>
            </div>`;
}

/**
 * Renders the collapsible sidebar with navigation menu.
 * Automatically detects the current page and sets the active state.
 * Angular: SidebarComponent — inject(Router) for routerLinkActive, inject(SidebarService) for state
 */
function renderSidebar() {
    const el = document.getElementById('sidebar-component');
    if (!el) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = NAV_ITEMS.map(item => {
        const isActive = currentPage === item.href ? ' active' : '';
        return `<a href="${item.href}" class="menu-item${isActive}" data-i18n-title="${item.i18n}" title="${item.label}">
                <i class="pi ${item.icon}"></i>
                <span class="menu-label fs-xs" data-i18n="${item.i18n}">${item.label}</span>
            </a>`;
    }).join('\n            ');

    el.innerHTML = `
        <div class="sidebar-header" onclick="toggleSidebar()">
            <i class="pi pi-bars"></i>
            <span class="logo-text" data-i18n="APP.TITLE">ECH</span>
        </div>
        <nav class="sidebar-nav" id="global-navigation">
            ${navLinks}
        </nav>
        <div class="sidebar-toggle" onclick="toggleSidebar()">
            <i class="pi pi-angle-double-left"></i>
        </div>`;

    el.classList.add('collapsed');
    applySidebarState();
}

/**
 * Renders the clinical banner with patient identity, demographics, and safety tags.
 * SAFETY REQUIREMENT: Banner max-height is 80px (enforced via CSS) and must never scroll out of view.
 * Angular: ClinicalBannerComponent — inject(PatientService).currentPatient$ for reactive data
 *
 * data-field attributes map to Java DTOs:
 *   patientName        → PatientDTO.fullName
 *   patientDemographics → PatientDTO.demographicSummary
 *   patientRecId       → PatientDTO.recordId
 *   patientEpisode     → EpisodeDTO.episodeNumber
 *   patientRoom        → AdmissionDTO.roomBed
 *   patientClient      → PatientDTO.clientCode
 *   allergyList        → PatientDTO.safetyAlerts[] (iterated with *ngFor)
 */
function renderBanner() {
    const el = document.getElementById('banner-component');
    if (!el) return;

    el.innerHTML = `
            <div class="banner-row-1 flex align-items-center justify-content-between gap-2 flex-wrap">
                <div class="patient-identity flex align-items-center gap-2 flex-wrap">
                    <i class="pi pi-user patient-icon" data-field="patientGenderIcon" data-i18n-title="PATIENT.GENDER_MALE" title="Male"></i>
                    <div class="patient-id-block">
                        <div class="patient-name-line flex align-items-center gap-2 flex-wrap">
                            <span class="patient-name fs-lg" data-field="patientName">THOMAS MEYER WOOD</span>
                            <span class="patient-gender-age" data-field="patientDemographics">(11/07/1990 - 35 Years - Male)</span>
                        </div>
                        <div class="patient-meta flex align-items-center gap-1 flex-wrap" data-field="patientMeta">
                            <span data-field="patientRecId">Rec ID 46</span><span class="meta-separator">|</span>
                            <span data-field="patientEpisode">Episode No.: 283</span><span class="meta-separator">|</span>
                            <span data-field="patientRoom">Room Bed 201 (514 d)</span><span class="meta-separator">|</span>
                            <span data-field="patientClient">CLIENTE 01</span>
                        </div>
                    </div>
                    <div class="safety-tags flex align-items-center gap-1 flex-wrap" data-field="allergyList">
                        <span class="p-tag-custom p-tag-danger clinical-danger" data-i18n="SAFETY.ALLERGY_PENICILLIN"><i class="pi pi-exclamation-circle"></i> Penicillin Allergy</span>
                        <span class="p-tag-custom p-tag-danger clinical-danger" data-i18n="SAFETY.ALLERGY_LATEX"><i class="pi pi-exclamation-circle"></i> Latex Allergy</span>
                        <span class="p-tag-custom p-tag-warning clinical-warning" data-i18n="SAFETY.FALL_RISK"><i class="pi pi-exclamation-triangle"></i> Fall Risk</span>
                        <span class="p-tag-custom p-tag-info clinical-info" data-i18n="SAFETY.VTE_RISK"><i class="pi pi-info-circle"></i> VTE Risk</span>
                        <span class="p-tag-custom p-tag-dnr clinical-danger" data-i18n="SAFETY.DNR"><i class="pi pi-ban"></i> DNR</span>
                    </div>
                </div>
            </div>`;
}

/**
 * Renders the alert overlay panel at the end of the body.
 * Angular: AlertPanelComponent — inject(NotificationService).alerts$ observable with async pipe
 * PrimeNG equivalent: p-sidebar or p-dialog with severity-coded items
 */
function renderAlertOverlay() {
    let el = document.getElementById('alertOverlay');
    if (!el) {
        el = document.createElement('div');
        el.className = 'alert-menu-overlay';
        el.id = 'alertOverlay';
        document.body.appendChild(el);
    }

    el.innerHTML = `
    <div class="alert-menu-panel" id="alert-panel">
        <div class="alert-header flex align-items-center justify-content-between">
            <span><i class="pi pi-bell"></i> <span data-i18n="ALERTS.TITLE">Alerts &amp; Messages</span></span>
            <span class="cursor-pointer" onclick="toggleAlertMenu()"><i class="pi pi-times"></i></span>
        </div>
        <div class="alert-item flex align-items-start gap-2">
            <div class="alert-dot critical"></div>
            <div>
                <strong data-i18n="ALERTS.ALLERGY_TITLE">Allergy Alert</strong>
                <div class="text-color-secondary text-xs" data-i18n="ALERTS.ALLERGY_DESC">Penicillin allergy documented. Avoid beta-lactam antibiotics.</div>
                <div class="text-color-secondary text-xs">Today, 08:30</div>
            </div>
        </div>
        <div class="alert-item flex align-items-start gap-2">
            <div class="alert-dot critical"></div>
            <div>
                <strong data-i18n="ALERTS.DNR_TITLE">DNR Status Active</strong>
                <div class="text-color-secondary text-xs" data-i18n="ALERTS.DNR_DESC">Do Not Resuscitate order is active for this patient.</div>
                <div class="text-color-secondary text-xs">Updated 19/02/2026</div>
            </div>
        </div>
        <div class="alert-item flex align-items-start gap-2">
            <div class="alert-dot warning"></div>
            <div>
                <strong data-i18n="ALERTS.FALL_RISK_TITLE">Fall Risk - High</strong>
                <div class="text-color-secondary text-xs" data-i18n="ALERTS.FALL_RISK_DESC">Patient scored high on Morse Fall Scale. Bed rails up.</div>
                <div class="text-color-secondary text-xs">Today, 07:00</div>
            </div>
        </div>
        <div class="alert-item flex align-items-start gap-2">
            <div class="alert-dot info"></div>
            <div>
                <strong data-i18n="ALERTS.LAB_TITLE">Lab Results Available</strong>
                <div class="text-color-secondary text-xs" data-i18n="ALERTS.LAB_DESC">Complete Blood Count results are ready for review.</div>
                <div class="text-color-secondary text-xs">Today, 14:20</div>
            </div>
        </div>
    </div>`;
}

/* ============================================================
 * SHARED SHELL FUNCTIONS
 * These handle sidebar, alert panel, and user menu interactions.
 * Angular: Each becomes a service method (SidebarService, NotificationService, UserMenuService)
 * ============================================================ */

/** Restores sidebar collapsed/expanded state from localStorage. Angular: SidebarService.init() */
function applySidebarState() {
    const sidebar = document.getElementById('sidebar-component');
    if (!sidebar) return;
    const collapsed = localStorage.getItem('ech-sidebar-collapsed');
    if (collapsed === null || collapsed === 'true') {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

/** Toggles sidebar between collapsed and expanded modes. Angular: SidebarService.toggle() */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-component');
    const overlay = document.getElementById('sidebarOverlay');
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('ech-sidebar-collapsed', isCollapsed);
    }
}

/** Closes mobile sidebar overlay. Angular: SidebarService.close() */
function closeSidebar() {
    const sidebar = document.getElementById('sidebar-component');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

/** Toggles the alerts/notifications overlay panel. Angular: NotificationService.togglePanel() */
function toggleAlertMenu() {
    const overlay = document.getElementById('alertOverlay');
    if (overlay) overlay.classList.toggle('show');
}

/** Toggles the three-dots user menu dropdown. Angular: UserMenuComponent with OverlayPanel */
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    const overlay = document.getElementById('userMenuOverlay');
    if (dropdown && overlay) {
        dropdown.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

/** Handles user menu option clicks. Angular: UserMenuService.execute(action) */
function handleUserMenuAction(action) {
    toggleUserMenu();
    console.log('User menu action:', action);
}

/** Handles quick action bar button clicks. Angular: ClinicalActionService.executeQuickAction(action) */
function handleQuickAction(action) {
    console.log('Quick action:', action);
}

/** Binds global click-away listeners for dropdown panels. Angular: handled by PrimeNG overlay lifecycle */
function bindGlobalEvents() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('alert-menu-overlay') && e.target.classList.contains('show')) {
            e.target.classList.remove('show');
        }
        if (e.target.classList.contains('sidebar-overlay')) {
            closeSidebar();
        }
    });
}

/* ============================================================
 * INITIALIZATION
 * Detects page type and injects the appropriate components.
 * Angular: Replaced by app.component.html with <router-outlet>
 * and conditional *ngIf on sidebar/banner based on route.
 * ============================================================ */

/**
 * Initializes the modular layout on DOMContentLoaded.
 * - Patient list page (index.html): Header + Alert Overlay only (no sidebar/banner)
 * - Patient-context pages: Header + Sidebar + Banner + Alert Overlay
 */
function initLayout() {
    const isPatientList = document.body.hasAttribute('data-page-type') &&
                          document.body.getAttribute('data-page-type') === 'patient-list';

    renderHeader({ showHamburger: !isPatientList });

    if (!isPatientList) {
        renderSidebar();
        renderBanner();
    }

    renderAlertOverlay();
    bindGlobalEvents();
}

document.addEventListener('DOMContentLoaded', initLayout);
