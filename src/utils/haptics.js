/**
 * Haptic Feedback Utility
 * Uses Web Vibration API with graceful fallback to visual feedback.
 * 
 * Usage:
 *   import { triggerHaptic } from '../utils/haptics';
 *   triggerHaptic();       // default subtle 10ms vibration
 *   triggerHaptic(25);     // slightly longer
 *   triggerHaptic(50);     // stronger feedback
 */

export function triggerHaptic(duration = 10) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // silently fail on devices that throw
    }
  }
  // Visual-only fallback is handled by CSS animations (ripple, press-down)
}

/**
 * Pattern-based haptic for specific events
 */
export function triggerHapticPattern(type = 'tap') {
  const patterns = {
    tap: [10],
    toggle: [8, 50, 12],
    success: [10, 30, 15, 50, 20],
    error: [30, 30, 30],
  };

  const pattern = patterns[type] || patterns.tap;
  
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // silently fail
    }
  }
}
