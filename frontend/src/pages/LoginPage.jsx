import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout.jsx';
import { apiRequest } from '../utils/api.js';
import { isValidEmail } from '../utils/validation.js';

const initialForm = { email: '', password: '' };

export function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function clearForm() {
    setForm(initialForm);
    setFeedback({});
    setMessage('');
    emailRef.current?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextFeedback = {};
    if (!isValidEmail(form.email)) nextFeedback.email = 'Informe um e-mail válido.';
    if (!form.password) nextFeedback.password = 'A senha deve ser preenchida.';
    setFeedback(nextFeedback);
    setMessage('');
    if (Object.keys(nextFeedback).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { login: form.email, password: form.password }
      });

      if (!data.authenticated) {
        setMessage('Login ou senha inválidos.');
        return;
      }

      localStorage.setItem('av2_session', JSON.stringify({ token: data.token, client: data.client }));
      setMessage('Validação realizada com sucesso');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout tagline="Login de clientes">
      <main className="site-main">
        <h1 className="page-title">Login de clientes</h1>
        <p className="text-muted">
          <Link to="/troca-senha">Esqueci / trocar senha</Link> — link para a página de troca de senha.
        </p>

        <div className="card auth-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Login (e-mail)</label>
              <input
                ref={emailRef}
                type="email"
                id="login-email"
                name="email"
                value={form.email}
                onChange={updateField}
                autoComplete="username"
              />
              <p className="form-feedback" role="alert">{feedback.email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Senha</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={form.password}
                onChange={updateField}
                autoComplete="current-password"
              />
              <p className="form-feedback" role="alert">{feedback.password}</p>
            </div>
            <p className="text-muted">
              Não tem cadastro? <Link to="/cadastro">Cadastre-se</Link>
            </p>
            {message ? <p className="status-message">{message}</p> : null}
            <div className="form-group form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Realizar Login
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearForm}>
                Limpar
              </button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}
