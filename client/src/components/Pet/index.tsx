import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Pet, User } from '../../../types'
import { checkJwt } from '../../../utils/auth'
import { editPet, deletePet } from '../../redux/slice/petSlice'
import { AppDispatch } from '../../redux/store'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

const Pet = (pet: Pet) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [currentUser, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt()
      setUser(userData)
    }
    fetchUser()
  }, [])

  const [formData, setFormData] = useState({
    name: pet.name,
    date: pet.date,
    species: pet.species,
    sex: pet.sex,
    breed: pet.breed,
    description: pet.description,
    avatar: null as File | null
  })

  const handlerSubmit = () => {
    const isConfirmed = confirm('Are you sure you want to edit this pet?')

    if (!isConfirmed) return

    const formDataS = new FormData()
    formDataS.append('name', formData.name)
    formDataS.append('date', format(new Date(formData.date), 'yyyy-MM-dd'))
    formDataS.append('species', formData.species)
    formDataS.append('sex', formData.sex.toString())
    formDataS.append('breed', formData.breed)
    formDataS.append('description', formData.description)

    if (selectedMedia) {
      formDataS.append('avatar', selectedMedia)
    }

    dispatch(editPet({ id: pet.id, pet: formDataS }))
      .then(() => {
        alert('Pet edited successfully')
        setIsEditModalOpen(false)
      })
      .catch((err) => {
        console.log(err)
        alert('Something went wrong while editing the pet')
      })
  }

  const handlerDelete = () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      dispatch(deletePet(pet.id))
        .then(() => {
          alert('Pet deleted successfully')
          window.location.href = '/my-pets'
        })
        .catch((err) => {
          console.log(err)
          alert('Something went wrong while deleting the pet')
        })
    }
  }

  const editPetForm = () => {
    return (
      <div className='fixed z-40 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div
            className='fixed inset-0 transition-opacity'
            aria-hidden='true'
            onClick={() => setIsEditModalOpen(false)}
          >
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <form className='w-full max-w-lg p-4'>
              <div className='grid mx-3 mb-6'>
                <div className='flex justify-between p-2'>
                  <h1 className='text-2xl font-bold'>Edit Pet</h1>
                  <button onClick={handlerDelete} className='text-gray-500 hover:text-red-500'>
                    Delete
                    <FontAwesomeIcon icon={faTrash} className='ml-2' />
                  </button>
                </div>

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
                    placeholder='Buddy'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='pet-dob'
                  >
                    Date of Birth
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='pet-dob'
                    type='date'
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='pet-species'
                  >
                    Species
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='pet-species'
                    type='text'
                    placeholder='Dog'
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='pet-sex'
                  >
                    Sex
                  </label>
                  <select
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='pet-sex'
                    value={formData.sex === 1 ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, sex: Number(e.target.value) })}
                  >
                    <option value='1'>Male</option>
                    <option value='0'>Female</option>
                  </select>
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='pet-breed'
                  >
                    Breed
                  </label>
                  <input
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='pet-breed'
                    type='text'
                    placeholder='Golden Retriever'
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>

                <div className='w-full px-3 mb-6 md:mb-0'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='pet-description'
                  >
                    Description
                  </label>
                  <textarea
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='pet-description'
                    placeholder='A friendly and playful dog.'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    accept='.jpg,.png,.jpeg,.mp4,.avi,.mkv'
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </form>

            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                onClick={handlerSubmit}
              >
                Edit
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

  return (
    <div className='max-w-sm border rounded overflow-hidden shadow-lg grid grid-rows-2'>
      <div className='w-full row-span-1'>
        <img
          className='h-full object-cover hover:scale-105 w-full'
          src={pet.avatar ? pet.avatar : './default-pet-avatar.jpg'}
          alt={pet.name}
        />
      </div>
      <div className='p-5 row-span-1'>
        <div className='flex items-center justify-between'>
          <div className='flex'>
            <div className='font-bold text-xl mb-2'>{pet.name}</div>
          </div>
          <div>
            {currentUser?.id == pet.owner.id && (
              <button className='mb-2' onClick={() => setIsEditModalOpen(true)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )}
          </div>
        </div>
        <p className='text-slate-700 text-base'>
          <strong>Birth:</strong> {pet.date}
        </p>
        <p className='text-slate-700 text-base'>
          <strong>Species:</strong> {pet.species}
        </p>
        <p className='text-slate-700 text-base'>
          <strong>Sex:</strong> {pet.sex === 1 ? 'Male' : 'Female'}
        </p>
        <p className='text-slate-700 text-base'>
          <strong>Breed:</strong> {pet.breed}
        </p>
        <p className='text-slate-700 text-base'>
          <strong>Description:</strong> {pet.description}
        </p>
      </div>
      {isEditModalOpen && editPetForm()}
    </div>
  )
}

export default Pet
