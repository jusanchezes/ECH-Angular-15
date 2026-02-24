# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
Clinical EHR (Electronic Health Record) application, migrating from legacy Java/AngularJS to a modern PrimeNG-flavored HTML/CSS/JS prototype for rapid UI/UX iteration. Multi-page architecture with patient list entry point and modular clinical pages.

## Current State
- Static multi-page web application with PrimeNG-flavored HTML components
- Served via Node.js static file server on port 5000
- Mock clinical data for demonstration purposes
- Patient list as entry point, navigates to patient-context module pages
- Modular layout.js eliminates HTML duplication across all 12 pages

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
├── risk-factors.css        # Risk Factors styles — tabs, tables, severity tags, alert icons, responsive
├── diagnostic-tests.html   # Diagnostic Tests module (empty shell)
├── documents.html          # Documents module — clinical file manager with tab filters and document table
├── documents.js            # Documents logic — mock data, filtering, search, table rendering
├── documents.css           # Documents-specific styles — tabs, table, status tags, action buttons
├── medication.html         # Medication Administration Record (MAR) — full MAR grid with frozen columns, time slots, status cells
├── patient-summary.html    # Patient Summary module (empty shell)
├── care-plans.html         # Care Administration Record (CAR) — full CAR grid with frozen columns, time slots, status cells
├── measurements.html       # Measurements module (empty shell)
├── nurse-notes.html        # Nurse Notes module (empty shell)
├── protocols.html          # Protocols module (empty shell)
├── theme-overrides.css     # Custom CSS with CSS variables for theming
├── server.js               # Node.js static file server (port 5000)
├── Instructions.md         # EHR Design Project Core Rules
├── attached_assets/        # Reference files (legacy HTML mockup + screenshot)
└── replit.md               # This file
```

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
- 2026-02-24: Implemented Risk Factors module — 10-tab risk control center with high-density tables
- 2026-02-24: Risk Factors Action Bar — "Add Risk Factor / Alert" primary button + search input with filter
- 2026-02-24: Risk Factors Tab System — Summary, Allergies, Conditions, Procedures, Family History, Social History & Habits, Infection Control, Immunizations, Devices & Implants, Risk Assessments
- 2026-02-24: Risk Factors p-table — 10 columns: Type, Group, Risk Factor, Catalogued, Comment, Author, Date, Severity, Alert, Actions
- 2026-02-24: Risk Factors Active/Inactive sections — inactive rows with reduced opacity, toggle status via action buttons
- 2026-02-24: Risk Factors Summary tab — aggregated view of severe/alert records from all categories
- 2026-02-24: Risk Factors mock data — 33 records across 9 categories with realistic clinical data
- 2026-02-24: Risk Factors CSS in risk-factors.css — severity tags (red/orange/yellow/green), alert icons, responsive
- 2026-02-24: Implemented Documents module — clinical file manager with tab filters, search, and document table
- 2026-02-24: Documents tab filters: All, Reports, Informed Consent, Various, Digital History, Signed Documents
- 2026-02-24: Documents table: Name (link), Author, Department, Type, Date, Status (Signed/Draft tags), Access Web (globe icon), Actions (Download/Delete/Share)
- 2026-02-24: Documents CSS in separate documents.css — high-density layout, sticky header, responsive
- 2026-02-24: Documents mock data — 8 documents across categories with realistic clinical data
- 2026-02-24: Implemented Medication Administration Record (MAR) in medication.html
- 2026-02-24: MAR Action Bar — New Medication (primary), Validate All Pending, Print MAR, View Audit Trail
- 2026-02-24: MAR Filter Bar — date navigation + Time Window (2h/4h/12h) + Care Type (All/Current/Scheduled/PRN) + search input + legend
- 2026-02-24: MAR Grid — p-table with 5 frozen columns (Medication, Dose, Freq, Route, Actions) + horizontal-scrolling time columns
- 2026-02-24: MAR status cells — Given (green), Due (white dashed), Hold (red with reason), Not Given (dark red), Cancelled (gray strikethrough)
- 2026-02-24: MAR mock data — 10 medications (Amoxicillin, Insulin Aspart, Enoxaparin, Metoprolol, Omeprazol, Paracetamol, Furosemida, KCl, Morphine, Atorvastatin)
- 2026-02-24: MAR high-alert icons (triangle warning) for Insulin, Enoxaparin, KCl, Morphine
- 2026-02-24: MAR CSS in `<style>` block within medication.html — no changes to theme-overrides.css
- 2026-02-24: Implemented Care Administration Record (CAR) in care-plans.html
- 2026-02-24: CAR Action Bar — New Care Task, Validate All Pending, Copy from Yesterday, Print CAR, View Audit Trail
- 2026-02-24: CAR Filter Bar — date navigation (Yesterday/Today/Tomorrow) + status legend (Completed/Pending/Overdue)
- 2026-02-24: CAR Grid — p-table with frozen left column (task name + detail), horizontal-scrolling time columns (08:00–22:00)
- 2026-02-24: CAR status cells — color-coded: green (completed), gray/dashed (pending), red (overdue/MISSING)
- 2026-02-24: CAR mock data — 10 clinical care tasks (Respiratory, Subclavian, Hygiene, Mobilisation, Pain, Nutrition, etc.)
- 2026-02-24: CAR CSS in `<style>` block within care-plans.html — no changes to theme-overrides.css
- 2026-02-24: Previous Visits — Master-Detail split layout (30/70) with episode list + 5 clinical panels
- 2026-02-24: Previous Visits — Action Bar with Generate Summary and Print Episode Report buttons
- 2026-02-24: Previous Visits — Episode list (5 episodes with date/type), clickable with active state
- 2026-02-24: Previous Visits — Clinical panels: Alerts & Risks, Problems/Diagnoses, Active Medication, 24h Snapshot, Pending Tests
- 2026-02-24: Previous Visits — CSS classes prefixed with pv-* added to theme-overrides.css
- 2026-02-22: Refactored patient list (index.html) to Full Clinical version with 11 columns
- 2026-02-22: Created layout_list.js — modular list layout engine with tab-bar and toolbar components
- 2026-02-22: Added tab-bar with configurable tabs (Arrivals Today, Planned Arrivals, etc.) and config button
- 2026-02-22: Added toolbar with pagination, PDF/Filter/Folder action icons, and search with blue badge counter
- 2026-02-22: Expanded patients.js with admissionType, medicalProblem, payer, statusMeds/Orders/Vitals fields
- 2026-02-22: Clinical table now has: Room, Admission, Patient, Age/Sex, Medical Problem, Doctor, Payer, Alerts, Days, Status, Actions
- 2026-02-22: Added .table-scroll-container with min-width 1500px for horizontal scroll on small screens
- 2026-02-22: Sort icon placeholders (pi-sort-alt) on table headers with hover effects
- 2026-02-22: Status column with Medication/Orders/Vitals icons and dot-new/dot-alert indicators
- 2026-02-22: Row action menus (pi-ellipsis-v) with dropdown for Ver Detalle, Notas, Órdenes, Medicación
- 2026-02-21: Created layout.js modular engine — eliminates ~250 lines of duplicated HTML per page
- 2026-02-21: Refactored all 12 HTML files to use layout.js placeholders (12 files reduced from ~280 to ~40 lines each)
- 2026-02-21: Cleaned up app.js — removed shared shell functions, kept timeline-specific logic only
- 2026-02-21: Cleaned up patients.js — removed duplicate toggle functions
- 2026-02-21: Added semantic clinical CSS classes (.clinical-danger, .clinical-warning, .clinical-info)
- 2026-02-21: Replaced bottom-bar footer with three-dots user menu dropdown in top bar
- 2026-02-21: Rem-based font scaling — root 13px, .fs-xs through .fs-xxl utility classes
- 2026-02-21: Clinical banner max-height: 80px safety constraint with overflow: hidden
- 2026-02-21: Action bar - quick actions as individual icon+text buttons (primary + secondary)
- 2026-02-21: Collapsible sidebar - defaults to collapsed, state persisted in localStorage
- 2026-02-21: Multi-page restructure - patient list entry point, 10 empty module shell pages
- 2026-02-21: Sidebar navigation converted to `<a>` tags with relative links between pages
- 2026-02-21: Added `data-field` attributes per Instructions.md for Java DTO mapping
- 2026-02-20: Initial build of complete EHR patient timeline with all MVP features
