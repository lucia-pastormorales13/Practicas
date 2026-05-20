import { useContext, useState, createContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");
    const id_usuario = localStorage.getItem("id_usuario");

    return {
      isLoggedIn,
      nombre,
      rol,
      token,
      id_usuario,
    };
  });

  const login = ({ nombre, rol, token, id_usuario }) => {
    localStorage.setItem("loggedIn", "true");
    if (nombre) localStorage.setItem("nombre", nombre);
    if (rol) localStorage.setItem("rol", rol);
    if (token) localStorage.setItem("token", token);
    if (id_usuario !== undefined && id_usuario !== null) {
      localStorage.setItem("id_usuario", String(id_usuario));
    }

    setAuth({ isLoggedIn: true, nombre, rol, token, id_usuario });
  };

  const logout = () => {
    // clear the same keys we set at login
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("nombre");
    localStorage.removeItem("rol");
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");

    setAuth({
      isLoggedIn: false,
      nombre: null,
      rol: null,
      token: null,
      id_usuario: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}