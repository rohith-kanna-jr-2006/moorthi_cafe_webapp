# Plugin & MCP Access Report
**Generated:** 2026-11-20  
**Host:** Windows 32  
**User:** jrroh  
**Project:** Hotel New Moorthi Cafe (moorthi_cafe_webapp)

---

## 1. MCP Servers (Global — C:\Users\jrroh\.claude.json)

| # | Name | Type | Command / Endpoint | API Key Status | Enabled |
|---|------|------|--------------------|----------------|---------|
| 1 | **stitch-local** | stdio | `node C:\stitch-mcp\server.mjs` | `STITCH_API_KEY` set (Google Stitch) | Yes |
| 2 | **playwright** | stdio | `npx -y @playwright/mcp@latest` | None required (browser automation) | Yes |

### stitch-local Access
- **Resource:** `ui://stitch.googleapis.com/project-viewer` — Interactive UI dashboard for Stitch projects, design themes, and screens.
- **API Key:** Present in env (`STITCH_API_KEY`). Value starts with `AQ.Ab8RN...` (truncated for safety).
- **Use case:** Design system generation, screen edits, project management via Stitch.

### playwright Access
- **Type:** Browser automation MCP server launched on-demand via npx.
- **Capabilities:** Page navigation, DOM inspection, screenshots, test execution.
- **Logs location:** `.playwright-mcp/` in project root — 35+ console log files and page YAML archives dating back to Oct 2026, latest activity Nov 18 2026.
- **Screenshot captured:** `page-2026-11-18T14-23-17-963Z.png`

---

## 2. Project-Level MCP Config (opencode.json)

| Name | Type | URL / Endpoint | Headers | Enabled |
|------|------|---------------|---------|---------|
| **stitch** | remote | `https://stitch.googleapis.com/mcp` | `X-Goog-Api-Key: AQ.Ab8RN...` | true |

> Note: The same Stitch key is used both locally (stdio) and remotely. This is redundant but not conflicting — local runs faster; remote allows cloud-side resources.

---

## 3. Enabled Plugins (settings.json — 18 total)

| # | Plugin ID | Marketplace | Status | Access Scope |
|---|-----------|-------------|--------|-------------|
| 1 | `ponytail@ponytail` | ponytail (git) | enabled | Statusline, hooks, benchmarks, multi-agent status |
| 2 | `frontend-design@claude-plugins-official` | claude-plugins-official | enabled | UI/UX design guidance, component patterns |
| 3 | `playwright@claude-plugins-official` | claude-plugins-official | enabled | E2E testing, browser automation scripts |
| 4 | `superpowers@claude-plugins-official` | claude-plugins-official | enabled | Agent capability extensions |
| 5 | `code-review@claude-plugins-official` | claude-plugins-official | enabled | PR review, diff analysis, security scanning |
| 6 | `context7@context7-marketplace` | context7-marketplace (GitHub: upstash/context7) | enabled | Library/framework docs lookup |
| 7 | `claude-md-management@claude-plugins-official` | claude-plugins-official | enabled | CLAUDE.md lifecycle management |
| 8 | `commit-commands@claude-plugins-official` | claude-plugins-official | enabled | Conventional commit helpers |
| 9 | `vibe-wise@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | Decision-weighted task routing |
| 10 | `ux-superpowers@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | UX pattern enrichment |
| 11 | `code-review-16urls@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | Multi-source code review |
| 12 | `github-cli-health-check@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | gh CLI diagnostics |
| 13 | `mongodb-atlas@claude-plugins-official` | claude-plugins-official | enabled | MongoDB Atlas admin & queries |
| 14 | `render@claude-plugins-official` | claude-plugins-official | enabled | Render.com deployment |
| 15 | `netlify@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | Netlify deployments |
| 16 | `github@anthropic-plugin-directory` | anthropic-plugin-directory | enabled | GitHub issues/PRs/actions |
| 17 | `chrome-devtools-mcp@chrome-devtools-plugins` | chrome-devtools-plugins (GitHub: ChromeDevTools/chrome-devtools-mcp) | enabled | Chrome DevTools protocol access |
| 18 | `floorplan@floorplan` | floorplan (GitHub: haydenschmitty/floorplan) | enabled | Architectural floor-plan generation |
| 19 | `modern-web-guidance@googlechrome` | googlechrome (GitHub: GoogleChrome/modern-web-guidance) | enabled | Modern web API guidance (accessibility, PWA, security, performance) |

> **Note:** settings.json lists 19 entries under `enabledPlugins`; all are set to `true`.

---

## 4. Extra Known Marketplaces (custom sources)

| Marketplace | Source | Repo / URL |
|-------------|--------|------------|
| ponytail | git | `https://github.com/dietrichgebert/ponytail.git` |
| context7-marketplace | github | `upstash/context7` |
| chrome-devtools-plugins | github | `ChromeDevTools/chrome-devtools-mcp` |
| floorplan | github | `haydenschmitty/floorplan` |
| googlechrome | github | `GoogleChrome/modern-web-guidance` |

