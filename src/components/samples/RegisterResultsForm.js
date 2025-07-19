import React from 'react';
import { Form, InputNumber, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const RegisterResultsForm = ({ form, sampleType }) => {
  // Renderiza el formulario correcto basado en el tipo de muestra
  if (sampleType === 'quimicaSanguinea') {
    return (
      <Form form={form} layout="vertical">
        <Title level={5}>Química Sanguínea</Title>
        <Row gutter={16}>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "glucosa"]} label="Glucosa" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "glucosaPost"]} label="Glucosa Post" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "acidoUrico"]} label="Ácido Úrico" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "urea"]} label="Urea" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "creatinina"]} label="Creatinina" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "colesterol"]} label="Colesterol" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "LDR"]} label="LDR" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["quimicaSanguinea", "gGT"]} label="GGT" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
        </Row>
      </Form>
    );
  }

  if (sampleType === 'biometriaHematica') {
    return (
      <Form form={form} layout="vertical">
        <Title level={5}>Fórmula Roja</Title>
        <Row gutter={16}>
          {/* --- CAMPOS ACTUALIZADOS --- */}
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "hemoglobina"]} label="Hemoglobina" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "hematocrito"]} label="Hematocrito" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "eritrocitos"]} label="Eritrocitos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "conMediaHb"]} label="Con. Media Hb" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "volGlobularMedia"]} label="Vol. Globular Media" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "HBCorpuscularMedia"]} label="HB. Corpuscular Media" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaRoja", "plaqutas"]} label="Plaquetas" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
        </Row>
        <Title level={5} style={{ marginTop: 16 }}>Fórmula Blanca</Title>
        <Row gutter={16}>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "cuentaLeucocitaria"]} label="Leucocitos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "linfocitos"]} label="Linfocitos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "monocitos"]} label="Monocitos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "segmentados"]} label="Segmentados" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "enBanda"]} label="En Banda" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "neutrofilosT"]} label="Neutrófilos T." rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "eosinofilos"]} label="Eosinófilos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          <Col span={12}><Form.Item name={["biometriaHematica", "formulaBlanca", "basofilos"]} label="Basófilos" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item></Col>
          {/* --- FIN DE CAMPOS ACTUALIZADOS --- */}
        </Row>
      </Form>
    );
  }

  return <p>Tipo de muestra no reconocido o sin resultados para registrar.</p>;
};

export default RegisterResultsForm;