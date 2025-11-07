// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import "../css/admin/layout.css"
// const AdminDashboard = () => {
//   return (
//     <>
//         <div className="layout-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="logo">Task Manager</h2>

//         <nav className="sidebar-links">
//                <Link to="createUser"> Create User</Link> 
//                 <Link to="assignTask"> Assign Task</Link>
//                 <Link to="viewTasks"> View Tasks</Link>
//                 <Link to="viewUsers"> View Users</Link>
//                 <Link to="updateTaskStatus"> Update Task Status</Link>
//         </nav>
//       </aside>

//       {/* Content area */}
//       <main className="content-area">
//         <Outlet />
//       </main>
//     </div>
//     </>
//   )
// }

// export default AdminDashboard







import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // modern icons
import "../css/admin/layout.css";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="logo">{isOpen ? "Task Manager" : "TM"}</h2>
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="sidebar-links">
          <Link to="createUser">Create User</Link>
          <Link to="assignTask">Assign Task</Link>
          <Link to="viewTasks">View Tasks</Link>
          <Link to="viewUsers">View Users</Link>
          <Link to="updateTaskStatus">Update Task Status</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
