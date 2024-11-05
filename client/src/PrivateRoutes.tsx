import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import SignUpPage from './pages/SignUp'
import LoginPage from './pages/LogIn'
import FriendsPage from './pages/Friends'
import GroupsPage from './pages/Groups'
import SearchResultsPage from './pages/SearchResult/SearchResult'

export const PrivateRoutes = () => {
  const isAuth = localStorage.getItem('access_token')

  return (
    <Routes>
      {isAuth ? (
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='friends' element={<FriendsPage />} />
          <Route path='groups' element={<GroupsPage />} />
          <Route path='search' element={<SearchResultsPage />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      ) : (
        <>
          <Route path='/log-in' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />

          <Route path='*' element={<Navigate to='/log-in' />} />
        </>
      )}
    </Routes>
  )
}
