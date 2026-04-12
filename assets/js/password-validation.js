/**
 * Password rules from the assignment PDF (mock validation helpers).
 */

var PASSWORD_ALLOWED_SPECIALS = '@#$%&*!?/\\|-_+.=';

function isValidEmail(value) {
  if (!value || !value.trim()) return false;
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

function passwordContainsAllowedSpecial(password) {
  var allowedList = PASSWORD_ALLOWED_SPECIALS.split('');
  var i = 0;
  for (i = 0; i < allowedList.length; i++) {
    if (password.indexOf(allowedList[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function passwordContainsDisallowedCharacter(password) {
  var disallowed = '¨{}[]´`~^:;<>,“‘"';
  var i = 0;
  for (i = 0; i < password.length; i++) {
    if (disallowed.indexOf(password[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function validatePasswordWithConfirmation(password, confirmation) {
  if (!password || !password.length) {
    return { ok: false, message: 'A senha deve ser preenchida.' };
  }
  if (!confirmation || !confirmation.length) {
    return { ok: false, message: 'A confirmação de senha deve ser preenchida.' };
  }
  if (password !== confirmation) {
    return { ok: false, message: 'A senha e a confirmação não coincidem.' };
  }
  if (password.length < 6) {
    return { ok: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: 'A senha deve conter pelo menos um dígito.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, message: 'A senha deve conter pelo menos uma letra maiúscula.' };
  }
  if (!passwordContainsAllowedSpecial(password)) {
    return {
      ok: false,
      message:
        'A senha deve conter pelo menos um caractere especial permitido: @ # $ % & * ! ? / \\ | - _ + . ='
    };
  }
  if (passwordContainsDisallowedCharacter(password)) {
    return {
      ok: false,
      message: 'A senha contém caracteres não permitidos (ver lista de proibidos nas instruções).'
    };
  }
  return { ok: true };
}

function buildPasswordInstructionHtml() {
  var allowed =
    'Caracteres especiais <strong>permitidos</strong>: @ # $ % &amp; * ! ? / \\ | - _ + . =';
  var forbidden =
    'Caracteres especiais <strong>não permitidos</strong>: ¨ { } [ ] ´ ` ~ ^ : ; &lt; &gt; , “ ‘ "';
  var rules =
    '<p>A senha deve ter no mínimo <strong>6 caracteres</strong>, incluindo pelo menos ' +
    '<strong>um dígito</strong>, <strong>uma letra maiúscula</strong> e <strong>um caractere especial permitido</strong>.</p>';
  return rules + '<p>' + allowed + '<br>' + forbidden + '</p>';
}
