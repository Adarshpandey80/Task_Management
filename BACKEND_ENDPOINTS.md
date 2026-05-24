# Backend API Endpoints Reference

## ⚠️ Current Issue Found
The frontend is calling `/admin/viewusers` but the backend has `/admin/empdatalist`

## ✅ Available Endpoints

### Admin Routes
- `POST /admin/login` - Admin login
- `POST /admin/createuser` - Create new employee user
- `GET /admin/empdatalist` - **Get all employees** ✅ (Frontend was calling: `/viewusers` ❌)
- `POST /admin/assigntask` - Assign task to employee
- `GET /admin/seereport` - Get all task reports ✅

### Employee Routes
Check empRoute.js for available endpoints

## 🔧 Fix Needed
Update AdminHome.jsx and ViewUsers.jsx to use:
- `GET /admin/empdatalist` instead of `GET /admin/viewusers`

## 🚀 To Test Backend

### 1. Start Backend Server
```bash
cd /Users/adarshpandey/Task-Managment/Server
npm start
# Should see: "Server is running on port 8000"
```

### 2. Test API Endpoints in Browser/Postman
```
GET http://localhost:8000/admin/empdatalist
GET http://localhost:8000/admin/seereport
```

### 3. Check Environment Variables
- `.env` file should have:
  - `MONGODB_URL=...`
  - `PORT=8000`
  - `VITE_BACKEND_URL=http://localhost:8000` (in Client)

### 4. Monitor Console Logs
Frontend will show:
- 📍 Backend URL
- 📥 API endpoints being called
- ✅ Success/Error responses
- Detailed error info if fails
