import '../styles/hifi.css'

export default function RightPanel() {
  return (
    <>
      <div className="hf-card">
        <h5>Seu progresso geral</h5>
        <div style={{fontSize: '32px', fontWeight: '700', margin: '12px 0', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>68%</div>
        <p style={{margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8'}}>Parabéns! Você está indo muito bem.</p>
        <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
          <div style={{flex: 1}}>
            <div style={{fontSize: '20px', fontWeight: '700'}}>12</div>
            <div className="text-muted">Cursos</div>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '20px', fontWeight: '700'}}>48h</div>
            <div className="text-muted">Horas</div>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '20px', fontWeight: '700'}}>5</div>
            <div className="text-muted">Certificados</div>
          </div>
        </div>
      </div>

      <div className="hf-card">
        <h5>Atividade recente</h5>
        <ul style={{listStyle: 'none', padding: 0, margin: '12px 0 0 0'}}>
          <li style={{padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.03)', fontSize: '13px', color: '#cbd5e1'}}>Assistiu a aula: Componentes e Props</li>
          <li style={{padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.03)', fontSize: '13px', color: '#cbd5e1'}}>Concluiu o quiz: Estado e Eventos</li>
          <li style={{padding: '8px 0', fontSize: '13px', color: '#cbd5e1'}}>Iniciou o curso: UI/UX Design</li>
        </ul>
      </div>
    </>
  )
}
