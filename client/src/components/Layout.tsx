import Header from './Header'
import LeftSidebar from './LeftSideBar'
import RightSideBar from './RightSideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <Header />
      <div className='flex pt-16 h-96'>
        <LeftSidebar />
        <main className='flex-1 flex mt-2 bg-custom-primary h-full'>
          <Outlet />
        </main>
        <RightSideBar />
      </div>
    </div>
  )
}

export default Layout
