import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Showtask = () => {
    const { id } = useParams();
    const [tasks , setTasks ] = useState([]);
    console.log(id)

    const Showtask = async () => {

        try {
            const api = `${import.meta.env.VITE_BACKEND_URL}/employee/showtask/${id}`;
            const response = await axios.get(api)
            setTasks(response.data)
        } catch (error) {
            console.log("error in task fatching" , error)
        }

    }

    useEffect(()=>{
        Showtask();
    } , [])
     
    let sn =0 ;
    const emptasks = tasks.map((key)=>{
        sn++;
          return (
            <>
            <tr>
                <td>{sn}</td>
                <td>{key.title}</td>
                <td>{key.description}</td>
                <td>{key.duration}</td>
                <td>{key.priority}</td>
            </tr>
            </>
          )
    })


    return (
        <>
           <table>
            <thead>
                    <tr>
                        <th>sn</th>
                        <th>tasktitle</th>
                        <th>describtion</th>
                        <th>duration</th>
                        <th>priority</th>

                    </tr>
            </thead>
            <tbody>
                {emptasks}
            </tbody>
           </table>
         
        </>
    )
}

export default Showtask