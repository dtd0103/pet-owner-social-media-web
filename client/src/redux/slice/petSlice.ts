import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Pet } from '../../../types'
import { fetchMyPets, fetchPetsByUserId } from '../../api'

interface PetState {
  pets: Pet[]
  isLoading: boolean
  error: string | null
}

const initialState: PetState = {
  pets: [],
  isLoading: false,
  error: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

export const fetchPets = createAsyncThunk('pets/fetchPets', async () => {
  const response = await fetchMyPets()

  return response
})

export const fetchPetsByUser = createAsyncThunk('pets/fetchPetsByUser', async (userId: string) => {
  const response = await fetchPetsByUserId(userId)
  return response
})

export const addPet = createAsyncThunk('pets/addPet', async (pet: FormData) => {
  const response = await axios.post('http://localhost:3001/api/v1/pets', pet, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
})

export const editPet = createAsyncThunk('pets/editPet', async (data: { id: string; pet: FormData }) => {
  const { id, pet } = data
  const response = await axios.put(`http://localhost:3001/api/v1/pets/${id}`, pet, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
})

export const deletePet = createAsyncThunk<string, string>('pets/deletePet', async (id: string) => {
  await axios.delete(`http://localhost:3001/api/v1/pets/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return id
})

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetsByUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPetsByUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.pets = action.payload.map((pet: Pet) => ({
          ...pet,
          avatar: pet.avatar ? formatMediaLink(pet.avatar) : null
        }))
      })
      .addCase(fetchPetsByUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(fetchPets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.isLoading = false
        state.pets = action.payload.map((pet: Pet) => ({
          ...pet,
          avatar: pet.avatar ? formatMediaLink(pet.avatar) : null
        }))
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(addPet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.isLoading = false
        const newPet = {
          ...action.payload,
          avatar: action.payload.avatar ? formatMediaLink(action.payload.avatar) : null
        }
        state.pets.push(newPet)
      })
      .addCase(addPet.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(editPet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editPet.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id)
        if (index !== -1) {
          state.pets[index] = {
            ...action.payload,
            avatar: action.payload.avatar ? formatMediaLink(action.payload.avatar) : null
          }
        }
      })
      .addCase(editPet.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })

      .addCase(deletePet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.isLoading = false
        state.pets = state.pets.filter((pet) => pet.id !== action.payload)
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
      })
  }
})

export default petSlice.reducer
