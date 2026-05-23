import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AlertCircle, Loader, Flag } from 'lucide-react'
import { toast } from 'react-toastify'
import '../css/employee/showTask.css'

const Showtask = () => {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formInput, setFormInput] = useState({
    status: '',
    completionday: '',
    comment: '',
  })

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/showtask/${id}`
      const response = await axios.get(api)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [id])

  const handleReportClick = (task) => {
    setSelectedTask(task)
    setFormInput({ status: '', completionday: '', comment: '' })
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormInput((prev) => ({ ...prev, [name]: value }))
  }

  const sendReport = async (e) => {
    e.preventDefault()

    if (!formInput.status || !formInput.comment) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/sendreport`
      const response = await axios.post(api, {
        tid: selectedTask._id,
        ...formInput,
      })
      toast.success(response.data)
      setShowModal(false)
      fetchTasks()
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to update task status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10b981'
      case 'in progress':
        return '#f59e0b'
      case 'pending':
      case 'not started':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="showtask-container">
      <div className="showtask-header">
        <div>
          <h1>My Assigned Tasks</h1>
          <p>View and update your task progress</p>
        </div>
        <div className="task-count-badge">{tasks.length} Tasks</div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} />
          <p>Loading your tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="tasks-grid">
          {tasks.map((task, index) => (
            <div key={task._id} className="task-card">
              <div className="task-number">#{index + 1}</div>

              <div className="task-header-info">
                <h3>{task.title}</h3>
                <span
                  className="priority-badge"
                  style={{ background: getStatusColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-meta">
                <div className="meta-item">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{task.duration} days</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span
                    className="status-badge"
                    style={{ color: getStatusColor(task.status) }}
                  >
                    {task.status || 'Pending'}
                  </span>
                </div>
              </div>

              <button
                className="update-btn"
                onClick={() => handleReportClick(task)}
              >
                <Flag size={16} />
                Update Status
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>No tasks assigned yet</h2>
          <p>Your assigned tasks will appear here</p>
        </div>
      )}

      {/* Modal Section */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Task Status</h3>
              <p>{selectedTask?.title}</p>
            </div>

            <form className="premium-form" onSubmit={sendReport}>
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formInput.status}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="completionday">Completion Days</label>
                <input
                  id="completionday"
                  type="number"
                  name="completionday"
                  placeholder="Enter number of days"
                  value={formInput.completionday}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Progress Notes *</label>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="Add progress details or remarks..."
                  rows="4"
                  value={formInput.comment}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                ></textarea>
              </div>

              <div className="modal-actions">
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
                    'Update Task'
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Showtask
