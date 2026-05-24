import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, Clock, AlertCircle, TrendingUp, Plus, Eye, Send, RefreshCw, BarChart3 } from 'lucide-react'
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
    inProgressTasks: 0,
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      
      console.log('🔄 Starting dashboard data fetch...')
      console.log('📍 Backend URL:', backendUrl)

      // Fetch users
      const usersApi = `${backendUrl}/admin/empdatalist`
      console.log('📥 Fetching from:', usersApi)
      
      let usersRes
      try {
        usersRes = await axios.get(usersApi, { timeout: 5000 })
        console.log('✅ Users API Success:', usersRes.status, usersRes.data)
      } catch (userError) {
        console.error('❌ Users API Failed:', userError.response?.status, userError.message)
        if (userError.code === 'ECONNABORTED') {
          toast.error('Connection timeout - Backend may be offline')
        } else if (userError.response?.status === 404) {
          toast.error('Users endpoint not found (404)')
        } else if (userError.response?.status === 500) {
          toast.error('Server error (500) - Backend issue')
        } else if (!userError.response) {
          toast.error('Cannot reach backend - Check if server is running')
        } else {
          toast.error(`Users API Error: ${userError.message}`)
        }
        throw userError
      }

      const users = usersRes.data
      if (!Array.isArray(users)) {
        throw new Error('Users data is not an array: ' + JSON.stringify(users))
      }
      setRecentUsers(users.slice(0, 5))

      // Fetch reports for task stats
      const reportsApi = `${backendUrl}/admin/seereport`
      console.log('📥 Fetching from:', reportsApi)
      
      let reportsRes
      try {
        reportsRes = await axios.get(reportsApi, { timeout: 5000 })
        console.log('✅ Reports API Success:', reportsRes.status, reportsRes.data)
      } catch (reportError) {
        console.error('❌ Reports API Failed:', reportError.response?.status, reportError.message)
        if (reportError.code === 'ECONNABORTED') {
          toast.error('Connection timeout on Reports API')
        } else if (reportError.response?.status === 404) {
          toast.error('Reports endpoint not found (404)')
        } else if (reportError.response?.status === 500) {
          toast.error('Server error (500) on Reports API')
        } else if (!reportError.response) {
          toast.error('Cannot reach backend for reports')
        } else {
          toast.error(`Reports API Error: ${reportError.message}`)
        }
        throw reportError
      }

      const reports = reportsRes.data
      if (!Array.isArray(reports)) {
        throw new Error('Reports data is not an array: ' + JSON.stringify(reports))
      }

      const completedCount = reports.filter((r) => r.status === 'Completed').length
      const inProgressCount = reports.filter((r) => r.status === 'In Progress').length
      const pendingCount = reports.filter((r) => r.status === 'Pending' || !r.status).length
      const totalTasks = reports.length

      setStats({
        totalUsers: users.length,
        totalTasks,
        completedTasks: completedCount,
        pendingTasks: pendingCount,
        inProgressTasks: inProgressCount,
      })

      // Set recent tasks (last 3)
      setRecentTasks(reports.slice(0, 3))

      console.log('✅ Dashboard data loaded successfully:', {
        totalUsers: users.length,
        totalTasks: totalTasks,
        completedTasks: completedCount,
        inProgressTasks: inProgressCount,
        pendingTasks: pendingCount,
      })
      
      toast.success('Dashboard data loaded successfully')
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        url: error.config?.url,
      })
      
      // Only show error toast if not already shown by specific error handler
      if (!error.response) {
        toast.error('Failed to connect to backend server')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchDashboardData()
    setIsRefreshing(false)
    toast.success('Dashboard updated')
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={28} />
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{isLoading ? '-' : value}</p>
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
          <h1>Welcome, Admin! 👋</h1>
          <p>Dashboard Overview - Real-time Analytics</p>
        </div>
        <button 
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={20} />
          <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalUsers}
          color="blue"
          trend={`${stats.totalUsers} active`}
        />
        <StatCard
          icon={BarChart3}
          label="Total Tasks"
          value={stats.totalTasks}
          color="purple"
          trend={`${stats.totalTasks} created`}
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
          label="In Progress"
          value={stats.inProgressTasks}
          color="orange"
          trend={`${stats.inProgressTasks} ongoing`}
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Tasks"
          value={stats.pendingTasks}
          color="red"
          trend={`${stats.pendingTasks} pending`}
        />
      </div>

      {/* Data Sections */}
      <div className="data-sections">
        {/* Recent Users Section */}
        <div className="data-card">
          <div className="card-header">
            <h3>Recent Employees</h3>
            <button onClick={() => navigate('viewUsers')} className="view-all-btn">
              View All →
            </button>
          </div>
          {isLoading ? (
            <div className="loading-skeleton">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="data-list">
              {recentUsers.map((user) => (
                <div key={user._id} className="data-item user-item">
                  <div className="item-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <div className="item-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  <span className="item-badge">{user.department || 'N/A'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No employees yet</div>
          )}
        </div>

        {/* Recent Tasks Section */}
        <div className="data-card">
          <div className="card-header">
            <h3>Recent Tasks</h3>
            <button onClick={() => navigate('seeReport')} className="view-all-btn">
              View All →
            </button>
          </div>
          {isLoading ? (
            <div className="loading-skeleton">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : recentTasks.length > 0 ? (
            <div className="data-list">
              {recentTasks.map((task) => (
                <div key={task._id} className="data-item task-item">
                  <div className="item-icon">
                    <BarChart3 size={20} />
                  </div>
                  <div className="item-info">
                    <h4>{task.message?.substring(0, 40) || 'Task'}</h4>
                    <p>Employee: {task.empid || 'N/A'}</p>
                  </div>
                  <span className={`status-badge ${task.status?.toLowerCase().replace(' ', '-')}`}>
                    {task.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No tasks yet</div>
          )}
        </div>
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
          <h3>📊 Performance Summary</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-label">Task Completion Rate</span>
              <span className="overview-value">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%
              </span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Active Employees</span>
              <span className="overview-value">{stats.totalUsers}</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Total Workload</span>
              <span className="overview-value">{stats.totalTasks}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>💡 Quick Tips</h3>
          <ul className="tips-list">
            <li>✓ Monitor task completion rate daily</li>
            <li>✓ Assign tasks fairly across the team</li>
            <li>✓ Review pending tasks regularly</li>
            <li>✓ Provide timely feedback to employees</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
