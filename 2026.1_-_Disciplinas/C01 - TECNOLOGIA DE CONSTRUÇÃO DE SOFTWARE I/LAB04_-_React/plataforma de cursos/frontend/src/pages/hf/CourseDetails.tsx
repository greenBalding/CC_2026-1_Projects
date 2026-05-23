import '../../styles/hifi.css'

export default function CourseDetails(){
  return (
    <div style={{padding:28}}>
      <div className="hf-card">
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <div style={{width:140,height:100,borderRadius:12,background:'linear-gradient(135deg,#6e5cff,#7ed6ff)'}} />
          <div>
            <h3 style={{margin:0}}>React do Zero ao Avançado</h3>
            <p className="text-muted">Instrutor • 48 horas • Intermediário</p>
            <div style={{marginTop:12}}><button className="pill">Iniciar curso</button></div>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16,marginTop:16}}>
        <div className="hf-card">
          <h5>Currículo</h5>
          <ul className="text-muted small">
            <li>Aula 1 - Introdução</li>
            <li>Aula 2 - Hooks</li>
            <li>Aula 3 - Projetos</li>
          </ul>
        </div>
        <div className="hf-card">
          <h5>Avaliações</h5>
          <p className="text-muted small">4.8 (1.2k reviews)</p>
        </div>
      </div>
    </div>
  )
}
