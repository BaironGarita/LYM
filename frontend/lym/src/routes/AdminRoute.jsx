import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";

export function AdminRoute({ children }) {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // --- INICIO DEL CÓDIGO DE DEPURACIÓN ---
  // Este console.log te mostrará los valores exactos en la consola del navegador.
  console.log("--- Verificando acceso a ruta de Admin ---");
  console.log("Usuario actual:", user);
  console.log("¿Está cargando? (isLoading):", isLoading);
  console.log("¿Está autenticado? (isAuthenticated):", isAuthenticated());
  console.log("¿Es administrador? (isAdmin):", isAdmin());
  console.log("------------------------------------");
  // --- FIN DEL CÓDIGO DE DEPURACIÓN ---

  if (isLoading) {
    // Puedes mostrar un spinner de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated() || !isAdmin()) {
    // Redirige al usuario a la página de inicio si no es un admin autenticado.
    // state={{ from: location }} permite redirigir de vuelta después del login.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
