import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeContext } from '../../contexts/recipes.context';
import { FoodService } from '../../services/services';
import { Category, Recipe } from '../../types/recipe';
import style from './RecipesList.module.css';

function RecipesList() {
  const { state, update } = useContext(RecipeContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<Category | null>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const loadDefault = async () => {
      let recipes = await FoodService(state.scope)
        .search('s', '') as Recipe[];

      if (recipes.length > 12) {
        recipes = recipes.slice(0, 12);
      }
      let categoriesTemp = await FoodService(state.scope)
        .getCategories();
      if (categoriesTemp.length > 5) {
        categoriesTemp = categoriesTemp.slice(0, 5);
      }
      setCategories(categoriesTemp);
      update({ ...state, recipes });
    };
    loadDefault();
  }, []);

  const cardClick = (recipe: Recipe) => {
    navigate(`/${state.scope}/${recipe.idMeal || recipe.idDrink}`);
  };

  const selectCategory = (category?: Category) => {
    const newCategory = category?.strCategory === filterCategory?.strCategory
      ? null : category;
    setFilterCategory(newCategory || null);
  };

  useEffect(() => {
    const filterByCategory = async () => {
      if (filterCategory) {
        let recipes = await FoodService(state.scope)
          .getByCategory(filterCategory.strCategory);
        if (recipes.length > 12) {
          recipes = recipes.slice(0, 12);
        }
        update({ ...state, recipes });
        return;
      }
      if (!isFirstRender) {
        let recipes = await FoodService(state.scope)
          .search('s', '') as Recipe[];

        if (recipes.length > 12) {
          recipes = recipes.slice(0, 12);
        }
        update({ ...state, recipes });
      }
      setIsFirstRender(false);
    };
    filterByCategory();
  }, [filterCategory]);

  return (
    <div>
      <div className={ style.btnIconsContainer }>
        { categories.map((category) => (
          <div key={ category.strCategory } className={ style.btnContainer }>
            <button
              key={ category.strCategory }
              data-testid={ `${category.strCategory}-category-filter` }
              onClick={ () => selectCategory(category) }
              className={ style.btnIcons }
            >
              <img
                src={ category.strCategory === 'Other / Unknown'
                  ? 'src/icons/Other.svg' : `src/icons/${category.strCategory}.svg` }
                alt=""
                className={ `bodyIcons i${category.strCategory}` }
                style={ { width: '46px', height: '46px' } }
              />
            </button>
            <span className={ style.subtitle }>{category.strCategory}</span>
          </div>
        )) }
        <button
          data-testid="All-category-filter"
          onClick={ () => selectCategory() }
          className={ style.btnIconsAll }
        >
          <img
            src={ `src/images/${state.scope}All.svg` }
            alt=""
            className={ style.bodyIcons }
          />
          <span className={ style.subtitle }>All</span>
        </button>
      </div>
      <div className={ style.cardContainer }>
        { state.recipes.map((recipe, index) => (
          <div
            key={ recipe.idDrink || recipe.idMeal }
            className={ style.cardContainer }
          >
            <button
              onClick={ () => cardClick(recipe) }
              className={ style.card }
              data-testid={ `${index}-recipe-card` }
            >
              <img
                className={ style.thumbnail }
                src={ recipe.strDrinkThumb || recipe.strMealThumb }
                alt={ recipe.strDrink || recipe.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <div className={ style.name } data-testid={ `${index}-card-name` }>
                { recipe.strDrink || recipe.strMeal }
              </div>
            </button>
          </div>
        )) }
      </div>
    </div>
  );
}

export default RecipesList;
