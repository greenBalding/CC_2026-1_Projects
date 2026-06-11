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
    trilhasCursos,
    pagamentos,
    matriculas,
    avaliacoes,
    assinaturas,
    planos,
    certificados,
    progressoAulas,
    refreshData,
    showAlert,
    showConfirm,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const editCourseId = searchParams.get('edit');
  const tabParam = searchParams.get('tab');

  // Stats Calculations
  const totalRevenue = pagamentos.reduce((sum, p) => sum + Number(p.valor), 0);
  const activeStudentsCount = usuarios.filter((u) => u.perfil === 'aluno' && u.ativo).length;
  const totalMatriculas = matriculas.length;
  const averageSatisfaction =
    avaliacoes.length > 0
      ? (avaliacoes.reduce((sum, r) => sum + Number(r.nota), 0) / avaliacoes.length).toFixed(1)
      : '0.0';

  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'courses' | 'modules' | 'trilhas' | 'planos' | 'assinaturas' | 'avaliacoes'>('users');
  const [submitting, setSubmitting] = useState(false);

  // --- FORM STATES ---
  // Users Form
  const [userNome, setUserNome] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPerfil, setUserPerfil] = useState<'aluno' | 'instrutor' | 'administrador'>('aluno');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Planos Form
  const [planoNome, setPlanoNome] = useState('');
  const [planoDesc, setPlanoDesc] = useState('');
  const [planoPreco, setPlanoPreco] = useState(0);
  const [planoDuracao, setPlanoDuracao] = useState(1);
  const [editingPlanoId, setEditingPlanoId] = useState<string | null>(null);

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
      if (editingUserId) {
        await api.updateUsuario(editingUserId, {
          nome: userNome,
          email: userEmail,
          perfil: userPerfil,
          dataAlteracao: new Date(),
        });
        await refreshData();
        showAlert('Usuário atualizado com sucesso!', 'success');
        setEditingUserId(null);
        setUserNome('');
        setUserEmail('');
        setUserPerfil('aluno');
      } else {
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
        setUserPerfil('aluno');
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar usuário.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir este usuário? Esta ação é irreversível.',
      async () => {
        try {
          await api.deleteUsuario(userId);
          await refreshData();
          showAlert('Usuário excluído com sucesso!', 'success');
          if (editingUserId === userId) {
            setEditingUserId(null);
            setUserNome('');
            setUserEmail('');
            setUserPerfil('aluno');
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir usuário.', 'error');
        }
      }
    );
  };

  const handleCreatePlano = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPlanoId) {
        await api.updatePlano(editingPlanoId, {
          nome: planoNome,
          descricao: planoDesc,
          preco: Number(planoPreco),
          duracaoMeses: Number(planoDuracao),
        });
        await refreshData();
        showAlert('Plano atualizado com sucesso!', 'success');
        setEditingPlanoId(null);
      } else {
        const generatedId = `pl-${Date.now()}`;
        const newPlano = {
          id: generatedId,
          idPlano: generatedId,
          nome: planoNome,
          descricao: planoDesc,
          preco: Number(planoPreco),
          duracaoMeses: Number(planoDuracao),
        };
        await api.createPlano(newPlano);
        await refreshData();
        showAlert('Plano cadastrado com sucesso!', 'success');
      }
      setPlanoNome('');
      setPlanoDesc('');
      setPlanoPreco(0);
      setPlanoDuracao(1);
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar plano.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlano = async (planoId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir este plano?',
      async () => {
        try {
          await api.deletePlano(planoId);
          await refreshData();
          showAlert('Plano excluído com sucesso!', 'success');
          if (editingPlanoId === planoId) {
            setEditingPlanoId(null);
            setPlanoNome('');
            setPlanoDesc('');
            setPlanoPreco(0);
            setPlanoDuracao(1);
          }
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir plano.', 'error');
        }
      }
    );
  };

  const handleDeleteAssinatura = async (assinaturaId: string) => {
    showConfirm(
      'Tem certeza de que deseja cancelar esta assinatura?',
      async () => {
        try {
          await api.deleteAssinatura(assinaturaId);
          await refreshData();
          showAlert('Assinatura cancelada com sucesso!', 'success');
        } catch (err) {
          console.error(err);
          showAlert('Erro ao cancelar assinatura.', 'error');
        }
      }
    );
  };

  const handleDeleteAvaliacao = async (avaliacaoId: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir esta avaliação?',
      async () => {
        try {
          await api.deleteAvaliacao(avaliacaoId);
          await refreshData();
          showAlert('Avaliação excluída com sucesso!', 'success');
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir avaliação.', 'error');
        }
      }
    );
  };

  const handleDeleteTrilhaCurso = async (tcId: string) => {
    showConfirm(
      'Tem certeza de que deseja desvincular este curso da trilha?',
      async () => {
        try {
          await api.deleteTrilhaCurso(tcId);
          await refreshData();
          showAlert('Curso desvinculado da trilha com sucesso!', 'success');
        } catch (err) {
          console.error(err);
          showAlert('Erro ao desvincular curso.', 'error');
        }
      }
    );
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

      {/* Metrics Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-black border border-secondary text-white p-3 shadow-sm hover-card">
            <span className="text-muted small d-block mb-1">Faturamento Geral</span>
            <h4 className="fw-bold text-success mb-1">R$ {totalRevenue.toFixed(2)}</h4>
            <span className="text-muted" style={{ fontSize: '10px' }}>Total acumulado de assinaturas</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-black border border-secondary text-white p-3 shadow-sm hover-card">
            <span className="text-muted small d-block mb-1">Alunos Ativos</span>
            <h4 className="fw-bold text-primary mb-1">{activeStudentsCount}</h4>
            <span className="text-muted" style={{ fontSize: '10px' }}>Usuários estudantes cadastrados</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-black border border-secondary text-white p-3 shadow-sm hover-card">
            <span className="text-muted small d-block mb-1">Total de Matrículas</span>
            <h4 className="fw-bold text-warning mb-1">{totalMatriculas}</h4>
            <span className="text-muted" style={{ fontSize: '10px' }}>Matrículas em andamento</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-black border border-secondary text-white p-3 shadow-sm hover-card">
            <span className="text-muted small d-block mb-1">Satisfação Média</span>
            <h4 className="fw-bold text-light mb-1">★ {averageSatisfaction} / 5.0</h4>
            <span className="text-muted" style={{ fontSize: '10px' }}>Nota média das avaliações</span>
          </div>
        </div>
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
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('planos')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'planos' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Planos
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('assinaturas')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'assinaturas' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Assinaturas
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`nav-link border-0 fw-semibold text-light ${activeTab === 'avaliacoes' ? 'active bg-primary' : 'bg-transparent'}`}
          >
            Avaliações
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
                <h5 className="fw-bold mb-3">{editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h5>
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
                    {editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </button>
                  {editingUserId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUserId(null);
                        setUserNome('');
                        setUserEmail('');
                        setUserPerfil('aluno');
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
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Usuários Cadastrados</h5>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Nome</th>
                        <th className="border-secondary text-muted small">E-mail</th>
                        <th className="border-secondary text-muted small">Perfil</th>
                        <th className="border-secondary text-muted small">Status</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.idUsuario}>
                          <td className="border-secondary text-light fw-semibold">{u.nome}</td>
                          <td className="border-secondary text-muted small">{u.email}</td>
                          <td className="border-secondary text-capitalize text-muted small">{u.perfil}</td>
                          <td className="border-secondary small">
                            <span className={`badge ${u.ativo ? 'bg-success' : 'bg-danger'}`}>
                              {u.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="border-secondary text-end small">
                            <button
                              onClick={() => {
                                setEditingUserId(u.idUsuario);
                                setUserNome(u.nome);
                                setUserEmail(u.email);
                                setUserPerfil(u.perfil);
                              }}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.idUsuario)}
                              className="btn btn-sm btn-outline-danger"
                              disabled={u.idUsuario === currentUser?.idUsuario}
                              title={u.idUsuario === currentUser?.idUsuario ? 'Não é possível excluir o próprio usuário' : ''}
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
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm mb-4">
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

              {/* Trilha-Curso Linkages List */}
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Vínculos Trilha ↔ Curso</h5>
                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Trilha</th>
                        <th className="border-secondary text-muted small">Curso</th>
                        <th className="border-secondary text-muted small">Ordem</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trilhasCursos.map((tc) => {
                        const trilha = trilhas.find(t => t.idTrilha === tc.idTrilha);
                        const curso = cursos.find(c => c.idCurso === tc.idCurso);
                        const tcId = (tc as any).id || `${tc.idTrilha}-${tc.idCurso}`;
                        return (
                          <tr key={tcId}>
                            <td className="border-secondary text-light small">{trilha?.titulo || tc.idTrilha}</td>
                            <td className="border-secondary text-muted small">{curso?.titulo || tc.idCurso}</td>
                            <td className="border-secondary text-muted small">{tc.ordem}</td>
                            <td className="border-secondary text-end small">
                              <button
                                onClick={() => handleDeleteTrilhaCurso(tcId)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Desvincular
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

        {/* PLANOS TAB */}
        {activeTab === 'planos' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
                <h5 className="fw-bold mb-3">{editingPlanoId ? 'Editar Plano' : 'Cadastrar Novo Plano'}</h5>
                <form onSubmit={handleCreatePlano}>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Nome do Plano</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={planoNome}
                      onChange={(e) => setPlanoNome(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Descrição</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows={2}
                      required
                      value={planoDesc}
                      onChange={(e) => setPlanoDesc(e.target.value)}
                    />
                  </div>
                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control bg-dark text-light border-secondary"
                        required
                        value={planoPreco}
                        onChange={(e) => setPlanoPreco(Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Duração (meses)</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        required
                        min={1}
                        value={planoDuracao}
                        onChange={(e) => setPlanoDuracao(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-semibold">
                    {editingPlanoId ? 'Salvar Alterações' : 'Cadastrar Plano'}
                  </button>
                  {editingPlanoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlanoId(null);
                        setPlanoNome('');
                        setPlanoDesc('');
                        setPlanoPreco(0);
                        setPlanoDuracao(1);
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
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Planos Cadastrados</h5>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Nome</th>
                        <th className="border-secondary text-muted small">Preço</th>
                        <th className="border-secondary text-muted small">Duração</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planos.map((p) => (
                        <tr key={p.idPlano}>
                          <td className="border-secondary text-light fw-semibold">{p.nome}</td>
                          <td className="border-secondary text-success small">
                            {p.preco === 0 ? 'Grátis' : `R$ ${Number(p.preco).toFixed(2)}`}
                          </td>
                          <td className="border-secondary text-muted small">{p.duracaoMeses} {p.duracaoMeses === 1 ? 'mês' : 'meses'}</td>
                          <td className="border-secondary text-end small">
                            <button
                              onClick={() => {
                                setEditingPlanoId(p.idPlano);
                                setPlanoNome(p.nome);
                                setPlanoDesc(p.descricao);
                                setPlanoPreco(p.preco);
                                setPlanoDuracao(p.duracaoMeses);
                              }}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePlano(p.idPlano)}
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
          </div>
        )}

        {/* ASSINATURAS TAB */}
        {activeTab === 'assinaturas' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Assinaturas Ativas</h5>
                <div className="table-responsive" style={{ maxHeight: '500px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Usuário</th>
                        <th className="border-secondary text-muted small">Plano</th>
                        <th className="border-secondary text-muted small">Início</th>
                        <th className="border-secondary text-muted small">Fim</th>
                        <th className="border-secondary text-muted small">Status</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assinaturas.map((a) => {
                        const user = usuarios.find(u => u.idUsuario === a.idUsuario);
                        const plano = planos.find(p => p.idPlano === a.idPlano);
                        const isExpired = new Date(a.dataFim) < new Date();
                        return (
                          <tr key={a.idAssinatura}>
                            <td className="border-secondary text-light fw-semibold">{user?.nome || a.idUsuario}</td>
                            <td className="border-secondary text-muted small">{plano?.nome || a.idPlano}</td>
                            <td className="border-secondary text-muted small">{new Date(a.dataInicio).toLocaleDateString('pt-BR')}</td>
                            <td className="border-secondary text-muted small">{new Date(a.dataFim).toLocaleDateString('pt-BR')}</td>
                            <td className="border-secondary small">
                              <span className={`badge ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                                {isExpired ? 'Expirada' : 'Ativa'}
                              </span>
                            </td>
                            <td className="border-secondary text-end small">
                              <button
                                onClick={() => handleDeleteAssinatura(a.idAssinatura)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Cancelar
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

        {/* AVALIACOES TAB */}
        {activeTab === 'avaliacoes' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
                <h5 className="fw-bold pb-2 mb-3 border-bottom border-secondary">Avaliações dos Cursos</h5>
                <div className="table-responsive" style={{ maxHeight: '500px' }}>
                  <table className="table table-dark table-striped table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">Usuário</th>
                        <th className="border-secondary text-muted small">Curso</th>
                        <th className="border-secondary text-muted small">Nota</th>
                        <th className="border-secondary text-muted small">Comentário</th>
                        <th className="border-secondary text-muted small">Data</th>
                        <th className="border-secondary text-muted small text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {avaliacoes.map((av) => {
                        const user = usuarios.find(u => u.idUsuario === av.idUsuario);
                        const curso = cursos.find(c => c.idCurso === av.idCurso);
                        return (
                          <tr key={av.idAvaliacao}>
                            <td className="border-secondary text-light fw-semibold">{user?.nome || av.idUsuario}</td>
                            <td className="border-secondary text-muted small">{curso?.titulo || av.idCurso}</td>
                            <td className="border-secondary text-warning small">
                              {'★'.repeat(Number(av.nota))}{'☆'.repeat(5 - Number(av.nota))}
                              <span className="text-muted ms-1">({av.nota})</span>
                            </td>
                            <td className="border-secondary text-muted small" style={{ maxWidth: '250px' }}>
                              <span className="text-truncate d-inline-block" style={{ maxWidth: '250px' }}>
                                {av.comentario || '—'}
                              </span>
                            </td>
                            <td className="border-secondary text-muted small">{new Date(av.dataAvaliacao).toLocaleDateString('pt-BR')}</td>
                            <td className="border-secondary text-end small">
                              <button
                                onClick={() => handleDeleteAvaliacao(av.idAvaliacao)}
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
      </div>
    </div>
  );
}
