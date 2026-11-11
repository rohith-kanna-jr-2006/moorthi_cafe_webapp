# Product Requirements Document — Hotel New Moorthi Cafe

## 01. Product overview
| Field | Value |
|---|---|
| Product name | Hotel New Moorthi Cafe Web Application |
| Stage | Existing application in active development |
| Platform | Responsive web application |
| Frontend | JavaScript, React, Webpack |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Goal | Convert the existing frontend UI prototype into a functional application integrated with the existing backend. |

## 02. Problem
The project has an existing frontend UI/prototype and an evolving backend. Agents must not misunderstand the current stage, duplicate backend functionality, redesign working UI, or prioritize cosmetic polish before core flows work.

## 03. Goal
Turn the existing UI prototype into a reliable, responsive, backend-connected restaurant web application while preserving current architecture, design direction, backend business rules, and existing developer work.

## 04. Target users
### Customer
- Browse categories and menu items.
- View food details.
- Sign up and log in.
- Manage a cart and review checkout details.
- Place orders through the existing supported backend flow.
- View order confirmation and order history/status where implemented.

### Admin/staff
- Access authorized administrative screens.
- Manage food items and categories using existing backend capabilities.
- Use existing discount/pricing features where implemented and authorized.

Verify actual implementation; do not assume a feature is complete merely because a page or API exists.

## 05. Core features and definition of done
| Priority | Feature | Done when |
|---|---|---|
| P0 | Repository/integration discovery | Existing frontend, backend, routes, API contracts, and local/remote changes are documented before implementation. |
| P1 | Authentication | UI calls the existing auth API, handles loading/errors, and represents session state correctly. |
| P1 | Food browsing | Categories and foods come from the backend; loading, empty, and error states work. |
| P1 | Food details | Selected item is loaded from the correct backend endpoint and displayed accurately. |
| P1 | Cart | Add/remove/quantity interactions work and state follows established app conventions. |
| P1 | Checkout/order flow | Server-authoritative price, discounts, totals, and validation are respected; success appears only after a confirmed backend response. |
| P1 | Order history | Authenticated users can retrieve their own orders where supported. |
| P1 | Admin food/category management | Existing admin APIs are used with proper authorization and clear feedback. |
| P2 | Responsive behavior | Main journeys work on mobile and desktop without unintended overflow or inaccessible controls. |
| P3 | Visual polish | Compare with available Stitch references after core functionality is stable. |

## 06. Success criteria
- Core customer flows are verified against actual backend responses.
- Admin actions use existing authorized endpoints.
- No frontend-only success state falsely claims an API operation succeeded.
- Build and relevant tests are run and results reported accurately.
- Critical/high defects are resolved or explicitly documented as blockers.
- Existing user changes are preserved.

Do not invent numerical targets or claim completion without evidence.

## 07. Out of scope unless explicitly requested
- Rebuilding or duplicating existing backend functionality.
- Switching from React + Webpack to Next.js, Vite, Angular, or TypeScript.
- Unrequested UI redesign or replacing the existing Stitch-inspired direction.
- Replacing images solely because their file size is small.
- Adding payment providers, dependencies, databases, tables, or third-party services without approval.
- Production deployment or real payment/order tests without explicit authorization.
- Fixing unrelated cosmetic issues while a core flow is broken.

## 08. Open questions and decision rules
- Inspect the actual repository and latest available backend changes before assuming API contracts.
- If local and remote files differ, report the difference; never overwrite local work automatically.
- If a required endpoint is absent or unclear, document evidence and ask before changing backend code.
- Backend work is allowed only when a verified requirement cannot be met with the existing backend and the user authorizes the smallest necessary change.
