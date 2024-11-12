import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkJwt } from '../../../utils/auth'
import defaultAvatar from '/default_avatar.jpg'
import { formatDistanceToNow } from 'date-fns'
import axios, { AxiosError } from 'axios'
import { RootState } from '../../redux/store'
import { addComment, editComment, removeComment } from '../../redux/slice/commentSlice'
import { useEffect, useState } from 'react'
import { Comment } from '../../../types'

const CommentComponent = ({ initialComment }: { initialComment: Comment }) => {
  const dispatch = useDispatch()

  const commentsState = useSelector((state: RootState) => state.comments)

  const [editedText, setEditedText] = useState(initialComment.text)
  const [file, setFile] = useState<File | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [comment, setComment] = useState<Comment>(initialComment)

  const [replyToComment, setReplyToComment] = useState<Comment | null>(null)

  useEffect(() => {
    if (initialComment.replied_comment_id) {
      const fetchReplyComment = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/v1/comments/${initialComment.replied_comment_id}`)
          setReplyToComment(response.data)
        } catch (error) {
          console.error('Error fetching replied comment:', error)
        }
      }
      fetchReplyComment()
    }
  }, [initialComment.replied_comment_id])

  useEffect(() => {
    setComment(initialComment)
  }, [initialComment])

  useEffect(() => {
    const checkOwner = async () => {
      const currentUser = await checkJwt()
      if (currentUser && currentUser.id === initialComment.user.id) {
        setIsOwner(true)
      }
    }
    checkOwner()
  }, [initialComment])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleEdit = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')

      const formData = new FormData()
      formData.append('text', editedText)

      if (file) {
        formData.append('media', file)
      }

      const response = await axios.put(`http://localhost:3001/api/v1/comments/${initialComment.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      dispatch(editComment(response.data))
      setComment(response.data)
      setIsEditing(false)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        console.error('Error editing comment:', axiosError.response.data)
      } else {
        console.error('Error editing comment:', axiosError.message)
      }
    }
  }

  const handleRemove = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this comment?')

    if (!isConfirmed) {
      return
    }

    try {
      const accessToken = localStorage.getItem('access_token')
      await axios.delete(`http://localhost:3001/api/v1/comments/${initialComment.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      dispatch(removeComment(initialComment.id))
      alert('Comment deleted successfully.')
    } catch (error) {
      console.error('Error removing comment:', error)
      alert('Failed to delete comment. Please try again later.')
    }
  }

  const handleReply = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const data = {
        postId: initialComment.post.id,
        text: replyText,
        media: {},
        repliedCommentId: initialComment.id
      }

      const response = await axios.post(`http://localhost:3001/api/v1/comments`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      dispatch(addComment(response.data))
      setReplyText('')
      setIsReplying(false)
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  return (
    <article className='px-5 py-3 m-2 text-base bg-white rounded-lg border'>
      <section className='flex justify-between items-center mb-2'>
        <div className='flex w-full justify-between'>
          <Link to={`/profile/${initialComment.user.id}`} className='flex items-center'>
            <img
              className='mr-2 w-12 h-12 rounded-full object-cover'
              src={initialComment.user.avatar || defaultAvatar}
              alt={initialComment.user.name}
            />
            <p className='inline-flex items-center ml-2 mb-2 text-xl font-semibold'>{initialComment.user.name}</p>
          </Link>
          <p className='mt-1 text-gray-600'>
            <time>{formatDistanceToNow(new Date(initialComment.createdAt), { addSuffix: true })}</time>
          </p>
        </div>
      </section>
      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className='w-full mt-2 p-2 border rounded'
          />
          <input type='file' onChange={handleFileChange} className='mt-2' />
          <button onClick={handleEdit} className='mt-2 bg-blue-500 text-white px-3 py-1 rounded'>
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className='mt-2 bg-gray-500 text-white px-3 py-1 rounded'>
            Cancel
          </button>
        </div>
      ) : (
        <p className='text-gray-900 text-xl font-semibold mt-4'>{initialComment.text}</p>
      )}

      {initialComment.media && initialComment.media.type === 'image' && (
        <img src={initialComment.media.link} alt='Comment Media' className='w-1/3 object-contain rounded-lg' />
      )}

      {initialComment.media && initialComment.media.type === 'video' && (
        <video controls className='w-full rounded-lg'>
          <source src={initialComment.media.link} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}

      <div className='flex items-center mt-4 space-x-4'>
        <button
          type='button'
          className='flex items-center text-gray-500 hover:underline font-medium'
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </button>

        {isOwner && (
          <div className='flex items-center'>
            <span className='mb-2 font-extrabold text-slate-500 mr-3'>.</span>
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='flex items-center text-gray-500 hover:underline font-medium'
            >
              Edit
            </button>
          </div>
        )}

        {isOwner && (
          <div className='flex items-center'>
            <span className='mb-2 font-extrabold text-slate-500 mr-3'>.</span>
            <button
              type='button'
              onClick={handleRemove}
              className='flex items-center text-gray-500 hover:underline font-medium'
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {isReplying && (
        <div className='mt-4'>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder='Write your reply...'
            className='w-full p-2 border rounded'
          />
          <button onClick={handleReply} className='mt-2 bg-blue-500 text-white px-3 py-1 rounded'>
            Send Reply
          </button>
          <button onClick={() => setIsReplying(false)} className='mt-2 bg-gray-500 text-white px-3 py-1 rounded'>
            Cancel
          </button>
        </div>
      )}
    </article>
  )
}

export default CommentComponent
