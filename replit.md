# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
This project is a multi-page clinical Electronic Health Record (EHR) application prototype. Its primary purpose is to migrate a legacy Java/AngularJS system to a modern Angular 15 frontend with PrimeNG 15. The application provides a patient list as an entry point and navigates to modular clinical pages, using mock data for demonstration.

## User Preferences
- PrimeNG 15 components (HTML-flavored for static prototyping)
- PrimeFlex utility classes for layout
- Semantic HTML5 tags
- High-density layout for 14" clinical workstations
- Responsive design supporting tablets
- Safety color system: Red (critical), Yellow (warnings), Blue (info/nav), Green (success)
- Icons from PrimeIcons matching legacy style
- Angular Standalone Components preparation (HTML comments mark component boundaries)

## CSS Architecture (EHR Redesign Standard)
The CSS is organized into a modular multi-file architecture, split from the original monolithic `theme-overrides.css`:

```
css/
├── clinical-core.css        ← Design tokens, reset, typography, layout shell
├── components.css           ← Shared components: .btn-action, .btn-filter, .p-datatable-sm, tabs, search, pagination
├── table.css                ← Unified table styles: .ehr-table, .ehr-table-area, .ehr-table-scroll, .ehr-row
├── header.css               ← #header-component styles + user menus/overlays
├── sidebar.css              ← #sidebar-component styles (collapsible nav drawer)
├── banner.css               ← #banner-component styles (sticky, max 80px, patient identity)
├── action-bar.css           ← #action-bar-component + #filter-bar styles + shared toolbar
├── results-table.css        ← Shared results layout: panel (groups/disciplines) + table
├── utilities.css            ← Generic helper classes
├── responsive.css           ← Media queries for tablet (≤1024px) and mobile (≤600px)
└── modules/
    ├── timeline.css         ← Timeline-specific styles
    ├── patient-list.css     ← Patient list table, toolbar, search
    ├── patient-summary.css  ← Patient summary + previous visits
    ├── documents.css        ← Document manager table + actions
    ├── risk-factors.css     ← Risk factors 10-tab center
    ├── care.css             ← MAR + CAR shared grid, filters, legend + prescription form
    ├── diagnostic-tests.css ← Clinical orders table
    ├── imaging-orders.css   ← Radiology ordering form
    ├── nurse-notes.css      ← Nursing overview panels
    ├── laboratory.css       ← Lab orders + results viewer
    ├── protocols.css        ← Protocols list
    ├── measurements.css     ← Vital signs flowsheet
    └── dashboard.css        ← Dashboard tile grid (module index)
```

**Load order in HTML files (for modules with tables):**
1. `css/clinical-core.css`
2. `css/components.css`
3. `css/header.css`
4. `css/sidebar.css`
5. `css/banner.css`
6. `css/action-bar.css`
7. `css/results-table.css` (shared panel + table for results modules)
8. `css/table.css` (shared table base for list modules)
10. `css/modules/<module>.css` (page-specific overrides)
11. `css/utilities.css`
12. `css/responsive.css`

**Key conventions:**
- `.btn-action` / `.action-btn`: Standard action buttons (aliased for backwards compat)
- `.btn-filter`: Filter toggle buttons
- `.ehr-table`: Unified high-density table base (32px row height) — used by Protocols, Documents, Risk Factors, Diagnostic Tests
- `.ehr-table-area`: Table container with flex layout
- `.ehr-table-scroll`: Scroll wrapper for horizontal/vertical overflow
- `.ehr-row`: Standard table row with hover transition
- `.p-datatable-sm` / `.patient-table`: Legacy table base for Patient List (in `components.css`)
- Module CSS files add only column widths and module-specific overrides (status tags, severity indicators, etc.)
- `#banner-component`: Always sticky, max-height 80px

**Shared Toolbar System (`action-bar.css` — Section 10):**
- `.module-toolbar`: Horizontal toolbar inside module panels (used by Lab, Measurements)
- `.module-toolbar-left`, `.module-toolbar-right`: Left/right flex containers
- `.toolbar-segment-group` + `.toolbar-segment-btn`: Segmented button group (e.g., time range: 24h/48h/72h, scale: 15m/1h/4h)
- `.toolbar-filter-group` + `.toolbar-filter-btn`: Toggle filter buttons (e.g., Abnormal Only, Critical Only, Trend View)
- `.toolbar-date-nav` + `.toolbar-date-btn` + `.toolbar-date-label`: Date navigation with chevron buttons
- `.toolbar-search-wrapper` + `.toolbar-search-input`: Inline search input with icon
- `.toolbar-separator`: Vertical divider line between filter groups
- Used across: Laboratory, Measurements, Medication (MAR), Care Plans (CAR)

