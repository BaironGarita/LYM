import { useState, useEffect } from "react";
import ProductCard from "@/features/product-management/ProductCard";
import CategoryFilter from "@/features/product-management/CategoryFilter";
import { usePromociones } from "@/features/promotions/usePromociones";
import { toast } from "sonner";
import { useI18n } from "@/shared/hooks/useI18n";

export const ProductsPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { t } = useI18n();

  // Integrar hook de promociones
  const {
    promociones,
    calcularPrecio,
    loading: promocionesLoading,
  } = usePromociones();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = "http://localhost:81/api_lym/productos";
        if (selectedCategory) {
          url += `?categoria_id=${selectedCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(t("pages.products.errorLoading", "No se pudieron cargar los productos."));
        }
        const data = await response.json();

        // Enriquecer productos con información de promociones
        const productosConPromociones = Array.isArray(data)
          ? data.map((producto) => ({
              ...producto,
              promocionInfo: calcularPrecio(producto),
            }))
          : [];

        setProducts(productosConPromociones);

        if (productosConPromociones.length === 0) {
          toast.info(
            t("pages.products.noProductsInCategory", "No se encontraron productos para la categoría seleccionada.")
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error(t("pages.products.errorLoadingProducts", "Error al cargar los productos."));
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar cuando las promociones estén cargadas
    if (!promocionesLoading) {
      fetchProducts();
    }
  }, [selectedCategory, promociones, calcularPrecio, promocionesLoading]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {t("pages.products.title", "Nuestra Colección")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            {t("pages.products.subtitle", "Filtra por categoría para encontrar tu estilo perfecto.")}
          </p>
        </div>
        <CategoryFilter onChange={setSelectedCategory} />
      </header>

      <main>
        {(loading || promocionesLoading) && (
          <p className="text-center py-10">{t("pages.products.loading", "Cargando productos...")}</p>
        )}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !promocionesLoading && !error && (
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
                  {t("pages.products.noProducts", "No se encontraron productos.")}
                </p>
                <p className="text-gray-500">
                  {t("pages.products.tryAnotherCategory", "Intenta seleccionar otra categoría o revisa más tarde.")}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
