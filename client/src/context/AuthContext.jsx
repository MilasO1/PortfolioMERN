import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/users/me', { withCredentials: true });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password }, { withCredentials: true });
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/users/register', { name, email, password });
    setUser(data.user);
  };

  const logout = async () => {
    await axios.post('/api/users/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);