import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Tabs,
  Typography,
  Space,
  Empty,
  message,
  Spin,
  Pagination,
  Tooltip, // <-- Importa Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getMuestras } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const sampleTypeNames = {
  quimicaSanguinea: 'Química Sanguínea',
  biometriaHematica: 'Biometría Hemática',
};

const SamplesPage = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      try {
        const { data } = await getMuestras();
        setSamples(data.muestrasList || []);
      } catch (error) {
        message.error('No se pudieron cargar las muestras.');
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      switch (filter) {
        case 'con-resultados':
          if (!(sample.status === true && sample.statusShowClient === true)) return false;
          break;
        case 'activo':
          if (!(sample.status === true && sample.statusShowClient === false)) return false;
          break;
        case 'cancelado':
          if (sample.status !== false) return false;
          break;
        default: break;
      }
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const sampleIdMatch = sample._id.slice(-6).toLowerCase().includes(lowerSearchTerm);
        const patientNameMatch = sample.nombrePaciente.toLowerCase().includes(lowerSearchTerm);
        return sampleIdMatch || patientNameMatch;
      }
      return true;
    });
  }, [samples, filter, searchTerm]);

  const paginatedSamples = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSamples.slice(startIndex, startIndex + pageSize);
  }, [filteredSamples, currentPage, pageSize]);

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md="auto">
          <Title level={3} style={{ margin: 0 }}>Gestión de Muestras</Title>
        </Col>
        <Col xs={24} md="auto">
          <Space wrap style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Buscar por ID o paciente..." prefix={<SearchOutlined />} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#d9363e' }}>Agregar</Button>
          </Space>
        </Col>
      </Row>

      <Tabs defaultActiveKey="todos" onChange={(key) => { setFilter(key); setCurrentPage(1); }}>
        <TabPane tab="Todos" key="todos" />
        <TabPane tab="En Proceso" key="activo" />
        <TabPane tab="Con Resultados" key="con-resultados" />
        <TabPane tab="Canceladas" key="cancelado" />
      </Tabs>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedSamples.length > 0 ? (
              paginatedSamples.map(sample => (
                <Col xs={24} sm={12} md={8} key={sample._id}>
                  <Card
                    title={<Space><ExperimentOutlined />{`M${sample._id.slice(-6).toUpperCase()}`}</Space>}
                    // --- INICIO DE CAMBIOS ---
                    actions={[
                      <Tooltip title="Editar Muestra"><Button type="text" icon={<EditOutlined />} key="edit" /></Tooltip>,
                      <Tooltip title="Ver Resultados"><Button type="text" icon={<FilePdfOutlined />} key="results" /></Tooltip>,
                      <Tooltip title="Eliminar Muestra"><Button type="text" danger icon={<DeleteOutlined />} key="delete" /></Tooltip>,
                    ]}
                    // --- FIN DE CAMBIOS ---
                  >
                    <Text strong>{sampleTypeNames[sample.tipoMuestra] || 'Análisis General'}</Text>
                    <br />
                    <Text type="secondary">{sample.nombrePaciente}</Text>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '48px' }}>
                <Empty description="No se encontraron muestras que coincidan con los filtros." />
              </Col>
            )}
          </Row>
          {filteredSamples.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredSamples.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SamplesPage;