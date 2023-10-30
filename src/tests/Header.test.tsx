import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from './helpers/renderWith';
import App from '../App';
import { mockRecipeCategories } from './mocks/mockRecipesList';
import mockSearchMeal from './mocks/mockSearchMeal';

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: async () => mockSearchMeal,
  }).mockResolvedValueOnce({
    json: async () => mockRecipeCategories,
  });
  window.alert = vi.fn();
});

test('verificar se o componente Header é renderizado corretamente conforme os argumentos passados', () => {
  renderWithRouter(<App />, { initialEntries: ['/meals'] });

  const header = screen.getByTestId('page-title');
  const button = screen.getByRole('button', { name: /meal icon recipes app/i });

  expect(button).toBeInTheDocument();
  expect(header).toHaveTextContent('Meals');
  expect(screen.getByTestId('search-top-btn')).toBeInTheDocument();
});

test('verificar se ao clilcar no botão de perfil, a rota muda para a página de perfil', async () => {
  renderWithRouter(<App />, { initialEntries: ['/meals'] });

  const profileButton = screen.getByTestId('profile-top-btn');

  await userEvent.click(profileButton);
  expect(screen.getByText('Profile')).toBeInTheDocument();
});

test('verificar se ao clicar no botão de pesquisa, a barra de pesquisa aparece', async () => {
  renderWithRouter(<App />, { initialEntries: ['/meals'] });

  const searchButton = screen.getByTestId('search-top-btn');

  await userEvent.click(searchButton);

  const searchbarElement = screen.getByRole('textbox');
  expect(screen.getByTestId('search-input')).toBeInTheDocument();
  expect(searchbarElement).toBeInTheDocument();

  await userEvent.click(searchButton);
  expect(searchbarElement).not.toBeInTheDocument();
});
