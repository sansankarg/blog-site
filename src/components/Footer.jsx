import React from 'react';

const Footer = ({ postCount, tagscount }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-bottom-row">
          <div className="footer-contact-simple">
            <span>Get in touch: </span>
            <a href="mailto:arthurrevolt.dev@gmail.com" className="footer-email">arthurrevolt.dev@gmail.com</a>
          </div>
          <div className="footer-stats">
            {postCount} {postCount === 1 ? 'post' : 'posts'} • {tagscount} {tagscount === 1 ? 'tag' : 'tags'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
