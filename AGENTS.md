# AGENTS.md — Hotel New Moorthi Cafe

Read this file before any task.

## 01. Purpose and role
Convert the existing Hotel New Moorthi Cafe frontend UI prototype into a functional application integrated with the existing backend.

**Role allocation: Frontend = MAJOR; Backend = ONLY IF REQUIRED.**
- Frontend implementation and integration are primary.
- Inspect backend code as needed to understand API contracts.
- Backend implementation is conditional, not the default.
- Reuse existing backend endpoints and business logic.
- Preserve the existing UI direction and React + Webpack architecture.

## 02. Required read order
Before each task:
1. Read `AGENTS.md`.
2. Read `docs/PRD.md`.
3. Read `docs/DESIGN_SYSTEM.md`.
4. Read `docs/ARCHITECTURE.md`.
5. Inspect current Git status and relevant source files.
6. Inspect relevant backend/API contracts and latest GitHub changes when available.
7. Restate task, acceptance criteria, and expected files. For broad/risky work, report the plan and wait for approval.

Documentation never replaces checking actual code.

## 03. Hard constraints
- JavaScript only. No `.ts`/`.tsx`, TypeScript migration, Vite, or Angular.
- Preserve React + Webpack.
- Do not rebuild existing backend functionality.
- Do not redesign UI or perform unrelated cosmetic polish.
- Do not replace food images solely because files are small.
- Do not add dependencies, services, environment variables, database tables, or API contracts without approval.
- Do not modify database contents, submit real orders, or make real payments during testing.
- Never fabricate test results, screenshots, API behavior, or completion claims.
- Never overwrite local changes with remote files.

## 04. Git and working-tree safety
- Preserve modified, deleted, and untracked files.
- Never run `git reset`, `git clean`, `git stash`, destructive checkout, or other destructive Git operations.
- Do not commit or push unless explicitly requested.
- Do not restore deleted files or remove user-created artifacts.
- Inspect `git status --short` before edits.
- Keep changes focused and report exact files changed.

## 05. Implementation workflow
1. Identify the exact feature/defect.
2. Trace UI -> API utility -> backend route/controller/service -> response.
3. Verify whether the backend already supports the behavior.
4. Implement the smallest frontend-first change using existing conventions.
5. Handle loading, empty, validation, error, and success states.
6. Keep prices, discounts, totals, and authorization server-authoritative.
7. Run relevant commands discovered in `package.json`.
8. Report actual results, unresolved issues, and evidence.

Work one user flow at a time. Avoid broad refactors when a focused integration change is sufficient.

## 06. Agent responsibilities
### Implementation agent (primarily Claude Code)
- Owns approved implementation tasks.
- Focuses on frontend integration.
- Does not expand scope or rebuild backend features.
- Reports necessary backend changes with evidence and requests approval.

### Audit agent (primarily OpenCode)
- Inspects code, API contracts, GitHub changes, and test evidence.
- Identifies concrete missing integrations and reproducible defects.
- Independently verifies implementation.
- Does not duplicate implementation work or edit files during audit-only tasks unless authorized.

## 07. Definition of done
A task is done only when:
- Requested behavior is implemented against the verified API contract.
- Existing design and architecture are preserved.
- Relevant build/tests actually ran and pass/fail/blocked results are reported honestly.
- No unrelated behavior/files were changed.
- Summary lists files changed, behavior verified, evidence, and blockers.

The product is ready only after core customer and authorized admin flows work, security-sensitive rules remain server-side, and critical/high defects are resolved or explicitly accepted.

## 08. Stop and ask
Stop before changing backend business logic/contracts, auth/authorization/payment/order semantics, database schema/data, adding dependencies, changing architecture, replacing visual design/assets beyond scope, destructive file/Git operations, or acting on ambiguous requirements.
Explain observed evidence, options, and the smallest recommended change.
