import React, { useEffect, useState, useCallback, useRef } from 'react';
import { saveProgress, getTimeRemaining, formatReadTime } from '../utils/readingProgress';

/**
 * ReadingProgress — Fixed top progress bar + floating ETA badge.
 * Only renders on blog post pages.
 * 
 * Props:
 *   slug: string — post identifier
 *   totalReadTime: number — estimated total minutes to read
 */
const ReadingProgress = ({ slug, totalReadTime }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const completed = scrollPercent >= 0.95;

  const handleScroll = useCallback(() => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    
    if (scrollHeight <= 0) {
      setScrollPercent(0);
      return;
    }
    
    const percent = Math.min(scrollTop / scrollHeight, 1);
    setScrollPercent(percent);

    // Show badge when scrolling
    setBadgeVisible(true);
    
    // Hide badge after 3s of no scrolling
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setBadgeVisible(false);
    }, 3000);

    // Persist progress (debounced via requestAnimationFrame)
    saveProgress(slug, { scrollPercent: percent, totalReadTime });
  }, [slug, totalReadTime]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [handleScroll]);

  const timeLeft = getTimeRemaining(totalReadTime, scrollPercent);
  const widthPercent = Math.round(scrollPercent * 100);

  return (
    <>
      {/* Top gradient progress bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${widthPercent}%` }}
        role="progressbar"
        aria-valuenow={widthPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      {/* Floating ETA badge */}
      {!completed && (
        <div className={`reading-eta-badge ${badgeVisible ? 'visible' : ''}`}>
          <span className="eta-icon">⏱</span>
          <span className="eta-text">~{formatReadTime(timeLeft)} left</span>
        </div>
      )}
    </>
  );
};

export default ReadingProgress;
