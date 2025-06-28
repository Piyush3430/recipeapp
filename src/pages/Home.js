import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import commonIngredients from '../data/commonIngredients';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name', 'ingredient', 'cuisine'
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for ingredient-based search
  const [ingredients, setIngredients] = useState(['']);
  // TheMealDB doesn't require an API key for the free tier

  // For demo purposes, we'll use a mock API call
  const searchRecipes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would use an actual API like:
      // const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=YOUR_API_KEY`);
      
      // For demo, we'll simulate an API response
      setTimeout(() => {
        const mockRecipes = [
          {
            id: 1,
            title: 'Spaghetti Carbonara',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
            readyInMinutes: 30,
            servings: 4,
            cuisines: ['Italian'],
          },
          {
            id: 2,
            title: 'Chicken Tikka Masala',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
            readyInMinutes: 45,
            servings: 6,
            cuisines: ['Indian'],
          },
          {
            id: 3,
            title: 'Beef Tacos',
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            readyInMinutes: 25,
            servings: 4,
            cuisines: ['Mexican'],
          },
          {
            id: 4,
            title: 'Vegetable Stir Fry',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            readyInMinutes: 20,
            servings: 2,
            cuisines: ['Asian', 'Chinese'],
          },
        ];

        // Filter based on search term (case insensitive)
        const filteredRecipes = mockRecipes.filter(recipe => {
          const term = searchTerm.toLowerCase();
          if (searchBy === 'name') {
            return recipe.title.toLowerCase().includes(term);
          } else if (searchBy === 'cuisine') {
            return recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(term));
          }
          // For ingredients, we would need ingredient data in a real app
          return true;
        });

        setRecipes(filteredRecipes);
        setLoading(false);
      }, 1000); // Simulate network delay

    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      setLoading(false);
      console.error('Error fetching recipes:', err);
    }
  };

  // Function to search recipes by ingredients using TheMealDB API
  const searchByIngredients = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    
    if (filteredIngredients.length === 0) {
      setError('Please enter at least one ingredient');
      setLoading(false);
      return;
    }

    try {
      let allRecipes = [];
      let uniqueRecipeIds = new Set();
      
      // Create an array of promises for parallel API calls
      const searchPromises = filteredIngredients.map(ingredient => {
        // Use search.php endpoint which searches meal names
        return axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`
        );
      });
      
      // Execute all API calls in parallel
      const responses = await Promise.all(searchPromises);
      
      // Process all responses
      responses.forEach((response, index) => {
        if (response.data.meals) {
          response.data.meals.forEach(meal => {
            // Only add if we haven't seen this recipe before
            if (!uniqueRecipeIds.has(meal.idMeal)) {
              uniqueRecipeIds.add(meal.idMeal);
              
              // Add the ingredient that matched this recipe
              allRecipes.push({
                id: meal.idMeal,
                title: meal.strMeal,
                image: meal.strMealThumb,
                readyInMinutes: 30, // Default value
                servings: 4, // Default value
                cuisines: [], // TheMealDB doesn't provide cuisines in this endpoint
                matchedIngredients: [filteredIngredients[index]],
                usedIngredientCount: 1,
                missedIngredientCount: 0
              });
            } else {
              // If we've seen this recipe before, update the matched ingredients
              const existingRecipe = allRecipes.find(r => r.id === meal.idMeal);
              if (existingRecipe) {
                existingRecipe.matchedIngredients.push(filteredIngredients[index]);
                existingRecipe.usedIngredientCount = existingRecipe.matchedIngredients.length;
              }
            }
          });
        }
      });
      
      // Sort recipes by number of matched ingredients (descending)
      allRecipes.sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);
      
      if (allRecipes.length === 0) {
        setError(`No recipes found with the provided ingredients. Try different ingredients.`);
        setLoading(false);
        return;
      }
      
      setRecipes(allRecipes);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      setLoading(false);
      console.error('Error fetching recipes by ingredients:', err);
    }
  };

  // Handle adding a new ingredient input field
  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
    setInputValues([...inputValues, '']);
  };

  // Handle removing an ingredient input field
  const removeIngredientField = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);
  };

  // Handle ingredient input change
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Filter ingredients for dropdown based on input
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [inputValues, setInputValues] = useState(['']);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  
  const handleIngredientInput = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
    
    // Update the actual ingredient value
    handleIngredientChange(index, value);
    
    // Filter ingredients based on input
    if (value.trim() === '') {
      setFilteredIngredients([]);
    } else {
      const filtered = commonIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredIngredients(filtered);
      setActiveDropdownIndex(index);
    }
  };
  
  const selectIngredient = (index, ingredient) => {
    handleIngredientChange(index, ingredient);
    
    const newInputValues = [...inputValues];
    newInputValues[index] = ingredient;
    setInputValues(newInputValues);
    
    setFilteredIngredients([]);
    setActiveDropdownIndex(null);
  };

  // Handle keyboard navigation for dropdown
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleKeyDown = (e, index) => {
    if (filteredIngredients.length > 0 && activeDropdownIndex === index) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < filteredIngredients.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0) {
            e.preventDefault();
            selectIngredient(index, filteredIngredients[selectedSuggestionIndex]);
            setSelectedSuggestionIndex(-1);
          }
          break;
        case 'Escape':
          setFilteredIngredients([]);
          setActiveDropdownIndex(null);
          setSelectedSuggestionIndex(-1);
          break;
        default:
          break;
      }
    }
  };

  // We no longer need the API key handler since TheMealDB doesn't require an API key

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Find Your Perfect Recipe</h1>
        <p>Search thousands of recipes by name, ingredients</p>
        
        {/* Ingredient-based search form using TheMealDB API */}
        <div className="ingredient-search-section">
          <h2>Find Recipes By Available Ingredients</h2>
          <form onSubmit={searchByIngredients} className="ingredient-search-form">
            <div className="ingredients-container">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input-group">
                  <div className="dropdown-container">
                    <input
                      type="text"
                      placeholder={`Ingredient ${index + 1} (e.g., chicken, tomatoes)`}
                      value={inputValues[index]}
                      onChange={(e) => handleIngredientInput(index, e.target.value)}
                      onFocus={() => {
                        setActiveDropdownIndex(index);
                        // Show suggestions immediately if there's text
                        if (inputValues[index].trim() !== '') {
                          const filtered = commonIngredients.filter(ingredient => 
                            ingredient.toLowerCase().includes(inputValues[index].toLowerCase())
                          ).slice(0, 5);
                          setFilteredIngredients(filtered);
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onBlur={() => setTimeout(() => {
                        setActiveDropdownIndex(null);
                        setSelectedSuggestionIndex(-1);
                      }, 200)}
                      className="ingredient-input"
                      autoComplete="off"
                    />
                    {filteredIngredients.length > 0 && activeDropdownIndex === index && (
                      <div className="ingredient-dropdown">
                        {filteredIngredients.map((item, i) => (
                          <div 
                            key={i} 
                            className={`dropdown-item ${i === selectedSuggestionIndex ? 'selected' : ''}`}
                            onClick={() => selectIngredient(index, item)}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {ingredients.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeIngredientField(index)}
                      className="remove-ingredient-btn"
                    >
                      <i className="fas fa-times">remove item</i>
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addIngredientField}
                className="add-ingredient-btn"
              >
                <i className="fas fa-plus"></i> Add Ingredient
              </button>
            </div>
            
            <button type="submit" className="search-button ingredient-search-btn">
              <i className="fas fa-utensils"></i> Find Recipes with Multiple Ingredients
            </button> <br></br>
            <small className="api-note">Recipes will be sorted by most ingredient matches</small>
          </form>
        </div>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Loading recipes...
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : recipes.length > 0 ? (
          <>
            <h2>Search Results</h2>
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="card recipe-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h3>{recipe.title}</h3>
                  <div className="recipe-info">
                    <span><i className="far fa-clock"></i> {recipe.readyInMinutes} mins</span>
                    <span><i className="fas fa-utensils"></i> {recipe.servings} servings</span>
                  </div>
                  {recipe.usedIngredientCount !== undefined && (
                    <div className="ingredient-match-info">
                      <span className="used-ingredients">
                        <i className="fas fa-check"></i> {recipe.usedIngredientCount} ingredient{recipe.usedIngredientCount !== 1 ? 's' : ''} matched
                      </span>
                      {recipe.matchedIngredients && (
                        <div className="matched-ingredients-list">
                          <small>Matched: {recipe.matchedIngredients.join(', ')}</small>
                        </div>
                      )}
                    </div>
                  )}
                  {recipe.cuisines && recipe.cuisines.length > 0 && (
                    <div className="recipe-cuisines">
                      {recipe.cuisines.map((cuisine, index) => (
                        <span key={index} className="cuisine-tag">{cuisine}</span>
                      ))}
                    </div>
                  )}
                  <Link to={`/recipe/${recipe.id}`} className="btn">
                    View Recipe
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : searchTerm || ingredients.some(ing => ing.trim() !== '') ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No recipes found. Try different ingredients or search terms.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;