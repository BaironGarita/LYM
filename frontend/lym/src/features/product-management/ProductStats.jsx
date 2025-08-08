import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
} from "lucide-react";
import ProductoService from "../../shared/api/productoService";

const ProductStats = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockBajo: 0,
    sinStock: 0,
    valorInventario: 0,
    categoriaPopular: null,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simular estadísticas basadas en los productos
      const productos = await ProductoService.getProductos();

      const totalProductos = productos.length;
      const stockBajo = productos.filter(
        (p) => p.stock > 0 && p.stock < 10
      ).length;
      const sinStock = productos.filter((p) => p.stock === 0).length;
      const valorInventario = productos.reduce((total, p) => {
        return total + parseFloat(p.precio) * parseInt(p.stock || 0);
      }, 0);

      // Encontrar categoría más popular (con más productos)
      const categorias = {};
      productos.forEach((p) => {
        if (p.categoria_nombre) {
          categorias[p.categoria_nombre] =
            (categorias[p.categoria_nombre] || 0) + 1;
        }
      });

      const categoriaPopular = Object.keys(categorias).reduce(
        (a, b) => (categorias[a] > categorias[b] ? a : b),
        null
      );

      setStats({
        totalProductos,
        stockBajo,
        sinStock,
        valorInventario,
        categoriaPopular,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (stats.loading) {
    return (
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de productos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Productos</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalProductos}
            </p>
          </div>
        </div>
      </div>

      {/* Valor del inventario */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              Valor Inventario
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.valorInventario)}
            </p>
          </div>
        </div>
      </div>

      {/* Stock bajo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.stockBajo}
            </p>
          </div>
        </div>
      </div>

      {/* Sin stock */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Sin Stock</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.sinStock}
            </p>
          </div>
        </div>
      </div>

      {/* Categoría popular */}
      {stats.categoriaPopular && (
        <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Categoría Popular
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {stats.categoriaPopular}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStats;
