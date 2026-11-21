# Stitch MCP Authentication Identity Diagnostic Report

**Diagnostic Target Project:** `10226317095148879480`  
**Diagnostic Target Screen:** `3c35b1470df44029a6007025731266dd`  
**Execution Root:** `D:\project\moorthi_cafe_webapp`  
**Inspection Type:** Strictly Read-Only Authentication & Identity Audit  
**Date:** 2026-11-18  
**Final Status:** **BLOCKED** (Credential / Identity Mismatch — HTTP 403)

---

## 1. Active MCP Configuration Inspection

Inspection of the actual system configuration was conducted without assumptions:

| Parameter | Observed Value | Details |
|---|---|---|
| **Configuration File Path** | `C:\Users\jrroh\.gemini\config\mcp_config.json` | Single global MCP configuration for the current CLI environment. |
| **Server Name** | `stitch` | Defined under top-level `mcpServers.stitch`. |
| **MCP Endpoint** | `https://stitch.googleapis.com/mcp` | Direct HTTPS endpoint to Google Stitch MCP service. |
| **Authentication Scheme** | **`X-Goog-Api-Key`** | Passed via HTTP custom request headers (`headers: { "X-Goog-Api-Key": "..." }`). |
| **OAuth Bearer Token** | **Not Used** | No `Authorization: Bearer` header is configured for the Stitch MCP server. |
| **Process Configuration Freshness** | Active & Current | The CLI runtime connects directly to the specified endpoint with the header configured in `mcp_config.json`. |

---

## 2. Authentication Identity Discovery

In accordance with strict security rules, no secrets, tokens, or raw keys were logged or exposed.

1. **Key Format & Provenance:**
   - Header Key: `X-Goog-Api-Key`
   - Length: 53 characters
   - Prefix: `AQ.Ab8R...` (Stitch Personal Access / Developer API Key format generated from [stitch.withgoogle.com](https://stitch.withgoogle.com))
   - Suffix: `...oZ1g`

2. **Associated Account Metadata:**
   - **Owned Projects in Stitch:** Calling `list_projects()` via this API key returned 6 projects:
     1. `projects/17386529658049140872` ("NEC Timetable Web App")
     2. `projects/2431280884270750586` ("Academic Timetable Scheduler Prototype")
     3. `projects/135683886882556676` ("NEC Faculty Timetable App")
     4. `projects/7612422361616134644` ("Academic Timetable Management System")
     5. `projects/6601487261907587506` ("NEC AcademicFlow Management System")
     6. `projects/2686390577582404351` ("NEC AcademicFlow System")
   - **Local Environment Identities:**
     - Git User: `164-rohithjr` / `24cs164@nandhaengg.org` (Nandha Engineering College, directly matching the "NEC" academic project titles).
     - Active Google Cloud SDK Account: `jrrohithk@gmail.com`.
   - **Key Ownership:** The API key `AQ.Ab8R...` was created under the user's personal/academic Google account (`24cs164@nandhaengg.org` or `jrrohithk@gmail.com`).

3. **Target Project Ownership:**
   - Target project `10226317095148879480` is **NOT** among the projects owned by this key.
   - Project Owner Identity: **UNKNOWN / External** (not readable via API due to permission denial).

---

## 3. Project Ownership and Access Verification

Read-only calls were made through the Stitch MCP interface:

| MCP Call | Arguments | Actual Result | Target Project `10226317095148879480` Present? |
|---|---|---|---|
| `list_projects` | `{}` (Owned) | 6 academic projects returned | **NO** |
| `list_projects` | `{"filter": "view=shared"}` | `{}` (0 shared projects) | **NO** |
| `get_project` | `{"name": "projects/10226317095148879480"}` | `403: The caller does not have permission` | **NO** |
| `list_screens` | `{"projectId": "10226317095148879480"}` | `403: The caller does not have permission` | **NO** |
| `get_screen` | `{"name": "projects/10226317095148879480/screens/3c35b1470df44029a6007025731266dd"}` | `403: The caller does not have permission` | **NO** |

**Conclusion:** Target project `10226317095148879480` is neither owned by nor shared with the Google account associated with the configured Stitch API key.

---

## 4. Summary Findings Table

| Diagnostic Item | Result |
|---|---|
| **Authentication Method** | `X-Goog-Api-Key` (Stitch Personal Access Token) |
| **Active MCP Account Identity** | `24cs164@nandhaengg.org` (NEC account) / `jrrohithk@gmail.com` |
| **Project Owner Identity** | **UNKNOWN** (external account or different Google profile) |
| **Account Identities Match** | **NO (Mismatch)** |
| **Target Project in Owned Listings** | **NO** (0 occurrences in 6 owned projects) |
| **Target Project in Shared Listings** | **NO** (Shared projects list is empty) |
| **Root Cause for HTTP 403** | The active Stitch API key was created by an account (`24cs164@nandhaengg.org` / `jrrohithk@gmail.com`) that has neither owner nor shared viewer permissions on Stitch Project `10226317095148879480`. Reviewing the project in a web browser under a different Google account does not grant permissions to the separate account that generated the MCP API key. |
| **Safest Correction** | **Option A (Recommended):** In the browser logged into the Google account that owns `10226317095148879480`, open Stitch project settings and explicitly share the project with `24cs164@nandhaengg.org` and `jrrohithk@gmail.com` as Viewer.<br>**Option B:** In the browser logged into the account that owns `10226317095148879480`, generate a fresh Stitch API key and update `mcp_config.json` with the new key. |

---

## 5. Restrictions & Integrity Assurance

- No source code files were edited.
- `mcp_config.json` was not modified.
- No API keys or tokens were printed, copied, or exposed.
- All existing workspace changes and untracked files remain intact.
- No staging, commits, pushes, or deployments were performed.
