# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
This project is a multi-page clinical Electronic Health Record (EHR) application prototype. Its primary purpose is to migrate a legacy Java/AngularJS system to a modern, PrimeNG-flavored HTML/CSS/JS frontend. The goal is to facilitate rapid UI/UX iteration for clinical use cases. The application provides a patient list as an entry point and navigates to modular clinical pages, using mock data for demonstration. The project aims to deliver a modern, intuitive, and efficient interface for healthcare professionals.

## User Preferences
- PrimeNG 15 components (HTML-flavored for static prototyping)
- PrimeFlex utility classes for layout
- Semantic HTML5 tags
- High-density layout for 14" clinical workstations
- Responsive design supporting tablets
- Legacy color scheme preserved (blues for primary, reds for alerts, oranges for warnings)
- Icons from PrimeIcons matching legacy style
- Module pages prepared as empty shells, content provided later by user

## System Architecture
The application is a static multi-page web application served via a Node.js static file server. It employs a modular architecture to reduce duplication and improve maintainability.

**Core Principles:**
-   **Multi-page Structure:** Patient list entry point (`index.html`) leading to various patient-context clinical modules.
-   **Unified Styling:** All styles are consolidated into a single `theme-overrides.css` file, organized with a Table of Contents for maintainability.
-   **Modular Layout Engine (`layout.js`):** Injects shared UI components (Header, Sidebar, Clinical Banner, Alert Overlay) into patient-context pages, eliminating HTML duplication. It dynamically adjusts content based on `data-page-type`.
-   **Data Binding:** UI elements use `data-i18n` for internationalization and `data-field="dtoFieldName"` for data binding, mirroring Java DTOs.
-   **Component Boundaries:** Shared shell components are identified by `id="[component-name]-component"` for clear demarcation.
-   **UI/UX Design:**
    -   **Design System:** Colors are defined using CSS custom properties (e.g., `--ech-primary`) for consistency. Semantic clinical CSS classes (`.clinical-danger`, `.clinical-warning`) are used for conveying status.
    -   **Iconography:** PrimeIcons are used for all icons.
    -   **Layout:** PrimeFlex utility classes are preferred for layout, avoiding inline styles. High-density data grids use `.p-datatable-sm`.
    -   **Responsiveness:** Designed with breakpoints for tablet (`1024px`) and mobile (`600px`).

**Key Features and Modules:**
-   **Patient List (`index.html`):** The primary entry point, displaying an 11-column clinical table of patients.
-   **Patient Module Pages:**
    -   **Timeline (`timeline.html`):** General view/patient timeline.
    -   **Previous Visits (`previous-visits.html`):** Master-Detail layout for episode lists and clinical panels.
    -   **Risk Factors (`risk-factors.html`):** A 10-tab risk control center with high-density tables.
    -   **Diagnostic Tests (`diagnostic-tests.html`):** Clinical orders list with date tags, result indicators, and action icons.
    -   **Imaging Orders (`imaging-orders.html`):** Master-Detail view for radiology ordering with service catalog and cart management.
    -   **Laboratory Orders (`laboratory-orders.html`):** Master-Detail view for lab ordering with catalog and cart management.
    -   **Laboratory Results (`laboratory.html`):** High-density results viewer with filtering, safety flags, and sparkline trends.
    -   **Documents (`documents.html`):** Clinical file manager with tab filters.
    -   **Medication Administration Record (MAR) (`medication.html`):** Full MAR grid with frozen columns.
    -   **Medication Prescription (`medication-prescription.html`):** Vertical Master-Detail view for drug catalog and orders.
    -   **Patient Summary (`patient-summary.html`):** Dashboard with 6 clinical panels.
    -   **Care Administration Record (CAR) (`care-plans.html`):** Full CAR grid.
    -   **Measurements Flowchart (`measurements.html`):** Master-Detail vital signs flowsheet.
    -   **Nurse Notes (`nurse-notes.html`):** Shift-based nursing overview.
    -   **Protocols (`protocols.html`):** High-density protocol list with search and edit actions.

## External Dependencies
-   **Node.js:** Used as a static file server to host the application.
-   **PrimeNG 15:** Provides HTML-flavored components for UI elements.
-   **PrimeFlex:** Utility-first CSS framework for layout.
-   **PrimeIcons:** Icon library for all iconography within the application.