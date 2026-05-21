import { useEffect, useState } from "react";
import { useAuth } from "../../contexto/AuthContexto";
import Layout from "../layout/Layout";
import api from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faChevronRight, faClock, faFolderMinus, faFolderOpen, faList, faPenToSquare, faPlus, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function DashboardGestor() {
    const { nombre, id_usuario } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [miembros, setMiembros] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!id_usuario) return;

        api
            .get(`/proyectos/listar-proyectos/${id_usuario}`)
            .then((res) => {
                console.log("Projects response:", res.data);

                if (Array.isArray(res.data)) {
                    setProjects(res.data);
                } else {
                    setProjects([]);
                }
            })
            .catch((err) => {
                console.error("Error cargando proyectos:", err);
                setProjects([]);
            });
    }, [id_usuario]);

    useEffect(() => {
        projects.forEach((p) => {
            api.get(`/proyectos/miembros/${p.id_proyecto}`)
                .then((res) => {
                    setMiembros(prev => ({
                        ...prev,
                        [p.id_proyecto]: res.data
                    }));
                });
        });
    }, [projects]);

    const fetchUsers = () => {
        api
            .get("/gestor/listar-usuarios-gestor")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error cargando usuarios:", err));
    };

    const fecthTareas = async (id_proyecto) => {
        try {
            const res = await api.get(`/listar-tareas/${id_usuario}/${id_proyecto}`);
            setTasks(res.data);
        } catch (error) {
            console.error("Error cargando tareas:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-700';
            case 'en_progreso':
                return 'bg-blue-100 text-blue-700';
            case 'finalizado':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const projectList = Array.isArray(projects) ? projects : [];

    const handleDeleteProject = async (id, nombreProyecto) => {
        const result = await Swal.fire({
            title: `Eliminar ${nombreProyecto}?`,
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await api.delete(`/gestor/eliminar/${id}`);
            if (res.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Proyecto eliminado exitosamente.",
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data?.message || "Error al eliminar el proyecto.",
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error del servidor",
                text: "No se pudo eliminar el proyecto.",
            });
            console.error("Error borrando proyecto:", error);
        }

    };

    return (
        <Layout title="Gestión de Proyectos">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl">Mis Proyectos</h2>
                            <Link
                                to="/crear-proyecto"
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                                title="Crear proyecto"
                            >
                                <FontAwesomeIcon className="w-4 h-4" icon={faPlus} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {projectList.length == 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FontAwesomeIcon icon={faFolderMinus} className="text-3xl mx-auto mb-3 opacity-20" />
                                    <p className="text-sm opacity-40">No tienes proyectos</p>
                                    <p className="text-xs opacity-50">Crea tu primer proyecto</p>
                                </div>
                            ) : (
                                projectList.map((p) => (
                                    <button
                                        key={p.id_proyecto}
                                        onClick={() => setSelectedProject(p)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedProject?.id_proyecto === p.id_proyecto
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{p.nombre}</h3>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {p.descripcion}
                                                </p>
                                            </div>
                                            <FontAwesomeIcon icon={faChevronRight} className={`w-5 h-5 flex-shrink-0 transition-transform ${selectedProject?.id_proyecto === p.id_proyecto ? 'rotate-90' : ''}`} />
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(p.estado)}`}>
                                                {p.estado}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <FontAwesomeIcon icon={faList} className="w-3 h-3" />
                                                {p.id_proyecto}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedProject ? (
                        <div className="bg-white rounded-2xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl mb-2">{selectedProject.nombre}</h2>
                                        <p className="text-mauve-400">{selectedProject.descripcion}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/editar-proyecto/${selectedProject.id_proyecto}`}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            title="Editar proyecto"
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProject(selectedProject.id_proyecto, selectedProject.nombre)}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            title="Eliminar proyecto"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon className="text-mauve-400 text-xl" icon={faCalendar} />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Inicio</p>
                                            <p>{selectedProject.fecha_inicio}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon className="text-mauve-400 text-xl" icon={faClock} />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Fin</p>
                                            <p>{selectedProject.fecha_limite}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon className="text-mauve-400 text-xl" icon={faUser} />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Miembros</p>
                                            {miembros[selectedProject.id_proyecto] || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg">Tareas</h3>
                                    <Link
                                        to={`/crear-tarea/${selectedProject.id_proyecto}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                        Nueva Tarea
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {tasks.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FontAwesomeIcon icon={faList} className="text-xl p-2 opacity-50" />
                                            <p className="text-sm">No hay tareas en este proyecto</p>
                                        </div>
                                    ) : (
                                        tasks.map((task) => {
                                            const assignedUser = users.find((u) => u.id_usuario === task.id_proyecto);
                                            return (
                                                <div key={task.id_tarea} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium mb-1">{task.titulo}</h4>
                                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.descripcion}</p>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <select
                                                                    value={task.estado}
                                                                    className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(task.estado)}`}
                                                                >
                                                                    <option value="todo">Pendiente</option>
                                                                    <option value="in_progress">En Progreso</option>
                                                                    <option value="completed">Completado</option>
                                                                </select>
                                                                <span className={`text-xs px-2 py-1 rounded-full }`}>
                                                                    {getPriorityLabel(task.prioridad)}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    Vence: {task.fecha_entrega}
                                                                </span>
                                                                {/* {assignedUser && (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        Asignado: {assignedUser.name}
                                                                    </span>
                                                                )} */}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1 flex-shrink-0">
                                                            <button
                                                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm p-12">
                            <div className="text-center text-muted-foreground">
                                <FontAwesomeIcon icon={faFolderOpen} className="text-3xl mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg mb-2 opacity-40">Selecciona un proyecto</h3>
                                <p className="text-sm opacity-50">Elige un proyecto de la lista para ver sus detalles y tareas</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}