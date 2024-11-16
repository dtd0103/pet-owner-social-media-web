import { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
import { Group, Post, User } from '../../../types'
import { fetchGroupsByIdS, joinGroup, leaveGroup, fetchPostsInGroups } from '../../redux/slice/groupSlice'
import PostComponent from '../../components/Post'
import { checkJwt } from '../../../utils/auth'
import { AppDispatch, RootState } from '../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faHandPointLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

const GroupsProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { postsInMyGroups, group } = useSelector((state: RootState) => state.groups)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { id } = useParams<{ id: string }>()
  const groupsId = id

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (groupsId) {
      dispatch(fetchGroupsByIdS(groupsId))
      dispatch(fetchPostsInGroups(groupsId))
    }
  }, [groupsId, dispatch])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopupCreatePostOpen, setIsPopupCreatePostOpen] = useState(false)
  const accessToken = localStorage.getItem('access_token')
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    media: null as File | null,
    groupId: '' as string
  })
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('description', postData.description)
    formData.append('media', selectedMedia as File)
    formData.append('groupId', group?.id || '')

    try {
      const res = axios
        .post('http://localhost:3001/api/v1/posts', formData, {
          headers: {
            'Content-Type': 'form-data',
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then((res) => {
          res.status === 200 && alert('Post created successfully')
          window.location.href = '/groups/' + group?.id
        })
    } catch (error) {
      console.log(error)
    }
  }

  const handleJoinGroup = async (id: string) => {
    try {
      await dispatch(joinGroup(id))
      alert('Join group successfully')
    } catch (error) {
      console.log(error)
    }
  }

  const handleLeaveGroup = async (id: string) => {
    if (confirm('Are you sure you want to leave this group?') == false) {
      return
    }

    try {
      await dispatch(leaveGroup(id))
      alert('Leave group successfully')
      window.location.href = '/my-groups'
    } catch (error) {
      console.log(error)
    }
  }

  const showGroupMembers = () => {
    return (
      <div className='fixed z-50 inset-0  overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
          <div
            className='fixed inset-0 bg-black bg-opacity-60 transition-opacity'
            aria-hidden='true'
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            className='p-4 bg-white inline-block rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <div className='flex justify-between '>
              <h1 className='text-lg font-semibold text-gray-900'>{group?.name} Members</h1>
              <button onClick={() => setIsModalOpen(false)} className=' mr-2 font-semibold'>
                X
              </button>
            </div>
            {group?.users?.map((user) => (
              <div className='flex justify-between border rounded m-2 p-4 max '>
                <div className='flex items-center'>
                  <Link to={`/profile/${user.id}`}>
                    <img className='w-16 h-16 rounded-full object-cover' src={user.avatar ? user.avatar : ''} alt='' />
                  </Link>
                  <Link to={`/profile/${user.id}`} className='ml-4'>
                    <p className='font-semibold text-gray-900'>{user.name}</p>
                    <p className='font-medium text-sm text-slate-500 '>Role: {user.role}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const showGroupInfo = () => {
    const isMember = group?.users?.find((user) => user.id == currentUser?.id)

    if (group) {
      return (
        <>
          <div className='flex flex-col items-center p-5 bg-white rounded-lg'>
            <img
              className='w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-300'
              src={group.avatar && group.avatar !== 'null' ? group.avatar : ''}
              alt={group.name}
            />
            <p className='text-2xl font-semibold text-gray-900 text-center mb-2'>{group.name}</p>
            <button
              className='text-gray-500 font-medium text-sm hover:text-gray-700 transition-all'
              onClick={() => setIsModalOpen(true)}
            >
              {group.users?.length || 0} members
            </button>
          </div>
          <div className='ml-11'>
            <div className='flex items-center space-x-2'>
              {isMember && (
                <button
                  className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-lg px-5 py-2.5 text-center me-2'
                  onClick={() => setIsPopupCreatePostOpen(true)}
                >
                  New Post
                  <FontAwesomeIcon icon={faPlus} className='ml-2' />
                </button>
              )}
              <button
                className={`text-white  hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-semibold  rounded-lg px-5 py-2.5 text-center me-2 ${
                  isMember
                    ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 focus:ring-red-300 dark:focus:ring-red-800'
                    : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 focus:ring-green-300 dark:focus:ring-green-800'
                }`}
                onClick={() => (isMember ? handleLeaveGroup(group.id) : handleJoinGroup(group.id))}
              >
                {isMember ? 'Leave' : 'Join'}
                {isMember ? (
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className='ml-2' />
                ) : (
                  <FontAwesomeIcon icon={faHandPointLeft} className='ml-2' />
                )}
              </button>
            </div>
          </div>
        </>
      )
    }
  }

  const showPopupCreatePost = () => {
    return (
      <div className='fixed z-40 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div
            className='fixed inset-0 transition-opacity'
            aria-hidden='true'
            onClick={() => setIsPopupCreatePostOpen(false)}
          >
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            &#8203;
          </span>
          <div
            className='  xl:p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <div className='grid grid-flow-row justify-center items-center'>
              <h1 className='text-2xl font-bold'>Create Post in {group?.name}</h1>
              <div className=' w-full mx-auto'>
                <form className='grid grid-flow-row mx-2'>
                  <div className='grid grid-flow-row'>
                    <label htmlFor='title'>Title</label>
                    <input
                      type='text'
                      id='title'
                      className='border border-gray-400 rounded-md p-2'
                      value={postData.title}
                      onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                    />
                  </div>
                  <div className='grid grid-flow-row'>
                    <label htmlFor='content'>Content</label>
                    <textarea
                      id='content'
                      className='border border-gray-400 rounded-md p-2'
                      value={postData.description}
                      onChange={(e) =>
                        setPostData({
                          ...postData,
                          description: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className='grid grid-flow-row'>
                    <label htmlFor='media'>Image</label>
                    <input
                      type='file'
                      id='media'
                      className='border border-gray-400 rounded-md p-2'
                      onChange={(e) => setSelectedMedia(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>

                  <div className='grid grid-flow-row'>
                    <button
                      type='button'
                      onClick={handleSubmit}
                      className='bg-blue-500 text-white py-2 px-4 rounded-md mt-4'
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {isModalOpen && showGroupMembers()}
      {isPopupCreatePostOpen && showPopupCreatePost()}
      <div className='mx-auto'>
        <div className='flex flex-col bg-white rounded-md shadow-md'>
          {showGroupInfo()}
          <div className='m-4'>
            <div>
              {group &&
                postsInMyGroups &&
                postsInMyGroups.map((post: Post) => {
                  const updatedMedia = post.media
                    ? {
                        ...post.media,
                        link: post.media.link
                          .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                          .replace(/\\/g, '/')
                      }
                    : post.media

                  const updatedAvatar = post.user?.avatar
                    ? post.user.avatar.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
                    : post.user?.avatar
                  return (
                    <div className='overflow-hidden mx-2' key={post.id}>
                      <PostComponent
                        key={post.id}
                        post={{ ...post, media: updatedMedia, user: { ...post.user, avatar: updatedAvatar } }}
                      />
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsProfilePage
