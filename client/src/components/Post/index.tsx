import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'
import type { Post as PostType } from '../../../types'
import ListComment from '../ListComment'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import './Post.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart, faComment, faPenToSquare, faFlag } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart, faTrash, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'

import defaultAvatar from '/default_avatar.jpg'
import ReportModal from '../ReportModal'

const Post = ({ post }: { post: PostType }) => {
  const [showComments, setShowComments] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [totalLike, setTotalLike] = useState(post.likes?.length)
  const [isEditPost, setIsEditPost] = useState(false)
  const [postData, setPostData] = useState({
    title: post.title,
    description: post.description,
    media: post.media
  })
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)

  const handleReportClick = () => {
    setShowReportModal(true)
  }

  const closeReportModal = () => {
    setShowReportModal(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkJwt()
      if (user) {
        if (user.role === 'Admin') {
          setIsAdmin(true)
        }
        setIsOwner(user.id === post.user.id)
        setLiked(post.likes?.some((u) => u.id === user.id) || false)
      }
    }
    fetchUser()
  }, [post])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedMedia(file)
  }

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const likePost = async () => {
    try {
      await axios.post(
        `http://localhost:3001/api/v1/posts/${post.id}/like`,
        {
          post_id: post.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )

      const updatedPost = await axios.get(`http://localhost:3001/api/v1/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      setLiked(!liked)
      setTotalLike(updatedPost.data.likes.length)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const isLiked = async () => {
    const currentUser = await checkJwt()
    if (currentUser) {
      const likedPost = post.likes?.find((like) => {
        return like.id === currentUser.id
      })
      if (likedPost) {
        setLiked(true)
      }
    }
  }

  const handlerSubmitEdit = () => {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('description', postData.description)
    formData.append('media', selectedMedia as File)
    try {
      const res = axios
        .put('http://localhost:3001/api/v1/posts/' + post.id, formData, {
          headers: {
            'Content-Type': 'form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        .then((res) => {
          res.status === 200 && alert('Post created successfully')
          window.location.href = '/'
        })
    } catch (error) {
      console.log(error)
    }
  }
  const deletePost = async (id: string) => {
    try {
      const isConfirmed = confirm('Are you sure you want to delete this post?')
      if (!isConfirmed) return
      const res = await axios.delete('http://localhost:3001/api/v1/posts/' + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      res.status === 200 && alert('Post deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.log(error)
    }
  }
  const editPost = () => {
    return (
      <div className='fixed z-40 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setIsEditPost(false)}>
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            &#8203;
          </span>
          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <form className='xl:w-full xl:max-w-lg xl:p-4 m-2'>
              <div className='flex justify-between mb-2'>
                <h1 className='text-2xl font-bold text-gray-900'>Edit Post</h1>
                <button onClick={() => deletePost(post.id)} className='text-gray-500 hover:text-red-500'>
                  <FontAwesomeIcon icon={faTrash} className='mr-4' />
                </button>
              </div>
              <div className='grid grid-flow-row mt-2'>
                <label htmlFor='title' className='font-semibold'>
                  Title
                </label>
                <input
                  type='text'
                  id='title'
                  className='border border-gray-400 rounded-md p-2'
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />
              </div>
              <div className='grid grid-flow-row mt-2'>
                <label htmlFor='content' className='font-semibold'>
                  Content
                </label>
                <textarea
                  id='content'
                  className='border border-gray-400 rounded-md p-2'
                  value={postData.description}
                  onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                />
              </div>
              <div className='grid grid-flow-row mt-2'>
                <label htmlFor='image_post-edit' className='font-semibold'>
                  Media
                </label>
                <button
                  type='button'
                  className='text-gray-500 hover:text-blue-500 mr-auto mt-2'
                  onClick={() => {
                    document.getElementById('image_post-edit')?.click()
                  }}
                >
                  <FontAwesomeIcon icon={faPhotoFilm} /> Photo/ Video
                </button>
                <input
                  type='file'
                  id='image_post-edit'
                  accept='.jpg,.png,.jpeg,.mp4,.avi,video/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </div>
              {selectedMedia && <p className='text-sm mt-2'>{selectedMedia.name}</p>}
            </form>
            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none  sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => handlerSubmitEdit()}
              >
                Update
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => setIsEditPost(false)}
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
    <div className='flex px-2 mt-5 bg-white shadow-lg rounded-lg'>
      <div className='flex-row w-full items-start px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-end'>
            <Link to={`/profile/${post.user.id}`}>
              <img
                className='w-16 h-16 rounded-xl object-cover mr-4 shadow'
                src={post.user.avatar || defaultAvatar}
                alt='User Avatar'
              />
            </Link>
            <div>
              <Link to={`/profile/${post.user.id}`}>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {post.user.name}
                  {''}
                  {post.group?.id && (
                    <span className='text-md  ml-2'>
                      <FontAwesomeIcon icon={faCaretRight} className='mr-2' />
                      <Link to={`/groups/${post.group.id}`} className='hover:underline'>
                        {post.group.name}
                      </Link>
                    </span>
                  )}
                </h2>
              </Link>
              <span className='text-sm text-slate-400'>
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Invalid date'}
              </span>
            </div>
          </div>
          {(isOwner || isAdmin) && (
            <button onClick={() => setIsEditPost(true)}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span className='ml-2 font-semibold'>Edit</span>
            </button>
          )}
        </div>
        <p className='mt-3 text-gray-700 font-bold'>{post.title}</p>
        <p className={`mt-3 text-gray-700 ${isExpanded ? 'line-clamp-none' : 'line-clamp-3'}`}>{post.description}</p>
        <div className='flex justify-between items-center'>
          {!isExpanded && post.description.length > 100 && (
            <button className='text-blue-500 ' onClick={toggleExpand}>
              More...
            </button>
          )}
          {isExpanded && (
            <button className='text-slate-400 ' onClick={toggleExpand}>
              Short
            </button>
          )}
        </div>

        {post.media && post.media.type === 'image' && (
          <img src={post.media.link} alt='Post Media' className='w-full object-cover rounded-lg max-h-screen' />
        )}

        {post.media && post.media.type === 'video' && (
          <video controls className='w-full rounded-lg max-h-screen'>
            <source src={post.media.link} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}
        <div className='mt-4 flex items-center'>
          <button onClick={likePost} className='mr-2'>
            <FontAwesomeIcon icon={liked ? fasHeart : farHeart} className='text-red-500' />
          </button>
          <span>{totalLike}</span>
          <button onClick={() => setShowComments((prev) => !prev)} className='ml-4'>
            <FontAwesomeIcon icon={faComment} />
            <span className='ml-2'>Comments</span>
          </button>
          {!isOwner && (
            <button onClick={handleReportClick}>
              <FontAwesomeIcon icon={faFlag} className='ml-3' />
              <span className='ml-2'>Report</span>
            </button>
          )}
        </div>
        {showComments && <ListComment key={post.id} postId={post.id} />}
        {isEditPost ? editPost() : ''}
        {showReportModal && <ReportModal type='post' targetId={post.id} onClose={closeReportModal} />}
      </div>
    </div>
  )
}

export default Post
