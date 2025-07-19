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
  Modal,
  Form,
  Descriptions,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getPedidos, getUsuarios, getAnalisis, addPedido, deletePedido, updatePedido } from '../services/api';
import OrderForm from '../components/orders/OrderForm';
import EditOrderForm from '../components/orders/EditOrderForm'; // Asegúrate de tener este componente
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import dayjs from 'dayjs';

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
  
  // Estados para los tres modales
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  
  // Instancias de formularios para agregar y editar
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, analysesRes] = await Promise.all([
        getPedidos(), getUsuarios(), getAnalisis()
      ]);
      setOrders(ordersRes.data.data || []);
      setPatients(usersRes.data.filter(u => u.status === true) || []);
      setAnalyses(analysesRes.data.analisysList.filter(a => a.status === true) || []);
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
      if (filter !== 'todos' && order.estado !== filter) return false;
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const orderIdMatch = order._id.toLowerCase().includes(lowerSearchTerm);
        const patientName = `${order.usuarioId?.nombre} ${order.usuarioId?.apellidoPaterno}`.toLowerCase();
        const patientNameMatch = patientName.includes(lowerSearchTerm);
        return orderIdMatch || patientNameMatch;
      }
      return true;
    });
  }, [orders, filter, searchTerm]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      const selectedAnalyses = values.analisisIds.map(id => {
        const analisis = analyses.find(a => a._id === id);
        return { analisisId: analisis._id, nombre: analisis.nombre, precio: analisis.costo, descripcion: analisis.descripcion };
      });
      const orderPayload = {
        usuarioId: values.usuarioId, analisis: selectedAnalyses, porcentajeDescuento: values.porcentajeDescuento || 0,
        notas: values.notas || '', anticipo: { monto: values.montoAnticipo || 0 },
      };
      await addPedido(orderPayload);
      setIsAddModalVisible(false);
      addForm.resetFields();
      await MySwal.fire('¡Creado!', 'El pedido ha sido registrado con éxito.', 'success');
      fetchInitialData();
    } catch (errorInfo) { /* ... manejo de errores ... */ }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      await updatePedido(selectedOrder._id, values);
      setIsEditModalVisible(false);
      editForm.resetFields();
      await MySwal.fire('¡Actualizado!', 'El pedido ha sido actualizado con éxito.', 'success');
      fetchInitialData();
    } catch (errorInfo) {
      const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema al guardar.';
      MySwal.fire('Error al Guardar', errorMessage, 'error');
    }
  };
  
  const handleDelete = (order) => {
    MySwal.fire({
      title: '¿Estás seguro?', text: `Se dará de baja el pedido ${order._id.slice(-6).toUpperCase()}.`, icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', confirmButtonText: 'Sí, ¡dar de baja!',
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

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalVisible(true);
  };
  
  const showEditModal = (order) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({
      estado: order.estado, notas: order.notas, porcentajeDescuento: order.porcentajeDescuento,
      anticipo: { monto: order.anticipo.monto }
    });
    setIsEditModalVisible(true);
  };

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto"><Title level={3} style={{ margin: 0 }}>Gestión de Pedidos</Title></Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar por ID o paciente..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)} style={{ background: '#d9363e' }}>Agregar</Button>
          </Space>
        </Col>
      </Row>
      <Tabs defaultActiveKey="pendiente" onChange={(key) => { setFilter(key); setCurrentPage(1); }}>
        <TabPane tab="En Proceso" key="pendiente" /><TabPane tab="Completadas" key="pagado" /><TabPane tab="Canceladas" key="cancelado" /><TabPane tab="Todos" key="todos" />
      </Tabs>

      {loading ? <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div> : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedOrders.map(order => (
              <Col xs={24} sm={12} md={8} key={order._id}>
                <Card
                  title={<Space><ExperimentOutlined />{order._id.slice(-6).toUpperCase()}</Space>}
                  actions={[
                    <Tooltip title="Editar Pedido"><Button type="text" icon={<EditOutlined />} key="edit" onClick={() => showEditModal(order)} /></Tooltip>,
                    <Tooltip title="Ver Detalles"><Button type="text" icon={<FileTextOutlined />} key="details" onClick={() => showOrderDetails(order)} /></Tooltip>,
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
      <Modal title="Registrar Nuevo Pedido" visible={isAddModalVisible} onCancel={() => setIsAddModalVisible(false)} onOk={handleAddOk} okText="Guardar Pedido" cancelText="Cancelar" width={700}>
        <OrderForm form={addForm} patients={patients} analyses={analyses} />
      </Modal>

      {/* Modal para Ver Detalles (Restaurado) */}
      <Modal
        title={`Detalles del Pedido: ${selectedOrder?._id.slice(-6).toUpperCase()}`}
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailsModalVisible(false)}>Cerrar</Button>]}
        width={600}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Paciente">{`${selectedOrder.usuarioId.nombre} ${selectedOrder.usuarioId.apellidoPaterno}`}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Creación">{dayjs(selectedOrder.fechaCreacion).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Estado del Pedido"><Tag color="blue">{selectedOrder.estado.toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Análisis Solicitados">
              {selectedOrder.analisis.map(a => (<div key={a.analisisId}>{a.nombre} - ${a.precio}</div>))}
            </Descriptions.Item>
            <Descriptions.Item label="Subtotal">${selectedOrder.subtotal}</Descriptions.Item>
            <Descriptions.Item label="Descuento">{selectedOrder.porcentajeDescuento}%</Descriptions.Item>
            <Descriptions.Item label="Total">${selectedOrder.total}</Descriptions.Item>
            <Descriptions.Item label="Anticipo">${selectedOrder.anticipo.monto}</Descriptions.Item>
            <Descriptions.Item label="Saldo Pendiente">${selectedOrder.total - selectedOrder.anticipo.monto}</Descriptions.Item>
            <Descriptions.Item label="Notas">{selectedOrder.notas}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal para Editar Pedido */}
      <Modal
        title={`Editar Pedido: ${selectedOrder?._id.slice(-6).toUpperCase()}`}
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditOk}
        okText="Guardar Cambios"
        cancelText="Cancelar"
      >
        <EditOrderForm form={editForm} />
      </Modal>
    </div>
  );
};

export default OrdersPage;