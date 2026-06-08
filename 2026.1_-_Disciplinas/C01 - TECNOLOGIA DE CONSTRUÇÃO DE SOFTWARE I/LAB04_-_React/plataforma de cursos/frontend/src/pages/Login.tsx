import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Login() {
  const { usuarios, setCurrentUser, refreshData } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [perfil, setPerfil] = useState<'aluno' | 'instrutor' | 'administrador'>('aluno');

  // Validation states
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setNome('');
    setEmail('');
    setPassword('');
    setPerfil('aluno');
    setValidated(false);
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Refresh list to make sure we have all registered users
      await refreshData();

      // Find user by email and matching password
      const user = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.senhaHash === password
      );

      if (user) {
        setCurrentUser(user);
      } else {
        setErrorMsg('E-mail ou senha inválidos. Tente novamente.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao tentar efetuar login.');
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Custom validations
    if (nome.trim().length < 3) {
      setErrorMsg('O nome deve ter pelo menos 3 caracteres.');
      setValidated(true);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      setValidated(true);
      return;
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitting(true);
    setErrorMsg('');

    try {
      await refreshData();
      
      // Check if email already exists
      const emailExists = usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setErrorMsg('Este endereço de e-mail já está sendo utilizado.');
        setSubmitting(false);
        return;
      }

      // Create new user object
      const newUser = {
        idUsuario: `u-${Date.now()}`,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        perfil,
        senhaHash: password,
        ativo: true,
        dataCriacao: new Date(),
        dataAlteracao: new Date(),
      };

      await api.createUsuario(newUser);
      await refreshData();
      
      // Auto login
      setCurrentUser(newUser);
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
          <h1 className="h3 fw-bold text-primary mb-1">Learnify</h1>
          <p className="text-muted small">Sua plataforma completa de aprendizado online</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger border-danger bg-danger bg-opacity-10 text-danger p-2 small text-center mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        <ul className="nav nav-pills nav-fill bg-secondary bg-opacity-10 rounded p-1 mb-4">
          <li className="nav-item">
            <button
              onClick={() => isRegistering && handleToggleMode()}
              className={`nav-link border-0 py-2 small fw-semibold text-white ${!isRegistering ? 'active bg-primary' : 'bg-transparent'}`}
            >
              Entrar
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => !isRegistering && handleToggleMode()}
              className={`nav-link border-0 py-2 small fw-semibold text-white ${isRegistering ? 'active bg-primary' : 'bg-transparent'}`}
            >
              Cadastrar
            </button>
          </li>
        </ul>

        {!isRegistering ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} noValidate className={validated ? 'was-validated' : ''}>
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

            <div className="mb-4">
              <label className="form-label small text-muted mb-1">Senha</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                disabled={submitting}
              />
              <div className="invalid-feedback">A senha é obrigatória.</div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-bold py-2 mb-2">
              {submitting ? 'Carregando...' : 'Acessar Plataforma'}
            </button>

            <div className="text-center mt-3">
              <span className="text-muted small">Não possui conta? </span>
              <button type="button" onClick={handleToggleMode} className="btn btn-link btn-sm text-primary p-0 fw-semibold text-decoration-none">
                Cadastre-se grátis
              </button>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
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
              <button type="button" onClick={handleToggleMode} className="btn btn-link btn-sm text-primary p-0 fw-semibold text-decoration-none">
                Faça login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
