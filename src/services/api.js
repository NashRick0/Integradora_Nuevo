import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (credentials) => api.post('/usuarios/login', credentials);
export const getLdrData = () => api.get('/ldr/lightControl_001');
export const getTempWetData = () => api.get('/tempwet/tempWetController_001');
// --- Servicios de Usuarios ---
export const getUsuarios = () => api.get('/usuarios');
export const getMyProfile = () => api.get('/usuarios/login');
export const addUsuario = (userData) => api.post('/usuarios', userData);
export const deleteUsuario = (userId) => api.delete(`/usuarios/${userId}`);
export const changePassword = (userId, passwordData) => api.put(`/usuarios/${userId}`, passwordData);
export const requestPasswordReset = (emailData) => api.post('/usuarios/forget', emailData);
// --- Servicios de Análisis ---
export const getAnalisis = () => api.get('/analisis');
export const addAnalisis = (analisisData) => api.post('/analisis', analisisData);
export const updateAnalisis = (id, analisisData) => api.put(`/analisis/${id}`, analisisData);
export const deleteAnalisis = (id) => api.delete(`/analisis/${id}`);
// --- Servicios de Pedidos ---
export const getPedidos = () => api.get('/pedidos');
export const addPedido = (orderData) => api.post('/pedidos', orderData);
export const deletePedido = (orderId) => api.delete(`/pedidos/${orderId}`);
export const updatePedido = (orderId, orderData) => api.put(`/pedidos/${orderId}`, orderData);
// --- Servicios de Muestras ---
export const getMuestras = () => api.get('/muestras');
export const takeSample = (sampleData) => api.post('/muestras', sampleData);
export const registerSampleResults = (sampleId, resultsData) => api.post(`/muestras/resultados/${sampleId}`, resultsData);
export const updateSample = (sampleId, sampleData) => api.put(`/muestras/${sampleId}`, sampleData);
export const updateSampleResults = (sampleId, resultsData) => api.put(`/muestras/resultados/${sampleId}`, resultsData);
export const deleteSample = (sampleId) => api.delete(`/muestras/${sampleId}`);
export const getMyResults = (userId) => api.get(`/muestras/usuario/${userId}`);
// --- Nueva función LDR ---
export const resetLdrDevice = (deviceId) => api.delete(`/ldr/${deviceId}`);

export default api;