# Design System — Hotel New Moorthi Cafe

## 01. Purpose
Preserve and consistently apply the existing UI design. This document is not permission to redesign pages. Inspect current CSS, components, and Stitch references before visual changes.

## 02. Existing brand context
| Token/context | Value | Usage |
|---|---|---|
| Primary | `#c05621` | Primary brand/action |
| Secondary | `#2f855a` | Secondary brand |
| Tertiary | `#d69e2e` | Accent |
| Neutral | `#faf5ef` | Light neutral background |
| Intended display font | Noto Serif | Verify actual loading |
| Intended sans-serif font | Plus Jakarta Sans | Verify actual loading |

Verify these values against actual code and Stitch references. Prefer existing CSS custom properties over duplicate tokens.

## 03. Visual rules
- Match existing UI and available Stitch references; do not invent a new visual direction.
- Reuse existing components, styles, and tokens.
- Avoid broad CSS rewrites and unrelated changes.
- Do not replace assets based on file size alone; verify integrity, dimensions, and rendered content.
- Do not claim visual parity without actual screenshots at matching viewport sizes.
- Maintain readable contrast, keyboard focus, semantic controls, and responsive behavior.
- Data-driven views need loading, empty, and error states consistent with the current design.

## 04. Responsive behavior
- Preserve and test the current responsive implementation.
- Test main customer/admin journeys on mobile and desktop.
- Avoid unintended horizontal overflow.
- Do not change breakpoints without evidence of a defect.

## 05. Component policy
- Inspect existing components before creating new ones.
- Prefer minimal extensions over duplicate components.
- Do not add component libraries or new design variants without approval.
- Keep API/loading/error states consistent with existing screens.
- UI success and failure states must be truthful and accessible.

## 06. Visual QA
Prioritize functional integration first. Detailed Stitch comparisons and visual polish come after core flows are stable unless a visual defect blocks usability.
Record route, viewport, reference, screenshot, and observed mismatch. If a reference is unavailable, mark the comparison blocked rather than guessing.
