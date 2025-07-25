// Grid.js - Grid system
import React from 'react';

const Grid = ({ children, columns = 1, gap = 'md', className = '' }) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };
  return (
    <div className={`grid grid-cols-${columns} ${gapClasses[gap] || ''} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
