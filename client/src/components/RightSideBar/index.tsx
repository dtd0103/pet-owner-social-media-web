import { useEffect, useState } from 'react'
import userAvatar from '../../assets/img/avatar.png'
import { fetchMyActivity } from '../../api'
import { Activity } from '../../../types'
import { formatDistanceToNow } from 'date-fns'

const RightSideBar = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const suggestions = [
    { id: 1, name: 'User A', profilePic: userAvatar },
    { id: 2, name: 'User B', profilePic: userAvatar },
    { id: 3, name: 'User C', profilePic: userAvatar }
  ]

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
  }, [])

  return (
    <aside className='w-custom h-screen fixed top-custom bottom-0 right-0 z-10 p-4 flex-col'>
      <div className='flex-1'>
        <div className='bg-white p-5 mb-6 rounded-md border shadow-lg'>
          <h2 className='text-lg font-semibold mb-4'>Suggested</h2>
          <ul className='mb-4'>
            {suggestions.map((user) => (
              <li key={user.id} className='flex items-center mb-6'>
                <img src={user.profilePic} alt={user.name} className='w-12 h-12 rounded-full' />
                <div className='ml-4'>
                  <p className='font-semibold'>{user.name}</p>
                  <p className='text-slate-400 text-xs'>Pet Owner</p>
                </div>
                <button className='w-10 ml-10 py-1 bg-custom-blue rounded-full text-2xl text-blue-500'>+</button>
              </li>
            ))}
          </ul>
        </div>

        <div className='bg-white p-5 rounded-md border shadow-lg'>
          <h2 className='text-lg font-semibold  mb-2'>Latest Activity</h2>
          <ul>
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
    </aside>
  )
}

export default RightSideBar
