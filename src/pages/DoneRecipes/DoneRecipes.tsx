import useDoneRecipes from '../../hooks/useDoneRecipes';
import Header from '../../components/Header';
import DoneRecipeCard from '../../components/DoneRecipeCard/DoneRecipeCard';
import style from './DoneRecipes.module.css';

export default function DoneRecipes() {
  const doneRecipeButtons = useDoneRecipes();
  const { setFilter } = doneRecipeButtons;

  return (
    <>
      <Header
        pageTitle="Done Recipes"
        searchIcon={ false }
      />
      <div className={ style.btnIconsContainer }>
        <div className={ style.btnContainer }>
          <button
            onClick={ () => setFilter('all') }
            data-testid="filter-by-all-btn"
            className={ style.btnIcons }
          >
            <img
              src="src/images/all.svg"
              alt=""
              className={ style.bodyIcons }
            />
            <span className={ style.subtitle }>All</span>
          </button>
          <button
            onClick={ () => setFilter('meal') }
            data-testid="filter-by-meal-btn"
            className={ style.btnIcons }
          >
            <img
              src="src/images/mealsAll.svg"
              alt=""
              className={ style.bodyIcons }
            />
            <span className={ style.subtitle }>Food</span>
          </button>
          <button
            onClick={ () => setFilter('drink') }
            data-testid="filter-by-drink-btn"
            className={ style.btnIcons }
          >
            <img
              src="src/images/drinksAll.svg"
              alt=""
              className={ style.bodyIcons }
            />
            <span className={ style.subtitle }>Drinks</span>
          </button>
        </div>
      </div>
      <DoneRecipeCard />
    </>
  );
}
