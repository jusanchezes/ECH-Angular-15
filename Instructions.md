# EHR Redesign: Global Design System & Modular Standards

## 1. Project Context
* **Objective**: Refactor legacy Java/AngularJS EPR into a high-density, safety-first Angular 15 system.
* **Prototyping Strategy**: Use Static HTML/JS with **PrimeNG 15** and **PrimeFlex 3+** to build a modular set of linked clinical pages.
* **UX Goal**: High Information Density (14'' screen optimization), zero "blind screens," and a 30% reduction in click-paths.

## 2. Global "Shell" Architecture (Mandatory on All Pages)
Every module must inhabit a standard shell to ensure consistency.

### 2.1 The Safety-First Clinical Banner (Header)
* **Persistent & Fixed**: This component must never scroll out of view.
* **Max Vertical Height**: **80px**. Combine patient identity and safety alerts into a single horizontal row.
* **Safety Alert Logic**: Use `p-tag` with specific colors:
    * **Red (`danger`)**: Allergies, DNR status, High-Risk Meds.
    * **Yellow (`warning`)**: Fall Risk, Pressure Ulcer Risk.
    * **Blue (`info`)**: VTE Risk, Isolation status.
* **Contextual Quick Actions**: A `p-splitButton` must be anchored on the far right for "Quick-Add" tasks (Note, Order, Vital, Med).

### 2.2 Global Sidebar Navigation
* **Dual-Mode**: Support a full-width (220px) and a collapsed "Slim" mode (60px).
* **Icon-Centric**: Use PrimeIcons for all modules (e.g., `pi-box` for Medication, `pi-chart-line` for Measurements).
* **Navigation**: Links must use relative HTML paths to facilitate prototype click-throughs.

## 3. Technical & Engineering Standards
* **Translation (i18n)**: Strictly use `data-i18n` attributes. All UI text must map to a `translations.json` file.
* **Data Mapping**: Use `data-field="dtoFieldName"` to indicate where Java backend data will be injected later.
* **Componentization**: Use IDs like `id="header-component"` and `id="sidebar-component"` to define future Angular Standalone Component boundaries.
* **High-Density Data**: Use `.p-datatable-sm` and custom CSS to ensure row heights do not exceed 32px in data grids.