import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexto/AuthContexto'; // Usamos vuestro contexto igual que en el Login

export function CollaboratorDashboard() {
  const [tareas, setTareas] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(true);

  // EXTRAEMOS EL ID DEL USUARIO REAL LOGUEADO (Gracias a vuestro AuthContexto)
  const { usuario } = useAuth(); 
  const idUsuarioReal = usuario?.id_usuario;

  // Llama a vuestro nuevo método del controlador de Java
  const cargarTareasDelServidor = async () => {
    if (!idUsuarioReal) return; // Si no hay usuario logueado, no hace la petición todavía

    try {
      setLoading(true);
      const idProyectoActual = 1; // ID del proyecto (podéis cambiarlo o capturarlo según vuestro flujo)
      
      // Apunta exactamente al GetMapping simétrico al de proyectos que acabamos de hacer
      const response = await axios.get(
        `http://localhost:8080/api/tareas/listar-tareas/usuario/${idUsuarioReal}/proyecto/${idProyectoActual}`
      );
      
      if (response.data) {
        setTareas(response.data);
      }
    } catch (error) {
      console.error("Error al cargar las tareas del usuario logueado:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta automáticamente al entrar o cuando detecta el ID del usuario logueado
  useEffect(() => {
    cargarTareasDelServidor();
  }, [idUsuarioReal]);

  // FUNCIONALIDAD: Sincronizar el cambio de estado con el backend de Java (Mapeado con @RequestBody Tarea)
  const handleCambiarEstado = async (idTarea, nuevoEstadoTexto) => {
    try {
      // Estructura idéntica que mapea el @RequestBody Tarea en Spring Boot
      const payload = {
        id_tarea: idTarea,
        estado: nuevoEstadoTexto // Debe coincidir con EstadoTarea.java ('por_hacer', 'en_progreso' o 'Completada')
      };

      // Petición POST al endpoint de tu TareaController
      await axios.post(`http://localhost:8080/api/tareas/actualizar-estado/${idTarea}`, payload);

      // Modificamos el estado de React en caliente para renderizar el cambio visual inmediato sin recargar
      setTareas((prevTareas) =>
        prevTareas.map((t) => t.id_tarea === idTarea ? { ...t, estado: nuevoEstadoTexto } : t)
      );

    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
      alert("No se pudo actualizar el estado en el backend");
    }
  };

  // Filtrado de tarjetas
  const tareasFiltradas = tareas.filter((t) => {
    if (filterStatus !== 'all' && t.estado !== filterStatus) return false;
    if (filterPriority !== 'all' && t.prioridad !== filterPriority) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <nav className="bg-white border-b p-4 mb-6 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">📋 Panel de Tareas de {usuario?.nombre || 'Colaborador'}</h1>
          <p className="text-xs text-gray-500">Conexión dinámica por ID de Sesión: {idUsuarioReal || 'No detectado'}</p>
        </div>
      </nav>

      {/* FILTROS DESPLEGABLES */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 border border-gray-200">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-xl text-sm bg-white">
          <option value="all">Todos los estados</option>
          <option value="por_hacer">Por Hacer</option>
          <option value="en_progreso">En Progreso</option>
          <option value="Completada">Completada</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="p-2 border rounded-xl text-sm bg-white">
          <option value="all">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      {/* RENDERIZADO SÍNCRONO */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Buscando tareas del usuario en MySQL...</div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No hay tareas asignadas para tu usuario en este proyecto.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasFiltradas.map((task) => (
            <div key={task.id_tarea} className="p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">📌 {task.titulo}</h3>
                <p className="text-sm text-gray-600 mb-4">{task.descripcion}</p>
              </div>

              <div>
                {/* LÍNEA DE DISEÑO UNIFICADA: Prioridad y Selector de Estado alineados lado a lado */}
                <div className="flex justify-between items-center gap-2 text-xs mb-4 pt-3 border-t">
                  
                  {/* Prioridad (Lado Izquierdo) */}
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 rounded-md font-semibold bg-gray-100 text-gray-700">
                      {task.prioridad}
                    </span>
                  </div>

                  {/* Selector de Estado (Lado Derecho, justo al lado de la prioridad) */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={task.estado || "por_hacer"}
                      onChange={(e) => handleCambiarEstado(task.id_tarea, e.target.value)}
                      className="p-1.5 px-2 border border-gray-200 rounded-xl text-xs bg-gray-50 font-bold text-gray-700 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <option value="por_hacer">⏳ Por Hacer</option>
                      <option value="en_progreso">🔄 En Progreso</option>
                      <option value="Completada">✅ Completada</option>
                    </select>
                  </div>
                </div>

                {/* Fecha de entrega (Abajo) */}
                <div className="flex justify-end text-xs text-gray-500 font-medium">
                  <span>📅 {task.fecha_entrega}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollaboratorDashboard;