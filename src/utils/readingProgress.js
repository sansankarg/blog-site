/**
 * Reading Progress Utility
 * Handles localStorage persistence, word counting, and reading time estimation.
 * 
 * localStorage schema:
 * "reading-progress" → {
 *   [slug]: {
 *     scrollPercent: number (0-1),
 *     lastVisited: ISO string,
 *     completed: boolean,
 *     totalReadTime: number (minutes),
 *   }
 * }
 */

const STORAGE_KEY = 'reading-progress';

// ─── Read / Write ────────────────────────────────────────────────

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded — silently fail
  }
}

export function getProgress(slug) {
  const all = getAll();
  return all[slug] || null;
}

export function saveProgress(slug, { scrollPercent, totalReadTime }) {
  const all = getAll();
  const existing = all[slug] || {};
  
  all[slug] = {
    ...existing,
    scrollPercent: Math.max(scrollPercent, existing.scrollPercent || 0),
    lastVisited: new Date().toISOString(),
    completed: scrollPercent >= 0.95,
    totalReadTime: totalReadTime || existing.totalReadTime || 0,
  };
  
  saveAll(all);
}

export function markCompleted(slug) {
  const all = getAll();
  if (all[slug]) {
    all[slug].completed = true;
    all[slug].scrollPercent = 1;
    all[slug].lastVisited = new Date().toISOString();
    saveAll(all);
  }
}

// ─── Word Count & Read Time ─────────────────────────────────────

const WORDS_PER_MINUTE = 200;

/**
 * Count words in HTML content by stripping tags.
 */
export function countWords(html) {
  if (!html) return 0;
  const text = html
    .replace(/<[^>]*>/g, ' ')   // strip HTML tags
    .replace(/&[^;]+;/g, ' ')   // strip HTML entities
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim();
  return text ? text.split(' ').length : 0;
}

/**
 * Estimate read time from word count.
 * Returns minutes (integer, minimum 1).
 */
export function estimateReadTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Calculate minutes remaining based on scroll position.
 */
export function getTimeRemaining(totalMinutes, scrollPercent) {
  const remaining = totalMinutes * (1 - Math.min(scrollPercent, 1));
  return Math.max(0, Math.ceil(remaining));
}

/**
 * Format minutes into human-readable string.
 */
export function formatReadTime(minutes) {
  if (minutes <= 0) return 'Done';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
}
