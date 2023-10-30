import { Recipe } from './recipe';

export type User = {
  email: string;
};
export type GlobalContextType = {
  state: GlobalContextState,
  update: (data: Partial<GlobalContextState>) => void;
};
export type GlobalContextState = {
  user: User;
  favoriteRecipes: Favorite[];
  finishedRecipes: Recipe[];
  inProgressRecipes: Recipe[];
  doneRecipes: DoneRecipe[];
};

export type DoneRecipe = {
  id: string,
  type: string,
  nationality: string,
  category: string
  alcoholicOrNot: string,
  name: string,
  image: string,
  doneDate: string,
  tags: string[],
};
export type Favorite = {
  id: string;
  type: string;
  nationality: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
};
