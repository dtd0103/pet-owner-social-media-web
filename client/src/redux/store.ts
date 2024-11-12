import { configureStore } from '@reduxjs/toolkit'
import commentsReducer from './slice/commentSlice'
import postReducer from '../redux/slice/postSlice'
import petReducer from '../redux/slice/petSlice'
import userReducer from '../redux/slice/userSlice'
import relationshipReducer from '../redux/slice/relationshipSlice'
import messageReducer from '../redux/slice/messageSlice'
import groupReducer from '../redux/slice/groupSlice'
const store = configureStore({
  reducer: {
    comments: commentsReducer,
    posts: postReducer,
    pets: petReducer,
    users: userReducer,
    relationships: relationshipReducer,
    messages: messageReducer,
    groups: groupReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
