import { Nav } from 'react-bootstrap'
import './sidebar.css'

export default function Sidebar() {
  return (
    <aside className="pc-sidebar">
      <div className="logo">Learnify</div>
      <Nav className="flex-column sidebar-nav">
        <Nav.Link href="#" className="active">Início</Nav.Link>
        <Nav.Link href="#/cursos">Meus cursos</Nav.Link>
        <Nav.Link href="#/cursos">Explorar</Nav.Link>
        <Nav.Link href="#">Favoritos</Nav.Link>
        <Nav.Link href="#">Certificados</Nav.Link>
        <Nav.Link href="#/trilhas">Trilhas</Nav.Link>
        <Nav.Link href="#">Progresso</Nav.Link>
        <Nav.Link href="#">Comunidade</Nav.Link>
      </Nav>

      <div className="sidebar-footer">
        <div className="profile">Julia Santos</div>
        <button className="btn btn-outline-light btn-sm mt-3">Ver perfil</button>
      </div>
    </aside>
  )
}
