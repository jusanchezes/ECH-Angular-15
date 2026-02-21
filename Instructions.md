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

## 4. Developer Handoff: Implementation Notes

### Component Architecture
- **Placeholder IDs**: Elements with IDs like `header-component` and `sidebar-component` are designed to be converted into **Angular Standalone Components**.
- **Shell Injection**: The `layout.js` script simulates Angular's component lifecycle. In production, this logic should be moved to the `app.component.ts` and managed via Angular Routing.

### Data Binding & Integration
- **data-field Attributes**: Attributes like `data-field="patientName"` are direct maps to the **Java DTO** field names.
- **Mock Data**: Clinical values in the prototype are currently pulled from `mock-data.js`. Developers should replace these with **Angular Observables** or **Signals** connected to the Java REST API.

### Layout & Density Standards
- **PrimeFlex Priority**: Layouts use **PrimeFlex 3+**. Do not introduce custom CSS for positioning to ensure the "High Density" remains consistent on clinical 14'' laptop screens.
- **Sticky Banner**: The `80px` fixed header is a safety requirement to eliminate "blind screens." This must remain persistent regardless of the module view.

### Translation (i18n)
- **Key Mapping**: Use the `data-i18n` keys in `translations.json`. These are formatted to be 100% compatible with the `ngx-translate` library in Angular 15.

## 5. Self-Documentation & Commenting Rules
To facilitate a smooth handoff to the Java/Angular 15 development team, the Agent must adhere to these commenting rules:
- **HTML Comments**: Every major PrimeNG component must be preceded by an HTML comment explaining its purpose and the future Angular equivalent (e.g., ``).
- **Data Binding Notes**: Include comments next to `data-field` attributes specifying which Java DTO field is being mapped (e.g., ``).
- **Layout Rationale**: Add comments to PrimeFlex containers explaining the density choice (e.g., ``).
- **Logic Explanation**: In `layout.js` or any script, use JSDoc-style comments to explain functions and how they will be replaced by Angular Services or Observables later.