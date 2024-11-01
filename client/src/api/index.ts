import axios from 'axios'

const getAuthorizationHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchSearchPosts(name: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/posts?search=${name}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching posts:', error)
    throw error
  }
}

export async function fetchPostsRecommendation() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/posts/get/recommended', {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching recommended posts:', error)
    throw error
  }
}

export async function fetchPostsByUserId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/posts/user/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching posts for user ${id}:`, error)
    throw error
  }
}

export async function fetchPostsByUserGroups() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/posts/user/group', {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching posts by user groups:', error)
    throw error
  }
}

export async function fetchPostsByGroupId(id: string) {
  if (!id) {
    return []
  }
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/posts/group/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching posts for group ${id}:`, error)
    throw error
  }
}

export async function fetchUsersSearch(name: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/users?search=${name}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching users:', error)
    throw error
  }
}

export async function fetchUsersById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/users/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching users:', error)
    throw error
  }
}

export async function fetchMyProfile() {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/users/profile`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching my profile:', error)
    throw error
  }
}

export async function fetchCommentsSearch(name: string) {
  if (name === '') {
    return []
  }
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/comments?search=${name}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching comments:', error)
    throw error
  }
}

export async function fetchCommentsByPostId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/comments/post/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching comments for post ${id}:`, error)
    throw error
  }
}

export async function fetchCommentsByUserId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/comments/user/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching comments for user ${id}:`, error)
    throw error
  }
}

export async function fetchCommentsById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/comments/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching comment:`, error)
    throw error
  }
}

export async function fetchFriendsSearch(name: string) {
  if (name === '') {
    return []
  }
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/users?search=${name}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching friends for user:', error)
    throw error
  }
}

export async function fetchFriendsRequest(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/relationships/pending/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching friend request: ', error)
    throw error
  }
}

export async function fetchFriendsRecommendation() {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/relationships/recommended`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching friend recommendation: ', error)
    throw error
  }
}

export async function fetchMyFriends() {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/relationships/my-friends`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching friends for user:', error)
    throw error
  }
}

export async function fetchPetsSearch(search: string) {
  if (search === '') {
    return []
  }
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/pets?search=${search}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching pets:', error)
    throw error
  }
}

export async function fetchMyPets() {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/pets/user`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching my pets:', error)
    throw error
  }
}

export async function fetchPetsByUserId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/pets/user/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching pets for user ${id}:`, error)
    throw error
  }
}

export async function fetchPetsById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/pets/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching pet ${id}:`, error)
    throw error
  }
}

export async function fetchGroupsSearch(search: string) {
  if (search === '') {
    return []
  }
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/groups?search=${search}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching groups:', error)
    throw error
  }
}

export async function fetchGroupsByUserId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/groups/user/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching groups for user ${id}:`, error)
    throw error
  }
}

export async function fetchGroupsById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/groups/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error(`Error occur while fetching group ${id}:`, error)
    throw error
  }
}

export async function fetchMyGroups() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/groups/user', {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching my groups:', error)
    throw error
  }
}

export async function fetchMyReports() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/reports/user', {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching my report:', error)
    throw error
  }
}

export async function fetchReportById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/reports/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching report:', error)
    throw error
  }
}

export async function fetchReportByUserId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/reports/user/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching user report:', error)
    throw error
  }
}

export async function fetchReportByPostId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/reports/post/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching report:', error)
    throw error
  }
}

export async function fetchReportByCommentId(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/reports/comment/${id}`, {
      headers: getAuthorizationHeader()
    })
    return response.data
  } catch (error) {
    console.error('Error occur while fetching report:', error)
    throw error
  }
}
