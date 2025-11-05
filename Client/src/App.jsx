import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Layout from "../Layout"
import AdminDashboard from "./admin/AdminDashboard"
import CreateUser from "./admin/CreateUser"
import AssignTask from "./admin/AssignTask"
function App() {
 

  return (
    <>
      <BrowserRouter>
       <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
       </Routes>
           
           <Routes>
               <Route path="admindashboard" element={<AdminDashboard />} />
               <Route path="createUser" element={<CreateUser/>} />
               <Route path="assignTask" element={<AssignTask/>} />
           </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
