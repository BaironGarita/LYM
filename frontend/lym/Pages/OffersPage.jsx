import { useState, useEffect } from "react";
import { Percent, Filter, SortAsc } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { usePromociones } from "@/hooks/usePromociones"; // 1. Import hook

const OffersPage = () => {
  const [productos, setProductos] = useState([]);
  const [productosEnOferta, setProductosEnOferta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [ordenamiento, setOrdenamiento] = useState("descuento");
  const { calcularPrecio, loading: promocionesLoading } = usePromociones(); // 2. Use hook

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:81/api_lym/productos");
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
        const productosData = await response.json();
        setProductos(productosData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (promocionesLoading) return; // 3. Wait for promotions to load
    filtrarYOrdenarProductos();
  }, [
    productos,
    filtroCategoria,
    ordenamiento,
    promocionesLoading,
    calcularPrecio,
  ]); // 4. Update dependencies

  // 5. REMOVE the local `calcularPromocionInfo` function.

  const filtrarYOrdenarProductos = () => {
    // 6. Use the hook's function to enrich products and filter for those on sale
    let productosConOferta = productos
      .map((producto) => ({
        ...producto,
        promocionInfo: calcularPrecio(producto),
      }))
      .filter((p) => p.promocionInfo && p.promocionInfo.descuento > 0);

    // Filtrar por categoría
    if (filtroCategoria !== "todas") {
      productosConOferta = productosConOferta.filter(
        (p) => p.categoria_id === filtroCategoria
      );
    }

    // Ordenar
    productosConOferta.sort((a, b) => {
      if (ordenamiento === "descuento") {
        return b.promocionInfo.descuento - a.promocionInfo.descuento;
      } else if (ordenamiento === "precio") {
        return a.precio - b.precio;
      }
      return 0;
    });

    setProductosEnOferta(productosConOferta);
  };

  const handleFiltroCategoria = (categoria) => {
    setFiltroCategoria(categoria);
    setOrdenamiento("descuento"); // Reset to default sorting on category change
  };

  const handleOrdenamiento = (tipoOrden) => {
    setOrdenamiento(tipoOrden);
  };

  if (loading || promocionesLoading) {
    // 7. Update loading state check
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchOfertas}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Percent className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Ofertas Especiales</h1>
            <p className="text-xl opacity-90">
              Descubre las mejores promociones en moda
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <button
              onClick={() => handleFiltroCategoria("todas")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filtroCategoria === "todas"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => handleFiltroCategoria("ropa")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filtroCategoria === "ropa"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ropa
            </button>
            <button
              onClick={() => handleFiltroCategoria("accesorios")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filtroCategoria === "accesorios"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accesorios
            </button>
          </div>

          {/* Ordenamiento */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Ordenar por:</span>
            <button
              onClick={() => handleOrdenamiento("descuento")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                ordenamiento === "descuento"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Descuento
            </button>
            <button
              onClick={() => handleOrdenamiento("precio")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                ordenamiento === "precio"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Precio
            </button>
          </div>
        </div>
      </div>

      {/* Grid de ofertas */}
      <div className="container mx-auto px-6 py-12">
        {productosEnOferta.length === 0 ? (
          <div className="text-center py-12">
            <Percent className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No hay ofertas disponibles
            </h2>
            <p className="text-gray-500">
              Vuelve pronto para descubrir nuevas promociones
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {productosEnOferta.length} Ofertas Activas
              </h2>
              <p className="text-gray-600">
                ¡Aprovecha estos descuentos antes de que expiren!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {productosEnOferta.map((producto) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard producto={producto} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
