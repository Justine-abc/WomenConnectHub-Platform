// MobileMenu.js - Mobile navigation
import React, { useState } from 'react';

const MobileMenu = ({ links = [], className = '' }) => {
  const [open, setOpen] = useState(false);
  return (
    <nav className={`mobile-menu ${className}`}>
      <button onClick={() => setOpen(!open)} className="menu-toggle" aria-label="Toggle menu">
        ☰
      </button>
      {open && (
        <ul className="menu-list">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} className="menu-link">{link.label}</a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default MobileMenu;
