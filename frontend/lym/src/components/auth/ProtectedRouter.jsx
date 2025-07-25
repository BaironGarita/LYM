import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  // Debug temporal - CORREGIDO
  console.log("ProtectedRoute Debug:", {
    user,
    isAdmin: isAdmin(),
    userRol: user?.rol, // ← Cambiar de user?.is_admin a user?.rol
    requireAdmin,
    loading,
  });

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};
