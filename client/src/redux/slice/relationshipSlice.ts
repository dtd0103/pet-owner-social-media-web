import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Relationship, User } from '../../../types'

interface RelationshipState {
  relationships: Relationship[]
  friends: Relationship[]
  recommendedFriends: User[]
  pendingRequests: Relationship[]
  loading: boolean
  error: string | null
}

const initialState: RelationshipState = {
  relationships: [],
  friends: [],
  recommendedFriends: [],
  pendingRequests: [],
  loading: false,
  error: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchAllRelationships = createAsyncThunk('relationships/fetchAll', async () => {
  const response = await axios.get('http://localhost:3001/api/v1/relationships', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })
  return response.data
})

export const fetchRecommendedFriends = createAsyncThunk('relationships/fetchRecommended', async () => {
  const response = await axios.get('http://localhost:3001/api/v1/relationships/recommended', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })

  const recommendedFriends = response.data.map((user: User) => {
    if (user.avatar) {
      user.avatar = formatMediaLink(user.avatar)
    }
    return user
  })

  return recommendedFriends
})

export const getFriends = createAsyncThunk<Relationship[], string>(
  'relationships/getFriends',
  async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/relationships/friends/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      console.log(response)
      return response.data
    } catch (error) {
      return []
    }
  }
)

export const fetchPendingRequests = createAsyncThunk('relationships/fetchPendingRequests', async (userId: string) => {
  const response = await axios.get(`http://localhost:3001/api/v1/relationships/pending/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })

  return response.data
})

export const sendFriendRequest = createAsyncThunk('relationships/sendFriendRequest', async (friendId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/relationships/add-friend/${friendId}`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
  )
  return response.data
})

export const acceptFriendRequest = createAsyncThunk('relationships/acceptFriendRequest', async (friendId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/relationships/accept-friend/${friendId}`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
  )
  return response.data
})

export const cancelFriendRequest = createAsyncThunk('relationships/cancelFriendRequest', async (friendId: string) => {
  const response = await axios.delete(`http://localhost:3001/api/v1/relationships/cancel-friend/${friendId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })
  return response.data
})

export const rejectFriendRequest = createAsyncThunk('relationships/rejectFriendRequest', async (friendId: string) => {
  const response = await axios.delete(
    `http://localhost:3001/api/v1/relationships/reject-friend/${friendId}`,

    {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
  )
  return response.data
})

export const blockFriend = createAsyncThunk('relationships/blockFriend', async (friendId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/relationships/block-friend/${friendId}`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
  )
  return response.data
})

export const unblockFriend = createAsyncThunk('relationships/unblockFriend', async (friendId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/relationships/unblock-friend/${friendId}`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
  )
  return response.data
})

export const unfriend = createAsyncThunk('relationships/unfriend', async (friendId: string) => {
  const response = await axios.delete(`http://localhost:3001/api/v1/relationships/unfriend/${friendId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })
  return response.data
})

const relationshipsSlice = createSlice({
  name: 'relationships',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRelationships.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllRelationships.fulfilled, (state, action: PayloadAction<Relationship[]>) => {
        state.loading = false
        state.relationships = action.payload
      })
      .addCase(fetchAllRelationships.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch relationships'
      })
      .addCase(fetchRecommendedFriends.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecommendedFriends.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.recommendedFriends = action.payload
      })
      .addCase(fetchRecommendedFriends.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch recommended friends'
      })
      .addCase(getFriends.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFriends.fulfilled, (state, action: PayloadAction<Relationship[]>) => {
        state.loading = false
        state.friends = action.payload.map((relationship) => {
          if (relationship.friend.avatar) {
            relationship.friend.avatar = formatMediaLink(relationship.friend.avatar)
          }
          return relationship
        })
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch friends'
      })
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action: PayloadAction<Relationship[]>) => {
        state.loading = false
        state.pendingRequests = action.payload.map((relationship) => {
          if (relationship.friend.avatar) {
            relationship.friend.avatar = formatMediaLink(relationship.friend.avatar)
          }
          return relationship
        })
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch pending requests'
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        if (action.payload.success) {
          alert('Friend request sent successfully')
          state.pendingRequests.push(action.payload)
        }
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const pendingIndex = state.pendingRequests.findIndex((rel) => rel.id === action.payload.id)
        if (pendingIndex !== -1) {
          state.pendingRequests.splice(pendingIndex, 1)
        }
        state.friends.push(action.payload)
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter((rel) => rel.id !== action.payload.id)
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter((rel) => rel.id !== action.payload.id)
      })
      .addCase(blockFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter((rel) => rel.id !== action.payload.id)
      })
      .addCase(unblockFriend.fulfilled, (state, action) => {
        state.friends.push(action.payload)
      })
      .addCase(unfriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter((rel) => rel.friend.id !== action.payload.id)
      })
  }
})

export default relationshipsSlice.reducer
