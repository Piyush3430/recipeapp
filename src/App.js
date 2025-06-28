import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import MyRecipes from './pages/MyRecipes';
import AddRecipe from './pages/AddRecipe';
import ShoppingList from './pages/ShoppingList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
