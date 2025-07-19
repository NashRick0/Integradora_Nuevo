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
// --- Servicios de Análisis ---
export const getAnalisis = () => api.get('/analisis');
export const addAnalisis = (analisisData) => api.post('/analisis', analisisData);
export const updateAnalisis = (id, analisisData) => api.put(`/analisis/${id}`, analisisData);
export const deleteAnalisis = (id) => api.delete(`/analisis/${id}`);
// --- Servicios de Pedidos ---
export const getPedidos = () => api.get('/pedidos');
// --- Servicios de Muestras ---
export const getMuestras = () => api.get('/muestras');
// --- Nueva función para resetear el LDR ---
export const resetLdrDevice = (deviceId) => api.delete(`/ldr/${deviceId}`);

export default api;