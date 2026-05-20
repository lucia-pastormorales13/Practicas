import Swal from "sweetalert2";
import { useAuth } from "../../contexto/AuthContexto";
import api from "../../lib/api";
import Layout from "../layout/Layout";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CrearProyecto() {
    const { id_usuario } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const [dataForm, setDataForm] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_limite: "",
        estado: "",
        miembros: []
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api
            .get("/gestor/listar-usuarios-gestor")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error cargando usuarios:", err));
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        if (type === "checkbox" && name === "miembros") {
            setDataForm((prev) => ({
                ...prev,
                miembros: checked
                    ? [...prev.miembros, Number(value)]
                    : prev.miembros.filter((id) => id !== Number(value)),
            }));
            return;
        }

        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                nombre: dataForm.nombre,
                descripcion: dataForm.descripcion,
                fecha_inicio: dataForm.fecha_inicio,
                fecha_limite: dataForm.fecha_limite,
                estado: dataForm.estado,
                miembros: dataForm.miembros.map(Number)
            };

            const res = await api.post(
                `/gestor/crear/${id_usuario}`,
                payload
            );

            if (res.status >= 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Creado",
                    text: "Proyecto agregado exitosamente.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                setDataForm({
                    nombre: "",
                    descripcion: "",
                    fecha_inicio: "",
                    fecha_limite: "",
                    estado: "",
                    miembros: []
                });

                navigate("/gestor-proyectos-dashboard");
            }

        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Error al agregar el proyecto.",
            });
        }
    };

    return (
        <Layout title="Crear Proyecto">
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl max-w-5xl w-full mx-auto p-6 shadow-xl">
                    <h2 className="text-2xl mb-6 text-center">Crear Proyecto</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm mb-2">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={dataForm.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-xl"
                                required
                            />

                            <label className="block text-sm mt-3 mb-2">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={dataForm.descripcion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-xl min-h-[100px]"
                                required
                            />

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div>
                                    <label className="text-sm">Inicio</label>
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        value={dataForm.fecha_inicio}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-2 py-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm">Fin</label>
                                    <input
                                        type="date"
                                        name="fecha_limite"
                                        value={dataForm.fecha_limite}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-2 py-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Estado</label>
                            <select
                                name="estado"
                                value={dataForm.estado}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-2 py-2"
                            >
                                <option value="">Selecciona</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="finalizado">Finalizado</option>
                            </select>

                            <label className="block text-sm mt-3 mb-2">
                                Miembros del equipo
                            </label>

                            <div className="border rounded-xl p-2 max-h-40 overflow-y-auto">
                                {users
                                    .filter((u) => u.rol !== "administrador")
                                    .map((user) => (
                                        <label
                                            key={user.id_usuario}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                name="miembros"
                                                value={user.id_usuario}
                                                checked={dataForm.miembros.includes(Number(user.id_usuario))}
                                                onChange={handleChange}
                                            />
                                            <span>
                                                {user.nombre} ({user.correo})
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <Link
                                to="/gestor-proyectos-dashboard"
                                className="px-4 py-2 bg-gray-200 rounded-xl"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                            >
                                Crear
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Layout>
    );
}