import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUserGroup, faUsers, faMessage, faGear, faAddressBook } from '@fortawesome/free-solid-svg-icons'
import defaultAvatar from '/default_avatar.jpg'
import SearchBar from './SearchBar'
import { useEffect, useState } from 'react'
import { fetchMyProfile } from '../../api'
import { UserDetail } from '../../../types'
import { checkJwt } from '../../../utils/auth'

const Header = () => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserDetail | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkOwner = async () => {
      const currentUser = await checkJwt()

      if (currentUser?.role === 'Admin') {
        setIsAdmin(true)
      }
    }
    checkOwner()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await fetchMyProfile()
        setUserProfile(profileData)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/log-in')
    window.location.reload()
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  return (
    <header
      className={`bg-white z-20 grid grid-cols-3 items-center w-full fixed top-0 left-0 right-0 px-8 py-4 shadow-sm`}
    >
      <div className='flex items-center justify-start col-span-1'>
        <Link to='/' className='flex items-center'>
          <img src='/logo.svg' alt='logo' className='w-10 h-10' />
          <h1 className='hidden md:block font-sora text-2xl font-bold text-custom-second mt-0.5 ml-1'>Petiverse.</h1>
        </Link>
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
          <Link to='/message' className='text-custom-grey font-semibold flex items-center'>
            <FontAwesomeIcon
              icon={faMessage}
              className='absolute top-custom_header_top right-custom_header_right_2 w-4 h-4 mr-2 text-slate-500'
            />
          </Link>
        </div>
        <div className='bg-custom-primary rounded-md w-10 h-10 cursor-pointer hover:opacity-80 mr-0.5'>
          <Link to='/friends/friends-request' className='text-custom-grey font-semibold flex items-center'>
            <FontAwesomeIcon
              icon={faAddressBook}
              className='absolute top-7 right-custom_header_right_1 w-4 h-4 mr-2 text-slate-500'
            />
          </Link>
        </div>
        <div className='relative inline-block'>
          <div
            className='bg-custom-primary rounded-md w-10 h-10 cursor-pointer hover:opacity-80 mr-0.5'
            onClick={toggleDropdown}
          >
            <Link to='#' className='text-custom-grey font-semibold flex items-center'>
              <FontAwesomeIcon
                icon={faGear}
                className='absolute top-3 right-custom_header_right w-4 h-4 mr-2 text-slate-500'
              />
            </Link>
          </div>

          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
              <Link to={`profile/${userProfile?.id}`} className='block px-4 py-2 text-gray-800 hover:bg-gray-100'>
                Edit Your Profile
              </Link>
              {isAdmin && (
                <Link to='/admin' className='block px-4 py-2 text-gray-800 hover:bg-gray-100'>
                  Admin DashBoard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className='block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'
              >
                Log out
              </button>
            </div>
          )}
        </div>
        <div className='flex items-center cursor-pointer'>
          <Link to={`/profile/${userProfile?.id}`}>
            <img src={userProfile?.avatar ?? defaultAvatar} alt='User' className='w-10 h-10 rounded-md object-cover' />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
