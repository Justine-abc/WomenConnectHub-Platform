// FormValidation.js - Form validation helpers

// Example: required field validator
export const required = (value) => {
  return value ? undefined : 'This field is required.';
};

// Example: email format validator
export const email = (value) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(value) ? undefined : 'Invalid email address.';
};
