import React, { useMemo } from 'react';
import { Layout, Menu, Typography, Divider } from 'antd';
import {
  DashboardOutlined, TeamOutlined, ExperimentOutlined, FileTextOutlined,
  BarChartOutlined, LogoutOutlined, UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleMenuItems = useMemo(() => {
    const allItems = [
      { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard', roles: ['admin', 'accounting', 'laboratory'] },
      { key: '/dashboard/pacientes', icon: <TeamOutlined />, label: 'Pacientes', roles: ['admin', 'laboratory'] },
      { key: '/dashboard/pedidos', icon: <FileTextOutlined />, label: 'Pedidos', roles: ['admin', 'accounting'] },
      { key: '/dashboard/muestras', icon: <ExperimentOutlined />, label: 'Muestras', roles: ['admin', 'laboratory'] },
      { key: '/dashboard/analisis', icon: <BarChartOutlined />, label: 'Análisis', roles: ['admin', 'accounting', 'laboratory'] },
    ];
    
    if (!user?.rol) {
        return [];
    }

    return allItems.filter(item => item.roles.includes(user.rol));
  }, [user?.rol]);

  const accountMenuItems = [
    { key: '/dashboard/mi-cuenta', icon: <UserOutlined />, label: 'Mi Cuenta' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Salir', danger: true },
  ];

  // --- FUNCIÓN DEDICADA PARA CERRAR SESIÓN ---
  const handleLogout = () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar la sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡cerrar sesión!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      handleLogout(); // Llama a la función dedicada
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            IIC UJED
          </div>
          <Menu 
            theme="dark" mode="inline" selectedKeys={[location.pathname]} 
            onClick={handleMenuClick} items={visibleMenuItems}
          />
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)'}} />
          <Menu theme="dark" mode="inline" onClick={handleMenuClick} items={accountMenuItems} selectedKeys={[location.pathname]} />
        </div>
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