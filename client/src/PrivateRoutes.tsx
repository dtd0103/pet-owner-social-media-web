import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import SignUpPage from './pages/SignUp'
import LoginPage from './pages/LogIn'
import FriendsPage from './pages/Friends'
import GroupsPage from './pages/Groups'
import SearchResultsPage from './pages/SearchResult/SearchResult'
import MyPetsPage from './pages/Pets'
import ProfilePage from './pages/Profile'
import FriendsSentPage from './pages/Friends/FriendsSentPage'
import FriendsRequestPage from './pages/Friends/FriendsRequestPage'
import FriendsBlockPage from './pages/Friends/FriendBlockPage'
import MessagePage from './pages/Message'
import MyGroupsPage from './pages/Groups/MyGroupsPage'
import GroupsProfilePage from './pages/Groups/GroupsProfilePage'

export const PrivateRoutes = () => {
  const isAuth = localStorage.getItem('access_token')

  return (
    <Routes>
      {isAuth ? (
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='friends' element={<FriendsPage />} />
          <Route path='friends/friends-sent' element={<FriendsSentPage />} />
          <Route path='friends/friends-request' element={<FriendsRequestPage />} />
          <Route path='friends/friends-block' element={<FriendsBlockPage />} />
          <Route path='groups' element={<GroupsPage />} />
          <Route path='my-groups' element={<MyGroupsPage />} />
          <Route path='groups/:id' element={<GroupsProfilePage />} />
          <Route path='search' element={<SearchResultsPage />} />
          <Route path='*' element={<Navigate to='/' />} />
          <Route path='my-pets' element={<MyPetsPage />} />
          <Route path='profile/:id' element={<ProfilePage />} />
          <Route path='message' element={<MessagePage />} />
        </Route>
      ) : (
        <>
          <Route path='/log-in' element={<LoginPage />} />
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />
        </>
      )}
    </Routes>
  )
}
