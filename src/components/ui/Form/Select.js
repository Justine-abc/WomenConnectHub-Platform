// Select.js - Dropdown select
import React from 'react';

const Select = ({ label, options = [], value, onChange, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="form-select"
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
