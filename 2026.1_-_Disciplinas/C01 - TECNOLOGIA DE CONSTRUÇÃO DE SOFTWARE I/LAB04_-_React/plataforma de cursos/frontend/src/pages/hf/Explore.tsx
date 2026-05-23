import '../../styles/hifi.css'

export default function Explore(){
  const cats = ['React','AI','Design','Python','Node.js','Security']
  return (
    <div style={{padding:28}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Explore cursos</h2>
        <div className="pill">Filtrar</div>
      </div>
      <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap'}}>
        {cats.map(c=> <div key={c} className="badge">{c}</div>)}
      </div>

      <div style={{marginTop:18}} className="hf-cards">
        {Array.from({length:8}).map((_,i)=> (
          <div key={i} className="hf-card">
            <div style={{height:120,borderRadius:12,background:`linear-gradient(135deg, rgba(155,92,255,0.18), rgba(94,231,255,0.08))`}} />
            <h5 style={{marginTop:8}}>Curso Premium #{i+1}</h5>
            <p className="text-muted small">Categoria • Nível</p>
          </div>
        ))}
      </div>
    </div>
  )
}
