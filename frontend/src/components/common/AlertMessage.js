import React, { useState, useEffect } from 'react';
import './AlertMessage.css';

const AlertMessage = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when message changes
    setVisible(true);
    
    // Set up auto-dismiss timer if duration is provided
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Give time for animation to complete
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Give time for animation to complete
    }
  };

  // Get icon based on alert type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  return (
    <div className={`alert-message ${type} ${visible ? 'visible' : 'hidden'}`} role="alert">
      <div className="alert-icon">
        {getIcon()}
      </div>
      <div className="alert-content">
        {message}
      </div>
      <button className="alert-close" onClick={handleClose} aria-label="ปิด">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default AlertMessage;