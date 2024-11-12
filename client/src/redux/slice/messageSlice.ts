import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from '../../../types'

interface MessageState {
  listConversation: Message[]
  currentConversation: Message[]
  currentUser: any
  currentFriend: any
}

const initialState: MessageState = {
  listConversation: [],
  currentConversation: [],
  currentUser: null,
  currentFriend: null
}

const formatMediaLink = (mediaLink: string) => {
  return mediaLink.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
}

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setListConversation: (state, action: PayloadAction<Message[]>) => {
      state.listConversation = action.payload.map((conversation) => {
        if (conversation.sender && conversation.sender.avatar) {
          conversation.sender.avatar = formatMediaLink(conversation.sender.avatar)
        }
        if (conversation.receiver && conversation.receiver.avatar) {
          conversation.receiver.avatar = formatMediaLink(conversation.receiver.avatar)
        }
        return conversation
      })
    },
    setCurrentConversation: (state, action: PayloadAction<Message[]>) => {
      state.currentConversation = action.payload.map((message) => {
        if (message.sender && message.sender.avatar) {
          message.sender.avatar = formatMediaLink(message.sender.avatar)
        }
        if (message.receiver && message.receiver.avatar) {
          message.receiver.avatar = formatMediaLink(message.receiver.avatar)
        }
        return message
      })
    },
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload
      if (state.currentUser && state.currentUser.avatar) {
        state.currentUser.avatar = formatMediaLink(state.currentUser.avatar)
      }
    },
    setCurrentFriend: (state, action: PayloadAction<any>) => {
      state.currentFriend = action.payload
      if (state.currentFriend && state.currentFriend.avatar) {
        state.currentFriend.avatar = formatMediaLink(state.currentFriend.avatar)
      }
    },
    addNewMessage: (state, action: PayloadAction<Message>) => {
      const newMessage = action.payload
      if (newMessage.sender && newMessage.sender.avatar) {
        newMessage.sender.avatar = formatMediaLink(newMessage.sender.avatar)
      }
      if (newMessage.receiver && newMessage.receiver.avatar) {
        newMessage.receiver.avatar = formatMediaLink(newMessage.receiver.avatar)
      }
      state.currentConversation.push(newMessage)
    }
  }
})

export const { setListConversation, setCurrentConversation, setCurrentUser, setCurrentFriend, addNewMessage } =
  messageSlice.actions

export default messageSlice.reducer
