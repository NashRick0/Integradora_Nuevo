import React from 'react';
import { Form, Select, Input, InputNumber, Row, Col } from 'antd';

const { Option } = Select;

const OrderForm = ({ form, patients, analyses }) => {
  return (
    <Form form={form} layout="vertical" name="orderForm">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="usuarioId"
            label="Paciente"
            rules={[{ required: true, message: 'Por favor, selecciona un paciente.' }]}
          >
            <Select
              showSearch
              placeholder="Busca y selecciona un paciente"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {patients.map(p => (
                <Option key={p._id} value={p._id}>{`${p.nombre} ${p.apellidoPaterno}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="analisisIds"
            label="Análisis"
            rules={[{ required: true, message: 'Selecciona al menos un análisis.' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Busca y selecciona uno o más análisis"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {analyses.map(a => (
                <Option key={a._id} value={a._id}>{a.nombre}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="porcentajeDescuento"
            label="Descuento (%)"
            initialValue={0}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="montoAnticipo"
            label="Anticipo ($)"
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="notas" label="Notas Adicionales">
            <Input.TextArea rows={3} placeholder="Ej. Paciente en ayunas" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderForm;