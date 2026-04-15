import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /КлиентХаб/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toBeDefined();
    expect(screen.getByText(/Вход в систему/i)).toBeDefined();
  });

  it('shows registration form when toggled', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByText(/Нет аккаунта/i);
    expect(toggleButton).toBeDefined();
  });
});
