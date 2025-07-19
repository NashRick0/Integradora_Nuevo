import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecoveryPage from './pages/RecoveryPage';
import PrivateRoute from './components/common/PrivateRoute';
import PatientsPage from './pages/PatientsPage';
import DashboardContent from './pages/DashboardContent';
import AnalysisPage from './pages/AnalysisPage';
import OrdersPage from './pages/OrdersPage'; 
import SamplesPage from './pages/SamplesPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-cuenta" element={<RecoveryPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardContent />} />
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="analisis" element={<AnalysisPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="muestras" element={<SamplesPage />} />
            <Route path="mi-cuenta" element={<AccountPage />} /> {/* <-- Añade esta línea */}
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;