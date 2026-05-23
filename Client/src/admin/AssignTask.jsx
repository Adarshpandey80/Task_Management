import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/admin/assignTask.css";
import { toast } from 'react-toastify'
import { Search, AlertCircle, Loader, Plus } from 'lucide-react'

const AssignTask = () => {
  const [empdata, setEmpdata] = useState([]);
  const [filteredEmp, setFilteredEmp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empid ,setEmpid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    duration: "",
    priority: "Medium",
    empid: ""
  });

  // Fetch employee data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/empdatalist`;
      const response = await axios.get(api);
      setEmpdata(response.data);
      setFilteredEmp(response.data);
    } catch (error) {
      console.log("Error fetching employee data", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = empdata.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmp(filtered);
  }, [searchTerm, empdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle opening the modal
  const handleAssignClick = (emp) => {
    setSelectedEmp(emp);
    setEmpid(emp._id)
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task.title || !task.description || !task.duration) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/assigntask`;
      const finalTask = { ...task, empid: empid };
      const response = await axios.post(api, finalTask);
      toast.success(`Task assigned to ${selectedEmp.name}`);
      setShowModal(false);
      setTask({ title: "", description: "", duration: "", priority: "Medium", empid: "" });
    } catch (error) {
      console.log("Error assigning task:", error);
      toast.error(error.response?.data?.msg || "Failed to assign task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assign-task-container">
      <div className="assign-task-header">
        <div>
          <h1>Assign Tasks</h1>
          <p>Distribute work efficiently to your team members.</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Total Employees</span>
            <span className="stat-value">{empdata.length}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {searchTerm && <p className="search-results-info">Showing {filteredEmp.length} result(s)</p>}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Loading employees...</p>
        </div>
      ) : filteredEmp.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>{searchTerm ? "No employees found" : "No employees available"}</h2>
          <p>{searchTerm ? "Try adjusting your search criteria" : "Create users first to assign tasks"}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmp.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="emp-name">
                      <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
                      <span>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>
                    <span className="designation-badge">{emp.designation}</span>
                  </td>
                  <td>
                    <button
                      className="assign-btn"
                      onClick={() => handleAssignClick(emp)}
                    >
                      <Plus size={16} />
                      Assign Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Assign Task to <strong>{selectedEmp?.name}</strong></h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Task Title *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="e.g., Design Homepage UI"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    placeholder="Describe the task in detail..."
                    rows="4"
                    className="form-input"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="duration">Duration (days) *</label>
                    <input
                      id="duration"
                      type="number"
                      name="duration"
                      value={task.duration}
                      onChange={handleChange}
                      placeholder="5"
                      className="form-input"
                      required
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority *</label>
                    <select
                      id="priority"
                      name="priority"
                      value={task.priority}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
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
                      Assigning...
                    </>
                  ) : (
                    "Assign Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTask;
