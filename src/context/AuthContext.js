import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; // Para mostrar notificaciones
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const { data } = await loginUser(credentials);
      if (data.login === 'successful') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.usuario.rol);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        setToken(data.token);
        setUser(data.usuario);
        
        message.success(`Bienvenido, ${data.usuario.nombre}`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      message.error('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);