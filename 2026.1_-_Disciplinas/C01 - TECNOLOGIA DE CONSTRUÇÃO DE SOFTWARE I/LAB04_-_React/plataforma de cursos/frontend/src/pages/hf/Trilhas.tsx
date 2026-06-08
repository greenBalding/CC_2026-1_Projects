import { Link } from 'react-router-dom'
import { trilhas, getCursosDaTrilha, formatNivel } from '../../data/mockData'
import '../../styles/hifi.css'

export default function Trilhas() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 0' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>Trilhas de Aprendizado</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Siga caminhos estruturados para dominar uma especialidade do início ao fim.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {trilhas.map((trilha) => {
          const courses = getCursosDaTrilha(trilha.idTrilha)
          const totalHours = courses.reduce((sum, c) => sum + (c.totalHoras || 0), 0)
          const totalLessons = courses.reduce((sum, c) => sum + (c.totalAulas || 0), 0)

          return (
            <div className="hf-card" key={trilha.idTrilha} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', background: 'rgba(124,58,237,0.15)', padding: '4px 10px', borderRadius: '999px', display: 'inline-block', marginBottom: '8px' }}>
                    {trilha.categoria?.nome || 'Tecnologia'}
                  </span>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{trilha.titulo}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, maxWidth: '700px' }}>{trilha.descricao}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Cursos</span>
                    <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{courses.length}</strong>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Aulas</span>
                    <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{totalLessons}</strong>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Carga Horária</span>
                    <strong style={{ fontSize: '16px', color: 'var(--accent-secondary)' }}>{totalHours}h</strong>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cursos da Trilha</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {courses.map((c, index) => (
                    <div key={c.idCurso} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '999px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{c.titulo}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.instrutor?.nome} • {formatNivel(c.nivel)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.totalHoras}h</span>
                        <Link to={`/course/${c.idCurso}`} style={{
                          textDecoration: 'none',
                          color: 'var(--accent-secondary)',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: 'rgba(6,182,212,0.1)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          transition: 'all 0.2s'
                        }}>
                          Ver Curso
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
