import userAvatar from '../../assets/img/avatar.png'
const RightSideBar = () => {
  const suggestions = [
    { id: 1, name: 'User A', profilePic: userAvatar },
    { id: 2, name: 'User B', profilePic: userAvatar },
    { id: 3, name: 'User C', profilePic: userAvatar }
  ]

  const activities = [
    { id: 1, status: 'User Dat Do Thanh commented on a post.', time: '2hr' },
    { id: 2, status: 'User Do Dat created a post.', time: '3hr' },
    { id: 3, status: 'User Dat Do Thanh reported user Loc Ngo.', time: '30m' }
  ]

  return (
    <aside className='w-1/5 h-screen fixed top-custom bottom-0 right-0 z-10 p-4 flex-col'>
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
            {activities.map((contact) => (
              <li key={contact.id} className='flex flex-col items-start mb-2'>
                <p className='font-semibold'>{contact.status}</p>
                <p className='text-slate-400'>{contact.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default RightSideBar
