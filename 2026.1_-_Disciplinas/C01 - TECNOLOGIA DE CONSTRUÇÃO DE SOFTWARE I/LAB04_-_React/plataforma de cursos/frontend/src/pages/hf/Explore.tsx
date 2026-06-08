import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categorias, formatNivel, getCursosPorCategoria } from '../../data/mockData'
import { StarIcon } from '../../components/Icons'
import '../../styles/hifi.css'

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  const displayedCourses = getCursosPorCategoria(activeCategory).filter(c =>
    c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instrutor?.nome || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const gradientColors = [
    'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)',
    'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 100%)',
    'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(245,158,11,0.1) 100%)',
    'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(236,72,153,0.1) 100%)',
    'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(99,102,241,0.1) 100%)',
    'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.1) 100%)'
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="hf-top">
        <input
          type="text"
          className="hf-search"
          placeholder="Buscar cursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="hf-actions">
          <span className="pill">Filtrar</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>Explorar Cursos</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            <button
              onClick={() => setActiveCategory('Todos')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                background: activeCategory === 'Todos' ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' : 'rgba(255,255,255,0.05)',
                color: activeCategory === 'Todos' ? 'white' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid ' + (activeCategory === 'Todos' ? 'transparent' : 'rgba(255,255,255,0.08)'),
                transition: 'all 0.2s ease',
              }}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.idCategoria}
                onClick={() => setActiveCategory(cat.nome)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: activeCategory === cat.nome ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.nome ? 'white' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid ' + (activeCategory === cat.nome ? 'transparent' : 'rgba(255,255,255,0.08)'),
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {displayedCourses.length === 0 ? (
          <div className="hf-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Nenhum curso encontrado nesta categoria ou busca.
          </div>
        ) : (
          <div className="hf-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {displayedCourses.map((c, index) => {
              const bgGradient = gradientColors[index % gradientColors.length]
              return (
                <Link key={c.idCurso} to={`/course/${c.idCurso}`} style={{ textDecoration: 'none' }}>
                  <div className="hf-card hf-card-recommended" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div>
                      <div style={{ height: '120px', borderRadius: '12px', background: bgGradient, marginBottom: '12px', border: '1px solid rgba(255,255,255,0.04)' }} />
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.titulo}</h3>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)' }}>por {c.instrutor?.nome}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatNivel(c.nivel)}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <StarIcon size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                        4.8
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
