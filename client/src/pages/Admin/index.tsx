import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import AdminSidebar from './AdminSideBar'
import {
  fetchPets,
  fetchUsers,
  fetchPosts,
  fetchReports,
  fetchComments,
  fetchGroups
} from '../../redux/slice/adminSlice'
import { AppDispatch } from '../../redux/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDog, faFlag, faNewspaper, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-regular-svg-icons'
import Header from '../../components/Header'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { pets, users, posts, reports, comments, groups, loading, error } = useSelector((state: any) => state.admin)

  useEffect(() => {
    dispatch(fetchPets())
    dispatch(fetchUsers())
    dispatch(fetchPosts())
    dispatch(fetchReports())
    dispatch(fetchComments())
    dispatch(fetchGroups())
  }, [dispatch])

  const chartData = {
    labels: ['Users', 'Pets', 'Posts', 'Comments', 'Groups', 'Reports'],
    datasets: [
      {
        label: 'Total Count',
        data: [users.length, pets.length, posts.length, comments.length, groups.length, reports.length],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FF7043', '#FFEB3B', '#8E24AA', '#CCCCCC'],
        borderColor: ['#42A5F5', '#66BB6A', '#FF7043', '#FFEB3B', '#8E24AA', '#CCCCCC'],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Content Engagement Statistics'
      }
    }
  }

  const pieChartData = {
    labels: ['Users', 'Pets'],
    datasets: [
      {
        label: 'User vs Pet',
        data: [users.length, pets.length],
        backgroundColor: ['#42A5F5', '#66BB6A'],
        borderColor: ['#42A5F5', '#66BB6A'],
        borderWidth: 1
      }
    ]
  }

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User vs Pet Distribution'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const percentage = tooltipItem.raw
            const total = users.length + pets.length
            const percentageText = ((percentage / total) * 100).toFixed(2) + '%'
            return tooltipItem.label + ': ' + percentageText
          }
        }
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='p-6 w-5/6 bg-custom-primary mt-16'>
      <h2 className='text-3xl font-semibold mb-4'>Analysis Data</h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='grid grid-cols-3 gap-6 col-span-2'>
          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faUser} /> Users
            </h3>
            <p className='text-2xl font-semibold'>{users.length}</p>
          </div>

          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faDog} /> Pets
            </h3>
            <p className='text-2xl font-semibold'>{pets.length}</p>
          </div>

          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faNewspaper} /> Posts
            </h3>
            <p className='text-2xl font-semibold'>{posts.length}</p>
          </div>

          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faComments} /> Comments
            </h3>
            <p className='text-2xl font-semibold'>{comments.length}</p>
          </div>
          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faUserGroup} /> Groups
            </h3>
            <p className='text-2xl font-semibold'>{groups.length}</p>
          </div>

          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl text-slate-500 font-semibold'>
              <FontAwesomeIcon icon={faFlag} /> Reports
            </h3>
            <p className='text-2xl font-semibold'>{reports.length}</p>
          </div>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6 col-span-1'>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      <div className='mt-8 flex gap-6'>
        <div className='bg-white p-6 shadow-md rounded-lg w-full'>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
