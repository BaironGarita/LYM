import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import { Navbar } from "./components/layout/Navbar";
import UploadProductImage from "./components/UploadProductImage";
import { useCart } from "./components/useCart";

function App() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  return (
    <Router>
      <Navbar
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UploadProductImage />
                <ProductList onAddToCart={addToCart} />
              </>
            }
          />
          <Route
            path="/productos"
            element={
              <>
                <UploadProductImage />
                <ProductList onAddToCart={addToCart} />
              </>
            }
          />
          <Route
            path="/producto/:id"
            element={<ProductDetail onAddToCart={addToCart} />}
          />
        </Routes>
      </main>
      <footer className="text-center p-4 mt-8 text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} LYM. Todos los derechos reservados.
        </p>
      </footer>
    </Router>
  );
}

export default App;
