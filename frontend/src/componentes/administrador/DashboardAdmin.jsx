import { useEffect, useState } from "react";
import { useAuth } from "../../contexto/AuthContexto";
import Logout from "../auth/Logout";
import api from "../../lib/api";

function DashboardAdmin() {
  const { nombre, id_usuario } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/borrar-usuario/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error borrando usuario:", error);
    }
  };

  const activeProjects = projects.filter((p) => p.estado === "pendiente").length;
  const completedTasks = projects.reduce(
    (sum, project) => sum + (project.tareas?.filter((task) => task.estado === "completada").length || 0),
    0
  );

  const getRoleIcon = (role) => {
    const colorClass =
      role === "administrador"
        ? "bg-red-500"
        : role === "gestor_proyectos"
        ? "bg-yellow-500"
        : role === "colaborador"
        ? "bg-green-500"
        : "bg-slate-400";

    return (props) => <span {...props} className={`${props.className ?? ""} inline-flex h-3.5 w-3.5 rounded-full ${colorClass}`} />;
  };

  const getRoleLabel = (role) => {
    if (!role) return "Sin rol";
    if (role === "administrador") return "Administrador";
    if (role === "gestor_proyectos") return "Gestor de Proyectos";
    if (role === "colaborador") return "Colaborador";
    return role;
  };

  const getRoleBadgeColor = (role) => {
    if (role === "administrador") return "bg-red-100 text-red-700";
    if (role === "gestor_proyectos") return "bg-yellow-100 text-yellow-700";
    if (role === "colaborador") return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-700";
  };

  const stats = [
    { label: "Proyectos Activos", value: activeProjects, color: "from-blue-500 to-blue-600" },
    { label: "Tareas Completadas", value: completedTasks, color: "from-green-500 to-green-600" },
    { label: "Usuarios Registrados", value: users.length, color: "from-purple-500 to-purple-600" },
  ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <nav className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl">Panel de Administración</h1>
                            <p className="text-sm text-muted-foreground">Bienvenido, {nombre}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            <Logout />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color}`} />
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
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            <span className="text-base">+</span>
                            Crear Usuario
                        </button>
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
                                    const RoleIcon = getRoleIcon(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-muted/20">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground md:hidden">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                                                    <RoleIcon className="w-3.5 h-3.5" />
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="text-sm">✏️</span>
                                                    </button>
                                                    {user.id !== currentUserId && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('¿Estás seguro de eliminar este usuario?')) {
                                                                    deleteUser(user.id);
                                                                }
                                                            }}
                                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <span className="text-sm">🗑️</span>
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
            </div>
        </div>
    );
}

export default DashboardAdmin;