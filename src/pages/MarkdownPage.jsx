import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { markdownToHtml } from '../utils/markdownToHtml';
import { countWords, estimateReadTime, getProgress } from '../utils/readingProgress';
import Footer from '../components/Footer';
import ReadingProgress from '../components/ReadingProgress';
import ReadingMeta from '../components/ReadingMeta';
import ResumeToast from '../components/ResumeToast';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


const MarkdownPage = () => {
  const { slug } = useParams();
  const [htmlContent, setHtmlContent] = useState('');
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [totalReadTime, setTotalReadTime] = useState(0);
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  
  useEffect(() => {
    const loadPosts = async () => {
      const res = await fetch('/config.json');
      const cfg = await res.json();

      const loadedPosts = await Promise.all(
        cfg.pages.map(async (page) => {
          const filePath = `/content/${page.file}`;
          const res = await fetch(filePath);
          const text = await res.text();
          const { meta } = await markdownToHtml(text);
          return {
            slug: page.file.replace('.md', ''),
            ...meta,
          };
        })
      );

      loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const res1 = await fetch('/config.json');
        const cfg = await res1.json();
        const matched = cfg.pages.find((page) => page.file === `${slug}.md`);

        if (!matched) {
          setError('Page not found in configuration.');
          return;
        }

        const filePath = `/content/${matched.file}`;
        const res = await fetch(filePath);

        if (!res.ok) {
          throw new Error('Markdown file not found.');
        }

        const text = await res.text();
        const { html, meta } = await markdownToHtml(text);
        setHtmlContent(html);
        setMeta(meta);

        // Calculate reading metrics
        const wc = countWords(html);
        setWordCount(wc);
        // Use frontmatter readTime if available, otherwise estimate
        const rt = meta.readTime || estimateReadTime(wc);
        setTotalReadTime(rt);

        // Check for saved progress (resume feature)
        const saved = getProgress(slug);
        if (saved && saved.scrollPercent > 0.05 && !saved.completed) {
          setSavedProgress(saved);
          setShowResumeToast(true);
        }

        // Scroll to top on new post load
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMarkdown();
  }, [slug]);

  const handleResume = useCallback(() => {
    if (savedProgress) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const targetScroll = scrollHeight * savedProgress.scrollPercent;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    setShowResumeToast(false);
  }, [savedProgress]);

  const handleDismissResume = useCallback(() => {
    setShowResumeToast(false);
  }, []);

  const countUniqueTags = (posts) => {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return tagSet.size;
  };
  const totalTags = countUniqueTags(posts);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="markdown-page">
      {/* Reading progress bar + ETA badge */}
      {meta && totalReadTime > 0 && (
        <ReadingProgress slug={slug} totalReadTime={totalReadTime} />
      )}

      {/* Post header with reading metadata */}
      {meta && (
        <div className="post-header">
          <h1 className="post-title">{meta.title}</h1>
          {meta.date && (
            <p className="post-date">
              <em>{new Date(meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</em>
            </p>
          )}
          <p className="post-desc">{meta.description}</p>
          
          {/* Reading metadata strip */}
          <ReadingMeta totalReadTime={totalReadTime} wordCount={wordCount} />
        </div>
      )}

      {/* Post content */}
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Resume toast */}
      {showResumeToast && savedProgress && (
        <ResumeToast
          savedPercent={savedProgress.scrollPercent}
          onResume={handleResume}
          onDismiss={handleDismissResume}
        />
      )}

      <Footer postCount={posts.length} tagscount={totalTags}/>
    </div>
  );
};

export default MarkdownPage;
