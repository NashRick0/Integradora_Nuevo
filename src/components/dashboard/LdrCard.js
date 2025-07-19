import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Tag, Button, Spin, Typography } from 'antd';
import { BulbOutlined, RedoOutlined } from '@ant-design/icons';
import { getLdrData, resetLdrDevice } from '../../services/api';

// --- INICIO DE CAMBIOS ---
// Importa sweetalert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
// --- FIN DE CAMBIOS ---

const { Text } = Typography;

const LdrCard = () => {
  const [ldr, setLdr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  const fetchLdrData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getLdrData();
      setLdr(data);
    } catch (err) {
      setError('Error al cargar datos LDR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLdrData();
  }, []);

  // --- LÓGICA DE ALERTA ACTUALIZADA ---
  const handleReset = () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: `Se resetearán los valores del dispositivo LDR: ${ldr.id}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡resetear!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setResetting(true);
        try {
          await resetLdrDevice(ldr.id);
          MySwal.fire(
            '¡Reseteado!',
            `El dispositivo ${ldr.id} fue reseteado.`,
            'success'
          );
          fetchLdrData(); // Vuelve a cargar los datos para ver los cambios
        } catch (error) {
          MySwal.fire(
            'Error',
            'Hubo un problema al resetear el dispositivo.',
            'error'
          );
          console.error('Reset error:', error);
        } finally {
          setResetting(false);
        }
      }
    });
  };

  if (loading) {
    return <Card><Spin /></Card>;
  }

  if (error) {
    return <Card title="Luminosidad del Contenedor"><Text type="danger">{error}</Text></Card>;
  }

  const getStatus = (value) => {
    if (value < 800) return { color: 'success', text: 'Seguro' };
    if (value >= 800 && value <= 900) return { color: 'warning', text: 'Precaución' };
    return { color: 'error', text: 'Peligro' };
  };

  const status = getStatus(ldr.ldr);

  return (
    <Card title="Luminosidad del Contenedor">
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Statistic title="Nivel LDR Actual" value={ldr.ldr} prefix={<BulbOutlined />} />
          <Tag color={status.color} style={{ marginTop: '10px', fontSize: '1rem', padding: '5px 10px' }}>
            {status.text}
          </Tag>
        </Col>
        <Col span={12}>
          <Statistic title="Mínimo" value={ldr.ldrMin} />
          <Statistic title="Máximo" value={ldr.ldrMax} />
        </Col>
      </Row>
      <Button
        icon={<RedoOutlined />}
        onClick={handleReset}
        loading={resetting}
        style={{ marginTop: '20px' }}
      >
        Resetear
      </Button>
    </Card>
  );
};

export default LdrCard;