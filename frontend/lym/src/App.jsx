import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="container flex-1 py-6">
              <AppRoutes />
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
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
