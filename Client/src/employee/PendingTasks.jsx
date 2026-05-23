import React from 'react'
import { Clock } from 'lucide-react'
import '../css/employee/tasksView.css'

const PendingTasks = () => {
  const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks') || '[]')

  return (
    <div className="tasks-view">
      <div className="view-header">
        <div>
          <h1>Pending Tasks</h1>
          <p>Tasks awaiting your action</p>
        </div>
        <div className="view-count">
          <span className="count-badge pending">{pendingTasks.length}</span>
        </div>
      </div>

      {pendingTasks.length > 0 ? (
        <div className="tasks-list">
          {pendingTasks.map((task) => (
            <div key={task._id} className="task-item pending">
              <div className="task-icon">
                <Clock size={24} />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-footer">
                  <span className="task-duration">{task.duration} days</span>
                  <span className="task-priority">{task.priority} Priority</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-message">
          <Clock size={48} />
          <h2>No pending tasks</h2>
          <p>All your tasks are either completed or in progress!</p>
        </div>
      )}
    </div>
  )
}

export default PendingTasks
