import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: string[]; // roles permitidos
}

export const PrivateRoutes = ({ children, roles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user || !roles.includes(user.rol))) {
    // Si el usuario no tiene el rol requerido, redirige a inicio o a una página de no autorizado
    return <Navigate to="/" replace />;
  }

  return children;
};