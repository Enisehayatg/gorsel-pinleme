export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string, minLength = 6) => {
  return password.length >= minLength;
};

export const validatePhoneNumber = (phone: string) => {
  const regex = /^\+?[1-9]\d{1,14}$/; // Uluslararası telefon
  return regex.test(phone);
};
