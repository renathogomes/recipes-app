import { createContext, useState } from 'react';
import { GlobalContextState, GlobalContextType } from '../types/types';

export const CONTEXT_INITIAL_STATE: GlobalContextType = {
  state: {
    user: { email: '' },
    favoriteRecipes: [],
    finishedRecipes: [],
    inProgressRecipes: [],
    doneRecipes: [],
  },
  update: () => {},
};

export const GlobalContext = createContext(CONTEXT_INITIAL_STATE);

export function GlobalContextProvider({ value, children }: any) {
  const [innerState,
    setInnerState] = useState<GlobalContextType>({ ...CONTEXT_INITIAL_STATE, ...value });

  const updateState = (data: Partial<GlobalContextState>) => {
    setInnerState({
      ...innerState,
      ...{ state: {
        ...innerState.state,
        ...data,
      } },
    });
  };

  return (
    <GlobalContext.Provider value={ { ...innerState, update: updateState } }>
      {children}
    </GlobalContext.Provider>
  );
}
