import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth"; // Usando alias @

// --- Páginas Públicas ---
import { Home } from "@/Pages/home/HomePage";
import { ProductsPage } from "@/Pages/Products/ProductsPage";
import ProductList from "../features/product-management/ProductList";
import ProductDetail from "@/features/product-management/ProductDetail";
import OffersPage from "@/Pages/Products/OffersPage";
import { ReviewsPage } from "@/Pages/Products/ReviewsPage";
import ResenaDetail from "@/features/reviews/ResenaDetail";
import CheckoutPage from "@/Pages/Checkout/CheckoutPage";

// --- Layout y Páginas de Administrador ---
import { AdminLayout } from "@/shared/components/layout/AdminLayout";
import { Dashboard } from "@/Pages/Admin/Dashboard";
import AdminProductsPage from "@/Pages/Admin/AdminProductsPage"; // <-- CORREGIDO: Importación por defecto
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
      <Route path="/resenas" element={<ReviewsPage />} />
      <Route path="/resenas/:id" element={<ResenaDetail />} />
      <Route
        path="/producto/:id"
        element={<ProductDetail onAddToCart={addToCart} />}
      />
      <Route path="/checkout" element={<CheckoutPage />} />

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
