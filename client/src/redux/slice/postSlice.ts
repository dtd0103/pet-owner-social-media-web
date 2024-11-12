import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Post } from '../../../types'
import { fetchPostsByUserId, fetchPostsRecommendation } from '../../api'

interface PostsState {
  posts: Post[]
  loading: boolean
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
}
const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetchPostsRecommendation()
  return response
})

export const fetchPostsByUser = createAsyncThunk('posts/fetchPostsByUser', async (userId: string) => {
  const response = await fetchPostsByUserId(userId)
  return response
})

export const createPost = createAsyncThunk('posts/createPost', async (postData: FormData) => {
  const response = await axios.post('http://localhost:3001/api/v1/posts', postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
})

export const deletePost = createAsyncThunk('posts/deletePost', async (postId: string) => {
  await axios.delete(`http://localhost:3001/api/v1/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return postId
})

export const likePost = createAsyncThunk('posts/likePost', async (postId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/posts/${postId}/like`,
    { post_id: postId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }
  )
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts = [action.payload, ...state.posts]
    },
    removePostLocal: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },
    setLikedStatus: (
      state,
      action: PayloadAction<{ postId: string; liked: boolean; userId: string; userName: string }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId)
      if (post) {
        if (action.payload.liked) {
          post.likes?.push({ id: action.payload.userId, name: action.payload.userName })
        } else {
          post.likes = post.likes?.filter((user) => user.id !== action.payload.userId)
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.map((post: Post) => {
          const formattedAvatar = post.user.avatar ? formatMediaLink(post.user.avatar) : '/default_avatar.jpg'

          return {
            ...post,
            media: post.media ? { ...post.media, link: formatMediaLink(post.media.link) } : null,
            user: {
              ...post.user,
              avatar: formattedAvatar
            }
          }
        })
      })

      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load posts'
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.map((post: Post) => {
          const formattedAvatar = post.user.avatar ? formatMediaLink(post.user.avatar) : '/default_avatar.jpg'
          return {
            ...post,
            media: post.media ? { ...post.media, link: formatMediaLink(post.media.link) } : null,
            user: {
              ...post.user,
              avatar: formattedAvatar
            }
          }
        })
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load posts'
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const newPost = Array.isArray(action.payload) ? action.payload : [action.payload]

        state.posts = [...newPost, ...state.posts]

        state.posts = state.posts.map((post: Post) => ({
          ...post,

          media: post.media ? { ...post.media, link: formatMediaLink(post.media.link) } : undefined,

          user: post.user
            ? { ...post.user, avatar: post.user.avatar ? formatMediaLink(post.user.avatar) : undefined }
            : post.user
        }))
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create post'
      })
  }
})

export const { addPost, removePostLocal, setLikedStatus } = postsSlice.actions
export default postsSlice.reducer
