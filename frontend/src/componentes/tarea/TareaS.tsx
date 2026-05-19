import axios from 'axios';

// 1. El molde TypeScript exacto a tu Tarea.java del backend
export interface Tarea {
  id_tarea?: number;
  titulo: string;
  descripcion: string;
  estado: string; // 'por hacer', 'en progreso', 'completada'
  fecha_entrega: string; // LocalDate (viaja como "YYYY-MM-DD")
  prioridad: string; // 'Baja', 'Media', 'Alta'
}

const API_URL = "http://localhost:8080/api/tareas";

// 2. Agrupamos tus utilidades exactas en un objeto ejecutable
export const tareaService = {

  // CREAR TAREA -> Conecta con @PostMapping("/crear")
  crearTarea: async (nuevaTarea: Tarea): Promise<Tarea> => {
    try {
      const response = await axios.post<Tarea>(`${API_URL}/crear`, nuevaTarea);
      return response.data;
    } catch (error: any) {
      console.error("Error en crear:", error);
      throw error;
    }
  },

  // ELIMINAR TAREA -> Conecta con @PostMapping("/eliminar/{id}")
  eliminarTarea: async (id: number): Promise<string> => {
    try {
      const response = await axios.post<string>(`${API_URL}/eliminar/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error en eliminar:", error);
      throw error;
    }
  },

  // EDITAR TAREA -> Conecta con @PostMapping("/editar/{id}")
  editarTarea: async (id: number, tareaEditada: Tarea): Promise<Tarea> => {
    try {
      const response = await axios.post<Tarea>(`${API_URL}/editar/${id}`, tareaEditada);
      return response.data;
    } catch (error: any) {
      console.error("Error en editar:", error);
      throw error;
    }
  },

  // ACTUALIZAR ESTADO -> Conecta con @PostMapping("/actualizar-estado/{id}")
  actualizarEstado: async (id: number, nuevoEstadoTexto: string): Promise<string> => {
    try {
      // Envía el JSON con la clave "estado" para tu @RequestBody Tarea de Spring Boot
      const bodyRequest = { estado: nuevoEstadoTexto };
      const response = await axios.post<string>(`${API_URL}/actualizar-estado/${id}`, bodyRequest);
      return response.data;
    } catch (error: any) {
      console.error("Error en actualizar-estado:", error);
      throw error;
    }
  }

};