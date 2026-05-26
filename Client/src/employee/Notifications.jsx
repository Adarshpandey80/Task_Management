import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bell, AlertCircle, Loader, MessageCircle, CheckCircle, Clock, RefreshCw, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import '../css/employee/notifications.css'

const Notifications = () => {
  const empid = localStorage.getItem('empid')
  const empName = localStorage.getItem('empname') || 'Employee'
  
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    if (empid) {
      fetchNotifications()
      fetchUnreadCount()
      // Refresh notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications()
        fetchUnreadCount()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [empid])

  const fetchNotifications = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/notifications/${empid}`
      const response = await axios.get(api)
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/unreadcount/${empid}`
      const response = await axios.get(api)
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([fetchNotifications(), fetchUnreadCount()])
      toast.success('Notifications refreshed')
    } catch (error) {
      toast.error('Failed to refresh notifications')
    } finally {
      setIsRefreshing(false)
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
    setReplyMessage('')
    if (!notification.isRead) {
      handleMarkAsRead(notification._id)
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Reply message cannot be empty')
      return
    }

    setIsReplying(true)
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/replytonotification/${selectedNotification._id}`
      const response = await axios.post(api, {
        message: replyMessage,
        empName: empName
      })

      toast.success('Reply sent to admin successfully!')
      setReplyMessage('')

      // Update the selected notification with the new reply
      const updatedNotification = response.data.notification
      setSelectedNotification(updatedNotification)

      // Update the notifications list
      setNotifications(
        notifications.map((notif) =>
          notif._id === selectedNotification._id ? updatedNotification : notif
        )
      )
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    } finally {
      setIsReplying(false)
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
        <div className="header-actions">
          <button
            className="btn-refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh notifications"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinner' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          {unreadCount > 0 && (
            <div className="unread-badge">
              <span>{unreadCount}</span>
              <p>Unread</p>
            </div>
          )}
        </div>
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
                
                {/* Simple Message Indicator */}
                <div className="notification-message-indicator">
                  <MessageCircle size={16} />
                  <span>Admin Message</span>
                </div>
                
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
              <div className="modal-header-content">
                <h2>{selectedNotification.title}</h2>
                <p className="modal-subtitle">Task Communication & Updates</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Task Information Section */}
              <div className="detail-section task-section">
                <h3>Task Information</h3>
                <div className="detail-row">
                  <span className="label">Task Title:</span>
                  <span className="value task-title">{selectedNotification.taskTitle}</span>
                </div>
              </div>

              {/* Conversation Thread - Prominent */}
              <div className="detail-section conversation-section">
                <h3>Message Thread</h3>
                <div className="conversation-thread">
                  {/* Admin Initial Message */}
                  <div className="message admin-message">
                    <div className="message-sender">💬 Admin Message</div>
                    <div className="message-content">
                      <p>{selectedNotification.message || 'No message content'}</p>
                      <span className="message-timestamp">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Employee and Admin Replies */}
                  {selectedNotification.replies && selectedNotification.replies.length > 0 && (
                    <>
                      {selectedNotification.replies.map((reply, index) => (
                        <div
                          key={index}
                          className={`message ${reply.sender === 'admin' ? 'admin-message' : 'employee-message'}`}
                        >
                          <div className="message-sender">
                            {reply.sender === 'admin' ? '💬 Admin Reply' : '👤 Your Reply'}
                          </div>
                          <div className="message-content">
                            <p>{reply.message}</p>
                            <span className="message-timestamp">
                              {new Date(reply.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Reply Section */}
              <div className="detail-section reply-section">
                <h3>Send Your Reply</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to admin..."
                  className="reply-textarea"
                  rows="3"
                  disabled={isReplying}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                disabled={isReplying}
              >
                Close
              </button>
              <button
                className="btn-send-reply"
                onClick={handleSendReply}
                disabled={isReplying || !replyMessage.trim()}
              >
                {isReplying ? (
                  <>
                    <Loader size={16} className="spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
