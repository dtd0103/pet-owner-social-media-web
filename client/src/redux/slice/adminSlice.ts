import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { Report, User } from '../../../types'

const getAccessToken = () => localStorage.getItem('access_token')

const API_BASE_URL = 'http://localhost:3001/api/v1'

const fetchData = async (endpoint: string) => {
  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token found')
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data || []
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return []
    }
    throw error
  }
}

export const fetchPets = createAsyncThunk('admin/fetchPets', async () => {
  return await fetchData('pets/all')
})

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  return await fetchData('users/all')
})

export const fetchPosts = createAsyncThunk('admin/fetchPosts', async () => {
  return await fetchData('posts/all')
})

export const fetchReports = createAsyncThunk('admin/fetchReports', async () => {
  return await fetchData('reports/all')
})

export const fetchComments = createAsyncThunk('admin/fetchComments', async () => {
  return await fetchData('comments/all')
})

export const fetchGroups = createAsyncThunk('admin/fetchGroups', async () => {
  return await fetchData('groups/all')
})

export const processReport = createAsyncThunk(
  'admin/processReport',
  async ({ reportId, status }: { reportId: string; status: string }) => {
    const token = getAccessToken()
    const response = await axios.patch(
      `${API_BASE_URL}/reports/${reportId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    console.log(response)
    return { reportId, status: response.data.reportStatus }
  }
)

export const banUser = createAsyncThunk('admin/banUser', async (userId: string) => {
  const token = getAccessToken()
  const response = await axios.put(
    `${API_BASE_URL}/users/${userId}`,
    { status: 0 },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return { userId, status: response.data.status }
})

export const unbanUser = createAsyncThunk('admin/unbanUser', async (userId: string) => {
  const token = getAccessToken()
  const response = await axios.put(
    `${API_BASE_URL}/users/${userId}`,
    { status: 1 },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return { userId, status: response.data.status }
})

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId: string) => {
  const token = getAccessToken()
  await axios.delete(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return userId
})

export const changeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({ userId, role }: { userId: string; role: string }) => {
    const token = getAccessToken()
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return { userId, role: response.data.role }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pets: [],
    users: [] as User[],
    posts: [],
    reports: [] as Report[],
    comments: [],
    groups: [],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false
        state.pets = action.payload
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(fetchReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false
        state.groups = action.payload
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(processReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(processReport.fulfilled, (state, action) => {
        state.loading = false
        console.log(action.payload)
        const { reportId, status } = action.payload
        const report = state.reports.find((r) => r.id === reportId)
        if (report) {
          report.reportStatus = status
        }
      })
      .addCase(processReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(banUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.loading = false
        const { userId, status } = action.payload
        const user = state.users.find((u) => u.id === userId) as User
        if (user) {
          user.status = status
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(unbanUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.loading = false
        const { userId, status } = action.payload
        const user = state.users.find((u) => u.id === userId)
        if (user) {
          user.status = status
        }
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((user) => user.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(changeUserRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.loading = false
        const { userId, role } = action.payload
        const user = state.users.find((u) => u.id === userId)
        if (user) {
          user.role = role
        }
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
  }
})

export default adminSlice.reducer
