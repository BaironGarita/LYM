import { useState, useEffect } from "react";
import { Percent, Filter, SortAsc } from "lucide-react";
import ProductCard from "@/components/product/ProductCard/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { usePromociones } from "@/hooks/usePromociones";
import { toast } from "sonner";

const OffersPage = () => {
  const [productos, setProductos] = useState([]);
  const [productosEnOferta, setProductosEnOferta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [ordenamiento, setOrdenamiento] = useState("descuento");

  // Usar el mismo hook que ProductsPage
  const {
    promociones,
    calcularPrecio,
    loading: promocionesLoading,
  } = usePromociones();

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    // Solo procesar cuando tanto productos como promociones estén cargados
    if (!promocionesLoading && productos.length > 0) {
      filtrarYOrdenarProductos();
    }
  }, [
    productos,
    promociones,
    filtroCategoria,
    ordenamiento,
    promocionesLoading,
    calcularPrecio,
  ]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:81/api_lym/productos");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }

      const productosData = await response.json();
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const filtrarYOrdenarProductos = () => {
    // Enriquecer productos con información de promociones usando el hook
    const productosConPromociones = productos.map((producto) => ({
      ...producto,
      promocionInfo: calcularPrecio(producto),
    }));

    // Filtrar solo productos que TIENEN descuento
    let productosConOferta = productosConPromociones.filter(
      (producto) => producto.promocionInfo.descuento > 0
    );

    // Filtrar por categoría
    if (filtroCategoria !== "todas") {
      productosConOferta = productosConOferta.filter(
        (producto) =>
          parseInt(producto.categoria_id) === parseInt(filtroCategoria)
      );
    }

    // Ordenar
    switch (ordenamiento) {
      case "descuento":
        productosConOferta.sort(
          (a, b) => b.promocionInfo.descuento - a.promocionInfo.descuento
        );
        break;
      case "precio-menor":
        productosConOferta.sort(
          (a, b) => a.promocionInfo.precioFinal - b.promocionInfo.precioFinal
        );
        break;
      case "precio-mayor":
        productosConOferta.sort(
          (a, b) => b.promocionInfo.precioFinal - a.promocionInfo.precioFinal
        );
        break;
      case "nombre":
        productosConOferta.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        break;
    }

    setProductosEnOferta(productosConOferta);
  };

  // Obtener categorías únicas de productos que tienen ofertas
  const categorias = [
    ...new Map(
      productosEnOferta.map((p) => [
        p.categoria_id,
        { id: p.categoria_id, nombre: p.categoria },
      ])
    ).values(),
  ];

  // Mostrar loading mientras carga productos O promociones
  if (loading || promocionesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos en oferta...</p>
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
            onClick={fetchProductos}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con animación */}
      <motion.div
        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Percent className="h-20 w-20 mx-auto mb-6" />
            </motion.div>
            <motion.h1
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Productos en Oferta
            </motion.h1>
            <motion.p
              className="text-2xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {productosEnOferta.length} productos con descuentos especiales
            </motion.p>
            <motion.div
              className="mt-4 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              🎉 ¡Ofertas limitadas por tiempo!
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Filtros y ordenamiento mejorados */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Categoría:
              </label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <SortAsc className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Ordenar por:
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="descuento">Mayor descuento</option>
                <option value="precio-menor">Menor precio</option>
                <option value="precio-mayor">Mayor precio</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                📊 {promociones.length} promociones activas
              </div>
              <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                🛍️ {productosEnOferta.length} productos
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid de productos */}
        <AnimatePresence>
          {productosEnOferta.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Percent className="h-32 w-32 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold text-gray-600 mb-4">
                No hay productos en oferta
              </h2>
              <p className="text-gray-500 text-lg">
                {filtroCategoria !== "todas"
                  ? "No hay ofertas para esta categoría. Prueba con otra categoría."
                  : "Vuelve pronto para descubrir nuevas ofertas increíbles"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {productosEnOferta.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.9 + index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  layout
                >
                  <ProductCard product={producto} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Información adicional */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🔥 ¡No te pierdas estas ofertas!
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nuestras ofertas cambian regularmente. Sigue visitando para
            descubrir nuevos productos con descuentos increíbles. ¡Ahorra en tus
            marcas favoritas!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OffersPage;
