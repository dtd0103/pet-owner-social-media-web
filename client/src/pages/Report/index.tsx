import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReportsByUser, deleteReport } from '../../redux/slice/reportSlice'
import { AppDispatch, RootState } from '../../redux/store'

const MyReportsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reports, loading, error } = useSelector((state: RootState) => state.reports)
  
  useEffect(() => {
    dispatch(fetchReportsByUser())
  }, [dispatch])
  console.log(reports)
  const handleDelete = (reportId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this report?')
    if (confirmDelete) {
      dispatch(deleteReport(reportId))
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='rounded-xl bg-white m-4 p-6 shadow-lg'>
      <h2 className='text-3xl font-semibold mb-4'>My Reports</h2>
      {reports.length === 0 ? (
        <p className='text-lg'>You haven't submitted any reports.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {reports.map((report) => (
            <div key={report.id} className='bg-gray-100 p-4 rounded-lg shadow-md'>
              <p className='font-semibold text-lg mb-2'>
                Report Type: <span className='font-normal'>{report.reportType}</span>
              </p>
              <p className='text-sm text-gray-600 mb-2'>
                Content: <span className='font-normal'>{report.reportReason}</span>
              </p>
              <p className='text-sm text-gray-600 mb-2'>
                Status: <span className='font-normal'>{report.reportStatus}</span>
              </p>
              <p className='text-sm text-gray-600 mb-4'>
                Reported At: <span className='font-normal'>{new Date(report.createAt).toLocaleString()}</span>
              </p>
              <button
                onClick={() => handleDelete(report.id)}
                className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
              >
                <i className='fas fa-trash-alt'></i> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReportsPage
