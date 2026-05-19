import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContexto";
import api from "../../lib/api";

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/iniciar-sesion', { correo, contrasenia });
      const { token, rol, nombre, id_usuario, error: loginError } = res.data;

      if (loginError) {
        setError(loginError);
        return;
      }

      // Call context login (handles state and localStorage)
      login({ token, rol, nombre, id_usuario });

      // Navigate based on role
      switch (rol?.toLowerCase()) {
        case 'administrador':
          navigate('/administrador-dashboard');
          break;
        case 'gestor_proyectos':
          navigate('/gestor-proyectos-dashboard');
          break;
        case 'colaborador':
          navigate('/colaborador-dashboard');
          break;
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Credentials are incorrect");
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
            <p className="text-muted-foreground">
              Inicia sesión en tu cuenta
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
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
                  type="password"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
                  Iniciar sesión
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/registrar"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿No tienes cuenta? <span className="text-blue-600 font-medium">Regístrate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;