**Shared Results Layout (`results-table.css`):**
- `.results-layout`: Flex container for panel + main content (replaces `.lab-layout`, `.ms-layout`)
- `.results-panel`: Left sidebar for category lists (groups/disciplines) — 220px, border-right, overflow-y
- `.results-panel-title`: Panel header (uppercase, bold 700, bottom border)
- `.results-panel-list`: `<ul>` container (no list-style)
- `.results-panel-item`: Category row with flex space-between, hover, border-left accent
- `.results-panel-item.active`: Active state (blue bg, blue left border, bold blue text)
- `.results-panel-count`: Pill badge with count (gray bg, active turns blue/white)
- `.results-main-panel`: Right content area (flex column, overflow hidden)
- `.results-table-wrapper`: Flex scroll container for results tables
- `.results-table`: Base table with auto layout, sticky header, hover rows
- `.results-col-sticky`: Sticky first column (analyte/parameter names)
- `.results-col-name`, `.results-col-ref`, `.results-col-trend`, `.results-col-date`: Column type classes
- `.results-cell-value`: Clickable data cell with hover effect
- `.results-cell-high/low/critical/pending/alert/empty`: Clinical status cell styles
- `.results-flag-high/low/critical`: Inline flag labels
- `.results-trend-icon`, `.results-trend-up/down/stable/critical`: Trend direction indicators
- `.results-sparkline`: SVG sparkline alignment
- `.results-empty-row`: Empty state row styling
- Used across: Laboratory, Measurements

## Component Identity System
All screens use standardized IDs for Angular migration:
- `sidebar-component` → SidebarComponent
- `header-component` → HeaderComponent
- `banner-component` → ClinicalBannerComponent
- `action-bar-component` → ActionBarComponent
- `filter-bar` → FilterBarComponent

HTML comments mark Angular component boundaries:
```html
<!-- BEGIN: Angular Standalone Component — HeaderComponent -->
<header id="header-component">...</header>
<!-- END: HeaderComponent -->
```

## Data Binding (Java DTO Mapping)
All dynamic data points use `data-field="dtoFieldName"` attributes in the HTML.
For full technical details on REST endpoints, Java DTOs, TypeScript interfaces, and `data-field` ↔ DTO mappings, see **[`API_contracts.md`](API_contracts.md)**.

### Data consumption flow (current prototype)
```
mock-clinical-data.js  →  clinical-data.service.js  →  module JS files  →  HTML (data-field)
```
1. **`mock-clinical-data.js`** holds all mock data under the `MockClinicalData` global object (patients, clinical context per patient, catalogs).
2. **`clinical-data.service.js`** (`ClinicalDataService` IIFE) is the single access point — modules never read `MockClinicalData` directly.
3. **Module JS files** (e.g. `laboratory.js`, `measurements.js`) call `ClinicalDataService` methods and render data into the HTML via `data-field` selectors.
4. For production Angular 15, each `ClinicalDataService` method maps 1:1 to an `HttpClient.get()` call against the REST endpoints documented in `API_contracts.md`.

## Strategic Documentation
- **`transform.md`**: Business Case document — strategic alignment of the EHR Redesign with 2026 industry trends across five pillars: Composable Architecture, AI-Ready Data, FHIR-Centric Interoperability, High-Density UX, and Cloud-Native Readiness. Intended for stakeholder and development team presentation.

## System Architecture
- **Static multi-page app** served by Node.js (`server.js`)
- **`layout.js`**: Core shell engine — injects Header, Sidebar, Banner across all pages
- **`layout_list.js`**: List-specific layout for patient list views
- **`API_contracts.md`**: Especificación completa de contratos REST/DTO — endpoints, Java DTOs, TypeScript interfaces, mapeos `data-field` ↔ DTO, tipado estricto
- **`mock-clinical-data.js`**: Centralized mock data store — all clinical data consolidated under `MockClinicalData` global object. Organized hierarchically: `patients[]`, `patientClinicalContext{46: {...}}`, `catalogs{}`. Contract reference in header points to `API_contracts.md`.
- **`clinical-data.service.js`**: Service layer (IIFE pattern) — `ClinicalDataService` is the single access point for all clinical data. Methods: `getPatientList()`, `getEDPatientList()`, `getPatient()`, `getTimeline()`, `getLaboratory()`, `getMeasurements()`, `getRiskFactors()`, `getDiagnosticTests()`, `getMedicationMAR()`, `getCarePlans()`, `getDocuments()`, `getProtocols()`, `getSummary()`, `getPreviousVisits()`, `getLabCatalog()`, `getRadiologyCatalog()`, etc. Includes Angular HttpClient migration notes.
- **Module JS files**: Each page has its own JS with UI/rendering logic only — data sourced exclusively from `ClinicalDataService`
- **Script load order in HTML**: `mock-clinical-data.js` → `clinical-data.service.js` → `layout.js` → page-specific JS
- **`theme-overrides.css.bak`**: Archived original monolithic CSS (backup)

