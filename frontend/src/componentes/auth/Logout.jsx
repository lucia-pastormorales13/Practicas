import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContexto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Logout({ variant = "full" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 transition-colors
        ${variant === "icon"
          ? "p-2 text-red-600 hover:bg-red-50 rounded-lg"
          : "px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl"
        }`}
    >
      <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />

      {variant !== "icon" && <span>Cerrar Sesión</span>}
    </button>
  );
}

export default Logout;