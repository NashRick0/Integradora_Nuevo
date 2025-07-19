import React from 'react';
import { Layout, Menu, Typography, Divider } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined, // Importa el ícono para Mi Cuenta
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menú principal de navegación
  const mainMenuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/pacientes', icon: <TeamOutlined />, label: 'Pacientes' },
    { key: '/dashboard/pedidos', icon: <FileTextOutlined />, label: 'Pedidos' },
    { key: '/dashboard/muestras', icon: <ExperimentOutlined />, label: 'Muestras' },
    { key: '/dashboard/analisis', icon: <BarChartOutlined />, label: 'Análisis' },
  ];

  // Menú inferior para cuenta y salir
  const accountMenuItems = [
    { key: '/dashboard/mi-cuenta', icon: <UserOutlined />, label: 'Mi Cuenta' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Salir', danger: true },
  ];

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      logout();
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0"
        // --- INICIO DE CAMBIOS DE ESTILO ---
        style={{ display: 'flex', flexDirection: 'column' }} 
      >
        <div>
          <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            IIC UJED
          </div>
          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            onClick={handleMenuClick}
            items={mainMenuItems}
          />
        </div>
        <div style={{ marginTop: 'auto' }}> {/* Empuja este bloque hacia abajo */}
          <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)'}} />
          <Menu
            theme="dark"
            mode="inline"
            onClick={handleMenuClick}
            items={accountMenuItems}
            selectedKeys={[location.pathname]} 
          />
        </div>
        {/* --- FIN DE CAMBIOS DE ESTILO --- */}
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Hola, {user?.nombre || 'Usuario'}</Title>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 'calc(100vh - 112px)' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;