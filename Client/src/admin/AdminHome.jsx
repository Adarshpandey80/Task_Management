import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, Clock, AlertCircle, TrendingUp, Plus, Eye, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../css/admin/adminHome.css'

const AdminHome = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      // Fetch users count
      const usersApi = `${import.meta.env.VITE_BACKEND_URL}/admin/viewusers`
      const usersRes = await axios.get(usersApi)
      const totalUsers = usersRes.data.length

      // Fetch reports for task stats
      const reportsApi = `${import.meta.env.VITE_BACKEND_URL}/admin/seereport`
      const reportsRes = await axios.get(reportsApi)
      const reports = reportsRes.data

      const completedCount = reports.filter((r) => r.status === 'Completed').length
      const pendingCount = reports.filter((r) => r.status === 'Pending').length
      const totalTasks = reports.length

      setStats({
        totalUsers,
        totalTasks,
        completedTasks: completedCount,
        pendingTasks: pendingCount,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={28} />
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {trend && <p className="stat-trend">{trend}</p>}
      </div>
    </div>
  )

  const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
    <button className={`quick-action-btn ${color}`} onClick={onClick}>
      <Icon size={24} />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="admin-home-container">
      {/* Welcome Header */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome, Admin!</h1>
          <p>Manage your tasks and team efficiently</p>
        </div>
        <div className="welcome-badge">
          <TrendingUp size={20} />
          <span>Dashboard</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalUsers}
          color="blue"
          trend="Active users"
        />
        <StatCard
          icon={AlertCircle}
          label="Total Tasks"
          value={stats.totalTasks}
          color="purple"
          trend="All tasks"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed Tasks"
          value={stats.completedTasks}
          color="green"
          trend={`${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}% complete`}
        />
        <StatCard
          icon={Clock}
          label="Pending Tasks"
          value={stats.pendingTasks}
          color="orange"
          trend="Awaiting action"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionButton
            icon={Plus}
            label="Create User"
            onClick={() => navigate('createUser')}
            color="blue"
          />
          <QuickActionButton
            icon={Send}
            label="Assign Task"
            onClick={() => navigate('assignTask')}
            color="purple"
          />
          <QuickActionButton
            icon={Eye}
            label="View Reports"
            onClick={() => navigate('seeReport')}
            color="green"
          />
          <QuickActionButton
            icon={Users}
            label="Manage Users"
            onClick={() => navigate('viewUsers')}
            color="orange"
          />
        </div>
      </div>

      {/* Overview Section */}
      <div className="overview-section">
        <div className="overview-card">
          <h3>System Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-label">Active Employees</span>
              <span className="overview-value">{stats.totalUsers}</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Tasks Created</span>
              <span className="overview-value">{stats.totalTasks}</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Completion Rate</span>
              <span className="overview-value">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Quick Tips</h3>
          <ul className="tips-list">
            <li>✓ Use quick actions to speed up workflow</li>
            <li>✓ Monitor task completion rate regularly</li>
            <li>✓ View reports to track team performance</li>
            <li>✓ Assign tasks fairly across the team</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
