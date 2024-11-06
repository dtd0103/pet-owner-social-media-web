import { useState } from 'react'
import defaultAvatar from '/default_avatar.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const CreatePost = () => {
  const [isTitleFilled, setIsTitleFilled] = useState(false)
  const [isContentFilled, setIsContentFilled] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const accessToken = localStorage.getItem('access_token')

  const handleFileUpload = () => {
    document.getElementById('image')?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)

    if (selectedFile) {
      const fileNameWithExtension = `${title.replace(/\s+/g, '_').toLowerCase()}.${selectedFile.name.split('.').pop()}`
      formData.append('media', selectedFile, fileNameWithExtension)
    }

    formData.forEach((value, key) => {
      console.log(key, value)
    })

    try {
      const response = await axios.post('http://localhost:3001/api/v1/posts', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Post created successfully:', response.data)

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
          <img src={defaultAvatar} alt='' className='w-20 h-20 rounded-full' />
          <div className='w-full flex flex-col ml-10'>
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
              className={`text-md mt-1 ${isContentFilled ? 'text-black' : 'text-slate-400'} focus:text-black focus:outline-none placeholder:text-md `}
              placeholder='Share what you think...'
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setIsContentFilled(e.target.value !== '')
              }}
              rows={2}
            />
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <button type='button' className='text-xl text-gray-500 hover:text-blue-500 ml-3' onClick={handleFileUpload}>
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
            className='bg-custom-primary text-slate-500 font-semibold rounded-md p-2 mt-2 hover:text-blue-500'
          >
            Create
          </button>
        </div>
        {selectedFile && <p className='text-sm mt-2'>{selectedFile.name}</p>}
      </form>
    </div>
  )
}

export default CreatePost
