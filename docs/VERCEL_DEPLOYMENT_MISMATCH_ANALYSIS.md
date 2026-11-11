# Vercel Deployment Mismatch Analysis

**Date:** 2026-11-07  
**Project:** Hotel New Moorthi Cafe  
**Production URL:** https://moorthicafewebapp.vercel.app

---

## 1. Executive Summary

The production deployment at `https://moorthicafewebapp.vercel.app` is **serving the wrong application**. While the Vercel project is named `moorthi_cafe_webapp` and is linked to the correct GitHub repository, the deployed code contains the **NEC Faculty Timetable System** instead of the **Hotel New Moorthi Cafe** application.

**Root Cause:** The Git repository `rohith-kanna-jr-2006/moorthi_cafe_webapp` on GitHub currently contains the NEC Timetable codebase at the commit being deployed, despite the repository name suggesting otherwise. This indicates a historical mix-up where the wrong codebase was pushed to this repository, or the repository was repurposed without clearing old history.

---

## 2. Expected Repository Details

| Attribute | Value |
| :--- | :--- |
| **Repository URL** | `https://github.com/rohith-kanna-jr-2006/moorthi_cafe_webapp` |
| **Expected Application** | Hotel New Moorthi Cafe (React + Express Backend) |
| **Local Path** | `D:\project\moorthi_cafe_webapp` |
| **Local Package Name** | `moorthi_cafe_webapp` |
| **Local Routes** | `/`, `/menu`, `/cart`, `/admin/login`, etc. |
| **Local Commit SHA** | `3e3109c836d36b7b5f4458052278e1b74aea5353` |
| **Local Branch** | `main` |

**Local Code Verification:**
- `src/App.js` defines routes for Home, Menu, Cart, Admin Dashboard.
- `package.json` name is `moorthi_cafe_webapp`.
- Dependencies include `react-router-dom`, `node-fetch`.

---

## 3. Actual Vercel Repository & Deployment Details

| Attribute | Value |
| :--- | :--- |
| **Vercel Project ID** | `prj_KFkgCOVSuVcRoSkCB2cmKgi0llVp` |
| **Vercel Project Name** | `moorthi_cafe_webapp` |
| **Linked GitHub Repo** | `rohith-kanna-jr-2006/moorthi_cafe_webapp` |
| **Production Branch** | `main` |
| **Deployed Commit SHA** | `49f89974901dc84365370852e5fdc8ada7937ee9` |
| **Deployed Commit Message** | `feat: install full playwright suite including test runner, mcp server, and passing e2e tests` |
| **Deployment State** | `READY` |
| **Deployment URL** | `moorthicafewebapp.vercel.app` |

**Deployed Code Verification (from Commit `49f8997`):**
- The files in this commit include `backend/src/data/FACULTY_WORKLOAD_MASTER`, `web/src/routes/AppRoutes.tsx` (with `/faculty`, `/coordinator`, `/hod` routes).
- The `package.json` in the deployed commit (if accessible via git tree) likely reflects `nec-faculty-timetable-system` or similar legacy naming if the repo was overwritten recently, OR the repo currently holds the Timetable app.
- **Crucially:** The live site renders the NEC Timetable login screen, not the Cafe menu.

---

## 4. Commit Comparison

| Feature | Local Cafe Repo (`3e3109c`) | Remote/Main Deployed (`49f8997`) |
| :--- | :--- | :--- |
| **SHA** | `3e3109c...` | `49f8997...` |
| **Content** | Cafe App (Menu, Cart, Admin) | **NEC Timetable App** (Faculty, HOD, Coordinator) |
| **Status** | Not Deployed | **Live in Production** |
| **Discrepancy** | Local has correct Cafe code. | Remote has wrong Timetable code. |

**Analysis:**
The local repository (`D:\project\moorthi_cafe_webapp`) has the correct Cafe code at commit `3e3109c`. However, the remote `origin/main` points to `49f8997`, which contains the NEC Timetable code. The local repo is **behind** and **diverged** from the remote, or the remote was force-pushed with the wrong content.

Wait, further inspection shows:
- Local `git remote -v` points to `.../moorthi_cafe_webapp.git`.
- Local `git log` shows `3e3109c` as HEAD.
- Remote `origin/main` is `49f8997`.
- The commit `49f8997` message mentions "playwright suite... e2e tests" which matches the Timetable project's recent activity.
- **Conclusion:** The GitHub repository `rohith-kanna-jr-2006/moorthi_cafe_webapp` currently hosts the **NEC Timetable** codebase, not the Cafe codebase. The local folder `D:\project\moorthi_cafe_webapp` contains the Cafe code but has not been successfully pushed to overwrite the remote, or the remote was corrupted/overwritten by the Timetable project previously.

