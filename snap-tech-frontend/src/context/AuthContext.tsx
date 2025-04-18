// context/AuthContext.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { RegisterData, User } from '@/lib/types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Initialize axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          toast.error('Session expired', {
            description: 'Please login again',
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get(`${apiUrl}/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/register`, data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Registration successful', {
        description: 'Your account has been created',
      });
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      if (axios.isAxiosError(error) ){
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, redirectCallback?: () => void) => {
    try {
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      await loadUser();
      if (redirectCallback) {
        redirectCallback();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'Could not complete login process',
      });
    }
  };

  const logout = async (redirectCallback?: () => void) => {
    try {
      await axios.post(`${apiUrl}/logout`);
      localStorage.removeItem('token');
      setUser(null);
      if (redirectCallback) {
        redirectCallback();
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      setUser(null);
      toast.error('Logout completed', {
        description: 'You were logged out, but the server request failed',
      });
    }
  };

  const hasRole = (role: string) => {
    return user?.roles.includes(role) || false;
  };

  const isAdmin = () => hasRole('admin');

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isAuthenticated: !!user,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
