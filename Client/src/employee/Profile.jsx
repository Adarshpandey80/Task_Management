import React from 'react'
import { User, Mail, Briefcase, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../css/employee/tasksView.css'

const Profile = () => {
  const navigate = useNavigate()
  const empName = localStorage.getItem('empname')
  const empEmail = localStorage.getItem('adminemail')

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <User size={48} />
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>
              <User size={18} />
              Employee Name
            </label>
            <p>{empName || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>
              <Mail size={18} />
              Email Address
            </label>
            <p>{empEmail || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>
              <Briefcase size={18} />
              Role
            </label>
            <p>Employee</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
