import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexto/AuthContexto'; // Usamos vuestro contexto igual que en el Login
import { actualizarEstadoTarea } from '../../services/tareaService'; // Importamos tu servicio independiente

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

  const handleCambiarEstado = async (idTarea, nuevoEstado) => {
    try {
      await actualizarEstadoTarea(idTarea, nuevoEstado);
      alert("¡Éxito! Estado modificado en la Base de Datos real.");
      cargarTareasDelServidor(); // Recargamos la lista directamente desde MySQL
    } catch (error) {
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
                <div className="flex justify-between items-center text-xs mb-4">
                  <span className="px-2 py-1 rounded-md font-semibold bg-gray-100 text-gray-700">{task.prioridad}</span>
                  <span className="text-gray-500 font-medium">📅 {task.fecha_entrega}</span>
                </div>

                <div className="border-t pt-3">
                  <label className="block text-xs text-gray-400 mb-1 font-semibold">Cambiar estado:</label>
                  <select
                    value={task.estado}
                    onChange={(e) => handleCambiarEstado(task.id_tarea, e.target.value)}
                    className="w-full p-2 border rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none"
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
      )}
    </div>
  );
}

export default CollaboratorDashboard;