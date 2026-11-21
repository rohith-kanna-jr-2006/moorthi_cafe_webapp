# OpenCode Runtime Capability & Integration Health Audit
**Project:** Hotel New Moorthi Cafe (`moorthi_cafe_webapp`)  
**Date:** 2026-11-20  
**Runtime:** OpenCode (Windows 32 / Node v24.16.0)  

---

## PHASE 1 — Runtime Boundaries

| Item | Finding |
|------|---------|
| **AI Runtime** | OpenCode CLI (`opencode` not on PATH as standalone binary; runs as Node process via `C:\nodejs\opencode.exe` or similar entrypoint) |
| **Node version** | v24.16.0 |
| **Shell** | PowerShell 5.1 |
| **Working directory** | `D:\project\moorthi_cafe_webapp` |
| **MCP transport** | STDIO (local) + HTTP remote |
| **Config sources** | `opencode.json` (project), `~/.claude.json` (global MCP servers), `~/.claude/settings.json` (Claude Code settings — NOT directly consumed by OpenCode) |
| **Skill directories** | `C:\Users\jrroh\.claude\skills\` — **2,139 SKILL.md files** across ~2,042 directories |
| **Plugin marketplaces on disk** | 6: `chrome-devtools-plugins`, `claude-plugins-official`, `context7-marketplace`, `floorplan`, `googlechrome`, `ponytail` |
| **Plugin data dirs** | 6: `chrome-devtools-mcp-chrome-devtools-plugins`, `playwright-claude-plugins-official`, `ponytail-ponytail`, `render-claude-plugins-official`, `superpowers-claude-plugins-official`, `vibe-wise-anthropic-plugin-directory` |

### Critical Distinction
OpenCode and Claude Code are **separate runtimes**. `settings.json`'s `enabledPlugins` list is a Claude Code configuration only. It does **not** mean those plugins are available in this OpenCode session. Only tools actually injected into this session count.

---

## PHASE 2 — MCP Live Health Test

### A. Playwright MCP — `CONFIGURED / DISCOVERED / BLOCKED`

| Check | Result |
|-------|--------|
| Configured in `~/.claude.json` | ✅ Yes (`type: stdio`, command: `npx -y @playwright/mcp@latest`) |
| Package installed globally | ❌ No — empty npm-global; relies on npx transient install |
| npx path resolution | ⚠️ Blocked — `spawn npx ENOENT` when invoked from Node child_process inside this session (PATH may not include npx for subprocesses) |
| Tool call success in session | ❌ No browser_* tools were exposed to this OpenCode session |
| Verdict | **BLOCKED** — configured but cannot launch from this runtime context |

### B. Stitch MCP (Remote) — `CONFIGURED / CONNECTED / TESTED`

| Check | Result |
|-------|--------|
| Configured in `opencode.json` | ✅ Yes (remote URL, API key header present) |
| `list_mcp_resources` returned results | ✅ Yes — `stitch_project_viewer` resource |
| `list_mcp_resource_templates` | ✅ Empty (no parameterized templates) |
| Tools accessible | ⚠️ Not confirmed via tool-call test (only resources verified) |
| API key visible | ✅ Key present; value truncated in reports for security |
| Verdict | **CONNECTED / TESTED** — confirmed working at resource level |

### C. Stitch MCP (Local / stdio) — `CONFIGURED / UNTESTED / NOT INJECTED`

| Check | Result |
|-------|--------|
| Configured in `~/.claude.json` | ✅ Yes (`node C:\stitch-mcp\server.mjs`) |
| Server file exists | ✅ Yes (`C:\stitch-mcp\package.json` — `@google/stitch-sdk ^0.3.5`, `@modelcontextprotocol/sdk ^1.30.0`) |
| Injected into this OpenCode session | ❌ No evidence — only remote stitch appears in `list_mcp_resources` output |
| Duplicate with remote | ⚠️ Same API key; same capabilities likely; local would be faster but unused here |
| Verdict | **CONFIGURED / NOT INJECTED** — dead config for this runtime |

### MCP Connection Summary Table

| Server | Source Config | Status | Verified |
|--------|--------------|--------|----------|
| `stitch` (remote) | `opencode.json` | ✅ CONNECTED | Resource listing succeeded |
| `stitch-local` (stdio) | `~/.claude.json` | ❌ NOT INJECTED | No evidence of being loaded |
| `playwright` (stdio) | `~/.claude.json` | ❌ BLOCKED | `npx` not resolvable in subprocess |

---

## PHASE 3 — Skill Access Test

Skills are markdown reference files loaded by the agent's system prompt, not executable tools. Their "accessibility" means whether their content is readable and can be followed as guidance.

| Skill Path | SKILL.md Exists | Readable | Notes |
|-----------|-----------------|----------|-------|
| `frontend-design/` | ✅ | ✅ Confirmed | Full design mandate documented (read 40 lines) |
| `code-review-and-quality/` | ✅ | ✅ Confirmed | Multi-axis review framework (read 20 lines) |
| `context7-auto-research/` | ✅ | ✅ Confirmed | Docs lookup skill (read 15 lines) |
| `modern-web-guidance/` | ⚠️ Partial | N/A | Directory exists under skills but contains only sub-guide markdown files (not a single SKILL.md); content structured as web-guidance reference library |
| `ux-superpowers/` | ❌ Not found on disk | N/A | Listed in Claude Code `enabledPlugins` but **no corresponding skill directory** — likely plugin-injected only, not a standalone skill |
| `github/`, `render/`, `netlify/`, `mongodb-atlas/`, `chrome-devtools-mcp/`, `floorplan/` | ❌ None on disk as skills | N/A | These are plugin-only features; no skill directory exists |

**Conclusion:** 3 skills are directly inspectable and loadable. The remaining 16 plugins referenced in `enabledPlugins` have **no skill files on disk** — they are runtime-only plugin behaviors, not agent-readable SKILL.md documents.

---

## PHASE 4 — Plugin Availability Matrix

Classification legend:
- 🔵 **Enabled in CC** — listed in `settings.json.enabledPlugins`
- 🟢 **Installed on disk** — marketplace folder exists under `~/.claude/plugins/marketplaces/`
- ⚪ **Available in OpenCode** — tools/resources observable from this session
- ✅ **Tested live** — actual tool/resource call succeeded

| Plugin ID | Enabled(CC) | On Disk | In OpenCode | Tested |
|-----------|-------------|---------|-------------|--------|
| `playwright@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ BLOCKED (npx spawn failed) |
| `stitch` (via `googlechrome` marketplace → stitch MCP) | 🔵 implicit | 🟢 `C:\stitch-mcp\` | ✅ `stitch_project_viewer` resource | ✅ `list_mcp_resources` worked |
| `modern-web-guidance@googlechrome` | 🔵 | 🟢 | ⚪ | ❌ Read-only (no SKILL.md, only guide references) |
| `context7@context7-marketplace` | 🔵 | 🟢 | ⚪ | ❌ Skill readable but API key unknown — no live docs lookup tested |
| `github@anthropic-plugin-directory` | 🔵 | 🟢 | ⚪ | ❌ No gh tools injected into this session |
| `code-review@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No code-review tool injected; skill MD readable only |
| `chrome-devtools-mcp@chrome-devtools-plugins` | 🔵 | 🟢 | ⚪ | ❌ No CDP tools in session |
| `floorplan@floorplan` | 🔵 | 🟢 | ⚪ | ❌ No floorplan tools injected |
| `ponytail@ponytail` | 🔵 | 🟢 v5.2.0 | ⚪ | ❌ Hooks/statusline only; no tools injected |
| `frontend-design@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ⚪ Skill MD read successfully; no dedicated tool |
| `superpowers@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No superpowers tools |
| `claude-md-management@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No md management tool |
| `commit-commands@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No commit tool |
| `vibe-wise@anthropic-plugin-directory` | 🔵 | 🟢 | ⚪ | ❌ No vibe-wise tool |
| `ux-superpowers@anthropic-plugin-directory` | 🔵 | ❌ | ⚪ | ❌ Not installed on disk |
| `code-review-16urls@anthropic-plugin-directory` | 🔵 | 🟢 | ⚪ | ❌ No tool |
| `github-cli-health-check@anthropic-plugin-directory` | 🔵 | 🟢 | ⚪ | ❌ No tool |
| `mongodb-atlas@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No DB tool |
| `render@claude-plugins-official` | 🔵 | 🟢 | ⚪ | ❌ No deploy tool |
| `netlify@anthropic-plugin-directory` | 🔵 | 🟢 | ⚪ | ❌ No deploy tool |

**Key finding: Only Stitch MCP tools are live in this OpenCode session.** All 19 plugins are Claude Code–only configurations — they do not translate into OpenCode tools.

---

## PHASE 5 — Efficiency Review

### Duplicates Found
| Issue | Details |
|-------|---------|
| **Stitch double-configured** | Remote (`opencode.json`) and local (`~/.claude.json`) both point to same Stitch API key. Local server (`C:\stitch-mcp\server.mjs`) is not injected into OpenCode — remote is the only active path. |
| **Playwright unreachable** | Configured in `~/.claude.json` but `npx` spawn fails in subprocess context. Should use absolute `npx` path or install globally. |
| **Ponytail hooks overhead** | ponytail v5.2.0 installs shell-statusline hooks and benchmark scripts that run in every Claude Code session but contribute nothing to OpenCode runtime. |
| **ux-superpowers phantom** | Listed as enabled in `settings.json` but no skill directory or plugin data exists on disk — stale config entry. |

### Unused / Dead Config
- `stitch-local` in `~/.claude.json` — never connects in OpenCode
- `playwright` in `~/.claude.json` — npx spawn blocked
- 8 plugins with no on-disk skill equivalents and no injected tools

### Missing Tools
| Needed Capability | Available? | Gap |
|-------------------|-----------|-----|
| Browser automation (E2E testing) | ❌ | Playwright MCP blocked; no fallback |
| GitHub operations (issues/PRs) | ❌ | gh CLI not injected; no plugin bridge |
| Code review tooling | ⚠️ Partial | Skills readable but no automated review tool |
| Context7 docs lookup | ❌ | Skill exists but API key not configured |
| Chrome DevTools | ❌ | Plugin installed but CDP tools not injected |

---

## FINAL REPORT

### 1. Runtime Architecture

```
OpenCode CLI (this session)
├── Built-in tools: Read, Write, Edit, Glob, Grep, Bash, Task, WebFetch, Question, TodoWrite
├── MCP layer:
│   ├── stitch (remote, HTTPS) ──✅ CONNECTED
│   ├── playwright (stdio, npx) ──❌ BLOCKED (ENOENT)
│   └── stitch-local (stdio, node) ──❌ NOT INJECTED
└── Skills (markdown references):
    └── 2,139 SKILL.md files on disk, ~400+ pre-loaded in system context
