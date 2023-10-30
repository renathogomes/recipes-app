import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from './helpers/renderWith';
import App from '../App';
import { Footer } from '../components/Footer/Footer';
import { mockRecipeCategories } from './mocks/mockRecipesList';
import mockSearchMeal from './mocks/mockSearchMeal';

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => mockSearchMeal,
  })
    .mockResolvedValueOnce({
      json: async () => mockRecipeCategories,
    });
  window.alert = vi.fn();
});

test('verificar se os botões de drinks e meals estão sendo renderizados', () => {
  renderWithRouter(<Footer />);

  const drinksButton = screen.getByTestId('drinks-bottom-btn');
  const mealsButton = screen.getByTestId('meals-bottom-btn');

  expect(drinksButton).toBeInTheDocument();
  expect(mealsButton).toBeInTheDocument();
});

test('verificar se ao clicar no botão de drinks, a rota muda para a página de drinks', async () => {
  renderWithRouter(<App />, { initialEntries: ['/meals'] });

  const drinksButton = screen.getByTestId('drinks-bottom-btn');

  expect(screen.getByText(/Meals/i)).toBeInTheDocument();

  await userEvent.click(drinksButton);

  expect(screen.getByText(/Drinks/i)).toBeInTheDocument();
});
test('verificar se ao clicar no botão de meals, a rota muda para a página de meals', async () => {
  renderWithRouter(<App />, { initialEntries: ['/drinks'] });

  const mealsButton = screen.getByTestId('meals-bottom-btn');

  expect(screen.getByText(/Drinks/i)).toBeInTheDocument();

  await userEvent.click(mealsButton);

  expect(screen.getByText(/Meals/i)).toBeInTheDocument();
});