## Key Features and Modules
- **Dashboard (`index.html`)**: Main entry point with tile grid linking to all clinical modules
- **Patient List (`inpatients.html`)**: Inpatient list with 11-column clinical table (linked from dashboard)
- **ED Tracking Board (`ed.html`)**: Emergency Department tracking board with ESI acuity badges, status pills, LOS tracking, alert chips (+N overflow), quick filters (All/Waiting Room/In Room/Dispo/High Acuity), High-Risk toggle, sortable columns, search, and right-side patient detail drawer
- **Day Hospital (`day-hospital.html`)**: Day Unit / Infusion Center patient list with scheduled time, chair/bay, pathway type, phase status pills, duration tracking, alert chips (+N overflow), quick filters (All/Scheduled/Arrived/Infusing/Ready for Discharge/Completed/No-show), High-Risk toggle, sortable columns (Time/Chair/Status/Remaining), search by name/chair/pathway/status, and right-side detail drawer with status timeline and quick actions (Open Chart, Record Vitals, Start Infusion, Mark Completed, Add Note). Uses `day-hospital.js` with inline mock data (14 patients). CSS additions in `patient-list.css` use `day-` prefix and are scoped by `[data-list-type="day-hospital-list"]`
- **Surgical Cases (`my-surgical-cases.html`)**: Surgical list with Date/Time, Patient, Procedure, OR Room, Status soft-badges, Duration, Readiness bar, Alert chips (Allergy=danger/red, Anticoagulation=warning/yellow, DNR=dnr/banned), Surgeon, and Actions column (Open Chart, Pre-op Checklist, dropdown: Pre-op Notes, Consent Form, Reschedule, Cancel Case). 8-tab filter bar (All/Requested/Scheduled/Pre-op Pending/Ready/In Theatre/Completed/Cancelled) with live counters. Full sort/search/filter. Cancelled rows are dimmed. Right-side detail drawer with all case fields and quick actions. Uses `my-surgical-cases.js` with inline mock data (12 cases) and inline `<style>` injection for `surg-` prefixed tokens. Tab config registered in `layout_list.js` under `surgical-list`. Linked from dashboard `index.html` "Gestión de Cirugías" tile.
- **Timeline (`timeline.html`)**: Chronological event timeline
- **Previous Visits (`previous-visits.html`)**: Master-detail episode list
- **Risk Factors (`risk-factors.html`)**: 10-tab risk control center
- **Diagnostic Tests (`diagnostic-tests.html`)**: Clinical orders list
- **Imaging Orders (`imaging-orders.html`)**: Radiology ordering with catalog/cart
- **Laboratory Orders (`laboratory-orders.html`)**: Lab test ordering
- **Laboratory Results (`laboratory.html`)**: High-density results viewer with sparklines
- **Documents (`documents.html`)**: Clinical document manager
- **Medication MAR (`medication.html`)**: Administration record grid with frozen columns
- **Medication Prescription (`medication-prescription.html`)**: Drug catalog and ordering
- **Patient Summary (`patient-summary.html`)**: 6-panel clinical dashboard
- **Care Plans (`care-plans.html`)**: Care administration record grid with filter bar matching MAR (time window, care type, search)
- **Measurements (`measurements.html`)**: Vital signs flowsheet with "All" group, Abnormal/Critical/Trend filtering, and action-bar Register button
- **Nurse Notes (`nurse-notes.html`)**: Shift-based nursing overview
- **Protocols (`protocols.html`)**: Protocol list with status formatting

## External Dependencies
- **Node.js**: Static file server
- **PrimeFlex 3.3.1** (CDN): Utility-first CSS framework
- **PrimeIcons 6.0.1** (CDN): Icon library
