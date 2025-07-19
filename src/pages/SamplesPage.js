import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Input, Tabs, Typography, Space, Empty, Spin, Tooltip, Modal, Form, Pagination } from 'antd'; // <-- Importa Pagination
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, FilePdfOutlined, ExperimentOutlined, SolutionOutlined } from '@ant-design/icons'; // <-- Importa nuevo ícono
import { getMuestras, getPedidos, takeSample, registerSampleResults } from '../services/api';
import TakeSampleForm from '../components/samples/TakeSampleForm';
import RegisterResultsForm from '../components/samples/RegisterResultsForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const sampleTypeNames = {
  quimicaSanguinea: 'Química Sanguínea',
  biometriaHematica: 'Biometría Hemática',
};

const SamplesPage = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // <-- Estado para paginación
  const pageSize = 6; // <-- Tarjetas por página
  
  const [isTakeSampleModalVisible, setTakeSampleModalVisible] = useState(false);
  const [isRegisterResultsModalVisible, setRegisterResultsModalVisible] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [takeSampleForm] = Form.useForm();
  const [registerResultsForm] = Form.useForm();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [samplesRes, ordersRes] = await Promise.all([getMuestras(), getPedidos()]);
      setSamples(samplesRes.data.muestrasList || []);
      setPendingOrders(ordersRes.data.data.filter(o => o.estado === 'pendiente') || []);
    } catch (error) {
      MySwal.fire('Error', 'No se pudieron cargar los datos necesarios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- LÓGICA DE FILTRADO CORREGIDA ---
  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      // Filtro por Pestaña
      switch (filter) {
        case 'con-resultados':
          if (!(sample.status === true && sample.statusShowClient === true)) return false;
          break;
        case 'activo': // En Proceso
          if (!(sample.status === true && sample.statusShowClient === false)) return false;
          break;
        case 'cancelado':
          if (sample.status !== false) return false;
          break;
        case 'todos':
        default:
          break; // No aplicar filtro de estado
      }

      // Filtro por Búsqueda
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const sampleIdMatch = sample._id.slice(-6).toLowerCase().includes(lowerSearchTerm);
        const patientNameMatch = sample.nombrePaciente.toLowerCase().includes(lowerSearchTerm);
        return sampleIdMatch || patientNameMatch;
      }
      return true;
    });
  }, [samples, filter, searchTerm]);

  // --- PAGINACIÓN AÑADIDA ---
  const paginatedSamples = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSamples.slice(startIndex, startIndex + pageSize);
  }, [filteredSamples, currentPage, pageSize]);

  const handleTakeSample = async () => {
    try {
      const values = await takeSampleForm.validateFields();
      const order = pendingOrders.find(o => o._id === values.pedidoId);
      const payload = {
        observaciones: values.observaciones || '',
        nombrePaciente: `${order.usuarioId.nombre} ${order.usuarioId.apellidoPaterno}`,
        idusuario: order.usuarioId._id,
        tipoMuestra: order.analisis[0].nombre.toLowerCase().includes('biometria') ? 'biometriaHematica' : 'quimicaSanguinea',
        pedidoId: values.pedidoId,
      };
      await takeSample(payload);
      setTakeSampleModalVisible(false);
      takeSampleForm.resetFields();
      await MySwal.fire('¡Muestra Tomada!', 'La muestra ha sido registrada.', 'success');
      fetchInitialData();
    } catch (errorInfo) {
      const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema.';
      MySwal.fire('Error', errorMessage, 'error');
    }
  };

  const handleRegisterResults = async () => {
    try {
        const values = await registerResultsForm.validateFields();
        await registerSampleResults(selectedSample._id, values);
        setRegisterResultsModalVisible(false);
        registerResultsForm.resetFields();
        await MySwal.fire('¡Resultados Registrados!', 'Los resultados han sido guardados.', 'success');
        fetchInitialData();
    } catch (errorInfo) {
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema.';
        MySwal.fire('Error', errorMessage, 'error');
    }
  };
  
  const showRegisterResultsModal = (sample) => {
    setSelectedSample(sample);
    registerResultsForm.resetFields();
    setRegisterResultsModalVisible(true);
  };
  
  // Lógica para el botón de edición
  const handleEditClick = (sample) => {
    // Si la muestra tiene `statusShowClient: true` significa que ya tiene resultados
    if (sample.statusShowClient) {
      // Lógica para editar resultados (futuro)
      MySwal.fire('Función no disponible', 'La edición de resultados se implementará próximamente.', 'info');
    } else {
      // Si no, abre el modal para registrar resultados
      showRegisterResultsModal(sample);
    }
  };
  
  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto"><Title level={3} style={{ margin: 0 }}>Gestión de Muestras</Title></Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar por ID o paciente..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setTakeSampleModalVisible(true)} style={{ background: '#d9363e' }}>Tomar Muestra</Button>
          </Space>
        </Col>
      </Row>

      <Tabs defaultActiveKey="todos" onChange={(key) => { setFilter(key); setCurrentPage(1); }}>
        <TabPane tab="Todos" key="todos" />
        <TabPane tab="En Proceso" key="activo" />
        <TabPane tab="Con Resultados" key="con-resultados" />
        <TabPane tab="Canceladas" key="cancelado" />
      </Tabs>

      {loading ? <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div> : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedSamples.length > 0 ? (
              paginatedSamples.map(sample => {
                const hasResults = sample.statusShowClient;
                return (
                  <Col xs={24} sm={12} md={8} key={sample._id}>
                    <Card
                      title={<Space><ExperimentOutlined />{`M${sample._id.slice(-6).toUpperCase()}`}</Space>}
                      actions={[
                        // --- LÓGICA DE ICONO CORREGIDA ---
                        <Tooltip title={hasResults ? "Editar Resultados" : "Registrar Resultados"}>
                          <Button 
                            type="text" 
                            icon={hasResults ? <SolutionOutlined /> : <EditOutlined />} 
                            key="edit" 
                            onClick={() => handleEditClick(sample)} 
                          />
                        </Tooltip>,
                        <Tooltip title="Ver PDF (Próximamente)"><Button type="text" icon={<FilePdfOutlined />} key="results" /></Tooltip>,
                        <Tooltip title="Eliminar Muestra"><Button type="text" danger icon={<DeleteOutlined />} key="delete" /></Tooltip>,
                      ]}
                    >
                      <Text strong>{sampleTypeNames[sample.tipoMuestra] || 'Análisis'}</Text><br />
                      <Text type="secondary">{sample.nombrePaciente}</Text>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '48px' }}>
                <Empty description="No se encontraron muestras que coincidan con los filtros." />
              </Col>
            )}
          </Row>
          
          {/* --- PAGINACIÓN AÑADIDA --- */}
          {filteredSamples.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredSamples.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}

      {/* ... Modales (sin cambios) ... */}
      <Modal title="Tomar Nueva Muestra" visible={isTakeSampleModalVisible} onCancel={() => setTakeSampleModalVisible(false)} onOk={handleTakeSample} okText="Guardar Muestra">
        <TakeSampleForm form={takeSampleForm} pendingOrders={pendingOrders} />
      </Modal>
      <Modal title={`Registrar Resultados de Muestra M${selectedSample?._id.slice(-6).toUpperCase()}`} visible={isRegisterResultsModalVisible} onCancel={() => setRegisterResultsModalVisible(false)} onOk={handleRegisterResults} okText="Guardar Resultados" width={700}>
        <RegisterResultsForm form={registerResultsForm} sampleType={selectedSample?.tipoMuestra} />
      </Modal>
    </div>
  );
};

export default SamplesPage;