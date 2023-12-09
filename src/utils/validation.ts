export const isEmailValid = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  return pattern.test(email);
};

export const isPasswordValid = (password: string): boolean => {
  const pattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

export const isValidISO = (date: string): boolean => {
  const ISOPattern = /^\d{4}-\d{2}-\d{2}/;
  return ISOPattern.test(date);
};
