import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyRecipes.css';

const MyRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [filter, setFilter] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Load recipes from local storage when component mounts
  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    setSavedRecipes(storedRecipes);
  }, []);

  const removeRecipe = (id) => {
    if (window.confirm('Are you sure you want to remove this recipe from your saved recipes?')) {
      const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id);
      setSavedRecipes(updatedRecipes);
      localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    console.log('Filter value:', value);
    setFilter(value);
  };

  const filteredRecipes = savedRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(filter.toLowerCase()) ||
    recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="my-recipes-page">
      <div className="page-header">
        <h1>My Saved Recipes</h1>
        <p>Manage your collection of favorite recipes</p>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          Recipe removed successfully!
        </div>
      )}

      <div className="filter-container">
        <div className="filter-section">
          <label htmlFor="recipe-filter" className="filter-label">Filter Recipes:</label>
          <input
            id="recipe-filter"
            type="text"
            placeholder="Filter by name or cuisine..."
            value={filter}
            onChange={handleFilterChange}
            onInput={handleFilterChange} // Backup handler
            className="filter-input"
            autoComplete="off" // Changed from "on" to "off"
            spellCheck="false"
            data-testid="filter-input"
          />
          <div className="filter-info">
            Current filter: "{filter}" | Found {filteredRecipes.length} recipes
          </div>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="card recipe-card">
              <div className="card-actions">
                <button 
                  className="remove-btn" 
                  onClick={() => removeRecipe(recipe.id)}
                  title="Remove from saved recipes"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <div className="recipe-info">
                <span><i className="far fa-clock"></i> {recipe.readyInMinutes} mins</span>
                <span><i className="fas fa-utensils"></i> {recipe.servings} servings</span>
              </div>
              <div className="recipe-cuisines">
                {recipe.cuisines.map((cuisine, index) => (
                  <span key={index} className="cuisine-tag">{cuisine}</span>
                ))}
              </div>
              <div className="date-added">
                <i className="far fa-calendar-alt"></i> Saved on {recipe.dateAdded}
              </div>
              <Link to={`/recipe/${recipe.id}`} className="btn">
                View Recipe
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="far fa-bookmark"></i>
          <h2>No saved recipes yet</h2>
          <p>Your saved recipes will appear here. Start by exploring recipes and saving your favorites!</p>
          <Link to="/" className="btn">
            Find Recipes
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
