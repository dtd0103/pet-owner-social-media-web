import { Report } from '../../../types'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

interface ReportState {
  reports: Report[]
  currentReport: Report | null
  loading: boolean
  error: string | null
}

const initialState: ReportState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null
}

export const fetchReports = createAsyncThunk('report/fetchReports', async (filterQuery: any) => {
  const response = await api.get('/reports', { params: filterQuery })
  return response.data
})

export const fetchReportsByUser = createAsyncThunk('report/fetchReportsByUser', async () => {
  const response = await api.get('/reports/user')
  return response.data
})

export const fetchReportById = createAsyncThunk('report/fetchReportById', async (reportId: string) => {
  const response = await api.get(`/reports/${reportId}`)
  return response.data
})

export const createPostReport = createAsyncThunk(
  'report/createPostReport',
  async ({ postId, reason }: { postId: string; reason: string }) => {
    const response = await api.post(`/reports/post/${postId}`, { reason })
    return response.data
  }
)

export const createUserReport = createAsyncThunk(
  'report/createUserReport',
  async ({ reportedUserId, reason }: { reportedUserId: string; reason: string }) => {
    const response = await api.post(`/reports/user/${reportedUserId}`, { reason })
    return response.data
  }
)

export const createCommentReport = createAsyncThunk(
  'report/createCommentReport',
  async ({ commentId, reason }: { commentId: string; reason: string }) => {
    const response = await api.post(`/reports/comment/${commentId}`, { reason })
    return response.data
  }
)

export const handleReport = createAsyncThunk(
  'report/handleReport',
  async ({ reportId, status }: { reportId: string; status: string }) => {
    const response = await api.patch(`/reports/${reportId}`, { status })
    return response.data
  }
)

export const deleteReport = createAsyncThunk('report/deleteReport', async (reportId: string) => {
  await api.delete(`/reports/${reportId}`)
  return reportId
})

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false
        state.reports = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch reports'
      })
      .addCase(fetchReportById.fulfilled, (state, action: PayloadAction<Report>) => {
        state.currentReport = action.payload
      })
      .addCase(fetchReportsByUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReportsByUser.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false
        state.reports = action.payload
      })
      .addCase(fetchReportsByUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch reports by user'
      })
      .addCase(createPostReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.reports.push(action.payload)
      })
      .addCase(createUserReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.reports.push(action.payload)
      })
      .addCase(createCommentReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.reports.push(action.payload)
      })
      .addCase(handleReport.fulfilled, (state, action: PayloadAction<Report>) => {
        const index = state.reports.findIndex((report) => report.id === action.payload.id)
        if (index !== -1) state.reports[index] = action.payload
      })
      .addCase(deleteReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.reports = state.reports.filter((report) => report.id !== action.payload)
      })
  }
})

export default reportSlice.reducer
