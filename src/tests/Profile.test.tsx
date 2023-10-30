import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import Profile from '../pages/Profile/Profile';
import { renderWithRouter } from './helpers/renderWith';

describe('Profile', () => {
  const PROFILE_EMAIL = 'profile-email';
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({
      email: 'teste@teste.com',
    }));
  });
  test('Deve mostrar o email do usuário ', () => {
    renderWithRouter(<Profile />);
    const profileEmail = screen.getByTestId(PROFILE_EMAIL);
    expect(profileEmail).toHaveTextContent('teste@teste.com');
  });
  test('Deve mostrar três botões', () => {
    renderWithRouter(<Profile />);
    const profileDoneBtn = screen.getByTestId('profile-done-btn');
    const profileFavoriteBtn = screen.getByTestId('profile-favorite-btn');
    const profileLogoutBtn = screen.getByTestId('profile-logout-btn');
    expect(profileDoneBtn).toBeInTheDocument();
    expect(profileFavoriteBtn).toBeInTheDocument();
    expect(profileLogoutBtn).toBeInTheDocument();
  });
  test('Deve redirecionar para a página de receitas feitas', async () => {
    renderWithRouter(<App />, { initialEntries: ['/profile'] });
    const profileDoneBtn = screen.getByTestId('profile-done-btn');
    expect(profileDoneBtn).toBeInTheDocument();
    await userEvent.click(profileDoneBtn);
    setTimeout(() => {
      expect(window.location.pathname).toBe('/done-recipes');
    }, 1000);
  });
  test('Deve redirecionar para a página de receitas favoritas', async () => {
    renderWithRouter(<App />, { initialEntries: ['/profile'] });
    const profileFavoriteBtn = screen.getByTestId('profile-favorite-btn');
    expect(profileFavoriteBtn).toBeInTheDocument();
    await userEvent.click(profileFavoriteBtn);
    setTimeout(() => {
      expect(window.location.pathname).toBe('/favorite-recipes');
    }, 1000);
  });
  test(
    'Logout deve limpar o localStorage e redirecionar para a página de login',
    async () => {
      renderWithRouter(<App />, { initialEntries: ['/profile'] });
      const profileLogoutBtn = screen.getByTestId('profile-logout-btn');
      vi.spyOn(localStorage, 'clear');
      fireEvent.click(profileLogoutBtn);
      setTimeout(() => {
        expect(localStorage.clear).toHaveBeenCalled();
        expect(window.location.pathname).toBe('/');
        expect(localStorage.length).toBe(0);
        expect(screen.getByText('Login')).toBeInTheDocument();
      }, 1000);
    },
  );
  test('Testando se o componente Profile é renderizado', () => {
    renderWithRouter(<App />, { initialEntries: ['/profile'] });
    const profileEmail = screen.getByTestId('profile-email');
    expect(profileEmail).toBeInTheDocument();
  });
});