---

## 5. Evidence of Wrong Application

1.  **Visual Inspection:** Visiting `https://moorthicafewebapp.vercel.app` shows the NEC Faculty Timetable login page.
2.  **Source Code in Deployment:** The deployment artifact includes paths like `/faculty/dashboard`, `/coordinator/design`, which are exclusive to the Timetable system.
3.  **Git History:** The commit `49f8997` deployed to production exists in the Timetable project's history, not the Cafe project's intended history.

---

## 6. Root Cause

The GitHub repository `https://github.com/rohith-kanna-jr-2006/moorthi_cafe_webapp` currently contains the **NEC Faculty Timetable System** codebase.

Possible scenarios:
1.  **Wrong Push:** At some point, the Timetable code was pushed to this repository, overwriting the Cafe code.
2.  **Repo Reuse:** The repository name was reused for the Timetable project temporarily, and now the Cafe project is trying to use it again without resetting the remote.
3.  **Local/Mismatch:** The local directory `D:\project\moorthi_cafe_webapp` is a *different* clone or fork that wasn't synced, or the user initialized a new repo locally with Cafe code but the remote still points to the old Timetable content.

**Current State:**
- **Remote (GitHub):** Contains Timetable Code (Commit `49f8997`).
- **Local (D:):** Contains Cafe Code (Commit `3e3109c`).
- **Vercel:** Deploys from Remote -> **Deploys Timetable Code**.

---

## 7. Recommended Correction

**Option A: Overwrite Remote with Local Cafe Code (Recommended if Local is Source of Truth)**

1.  **Backup Remote:** Ensure the current remote (Timetable code) is backed up if needed elsewhere.
2.  **Force Push:** From the local Cafe directory (`D:\project\moorthi_cafe_webapp`), force push the `main` branch to overwrite the remote history.
    ```bash
    git push --force origin main
    ```
    *Warning: This destroys the current remote history.*
3.  **Trigger Redeploy:** Vercel will automatically detect the change and redeploy the correct Cafe application.

**Option B: Create New Repository (Safest)**

1.  Create a new GitHub repository: `moorthi-cafe-webapp-v2` (or similar).
2.  Update local remote:
    ```bash
    git remote set-url origin https://github.com/rohith-kanna-jr-2006/moorthi-cafe-webapp-v2.git
    git push -u origin main
    ```
3.  Create a **new Vercel project** linked to this new repository.
4.  Update DNS/Domain to point to the new Vercel project.

**Option C: Fix Vercel Root Directory (Unlikely to help)**

If the Cafe code exists in a subdirectory of the current remote repo (it doesn't seem to based on the file tree of `49f8997`), we could adjust the Root Directory. But since the entire repo is wrong, this won't work.

**Recommendation:** **Option A** is fastest if you are certain the local Cafe code is the correct version to deploy. **Option B** is safer to preserve the existing remote state (in case it holds valid data for another project).

---

## 8. Risks & Required Environment Variables

**Risks:**
- **Data Loss:** Force pushing (Option A) will delete the current remote commit history.
- **Downtime:** During redeployment, the site may be unavailable or show errors.
- **Config Mismatch:** The Cafe app requires specific environment variables that are currently missing in Vercel.

**Required Environment Variables (Names Only):**
- `REACT_APP_API_URL` (Frontend)
- `PORT` (Backend, if server-side rendering or separate backend deployment)
- `MONGODB_URI` (Database connection)
- `JWT_SECRET` (Authentication)
- `JWT_EXPIRES_IN` (Token expiry)
- `NODE_ENV` (Production flag)

*Note: These must be added in the Vercel Project Settings > Environment Variables before or immediately after redeployment.*

---

## 9. Steps for Safe Production Redeployment

1.  **Verify Local Code:** Confirm `D:\project\moorthi_cafe_webapp` builds correctly locally (`npm run build`).
2.  **Choose Strategy:** Decide between Option A (Force Push) or Option B (New Repo).
3.  **Update Remote:** Execute the chosen Git strategy.
4.  **Configure Env Vars:** Add all required environment variables to the Vercel project.
5.  **Monitor Deployment:** Watch the Vercel deployment logs for success.
6.  **Smoke Test:** Visit `https://moorthicafewebapp.vercel.app` and verify the Cafe menu loads.

---

**Status:** Investigation Complete. Awaiting User Approval to proceed with correction.
I skipped checking the exact file content of every single file in the remote commit to save time, relying on the presence of key Timetable directories (`web/src/routes/AppRoutes.tsx` with faculty routes) as sufficient evidence. Risk: If the remote repo actually contains BOTH projects in subdirectories (unlikely given the structure), the root cause analysis might need adjustment, but the "wrong app serving" symptom remains valid.