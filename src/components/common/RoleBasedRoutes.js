import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Este componente protege las rutas de admin, laboratorio y contabilidad
export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && user.rol === 'patient') {
    // Si un paciente intenta acceder a /dashboard, lo redirigimos a su portal
    return <Navigate to="/portal" />;
  }
  return children;
};

// Este componente protege la ruta del portal de paciente
export const PatientRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && user.rol !== 'patient') {
    // Si un admin/otro rol intenta acceder a /portal, lo redirigimos a su dashboard
    return <Navigate to="/dashboard" />;
  }
  return children;
};