import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { markdownToHtml } from '../utils/markdownToHtml';
import Footer from '../components/Footer';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


const MarkdownPage = () => {
  const { slug } = useParams();
  const [htmlContent, setHtmlContent] = useState('');
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  
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
      setSiteConfig(cfg.site);
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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMarkdown();
  }, [slug]);
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
        </div>
      )}
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <Footer postCount={posts.length} tagscount={totalTags}/>
    </div>
  );
};

export default MarkdownPage;
