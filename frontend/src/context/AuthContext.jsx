import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      import('../utils/jwtDecodeWrapper.js').then(({ jwtDecodeWrapper }) => {
        jwtDecodeWrapper(token)
          .then(decoded => {
            setUser({ id: decoded.id, role: decoded.role });
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Also set token in localStorage to persist
            localStorage.setItem('token', token);
          })
          .catch(error => {
            console.error('Invalid token:', error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Ensure axios always sends Authorization header if token exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
