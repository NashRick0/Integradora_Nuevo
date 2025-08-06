import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const AddPatientForm = ({ form, userRole }) => {

  return (
    <Form form={form} layout="vertical" name="addPatientForm">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="nombre"
            label="Nombre(s)"
            rules={[{ required: true, message: 'Por favor, ingresa el nombre.' }]}
          >
            {/* --- CAMBIO --- */}
            <Input placeholder="Ingresa el/los nombre(s)" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="apellidoPaterno"
            label="Apellido Paterno"
            rules={[{ required: true, message: 'Por favor, ingresa el apellido paterno.' }]}
          >
            {/* --- CAMBIO --- */}
            <Input placeholder="Ingresa el apellido paterno" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="apellidoMaterno"
            label="Apellido Materno"
            rules={[{ required: true, message: 'Por favor, ingresa el apellido materno.' }]}
          >
            {/* --- CAMBIO --- */}
            <Input placeholder="Ingresa el apellido materno" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="correo"
            label="Correo Electrónico"
            rules={[{ required: true, message: 'Por favor, ingresa un correo válido.', type: 'email' }]}
          >
            {/* --- CAMBIO --- */}
            <Input placeholder="usuario@dominio.com" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="fechaNacimiento"
            label="Fecha de Nacimiento"
            rules={[{ required: true, message: 'Por favor, selecciona la fecha.' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Selecciona una fecha" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="rol"
            label="Rol de Usuario"
            rules={[{ required: true, message: 'Por favor, selecciona un rol.' }]}
          >
            <Select placeholder="Selecciona un rol">
              {/* <-- CAMBIO: Lógica para mostrar las opciones --> */}
              {userRole === 'admin' ? (
                <>
                  <Option value="admin">Admin</Option>
                  <Option value="accounting">Contabilidad</Option>
                  <Option value="laboratory">Laboratorio</Option>
                  <Option value="patient">Paciente</Option>
                </>
              ) : (
                <Option value="patient">Paciente</Option>
              )}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddPatientForm;