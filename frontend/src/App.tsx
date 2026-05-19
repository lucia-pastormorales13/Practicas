import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './contexto/AuthContexto'
import Login from './componentes/auth/Login'
import Registrar from './componentes/auth/Registrar'
import Logout from './componentes/auth/Registrar'
import DashboardAdmin from './componentes/administrador/DashboardAdmin'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
