// accessibility.js - A11y utilities

export const focusElement = (id) => {
  const el = document.getElementById(id);
  if (el) el.focus();
};
