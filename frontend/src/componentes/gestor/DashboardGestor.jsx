import { useEffect, useState } from "react";
import { useAuth } from "../../contexto/AuthContexto";
import Layout from "../layout/Layout";
import api from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function DashboardGestor() {
    const { nombre, id_usuario } = useAuth();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!id_usuario) return;

        api
            .get(`/proyectos/listar-proyectos/${id_usuario}`)
            .then((res) => setProjects(res.data))
            .catch((err) => console.error("Error cargando proyectos:", err));
    }, [id_usuario]);

    const fetchUsers = () => {
        api
            .get("/gestor/listar-usuarios-gestor")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error cargando usuarios:", err));
    };

    return (
        <Layout title="Gestión de Proyectos">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl">Mis Proyectos</h2>
                            <button
                                onClick={() => {
                                    setEditingProject(null);
                                    setShowProjectModal(true);
                                }}
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                                title="Crear proyecto"
                            >
                                <FontAwesomeIcon className="w-4 h-4" icon={faPlus} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            
                        </div>
                    </div>
                </div>

                {/* <div className="lg:col-span-2">
                    {selectedProject ? (
                        <ProjectDetails
                            project={myProjects.find((p) => p.id === selectedProject)!}
                            tasks={getTasksByProject(selectedProject)}
                            users={users}
                            onEditProject={(project) => {
                                setEditingProject(project);
                                setShowProjectModal(true);
                            }}
                            onDeleteProject={(projectId) => {
                                if (confirm('¿Estás seguro de eliminar este proyecto y todas sus tareas?')) {
                                    deleteProject(projectId);
                                    setSelectedProject(null);
                                }
                            }}
                            onCreateTask={() => {
                                setEditingTask(null);
                                setShowTaskModal(true);
                            }}
                            onEditTask={(task) => {
                                setEditingTask(task);
                                setShowTaskModal(true);
                            }}
                            onDeleteTask={(taskId) => {
                                if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                                    deleteTask(taskId);
                                }
                            }}
                            onUpdateTask={updateTask}
                            getStatusColor={getStatusColor}
                            getStatusLabel={getStatusLabel}
                            getPriorityColor={getPriorityColor}
                            getPriorityLabel={getPriorityLabel}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm p-12">
                            <div className="text-center text-muted-foreground">
                                <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg mb-2">Selecciona un proyecto</h3>
                                <p className="text-sm">Elige un proyecto de la lista para ver sus detalles y tareas</p>
                            </div>
                        </div>
                    )}
                </div> */}
            </div>
        </Layout>
    );
}