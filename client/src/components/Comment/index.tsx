import { Link } from 'react-router-dom'
import type { Comment } from '../../../types'
import { useEffect, useState } from 'react'
import { checkJwt } from '../../../utils/auth'
import defaultAvatar from '/default_avatar.jpg'

const Comment = (comment: Comment) => {
  const commentCreateAt = new Date(comment.created_at)
  const currentTime = new Date()
  const [currentUser, setCurrentUser] = useState<any>()

  useEffect(() => {
    const getCurrentUser = async () => {
      setCurrentUser(checkJwt())
    }
    getCurrentUser()
  }, [])

  // const timeDifference = () => {
  //   var days = currentTime.getDate() - commentCreateAt.getDate();
  //   var hours = currentTime.getHours() - commentCreateAt.getHours();
  //   var minutes = currentTime.getMinutes() - commentCreateAt.getMinutes();
  //   var seconds = currentTime.getSeconds() - commentCreateAt.getSeconds();

  //   // Adjust for negative values
  //   if (seconds < 0) {
  //     minutes -= 1;
  //     seconds += 60;
  //   }

  //   if (minutes < 0) {
  //     hours -= 1;
  //     minutes += 60;
  //   }
  //   if (hours < 0) {
  //     days -= 1;
  //     hours += 24;
  //   }

  //   if (days > 0) {
  //     return `${days} day${days > 1 ? 's' : ''} ago`;
  //   } else if (hours > 0) {
  //     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  //   } else if (minutes > 0) {
  //     return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  //   } else {
  //     return 'Just a moment ago';
  //   }
  // };
  return (
    <article className=' p-2 m-2  text-base bg-white rounded-lg border'>
      <footer className='flex justify-between items-center mb-2'>
        <div className='flex items-center'>
          <Link to={`/profile/${comment.user.id}`}>
            <img
              className='mr-2 w-6 h-6 rounded-full '
              src={comment.user.avatar ? comment.user.avatar : defaultAvatar}
              alt={comment.user.name}
            ></img>
            <p className='inline-flex items-center mr-3 text-sm text-gray-900  font-semibold'>{comment.user.name} </p>
          </Link>
          <p className='text-sm text-gray-600'>
            {/* <time>{timeDifference()}</time> */}
            <time>{commentCreateAt.toDateString()}</time>
          </p>
        </div>
        <button
          id='dropdownComment1Button'
          data-dropdown-toggle='dropdownComment1'
          className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-500  bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50  '
          type='button'
        >
          <svg
            className='w-4 h-4'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 16 3'
          >
            <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z' />
          </svg>
          <span className='sr-only'>Comment settings</span>
        </button>
        <div id='dropdownComment1' className='hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow'>
          <ul className='py-1 text-sm text-gray-700 ' aria-labelledby='dropdownMenuIconHorizontalButton'>
            <li>
              <a href='#' className='block py-2 px-4 hover:bg-gray-100'>
                Remove
              </a>
            </li>
          </ul>
        </div>
      </footer>
      <p className='text-gray-900 '>{comment.text}</p>
      <div className='flex items-center mt-4 space-x-4'>
        <button type='button' className='flex items-center text-sm text-gray-500 hover:underline font-medium'>
          <svg
            className='mr-1.5 w-3.5 h-3.5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 18'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z'
            />
          </svg>
          Reply
        </button>
      </div>
    </article>
  )
}

export default Comment
