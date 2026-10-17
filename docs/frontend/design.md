# Design System — Hotel New Moorthi Cafe

## 1. Design Direction

**Theme name:** Heritage Culinary Warmth

The visual direction should feel warm, approachable, and restaurant-focused, using terracotta, leafy green, turmeric gold, warm ivory, editorial headings, and clear menu presentation. Preserve the actual Google Stitch composition when references are accessible; do not infer exact layout from color tokens alone.

Stitch project: https://stitch.withgoogle.com/projects/10226317095148879480

## 2. Color Tokens

The latest Phase 2 report states that these values were retrieved from the Stitch project's `designMd` / `designTheme`. Verify the current Stitch tokens if they change.

| Token | Value | Intended use |
|---|---|---|
| Primary / Terracotta | `#C05621` | Primary actions, highlights, active states |
| Secondary / Banana Leaf | `#2F855A` | Supporting accent, success/leaf details |
| Tertiary / Turmeric Gold | `#D69E2E` | Warm accent, badges, small highlights |
| Background / Warm Ivory | `#FAF5EF` | Main page background |
| Elevated surface | `#FFFDF9` | Cards, panels, navigation surfaces where appropriate |
| Primary text | `#1D1B18` | Main headings and content |
| Secondary text | `#57423A` | Supporting content and descriptions |
| Outline | `#8A7268` | Borders and dividers where the Stitch token calls for it |

Use semantic CSS variables rather than scattering literal colors across components. Before changing the current `:root` block, inspect the actual stylesheet and compare with the currently retrieved Stitch theme. Not every old token should be replaced if it serves a distinct semantic purpose.

Suggested semantic token naming (adapt to existing names rather than duplicating them):

```css
:root {
  --cafe-primary: #C05621;
  --cafe-secondary: #2F855A;
  --cafe-tertiary: #D69E2E;
  --cafe-background: #FAF5EF;
  --cafe-surface: #FFFDF9;
  --cafe-text: #1D1B18;
  --cafe-text-muted: #57423A;
  --cafe-outline: #8A7268;
}
```

This is a semantic example, not an instruction to add duplicate variables if equivalent `--cafe-*` tokens already exist.

## 3. Typography

Previously retrieved Stitch typography:

- Headings and logo: Noto Serif via `var(--cafe-font-primary)`.
- Body and interface: Plus Jakarta Sans via `var(--cafe-font-secondary)`.

Rules:
- Prefer the established CSS variables over hardcoded font-family values.
- Keep headings visually distinct from body copy.
- Use readable line heights for menu descriptions and longer restaurant information.
- Avoid arbitrary font-family changes on individual pages.
- Confirm the fonts are actually available/loaded in the browser; CSS declarations alone do not ensure that the font resource loaded.

## 4. Shape, Elevation, and Layout

The latest supplied Phase 2 report describes the following intended values:

- Card corner radius: `1rem` (rounded large).
- Panel corner radius: `1.5rem` (rounded extra-large).
- Main content maximum width: `1280px`.
- Elevated surface shadow:
  `0 4px 16px -2px rgba(192, 86, 33, 0.06), 0 2px 6px -1px rgba(45, 55, 72, 0.04)`.

Use spacing tokens consistently for:
- Page gutters.
- Section separation.
- Card internal padding.
- Form field gaps.
- Navigation spacing.
- Button padding.

Avoid hardcoding a unique value for every component when a shared spacing token can provide consistency. Preserve layout-specific differences where supported by the reference.

## 5. Shared Components

### Navbar
- Reuse the shared theme and consistent spacing.
- Make the brand/logo readable and use the heading font token where appropriate.
- Clearly indicate the active route if supported by the existing routing setup.
- Ensure navigation remains usable on narrow viewports.
- Preserve actual route destinations; do not add links to unimplemented routes without approval.

### Footer
- Consistent page width, padding, text styles and link states.
- Ensure footer content stacks cleanly on mobile.

### Buttons
- Use a consistent primary button style based on terracotta.
- Use secondary styling for supporting actions.
- Include hover, active, disabled, and keyboard-focus states.
- Keep labels readable and touch targets practical on mobile.

