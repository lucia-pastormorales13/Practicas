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
<<<<<<< HEAD
import CrearProyecto from './componentes/gestor/CrearProyecto';
=======
import DashboardColaborador from './componentes/colaborador/DashboardColaborador';

>>>>>>> ea3ee68c21925a4a55ce7d499fac6c1b07982db9

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentification */}
        <Route path='/' element={<Login />} />
        <Route path='/registrar' element={<Registrar />} />
        <Route path='/logout' element={<Logout />} />
<<<<<<< HEAD
        {/* Administrador routes */}
        <Route path='/administrador-dashboard' element={isLoggedIn ? <DashboardAdmin /> : <Navigate replace to="/" />} />
        <Route path='/crear-usuario' element={isLoggedIn ? <CrearUsuario /> : <Navigate replace to="/" />} />
        <Route path='/editar-usuario/:id_usuario' element={isLoggedIn ? <EditarUsuario /> : <Navigate replace to="/" />} />
        {/* Gestor proyectos routes */}
        <Route path='/gestor-proyectos-dashboard' element={isLoggedIn ? <DashboardGestor /> : <Navigate replace to="/" />} />
        <Route path='/crear-proyecto' element={isLoggedIn ? <CrearProyecto/> : <Navigate replace to="/"/>} />
=======
        {/* <Route path='/administrador-dashboard' element={isLoggedIn ? <DashboardAdmin /> : <Navigate replace to="/" />} /> */}
        <Route path='/administrador-dashboard' element={<DashboardAdmin />} />
        <Route path='/gestor-proyectos-dashboard' element={<DashboardGestor />} />
        {/* <Route path='/gestor-proyectos-dashboard' element={<Tarea/> } /> */}
        <Route path='/colaborador-dashboard' element={<DashboardColaborador />} />
        <Route path='/crear-usuario' element={<CrearUsuario />} />
        <Route path='/editar-usuario/:id_usuario' element={<EditarUsuario />} />
>>>>>>> ea3ee68c21925a4a55ce7d499fac6c1b07982db9
      </Routes>
    </BrowserRouter>
  )
}

export default App
