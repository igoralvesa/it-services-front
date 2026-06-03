import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout.jsx';
import { PasswordHint } from '../components/PasswordHint.jsx';
import { apiRequest } from '../utils/api.js';
import { isValidEmail, validatePasswordWithConfirmation } from '../utils/validation.js';

const initialForm = {
  email: '',
  currentPassword: '',
  newPassword: '',
  passwordConfirm: ''
};

export function ChangePasswordPage() {
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
    if (!form.currentPassword) nextFeedback.currentPassword = 'A senha atual deve ser preenchida.';
    const passwordResult = validatePasswordWithConfirmation(form.newPassword, form.passwordConfirm);
    if (!passwordResult.ok) nextFeedback.newPassword = passwordResult.message;
    setFeedback(nextFeedback);
    setMessage('');
    if (Object.keys(nextFeedback).length > 0) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: {
          login: form.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        }
      });
      setMessage('Validação realizada com sucesso');
      navigate(-1);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout tagline="Troca de senha de clientes">
      <main className="site-main">
        <h1 className="page-title">Troca de senha de clientes</h1>

        <div className="card auth-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="cp-login">Login (e-mail)</label>
              <input ref={emailRef} type="email" id="cp-login" name="email" value={form.email} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="cp-current-password">Senha atual</label>
              <input
                type="password"
                id="cp-current-password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={updateField}
              />
              <p className="form-feedback" role="alert">{feedback.currentPassword}</p>
            </div>
            <div className="form-group">
              <label htmlFor="cp-new-password">Nova senha</label>
              <input
                type="password"
                id="cp-new-password"
                name="newPassword"
                value={form.newPassword}
                onChange={updateField}
              />
              <p className="form-feedback" role="alert">{feedback.newPassword}</p>
            </div>
            <div className="form-group">
              <label htmlFor="cp-password-confirm">Confirmação de senha</label>
              <input
                type="password"
                id="cp-password-confirm"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={updateField}
              />
            </div>
            <div className="form-group">
              <label>Instruções de senha</label>
              <PasswordHint />
            </div>
            {message ? <p className="status-message">{message}</p> : null}
            <div className="form-group form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Troca Senha
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
