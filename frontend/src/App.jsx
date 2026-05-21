import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './contexto/AuthContexto';
import Login from './componentes/auth/Login';
import Registrar from './componentes/auth/Registrar';
import Logout from './componentes/auth/Logout';
import DashboardAdmin from './componentes/administrador/DashboardAdmin';
import CrearUsuario from './componentes/administrador/CrearUsuario';
import EditarUsuario from './componentes/administrador/EditarUsuario'
import DashboardGestor from './componentes/gestor/DashboardGestor';
import CrearProyecto from './componentes/gestor/CrearProyecto';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentification */}
        <Route path='/' element={<Login />} />
        <Route path='/registrar' element={<Registrar />} />
        <Route path='/logout' element={<Logout />} />
        {/* Administrador routes */}
        <Route path='/administrador-dashboard' element={isLoggedIn ? <DashboardAdmin /> : <Navigate replace to="/" />} />
        <Route path='/crear-usuario' element={isLoggedIn ? <CrearUsuario /> : <Navigate replace to="/" />} />
        <Route path='/editar-usuario/:id_usuario' element={isLoggedIn ? <EditarUsuario /> : <Navigate replace to="/" />} />
        {/* Gestor proyectos routes */}
        <Route path='/gestor-proyectos-dashboard' element={isLoggedIn ? <DashboardGestor /> : <Navigate replace to="/" />} />
        <Route path='/crear-proyecto' element={isLoggedIn ? <CrearProyecto/> : <Navigate replace to="/"/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
