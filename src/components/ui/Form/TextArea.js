// TextArea.js - Text area input
import React from 'react';

const TextArea = ({ label, value, onChange, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        className="form-textarea"
        {...props}
      />
    </div>
  );
};

export default TextArea;
