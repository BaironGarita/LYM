import "./App.css";
import ProductList from "./components/ProductList";
import { Navbar } from "./components/layout/Navbar"; // Importa la Navbar

function App() {
  return (
    // Se elimina <main> para que el layout de la navbar funcione correctamente
    <>
      <Navbar />
      <main className="container">
        <ProductList />
      </main>
      <footer className="text-center p-4 mt-8 text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} LYM. Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
}

export default App;
