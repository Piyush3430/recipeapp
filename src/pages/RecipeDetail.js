import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToList, setAddedToList] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        // First, check if this is a saved recipe from local storage
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        const savedRecipe = savedRecipes.find(recipe => recipe.id.toString() === id.toString());
        
        if (savedRecipe) {
          // If found in saved recipes, use that data
          setRecipe(savedRecipe);
          setLoading(false);
        } else {
          // If not found in saved recipes, try fetching from TheMealDB API
          try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const meal = response.data.meals ? response.data.meals[0] : null;

            if (meal) {
              // Format TheMealDB response to match existing recipe structure
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                const ingredientName = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredientName && ingredientName.trim() !== '') {
                  ingredients.push({ name: ingredientName, amount: measure, unit: '' });
                }
              }

              const fetchedRecipe = {
                id: meal.idMeal,
                title: meal.strMeal,
                image: meal.strMealThumb,
                category: meal.strCategory,
                area: meal.strArea,
                instructions: meal.strInstructions,
                youtube: meal.strYoutube,
                source: meal.strSource,
                ingredients: ingredients,
                readyInMinutes: 30, // Default value, as TheMealDB doesn't provide this
                servings: 4, // Default value
                cuisines: meal.strArea ? [meal.strArea] : [], // Use area as cuisine
                summary: meal.strInstructions ? meal.strInstructions.substring(0, 150) + '...' : 'No summary available.',
              };
              setRecipe(fetchedRecipe);
            } else {
              // Fallback to mock data if not found in TheMealDB either
              const mockRecipes = {
                '1': {
                  id: 1,
                  title: 'Spaghetti Carbonara',
                  image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
                  readyInMinutes: 30,
                  servings: 4,
                  cuisines: ['Italian'],
                  summary: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
                  instructions: 'Cook spaghetti according to package directions. In a separate pan, cook pancetta until crispy. In a bowl, whisk eggs, grated cheese, and black pepper. Drain pasta, reserving some pasta water. While pasta is still hot, add it to the pancetta, then quickly stir in the egg mixture. The heat from the pasta will cook the eggs into a creamy sauce. Add pasta water as needed to achieve desired consistency. Serve immediately with extra cheese and black pepper.',
                  ingredients: [
                    { name: 'Spaghetti', amount: '1', unit: 'pound' },
                    { name: 'Pancetta', amount: '8', unit: 'ounces' },
                    { name: 'Eggs', amount: '4', unit: 'large' },
                    { name: 'Parmesan cheese', amount: '1', unit: 'cup' },
                    { name: 'Black pepper', amount: '1', unit: 'teaspoon' },
                    { name: 'Salt', amount: '', unit: 'to taste' },
                  ],
                },
                '2': {
                  id: 2,
                  title: 'Chicken Tikka Masala',
                  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
                  readyInMinutes: 45,
                  servings: 6,
                  cuisines: ['Indian'],
                  summary: 'A flavorful Indian curry dish with marinated chicken in a creamy tomato sauce.',
                  instructions: 'Marinate chicken pieces in yogurt, lemon juice, and spices for at least 1 hour. Grill or bake chicken until cooked through. In a large pan, sauté onions until soft, then add garlic and ginger. Add tomato sauce and spices, simmer for 10 minutes. Add cream and simmer for another 5 minutes. Add the cooked chicken pieces and simmer for 10 more minutes. Garnish with fresh cilantro and serve with rice or naan bread.',
                  ingredients: [
                    { name: 'Chicken breast', amount: '2', unit: 'pounds' },
                    { name: 'Yogurt', amount: '1', unit: 'cup' },
                    { name: 'Lemon juice', amount: '2', unit: 'tablespoons' },
                    { name: 'Garam masala', amount: '2', unit: 'tablespoons' },
                    { name: 'Onion', amount: '1', unit: 'large' },
                    { name: 'Garlic', amount: '4', unit: 'cloves' },
                    { name: 'Ginger', amount: '1', unit: 'tablespoon' },
                    { name: 'Tomato sauce', amount: '15', unit: 'ounces' },
                    { name: 'Heavy cream', amount: '1', unit: 'cup' },
                    { name: 'Cilantro', amount: '1/4', unit: 'cup' },
                  ],
                },
                '3': {
                  id: 3,
                  title: 'Beef Tacos',
                  image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
                  readyInMinutes: 25,
                  servings: 4,
                  cuisines: ['Mexican'],
                  summary: 'Classic Mexican tacos with seasoned ground beef and all the toppings.',
                  instructions: 'Brown ground beef in a skillet over medium heat. Drain excess fat. Add taco seasoning and water, simmer for 5 minutes. Warm taco shells in the oven. Fill shells with beef mixture and top with lettuce, tomato, cheese, sour cream, and salsa as desired.',
                  ingredients: [
                    { name: 'Ground beef', amount: '1', unit: 'pound' },
                    { name: 'Taco seasoning', amount: '1', unit: 'packet' },
                    { name: 'Water', amount: '2/3', unit: 'cup' },
                    { name: 'Taco shells', amount: '8', unit: 'count' },
                    { name: 'Lettuce', amount: '2', unit: 'cups' },
                    { name: 'Tomato', amount: '1', unit: 'large' },
                    { name: 'Cheddar cheese', amount: '1', unit: 'cup' },
                    { name: 'Sour cream', amount: '1/2', unit: 'cup' },
                    { name: 'Salsa', amount: '1/2', unit: 'cup' },
                  ],
                },
                '4': {
                  id: 4,
                  title: 'Vegetable Stir Fry',
                  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
                  readyInMinutes: 20,
                  servings: 2,
                  cuisines: ['Asian', 'Chinese'],
                  summary: 'A quick and healthy vegetable stir fry with a flavorful sauce.',
                  instructions: 'Heat oil in a wok or large skillet over high heat. Add garlic and ginger, stir for 30 seconds. Add vegetables in order of cooking time (harder vegetables first). Stir fry until vegetables are crisp-tender. In a small bowl, mix soy sauce, vegetable broth, cornstarch, and honey. Pour sauce over vegetables and cook until thickened. Serve over rice or noodles.',
                  ingredients: [
                    { name: 'Vegetable oil', amount: '2', unit: 'tablespoons' },
                    { name: 'Garlic', amount: '2', unit: 'cloves' },
                    { name: 'Ginger', amount: '1', unit: 'tablespoon' },
                    { name: 'Broccoli', amount: '1', unit: 'cup' },
                    { name: 'Carrots', amount: '2', unit: 'medium' },
                    { name: 'Bell pepper', amount: '1', unit: 'large' },
                    { name: 'Snow peas', amount: '1', unit: 'cup' },
                    { name: 'Soy sauce', amount: '3', unit: 'tablespoons' },
                    { name: 'Vegetable broth', amount: '1/4', unit: 'cup' },
                    { name: 'Cornstarch', amount: '1', unit: 'tablespoon' },
                    { name: 'Honey', amount: '1', unit: 'tablespoon' },
                  ],
                },
              };

              const recipeData = mockRecipes[id];
              if (recipeData) {
                setRecipe(recipeData);
              } else {
                setError('Recipe not found');
              }
            }
            setLoading(false);
          } catch (apiErr) {
            setError('Failed to fetch recipe details from API. Please try again.');
            setLoading(false);
            console.error('Error fetching recipe details from TheMealDB:', apiErr);
          }
        }
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again.');
        setLoading(false);
        console.error('Error fetching recipe details:', err);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const [savedToMyRecipes, setSavedToMyRecipes] = useState(false);

  // Check if recipe is already saved
  useEffect(() => {
    if (recipe) {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
      const isAlreadySaved = savedRecipes.some(savedRecipe => 
        savedRecipe.id.toString() === recipe.id.toString()
      );
      setSavedToMyRecipes(isAlreadySaved);
    }
  }, [recipe]);

  const addToShoppingList = () => {
    // In a real app, you would save this to local storage or a database
    // For demo purposes, we'll just show a success message
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 3000);
  };

  const saveRecipe = () => {
    if (!recipe) return;
    
    // Get existing recipes from local storage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    
    // Check if recipe is already saved
    const isAlreadySaved = savedRecipes.some(savedRecipe => 
      savedRecipe.id.toString() === recipe.id.toString()
    );
    
    if (!isAlreadySaved) {
      // Add current date to recipe
      const recipeToSave = {
        ...recipe,
        dateAdded: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      };
      
      // Add to saved recipes
      const updatedRecipes = [recipeToSave, ...savedRecipes];
      
      // Save to local storage
      localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
      
      // Update state
      setSavedToMyRecipes(true);
      
      // Show success message
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i> Loading recipe details...
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!recipe) {
    return <div className="error">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <div className="recipe-image-container">
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        </div>
        <div className="recipe-info-container">
          <h1 className="recipe-title">{recipe.title}</h1>
          <div className="recipe-meta">
            <span><i className="far fa-clock"></i> {recipe.readyInMinutes} mins</span>
            <span><i className="fas fa-utensils"></i> {recipe.servings} servings</span>
          </div>
          <div className="recipe-cuisines">
            {recipe.cuisines.map((cuisine, index) => (
              <span key={index} className="cuisine-tag">{cuisine}</span>
            ))}
          </div>
          <p className="recipe-summary">{recipe.summary}</p>
          <div className="recipe-actions">
            <button className="btn" onClick={addToShoppingList}>
              <i className="fas fa-shopping-basket"></i> Add to Shopping List
            </button>
            {savedToMyRecipes ? (
              <Link to="/my-recipes" className="btn saved">
                <i className="fas fa-bookmark"></i> Saved to My Recipes
              </Link>
            ) : (
              <button className="btn" onClick={saveRecipe}>
                <i className="far fa-bookmark"></i> Save Recipe
              </button>
            )}
          </div>
          {addedToList && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i> {savedToMyRecipes ? 'Recipe saved to My Recipes!' : 'Added to shopping list!'}
            </div>
          )}
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-ingredients">
          <h2><i className="fas fa-list"></i> Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                <span className="ingredient-name">{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h2><i className="fas fa-tasks"></i> Instructions</h2>
          <div className="instructions-text">
            {recipe.instructions.split('. ').map((step, index) => (
              <p key={index} className="instruction-step">
                <span className="step-number">{index + 1}</span>
                {step}.
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="back-link">
        <Link to="/" className="btn">
          <i className="fas fa-arrow-left"></i> Back to Recipes
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetail;