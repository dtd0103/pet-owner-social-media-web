import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Group, User } from '../../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGroups, joinGroup } from '../../redux/slice/groupSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { checkJwt } from '../../../utils/auth'

const GroupsPage = () => {
  const [view, setView] = useState('searchGroups')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  const { searchResult, isLoading, error } = useSelector((state: RootState) => state.groups)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  const handleSearch = () => {
    const search = document.getElementById('search') as HTMLInputElement
    dispatch(fetchGroups(search.value))
  }

  const handleJoinGroup = async (id: string) => {
    try {
      await dispatch(joinGroup(id))
      alert('Join group successfully')
      window.location.href = `/groups/${id}`
    } catch (error) {
      console.log(error)
    }
  }

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((group: Group) => {
        return (
          <div className='flex bg-white justify-between border rounded p-5 shadow my-3' key={group.id}>
            <div className='flex'>
              <Link to={`/groups/${group.id}`}>
                <img
                  className='w-20 h-20 rounded-full object-cover'
                  src={group.avatar ? group.avatar : '/default_avatar.jpg'}
                  alt=''
                />
              </Link>
              <div className='ml-6 mt-4'>
                <p className='font-bold text-xl'>{group.name}</p>
                <p className='text-sm'>{group.users?.length || 0} members</p>
              </div>
            </div>
            <div className='flex items-center mr-2'>
              {group?.users?.find((g) => g.id === currentUser?.id) ? (
                <button
                  className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2'
                  onClick={() => {
                    window.location.href = `/groups/${group.id}`
                  }}
                >
                  Go to group
                </button>
              ) : (
                <button
                  className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 font-semibold hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-sm px-5 py-2.5 text-center me-2'
                  onClick={() => {
                    handleJoinGroup(group.id)
                  }}
                >
                  Join
                </button>
              )}
            </div>
          </div>
        )
      })
    }
  }

  return (
    <div className=''>
      <div className='max-w-4xl mx-auto '>
        <div className='flex gap-4 mt-2 mb-4'>
          <Link to='/my-groups'>
            <button
              className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                view === 'listGroups' ? 'text-blue-500' : ''
              }`}
              onClick={() => setView('listGroups')}
            >
              List My Groups
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-200 transform ${
                  view === 'listGroups' ? 'scale-x-100' : 'scale-x-0'
                }`}
              ></span>
            </button>
          </Link>

          <Link to='/groups'>
            <button
              className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-200 ${
                view === 'searchGroups' ? 'text-blue-500' : ''
              }`}
              onClick={() => setView('searchGroups')}
            >
              Search Groups
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-200 transform ${
                  view === 'searchGroups' ? 'scale-x-100' : 'scale-x-0'
                }`}
              ></span>
            </button>
          </Link>
        </div>

        {view === 'searchGroups' ? (
          <div>
            <div>
              <div>
                <p className='text-lg ml-2 font-bold'>Find Group</p>
              </div>
              <div className='flex '>
                <label className='m-2 w-full h-12 '>
                  <input
                    id='search'
                    type='search'
                    className='h-9 px-2 text-lg w-full border-2 rounded-md border-slate-700'
                    placeholder='Search by group name'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  ></input>
                </label>
                <button onClick={handleSearch} className='ml-2 mb-2'>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className='w-6 h-6' />
                </button>
              </div>
              {showListSearch()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default GroupsPage
