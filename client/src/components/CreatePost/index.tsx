import { useState } from 'react'
import defaultAvatar from '/default_avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
const CreatePost = () => {
  const [isTitleFilled, setIsTitleFilled] = useState(false)
  const [isContentFilled, setIsContentFilled] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = () => {
    document.getElementById('image')?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className='bg-white w-5/6 p-8 ml-custom_left mt-4 rounded-md shadow-md border'>
      <form action=''>
        <div className='flex mb-10'>
          <img src={defaultAvatar} alt='' className='w-12 h-12 rounded-full' />
          <div className='w-full flex flex-col ml-10'>
            <input
              type='text'
              className={`text-xl ${
                isTitleFilled ? 'text-black' : 'text-slate-400'
              } focus:text-black focus:outline-none placeholder:text-xl`}
              placeholder='Title of new post...'
              onBlur={(e) => setIsTitleFilled(e.target.value !== '')}
            />
            <textarea
              className={`text-sm mt-1 ${
                isContentFilled ? 'text-black' : 'text-slate-400'
              } focus:text-black focus:outline-none placeholder:text-md resize-none`}
              placeholder='Share what you think...'
              onBlur={(e) => setIsContentFilled(e.target.value !== '')}
              rows={2}
            />
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <button type='button' className='text-gray-500 hover:text-blue-500 ml-3' onClick={handleFileUpload}>
            <FontAwesomeIcon icon={faPhotoFilm} /> Photo/ Video
          </button>
          <input
            type='file'
            id='image'
            accept='.jpg,.png,.jpeg,.mp4,.avi,video/*'
            className='hidden'
            onChange={handleFileChange}
          />
          <button className='bg-custom-primary text-slate-500 font-semibold rounded-md p-2 mt-2 hover:text-blue-500'>
            Create
          </button>
        </div>
        {selectedFile && <p className='text-sm mt-2'>{selectedFile.name}</p>}
      </form>
    </div>
  )
}
export default CreatePost
