# 🧪 Testing Guide - Backend Data Loading

## ✅ Changes Made

### Frontend (AdminHome.jsx)
- ✅ Changed endpoint from `/admin/viewusers` → `/admin/empdatalist`
- ✅ Added detailed console logging for debugging
- ✅ Added specific error messages based on error type:
  - ❌ Connection timeout → "Backend may be offline"
  - ❌ 404 Error → "Endpoint not found"
  - ❌ 500 Error → "Server error - Backend issue"
  - ❌ No response → "Cannot reach backend"
- ✅ Success toast: "Dashboard data loaded successfully"

### Backend Routes
- ✅ Updated `/admin/seereport` to return ALL tasks (not just completed)
- ✅ Added `/admin/viewusers` route (alias for `/admin/empdatalist`)
- ✅ Added `/admin/deleteuser/:id` route
- ✅ Added `/admin/updateuser/:id` route

## 🚀 Step-by-Step Testing

### 1. Start the Backend
```bash
cd /Users/adarshpandey/Task-Managment/Server
npm start
```
Expected output:
```
Connected to MongoDB
Server is running on port 8000
```

### 2. Start the Frontend
```bash
cd /Users/adarshpandey/Task-Managment/Client
npm run dev
```

### 3. Open Browser Console
- Go to http://localhost:5173
- Login as Admin
- Go to Admin Dashboard
- Open Browser Console (F12 → Console tab)

### 4. What to Look For in Console

#### ✅ Success (Green Console Logs):
```
🔄 Starting dashboard data fetch...
📍 Backend URL: http://localhost:8000
📥 Fetching from: http://localhost:8000/admin/empdatalist
✅ Users API Success: 200 [{...}, {...}]
📥 Fetching from: http://localhost:8000/admin/seereport
✅ Reports API Success: 200 [{...}, {...}]
✅ Dashboard data loaded successfully: {totalUsers: X, totalTasks: Y, ...}
```

#### ❌ Error (Red Console Logs):
If you see:
```
❌ Users API Failed: Cannot GET /admin/viewusers
```
Then backend route is missing (but we fixed this!)

#### 🔗 Connection Issues:
```
❌ Cannot reach backend - Check if server is running
```
→ Make sure Backend server is started on port 8000

### 5. Browser Toasts
- ✅ Green toast: "Dashboard data loaded successfully"
- ❌ Red toast: Specific error message (e.g., "Connection timeout")
- ✅ Yellow toast: "Dashboard updated" (on refresh)

### 6. Test Each Component

#### Admin Home Dashboard
- [ ] Loads without errors
- [ ] Shows 5 stat cards with real data
- [ ] Shows Recent Employees section
- [ ] Shows Recent Tasks section
- [ ] Refresh button works and updates data
- [ ] All toast messages appear correctly

#### Specific Endpoint Tests (Using curl in terminal)

```bash
# Test Users API
curl http://localhost:8000/admin/empdatalist

# Test Reports API
curl http://localhost:8000/admin/seereport

# Test Delete User
curl -X DELETE http://localhost:8000/admin/deleteuser/[USER_ID]

# Test Update User
curl -X PUT http://localhost:8000/admin/updateuser/[USER_ID] \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot reach backend" | Start backend: `npm start` in Server folder |
| Blank dashboard | Check console for errors, verify data exists in MongoDB |
| "Connection timeout" | Backend is offline or slow, increase timeout in code |
| "404 endpoint not found" | Route might be wrong, check adminRoute.js |
| Toast not appearing | Check if react-toastify is initialized in main.jsx |

## 📊 Expected Data Structure

### Users Response (empdatalist)
```json
[
  {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "department": "IT",
    "designation": "Developer"
  }
]
```

### Reports Response (seereport)
```json
[
  {
    "_id": "456",
    "message": "Completed Task XYZ",
    "empid": "123",
    "status": "Completed",
    "createdAt": "2024-05-24T10:30:00Z"
  }
]
```

## ✨ After Testing

If everything works:
1. ✅ Dashboard shows real data
2. ✅ All toasts appear correctly
3. ✅ Console shows success logs
4. ✅ Refresh button updates data
5. ✅ No errors in console

You're ready to proceed with more features! 🎉
