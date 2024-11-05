import Header from './Header'
import LeftSidebar from './LeftSideBar'
import RightSideBar from './RightSideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='bg-custom-primary min-h-screen'>
      <Header />
      <div className='flex pt-16 min-h-screen'>
        <LeftSidebar />
        <main className='flex-1 flex mt-2'>
          <div className='w-1/2 ml-custom_left mt-4'>
            <Outlet />
          </div>
        </main>
        <RightSideBar />
      </div>
    </div>
  )
}

export default Layout
