import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFriends, unblockFriend } from '../../redux/slice/relationshipSlice'
import { RootState, AppDispatch } from '../../redux/store'
import { useLocation, Link, useMatch } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'
import { format } from 'date-fns'

const FriendsBlockPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { friends, loading, error } = useSelector((state: RootState) => state.relationships)
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
      }
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    if (userId) {
      dispatch(getFriends(userId))
    }
  }, [dispatch, userId])

  const handleUnblock = async (friendId: string) => {
    try {
      await dispatch(unblockFriend(friendId))

      if (userId) {
        dispatch(getFriends(userId))
      }

      alert('Unblock request sent successfully')
    } catch (error) {
      alert('Failed to unblock')
    }
  }

  const renderBlockedList = () => {
    if (loading) return <p>Loading blocked friends...</p>

    const filteredBlocked = friends.filter((relationship: any) => relationship.isBlocked === 1)

    return filteredBlocked.length > 0 ? (
      filteredBlocked.map((relationship: any) => (
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
            className='flex items-center px-4 py-2 ml-48 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none'
            onClick={() => handleUnblock(relationship.friend.id)}
          >
            Unblock
          </button>
        </div>
      ))
    ) : (
      <p>No blocked friends found.</p>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4'>
      <div className='flex gap-4 mb-4 ml-8'>
        {tabs.map(({ label, path }) => {
          const match = useMatch(path)
          return (
            <Link key={label} to={path}>
              <button
                className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                  match ? 'text-blue-500' : ''
                }`}
              >
                {label.replace(/([A-Z])/g, ' $1')}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transition-transform duration-300 ease-in-out ${
                    match ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </button>
            </Link>
          )
        })}
      </div>

      <div className='bg-white p-4 rounded-lg shadow-md'>
        <div>
          <h2 className='text-xl font-bold ml-2 mb-4 text-gray-800'>List of Blocked Friends</h2>
          {renderBlockedList()}
        </div>
      </div>
    </div>
  )
}

export default FriendsBlockPage
