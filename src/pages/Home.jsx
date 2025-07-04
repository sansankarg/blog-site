import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { markdownToHtml } from '../utils/markdownToHtml';
import Footer from '../components/Footer';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


const Home = () => {
  const { state } = useLocation();
  const onlyPosts = state?.onlyPosts || false;
  const [posts, setPosts] = useState([]);
  const [siteConfig, setSiteConfig] = useState({ title: '', description: '' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log("Fetching /config.json...");
        const configRes = await fetch('/config.json');
        const cfg = await configRes.json();
        console.log("Loaded config:", cfg);

        setSiteConfig(cfg.site || {});

        const tagSet = new Set();

        const loadedPosts = await Promise.all(
          cfg.pages.map(async (page) => {
            try {
              const filePath = `/content/${page.file}`;
              console.log(`Fetching markdown from: ${filePath}`);
              const res = await fetch(filePath);
              const text = await res.text();

              const { meta, content } = await markdownToHtml(text);
              console.log("Parsed meta:", meta);

              if (meta?.tags) {
                meta.tags.forEach(tag => tagSet.add(tag));
              }

              return {
                slug: page.file.replace('.md', ''),
                ...meta,
              };
            } catch (err) {
              console.error(`Failed to load post ${page.file}:`, err);
              return null;
            }
          })
        );

        const validPosts = loadedPosts.filter(p => p !== null);
        validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(validPosts);
        setAllTags(Array.from(tagSet));
      } catch (error) {
        console.error("Failed to load config or posts:", error);
      }
    };

    loadPosts();
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

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesTags =
      selectedTags.length === 0 || post.tags?.some(tag => selectedTags.includes(tag));
  
    const search = searchText.toLowerCase();
  
    const matchesSearch =
      post.title.toLowerCase().includes(search) ||
      (post.date && new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toLowerCase().includes(search));
  
    const isPastPost =
      post.date && new Date(post.date) <= new Date();
  
    return matchesTags && matchesSearch && isPastPost;
  });
  

  return (
    <div className="home-container">
      {!onlyPosts && (
        <header className="site-header">

          <h1 className="site-title">{siteConfig.title}</h1>
          <p className="site-description">{siteConfig.description}</p>
        </header>
      )}
      


      <div className="search-tag-container">
        <div className="post-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or date"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="tag-filter">
          {allTags.map((tag, index) => (
            <button
              key={index}
              className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <section className="posts">
        {filteredPosts.map((post, index) => (
          <article className="post-card" key={index}>
            <Link to={`/post/${post.slug}`} className="post-link">
              <h2 className="post-title">{post.title}</h2>
            </Link>
            <p className="post-date">
              {post.date
                ? new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'No Date'}
            </p>
            <p className="post-desc">{post.description}</p>
            {post.tags && (
              <div className="post-tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      <Footer postCount={posts.length} tagscount={totalTags} />
    </div>
  );
};

export default Home;