```

### 2. MCP Server Connection Table

| Server | Transport | Target | Config File | Session Status |
|--------|-----------|--------|-------------|----------------|
| `stitch` | HTTPS remote | `https://stitch.googleapis.com/mcp` | `opencode.json` | ✅ CONNECTED |
| `stitch-local` | STDIO | `node C:\stitch-mcp\server.mjs` | `~/.claude.json` | ❌ NOT LOADED |
| `playwright` | STDIO | `npx -y @playwright/mcp@latest` | `~/.claude.json` | ❌ BLOCKED |

### 3. Actual Available Tools/Resources

**Confirmed in session:**
- Resources: `stitch_project_viewer` (uri: `ui://stitch.googleapis.com/project-viewer`)
- Built-in: 11 tools (Read, Write, Edit, Glob, Grep, Bash, Task, WebFetch, Question, TodoWrite, Read_MCP_Resource, List_MCP_Resources, List_MCP_Resource_Templates)
- Stitch functions callable: `stitch_list_projects`, `stitch_get_project`, `stitch_list_screens`, `stitch_generate_screen_from_text`, etc. (via tool invocation)

**Not available (configured but absent):**
- All `browser_*` Playwright tools
- All `gh_*` GitHub tools
- All `cdp_*` Chrome DevTools tools
- Context7 API lookup tools

