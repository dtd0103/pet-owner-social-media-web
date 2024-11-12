import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { Group, Post, UserGroup } from '../../../types'
import {
  fetchGroupsSearch,
  fetchMyGroups,
  fetchPostsByUserGroups,
  fetchGroupsById,
  fetchPostsByGroupId
} from '../../api'
import { checkJwt } from '../../../utils/auth'

interface GroupState {
  group: Group | null
  listGroups: Group[]
  myGroups: UserGroup[]
  searchResult: Group[]
  postsInMyGroups: Post[]
  isLoading: boolean
  error: string | null
}

const initialState: GroupState = {
  group: null,
  listGroups: [],
  myGroups: [],
  searchResult: [],
  postsInMyGroups: [],
  isLoading: false,
  error: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchCurrentUser = createAsyncThunk('groups/fetchCurrentUser', async () => {
  return await checkJwt()
})

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async (query: string = '') => {
  const response = await fetchGroupsSearch(query)
  return response.data
})

export const fetchMyGroupsS = createAsyncThunk('groups/fetchMyGroupsS', async () => {
  const response = await fetchMyGroups()

  return response
})

export const fetchGroupsByIdS = createAsyncThunk('groups/fetchGroupsByIdS', async (id: string) => {
  const response = await fetchGroupsById(id)
  return response
})

export const fetchPostsInGroups = createAsyncThunk('groups/fetchPostsInMyGroups', async (id: string) => {
  return await fetchPostsByGroupId(id)
})

export const createGroupS = createAsyncThunk(
  'groups/createGroupS',
  async ({ name, avatar }: { name: string; avatar: File }) => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('avatar', avatar)

    const response = await axios.post('http://localhost:3001/api/v1/groups', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
)

export const joinGroup = createAsyncThunk('groups/joinGroup', async (groupId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/groups/${groupId}/join`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  )
  return response.data
})

export const leaveGroup = createAsyncThunk('groups/leaveGroup', async (groupId: string) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/groups/${groupId}/leave`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  )
  return response.data
})

export const editGroupS = createAsyncThunk(
  'groups/editGroupS',
  async ({ groupId, name, avatar }: { groupId: string; name: string; avatar: File | null }) => {
    const formData = new FormData()
    formData.append('name', name)
    if (avatar) {
      formData.append('avatar', avatar)
    }

    const response = await axios.put(`http://localhost:3001/api/v1/groups/${groupId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
)

export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (groupId: string) => {
  await axios.delete(`http://localhost:3001/api/v1/groups/${groupId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  })
  return groupId
})

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false
        state.searchResult = action.payload.map((group: Group) => ({
          ...group,
          avatar: group.avatar ? formatMediaLink(group.avatar) : group.avatar
        }))
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(fetchMyGroupsS.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyGroupsS.fulfilled, (state, action) => {
        state.isLoading = false
        state.myGroups = action.payload.map((group: Group) => ({
          ...group,
          avatar: group.avatar ? formatMediaLink(group.avatar) : group.avatar
        }))
      })
      .addCase(fetchMyGroupsS.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(fetchGroupsByIdS.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGroupsByIdS.fulfilled, (state, action) => {
        state.isLoading = false
        state.group = action.payload
        if (state.group?.avatar) {
          state.group.avatar = formatMediaLink(state.group.avatar)
        }
        if (state.group?.users) {
          state.group.users = state.group.users.map((user) => {
            if (user.avatar) {
              user.avatar = formatMediaLink(user.avatar)
            }
            return user
          })
        }
      })
      .addCase(fetchGroupsByIdS.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(fetchPostsInGroups.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPostsInGroups.fulfilled, (state, action) => {
        state.isLoading = false
        state.postsInMyGroups = action.payload
      })
      .addCase(fetchPostsInGroups.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(createGroupS.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createGroupS.fulfilled, (state, action) => {
        state.isLoading = false
        state.myGroups.push(action.payload)
      })
      .addCase(createGroupS.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(joinGroup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.myGroups.push(action.payload)
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(leaveGroup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.myGroups = state.myGroups.filter((group) => group.id !== action.payload.id)
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(editGroupS.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editGroupS.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.myGroups.findIndex((group) => group.id === action.payload.id)
        if (index !== -1) state.myGroups[index] = action.payload
      })
      .addCase(editGroupS.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.myGroups = state.myGroups.filter((group) => group.id !== action.payload)
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
  }
})

export default groupSlice.reducer
