import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    showAlert,
    showConfirm,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const editCourseId = searchParams.get('edit');
  const tabParam = searchParams.get('tab');

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
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

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
  const [editingModId, setEditingModId] = useState<string | null>(null);

  // Lessons Form
  const [lessonCourseId, setLessonCourseId] = useState('');
  const [lessonModId, setLessonModId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'video' | 'texto' | 'quiz'>('video');
  const [lessonDuration, setLessonDuration] = useState(15);
  const [lessonOrder, setLessonOrder] = useState(1);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Trilhas Form
  const [trilhaTitle, setTrilhaTitle] = useState('');
  const [trilhaDesc, setTrilhaDesc] = useState('');
  const [trilhaCategory, setTrilhaCategory] = useState('');
  const [editingTrilhaId, setEditingTrilhaId] = useState<string | null>(null);

  // Link Course to Trail Form
  const [linkTrilhaId, setLinkTrilhaId] = useState('');
  const [linkCourseId, setLinkCourseId] = useState('');
  const [linkOrder, setLinkOrder] = useState(1);

  // Sync tab from query param
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Sync edit course state
  useEffect(() => {
    if (editCourseId) {
      const course = cursos.find((c) => c.idCurso === editCourseId);
      if (course) {
        setCourseTitle(course.titulo);
        setCourseDesc(course.descricao);
        setCourseInstructor(course.idInstrutor);
        setCourseCategory(course.idCategoria);
        setCourseLevel(course.nivel);
        setCourseHours(course.totalHoras);
      }
    } else {
      setCourseTitle('');
      setCourseDesc('');
      setCourseInstructor('');
      setCourseCategory('');
      setCourseLevel('iniciante');
      setCourseHours(10);
    }
  }, [editCourseId, cursos]);

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
          <strong>Dica:</strong> Altere o usuário na barra superior para <strong>Diego Fernandes</strong> ou <strong>Admin Sistema</strong> para testar.
        </div>
      </div>
    );
  }

  // --- SUBMIT HANDLERS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const generatedId = `u-${Date.now()}`;
      const newUser = {
        id: generatedId,
        idUsuario: generatedId,
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
      showAlert('Usuário cadastrado com sucesso!', 'success');
      setUserNome('');
      setUserEmail('');
    } catch (err) {
      console.error(err);
      showAlert('Erro ao cadastrar usuário.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCatId) {
        await api.updateCategoria(editingCatId, {
          nome: catNome,
          descricao: catDesc,
        });
        await refreshData();
        showAlert('Categoria atualizada com sucesso!', 'success');
        setEditingCatId(null);
        setCatNome('');
        setCatDesc('');
      } else {
        const generatedId = `cat-${Date.now()}`;
        const newCat = {
          id: generatedId,
          idCategoria: generatedId,
          nome: catNome,
          descricao: catDesc,
          ativa: true,
        };
        await api.createCategoria(newCat);
        await refreshData();
        showAlert('Categoria cadastrada com sucesso!', 'success');
        setCatNome('');
        setCatDesc('');
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar categoria.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir esta categoria?',
      async () => {
        try {
          await api.deleteCategoria(catId);
          await refreshData();
          showAlert('Categoria excluída com sucesso!', 'success');
          if (editingCatId === catId) {
            setEditingCatId(null);
            setCatNome('');
            setCatDesc('');
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir categoria.', 'error');
        }
      }
    );
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseInstructor || !courseCategory) {
      showAlert('Selecione um instrutor e uma categoria.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editCourseId) {
        await api.updateCurso(editCourseId, {
          titulo: courseTitle,
          descricao: courseDesc,
          idInstrutor: courseInstructor,
          idCategoria: courseCategory,
          nivel: courseLevel,
          totalHoras: Number(courseHours),
        });
        await refreshData();
        showAlert('Curso atualizado com sucesso!', 'success');
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('edit');
        setSearchParams(newParams);
      } else {
        const generatedId = `c-${Date.now()}`;
        const newCourse = {
          id: generatedId,
          idCurso: generatedId,
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
        showAlert('Curso cadastrado com sucesso!', 'success');
        setCourseTitle('');
        setCourseDesc('');
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar curso.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir este curso? O curso e seus dados serão removidos.',
      async () => {
        try {
          await api.deleteCurso(courseId);
          await refreshData();
          showAlert('Curso excluído com sucesso!', 'success');
          if (editCourseId === courseId) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('edit');
            setSearchParams(newParams);
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir curso.', 'error');
        }
      }
    );
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modCourseId) {
      showAlert('Selecione um curso.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingModId) {
        await api.updateModulo(editingModId, {
          idCurso: modCourseId,
          titulo: modTitle,
          ordem: Number(modOrder),
        });
        await refreshData();
        showAlert('Módulo atualizado com sucesso!', 'success');
        setEditingModId(null);
        setModTitle('');
      } else {
        const generatedId = `m-${Date.now()}`;
        const newMod = {
          id: generatedId,
          idModulo: generatedId,
          idCurso: modCourseId,
          titulo: modTitle,
          ordem: Number(modOrder),
        };
        await api.createModulo(newMod);
        await refreshData();
        showAlert('Módulo cadastrado com sucesso!', 'success');
        setModTitle('');
        setModOrder((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar módulo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (modId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir este módulo?',
      async () => {
        try {
          await api.deleteModulo(modId);
          await refreshData();
          showAlert('Módulo excluído com sucesso!', 'success');
          if (editingModId === modId) {
            setEditingModId(null);
            setModTitle('');
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir módulo.', 'error');
        }
      }
    );
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModId) {
      showAlert('Selecione um módulo.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingLessonId) {
        await api.updateAula(editingLessonId, {
          idModulo: lessonModId,
          titulo: lessonTitle,
          tipoConteudo: lessonType,
          duracaoMinutos: Number(lessonDuration),
          ordem: Number(lessonOrder),
        });
        await refreshData();
        showAlert('Aula atualizada com sucesso!', 'success');
        setEditingLessonId(null);
        setLessonTitle('');
      } else {
        const generatedId = `a-${Date.now()}`;
        const newLesson = {
          id: generatedId,
          idAula: generatedId,
          idModulo: lessonModId,
          titulo: lessonTitle,
          tipoConteudo: lessonType,
          urlConteudo: '#',
          duracaoMinutos: Number(lessonDuration),
          ordem: Number(lessonOrder),
        };
        await api.createAula(newLesson);
        await refreshData();
        showAlert('Aula cadastrada com sucesso!', 'success');
        setLessonTitle('');
        setLessonOrder((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar aula.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir esta aula?',
      async () => {
        try {
          await api.deleteAula(lessonId);
          await refreshData();
          showAlert('Aula excluída com sucesso!', 'success');
          if (editingLessonId === lessonId) {
            setEditingLessonId(null);
            setLessonTitle('');
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir aula.', 'error');
        }
      }
    );
  };

  const handleCreateTrilha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trilhaCategory) {
      showAlert('Selecione uma categoria.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingTrilhaId) {
        await api.updateTrilha(editingTrilhaId, {
          titulo: trilhaTitle,
          descricao: trilhaDesc,
          idCategoria: trilhaCategory,
        });
        await refreshData();
        showAlert('Trilha atualizada com sucesso!', 'success');
        setEditingTrilhaId(null);
        setTrilhaTitle('');
        setTrilhaDesc('');
      } else {
        const generatedId = `t-${Date.now()}`;
        const newTrilha = {
          id: generatedId,
          idTrilha: generatedId,
          titulo: trilhaTitle,
          descricao: trilhaDesc,
          idCategoria: trilhaCategory,
        };
        await api.createTrilha(newTrilha);
        await refreshData();
        showAlert('Trilha cadastrada com sucesso!', 'success');
        setTrilhaTitle('');
        setTrilhaDesc('');
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar trilha.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrilha = async (trilhaId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir esta trilha?',
      async () => {
        try {
          await api.deleteTrilha(trilhaId);
          await refreshData();
          showAlert('Trilha excluída com sucesso!', 'success');
          if (editingTrilhaId === trilhaId) {
            setEditingTrilhaId(null);
            setTrilhaTitle('');
            setTrilhaDesc('');
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir trilha.', 'error');
        }
      }
    );
  };

  const handleLinkCourseToTrail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTrilhaId || !linkCourseId) {
      showAlert('Selecione a trilha e o curso.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const newLink = {
        id: `tc-${Date.now()}`,
        idTrilha: linkTrilhaId,
        idCurso: linkCourseId,
        ordem: Number(linkOrder),
      };
      await api.createTrilhaCurso(newLink);
      await refreshData();
      showAlert('Curso vinculado à trilha com sucesso!', 'success');
      setLinkOrder((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      showAlert('Erro ao vincular curso à trilha.', 'error');
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
            Usuários
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('categories')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'categories' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Categorias
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('courses')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'courses' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Cursos
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('modules')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'modules' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Módulos & Aulas
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('trilhas')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'trilhas' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Trilhas
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
                <h5 className="fw-bold mb-3">{editingCatId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}</h5>
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
                    {editingCatId ? 'Salvar Alterações' : 'Cadastrar Categoria'}
                  </button>
                  {editingCatId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(null);
                        setCatNome('');
                        setCatDesc('');
                      }}
                      className="btn btn-outline-secondary w-100 mt-2 fw-semibold text-light"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm mb-4">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Categorias Cadastradas</h5>
                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Nome</th>
                        <th className="border-secondary text-muted small">Descrição</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((cat) => (
                        <tr key={cat.idCategoria}>
                          <td className="border-secondary text-light fw-semibold">{cat.nome}</td>
                          <td className="border-secondary text-muted small">{cat.descricao}</td>
                          <td className="border-secondary text-end small">
                            <button
                              onClick={() => {
                                setEditingCatId(cat.idCategoria);
                                setCatNome(cat.nome);
                                setCatDesc(cat.descricao);
                              }}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.idCategoria)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Relação: Listar cursos de uma categoria específica */}
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Listar Cursos por Categoria</h5>
                <div className="mb-3">
                  <label className="form-label small text-muted mb-1">Selecionar Categoria</label>
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                {selectedCategoryFilter ? (
                  <div className="table-responsive" style={{ maxHeight: '250px' }}>
                    <table className="table table-dark table-striped table-hover mb-0 align-middle">
                      <thead>
                        <tr>
                          <th className="border-secondary text-muted small">Curso</th>
                          <th className="border-secondary text-muted small">Nível</th>
                          <th className="border-secondary text-muted small text-end">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cursos.filter((c) => c.idCategoria === selectedCategoryFilter).length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center text-muted small py-3">
                              Nenhum curso cadastrado nesta categoria.
                            </td>
                          </tr>
                        ) : (
                          cursos.filter((c) => c.idCategoria === selectedCategoryFilter).map((c) => (
                            <tr key={c.idCurso}>
                              <td className="border-secondary text-light fw-semibold small">{c.titulo}</td>
                              <td className="border-secondary text-muted text-capitalize small">{c.nivel}</td>
                              <td className="border-secondary text-end small">
                                <button
                                  onClick={() => setSearchParams({ tab: 'courses', edit: c.idCurso })}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Editar Curso
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted small mb-0 text-center py-2">Selecione uma categoria para visualizar seus cursos vinculados.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">{editCourseId ? 'Editar Curso' : 'Cadastrar Novo Curso'}</h5>
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
                    {editCourseId ? 'Salvar Alterações' : 'Cadastrar Curso'}
                  </button>
                  {editCourseId && (
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('edit');
                        setSearchParams(newParams);
                      }}
                      className="btn btn-outline-secondary w-100 mt-2 fw-semibold text-light"
                    >
                      Cancelar Edição
                    </button>
                  )}
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
                        <th className="border-secondary text-muted small text-end">Ações</th>
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
                            <td className="border-secondary text-end small">
                              <button
                                onClick={() => setSearchParams({ tab: 'courses', edit: c.idCurso })}
                                className="btn btn-sm btn-outline-primary me-2"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c.idCurso)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Excluir
                              </button>
                            </td>
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
                <h5 className="fw-bold mb-3">{editingModId ? 'Editar Módulo' : '1. Cadastrar Módulo'}</h5>
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
                    {editingModId ? 'Salvar Alterações' : 'Cadastrar Módulo'}
                  </button>
                  {editingModId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingModId(null);
                        setModTitle('');
                      }}
                      className="btn btn-outline-secondary w-100 mt-2 fw-semibold text-light"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Create lesson */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">{editingLessonId ? 'Editar Aula' : '2. Cadastrar Aula'}</h5>
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
                    {editingLessonId ? 'Salvar Alterações' : 'Cadastrar Aula'}
                  </button>
                  {editingLessonId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLessonId(null);
                        setLessonTitle('');
                      }}
                      className="btn btn-outline-secondary w-100 mt-2 fw-semibold text-light btn-sm"
                    >
                      Cancelar Edição
                    </button>
                  )}
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
                            <div key={m.idModulo} className="my-2 border-bottom border-secondary border-opacity-25 pb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-light small fw-bold">Mód {m.ordem}: {m.titulo}</span>
                                <div className="d-flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingModId(m.idModulo);
                                      setModCourseId(m.idCurso);
                                      setModTitle(m.titulo);
                                      setModOrder(m.ordem);
                                    }}
                                    className="btn btn-link p-0 text-primary small text-decoration-none"
                                    style={{ fontSize: '10px' }}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(m.idModulo)}
                                    className="btn btn-link p-0 text-danger small text-decoration-none"
                                    style={{ fontSize: '10px' }}
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </div>
                              {mLessons.map(a => (
                                <div key={a.idAula} className="ps-2 d-flex justify-content-between align-items-center py-0.5" style={{ fontSize: '11px' }}>
                                  <span className="text-muted text-truncate" style={{ maxWidth: '160px' }}>
                                    - Aula {a.ordem}: {a.titulo} ({a.duracaoMinutos}m)
                                  </span>
                                  <div className="d-flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingLessonId(a.idAula);
                                        setLessonCourseId(c.idCurso);
                                        setLessonModId(a.idModulo);
                                        setLessonTitle(a.titulo);
                                        setLessonType(a.tipoConteudo as any);
                                        setLessonDuration(a.duracaoMinutos);
                                        setLessonOrder(a.ordem);
                                      }}
                                      className="btn btn-link p-0 text-primary text-decoration-none"
                                      style={{ fontSize: '9px' }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(a.idAula)}
                                      className="btn btn-link p-0 text-danger text-decoration-none"
                                      style={{ fontSize: '9px' }}
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </div>
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
                <h5 className="fw-bold mb-3">{editingTrilhaId ? 'Editar Trilha' : 'Criar Nova Trilha'}</h5>
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
                    {editingTrilhaId ? 'Salvar Alterações' : 'Cadastrar Trilha'}
                  </button>
                  {editingTrilhaId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTrilhaId(null);
                        setTrilhaTitle('');
                        setTrilhaDesc('');
                        setTrilhaCategory('');
                      }}
                      className="btn btn-outline-secondary w-100 mt-2 fw-semibold text-light"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </form>
              </div>

              {/* List of Trails */}
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Trilhas Cadastradas</h5>
                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Título</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trilhas.map((tr) => (
                        <tr key={tr.idTrilha}>
                          <td className="border-secondary text-light fw-semibold small">{tr.titulo}</td>
                          <td className="border-secondary text-end small">
                            <button
                              onClick={() => {
                                setEditingTrilhaId(tr.idTrilha);
                                setTrilhaTitle(tr.titulo);
                                setTrilhaDesc(tr.descricao);
                                setTrilhaCategory(tr.idCategoria);
                              }}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTrilha(tr.idTrilha)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
