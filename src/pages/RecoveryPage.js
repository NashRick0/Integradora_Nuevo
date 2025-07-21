import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Row, Col } from 'antd';
import { MailOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { requestPasswordReset } from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import logoIIC from '../assets/logo-iic.png';
import logoUJED from '../assets/logo-ujed.png';
import labImage from '../assets/lab_login.jpg';

const MySwal = withReactContent(Swal);
const { Title, Text } = Typography;

const RecoveryPage = () => {
  const [form] = Form.useForm();
  const [emailStatus, setEmailStatus] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Función para validar el formato del correo
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Manejar cambio en el campo de correo
  const handleEmailChange = (e) => {
    const email = e.target.value;
    
    if (!email) {
      setEmailStatus('');
      setIsValidEmail(false);
      return;
    }
    
    if (validateEmail(email)) {
      setEmailStatus('success');
      setIsValidEmail(true);
    } else {
      setEmailStatus('error');
      setIsValidEmail(false);
    }
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      await requestPasswordReset({ correo: values.correo });
      
      await MySwal.fire({
        title: '¡Correo Enviado!',
        text: 'Correo para recuperar tu contraseña.',
        icon: 'success',
        confirmButtonColor: '#d9363e',
      });
      
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un problema. Intenta de nuevo.';
      MySwal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#d9363e',
      });
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
                <Text type="secondary" style={styles.subtitle}>
                  Ingresa tu correo electrónico para restablecer tu contraseña.
                </Text>
              </div>
              
              <Form 
                form={form}
                name="recovery" 
                onFinish={onFinish} 
                layout="vertical" 
                requiredMark={false}
                style={styles.form}
              >
                <Form.Item 
                  name="correo" 
                  label="Correo Electrónico" 
                  validateStatus={emailStatus}
                  help={emailStatus === 'error' ? 'Por favor, ingresa un correo electrónico válido' : ''}
                >
                  <Input 
                    prefix={<MailOutlined style={styles.inputIcon} />} 
                    placeholder="tu@correo.com" 
                    size="large" 
                    className={emailStatus ? `ant-form-item-has-${emailStatus}` : ''}
                    style={styles.input}
                    onChange={handleEmailChange}
                  />
                </Form.Item>
                
                <Form.Item style={{ marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                    size="large" 
                    loading={isLoading}
                    disabled={!isValidEmail || isLoading}
                    style={styles.recoveryButton}
                    icon={<ArrowRightOutlined />}
                  >
                    Enviar correo de recuperación
                  </Button>
                </Form.Item>
                
                <div style={{ textAlign: 'center' }}>
                  <Link to="/login" style={{ color: '#d9363e' }}>
                    <ArrowLeftOutlined /> Volver al inicio de sesión
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
    objectPosition: 'center',
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
    textAlign: 'left',
  },
  formContainer: {
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formHeader: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    color: '#1a1a1a',
    marginBottom: '8px',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  form: {
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
  },
  inputIcon: {
    color: '#bfbfbf',
    marginRight: '8px',
  },
  recoveryButton: {
    background: '#d9363e',
    border: 'none',
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '8px',
    marginTop: '8px',
  },
  link: {
    color: '#d9363e',
    transition: 'all 0.3s',
  },
};

export default RecoveryPage;