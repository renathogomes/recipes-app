import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../helpers/renderWithRouter';
import mockSearchMeal from './mocks/mockSearchMeal';
import App from '../App';
import mockSearchDrink from './mocks/mockSearchDrink';

const CORBA_IMG = 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg';

const EXPECTED_FAV = [
  {
    id: '52977',
    type: 'meal',
    nationality: '',
    category: 'Dessert',
    alcoholicOrNot: '',
    name: 'Corba',
    image: CORBA_IMG,
  },
];

const EXPECTED_FAV_DRINK = [
  {
    id: '15997',
    type: 'drink',
    nationality: '',
    category: 'Ordinary Drink',
    alcoholicOrNot: 'Optional alcohol',
    name: 'GG',
    image: CORBA_IMG,
  },
];

const MOCK_FAV = [
  EXPECTED_FAV[0],
  {
    id: '53060',
    type: 'meal',
    nationality: '',
    category: 'Dessert',
    alcoholicOrNot: '',
    name: 'Burek',
    image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
  },
];

const MOCK_DRINK = {
  drinks: [
    {
      strDrink: 'GG',
      idDrink: '15997',
      strDrinkThumb: CORBA_IMG,
      strCategory: 'Ordinary Drink',
      strIngredient1: 'Galliano',
      strMeasure1: '2 1/2 shots ',
      strInstructions: 'Mix. Serve over ice.',
      strYoutube: 'https://www.youtube.com/watch?v=6LjFJvzSPIo',
      strAlcoholic: 'Optional alcohol',
    },
  ],
};

const MEAL_ROUTE = '/meals/52977';
const FAVORITE_BTN = 'favorite-btn';

describe('Testes referentes ao componente RecipesDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se o Card é gerado com as informaçoes corretas', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchDrink,
    })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: MEAL_ROUTE });
    expect(global.fetch).toBeCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('recipe-title')).toHaveTextContent('Corba'));
    expect(screen.getByTestId('recipe-category')).toHaveTextContent('Dessert');
    expect(screen.getByTestId('recipe-photo')).toHaveAttribute('src', CORBA_IMG);
  });

  test('Verifica se gera o Card de forma correta ao receber uma bebida', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    }).mockResolvedValueOnce({
      json: async () => MOCK_DRINK,
    });
    renderWithRouter(<App />, { route: '/drinks/15997' });
    expect(global.fetch).toBeCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('recipe-title')).toHaveTextContent('GG'));
  });

  test('Verifica se ao clicar em compartilhar o link da pagina é copiado para o clipboard', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchDrink,
    })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: MEAL_ROUTE });
    expect(global.fetch).toBeCalledTimes(2);
    await userEvent.click(screen.getByTestId('share-btn'));
    const pastedText = await navigator.clipboard.readText();
    expect(pastedText).toBe('http://localhost:3000/meals/52977');
  });

  test('Verifica se ao clicar no botão de favoritar a receita é adicionada ao localstorage, e se ela ja existir é removida', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchDrink,
    })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: MEAL_ROUTE });
    expect(global.fetch).toBeCalledTimes(2);
    expect(window.localStorage.getItem('favoriteRecipes')).toBe(null);
    await userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(window.localStorage.getItem('favoriteRecipes')).toBe(JSON.stringify(EXPECTED_FAV));
    await userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(window.localStorage.getItem('favoriteRecipes')).toBe('[]');
  });

  test('Verifica se ao existir duas receitas como favoritas e remover uma, a outra permanece', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchDrink,
    })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: MEAL_ROUTE });
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV));
    await userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(window.localStorage.getItem('favoriteRecipes')).toBe(JSON.stringify([MOCK_FAV[1]]));
  });

  test('Verifica se é possivel favoritar um drink', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    }).mockResolvedValueOnce({
      json: async () => MOCK_DRINK,
    });
    renderWithRouter(<App />, { route: '/drinks/15997' });
    expect(global.fetch).toBeCalledTimes(2);
    window.localStorage.removeItem('favoriteRecipes');
    expect(window.localStorage.getItem('favoriteRecipes')).toBe(null);
    await userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(window.localStorage.getItem('favoriteRecipes')).toBe(JSON.stringify([EXPECTED_FAV_DRINK[0]]));
  });
  test('Verifica se é redirecionado ao clicar em Start Recipe', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    }).mockResolvedValueOnce({
      json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
    }).mockResolvedValueOnce({
      json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
    });
    renderWithRouter(<App />, { route: '/meals/52977' });
    expect(global.fetch).toBeCalledTimes(2);
    await userEvent.click(screen.getByTestId('start-recipe-btn'));
    expect(global.fetch).toBeCalledTimes(3);
    expect(window.location.pathname).toBe(`/meals/${mockSearchMeal.meals[0].idMeal}/in-progress`);
  });
});
