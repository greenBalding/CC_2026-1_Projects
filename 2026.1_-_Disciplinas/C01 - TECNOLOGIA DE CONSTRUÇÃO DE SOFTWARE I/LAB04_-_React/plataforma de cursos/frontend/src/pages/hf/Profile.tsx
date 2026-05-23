import '../../styles/hifi.css'

export default function Profile(){
  return (
    <div style={{padding:28}}>
      <h2>Perfil & Progresso</h2>
      <div style={{display:'flex',gap:16,marginTop:12}}>
        <div style={{flex:1}} className="hf-card">
          <h5>Estatísticas</h5>
          <div style={{display:'flex',gap:12,marginTop:12}}>
            <div className="stat"><div>Horas</div><div>48h</div></div>
            <div className="stat"><div>Badges</div><div>12</div></div>
            <div className="stat"><div>Streak</div><div>7 dias</div></div>
          </div>
        </div>
        <div style={{width:360}} className="hf-card">
          <h5>Achievements</h5>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <div className="pill">Pro</div>
            <div className="pill">Top Student</div>
          </div>
        </div>
      </div>
    </div>
  )
}
