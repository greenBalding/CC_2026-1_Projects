import { Container } from 'react-bootstrap'

export default function Cursos() {
  const sample = [
    { id: 'c1', title: 'Introdução a Algoritmos' },
    { id: 'c2', title: 'Fundamentos de React' },
    { id: 'c3', title: 'Plataformas Web' },
  ]

  return (
    <Container className="py-4">
      <h2>Cursos</h2>
      <p>Lista de cursos disponíveis (exemplo).</p>
      <div className="course-grid mt-3">
        {sample.map((c) => (
          <div className="course-card" key={c.id}>
            <h5>{c.title}</h5>
            <p className="text-muted">Instrutor • Nível</p>
          </div>
        ))}
      </div>
    </Container>
  )
}
