import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  List,
  Button,
  Input,
  Typography,
  Card,
  Space,
  Empty,
  Spin,
  Modal,
  Form,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getAnalisis, addAnalisis, updateAnalisis, deleteAnalisis } from '../services/api';
import AnalysisForm from '../components/analysis/AnalysisForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Title, Text } = Typography;

const AnalysisPage = () => {
  const [analisisList, setAnalisisList] = useState([]);
  const [selectedAnalisis, setSelectedAnalisis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAnalisis, setEditingAnalisis] = useState(null);
  const [form] = Form.useForm();

  const fetchAnalisis = async () => {
    setLoading(true);
    try {
      const { data } = await getAnalisis();
      setAnalisisList(data.analisysList || []);
    } catch (error) {
      MySwal.fire('Error', 'No se pudieron cargar los datos de análisis.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalisis();
  }, []);

  const filteredAnalisis = useMemo(() => {
    return analisisList
      .filter(item => item.status === true)
      .filter(item => {
        if (!searchTerm) return true;
        return item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [analisisList, searchTerm]);

  const showAddModal = () => {
    setEditingAnalisis(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (analisis) => {
    setEditingAnalisis(analisis);
    form.setFieldsValue(analisis);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // --- FUNCIÓN CORREGIDA Y REFORZADA ---
  const handleOk = async () => {
    try {
      // 1. Valida los campos. Si falla, salta al CATCH.
      const values = await form.validateFields();
      
      if (editingAnalisis) {
        await updateAnalisis(editingAnalisis._id, values);
        setIsModalVisible(false);
        await MySwal.fire('¡Actualizado!', 'El análisis ha sido actualizado con éxito.', 'success');
      } else {
        await addAnalisis(values);
        setIsModalVisible(false);
        await MySwal.fire('¡Agregado!', 'El nuevo análisis ha sido agregado con éxito.', 'success');
      }

      fetchAnalisis();

    } catch (errorInfo) {
      // 2. Si la validación falla, ahora muestra una alerta de sweetalert2.
      if (errorInfo.errorFields) {
        MySwal.fire({
          title: 'Campos Incompletos',
          text: 'Por favor, completa todos los campos requeridos.',
          icon: 'error',
        });
      } else {
        // 3. Si es un error de API, muestra el mensaje del servidor.
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema al guardar.';
        MySwal.fire('Error al Guardar', errorMessage, 'error');
      }
      console.error('Detalles del error:', errorInfo);
    }
  };

  const handleDelete = (analisis) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: `Se dará de baja el análisis "${analisis.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡dar de baja!',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        deleteAnalisis(analisis._id).then(async () => {
          await MySwal.fire('¡Dado de baja!', 'El análisis ha sido dado de baja.', 'success');
          if (selectedAnalisis?._id === analisis._id) {
            setSelectedAnalisis(null);
          }
          fetchAnalisis();
        }).catch((error) => {
          const errorMessage = error.response?.data?.message || 'No se pudo dar de baja el análisis.';
          MySwal.fire('Error', errorMessage, 'error');
        });
      }
    });
  };

  return (
    <div>
      {/* ...el resto del JSX sigue igual... */}
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto"><Title level={3} style={{ margin: 0 }}>Gestión de Análisis</Title></Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar análisis..." prefix={<SearchOutlined />} onChange={e => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ background: '#d9363e' }}>Agregar</Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={24} className='scale-up-ver-center'>
        <Col xs={24} md={10}>
          <Card title="Pruebas">
            {loading ? <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div> : (
              <List
                itemLayout="horizontal"
                dataSource={filteredAnalisis}
                pagination={{ pageSize: 6, align: 'center' }}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Tooltip title="Editar Análisis"><Button style={{ padding:'2vh'}} type="text" shape="circle" icon={<EditOutlined />} onClick={() => showEditModal(item)} /></Tooltip>,
                      <Tooltip title="Dar de Baja"><Button style={{ padding:'2vh'}} type="text" shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item)} /></Tooltip>,
                    ]}
                    onClick={() => setSelectedAnalisis(item)}
                    style={{ cursor: 'pointer', background: selectedAnalisis?._id === item._id ? '#e6f7ff' : 'transparent', borderRadius: '8px' }}
                  >
                    <List.Item.Meta avatar={<ExperimentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />} title={<a href="#!">{item.nombre}</a>} />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <Card title="Detalles">
            {selectedAnalisis ? (
              <div>
                <Title level={4}>{selectedAnalisis.nombre}</Title>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                  <Col span={8}><Text strong>Costo:</Text></Col>
                  <Col span={16}><Text>${selectedAnalisis.costo}</Text></Col>
                  <Col span={8}><Text strong>Días de Espera:</Text></Col>
                  <Col span={16}><Text>{selectedAnalisis.diasEspera} días</Text></Col>
                  <Col span={8}><Text strong>Descripción:</Text></Col>
                  <Col span={16}><Text>{selectedAnalisis.descripcion}</Text></Col>
                </Row>
              </div>
            ) : <Empty image={<ExperimentOutlined style={{ fontSize: 64, color: '#ccc' }} />} description={<Text type="secondary">Selecciona un análisis de la lista para ver sus detalles.</Text>} />}
          </Card>
        </Col>
      </Row>
      <Modal 
        title={editingAnalisis ? "Editar Análisis" : "Agregar Nuevo Análisis"} 
        visible={isModalVisible} 
        onCancel={handleCancel} 
        onOk={handleOk} 
        okText="Guardar" 
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#d9363e', borderColor: '#d9363e' } }}
      >
        <AnalysisForm form={form} />
      </Modal>
    </div>
  );
};

export default AnalysisPage;