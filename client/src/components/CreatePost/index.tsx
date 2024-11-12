import { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { createPost } from '../../redux/slice/postSlice'
import { checkJwt } from '../../../utils/auth'
import { User } from '../../../types'
import { AppDispatch } from '../../redux/store'

const CreatePost = () => {
  const [isTitleFilled, setIsTitleFilled] = useState(false)
  const [isContentFilled, setIsContentFilled] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: User | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
  }, [])

  const handleFileUpload = () => {
    document.getElementById('image')?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!currentUser) {
      console.error('User not authenticated')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('user', JSON.stringify(currentUser))

    if (selectedFile) {
      formData.append('media', selectedFile)
    }

    try {
      await dispatch(createPost(formData)).unwrap()

      setTitle('')
      setDescription('')
      setSelectedFile(null)
      setIsTitleFilled(false)
      setIsContentFilled(false)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <div className='bg-white px-4 py-6 rounded-md shadow-md border'>
      <form onSubmit={handleSubmit}>
        <div className='flex mb-10'>
          <img
            src={
              currentUser?.avatar
                ? currentUser.avatar.replace('D:\\NLCN\\Web\\server\\', 'http://localhost:3001/').replace(/\\/g, '/')
                : '/default_avatar.jpg'
            }
            alt='User avatar'
            className='ml-3 w-20 h-20 object-cover rounded-full'
          />
          <div className='w-full flex flex-col ml-10 mt-2'>
            <input
              type='text'
              className={`text-xl ${isTitleFilled ? 'text-black' : 'text-slate-400'} focus:text-black focus:outline-none placeholder:text-xl`}
              placeholder='Title of new post...'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setIsTitleFilled(e.target.value !== '')
              }}
            />
            <textarea
              className={`text-md mt-1 ${isContentFilled ? 'text-black' : 'text-slate-400'} focus:text-black focus:outline-none focus:border-black placeholder:text-md resize-none h-auto min-w-96`}
              placeholder='Share what you think...'
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setIsContentFilled(e.target.value !== '')
              }}
            />
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <button type='button' className='text-xl text-gray-500 hover:text-blue-500 ml-4' onClick={handleFileUpload}>
            <FontAwesomeIcon icon={faPhotoFilm} /> Photo/ Video
          </button>
          <input
            type='file'
            id='image'
            accept='.jpg,.png,.jpeg,.mp4,.avi,video/*'
            className='hidden'
            onChange={handleFileChange}
          />
          <button
            type='submit'
            className='bg-custom-primary  text-slate-500 font-semibold rounded-md px-4 py-2 mb-2 mr-6 hover:text-blue-500'
          >
            Create Post
          </button>
        </div>
        {selectedFile && <p className='text-sm mt-2'>{selectedFile.name}</p>}
      </form>
    </div>
  )
}

export default CreatePost
