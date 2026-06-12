import React, { useState }   from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp }            from '../../hooks/useApp';
import { api }               from '../../services/api';

export default function Register() {
  const { planos, setCurrentUser, refreshData, showAlert } = useApp();
  const navigate = useNavigate();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [perfil, setPerfil] = useState<'aluno' | 'instrutor' | 'administrador'>('aluno');

  // Estados de validação e interface
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validações customizadas
    if (nome.trim().length < 3) {
      setErrorMsg('O nome deve ter pelo menos 3 caracteres.');
      setValidated(true);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa conter no mínimo 6 caracteres.');
      return;
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Busca a lista de usuários mais recente da API para contornar o fechamento do estado do React
      const latestUsers = await api.getUsuarios();
      
      // Verifica se o e-mail já existe
      const emailExists = latestUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setErrorMsg('Este endereço de e-mail já está sendo utilizado.');
        setSubmitting(false);
        return;
      }

      const generatedId = `u-${Date.now()}`;
      const newUser = {
        id: generatedId,
        idUsuario: generatedId,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        perfil,
        senhaHash: password,
        ativo: true,
        dataCriacao: new Date(),
        dataAlteracao: new Date(),
      };

      await api.createUsuario(newUser);

      // Associa automaticamente a assinatura do plano gratuito
      const freePlan = planos.find((p) => p.preco === 0);
      if (freePlan) {
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(today.getMonth() + freePlan.duracaoMeses);
        
        const subId = `sub-${Date.now()}`;
        const newSubscription = {
          id: subId,
          idAssinatura: subId,
          idUsuario: generatedId,
          idPlano: freePlan.idPlano,
          dataInicio: today.toISOString().split('T')[0],
          dataFim: endDate.toISOString().split('T')[0],
        };
        await api.createAssinatura(newSubscription);
      }

      await refreshData();
      
      showAlert('Cadastro realizado com sucesso!', 'success');
      
      // Login automático e redirecionamento
      setCurrentUser(newUser);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao salvar o cadastro.');
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-light p-3">
      <div className="card bg-black border border-secondary text-white shadow-lg p-4" style={{ maxWidth: '440px', width: '100%', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-primary mb-1">LearnGPT</h1>
          <p className="text-muted small">Crie sua conta e comece a aprender hoje</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger border-danger bg-danger bg-opacity-10 text-danger p-2 small text-center mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} noValidate className={validated ? 'was-validated' : ''}>
          <div className="mb-3">
            <label className="form-label small text-muted mb-1">Nome Completo</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              minLength={3}
              disabled={submitting}
            />
            <div className="invalid-feedback">Insira um nome válido (mínimo de 3 caracteres).</div>
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted mb-1">Endereço de E-mail</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              disabled={submitting}
            />
            <div className="invalid-feedback">Por favor, insira um e-mail válido.</div>
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted mb-1">Senha de Acesso</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              disabled={submitting}
            />
            <div className="invalid-feedback">A senha deve ter no mínimo 6 caracteres.</div>
          </div>

          <div className="mb-4">
            <label className="form-label small text-muted mb-1">Perfil da Conta</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as any)}
              disabled={submitting}
            >
              <option value="aluno">Aluno (Perfil Padrão)</option>
              <option value="instrutor">Instrutor (Publica Cursos)</option>
              <option value="administrador">Administrador (Gerenciamento Geral)</option>
            </select>
            <div className="form-text text-muted" style={{ fontSize: '10px' }}>
              *Escolha o perfil para testar diferentes níveis de acesso na plataforma.
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-bold py-2 mb-2">
            {submitting ? 'Criando Conta...' : 'Cadastrar e Entrar'}
          </button>

          <div className="text-center mt-3">
            <span className="text-muted small">Já possui cadastro? </span>
            <Link to="/login" className="btn btn-link btn-sm text-primary p-0 fw-semibold text-decoration-none">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
