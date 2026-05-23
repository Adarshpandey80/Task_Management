import { useState } from "react";
import "../css/Home.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    
    if(role === "Admin"){
      try {
        const api = `${import.meta.env.VITE_BACKEND_URL}/admin/login`;
        const response = await axios.post( api, { email, password, });
        toast.success(response.data.msg);

        localStorage.setItem("admin" , response.data.admin._id);
        localStorage.setItem("adminemail" , response.data.admin.email);

        navigate("/admindashboard");
      } catch (error) {
        toast.error(error.response?.data?.msg || "Login failed");
      }
    } else {
      try {
        const api = `${import.meta.env.VITE_BACKEND_URL}/employee/login`;
        const response = await axios.post( api, { email, password, });
        toast.success(response.data.msg);
  
        const id = response.data.employee._id
        const name =  response.data.employee.name

        localStorage.setItem("empname" , name);
        localStorage.setItem("empid" , id);
  
        navigate(`/empdashboard/${id}`);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Login failed");
      }
    }
    
    setIsLoading(false);
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>

        <div className="login-content">
          <div className="login-header">
            <div className="login-logo">✓</div>
            <h1>TaskFlow</h1>
            <p>Smart Task Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Login As</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Demo Credentials:</p>
            <div className="demo-info">
              <small>Admin: admin@taskflow.com</small>
              <small>Employee: emp@taskflow.com</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;