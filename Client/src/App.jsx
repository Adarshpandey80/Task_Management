import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Layout from "../Layout"
import AdminDashboard from "./admin/AdminDashboard"
import CreateUser from "./admin/CreateUser"
import AssignTask from "./admin/AssignTask"
import ViewUsers from "./admin/ViewUsers"
import Empdashboard from "./employee/empdashboard"
import Showtask from "./employee/Showtask"
import CompletedTasks from "./employee/CompletedTasks"
import PendingTasks from "./employee/PendingTasks"
import Profile from "./employee/Profile"
import Seereport from "./admin/Seereport"
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
        <Route path="admindashboard" element={<AdminDashboard />}>
          <Route path="createUser" element={<CreateUser/>} />
          <Route path="assignTask" element={<AssignTask/>} />
          <Route path="seeReport" element={<Seereport/>} />
          <Route path="viewUsers" element={<ViewUsers/>} />
        </Route>
        </Routes>


       <Routes>
        <Route path="/empdashboard/:id" element={<Empdashboard/>}>
        <Route index element={<Showtask/>} />
        <Route path="showtask" element={<Showtask/>} />
        <Route path="completedtasks" element={<CompletedTasks/>} />
        <Route path="pendingtasks" element={<PendingTasks/>} />
        <Route path="profile" element={<Profile/>} />
        </Route>
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
