/**
 * @param {string} email
 */
export const isEmailValid = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  return pattern.test(email);
};

/**
 * @param {string} password
 */
export const isPasswordValid = (password) => {
  const pattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

/**
 * @param {string} date
 */
export const isValidISO = (date) => {
  const ISOPattern = /^\d{4}\-\d{2}\-\d{2}/;
  return ISOPattern.test(date);
};
