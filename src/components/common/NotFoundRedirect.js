import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFoundRedirect = () => {
  const { token, user } = useAuth(); // <-- Obtenemos también el objeto 'user'

  // Si no hay token, siempre va al login.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, decidimos a dónde redirigir basándonos en el rol.
  if (user?.rol === 'patient') {
    return <Navigate to="/portal" />; // Los pacientes van a su portal
  } else {
    return <Navigate to="/dashboard" />; // El resto de roles va al dashboard
  }
};

export default NotFoundRedirect;