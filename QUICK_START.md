# 🎯 Quick Setup & Testing Reference

## Configuration Status ✅

### Backend (.env)
```
PORT=8000
MONGODB_URL=mongodb://localhost:27017/taskmanagement
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:8000
```

## 🚀 Start Testing Now

### Terminal 1 - Start MongoDB (if not running)
```bash
mongod
```

### Terminal 2 - Start Backend
```bash
cd /Users/adarshpandey/Task-Managment/Server
npm start
```
Should see: ✅ "Server is running on port 8000"

### Terminal 3 - Start Frontend
```bash
cd /Users/adarshpandey/Task-Managment/Client
npm run dev
```
Should see: ✅ "Local: http://localhost:5173"

## 🧪 Live Testing

### In Browser
1. Go to http://localhost:5173
2. Login with Admin credentials
3. Click "Admin Dashboard"
4. **Open Console (F12 → Console tab)**
5. Watch real-time logs:
   - 🟢 Green logs = Success
   - 🔴 Red logs = Errors
   - 🟡 Yellow logs = Warnings

### Console Output to Expect

**✅ SUCCESS:**
```
🔄 Starting dashboard data fetch...
📍 Backend URL: http://localhost:8000
📥 Fetching from: http://localhost:8000/admin/empdatalist
✅ Users API Success: 200
✅ Dashboard data loaded successfully
```

**❌ ERRORS (and solutions):**
```
❌ Cannot reach backend - Check if server is running
→ Solution: Run 'npm start' in Server folder

❌ Connection timeout - Backend may be offline
→ Solution: Wait for backend to start

❌ Endpoint not found (404)
→ Solution: Check backend routes are correct

❌ Server error (500)
→ Solution: Check MongoDB connection
```

## 📊 Dashboard Should Display

- ✅ **5 Stat Cards** with real numbers:
  - Total Employees
  - Total Tasks
  - Completed Tasks
  - In Progress Tasks
  - Pending Tasks

- ✅ **Recent Employees** section with names/emails
- ✅ **Recent Tasks** section with status badges
- ✅ **Refresh button** that updates data with spinner
- ✅ **Green toast** when data loads successfully

## 🔧 Key Features Now Working

1. **Detailed Error Logging**
   - Console shows exact API endpoints being called
   - Shows response status codes
   - Shows error details if API fails

2. **Specific Error Messages**
   - Different toasts for different error types
   - Helps diagnose connection issues

3. **Real Data Loading**
   - Fetches from MongoDB
   - Shows actual employees and tasks
   - Updates on refresh button click

4. **Backend Routes Fixed**
   - ✅ `/admin/empdatalist` (get all employees)
   - ✅ `/admin/seereport` (get all tasks)
   - ✅ `/admin/deleteuser/:id` (delete employee)
   - ✅ `/admin/updateuser/:id` (update employee)
   - ✅ `/admin/viewusers` (alias for empdatalist)

## 📋 Checklist

- [ ] MongoDB is running (`mongod` started)
- [ ] Backend is running (`npm start` in Server)
- [ ] Frontend is running (`npm run dev` in Client)
- [ ] Admin can login successfully
- [ ] Admin Dashboard loads without errors
- [ ] Console shows green success logs
- [ ] Dashboard displays real employee data
- [ ] Refresh button works with spinner
- [ ] Toast messages appear correctly

## 🎉 When Everything Works

You'll see:
- Real employees from database in dashboard
- Real tasks from database with status
- All API calls succeed with 200 status
- Professional error messages if anything fails
- Data updates when you click Refresh

**Ready to test? Start with the terminals above! ↑**
