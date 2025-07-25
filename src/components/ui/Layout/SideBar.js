// Sidebar.js - Side navigation
import React from 'react';

const Sidebar = ({ children, className = '' }) => {
  return (
    <aside className={`sidebar bg-gray-100 p-4 ${className}`}>
      {children}
    </aside>
  );
};

export default Sidebar;
