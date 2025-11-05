import React from 'react'
import "../css/admin/createUser.css"
const CreateUser = () => {
    return (
        <>
            <div className="user-form-container">
                <div className="user-form-box">
                    <h2 className='heading'>Create User</h2>
                    <form className="user-form">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            required
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                        />
                       
                        <button type="submit" className='submit_btn'>Create User</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateUser