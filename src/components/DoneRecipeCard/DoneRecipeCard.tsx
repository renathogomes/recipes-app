import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import useDoneRecipes from '../../hooks/useDoneRecipes';
import shareIcon from '../../images/shareIcon.svg';
import { GlobalContext } from '../../contexts/global.context';
import style from './DoneRecipeCard.module.css';

export default function DoneRecipeCard() {
  const navigate = useNavigate();

  const state = useContext(GlobalContext);
  const { doneRecipes } = state.state;

  const doneRecipesButtons = useDoneRecipes();
  const { handleShare, isShared } = doneRecipesButtons;

  const handleNavigate = (recipeId: string, type: string) => {
    navigate(`/${type}s/${recipeId}`);
  };

  return (
    <div>
      { doneRecipes?.map((recipe, index) => {
        const {
          category,
          image,
          name,
          type,
          nationality,
          alcoholicOrNot,
          id,
          doneDate } = recipe;
        return (
          <div key={ index } className={ style.container }>
            <button
              onClick={ () => handleNavigate(id, type) }
              className={ style.imgBtn }
            >
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ image }
                alt={ name }
                className={ style.recipeImg }
              />
            </button>
            <div className={ style.subContainer }>
              <button
                className={ style.navigateBtn }
                onClick={ () => handleNavigate(id, type) }
              >
                <h3 data-testid={ `${index}-horizontal-name` } className={ style.name }>
                  { name }
                </h3>
              </button>
              <button
                className={ style.btnShare }
                onClick={ () => handleShare(type, id) }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="share icon"
                />
                { isShared === id
                  && <span className={ style.spanShare }>Link copied!</span> }
              </button>
              <h4
                data-testid={ `${index}-horizontal-top-text` }
                className={ style.category }
              >
                { type === 'meal' ? `${nationality} - ${category}` : alcoholicOrNot }
              </h4>
              <h5
                data-testid={ `${index}-horizontal-done-date` }
                className={ style.date }
              >
                Done in: 23/06/2020
              </h5>
              <div className="tagContainer">
                {recipe.tags.map((tagName) => (
                  <span
                    key={ tagName }
                    data-testid={ `${index}-${tagName}-horizontal-tag` }
                    className={ style.tag }
                  >
                    {tagName}
                  </span>
                ))}
              </div>
            </div>
          </div>

        );
      })}
    </div>
  );
}
