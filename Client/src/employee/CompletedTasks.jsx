import React from 'react'
import { CheckCircle } from 'lucide-react'
import '../css/employee/tasksView.css'

const CompletedTasks = () => {
  const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]')

  return (
    <div className="tasks-view">
      <div className="view-header">
        <div>
          <h1>Completed Tasks</h1>
          <p>Tasks you've successfully completed</p>
        </div>
        <div className="view-count">
          <span className="count-badge">{completedTasks.length}</span>
        </div>
      </div>

      {completedTasks.length > 0 ? (
        <div className="tasks-list">
          {completedTasks.map((task) => (
            <div key={task._id} className="task-item completed">
              <div className="task-icon">
                <CheckCircle size={24} />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-footer">
                  <span className="task-duration">{task.duration} days</span>
                  <span className="task-priority" style={{ color: '#10b981' }}>✓ Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-message">
          <CheckCircle size={48} />
          <h2>No completed tasks yet</h2>
          <p>Start completing tasks to see them here</p>
        </div>
      )}
    </div>
  )
}

export default CompletedTasks
