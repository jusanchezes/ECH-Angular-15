# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
Clinical EHR (Electronic Health Record) application, migrating from legacy Java/AngularJS to a modern PrimeNG-flavored HTML/CSS/JS prototype for rapid UI/UX iteration. Multi-page architecture with patient list entry point and modular clinical pages.

## Current State
- Static multi-page web application with PrimeNG-flavored HTML components
- Served via Node.js static file server on port 5000
- Mock clinical data for demonstration purposes
- Patient list as entry point, navigates to patient-context module pages
- Modular layout.js eliminates HTML duplication across all 12 pages
- **Single unified CSS file** (`theme-overrides.css`) — all styles consolidated, documented with TOC

## Project Architecture

### File Structure
```
/
├── index.html              # Patient List (entry point, data-page-type="patient-list")
├── patients.js             # Patient list logic, mock data, 11-column clinical table
├── layout_list.js          # List-specific layout engine — tab-bar + toolbar injection
├── timeline.html           # General View / Patient Timeline
├── app.js                  # Timeline-specific logic (rendering, filtering, events)
├── layout.js               # Modular layout engine — injects shared components into all pages
├── previous-visits.html    # Previous Visits — Master-Detail split layout with episode list + clinical panels
├── risk-factors.html       # Risk Factors module — 10-tab risk control center with high-density tables
├── risk-factors.js         # Risk Factors logic — mock data (33 records), tab switching, search, status toggle
├── diagnostic-tests.html   # Diagnostic Tests / Clinical Orders — order list with date tags, result indicators, icon actions
├── diagnostic-tests.js     # Clinical Orders logic — mock data (4 orders), table rendering, action handlers
├── imaging-orders.html     # Imaging Orders — Balanced Master-Detail radiology ordering view with service catalog, orders cart, technical detail form
├── imaging-orders.js       # Imaging Orders logic — radiology catalog (13 exams), modality filters, cart management, form validation, contrast safety
├── laboratory-orders.html  # Laboratory Orders — Balanced Master-Detail lab ordering view with catalog, orders cart, specimen detail form
├── laboratory-orders.js    # Laboratory Orders logic — lab catalog (15 tests), category filters, cart management, form validation, coagulation safety
├── documents.html          # Documents module — clinical file manager with tab filters and document table
├── documents.js            # Documents logic — mock data, filtering, search, table rendering
├── medication.html         # Medication Administration Record (MAR) — full MAR grid with frozen columns, time slots, status cells
├── medication-prescription.html # Medication Prescription — Vertical Master-Detail view with drug catalog, orders cart, vitals strip, detail form
├── patient-summary.html    # Patient Summary dashboard — 6 clinical panels (alerts, meds, notes, problems, vitals, results)
├── care-plans.html         # Care Administration Record (CAR) — full CAR grid with frozen columns, time slots, status cells
├── measurements.html       # Measurements module (empty shell)
├── nurse-notes.html        # Nurse Notes — Nursing Overview Shift-Based View with 5 clinical panels + nurse action bar
├── protocols.html          # Protocols module (empty shell)
├── theme-overrides.css     # UNIFIED stylesheet — all project styles with documented TOC (~3900 lines)
├── server.js               # Node.js static file server (port 5000)
├── Instructions.md         # EHR Design Project Core Rules
├── attached_assets/        # Reference files (legacy HTML mockup + screenshot)
└── replit.md               # This file
```

