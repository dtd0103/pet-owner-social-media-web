import { useEffect, useState } from 'react'
import { fetchMyActivity } from '../../api'
import { Activity, Relationship, User } from '../../../types'
import { fetchRecommendedFriends, sendFriendRequest } from '../../redux/slice/relationshipSlice'
import { formatDistanceToNow } from 'date-fns'
import { AppDispatch, RootState } from '../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { checkJwt } from '../../../utils/auth'
import { Link, useParams } from 'react-router-dom'

const RightSideBar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const { recommendedFriends, loading } = useSelector((state: RootState) => state.relationships)
  const [sentRequests, setSentRequests] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const { userId } = useParams<{ userId: string }>()

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    dispatch(fetchRecommendedFriends())
  }, [dispatch])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const allActivities: Activity[] = await fetchMyActivity()

        const sortedActivities = allActivities.sort(
          (a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setActivities(sortedActivities.slice(0, 3))
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }
    fetchActivities()
  }, [activities])

  useEffect(() => {}, [recommendedFriends, sentRequests, activities])

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await dispatch(sendFriendRequest(userId)).unwrap()

      setSentRequests((prev) => [...prev, userId])

      dispatch(fetchRecommendedFriends())
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }

  return (
    <aside className='w-custom h-screen fixed top-custom bottom-0 right-0 z-10 p-4 flex-col'>
      <div className='flex-1'>
        <div className='bg-white p-5 mb-6 rounded-md border shadow-lg'>
          <h2 className='text-lg font-semibold mb-4'>Suggested</h2>
          <ul className='mb-4 ml-3'>
            {loading ? (
              <li>Loading...</li>
            ) : recommendedFriends.length > 0 ? (
              recommendedFriends.map((user: User) => {
                return (
                  <li key={user.id} className='flex items-center mb-6'>
                    <Link to={`/profile/${user.id}`}>
                      <img
                        src={user.avatar ? user.avatar : '/default_avatar.jpg'}
                        alt={user.name ?? 'Default Name'}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                    </Link>
                    <div className='ml-4 flex-grow'>
                      <p className='font-semibold'>{user.name ?? 'Default Name'}</p>
                      <p className='text-slate-400 text-xs'>{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleSendFriendRequest(user.id)}
                      className='w-11 h-11 ml-4 bg-custom-blue rounded-full text-2xl text-blue-500 flex justify-center items-center flex-shrink-0'
                    >
                      +
                    </button>
                  </li>
                )
              })
            ) : (
              <p className='text-slate-400'>No suggested friends</p>
            )}
          </ul>
        </div>

        <div className='bg-white p-5 rounded-md border shadow-lg'>
          <div className='ml-2'>
            <h2 className='text-lg font-semibold mb-2'>Latest Activity</h2>
            <ul className=''>
              {activities ? (
                activities.map((activity) => (
                  <li key={activity.id} className='flex flex-col items-start mb-2'>
                    <p className='font-semibold'>{activity.details}</p>
                    <p className='text-slate-400'>
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </li>
                ))
              ) : (
                <p className='text-slate-400'>No activities available</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default RightSideBar
