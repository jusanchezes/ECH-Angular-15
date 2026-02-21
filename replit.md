# ECH EHR Redesign - Multi-Page Clinical Prototype

## Overview
Clinical EHR (Electronic Health Record) application, migrating from legacy Java/AngularJS to a modern PrimeNG-flavored HTML/CSS/JS prototype for rapid UI/UX iteration. Multi-page architecture with patient list entry point and modular clinical pages.

## Current State
- Static multi-page web application with PrimeNG-flavored HTML components
- Served via Node.js static file server on port 5000
- Mock clinical data for demonstration purposes
- Patient list as entry point, navigates to patient-context module pages

## Project Architecture

### File Structure
```
/
├── index.html              # Patient List (entry point)
├── patients.js             # Patient list logic and mock data
├── timeline.html           # General View / Patient Timeline
├── app.js                  # Timeline logic + shared shell functions (sidebar, alerts, dropdowns)
├── previous-visits.html    # Previous Visits module (empty shell)
├── risk-factors.html       # Risk Factors module (empty shell)
├── diagnostic-tests.html   # Diagnostic Tests module (empty shell)
├── documents.html          # Documents module (empty shell)
├── medication.html         # Medication module (empty shell)
├── patient-summary.html    # Patient Summary module (empty shell)
├── care-plans.html         # Care Plans module (empty shell)
├── measurements.html       # Measurements module (empty shell)
├── nurse-notes.html        # Nurse Notes module (empty shell)
├── protocols.html          # Protocols module (empty shell)
├── theme-overrides.css     # Custom CSS with CSS variables for theming
├── server.js               # Node.js static file server (port 5000)
├── Instructions.md         # EHR Design Project Core Rules
├── attached_assets/        # Reference files (legacy HTML mockup + screenshot)
└── replit.md               # This file
```

### Page Architecture
- **Patient List** (`index.html`): Entry point, no sidebar/clinical banner, table of patients with click-to-navigate
- **Patient Module Pages**: All share a common shell (top bar, clinical banner, sidebar, footer)
  - Sidebar navigation uses `<a>` tags with relative `href` for click-through
  - Active page highlighted in sidebar
  - Clinical banner persists across all patient-context pages

### Shell Components (shared across patient pages)
- **Top Bar** (`id="header-component"`): Hospital/department info, alerts/messages bell, user identity
- **Clinical Banner** (`id="banner-component"`): Fixed/sticky with patient identity, safety tags, p-splitButton quick actions
- **Sidebar** (`id="sidebar-component"`): Collapsible navigation with PrimeIcons, `<a>` links to module pages
- **Footer** (`id="footer-component"`): Home, Search, Favorites, Config, Info quick links
- **Alert Overlay** (`id="alert-panel"`): Slide-in alerts panel

### Technical Standards (from Instructions.md)
- `data-i18n` / `data-i18n-title`: All UI text mapped to translation keys
- `data-field="dtoFieldName"`: Data-bound values mirroring Java DTOs
- Component boundary IDs: `id="header-component"`, `id="sidebar-component"`, `id="banner-component"`, `id="footer-component"`
- PrimeFlex utility classes for layout (no inline styles)
- PrimeIcons for all iconography
- `.p-datatable-sm` for high-density data grids (32px max row height)

### Design System
- Colors defined as CSS custom properties in `theme-overrides.css` (--ech-primary, --ech-danger, etc.)
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
- 2026-02-21: Collapsible sidebar - defaults to collapsed (icon-only), toggle via hamburger/arrow, state persisted in localStorage across pages
- 2026-02-21: Multi-page restructure - patient list entry point, 10 empty module shell pages with shared clinical shell
- 2026-02-21: Sidebar navigation converted to `<a>` tags with relative links between pages
- 2026-02-21: Added `data-field` attributes per Instructions.md for Java DTO mapping
- 2026-02-20: Initial build of complete EHR patient timeline with all MVP features
