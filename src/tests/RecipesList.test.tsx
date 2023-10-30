import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from '../helpers/renderWithRouter';
import mockSearchMeal from './mocks/mockSearchMeal';
import { mockRecipeCategories } from './mocks/mockRecipesList';
import App from '../App';

afterEach(() => {
  vi.clearAllMocks();
});

const BEEF_FILTER = 'Beef-category-filter';

describe('Testes referentes ao componente RecipesList', async () => {
  test('Verificando se existe os botões de categoria', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    })
      .mockResolvedValueOnce({
        json: async () => mockRecipeCategories,
      });
    renderWithRouter(<App />, { route: '/meals' });
    await waitFor(() => {
      const categoryButton = screen.getByTestId(BEEF_FILTER);
      expect(categoryButton).toBeInTheDocument();
    });
  });

  test('Verifica se ao clicar no botão de categoria, a lista de receitas é filtrada', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => mockSearchMeal,
    })
      .mockResolvedValueOnce({
        json: async () => mockRecipeCategories,
      })
      .mockResolvedValueOnce({
        json: async () => mockSearchMeal,
      });
    renderWithRouter(<App />, { route: '/meals' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => { screen.getByTestId(BEEF_FILTER); });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    await userEvent.click(screen.getByTestId(BEEF_FILTER));
    expect(global.fetch).toHaveBeenCalledTimes(3);
    await waitFor(() => { expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(12); });
  });

  test('Verifica se ao clicar no botão all, a lista de receitas volta a forma original', async () => {
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
        json: async () => mockSearchMeal,
      });
    renderWithRouter(<App />, { route: '/meals' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => { screen.getByTestId(BEEF_FILTER); });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    await userEvent.click(screen.getByTestId(BEEF_FILTER));
    expect(global.fetch).toHaveBeenCalledTimes(3);
    await userEvent.click(screen.getByTestId('All-category-filter'));
    expect(global.fetch).toHaveBeenCalledTimes(4);
    await waitFor(() => { expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(12); });
  });

  test('Verifica se ao clicar no card de receita, o usuário é redirecionado para a página de detalhes', async () => {
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
        json: async () => ({ meals: [mockSearchMeal.meals[0]] }),
      });
    renderWithRouter(<App />, { route: '/meals' });
    await waitFor(async () => {
      const cardButton = screen.getByTestId('0-recipe-card');
      await userEvent.click(cardButton);
    });
    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(screen.getByTestId('recipe-title')).toHaveTextContent('Corba');
  });
});
