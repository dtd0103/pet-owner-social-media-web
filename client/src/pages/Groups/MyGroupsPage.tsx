import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, UserGroup } from '../../../types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyGroupsS, createGroupS, deleteGroup, editGroupS } from '../../redux/slice/groupSlice'
import { AppDispatch, RootState } from '../../redux/store'

import { checkJwt } from '../../../utils/auth'

const MyGroupsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [createGroupName, setCreateGroupName] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [view, setView] = useState('listGroups')
  const { myGroups } = useSelector((state: RootState) => state.groups)
  const [updateGroupName, setUpdateGroupName] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }
    fetchCurrentUser()

    dispatch(fetchMyGroupsS())
  }, [dispatch])

  const handleSubmit = () => {
    if (!createGroupName) {
      alert('Please enter group name')
      return
    }
    if (!selectedMedia) {
      alert('Please choose group image')
      return
    }

    dispatch(createGroupS({ name: createGroupName, avatar: selectedMedia }))
      .then(() => {
        setIsModalOpen(false)
        setCreateGroupName('')
        setSelectedMedia(null)
        window.location.reload()
      })
      .catch((err) => console.error('Error creating group:', err))
  }

  const handleEditClick = (groupId: string) => {
    setSelectedGroupId(groupId)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (groupId: string) => {
    if (!updateGroupName) {
      alert('Please enter group name')
      return
    }

    dispatch(editGroupS({ groupId, name: updateGroupName, avatar: selectedMedia }))
      .then(() => {
        setIsEditModalOpen(false)
        setUpdateGroupName('')
        setSelectedMedia(null)
        window.location.reload()
      })
      .catch((err) => console.error('Error creating group:', err))
  }

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      dispatch(deleteGroup(groupId))
    }
  }

  const createGroup = () => (
    <div className='fixed z-40 mt-28 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setIsModalOpen(false)}>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <div
          className='p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <h1 className='text-2xl font-bold'>Add New Group</h1>
          <div className='grid'>
            <img
              className='mx-auto border rounded-full w-24 h-24 object-cover'
              height={100}
              width={100}
              src={selectedMedia ? URL.createObjectURL(selectedMedia) : ''}
              alt='Group Image'
            />
            <p className='text-center text-2xl font-bold'>{createGroupName || 'Group Name'}</p>
          </div>
          <form className='w-full max-w-lg'>
            <div className='grid mx-3 mb-6'>
              <div className='w-full px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='pet-name'
                >
                  Name
                </label>
                <input
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  id='pet-name'
                  type='text'
                  placeholder='Group Name'
                  onChange={(e) => setCreateGroupName(e.target.value)}
                />
              </div>

              <div className='w-full px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='pet-image'
                >
                  Image
                </label>
                <input
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  id='pet-image'
                  type='file'
                  accept='image/*'
                  onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </form>

          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
              onClick={handleSubmit}
            >
              Add
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const editGroup = () => {
    if (!selectedGroupId) return null

    return (
      <div className='fixed z-40 mt-28 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setIsModalOpen(false)}>
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <div
            className='p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <h1 className='text-2xl font-bold'>Edit Group</h1>
            <div className='grid'>
              {selectedMedia && (
                <img
                  className='mx-auto border rounded-full w-24 h-24 object-cover'
                  height={100}
                  width={100}
                  src={URL.createObjectURL(selectedMedia)}
                  alt='Group Image'
                />
              )}
              <p className='text-center text-2xl font-bold'>{updateGroupName || 'Group Name'}</p>
            </div>
            <form className='w-full max-w-lg'>
              <div className='grid mx-3 mb-6'>
                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='group-name'
                  >
                    Name
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='group-name'
                    type='text'
                    placeholder='Group Name'
                    onChange={(e) => setUpdateGroupName(e.target.value)}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='group-image'
                  >
                    Image
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='group-image'
                    type='file'
                    accept='image/*'
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </form>

            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => selectedGroupId && handleEditSubmit(selectedGroupId)}
              >
                Update
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showListMyGroups = () => {
    if (myGroups) {
      return myGroups.map((userGroup: UserGroup) => (
        <div className='flex bg-white justify-between border rounded p-5 shadow my-3' key={userGroup.id}>
          <div className='grid'>
            <Link to={`/groups/${userGroup.id}`} className='flex'>
              <img
                className='w-20 h-20 rounded-full object-cover'
                src={userGroup.avatar || '/default_avatar.jpg'}
                alt={userGroup.name}
              />
              <div className='ml-6 mt-4'>
                <p className='font-bold text-xl'>{userGroup.name}</p>
                <p className='text-sm'>Role: {userGroup.role}</p>
              </div>
            </Link>
          </div>
          <div className='flex items-center'>
            <Link to={`/groups/${userGroup.id}`}>
              <button className='text-blue-500 px-3 py-1 border rounded'>View</button>
            </Link>
            {userGroup.role === 'Admin' && (
              <>
                <button
                  className='ml-2 text-yellow-500 px-3 py-1 border rounded'
                  onClick={() => handleEditClick(userGroup.id)}
                >
                  Edit
                </button>
                <button
                  className='ml-2 text-red-500 px-3 py-1 border rounded'
                  onClick={() => handleDeleteGroup(userGroup.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))
    }

    return <p>No groups found</p>
  }

  return (
    <div className=''>
      <div className='max-w-4xl mx-auto'>
        <div className='flex gap-4 mt-2 mb-4'>
          <Link to='/my-groups'>
            <button
              className={`relative px-4 py-2 font-semibold text-center text-gray-600 transition-all duration-500 ${
                view === 'listGroups' ? 'text-blue-500' : ''
              }`}
              onClick={() => setView('listGroups')}
            >
              List My Groups
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-500 transform ${
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

        <div>
          <button
            className='px-4 py-2 font-semibold text-center bg-white  border-2 border-blue-500 hover:bg-blue-400 rounded-md'
            onClick={() => setIsModalOpen(true)}
          >
            Create New Group
          </button>
          {view === 'listGroups' && showListMyGroups()}
        </div>
        {isModalOpen && createGroup()}
        {isEditModalOpen && editGroup()}
      </div>
    </div>
  )
}

export default MyGroupsPage
