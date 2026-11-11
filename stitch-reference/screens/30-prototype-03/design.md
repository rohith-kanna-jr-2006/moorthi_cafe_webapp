# Hotel New Moorthi Cafe — UI Background Design Specification

**Purpose:** Add a warm, memorable visual background to the approved website without redesigning existing pages or changing application behaviour.

**Brand:** Hotel New Moorthi Cafe  
**Location:** Chidambaram, Tamil Nadu, India  
**Visual direction:** Premium-but-welcoming South Indian cafe, inspired by cream walls, roasted coffee, terracotta, banana-leaf green and real South Indian food photography.

> Implementation rule: preserve the existing page structure, copy, routes, components and approved Stitch layouts. This document specifies the visual treatment only. Reuse existing food images and assets where possible. Do not invent the restaurant's address, phone number, opening hours, logo or customer reviews.

---

## 1. Design principles

1. **Food stays in focus.** Use the strongest photography in the Home hero and selected menu cards. Keep section backgrounds quiet enough that dishes stand out.
2. **Warm, not loud.** Build the page from cream and ivory surfaces, then use terracotta and deep green as accents. Avoid using saturated orange across large areas.
3. **Use depth sparingly.** Combine soft colour transitions, subtle texture, rounded image panels and restrained shadows. Avoid a gradient behind every card.
4. **Backgrounds must not reduce readability.** Text and controls sit on solid or sufficiently opaque surfaces, not directly over a busy photo.
5. **One consistent system.** Reuse the same tokens and background utility classes across Home, About, Menu Preview, Gallery and Contact.
6. **Mobile first.** The background must not cause horizontal overflow, cover controls or make content hard to read on small screens.

## 2. Colour tokens

Use CSS custom properties so colours can be adjusted in one place. If the existing project already has equivalent tokens, map these values to its current naming convention instead of creating duplicates.

| Token | Value | Usage |
|---|---|---|
| `--cafe-cream` | `#FFF8EE` | Main page canvas |
| `--cafe-ivory` | `#FFFCF7` | Cards and clean content surfaces |
| `--cafe-terracotta` | `#C65D35` | Primary accent, highlights and primary CTA |
| `--cafe-terracotta-dark` | `#984124` | Hover/focus accent; use for text only after contrast check |
| `--cafe-espresso` | `#34231D` | Main text and dark surfaces |
| `--cafe-leaf` | `#294B38` | Footer, selected category and secondary accent |
| `--cafe-leaf-soft` | `#E9EFE7` | Soft green section surface |
| `--cafe-spice-soft` | `#F7E6D8` | Warm section highlight |
| `--cafe-text-muted` | `#6F6259` | Supporting text |
| `--cafe-border` | `#E8DCCF` | Dividers, borders and input outlines |
| `--cafe-white` | `#FFFFFF` | Text on dark sections and clean surfaces |

Use `--cafe-espresso` on cream/ivory for body copy. Do not use muted text for small text on a dark background without checking contrast.

## 3. Typography and shape

- Keep the site's existing font if it is already consistent with the approved Stitch design.
- Otherwise use a readable sans-serif for UI text, such as `Inter`, `DM Sans` or a system sans-serif stack. A display serif may be used for large editorial headings only if it matches the approved design.
- Use clear heading levels and short line lengths. Do not place long paragraphs over photographs.
- Recommended surface radius: 12–16px for cards, 18–24px for large image panels, pill radius for category chips.
- Shadows should be soft and low-contrast. Borders should remain visible on cream backgrounds.
- Keep hover effects brief and subtle. Do not make essential information depend on hover.

## 4. Background system

Use these reusable background treatments instead of styling every section independently.

### A. Main canvas: warm ivory with a barely visible texture

The page background should feel warmer than pure white. Use a CSS-only blend so it loads quickly and does not need another image file.

```css
.site-shell {
  color: var(--cafe-espresso);
  background-color: var(--cafe-cream);
  background-image:
    radial-gradient(ellipse at 8% 8%, rgba(198, 93, 53, 0.055), transparent 34rem),
    radial-gradient(ellipse at 92% 34%, rgba(41, 75, 56, 0.045), transparent 32rem);
}
```

Keep this effect extremely subtle. Do not add a texture image over the full page unless a compressed, approved asset already exists.

### B. Hero: real food image with a legible text area

- Use one appetising, high-quality South Indian food/meal photograph already approved in Stitch or the project's assets.
- Use `background-size: cover` for a background image, or prefer an `<img>` with `object-fit: cover` when practical for responsive art direction and accessibility.
- Position the text over a solid cream panel or a dark green/espresso gradient overlay. Never put dark text over a visually busy part of the image.
- Keep the main heading and primary action visible without scrolling on common desktop widths where the current layout allows it.
- Use a different `object-position` on mobile if needed so the dish remains visible.

