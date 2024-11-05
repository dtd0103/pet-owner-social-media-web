import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchSearchPosts, fetchUsersSearch, fetchPetsSearch, fetchGroupsSearch } from '../../api'
import { Group, Pet, Post, User } from '../../../types'

const SearchResults = () => {
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const query = queryParams.get('query')

  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [groups, setGroups] = useState<Group[]>([])

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
            <h2 className='text-xl font-semibold text-gray-800 mb-3'>Posts</h2>
            <ul className='space-y-2'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <li key={post.id} className='text-gray-600 hover:text-gray-900 transition'>
                    <div className='font-semibold'>{post.title}</div>
                    <div className=''>{post.description}</div>
                    {post?.media && <img className='' src={post.media.link} alt='' />}
                  </li>
                ))
              ) : (
                <li className='text-gray-500 italic'>No posts found.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-3'>Users</h2>
            <ul className='space-y-2'>
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.id} className='text-gray-600 hover:text-gray-900 transition'>
                    {user.name}
                  </li>
                ))
              ) : (
                <li className='text-gray-500 italic'>No users found.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'pets' && (
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-3'>Pets</h2>
            <ul className='space-y-2'>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <li key={pet.id} className='text-gray-600 hover:text-gray-900 transition'>
                    {pet.name}
                  </li>
                ))
              ) : (
                <li className='text-gray-500 italic'>No pets found.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-3'>Groups</h2>
            <ul className='space-y-2'>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group.id} className='text-gray-600 hover:text-gray-900 transition'>
                    {group.name}
                  </li>
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
