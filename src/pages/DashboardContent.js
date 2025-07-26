import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Typography, Empty } from 'antd'; // --- CAMBIO: Importar Empty ---
import { getTempWetData } from '../services/api';
import ChartCard from '../components/dashboard/ChartCard';
import LdrCard from '../components/dashboard/LdrCard';

const { Title } = Typography;

const DashboardContent = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTempWetData();
        // --- CAMBIO: Verificar si 'data' existe y no es un array vacío ---
        if (data && data.length > 0) {
          const reversedData = data.slice(0, 30).reverse();
          setChartData({
            labels: reversedData.map(d => new Date(d.createdAt).toLocaleTimeString()),
            tempLab: reversedData.map(d => d.tempLab),
            wetLab: reversedData.map(d => d.wetLab),
            tempRecipient: reversedData.map(d => d.tempRecipient),
          });
        }
        // Si no hay datos, chartData se quedará como null
      } catch (err) {
        console.error(err);
        // En caso de error, chartData también se queda como null
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div>
      <Title level={3} style={{ marginBottom: '24px' }}>Resumen del Laboratorio</Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        // --- INICIO DE CAMBIOS ---
        // Se añade una condición para verificar si existen datos antes de renderizar las gráficas
        (!chartData || chartData.labels.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Empty description="No se encontraron datos para mostrar." />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Fila Superior */}
            <Col xs={24} md={12}>
              <ChartCard title="Temperatura del Laboratorio" data={{ labels: chartData.labels, datasets: [{ label: '°C', data: chartData.tempLab, borderColor: '#ff4d4f', backgroundColor: '#fff1f0' }]}} />
            </Col>
            <Col xs={24} md={12}>
              <ChartCard title="Humedad del Laboratorio" data={{ labels: chartData.labels, datasets: [{ label: '%', data: chartData.wetLab, borderColor: '#52c41a', backgroundColor: '#f6ffed' }]}} />
            </Col>

            {/* Fila Inferior */}
            <Col xs={24} md={12}>
                <ChartCard title="Temperatura del Refrigerador" data={{ labels: chartData.labels, datasets: [{ label: '°C', data: chartData.tempRecipient, borderColor: '#40a9ff', backgroundColor: '#e6f7ff' }]}} />
            </Col>
            <Col xs={24} md={12}>
              <LdrCard />
            </Col>
          </Row>
        )
        // --- FIN DE CAMBIOS ---
      )}
    </div>
  );
};

export default DashboardContent;