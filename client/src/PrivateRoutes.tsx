import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import SignUpPage from './pages/SignUp'
import LoginPage from './pages/LogIn'
import FriendsPage from './pages/Friends'
import GroupsPage from './pages/Groups'
import SearchResultsPage from './pages/SearchResult'
import MyPetsPage from './pages/Pets'
import ProfilePage from './pages/Profile'
import FriendsSentPage from './pages/Friends/FriendsSentPage'
import FriendsRequestPage from './pages/Friends/FriendsRequestPage'
import FriendsBlockPage from './pages/Friends/FriendBlockPage'
import MessagePage from './pages/Message'
import MyGroupsPage from './pages/Groups/MyGroupsPage'
import GroupsProfilePage from './pages/Groups/GroupsProfilePage'
import MyReportsPage from './pages/Report'
import AdminDashboard from './pages/Admin'
import AdminManageReportPage from './pages/Admin/AdminManageReportPage'
import PostPage from './pages/Post'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminManageUserPage from './pages/Admin/AdminManageUser'

export const PrivateRoutes = () => {
  const isAuth = localStorage.getItem('access_token')

  const token = localStorage.getItem('access_token')
  let isAdmin = false

  if (isAuth) {
    try {
      if (token) {
        const decodedToken: any = jwtDecode(token)
        isAdmin = decodedToken.userRole === 'Admin'
      }
    } catch (error) {
      console.error('Invalid token:', error)
    }
  }

  // return (
  //   <Routes>
  //     {isAuth ? (
  //       !isAdmin ? (
  //         <Route path='/' element={<Layout />}>
  //           <Route index element={<HomePage />} />
  //           <Route path='friends' element={<FriendsPage />} />
  //           <Route path='friends/friends-sent' element={<FriendsSentPage />} />
  //           <Route path='friends/friends-request' element={<FriendsRequestPage />} />
  //           <Route path='friends/friends-block' element={<FriendsBlockPage />} />
  //           <Route path='groups' element={<GroupsPage />} />
  //           <Route path='my-groups' element={<MyGroupsPage />} />
  //           <Route path='groups/:id' element={<GroupsProfilePage />} />
  //           <Route path='search' element={<SearchResultsPage />} />
  //           <Route path='my-pets' element={<MyPetsPage />} />
  //           <Route path='profile/:userId' element={<ProfilePage />} />
  //           <Route path='message' element={<MessagePage />} />
  //           <Route path='report' element={<MyReportsPage />} />
  //           <Route path='*' element={<Navigate to='/' />} />
  //         </Route>
  //       ) : (
  //         <>
  //           <Route path='/' element={<AdminDashboard />} />
  //           <Route path='/admin/manage-reports' element={<AdminManageReportPage />} />
  //           <Route path='profile/:userId' element={<ProfilePage />} />
  //           <Route path='posts/:id' element={<PostPage />} />
  //         </>
  //       )
  //     ) : (
  //       <>
  //         <Route path='/log-in' element={<LoginPage />} />
  //         <Route path='/' element={<LoginPage />} />
  //         <Route path='/register' element={<SignUpPage />} />
  //       </>
  //     )}
  //   </Routes>
  // )
  return (
    <Routes>
      {isAuth ? (
        <>
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
            <Route path='my-pets' element={<MyPetsPage />} />
            <Route path='profile/:userId' element={<ProfilePage />} />
            <Route path='message' element={<MessagePage />} />
            <Route path='report' element={<MyReportsPage />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Route>

          {isAdmin && (
            <Route path='/' element={<AdminLayout />}>
              <Route path='/admin' element={<AdminDashboard />} />
              <Route path='/admin/manage-reports' element={<AdminManageReportPage />} />
              <Route path='/admin/manage-users' element={<AdminManageUserPage />} />
              <Route path='posts/:id' element={<PostPage />} />
            </Route>
          )}
        </>
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
