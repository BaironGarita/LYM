import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import { Plus, Package } from "lucide-react";
import ProductTable from "@/components/product/ProductTable"; // <-- Usando tu componente existente
import ProductStats from "@/components/product/ProductStats"; // <-- Usando tu componente existente
import ProductFilters from "@/components/product/ProductFilters"; // <-- Usando tu componente existente
import ProductModal from "@/components/product/ProductModal"; // <-- Usando tu componente existente
import ProductoService from "@/services/productoService";

export const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros y modales
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosRes, categoriasRes] = await Promise.all([
          ProductoService.getProductos(),
          ProductoService.getCategorias(),
        ]);
        setProductos(productosRes);
        setFilteredProductos(productosRes);
        setCategorias(categoriasRes);
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let result = productos;
    if (searchTerm) {
      result = result.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.categoria_id == selectedCategory);
    }
    setFilteredProductos(result);
  }, [searchTerm, selectedCategory, productos]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleSubmit = async (formData) => {
    // Lógica para crear o editar producto (a implementar)
    setSubmitting(true);
    toast.info("Funcionalidad de guardar en desarrollo...");
    console.log("Datos a enviar:", formData);
    setTimeout(() => {
      setSubmitting(false);
      handleCloseModal();
    }, 1000);
  };

  const handleDelete = (productId) => {
    if (window.confirm("¿Estás seguro?")) {
      toast.success(`Producto ${productId} eliminado (simulado).`);
      setProductos(productos.filter((p) => p.id !== productId));
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            Gestión de Productos
          </h1>
          <p className="mt-1 text-gray-600">
            Administra el inventario de productos de tu tienda.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Añadir Producto
        </Button>
      </div>

      {/* Estadísticas de Productos */}
      <ProductStats />

      {/* Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categorias={categorias}
      />

      {/* Tabla de Productos */}
      {loading ? (
        <p className="text-center py-10">Cargando productos...</p>
      ) : (
        <ProductTable
          productos={filteredProductos}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {/* Modal para Crear/Editar */}
      <ProductModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        categorias={categorias}
        etiquetas={[]} // Pasar etiquetas si las tienes
        submitting={submitting}
      />
    </div>
  );
};
