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
├── header.css               ← #header-component styles + user menus/overlays
├── sidebar.css              ← #sidebar-component styles (collapsible nav drawer)
├── banner.css               ← #banner-component styles (sticky, max 80px, patient identity)
├── action-bar.css           ← #action-bar-component + #filter-bar styles
├── utilities.css            ← Generic helper classes
├── responsive.css           ← Media queries for tablet (≤1024px) and mobile (≤600px)
└── modules/
    ├── timeline.css         ← Timeline-specific styles
    ├── patient-list.css     ← Patient list table, toolbar, search
    ├── patient-summary.css  ← Patient summary + previous visits
    ├── documents.css        ← Document manager table + actions
    ├── risk-factors.css     ← Risk factors 10-tab center
    ├── medication.css       ← MAR grid + prescription form
    ├── care-plans.css       ← CAR grid
    ├── diagnostic-tests.css ← Clinical orders table
    ├── imaging-orders.css   ← Radiology ordering form
    ├── nurse-notes.css      ← Nursing overview panels
    ├── laboratory.css       ← Lab orders + results viewer
    ├── protocols.css        ← Protocols list
    └── measurements.css     ← Vital signs flowsheet
```

**Load order in HTML files:**
1. `css/clinical-core.css`
2. `css/components.css`
3. `css/header.css`
4. `css/sidebar.css`
5. `css/banner.css`
6. `css/action-bar.css`
7. `css/modules/<module>.css` (page-specific)
8. `css/utilities.css`
9. `css/responsive.css`

**Key conventions:**
- `.btn-action` / `.action-btn`: Standard action buttons (aliased for backwards compat)
- `.btn-filter`: Filter toggle buttons
- `.p-datatable-sm`: High-density table base (32px row height)
- All tables share base styles from `components.css`; module files add only overrides
- `#banner-component`: Always sticky, max-height 80px

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
All dynamic data points use `data-field="dtoFieldName"` attributes. Key mappings:
- **Header**: userName, userService, userDepartment, wardName, alertCount, messageCount
- **Banner**: patientGenderIcon, patientName, patientDemographics, patientMeta, patientRecId, patientEpisode, patientRoom, patientClient, allergyList
- **Patient Summary**: vitalBP, vitalHR, vitalTemp, vitalRR, vitalSpO2, medName, medLastAdmin, medNextAdmin
- **Forms**: priority, timing, clinicalIndication, dose, route, frequency, etc.

Full DTO field map documented in `css/clinical-core.css` header comment.

## System Architecture
- **Static multi-page app** served by Node.js (`server.js`)
- **`layout.js`**: Core shell engine — injects Header, Sidebar, Banner across all pages
- **`layout_list.js`**: List-specific layout for patient list views
- **Module JS files**: Each page has its own JS with mock data and business logic
- **`theme-overrides.css.bak`**: Archived original monolithic CSS (backup)

## Key Features and Modules
- **Patient List (`index.html`)**: Entry point with 11-column clinical table
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
- **Care Plans (`care-plans.html`)**: Care administration record grid
- **Measurements (`measurements.html`)**: Vital signs flowsheet
- **Nurse Notes (`nurse-notes.html`)**: Shift-based nursing overview
- **Protocols (`protocols.html`)**: Protocol list with status formatting

## External Dependencies
- **Node.js**: Static file server
- **PrimeFlex 3.3.1** (CDN): Utility-first CSS framework
- **PrimeIcons 6.0.1** (CDN): Icon library
