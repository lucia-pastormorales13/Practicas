import api from "../../lib/api";
import Layout from "../layout/Layout";
import { useState } from "react";

export default function CrearTarea() {
    const [dataForm, setDataForm] = useState({
        titulo: "",
        descripcion: "",
        prioridad: "",
        estado: "",
        fecha_entrega: ""
    });
    const [users, setUsers] = useState([]);

    const fetchUsuarios = () => {
        api.get("/gestor/listar-usuarios-gestor")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err))
    }

    return (
        <Layout titulo="Crear Tarea">
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
                    <h2 className="text-xl mb-6">Crear Tarea</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2">Título</label>
                            <input
                                type="text"
                                value={title}
                                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Descripción</label>
                            <textarea
                                value={description}
                                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">Prioridad</label>
                                <select
                                    value={priority}
                                    className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Estado</label>
                                <select
                                    value={status}
                                    className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="todo">Pendiente</option>
                                    <option value="in_progress">En Progreso</option>
                                    <option value="completed">Completado</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Asignar a</label>
                            <select
                                value={assignedTo}
                                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            >
                                <option value="">Seleccionar usuario</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id_usuario}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Fecha de entrega</label>
                            <input
                                type="date"
                                value={dueDate}
                                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}