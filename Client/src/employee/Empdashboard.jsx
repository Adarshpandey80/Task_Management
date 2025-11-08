import React from 'react'
import { Link ,Outlet} from 'react-router-dom'


const Empdashboard = () => {
  return (
    <>
    <div>
        <h1>Employee dashboard</h1>
    </div>
    <div>
        <div>
          <Link to="showtask"> My Task</Link>
        </div>
        <div>
            <Outlet/>
        </div>
    </div>
    </>
    
    
  )
}

export default Empdashboard