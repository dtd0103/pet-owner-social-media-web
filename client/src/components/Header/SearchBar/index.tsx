import { useState, useEffect } from 'react'
import searchIcon from '../../../assets/icons/search.svg'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [isSearchVisible, setSearchVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible)
  }

  return (
    <form className='flex items-center ml-4 mt-0.5 leading-header_search ' onSubmit={handleSubmit}>
      <div className='relative'>
        <img
          src={searchIcon}
          alt='Search Icon'
          className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer'
          onClick={toggleSearch}
        />

        {(isSearchVisible || !isMobile) && (
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input w-44 h-8 bg-custom-grey-1 border border-gray-300 rounded-full p-2 pl-10 placeholder-gray-500 placeholder:text-sm placeholder:font-medium focus:outline-none focus:border-custom-grey transition-colors duration-300'
          />
        )}
      </div>
    </form>
  )
}

export default SearchBar
