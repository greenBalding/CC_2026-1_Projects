import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { StarIcon, PlayIcon, SearchIcon, LockIcon } from '../../components/Icons';

export default function Explore() {
  const { currentUser, cursos, categorias, matriculas, usuarios, avaliacoes, refreshData, showAlert } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingEnroll, setLoadingEnroll] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  // Filter courses by category
  const filteredByCategory =
    activeCategory === 'Todos'
      ? cursos
      : cursos.filter((c) => {
          const categoryObj = categorias.find((cat) => cat.idCategoria === c.idCategoria);
          return categoryObj?.nome === activeCategory;
        });

  // Filter courses by search query
  const displayedCourses = filteredByCategory.filter((c) => {
    const instrutorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || '';
    return (
      c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrutorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle enrollment simulation
  const handleEnroll = async (courseId: string) => {
    setLoadingEnroll(courseId);
    try {
      const newMatricula = {
        idMatricula: `mat-${Date.now()}`,
        idUsuario: currentUser.idUsuario,
        idCurso: courseId,
        dataMatricula: new Date().toISOString().split('T')[0],
        dataConclusao: null,
      };
      await api.createMatricula(newMatricula);
      await refreshData();
      showAlert('Matrícula realizada com sucesso! Bons estudos.', 'success');
    } catch (err) {
      console.error(err);
      showAlert('Falha ao realizar matrícula. Tente novamente.', 'error');
    } finally {
      setLoadingEnroll(null);
    }
  };

  const gradientColors = [
    'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)',
    'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 100%)',
    'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(245,158,11,0.1) 100%)',
    'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(236,72,153,0.1) 100%)',
    'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(99,102,241,0.1) 100%)',
    'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.1) 100%)',
  ];

  return (
    <div className="container-fluid py-2">
      {/* Top Search Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="input-group input-group-lg bg-black border border-secondary rounded shadow-sm">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <SearchIcon size={20} />
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-0 text-white"
              placeholder="Buscar por títulos de cursos, descrição ou instrutores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Title & Category Filters */}
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-3">Catálogo de Cursos</h2>
        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('Todos')}
            className={`btn rounded-pill px-3 py-2 fw-semibold ${
              activeCategory === 'Todos' ? 'btn-primary text-white' : 'btn-outline-secondary text-light'
            }`}
            style={{ fontSize: '13px' }}
          >
            Todos Cursos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.idCategoria}
              onClick={() => setActiveCategory(cat.nome)}
              className={`btn rounded-pill px-3 py-2 fw-semibold ${
                activeCategory === cat.nome ? 'btn-primary text-white' : 'btn-outline-secondary text-light'
              }`}
              style={{ fontSize: '13px' }}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      {displayedCourses.length === 0 ? (
        <div className="card border-secondary bg-black bg-opacity-25 text-white p-5 text-center shadow-sm">
          <h4 className="fw-semibold">Nenhum curso encontrado</h4>
          <p className="text-muted">Tente ajustar os termos de busca ou mudar a categoria selecionada.</p>
        </div>
      ) : (
        <div className="row g-4">
          {displayedCourses.map((c, index) => {
            const bgGradient = gradientColors[index % gradientColors.length];
            const isEnrolled = matriculas.some(
              (m) => m.idUsuario === currentUser.idUsuario && m.idCurso === c.idCurso
            );
            const instrutorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || 'Instrutor';
            const isEmBreve = !c.bannerUrl;

            return (
              <div className="col-md-6 col-lg-4" key={c.idCurso}>
                <div
                  className={`card bg-black text-white h-100 shadow-sm d-flex flex-column justify-content-between position-relative ${
                    isEmBreve ? '' : 'hover-card'
                  }`}
                  onClick={(e) => {
                    if (isEmBreve) return;
                    if ((e.target as HTMLElement).closest('button, a')) {
                      return;
                    }
                    if (isEnrolled) {
                      navigate(`/player/${c.idCurso}`);
                    } else {
                      navigate(`/course/${c.idCurso}`);
                    }
                  }}
                  style={{
                    border: isEmBreve ? '2px dashed rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.15)',
                    opacity: isEmBreve ? 0.45 : 1,
                    filter: isEmBreve ? 'grayscale(100%)' : 'none',
                    cursor: isEmBreve ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isEmBreve && (
                    <div
                      className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded bg-dark bg-opacity-75 border border-secondary border-opacity-50 d-flex align-items-center gap-1"
                      style={{ zIndex: 2, fontSize: '10px', backdropFilter: 'blur(4px)' }}
                    >
                      <LockIcon size={12} className="text-secondary" />
                      <span className="text-muted fw-bold" style={{ letterSpacing: '0.05em' }}>EM BREVE</span>
                    </div>
                  )}

                  <div>
                    {/* Header Image box */}
                    {c.bannerUrl ? (
                      <img
                        src={c.bannerUrl}
                        alt={c.titulo}
                        className="w-100 rounded-top"
                        style={{
                          aspectRatio: '16 / 9',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className="w-100 rounded-top d-flex flex-column align-items-center justify-content-center text-muted"
                        style={{
                          aspectRatio: '16 / 9',
                          background: bgGradient,
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          fontSize: '14px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <LockIcon size={24} className="mb-2 text-muted" style={{ opacity: 0.6 }} />
                        <span>Em breve...</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary text-uppercase" style={{ fontSize: '8px' }}>
                          {c.nivel}
                        </span>
                        <span className="small text-muted" style={{ fontSize: '11px' }}>
                          {c.totalHoras}h de carga
                        </span>
                      </div>
                      
                      <h5 className="card-title fw-bold text-light mb-2">{c.titulo}</h5>
                      <p className="text-muted small mb-3">
                        {c.descricao}
                      </p>
                      <p className="text-muted small mb-0">Instrutor: <strong className="text-light">{instrutorName}</strong></p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-top border-secondary border-opacity-25 mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pt-3">
                      <span className="text-muted small">{c.totalAulas} aulas</span>
                      {(() => {
                        const courseReviews = avaliacoes.filter((r) => r.idCurso === c.idCurso);
                        const avgRating = courseReviews.length > 0
                          ? (courseReviews.reduce((sum, r) => sum + Number(r.nota), 0) / courseReviews.length).toFixed(1)
                          : '4.8';
                        return (
                          <span className="small text-warning d-flex align-items-center gap-1">
                            <StarIcon size={12} fill="#ffc107" /> {avgRating}
                          </span>
                        );
                      })()}
                    </div>

                    {currentUser.perfil === 'administrador' ? (
                      <button
                        onClick={() => navigate(`/admin?tab=courses&edit=${c.idCurso}`)}
                        className="btn btn-primary w-100 fw-semibold"
                      >
                        Editar Curso
                      </button>
                    ) : isEmBreve ? (
                      <button
                        disabled
                        className="btn btn-secondary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                        style={{ cursor: 'not-allowed' }}
                      >
                        <LockIcon size={14} /> Em breve
                      </button>
                    ) : isEnrolled ? (
                      <button
                        onClick={() => navigate(`/player/${c.idCurso}`)}
                        className="btn btn-outline-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      >
                        <PlayIcon size={14} fill="currentColor" /> Acessar Curso
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(c.idCurso)}
                        disabled={loadingEnroll === c.idCurso}
                        className="btn btn-primary w-100 fw-semibold"
                      >
                        {loadingEnroll === c.idCurso ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          'Matricular-se'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
