import { Navbar, Container, Nav } from 'react-bootstrap'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Trilhas from './pages/Trilhas'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/hf/Dashboard'
import CoursePlayer from './pages/hf/CoursePlayer'
import Explore from './pages/hf/Explore'
import Profile from './pages/hf/Profile'
import CourseDetails from './pages/hf/CourseDetails'
import './App.css'
import './styles/hifi.css'

function App() {
  const location = useLocation()
  const isHiFi = location.pathname.startsWith('/dashboard') || 
                 location.pathname.startsWith('/player') || 
                 location.pathname.startsWith('/explore') || 
                 location.pathname.startsWith('/profile') ||
                 location.pathname.startsWith('/course/')

  if (isHiFi) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/player" element={<CoursePlayer />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="pc-topbar">
        <Container>
          <Navbar.Brand href="#">Plataforma Cursos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Início</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
              <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="app-layout">
        <div className="app-sidebar">
          <Sidebar />
        </div>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/trilhas" element={<Trilhas />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
