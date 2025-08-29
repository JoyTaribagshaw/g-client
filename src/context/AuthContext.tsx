import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement token validation with your backend
        const token = localStorage.getItem('token');
        if (token) {
          // TODO: Fetch user data using the token
          // const userData = await fetchUserData(token);
          // setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement login API call
      // const response = await loginUser(email, password);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // setUser(user);
      // navigate('/dashboard');
      
      // Mock response for now
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockUser = { id: '1', email, name: 'Admin User' };
          localStorage.setItem('token', 'mock-jwt-token');
          setUser(mockUser);
          navigate('/dashboard');
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (_userData: RegisterData) => {
    try {
      setIsLoading(true);
      // TODO: Implement registration API call
      // const response = await registerUser(userData);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // setUser(user);
      // navigate('/verify-otp');
      
      // Mock response for now
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          navigate('/verify-otp');
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (_otp: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement OTP verification API call
      // const response = await verifyOtpApi(otp);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // setUser(user);
      // navigate('/dashboard');
      
      // Mock response for now
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const mockUser = { id: '1', email: 'user@example.com', name: 'Admin User' };
          localStorage.setItem('token', 'mock-jwt-token');
          setUser(mockUser);
          navigate('/dashboard');
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (_email: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement forgot password API call
      // await forgotPasswordApi(email);
      
      // Mock response for now
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (_token: string, _newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // TODO: Implement reset password API call
      // const response = await api.post('/auth/reset-password', { token, newPassword });
      
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement resend OTP API call
      // await resendOtpApi(email);
      
      // Mock response for now
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log(`OTP resent to ${email}`);
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
