import { Routes, Route, Navigate } from 'react-router-dom'
import HfLayout from './components/HfLayout'
import Dashboard from './pages/hf/Dashboard'
import CoursePlayer from './pages/hf/CoursePlayer'
import Explore from './pages/hf/Explore'
import Profile from './pages/hf/Profile'
import CourseDetails from './pages/hf/CourseDetails'
import Cursos from './pages/hf/Cursos'
import Trilhas from './pages/hf/Trilhas'
import './styles/hifi.css'

function App() {
  return (
    <HfLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/player" element={<CoursePlayer />} />
        <Route path="/player/:id" element={<CoursePlayer />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/trilhas" element={<Trilhas />} />
      </Routes>
    </HfLayout>
  )
}

export default App
