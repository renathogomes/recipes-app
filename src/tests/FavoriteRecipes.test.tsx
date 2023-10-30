import { screen } from '@testing-library/react';
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

const MOCK_FAV_WITH_DRINK = [
  EXPECTED_FAV_DRINK[0],
  EXPECTED_FAV[0],
  MOCK_FAV[1],
];

const FAVORITE_RECIPES = 'favorite-recipes';
const FIRST_CARD_NAME_TEST_ID = '0-horizontal-name';

describe('Testes referentes ao componente RecipesDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se ao abrir a pagina sem nenhuma receita favoritada ele não renderiza nenhuma card', async () => {
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    expect(screen.queryByTestId(FIRST_CARD_NAME_TEST_ID)).not.toBeInTheDocument();
  });

  test('Verifica se ao abrir a pagina com uma receita favoritada ele renderiza um card', async () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(2);
    expect(screen.getByTestId(FIRST_CARD_NAME_TEST_ID)).toHaveTextContent('Corba');
  });

  test('Verifica se renderiza as informações corretas para comida e drink', async () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV_WITH_DRINK));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(3);
    expect(screen.getByTestId(FIRST_CARD_NAME_TEST_ID)).toHaveTextContent('GG');
    expect(screen.getByTestId('1-horizontal-name')).toHaveTextContent('Corba');
    expect(screen.getByTestId('0-horizontal-top-text')).toHaveTextContent('Optional alcohol');
    expect(screen.getByTestId('1-horizontal-top-text')).toHaveTextContent('- Dessert');
  });

  test('Verifica se ao clicar nos botões de filto as receitas são filtradas', async () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV_WITH_DRINK));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(3);
    await userEvent.click(screen.getByTestId('filter-by-meal-btn'));
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(2);
    expect(screen.queryByText('GG')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('filter-by-drink-btn'));
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(1);
    expect(screen.queryByText('GG')).toBeInTheDocument();
    expect(screen.queryByText('Corba')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('filter-by-all-btn'));
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(3);
    expect(screen.queryByText('GG')).toBeInTheDocument();
    expect(screen.queryByText('Corba')).toBeInTheDocument();
  });

  test('Verifica se ao desfavoritar uma receita ela é removida da pagina', async () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(2);
    await userEvent.click(screen.getAllByTestId(/horizontal-favorite-btn/i)[0]);
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(1);
    expect(screen.getByTestId(FIRST_CARD_NAME_TEST_ID)).toHaveTextContent('Burek');
  });

  test('Verifica se ao clicar no botão de compartilhar ele copia o link da pagina', async () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    await userEvent.click(screen.getByTestId(/0-horizontal-share-btn/i));
    const pastedText = await navigator.clipboard.readText();
    expect(pastedText).toBe('http://localhost:3000/meals/52977');
    expect(screen.getByText('Link copied!')).toBeInTheDocument();
  });

  test('Verifica se ao clicar na imagem ele redireciona para a pagina de detalhes', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchDrink,
    })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    window.localStorage.setItem('favoriteRecipes', JSON.stringify(MOCK_FAV));
    renderWithRouter(<App />, { route: FAVORITE_RECIPES });
    await userEvent.click(screen.getByTestId(/0-horizontal-image/i));
    expect(screen.getByTestId('recipe-title')).toHaveTextContent('Corba');
  });
});
