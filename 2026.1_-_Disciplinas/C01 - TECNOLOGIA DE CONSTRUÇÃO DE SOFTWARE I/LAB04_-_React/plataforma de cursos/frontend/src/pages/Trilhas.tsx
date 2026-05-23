import { Container, Card, Row, Col } from 'react-bootstrap'

export default function Trilhas() {
  const tracks = [
    { id: 't1', name: 'Desenvolvimento Frontend' },
    { id: 't2', name: 'Algoritmos & Estruturas' },
  ]

  return (
    <Container className="py-4">
      <h2>Trilhas</h2>
      <Row>
        {tracks.map((t) => (
          <Col md={6} key={t.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{t.name}</Card.Title>
                <Card.Text>Descrição curta da trilha.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
