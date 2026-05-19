import axios from 'axios';

const API_URL = "http://localhost:8080/api/tareas";

// Utilidad para extraer el token si vuestro backend exige autenticación por cabecera (opcional)
const getAuthConfig = () => {
  const usuarioGuardado = localStorage.getItem('usuario'); // O como lo guarde vuestro useAuth
  if (usuarioGuardado) {
    const { token } = JSON.parse(usuarioGuardado);
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

// 1. TUS UTILIDADES DE CONEXIÓN CON AXIOS (JavaScript puro)
export const crearTarea = async (nuevaTarea) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, nuevaTarea);
    return response.data;
  } catch (error) {
    console.error("Error en crear:", error);
    throw error;
  }
};

export const eliminarTarea = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en eliminar:", error);
    throw error;
  }
};

export const editarTarea = async (id, tareaEditada) => {
  try {
    const response = await axios.post(`${API_URL}/editar/${id}`, tareaEditada);
    return response.data;
  } catch (error) {
    console.error("Error en editar:", error);
    throw error;
  }
};

export const actualizarEstadoTarea = async (id, nuevoEstadoTexto) => {
  try {
    const bodyRequest = { estado: nuevoEstadoTexto };
    const response = await axios.post(`${API_URL}/actualizar-estado/${id}`, bodyRequest);
    return response.data;
  } catch (error) {
    console.error("Error en actualizar-estado:", error);
    throw error;
  }
};