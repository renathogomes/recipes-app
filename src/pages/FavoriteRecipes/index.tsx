import Header from '../../components/Header';
import FavoriteCard from '../../components/FavoriteCard/FavoriteCard';
import useFavorites from '../../hooks/useFavorites';
import style from './Favorites.module.css';
import { Footer } from '../../components/Footer/Footer';

export default function FavoriteRecipes() {
  const favoriteButtons = useFavorites();
  const { setFilter } = favoriteButtons;

  return (
    <>
      <Header
        pageTitle="Favorite Recipes"
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
      <FavoriteCard />
      <Footer />
    </>
  );
}
