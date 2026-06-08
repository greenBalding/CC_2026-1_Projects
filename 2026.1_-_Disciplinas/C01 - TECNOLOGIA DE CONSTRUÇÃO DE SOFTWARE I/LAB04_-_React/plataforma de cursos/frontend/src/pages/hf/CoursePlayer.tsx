import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { getCursoById, getModulosByCurso, getAulasByModulo, progressoAulas, currentUser } from '../../data/mockData'
import { PlayIcon, QuizIcon, DocumentIcon, VideoIcon, BookIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>()
  const courseId = id || 'c1'
  const curso = getCursoById(courseId)

  if (!curso) {
    return (
      <div className="hf-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Curso não encontrado</h2>
        <p style={{ color: 'var(--text-muted)' }}>O curso selecionado não existe ou foi removido.</p>
        <Link to="/dashboard" style={{ color: 'var(--accent-secondary)' }}>Voltar para o início</Link>
      </div>
    )
  }

  const modulos = getModulosByCurso(courseId)
  const allAulas = modulos.flatMap(m => getAulasByModulo(m.idModulo))
  const completedAulas = allAulas.filter(aula =>
    progressoAulas.some(p => p.idUsuario === currentUser.idUsuario && p.idAula === aula.idAula && p.status === 'CONCLUIDO')
  )

  const progressPercentage = allAulas.length > 0 ? Math.round((completedAulas.length / allAulas.length) * 100) : 0

  const [activeLesson, setActiveLesson] = useState(allAulas[0] || null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="hf-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Você está assistindo:</span>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{curso.titulo}</h2>
        </div>
        <Link to={`/course/${curso.idCurso}`} style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
          Detalhes do curso →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Main Player */}
        <div>
          <div style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '24px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '400px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(94,231,255,0.1))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              gap: '16px',
              marginBottom: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              <span style={{ fontSize: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeLesson?.tipoConteudo === 'video' ? (
                  <PlayIcon size={64} fill="currentColor" style={{ color: 'var(--accent-secondary)' }} />
                ) : activeLesson?.tipoConteudo === 'quiz' ? (
                  <QuizIcon size={64} style={{ color: 'var(--accent-primary)' }} />
                ) : (
                  <DocumentIcon size={64} style={{ color: 'var(--accent-secondary)' }} />
                )}
              </span>
              <span style={{ color: 'white', fontWeight: '600' }}>
                {activeLesson ? `${activeLesson.titulo}` : 'Nenhuma aula selecionada'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {activeLesson ? `Duração: ${activeLesson.duracaoMinutos} min • Tipo: ${activeLesson.tipoConteudo === 'video' ? 'Vídeo' : activeLesson.tipoConteudo === 'quiz' ? 'Quiz' : 'Material Escrito'}` : ''}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>CC</button>
                <button style={{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>⚙️</button>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {activeLesson ? activeLesson.titulo : 'Descrição da aula'}
            </h3>
            <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Nesta aula, exploraremos em detalhes o conteúdo prático e teórico relacionado ao tópico. Consulte os recursos adicionais abaixo para aprofundar seu aprendizado.
            </p>
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '600' }}>Recursos de Apoio</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Slides baixados!') }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                  <DocumentIcon size={14} /> Slides
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Repositório de código aberto!') }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(6,182,212,0.15)', color: '#22d3ee', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                  <DocumentIcon size={14} /> Código
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Exercícios abertos!') }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                  <BookIcon size={14} /> Exercícios
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Progresso do Curso</h4>
            <div style={{ fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
              {progressPercentage}%
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${progressPercentage}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {completedAulas.length} de {allAulas.length} aulas concluídas
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Módulos e Aulas</h4>
            {modulos.map((modulo) => {
              const moduloAulas = getAulasByModulo(modulo.idModulo)
              return (
                <div key={modulo.idModulo} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {modulo.titulo}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {moduloAulas.map((aula) => {
                      const isCompleted = progressoAulas.some(
                        p => p.idUsuario === currentUser.idUsuario && p.idAula === aula.idAula && p.status === 'CONCLUIDO'
                      )
                      const isActive = activeLesson?.idAula === aula.idAula

                      return (
                        <div
                          key={aula.idAula}
                          onClick={() => setActiveLesson(aula)}
                          style={{
                            padding: '8px 12px',
                            background: isActive ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
                            border: '1px solid ' + (isActive ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.04)'),
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '8px' }}>
                            <div style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                              {aula.titulo}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              {aula.tipoConteudo === 'video' ? (
                                <VideoIcon size={12} />
                              ) : aula.tipoConteudo === 'quiz' ? (
                                <QuizIcon size={12} />
                              ) : (
                                <DocumentIcon size={12} />
                              )}
                              <span>• {aula.duracaoMinutos} min</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', color: isCompleted ? '#10b981' : 'var(--text-muted)' }}>
                            {isCompleted ? '✓' : '○'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
