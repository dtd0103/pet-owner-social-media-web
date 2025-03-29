import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { UserDetail } from '../../../types'
import { fetchMyProfile, fetchUsersById, fetchPostsByUserId, fetchMyPets, fetchMyFriends } from '../../api'

interface UserState {
  user: UserDetail | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchUser = createAsyncThunk('user/fetchUserById', async (userId: string) => {
  const response = await fetchUsersById(userId)
  return response
})

export const addUser = createAsyncThunk('user/addUser', async (newUser: Partial<UserDetail>) => {
  const response = await axios.post('http://localhost:3001/api/v1/users', newUser)
  return response.data
})

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (
    {
      userId,
      name,
      email,
      tel,
      avatar,
      background,
      quote
    }: {
      userId: string
      name: string
      email: string
      tel: string
      avatar: File | null
      background: File | null
      quote: string
    },
    thunkAPI
  ) => {
    try {
      const formData = new FormData()
      const formDataB = new FormData()

      if (avatar) {
        formData.append('avatar', avatar)
        await axios.post('http://localhost:3001/api/v1/users/avatar', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      }

      if (background) {
        formDataB.append('background', background)
        await axios.post('http://localhost:3001/api/v1/users/background', formDataB, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      }

      const response = await axios.put(
        `http://localhost:3001/api/v1/users/${userId}`,
        { name, email, tel, quote },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update profile')
      } else {
        return thunkAPI.rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
    const response = await axios.put(
      `http://localhost:3001/api/v1/users/${userId}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    )
    return response.data
  }
)

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId: string) => {
  await axios.delete(`http://localhost:3001/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return userId
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null
      state.isLoading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserDetail>) => {
        state.isLoading = false
        if (action.payload.avatar) {
          action.payload.avatar = formatMediaLink(action.payload.avatar)
        }
        if (action.payload.background) {
          action.payload.background = formatMediaLink(action.payload.background)
        }
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Could not fetch user'
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<UserDetail>) => {
        state.user = action.payload
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.avatar) {
          action.payload.avatar = formatMediaLink(action.payload.avatar)
        }

        if (action.payload.background) {
          action.payload.background = formatMediaLink(action.payload.background)
        }
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'Update failed'
        }
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null
      })
  }
})

export const { resetUserState } = userSlice.actions
export default userSlice.reducer
