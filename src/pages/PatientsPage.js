import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Input,
  Tabs,
  Avatar,
  Typography,
  Tag,
  Space,
  Modal,
  message,
  Form,
  Descriptions,
  Row,
  Col,
  Card,
  Empty,
  Spin,
  Pagination,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { getUsuarios, addUsuario, deleteUsuario } from '../services/api';
import AddPatientForm from '../components/patients/AddPatientForm';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsuarios();
      setUsers(data);
    } catch (error) {
      message.error('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filter !== 'all') {
        const statusMatch = filter === 'active' ? user.status === true : user.status === false;
        if (!statusMatch) return false;
      }
      if (searchTerm) {
        const fullName = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [users, filter, searchTerm]);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // --- FUNCIÓN ACTUALIZADA ---
  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
      };
      
      await addUsuario(formattedValues);

      setIsAddModalVisible(false);
      form.resetFields();
      
      MySwal.fire(
        '¡Registrado!',
        'El nuevo paciente ha sido agregado con éxito.',
        'success'
      );

      fetchUsers();

    } catch (errorInfo) {
      if (errorInfo.errorFields) {
        message.error('Por favor, completa todos los campos requeridos.');
      } else {
        MySwal.fire(
          'Error',
          'Ocurrió un problema al guardar el usuario.',
          'error'
        );
      }
      console.log('Validación fallida o error de API:', errorInfo);
    }
  };
  // --- FIN DE LA ACTUALIZACIÓN ---

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalVisible(true);
  };

  const showDeleteConfirm = (user) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: `¡No podrás revertir esto! Se eliminará a ${user.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUsuario(user._id).then(() => {
          MySwal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          fetchUsers();
        }).catch(() => MySwal.fire('Error', 'No se pudo eliminar al usuario.', 'error'));
      }
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto">
          <Title level={3} style={{ margin: 0 }}>Gestión de Pacientes</Title>
        </Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar paciente..." prefix={<SearchOutlined />} onChange={e => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)} style={{ background: '#d9363e' }}>Agregar</Button>
          </Space>
        </Col>
      </Row>

      <Tabs defaultActiveKey="all" onChange={(key) => { setFilter(key); setCurrentPage(1); }}>
        <TabPane tab="Todos" key="all" />
        <TabPane tab="Activos" key="active" />
        <TabPane tab="Inactivos" key="inactive" />
      </Tabs>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map(user => (
                <Col xs={24} sm={12} lg={8} key={user._id}>
                  <Card
                    actions={[
                      <Tooltip title="Ver Detalles">
                        <Button type="text" key="details" icon={<InfoCircleOutlined />} onClick={() => showUserDetails(user)} />
                      </Tooltip>,
                      <Tooltip title="Dar de Baja">
                        <Button type="text" danger key="delete" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(user)} />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />}
                      title={`${user.nombre} ${user.apellidoPaterno}`}
                      description={
                        <>
                          <Text type="secondary">{user.correo}</Text>
                          <br />
                          <Tag color={user.status ? 'green' : 'volcano'} style={{ marginTop: 8 }}>
                            {user.status ? 'ACTIVO' : 'INACTIVO'}
                          </Tag>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '48px' }}>
                <Empty description="No se encontraron pacientes que coincidan con los filtros." />
              </Col>
            )}
          </Row>

          {filteredUsers.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredUsers.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}

      <Modal title="Agregar Nuevo Paciente" visible={isAddModalVisible} onCancel={() => { setIsAddModalVisible(false); form.resetFields(); }} onOk={handleAddUser} okText="Guardar" cancelText="Cancelar">
        <AddPatientForm form={form} />
      </Modal>

      <Modal title="Detalles del Paciente" visible={isDetailsModalVisible} onCancel={() => setIsDetailsModalVisible(false)} footer={[<Button key="back" onClick={() => setIsDetailsModalVisible(false)}>Cerrar</Button>]}>
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombre Completo">{`${selectedUser.nombre} ${selectedUser.apellidoPaterno} ${selectedUser.apellidoMaterno}`}</Descriptions.Item>
            <Descriptions.Item label="Correo">{selectedUser.correo}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Nacimiento">{dayjs(selectedUser.fechaNacimiento).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Alta">{dayjs(selectedUser.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Estatus"><Tag color={selectedUser.status ? 'green' : 'volcano'}>{selectedUser.status ? 'ACTIVO' : 'INACTIVO'}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PatientsPage;