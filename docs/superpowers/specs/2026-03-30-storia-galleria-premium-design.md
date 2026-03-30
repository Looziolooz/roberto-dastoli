# Design Spec: Storia & Galleria Premium Redesign

**Date:** 2026-03-30  
**Project:** Luogo dei Ricordi  
**Author:** OpenCode

---

## Overview

Redesign of "La sua storia" (biography timeline) and "Galleria" (photo gallery) pages with premium UI/UX following glassmorphism principles and inline lightbox pattern.

---

## 1. Storia Page — Glassmorphism Grid

### Layout
- **Masonry/Pinterest-style grid** — 3 columns on desktop, 2 on tablet, 1 on mobile
- Cards with varying heights based on content
- Staggered reveal animation on scroll

### Card Design (Glassmorphism)
```css
/* Glassmorphism Card */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 
  0 8px 32px rgba(31, 38, 135, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.5);
border-radius: 20px;
```

### Card Structure
- **Photo area** — Full-width top, 16:10 aspect ratio, object-cover
- **Content area** — Padding 20px
  - Period badge (colored, top-left)
  - Title (period name)
  - Years subtitle
  - Description text (max 3 lines with ellipsis)
  - Subtle gradient overlay on image

### Interactions
- **Hover:** Card lifts (translateY -4px), shadow deepens, slight scale (1.02)
- **Click:** Navigate to full chapter view (future feature) or expand
- **Scroll:** Stagger reveal with 50ms delay between cards

### Color Palette
- Each chapter keeps its unique color as accent
- Background: Subtle gradient from brand-bg to lighter shade
- Text: brand-text primary, brand-muted for secondary

---

## 2. Galleria Page — Inline Lightbox

### Layout
- **Masonry grid** — Same as Storia for consistency
- Filterable by tags (existing feature)

### Lightbox Pattern
Instead of modal overlay, use **inline expansion**:

1. **Grid View (default)**
   - Thumbnail cards in masonry grid
   - Hover shows subtle zoom + caption overlay
   - Click expands card in-place

2. **Expanded View (inline)**
   - Selected image expands to fill its grid position
   - Adjacent items fade/shift
   - Caption and metadata appear below image
   - "Close" button returns to grid
   - No page scroll, no overlay blocking

### Image Sizing
- **Adaptive container** — Use actual image dimensions
- **Max constraints:** max-w-4xl, max-h-[80vh]
- **Object-fit:** preserve-3d for portraits, cover for landscapes
- **Background:** Semi-transparent blur behind (not full-screen black)

### Lightbox Controls
- Navigation arrows (prev/next) — appear on hover
- Tag pills — clickable to filter
- Close button — top-right corner

### Animation
- **Expand:** Scale from thumbnail position (0.95 → 1) with spring physics
- **Collapse:** Reverse animation
- **Adjacent items:** Fade out (opacity 0.3) when expanded

---

## 3. Shared Design System

### Typography
- Headings: font-cormorant, 600 weight
- Body: font-dm-sans, 400 weight
- Line height: 1.6 for readability

### Spacing
- Grid gap: 20px (desktop), 16px (mobile)
- Card padding: 20px
- Section padding: 48px vertical

### Responsive Breakpoints
- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Animations
- Use Framer Motion for all transitions
- Spring physics: stiffness 300, damping 30
- Stagger delay: 0.05s per item

---

## 4. Acceptance Criteria

### Storia
- [ ] Cards display in masonry grid layout
- [ ] Glassmorphism effect visible (blur, border, shadow)
- [ ] Hover states work smoothly
- [ ] Scroll reveal animation on load
- [ ] Responsive at all breakpoints
- [ ] Each chapter shows: photo, period, years, description

### Galleria
- [ ] Images display in masonry grid
- [ ] Click expands image inline (not modal)
- [ ] Expanded image uses adaptive sizing
- [ ] Close button collapses back to grid
- [ ] Navigation between images works
- [ ] Filter by tags still functions
- [ ] No full-screen overlay

### Performance
- [ ] Images lazy-loaded
- [ ] Animations run at 60fps
- [ ] No layout shift on expand/collapse