### Unified CSS Architecture (theme-overrides.css)
All styles consolidated into a single file with 24 documented sections and a Table of Contents:
1. CSS Custom Properties (Design Tokens)
2. Base & Reset
3. Font Size Utilities
4. Layout Shell
5. Sidebar
6. Header / Top Bar
7. Clinical Banner
8. Action Bar (Shared)
9. Filter Bar & Controls (Shared)
10. Module Tabs (Shared)
11. Search Input (Shared)
12. Date Navigation (Shared)
13. Legend (Shared)
14. Timeline
15. Patient List (index.html)
16. Patient Summary / Previous Visits
17. Documents
18. Risk Factors
19. Medication (MAR)
20. Care Plans (CAR)
20½a. Clinical Orders / Diagnostic Tests
20½b. Imaging Orders (io)
20⅞. Laboratory Orders (lo)
20¾. Nurse Notes
21. User Menus & Overlays
22. Utility Classes
23. Responsive — Tablet (max-width: 1024px)
24. Responsive — Mobile (max-width: 600px)

### Layout Engine (layout.js)
- **Purpose**: Single source of truth for shared shell HTML; eliminates duplication across 12 pages
- **Detection**: Uses `data-page-type="patient-list"` on `<body>` to distinguish patient list from patient-context pages
- **Components injected**: Header, Sidebar (patient-context only), Clinical Banner (patient-context only), Alert Overlay
- **Shared functions**: toggleSidebar(), toggleAlertMenu(), toggleUserMenu(), handleUserMenuAction(), handleQuickAction()
- **Config arrays**: NAV_ITEMS (sidebar links), USER_MENU_ITEMS (three-dots dropdown)
- **Angular migration**: Each render function maps to a Standalone Component; full migration notes in JSDoc comments

### Page Architecture
- **Patient List** (`index.html`): Entry point, no sidebar/clinical banner, table of patients with click-to-navigate
- **Patient Module Pages**: All share a common shell injected by layout.js
  - Sidebar navigation uses `<a>` tags with relative `href` for click-through
  - Active page auto-detected by layout.js from window.location
  - Clinical banner persists across all patient-context pages

### Shell Components (shared across patient pages, rendered by layout.js)
- **Top Bar** (`id="header-component"`): Hospital/department info, alerts/messages bell, user identity
- **Clinical Banner** (`id="banner-component"`): Fixed/sticky with patient identity, safety tags
- **Sidebar** (`id="sidebar-component"`): Collapsible navigation with PrimeIcons, `<a>` links to module pages
- **Filter bar** (`id="filter-bar"`): Page-specific filters (only timeline has content currently)
- **Action bar** (`id="action-bar-component"`): Page-specific action buttons (only timeline has content currently)
- **Alert Overlay** (`id="alert-panel"`): Slide-in alerts panel

### Technical Standards (from Instructions.md)
- `data-i18n` / `data-i18n-title`: All UI text mapped to translation keys
- `data-field="dtoFieldName"`: Data-bound values mirroring Java DTOs
- Component boundary IDs: `id="header-component"`, `id="sidebar-component"`, `id="banner-component"`
- PrimeFlex utility classes for layout (no inline styles)
- PrimeIcons for all iconography
- `.p-datatable-sm` for high-density data grids (32px max row height)

### Design System
- Colors defined as CSS custom properties in `theme-overrides.css` (--ech-primary, --ech-danger, etc.)
- Semantic clinical CSS classes: .clinical-danger, .clinical-warning, .clinical-info
- Type-specific timeline colors via CSS classes (tl-type-exam, tl-type-surgery, etc.)
- Responsive breakpoints: 1024px (tablet), 600px (mobile)

## User Preferences
- PrimeNG 15 components (HTML-flavored for static prototyping)
- PrimeFlex utility classes for layout
- Semantic HTML5 tags
- High-density layout for 14" clinical workstations
- Responsive design supporting tablets
- Legacy color scheme preserved (blues for primary, reds for alerts, oranges for warnings)
- Icons from PrimeIcons matching legacy style
- Module pages prepared as empty shells, content provided later by user

