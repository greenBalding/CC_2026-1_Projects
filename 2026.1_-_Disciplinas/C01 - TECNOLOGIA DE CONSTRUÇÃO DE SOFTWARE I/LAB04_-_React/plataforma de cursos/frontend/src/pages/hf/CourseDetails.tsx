import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCursoById, getModulosByCurso, getAulasByModulo, getAvaliacoesDoCurso, getMediaNotaCurso, formatNivel } from '../../data/mockData'
import { StarIcon, CheckIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const curso = getCursoById(id || '')

  if (!curso) {
    return (
      <div className="hf-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Curso não encontrado</h2>
        <p style={{ color: 'var(--text-muted)' }}>O curso selecionado não existe ou foi removido.</p>
        <Link to="/dashboard" style={{ color: 'var(--accent-secondary)' }}>Voltar para o início</Link>
      </div>
    )
  }

  const modulos = getModulosByCurso(curso.idCurso)
  const avaliacoes = getAvaliacoesDoCurso(curso.idCurso)
  const mediaNota = getMediaNotaCurso(curso.idCurso)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Section */}
      <div style={{
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '32px',
        display: 'grid',
        gridTemplateColumns: '1fr 240px',
        gap: '32px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Curso Premium</div>
          <h1 style={{ margin: '0 0 12px 0', fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>{curso.titulo}</h1>
          <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>{curso.descricao}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Duração</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{curso.totalHoras} horas</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Nível</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{formatNivel(curso.nivel)}</div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/player/${curso.idCurso}`)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            Matricular-se Agora
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ height: '140px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 12px 40px rgba(124,58,237,0.15)', marginBottom: '16px' }} />
          <div className="hf-card" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '4px' }}>
              {mediaNota.toFixed(1)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', color: '#f59e0b', marginBottom: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={12} fill={i < Math.round(mediaNota) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{avaliacoes.length} avaliações</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Instructor */}
          <div className="hf-card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Instrutor</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0
              }}>
                {curso.instrutor?.nome.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>{curso.instrutor?.nome}</div>
                <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Instrutor especializado em tecnologia e desenvolvimento de software. Dedicado a ensinar boas práticas e conceitos modernos aplicados ao mercado de trabalho.
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="hf-card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Grade Curricular</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modulos.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nenhum módulo cadastrado para este curso ainda.</div>
              ) : (
                modulos.map((modulo) => {
                  const numAulas = getAulasByModulo(modulo.idModulo).length
                  return (
                    <div key={modulo.idModulo} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #7c3aed', borderTop: '1px solid rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{modulo.titulo}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{numAulas} {numAulas === 1 ? 'aula' : 'aulas'}</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="hf-card">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Avaliações</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {avaliacoes.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ainda não há avaliações para este curso. Seja o primeiro a avaliar!</div>
              ) : (
                avaliacoes.map((review) => (
                  <div key={review.idAvaliacao} style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Aluno Anônimo</div>
                      <div style={{ fontSize: '12px', color: '#f59e0b' }}>{'★'.repeat(Number(review.nota))}</div>
                    </div>
                    <p style={{ margin: '0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{review.comentario}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="hf-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Detalhes do Curso</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Dificuldade</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{formatNivel(curso.nivel)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Certificado</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Disponível na conclusão</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Acesso</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Vitalício</div>
              </div>
            </div>
          </div>

          <div className="hf-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>O que está incluso</h4>
            <ul style={{ listStyle: 'none', margin: '0', padding: 0, fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon size={14} style={{ color: '#10b981' }} /> {curso.totalHoras} horas de conteúdo</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon size={14} style={{ color: '#10b981' }} /> Grade com {modulos.length} módulos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon size={14} style={{ color: '#10b981' }} /> Exercícios práticos e arquivos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon size={14} style={{ color: '#10b981' }} /> Certificado digital verificado</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckIcon size={14} style={{ color: '#10b981' }} /> Acesso em dispositivos móveis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
