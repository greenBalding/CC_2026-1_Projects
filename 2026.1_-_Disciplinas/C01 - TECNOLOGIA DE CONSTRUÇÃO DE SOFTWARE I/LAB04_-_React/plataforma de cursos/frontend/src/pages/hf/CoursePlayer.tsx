import '../../styles/hifi.css'

export default function CoursePlayer(){
  return (
    <div style={{padding:28}}>
      <div className="player">
        <div className="video">Vídeo do curso (mocked player)</div>
        <div className="controls">▮◀︎ ◉ ▶︎ ▌▌</div>
      </div>
      <div style={{display:'flex',gap:16,marginTop:16}}>
        <div style={{flex:1}}>
          <h3 style={{margin:0}}>Lista de aulas</h3>
        </div>
        <aside style={{width:320}}>
          <div className="hf-card">Recursos e notas</div>
        </aside>
      </div>
    </div>
  )
}
