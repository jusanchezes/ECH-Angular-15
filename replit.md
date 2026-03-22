# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
This project is a multi-page clinical Electronic Health Record (EHR) application prototype designed to modernize a legacy Java/AngularJS system. It aims to migrate the frontend to Angular 15 with PrimeNG 15, providing a patient list entry point and modular clinical pages. The application uses mock data for demonstration purposes, showcasing a high-density UX suitable for clinical workstations.

## User Preferences
- PrimeNG 15 components (HTML-flavored for static prototyping)
- PrimeFlex utility classes for layout
- Semantic HTML5 tags
- High-density layout for 14" clinical workstations
- Responsive design supporting tablets
- Safety color system: Red (critical), Yellow (warnings), Blue (info/nav), Green (success)
- Icons from PrimeIcons matching legacy style
- Angular Standalone Components preparation (HTML comments mark component boundaries)

## System Architecture
The application is a static multi-page prototype served by Node.js. It features a modular CSS architecture to manage styles for core components, shared elements, and module-specific overrides. A consistent component identity system uses standardized IDs and HTML comments to mark Angular component boundaries, facilitating future migration. Data binding utilizes `data-field` attributes mapped to Java DTOs, with a dedicated `ClinicalDataService` acting as the single access point for all mock clinical data. The core shell engine (`layout.js`) handles injection of common elements like Header, Sidebar, and Banner across all pages.

**Key Architectural Patterns & Features:**
- **Modular CSS:** Structured into `clinical-core.css`, `components.css`, `table.css`, and module-specific CSS files for maintainability and controlled load order.
- **Shared Toolbar System:** Defined in `action-bar.css` for consistent module-level controls (segmented buttons, filters, date navigation, search).
- **Shared Results Layout:** `results-table.css` provides a flexible layout for data-intensive modules, featuring a left-hand category panel and a main content area with sticky columns and clinical status indicators.
- **Component Identity System:** Standardized `id` attributes and HTML comments (`<!-- BEGIN/END: ComponentName -->`) are used to define boundaries for future Angular Standalone Components.
- **Data Layer Abstraction:** `clinical-data.service.js` provides a service layer (IIFE pattern) as the sole interface for accessing mock data from `mock-clinical-data.js`, ensuring a clear separation of concerns and a clear migration path to REST endpoints.
- **High-Density UI:** Optimized for 14" clinical workstations with 32px row heights for tables and concise information display.

**Key Modules Implemented:**
- **Patient Lists:** Inpatient, ED Tracking Board, Day Hospital, Surgical Cases, each with specific filtering, sorting, and display features.
- **Clinical Data Viewers:** Timeline, Previous Visits, Risk Factors, Diagnostic Tests, Imaging/Laboratory Orders, Laboratory Results (with sparklines), Documents, Medication MAR, Patient Summary, Care Plans, Measurements (vital signs flowsheet).
- **Nursing Workflows:** Nurse Notes, Nursing Workbench (shift task manager with patient tasks, detail panel, and handoff features).

## External Dependencies
- **Node.js**: Used as the static file server for the prototype.
- **PrimeFlex 3.3.1**: A utility-first CSS framework (CDN-based).
- **PrimeIcons 6.0.1**: An icon library (CDN-based).