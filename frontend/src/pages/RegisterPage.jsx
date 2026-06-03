import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout.jsx';
import { PasswordHint } from '../components/PasswordHint.jsx';
import { apiRequest } from '../utils/api.js';
import {
  ageFromBirthDate,
  extractDigits,
  formatCpfFromDigits,
  isBrazilianPhoneOkOrEmpty,
  isValidCpfDigits,
  isValidEmail,
  isValidPersonName,
  validatePasswordWithConfirmation
} from '../utils/validation.js';

const initialForm = {
  email: '',
  password: '',
  passwordConfirm: '',
  fullName: '',
  cpf: '',
  birthDate: '',
  phone: '',
  maritalStatus: 'single',
  education: 'high-done'
};

export function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'cpf' ? formatCpfFromDigits(extractDigits(value)) : value }));
  }

  function clearForm() {
    setForm(initialForm);
    setFeedback({});
    setMessage('');
    emailRef.current?.focus();
  }

  function validateForm() {
    const nextFeedback = {};
    const cpfDigits = extractDigits(form.cpf);
    const passwordResult = validatePasswordWithConfirmation(form.password, form.passwordConfirm);

    if (!isValidEmail(form.email)) nextFeedback.email = 'Informe um e-mail válido.';
    if (!passwordResult.ok) nextFeedback.password = passwordResult.message;
    if (!isValidPersonName(form.fullName)) {
      nextFeedback.fullName = 'Nome obrigatório: pelo menos duas palavras, primeira com 2+ letras, sem números ou símbolos.';
    }
    if (cpfDigits.length !== 11 || !isValidCpfDigits(cpfDigits)) {
      nextFeedback.cpf = 'CPF inválido ou incompleto.';
    }
    if (!form.birthDate) {
      nextFeedback.birthDate = 'Informe a data de nascimento.';
    } else if (ageFromBirthDate(form.birthDate) < 18) {
      nextFeedback.birthDate = 'O cliente deve ter 18 anos ou mais.';
    }
    if (!isBrazilianPhoneOkOrEmpty(form.phone)) {
      nextFeedback.phone = 'Telefone inválido. Use formato nacional (DDD + número).';
    }
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
      await apiRequest('/auth/register', {
        method: 'POST',
        body: { ...form, cpf: extractDigits(form.cpf) }
      });
      setMessage('Validação realizada com sucesso');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout tagline="Cadastro de clientes">
      <main className="site-main">
        <h1 className="page-title">Cadastro de clientes</h1>

        <div className="card auth-wide">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="register-email">E-mail (login)</label>
              <input ref={emailRef} type="email" id="register-email" name="email" value={form.email} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Senha</label>
              <input type="password" id="register-password" name="password" value={form.password} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.password}</p>
            </div>
            <div className="form-group">
              <label htmlFor="register-password-confirm">Confirmação de senha</label>
              <input
                type="password"
                id="register-password-confirm"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={updateField}
              />
            </div>
            <div className="form-group">
              <label>Instruções de senha</label>
              <PasswordHint />
            </div>
            <div className="form-group">
              <label htmlFor="register-name">Nome completo</label>
              <input type="text" id="register-name" name="fullName" value={form.fullName} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.fullName}</p>
            </div>
            <div className="form-group">
              <label htmlFor="register-cpf">CPF</label>
              <input id="register-cpf" name="cpf" inputMode="numeric" maxLength="14" value={form.cpf} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.cpf}</p>
            </div>
            <div className="form-group">
              <label htmlFor="register-birth">Data de nascimento</label>
              <input type="date" id="register-birth" name="birthDate" value={form.birthDate} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.birthDate}</p>
            </div>
            <div className="form-group">
              <label htmlFor="register-phone">Telefone celular / WhatsApp (opcional)</label>
              <input type="tel" id="register-phone" name="phone" value={form.phone} onChange={updateField} />
              <p className="form-feedback" role="alert">{feedback.phone}</p>
            </div>
            <fieldset className="form-group">
              <legend>Estado civil</legend>
              <label><input type="radio" name="maritalStatus" value="single" checked={form.maritalStatus === 'single'} onChange={updateField} /> Solteiro(a)</label>
              <label><input type="radio" name="maritalStatus" value="married" checked={form.maritalStatus === 'married'} onChange={updateField} /> Casado(a)</label>
              <label><input type="radio" name="maritalStatus" value="divorced" checked={form.maritalStatus === 'divorced'} onChange={updateField} /> Divorciado(a)</label>
              <label><input type="radio" name="maritalStatus" value="widowed" checked={form.maritalStatus === 'widowed'} onChange={updateField} /> Viúvo(a)</label>
            </fieldset>
            <div className="form-group">
              <label htmlFor="register-education">Escolaridade</label>
              <select id="register-education" name="education" value={form.education} onChange={updateField}>
                <option value="elem-inc">1º grau incompleto</option>
                <option value="elem-done">1º grau completo</option>
                <option value="high-done">2º grau completo</option>
                <option value="undergrad">nível superior</option>
                <option value="postgrad">pós-graduado</option>
              </select>
            </div>
            {message ? <p className="status-message">{message}</p> : null}
            <div className="form-group form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Incluir</button>
              <button type="button" className="btn btn-secondary" onClick={clearForm}>Limpar</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Voltar</button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}
