import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFriends, blockFriend, unfriend, fetchRecommendedFriends } from '../../redux/slice/relationshipSlice'
import { RootState, AppDispatch } from '../../redux/store'
import { useLocation, Link, useMatch } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'
import { format } from 'date-fns'

const FriendsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { friends, loading, error } = useSelector((state: RootState) => state.relationships)
  const [view, setView] = useState('Friends')
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
      console.log(user)
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

  useEffect(() => {
    if (friends) {
      console.log('Friends updated:', friends)
    }
  }, [friends])

  const handleUnfriend = async (friendId: string) => {
    try {
      await dispatch(unfriend(friendId))
      if (userId) {
        dispatch(getFriends(userId))
      }
      dispatch(fetchRecommendedFriends())
      alert('Unfriend request sent successfully')
    } catch (error) {
      alert('Failed to unfriend')
    }
  }

  const handleBlock = async (friendId: string) => {
    try {
      await dispatch(blockFriend(friendId))
      if (userId) {
        dispatch(getFriends(userId))
      }
      alert('Block request sent successfully')
    } catch (error) {
      alert('Failed to block')
    }
  }

  const renderFriendList = () => {
    if (loading) return <p>Loading friends...</p>

    const filteredFriends = friends.filter((relationship: any) => relationship.isBlocked === 0)

    return filteredFriends.length > 0 ? (
      filteredFriends.map((relationship: any) => (
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
              <p className='text-sm text-gray-500'>Friend since {format(relationship.date, 'dd/MM/yyyy')}</p>
            </div>
          </div>

          <button
            className='text-white ml-48 bg-gradient-to-r from-neutral-500 to-neutral-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-400 dark:focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
            onClick={() => handleBlock(relationship.friend.id)}
          >
            Block
          </button>

          <button
            className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
            onClick={() => handleUnfriend(relationship.friend.id)}
          >
            Unfriend
          </button>
        </div>
      ))
    ) : (
      <p>No friends found.</p>
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
        {view === 'Friends' && (
          <div>
            <h2 className='text-xl font-bold ml-2 mb-4 text-gray-800'>List of Friends</h2>
            {renderFriendList()}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsPage
