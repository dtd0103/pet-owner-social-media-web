import axios from 'axios'
import { User } from '../types'

const getJwtToken = () => localStorage.getItem('access_token')

let cachedUser: User | null = null

export const checkJwt = async () => {
  if (cachedUser) {
    return cachedUser
  }

  const token = getJwtToken()

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))

      const currentTimestamp = Math.floor(Date.now() / 1000)
      if (decodedToken.exp < currentTimestamp) {
        console.error('JWT token has expired')
        localStorage.removeItem('access_token')
        return null
      }

      const response = await axios.get('http://localhost:3001/api/v1/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = response.data

      cachedUser = data

      return cachedUser
    } catch (error) {
      console.error('Error decoding or fetching data from JWT:', error)
      return null
    }
  }

  return null
}
