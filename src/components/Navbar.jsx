import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-title">{title}</Link>
        <div className="nav-links">
          <button onClick={() => navigate('/', { state: { onlyPosts: false } })} className="nav-btn">Home</button>
          <button onClick={() => navigate('/', { state: { onlyPosts: true } })} className="nav-btn">Posts</button>
          {/* <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link> */}

          <button onClick={toggleDarkMode} className="nav-btn" aria-label="Toggle Dark Mode">
            <span className="material-icons">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
