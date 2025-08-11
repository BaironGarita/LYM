import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/App/store"; // Asegúrate que la ruta a tu store sea correcta
import { Toaster } from "sonner";
import { Navbar } from "@/shared/components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./shared/hooks/useAuth";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
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
      </AuthProvider>
    </Provider>
  );
}

export default App;
