import { useState } from "react";
import "../css/Home.css";
import axios from "axios";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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
    try {
       if (role == "Admin") {
      const api = `${import.meta.env.VITE_BACKEND_URL}/admin/login`;
      const response = await axios.post(api, {email,password});
      console.log(response.data);
    } else {
      alert("Employee Login");
    }
    } catch (error) {
      console.error("Error during login:", error);
    }
   
    console.log({ email, password, role });

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