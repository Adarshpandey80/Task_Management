import React from 'react'
import { Outlet } from 'react-router-dom'
import Hearder from './src/components/Header'
import Footer from './src/components/Footer'
const Layout = () => {
  return (
    <>
        <Hearder />
        <div>
            <Outlet />
        </div>
        <Footer />
    </>
  )
}

export default Layout