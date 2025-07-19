import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/product/ProductList";
import ProductDetail from "./components/product/ProductDetail";
import { Navbar } from "./components/layout/Navbar";
import UploadProductImage from "./components/product/UploadProductImage";
import { Toaster } from "sonner";
import { useCart } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRouter";
import OffersPage from "./Pages/Products/OffersPage";
import OrdersPage from "./Pages/Orders/OrdersPage";
import ProductsPage from "./Pages/ProductsPage"; // Cambiado de "../Pages/ProductsPage"
import ResenasList from "./components/reviews/ResenasList";
import ResenaDetail from "./components/reviews/ResenaDetail";

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
            <Route path="/resenas" element={<ResenasList />} />
            <Route path="/resenas/:id" element={<ResenaDetail />} />

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
                  <OrdersPage />
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
              path="/admin/productos"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductsPage />
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
            <Route path="/test-productos" element={<ProductsPage />} />
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
