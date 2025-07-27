import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/UI/button";
import ProductCard from "@/components/product/ProductCard"; // <-- Cambio aquí: sin llaves
import { toast } from "sonner";

export const Home = ({ addToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Hacemos un fetch a la API para obtener algunos productos para la página principal
        const response = await fetch(
          "http://localhost:81/api_lym/productos?limit=8"
        );
        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }
        const data = await response.json();
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar productos destacados.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-gray-100 dark:bg-gray-800 p-12 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Encuentra tu Estilo en Look Your Mood
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explora nuestras colecciones exclusivas y descubre las prendas
          perfectas que se adaptan a tu estado de ánimo.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/productos">Explorar Colección</Link>
        </Button>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">
          Productos Destacados
        </h2>
        {loading && <p className="text-center">Cargando productos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
