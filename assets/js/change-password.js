function clearChangePasswordFeedback() {
  var loginFeedback = document.getElementById('cp-login-feedback');
  var passwordFeedback = document.getElementById('cp-password-feedback');
  var confirmFeedback = document.getElementById('cp-password-confirm-feedback');
  if (loginFeedback) loginFeedback.textContent = '';
  if (passwordFeedback) passwordFeedback.textContent = '';
  if (confirmFeedback) confirmFeedback.textContent = '';
}

function handleChangePasswordSubmit(event) {
  event.preventDefault();
  clearChangePasswordFeedback();

  var loginInput = document.getElementById('cp-login');
  var passwordInput = document.getElementById('cp-password');
  var confirmInput = document.getElementById('cp-password-confirm');
  var email = loginInput ? loginInput.value.trim() : '';
  var password = passwordInput ? passwordInput.value : '';
  var confirmation = confirmInput ? confirmInput.value : '';

  var hasError = false;
  if (!isValidEmail(email)) {
    var loginFeedback = document.getElementById('cp-login-feedback');
    if (loginFeedback) loginFeedback.textContent = 'Informe um e-mail válido.';
    hasError = true;
  }

  var passwordResult = validatePasswordWithConfirmation(password, confirmation);
  if (!passwordResult.ok) {
    var passwordFeedback = document.getElementById('cp-password-feedback');
    if (passwordFeedback) passwordFeedback.textContent = passwordResult.message;
    hasError = true;
  }
  if (hasError) return;

  // Mock: updates password in localStorage when the user exists.
  if (typeof updateUserPassword === 'function') {
    updateUserPassword(email, password);
  }

  alert('Validação realizada com sucesso');
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'login.html';
  }
}

function handleChangePasswordClear() {
  var form = document.getElementById('change-password-form');
  if (form) form.reset();
  clearChangePasswordFeedback();
  var loginInput = document.getElementById('cp-login');
  if (loginInput) loginInput.focus();
}

document.addEventListener('DOMContentLoaded', function () {
  var hintOutput = document.getElementById('cp-password-hint');
  if (hintOutput && typeof buildPasswordInstructionHtml === 'function') {
    hintOutput.innerHTML = buildPasswordInstructionHtml();
  }

  var form = document.getElementById('change-password-form');
  var clearButton = document.getElementById('cp-clear');
  if (form) form.addEventListener('submit', handleChangePasswordSubmit);
  if (clearButton) clearButton.addEventListener('click', handleChangePasswordClear);
});
