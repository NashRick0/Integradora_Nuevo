import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Input, Tabs, Typography, Space, Spin, Tooltip, Modal, Form, Pagination, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, ExperimentOutlined, SolutionOutlined } from '@ant-design/icons';
import { getMuestras, getPedidos, takeSample, registerSampleResults, updateSample, updateSampleResults, deleteSample } from '../services/api';
import TakeSampleForm from '../components/samples/TakeSampleForm';
import RegisterResultsForm from '../components/samples/RegisterResultsForm';
import EditSampleForm from '../components/samples/EditSampleForm';
import SampleResultDetail from '../components/samples/SampleResultDetail';
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  const [isTakeSampleModalVisible, setTakeSampleModalVisible] = useState(false);
  const [isRegisterResultsModalVisible, setRegisterResultsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isEditSampleModalVisible, setIsEditSampleModalVisible] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  
  const [takeSampleForm] = Form.useForm();
  const [registerResultsForm] = Form.useForm();
  const [editSampleForm] = Form.useForm();

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

  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      switch (filter) {
        case 'con-resultados':
          if (!(sample.status === true && sample.statusShowClient === true)) return false;
          break;
        case 'activo':
          if (!(sample.status === true && sample.statusShowClient === false)) return false;
          break;
        case 'cancelado':
          if (sample.status !== false) return false;
          break;
        default: break;
      }
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const sampleIdMatch = sample._id.slice(-6).toLowerCase().includes(lowerSearchTerm);
        const patientNameMatch = sample.nombrePaciente.toLowerCase().includes(lowerSearchTerm);
        return sampleIdMatch || patientNameMatch;
      }
      return true;
    });
  }, [samples, filter, searchTerm]);

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
      if (errorInfo.errorFields) return;
      const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema.';
      MySwal.fire('Error', errorMessage, 'error');
    }
  };

  const handleRegisterOrUpdateResults = async () => {
    try {
        const values = await registerResultsForm.validateFields();
        const apiCall = selectedSample.statusShowClient 
            ? updateSampleResults(selectedSample._id, values)
            : registerSampleResults(selectedSample._id, values);

        await apiCall;
        setRegisterResultsModalVisible(false);
        registerResultsForm.resetFields();
        await MySwal.fire('¡Éxito!', `Los resultados han sido ${selectedSample.statusShowClient ? 'actualizados' : 'registrados'}.`, 'success');
        fetchInitialData();
    } catch (errorInfo) {
        if (errorInfo.errorFields) return;
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema.';
        MySwal.fire('Error', errorMessage, 'error');
    }
  };

  const handleEditSample = async () => {
    try {
        const values = await editSampleForm.validateFields();
        await updateSample(selectedSample._id, values);
        setIsEditSampleModalVisible(false);
        editSampleForm.resetFields();
        await MySwal.fire('¡Muestra Actualizada!', 'La información de la muestra ha sido actualizada.', 'success');
        fetchInitialData();
    } catch (errorInfo) {
        if (errorInfo.errorFields) return;
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema.';
        MySwal.fire('Error', errorMessage, 'error');
    }
  };
  
  const handleDelete = (sample) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: `Se dará de baja la muestra M${sample._id.slice(-6).toUpperCase()}. Esta acción no se puede revertir.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#317abe',
      confirmButtonText: 'Sí, ¡dar de baja!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSample(sample._id).then(async () => {
          await MySwal.fire(
            '¡Dado de baja!',
            'La muestra ha sido dada de baja.',
            'success'
          );
          fetchInitialData(); // Refresca la lista de muestras
        }).catch((error) => {
          const errorMessage = error.response?.data?.message || 'No se pudo dar de baja la muestra.';
          MySwal.fire('Error', errorMessage, 'error');
        });
      }
    });
  };

  const showRegisterOrEditResultsModal = (sample) => {
    setSelectedSample(sample);
    if (sample.statusShowClient && (sample.quimicaSanguinea || sample.biometriaHematica)) {
        registerResultsForm.setFieldsValue(sample.quimicaSanguinea ? { quimicaSanguinea: sample.quimicaSanguinea } : { biometriaHematica: sample.biometriaHematica });
    } else {
        registerResultsForm.resetFields();
    }
    setRegisterResultsModalVisible(true);
  };
  
  const showEditSampleModal = (sample) => {
    setSelectedSample(sample);
    editSampleForm.setFieldsValue({
        nombrePaciente: sample.nombrePaciente,
        pedidoId: sample.pedidoId,
        observaciones: sample.observaciones,
    });
    setIsEditSampleModalVisible(true);
  };

  const showDetailsModal = (sample) => {
    setSelectedSample(sample);
    setIsDetailsModalVisible(true);
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
          <Row gutter={[16, 24]} className='scale-up-ver-center'>
            {paginatedSamples.map(sample => {
              const isEnProceso = sample.status === true && sample.statusShowClient === false;
              const isConResultados = sample.status === true && sample.statusShowClient === true;

              const menu = (
                <Menu>
                  <Menu.Item  key="editInfo" icon={<EditOutlined />} onClick={() => showEditSampleModal(sample)} disabled={!isEnProceso}>
                    Editar Información
                  </Menu.Item>
                  <Menu.Item key="registerResults" icon={<SolutionOutlined />} onClick={() => showRegisterOrEditResultsModal(sample)} disabled={!isEnProceso}>
                    Registrar Resultados
                  </Menu.Item>
                  <Menu.Item key="editResults" icon={<SolutionOutlined />} onClick={() => showRegisterOrEditResultsModal(sample)} disabled={!isConResultados}>
                    Editar Resultados
                  </Menu.Item>
                </Menu>
              );

              return (
                <Col xs={24} sm={12} md={8} key={sample._id}>
                  <Card
                    title={<Space><ExperimentOutlined /><p style={{fontSize:'2vh', paddingTop:'1.5vh'}}>{`M${sample._id.slice(-6).toUpperCase()}`}</p></Space>}
                    actions={[
                      <Dropdown overlay={menu} trigger={['click']}>
                        <Tooltip  title="Acciones">
                          <Button style={{ paddingRight:'3vw', paddingLeft:'3vw'}} type="text" icon={<EditOutlined />} />
                        </Tooltip>
                      </Dropdown>,
                        <Tooltip title="Ver Detalles">
                          <Button style={{ paddingRight:'3vw', paddingLeft:'3vw'}} type="text" icon={<FileTextOutlined />} onClick={() => showDetailsModal(sample)} />
                        </Tooltip>,
                        <Tooltip title="Dar de Baja">
                          <Button style={{ paddingRight:'3vw', paddingLeft:'3vw'}} type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(sample)} />
                        </Tooltip>,
                    ]}
                  >
                    <Text strong style={{fontSize:'2vh'}}>{sampleTypeNames[sample.tipoMuestra] || 'Análisis'}</Text><br />
                    <Text style={{fontSize:'2vh'}} type="secondary">{sample.nombrePaciente}</Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
          
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

      <Modal 
        title="Tomar Nueva Muestra" 
        visible={isTakeSampleModalVisible} 
        onCancel={() => setTakeSampleModalVisible(false)} 
        onOk={handleTakeSample} 
        okText="Guardar Muestra"
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#d9363e', borderColor: '#d9363e' } }}
      >
        <TakeSampleForm form={takeSampleForm} pendingOrders={pendingOrders} />
      </Modal>

      <Modal
        title={selectedSample?.statusShowClient ? 'Editar Resultados' : 'Registrar Resultados'}
        visible={isRegisterResultsModalVisible}
        onCancel={() => setRegisterResultsModalVisible(false)}
        onOk={handleRegisterOrUpdateResults}
        okText="Guardar"
        cancelText="Cancelar"
        width={700}
        okButtonProps={{ style: { background: '#d9363e', borderColor: '#d9363e' } }}
      >
        <RegisterResultsForm form={registerResultsForm} sampleType={selectedSample?.tipoMuestra} />
      </Modal>

      <Modal
        title="Editar Información de la Muestra"
        visible={isEditSampleModalVisible}
        onCancel={() => setIsEditSampleModalVisible(false)}
        onOk={handleEditSample}
        okText="Guardar Cambios"
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#d9363e', borderColor: '#d9363e' } }}
      >
        <EditSampleForm form={editSampleForm} pendingOrders={pendingOrders} />
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
    </div>
  );
};

export default SamplesPage;