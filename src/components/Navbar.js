import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-utensils"></i> Recipe Finder
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/my-recipes" className="navbar-link">
              <i className="fas fa-book"></i> My Recipes
            </Link>
          </li>
          <li>
            <Link to="/add-recipe" className="navbar-link">
              <i className="fas fa-plus"></i> Add Recipe
            </Link>
          </li>
          <li>
            <Link to="/shopping-list" className="navbar-link">
              <i className="fas fa-shopping-basket"></i> Shopping List
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;