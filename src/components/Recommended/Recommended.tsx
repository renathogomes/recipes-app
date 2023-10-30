import { useEffect, useState } from 'react';
import { Recipe, RecipeScope } from '../../types/recipe';
import { FoodService } from '../../services/services';
import style from './Recommended.module.css';

type DetailsRecipe = {
  type: RecipeScope
};

export function Recommended({ type }: DetailsRecipe) {
  const [data, setData] = useState<Recipe[]>([]);
  useEffect(() => {
    const getRecommended = async () => {
      const item = FoodService(type === 'meals' ? 'drinks' : 'meals');
      const searchRecommended = await item.recommended();
      setData(searchRecommended);
    };
    getRecommended();
  }, []);

  return (
    <div>
      <div
        id="carouselDrinks"
        className={ style.carousel }
      >
        { type === 'meals' ? (
          data.slice(0, 6).map((drink, index) => (
            <article
              className={ style.card }
              key={ index }
            >
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrinkThumb }
                className={ style.image }
                data-testid={ `${index}-recommendation-card` }
              />
              <span
                className={ style.title }
                data-testid={ `${index}-recommendation-title` }
              >
                { drink.strDrink }
                {' - '}
                { drink.strAlcoholic }
              </span>
            </article>
          ))) : (
          data.slice(0, 6).map((meal, index) => (
            <article
              className={ style.card }
              key={ index }
            >
              <img
                src={ meal.strMealThumb }
                alt={ meal.strMealThumb }
                className={ style.image }
                data-testid={ `${index}-recommendation-card` }
              />
              <span
                className={ style.title }
                data-testid={ `${index}-recommendation-title` }
              >
                { meal.strMeal }
                {' - '}
                { meal.strArea }
              </span>
            </article>
          ))) }
      </div>
    </div>
  );
}
