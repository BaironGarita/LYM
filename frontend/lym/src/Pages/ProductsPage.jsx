import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilter from "@/components/product/CategoryFilter";
import { toast } from "sonner";

export const ProductsPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // '' representa todas las categorías

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construimos la URL base
        let url = "http://localhost:81/api_lym/productos";

        // Si hay una categoría seleccionada, la añadimos como parámetro a la URL
        if (selectedCategory) {
          url += `?categoria_id=${selectedCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
        if (data.length === 0) {
          toast.info(
            "No se encontraron productos para la categoría seleccionada."
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // El efecto se ejecuta cada vez que 'selectedCategory' cambia

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Nuestra Colección
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Filtra por categoría para encontrar tu estilo perfecto.
          </p>
        </div>
        <CategoryFilter onChange={setSelectedCategory} />
      </header>

      <main>
        {loading && <p className="text-center py-10">Cargando productos...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl font-semibold">
                  No se encontraron productos.
                </p>
                <p className="text-gray-500">
                  Intenta seleccionar otra categoría o revisa más tarde.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
