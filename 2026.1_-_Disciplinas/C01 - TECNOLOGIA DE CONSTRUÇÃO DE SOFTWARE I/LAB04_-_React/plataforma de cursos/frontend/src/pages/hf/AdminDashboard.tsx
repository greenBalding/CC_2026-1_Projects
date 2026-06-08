import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const {
    currentUser,
    usuarios,
    categorias,
    cursos,
    modulos,
    aulas,
    trilhas,
    refreshData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'courses' | 'modules' | 'trilhas'>('users');
  const [submitting, setSubmitting] = useState(false);

  // --- FORM STATES ---
  // Users Form
  const [userNome, setUserNome] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPerfil, setUserPerfil] = useState<'aluno' | 'instrutor' | 'administrador'>('aluno');

  // Categories Form
  const [catNome, setCatNome] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Courses Form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [courseHours, setCourseHours] = useState(10);

  // Modules Form
  const [modCourseId, setModCourseId] = useState('');
  const [modTitle, setModTitle] = useState('');
  const [modOrder, setModOrder] = useState(1);

  // Lessons Form
  const [lessonCourseId, setLessonCourseId] = useState('');
  const [lessonModId, setLessonModId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'video' | 'texto' | 'quiz'>('video');
  const [lessonDuration, setLessonDuration] = useState(15);
  const [lessonOrder, setLessonOrder] = useState(1);

  // Trilhas Form
  const [trilhaTitle, setTrilhaTitle] = useState('');
  const [trilhaDesc, setTrilhaDesc] = useState('');
  const [trilhaCategory, setTrilhaCategory] = useState('');

  // Link Course to Trail Form
  const [linkTrilhaId, setLinkTrilhaId] = useState('');
  const [linkCourseId, setLinkCourseId] = useState('');
  const [linkOrder, setLinkOrder] = useState(1);

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  // Security Check: Alunos cannot edit
  const isAllowed = currentUser.perfil === 'administrador' || currentUser.perfil === 'instrutor';

  if (!isAllowed) {
    return (
      <div className="card border-danger bg-black text-white p-5 text-center shadow">
        <h2 className="fw-bold mb-3 text-danger">Acesso Negado</h2>
        <p className="text-muted mb-4">
          Seu usuário atual (<strong>{currentUser.nome}</strong>) possui perfil <strong>{currentUser.perfil}</strong>.
          Somente Administradores ou Instrutores podem acessar o painel administrativo.
        </p>
        <div className="alert alert-info d-inline-block px-4 py-2 border-info bg-info bg-opacity-10 text-info">
          💡 <strong>Dica:</strong> Altere o usuário na barra superior para <strong>Diego Fernandes</strong> ou <strong>Admin Sistema</strong> para testar.
        </div>
      </div>
    );
  }

  // --- SUBMIT HANDLERS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newUser = {
        idUsuario: `u-${Date.now()}`,
        nome: userNome,
        email: userEmail,
        perfil: userPerfil,
        senhaHash: '123456',
        ativo: true,
        dataCriacao: new Date(),
        dataAlteracao: new Date(),
      };
      await api.createUsuario(newUser);
      await refreshData();
      alert('Usuário cadastrado com sucesso!');
      setUserNome('');
      setUserEmail('');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar usuário.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newCat = {
        idCategoria: `cat-${Date.now()}`,
        nome: catNome,
        descricao: catDesc,
        ativa: true,
      };
      await api.createCategoria(newCat);
      await refreshData();
      alert('Categoria cadastrada com sucesso!');
      setCatNome('');
      setCatDesc('');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar categoria.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseInstructor || !courseCategory) {
      alert('Selecione um instrutor e uma categoria.');
      return;
    }
    setSubmitting(true);
    try {
      const newCourse = {
        idCurso: `c-${Date.now()}`,
        titulo: courseTitle,
        descricao: courseDesc,
        idInstrutor: courseInstructor,
        idCategoria: courseCategory,
        nivel: courseLevel,
        dataPublicacao: new Date().toISOString().split('T')[0],
        totalAulas: 0,
        totalHoras: Number(courseHours),
      };
      await api.createCurso(newCourse);
      await refreshData();
      alert('Curso cadastrado com sucesso!');
      setCourseTitle('');
      setCourseDesc('');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar curso.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modCourseId) {
      alert('Selecione um curso.');
      return;
    }
    setSubmitting(true);
    try {
      const newMod = {
        idModulo: `m-${Date.now()}`,
        idCurso: modCourseId,
        titulo: modTitle,
        ordem: Number(modOrder),
      };
      await api.createModulo(newMod);
      await refreshData();
      alert('Módulo cadastrado com sucesso!');
      setModTitle('');
      setModOrder((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar módulo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModId) {
      alert('Selecione um módulo.');
      return;
    }
    setSubmitting(true);
    try {
      const newLesson = {
        idAula: `a-${Date.now()}`,
        idModulo: lessonModId,
        titulo: lessonTitle,
        tipoConteudo: lessonType,
        urlConteudo: '#',
        duracaoMinutos: Number(lessonDuration),
        ordem: Number(lessonOrder),
      };
      await api.createAula(newLesson);
      await refreshData();
      alert('Aula cadastrada com sucesso!');
      setLessonTitle('');
      setLessonOrder((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar aula.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTrilha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trilhaCategory) {
      alert('Selecione uma categoria.');
      return;
    }
    setSubmitting(true);
    try {
      const newTrilha = {
        idTrilha: `t-${Date.now()}`,
        titulo: trilhaTitle,
        descricao: trilhaDesc,
        idCategoria: trilhaCategory,
      };
      await api.createTrilha(newTrilha);
      await refreshData();
      alert('Trilha cadastrada com sucesso!');
      setTrilhaTitle('');
      setTrilhaDesc('');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar trilha.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkCourseToTrail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTrilhaId || !linkCourseId) {
      alert('Selecione a trilha e o curso.');
      return;
    }
    setSubmitting(true);
    try {
      const newLink = {
        idTrilha: linkTrilhaId,
        idCurso: linkCourseId,
        ordem: Number(linkOrder),
      };
      await api.createTrilhaCurso(newLink);
      await refreshData();
      alert('Curso vinculado à trilha com sucesso!');
      setLinkOrder((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Erro ao vincular curso à trilha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      {/* Title */}
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">Painel Administrativo</h2>
        <p className="text-muted">Crie e edite cursos, categorias, usuários e configure as trilhas de conhecimento.</p>
      </div>

      {/* Tabs navigation */}
      <ul className="nav nav-tabs border-secondary mb-4">
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('users')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'users' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            👥 Usuários
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('categories')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'categories' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            📁 Categorias
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('courses')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'courses' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            📚 Cursos
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('modules')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'modules' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            ⚙️ Módulos & Aulas
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('trilhas')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'trilhas' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            🧭 Trilhas
          </button>
        </li>
      </ul>

      {/* Tab Panels */}
      <div className="tab-content">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Cadastrar Novo Usuário</h5>
                <form onSubmit={handleCreateUser}>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={userNome}
                      onChange={(e) => setUserNome(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">E-mail</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted mb-1">Perfil de Acesso</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={userPerfil}
                      onChange={(e) => setUserPerfil(e.target.value as any)}
                    >
                      <option value="aluno">Aluno</option>
                      <option value="instrutor">Instrutor</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Cadastrar Usuário
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Usuários Cadastrados</h5>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Nome</th>
                        <th className="border-secondary text-muted small">E-mail</th>
                        <th className="border-secondary text-muted small">Perfil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.idUsuario}>
                          <td className="border-secondary text-light fw-semibold">{u.nome}</td>
                          <td className="border-secondary text-muted small">{u.email}</td>
                          <td className="border-secondary text-capitalize text-muted small">{u.perfil}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Cadastrar Nova Categoria</h5>
                <form onSubmit={handleCreateCategory}>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Nome da Categoria</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={catNome}
                      onChange={(e) => setCatNome(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted mb-1">Descrição</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows={3}
                      required
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Cadastrar Categoria
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Categorias Cadastradas</h5>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Nome</th>
                        <th className="border-secondary text-muted small">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((cat) => (
                        <tr key={cat.idCategoria}>
                          <td className="border-secondary text-light fw-semibold">{cat.nome}</td>
                          <td className="border-secondary text-muted small">{cat.descricao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Cadastrar Novo Curso</h5>
                <form onSubmit={handleCreateCourse}>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Título do Curso</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Descrição</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows={2}
                      required
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Instrutor</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={courseInstructor}
                        onChange={(e) => setCourseInstructor(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {usuarios.filter(u => u.perfil === 'instrutor').map((inst) => (
                          <option key={inst.idUsuario} value={inst.idUsuario}>{inst.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Categoria</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (
                          <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Nível</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value as any)}
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Horas</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        required
                        value={courseHours}
                        onChange={(e) => setCourseHours(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Cadastrar Curso
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Cursos Cadastrados</h5>
                <div className="table-responsive" style={{ maxHeight: '420px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Título</th>
                        <th className="border-secondary text-muted small">Categoria</th>
                        <th className="border-secondary text-muted small">Carga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursos.map((c) => {
                        const catObj = categorias.find((cat) => cat.idCategoria === c.idCategoria);
                        return (
                          <tr key={c.idCurso}>
                            <td className="border-secondary text-light fw-semibold">{c.titulo}</td>
                            <td className="border-secondary text-muted small">{catObj?.nome || 'Tecnologia'}</td>
                            <td className="border-secondary text-muted small">{c.totalHoras}h</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULES & LESSONS TAB */}
        {activeTab === 'modules' && (
          <div className="row g-4">
            {/* Create module */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">1. Cadastrar Módulo</h5>
                <form onSubmit={handleCreateModule}>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Selecionar Curso</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={modCourseId}
                      onChange={(e) => setModCourseId(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {cursos.map((c) => (
                        <option key={c.idCurso} value={c.idCurso}>{c.titulo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Título do Módulo</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={modTitle}
                      onChange={(e) => setModTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted mb-1">Ordem do Módulo</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={modOrder}
                      onChange={(e) => setModOrder(Number(e.target.value))}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Cadastrar Módulo
                  </button>
                </form>
              </div>
            </div>

            {/* Create lesson */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">2. Cadastrar Aula</h5>
                <form onSubmit={handleCreateLesson}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Curso</label>
                      <select
                        className="form-select bg-dark text-light border-secondary form-select-sm"
                        value={lessonCourseId}
                        onChange={(e) => {
                          setLessonCourseId(e.target.value);
                          setLessonModId('');
                        }}
                      >
                        <option value="">Selecione...</option>
                        {cursos.map((c) => (
                          <option key={c.idCurso} value={c.idCurso}>{c.titulo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Módulo</label>
                      <select
                        className="form-select bg-dark text-light border-secondary form-select-sm"
                        value={lessonModId}
                        onChange={(e) => setLessonModId(e.target.value)}
                        disabled={!lessonCourseId}
                      >
                        <option value="">Selecione...</option>
                        {modulos.filter(m => m.idCurso === lessonCourseId).map((mod) => (
                          <option key={mod.idModulo} value={mod.idModulo}>{mod.titulo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Título da Aula</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary form-control-sm"
                      required
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                  </div>
                  <div className="row g-2 mb-4">
                    <div className="col-4">
                      <label className="form-label small text-muted mb-1">Tipo</label>
                      <select
                        className="form-select bg-dark text-light border-secondary form-select-sm"
                        value={lessonType}
                        onChange={(e) => setLessonType(e.target.value as any)}
                      >
                        <option value="video">Vídeo</option>
                        <option value="texto">Texto</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-muted mb-1">Minutos</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary form-control-sm"
                        required
                        value={lessonDuration}
                        onChange={(e) => setLessonDuration(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-muted mb-1">Ordem</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary form-control-sm"
                        required
                        value={lessonOrder}
                        onChange={(e) => setLessonOrder(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold btn-sm">
                    Cadastrar Aula
                  </button>
                </form>
              </div>
            </div>

            {/* Structured Courses list syllabus */}
            <div className="col-lg-4">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Grade Estruturada</h5>
                {cursos.map((c) => {
                  const courseMods = modulos.filter(m => m.idCurso === c.idCurso).sort((a,b) => a.ordem - b.ordem);
                  return (
                    <details key={c.idCurso} className="mb-2">
                      <summary className="fw-semibold small cursor-pointer text-light py-1">{c.titulo}</summary>
                      <div className="ps-3 border-start border-secondary">
                        {courseMods.map(m => {
                          const mLessons = aulas.filter(a => a.idModulo === m.idModulo).sort((a,b) => a.ordem - b.ordem);
                          return (
                            <div key={m.idModulo} className="my-1">
                              <span className="text-muted small d-block">Módulo {m.ordem}: {m.titulo}</span>
                              {mLessons.map(a => (
                                <span key={a.idAula} className="text-muted small ps-3 d-block" style={{ fontSize: '11px' }}>
                                  - Aula {a.ordem}: {a.titulo} ({a.duracaoMinutos}m)
                                </span>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TRILHAS TAB */}
        {activeTab === 'trilhas' && (
          <div className="row g-4">
            {/* Create Trail */}
            <div className="col-lg-6">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm mb-4">
                <h5 className="fw-bold mb-3">Criar Nova Trilha</h5>
                <form onSubmit={handleCreateTrilha}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Título</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        required
                        value={trilhaTitle}
                        onChange={(e) => setTrilhaTitle(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Categoria</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={trilhaCategory}
                        onChange={(e) => setTrilhaCategory(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (
                          <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted mb-1">Descrição Curta</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows={2}
                      required
                      value={trilhaDesc}
                      onChange={(e) => setTrilhaDesc(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Cadastrar Trilha
                  </button>
                </form>
              </div>
            </div>

            {/* Link Course to Trail */}
            <div className="col-lg-6">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Vincular Curso à Trilha</h5>
                <form onSubmit={handleLinkCourseToTrail}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Selecionar Trilha</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={linkTrilhaId}
                        onChange={(e) => setLinkTrilhaId(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {trilhas.map((tr) => (
                          <option key={tr.idTrilha} value={tr.idTrilha}>{tr.titulo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Selecionar Curso</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        value={linkCourseId}
                        onChange={(e) => setLinkCourseId(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {cursos.map((c) => (
                          <option key={c.idCurso} value={c.idCurso}>{c.titulo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted mb-1">Ordem do Curso na Trilha</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={linkOrder}
                      onChange={(e) => setLinkOrder(Number(e.target.value))}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    Vincular Curso
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
