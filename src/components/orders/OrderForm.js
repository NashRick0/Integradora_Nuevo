import React, { useState } from 'react';
import { Form, Select, Input, InputNumber, Row, Col, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const OrderForm = ({ form, patients, analyses }) => {
  const [total, setTotal] = useState(0);
  const [faltante, setFaltante] = useState(0);

  const calcularTotales = (changedValues, allValues) => {
    const selectedIds = allValues.analisisIds || [];
    const descuento = allValues.porcentajeDescuento || 0;
    const anticipo = allValues.montoAnticipo || 0;

    const totalBruto = selectedIds.reduce((acc, id) => {
      const analisis = analyses.find(a => a._id === id);
      return analisis ? acc + (analisis.costo || 0) : acc;
    }, 0);

    const totalConDescuento = totalBruto - (totalBruto * descuento) / 100;
    const faltantePorPagar = Math.max(totalConDescuento - anticipo, 0);

    setTotal(totalConDescuento);
    setFaltante(faltantePorPagar);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="orderForm"
      onValuesChange={calcularTotales}
    >
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
                <Option key={p._id} value={p._id}>
                  {`${p.nombre} ${p.apellidoPaterno}`}
                </Option>
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
                <Option key={a._id} value={a._id}>
                  {`${a.nombre} ($${a.costo})`}
                </Option>
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

        {/* Total calculado */}
        <Col span={12}>
          <Text strong>Total a pagar (con descuento):</Text>
          <div style={{ padding: '8px 0', fontSize: '18px' }}>
            ${total.toFixed(2)}
          </div>
        </Col>

        {/* Faltante por pagar */}
        <Col span={12}>
          <Text strong>Faltante por pagar:</Text>
          <div style={{ padding: '8px 0', fontSize: '18px' }}>
            ${faltante.toFixed(2)}
          </div>
        </Col>

      </Row>
    </Form>
  );
};

export default OrderForm;
