import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/admin/seereport.css";
import { Search, Filter, Loader, AlertCircle, Download, MessageCircle, Send } from 'lucide-react'
import { toast } from 'react-toastify'

function Seereport() {
  const [seereport, setSeereport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  const fetchtaskreport = async () => {
    setIsLoading(true);
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/seereport`;
      const response = await axios.get(api);
      setSeereport(response.data);
      setFilteredReport(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchtaskreport();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = seereport;

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.empid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReport(filtered);
  }, [searchTerm, statusFilter, seereport]);

  // Fetch report details
  const handleViewDetails = async (report) => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/reportdetail/${report._id}`;
      const response = await axios.get(api);
      setSelectedReport(report);
      setReportDetails(response.data);
      setReplyMessage("");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast.error("Failed to load report details");
    }
  };

  // Send reply to employee
  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty");
      return;
    }

    setIsReplying(true);
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/replyreport/${selectedReport._id}`;
      const response = await axios.post(api, { message: replyMessage });
      
      toast.success("Reply sent to employee successfully");
      setReplyMessage("");
      
      // Update local state
      setSeereport(seereport.map(report => 
        report._id === selectedReport._id 
          ? { ...report, adminReply: response.data.task.adminReply }
          : report
      ));
      
      // Update details view
      setReportDetails(prev => ({
        ...prev,
        report: response.data.task
      }));
      
      setSelectedReport(response.data.task);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(error.response?.data?.msg || "Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Employee Name', 'Employee Email', 'Task Title', 'Message', 'Status', 'Completion Day'],
      ...filteredReport.map(item => [
        item.empName || 'N/A',
        item.empEmail || 'N/A',
        item.title || 'N/A',
        item.comment || '',
        item.status || 'N/A',
        new Date(item.reportSentAt).toLocaleDateString() || 'N/A'
      ])
    ];
    
    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-reports-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Report exported successfully");
  };

  // Statistics
  const stats = {
    total: seereport.length,
    completed: seereport.filter(item => item.status === "Completed").length,
    inProgress: seereport.filter(item => item.status === "In Progress").length,
    pending: seereport.filter(item => item.status === "Pending").length,
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h1>Employee Task Reports</h1>
          <p>View employee progress and send feedback on their tasks</p>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-box total">
          <span className="stat-label">Total Reports</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-box completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-box inprogress">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-box pending">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by employee name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-wrapper">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Loading reports...</p>
        </div>
      ) : filteredReport.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>No reports found</h2>
          <p>{searchTerm || statusFilter !== "All" ? "Try adjusting your filters" : "No task reports available yet"}</p>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReport.map((item) => (
            <div key={item._id} className="report-card">
              <div className="report-card-header">
                <div className="employee-info">
                  <h3>{item.empName || 'Unknown Employee'}</h3>
                  <p>{item.empEmail || item.empid}</p>
                </div>
                <span
                  className={`status-badge ${
                    item.status === "Completed"
                      ? "status-completed"
                      : item.status === "In Progress"
                      ? "status-progress"
                      : "status-pending"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="report-card-body">
                <div className="report-field">
                  <label>Task:</label>
                  <p className="task-title">{item.title || 'N/A'}</p>
                </div>
                <div className="report-field">
                  <label>Employee Message:</label>
                  <p className="message">{item.comment}</p>
                </div>
                <div className="report-meta">
                  <span className="meta-item">
                    <strong>Days Taken:</strong> {item.completionday || 'N/A'}
                  </span>
                  <span className="meta-item">
                    <strong>Reported:</strong> {item.reportSentAt ? new Date(item.reportSentAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {item.adminReply && (
                  <div className="admin-reply-preview">
                    <MessageCircle size={16} />
                    <span>You replied to this report</span>
                  </div>
                )}
              </div>

              <div className="report-card-footer">
                <button
                  className="btn-view-details"
                  onClick={() => handleViewDetails(item)}
                >
                  <MessageCircle size={16} />
                  View & Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedReport && reportDetails && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Task Report Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Employee Info */}
              <div className="detail-section">
                <h3>Employee Information</h3>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedReport.empName || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedReport.empEmail || 'N/A'}</span>
                </div>
              </div>

              {/* Task Info */}
              <div className="detail-section">
                <h3>Task Information</h3>
                <div className="detail-row">
                  <span className="label">Title:</span>
                  <span className="value">{selectedReport.title}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Priority:</span>
                  <span className="value">{selectedReport.priority}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: selectedReport.status === 'Completed' ? '#10b981' : 
                                       selectedReport.status === 'In Progress' ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Employee Message */}
              <div className="detail-section">
                <h3>Employee's Progress Report</h3>
                <div className="message-box">
                  <p>{selectedReport.comment}</p>
                  <span className="message-meta">
                    Completion Days: {selectedReport.completionday} | Reported: {new Date(selectedReport.reportSentAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Admin Reply */}
              {selectedReport.adminReply && (
                <div className="detail-section admin-reply-section">
                  <h3>Your Reply to Employee</h3>
                  <div className="admin-message-box">
                    <p>{selectedReport.adminReply.message}</p>
                    <span className="message-meta">
                      Sent: {new Date(selectedReport.adminReply.sentAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Reply Input */}
              <div className="detail-section reply-section">
                <h3>Send Reply to Employee</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your feedback or instructions for the employee..."
                  className="reply-textarea"
                  rows="4"
                  disabled={isReplying}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
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
  );
}

export default Seereport;