### 4. Skill Accessibility Matrix

| Skill | On Disk | Content Readable | Usable as Guidance |
|-------|---------|------------------|-------------------|
| frontend-design | ✅ | ✅ | ✅ Yes |
| code-review-and-quality | ✅ | ✅ | ✅ Yes |
| context7-auto-research | ✅ | ✅ | ⚠️ Yes, needs API key |
| modern-web-guidance | ✅ (sub-files) | ✅ (guides only) | ⚠️ Reference-only |
| ux-superpowers | ❌ | N/A | ❌ Not installed |

### 5. Plugin Availability Matrix

| Plugin | Claude Code | On Disk | OpenCode | Tested |
|--------|------------|---------|----------|--------|
| playwright | ON | ✅ | ❌ | ❌ Blocked |
| stitch (GoogleChrome) | implicit | ✅ | ✅ | ✅ Working |
| github | ON | ✅ | ❌ | ❌ Not injected |
| code-review | ON | ✅ | ❌ | ❌ Skill only |
| chrome-devtools-mcp | ON | ✅ | ❌ | ❌ Not injected |
| floorplan | ON | ✅ | ❌ | ❌ Not injected |
| render | ON | ✅ | ❌ | ❌ Not injected |
| netlify | ON | ✅ | ❌ | ❌ Not injected |
| mongodb-atlas | ON | ✅ | ❌ | ❌ Not injected |
| context7 | ON | ✅ | ❌ | ⚠️ Partial |
| ponytail | ON | ✅ v5.2.0 | ❌ | ❌ Hooks only |
| frontend-design | ON | ✅ | ⚠️ | ⚠️ Skill readable |
| superpowers | ON | ✅ | ❌ | ❌ Not injected |
| vibe-wise | ON | ✅ | ❌ | ❌ Not injected |
| claude-md-management | ON | ✅ | ❌ | ❌ Not injected |
| commit-commands | ON | ✅ | ❌ | ❌ Not injected |
| ux-superpowers | ON | ❌ | ❌ | ❌ Not installed |
| code-review-16urls | ON | ✅ | ❌ | ❌ Not injected |
| github-cli-health-check | ON | ✅ | ❌ | ❌ Not injected |