Example for a hero image element:

```css
.hero-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  background: linear-gradient(
    90deg,
    rgba(35, 27, 22, 0.78) 0%,
    rgba(35, 27, 22, 0.48) 48%,
    rgba(35, 27, 22, 0.08) 100%
  );
}
```

Adjust the overlay direction to match where the text sits in the approved layout. If the heading is on a separate cream panel, reduce or remove the overlay accordingly.

### C. Alternating content sections

Alternate light surfaces to guide the visitor through the page without making it look like a set of unrelated cards:

```css
.section--cream {
  background: var(--cafe-cream);
}

.section--ivory {
  background: var(--cafe-ivory);
}

.section--spice {
  background: var(--cafe-spice-soft);
}

.section--leaf-soft {
  background: var(--cafe-leaf-soft);
}
```

Use one section surface per major section. Avoid stacking multiple background colours within the same small content area.

### D. Decorative shapes and motifs

- Optional: add one or two oversized, low-opacity organic shapes behind section edges using `::before`/`::after`, with `pointer-events: none` and no content overlap.
- An understated kolam-inspired line pattern can be used at very low opacity near a section corner, only if it can be implemented as a small local SVG or CSS decoration.
- Keep decorative elements away from headings, food imagery, forms and clickable controls.
- Do not use emoji as decoration, animated particles, strong glowing effects or excessive floating elements.

### E. Footer: deep leaf green

Use a solid deep green background as a visual anchor at the bottom of the public site. Use white/ivory text, clear section headings and visible link states. Keep contact details as owner-confirmed information or clearly labelled placeholders.

```css
.site-footer {
  color: var(--cafe-white);
  background: var(--cafe-leaf);
}

.site-footer a {
  color: inherit;
  text-underline-offset: 0.2em;
}

.site-footer a:focus-visible {
  outline: 2px solid var(--cafe-white);
  outline-offset: 3px;
}
```

## 5. Page-by-page background direction

### Home

- Main canvas: warm ivory.
- Hero: food photograph with readable overlay/panel and terracotta primary CTA.
- Popular dishes: clean ivory food cards; imagery should be the main visual interest.
- Why choose us: soft leaf-green or cream section, with simple icons and short text.
- Restaurant/location block: pale spice background or ivory panel; keep map and details clear.
- Customer reviews: only use verified reviews, or label any existing prototype examples as illustrative.
- Footer: deep leaf green.

### About

- Use the same warm canvas.
- Pair restaurant/food photography with an ivory text panel.
- A soft terracotta section may highlight the restaurant story, but keep long text on a light, solid surface.
- Do not invent history, ownership details or claims about hygiene/quality. Use approved copy or placeholders until confirmed.

### Menu Preview

- Keep the background light and low-noise so customers can scan dish names, prices and availability quickly.
- Use category chips with clear selected/unselected states.
- Food cards use consistent aspect ratios, cream/ivory surfaces and thin borders.
- Show unavailable items clearly; don't communicate availability by colour alone.
- Avoid photo backgrounds behind the food grid.

### Gallery

- Use a neutral cream or ivory background so the photos lead visually.
- Keep image ratios consistent within each grid row where practical.
- Use a restrained border radius and hover/focus indication. On mobile, avoid hover-only interactions.
- A lightbox should have a darkened backdrop, a clear close control and keyboard-accessible focus behaviour.

### Contact

- Use warm cream as the primary surface and a soft green panel for confirmed contact/opening-hour information.
- Keep contact placeholders clearly labelled until the restaurant owner provides the real details.
- Use a clean, solid surface behind any map or location embed. Do not place text directly over a map image.

## 6. Reusable CSS starting point

Place the tokens and utility classes in the project's existing global stylesheet (for example, `global.css`, `index.css` or its current equivalent). Do not create another global stylesheet if the project already has one.

