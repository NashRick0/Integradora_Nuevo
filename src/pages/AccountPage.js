import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Typography,
  Card,
  Spin,
  message,
} from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { getMyProfile } from '../services/api';
import dayjs from 'dayjs'; // Librería para manejar fechas fácilmente

const { Title } = Typography;

const AccountPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfile();
        setUserData(data);
        // Llenamos el formulario con los datos recibidos
        form.setFieldsValue({
          nombre: data.nombre,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          correo: data.correo,
          // Convertimos la fecha a un objeto dayjs para el DatePicker
          fechaNacimiento: data.fechaNacimiento ? dayjs(data.fechaNacimiento) : null,
        });
      } catch (error) {
        message.error('No se pudo cargar la información del perfil.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onFinish = (values) => {
    // Aquí iría la lógica para actualizar el perfil del usuario
    console.log('Valores a actualizar:', values);
    message.success('Perfil actualizado con éxito (simulación).');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card>
      <Title level={3}>Mi Cuenta</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={userData}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="nombre" label="Nombre(s)" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="apellidoPaterno" label="Apellido Paterno" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="apellidoMaterno" label="Apellido Materno" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item name="correo" label="Correo Electrónico" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item name="fechaNacimiento" label="Fecha de Nacimiento">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ background: '#d9363e' }}>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AccountPage;