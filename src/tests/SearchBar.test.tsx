/* eslint-disable no-restricted-globals */
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithRouter } from '../helpers/renderWithRouter';
import App from '../App';
import mockSearchMeal from './mocks/mockSearchMeal';
import { mockRecipeCategories } from './mocks/mockRecipesList';
import mockSearchDrink from './mocks/mockSearchDrink';

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => mockSearchMeal,
  })
    .mockResolvedValueOnce({
      json: async () => mockRecipeCategories,
    })
    .mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    });
  window.alert = vi.fn();
});

describe('Testando o componente SearchBar', async () => {
  const EXEC_SEARCH_BTN = 'exec-search-btn';
  const SEARCH_INPUT = 'search-input';
  const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
  const SHOW_SEARCH_BTN = 'search-top-btn';
  const FIRST_LETTER_SEARCH_RADIO = 'first-letter-search-radio';

  test('Verifica se a página contém um input de texto', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    const inputText = screen.getByTestId(SEARCH_INPUT);
    await userEvent.type(inputText, SEARCH_INPUT);
    expect(inputText).toBeInTheDocument();
  });

  test('Verifica se a página contém um botão', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    const button = screen.getByTestId(EXEC_SEARCH_BTN);
    expect(button).toBeInTheDocument();
  });

  test('Verifica se a página contém um input do tipo radio', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    const radio = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    expect(radio).toBeInTheDocument();
  });
  test('Verifica se o botão está habilitado caso o input esteja preenchido', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    const inputText = screen.getByTestId(SEARCH_INPUT);
    const button = screen.getByTestId(EXEC_SEARCH_BTN);
    await userEvent.type(inputText, 'teste');
    expect(button).toBeEnabled();
  });
  test('Verifica se o botão botão de busca dispara a busca', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    await userEvent.type(screen.getByTestId(SEARCH_INPUT), 'a');
    await userEvent.click(screen.getByTestId(EXEC_SEARCH_BTN));
    expect(global.fetch).toHaveBeenCalled();
    expect(screen.getByText('Corba')).toBeInTheDocument();
    expect(screen.getAllByTestId(/recipe-card/!)).toHaveLength(12);
  });
  test('Verifica se ao selecionar para buscar com a primeira letra e digitar mais de uma, emite um alerta e não gera a busca', async () => {
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    await userEvent.click(screen.getByTestId(FIRST_LETTER_SEARCH_RADIO));
    await userEvent.type(screen.getByTestId(SEARCH_INPUT), 'ab');
    await userEvent.click(screen.getByTestId(EXEC_SEARCH_BTN));
    // expect(global.fetch).toBeCalledTimes(1);
    expect(window.alert).toBeCalledTimes(1);
    expect(window.alert).toBeCalledWith('Your search must have only 1 (one) character');
  });
  test('Verifica se retorna uma mensagem de erro caso a busca não retorne resultados', async () => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ meals: null }),
    });
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    await userEvent.type(screen.getByTestId(SEARCH_INPUT), 'abasdqwd');
    await userEvent.click(screen.getByTestId(EXEC_SEARCH_BTN));
    expect(window.alert).toBeCalledTimes(1);
    expect(window.alert).toBeCalledWith('Sorry, we haven\'t found any recipes for these filters.');
  });
  test('Verifica se ao clicar em um card é redirecionado para a pagina correspondente', async () => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    })
      .mockResolvedValueOnce({
        json: async () => mockRecipeCategories,
      })
      .mockResolvedValueOnce({
        json: async () => mockSearchMeal,
      })
      .mockResolvedValueOnce({
        json: async () => mockSearchDrink,
      })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[9]] }),
      });
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    await userEvent.click(screen.getByTestId(FIRST_LETTER_SEARCH_RADIO));
    await userEvent.type(screen.getByTestId(SEARCH_INPUT), 'a');
    await userEvent.click(screen.getByTestId(EXEC_SEARCH_BTN));
    expect(global.fetch).toHaveBeenCalled();
    await userEvent.click(screen.getByText('Wontons'));
    expect(window.location.pathname).toBe('/meals/52948');
    expect(screen.getByText('Wontons')).toBeInTheDocument();
  });
  test('Verifica se ao pesquisar pelo nome exato, redireciona para a pagina da receita', async () => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    })
      .mockResolvedValueOnce({
        json: async () => mockRecipeCategories,
      })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      })
      .mockResolvedValueOnce({
        json: async () => mockSearchDrink,
      })
      .mockResolvedValueOnce({
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: '/meals' });
    await userEvent.click(screen.getByTestId(SHOW_SEARCH_BTN));
    await userEvent.type(screen.getByTestId(SEARCH_INPUT), 'Corba');
    await userEvent.click(screen.getByTestId(EXEC_SEARCH_BTN));
    expect(window.location.pathname).toBe(`/meals/${mockSearchMeal.meals[0].idMeal}`);
    expect(screen.getByTestId('share-btn')).toBeInTheDocument();
  });
});