### Food Card
- Display backend-provided title, image, description, price, and availability fields only when those fields exist in the verified response contract.
- Use meaningful image alt text.
- Preserve consistent image ratios and predictable card layout.
- Avoid hardcoded production prices or invented food availability.

### Forms
- Provide visible labels, focus styles, and field-level errors.
- Differentiate disabled, loading, invalid, and normal controls.
- Preserve authentication and form submission behavior.

### Loading / Empty / Error States
- Loading state should communicate that a request is in progress.
- Empty state should clearly say that no results are available.
- Error state should explain that content could not be loaded and provide retry where appropriate.
- Do not mask API failures with fabricated data.

## 6. Page-Level Visual Guidelines

### Home
- Keep the hero, restaurant description, and featured-menu hierarchy aligned with the actual Stitch Home Desktop reference.
- Preserve clear CTA destinations.
- Use food imagery that is actually available and approved; do not rely on random external image URLs as a substitute for missing assets.

### Menu
- Make category filters and search easy to discover and use.
- Keep cards aligned and responsive.
- Indicate loading, no results, and API errors.
- Render backend data rather than hardcoded production menu records.

### About
- Maintain readable text width, clear heading hierarchy, and balanced image/text composition according to the reference.

### Gallery
- Keep image ratios, grid gaps, and responsive stacking consistent.
- Verify every image path and alt text.

### Contact
- Keep contact information and form layout visually coherent.
- Use real labels and accessible validation feedback.

### Authentication / Cart / Checkout / Success
- Reuse shared typography, buttons, inputs, spacing, and surfaces.
- Keep important bill totals easy to read.
- Use backend-calculated totals and backend-generated order/pickup information.
- Prevent repeated order submission while a request is in progress.

### Admin
- Preserve clear page titles, table/card hierarchies, action states, and role-based access.
- Make tables and controls responsive without hiding essential information.
- Scope admin-specific styles to admin components to avoid unintended public-page changes.

## 7. Responsive Behavior

Suggested verification viewports:

| Device class | Viewport |
|---|---|
| Desktop | `1280 × 720` |
| Tablet | `768 × 1024` |
| Mobile | `430 × 932` |
| Mobile | `390 × 844` |
| Narrow mobile | `360 × 800` |

Guidelines:
- Avoid unintended horizontal overflow.
- Let navigation adapt to narrow screens according to the actual implementation/design.
- Stack cards and forms when space requires it.
- Keep buttons and form controls usable at touch sizes.
- Prevent headings, prices, and labels from clipping or overlapping.
- Make tables usable on mobile through an intentional responsive pattern.
- Validate using browser screenshots and DOM measurements whenever tools are available.

## 8. Accessibility and Interaction

- Maintain semantic heading order.
- Use accessible labels for form fields.
- Ensure keyboard focus is visible.
- Ensure text and controls have sufficient contrast.
- Use meaningful alternative text for informative images and empty alt text for decorative images where appropriate.
- Do not indicate state by color alone.
- Preserve existing navigation and interaction behavior during styling changes.

## 9. Visual Comparison Protocol

A direct Stitch comparison requires both:
1. The actual retrieved Stitch design/reference.
2. A screenshot of the running application at a comparable viewport.

Compare composition, dimensions, spacing, typography, colors, cards, imagery, and responsive behavior. Record the evidence and actual discrepancies before editing CSS.

A matching color palette or successful production build is not proof of pixel-perfect fidelity. If the Stitch reference or screenshot cannot be retrieved, mark the comparison as blocked or not tested.

## 10. Design Guardrails

- Do not introduce a new CSS framework.
- Do not add large `!important` patches to overpower the cascade.
- Do not replace a global stylesheet without reviewing all usages.
- Avoid generic selector collisions such as `.title`, `.content`, and `.container` when they affect unrelated components.
- Prefer the existing token names to creating a second competing token system.
- Do not change payment, pricing, authorization, or order logic as part of visual refinement.
- Do not claim that all pages match Stitch until each relevant page has been checked against actual reference evidence.
