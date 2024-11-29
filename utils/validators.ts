export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
  return password.length >= 8;
};

export const isValidPasswordConfirm = (
  password: string,
  passwordConfirm: string
) => {
  return passwordConfirm === password;
};

export const isValidLocation = (location: string) => {
  return location.trim().length > 0;
};
