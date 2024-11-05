import { useEffect, useState } from 'react'
import { Post, User } from '../../../types'
import { fetchPostsRecommendation } from '../../api'
import PostComponent from '../../components/Post'
import { checkJwt } from '../../../utils/auth'

type Response = {
  data: Post[]
}

const ListPost = () => {
  const [listPost, setListPost] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response: Response = await fetchPostsRecommendation() 

        if (Array.isArray(response) && response.length > 0) {
          setListPost(response)
        } else {
          console.error('No posts found in the response:', response)
          setListPost([])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError('Could not fetch posts.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>Loading posts...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (listPost.length === 0) {
    return <p>No posts available.</p>
  }

  return (
    <div>
      {listPost.map((post: Post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  )
}

const FeedPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  return <ListPost />
}

export default FeedPage
