import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. DEFINIMOS LA INTERFAZ DE TAREA PARA TIPAR LOS DATOS QUE MANEJAMOS
export interface Tarea {
  id_tarea?: number;
  titulo: string;
  descripcion: string;
  estado: string; // 'por hacer', 'en progreso', 'completada'
  fecha_entrega: string; // Viaja como "YYYY-MM-DD" para LocalDate
  prioridad: string; // 'Baja', 'Media', 'Alta'
}

const API_URL = "http://localhost:8080/api/tareas";

// ==========================================
// 2. TUS UTILIDADES DE CONEXIÓN EXACTAS CON AXIOS
// ==========================================

export const crearTarea = async (nuevaTarea: Tarea): Promise<Tarea> => {
  try {
    const response = await axios.post<Tarea>(`${API_URL}/crear`, nuevaTarea);
    return response.data;
  } catch (error: any) {
    console.error("Error en crear:", error);
    throw error;
  }
};

export const eliminarTarea = async (id: number): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/eliminar/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error en eliminar:", error);
    throw error;
  }
};

export const editarTarea = async (id: number, tareaEditada: Tarea): Promise<Tarea> => {
  try {
    const response = await axios.post<Tarea>(`${API_URL}/editar/${id}`, tareaEditada);
    return response.data;
  } catch (error: any) {
    console.error("Error en editar:", error);
    throw error;
  }
};

export const actualizarEstadoTarea = async (id: number, nuevoEstadoTexto: string): Promise<string> => {
  try {
    const bodyRequest = { estado: nuevoEstadoTexto }; // Mapea tu @RequestBody Tarea
    const response = await axios.post<string>(`${API_URL}/actualizar-estado/${id}`, bodyRequest);
    return response.data;
  } catch (error: any) {
    console.error("Error en actualizar-estado:", error);
    throw error;
  }
};

// ==========================================
// 3. TU INTERFAZ VISUAL (CollaboratorDashboard)
// ==========================================
export function CollaboratorDashboard() {
  const [tareas, setTareas] = useState<Tarea[]>([]); // Almacén de la BD
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Función para descargar las tareas reales usando Axios
    const cargarTareasDelServidor = async () => {
        try {
      // Definimos el usuario y proyecto fijos para las pruebas (por ejemplo, ID 1)
      const idUsuarioActual = 1; 
      const idProyectoActual = 1; 
      
      // Hacemos la petición apuntando a la estructura exacta de tu nuevo GetMapping
      const response = await axios.get<Tarea[]>(
        `http://localhost:8080/api/tareas/listar-tareas/${idUsuarioActual}/${idProyectoActual}`
      );
      
      setTareas(response.data);
    } catch (error) {
      console.error("Error al cargar las tareas síncronas del usuario:", error);
    }
  };

  // Esto arranca la carga de datos de Java en cuanto se abre la web
  useEffect(() => {
    cargarTareasDelServidor();
  }, []);

  // EL PUENTE REAL: Conecta el desplegable de la pantalla con tu @PostMapping("/actualizar-estado/{id}")
  const handleCambiarEstado = async (idTarea: number, nuevoEstado: string) => {
    try {
      await actualizarEstadoTarea(idTarea, nuevoEstado);
      alert("¡Estado guardado en la base de datos!");
      cargarTareasDelServidor(); // Volvemos a leer de la BD para refrescar los datos
    } catch (error) {
      alert("Error al actualizar el estado en el backend");
    }
  };

  // Filtrado de las tarjetas en base a lo que selecciones en los desplegables
  const tareasFiltradas = tareas.filter((t) => {
    if (filterStatus !== 'all' && t.estado !== filterStatus) return false;
    if (filterPriority !== 'all' && t.prioridad !== filterPriority) return false;
    return true;
  });

  // Cálculos automáticos para tus contadores del panel
  const stats = {
    total: tareas.length,
    todo: tareas.filter((t) => t.estado === 'por hacer').length,
    inProgress: tareas.filter((t) => t.estado === 'en progreso').length,
    completed: tareas.filter((t) => t.estado === 'completada').length,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <nav className="bg-white border-b p-4 mb-6 rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">📋 Panel de Control de Tareas</h1>
        <p className="text-xs text-gray-500">Conectado a Spring Boot en el puerto 8080</p>
      </nav>

      {/* RECUADROS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-yellow-600">Por Hacer</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.todo}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-blue-600">En Progreso</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-green-600">Completadas</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* BLOQUE DE FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 border border-gray-200">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-xl text-sm bg-white">
          <option value="all">Todos los estados</option>
          <option value="por hacer">Por Hacer</option>
          <option value="en progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="p-2 border rounded-xl text-sm bg-white">
          <option value="all">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      {/* REJILLA DE TARJETAS DE TAREAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tareasFiltradas.map((task) => (
          <div key={task.id_tarea} className="p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📌</span>
                <h3 className="font-bold text-gray-800 text-lg">{task.titulo}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{task.descripcion}</p>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-4">
                <span className="px-2 py-1 rounded-md font-semibold bg-gray-100 text-gray-700">
                  {task.prioridad}
                </span>
                <span className="text-gray-500 font-medium">
                  📅 {task.fecha_entrega}
                </span>
              </div>

              {/* EL SELECT QUE TRABAJA CON TU BACKEND */}
              <div className="border-t pt-3">
                <label className="block text-xs text-gray-400 mb-1 font-semibold">Cambiar estado en Base de Datos:</label>
                <select
                  value={task.estado}
                  // Al cambiar de opción, enviamos el ID de la fila y el nuevo string al método actestado de Java
                  onChange={(e) => handleCambiarEstado(task.id_tarea!, e.target.value)}
                  className="w-full p-2 border rounded-xl text-sm bg-gray-50 text-gray-700 font-medium focus:outline-none"
                >
                  <option value="por hacer">Por Hacer</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollaboratorDashboard;