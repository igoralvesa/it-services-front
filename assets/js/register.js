function extractDigits(value) {
  return (value || '').replace(/\D/g, '');
}

function formatCpfFromDigits(digits) {
  var d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.slice(0, 3) + '.' + d.slice(3);
  if (d.length <= 9) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);
  return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
}

function isValidCpfDigits(digits) {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  var sum = 0;
  var index = 0;
  for (index = 0; index < 9; index++) {
    sum += parseInt(digits[index], 10) * (10 - index);
  }
  var firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== parseInt(digits[9], 10)) return false;
  sum = 0;
  for (index = 0; index < 10; index++) {
    sum += parseInt(digits[index], 10) * (11 - index);
  }
  var secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  return secondDigit === parseInt(digits[10], 10);
}

function isValidPersonName(name) {
  if (!name || !name.trim()) return false;
  var trimmed = name.trim();
  var parts = trimmed.split(/\s+/);
  if (parts.length < 2) return false;
  if (parts[0].length < 2) return false;
  if (/\d/.test(trimmed)) return false;
  var allowedPattern = /^[A-Za-zÀ-ÿ\s]+$/;
  return allowedPattern.test(trimmed);
}

function ageFromBirthDate(isoDate) {
  if (!isoDate) return null;
  var parts = isoDate.split('-');
  if (parts.length !== 3) return null;
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1;
  var day = parseInt(parts[2], 10);
  var birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) return null;
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1;
  }
  return age;
}

function isBrazilianPhoneOkOrEmpty(value) {
  if (!value || !value.trim()) return true;
  var digits = extractDigits(value);
  return digits.length === 10 || digits.length === 11;
}

function clearRegisterFeedback() {
  var ids = [
    'register-email-feedback',
    'register-password-feedback',
    'register-password-confirm-feedback',
    'register-name-feedback',
    'register-cpf-feedback',
    'register-birth-feedback',
    'register-phone-feedback'
  ];
  var i = 0;
  for (i = 0; i < ids.length; i++) {
    var element = document.getElementById(ids[i]);
    if (element) element.textContent = '';
  }
}

function attachCpfInputMask() {
  var cpfInput = document.getElementById('register-cpf');
  if (!cpfInput) return;
  cpfInput.addEventListener('input', function () {
    var digits = extractDigits(cpfInput.value);
    cpfInput.value = formatCpfFromDigits(digits);
  });
}

function resetRegisterFormDefaults() {
  var form = document.getElementById('register-form');
  if (!form) return;
  form.reset();
  var educationSelect = document.getElementById('register-education');
  if (educationSelect) educationSelect.value = 'high-done';
  var radioInputs = form.querySelectorAll('input[name="maritalStatus"]');
  var j = 0;
  for (j = 0; j < radioInputs.length; j++) {
    radioInputs[j].checked = radioInputs[j].value === 'single';
  }
}

function handleRegisterClear() {
  resetRegisterFormDefaults();
  clearRegisterFeedback();
  var emailInput = document.getElementById('register-email');
  if (emailInput) emailInput.focus();
}

function handleRegisterBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  clearRegisterFeedback();

  var emailInput = document.getElementById('register-email');
  var passwordInput = document.getElementById('register-password');
  var passwordConfirmInput = document.getElementById('register-password-confirm');
  var nameInput = document.getElementById('register-name');
  var cpfInput = document.getElementById('register-cpf');
  var birthInput = document.getElementById('register-birth');
  var phoneInput = document.getElementById('register-phone');

  var email = emailInput ? emailInput.value.trim() : '';
  var password = passwordInput ? passwordInput.value : '';
  var passwordConfirm = passwordConfirmInput ? passwordConfirmInput.value : '';
  var fullName = nameInput ? nameInput.value.trim() : '';
  var cpfDigits = extractDigits(cpfInput ? cpfInput.value : '');
  var birth = birthInput ? birthInput.value : '';
  var phone = phoneInput ? phoneInput.value.trim() : '';

  var hasValidationError = false;

  if (!isValidEmail(email)) {
    var emailFeedback = document.getElementById('register-email-feedback');
    if (emailFeedback) emailFeedback.textContent = 'Informe um e-mail válido.';
    hasValidationError = true;
  }

  var passwordCheck = validatePasswordWithConfirmation(password, passwordConfirm);
  if (!passwordCheck.ok) {
    var passwordFeedback = document.getElementById('register-password-feedback');
    if (passwordFeedback) passwordFeedback.textContent = passwordCheck.message;
    hasValidationError = true;
  }

  if (!isValidPersonName(fullName)) {
    var nameFeedback = document.getElementById('register-name-feedback');
    if (nameFeedback) {
      nameFeedback.textContent =
        'Nome obrigatório: pelo menos duas palavras, primeira com 2+ letras, sem números ou símbolos.';
    }
    hasValidationError = true;
  }

  if (cpfDigits.length !== 11 || !isValidCpfDigits(cpfDigits)) {
    var cpfFeedback = document.getElementById('register-cpf-feedback');
    if (cpfFeedback) cpfFeedback.textContent = 'CPF inválido ou incompleto (use apenas dígitos).';
    hasValidationError = true;
  }

  if (!birth) {
    var birthFeedback = document.getElementById('register-birth-feedback');
    if (birthFeedback) birthFeedback.textContent = 'Informe a data de nascimento.';
    hasValidationError = true;
  } else {
    var age = ageFromBirthDate(birth);
    if (age === null || age < 18) {
      var birthFeedback2 = document.getElementById('register-birth-feedback');
      if (birthFeedback2) birthFeedback2.textContent = 'O cliente deve ter 18 anos ou mais.';
      hasValidationError = true;
    }
  }

  if (!isBrazilianPhoneOkOrEmpty(phone)) {
    var phoneFeedback = document.getElementById('register-phone-feedback');
    if (phoneFeedback) {
      phoneFeedback.textContent = 'Telefone inválido. Use formato nacional (DDD + número).';
    }
    hasValidationError = true;
  }

  if (hasValidationError) return;

  var saved = addStoredUser({
    email: email,
    password: password,
    fullName: fullName
  });
  if (!saved) {
    var emailTaken = document.getElementById('register-email-feedback');
    if (emailTaken) emailTaken.textContent = 'Este e-mail já está cadastrado.';
    return;
  }

  alert('Validação realizada com sucesso');
}

document.addEventListener('DOMContentLoaded', function () {
  var hintOutput = document.getElementById('register-password-hint');
  if (hintOutput && typeof buildPasswordInstructionHtml === 'function') {
    hintOutput.innerHTML = buildPasswordInstructionHtml();
  }
  attachCpfInputMask();

  var form = document.getElementById('register-form');
  var clearButton = document.getElementById('register-clear');
  var backButton = document.getElementById('register-back');
  if (form) form.addEventListener('submit', handleRegisterSubmit);
  if (clearButton) clearButton.addEventListener('click', handleRegisterClear);
  if (backButton) backButton.addEventListener('click', handleRegisterBack);
});
