import { currentUser, certificados, cursos } from '../../data/mockData'
import { CrownIcon, StarIcon, FlameIcon, TargetIcon, HundredIcon, RocketIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function Profile() {
  const userCertificates = certificados.filter(c => c.idUsuario === currentUser.idUsuario)
  
  const achievements = [
    { icon: <CrownIcon size={32} style={{ color: '#f59e0b', display: 'block', margin: '0 auto' }} />, name: 'Pro', description: 'Assinatura Ativa' },
    { icon: <StarIcon size={32} fill="#7c3aed" style={{ color: '#7c3aed', display: 'block', margin: '0 auto' }} />, name: 'Top Student', description: 'Top 1% da semana' },
    { icon: <FlameIcon size={32} style={{ color: '#ef4444', display: 'block', margin: '0 auto' }} />, name: 'On Fire', description: '7 dias de streak' },
    { icon: <TargetIcon size={32} style={{ color: '#06b6d4', display: 'block', margin: '0 auto' }} />, name: 'Objetivo', description: 'Primeira meta batida' },
    { icon: <HundredIcon size={32} style={{ color: '#10b981', display: 'block', margin: '0 auto' }} />, name: 'Perfeição', description: 'Nota 10 em 3 quizzes' },
    { icon: <RocketIcon size={32} style={{ color: '#ec4899', display: 'block', margin: '0 auto' }} />, name: 'Speedrun', description: '1 curso completo em < 3 dias' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="hf-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: 'white'
          }}>
            {currentUser.nome.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{currentUser.nome}</h1>
            <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-muted)' }}>{currentUser.email} • Aluno Pro</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {/* Statistics Cards */}
          <div className="section" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Estatísticas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="hf-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Horas de Estudo</div>
                <div style={{ fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>48h</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>+2h semana passada</div>
              </div>
              <div className="hf-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Certificados</div>
                <div style={{ fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{userCertificates.length}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Disponíveis para download</div>
              </div>
              <div className="hf-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Streak</div>
                <div style={{ fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>7 dias</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Mantenha o fogo!</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="section">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Conquistas ({achievements.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {achievements.map((ach) => (
                <div key={ach.name} className="hf-card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{ach.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px', color: 'var(--text-primary)' }}>{ach.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ach.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="hf-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Progresso Geral</h4>
            <div style={{ fontSize: '40px', fontWeight: '700', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '12px' }}>68%</div>
            <div style={{ height: '4px', background: 'rgba(124,58,237,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>8 de {cursos.length} cursos concluídos</div>
          </div>

          <div className="hf-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Próximo Objetivo</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>100h de estudo</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>48h / 100h</div>
            <div style={{ height: '4px', background: 'rgba(124,58,237,0.2)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ height: '100%', width: '48%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
          </div>

          <div className="hf-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Ranking</h4>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>#42</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top 1% de alunos ativos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
