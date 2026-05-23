import React, { useState, useEffect } from 'react'
import { Search, Trash2, Edit2, AlertCircle, Loader, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../css/admin/viewUsers.css'

const ViewUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
  })

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/viewusers`
      const response = await axios.get(api)
      setUsers(response.data)
      setFilteredUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    )
    setFilteredUsers(results)
  }, [searchTerm, users])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/deleteuser/${userId}`
      await axios.delete(api)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required')
      return
    }

    try {
      setIsSubmitting(true)
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/updateuser/${selectedUser._id}`
      await axios.put(api, formData)
      toast.success('User updated successfully')
      setShowModal(false)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="viewusers-container">
      <div className="viewusers-header">
        <div>
          <h1>Manage Users</h1>
          <p>View, edit, and manage all employees</p>
        </div>
        <div className="user-stats">{filteredUsers.length} Employees</div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} />
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.department || 'N/A'}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(user)}
                      title="Edit user"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(user._id)}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
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
          <h2>No users found</h2>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'No employees added yet'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <p>Update user information</p>
            </div>

            <form className="premium-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department"
                  className="form-input"
                />
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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

export default ViewUsers
