import { Link } from 'react-router-dom'
import postIcon from '../../assets/icons/post.png'
import petIcon from '../../assets/icons/pet.png'
import messageIcon from '../../assets/icons/message.png'
import connectionIcon from '../../assets/icons/connection.png'
import settingIcon from '../../assets/icons/setting.png'
import reportIcon from '../../assets/icons/report.png'
import defaultBackground from '/default_background.jpg'
import defaultAvatar from '/default_avatar.png'
const LeftSidebar = () => {
  return (
    <aside className='w-1/4 h-screen fixed top-custom bottom-0 left-0 z-10 p-4 justify-start rounded-md overflow-y-auto'>
      <div className='bg-white border shadow-lg rounded-md'>
        <div className='relative h-16'>
          <img src={defaultBackground} alt='' className='rounded-t-md object-cover w-full h-full' />
        </div>
        <div className='cursor-pointer'>
          <img
            src={defaultAvatar}
            alt='User'
            className='absolute border-2 border-white w-14 h-14 top-14 right-custom_leftside_right rounded-md'
          />
          <h3 className='mt-12 text-center text-lg font-semibold'>Jessica Colline</h3>
          <h4 className='text-slate-500 text-center text-sm'>Pet Owner</h4>
          <p className='text-slate-500 text-center text-sm mt-4 mx-4'>
            Until one has loved an animal a part of one's soul remains unawakened.
          </p>
        </div>
        <div className='grid grid-cols-3 mx-4 mt-4 border-b-2 pb-4'>
          <div className='border-r-2'>
            <div className='text-center text-slate-700 font-bold'>320</div>
            <p className='text-center text-slate-600 text-sm'>Posts</p>
          </div>
          <div className='border-r-2'>
            <div className='text-center text-slate-700 font-bold '>2</div>
            <p className='text-center text-slate-600 text-sm'>Pets</p>
          </div>
          <div className=''>
            <div className='text-center text-slate-700 font-bold'>300</div>
            <p className='text-center text-slate-600 text-sm'>Friends</p>
          </div>
        </div>
        <div className='p-4'>
          <nav className=''>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={postIcon} alt='' className='w-5 h-5 mr-3' />
              Feed
            </Link>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={connectionIcon} alt='' className='w-5 h-5 mr-3' />
              Connections
            </Link>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={petIcon} alt='' className='w-5 h-5 mr-3' />
              My Pet
            </Link>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={messageIcon} alt='' className='w-5 h-5 mr-3' />
              Message
            </Link>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={settingIcon} alt='' className='w-5 h-5 mr-3' />
              Setting
            </Link>
            <Link
              to='/'
              className='font-semibold text-sm flex items-center p-2 mb-2 rounded-xl hover:bg-slate-100 transition-colors duration-500'
            >
              <img src={reportIcon} alt='' className='w-5 h-5 mr-3' />
              Report Status
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default LeftSidebar
