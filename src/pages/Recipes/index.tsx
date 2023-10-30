import Header from '../../components/Header';
import RecipesList from '../../components/RecipesList/RecipesList';
import SearchBar from '../../components/SearchBar';
import { CONTEXT_INITIAL_STATE,
  RecipeContextProvider } from '../../contexts/recipes.context';
import { capitalize } from '../../helpers/capitalize';
import { RecipeScope } from '../../types/recipe';

export type RecipesProps = {
  scope: RecipeScope;
};

function Recipes({ scope }: RecipesProps) {
  return (
    <RecipeContextProvider
      value={ {
        ...CONTEXT_INITIAL_STATE,
        ...{ state: {
          ...CONTEXT_INITIAL_STATE.state,
          scope,
        } },
      } }
    >
      <Header pageTitle={ capitalize(scope) } />
      <RecipesList />
    </RecipeContextProvider>
  );
}

export default Recipes;
