import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { api } from '../../services/api';

export default function Login() {
  const { setCurrentUser } = useApp();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation states
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);

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
    setLoginError(false);

    try {
      // Fetch fresh user list from API to bypass React state closure
      const latestUsers = await api.getUsuarios();

      // Find user by email and matching password
      const user = latestUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.senhaHash === password
      );

      if (user) {
        setCurrentUser(user);
      } else {
        setErrorMsg('E-mail ou senha inválidos. Tente novamente.');
        setLoginError(true);
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao tentar efetuar login.');
      setLoginError(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-light p-3">
      <div className="card bg-black border border-secondary text-white shadow-lg p-4" style={{ maxWidth: '440px', width: '100%', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-primary mb-1">LearnGPT</h1>
          <p className="text-muted small">Sua plataforma de aprendizado online e tutorada por modelos de linguagem natural</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger border-danger bg-danger bg-opacity-10 text-danger p-2 small text-center mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLoginSubmit} noValidate className={validated ? 'was-validated' : ''}>
          <div className="mb-3">
            <label className="form-label small text-muted mb-1">Endereço de E-mail</label>
            <input
              type="email"
              className={`form-control bg-dark text-white border-secondary ${loginError ? 'is-invalid' : ''}`}
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(false);
              }}
              placeholder="exemplo@email.com"
              disabled={submitting}
            />
            <div className="invalid-feedback">
              {loginError ? 'E-mail não cadastrado ou incorreto.' : 'Por favor, insira um e-mail válido.'}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small text-muted mb-1">Senha</label>
            <input
              type="password"
              className={`form-control bg-dark text-white border-secondary ${loginError ? 'is-invalid' : ''}`}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(false);
              }}
              placeholder="Sua senha"
              disabled={submitting}
            />
            <div className="invalid-feedback">
              {loginError ? 'Senha incorreta.' : 'A senha é obrigatória.'}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-bold py-2 mb-2">
            {submitting ? 'Carregando...' : 'Acessar Plataforma'}
          </button>

          <div className="text-center mt-3">
            <span className="text-muted small">Não possui conta? </span>
            <Link to="/register" className="btn btn-link btn-sm text-primary p-0 fw-semibold text-decoration-none">
              Cadastre-se grátis
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
