import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <Navbar/>
      <Sidebar/>

      <section className='flex flex-1 h-full'>
          <Outlet/>
      </section>

      <Footer/>
    </div>
  )
}

export default RootLayout