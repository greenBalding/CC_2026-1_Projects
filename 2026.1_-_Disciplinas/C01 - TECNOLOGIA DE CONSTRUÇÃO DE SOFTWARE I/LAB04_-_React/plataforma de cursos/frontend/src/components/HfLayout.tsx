import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { currentUser, assinaturas } from '../data/mockData'
import '../styles/hifi.css'

interface Props {
  children: ReactNode
}

import { HomeIcon, SearchIcon, PlayIcon, MapIcon, UserIcon, StarIcon } from './Icons'

const navItems = [
  { to: '/dashboard', icon: <HomeIcon size={16} style={{ marginRight: '8px' }} />, label: 'Início' },
  { to: '/explore',   icon: <SearchIcon size={16} style={{ marginRight: '8px' }} />, label: 'Explorar' },
  { to: '/cursos',    icon: <PlayIcon size={16} style={{ marginRight: '8px' }} />, label: 'Meus Cursos' },
  { to: '/trilhas',   icon: <MapIcon size={16} style={{ marginRight: '8px' }} />, label: 'Trilhas' },
  { to: '/profile',   icon: <UserIcon size={16} style={{ marginRight: '8px' }} />, label: 'Perfil' },
]

export default function HfLayout({ children }: Props) {
  const location = useLocation()
  const isPro = assinaturas.some(
    (a) => a.idUsuario === currentUser.idUsuario
  )

  return (
    <div className="hf-shell">
      <div className="hf-sidebar">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="logo">LearnGPT</div>
        </Link>

        <nav>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  paddingLeft: '14px',
                  background: isActive ? 'var(--glass-light)' : undefined,
                  color: isActive ? 'var(--text-primary)' : undefined,
                }}
              >
                {item.icon} {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {currentUser.nome.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.nome}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                {isPro ? (
                  <>
                    <StarIcon size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                    <span>Pro</span>
                  </>
                ) : 'Free'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hf-main">
        {children}
      </div>
    </div>
  )
}
