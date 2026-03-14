import React, { useState, useEffect } from 'react';

/**
 * ResumeToast — "Continue where you left off?" prompt.
 * Shows when a user returns to a partially-read post.
 * 
 * Props:
 *   savedPercent: number (0-1) — where they left off
 *   onResume: () => void — scroll to saved position
 *   onDismiss: () => void — close toast
 */
const ResumeToast = ({ savedPercent, onResume, onDismiss }) => {
  const [dismissing, setDismissing] = useState(false);
  const [visible, setVisible] = useState(false);
  const percentDisplay = Math.round(savedPercent * 100);

  // Delay showing to avoid flash
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      onDismiss();
    }, 300); // match animation duration
  };

  const handleResume = () => {
    setDismissing(true);
    setTimeout(() => {
      onResume();
    }, 200);
  };

  if (!visible) return null;

  return (
    <div className={`resume-toast ${dismissing ? 'dismissing' : ''}`}>
      <div className="resume-toast-text">
        <strong>Welcome back!</strong> You were{' '}
        <span className="resume-toast-percent">{percentDisplay}%</span> through this post.
      </div>
      <button className="resume-toast-btn primary" onClick={handleResume}>
        Resume
      </button>
      <button className="resume-toast-btn dismiss" onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
};

export default ResumeToast;
