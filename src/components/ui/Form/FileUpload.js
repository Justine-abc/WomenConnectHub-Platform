// FileUpload.js - Image upload component
import React from 'react';

const FileUpload = ({ label, onChange, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="form-file-upload"
        {...props}
      />
    </div>
  );
};

export default FileUpload;
