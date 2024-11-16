import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReports, processReport } from '../../redux/slice/adminSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCommentsById } from '../../api'

const AdminManageReportPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { reports, loading, error } = useSelector((state: RootState) => state.admin)
  const [currentPage, setCurrentPage] = useState(1)
  const [comments, setComments] = useState<{ [key: string]: any }>({})
  const reportsPerPage = 7

  useEffect(() => {
    dispatch(fetchReports())
  }, [dispatch])

  const handleProcess = (reportId: string, status: string) => {
    const confirmProcess = window.confirm(`Are you sure you want to mark this report as ${status}?`)
    if (confirmProcess) {
      dispatch(processReport({ reportId, status }))
        .then(() => {
          dispatch(fetchReports())
        })
        .catch((error) => {
          console.error('Error processing report:', error)
        })
    }
  }

  const fetchCommentDetails = (commentId: string) => {
    fetchCommentsById(commentId)
      .then((comment) => {
        const postId = comment[0].post.id
        navigate(`/posts/${postId}`)
      })
      .catch((error) => {
        console.error('Error fetching comment details:', error)
      })
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const totalReports = reports.length
  const totalPages = Math.ceil(totalReports / reportsPerPage)
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='p-6 w-5/6 bg-custom-primary mt-16'>
      {currentReports.length === 0 ? (
        <p className='text-lg'>No reports available.</p>
      ) : (
        <table className='w-full bg-white rounded-md shadow-md'>
          <thead>
            <tr className='bg-gray-300 text-left'>
              <th className='p-4 font-semibold'>Report Type</th>
              <th className='p-4 font-semibold'>Content</th>
              <th className='p-4 font-semibold'>Status</th>
              <th className='p-4 font-semibold'>Reported At</th>
              <th className='p-4 font-semibold'>Link</th>
              <th className='p-4 font-semibold text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report) => (
              <tr key={report.id} className='border-b'>
                <td className='p-4'>{report.reportType}</td>
                <td className='p-4'>{report.reportReason}</td>
                <td className='p-4'>{report.reportStatus}</td>
                <td className='p-4'>{new Date(report.createAt).toLocaleString()}</td>
                <td className='p-4'>
                  {report.reportType === 'Post' && (
                    <Link to={`/posts/${report.reportedEntityId}`} className='text-blue-500 hover:underline'>
                      View
                    </Link>
                  )}
                  {report.reportType === 'User' && (
                    <Link to={`/profile/${report.reportedEntityId}`} className='text-blue-500 hover:underline'>
                      View
                    </Link>
                  )}
                  {report.reportType === 'Comment' && (
                    <button onClick={() => fetchCommentDetails(report.reportedEntityId)} className='text-blue-500 '>
                      View
                    </button>
                  )}
                </td>
                <td className='p-4'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleProcess(report.id, 'Pending')}
                      className='text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 '
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleProcess(report.id, 'Under Review')}
                      className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleProcess(report.id, 'Resolved')}
                      className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() => handleProcess(report.id, 'Rejected')}
                      className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className='flex justify-center mt-4'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdminManageReportPage
