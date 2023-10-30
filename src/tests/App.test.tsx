import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from '../helpers/renderWithRouter';
import Login from '../pages/Login/Login';
import App from '../App';
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
});

describe('Testes referentes à página Login.tsx', () => {
  const EMAIL_INPUT = 'email-input';
  const PASSWORD_INPUT = 'password-input';
  test('Verifica se o Heading e os Inputs existem na página', () => {
    renderWithRouter(<Login />);
    const heading = screen.getByRole('heading', { name: /login/i });
    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const buttonEnter = screen.getByRole('button', { name: /enter/i });

    expect(heading).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(buttonEnter).toBeInTheDocument();
    expect(buttonEnter).toBeDisabled();
  });

  test('Verifica a funcionalidade do botão ENTER, e a mudança de rota', async () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const buttonEnter = screen.getByRole('button', { name: /enter/i });
    expect(buttonEnter).toBeDisabled();
    await userEvent.type(emailInput, 'alguem@email.com');
    await userEvent.type(passwordInput, '12345678');
    expect(buttonEnter).toBeEnabled();
    await userEvent.click(buttonEnter);
    const headingRecipes = await screen.findByRole('heading', { name: /meals/i });
    expect(headingRecipes).toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
  });

  test('Botão está desabilitado caso o campo e-mail não atenda os requisitos', async () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const buttonEnter = screen.getByRole('button', { name: /enter/i });

    await userEvent.type(emailInput, 'alguem@emailcom');
    await userEvent.type(passwordInput, '12345678');
    await userEvent.click(buttonEnter);
    expect(buttonEnter).toBeDisabled();
  });

  test('Botão está desabilitado caso o campo password não atenda os requisitos', async () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const buttonEnter = screen.getByRole('button', { name: /enter/i });

    await userEvent.type(emailInput, 'alguememailcom');
    await userEvent.type(passwordInput, '1234');
    expect(buttonEnter).toBeDisabled();
  });
});
