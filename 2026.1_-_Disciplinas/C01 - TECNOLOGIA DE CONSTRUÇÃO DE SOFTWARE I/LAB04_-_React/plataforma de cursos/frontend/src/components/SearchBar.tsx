import { Form, InputGroup } from 'react-bootstrap'

export default function SearchBar() {
  return (
    <div className="searchbar mb-3">
      <InputGroup>
        <Form.Control placeholder="Buscar cursos, conteúdos, instrutores..." />
      </InputGroup>
    </div>
  )
}
