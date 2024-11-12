import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Post, User } from '../../../types'
import { fetchPosts, createPost } from '../../redux/slice/postSlice'
import PostComponent from '../../components/Post'

import { AppDispatch } from '../../redux/store'

const ListPost = ({ newPost }: { newPost: Post | null }) => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: any) => state.posts.posts)
  const loading = useSelector((state: any) => state.posts.loading)
  const error = useSelector((state: any) => state.posts.error)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  useEffect(() => {
    if (newPost) {
      console.log('New post added:', newPost)
    }
  }, [newPost])

  if (loading) {
    return <p>Loading posts...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (posts.length === 0) {
    return <p>No posts available.</p>
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  )
}

const FeedPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: any) => state.posts.posts || [])
  const loading = useSelector((state: any) => state.posts.loading)
  const error = useSelector((state: any) => state.posts.error)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  if (loading) return <p>Loading posts...</p>
  if (error) return <p>{error}</p>
  if (posts.length === 0) return <p>No posts available.</p>

  return (
    <div>
      {posts.map((post: Post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  )
}

export default FeedPage
