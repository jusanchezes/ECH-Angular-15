# EHR Design Project Rules

## Project Context
- **Migration:** Moving from Legacy Java/AngularJS to Modern Java/Angular 15.
- **Tech Stack:** Static HTML/JS/CSS (for UX iteration) using **PrimeNG-flavored HTML**.
- **Design Philosophy:** High-impact, low-effort clinical "Quick Wins."

## Mandatory UI Requirements
- **Clinical Banner:** Fixed/Sticky header. Must contain Patient Identity, patient metadata and Safety Tags (Allergies, Fall Risk, DNR).
- **High Density:** Use PrimeFlex to maximize space for 14'' screens and tablets. Minimal padding.
- **Quick Actions:** Always include a `p-splitButton` for clinical actions "Add Note", "Prescribe", etc.

## Coding Standards
- Use PrimeNG 15 components only.
- Prefer PrimeFlex utility classes for layout.
- Use Semantic HTML5 tags.
- # Modular UI/UX Architecture Rules

## Structural Consistency
- **Universal Components**: Every page MUST include the following three components:
  1. **Persistent Clinical Banner (Header)**: Contains patient identity and safety alerts.
  2. **Global Navigation (Menu)**: Sidebar/Top-bar for module switching.
  3. **Standard Clinical Footer**: For system status and secondary actions.
- **Static Linking**: Pages should be linked via the Menu component using standard relative paths (e.g., `timeline.html`, `medication.html`).

## Component Simulation (Modular Design)
- **HTML Inclusions**: Since this is a static prototype, use a "Component-First" approach. 
- **Mock Data-Binding**: Use clear ID naming conventions (e.g., `id="patient-name"`, `id="allergy-list"`) that mirror the eventual Java DTOs (Data Transfer Objects). This minimizes migration effort by creating a 1:1 map for developers to bind data later.
- **Standardized CSS**: All layouts must use **PrimeFlex** to ensure that "High Density" remains consistent across every screen.

## Page Structure
- Every new page must follow this grid layout:
  - Top: Fixed Header (Clinical Banner)
  - Center: Scrollable Content Area (Timeline, Forms, etc.)
  - Left/Right: Collapsible Menu
  - Bottom: Fixed Footer

## Localization and Translation (i18n)
- **Hardcoding Prohibited**: Do not hardcode user-facing strings (e.g., "Add Note", "Medication") directly into HTML tags.
- **Translation Key Pattern**: Use a clear key-based system for all labels, menus, and buttons (e.g., `{{ 'ACTIONS.ADD_NOTE' | translate }}` or a data-attribute like `data-i18n="ACTIONS.ADD_NOTE"`).
- **Clinical Terminology**: Ensure that clinical labels in the **Clinical Banner** (e.g., "Allergies", "Risk Factors") are mapped to translation keys to facilitate different medical locales.
- **Component Menus**: All items in the `p-splitButton` or `p-menu` must pull their labels from a centralized translation object/JSON file.
