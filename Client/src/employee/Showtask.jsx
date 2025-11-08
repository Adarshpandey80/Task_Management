import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Showtask = () => {
    const { id } = useParams();
    console.log(id)

    const Showtask = async (e) => {
        e.preventDefault();

        try {
            const api = `${import.meta.env.VITE_BACKEND_URL}/employee/showtask/${id}`;
            const response = await axios.get(api)
            console.log(response.data)
        } catch (error) {
            console.log("error in task fatching" , error)
        }

    }

    useEffect(()=>{
        Showtask();
    } , [])



    return (
        <div>Showtask</div>
    )
}

export default Showtask