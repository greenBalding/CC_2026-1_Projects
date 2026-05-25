import { Container, Row, Col } from 'react-bootstrap'
import '../App.css'
import SearchBar from '../components/SearchBar'
import Hero from '../components/Hero'
import CourseCard from '../components/CourseCard'
import RightPanel from '../components/RightPanel'

export default function Home() {
  const courses = [
    { id: 'c1', title: 'React do Zero ao Avançado', progress: 64 },
    { id: 'c2', title: 'JavaScript Completo', progress: 35 },
    { id: 'c3', title: 'UI/UX Design com Figma', progress: 0 },
    { id: 'c4', title: 'Node.js do Básico ao Avançado', progress: 20 },
  ]

  return (
    <Container fluid className="py-4">
      <SearchBar />
      <Row>
        <Col lg={8}>
          <Hero />

          <section>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Meus cursos</h2>
              <small className="text-muted">Ver todos</small>
            </div>
            <div className="course-grid">
              {courses.map((c) => (
                <CourseCard key={c.id} id={c.id} title={c.title} progress={c.progress} />
              ))}
            </div>
          </section>
        </Col>
        <Col lg={4}>
          <RightPanel />
        </Col>
      </Row>
    </Container>
  )
}
