import ProductList from "../components/product/ProductList";
import ProductDetail from "../Pages/ProductDetailPage";
import UploadProductImage from "../components/product/UploadProductImage";
import { ProtectedRoute } from "../components/auth/ProtectedRouter";
import OffersPage from "../Pages/Products/OffersPage";
import OrdersPage from "../Pages/Orders/OrdersPage";
import ProductsPage from "../Pages/AdminProductsPage";
import ResenasList from "../components/reviews/ResenasList";
import ResenaDetail from "../components/reviews/ResenaDetail";

// Rutas públicas
export const publicRoutes = [
  {
    path: "/",
    element: ({ addToCart }) => <ProductList onAddToCart={addToCart} />,
  },
  {
    path: "/productos",
    element: ({ addToCart }) => <ProductList onAddToCart={addToCart} />,
  },
  {
    path: "/producto/:id",
    element: ({ addToCart }) => <ProductDetail onAddToCart={addToCart} />,
  },
  {
    path: "/offers",
    element: () => <OffersPage />,
  },
  {
    path: "/resenas",
    element: () => <ResenasList />,
  },
  {
    path: "/resenas/:id",
    element: () => <ResenaDetail />,
  },
];

// Rutas protegidas para usuarios autenticados
export const protectedRoutes = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <div>Mi Perfil</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <div>Mis Favoritos</div>
      </ProtectedRoute>
    ),
  },
];

// Rutas protegidas para administradores
export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <div>Panel de Administrador</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/productos",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/upload",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <UploadProductImage />
      </ProtectedRoute>
    ),
  },
];
