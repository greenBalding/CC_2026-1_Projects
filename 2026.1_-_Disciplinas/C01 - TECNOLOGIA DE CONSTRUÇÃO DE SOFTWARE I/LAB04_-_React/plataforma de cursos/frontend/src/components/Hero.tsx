import { Button, ProgressBar } from 'react-bootstrap'
import heroImg from '../assets/hero.png'

export default function Hero() {
  return (
    <section className="dashboard-hero mb-4">
      <div className="hero-left">
        <div className="badge">Continue aprendendo</div>
        <h1>React do Zero ao Avançado</h1>
        <p className="muted">Domine o React e crie aplicações web modernas com componentes, hooks e muito mais.</p>
        <div className="hero-actions">
          <Button variant="primary">Continuar curso</Button>
          <div className="hero-progress">
            <div className="progress-label">Seu progresso</div>
            <ProgressBar now={64} label={`64%`} />
          </div>
        </div>
      </div>
      <div className="hero-right">
        <img src={heroImg} alt="hero" />
      </div>
    </section>
  )
}
