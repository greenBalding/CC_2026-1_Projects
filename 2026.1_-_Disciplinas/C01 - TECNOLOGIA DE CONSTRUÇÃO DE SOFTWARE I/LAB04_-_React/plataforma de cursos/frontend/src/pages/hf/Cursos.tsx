import { Link } from 'react-router-dom'
import { getMatriculasComProgresso, currentUser, certificados, getCursoById, formatNivel } from '../../data/mockData'
import { BookIcon, TrophyIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function Cursos() {
  const matriculas = getMatriculasComProgresso(currentUser.idUsuario)
  const completedCertificates = certificados.filter(c => c.idUsuario === currentUser.idUsuario)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 0' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>Meus Cursos</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Gerencie seu progresso de aprendizado e acesse seus certificados.</p>
      </div>

      <div className="section">
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookIcon size={20} style={{ color: 'var(--accent-secondary)' }} /> Em Andamento
        </h2>
        <div className="hf-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {matriculas.map((mat) => {
            const c = mat.curso;
            if (!c) return null;
            return (
              <div className="hf-card" key={mat.idMatricula} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {formatNivel(c.nivel)}
                      </span>
                      <h3 style={{ margin: '4px 0', fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.titulo}</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>por {c.instrutor?.nome}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progresso</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-primary)' }}>{mat.progresso}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ height: '100%', width: `${mat.progresso}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '3px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to={`/player/${c.idCurso}`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}>
                        Continuar
                      </button>
                    </Link>
                    <Link to={`/course/${c.idCurso}`} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrophyIcon size={20} style={{ color: '#f59e0b' }} /> Certificados Concluídos ({completedCertificates.length})
        </h2>
        
        {completedCertificates.length === 0 ? (
          <div className="hf-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Nenhum certificado emitido ainda. Complete um curso para obter seu certificado!
          </div>
        ) : (
          <div className="hf-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {completedCertificates.map((cert) => {
              const curso = getCursoById(cert.idCurso || '');
              return (
                <div className="hf-card" key={cert.idCertificado} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #10b981' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>Certificado Disponível</span>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {curso ? curso.titulo : 'Curso Concluído'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Código: {cert.codigoVerificacao}</p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Emissão: {new Date(cert.dataEmissao).toLocaleDateString()}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`Código de Verificação: ${cert.codigoVerificacao}`) }} style={{ fontSize: '13px', color: '#10b981', textDecoration: 'none', fontWeight: '600' }}>
                      Visualizar
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
