export const PASSWORD_REQUIREMENT =
  'Use at least 12 characters with uppercase, lowercase, number, and symbol characters.';

export const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(password);
