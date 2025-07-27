import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // Usando alias @

// --- Páginas Públicas ---
import { Home } from "@/Pages/HomePage";
import { ProductsPage } from "@/Pages/ProductsPage"; // La que ven los clientes (exportación nombrada)
import { ProductDetail } from "@/Pages/ProductDetailPage";
import OffersPage from "@/Pages/Products/OffersPage";

// --- Layout y Páginas de Administrador ---
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Dashboard } from "@/Pages/Admin/Dashboard";
import AdminProductsPage from "@/Pages/AdminProductsPage"; // <-- CORREGIDO: Importación por defecto
import PromotionsPage from "@/Pages/Admin/PromotionsPage";
import ProductUploadForm from "@/Pages/Admin/ProductUploadForm";

// Componente para proteger las rutas de administrador
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  // Si no está autenticado o no es admin, redirige al inicio
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = ({ cart, addToCart, removeFromCart, clearCart }) => {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<Home addToCart={addToCart} />} />
      <Route
        path="/productos" // Cambiado de /products a /productos para consistencia
        element={<ProductsPage addToCart={addToCart} />}
      />
      <Route path="/offers" element={<OffersPage />} />
      <Route
        path="/product/:id"
        element={
          <ProductDetail
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        }
      />

      {/* --- Rutas de Administrador Protegidas --- */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<AdminProductsPage />} />{" "}
        {/* <-- CORREGIDO: Usar el componente importado */}
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="upload" element={<ProductUploadForm />} />
      </Route>

      {/* Ruta para cualquier otra URL no definida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
