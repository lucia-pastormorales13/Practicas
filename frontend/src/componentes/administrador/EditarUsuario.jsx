import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import api from "../../lib/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditarUsuario() {
    const navigate = useNavigate();
    const { id_usuario } = useParams();
    const [message, setMessage] = useState('');

    const [dataForm, setDataForm] = useState({
        nombre: "",
        apellidos: "",
        correo: "",
        rol: ""
    });

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await api.get(`/admin/get-usuario/${id_usuario}`);
                if (response.status === 200) {
                    const data = response.data;
                    setDataForm({
                        nombre: data.nombre || "",
                        apellidos: data.apellidos || "",
                        correo: data.correo || "",
                        rol: data.rol || "",
                    });
                } else {
                    setMessage("Error al buscar el usuario.");
                    console.error("Error al buscar el usuario:", response.statusText);
                }
            } catch (error) {
                setMessage("Error del servidor.");
                console.error("Error del servidor:", error);
            }
        };
        fetchUsuario();
    }, [id_usuario]);

    const handleChange = (e) => {
        setDataForm({ ...dataForm, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admin/editar-usuario/${id_usuario}`, dataForm);
            if (response.status === 200) {
                setMessage("Usuario actualizado exitosamente!");
                await Swal.fire({
                    icon: "success",
                    title: "Actualizado",
                    text: "El usuario se actualizó correctamente.",
                    timer: 1700,
                    showConfirmButton: false,
                });
                navigate("/administrador-dashboard");
            } else {
                const errorMsg = response.data?.message || "Error al actualizar el usuario.";
                setMessage(errorMsg);
                await Swal.fire({ icon: "error", title: "Error", text: errorMsg });
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Error del servidor.";
            setMessage(errorMsg);
            await Swal.fire({ icon: "error", title: "Error", text: errorMsg });
        }
    };

    return (
        <Layout title="Editar Usuario">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto p-6 shadow-xl">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Editar Usuario</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ingrese el nombre"
                            value={dataForm.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Ingrese los apellidos"
                            value={dataForm.apellidos}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="ejemplo@gmail.com"
                            value={dataForm.correo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Rol</label>
                        <select
                            name="rol"
                            value={dataForm.rol}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="administrador">Administrador</option>
                            <option value="gestor_proyectos">Gestor de Proyectos</option>
                            <option value="colaborador">Colaborador</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Link to='/administrador-dashboard' onClick={() => setDataForm({ nombre: "", apellidos: "", correo: "", contrasenia: "", rol: "" })} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-center">Cancelar</Link>

                        <button type="submit" className="flex-1 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">Editar Usuario</button>
                    </div>

                </form>
            </div>
        </Layout>
    );
}