import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchSearchPosts, fetchUsersSearch, fetchPetsSearch, fetchGroupsSearch } from '../../api'
import { Group, Pet, Post, User } from '../../../types'
import PostComponent from '../../components/Post'
import PetComponent from '../../components/Pet'
import { checkJwt } from '../../../utils/auth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchRecommendedFriends, getFriends, sendFriendRequest } from '../../redux/slice/relationshipSlice'

const SearchResults = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const query = queryParams.get('query')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const { friends, loading } = useSelector((state: RootState) => state.relationships)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getFriends(currentUser.id))
    }
  }, [dispatch, currentUser?.id])

  useEffect(() => {
    const loadData = async () => {
      if (query) {
        try {
          const [postsData, usersData, petsData, groupsData] = await Promise.all([
            fetchSearchPosts(query),
            fetchUsersSearch(query),
            fetchPetsSearch(query),
            fetchGroupsSearch(query)
          ])
          console.log(postsData, usersData, petsData, groupsData)
          setPosts(Array.isArray(postsData.data) ? postsData.data : [])
          setUsers(Array.isArray(usersData.data) ? usersData.data : [])
          setPets(Array.isArray(petsData.data) ? petsData.data : [])
          setGroups(Array.isArray(groupsData.data) ? groupsData.data : [])
        } catch (error) {
          console.error('Error fetching search results:', error)
        }
      }
    }
    loadData()
  }, [query])

  const sendFriendRequestS = async (userId: string) => {
    try {
      await dispatch(sendFriendRequest(userId)).unwrap()
      alert('Send friend request successfully')
      dispatch(fetchRecommendedFriends())
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }
  console.log(friends)
  return (
    <div className='space-y-6 min-h-screen'>
      <div className='flex justify-center space-x-4 mb-6 border-b border-gray-200'>
        {['posts', 'users', 'pets', 'groups'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-semibold border-b-2 ${
              activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'
            } transition-all duration-500`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
        {activeTab === 'posts' && (
          <div>
            <ul className=''>
              {posts.length > 0 ? (
                posts.map((post) => {
                  const updatedMedia = post.media
                    ? {
                        ...post.media,
                        link: post.media.link
                          .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                          .replace(/\\/g, '/')
                      }
                    : post.media

                  const updatedAvatar = post.user?.avatar
                    ? post.user.avatar.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
                    : post.user?.avatar

                  return (
                    <div className='overflow-hidden mx-2' key={post.id}>
                      <PostComponent
                        key={post.id}
                        post={{ ...post, media: updatedMedia, user: { ...post.user, avatar: updatedAvatar } }}
                      />
                    </div>
                  )
                })
              ) : (
                <li className='text-gray-500 italic'>No posts found.</li>
              )}
            </ul>
          </div>
        )}

        {/* {activeTab === 'users' && (
          <div>
            <ul className=''>
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.id} className='text-gray-600 hover:text-gray-900 transition'>
                    <div
                      key={user.id}
                      className='flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm m-2'
                    >
                      <div className='flex items-center space-x-4'>
                        <Link to={`/profile/${user.id}`}>
                          <img
                            className='w-16 h-16 rounded-full object-cover'
                            src={(user.avatar || '/default_avatar.jpg')
                              .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                              .replace(/\\/g, '/')}
                            alt={`${user.name}'s avatar`}
                          />
                        </Link>

                        <div>
                          <Link to={`/profile/${user.id}`}>
                            <p className='text-lg font-semibold text-gray-900'>{user.name}</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className='text-gray-500 italic'>No users found.</li>
              )}
            </ul>
          </div>
        )} */}

        {activeTab === 'users' && (
          <div>
            <ul>
              {users.length > 0 ? (
                users.map((user) => {
                  const isFriend = friends.some((friend) => friend.friend.id === user.id)
                  const isMyProfile = currentUser?.id === user.id
                  return (
                    <li key={user.id} className='text-gray-600 hover:text-gray-900 transition'>
                      <div className='flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm m-2'>
                        <div className='flex items-center space-x-4'>
                          <Link to={`/profile/${user.id}`}>
                            <img
                              className='w-16 h-16 rounded-full object-cover'
                              src={(user.avatar || '/default_avatar.jpg')
                                .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                                .replace(/\\/g, '/')}
                              alt={`${user.name}'s avatar`}
                            />
                          </Link>
                          <div>
                            <Link to={`/profile/${user.id}`}>
                              <p className='text-lg font-semibold text-gray-900'>{user.name}</p>
                            </Link>
                          </div>
                        </div>
                        {!isFriend && !isMyProfile && (
                          <button
                            className='flex ml-48 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'
                            onClick={() => sendFriendRequestS(user.id)}
                          >
                            Friend Request
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })
              ) : (
                <li className='text-gray-500 italic'>No users found.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'pets' && (
          <div>
            <ul className='grid  grid-cols-3  gap-4'>
              {pets.length > 0 ? (
                pets.map((pet) => {
                  const updatedAvatar = pet.avatar
                    ? pet.avatar.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
                    : pet.avatar

                  return <PetComponent key={pet.id} {...pet} avatar={updatedAvatar} />
                })
              ) : (
                <li className='text-gray-500 italic'>No pets found.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            <ul className='space-y-2'>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <div className='flex bg-white justify-between border rounded p-5 shadow my-3' key={group.id}>
                    <div className='grid'>
                      <Link to={`/groups/${group.id}`} className='flex'>
                        <img
                          className='w-20 h-20 rounded-full object-cover'
                          src={(group.avatar || '/default_avatar.jpg')
                            .replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/')
                            .replace(/\\/g, '/')}
                          alt={group.name}
                        />
                        <div className='ml-6 mt-4'>
                          <p className='font-bold text-xl'>{group.name}</p>
                        </div>
                      </Link>
                    </div>
                    <div className='flex items-center'>
                      <Link to={`/groups/${group.id}`}>
                        <button className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2'>
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <li className='text-gray-500 italic'>No groups found.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
