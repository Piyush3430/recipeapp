import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <i className="fas fa-utensils"></i> Recipe Finder
        </Link>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/my-recipes" className="navbar-link" onClick={closeMenu}>
              <i className="fas fa-book"></i> My Recipes
            </Link>
          </li>
          <li>
            <Link to="/add-recipe" className="navbar-link" onClick={closeMenu}>
              <i className="fas fa-plus"></i> Add Recipe
            </Link>
          </li>
          <li>
            <Link to="/shopping-list" className="navbar-link" onClick={closeMenu}>
              <i className="fas fa-shopping-basket"></i> Shopping List
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;