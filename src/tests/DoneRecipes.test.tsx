import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../helpers/renderWithRouter';
import App from '../App';
import mockSearchDrink from './mocks/mockSearchDrink';
import mockSearchMeal from './mocks/mockSearchMeal';

const MOCK_DONE_RECIPES = [
  {
    id: '52977',
    type: 'meal',
    nationality: '',
    category: 'Dessert',
    alcoholicOrNot: '',
    name: 'Corba',
    image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    doneDate: '2023-08-28T20:37:12.755Z',
    tags: ['Soup'],
  },
  {
    id: '52785',
    type: 'meal',
    nationality: 'Indian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Dal fry',
    image: 'https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg',
    doneDate: '2023-08-28T20:37:58.720Z',
    tags: ['Curry', 'Vegetarian', 'Cake'],
  },
  {
    id: '15997',
    type: 'drink',
    nationality: '',
    category: 'Ordinary Drink',
    alcoholicOrNot: 'Optional alcohol',
    name: 'GG',
    image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
    doneDate: '2023-08-28T20:45:06.706Z',
    tags: [],
  },
];

const DONE_RECIPES = 'done-recipes';
const FIRST_CARD_NAME_TEST_ID = '0-horizontal-name';

describe('Testes referentes ao componente DoneRecipes', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se ao abrir a pagina sem nenhuma receita concluída ele não renderiza nenhuma card', async () => {
    renderWithRouter(<App />, { route: DONE_RECIPES });
    expect(screen.queryByTestId(FIRST_CARD_NAME_TEST_ID)).not.toBeInTheDocument();
  });

  test('Verifica se ao abrir a pagina com uma receita concluída ele renderiza um card', async () => {
    window.localStorage.clear();
    window.localStorage.setItem('doneRecipes', JSON.stringify(MOCK_DONE_RECIPES));
    renderWithRouter(<App />, { route: DONE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(3);
    expect(screen.getByTestId(FIRST_CARD_NAME_TEST_ID)).toHaveTextContent('Corba');
  });

  test('Verifica se renderiza as informações corretas para comida e drink', async () => {
    window.localStorage.clear();
    window.localStorage.setItem('doneRecipes', JSON.stringify(MOCK_DONE_RECIPES));
    renderWithRouter(<App />, { route: DONE_RECIPES });
    expect(screen.getAllByTestId(/horizontal-name/i)).toHaveLength(3);
    expect(screen.getByTestId(FIRST_CARD_NAME_TEST_ID)).toHaveTextContent('Corba');
    expect(screen.getByTestId('1-horizontal-name')).toHaveTextContent('Dal fry');
    expect(screen.getByTestId('2-horizontal-top-text')).toHaveTextContent('Optional alcohol');
    expect(screen.getByTestId('1-horizontal-top-text')).toHaveTextContent('Indian - Vegetarian');
  });

  test('Verifica se ao clicar nos botões de filto as receitas são filtradas', async () => {
    window.localStorage.clear();
    window.localStorage.setItem('doneRecipes', JSON.stringify(MOCK_DONE_RECIPES));
    renderWithRouter(<App />, { route: DONE_RECIPES });
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

  test('Verifica se ao clicar no botão de compartilhar ele copia o link da pagina', async () => {
    window.localStorage.clear();
    window.localStorage.setItem('doneRecipes', JSON.stringify(MOCK_DONE_RECIPES));
    renderWithRouter(<App />, { route: DONE_RECIPES });
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
    window.localStorage.clear();
    window.localStorage.setItem('doneRecipes', JSON.stringify(MOCK_DONE_RECIPES));
    renderWithRouter(<App />, { route: DONE_RECIPES });
    const teste = screen.getByTestId(/0-horizontal-image/i);
    await userEvent.click(teste);
    await screen.findByText('Corba');
    expect(screen.getByTestId('recipe-title')).toHaveTextContent('Corba');
  });
});
