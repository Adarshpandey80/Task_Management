import React from 'react'
import "../css/admin/createUser.css"
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
const CreateUser = () => {

  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [role , setRole] = useState("");


  const handlchange = (e)=>{
      const {name ,value} = e.target;
        if(name === "name"){
            setName(value);
        }else if(name === "email"){
            setEmail(value);
        }else if(name === "role"){
            setRole(value);
        }
  }

 

  const handlsubmit = async (e)=>{
        e.preventDefault();
        try {
             const api = `${import.meta.env.VITE_BACKEND_URL}/admin/createuser`;
        const data = {name , email , role};
        const response = await axios.post(api ,data);
         toast.success(response.data.msg)
        } catch (error) {
              toast.error(response.data.msg)
        }
        
  }
  
   

    return (
        <>
            <div className="user-form-container">
                <div className="user-form-box">
                    <h2 className='heading'>Create User</h2>

                    <form className="user-form" >

                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            required
                            onChange={handlchange}
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            onChange={handlchange}
                        />
                        <label>Designation</label>
                        <select name="role" required onChange={handlchange}>
                            <option value="" >Select Designation</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Programmer">Developer</option>
                            <option value="Coder">Coder</option>
                            <option value="Designer">Designer</option>
                            <option value="Data Base Designer">Data Base Designer</option>
                        </select>

                        <button type="submit" className='submit_btn' onClick={handlsubmit}>Create User</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateUser