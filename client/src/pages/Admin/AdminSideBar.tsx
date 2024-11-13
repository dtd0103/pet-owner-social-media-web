import { Link } from 'react-router-dom'
import ChartIcon from '../../assets/icons/chart-pipe-svgrepo-com.svg'
import ReportIcon from '../../assets/icons/report-svgrepo-com.svg'

import UserIcon from '../../assets/icons/user-svgrepo-com.svg'
const AdminSidebar = () => {
  return (
    <aside className='min-h-svh w-60 text-white bg-white p-5 mt-custom_top'>
      <ul className=''>
        <li className='rounded-md cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/admin' className='text-custom-grey font-semibold flex items-center'>
            <img src={ChartIcon} alt='' className='w-5 h-5 mr-3 mb-1' />
            Analysis Data
          </Link>
        </li>
        <li className='mt-8 rounded-md cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/admin/manage-reports' className='text-custom-grey font-semibold flex items-center'>
            <img src={ReportIcon} alt='' className='w-5 h-5 mr-3 mb-1' /> Manage Reports
          </Link>
        </li>
        <li className='mt-8 rounded-md cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/admin/manage-users' className='text-custom-grey font-semibold flex items-center'>
            <img src={UserIcon} alt='' className='w-5 h-5 mr-3 mb-1' /> Manage Users
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default AdminSidebar
