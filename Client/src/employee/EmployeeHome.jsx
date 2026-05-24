import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, Zap, TrendingUp } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../css/employee/empHome.css'

const EmployeeHome = () => {
  const { id } = useParams()
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeDashboard()
  }, [id])

  const fetchEmployeeDashboard = async () => {
    try {
      setIsLoading(true)
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/showtask/${id}`
      const response = await axios.get(api)
      const tasks = response.data

      const completed = tasks.filter((t) => t.status === 'Completed').length
      const pending = tasks.filter((t) => t.status === 'Pending' || !t.status).length
      const inProgress = tasks.filter((t) => t.status === 'In Progress').length

      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        inProgressTasks: inProgress,
      })

      setRecentTasks(tasks.slice(0, 3))
    } catch (error) {
      console.error('Error fetching employee dashboard:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`emp-stat-card ${color}`}>
      <div className="emp-stat-icon">
        <Icon size={28} />
      </div>
      <div className="emp-stat-content">
        <p className="emp-stat-label">{label}</p>
        <p className="emp-stat-value">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="employee-home-container">
      {/* Welcome Header */}
      <div className="emp-welcome-section">
        <div className="emp-welcome-content">
          <h1>Hello, {localStorage.getItem('empname')}! 👋</h1>
          <p>Here's your task summary for today</p>
        </div>
        <div className="emp-welcome-badge">
          <Zap size={20} />
          <span>Employee Dashboard</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="emp-stats-grid">
        <StatCard
          icon={AlertCircle}
          label="Total Tasks"
          value={stats.totalTasks}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgressTasks}
          color="orange"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completedTasks}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending"
          value={stats.pendingTasks}
          color="red"
        />
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Overall Progress</h3>
          <span className="progress-percentage">
            {Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%`,
            }}
          ></div>
        </div>
        <div className="progress-info">
          <span>
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </span>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="recent-tasks-section">
        <h2>Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="recent-tasks-list">
            {recentTasks.map((task) => (
              <div key={task._id} className="recent-task-item">
                <div className="task-title-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
                <div className="task-meta">
                  <span className="task-priority">{task.priority} Priority</span>
                  <span
                    className={`task-status status-${(task.status || 'Pending').toLowerCase().replace(' ', '-')}`}
                  >
                    {task.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-tasks">
            <CheckCircle size={48} />
            <h3>No tasks assigned yet</h3>
            <p>Check back soon for new assignments</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="quick-tips-section">
        <h3>💡 Quick Tips</h3>
        <ul className="tips-list">
          <li>Update your task status regularly to keep the team informed</li>
          <li>Check your pending tasks to stay on schedule</li>
          <li>Contact your admin if you need help with a task</li>
        </ul>
      </div>
    </div>
  )
}

export default EmployeeHome
