import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {
  Search,
  AlertCircle,
  Loader,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  RefreshCw,
  Edit,
} from 'lucide-react'
import { toast } from 'react-toastify'
import '../css/admin/updateTaskStatus.css'

const UpdateTaskStatus = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const taskStatuses = ['Pending', 'In Progress', 'Completed', 'On Hold']

  // Fetch all tasks
  useEffect(() => {
    fetchAllTasks()
  }, [])

  // Apply filters whenever search term or status filter changes
  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, tasks])

  const fetchAllTasks = async () => {
    setIsLoading(true)
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/alltasks`
      const response = await axios.get(api)
      setTasks(response.data)
      applyFilters()
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = tasks

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.empid?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleEditClick = (task) => {
    setSelectedTask(task)
    setNewStatus(task.status || 'Pending')
    setShowModal(true)
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()

    if (!newStatus) {
      toast.error('Please select a status')
      return
    }

    setIsSubmitting(true)
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/updatetaskstatus/${selectedTask._id}`
      const response = await axios.put(api, { status: newStatus })
      
      toast.success('Task status updated successfully')
      setShowModal(false)
      
      // Update local state
      setTasks(tasks.map(task => 
        task._id === selectedTask._id ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error(error.response?.data?.msg || 'Failed to update task status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAllTasks()
    setIsRefreshing(false)
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={18} className="status-icon completed" />
      case 'in progress':
        return <Zap size={18} className="status-icon in-progress" />
      case 'on hold':
        return <Clock size={18} className="status-icon on-hold" />
      default:
        return <AlertCircle size={18} className="status-icon pending" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10b981'
      case 'in progress':
        return '#f59e0b'
      case 'on hold':
        return '#8b5cf6'
      default:
        return '#ef4444'
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
  }

  return (
    <div className="update-task-status-container">
      {/* Header */}
      <div className="status-header">
        <div>
          <h1>Update Task Status</h1>
          <p>Monitor and update the status of assigned tasks</p>
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

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by task title, description, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="tasks-table-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Description</th>
                <th>Employee ID</th>
                <th>Priority</th>
                <th>Current Status</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="task-row">
                  <td>
                    <span className="task-title">{task.title || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="task-desc">
                      {(task.description || '').substring(0, 40)}
                      {(task.description || '').length > 40 ? '...' : ''}
                    </span>
                  </td>
                  <td>
                    <span className="emp-id">{task.empid || 'N/A'}</span>
                  </td>
                  <td>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: task.priority === 'High' ? '#ef4444' : 
                                         task.priority === 'Medium' ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {task.priority || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ borderLeftColor: getStatusColor(task.status) }}
                    >
                      {getStatusIcon(task.status)}
                      {task.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className="duration">{task.duration || 0} days</span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(task)}
                      title="Update task status"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>No tasks found</h2>
          <p>
            {searchTerm || statusFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'No tasks have been assigned yet'}
          </p>
        </div>
      )}

      {/* Status Update Modal */}
      {showModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Task Status</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="update-form">
              <div className="form-section">
                <label>Task Details</label>
                <div className="task-details-read">
                  <div className="detail-row">
                    <span className="label">Title:</span>
                    <span className="value">{selectedTask.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Employee ID:</span>
                    <span className="value">{selectedTask.empid}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Priority:</span>
                    <span className="value">{selectedTask.priority}</span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <label htmlFor="status">New Status *</label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                  required
                >
                  <option value="">Select a status</option>
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="spinner" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateTaskStatus
