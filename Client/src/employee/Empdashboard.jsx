import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/employee/empDashboard.css";

const Empdashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="emp-layout">
      {/* Sidebar */}
      <aside className={`emp-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="emp-sidebar-header">
          <h2 className="emp-logo">{isOpen ? "Employee" : "E"}</h2>
          <button
            className="emp-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "❮" : "❯"}
          </button>
        </div>

        <nav className="emp-links">
          <Link to="showtask">
            <i className="fa-solid fa-list-check"></i>
            <span>My Tasks</span>
          </Link>
          <Link to="completedtasks">
            <i className="fa-solid fa-circle-check"></i>
            <span>Completed Tasks</span>
          </Link>
          <Link to="pendingtasks">
            <i className="fa-solid fa-hourglass-half"></i>
            <span>Pending Tasks</span>
          </Link>
          <Link to="profile">
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`emp-content ${isOpen ? "" : "full"}`}>
        <header className="emp-topbar">
          <h1>Employee Dashboard</h1>
        </header>

        <div className="emp-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Empdashboard;
