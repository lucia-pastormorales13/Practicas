import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../contexto/AuthContexto"; // Ruta exacta de tu proyecto
import Logout from "../auth/Logout"; // Tu componente original de cierre de sesión
import api from "../../lib/api"; // Tu cliente de Axios configurado
import Layout from "../layout/Layout"; // Tu Layout global
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFolderOpen, 
    faListCheck, 
    faClock, 
    faCheckCircle, 
    faExclamationCircle, 
    faFilter, 
    faSyncAlt 
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function DashboardColaborador() {
    const { nombre, id_usuario } = useAuth();
    const currentUserId = id_usuario ? Number(id_usuario) : null;

    // Estados para los datos de la base de datos (Spring Boot)
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionadoId, setProyectoSeleccionadoId] = useState("");
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para los filtros reactivos en el Frontend
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");

    // 1. Obtener los proyectos a los que pertenece el colaborador al cargar la pantalla
    useEffect(() => {
        if (!currentUserId) return;

        setLoading(true);
        api.get(`/proyectos/listar-proyectos/${currentUserId}`)
            .then((res) => {
                setProyectos(res.data);
                // Si el colaborador está asignado a proyectos, seleccionamos el primero por defecto
                if (res.data.length > 0) {
                    setProyectoSeleccionadoId(res.data[0].id_proyecto);
                } else {
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error al obtener los proyectos del colaborador:", err);
                setLoading(false);
            });
    }, [currentUserId]);

    // 2. Obtener las tareas del usuario dentro del proyecto seleccionado mediante @PostMapping
    const fetchTareas = () => {
        if (!currentUserId || !proyectoSeleccionadoId) return;

        setLoading(true);
        api.post(`/tareas/listar-tareas/${currentUserId}/${proyectoSeleccionadoId}`)
            .then((res) => {
                setTareas(res.data);
            })
            .catch((err) => {
                console.error("Error al listar tareas de la base de datos:", err);
                setTareas([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Escucha el cambio de proyecto en el selector para traer sus respectivas tareas
    useEffect(() => {
        fetchTareas();
    }, [proyectoSeleccionadoId, currentUserId]);

    // 3. Actualizar el estado de una tarea específica en el TareaController.java
    const handleUpdateStatus = (idTarea, nuevoEstado) => {
        // Tu backend recibe un objeto Tarea con el campo modificado en la petición POST
        api.post(`/tareas/actualizar-estado/${idTarea}`, { estado: nuevoEstado })
            .then(() => {
                // Modificación en caliente del estado local de React para refrescar las tarjetas
                setTareas((prevTareas) =>
                    prevTareas.map((t) => t.id_tarea === idTarea ? { ...t, estado: nuevoEstado } : t)
                );

                Swal.fire({
                    icon: "success",
                    title: "¡Estado Sincronizado!",
                    text: "El progreso de la tarea ha sido actualizado en MySQL.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            })
            .catch((err) => {
                console.error("Error al actualizar el estado en el servidor:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error de sincronización",
                    text: "No se pudo guardar el cambio en el servidor.",
                });
            });
    };

    // Filtrado en caliente en el cliente (useMemo)
    const filteredTasks = useMemo(() => {
        return tareas.filter((task) => {
            const estadoTarea = task.estado?.toLowerCase() || "";
            const prioridadTarea = task.prioridad?.toLowerCase() || "media";

            if (filterStatus !== "all" && estadoTarea !== filterStatus.toLowerCase()) return false;
            if (filterPriority !== "all" && prioridadTarea !== filterPriority.toLowerCase()) return false;
            return true;
        });
    }, [tareas, filterStatus, filterPriority]);

    // Métricas operativas calculadas en base a las tareas del proyecto activo
    const stats = useMemo(() => {
        return {
            total: tareas.length,
            todo: tareas.filter((t) => t.estado?.toLowerCase() === "pendiente" || t.estado?.toLowerCase() === "todo").length,
            inProgress: tareas.filter((t) => t.estado?.toLowerCase() === "en_progreso" || t.estado?.toLowerCase() === "in_progress").length,
            completed: tareas.filter((t) => t.estado?.toLowerCase() === "completado" || t.estado?.toLowerCase() === "completed").length,
        };
    }, [tareas]);

    // Mapeos visuales de colores y estilos de las tarjetas
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pendiente": case "todo": return "border-l-yellow-500 bg-yellow-50/40 text-yellow-900";
            case "en_progreso": case "in_progress": return "border-l-blue-500 bg-blue-50/40 text-blue-900";
            case "completado": case "completed": return "border-l-green-500 bg-green-50/40 text-green-900";
            default: return "border-l-gray-300 bg-gray-50";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pendiente": case "todo": return faExclamationCircle;
            case "en_progreso": case "in_progress": return faClock;
            case "completado": case "completed": return faCheckCircle;
            default: return faExclamationCircle;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "baja": case "low": return "bg-gray-100 text-gray-700 border border-gray-200";
            case "media": case "medium": return "bg-orange-100 text-orange-700 border border-orange-200";
            case "alta": case "high": return "bg-red-100 text-red-700 border border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const proyectoActualNombre = proyectos.find(p => p.id_proyecto === Number(proyectoSeleccionadoId))?.nombre || "Proyecto Activo";

    return (
        <Layout>
  
            {/* Fichas de Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faListCheck} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Asignadas</p>
                        <p className="text-xl font-extrabold text-gray-800">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Pendientes</p>
                        <p className="text-xl font-extrabold text-gray-800">{stats.todo}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">En Progreso</p>
                        <p className="text-xl font-extrabold text-gray-800">{stats.inProgress}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Completadas</p>
                        <p className="text-xl font-extrabold text-gray-800">{stats.completed}</p>
                    </div>
                </div>
            </div>

            {/* Barra de Filtros y Control de Proyectos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        
                        {/* Selector de Proyectos Asignados */}
                        <div className="w-full lg:w-auto">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Proyecto Seleccionado</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={proyectoSeleccionadoId}
                                    onChange={(e) => setProyectoSeleccionadoId(e.target.value)}
                                    className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[240px]"
                                >
                                    {proyectos.length === 0 ? (
                                        <option value="">No tienes proyectos asignados</option>
                                    ) : (
                                        proyectos.map((p) => (
                                            <option key={p.id_proyecto} value={p.id_proyecto}>
                                                📁 {p.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <button 
                                    onClick={fetchTareas} 
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100 cursor-pointer"
                                    title="Sincronizar Tareas"
                                >
                                    <FontAwesomeIcon icon={faSyncAlt} className={loading ? "fa-spin text-blue-600" : ""} />
                                </button>
                            </div>
                        </div>

                        {/* Filtros de Estado y Prioridad */}
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-xs" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 focus:outline-none cursor-pointer"
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en_progreso">En Progreso</option>
                                    <option value="completado">Completado</option>
                                </select>
                            </div>

                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 focus:outline-none cursor-pointer"
                            >
                                <option value="all">Todas las prioridades</option>
                                <option value="high">Alta</option>
                                <option value="medium">Media</option>
                                <option value="low">Baja</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sección de Tarjetas de Tareas */}
                <div className="p-6 bg-gray-50/30 min-h-[320px] rounded-b-2xl">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400 text-xs">
                            <FontAwesomeIcon icon={faSyncAlt} className="fa-spin text-blue-500 text-2xl mb-2" />
                            <p>Sincronizando con el servidor...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <FontAwesomeIcon icon={faListCheck} className="text-3xl mb-3 opacity-25 text-blue-500" />
                            <h3 className="text-sm font-bold text-gray-700">Sin tareas registradas</h3>
                            <p className="text-xs mt-1 max-w-xs mx-auto">
                                {filterStatus !== "all" || filterPriority !== "all"
                                    ? "No se encontraron tareas que coincidan con los filtros aplicados."
                                    : "No se encontraron actividades asignadas a tu cuenta bajo este proyecto."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredTasks.map((task) => {
                                const stringFecha = task.fecha_limite || "";
                                const isOverdue = stringFecha && new Date(stringFecha) < new Date() && task.estado?.toLowerCase() !== "completado";

                                return (
                                    <div 
                                        key={task.id_tarea} 
                                        className={`bg-white rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md border-gray-100 border-l-4 ${getStatusColor(task.estado)}`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-start gap-2.5">
                                                <div className="p-2 rounded-xl bg-white shadow-xs border border-gray-100 text-gray-600 text-xs">
                                                    <FontAwesomeIcon icon={getStatusIcon(task.estado)} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate" title={task.nombre}>
                                                        {task.nombre}
                                                    </h3>
                                                    <p className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                                                        <FontAwesomeIcon icon={faFolderOpen} className="text-gray-300 text-[10px]" />
                                                        {proyectoActualNombre}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8 leading-relaxed">
                                            {task.descripcion || "Esta tarea no incluye una descripción detallada."}
                                        </p>

                                        <div className="flex items-center justify-between gap-2 mb-4 bg-gray-50/80 p-2 rounded-xl border border-gray-100/50">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getPriorityColor(task.prioridad)}`}>
                                                {task.prioridad || "Media"}
                                            </span>
                                            <div className={`flex items-center gap-1 text-[11px] font-medium ${isOverdue ? "text-red-600 font-bold" : "text-gray-500"}`}>
                                                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                <span>{task.fecha_limite || "Sin fecha"}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Reportar Progreso</label>
                                            <select
                                                value={task.estado || "pendiente"}
                                                onChange={(e) => handleUpdateStatus(task.id_tarea, e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="en_progreso">En Progreso</option>
                                                <option value="completado">Completado</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default DashboardColaborador;