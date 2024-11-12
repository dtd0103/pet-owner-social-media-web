import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { fetchCommentsByPostId as fetchComments } from '../../api'
import { Comment } from '../../../types'

interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchCommentsByPostId = createAsyncThunk('comments/fetchCommentsByPostId', async (postId: string) => {
  const response = await fetchComments(postId)

  return response.map((comment: Comment) => ({
    ...comment,
    media: comment.media ? { ...comment.media, link: formatMediaLink(comment.media.link) } : null,
    user: {
      ...comment.user,
      avatar: comment.user.avatar ? formatMediaLink(comment.user.avatar) : null
    }
  }))
})
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      const comment = action.payload
      if (comment.media && comment.media.link) {
        comment.media.link = formatMediaLink(comment.media.link)
      }

      if (comment.user.avatar) {
        comment.user.avatar = formatMediaLink(comment.user.avatar)
      }
      state.comments.unshift(comment)
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter((comment) => comment.id !== action.payload)
    },
    editComment: (state, action: PayloadAction<Comment>) => {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
      if (index !== -1) {
        const updatedComment = action.payload

        if (updatedComment.media && updatedComment.media.link) {
          updatedComment.media.link = formatMediaLink(updatedComment.media.link)
        }
        if (updatedComment.user.avatar) {
          updatedComment.user.avatar = formatMediaLink(updatedComment.user.avatar)
        }
        state.comments[index] = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load comments'
      })
  }
})

export const { addComment, removeComment, editComment } = commentsSlice.actions
export default commentsSlice.reducer
