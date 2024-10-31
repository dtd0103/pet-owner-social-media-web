// import { useEffect, useState } from 'react'
// import { IComment, IMedia, IPost, ITag } from '../../../types'
// import Comment from '../Comment'
// import { fetchCommentsByPostId } from '../../api'
// import { Link } from 'react-router-dom'
// import { checkJwt } from '../../../utils/auth'
// import axios from 'axios'

// const ListComment = (post: IPost) => {
//   const [listComment, setListComment] = useState<IComment[] | null>(null)
//   const [newComment, setNewComment] = useState<string>('')
//   const accessToken = localStorage.getItem('access_token')
//   if (!accessToken) {
//     window.location.href = '/sign-in'
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetchCommentsByPostId(post.id)
//       setListComment(response)
//     }

//     fetchData()
//   }, [post.id])

//   const submitComment = async () => {
//     try {
//       if (newComment === '') {
//         alert('Please enter your comment')
//         return
//       }
//       // You need to implement the endpoint and handle the response accordingly
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/comments',
//         {
//           post_id: post.id,
//           comment: newComment
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         }
//       )

//       // Handle the response as needed (e.g., update state, show notifications)
//       const result = response.data

//       // After submitting, you might want to refetch the comments
//       const updatedComments = await fetchCommentsByPostId(post.id)
//       setListComment(updatedComments)

//       // Clear the input field after submitting
//       setNewComment('')
//     } catch (error) {
//       // Handle any errors here
//       console.error('Error submitting comment:', error)
//     }
//   }
//   return (
//     <section className='bg-white py-8 lg:py-16 antialiased'>
//       <div className='max-w-2xl mx-auto px-4'>
//         <div className='flex justify-between items-center mb-6'>
//           <h2 className='text-lg lg:text-2xl font-bold text-gray-900'>Discussion ({listComment?.length})</h2>
//         </div>
//         <form
//           className='mb-6'
//           onSubmit={(e) => {
//             e.preventDefault()
//             submitComment()
//           }}
//         >
//           <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 '>
//             <label htmlFor='comment' className='sr-only'>
//               Your comment
//             </label>
//             <textarea
//               id='comment'
//               rows={2}
//               className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none'
//               placeholder='Write a comment...'
//               required
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             ></textarea>
//           </div>
//           <button
//             type='submit'
//             className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center dark:text-white bg-blue-400 dark:bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800'
//           >
//             Post comment
//           </button>
//         </form>
//         {listComment?.map((commnet: IComment) => <Comment key={commnet.id} {...commnet} />)}
//       </div>
//     </section>
//   )
// }

// const Post = (post: IPost) => {
//   const [showComments, setShowComments] = useState(false)
//   const [isOnwer, setIsOnwer] = useState(false)
//   const [liked, setLiked] = useState(false)
//   const [totalLike, setTotalLike] = useState(post.likes?.length ?? 0)
//   const postCreatedAt = new Date(post.created_at)
//   const [isEditPost, setIsEditPost] = useState(false)
//   const currentTime = new Date()
//   // const timeDifference = () => {
//   //   var days = currentTime.getDate() - postCreatedAt.getDate();
//   //   var hours = currentTime.getHours() - postCreatedAt.getHours();
//   //   var minutes = currentTime.getMinutes() - postCreatedAt.getMinutes();
//   //   var seconds = currentTime.getSeconds() - postCreatedAt.getSeconds();

//   //   // Adjust for negative values
//   //   if (seconds < 0) {
//   //     minutes -= 1;
//   //     seconds += 60;
//   //   }

//   //   if (minutes < 0) {
//   //     hours -= 1;
//   //     minutes += 60;
//   //   }
//   //   if (hours < 0) {
//   //     days -= 1;
//   //     hours += 24;
//   //   }

