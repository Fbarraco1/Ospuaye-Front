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
import { useAuthStore } from '../auth/store/authStore';
import { NavBar } from '../components/ui/NavBar/NavBar';
import { PrivateRoutes } from '../auth/PrivateRoutes/PrivateRoutes';
import AdminOftalmologia from '../components/screens/AdminOftalmologia/AdminOftalmologia';
import AdminOrtopedia from '../components/screens/AdminOrtopedia/AdminOrtopedia';
import { MainScreen } from '../components/screens/main/MainScreen';
import RecuperarContra from '../components/screens/RecuperarContra/RecuperarContra';
import PerdiContra from '../components/screens/PerdiContra/PerdiContra';
import { Footer } from '../components/ui/Footer/Footer';
import { Pais } from '../components/screens/Pais/Pais';
import { Provincia } from '../components/screens/Provincia/Provincia';
import { Departamento } from '../components/screens/Departamento/Departamento';
import { Localidad } from '../components/screens/Localidad/Localidad';
import { Domicilio } from '../components/screens/Domicilio/Domicilio';
import { Empresa } from '../components/screens/Empresa/Empresa';
import { Nacionalidad } from '../components/screens/Nacionalidad/Nacionalidad';
import HeaderAdmin from '../components/screens/HeaderAdmin/HeaderAdmin';
import ModalMedico from '../components/ui/ModalMedico/ModalMedico';
import { ImgSistema } from '../components/ui/imgSistema/ImgSistema';
import ModalBeneficiario from '../components/ui/ModalBeneficiario/ModalBeneficiario';
import ScrollToTop from './ScrollToTop';
import HeaderBeneficiario from '../components/screens/HeaderBeneficiario/HeaderBeneficiario';
import { PedidoOftalmologiaUser } from '../components/screens/PedidoOftalmologiaUser/PedidoOftalmologiaUser';
import ModalPedidoOftalmologiaUser from '../components/ui/ModalPedidoOftalmologiaUser/ModalPedidoOftalmologiaUser';
import { PedidoOrtopediaUser } from '../components/screens/PedidoOrtopediaUser/PedidoOrtopediaUser';
import ModalPedidoOrtopediaUser from '../components/ui/ModalPedidoOrtopediaUser/ModalPedidoOrtopedia';
import { GestionDeCuenta } from '../components/screens/GestionDeCuenta/GestionDeCuenta';
import HeaderMedicoOftalmologo from '../components/screens/HeaderMedico/HeaderMedicoOftalmologo';
import HeaderMedicoOrtopedia from '../components/screens/HeaderMedico/HeaderMedicoOrtopedia';

export const AppRouter = () => {
  const { user } = useAuthStore();

  // Función para mostrar el menú según el rol
  const renderMenuByRole = () => {
    if (!user) return null;
    switch (user.rol) {
      case 'ADMIN':
        return <HeaderAdmin />;
      case 'ADMINOFTALMOLOGIA':
        return <AdminOftalmologia />;
      case 'ADMINORTOPEDIA':
        return <AdminOrtopedia />;
      case 'USER':
        return <HeaderBeneficiario />;  
      case 'MEDICO OFTALMOLOGO':
        return <HeaderMedicoOftalmologo />;    
      case 'MEDICO ORTOPEDIA':
        return <HeaderMedicoOrtopedia />;  
      default:
        return null;
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      {/* Menú según el rol */}
      {renderMenuByRole()}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainScreen />} />
        {/* Pantallas de recuperación de contraseña */}
        <Route path="/recuperar-contra" element={<RecuperarContra />} />
        <Route path="/perdi-contra" element={<PerdiContra />} />


         {/* Rutas Admin */}
        <Route path="/admin" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ImgSistema /> 
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

        <Route path="/pais" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Pais /> 
          </PrivateRoutes>} />

        <Route path="/provincia" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Provincia /> 
          </PrivateRoutes>} />

        <Route path="/departamento" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Departamento /> 
          </PrivateRoutes>} />

        <Route path="/localidad" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Localidad /> 
          </PrivateRoutes>} />

        <Route path="/domicilio" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Domicilio /> 
          </PrivateRoutes>} />

        <Route path="/empresa" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Empresa /> 
          </PrivateRoutes>} />

        <Route path="/beneficiarios" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Beneficiarios /> 
          </PrivateRoutes>} /> 

        <Route path="/beneficiario/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalBeneficiario /> 
          </PrivateRoutes>} />           

        <Route path="/medicos" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Medico /> 
          </PrivateRoutes>} /> 

        <Route path="/medicos/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalMedico /> 
          </PrivateRoutes>} />  

        <Route path="/grupoFamiliar" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <GrupoFamiliar /> 
          </PrivateRoutes>} />

        <Route path="/nacionalidades" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Nacionalidad /> 
          </PrivateRoutes>} />

        <Route path="/admin/oftalmologia" element={
          <PrivateRoutes roles={['ADMINOFTALMOLOGIA']}>
            <ImgSistema /> 
          </PrivateRoutes>} />

        <Route path="/admin/ortopedia" element={
          <PrivateRoutes roles={['ADMINORTOPEDIA']}>
            <ImgSistema /> 
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

        <Route path="/pedidos/oftalmologia/user" element={
          <PrivateRoutes roles={['USER']}>
            <PedidoOftalmologiaUser /> 
          </PrivateRoutes>} /> 

        <Route path="/pedidos/oftalmologia/user/nuevo" element={
          <PrivateRoutes roles={['USER']}>
            <ModalPedidoOftalmologiaUser /> 
          </PrivateRoutes>} /> 

        <Route path="/pedidos/ortopedia/user" element={
          <PrivateRoutes roles={['USER']}>
            <PedidoOrtopediaUser /> 
          </PrivateRoutes>} /> 

        <Route path="/pedidos/ortopedia/user/nuevo" element={
          <PrivateRoutes roles={['USER']}>
            <ModalPedidoOrtopediaUser /> 
          </PrivateRoutes>} />  

        <Route path="/gestionCuenta" element={
          <PrivateRoutes roles={['USER', 'MEDICO OFTALMOLOGO', 'MEDICO ORTOPEDIA']}>
            <GestionDeCuenta /> 
          </PrivateRoutes>} />  

        <Route path="/pedidos/oftalmologia/medico" element={
          <PrivateRoutes roles={['MEDICO OFTALMOLOGO']}>
            <GestionDeCuenta /> 
          </PrivateRoutes>} />  

        <Route path="/pedidos/ortopedia/medico" element={
          <PrivateRoutes roles={['MEDICO ORTOPEDIA']}>
            <GestionDeCuenta /> 
          </PrivateRoutes>} />          

    </Routes>
      <div>
        <span><br /><br /><br /></span>
      </div>
      <Footer />
    </BrowserRouter>
  );
};
