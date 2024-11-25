import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';

// Мокаем `useRouter` из Next.js
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(), // Имитация метода push
  }),
}));

// Мокаем `constants/envVars`
jest.mock('../../../../constants/envVars', () => ({
  METHOD: 'mockMethod',
  IP_ADDRESS: 'mockIPAddress',
}));

describe('Login', () => {
  it('рендерит форму входа', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('обрабатывает отправку формы', () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /Log in/i });
    fireEvent.click(loginButton);
    // Можно добавить дополнительные проверки
    expect(loginButton).toBeEnabled();
  });
});