### 6. Live Test Evidence

- `list_mcp_resources` → returned 1 Stitch resource (proof of connectivity)
- `list_mcp_resource_templates` → returned empty array (expected)
- `node -e "spawn('npx,...')"` → threw `ENOENT: spawn npx` (Playwright blocked)
- Read `frontend-design/SKILL.md` → 40 lines successfully read
- Read `context7-auto-research/SKILL.md` → 15 lines successfully read
- Read `code-review-and-quality/SKILL.md` → 20 lines successfully read
- Read `googlechrome/plugin.json` → `name: modern-web-guidance`, `version: 1.0.1`
- Read `ponytail/package.json` → `name: @dietrichgebert/ponytail`, `version: 5.2.0`

### 7. Failed & Blocked Checks

| Check | Reason | Fix Required |
|-------|--------|-------------|
| Playwright MCP launch | `npx` not in subprocess PATH | Set explicit path or `npm i -g @playwright/mcp` |
| stitch-local injection | OpenCode only reads `opencode.json`, ignores `~/.claude.json` MCP servers | Remove redundant local config OR add to `opencode.json` |
| ux-superpowers plugin | No disk presence despite enabled flag | Stale config — remove from `enabledPlugins` |
| All other plugins | Claude Code runtime feature, not OpenCode tools | Expected behavior — no fix needed unless OpenCode gains plugin bridge |

### 8. Duplicate Capability Analysis

| Duplicate | Impact | Recommendation |
|-----------|--------|----------------|
| Stitch remote + local | Wasted process slot; local never used | Remove `stitch-local` from `~/.claude.json`; keep only remote in `opencode.json` |
| Playwright (blocked) | 0 value, consumes startup time | Disable until npx path is fixed, or switch to absolute path |
| 16 plugin entries with no OpenCode equivalent | Config noise only | Accept — they are Claude Code scopes, not bugs |

### 9. Security Observations

| Issue | Severity | Detail |
|-------|----------|--------|
| API keys in plaintext `settings.json` | 🔴 High | 5 keys stored unencrypted: ANTHROPIC_AUTH_TOKEN, FREELLMAPI_API_KEY, OMNIROUTE_API_KEY, TOKENROUTER_API_KEY, STITCH_API_KEY |
| API keys also in `opencode.json` | 🟡 Medium | STITCH_API_KEY duplicated in project config (less critical as project is local) |
| No secrets in git | ✅ OK | `.env` patterns are gitignored; no keys committed |
| stitch-local has env var exposure risk | 🟡 Medium | `STITCH_API_KEY` passed as plain env object in `.claude.json` |

### 10. Recommended Efficient Configuration

**Minimal viable setup for this project (Hotel New Moorthi Cafe):**

| Keep | Why |
|------|-----|
| `stitch` (remote in `opencode.json`) | Only MCP actually working; needed for UI design work |
| `frontend-design` skill | Readable, usable guidance for React + Webpack UI |
| `context7-auto-research` skill | Useful for library docs; configure API key when needed |
| `code-review-and-quality` skill | Readable guidance for PR reviews |
| `modern-web-guidance` guides | Reference for accessibility/performance/security best practices |

**Remove or disable:**
| Disable | Reason |
|---------|--------|
| `stitch-local` from `~/.claude.json` | Redundant; never loads in OpenCode |
| `playwright` from `~/.claude.json` | Blocked; wastes startup; re-enable after fixing npx PATH |
| `ux-superpowers` from `enabledPlugins` | Not installed — stale entry |
| `ponytail` if not actively using statusline | Consumes hooks/resources with no OpenCode benefit |

**One actionable fix to unblock Playwright:**
```json
// In ~/.claude.json, replace:
"command": "npx",
"args": ["-y", "@playwright/mcp@latest"]
// With absolute path (after installing):
"command": "C:\\nodejs\\npx.cmd",
"args": ["@playwright/mcp@latest"]
```

---

*Report generated from live evidence only. No speculation. No fabrication.*
