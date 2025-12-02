# Football Franchise Mobile Game - Theme & CSS Specification

## Visual Identity

### Overall Aesthetic
- **Theme Name:** "Sunday Lights Premium"
- **Style:** Dark, cinematic broadcast quality with movie poster aesthetics
- **Mood:** Professional, dramatic, high-stakes atmosphere
- **Target Feel:** Premium sports broadcast meets modern mobile gaming

---

## Color Palette

### Base Colors
```css
--background-primary: #020617 (slate-950)
--background-secondary: #0f172a (slate-900)
--background-tertiary: #000000 (black)
--text-primary: #ffffff (white)
--text-secondary: #e4e4e7 (zinc-200)
--text-tertiary: #a1a1aa (zinc-400)
--text-muted: #71717a (zinc-500)
```

### Accent Colors
```css
--accent-blue: #2563eb (blue-600)
--accent-blue-light: #60a5fa (blue-400)
--accent-green: #16a34a (green-600)
--accent-green-light: #4ade80 (green-400)
```

### Status Colors
```css
--status-success: #16a34a (green-600)
--status-success-light: #4ade80 (green-400)
--status-warning: #d97706 (amber-600)
--status-warning-light: #fbbf24 (amber-400)
--status-error: #dc2626 (red-600)
--status-error-light: #f87171 (red-400)
--status-info: #2563eb (blue-600)
--status-info-light: #60a5fa (blue-400)
--status-special: #9333ea (purple-600)
```

### Overlay Colors
```css
--overlay-white-5: rgba(255, 255, 255, 0.05)
--overlay-white-10: rgba(255, 255, 255, 0.1)
--overlay-white-20: rgba(255, 255, 255, 0.2)
--overlay-white-30: rgba(255, 255, 255, 0.3)
--overlay-black-40: rgba(0, 0, 0, 0.4)
--overlay-black-60: rgba(0, 0, 0, 0.6)
```

---

## Gradient Definitions

### Background Gradients
```css
.bg-gradient-main {
  background: linear-gradient(to bottom, #020617, #0f172a, #000000);
}

.bg-gradient-card {
  background: linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.9));
}

.bg-gradient-accent {
  background: linear-gradient(to right, #2563eb, #16a34a);
}

.bg-gradient-overlay {
  background: linear-gradient(to right, rgba(37, 99, 235, 0.2), transparent, rgba(22, 163, 74, 0.2));
}

.bg-gradient-radial {
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 50%);
}
```

### Status Gradients
```css
.bg-gradient-success {
  background: linear-gradient(to bottom right, #16a34a, #059669);
}

.bg-gradient-warning {
  background: linear-gradient(to bottom right, #d97706, #f59e0b);
}

.bg-gradient-error {
  background: linear-gradient(to bottom right, #dc2626, #ef4444);
}
```

---

## Shadow & Glow Effects

### Text Shadows
```css
.text-glow-white {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.text-glow-white-strong {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}
```

### Box Shadows & Glows
```css
.shadow-glow-white {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.shadow-glow-white-strong {
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.1);
}

.shadow-glow-blue {
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
}

.shadow-glow-green {
  box-shadow: 0 0 15px rgba(22, 163, 74, 0.5);
}

.shadow-glow-red {
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
}

.shadow-glow-amber {
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

.shadow-glow-purple {
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
```

---

## Typography

### Font Weights
```css
--font-normal: 400
--font-bold: 700
--font-black: 900
```

### Font Sizes
```css
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-6xl: 3.75rem (60px)
--text-7xl: 4.5rem (72px)
```

### Typography Styles
```css
.heading-primary {
  font-size: var(--text-3xl);
  font-weight: var(--font-black);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.heading-secondary {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-transform: uppercase;
}

.text-meta {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.text-score {
  font-size: var(--text-7xl);
  font-weight: var(--font-black);
  color: var(--text-primary);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.text-team-abbr {
  font-size: var(--text-6xl);
  font-weight: var(--font-black);
  color: var(--text-primary);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
```

