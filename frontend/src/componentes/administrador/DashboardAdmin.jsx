import { useEffect, useState } from "react";
import { useAuth } from "../../contexto/AuthContexto";
import Logout from "../auth/Logout";
import api from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faListCheck, faPenToSquare, faTrashCan, faUser, faShieldAlt, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Layout from "../layout/Layout";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function DashboardAdmin() {
    const { nombre, id_usuario } = useAuth();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    const currentUserId = id_usuario ? Number(id_usuario) : null;

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
            .get("/admin/listar-usuarios")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error cargando usuarios:", err));
    };

    const deleteUser = async (userId, userName) => {
        const result = await Swal.fire({
            title: `Eliminar ${userName}?`,
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
            const response = await api.delete(`/admin/borrar-usuario/${userId}`);
            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Usuario eliminado exitosamente.",
                    timer: 1800,
                    showConfirmButton: false,
                });
                fetchUsers();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data?.message || "Error al eliminar el usuario.",
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error del servidor",
                text: "No se pudo eliminar el usuario.",
            });
            console.error("Error borrando usuario:", error);
        }
    };

    const activeProjects = projects.filter((p) => p.estado === "pendiente").length;
    const completedTasks = projects.reduce(
        (sum, project) => sum + (project.tareas?.filter((task) => task.estado === "completada").length || 0),
        0
    );

    const getRolIcon = (rol) => {
        const iconMap = {
            administrador: faShieldAlt,
            gestor_proyectos: faClipboardList,
            colaborador: faUser,
        };

        const colorClass =
            rol === "administrador"
                ? "text-red-500"
                : rol === "gestor_proyectos"
                    ? "text-yellow-500"
                    : rol === "colaborador"
                        ? "text-green-500"
                        : "text-slate-400";

        const icon = iconMap[rol] || faUser;
        return (props) => <FontAwesomeIcon icon={icon} {...props} className={`${props.className ?? ""} ${colorClass}`} />;
    };

    const getRolLabel = (rol) => {
        if (!rol) return "Sin rol";
        if (rol === "administrador") return "Administrador";
        if (rol === "gestor_proyectos") return "Gestor de Proyectos";
        if (rol === "colaborador") return "Colaborador";
        return rol;
    };

    const getRolBadgeColor = (rol) => {
        if (rol === "administrador") return "bg-red-100 text-red-700";
        if (rol === "gestor_proyectos") return "bg-yellow-100 text-yellow-700";
        if (rol === "colaborador") return "bg-green-100 text-green-700";
        return "bg-slate-100 text-slate-700";
    };

    const stats = [
        { label: "Proyectos Activos", value: activeProjects, icon: faFolderOpen, color: "from-blue-500 to-blue-600" },
        { label: "Tareas Completadas", value: completedTasks, icon: faListCheck, color: "from-green-500 to-green-600" },
        { label: "Usuarios Registrados", value: users.length, icon: faUser, color: "from-purple-500 to-purple-600" },
    ];

    return (
        <Layout title="Panel de Administración">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center text-white`}
                            >
                                <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl">Gestión de Usuarios</h2>
                        <p className="text-sm text-muted-foreground">Administra todos los usuarios del sistema</p>
                    </div>
                    <Link to='/crear-usuario'
                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <span className="text-base">+</span>
                        Crear Usuario
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm">Usuario</th>
                                <th className="text-left px-6 py-4 text-sm hidden md:table-cell">Email</th>
                                <th className="text-left px-6 py-4 text-sm">Rol</th>
                                <th className="text-left px-6 py-4 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => {
                                const RolIcon = getRolIcon(user.rol);
                                return (
                                    <tr key={user.id_usuario} className="hover:bg-muted/20">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                                    {user.nombre?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.nombre}</p>
                                                    <p className="text-sm text-muted-foreground md:hidden">{user.correo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                                            {user.correo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${getRolBadgeColor(user.rol)}`}>
                                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                                                    <RolIcon className="h-3 w-3" />
                                                </span>
                                                {getRolLabel(user.rol)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/editar-usuario/${user.id_usuario}`}
                                                    className="p-2 cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="text-sm"><FontAwesomeIcon icon={faPenToSquare} /></span>
                                                </Link>
                                                {user.id_usuario !== currentUserId && (
                                                    <button
                                                        onClick={() => deleteUser(user.id_usuario, user.nombre)}
                                                        className="p-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <span className="text-sm"><FontAwesomeIcon icon={faTrashCan} /></span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

export default DashboardAdmin;