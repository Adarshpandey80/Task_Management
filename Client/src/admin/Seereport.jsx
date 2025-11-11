import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/admin/seereport.css";

function Seereport() {
  const [seereport, setSeereport] = useState([]);

  const fetchtaskreport = async () => {
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/seereport`;
      const response = await axios.get(api);
      setSeereport(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchtaskreport();
  }, []);

  const report = seereport.map((key, index) => (
    <tr key={index}>
      <td>{key._id}</td>
      <td>{key.comment}</td>
      <td>{key.completionday}</td>
      <td>
        <span
          className={`status-badge ${
            key.status === "Completed"
              ? "status-completed"
              : key.status === "In Progress"
              ? "status-progress"
              : "status-pending"
          }`}
        >
          {key.status}
        </span>
      </td>
    </tr>
  ));

  return (
    <div className="report-container">
      <h1>Task Reports</h1>
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Message</th>
              <th>Completion Day</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{report}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Seereport;
