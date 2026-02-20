# ECH Patient Timeline - EHR Redesign

## Overview
Clinical EHR (Electronic Health Record) patient timeline application, migrating from legacy Java/AngularJS to a modern PrimeNG-flavored HTML/CSS/JS prototype for rapid UI/UX iteration.

## Current State
- Static web application with PrimeNG-flavored HTML components
- Served via Node.js static file server on port 5000
- Mock clinical data for demonstration purposes

## Project Architecture

### File Structure
```
/
├── index.html              # Main application page with PrimeNG-flavored HTML
├── theme-overrides.css     # Custom CSS with CSS variables for theming (colors, fonts, spacing)
├── app.js                  # Application logic: data, filtering, rendering, interactions
├── server.js               # Node.js static file server (port 5000)
├── Instructions.md         # EHR Design Project Core Rules
├── attached_assets/        # Reference files (legacy HTML mockup + screenshot)
└── replit.md               # This file
```

### Key Components
- **Top Bar**: Hospital/department info, alerts/messages bell, user identity
- **Clinical Banner**: Fixed/sticky with patient identity (name, age, gender, DOB), safety tags (Allergies, Fall Risk, VTE, DNR), and p-splitButton quick actions
- **Filter Bar**: p-selectButton time ranges (24h/48h/7d/Full Episode), p-multiSelect role filters, search input, configurable column toggle
- **Timeline Area**: Vertical timeline with date headers, configurable grid columns (time, type, dept, description, card, actions)
- **Sidebar**: Collapsible navigation with PrimeIcons, responsive drawer on tablets
- **Bottom Bar**: Home, Search, Favorites, Config, Info quick links

### Design System
- Colors defined as CSS custom properties in `theme-overrides.css` (--ech-primary, --ech-danger, etc.)
- Uses PrimeFlex utility classes for layout
- PrimeIcons for all iconography
- Responsive breakpoints: 1024px (tablet), 600px (mobile)

## User Preferences
- PrimeNG 15 components (HTML-flavored for static prototyping)
- PrimeFlex utility classes for layout
- Semantic HTML5 tags
- High-density layout for 14" clinical workstations
- Responsive design supporting tablets
- Legacy color scheme preserved (blues for primary, reds for alerts, oranges for warnings)
- Icons from PrimeIcons matching legacy style

## Recent Changes
- 2026-02-20: Initial build of complete EHR patient timeline with all MVP features
