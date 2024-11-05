import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<PrivateRoutes />} />
      </Routes>
    </Router>
  )
}

export default App
