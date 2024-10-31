import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUserGroup, faUsers, faMessage, faGear, faAddressBook } from '@fortawesome/free-solid-svg-icons'
import userAvatar from '../../assets/img/avatar.png'
import SearchBar from './SearchBar'

const Header = () => {
  return (
    <header
      className={`bg-white z-20 grid grid-cols-3 items-center w-full fixed top-0 left-0 right-0 px-8 py-4 shadow-sm`}
    >
      <div className='flex items-center justify-start col-span-1'>
        <img src='./logo.svg' alt='logo' className='w-10 h-10' />
        <h1 className='hidden md:block font-sora text-2xl font-bold text-custom-second mt-0.5 ml-1'>Petiverse.</h1>
        <SearchBar></SearchBar>
      </div>
      <nav className='flex ml-24 w-auto h-auto justify-center space-x-16 col-span-1 md:space-x-20 flex-shrink-0'>
        <div className='group'>
          <Link
            to='/'
            className='text-slate-500 font-semibold flex items-center hover:text-custom-second focus:text-custom-second'
          >
            <FontAwesomeIcon icon={faHouse} className='w-6 h-6 mr-2 flex-shrink-0 ' />
          </Link>
        </div>
        <div className='group'>
          <Link
            to='/friends'
            className='text-slate-500 font-semibold flex items-center hover:text-custom-second focus:text-custom-second'
          >
            <FontAwesomeIcon icon={faUserGroup} className='w-6 h-6 mr-2 flex-shrink-0' />
          </Link>
        </div>
        <div className='group'>
          <Link
            to='/groups'
            className='text-slate-500 font-semibold flex items-center hover:text-custom-second focus:text-custom-second'
          >
            <FontAwesomeIcon icon={faUsers} className='w-6 h-6 mr-2 flex-shrink-0' />
          </Link>
        </div>
      </nav>
      <div className='flex justify-end items-center space-x-3.5'>
        <div className='bg-custom-primary rounded-md w-10 h-10 cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/groups' className='text-custom-grey font-semibold flex items-center'>
            <FontAwesomeIcon
              icon={faMessage}
              className='absolute top-custom_header_top right-custom_header_right_2 w-4 h-4 mr-2 text-slate-500'
            />
          </Link>
        </div>
        <div className='bg-custom-primary rounded-md w-10 h-10 cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/groups' className='text-custom-grey font-semibold flex items-center'>
            <FontAwesomeIcon
              icon={faAddressBook}
              className='absolute top-7 right-custom_header_right_1 w-4 h-4 mr-2 text-slate-500'
            />
          </Link>
        </div>
        <div className='bg-custom-primary rounded-md w-10 h-10 cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/groups' className='text-custom-grey font-semibold flex items-center'>
            <FontAwesomeIcon
              icon={faGear}
              className='absolute top-7 right-custom_header_right w-4 h-4 mr-2 text-slate-500'
            />
          </Link>
        </div>
        <div className='flex items-center cursor-pointer'>
          <img src={userAvatar} alt='User' className='w-10 h-10 rounded-md' />
        </div>
      </div>
    </header>
  )
}

export default Header
