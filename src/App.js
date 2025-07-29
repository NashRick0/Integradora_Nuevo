import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import { AdminRoute, PatientRoute } from './components/common/RoleBasedRoutes';

// Importa todas tus páginas
import LoginPage from './pages/LoginPage';
import RecoveryPage from './pages/RecoveryPage';
import DashboardPage from './pages/DashboardPage';
import DashboardContent from './pages/DashboardContent';
import PatientsPage from './pages/PatientsPage';
import AnalysisPage from './pages/AnalysisPage';
import OrdersPage from './pages/OrdersPage';
import SamplesPage from './pages/SamplesPage';
import AccountPage from './pages/AccountPage';
import PatientPortalPage from './pages/PatientPortalPage';

function App() {
  return (
    // ✅ El <Router> debe ser el componente padre que envuelve todo
    <Router>
      {/* AuthProvider ahora está DENTRO del Router */}
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-cuenta" element={<RecoveryPage />} />

          {/* Rutas para Admin, Contabilidad, Laboratorio */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute><AdminRoute><DashboardPage /></AdminRoute></PrivateRoute>}
          >
            <Route index element={<DashboardContent />} />
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="analisis" element={<AnalysisPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="muestras" element={<SamplesPage />} />
            <Route path="mi-cuenta" element={<AccountPage />} />
          </Route>

          {/* Ruta para Pacientes */}
          <Route 
            path="/portal" 
            element={<PrivateRoute><PatientRoute><PatientPortalPage /></PatientRoute></PrivateRoute>}
          />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;