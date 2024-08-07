import BottomNavbar from '@/components/shared/BottomNavbar'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <Navbar/>
      <Sidebar/>

      <section className='flex flex-1 h-full'>
          <Outlet/>
      </section>

      <BottomNavbar/>
    </div>
  )
}

export default RootLayout