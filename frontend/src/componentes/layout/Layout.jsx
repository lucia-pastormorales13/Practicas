import { useAuth } from "../../contexto/AuthContexto";
import Logout from "../auth/Logout";

function Layout({ children, title }) {
    const { nombre } = useAuth();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <nav className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl">{title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Bienvenido, {nombre}
                            </p>
                        </div>

                        <Logout />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;