//   //   if (days > 0) {
//   //     return `${days} day${days > 1 ? 's' : ''} ago`;
//   //   } else if (hours > 0) {
//   //     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//   //   } else if (minutes > 0) {
//   //     return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//   //   } else {
//   //     return 'Just a moment ago';
//   //   }
//   // };
//   const getMediaHtml = (media: IMedia) => {
//     if (media.type === 'image') {
//       return (
//         <img
//           id={`${media.id}`}
//           src={`${media.link}`}
//           alt='Image'
//           loading='lazy'
//           className='w-full h-full object-cover rounded-lg max-h-screen'
//         />
//       )
//     } else if (media.type === 'video') {
//       return (
//         <video
//           className='w-full h-full object-cover rounded-lg max-h-screen'
//           id={`${media.id}`}
//           src={`${media.link}`}
//           controls
//         ></video>
//       )
//     } else {
//       return '' // Handle other media types as needed
//     }
//   }

//   const getTagHtml = (tag: ITag) => {
//     return (
//       <div
//         key={tag.id}
//         className='bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-2 m-1 flex items-center'
//       >
//         <span className='mx-2'>#{tag.name}</span>
//       </div>
//     )
//   }
//   useEffect(() => {
//     isLiked()
//     const checkOwner = async () => {
//       const currentUser = await checkJwt()
//       if (currentUser) {
//         if (currentUser.id === post.user.id) {
//           setIsOnwer(true)
//         }
//       }
//     }
//     checkOwner()
//     return () => {
//       setShowComments(false)
//     }
//   }, [liked])

//   const likePost = async () => {
//     try {
//       // You need to implement the endpoint and handle the response accordingly
//       await axios.post(
//         `http://localhost:3001/api/v1/posts/${post.id}/like`,
//         {
//           post_id: post.id
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         }
//       )

//       setLiked(!liked)

//       // Update total likes based on the current state
//       setTotalLike(liked ? totalLike - 1 : totalLike + 1)
//     } catch (error) {
//       // Handle any errors here
//       console.error('Error liking post:', error)
//     }
//   }

//   const isLiked = async () => {
//     const currentUser = await checkJwt()
//     if (currentUser) {
//       const likedPost = post.likes?.find((like) => {
//         return like.id === currentUser.id
//       })
//       if (likedPost) {
//         setLiked(true)
//       }
//     }
//   }

