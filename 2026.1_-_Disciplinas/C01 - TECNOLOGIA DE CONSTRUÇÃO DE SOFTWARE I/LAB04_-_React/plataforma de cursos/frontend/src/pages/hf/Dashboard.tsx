import { Link, useNavigate } from 'react-router-dom'
import CourseCard from '../../components/CourseCard'
import RightPanel from '../../components/RightPanel'
import '../../styles/hifi.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const courses = [
    { id: 'r1', title: 'React do Zero ao Avançado', progress: 64 },
    { id: 'r2', title: 'AI para Desenvolvedores', progress: 12 },
    { id: 'r3', title: 'Design de Interfaces', progress: 40 },
  ]

  return (
    <div className="hf-shell">
      <div className="hf-sidebar">
        <div className="logo">Learnify</div>
        <nav>
          <Link to="/dashboard">🏠</Link>
          <Link to="/explore">🔍</Link>
          <Link to="/player">▶️</Link>
          <Link to="/profile">👤</Link>
        </nav>
      </div>

      <div className="hf-main">
        <div className="hf-top">
          <input type="text" className="hf-search" placeholder="Pesquisar cursos, conteúdos, instrutores..." />
          <div className="hf-actions">
            <span className="pill">Pro</span>
          </div>
        </div>

        <div className="hf-hero">
          <div className="left">
            <div className="badge">Continue aprendendo</div>
            <h1>React do Zero ao Avançado</h1>
            <p>Domine o React e crie aplicações web modernas com componentes, hooks e muito mais.</p>
            <div className="cta">
              <button onClick={() => navigate('/player')}>Continuar curso</button>
            </div>
          </div>
          <div className="thumb" />
        </div>

        <div className="hf-grid">
          <div>
            <h2>Meus cursos</h2>
            <div className="hf-cards">
              {courses.map((c) => (
                <div className="hf-card" key={c.id}>
                  <CourseCard id={c.id} title={c.title} progress={c.progress} />
                </div>
              ))}
            </div>
          </div>

          <div className="right-panel">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
