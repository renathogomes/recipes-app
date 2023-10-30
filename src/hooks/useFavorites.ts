import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/global.context';

function useFavorites() {
  const state = useContext(GlobalContext);
  const { favoriteRecipes } = state.state;
  const [isShared, setIsShared] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    state.update({ ...state, favoriteRecipes: getRecipes });
  }, []);

  useEffect(() => {
    const newFavRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    if (filter === 'all') {
      state.update({ ...state, favoriteRecipes: newFavRecipes });
    } else if (filter === 'meal') {
      const food = newFavRecipes.filter((recipe: any) => recipe.type === 'meal');
      state.update({ ...state, favoriteRecipes: food });
    } else if (filter === 'drink') {
      const drink = newFavRecipes.filter((recipe: any) => recipe.type === 'drink');
      state.update({ ...state, favoriteRecipes: drink });
    }
  }, [filter]);

  const handleShare = (type: string, id: string) => {
    const { location: { origin } } = window;
    const url = `${origin}/${type}s/${id}`;
    navigator.clipboard.writeText(url);
    setIsShared(`${id}`);
  };

  const handleUnfavorite = (recipeId: string) => {
    const newFavRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const newRecipes = newFavRecipes.filter((recipe: any) => recipe.id !== recipeId);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newRecipes));
    state.update({ ...state, favoriteRecipes: newRecipes });
  };

  return { isShared, handleShare, handleUnfavorite, favoriteRecipes, setFilter };
}

export default useFavorites;
