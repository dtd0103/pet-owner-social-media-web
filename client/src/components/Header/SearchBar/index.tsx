import { useState, useEffect } from 'react'
import searchIcon from '../../../assets/icons/search.svg'

const SearchBar = () => {
  const [isSearchVisible, setSearchVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible)
  }

  return (
    <form className='flex items-center ml-4 mt-0.5 leading-header_search'>
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
            className='search-input w-44 h-8 bg-custom-grey-1 border border-gray-300 rounded-full p-2 pl-10 placeholder-gray-500 placeholder:text-sm placeholder:font-medium focus:outline-none focus:border-custom-grey transition-colors duration-300'
          />
        )}
      </div>
    </form>
  )
}

export default SearchBar
