import React, { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import '../css/header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = localStorage.getItem('admin')
  const empId = localStorage.getItem('empname')

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="header-logo">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <a href="/">Home</a>
          {isAdmin && <a href="/admindashboard">Dashboard</a>}
          {empId && <a href={`/empdashboard/${localStorage.getItem('empid')}`}>Dashboard</a>}
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-actions">
          {(isAdmin || empId) && (
            <div className="user-menu">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

export default Header