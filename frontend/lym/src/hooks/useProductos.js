import { useState, useEffect } from "react";
import ProductoService from "../services/productoService";

/**
 * Hook personalizado para manejar el estado de productos
 */
const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos inicial
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductoService.getProductos();
      setProductos(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProducto = async (productData) => {
    try {
      const errors = ProductoService.validateProductData(productData);
      if (errors.length > 0) {
        throw new Error(errors.join(", "));
      }

      const newProduct = await ProductoService.createProducto(productData);
      await fetchProductos(); // Recargar lista
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProducto = async (id, productData) => {
    try {
      const errors = ProductoService.validateProductData(productData);
      if (errors.length > 0) {
        throw new Error(errors.join(", "));
      }

      const updatedProduct = await ProductoService.updateProducto(
        id,
        productData
      );
      await fetchProductos(); // Recargar lista
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProducto = async (id) => {
    try {
      await ProductoService.deleteProducto(id);
      await fetchProductos(); // Recargar lista
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateStock = async (id, nuevoStock) => {
    try {
      await ProductoService.updateStock(id, nuevoStock);
      await fetchProductos(); // Recargar lista
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchProductos = async (searchTerm) => {
    try {
      setLoading(true);
      const data = await ProductoService.searchProductos(searchTerm);
      setProductos(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error searching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoriaId) => {
    try {
      setLoading(true);
      const data = await ProductoService.getProductosByCategoria(categoriaId);
      setProductos(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error filtering productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductosStockBajo = async (limite = 10) => {
    try {
      const data = await ProductoService.getProductosStockBajo(limite);
      return data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const exportarCSV = async () => {
    try {
      await ProductoService.exportarCSV();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Funciones de utilidad
  const getProductById = (id) => {
    return productos.find((producto) => producto.id === id);
  };

  const getProductsByCategory = (categoriaId) => {
    return productos.filter(
      (producto) => producto.categoria_id === categoriaId
    );
  };

  const getTotalProducts = () => productos.length;

  const getStockBajoCount = () => {
    return productos.filter((p) => p.stock > 0 && p.stock < 10).length;
  };

  const getSinStockCount = () => {
    return productos.filter((p) => p.stock === 0).length;
  };

  const getInventoryValue = () => {
    return productos.reduce((total, p) => {
      return total + parseFloat(p.precio) * parseInt(p.stock || 0);
    }, 0);
  };

  const getPopularCategory = () => {
    const categorias = {};
    productos.forEach((p) => {
      if (p.categoria_nombre) {
        categorias[p.categoria_nombre] =
          (categorias[p.categoria_nombre] || 0) + 1;
      }
    });

    return Object.keys(categorias).reduce(
      (a, b) => (categorias[a] > categorias[b] ? a : b),
      null
    );
  };

  const clearError = () => setError(null);

  return {
    // Estado
    productos,
    loading,
    error,

    // Operaciones CRUD
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto,
    updateStock,

    // Búsqueda y filtrado
    searchProductos,
    filterByCategory,
    getProductosStockBajo,

    // Utilidades
    getProductById,
    getProductsByCategory,
    exportarCSV,

    // Estadísticas
    getTotalProducts,
    getStockBajoCount,
    getSinStockCount,
    getInventoryValue,
    getPopularCategory,

    // Helpers
    clearError,
  };
};

export default useProductos;
