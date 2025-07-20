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
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0" 
        width={220}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div>
          <div style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
            borderBottom: '1px solid #f5f5f5'
          }}>
            <img 
              src="/logo-ujed.png" 
              alt="Logo UJED" 
              style={{ 
                height: '32px',
                marginRight: '8px' 
              }} 
            />
            <span style={{ 
              color: '#d9363e', 
              fontWeight: 600,
              fontSize: '1rem'
            }}>
              Laboratorio
            </span>
          </div>
          <Menu 
            theme="light" 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            onClick={handleMenuClick} 
            items={visibleMenuItems}
            style={{ 
              borderRight: 0,
              padding: '4px 8px',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Divider style={{ 
            margin: '4px 0',
            borderTopColor: '#f5f5f5'
          }} />
          <Menu 
            theme="light" 
            mode="inline" 
            onClick={handleMenuClick} 
            items={accountMenuItems} 
            selectedKeys={[location.pathname]}
            style={{ 
              borderRight: 0,
              padding: '4px 8px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 20px',
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          zIndex: 1,
          height: '60px'
        }}>
          <Title level={4} style={{ 
            margin: 0, 
            color: '#333',
            fontWeight: 500,
            fontSize: '1.1rem'
          }}>
            Hola, {user?.nombre || 'Usuario'}
          </Title>
        </Header>
        <Content style={{ 
          margin: '16px 12px 0',
          overflow: 'initial',
          background: '#fafafa',
          minHeight: 'calc(100vh - 76px)'
        }}>
          <div style={{ 
            padding: '20px',
            background: '#fff', 
            borderRadius: 6,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;