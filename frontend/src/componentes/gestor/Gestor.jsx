import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Logout from '../auth/Logout';
import { 
  obtenerProyectosPorUsuario, 
  crearProyectoReal, 
  editarProyectoReal, 
  eliminarProyectoReal
} from './GestorS';
import { useAuth } from '../../contexto/AuthContexto';

export default function ManagerDashboard() {
  const { currentUser, logout } = useAuth(); // Extraemos los datos del usuario autenticado
  const idGestorLogueado = currentUser?.id_usuario;

  // Estados locales en JavaScript puro
  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para sincronizar la lista de proyectos con Spring Boot (MySQL)
  const cargarProyectosBackend = async () => {
    if (!idGestorLogueado) return;
    try {
      setLoading(true);
      const data = await obtenerProyectosPorUsuario(idGestorLogueado);
      setProyectos(data);
    } catch (error) {
      console.error("Error cargando los proyectos desde el servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectosBackend();
  }, [idGestorLogueado]);

  // Manejadores CRUD reales
  const handleSaveProject = async (proyectoData) => {
    if (!idGestorLogueado) return;
    try {
      if (editingProject && editingProject.id_proyecto) {
        await editarProyectoReal(editingProject.id_proyecto, proyectoData);
        alert("¡Proyecto modificado con éxito en la base de datos!");
      } else {
        await crearProyectoReal(proyectoData, idGestorLogueado);
        alert("¡Proyecto creado e insertado con éxito!");
      }
      cargarProyectosBackend(); // Recargar la lista fresca desde MySQL
      setShowProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      alert("Error al procesar la operación en el servidor");
    }
  };

  const handleDeleteProject = async (idProyecto) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto de manera permanente?')) {
      try {
        await eliminarProyectoReal(idProyecto);
        alert("Proyecto eliminado correctamente.");
        if (selectedProject === idProyecto) setSelectedProject(null);
        cargarProyectosBackend();
      } catch (error) {
        alert("No se pudo eliminar el proyecto");
      }
    }
  };º

  // Selectores visuales de estados (Filtro limpio)
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': case 'todo': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': case 'todo': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return status || 'Sin Estado';
    }
  };

  const proyectoSeleccionadoActual = proyectos.find((p) => p.id_proyecto === selectedProject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* BARRA DE NAVEGACIÓN */}
      <nav className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Panel de Gestión de Proyectos</h1>
            <p className="text-xs text-gray-500">Bienvenido/a, {currentUser?.nombre || 'Gestor'}</p>
          </div>
          <Logout onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"/>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SECCIÓN IZQUIERDA: LISTA */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Mis Proyectos</h2>
                <button
                  onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  add
                </button>
              </div>

              {loading ? (
                <div className="text-center py-6 text-gray-400 text-sm">Cargando base de datos MySQL...</div>
              ) : proyectos.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No tienes proyectos asignados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {proyectos.map((project) => (
                    <button
                      key={project.id_proyecto}
                      onClick={() => setSelectedProject(project.id_proyecto)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedProject === project.id_proyecto
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="truncate">
                          <h3 className="font-bold text-gray-800 text-sm truncate">{project.nombre}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">{project.descripcion}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(project.estado)}`}>
                          {getStatusLabel(project.estado)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN DERECHA: DETALLES */}
          <div className="lg:col-span-2">
            {proyectoSeleccionadoActual ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{proyectoSeleccionadoActual.nombre}</h2>
                    <p className="text-sm text-gray-600 mt-1">{proyectoSeleccionadoActual.descripcion}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProject(proyectoSeleccionadoActual); setShowProjectModal(true); }}
                      className="p-2 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proyectoSeleccionadoActual.id_proyecto)}
                      className="p-2 bg-gray-50 hover:bg-red-50 text-red-600 rounded-lg transition-colors border"
                    >
                      delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    calendario
                    <div>
                      <p className="font-semibold text-gray-400">FECHA INICIO</p>
                      <p className="text-gray-700 font-medium">{proyectoSeleccionadoActual.fecha_inicio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    time
                    <div>
                      <p className="font-semibold text-gray-400">FECHA LÍMITE</p>
                      <p className="text-gray-700 font-medium">{proyectoSeleccionadoActual.fecha_limite}</p>
                    </div>
                  </div>
                </div>

                {/* ENLACE DIRECTO COMPATIBLE CON EL MÓDULO DE TAREAS */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1">
                        Tareas Asociadas
                      </h4>
                      <p className="text-xs text-blue-700 mt-0.5">Asigna y gestiona las actividades operativas de este proyecto desde la sección de tareas.</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-200 text-center text-gray-400">
                carpeta
                <h3 className="text-base font-semibold text-gray-700 mb-1">Ningún proyecto seleccionado</h3>
                <p className="text-xs">Elige un elemento del panel de la izquierda para ver su información extendida.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DIÁLOGO MODAL */}
      {/*{showProjectModal && (
        <ProjectModalForm
          project={editingProject}
          onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
          onSave={handleSaveProject}
        />
      )}*/}
    </div>
  );
}

// Formulario del Modal Limpio en JavaScript
function ProjectModalForm({ project, onClose, onSave }) {
  const [nombre, setNombre] = useState(project ? project.nombre : '');
  const [descripcion, setDescripcion] = useState(project ? project.descripcion : '');
  const [fechaInicio, setFechaInicio] = useState(project ? project.fecha_inicio : '');
  const [fechaLimite, setFechaLimite] = useState(project ? project.fecha_limite : '');
  const [estado, setEstado] = useState(project ? project.estado : 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      nombre,
      descripcion,
      fecha_inicio: fechaInicio,
      fecha_limite: fechaLimite,
      estado
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
        <h2 className="text-base font-bold text-gray-800 mb-4">{project ? '✏️ Editar Proyecto' : '📂 Registrar Nuevo Proyecto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre del Proyecto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded-xl text-sm bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción General</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded-xl text-sm bg-gray-50 min-h-[70px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-2 border rounded-xl text-sm bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha Límite</label>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="w-full p-2 border rounded-xl text-sm bg-gray-50"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full p-2 border rounded-xl text-sm bg-gray-50 text-gray-700"
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2 text-sm">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              {project ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}