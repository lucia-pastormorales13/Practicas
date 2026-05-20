import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../lib/api";

function Registrar() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasenia: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/registrar', {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                correo: formData.correo,
                contrasenia: formData.contrasenia,
            });
            console.log("Registration successful:", res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl mb-2">TaskApp</h1>
                        <p className="text-muted-foreground">Crea tu cuenta</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm mb-2">Nombre</label>
                            <div className="relative">
                                <input
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="tu nombre"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Apellidos</label>
                            <div className="relative">
                                <input
                                    name="apellidos"
                                    type="text"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="tus apellidos"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Correo electrónico</label>
                            <div className="relative">
                                <input
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    name="contrasenia"
                                    type="password"
                                    value={formData.contrasenia}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registrando...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ¿Tienes cuenta? <span className="text-blue-600 font-medium">Inicia sesión</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registrar;