---

## 5. Environment Variables (from settings.json — sensitive values redacted)

| Variable | Purpose | Risk |
|----------|---------|------|
| `ANTHROPIC_BASE_URL` | Local proxy endpoint | Low — internal |
| `ANTHROPIC_AUTH_TOKEN` | Auth token for proxy | **High** — do not share |
| `ANTHROPIC_API_KEY` | Same as above | **High** |
| `FREELLMAPI_BASE_URL` | FreeLLM API base | Low |
| `FREELLMAPI_API_KEY` | FreeLLM key | **High** |
| `OMNIROUTE_BASE_URL` | OmniRoute model router | Low |
| `OMNIROUTER_API_KEY` | OmniRoute key | **High** |
| `TOKENROUTER_BASE_URL` | TokenRouter endpoint | Low |
| `TOKENROUTER_API_KEY` | TokenRouter key | **High** |
| `STITCH_API_KEY` | Google Stitch API key | **High** |

---

## 6. Permissions (allowed bash commands)

### Global (.claude/settings.local.json)
```
Bash(mountvol *)
Bash(curl *)
```

### Project-level (.claude/settings.local.json)
```
Bash(npx -y add-mcp https://mcp.vercel.com -g)
Bash(export CLAUDE_CODE_TMPDIR=/D/AI/tmp)
Bash(export TMPDIR=/D/AI/tmp)
Bash(mkdir -p /D/AI/tmp)
Bash(npx -y add-mcp https://mcp.vercel.com -g --help)
Bash(npx -y add-mcp https://mcp.vercel.com -g --all)
Bash(claude --version)
Bash(claude mcp *)
Bash(cat "C:\\Users\\jrroh\\.claude.json" 2>/dev/null | head -c 2000)
Bash(python3 -c ' *)
Bash(node -e "const d=require('C:/Users/jrroh/.claude.json'); ...")
```

---

## 7. Summary & Recommendations

| Category | Count | Notes |
|----------|-------|-------|
| MCP Servers (global) | 2 | stitch-local, playwright |
| MCP Servers (project) | 1 | stitch (remote) |
| Enabled Plugins | 19 | Mix of official, Anthropic directory, and custom marketplaces |
| Custom Marketplaces | 5 | ponytail, context7, chrome-devtools, floorplan, googlechrome |
| Sensitive Env Vars | 5 keys | All should be stored in `.env`, not committed |

### Security Observations
1. **Multiple API keys in plain text** inside `settings.json` — consider moving to a secrets manager or `.env` file.
2. **Stitch key duplicated** across global and project config — consolidate to one source.
3. **Playwright logs** contain screenshot artifacts — ensure no PII is captured in automated tests.
4. **GitHub plugin enabled** without explicit `GH_TOKEN` visible — verify token is sourced from OS/keychain, not hardcoded.

### Usage Frequency (inferred from logs)
- **Playwright MCP**: Heavily used (35+ log files, ongoing through Nov 2026)
- **Stitch MCP**: Active (design system work for this project)
- **Ponytail**: Installed with full hook infrastructure — active per statusline presence
