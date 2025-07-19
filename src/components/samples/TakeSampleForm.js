import React from 'react';
import { Form, Select, Input } from 'antd';

const { Option } = Select;

const TakeSampleForm = ({ form, pendingOrders }) => {
  return (
    <Form form={form} layout="vertical" name="takeSampleForm">
      <Form.Item
        name="pedidoId"
        label="Pedido Asociado"
        rules={[{ required: true, message: 'Por favor, selecciona un pedido.' }]}
      >
        <Select
          showSearch
          placeholder="Busca un pedido por ID o paciente"
          optionFilterProp="children"
        >
          {pendingOrders.map(order => (
            <Option key={order._id} value={order._id}>
              {`${order._id.slice(-6).toUpperCase()} - ${order.usuarioId?.nombre} ${order.usuarioId?.apellidoPaterno}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="observaciones" label="Observaciones">
        <Input.TextArea rows={3} placeholder="Observaciones adicionales sobre la toma de muestra" />
      </Form.Item>
    </Form>
  );
};

export default TakeSampleForm;