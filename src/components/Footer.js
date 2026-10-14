import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <p>&copy; {new Date().getFullYear()} Hotel New Moorthi Cafe. All rights reserved.</p>
        <p>
          <a href="/">Home</a> | <a href="/about">About</a> | <a href="/menu">Menu</a> | <a href="/gallery">Gallery</a> | <a href="/contact">Contact</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
