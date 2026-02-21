# EHR Design Project Rules

## Project Context
- **Migration:** Moving from Legacy Java/AngularJS to Modern Java/Angular 15.
- **Tech Stack:** Static HTML/JS/CSS (for UX iteration) using **PrimeNG-flavored HTML**.
- **Design Philosophy:** High-impact, low-effort clinical "Quick Wins."

## Mandatory UI Requirements
- **Clinical Banner:** Fixed/Sticky header. Must contain Patient Identity and Safety Tags (Allergies, Fall Risk, DNR).
- **High Density:** Use PrimeFlex to maximize space for 14'' screens and tablets. Minimal padding.
- **Timeline:** Use `p-timeline` for the clinical logbook view.
- **Quick Actions:** Always include a `p-splitButton` for clinical actions "Add Note", "Prescribe", etc.

## Coding Standards
- Use PrimeNG 15 components only.
- Prefer PrimeFlex utility classes for layout.
- Use Semantic HTML5 tags.
