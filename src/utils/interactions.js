/**
 * Interaction Utilities
 * JS helpers for CSS-coordinated interactions (ripple, 3D tilt).
 *
 * Usage:
 *   import { attachRipple, attachTilt } from '../utils/interactions';
 *   
 *   // In a React ref or useEffect:
 *   attachRipple(buttonElement);
 *   attachTilt(cardElement);
 */

/**
 * Ripple Effect
 * Works with .ripple-surface CSS class.
 * Sets --ripple-x and --ripple-y, toggles .ripple-active.
 */
export function attachRipple(element) {
  if (!element) return;
  
  const handler = (e) => {
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    element.style.setProperty('--ripple-x', `${x}%`);
    element.style.setProperty('--ripple-y', `${y}%`);
    
    element.classList.remove('ripple-active');
    // Force reflow to restart animation
    void element.offsetWidth;
    element.classList.add('ripple-active');
    
    setTimeout(() => {
      element.classList.remove('ripple-active');
    }, 600);
  };
  
  element.addEventListener('click', handler);
  
  // Return cleanup function
  return () => element.removeEventListener('click', handler);
}

/**
 * 3D Tilt Effect
 * Works with .tilt-3d CSS class.
 * Sets --tilt-x and --tilt-y CSS custom properties on mousemove.
 */
export function attachTilt(element, maxAngle = 4) {
  if (!element) return;
  
  const moveHandler = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    const tiltX = -(percentY * maxAngle);
    const tiltY = percentX * maxAngle;
    
    element.style.setProperty('--tilt-x', `${tiltX}deg`);
    element.style.setProperty('--tilt-y', `${tiltY}deg`);
  };
  
  const leaveHandler = () => {
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  };
  
  element.addEventListener('mousemove', moveHandler);
  element.addEventListener('mouseleave', leaveHandler);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', moveHandler);
    element.removeEventListener('mouseleave', leaveHandler);
  };
}
