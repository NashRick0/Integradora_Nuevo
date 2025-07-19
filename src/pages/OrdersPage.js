import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Tabs,
  Typography,
  Space,
  Empty,
  Spin,
  Pagination,
  Tooltip,
  Modal, // <-- Importa Modal y Form
  Form,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getPedidos, getUsuarios, getAnalisis, addPedido, deletePedido } from '../services/api';
import OrderForm from '../components/orders/OrderForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendiente');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  // --- Nuevos estados para el formulario ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [form] = Form.useForm();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Carga en paralelo los pedidos, usuarios y análisis
      const [ordersRes, usersRes, analysesRes] = await Promise.all([
        getPedidos(),
        getUsuarios(),
        getAnalisis()
      ]);
      setOrders(ordersRes.data.data || []);
      setPatients(usersRes.data.filter(u => u.status === true) || []); // Solo pacientes activos
      setAnalyses(analysesRes.data.analisysList.filter(a => a.status === true) || []); // Solo análisis activos
    } catch (error) {
      MySwal.fire('Error', 'No se pudieron cargar los datos necesarios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Lógica de filtros... (sin cambios)
      return true;
    });
  }, [orders, filter, searchTerm]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // --- Lógica para el formulario ---
  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Construir el objeto JSON para la API
      const selectedAnalyses = values.analisisIds.map(id => {
        const analisis = analyses.find(a => a._id === id);
        return {
          analisisId: analisis._id,
          nombre: analisis.nombre,
          precio: analisis.costo,
          descripcion: analisis.descripcion,
        };
      });

      const orderPayload = {
        usuarioId: values.usuarioId,
        analisis: selectedAnalyses,
        porcentajeDescuento: values.porcentajeDescuento || 0,
        notas: values.notas || '',
        anticipo: {
          monto: values.montoAnticipo || 0,
        },
      };

      await addPedido(orderPayload);
      setIsModalVisible(false);
      form.resetFields();
      await MySwal.fire('¡Creado!', 'El pedido ha sido registrado con éxito.', 'success');
      fetchInitialData(); // Recarga todo

    } catch (errorInfo) {
      if (errorInfo.errorFields) {
        MySwal.fire('Campos Incompletos', 'Por favor, completa todos los campos requeridos.', 'error');
      } else {
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema al guardar.';
        MySwal.fire('Error al Guardar', errorMessage, 'error');
      }
    }
  };
  
  const handleDelete = (order) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: `Se dará de baja el pedido ${order._id.slice(-6).toUpperCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡dar de baja!',
    }).then(result => {
      if (result.isConfirmed) {
        deletePedido(order._id).then(async () => {
          await MySwal.fire('¡Dado de baja!', 'El pedido ha sido dado de baja.', 'success');
          fetchInitialData();
        }).catch(err => {
          const errorMessage = err.response?.data?.message || 'No se pudo dar de baja el pedido.';
          MySwal.fire('Error', errorMessage, 'error');
        });
      }
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto"><Title level={3} style={{ margin: 0 }}>Gestión de Pedidos</Title></Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar por ID o paciente..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ background: '#d9363e' }}>Agregar</Button>
          </Space>
        </Col>
      </Row>
      <Tabs defaultActiveKey="pendiente" onChange={(key) => { setFilter(key); setCurrentPage(1); }}>
        <TabPane tab="En Proceso" key="pendiente" />
        <TabPane tab="Completadas" key="pagado" />
        <TabPane tab="Canceladas" key="cancelado" />
        <TabPane tab="Todos" key="todos" />
      </Tabs>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedOrders.map(order => (
              <Col xs={24} sm={12} md={8} key={order._id}>
                <Card
                  title={<Space><ExperimentOutlined />{order._id.slice(-6).toUpperCase()}</Space>}
                  actions={[
                    <Tooltip title="Editar Pedido"><Button type="text" icon={<EditOutlined />} key="edit" /></Tooltip>,
                    <Tooltip title="Ver Detalles"><Button type="text" icon={<FileTextOutlined />} key="details" /></Tooltip>,
                    <Tooltip title="Dar de Baja"><Button type="text" danger icon={<DeleteOutlined />} key="delete" onClick={() => handleDelete(order)}/></Tooltip>,
                  ]}
                >
                  <Text strong>{order.analisis[0]?.nombre || 'Análisis'}</Text><br/>
                  <Text type="secondary">{`${order.usuarioId?.nombre || ''} ${order.usuarioId?.apellidoPaterno || ''}`}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Pagination current={currentPage} pageSize={pageSize} total={filteredOrders.length} onChange={(page) => setCurrentPage(page)} />
          </div>
        </>
      )}

      {/* Modal para Agregar Pedido */}
      <Modal
        title="Registrar Nuevo Pedido"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddOk}
        okText="Guardar Pedido"
        cancelText="Cancelar"
        width={700}
      >
        <OrderForm form={form} patients={patients} analyses={analyses} />
      </Modal>
    </div>
  );
};

export default OrdersPage;