import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext'; // Adjust path as necessary
import LoginPage from './LoginPage'; // Adjust path as necessary
import * as authService from '../services/authService'; // To mock login function

// Mock the authService
vi.mock('../services/authService', () => ({
  login: vi.fn(),
}));

// Mock useNavigate from react-router-dom
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ state: null, pathname: '/login' }), // Mock useLocation as well
  };
});


describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    authService.login.mockResolvedValue({ user: { id: 1, name: 'Test User', email: 'test@example.com' } });
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders login form correctly', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('allows user to type into email and password fields', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@example.com');
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form with email and password and calls login service', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('redirects to dashboard on successful login', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    
    authService.login.mockResolvedValueOnce({ 
        user: { id: 1, name: 'Test User', email: 'test@example.com' }, 
        // Assuming a placeholder token or that token is handled via HttpOnly cookie
        // and loginContext in AuthProvider just needs user data.
    });

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
        // The navigation happens to `from` which defaults to `/dashboard`
        expect(mockedNavigate).toHaveBeenCalledWith("/dashboard", {"replace": true});
    });
  });

  it('displays error message on login failure', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    authService.login.mockRejectedValueOnce(new Error(errorMessage));

    await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
