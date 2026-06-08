import { Link, useNavigate } from 'react-router-dom'
import RightPanel from '../../components/RightPanel'
import { getMatriculasComProgresso, currentUser, cursos, formatNivel } from '../../data/mockData'
import { StarIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const myEnrollments = getMatriculasComProgresso(currentUser.idUsuario)
  const enrolledIds = myEnrollments.map(m => m.idCurso)
  const recommendedCourses = cursos.filter(c => !enrolledIds.includes(c.idCurso)).slice(0, 3)

  const firstEnrollment = myEnrollments[0]
  const heroCourse = firstEnrollment?.curso
  const heroProgress = firstEnrollment?.progresso || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="hf-top">
        <input type="text" className="hf-search" placeholder="Pesquisar cursos, conteúdos, instrutores..." />
        <div className="hf-actions">
          <span className="pill">Pro</span>
        </div>
      </div>

      {heroCourse && (
        <div className="hf-hero">
          <div className="left">
            <div className="badge">Continue aprendendo</div>
            <h1>{heroCourse.titulo}</h1>
            <p>{heroCourse.descricao}</p>
            <div className="cta">
              <button onClick={() => navigate(`/player/${heroCourse.idCurso}`)}>Continuar curso →</button>
            </div>
            <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: '#94a3b8'}}>
              Seu progresso: <strong style={{color: '#7c3aed'}}>{heroProgress}%</strong>
            </div>
          </div>
          <div className="thumb" />
        </div>
      )}

      <div className="hf-grid">
        <div className="hf-main-content">
          <div className="section">
            <div className="section-header">
              <h2>Meus cursos</h2>
              <Link to="/cursos" className="view-all">Ver todos →</Link>
            </div>
            <div className="hf-cards">
              {myEnrollments.map((m) => {
                const c = m.curso;
                if (!c) return null;
                return (
                  <div className="hf-card" key={m.idMatricula} style={{ cursor: 'pointer' }} onClick={() => navigate(`/player/${c.idCurso}`)}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <div>
                        <h5 style={{margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600'}}>{c.titulo}</h5>
                        <p style={{margin: 0, fontSize: '12px', color: '#94a3b8'}}>{c.instrutor?.nome} • {formatNivel(c.nivel)}</p>
                      </div>
                      <div style={{width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(90deg,#10b981,#06b6d4)', flexShrink: 0}} />
                    </div>
                    <div style={{marginTop: '10px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                        <span style={{fontSize: '12px', color: '#cbd5e1'}}>Progresso</span>
                        <span style={{fontSize: '12px', fontWeight: '600', color: '#7c3aed'}}>{m.progresso}%</span>
                      </div>
                      <div style={{height: '4px', background: 'linear-gradient(90deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))', borderRadius: '2px', overflow: 'hidden'}}>
                        <div style={{height: '100%', width: `${m.progresso}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.3s ease'}} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Recomendados para você</h2>
              <Link to="/explore" className="view-all">Ver todos →</Link>
            </div>
            <div className="hf-cards">
              {recommendedCourses.map((c) => (
                <div className="hf-card hf-card-recommended" key={c.idCurso} style={{ cursor: 'pointer' }} onClick={() => navigate(`/course/${c.idCurso}`)}>
                  <div style={{height: '100px', borderRadius: '12px', background: `linear-gradient(135deg, rgba(155,92,255,0.18), rgba(94,231,255,0.08))`, marginBottom: '12px'}} />
                  <h5 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600'}}>{c.titulo}</h5>
                  <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8'}}>{c.instrutor?.nome}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize: '12px', color: '#cbd5e1'}}>{formatNivel(c.nivel)}</span>
                    <span style={{fontSize: '13px', fontWeight: '600', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <StarIcon size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                      4.8
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
