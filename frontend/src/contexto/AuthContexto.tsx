import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    estaIniciadoSesion: true,
    nombre: null,
    rol: null,
  });

  useEffect(() => {
    const estaIniciadoSesion = localStorage.getItem("loggedIn") === "true";
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");

    if (estaIniciadoSesion && nombre && rol) {
      setAuth({ estaIniciadoSesion, nombre, rol });
    }
  }, []);

  const login = ({ nombre, rol }) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("rol", rol);

    setAuth({ estaIniciadoSesion: true, nombre, rol });
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("nombre");
    localStorage.removeItem("rol");

    setAuth({ estaIniciadoSesion: false, nombre: null, rol: null });
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