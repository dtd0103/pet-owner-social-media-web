import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPets, addPet, deletePet } from '../../redux/slice/petSlice'
import { Pet } from '../../../types'
import PetComponent from '../../components/Pet'
import { RootState } from '../../redux/store'
import { AppDispatch } from '../../redux/store'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

const MyPetsPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { pets, isLoading, error } = useSelector((state: RootState) => state.pets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    species: '',
    sex: '',
    breed: '',
    description: '',
    avatar: null as File | null
  })
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)

  useEffect(() => {
    dispatch(fetchPets())
  }, [dispatch])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  const handlerSubmit = () => {
    const formDataP = new FormData()
    formDataP.append('name', formData.name)
    formDataP.append('date', format(new Date(formData.date_of_birth), 'yyyy-MM-dd'))
    formDataP.append('species', formData.species)
    formDataP.append('sex', formData.sex)
    formDataP.append('breed', formData.breed)
    formDataP.append('description', formData.description)
    if (selectedMedia) {
      formDataP.append('avatar', selectedMedia)
    }

    dispatch(addPet(formDataP))
      .unwrap()
      .then(() => {
        setIsModalOpen(false)

        setFormData({
          name: '',
          date_of_birth: '',
          species: '',
          sex: '',
          breed: '',
          description: '',
          avatar: null
        })
        setSelectedMedia(null)
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log('An unknown error occurred')
        }
      })
  }

  const addNewPet = () => (
    <div className='fixed z-40 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setIsModalOpen(false)}>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <div className='inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full'>
          <form className='w-full max-w-lg p-4'>
            <div className='grid mx-3 mb-6'>
              <h1 className='text-2xl font-bold'>Add New Pet</h1>

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
                <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='pet-dob'>
                  Date of Birth
                </label>
                <input
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  id='pet-dob'
                  type='date'
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
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
                <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='pet-sex'>
                  Sex
                </label>
                <select
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  id='pet-sex'
                  value={formData.sex === '1' ? '1' : '0'}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
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

  return (
    <div className=''>
      <div className='p-8 rounded-xl bg-white'>
        <div className='flex justify-center items-center ml-14'>
          <h1 className='text-2xl text-center font-bold'>My Pets</h1>
        </div>
        <button
          className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-semibold rounded-lg px-5 py-2.5 text-center me-2'
          onClick={() => setIsModalOpen(true)}
        >
          Add New Pet
          <FontAwesomeIcon icon={faCirclePlus} className='ml-2' />
        </button>
        <div className='grid mt-4 grid-cols-3  gap-4'>
          {isLoading ? <div>Loading...</div> : pets.map((pet: Pet) => <PetComponent key={pet.id} {...pet} />)}
        </div>
        {isModalOpen && addNewPet()}
      </div>
    </div>
  )
}

export default MyPetsPage
