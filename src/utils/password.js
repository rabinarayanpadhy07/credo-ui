export const PASSWORD_REQUIREMENT =
  'Use at least 8 characters.';

export const isStrongPassword = (password) =>
  typeof password === 'string' && password.length >= 8;