```css
:root {
  --cafe-cream: #FFF8EE;
  --cafe-ivory: #FFFCF7;
  --cafe-terracotta: #C65D35;
  --cafe-terracotta-dark: #984124;
  --cafe-espresso: #34231D;
  --cafe-leaf: #294B38;
  --cafe-leaf-soft: #E9EFE7;
  --cafe-spice-soft: #F7E6D8;
  --cafe-text-muted: #6F6259;
  --cafe-border: #E8DCCF;
  --cafe-white: #FFFFFF;

  --surface-radius-card: 14px;
  --surface-radius-panel: 22px;
  --shadow-card: 0 8px 24px rgba(52, 35, 29, 0.07);
  --content-max-width: 1200px;
}

html {
  color-scheme: light;
}

body {
  margin: 0;
  color: var(--cafe-espresso);
  background: var(--cafe-cream);
  font-family: Inter, "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.site-shell {
  min-height: 100vh;
  background-color: var(--cafe-cream);
  background-image:
    radial-gradient(ellipse at 8% 8%, rgba(198, 93, 53, 0.055), transparent 34rem),
    radial-gradient(ellipse at 92% 34%, rgba(41, 75, 56, 0.045), transparent 32rem);
}

.page-container {
  width: min(100% - 2rem, var(--content-max-width));
  margin-inline: auto;
}

.section--cream { background: var(--cafe-cream); }
.section--ivory { background: var(--cafe-ivory); }
.section--spice { background: var(--cafe-spice-soft); }
.section--leaf-soft { background: var(--cafe-leaf-soft); }

.food-card {
  overflow: hidden;
  border: 1px solid var(--cafe-border);
  border-radius: var(--surface-radius-card);
  background: var(--cafe-ivory);
  box-shadow: var(--shadow-card);
}

@media (max-width: 640px) {
  .page-container {
    width: min(100% - 1.25rem, var(--content-max-width));
  }

  .site-shell {
    background-image:
      radial-gradient(ellipse at 0% 0%, rgba(198, 93, 53, 0.04), transparent 22rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is a starting point, not a requirement to replace the project's entire stylesheet. Merge only the relevant tokens and classes into the existing style system, avoiding duplicate or conflicting rules.

## 7. Responsive rules

- Desktop: keep a spacious max-width content container, full navigation and generous hero imagery.
- Tablet: reduce section spacing and let multi-column content wrap cleanly.
- Mobile: use a compact hero crop, stack content sections, keep buttons comfortably tappable and prevent horizontal scrolling.
- Use CSS `background-position`/`object-position` per breakpoint where a food image crop needs adjustment.
- Never rely on `background-attachment: fixed`; it can perform poorly on mobile.
- Avoid large background assets that slow first paint. Prefer compressed WebP/AVIF images when supported by the current asset pipeline.

## 8. Accessibility and performance

- Maintain readable text/background contrast. Verify contrast for CTA labels, small text, category chips and footer links.
- Put meaningful food images in `<img>` elements with useful `alt` text. Decorative background images should not duplicate content announced by assistive technology.
- Give keyboard users visible `:focus-visible` indicators.
- Do not encode essential status information in colour alone.
- Avoid video backgrounds and autoplaying visual effects.
- Use appropriately sized responsive images and set dimensions/aspect ratio to reduce layout shift.
- Respect `prefers-reduced-motion` and do not add background animation just for decoration.

## 9. Implementation constraints

- JavaScript/React only; do not introduce TypeScript.
- Preserve existing routes, form behaviour, API calls and backend business logic.
- Do not replace approved page layouts. Apply this visual system to their existing structure.
- Do not add fake production menu records, fabricated customer reviews or unconfirmed restaurant contact details.
- Do not install a UI framework just to implement these background treatments.
- Keep public-site decoration separate from the admin workspace. The admin interface should use clean neutral surfaces, clear tables, visible form controls and status colours; do not apply photo backgrounds behind management tables.
- If a requested colour conflicts with the current approved Stitch screen, preserve the screen's layout and use the closest token rather than redesigning it wholesale.

## 10. Acceptance checklist

- [ ] Existing approved pages and routes remain intact.
- [ ] The Home hero feels appetising and the text remains readable.
- [ ] Page backgrounds use a consistent cream, terracotta and leaf-green palette.
- [ ] Menu cards remain easy to scan; no busy image background sits behind the grid.
- [ ] About, Gallery and Contact have distinct but consistent surface treatments.
- [ ] Footer has a strong, legible visual finish.
- [ ] Mobile view has no horizontal overflow or obscured buttons.
- [ ] Focus states and text contrast remain visible.
- [ ] No new fake restaurant details or menu records were introduced.
- [ ] Build and existing tests pass after the change.

## 11. Coding-agent task prompt

Use this prompt after adding `design.md` to the repository:

> Read `design.md` and inspect the existing frontend before editing. Update the existing public website backgrounds and visual surfaces to match the specification, while preserving the approved page layouts, routes, text and interactions. Reuse current components and styles. Implement the changes in the existing CSS/style structure, with responsive behaviour and accessible contrast. Do not change backend code, API contracts, authentication, business logic or customer/admin workflows. Do not add fake restaurant information or sample data as production content. After the changes, run the available frontend build and relevant tests. Report the files changed and any checks that could not be run.
