import Header from '../../components/Header'
import AdminSidebar from './AdminSideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='bg-custom-primary min-h-screen'>
      <Header />
      <main className='flex'>
        <AdminSidebar />
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
