import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Typography } from 'antd';
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
        const reversedData = data.slice(0, 30).reverse();
        setChartData({
          labels: reversedData.map(d => new Date(d.createdAt).toLocaleTimeString()),
          tempLab: reversedData.map(d => d.tempLab),
          wetLab: reversedData.map(d => d.wetLab),
          tempRecipient: reversedData.map(d => d.tempRecipient),
        });
      } catch (err) {
        console.error(err);
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
        // --- INICIO DE LA CORRECCIÓN ---
        // Se añade una comprobación para asegurar que chartData no sea null
        chartData && (
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
        // --- FIN DE LA CORRECCIÓN ---
      )}
    </div>
  );
};

export default DashboardContent;