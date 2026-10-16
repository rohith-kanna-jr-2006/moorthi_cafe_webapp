# Hotel New Moorthi Cafe — Local Setup & Execution Guide

Follow these verified PowerShell instructions to start and develop the backend.

---

## 1. Prerequisites Checklist

- **Node.js**: v20+ or v22 LTS (Verified on `v22.19.0`)
- **npm**: v10+ (Verified on `10.9.3`)
- **Docker Desktop**: Running with `moorthi-mongodb` container

---

## 2. Step-by-Step PowerShell Commands

### Step A: Enter the Backend Directory
```powershell
Set-Location "D:\Project\moorthy cafe\backend"
```

### Step B: Start or Verify MongoDB Docker Container
Check if the MongoDB container is running:
```powershell
docker ps --filter "name=moorthi-mongodb"
```
If the container is stopped, start it:
```powershell
docker start moorthi-mongodb
```
If you ever need to create the container from scratch:
```powershell
docker run -d --name moorthi-mongodb --restart unless-stopped -p 27017:27017 -v moorthi_mongodb_data:/data/db mongo:8
```

### Step C: Configure Environment Variables
If `.env` does not exist, copy from the template:
```powershell
Copy-Item .env.example .env
```
Ensure the parameters inside `.env` match your local environment:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/moorthi_cafe
JWT_SECRET=moorthi_cafe_super_secret_jwt_key_2026_chidambaram_development_only
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BUSINESS_TIMEZONE=Asia/Kolkata
BUSINESS_OPEN_TIME=06:00
BUSINESS_CLOSE_TIME=22:30
MIN_PREPARATION_MINUTES=15
MAX_ADVANCE_BOOKING_DAYS=2
PACKAGING_CHARGE=15
GST_PERCENTAGE=5
```

### Step D: Install Dependencies
```powershell
npm install
```

### Step E: Seed the Database with Authentic Menu & Test Accounts
Populate South Indian dishes, categories, default Admin, and default Customer accounts:
```powershell
npm run seed
```
**Default Credentials Created**:
- **Admin**: `admin@moorthicafe.com` / `AdminSecretPass123!`
- **Customer**: `customer@moorthicafe.com` / `CustomerPass123!`

### Step F: Execute Automated Integration Tests
Verify all 5 test suites (30 tests covering auth, menu, orders, concurrency tokens, and admin state machine):
```powershell
npm test
```

### Step G: Start the Development Server (with Auto-Reload)
```powershell
npm run dev
```

Or start standard production server:
```powershell
npm start
```

### Step H: Verify Health Check in Browser or Terminal
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -Method Get
```
Expected output:
```json
{
  "success": true,
  "message": "Hotel New Moorthi Cafe API is healthy and operational",
  "data": {
    "status": "UP",
    "database": "CONNECTED",
    "timezone": "Asia/Kolkata"
  }
}
```
