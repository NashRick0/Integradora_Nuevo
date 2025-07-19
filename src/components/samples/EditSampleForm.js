import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const EditSampleForm = ({ form, pendingOrders }) => {
  return (
    <Form form={form} layout="vertical" name="editSampleForm">
      <Form.Item
        name="nombrePaciente"
        label="Nombre del Paciente"
        rules={[{ required: true, message: 'El nombre es requerido.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="pedidoId"
        label="Pedido Asociado"
        rules={[{ required: true, message: 'Por favor, selecciona un pedido.' }]}
      >
        <Select placeholder="Selecciona un pedido asociado">
          {pendingOrders.map(order => (
            <Option key={order._id} value={order._id}>
              {`${order._id.slice(-6).toUpperCase()} - ${order.usuarioId?.nombre} ${order.usuarioId?.apellidoPaterno}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="observaciones" label="Observaciones">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default EditSampleForm;