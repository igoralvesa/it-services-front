export const PASSWORD_ALLOWED_SPECIALS = '@#$%&*!?/\\|-_+.=';

export function isValidEmail(value) {
  if (!value || !value.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function extractDigits(value) {
  return (value || '').replace(/\D/g, '');
}

export function formatCpfFromDigits(digits) {
  const d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function isValidCpfDigits(digits) {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(digits[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  return secondDigit === Number(digits[10]);
}

export function isValidPersonName(name) {
  if (!name || !name.trim()) return false;
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2 || parts[0].length < 2) return false;
  if (/\d/.test(trimmed)) return false;
  return /^[A-Za-zÀ-ÿ\s]+$/.test(trimmed);
}

export function ageFromBirthDate(isoDate) {
  if (!isoDate) return null;
  const birthDate = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function isBrazilianPhoneOkOrEmpty(value) {
  if (!value || !value.trim()) return true;
  const digits = extractDigits(value);
  return digits.length === 10 || digits.length === 11;
}

function passwordContainsAllowedSpecial(password) {
  return PASSWORD_ALLOWED_SPECIALS.split('').some((special) => password.includes(special));
}

function passwordContainsDisallowedCharacter(password) {
  const disallowed = '¨{}[]´`~^:;<>,“‘"';
  return password.split('').some((character) => disallowed.includes(character));
}

export function validatePasswordWithConfirmation(password, confirmation) {
  if (!password) return { ok: false, message: 'A senha deve ser preenchida.' };
  if (!confirmation) return { ok: false, message: 'A confirmação de senha deve ser preenchida.' };
  if (password !== confirmation) return { ok: false, message: 'A senha e a confirmação não coincidem.' };
  if (password.length < 6) return { ok: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
  if (!/[0-9]/.test(password)) return { ok: false, message: 'A senha deve conter pelo menos um dígito.' };
  if (!/[A-Z]/.test(password)) return { ok: false, message: 'A senha deve conter pelo menos uma letra maiúscula.' };
  if (!passwordContainsAllowedSpecial(password)) {
    return {
      ok: false,
      message: 'A senha deve conter pelo menos um caractere especial permitido: @ # $ % & * ! ? / \\ | - _ + . ='
    };
  }
  if (passwordContainsDisallowedCharacter(password)) {
    return { ok: false, message: 'A senha contém caracteres não permitidos.' };
  }
  return { ok: true };
}
