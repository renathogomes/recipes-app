import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import favoriteIcon from '../../images/blackHeartIcon.svg';
import useFavorites from '../../hooks/useFavorites';
import { GlobalContext } from '../../contexts/global.context';
import style from './FavoriteCard.module.css';
import { Footer } from '../Footer/Footer';

export default function FavoriteCard() {
  const navigate = useNavigate();

  const state = useContext(GlobalContext);
  const { favoriteRecipes } = state.state;

  const favoriteButtons = useFavorites();
  const { handleShare, isShared, handleUnfavorite } = favoriteButtons;

  const handleNavigate = (recipeId: string, type: string) => {
    navigate(`/${type}s/${recipeId}`);
  };

  return (
    <div>
      { favoriteRecipes?.map((recipe, index) => {
        const { category, image, name, type, nationality, alcoholicOrNot, id } = recipe;
        return (
          <div key={ index } className={ style.container }>
            <button
              className={ style.navigateBtn }
              onClick={ () => handleNavigate(id, type) }
            >
              <img
                className={ style.recipeImg }
                data-testid={ `${index}-horizontal-image` }
                src={ image }
                alt={ name }
              />
            </button>
            <div className={ style.subContainer }>
              <button
                className={ style.navigateBtn }
                onClick={ () => handleNavigate(id, type) }
              >
                <h3
                  data-testid={ `${index}-horizontal-name` }
                  className={ style.name }
                >
                  { name }
                </h3>
              </button>
              <h4
                data-testid={ `${index}-horizontal-top-text` }
                className={ style.category }
              >
                { type === 'meal' ? `${nationality} - ${category}` : alcoholicOrNot }
              </h4>
              <button
                onClick={ () => handleShare(type, id) }
                className={ style.btnShare }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="share icon"
                />
                { isShared === id && <span>Link copied!</span> }
              </button>
              <button
                onClick={ () => handleUnfavorite(id) }
                className={ style.btnFav }
              >
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  src={ favoriteIcon }
                  alt="favorite icon"
                />
              </button>
            </div>
          </div>
        );
      }) }
    </div>
  );
}
