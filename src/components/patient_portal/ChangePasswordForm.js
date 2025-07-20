import React from 'react';
import { Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const ChangePasswordForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="changePasswordForm">
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
    </Form>
  );
};

export default ChangePasswordForm;