import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, banUser, unbanUser, deleteUser, changeUserRole } from '../../redux/slice/adminSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { Link } from 'react-router-dom'

const AdminManageUserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, error } = useSelector((state: RootState) => state.admin)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 7

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleBanUser = (userId: string) => {
    const confirmBan = window.confirm(`Are you sure you want to ban this user?`)
    if (confirmBan) {
      dispatch(banUser(userId))
        .then(() => {
          dispatch(fetchUsers())
        })
        .catch((error) => {
          console.error('Error banning user:', error)
        })
    }
  }

  const handleUnbanUser = (userId: string) => {
    const confirmUnban = window.confirm(`Are you sure you want to unban this user?`)
    if (confirmUnban) {
      dispatch(unbanUser(userId))
        .then(() => {
          dispatch(fetchUsers())
        })
        .catch((error) => {
          console.error('Error unbanning user:', error)
        })
    }
  }

  const handleDeleteUser = (userId: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this user?`)
    if (confirmDelete) {
      dispatch(deleteUser(userId))
        .then(() => {
          dispatch(fetchUsers())
        })
        .catch((error) => {
          console.error('Error deleting user:', error)
        })
    }
  }

  const handleChangeUserRole = (userId: string, newRole: string) => {
    const confirmChangeRole = window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)
    if (confirmChangeRole) {
      dispatch(changeUserRole({ userId, role: newRole }))
        .then(() => {
          dispatch(fetchUsers())
        })
        .catch((error) => {
          console.error('Error changing user role:', error)
        })
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const totalUsers = users.length
  const totalPages = Math.ceil(totalUsers / usersPerPage)
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  // return (
  //   <div className='p-6 w-5/6 bg-custom-primary mt-16'>
  //     {currentUsers.length === 0 ? (
  //       <p className='text-lg'>No users available.</p>
  //     ) : (
  //       <table className='w-full bg-white rounded-md shadow-md'>
  //         <thead>
  //           <tr className='bg-gray-300 text-left'>
  //             <th className='p-4 font-semibold'>Username</th>
  //             <th className='p-4 font-semibold'>Email</th>
  //             <th className='p-4 font-semibold'>Phone Number</th>
  //             <th className='p-4 font-semibold'>Role</th>
  //             <th className='p-4 font-semibold'>Status</th>
  //             <th className='p-4 font-semibold'>Joined At</th>
  //             <th className='p-4 font-semibold text-center'>Actions</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {currentUsers.map((user) => (
  //             <tr key={user.id} className='border-b'>
  //               <Link to={`/profile/${user.id}`}>
  //                 <td className='p-4 underline text-blue-600'>{user.name}</td>
  //               </Link>
  //               <td className='p-4'>{user.email}</td>
  //               <td className='p-4'>{user.tel}</td>
  //               <td className='p-4'>{user.role}</td>
  //               <td className='p-4'>{!user.status ? 'Banned' : 'Active'}</td>
  //               <td className='p-4'>{user.createAt ? new Date(user.createAt).toLocaleString() : 'N/A'}</td>
  //               <td className='p-4'>
  //                 <div className='flex gap-2 justify-center'>
  //                   {!user.status ? (
  //                     <button
  //                       onClick={() => handleUnbanUser(user.id)}
  //                       className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600'
  //                     >
  //                       Unban
  //                     </button>
  //                   ) : (
  //                     <button
  //                       onClick={() => handleBanUser(user.id)}
  //                       className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
  //                     >
  //                       Ban
  //                     </button>
  //                   )}
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     )}

  //     <div className='flex justify-center mt-4'>
  //       {Array.from({ length: totalPages }, (_, index) => (
  //         <button
  //           key={index + 1}
  //           onClick={() => handlePageChange(index + 1)}
  //           className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  //         >
  //           {index + 1}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // )

  return (
    <div className='p-6 w-5/6 bg-custom-primary mt-16'>
      {currentUsers.length === 0 ? (
        <p className='text-lg'>No users available.</p>
      ) : (
        <table className='w-full bg-white rounded-md shadow-md'>
          <thead>
            <tr className='bg-gray-300 text-left'>
              <th className='p-4 font-semibold'>Username</th>
              <th className='p-4 font-semibold'>Email</th>
              <th className='p-4 font-semibold'>Phone Number</th>
              <th className='p-4 font-semibold'>Role</th>
              <th className='p-4 font-semibold'>Status</th>
              <th className='p-4 font-semibold'>Joined At</th>
              <th className='p-4 font-semibold text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className='border-b'>
                <td className='p-4 underline text-blue-600'>
                  <Link to={`/profile/${user.id}`}>{user.name} </Link>
                </td>
                <td className='p-4'>{user.email}</td>
                <td className='p-4'>{user.tel}</td>
                <td className='p-4'>{user.role}</td>
                <td className='p-4'>{!user.status ? 'Banned' : 'Active'}</td>
                <td className='p-4'>{user.createAt ? new Date(user.createAt).toLocaleString() : 'N/A'}</td>
                <td className='p-4'>
                  <div className='flex gap-2 justify-center'>
                    <button
                      onClick={() => handleChangeUserRole(user.id, user.role === 'Admin' ? 'Pet Owner' : 'Admin')}
                      className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                    >
                      Role
                    </button>
                    {!user.status ? (
                      <button
                        onClick={() => handleUnbanUser(user.id)}
                        className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600'
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                      >
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className='text-white bg-gradient-to-r from-neutral-500 to-neutral-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-400 dark:focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                    >
                      Delete
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
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdminManageUserPage
