import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bell, AlertCircle, Loader, MessageCircle, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'react-toastify'
import '../css/employee/notifications.css'

const Notifications = () => {
  const { id } = JSON.parse(localStorage.getItem('empdata') || '{}')
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)

  useEffect(() => {
    if (id) {
      fetchNotifications()
      fetchUnreadCount()
      // Refresh notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications()
        fetchUnreadCount()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [id])

  const fetchNotifications = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/notifications/${id}`
      const response = await axios.get(api)
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/unreadcount/${id}`
      const response = await axios.get(api)
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/marknotificationread/${notificationId}`
      await axios.put(api)
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      fetchUnreadCount()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    setShowModal(true)
    if (!notification.isRead) {
      handleMarkAsRead(notification._id)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ADMIN_REPLY':
        return <MessageCircle size={20} />
      case 'TASK_ASSIGNED':
        return <AlertCircle size={20} />
      case 'TASK_UPDATED':
        return <CheckCircle size={20} />
      default:
        return <Bell size={20} />
    }
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-content">
          <h2>Notifications</h2>
          <p>Stay updated with admin messages and task updates</p>
        </div>
        {unreadCount > 0 && (
          <div className="unread-badge">
            <span>{unreadCount}</span>
            <p>Unread</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.notificationType)}
              </div>

              <div className="notification-content">
                <div className="notification-header-row">
                  <h3>{notification.title}</h3>
                  {!notification.isRead && <span className="unread-dot"></span>}
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-time">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                  <span className="notification-type">
                    {notification.notificationType === 'ADMIN_REPLY' ? 'Admin Reply' : notification.notificationType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No notifications yet</h3>
          <p>You'll receive notifications when admin replies to your reports</p>
        </div>
      )}

      {/* Notification Detail Modal */}
      {showModal && selectedNotification && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                {getNotificationIcon(selectedNotification.notificationType)}
              </div>
              <h2>{selectedNotification.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="notification-detail">
                <label>Task:</label>
                <p className="task-title">{selectedNotification.taskTitle}</p>
              </div>

              <div className="notification-detail">
                <label>Message from Admin:</label>
                <div className="message-box">
                  <p>{selectedNotification.message}</p>
                  <span className="message-time">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedNotification.relatedData?.taskStatus && (
                <div className="notification-detail">
                  <label>Task Status:</label>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor:
                        selectedNotification.relatedData.taskStatus === 'Completed'
                          ? '#10b981'
                          : selectedNotification.relatedData.taskStatus === 'In Progress'
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  >
                    {selectedNotification.relatedData.taskStatus}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
