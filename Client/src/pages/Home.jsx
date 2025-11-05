import { useState } from "react";
import "../css/Home.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
 import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "role") {
      setRole(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   if(role === "Admin"){
    try {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/login`;
      const response = await axios.post( api, { email, password, });
      toast.success(response.data.msg);

      localStorage.setItem("admin" , response.data.admin._id);
      localStorage.setItem("adminemail" , response.data.admin.email);

      navigate("/admindashboard");

    } catch (error) {
      toast.error(error.response.data.msg);
    }
   } else {
    toast.error("Please select a valid role");
   }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Task Manager Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={role}
            onChange={handleChange}
          >
               <option value="" disabled>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Home;