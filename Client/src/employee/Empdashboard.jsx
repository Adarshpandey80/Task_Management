import React, { useState, useEffect } from "react"
import { Link, Outlet } from "react-router-dom"
import { Menu, X, CheckCircle, Clock, User, Bell } from "lucide-react"
import axios from "axios"
import "../css/employee/empDashboard.css"

const Empdashboard = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const empid = localStorage.getItem('empid')

  useEffect(() => {
    if (empid) {
      fetchUnreadCount()
      // Refresh unread count every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000)
      return () => clearInterval(interval)
    }
  }, [empid])

  const fetchUnreadCount = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/unreadcount/${empid}`
      const response = await axios.get(api)
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

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
          <Link to="notifications" className="notifications-link">
            <div className="notifications-icon-wrapper">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
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
