import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Spin,
  Divider,
  Descriptions, // <-- Importa Descriptions
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { getMyProfile, changePassword } from '../services/api'; // <-- Cambia a changePassword
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const { Title } = Typography;

const AccountPage = () => {
  const { user } = useAuth();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      getMyProfile().then(({ data }) => {
        setUserData(data);
        setLoading(false);
      }).catch(() => {
        MySwal.fire('Error', 'No se pudo cargar la información del perfil.', 'error');
        setLoading(false);
      });
    }
  }, [user]);

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      
      // El payload ahora solo contiene las contraseñas
      const payload = {
        contraseña: values.contraseña,
        anteriorContraseña: values.anteriorContraseña,
      };
      
      await changePassword(user._id, payload);
      await MySwal.fire('¡Éxito!', 'Tu contraseña ha sido actualizada.', 'success');
      passwordForm.resetFields();

    } catch (errorInfo) {
      if (errorInfo.errorFields) {
        MySwal.fire('Campos Incompletos', 'Debes proporcionar la contraseña actual y la nueva.', 'error');
      } else {
        const errorMessage = errorInfo.response?.data?.message || 'Ocurrió un problema al guardar.';
        MySwal.fire('Error al Guardar', errorMessage, 'error');
      }
    }
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
      <Title level={3} style={{ marginBottom: '24px' }}>Mi Cuenta</Title>
      
      {/* --- Datos del Perfil (Solo Lectura) --- */}
      <Title level={5}>Datos Personales</Title>
      {userData && (
          <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Nombre Completo">{`${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`}</Descriptions.Item>
              <Descriptions.Item label="Correo">{userData.correo}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Nacimiento">{dayjs(userData.fechaNacimiento).format('DD/MM/YYYY')}</Descriptions.Item>
          </Descriptions>
      )}

      <Divider />

      {/* --- Formulario para Cambiar Contraseña --- */}
      <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
        <Title level={5}>Cambiar Contraseña</Title>
        <Form.Item
          name="anteriorContraseña"
          label="Contraseña Actual"
          rules={[{ required: true, message: 'Por favor, ingresa tu contraseña actual.' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Ingresa tu contraseña actual" />
        </Form.Item>
        <Form.Item
          name="contraseña"
          label="Nueva Contraseña"
          rules={[{ required: true, message: 'Por favor, ingresa tu nueva contraseña.' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Ingresa la nueva contraseña" />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#d9363e' }}>
                Cambiar Contraseña
            </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AccountPage;