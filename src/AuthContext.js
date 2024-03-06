import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(cookies.get('username') || '');
  const [token, setToken] = useState(cookies.get('token') || '');

  const login = (newUsername, newToken) => {
    setUsername(newUsername);
    cookies.set('username', newUsername, { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7日間有効
    setToken(newToken);
    cookies.set('token', newToken, { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7日間有効
  };

  const logout = () => {
    setToken('');
    cookies.remove('token', { path: '/' });
    setUsername('');
    cookies.remove('username', { path: '/' });
  };

  return (
    <AuthContext.Provider value={{ username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};