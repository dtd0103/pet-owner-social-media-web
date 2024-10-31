import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Friends from './pages/Friends'
import Groups from './pages/Groups'
import SignUp from './pages/SignUp'
import Login from './pages/LogIn'

// import SignIn from './pages/SignIn'
// import SignUp from './pages/SignUp'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/home' />} />
          <Route path='home' element={<Home />} />
          <Route path='friends' element={<Friends />} />
          <Route path='groups' element={<Groups />} />
        </Route>
        <Route path='register' element={<SignUp />}></Route>
        <Route path='log-in' element={<Login />}></Route>
      </Routes>
    </Router>
  )
}

export default App
