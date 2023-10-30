import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/global.context';

function useDoneRecipes() {
  const state = useContext(GlobalContext);
  const { doneRecipes } = state.state;
  const [isShared, setIsShared] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
    state.update({ ...state, doneRecipes: getRecipes });
  }, []);

  useEffect(() => {
    const newDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
    if (filter === 'all') {
      state.update({ ...state, doneRecipes: newDoneRecipes });
    } else if (filter === 'meal') {
      const food = newDoneRecipes.filter((recipe: any) => recipe.type === 'meal');
      state.update({ ...state, doneRecipes: food });
    } else if (filter === 'drink') {
      const drink = newDoneRecipes.filter((recipe: any) => recipe.type === 'drink');
      state.update({ ...state, doneRecipes: drink });
    }
  }, [filter]);

  const handleShare = (type: string, id: string) => {
    const { location: { origin } } = window;
    const url = `${origin}/${type}s/${id}`;
    navigator.clipboard.writeText(url);
    setIsShared(`${id}`);
  };

  return { isShared, handleShare, doneRecipes, setFilter };
}

export default useDoneRecipes;
