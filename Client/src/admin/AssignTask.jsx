import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/admin/assignTask.css";
import { toast } from 'react-toastify'

const AssignTask = () => {
  const [empdata, setEmpdata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empid ,setEmpid] = useState("");
  const [task, setTask] = useState({
    title: "",
    description: "",
    duration: "",
    priority: "",
    empid: ""
  });


  // Fetch employee data
  const fetchData = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/empdatalist`;
      const response = await axios.get(api);
      setEmpdata(response.data);
    } catch (error) {
      console.log("Error fetching employee data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
     console.log(task)
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/assigntask`;
   const finalTask = { ...task, empid: empid };
    const response =    await axios.post(api, finalTask);
    console.log(response.data)
      toast.success(`Task assigned to ${selectedEmp.name}`)
      setShowModal(false);
    } catch (error) {
      console.log("Error assigning task:", error);
      toast.error("Failed to assign task. Try again.")
    }
  };

  return (
    <div className="assign-task-container">
      <div className="assign-task-header">
        <h1>All Employees</h1>
        <p>Assign tasks easily to your team members.</p>
      </div>

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
            {empdata.map((emp, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>
                  <button
                    className="assign-btn"
                    onClick={() => handleAssignClick(emp)}
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal Form --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Assign Task to {selectedEmp?.name}</h2>
            <form onSubmit={handleSubmit} className="task-form">
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />

              <label>Task Description</label>
              <textarea
              name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="3"
                required
              ></textarea>

              <label>Duration (in days)</label>
              <input
                type="number"
                name="duration"
                value={task.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                required
              />

              <label>Priority</label>
              <select
              name="priority"
                value={task.priority}
                 onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Assign Task
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
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
