import axios from 'axios';

const API_GESTOR_URL = "http://localhost:8080/api/gestor";
const API_PROYECTOS_URL = "http://localhost:8080/api/proyectos";

// 1. Obtener proyectos asociados a un usuario
export const obtenerProyectosPorUsuario = async (idUsuario) => {
  const response = await axios.get(`${API_PROYECTOS_URL}/listar-proyectos/${idUsuario}`);
  return response.data;
};

// 2. Crear un nuevo proyecto asignándole su gestor
export const crearProyectoReal = async (proyecto, idGestor) => {
  const response = await axios.post(`${API_GESTOR_URL}/crear/${idGestor}`, proyecto);
  return response.data;
};

// 3. Editar un proyecto existente
export const editarProyectoReal = async (idProyecto, proyectoEditado) => {
  const response = await axios.put(`${API_GESTOR_URL}/editar/${idProyecto}`, proyectoEditado);
  return response.data;
};

// 4. Eliminar un proyecto definitivamente
export const eliminarProyectoReal = async (idProyecto) => {
  const response = await axios.delete(`${API_GESTOR_URL}/eliminar/${idProyecto}`);
  return response.data;
};