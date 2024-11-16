import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkJwt } from '../../../utils/auth'
import { fetchAllMyConservation } from '../../api'
import { Message } from '../../../types'
import io from 'socket.io-client'
import axios from 'axios'
import {
  setListConversation,
  setCurrentConversation,
  setCurrentUser,
  setCurrentFriend,
  addNewMessage
} from '../../redux/slice/messageSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { getFriends } from '../../redux/slice/relationshipSlice'
import { formatDistanceToNow } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'

const MessagePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { listConversation, currentConversation, currentUser, currentFriend } = useSelector(
    (state: RootState) => state.messages
  )
  const [search, setSearch] = useState<string>(window.location.search)
  const friends = useSelector((state: RootState) => state.relationships.friends)
  const socket = useRef<any>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMyConservation()
      dispatch(setListConversation(data))

      if (search) {
        const type = search.split('=')[0].replace('?', '')
        const id = search.split('=')[1]

        const response = await fetch(`http://localhost:3001/api/v1/messages/conversation/${type}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        const conversationData = await response.json()

        dispatch(setCurrentConversation(conversationData))
      }
    }

    fetchData()

    socket.current = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('access_token')
      }
    })

    socket.current.on('newMessage', (data: Message) => {
      dispatch(addNewMessage(data))
    })
  }, [search, dispatch])

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkJwt()
      dispatch(setCurrentUser(user))
    }

    const fetchFriend = async () => {
      const id = search.split('=')[1]
      const response = await axios.get(`http://localhost:3001/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      dispatch(setCurrentFriend(response.data))
    }

    fetchUser()
    fetchFriend()
  }, [search, dispatch])

  useEffect(() => {
    if (currentFriend?.id) {
      dispatch(getFriends(currentFriend.id))
    }
  }, [currentFriend, dispatch])

  const handleSend = async () => {
    const isBlockedByFriend = friends.some((friend) => friend.friend.id === currentUser?.id && friend.isBlocked === 1)
    console.log(friends[0].isBlocked)
    console.log(isBlockedByFriend)
    if (isBlockedByFriend) {
      alert('You are blocked by this user. You cannot send messages.')
      return
    }
    const messageInput = document.getElementById('message') as HTMLInputElement

    const type = search.split('=')[0].replace('?', '')
    const id = search.split('=')[1]

    const messageContent = messageInput.value

    socket.current.emit('sendMessage', {
      senderId: currentUser?.id,
      receiverId: type === 'user' ? id : null,
      content: messageContent
    })

    messageInput.value = ''
  }

  return (
    <div className='grid grid-cols-12'>
      <div className='col-span-4 p-2 rounded-xl bg-white m-2'>
        <div className='inline-block w-full align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all'>
          <div className='bg-gray-50'>
            <div className='border flex flex-col'>
              <div className='py-2 px-2 bg-grey-lightest'>
                <input type='text' className='w-full px-2 py-2 text-sm' placeholder='Search or start new chat' />
              </div>
              <div className='bg-grey-lighter flex-1 overflow-auto'>
                {listConversation?.map((conversation) => {
                  const otherUser =
                    conversation.sender.id === currentUser?.id ? conversation.receiver : conversation.sender

                  return (
                    <Link
                      key={conversation.id}
                      to={`/message?user=${otherUser?.id}`}
                      className='flex items-center px-2 py-3 border-b border-grey-light cursor-pointer hover:bg-grey-lightest'
                      onClick={() => setSearch(`?user=${otherUser?.id}`)}
                    >
                      <div>
                        <img
                          className='h-12 w-12 m-2 rounded-full object-cover'
                          src={
                            otherUser?.avatar
                              ? otherUser.avatar
                                  .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                                  .replace(/\\/g, '/')
                              : '/default_avatar.jpg'
                          }
                          alt='Avatar'
                        />
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-sm font-bold truncate'>{otherUser?.name}</h3>
                        </div>
                        <p className='text-sm text-grey-dark truncate'>{conversation.content}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='xl:col-span-8 xl:p-2 xl:rounded-xl bg-white xl:m-2 overflow-y-scroll'>
        <div className='inline-block w-full align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all'>
          {currentConversation.length ? (
            <div className='border flex flex-col h-[90vh]'>
              <div className='py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center'>
                <div className='flex items-center'>
                  <div>
                    <Link to={`/profile/${currentFriend.id}`}>
                      <img
                        className='h-12 w-12 rounded-full object-cover'
                        src={currentFriend?.avatar ?? '/default_avatar.jpg'}
                        alt='Avatar'
                      />
                    </Link>
                  </div>
                  <div className='ml-3'>
                    <Link to={`/profile/${currentFriend.id}`}>
                      <h3 className='text-lg font-bold'>{currentFriend?.name}</h3>
                    </Link>
                  </div>
                </div>
              </div>
              <div className='overflow-auto px-4 py-3'>
                {currentConversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`flex max-w-xs p-2 rounded-lg shadow-md ${message.sender.id === currentUser?.id ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200'}`}
                    >
                      <div className='flex flex-col'>
                        <p className={`${message.sender.id === currentUser?.id ? 'text-right' : 'text-left'}`}>
                          {message.content}
                        </p>
                        <p
                          className={`text-xs ${message.sender.id === currentUser?.id ? 'text-right' : 'text-left text-slate-500'}`}
                        >
                          {formatDistanceToNow(new Date(message.sendAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='bg-white flex items-center p-2 mt-auto'>
                <input
                  type='text'
                  id='message'
                  className='w-full px-2 py-2 text-sm border border-grey-light rounded-lg'
                  placeholder='Type a message...'
                />
                <button
                  onClick={handleSend}
                  className='flex items-center ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                >
                  Send
                  <FontAwesomeIcon icon={faMessage} className='ml-2' />
                </button>
              </div>
            </div>
          ) : (
            <div className='p-6 text-center text-grey-dark'>
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagePage
