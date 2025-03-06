import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className={`loader loader-${size}`}>
        <div className="loader-spinner"></div>
        <p className="loader-text">กำลังโหลด...</p>
      </div>
    </div>
  );
};

export default Loader;