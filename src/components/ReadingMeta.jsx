import React, { useEffect, useState } from 'react';
import { getTimeRemaining, formatReadTime } from '../utils/readingProgress';

/**
 * ReadingMeta — Inline metadata strip shown in the post header.
 * Shows: 📖 X min read • ⏱ ~Y min left • Z%
 * 
 * Props:
 *   totalReadTime: number — total estimated minutes
 *   wordCount: number — total words in the post
 */
const ReadingMeta = ({ totalReadTime, wordCount }) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;
      setScrollPercent(Math.min(scrollTop / scrollHeight, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const completed = scrollPercent >= 0.95;
  const timeLeft = getTimeRemaining(totalReadTime, scrollPercent);
  const percentDisplay = Math.round(scrollPercent * 100);

  return (
    <div className="reading-meta">
      <span className="reading-meta-icon">📖</span>
      <span>{formatReadTime(totalReadTime)} read</span>
      
      {wordCount > 0 && (
        <>
          <span className="reading-meta-separator">•</span>
          <span>{wordCount.toLocaleString()} words</span>
        </>
      )}

      <span className="reading-meta-separator">•</span>

      {completed ? (
        <span className="reading-meta-done">✓ Finished</span>
      ) : (
        <>
          <span>⏱ ~{formatReadTime(timeLeft)} left</span>
          <span className="reading-meta-separator">•</span>
          <span className="reading-meta-percent">{percentDisplay}%</span>
        </>
      )}
    </div>
  );
};

export default ReadingMeta;
