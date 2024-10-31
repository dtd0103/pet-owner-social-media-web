import axios from 'axios'
import { useState } from 'react'
import logoImg from '/logo.svg'
import './Login.css'

const Login = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async () => {
    const textError = document.getElementById('error-field')
    textError?.classList.add('hidden')

    if (!identifier || !password) {
      textError?.classList.remove('hidden')
      textError ? (textError.innerText = 'Both fields must not be empty!') : null
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Sending request...')
      const isEmail = /\S+@\S+\.\S+/.test(identifier)
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        {
          [isEmail ? 'email' : 'tel']: identifier,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Response:', response)

      if (response.status === 200) {
        console.log(response.data)
        const accessToken = response.data.access_token
        localStorage.setItem('access_token', accessToken)
        window.location.href = '/home'
      }
    } catch (error) {
      console.error('Error during login:', error)
      if (textError) {
        textError.classList.remove('hidden')
        if (axios.isAxiosError(error)) {
          console.log('Axios error response:', error.response)
          textError.innerText = error.response?.data?.message || 'Log-in failed. Please try again.'
        } else {
          textError.innerText = 'Log-in failed. Please try again.'
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 bg-cover bg-center bg-gradient-to-r from-cyan-200 to-indigo-700'></div>

      <div className='relative flex w-1/3 mx-auto pt-20'>
        <div className='mx-auto bg-slate-100 p-16 rounded-xl'>
          <div className='flex items-center justify-center col-span-1 mb-8'>
            <img src={logoImg} alt='' className='w-16 h-16' />
            <h1 className='hidden md:block font-sora text-3xl font-bold text-custom-second mt-0.5 ml-1'>Petiverse.</h1>
          </div>
          <p className='font-semibold mt-2 px-2 hidden text-red-500' id='error-field'></p>
          <div className='grid grid-cols-1'>
            <label className='block py-1 mb-4 font-medium'>
              Email or Phone Number
              <input
                type='text'
                aria-label='Email or Phone Number'
                value={identifier}
                placeholder='Enter your email or phone number'
                onChange={(e) => setIdentifier(e.target.value)}
                className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none focus:border-custom-second transition duration-300'
              />
            </label>
            <label className='block py-1 mb-4 font-medium'>
              Password
              <input
                type='password'
                aria-label='Password'
                value={password}
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)}
                className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none focus:border-custom-second transition duration-300'
              />
            </label>
          </div>
          <button
            className='border w-full bg-custom-transparent hover:bg-custom-second hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg shadow font-bold transition duration-300'
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
          <p className='text-center mt-4'>
            Don't have an account?{' '}
            <a href='../register' className='text-custom-second underline'>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
