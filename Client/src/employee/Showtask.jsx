import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/employee/showTask.css";
import { toast } from "react-toastify";

const Showtask = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask , setSelectedTask]  = useState(null)
  const [tid, setTid] = useState("");
  const [input , setInput] = useState({});



  const fetchTasks = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/employee/showtask/${id}`;
      const response = await axios.get(api);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open report modal
  const handleReportClick = (task) => {
    setSelectedTask(task)
    setTid(task._id);
    setShowModal(true);
  };



  const handlchange =(e)=>{
       const { name , value} = e.target 
       setInput((prev)=>({
        ...prev , [name] : value 
       }))
  }
  

  const sendReport = async (e)=>{
    e.preventDefault();
     
    try {
       const api = `${import.meta.env.VITE_BACKEND_URL}/employee/sendreport`;
       const response = await axios.post(api , {tid , ...input})
       toast.success(response.data)
     
    } catch (error) {
       console.log(error)
    }

  }


  return (
    <div className="task-container">
      <h2 className="task-title">My Assigned Tasks</h2>

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.duration}</td>
                  <td>
                    <span
                      className={`priority-badge ${task.priority?.toLowerCase() || "low"
                        }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${task.status?.toLowerCase().replace(" ", "-") || "pending"
                        }`}
                    >
                      {task.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="report-btn"
                      onClick={() => handleReportClick(task)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-task">
                  No tasks assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Status: {selectedTask?.title}</h3>
            <form className="report-form">
              <label>Status</label>
              <select name="status" required onChange={handlchange} >
                <option value="">Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <label>Duration</label>
              <input
                name="completionday"
                placeholder=" Enter duration in digit "
                rows="4"
                onChange={handlchange}
              ></input>

              <label>Message / Progress Note</label>
              <textarea
                name="comment"
                placeholder="Add progress details or remarks..."
                rows="4"
                onChange={handlchange}
              ></textarea>

              <div className="modal-actions">
                <button type="submit" className="submit-report-btn"  onClick= {sendReport}>
                 
                  Update Task
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

export default Showtask;
