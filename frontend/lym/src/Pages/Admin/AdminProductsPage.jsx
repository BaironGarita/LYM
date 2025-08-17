import { useState, useEffect } from "react";
import { Package, Plus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../shared/hooks/useAuth.jsx";
import { useI18n } from "../../shared/hooks/useI18n.js";
import ProductoService from "../../shared/api/productoService.js";
import ProductFilters from "../../features/product-management/ProductFilters.jsx";
import ProductTable from "../../features/product-management/ProductTable.jsx";
import ProductModal from "../../features/product-management/ProductModal.jsx";
import ProductStats from "../../features/product-management/ProductStats.jsx";
import { Button } from "../../shared/components/UI/button.jsx";

const AdminProductsPage = () => {
  const { t } = useI18n();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productosRes, categoriasRes, etiquetasRes] = await Promise.all([
        ProductoService.getProductos(),
        ProductoService.getCategorias(),
        ProductoService.getEtiquetas(),
      ]);
      setProductos(Array.isArray(productosRes) ? productosRes : []);
      setCategorias(Array.isArray(categoriasRes) ? categoriasRes : []);
      setEtiquetas(Array.isArray(etiquetasRes) ? etiquetasRes : []);
    } catch (err) {
      const errorMessage = t("products.errors.loadData") + " " + err.message;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchData();
    }
  }, [isAuthenticated]);

  const openModal = (product = null) => {
    if (product) {
      const productToEdit = {
        ...product,
        etiquetas: product.etiquetas || [],
      };
      setEditingProduct(productToEdit);
    } else {
      setEditingProduct(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const toastId = toast.loading(
      editingProduct ? t("products.updating") : t("products.creating")
    );

    try {
      if (editingProduct) {
        await ProductoService.updateProducto(editingProduct.id, formData);
        toast.success(t("products.success.updated"), { id: toastId });
      } else {
        await ProductoService.createProducto(formData);
        toast.success(t("products.success.created"), { id: toastId });
      }
      await fetchData();
      closeModal();
    } catch (err) {
      toast.error(err.message || t("products.errors.process"), {
        id: toastId,
      });
      console.error("Error submitting product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    const toastId = toast.loading(t("products.deleting"));
    try {
      await ProductoService.deleteProducto(deleteProductId);
      toast.success(t("products.success.deleted"), { id: toastId });
      await fetchData();
      setShowDeleteModal(false);
      setDeleteProductId(null);
    } catch (err) {
      toast.error(err.message || t("products.errors.delete"), {
        id: toastId,
      });
      console.error("Error deleting product:", err);
    }
  };

  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? producto.categoria_id.toString() === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated()) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">
          {t("products.accessRequired")}
        </h2>
        <p className="text-gray-600">{t("products.loginRequired")}</p>
      </div>
    );
  }

  if (loading) return <div className="p-8">{t("products.loading")}</div>;
  if (error && !productos.length)
    return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            {t("products.title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("products.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/categorias">
            <button className="px-3 py-2 rounded-md border text-sm">
              {t("admin.categories.title", "Categorías")}
            </button>
          </Link>
          <Link to="/admin/etiquetas">
            <button className="px-3 py-2 rounded-md border text-sm">
              {t("admin.tags.title", "Etiquetas")}
            </button>
          </Link>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="h-5 w-5" />
            {t("products.newProduct")}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {t("admin.products.error", error)}
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
        handleClose={closeModal}
        onSave={handleSubmit}
        product={editingProduct}
        categories={categorias}
        tags={etiquetas}
        submitting={submitting}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("products.confirmDelete")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("products.deleteMessage")}
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("products.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  {t("products.delete")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
