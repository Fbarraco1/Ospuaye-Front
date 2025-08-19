import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../auth/pages/Login/Login';
import { Register } from '../auth/pages/Register/Register';
import { Usuarios } from '../components/screens/Usuarios/Usuarios';
import { Beneficiarios } from '../components/screens/Beneficiarios/Beneficiarios';
import { Areas } from '../components/screens/RolesAreas/Areas';
import { Roles } from '../components/screens/Roles/Roles';
import { Medico } from '../components/screens/Medico/Medico';
import { GrupoFamiliar } from '../components/screens/GrupoFamiliar/GrupoFamiliar';
import { PedidoOftalmologia } from '../components/screens/PedidoOftalmologia/PedidoOftalmologia';
import { PedidoOrtopedia } from '../components/screens/PedidoOrtopedia/PedidoOrtopedia';
import ModalPedidoOrtopedia from '../components/ui/ModalPedidoOrtopedia/ModalPedidoOrtopedia';
import ModalPedidoOftalmologia from '../components/ui/ModalPedidoOftalmologia/ModalPedidoOftalmologia';
import HeaderAdmin from '../components/screens/HeaderAdmin/HeaderAdmin';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HeaderAdmin />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/beneficiarios" element={<Beneficiarios />} />
        <Route path="/areas" element={<Areas />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/medicos" element={<Medico />} />
        <Route path="/grupoFamiliar" element={<GrupoFamiliar />} />
        <Route path="/pedidos/oftalmologia" element={<PedidoOftalmologia />} />
        <Route path="/pedidos/oftalmologia/nuevo" element={<ModalPedidoOftalmologia/>}/>
        <Route path="/pedidos/ortopedia" element={<PedidoOrtopedia />} />
        <Route path="/pedidos/ortopedia/nuevo" element={<ModalPedidoOrtopedia/>}/>
        {/* Rutas privadas */}
        
        {/* Aquí puedes agregar más rutas privadas según sea necesario */}
      </Routes>
    </BrowserRouter>
  );
};
