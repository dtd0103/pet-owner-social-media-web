import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faClipboardList, faChartLine, faFileAlt } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 text-white h-screen p-4'>
      <div className='text-2xl font-bold mb-8 text-center'>Admin Dashboard</div>
      <nav>
        <ul>
          <li className='mb-6'>
            <Link to='/admin/manage-users' className='flex items-center text-lg hover:text-blue-400'>
              <FontAwesomeIcon icon={faUsers} className='mr-3' /> Manage Users
            </Link>
          </li>
          <li className='mb-6'>
            <Link to='/admin/manage-contents' className='flex items-center text-lg hover:text-blue-400'>
              <FontAwesomeIcon icon={faClipboardList} className='mr-3' /> Manage Contents
            </Link>
          </li>
          <li className='mb-6'>
            <Link to='/admin/manage-reports' className='flex items-center text-lg hover:text-blue-400'>
              <FontAwesomeIcon icon={faFileAlt} className='mr-3' /> Manage Reports
            </Link>
          </li>
          <li className='mb-6'>
            <Link to='/admin/analyze-data' className='flex items-center text-lg hover:text-blue-400'>
              <FontAwesomeIcon icon={faChartLine} className='mr-3' /> Analyze Data
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
