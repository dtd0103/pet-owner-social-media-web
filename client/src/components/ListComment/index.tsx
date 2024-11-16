import { useEffect, useState } from 'react'
import CommentComponent from '../Comment'
import { fetchCommentsByPostId, addComment } from '../../redux/slice/commentSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const ListComment = ({ postId }: { postId: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const allComments = useSelector((state: RootState) => state.comments.comments)
  const comments = allComments.filter((comment) => comment.post.id === postId)
  const [newComment, setNewComment] = useState('')
  const accessToken = localStorage.getItem('access_token')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = () => {
    document.getElementById('image-comment')?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCommentsByPostId(postId))
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }

    fetchData()
  }, [postId, dispatch])

  const submitComment = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!newComment) {
      alert('Please enter your comment')
      return
    }

    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('text', newComment)

    if (selectedFile) {
      const fileNameWithExtension = `${newComment.replace(/\s+/g, '_').toLowerCase()}.${selectedFile.name.split('.').pop()}`
      formData.append('media', selectedFile, fileNameWithExtension)
    }

    try {
      const response = await axios.post('http://localhost:3001/api/v1/comments', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      dispatch(addComment(response.data))

      setNewComment('')
      setSelectedFile(null)
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  return (
    <section className='bg-white py-2 antialiased'>
      <div className='max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-900'>Comment ({comments.length})</h2>
        <form onSubmit={submitComment} className='mb-6'>
          <textarea
            id='comment'
            rows={4}
            className='px-0 w-full text-sm text-gray-900 border-2 rounded-md focus:ring-0 focus:outline-none focus:border-slate-500'
            placeholder='Write a comment...'
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type='button' className='text-gray-500 hover:text-blue-500' onClick={handleFileUpload}>
            <FontAwesomeIcon icon={faPhotoFilm} /> Photo/ Video
          </button>
          {selectedFile && <p className='text-sm mt-2 block'>{selectedFile.name}</p>}
          <input
            type='file'
            id='image-comment'
            accept='.jpg,.png,.jpeg,.mp4,.avi,video/*'
            className='hidden'
            onChange={handleFileChange}
          />
          <button
            type='submit'
            className='text-white block mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2'
          >
            Post comment
          </button>
        </form>
        {comments.map((comment) => (
          <CommentComponent key={comment.id} initialComment={comment} />
        ))}
      </div>
    </section>
  )
}

export default ListComment
