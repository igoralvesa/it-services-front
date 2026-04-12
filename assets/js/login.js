function clearLoginFeedback() {
  var emailMessage = document.getElementById('login-email-feedback');
  var passwordMessage = document.getElementById('login-password-feedback');
  if (emailMessage) emailMessage.textContent = '';
  if (passwordMessage) passwordMessage.textContent = '';
}

function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginFeedback();

  var emailInput = document.getElementById('login-email');
  var passwordInput = document.getElementById('login-password');
  var email = emailInput ? emailInput.value.trim() : '';
  var password = passwordInput ? passwordInput.value : '';

  var hasError = false;
  if (!isValidEmail(email)) {
    var emailFeedback = document.getElementById('login-email-feedback');
    if (emailFeedback) emailFeedback.textContent = 'Informe um e-mail válido.';
    hasError = true;
  }
  if (!password) {
    var passwordFeedback = document.getElementById('login-password-feedback');
    if (passwordFeedback) passwordFeedback.textContent = 'A senha deve ser preenchida.';
    hasError = true;
  }
  if (hasError) return;

  // Mock: if this e-mail is registered, the password must match (demo only).
  var storedUser = findUserByEmail(email);
  if (storedUser) {
    if (storedUser.password !== password) {
      alert('Senha incorreta para este e-mail.');
      return;
    }
    setSession({ email: storedUser.email, fullName: storedUser.fullName });
  } else {
    setSession({ email: email, fullName: email.split('@')[0] });
  }

  alert('Validação realizada com sucesso');
  window.location.href = 'index.html';
}

function handleLoginClear() {
  var form = document.getElementById('login-form');
  if (form) form.reset();
  clearLoginFeedback();
  var emailInput = document.getElementById('login-email');
  if (emailInput) emailInput.focus();
}

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('login-form');
  var clearButton = document.getElementById('login-clear');
  if (form) form.addEventListener('submit', handleLoginSubmit);
  if (clearButton) clearButton.addEventListener('click', handleLoginClear);
});
