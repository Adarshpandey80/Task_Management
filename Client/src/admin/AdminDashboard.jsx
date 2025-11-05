import React from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import "../css/admin/layout.css"
const AdminDashboard = () => {
  return (
    <>
        <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Task Manager</h2>

        <nav className="sidebar-links">
               <Link to="/createUser"> Create User</Link> 
                <Link to="/assignTask"> Assign Task</Link>
                <Link to="/viewTasks"> View Tasks</Link>
                <Link to="/viewUsers"> View Users</Link>
                <Link to="/updateTaskStatus"> Update Task Status</Link>
        </nav>
      </aside>

      {/* Content area */}
      <main className="content-area">
        <Outlet />
      </main>
    </div>
    </>
  )
}

export default AdminDashboard