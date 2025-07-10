import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import { Navbar } from "./components/layout/Navbar";
import UploadProductImage from "./components/UploadProductImage";
import { useCart } from "./components/useCart";
import { Toaster } from "@/components/UI/sonner";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import OffersPage from "./Pages/Products/OffersPage.jsx";
import OrdersPage from "./Pages/Orders/OrdersPage.jsx";
import AdminOrdersPage from "./Pages/Admin/AdminOrdersPage.jsx";

function App() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  return (
    <AuthProvider>
      <Router>
        <Navbar
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
        <main className="container">
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={
                <>
                  <ProductList onAddToCart={addToCart} />
                </>
              }
            />
            <Route
              path="/productos"
              element={
                <>
                  <ProductList onAddToCart={addToCart} />
                </>
              }
            />
            <Route
              path="/producto/:id"
              element={<ProductDetail onAddToCart={addToCart} />}
            />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/orders" element={<OrdersPage />} />

            {/* Rutas protegidas para usuarios autenticados */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div>Mi Perfil</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <div>Mis Pedidos</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <div>Mis Favoritos</div>
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas SOLO para administradores */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <div>Panel de Administrador</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UploadProductImage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UploadProductImage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="text-center p-4 mt-8 text-muted-foreground border-t">
          <p>
            &copy; {new Date().getFullYear()} LYM. Todos los derechos
            reservados.
          </p>
        </footer>
        <Toaster richColors position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
