import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      setUserToken(token);
    } catch (e) {
      console.log('Erro ao salvar token:', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUserToken(null);
    } catch (e) {
      console.log('Erro ao remover token:', e);
    }
  };

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setUserToken(token);
    } catch (e) {
      console.log('Erro ao recuperar token:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