//   const [postData, setPostData] = useState({
//     title: post.title,
//     description: post.description,
//     tagNames: post.tags ? post.tags.map((tag) => tag.name) : [],
//     media: post.media
//   })
//   const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
//   const handleAddTag = () => {
//     const tag = document.getElementById('tags') as HTMLInputElement
//     if (tag.value) {
//       if (postData.tagNames.includes(tag.value)) {
//         alert('Tag already exist')
//         return
//       }
//       setPostData({ ...postData, tagNames: [...postData.tagNames, tag.value] })
//       tag.value = ''
//     }
//   }
//   const handlerSubmitEdit = () => {
//     const formData = new FormData()
//     formData.append('title', postData.title)
//     formData.append('description', postData.description)
//     formData.append('media', selectedMedia as File)
//     postData.tagNames.forEach((tag, index) => {
//       formData.append(`tagNames[${index}]`, tag)
//     })
//     try {
//       const res = axios
//         .put('http://localhost:3001/api/v1/posts/' + post.id, formData, {
//           headers: {
//             'Content-Type': 'form-data',
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         })
//         .then((res) => {
//           res.status === 200 && alert('Post created successfully')
//           window.location.href = '/'
//         })
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   const deletePost = async (id: string) => {
//     try {
//       confirm('Are you sure you want to delete this post?')
//       if (!confirm) return
//       const res = await axios.delete('http://localhost:3001/api/v1/posts/' + id, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       })
//       res.status === 200 && alert('Post deleted successfully')
//       window.location.href = '/'
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   const editPost = () => {
//     return (
//       <div className='fixed z-10 inset-0 overflow-y-auto'>
//         <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
//           {/* Background overlay, show/hide based on modal state. */}
//           <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={() => setIsEditPost(false)}>
//             <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
//           </div>
//           {/* This element is to trick the browser into centering the modal contents. */}
//           <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
//             &#8203;
//           </span>
//           {/* Modal panel, show/hide based on modal state. */}
//           <div
//             className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
//             role='dialog'
//             aria-modal='true'
//             aria-labelledby='modal-headline'
//           >
//             <form className='xl:w-full xl:max-w-lg xl:p-4 m-2'>
//               <div className='flex justify-between mb-2'>
//                 <h1 className='text-2xl font-bold text-gray-900'>Edit Post</h1>
//                 <button className='bg-red' onClick={() => deletePost(post.id)}>
//                   <img
//                     src='https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/delete.svg'
//                     height={24}
//                     width={24}
//                     title='Delete'
//                     alt='Delete'
//                   ></img>
//                 </button>
//               </div>
//               <div className='grid grid-flow-row'>
//                 <label htmlFor='title'>Title</label>
//                 <input
//                   type='text'
//                   id='title'
//                   className='border border-gray-400 rounded-md p-2'
//                   value={postData.title}
//                   onChange={(e) => setPostData({ ...postData, title: e.target.value })}
//                 />
//               </div>
//               <div className='grid grid-flow-row'>
//                 <label htmlFor='content'>Content</label>
//                 <textarea
//                   id='content'
//                   className='border border-gray-400 rounded-md p-2'
//                   value={postData.description}
//                   onChange={(e) => setPostData({ ...postData, description: e.target.value })}
//                 />
//               </div>
//               <div className='grid grid-flow-row'>
//                 <label htmlFor='tags'>
//                   <span className=' ml-2 text-sm text-gray-800 sm:text-base '>Tag</span>{' '}
//                 </label>
//                 <div className='md:grid md:grid-cols-12 items-center '>
//                   <input
//                     id='tags'
//                     className='mt-1 py-3 px-5 border-2 rounded-md outline-none w-full md:col-span-10 gap-2 '
//                     type='text'
//                     placeholder='Type something'
//                   />
//                   <div
//                     className='text-center py-3 px-7  h-fit w-fit text-sm font-medium bg-purple-500 text-gray-100 rounded-md cursor-pointer sm:w-min hover:bg-purple-700 hover:text-gray-50  mb-4 sm:mb-0'
//                     onClick={() => {
//                       handleAddTag()
//                     }}
//                   >
//                     <span>Add</span>
//                   </div>
//                 </div>
//                 <div className='flex flex-wrap'>
//                   {postData.tagNames.map((tag) => (
//                     <div
//                       key={tag}
//                       className='bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-2 m-1 flex items-center'
//                     >
//                       {tag}
//                       <button title='Delete post'>
//                         <svg
//                           className='w-3 h-3 ml-2 cursor-pointer'
//                           fill='none'
//                           stroke='currentColor'
//                           viewBox='0 0 24 24'
//                           xmlns='http://www.w3.org/2000/svg'
//                           onClick={() => {
//                             setPostData({
//                               ...postData,
//                               tagNames: postData.tagNames.filter((t) => t !== tag)
//                             })
//                           }}
//                         >
//                           <path
//                             strokeLinecap='round'
//                             strokeLinejoin='round'
//                             strokeWidth='2'
//                             d='M6 18L18 6M6 6l12 12'
//                           ></path>
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                   <div className='flex flex-wrap'></div>
//                 </div>
//               </div>
//               <div className='grid grid-flow-row'>
//                 <label htmlFor='image'>Media</label>
//                 <input
//                   type='file'
//                   id='image'
//                   accept='.jpg,.png,.jpeg,.mp4,.avi,.mkv,video/*'
//                   className='border border-gray-400 rounded-md p-2'
//                   onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
//                 />
//               </div>
//             </form>
//             <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
//               <button
//                 type='button'
//                 className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none  sm:ml-3 sm:w-auto sm:text-sm'
//                 onClick={() => handlerSubmitEdit()}
//               >
//                 Add
//               </button>
//               <button
//                 type='button'
//                 className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
//                 onClick={() => setIsEditPost(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className='flex  bg-white shadow-lg rounded-lg m-1'>
//       <div className='flex-row w-full items-start px-4 py-6'>
//         <div className='w-full'>
//           <div className='flex items-center justify-between'>
//             <div className='flex items-end justify-between'>
//               {post.group ? (
//                 <div className='flex items-end justify-between '>
//                   <div className='relative w-16 h-16'>
//                     <Link to={`/groups/${post.group.id}`}>
//                       <img
//                         className='w-16 h-16 rounded-xl object-cover mr-4 shadow absolute top-0 left-0'
//                         src={post.group?.avatar ? post.group?.avatar : './default-avatar.png'}
//                         alt='avatar'
//                       ></img>
//                     </Link>
//                     <Link to={`/profile/${post.user.id}`}>
//                       <img
//                         className='w-10 h-10 rounded-full object-cover shadow absolute bottom-0 right-0'
//                         src={post.user?.avatar ? post.user?.avatar : './default-avatar.png'}
//                         alt='avatar'
//                       ></img>
//                     </Link>
//                   </div>

//                   <div>
//                     <Link to={`/groups/${post.user.id}`} className=' flex flex-col ml-2'>
//                       <h2 className='text-lg font-semibold text-gray-900 '>{post.group.name}</h2>
//                       <h2 className=' text-gray-900 -mt-1 font-semibold'>
//                         {post.user.first_name} {post.user.last_name}{' '}
//                       </h2>
//                       <p className='text-sm text-gray-700'>
//                         {/* {timeDifference()} */}
//                         {
//                           <span className='text-sm text-gray-700'>
//                             {postCreatedAt.toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </span>
//                         }
//                       </p>
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <div className='flex items-end justify-between'>
//                   <Link to={`/profile/${post.user.id}`}>
//                     <img
//                       className='w-16 h-16 rounded-xl object-cover mr-4 shadow'
//                       src={post.user.avatar ? post.user.avatar : './default-avatar.png'}
//                       alt='avatar'
//                     ></img>
//                   </Link>
//                   <div>
//                     <Link to={`/profile/${post.user.id}`}>
//                       <h2 className='text-lg font-semibold text-gray-900 -mt-1'>
//                         {post.user.first_name} {post.user.last_name}{' '}
//                       </h2>
//                     </Link>
//                     <small className='text-sm text-gray-700'>
//                       {/* {timeDifference()} */}
//                       {
//                         <span className='text-sm text-gray-700'>
//                           {postCreatedAt.toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           })}
//                         </span>
//                       }
//                     </small>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className='flex items-center justify-between'>
//               {isOnwer ? (
//                 <div className='flex items-center justify-between'>
//                   <button className='bg-red' onClick={() => setIsEditPost(true)}>
//                     <img
//                       src='https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/edit.svg'
//                       height={24}
//                       width={24}
//                       title='Edit'
//                       alt='Edit'
//                     ></img>
//                   </button>
//                 </div>
//               ) : (
//                 ''
//               )}
//             </div>
//           </div>
//           <p className='mt-3 text-gray-700 text-md font-bold'>{post.title}</p>
//           <p className='mt-3 text-gray-700 text-sm'>{post.description}</p>
//           {post.media ? getMediaHtml(post.media) : ''}
//           <div className='flex'>{post.tags ? post.tags.map((tag) => getTagHtml(tag)) : ''}</div>
//           <div className='mt-4 flex items-center'>
//             <div className='flex mr-2 text-gray-700 text-lg'>
//               <button className=' bg-red' onClick={likePost}>
//                 {!liked ? (
//                   <img
//                     src='https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/like.svg'
//                     height={24}
//                     width={24}
//                     title='Like'
//                     alt='Like'
//                   ></img>
//                 ) : (
//                   <img
//                     src='https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/liked.svg'
//                     height={24}
//                     width={24}
//                     title='Like'
//                     alt='Like'
//                   ></img>
//                 )}
//               </button>
//               <span className={'ml-2 mr-8'}>{totalLike}</span>
//             </div>
//             <div className='flex mr-2 text-gray-700 text-md'>
//               <button onClick={() => setShowComments(!showComments)}>
//                 <img
//                   src='https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/comment.svg'
//                   height={24}
//                   width={24}
//                   title='Comment'
//                   alt='Comment'
//                 ></img>
//               </button>

//               <span className='ml-2 mr-8'>{post.comments?.length ?? 0}</span>
//             </div>
//           </div>
//         </div>
//         {showComments && <ListComment {...post}></ListComment>}
//         {isEditPost ? editPost() : ''}
//       </div>
//     </div>
//   )
// }

// export default Post
