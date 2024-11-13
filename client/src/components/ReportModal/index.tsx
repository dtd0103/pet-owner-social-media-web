import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createPostReport, createUserReport, createCommentReport } from '../../redux/slice/reportSlice'
import { AppDispatch } from '../../redux/store'

interface ReportModalProps {
  type: 'post' | 'user' | 'comment'
  targetId: string
  onClose: () => void
}

const ReportModal: React.FC<ReportModalProps> = ({ type, targetId, onClose }) => {
  const [reason, setReason] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = () => {
    if (!reason) return alert('Please enter a reason for the report.')

    switch (type) {
      case 'post':
        dispatch(createPostReport({ postId: targetId, reason: reason }))
        break
      case 'user':
        dispatch(createUserReport({ reportedUserId: targetId, reason: reason }))
        break
      case 'comment':
        dispatch(createCommentReport({ commentId: targetId, reason: reason }))
        break
    }
    alert('Sending report successfully.')
    setReason('')
    onClose()
  }

  return (
    <div className='fixed mt-40 z-40 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' onClick={onClose} aria-hidden='true'>
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
              <div className='w-full px-3 mb-6 md:mb-0'>
                <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='reason'>
                  Reason
                </label>
                <input
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  id='reason'
                  type='text'
                  placeholder='Enter reason...'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
