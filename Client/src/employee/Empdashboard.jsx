import React, { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { Menu, X, CheckCircle, Clock, User, Bell } from "lucide-react"
import "../css/employee/empDashboard.css"

const Empdashboard = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="emp-layout">
      {/* Sidebar */}
      <aside className={`emp-sidebar ${isOpen ? "" : "closed"}`}>
        <div className="emp-sidebar-header">
          <h2 className="emp-logo">{isOpen ? "Employee" : "E"}</h2>
          <button
            className="emp-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="emp-links">
          <Link to="showtask">
            <CheckCircle size={20} />
            <span>My Tasks</span>
          </Link>
          <Link to="completedtasks">
            <CheckCircle size={20} />
            <span>Completed</span>
          </Link>
          <Link to="pendingtasks">
            <Clock size={20} />
            <span>Pending</span>
          </Link>
          <Link to="notifications">
            <Bell size={20} />
            <span>Notifications</span>
          </Link>
          <Link to="profile">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="emp-content">
        {/* Floating Toggle Button */}
        {!isOpen && (
          <button className="emp-floating-toggle-btn" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        )}
        
        <header className="emp-topbar">
          <h1>Welcome, {localStorage.getItem("empname")}</h1>
        </header>

        <div className="emp-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Empdashboard
