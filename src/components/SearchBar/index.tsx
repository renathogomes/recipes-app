import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeContext } from '../../contexts/recipes.context';
import { FoodService } from '../../services/services';
import { Recipe, RecipeSearchParams } from '../../types/recipe';
import style from './SearchBar.module.css';

export default function SearchInput() {
  const INITIAL_SEARCH_STATE: RecipeSearchParams = {
    type: 's',
    term: '',
  };

  const { state, update } = useContext(RecipeContext);

  const [searchParams,
    setSearchParams] = useState<RecipeSearchParams>(INITIAL_SEARCH_STATE);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleClick = async () => {
    if (searchParams.type === 'f' && searchParams.term.length > 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }

    let result = await FoodService(state.scope)
      .search(searchParams.type, searchParams.term) as Recipe[];

    if (result.length > 12) {
      result = result.slice(0, 12);
    }

    update({
      ...state,
      searchParams,
      recipes: result,
    });

    if (result.length === 0) {
      window.alert('Sorry, we haven\'t found any recipes for these filters.');
      return;
    }

    if (result.length === 1) {
      const { idMeal, idDrink } = result[0];
      navigate(`/${state.scope}/${idMeal || idDrink}`);
    }
  };

  return (
    <div className={ style.searchContainer }>
      <input
        id="term"
        value={ searchParams.term }
        data-testid="search-input"
        type="text"
        placeholder="Buscar Receita"
        onChange={ handleChange }
        className={ style.inputSearch }
      />
      <div>
        <div className={ style.radioInputs }>
          <label>
            <input
              checked={ searchParams.type === 'i' }
              type="radio"
              id="type"
              name="search"
              value="i"
              data-testid="ingredient-search-radio"
              onChange={ handleChange }
            />
            Ingredient
          </label>
          <label>
            <input
              checked={ searchParams.type === 's' }
              type="radio"
              id="type"
              name="search"
              value="s"
              data-testid="name-search-radio"
              onChange={ handleChange }
            />
            Name
          </label>
          <label>
            <input
              checked={ searchParams.type === 'f' }
              type="radio"
              id="type"
              name="search"
              value="f"
              data-testid="first-letter-search-radio"
              onChange={ handleChange }
            />
            First letter
          </label>
        </div>
        <button
          type="button"
          data-testid="exec-search-btn"
          onClick={ handleClick }
          className={ style.btnComponent }
        >
          Search
        </button>
      </div>
    </div>

  );
}
