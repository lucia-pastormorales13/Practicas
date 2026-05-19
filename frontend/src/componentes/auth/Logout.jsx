import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContexto";

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth(); // use AuthContext's logout

    const handleLogout = () => {
        logout(); // clears state + localStorage
        navigate("/"); // redirect to login or homepage
    };

    return (
        <button
            onClick={handleLogout}
            className="flex gap-3 text-red-600 cursor-pointer ml-1"
        >
            Logout
        </button>
    );
}