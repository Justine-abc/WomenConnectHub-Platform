// validators.js - Form validation

export const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
export const isRequired = (value) => value !== undefined && value !== null && value !== '';
