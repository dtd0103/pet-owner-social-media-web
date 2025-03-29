import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchPostById } from '../../redux/slice/postSlice'
import PostComponent from '../../components/Post'

import { AppDispatch } from '../../redux/store'

const PostPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { post, loading, error } = useSelector((state: any) => state.posts)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id))
    }
  }, [dispatch, id])

  const updatedPost = post && {
    ...post,
    user: {
      ...post.user,
      avatar: post.user.avatar
        ? post.user.avatar.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
        : null
    },
    media: {
      ...post.media,
      link: post.media.link
        ? post.media.link.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
        : null
    }
  }

  console.log(updatedPost)

  if (loading) return <p>Loading post...</p>
  if (error) return <p>{error}</p>

  return <div className='mx-auto w-1/2 mt-16'>{updatedPost && <PostComponent post={updatedPost} />}</div>
}

export default PostPage
