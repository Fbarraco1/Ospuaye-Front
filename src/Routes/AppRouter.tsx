import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '../components/ui/NavBar/NavBar';
import { Login } from '../auth/pages/Login/Login';
import { Register } from '../auth/pages/Register/Register';
import { Dashboard } from '../components/screens/Dashboard/Dashboard';
import { Usuarios } from '../components/screens/Usuarios/Usuarios';
import { Beneficiarios } from '../components/screens/Beneficiarios/Beneficiarios';
import { Areas } from '../components/screens/RolesAreas/Areas';
import { Roles } from '../components/screens/Roles/Roles';
import { Medico } from '../components/screens/Medico/Medico';
import { GrupoFamiliar } from '../components/screens/GrupoFamiliar/GrupoFamiliar';
import { Pedido } from '../components/Pedido/Pedido';


export const AppRouter = () => {



  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/usuarios" element={<Usuarios/>} />
        <Route path="/beneficiarios" element={<Beneficiarios/>} />
        <Route path="/areas" element={<Areas/>} />
        <Route path="/roles" element={<Roles/>} />
        <Route path="/medicos" element={<Medico/>} />
        <Route path="/grupoFamiliar" element={<GrupoFamiliar/>} />
        <Route path="/pedidos" element={<Pedido/>} />



        
        {/* Rutas privadas */}
        {/* Aquí puedes agregar más rutas privadas según sea necesario */}





        
      </Routes>
    </BrowserRouter>
  );
};
