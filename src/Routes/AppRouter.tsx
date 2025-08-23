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
import { NavBar } from '../components/ui/NavBar/NavBar';
import { PrivateRoutes } from '../auth/PrivateRoutes/PrivateRoutes';
import AdminOftalmologia from '../components/screens/AdminOftalmologia/AdminOftalmologia';
import AdminOrtopedia from '../components/screens/AdminOrtopedia/AdminOrtopedia';
import { MainScreen } from '../components/screens/main/MainScreen';


export const AppRouter = () => {
  return (
    <BrowserRouter>
    <NavBar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainScreen />} />

         {/* Rutas Admin */}
        <Route path="/admin" element={
          <PrivateRoutes roles={['ADMIN']}>
            <HeaderAdmin /> 
          </PrivateRoutes>} />

        <Route path="/usuarios" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Usuarios /> 
          </PrivateRoutes>} />

        <Route path="/areas" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Areas /> 
          </PrivateRoutes>} />

        <Route path="/roles" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Roles /> 
          </PrivateRoutes>} />

        <Route path="/beneficiarios" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Beneficiarios /> 
          </PrivateRoutes>} /> 

        <Route path="/medicos" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Medico /> 
          </PrivateRoutes>} />  

        <Route path="/grupoFamiliar" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <GrupoFamiliar /> 
          </PrivateRoutes>} />

        <Route path="/admin/oftalmologia" element={
          <PrivateRoutes roles={['ADMINOFTALMOLOGIA']}>
            <AdminOftalmologia /> 
          </PrivateRoutes>} />

        <Route path="/admin/ortopedia" element={
          <PrivateRoutes roles={['ADMINORTOPEDIA']}>
            <AdminOrtopedia /> 
          </PrivateRoutes>} />          

        <Route path="/pedidos/oftalmologia" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA']}>
            <PedidoOftalmologia /> 
          </PrivateRoutes>} />

        <Route path="/pedidos/oftalmologia/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA']}>
            <ModalPedidoOftalmologia /> 
          </PrivateRoutes>} />

        <Route path="/pedidos/ortopedia" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINORTOPEDIA']}>
            <PedidoOrtopedia /> 
          </PrivateRoutes>} />     

        <Route path="/pedidos/ortopedia/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINORTOPEDIA']}>
            <ModalPedidoOrtopedia /> 
          </PrivateRoutes>} />
      </Routes>
    </BrowserRouter>
  );
};
