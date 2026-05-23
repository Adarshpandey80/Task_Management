import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/admin/seereport.css";
import { Search, Filter, Loader, AlertCircle, Download } from 'lucide-react'
import { toast } from 'react-toastify'

function Seereport() {
  const [seereport, setSeereport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReport(filtered);
  }, [searchTerm, statusFilter, seereport]);

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Employee ID', 'Message', 'Completion Day', 'Status'],
      ...filteredReport.map(item => [
        item._id,
        item.comment,
        item.completionday,
        item.status
      ])
    ];
    
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-report-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1>Task Reports</h1>
          <p>Monitor and track all task completion statuses.</p>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Total Tasks</span>
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
            placeholder="Search by Employee ID or message..."
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
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Message</th>
                <th>Completion Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map((item, index) => (
                <tr key={item._id || index}>
                  <td>
                    <code className="emp-id">{item._id}</code>
                  </td>
                  <td className="message-cell">{item.comment}</td>
                  <td>{new Date(item.completionday).toLocaleDateString()}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <p>Showing {filteredReport.length} of {seereport.length} reports</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Seereport;
