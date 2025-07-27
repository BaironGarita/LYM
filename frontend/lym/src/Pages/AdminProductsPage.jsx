import { useState, useEffect } from "react";
import { Package, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import ProductoService from "../services/productoService.js";
import ProductFilters from "../components/product/ProductFilters.jsx";
import ProductTable from "../components/product/ProductTable.jsx";
import ProductModal from "../components/product/ProductModal.jsx";
import ProductStats from "../components/product/ProductStats.jsx";
import toast from "react-hot-toast";

const AdminProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchProductos();
      fetchCategorias();
      fetchEtiquetas();
    }
  }, [isAuthenticated]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await ProductoService.getProductos();
      setProductos(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch("http://localhost:81/api_lym/categorias", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategorias(data || []);
      }
    } catch (err) {
      console.error("Error fetching categorias:", err);
    }
  };

  const fetchEtiquetas = async () => {
    try {
      const response = await fetch("http://localhost:81/api_lym/etiquetas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEtiquetas(data || []);
      }
    } catch (err) {
      console.error("Error fetching etiquetas:", err);
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      const errors = ProductoService.validateProductData(formData);
      if (errors.length > 0) {
        throw new Error(errors.join(", "));
      }

      if (editingProduct) {
        await ProductoService.updateProducto(editingProduct.id, formData);
        toast.success("Producto actualizado exitosamente");
      } else {
        await ProductoService.createProducto(formData);
        toast.success("Producto creado exitosamente");
      }

      await fetchProductos();
      closeModal();
    } catch (err) {
      console.error("Error submitting product:", err);
      setError(err.message || "Error al procesar la solicitud");
      toast.error(err.message || "Error al procesar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await ProductoService.deleteProducto(deleteProductId);
      toast.success("Producto eliminado exitosamente");
      await fetchProductos();
      setShowDeleteModal(false);
      setDeleteProductId(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Error al eliminar el producto");
      console.error("Error deleting product:", err);
    }
  };

  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const getStatusColor = (stock) => {
    if (stock === 0) return "text-red-600 bg-red-100";
    if (stock < 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusText = (stock) => {
    if (stock === 0) return "Sin stock";
    if (stock < 10) return "Stock bajo";
    return "En stock";
  };

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? producto.categoria_id.toString() === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso requerido
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para ver los productos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              Gestión de Productos
            </h1>
            <p className="mt-2 text-gray-600">
              Administra el catálogo de productos de tu tienda
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <ProductStats />

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categorias={categorias}
      />

      <ProductTable
        productos={filteredProducts}
        onEdit={openModal}
        onDelete={openDeleteModal}
      />

      <ProductModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        categorias={categorias}
        etiquetas={etiquetas}
        submitting={submitting}
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Confirmar eliminación
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que quieres eliminar este producto? Esta acción
                no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
