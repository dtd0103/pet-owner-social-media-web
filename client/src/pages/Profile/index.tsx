import { useEffect, useState } from 'react'
import { Pet, Post, User } from '../../../types'
import { checkJwt } from '../../../utils/auth'
import { Link, useNavigate } from 'react-router-dom'
import PostComponent from '../../components/Post'
import PetComponent from '../../components/Pet'
import { fetchPetsByUser } from '../../redux/slice/petSlice'
import { fetchPostsByUser } from '../../redux/slice/postSlice'
import { changePassword, fetchUser, updateUserProfile } from '../../redux/slice/userSlice'
import { getFriends } from '../../redux/slice/relationshipSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { AppDispatch } from '../../redux/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { pets, isLoading: petsLoading } = useSelector((state: RootState) => state.pets)
  const { posts, loading: postsLoading } = useSelector((state: RootState) => state.posts)
  const friends = useSelector((state: RootState) => state.relationships.friends)
  const { user, isLoading: userLoading } = useSelector((state: RootState) => state.users)
  const userId = window.location.pathname.split('/')[2]
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const [view, setView] = useState('post')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [petsCount, setPetsCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [friendsCount, setFriendsCount] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<File | null>(null)
  const [userQuote, setUserQuote] = useState<string>('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [originalUserData, setOriginalUserData] = useState({
    name: user?.name,
    email: user?.email,
    tel: user?.tel,
    quote: user?.quote,
    avatar: user?.avatar,
    background: user?.background
  })

  useEffect(() => {
    dispatch(fetchPetsByUser(userId))
    dispatch(fetchPostsByUser(userId))
    dispatch(getFriends(userId))
    dispatch(fetchUser(userId))
  }, [dispatch, userId])

  useEffect(() => {
    setPetsCount(pets.length)
    setPostsCount(posts.length)
    setFriendsCount(friends.length)
  }, [pets, posts, user, friends])

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
    if (currentUser?.id === userId) {
      setShowEditProfile(true)
    }
  }, [userId])

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkJwt()
      if (userData?.id === userId) {
        setShowEditProfile(true)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      setUserName(user.name || '')
      setUserEmail(user.email || '')
      setUserTel(user.tel || '')
      setUserQuote(user.quote || '')
    }
  }, [user])

  useEffect(() => {
    setOriginalUserData({
      name: user?.name,
      email: user?.email,
      tel: user?.tel,
      quote: user?.quote,
      avatar: user?.avatar,
      background: user?.background
    })
  }, [user])

  const [userName, setUserName] = useState(user?.name || '')
  const [userEmail, setUserEmail] = useState(user?.email || '')
  const [userTel, setUserTel] = useState(user?.tel || '')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value)
  }

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserTel(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setSelectedMedia(file)
  }

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuote(e.target.value)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedAvatar(file)
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedBackground(file)
    }
  }

  const handlerSubmit = () => {
    dispatch(
      updateUserProfile({
        userId,
        name: userName || '',
        email: userEmail || '',
        tel: userTel || '',
        avatar: selectedAvatar,
        background: selectedBackground,
        quote: userQuote
      })
    )
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          alert('Edit profile success')
          setShowEditModal(false)
          dispatch(fetchUser(userId))
          window.location.reload()
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          alert('Failed to update profile: ' + (error.response?.data || 'Unknown error'))
        } else {
          alert('An unknown error occurred')
        }
        setShowEditModal(false)
      })
  }
  const editProfileModal = () => {
    return (
      <div className='fixed mt-10 z-40 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setShowEditModal(false)}>
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <p className='pt-4 text-center text-2xl font-bold'>{user?.name}</p>

            <form className='w-full max-w-lg p-2'>
              <div className='grid mx-3 mb-6'>
                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='name'>
                    Name
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='name'
                    type='text'
                    placeholder={user?.name}
                    value={userName}
                    onChange={handleNameChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='email'>
                    Email
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='email'
                    type='email'
                    placeholder={user?.email}
                    value={userEmail}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='tel'>
                    Phone Number
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='tel'
                    type='tel'
                    placeholder={user?.tel}
                    value={userTel}
                    onChange={handleTelChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='quote'>
                    Quote
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='quote'
                    type='text'
                    placeholder='Your quote'
                    value={userQuote}
                    onChange={handleQuoteChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='avatar-image'
                  >
                    Avatar Image
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='avatar-image'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='background-image'
                  >
                    Background Image
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='background-image'
                    type='file'
                    accept='image/*'
                    onChange={handleBackgroundChange}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <button
                    className='bg-slate-800 px-4 py-2 rounded-md font-semibold text-white mt-4'
                    onClick={() => {
                      setShowEditModal(false)
                      setShowEditPasswordModal(true)
                    }}
                  >
                    Change password
                  </button>
                </div>
              </div>
            </form>

            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                onClick={handlerSubmit}
              >
                Edit
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlerChangeSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('Confirm password is not match')
      return
    }

    dispatch(changePassword({ userId, newPassword }))
      .then(() => {
        alert('Password updated successfully')
        setShowEditPasswordModal(false)
      })
      .catch((err) => {
        console.log(err)
        alert('Failed to update password')
      })
  }

  const editPasswordModal = () => {
    return (
      <div className='fixed mt-36 z-40 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div
            className='fixed inset-0 transition-opacity'
            aria-hidden='true'
            onClick={() => setShowEditPasswordModal(false)}
          >
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>

          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <p className='text-center text-2xl font-bold p-2'>Change Password</p>
            <form className='w-full max-w-lg p-2'>
              <div className='grid mx-3 mb-6'>
                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='new-password'
                  >
                    New Password
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='new-password'
                    type='password'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='confirm-password'
                  >
                    Confirm Password
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='confirm-password'
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </form>

            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                onClick={handlerChangeSubmit}
              >
                Change Password
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => setShowEditPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='rounded-xl bg-white m-2 '>
        <div className=''>
          <div className=''>
            <div className='relative h-32 w-full'>
              <img
                src={user?.background ?? '/default_background.jpg'}
                alt=''
                className='rounded-t-md object-cover w-full h-full'
              />
            </div>
            <div className='relative'>
              <img
                src={user?.avatar ?? '/default_avatar.jpg'}
                alt='User'
                className='absolute object-cover bottom-16 left-6 border-white border-4 w-24 h-24  rounded-full'
              />
              <div className='flex'>
                <h3 className='mt-12 ml-8 text-left text-xl font-semibold'>
                  {user ? user.name : 'Loading...'}{' '}
                  {showEditProfile && (
                    <button onClick={() => setShowEditModal(true)}>
                      <FontAwesomeIcon icon={faPenToSquare} className='w-4 h-4 ml-1 mb-0.5' />
                    </button>
                  )}
                </h3>
              </div>
              <h4 className='ml-8 text-slate-500 text-left'>{user ? user.role : 'Loading...'}</h4>
            </div>
            <div className='ml-8 mt-2 mb-2 grid w-64 grid-cols-3 rounded-md border py-2.5 shadow-sm'>
              <div className='flex items-center justify-center gap-1 border-r px-4 '>
                <span className='font-semibold text-black'>{postsCount}</span>
                <span className=' text-sm text-slate-500'>{postsCount > 1 ? 'Posts' : 'Post'}</span>
              </div>
              <div className='flex items-center justify-center gap-1 border-r px-4 '>
                <span className='font-semibold text-black'>{petsCount}</span>
                <span className=' text-sm text-slate-500'>{petsCount > 1 ? 'Pets' : 'Pet'}</span>
              </div>
              <div className='flex items-center justify-center gap-1 px-4'>
                <span className='font-semibold text-black'>{friendsCount}</span>
                <span className=' text-sm text-slate-500'>{friendsCount > 1 ? 'Friends' : 'Friend'}</span>
              </div>
            </div>
            <p className='ml-8 mt-1 font-bold text-left'>About me</p>
            <p className='ml-8 text-slate-500 text-left'>{user?.quote ?? 'No bio yet.'}</p>
            <div className='flex gap-2 my-5 ml-8'>
              <Link to={`/message?user=${user?.id}`}>
                <button className='bg-green-400 px-4 py-2 rounded-md font-semibold text-white'>Chat Now</button>
              </Link>
              <Link to={`/`}>
                <button className='bg-red-400 px-4 py-2 rounded-md font-semibold text-white'>Report</button>
              </Link>
            </div>
            <div className='flex gap-4 mt-2 ml-8'>
              <button
                className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                  view === 'post' ? 'text-blue-500' : ''
                }`}
                onClick={() => setView('post')}
              >
                Post
                <span
                  className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-200 transform ${
                    view === 'post' ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </button>

              <button
                className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                  view === 'pet' ? 'text-purple-500' : ''
                }`}
                onClick={() => setView('pet')}
              >
                Pet
                <span
                  className={`absolute left-0 bottom-0 w-full h-0.5 bg-purple-500 transition-all duration-200 transform ${
                    view === 'pet' ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
        {view === 'post' &&
          (posts.length === 0 ? (
            <p>No post</p>
          ) : (
            posts.map((post: Post) => (
              <div className='overflow-hidden mx-2' key={post.id}>
                <PostComponent key={post.id} post={post} />
              </div>
            ))
          ))}
        {view === 'pet' &&
          (pets.length === 0 ? (
            <p>No pet</p>
          ) : (
            <div className='mx-8 mt-4 pb-5 gap-2 grid grid-cols-3'>
              {pets.map((pet: Pet) => (
                <PetComponent key={pet.id} {...pet} />
              ))}
            </div>
          ))}
        {showEditModal ? editProfileModal() : null}
        {showEditPasswordModal ? editPasswordModal() : null}
      </div>
      <div></div>
    </div>
  )
}

export default ProfilePage
