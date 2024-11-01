import { useEffect, useState } from 'react'
import Comment from '../Comment'
import { fetchCommentsByPostId } from '../../api'
import { Link } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'
import axios from 'axios'

const ListComment = ({ postId }) => {
  const [listComment, setListComment] = useState([])
  const [newComment, setNewComment] = useState('')
  const accessToken = localStorage.getItem('access_token')

  useEffect(() => {
    if (!accessToken) {
      window.location.href = '/sign-in'
    }

    const fetchData = async () => {
      const response = await fetchCommentsByPostId(postId)
      setListComment(response)
    }

    fetchData()
  }, [postId])

  const submitComment = async () => {
    if (!newComment) {
      alert('Please enter your comment')
      return
    }

    try {
      await axios.post(
        'http://localhost:3001/api/v1/comments',
        { post_id: postId, comment: newComment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      // Refetch comments after submission
      const updatedComments = await fetchCommentsByPostId(postId)
      setListComment(updatedComments)
      setNewComment('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  return (
    <section className='bg-white py-8 lg:py-16 antialiased'>
      <div className='max-w-2xl mx-auto px-4'>
        <h2 className='text-lg lg:text-2xl font-bold text-gray-900'>Discussion ({listComment.length})</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitComment()
          }}
          className='mb-6'
        >
          <textarea
            id='comment'
            rows={2}
            className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none'
            placeholder='Write a comment...'
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type='submit'
            className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center bg-blue-400 rounded-lg hover:bg-blue-700'
          >
            Post comment
          </button>
        </form>
        {listComment.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </section>
  )
}

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [liked, setLiked] = useState(false)
  const [totalLikes, setTotalLikes] = useState(post.likes.length || 0)
  const postCreatedAt = new Date(post.created_at)

  useEffect(() => {
    const checkOwner = async () => {
      const currentUser = await checkJwt()
      if (currentUser && currentUser.id === post.user.id) {
        setIsOwner(true)
      }
    }
    checkOwner()
  }, [post])

  const likePost = async () => {
    try {
      await axios.post(
        `http://localhost:3001/api/v1/posts/${post.id}/like`,
        { post_id: post.id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )

      setLiked((prev) => !prev)
      setTotalLikes((prev) => (liked ? prev - 1 : prev + 1))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className='flex bg-white shadow-lg rounded-lg m-1'>
      <div className='flex-row w-full items-start px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-end'>
            <Link to={`/profile/${post.user.id}`}>
              <img
                className='w-16 h-16 rounded-xl object-cover mr-4 shadow'
                src={post.user.avatar || './default-avatar.png'}
                alt='User Avatar'
              />
            </Link>
            <div>
              <Link to={`/profile/${post.user.id}`}>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {post.user.first_name} {post.user.last_name}
                </h2>
              </Link>
              <span className='text-sm text-gray-700'>
                {postCreatedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => console.log('Edit Post')}>
              <img src='edit-icon-url' alt='Edit' />
            </button>
          )}
        </div>
        <p className='mt-3 text-gray-700 font-bold'>{post.title}</p>
        <p className='mt-3 text-gray-700'>{post.description}</p>
        {post.media && (
          <img src={post.media.link} alt='Post Media' className='w-full h-full object-cover rounded-lg max-h-screen' />
        )}
        <div className='mt-4 flex items-center'>
          <button onClick={likePost} className='mr-2'>
            <img src={liked ? 'liked-icon-url' : 'like-icon-url'} alt='Like' />
          </button>
          <span>{totalLikes}</span>
          <button onClick={() => setShowComments((prev) => !prev)} className='ml-4'>
            Comments
          </button>
        </div>
        {showComments && <ListComment postId={post.id} />}
      </div>
    </div>
  )
}

export default Post