---

## Component Styles

### Cards
```css
.card-primary {
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.9));
  backdrop-filter: blur(24px);
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
}

.card-secondary {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}
```

### Badges
```css
.badge-base {
  padding: 0.25rem 1rem;
  font-weight: var(--font-black);
  font-size: var(--text-sm);
  border-radius: 0.375rem;
  text-transform: uppercase;
}

.badge-success {
  background: var(--status-success);
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(22, 163, 74, 0.5);
}

.badge-warning {
  background: var(--status-warning);
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

.badge-error {
  background: var(--status-error);
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
}

.badge-info {
  background: var(--status-info);
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
}
```

### Buttons
```css
.button-primary {
  background: linear-gradient(to right, #2563eb, #16a34a);
  color: var(--text-primary);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
  transition: all 0.3s ease;
}

.button-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(37, 99, 235, 0.7);
}

.button-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: var(--font-bold);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.button-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

### Tabs
```css
.tabs-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.tab-inactive {
  color: var(--text-tertiary);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.tab-active {
  background: linear-gradient(to right, #2563eb, #16a34a);
  color: var(--text-primary);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
}
```

### Tables
```css
.table-container {
  width: 100%;
  font-size: var(--text-sm);
}

.table-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header-cell {
  padding: 0.75rem;
  font-weight: var(--font-bold);
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-cell {
  padding: 0.75rem;
  color: var(--text-primary);
}
```

---

## Glass Morphism Effects

```css
.glass-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.glass-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.glass-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

---

## Border Styles

```css
.border-primary {
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.border-secondary {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.border-accent {
  border: 2px solid rgba(255, 255, 255, 0.3);
}
```

---

## Spacing System

```css
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
--spacing-12: 3rem (48px)
```

---

## Border Radius

```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-full: 9999px (circle)
```

---

## Transition & Animation

```css
.transition-default {
  transition: all 0.3s ease;
}

.transition-fast {
  transition: all 0.15s ease;
}

.transition-slow {
  transition: all 0.5s ease;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## Interactive States

### Hover States
```css
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}
```

### Active States
```css
.active-press:active {
  transform: scale(0.98);
}
```

---

## Layout Containers

```css
.container-main {
  max-width: 1280px (7xl);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

---

## Mobile Responsiveness

### Breakpoints
```css
--mobile: 320px - 640px
--tablet: 641px - 1024px
--desktop: 1025px+
```

### Mobile-First Approach
- Design for mobile first (320px base)
- Progressive enhancement for larger screens
- Touch-friendly targets (minimum 44px)
- Readable text sizes (minimum 14px)

---

## Accessibility Notes

1. **Contrast Ratios:** Ensure all text meets WCAG AA standards (4.5:1 for normal text)
2. **Focus States:** Add visible focus indicators for keyboard navigation
3. **Animation:** Respect prefers-reduced-motion for users with motion sensitivity
4. **Touch Targets:** Minimum 44x44px for interactive elements on mobile

---

## Usage Guidelines

### When to Use Glows
- Primary CTAs and important actions
- Score displays and key metrics
- Active/selected states
- Milestone achievements

### When to Use Gradients
- Hero sections and main backgrounds
- Primary buttons and CTAs
- Active tab states
- Premium/special content cards

### When to Use Glass Morphism
- Overlay cards on rich backgrounds
- Modal dialogs
- Navigation bars
- Floating action buttons

---

## Theme Variations (Future Consideration)

### Light Mode Alternative
- Invert color scheme for daytime use
- Maintain brand gradients with adjusted opacity
- Reduce glow intensity

### Team-Specific Themes
- Allow team color integration
- Maintain core structure
- Adjust accent colors to match team branding

---

**Last Updated:** November 19, 2025
**Version:** 1.0
**Status:** Ready for Development
