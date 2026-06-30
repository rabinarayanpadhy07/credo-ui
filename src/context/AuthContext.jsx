/* oxlint-disable react/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch, setToken } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const refreshRes = await apiFetch('/auth/refresh', { method: 'POST' });
      const { accessToken } = refreshRes.data;
      setToken(accessToken);

      const userRes = await apiFetch('/user/me');
      setUser(userRes.data.user);
    } catch {
      setUser(null);
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { accessToken, user: userData } = res.data;
    setToken(accessToken);
    setUser(userData);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    const { accessToken, user: userData } = res.data;
    setToken(accessToken);
    setUser(userData);
    return res;
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore API errors during logout
    } finally {
      setToken('');
      setUser(null);
    }
  };

  const updateProfile = async (name, email) => {
    const res = await apiFetch('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    });
    setUser(res.data.user);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
