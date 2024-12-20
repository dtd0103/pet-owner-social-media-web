import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchRecommendedFriends
} from '../../redux/slice/relationshipSlice'
import { RootState, AppDispatch } from '../../redux/store'
import { Link, useLocation } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'

const FriendsRequestPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { pendingRequests, loading, error } = useSelector((state: RootState) => state.relationships)
  const [userId, setUserId] = useState<string | null>(null)

  const location = useLocation()
  const currentPath = location.pathname
  const tabs = [
    { label: 'Friends', path: '/friends' },
    { label: 'FriendsRequest', path: '/friends/friends-request' },
    { label: 'FriendsSent', path: '/friends/friends-sent' },
    { label: 'FriendsBlock', path: '/friends/friends-block' }
  ]

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await checkJwt()
      if (user) {
        setUserId(user.id)
        dispatch(fetchPendingRequests(user.id))
      } else {
        alert('User not found, please log in again.')
      }
    }
    fetchUserId()
  }, [dispatch])

  const handleAcceptRequest = async (friendId: string) => {
    try {
      await dispatch(acceptFriendRequest(friendId)).unwrap()
      dispatch(fetchRecommendedFriends())
      alert('Friend request accepted.')
    } catch (error) {
      alert('Failed to accept friend request.')
    }
  }

  const handleRejectRequest = async (friendId: string) => {
    try {
      await dispatch(rejectFriendRequest(friendId)).unwrap()
      if (userId) {
        dispatch(fetchPendingRequests(userId))
      }
      dispatch(fetchRecommendedFriends())
      alert('Friend request rejected.')
    } catch (error) {
      alert('Failed to reject friend request.')
    }
  }

  const renderRequestList = () => {
    if (loading) return <p>Loading requests...</p>

    return pendingRequests && pendingRequests.length > 0 ? (
      pendingRequests
        .filter((relationship: any) => relationship.friend.id === userId)
        .map((relationship: any) => (
          <div
            key={relationship.user.id}
            className='flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm m-2'
          >
            <div className='flex items-center space-x-4'>
              <Link to={`/profile/${relationship.user.id}`}>
                <img
                  className='w-16 h-16 rounded-full object-cover'
                  src={
                    relationship.user?.avatar
                      ? relationship.user.avatar
                          .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                          .replace(/\\/g, '/')
                      : '/default_avatar.jpg'
                  }
                  alt={`${relationship.user.name}'s avatar`}
                />
              </Link>

              <div>
                <Link to={`/profile/${relationship.user.id}`}>
                  <p className='text-lg font-semibold text-gray-900'>{relationship.user.name}</p>
                </Link>
              </div>
            </div>
            <button
              className='flex ml-48 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
              onClick={() => handleAcceptRequest(relationship.user.id)}
            >
              Accept
            </button>
            <button
              className='text-white bg-gradient-to-r from-neutral-500 to-neutral-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-400 dark:focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
              onClick={() => handleRejectRequest(relationship.user.id)}
            >
              Reject
            </button>
          </div>
        ))
    ) : (
      <p>No pending friend requests found.</p>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4'>
      <div className='flex gap-4 mb-4 ml-8'>
        {tabs.map(({ label, path }) => {
          const isActive = currentPath === path
          return (
            <Link key={label} to={path}>
              <button
                className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                  isActive ? 'text-blue-500' : ''
                }`}
              >
                {label.replace(/([A-Z])/g, ' $1')}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transition-transform duration-300 ease-in-out ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </button>
            </Link>
          )
        })}
      </div>

      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold ml-2 mb-4 text-gray-800'>Friend Requests</h2>
        {renderRequestList()}
      </div>
    </div>
  )
}

export default FriendsRequestPage
