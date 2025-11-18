import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../auth/pages/Login/Login';
import { Register } from '../auth/pages/Register/Register';
import { Usuarios } from '../components/screens/Admin/Usuarios/Usuarios';
import { Beneficiarios } from '../components/screens/Admin/Beneficiarios/Beneficiarios';
import { Areas } from '../components/screens/Admin/RolesAreas/Areas';
import { Roles } from '../components/screens/Admin/Roles/Roles';
import { GrupoFamiliar } from '../components/screens/Admin/GrupoFamiliar/GrupoFamiliar';
import { PedidoOftalmologia } from '../components/screens/Admin/PedidoOftalmologia/PedidoOftalmologia';
import ModalPedidoOrtopedia from '../components/ui/Pedidos/ModalPedidoOrtopedia/ModalPedidoOrtopedia';
import ModalPedidoOftalmologia from '../components/ui/Pedidos/ModalPedidoOftalmologia/ModalPedidoOftalmologia';
import { useAuthStore } from '../auth/store/authStore';
import { NavBar } from '../components/ui/NavBar/NavBar';
import { PrivateRoutes } from '../auth/PrivateRoutes/PrivateRoutes';
import { MainScreen } from '../components/screens/main/MainScreen';
import PerdiContra from '../components/screens/User/PerdiContra/PerdiContra';
import { Footer } from '../components/ui/Footer/Footer';
import { Pais } from '../components/screens/Admin/Pais/Pais';
import { Departamento } from '../components/screens/Admin/Departamento/Departamento';
import { Localidad } from '../components/screens/Admin/Localidad/Localidad';
import { Domicilio } from '../components/screens/Admin/Domicilio/Domicilio';
import { Empresa } from '../components/screens/Admin/Empresa/Empresa';
import { Nacionalidad } from '../components/screens/Admin/Nacionalidad/Nacionalidad';
import HeaderAdmin from '../components/screens/HeadersAdmin/HeaderAdmin/HeaderAdmin';
import ModalMedico from '../components/ui/Admin/ModalMedico/ModalMedico';
import { ImgSistema } from '../components/ui/imgSistema/ImgSistema';
import ModalBeneficiario from '../components/ui/Admin/ModalBeneficiario/ModalBeneficiario';
import ScrollToTop from './ScrollToTop';
import HeaderBeneficiario from '../components/screens/HeadersAdmin/HeaderBeneficiario/HeaderBeneficiario';
import { PedidoOftalmologiaUser } from '../components/screens/User/PedidoOftalmologiaUser/PedidoOftalmologiaUser';
import ModalPedidoOftalmologiaUser from '../components/ui/Pedidos/ModalPedidoOftalmologiaUser/ModalPedidoOftalmologiaUser';
import ModalPedidoOrtopediaUser from '../components/ui/Pedidos/ModalPedidoOrtopediaUser/ModalPedidoOrtopedia';
import HeaderMedicoOftalmologo from '../components/screens/HeadersAdmin/HeaderMedico/HeaderMedicoOftalmologo';
import HeaderMedicoOrtopedia from '../components/screens/HeadersAdmin/HeaderMedico/HeaderMedicoOrtopedia';
import { PedidoOftalmologiaMedico } from '../components/screens/Medico/PedidosOftalmologiaMedico/PedidosOftalmologiaMedico';
import { PedidoOrtopediaMedico } from '../components/screens/Medico/PedidoOrtopediaMedico/PedidoOrtopediaMedico';
import NotFound from '../components/screens/NotFound/NotFound';
import HeaderMedicoAuditorGeneral from '../components/screens/HeadersAdmin/HeaderMedicoAuditorGeneral/HeaderMedicoAuditorGeneral';
import RecuperarContra from '../components/screens/User/RecuperarContra/RecuperarContra';
import { Provincia } from '../components/screens/Admin/Provincia/Provincia';
import { Medico } from '../components/screens/Admin/Medico/Medico';
import { PedidoOrtopedia } from '../components/screens/Admin/PedidoOrtopedia/PedidoOrtopedia';
import { PedidoOrtopediaUser } from '../components/screens/User/PedidoOrtopediaUser/PedidoOrtopediaUser';
import { GestionDeCuenta } from '../components/screens/User/GestionDeCuenta/GestionDeCuenta';
import { GestionDeCuentaMedico } from '../components/screens/Medico/GestionDeCuentaMedico/GestionDeCuentaMedico';
import { ModalDepartamento } from '../components/ui/Admin/ModalDepartamento/ModalDepartamento';
import { Pedido } from '../components/screens/Pedido/Pedido';
import ModalDomicilio from '../components/ui/Admin/ModalDomicilio/ModalDomicilio';
import ModalEmpresa from '../components/ui/Admin/ModalEmpresa/ModalEmpresa';
import ModalLocalidad from '../components/ui/Admin/ModalLocalidad/ModalLocalidad';
import ModalNacionalidad from '../components/ui/Admin/ModalNacionalidad/ModalNacionalidad';
import ModalPais from '../components/ui/Admin/ModalPais/ModalPais';
import ModalProvincia from '../components/ui/Admin/ModalProvincia/ModalProvincia';
import ModalRol from '../components/ui/Admin/ModalRol/ModalRol';
import ModalArea from '../components/ui/Admin/ModalArea/ModalArea';
import ModalGrupoFamiliar from '../components/ui/Admin/ModalGrupoFamiliar/ModalGrupoFamiliar';
import ModalFamiliar from '../components/ui/Admin/ModalFamiliar/ModalFamiliar';
import ModalPedido from '../components/ui/Pedidos/ModalPedido/ModalPedido';
import { PedidoMedico } from '../components/screens/Medico/PedidoMedico/PedidoMedico';
import ModalUsuario from '../components/ui/Admin/ModalUsuario/ModalUsuario';

