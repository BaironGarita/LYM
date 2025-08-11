import ProductList from "../features/product-management/ProductList";
import ProductDetail from "../Pages/ProductDetailPage";
import UploadProductImage from "../features/product-management/UploadProductImage";
import { ProtectedRoute } from "../features/auth/ProtectedRouter";
import OffersPage from "../Pages/Products/OffersPage";
import OrdersPage from "../Pages/Orders/OrdersPage";
import ProductsPage from "../Pages/Admin/AdminProductsPage";
import ResenasList from "../features/reviews/ResenasList";
import ResenaDetail from "../features/reviews/ResenaDetail";
import Dashboard from "../Pages/Admin/Dashboard";

// Rutas públicas
export const publicRoutes = [
  {
    path: "/",
    element: () => <ProductList />, // Sin props
  },
  {
    path: "/productos",
    element: () => <ProductList />, // Sin props
  },
  {
    path: "/producto/:id",
    element: () => <ProductDetail />, // Sin props
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
        <Dashboard />
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
