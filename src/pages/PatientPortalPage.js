import React, { useState, useEffect } from 'react';
import { Layout, List, Button, Typography, Card, Spin, Avatar, Modal, Form, Space, Tooltip } from 'antd';
import { DownloadOutlined, UserOutlined, LogoutOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getMyResults, changePassword } from '../services/api';
import { generatePdf } from '../utils/pdfGenerator';
import SampleResultDetail from '../components/samples/SampleResultDetail';
import ChangePasswordForm from '../components/patient_portal/ChangePasswordForm';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const PatientPortalPage = () => {
  const { user, logout } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  // --- Estados para el modal de detalles (Restaurados) ---
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [passwordForm] = Form.useForm();
  
  useEffect(() => {
    if (user?._id) {
      getMyResults(user._id)
        .then(({ data }) => {
          const availableResults = data.muestras.filter(sample => sample.statusShowClient === true);
          setResults(availableResults);
        })
        .catch(() => MySwal.fire('Error', 'No se pudieron cargar tus resultados.', 'error'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    MySwal.fire({
      title: '¿Estás seguro?', text: "¿Quieres cerrar la sesión?", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡cerrar sesión!', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { logout(); }
    });
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const payload = { contraseña: values.contraseña, anteriorContraseña: values.anteriorContraseña };
      await changePassword(user._id, payload);
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      await MySwal.fire('¡Éxito!', 'Tu contraseña ha sido actualizada.', 'success');
    } catch (errorInfo) {
      if (errorInfo.errorFields) { /* AntD handles field errors */ } 
      else {
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema al guardar.';
        MySwal.fire('Error al Guardar', errorMessage, 'error');
      }
    }
  };

  // --- Función para abrir el modal de detalles (Restaurada) ---
  const showDetailsModal = (sample) => {
    setSelectedSample(sample);
    setIsDetailsModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Portal de Paciente</Title>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space align="start">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={5} style={{ margin: 0 }}>{`${user?.nombre} ${user?.apellidoPaterno}`}</Title>
                <Text type="secondary">{user?.correo}</Text><br/>
                <Text type="secondary">Fecha de Nacimiento: {dayjs(user?.fechaNacimiento).format('DD/MM/YYYY')}</Text>
              </div>
            </Space>
            <Button icon={<EditOutlined />} onClick={() => setIsPasswordModalVisible(true)}>Cambiar Contraseña</Button>
          </div>
        </Card>
        
        <Title level={4}>Mis Resultados</Title>
        <Card >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>
          ) : (
            <List
            itemLayout="horizontal"
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                  actions={[
                    // --- Botón "Ver" Restaurado ---
                    <Tooltip title="Ver Detalles">
                      <Button type="default" icon={<EyeOutlined />} onClick={() => showDetailsModal(item)}>Ver</Button>
                    </Tooltip>,
                    <Tooltip title="Descargar PDF">
                      <Button type="primary" icon={<DownloadOutlined />} onClick={() => generatePdf(item)} style={{ background: '#d9363e' }}>Descargar</Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    title={`Análisis de ${item.tipoMuestra === 'quimicaSanguinea' ? 'Química Sanguínea' : 'Biometría Hemática'}`}
                    description={`Fecha de toma: ${dayjs(item.fechaTomaMuestra).format('DD/MM/YYYY')}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Content>
      
      <Modal 
        title="Cambiar Contraseña" 
        visible={isPasswordModalVisible} 
        onCancel={() => setIsPasswordModalVisible(false)} 
        onOk={handleChangePassword} 
        okText="Guardar Cambios" 
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#d9363e', borderColor: '#d9363e' } }}
      >
        <ChangePasswordForm form={passwordForm} />
      </Modal>

      <Modal
        title={`Resultados de Muestra M${selectedSample?._id.slice(-6).toUpperCase()}`}
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button 
            key="close"
            onClick={() => setIsDetailsModalVisible(false)}
            style={{ background: '#d9363e', borderColor: '#d9363e', color: 'white' }}
          >
            Cerrar
          </Button>
        ]}
        width={800}
      >
        <SampleResultDetail sample={selectedSample} />
      </Modal>
    </Layout>
  );
};

export default PatientPortalPage;