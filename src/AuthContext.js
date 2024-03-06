// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)===' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(getCookie('username') || '');
  const [token, setToken] = useState(getCookie('token') || '');

  const login = (Newusername, newToken) => {
    setUsername(Newusername);
    setCookie('username', Newusername, 7); // 7日間有効
    setToken(newToken);
    setCookie('token', newToken, 7); // 7日間有効
  };

  const logout = () => {
    setToken('');
    eraseCookie('token');
    setUsername('');
    eraseCookie('username');
    
  };

  return (
    <AuthContext.Provider value={{ username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};