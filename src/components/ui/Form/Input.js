// Input.js - Accessible form input
import React from 'react';

const Input = ({ label, type = 'text', value, onChange, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="form-input"
        {...props}
      />
    </div>
  );
};

export default Input;
