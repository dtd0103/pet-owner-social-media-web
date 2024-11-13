import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPendingRequests, cancelFriendRequest, fetchRecommendedFriends } from '../../redux/slice/relationshipSlice'
import { RootState, AppDispatch } from '../../redux/store'
import { Link, useLocation } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'

import { format } from 'date-fns'

const FriendsSentPage = () => {
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

  const handleCancelRequest = async (friendId: string) => {
    try {
      dispatch(cancelFriendRequest(friendId))

      alert('Cancel friend request successfully')
      if (userId) {
        dispatch(fetchPendingRequests(userId))
      }
      dispatch(fetchRecommendedFriends())
    } catch (error) {
      alert('Failed to cancel friend request')
    }
  }

  const renderSentRequestList = () => {
    if (loading) return <p>Loading sent requests...</p>

    return pendingRequests && pendingRequests.length > 0 ? (
      pendingRequests
        .filter((relationship: any) => relationship.user.id === userId)
        .map((relationship: any) => (
          <div
            key={relationship.friend.id}
            className='flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm m-2'
          >
            <div className='flex items-center space-x-4'>
              <Link to={`/profile/${relationship.friend.id}`}>
                <img
                  className='w-16 h-16 rounded-full object-cover'
                  src={relationship.friend.avatar || '/default_avatar.jpg'}
                  alt={`${relationship.friend.name}'s avatar`}
                />
              </Link>

              <div>
                <Link to={`/profile/${relationship.friend.id}`}>
                  <p className='text-lg font-semibold text-gray-900'>{relationship.friend.name}</p>
                </Link>
              </div>
            </div>
            <button
              className='flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-500 rounded-lg hover:bg-red-600 focus:outline-none'
              onClick={() => handleCancelRequest(relationship.friend.id)}
            >
              Cancel Request
            </button>
          </div>
        ))
    ) : (
      <p>No sent friend requests found.</p>
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
        <h2 className='text-xl font-bold ml-2 mb-4 text-gray-800'>Sent Friend Requests</h2>
        {renderSentRequestList()}
      </div>
    </div>
  )
}

export default FriendsSentPage
