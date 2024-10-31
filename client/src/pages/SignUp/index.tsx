import axios from 'axios'
import { useState } from 'react'
import logoImg from '/logo.svg'
import './SignUp.css'
import { log } from 'console'

const SignUp = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignUp = async () => {
    const textError = document.getElementById('error-field')
    textError?.classList.add('hidden')

    if (!email || !phone || !password || !confirmPassword || !firstName || !lastName) {
      textError?.classList.remove('hidden')
      textError ? (textError.innerText = 'All fields must not be empty!') : null
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      textError?.classList.remove('hidden')
      textError ? (textError.innerText = 'Please enter a valid email address.') : null
      return
    }

    if (!/^\d{10,15}$/.test(phone)) {
      textError?.classList.remove('hidden')
      textError ? (textError.innerText = 'Phone number should be between 10 and 15 digits.') : null
      return
    }

    if (password !== confirmPassword) {
      textError?.classList.remove('hidden')
      textError ? (textError.innerText = 'Passwords do not match.') : null
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        'http://localhost:3001/auth/signup',
        {
          email,
          tel: phone,
          password,
          firstName,
          lastName
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 201) {
        console.log(response.data)
        const accessToken = response.data.access_token
        localStorage.setItem('access_token', accessToken)
        window.location.href = '/home'
      }
    } catch (error) {
      if (textError) {
        textError.classList.remove('hidden')
        if (axios.isAxiosError(error)) {
          textError.innerText = error.response?.data?.message || 'Sign-up failed. Please try again.'
        } else {
          textError.innerText = 'Sign-up failed. Please try again.'
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 bg-cover bg-center bg-gradient-to-r from-cyan-200 to-indigo-700'></div>

      <div className='relative flex w-1/3 mx-auto pt-12'>
        <div className='mx-auto bg-slate-100 p-16 rounded-xl'>
          <div className='flex items-center justify-center col-span-1 mb-8'>
            <img src={logoImg} alt='' className='w-16 h-16' />
            <h1 className='hidden md:block font-sora text-3xl font-bold text-custom-second mt-0.5 ml-1'>Petiverse.</h1>
          </div>
          <p className='font-semibold mt-2 px-2 hidden text-red-500' id='error-field'></p>
          <div className='grid grid-cols-2 gap-12'>
            <div className='block col-span-1 py-1 mb-4'>
              <label className='block py-1 mb-4 font-medium'>
                First name
                <input
                  type='text'
                  aria-label='First name'
                  value={firstName}
                  placeholder='Enter your first name'
                  onChange={(e) => setFirstName(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
              <label className='block py-1 mb-4 font-medium'>
                Last name
                <input
                  type='text'
                  aria-label='Last name'
                  value={lastName}
                  placeholder='Enter your last name'
                  onChange={(e) => setLastName(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
              <label className='block py-1 mb-4 font-medium'>
                Email
                <input
                  type='email'
                  aria-label='Email'
                  value={email}
                  placeholder='Enter your email'
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2  hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
            </div>
            <div className='block col-span-1 py-1 mb-4'>
              <label className='block py-1 mb-4 font-medium'>
                Phone number
                <input
                  type='tel'
                  aria-label='Phone number'
                  value={phone}
                  placeholder='Enter your phone'
                  onChange={(e) => setPhone(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2  hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
              <label className='block py-1 mb-4 font-medium'>
                Password
                <input
                  type='password'
                  aria-label='Password'
                  value={password}
                  placeholder='Enter your password'
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
              <label className='block py-1 mb-4 font-medium'>
                Retype Password
                <input
                  type='password'
                  aria-label='Confirm password'
                  value={confirmPassword}
                  placeholder='Confirm your password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='bg-transparent border-2 border-gray-300 rounded-xl w-full py-2 px-2 hover:border-2 hover:border-black focus:outline-none  focus:border-custom-second transition duration-300'
                ></input>
              </label>
            </div>
          </div>
          <button
            className='border w-full bg-custom-transparent hover:bg-custom-second hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg shadow font-bold transition duration-300'
            onClick={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </button>
          <p className='text-center mt-4'>
            Already have an account?{' '}
            <a href='../log-in' className='text-custom-second underline'>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
