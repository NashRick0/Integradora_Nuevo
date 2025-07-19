import React, { useState, useEffect } from 'react';
import { Layout, List, Button, Typography, Card, Spin, Avatar, message, Modal, Tooltip } from 'antd'; // Se añade Modal y Tooltip
import { DownloadOutlined, UserOutlined, LogoutOutlined, EyeOutlined } from '@ant-design/icons'; // Se añade EyeOutlined
import { useAuth } from '../context/AuthContext';
import { getMyResults } from '../services/api';
import { generatePdf } from '../utils/pdfGenerator';
import SampleResultDetail from '../components/samples/SampleResultDetail'; // Se reutiliza el componente de detalles
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

  // --- Estados para el nuevo modal ---
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  useEffect(() => {
    if (user?._id) {
      getMyResults(user._id)
        .then(({ data }) => {
          const availableResults = data.muestras.filter(sample => sample.statusShowClient === true);
          setResults(availableResults);
        })
        .catch(() => message.error('No se pudieron cargar tus resultados.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

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

  // --- Función para abrir el modal de detalles ---
  const showDetailsModal = (sample) => {
    setSelectedSample(sample);
    setIsDetailsModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Portal de Paciente</Title>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <div style={{ marginLeft: '16px' }}>
              <Title level={5} style={{ margin: 0 }}>{`${user?.nombre} ${user?.apellidoPaterno}`}</Title>
              <Text type="secondary">{user?.correo}</Text><br/>
              <Text type="secondary">Fecha de Nacimiento: {dayjs(user?.fechaNacimiento).format('DD/MM/YYYY')}</Text>
            </div>
          </div>
        </Card>
        
        <Title level={4}>Mis Resultados</Title>
        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={results}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    // --- INICIO DE CAMBIOS ---
                    <Tooltip title="Ver Detalles">
                        <Button
                          type="default"
                          icon={<EyeOutlined />}
                          onClick={() => showDetailsModal(item)}
                        >
                          Ver
                        </Button>
                    </Tooltip>,
                    <Tooltip title="Descargar PDF">
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => generatePdf(item)}
                        >
                          Descargar
                        </Button>
                    </Tooltip>
                    // --- FIN DE CAMBIOS ---
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

      {/* --- Nuevo Modal para Detalles --- */}
      <Modal
          title={`Resultados de Muestra M${selectedSample?._id.slice(-6).toUpperCase()}`}
          visible={isDetailsModalVisible}
          onCancel={() => setIsDetailsModalVisible(false)}
          footer={null} // El botón para el PDF ya está dentro del componente
          width={800}
      >
          <SampleResultDetail sample={selectedSample} />
      </Modal>
    </Layout>
  );
};

export default PatientPortalPage;