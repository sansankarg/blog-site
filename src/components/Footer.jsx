import React from 'react';

const Footer = ({ postCount, tagscount }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Arthur Revolt &copy; {currentYear} </p> 
        <p>All rights reserved </p> 
        <p>stats : {postCount} {postCount === 1 ? 'post' : 'posts'} , {tagscount} {postCount === 1 ? 'tag' : 'tags'}</p>
        
      </div>
    </footer>
  );
};

export default Footer;
