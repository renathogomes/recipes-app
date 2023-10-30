import { createContext, useState } from 'react';
import { RecipeContextState, RecipeContextType } from '../types/recipe';

export const CONTEXT_INITIAL_STATE: RecipeContextType = {
  state: {
    scope: 'meals',
    searchParams: {
      term: '',
      type: 's',
    },
    recipes: [],
  },
  update: () => {},
};

export const RecipeContext = createContext(CONTEXT_INITIAL_STATE);

export function RecipeContextProvider({ value, children }: any) {
  const [innerState,
    setInnerState] = useState<RecipeContextType>({ ...CONTEXT_INITIAL_STATE, ...value });

  const updateState = (data: Partial<RecipeContextState>) => {
    setInnerState({
      ...innerState,
      ...{ state: {
        ...innerState.state,
        ...data,
      } },
    });
  };

  return (
    <RecipeContext.Provider value={ { ...innerState, update: updateState } }>
      {children}
    </RecipeContext.Provider>
  );
}
