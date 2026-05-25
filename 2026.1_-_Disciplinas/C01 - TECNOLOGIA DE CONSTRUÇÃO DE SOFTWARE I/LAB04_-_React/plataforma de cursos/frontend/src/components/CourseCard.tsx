
type Props = { id: string; title: string; progress?: number }

export default function CourseCard({ title, progress = 0 }: Props) {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
        <div>
          <h5 style={{margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600'}}>{title}</h5>
          <p style={{margin: 0, fontSize: '12px', color: '#94a3b8'}}>Instrutor • Intermediário</p>
        </div>
        <div style={{width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(90deg,#10b981,#06b6d4)'}} />
      </div>
      <div style={{marginTop: '10px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
          <span style={{fontSize: '12px', color: '#cbd5e1'}}>Progresso</span>
          <span style={{fontSize: '12px', fontWeight: '600', color: '#7c3aed'}}>{progress}%</span>
        </div>
        <div style={{height: '4px', background: 'linear-gradient(90deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))', borderRadius: '2px', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.3s ease'}} />
        </div>
      </div>
    </div>
  )
}
