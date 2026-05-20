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
import DashboardColaborador from './componentes/colaborador/DashboardColaborador';


function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/registrar' element={<Registrar />} />
        <Route path='/logout' element={<Logout />} />
        {/* <Route path='/administrador-dashboard' element={isLoggedIn ? <DashboardAdmin /> : <Navigate replace to="/" />} /> */}
        <Route path='/administrador-dashboard' element={<DashboardAdmin />} />
        <Route path='/gestor-proyectos-dashboard' element={<DashboardGestor />} />
        {/* <Route path='/gestor-proyectos-dashboard' element={<Tarea/> } /> */}
        <Route path='/colaborador-dashboard' element={<DashboardColaborador />} />
        <Route path='/crear-usuario' element={<CrearUsuario />} />
        <Route path='/editar-usuario/:id_usuario' element={<EditarUsuario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
