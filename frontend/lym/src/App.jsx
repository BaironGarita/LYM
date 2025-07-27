import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { Navbar } from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />

          <main className="container flex-1 py-6">
            <AppRoutes
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          </main>

          <footer className="text-center p-4 mt-8 text-muted-foreground border-t bg-white">
            <p>
              &copy; {new Date().getFullYear()} LYM. Todos los derechos
              reservados.
            </p>
          </footer>
        </div>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
