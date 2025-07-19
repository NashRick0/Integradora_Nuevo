import React from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

const AnalysisForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="analysisForm">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="nombre"
            label="Nombre del Análisis"
            rules={[{ required: true, message: 'Por favor, ingresa el nombre.' }]}
          >
            <Input placeholder="Ej. Química Sanguínea" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="costo"
            label="Costo ($)"
            rules={[{ required: true, message: 'Por favor, ingresa el costo.' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Ej. 150.50" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="diasEspera"
            label="Días de Espera"
            rules={[{ required: true, message: 'Por favor, ingresa los días.' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Ej. 3" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor, ingresa una descripción.' }]}
          >
            <Input.TextArea rows={4} placeholder="Describe el análisis..." />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AnalysisForm;