import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useI18n } from "../../shared/hooks/useI18n.js";
import ProductoService from "../../shared/api/productoService.js";
import ExtrasService from "../../shared/api/extrasService.js";
import ProductoExtraService from "../../shared/api/productoExtraService.js";
import { Button } from "../../shared/components/UI/button.jsx";
import {
  Search,
  Link as LinkIcon,
  Plug,
  Layers3,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Página de administración para vincular (asignar / quitar) Extras a Productos.
 * Referencia de estilo tomada de `AdminExtrasPage.jsx`.
 *
 * Flujo:
 * 1. Carga lista de productos y extras.
 * 2. Al abrir el modal de un producto, carga (si no están) los extras asignados a ese producto.
 * 3. El usuario selecciona/deselecciona extras (checkboxes) y guarda.
 * 4. Se calculan las diferencias y se llaman los endpoints attach/detach necesarios.
 */

const PER_PAGE = 10;

const AdminProductoExtrasPage = () => {
  const { t } = useI18n();

  // Datos base
  const [productos, setProductos] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación & búsqueda productos
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal de asignación
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // objeto producto
  const [productExtras, setProductExtras] = useState({}); // productId -> Set(extraId)
  const [modalSelected, setModalSelected] = useState(new Set()); // selección actual en UI
  const [modalSearch, setModalSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProductExtras, setLoadingProductExtras] = useState(false);

  // Cargar productos y extras iniciales
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prods, exs] = await Promise.all([
          ProductoService.getProductos().catch((e) => {
            console.error(e);
            throw new Error(
              t(
                "productoExtras.errors.loadProducts",
                "Error cargando productos"
              )
            );
          }),
          ExtrasService.getExtras().catch((e) => {
            console.error(e);
            throw new Error(
              t("productoExtras.errors.loadExtras", "Error cargando extras")
            );
          }),
        ]);
        setProductos(Array.isArray(prods) ? prods : []);
        setExtras(Array.isArray(exs) ? exs : []);
      } catch (err) {
        setError(err.message || "Error");
        toast.error(
          err.message || t("productoExtras.errors.load", "Error cargando datos")
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  // Filtrar + paginar productos
  const filteredProductos = useMemo(() => {
    const term = search.toLowerCase();
    return productos.filter((p) =>
      (p.nombre || "").toLowerCase().includes(term)
    );
  }, [productos, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProductos.length / PER_PAGE)
  );
  const start = (page - 1) * PER_PAGE;
  const paginated = filteredProductos.slice(start, start + PER_PAGE);

  const openModal = async (product) => {
    setCurrentProduct(product);
    setModalSearch("");
    setShowModal(true);
    const pid = String(product.id);

    // Si ya tenemos cacheado, usarlo
    if (productExtras[pid]) {
      setModalSelected(new Set(productExtras[pid]));
      return;
    }

    // Cargar asignaciones del producto
    setLoadingProductExtras(true);
    try {
      const list = await ProductoExtraService.getExtrasByProducto(product.id);
      const setIds = new Set((list || []).map((ex) => String(ex.id)));
      setProductExtras((prev) => ({ ...prev, [pid]: setIds }));
      setModalSelected(new Set(setIds));
    } catch (err) {
      console.error(err);
      toast.error(
        err.message ||
          t(
            "productoExtras.errors.loadProductExtras",
            "No se pudieron cargar los extras del producto"
          )
      );
      setModalSelected(new Set());
    } finally {
      setLoadingProductExtras(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setModalSelected(new Set());
  };

  const toggleExtra = (extraId) => {
    setModalSelected((prev) => {
      const next = new Set(prev);
      const idStr = String(extraId);
      if (next.has(idStr)) next.delete(idStr);
      else next.add(idStr);
      return next;
    });
  };

  const saveAssignments = async () => {
    if (!currentProduct) return;
    const pid = String(currentProduct.id);
    const original = productExtras[pid] || new Set();
    const current = modalSelected;

    // Calcular diferencias
    const toAttach = [...current].filter((id) => !original.has(id));
    const toDetach = [...original].filter((id) => !current.has(id));

    if (toAttach.length === 0 && toDetach.length === 0) {
      toast.info(t("productoExtras.noChanges", "Sin cambios"));
      closeModal();
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      t("productoExtras.saving", "Guardando asignaciones")
    );
    try {
      // Ejecutar en serie para simplicidad (lista corta). Se podría paralelizar.
      for (const id of toAttach) {
        await ProductoExtraService.attachExtra(currentProduct.id, id);
      }
      for (const id of toDetach) {
        await ProductoExtraService.detachExtra(currentProduct.id, id);
      }
      // Actualizar cache local
      setProductExtras((prev) => ({ ...prev, [pid]: new Set(current) }));
      toast.success(t("productoExtras.saved", "Asignaciones actualizadas"), {
        id: toastId,
      });
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(
        err.message || t("productoExtras.errors.save", "Error guardando"),
        { id: toastId }
      );
    } finally {
      setSaving(false);
    }
  };

  const modalFilteredExtras = useMemo(() => {
    const term = modalSearch.toLowerCase();
    return extras.filter((e) => (e.nombre || "").toLowerCase().includes(term));
  }, [extras, modalSearch]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-xl">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-40 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        {t("productoExtras.errorGeneric", error)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers3 className="h-6 w-6 text-blue-600" />
            {t("productoExtras.title", "Productos y Extras")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "productoExtras.subtitle",
              "Asigna extras disponibles a cada producto"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("productoExtras.search", "Buscar productos...")}
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-72"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {productos.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              {t("productoExtras.empty", "No hay productos disponibles")}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 px-1">ID</th>
                    <th className="py-2 px-1">
                      {t("productoExtras.product", "Producto")}
                    </th>
                    <th className="py-2 px-1">
                      {t("productoExtras.price", "Precio")}
                    </th>
                    <th className="py-2 px-1">
                      {t("productoExtras.extrasCount", "Extras")}
                    </th>
                    <th className="py-2 px-1 text-right">
                      {t("actions", "Acciones")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => {
                    const pid = String(p.id);
                    const assigned = productExtras[pid];
                    const assignedCount = assigned ? assigned.size : "-";
                    return (
                      <tr
                        key={p.id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-1 text-gray-700">{p.id}</td>
                        <td className="py-2 px-1 font-medium text-gray-800">
                          {p.nombre}
                        </td>
                        <td className="py-2 px-1 text-gray-700">
                          $ {Number(p.precio || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-1">
                          <span className="inline-flex items-center gap-1 text-gray-700">
                            <Plug className="h-4 w-4 text-indigo-500" />
                            <strong>{assignedCount}</strong>
                          </span>
                        </td>
                        <td className="py-2 px-1 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => openModal(p)}
                          >
                            <LinkIcon className="h-4 w-4" />
                            {t("productoExtras.manage", "Gestionar")}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {t("pagination.showing", "Mostrando")}{" "}
                <strong>{Math.min(start + 1, filteredProductos.length)}</strong>{" "}
                -{" "}
                <strong>
                  {Math.min(start + paginated.length, filteredProductos.length)}
                </strong>{" "}
                {t("pagination.of", "de")} {filteredProductos.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded border disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-sm">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded border disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal asignación */}
      {showModal && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !saving && closeModal()}
          />
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 z-10 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {t("productoExtras.modalTitle", "Extras del producto")}:{" "}
                  <span className="text-blue-600">{currentProduct.nombre}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  {loadingProductExtras
                    ? t(
                        "productoExtras.loadingAssignments",
                        "Cargando asignaciones..."
                      )
                    : t(
                        "productoExtras.modalSubtitle",
                        "Selecciona los extras que aplican a este producto"
                      )}
                </p>
              </div>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => !saving && closeModal()}
                aria-label={t("close", "Cerrar")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Buscador extras */}
            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder={t(
                    "productoExtras.searchExtras",
                    "Buscar extras..."
                  )}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setModalSelected(new Set(extras.map((e) => String(e.id))))
                }
                disabled={extras.length === 0}
              >
                {t("selectAll", "Todos")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalSelected(new Set())}
              >
                {t("clear", "Limpiar")}
              </Button>
            </div>

            {/* Lista de extras */}
            <div className="flex-1 overflow-y-auto border rounded-md divide-y">
              {modalFilteredExtras.length === 0 && !loadingProductExtras && (
                <div className="p-6 text-center text-sm text-gray-500">
                  {t("productoExtras.noExtras", "No hay extras que coincidan")}
                </div>
              )}
              {loadingProductExtras && (
                <div className="p-6 text-center text-sm text-gray-500">
                  {t("loading", "Cargando...")}
                </div>
              )}
              {modalFilteredExtras.map((ex) => {
                const idStr = String(ex.id);
                const selected = modalSelected.has(idStr);
                return (
                  <label
                    key={ex.id}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={selected}
                      onChange={() => toggleExtra(ex.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {ex.nombre}
                        </span>
                        {selected && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      {(ex.descripcion || "").trim() && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {ex.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      $ {Number(ex.precio || 0).toFixed(2)}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Acciones */}
            <div className="pt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => !saving && closeModal()}
                disabled={saving}
              >
                {t("cancel", "Cancelar")}
              </Button>
              <Button
                onClick={saveAssignments}
                disabled={saving}
                className="gap-2"
              >
                {saving && (
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {t("save", "Guardar")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductoExtrasPage;
