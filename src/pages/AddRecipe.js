import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRecipe.css';
import commonIngredients from '../data/commonIngredients';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    readyInMinutes: '',
    servings: '',
    cuisines: '',
    summary: '',
    instructions: '',
    image: '',
  });

  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
  ]);

  const [submitted, setSubmitted] = useState(false);
  
  // State for ingredient autocomplete
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form change:', name, value); // Debug log
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Test function to verify state updates
  const testTitleUpdate = () => {
    console.log('Testing title update...');
    setFormData(prev => ({
      ...prev,
      title: 'Test Recipe ' + Date.now()
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
    
    // If the field is 'name', handle autocomplete
    if (field === 'name') {
      handleIngredientInput(index, value);
    }
  };
  
  // Filter ingredients for dropdown based on input
  const handleIngredientInput = (index, value) => {
    // Update the actual ingredient value is handled by handleIngredientChange
    
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
  
  // Select ingredient from dropdown
  const selectIngredient = (index, ingredient) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].name = ingredient;
    setIngredients(updatedIngredients);
    
    setFilteredIngredients([]);
    setActiveDropdownIndex(null);
  };
  
  // Handle keyboard navigation for dropdown
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

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = [...ingredients];
      updatedIngredients.splice(index, 1);
      setIngredients(updatedIngredients);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new recipe object with form data
    const newRecipe = {
      id: Date.now(), // Generate a unique ID using timestamp
      title: formData.title,
      readyInMinutes: parseInt(formData.readyInMinutes),
      servings: parseInt(formData.servings),
      cuisines: formData.cuisines.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine !== ''),
      summary: formData.summary,
      instructions: formData.instructions,
      image: formData.image || 'https://via.placeholder.com/400x300?text=No+Image',
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      dateAdded: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };
    
    // Get existing recipes from local storage or initialize empty array
    const existingRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    
    // Add new recipe to the array
    const updatedRecipes = [newRecipe, ...existingRecipes];
    
    // Save updated recipes array to local storage
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds and redirect to My Recipes
    setTimeout(() => {
      setFormData({
        title: '',
        readyInMinutes: '',
        servings: '',
        cuisines: '',
        summary: '',
        instructions: '',
        image: '',
      });
      setIngredients([{ name: '', amount: '', unit: '' }]);
      setSubmitted(false);
      navigate('/my-recipes');
    }, 3000);
  };

  return (
    <div className="add-recipe-page">
      <div className="page-header">
        <h1>Add New Recipe</h1>
        <p>Share your culinary creations with the world</p>
        
        {/* Test input outside of form */}
        <div style={{ margin: '20px 0', padding: '20px', border: '2px solid white',  }}>
         
          {/* <input
             type="text"
             placeholder="Test input outside form"
             onChange={(e) => console.log('Test input changed:', e.target.value)}
             style={{
               width: '300px',
               padding: '10px',
               border: '1px solid #ccc',
               borderRadius: '5px',
               fontSize: '1rem'
             }}
          /> */}
        </div>
      </div>

      {submitted ? (
        <div className="success-container">
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h2>Recipe Added Successfully!</h2>
            <p>Your recipe has been added to your collection.</p>
          </div>
        </div>
      ) : (
        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-left">
              <div className="form-control">
                <label htmlFor="title">Recipe Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    console.log('Title input changed:', newValue);
                    setFormData(prev => ({
                      ...prev,
                      title: newValue
                    }));
                  }}
                  onInput={(e) => {
                    const newValue = e.target.value;
                    console.log('Title input event:', newValue);
                    setFormData(prev => ({
                      ...prev,
                      title: newValue
                    }));
                  }}
                  onKeyDown={(e) => {
                    console.log('Key pressed in title:', e.key);
                  }}
                  onFocus={(e) => {
                    console.log('Title input focused');
                    e.target.select();
                  }}
                  onBlur={() => console.log('Title input blurred')}
                  onClick={() => console.log('Title input clicked')}
                  required
                  placeholder="e.g. Homemade Chocolate Chip Cookies"
                  autoComplete="off"
                  spellCheck="false"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    background: '#ffffff',
                    cursor: 'text',
                    outline: 'none',
                    boxSizing: 'border-box',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  Current title: "{formData.title}" (Length: {formData.title.length})
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button 
                    type="button"
                    onClick={testTitleUpdate}
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Test Title Update
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-control">
                  <label htmlFor="readyInMinutes">Cooking Time (minutes)*</label>
                  <input
                    type="number"
                    id="readyInMinutes"
                    name="readyInMinutes"
                    value={formData.readyInMinutes}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g. 30"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="servings">Servings*</label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g. 4"
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="cuisines">Cuisine(s)</label>
                <input
                  type="text"
                  id="cuisines"
                  name="cuisines"
                  value={formData.cuisines}
                  onChange={handleChange}
                  placeholder="e.g. Italian, Mediterranean (separate with commas)"
                />
              </div>

              <div className="form-control">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-control">
                <label htmlFor="summary">Recipe Summary*</label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your recipe"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="form-right">
              <div className="form-control">
                <label>Ingredients*</label>
                <div className="ingredients-container">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
                      <input
                        type="text"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        className="ingredient-amount"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="ingredient-unit"
                      />
                      <div className="dropdown-container">
                        <input
                          type="text"
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          onFocus={() => {
                            setActiveDropdownIndex(index);
                            // Show suggestions immediately if there's text
                            if (ingredient.name.trim() !== '') {
                              const filtered = commonIngredients.filter(ing => 
                                ing.toLowerCase().includes(ingredient.name.toLowerCase())
                              ).slice(0, 5);
                              setFilteredIngredients(filtered);
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onBlur={() => setTimeout(() => {
                            setActiveDropdownIndex(null);
                            setSelectedSuggestionIndex(-1);
                          }, 200)}
                          className="ingredient-name"
                          autoComplete="off"
                          required
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
                      <button
                        type="button"
                        className="remove-ingredient-btn"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-ingredient-btn"
                    onClick={addIngredient}
                  >
                    <i className="fas fa-plus"></i> Add Ingredient
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="instructions">Cooking Instructions*</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  placeholder="Step-by-step instructions for preparing the recipe"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-recipes')}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Save Recipe
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRecipe;