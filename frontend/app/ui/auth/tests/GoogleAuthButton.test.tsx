import { render, screen } from '@testing-library/react';
import GoogleAuthButton from '../GoogleAuthButton';

jest.mock('../../../../constants/envVars', () => ({
    METHOD: 'mockMethod',
    IP_ADDRESS: 'mockIPAddress',
}));

describe('GoogleAuthButton', () => {
    it('renders correctly', () => {
        render(<GoogleAuthButton />);
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });
});
