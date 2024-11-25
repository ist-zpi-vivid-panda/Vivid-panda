import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import Login from '../Login';

// Mockowanie `useRouter` z Next.js
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(), // Symulacja metody push
  }),
}));

// Mockowanie `constants/envVars`
jest.mock('../../../../constants/envVars', () => ({
  METHOD: 'mockMethod',
  IP_ADDRESS: 'mockIPAddress',
}));

describe('Login', () => {
  it('renderuje formularz logowania', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('obsługuje wysyłanie formularza', () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /Log in/i });
    fireEvent.click(loginButton);
    // Można dodać dodatkowe sprawdzenia
    expect(loginButton).toBeEnabled();
  });
});