## Recent Changes
- 2026-02-28: Implemented Laboratory Orders — Balanced Master-Detail lab ordering view with laboratory catalog (15 tests across Hematology/Chemistry/Microbiology/Coagulation/Urinalysis), category filters, orders cart with visual states (Fasting in orange, STAT in red), specimen detail form (Priority, Date/Time, Frequency, Specimen Type, Collection Method, Volume, Fasting Required/Duration, Clinical Indication), coagulation safety alert showing active anticoagulants, validation for required fields, Review & Sign flow. lo-* CSS classes in section 20⅞. Linked from Diagnostic Tests "Create Laboratory Exam" button.
- 2026-02-28: Implemented Imaging Orders — Balanced Master-Detail radiology ordering view with service catalog (13 exams, CT/MRI/XR/US modality filters), orders-for-signature cart with validation status, technical detail form (Priority, Timing, Clinical Indication, Contrast Protocol, Creatinine, Pregnancy Check, Portable), clinical context strip (eGFR/Dx/Contrast Allergy/Renal Risk tags), contrast safety alert, Review & Sign validation. io-* CSS classes in section 20½b. Linked from Diagnostic Tests "Create Radiology Exam" button.
- 2026-02-28: Implemented Medication Prescription — Vertical Master-Detail view with drug catalog search, orders-for-signature cart, vitals strip (Weight/Height/BMI/BSA), 4-column detail form, safety alerts module, Sign Order/Cancel actions. rx-* CSS classes in section 19½. Linked from MAR "New Medication" button. Added Prescription to sidebar nav.
- 2026-02-26: Implemented Nurse Notes — Nursing Overview Shift-Based View with 5 panels (Handoff Report, Shift Checklist, Medications Due, Quick Assessments, Flowsheet Links), safety strip, and 6 nurse action buttons (Administer Medication/Care, Record Vitals/I&O/Assessment, Nursing Note), nn-* CSS classes in section 20¾
- 2026-02-25: Implemented Patient Summary dashboard — 6 clinical panels (Alerts/Risks, Active Medication, Recent Notes, Active Problems, 24h Vitals Snapshot, Pending/Abnormal Results) with doctor action bar and ps-* CSS classes
- 2026-02-25: Refactored Documents tabs from underlined text tabs (.doc-tab) to select-button-group (.sb-option) matching Medication filter pattern
- 2026-02-25: Refactored Risk Factors tabs from underlined text tabs (.rf-tab) to select-button-group (.sb-option) matching Medication filter pattern
- 2026-02-25: Implemented Clinical Orders (Diagnostic Tests) module — orders table with green date tags, result indicators, icon action buttons, and 3 exam creation buttons
- 2026-02-24: **CSS Consolidation** — Merged all CSS into single `theme-overrides.css` with 24 documented sections and TOC
- 2026-02-24: Deleted `documents.css` and `risk-factors.css` (merged into theme-overrides.css)
- 2026-02-24: Removed inline `<style>` blocks from `medication.html` and `care-plans.html`
- 2026-02-24: Standardized action bars, filter tabs, search inputs, and date navigation across all pages
- 2026-02-24: Added shared CSS patterns: .module-tab, .module-search-*, .date-nav, .module-legend
- 2026-02-24: Implemented Risk Factors module — 10-tab risk control center with high-density tables
- 2026-02-24: Implemented Documents module — clinical file manager with tab filters and document table
- 2026-02-24: Implemented Medication Administration Record (MAR) in medication.html
- 2026-02-24: Implemented Care Administration Record (CAR) in care-plans.html
- 2026-02-24: Previous Visits — Master-Detail split layout with episode list + clinical panels
- 2026-02-22: Refactored patient list (index.html) to Full Clinical version with 11 columns
- 2026-02-22: Created layout_list.js — modular list layout engine with tab-bar and toolbar components
- 2026-02-21: Created layout.js modular engine — eliminates ~250 lines of duplicated HTML per page
- 2026-02-21: Rem-based font scaling — root 13px, .fs-xs through .fs-xxl utility classes
- 2026-02-21: Multi-page restructure - patient list entry point, 10 empty module shell pages
- 2026-02-20: Initial build of complete EHR patient timeline with all MVP features
