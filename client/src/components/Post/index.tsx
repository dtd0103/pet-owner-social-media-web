import { useEffect, useState } from 'react'
import CommentComponent from '../Comment'
import type { Comment } from '../../../types'
import { fetchCommentsByPostId } from '../../api'
import { Link } from 'react-router-dom'
import { checkJwt } from '../../../utils/auth'
import type { Post as PostType } from '../../../types'
import defaultAvatar from '/default_avatar.jpg'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import './Post.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart, faComment, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'

const ListComment = ({ postId }: { postId: string }) => {
  const [listComment, setListComment] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const accessToken = localStorage.getItem('access_token')

  useEffect(() => {
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
          <CommentComponent key={comment.id} {...comment} />
        ))}
      </div>
    </section>
  )
}

const Post = ({ post }: { post: PostType }) => {
  const [showComments, setShowComments] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [liked, setLiked] = useState(false)
  const [totalLikes, setTotalLikes] = useState(post.likes?.length || 0)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  useEffect(() => {
    const checkOwner = async () => {
      const currentUser = await checkJwt()
      if (currentUser && currentUser.id === post.user.id) {
        setIsOwner(true)
      }
    }
    checkOwner()
  }, [post])

  const getPostDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/posts/${post.id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post details:', error)
    }
  }

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
                <h2 className='text-lg font-semibold text-gray-900'>{post.user.name}</h2>
              </Link>
              <span className='text-sm text-slate-400'>
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Invalid date'}
              </span>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => console.log('Edit Post')}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span className='ml-2'>Edit</span>
            </button>
          )}
        </div>
        <p className='mt-3 text-gray-700 font-bold'>{post.title}</p>
        <p className={`mt-3 text-gray-700 ${isExpanded ? 'line-clamp-none' : 'line-clamp-3'}`}>{post.description}</p>
        <div className='flex justify-between items-center'>
          {!isExpanded && post.description.length > 100 && (
            <button className='text-blue-500 mt-2' onClick={toggleExpand}>
              More...
            </button>
          )}
          {isExpanded && (
            <button className='text-slate-400 mt-2' onClick={toggleExpand}>
              Shorten
            </button>
          )}
        </div>

        {post.media && (
          <img src={post.media.link} alt='Post Media' className='w-full object-cover rounded-lg max-h-screen' />
        )}
        <div className='mt-4 flex items-center'>
          <button onClick={likePost} className='mr-2'>
            <FontAwesomeIcon icon={liked ? fasHeart : farHeart} className='text-red-500' />
          </button>
          <span>{totalLikes}</span>
          <button onClick={() => setShowComments((prev) => !prev)} className='ml-4'>
            <FontAwesomeIcon icon={faComment} />
            <span className='ml-2'>Comments</span>
          </button>
        </div>
        {showComments && <ListComment postId={post.id} />}
      </div>
    </div>
  )
}

export default Post
