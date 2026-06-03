import { useState } from 'react';
import { Layout } from '../components/Layout.jsx';
import { apiRequest } from '../utils/api.js';

const initialForm = { name: '', price: '', leadDays: '' };

function getSession() {
  return JSON.parse(localStorage.getItem('av2_session') || 'null');
}

export function ServiceCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function validateForm() {
    const nextFeedback = {};
    if (!form.name.trim()) nextFeedback.name = 'Informe o nome do serviço.';
    if (!form.price || Number(form.price) <= 0) nextFeedback.price = 'Informe um preço válido.';
    if (form.leadDays === '' || Number(form.leadDays) < 0) nextFeedback.leadDays = 'Informe um prazo válido.';
    return nextFeedback;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextFeedback = validateForm();
    setFeedback(nextFeedback);
    setMessage('');
    if (Object.keys(nextFeedback).length > 0) return;

    setIsSubmitting(true);
    try {
      const session = getSession();
      await apiRequest('/services', {
        method: 'POST',
        token: session?.token,
        body: {
          name: form.name,
          price: Number(form.price),
          leadDays: Number(form.leadDays)
        }
      });
      setForm(initialForm);
      setMessage('Serviço de TI cadastrado com sucesso.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout tagline="Cadastro de serviços de TI">
      <main className="site-main">
        <h1 className="page-title">Cadastro de serviços de TI</h1>
        <div className="card auth-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="service-name">Serviço de TI</label>
              <input id="service-name" name="name" value={form.name} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.name}</p>
            </div>
            <div className="form-group">
              <label htmlFor="service-price">Preço</label>
              <input id="service-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.price}</p>
            </div>
            <div className="form-group">
              <label htmlFor="service-lead">Prazo de atendimento (dias)</label>
              <input id="service-lead" name="leadDays" type="number" min="0" step="1" value={form.leadDays} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.leadDays}</p>
            </div>
            {message ? <p className="status-message">{message}</p> : null}
            <div className="form-group form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Cadastrar serviço</button>
              <button type="button" className="btn btn-secondary" onClick={() => setForm(initialForm)}>Limpar</button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}
