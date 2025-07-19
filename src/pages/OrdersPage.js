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
  message,
  Spin,
  Pagination,
  Tooltip, // <-- Importa Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getPedidos } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendiente');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await getPedidos();
        setOrders(data.data || []);
      } catch (error) {
        message.error('No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        if (filter !== 'todos' && order.estado !== filter) {
          return false;
        }
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
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto">
          <Title level={3} style={{ margin: 0 }}>Gestión de Pedidos</Title>
        </Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar por ID o paciente..." prefix={<SearchOutlined />} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#d9363e' }}>Agregar</Button>
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
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map(order => (
                <Col xs={24} sm={12} md={8} key={order._id}>
                  <Card
                    title={<Space><ExperimentOutlined />{order._id.slice(-6).toUpperCase()}</Space>}
                    // --- INICIO DE CAMBIOS ---
                    actions={[
                      <Tooltip title="Editar Pedido"><Button type="text" icon={<EditOutlined />} key="edit" /></Tooltip>,
                      <Tooltip title="Ver Detalles"><Button type="text" icon={<FileTextOutlined />} key="details" /></Tooltip>,
                      <Tooltip title="Eliminar Pedido"><Button type="text" danger icon={<DeleteOutlined />} key="delete" /></Tooltip>,
                    ]}
                    // --- FIN DE CAMBIOS ---
                  >
                    <Text strong>{order.analisis[0]?.nombre || 'Análisis sin nombre'}</Text>
                    <br />
                    <Text type="secondary">
                      {`${order.usuarioId?.nombre || ''} ${order.usuarioId?.apellidoPaterno || ''} ${order.usuarioId?.apellidoMaterno || ''}`}
                    </Text>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '48px' }}>
                <Empty description="No se encontraron pedidos que coincidan con los filtros." />
              </Col>
            )}
          </Row>
          {filteredOrders.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredOrders.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;