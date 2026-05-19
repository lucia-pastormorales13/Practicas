import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    estaIniciadoSesion: false,
    nombre: null,
    rol: null,
    token: null,
    id_usuario: null,
  });

  useEffect(() => {
    const estaIniciadoSesion = localStorage.getItem("loggedIn") === "true";
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");
    const id_usuario = localStorage.getItem("id_usuario");

    if (estaIniciadoSesion && nombre && rol && token && id_usuario) {
      setAuth({ estaIniciadoSesion, nombre, rol, token, id_usuario });
    }
  }, []);

  const login = ({ nombre, rol, token, id_usuario }) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("rol", rol);
    if (token) {
      localStorage.setItem("token", token);
    }
    if (id_usuario !== undefined && id_usuario !== null) {
      localStorage.setItem("id_usuario", String(id_usuario));
    }

    setAuth({ estaIniciadoSesion: true, nombre, rol, token, id_usuario });
  };

  const logout = () => {
    localStorage.clear();

    setAuth({
      estaIniciadoSesion: false,
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