export const AppRouter = () => {
  const { user } = useAuthStore();

  // Función para mostrar el menú según el rol
  const renderMenuByRole = () => {
    if (!user) return null;
    switch (user.rol) {
      case 'ADMIN':
        return <HeaderAdmin />;
      case 'MEDICO AUDITOR GENERAL':
        return <HeaderMedicoAuditorGeneral />;
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

        {/* Error 404  */}
          <Route path="*" element={<NotFound />} />
          
         {/* Rutas Admin */}
        <Route path="/admin" element={
          <PrivateRoutes roles={['ADMIN', 'MEDICO AUDITOR GENERAL', 'USER', 'MEDICO OFTALMOLOGIA', 'MEDICO ORTOPEDIA']}>
            <ImgSistema /> 
          </PrivateRoutes>} />

        <Route path="/usuarios" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Usuarios /> 
          </PrivateRoutes>} />

        {/* Rutas para abrir ModalUsuario como página (crear / editar) */}
        <Route path="/usuarios/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalUsuario modo="crear" />
          </PrivateRoutes>} />

        <Route path="/usuarios/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalUsuario modo="editar" />
          </PrivateRoutes>} />

        <Route path="/areas" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Areas /> 
          </PrivateRoutes>} />

        <Route path="/areas/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalArea modo="crear" />
          </PrivateRoutes>} />

        <Route path="/areas/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalArea modo="editar" />
          </PrivateRoutes>} />

        <Route path="/roles" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Roles /> 
          </PrivateRoutes>} />

        <Route path="/roles/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalRol modo="crear" />
          </PrivateRoutes>} />

        <Route path="/roles/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalRol modo="editar" />
          </PrivateRoutes>} />

        <Route path="/pais" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Pais /> 
          </PrivateRoutes>} />

        <Route path="/pais/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalPais modo="crear" />
          </PrivateRoutes>} />

        <Route path="/pais/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalPais modo="editar" />
          </PrivateRoutes>} />

        <Route path="/provincia" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Provincia /> 
          </PrivateRoutes>} />

        <Route path="/provincia/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalProvincia modo="crear" />
          </PrivateRoutes>} />

        <Route path="/provincia/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalProvincia modo="editar" />
          </PrivateRoutes>} />

        <Route path="/departamento" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Departamento />
          </PrivateRoutes>} />

        <Route path="/departamento/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalDepartamento modo="crear" />
          </PrivateRoutes>} />

        <Route path="/departamento/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalDepartamento modo="editar" />
          </PrivateRoutes>} />

        <Route path="/localidad" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Localidad /> 
          </PrivateRoutes>} />

        <Route path="/localidad/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalLocalidad modo="crear" />
          </PrivateRoutes>} />

        <Route path="/localidad/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalLocalidad modo="editar" />
          </PrivateRoutes>} />

        <Route path="/domicilio" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Domicilio /> 
          </PrivateRoutes>} />

        <Route path="/domicilio/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalDomicilio modo="crear" />
          </PrivateRoutes>} />

        <Route path="/domicilio/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalDomicilio modo="editar" />
          </PrivateRoutes>} />

        <Route path="/empresa" element={
          <PrivateRoutes roles={['ADMIN']}>
            <Empresa /> 
          </PrivateRoutes>} />

        <Route path="/empresa/nuevo" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalEmpresa modo="crear" />
          </PrivateRoutes>} />

        <Route path="/empresa/editar/:id" element={
          <PrivateRoutes roles={['ADMIN']}>
            <ModalEmpresa modo="editar" />
          </PrivateRoutes>} />

        <Route path="/beneficiarios" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Beneficiarios /> 
          </PrivateRoutes>} /> 

        <Route path="/beneficiario/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalBeneficiario/> 
          </PrivateRoutes>} />   

        <Route path="/beneficiario/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalBeneficiario modo="editar" />
        </PrivateRoutes>} />        

        <Route path="/medicos" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA', 'MEDICO AUDITOR GENERAL']}>
            <Medico /> 
          </PrivateRoutes>} /> 

        <Route path="/medicos/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalMedico /> 
          </PrivateRoutes>} />  

        <Route path="/medicos/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalMedico modo="editar" />
        </PrivateRoutes>} />

        <Route path="/grupoFamiliar" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <GrupoFamiliar /> 
          </PrivateRoutes>} />

        <Route path="/nacionalidades" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <Nacionalidad /> 
          </PrivateRoutes>} />

        <Route path="/nacionalidades/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalNacionalidad modo="crear" />
          </PrivateRoutes>} />

        <Route path="/nacionalidades/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalNacionalidad modo="editar" />
          </PrivateRoutes>} />

        <Route path="/admin/oftalmologia" element={
          <PrivateRoutes roles={['ADMINOFTALMOLOGIA']}>
            <ImgSistema /> 
          </PrivateRoutes>} />

        <Route path="/admin/ortopedia" element={
          <PrivateRoutes roles={['ADMINORTOPEDIA']}>
            <ImgSistema /> 
          </PrivateRoutes>} />          

        <Route path="/pedidos/generales" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'MEDICO AUDITOR GENERAL', 'ADMINORTOPEDIA', 'MEDICO ORTOPEDIA', 'MEDICO OFTALMOLOGO']}>
            <Pedido /> 
          </PrivateRoutes>} />

          <Route path="/pedidos/generales/medico" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'MEDICO AUDITOR GENERAL', 'ADMINORTOPEDIA', 'MEDICO ORTOPEDIA', 'MEDICO OFTALMOLOGO']}>
            <PedidoMedico /> 
          </PrivateRoutes>} />

          <Route path="/pedidos/generales/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalPedido /> 
          </PrivateRoutes>} />

        <Route path="/pedidos/oftalmologia" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'MEDICO AUDITOR GENERAL']}>
            <PedidoOftalmologia /> 
          </PrivateRoutes>} />

        <Route path="/pedidos/oftalmologia/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA']}>
            <ModalPedidoOftalmologia /> 
          </PrivateRoutes>} />

        <Route path="/pedidos/ortopedia" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINORTOPEDIA', 'MEDICO AUDITOR GENERAL']}>
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

        <Route path="/gestionCuentaMedico" element={
          <PrivateRoutes roles={['MEDICO AUDITOR GENERAL', 'MEDICO OFTALMOLOGO', 'MEDICO ORTOPEDIA']}>
            <GestionDeCuentaMedico /> 
          </PrivateRoutes>} />  

        <Route path="/pedidos/oftalmologia/medico" element={
          <PrivateRoutes roles={['MEDICO OFTALMOLOGO']}>
            <PedidoOftalmologiaMedico /> 
          </PrivateRoutes>} />  

        <Route path="/pedidos/ortopedia/medico" element={
          <PrivateRoutes roles={['MEDICO ORTOPEDIA']}>
            <PedidoOrtopediaMedico /> 
          </PrivateRoutes>} />         

        <Route path="/pedidos/oftalmologia/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA']}>
            <ModalPedidoOftalmologia modo="editar" />
          </PrivateRoutes>} />

          <Route path="/pedidos/ortopedia/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINORTOPEDIA']}>
            <ModalPedidoOrtopedia modo="editar" />
          </PrivateRoutes>} />

        <Route path="/grupoFamiliar/nuevo" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalGrupoFamiliar modo="crear" />
          </PrivateRoutes>} />

        <Route path="/grupoFamiliar/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalGrupoFamiliar modo="editar" />
          </PrivateRoutes>} />

        <Route path="/grupoFamiliar/:grupoId/familiar/nuevo/:beneficiarioId" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalFamiliar modo="crear" />
          </PrivateRoutes>} />

        <Route path="/familiar/editar/:id" element={
          <PrivateRoutes roles={['ADMIN', 'ADMINOFTALMOLOGIA', 'ADMINORTOPEDIA']}>
            <ModalFamiliar modo="editar" />
          </PrivateRoutes>} />

    </Routes>
      <div>
        <span><br /><br /><br /></span>
      </div>
      <Footer />
    </BrowserRouter>
  );
};
