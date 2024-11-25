import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import Register from '../Register';

describe('Register', () => {
  it('renders the registration form', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<Register />);
    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);
    // Further checks can be added depending on the form behavior
  });
});
