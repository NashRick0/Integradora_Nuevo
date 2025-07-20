import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Row, Col, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import logoIIC from '../assets/logo-iic.png';
import logoUJED from '../assets/logo-ujed.png';
import labImage from '../assets/lab_login.jpg';

const { Title, Text } = Typography;

const RecoveryPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      // Simulando llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`Se ha enviado un correo de recuperación a: ${values.correo}`);
    } catch (error) {
      message.error('Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.header}
      >
        <img src={logoIIC} alt="Logo IIC" style={styles.logoIIC} />
        <img src={logoUJED} alt="Logo UJED" style={styles.logoUJED} />
      </motion.div>
      
      <Card style={styles.card}>
        <Row>
          <Col xs={0} md={12} style={styles.imageContainer}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div style={styles.overlay} />
              <img src={labImage} alt="Laboratorio" style={styles.labImage} />
              <div style={styles.imageText}>
                <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>Recupera tu acceso</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Te ayudaremos a recuperar el acceso a tu cuenta</Text>
              </div>
            </motion.div>
          </Col>
          
          <Col xs={24} md={12} style={styles.formContainer}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div style={styles.formHeader}>
                <Title level={2} style={styles.title}>¿Olvidaste tu contraseña?</Title>
                <Text type="secondary" style={styles.subtitle}>Ingresa tu correo electrónico para restablecer tu contraseña.</Text>
              </div>
              
              <Form 
                name="recovery" 
                onFinish={onFinish} 
                layout="vertical" 
                requiredMark={false}
                style={styles.form}
              >
                <Form.Item 
                  name="correo" 
                  label="Correo Electrónico" 
                  rules={[{ 
                    required: true, 
                    message: 'Por favor, ingresa tu correo.', 
                    type: 'email' 
                  }]}
                >
                  <Input 
                    prefix={<MailOutlined style={styles.inputIcon} />} 
                    placeholder="tu@correo.com" 
                    size="large" 
                    style={styles.input}
                  />
                </Form.Item>
                
                <Form.Item style={{ marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    size="large" 
                    loading={isLoading}
                    style={styles.recoveryButton}
                    icon={<ArrowRightOutlined />}
                  >
                    Enviar correo de recuperación
                  </Button>
                </Form.Item>
                
                <div style={styles.footer}>
                  <Link to="/login" style={styles.link}>
                    <ArrowLeftOutlined style={{ marginRight: 8 }} />
                    Volver a Iniciar Sesión
                  </Link>
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Estilos consistentes con LoginPage
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    padding: '20px',
  },
  header: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 20px',
  },
  logoIIC: {
    height: '60px',
    transition: 'transform 0.3s ease',
  },
  logoUJED: {
    height: '70px',
    transition: 'transform 0.3s ease',
  },
  card: {
    width: '100%',
    maxWidth: '1000px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: 'none',
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
    minHeight: '600px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
    zIndex: 1,
  },
  labImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageText: {
    position: 'absolute',
    bottom: '40px',
    left: '40px',
    right: '40px',
    zIndex: 2,
    color: '#fff',
  },
  formContainer: {
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formHeader: {
    marginBottom: '40px',
  },
  title: {
    color: '#d9363e',
    marginBottom: '12px',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '16px',
    display: 'block',
    marginBottom: '8px',
  },
  form: {
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
  },
  inputIcon: {
    color: '#9e9e9e',
    marginRight: '8px',
  },
  recoveryButton: {
    background: '#d9363e',
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '8px',
    marginTop: '16px',
    transition: 'all 0.3s ease',
    border: 'none',
    ':hover': {
      background: '#c41a23',
    },
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  link: {
    color: '#d9363e',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.3s ease',
    ':hover': {
      color: '#ff4d4f',
    },
  },
};

export default RecoveryPage;