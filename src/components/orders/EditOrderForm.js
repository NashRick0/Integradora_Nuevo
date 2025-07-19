import React from 'react';
import { Form, Select, Input, InputNumber, Row, Col } from 'antd';

const { Option } = Select;

const EditOrderForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="editOrderForm">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="estado"
            label="Estado del Pedido"
            rules={[{ required: true, message: 'Por favor, selecciona un estado.' }]}
          >
            <Select placeholder="Selecciona un estado">
              <Option value="pendiente">En Proceso</Option>
              <Option value="pagado">Completado</Option>
              <Option value="cancelado">Cancelado</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="porcentajeDescuento"
            label="Descuento (%)"
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['anticipo', 'monto']} // Access nested field
            label="Anticipo ($)"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="notas" label="Notas Adicionales">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EditOrderForm;