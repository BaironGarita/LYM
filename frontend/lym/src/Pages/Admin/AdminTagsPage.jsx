import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "../../shared/hooks/useI18n.js";
import EtiquetaService from "../../shared/api/etiquetaService.js";
import { Button } from "../../shared/components/UI/button.jsx";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminTagsPage = () => {
  const { t } = useI18n();
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await EtiquetaService.getEtiquetas();
      setEtiquetas(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(t("tags.errors.load", "No se pudo cargar etiquetas"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal state for create/edit (replaces window.prompt)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [modalValue, setModalValue] = useState("");
  const [editingId, setEditingId] = useState(null);

  const openCreateModal = () => {
    setModalMode("create");
    setModalValue("");
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (tag) => {
    setModalMode("edit");
    setModalValue(tag.nombre || "");
    setEditingId(tag.id);
    setShowModal(true);
  };

  const handleModalSave = async () => {
    const nombre = (modalValue || "").trim();
    if (!nombre) {
      toast.error(t("tags.errors.required", "El nombre es requerido"));
      return;
    }
    try {
      if (modalMode === "create") {
        await EtiquetaService.createEtiqueta({ nombre });
        toast.success(t("tags.created", "Etiqueta creada"));
      } else {
        await EtiquetaService.updateEtiqueta(editingId, { nombre });
        toast.success(t("tags.updated", "Etiqueta actualizada"));
      }
      setShowModal(false);
      await fetchData();
    } catch (err) {
      toast.error(err.message || t("tags.errors.process", "Error al procesar"));
    }
  };

  const handleDelete = async (tag) => {
    if (!window.confirm(t("tags.confirmDelete", "¿Eliminar etiqueta?"))) return;
    try {
      await EtiquetaService.deleteEtiqueta(tag.id);
      toast.success(t("tags.deleted", "Etiqueta eliminada"));
      await fetchData();
    } catch (err) {
      toast.error(err.message || t("tags.errors.delete"));
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );

  const filtered = etiquetas.filter((tagItem) =>
    tagItem.nombre?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("tags.title", "Etiquetas")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("tags.subtitle", "Gestiona las etiquetas usadas en productos")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              aria-label="Buscar etiquetas"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("tags.searchPlaceholder", "Buscar por nombre...")}
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-64"
            />
          </div>
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("tags.new", "Nueva etiqueta")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {etiquetas.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-600 mb-4">
              {t("tags.empty", "No hay etiquetas")}
            </p>
            <Button onClick={handleCreate}>
              {t("tags.new", "Crear primera etiqueta")}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-2">ID</th>
                    <th className="py-2">{t("tags.name", "Nombre")}</th>
                    <th className="py-2 text-right">
                      {t("actions", "Acciones")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tag) => (
                    <tr key={tag.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 text-sm text-gray-700">{tag.id}</td>
                      <td className="py-2 text-sm text-gray-800">
                        {tag.nombre}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="inline-flex items-center gap-2 px-2 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50"
                            aria-label={`Editar ${tag.nombre}`}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("edit", "Editar")}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(tag)}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm text-red-700 hover:bg-red-50"
                            aria-label={`Eliminar ${tag.nombre}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("delete", "Eliminar")}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {t("pagination.showing", "Mostrando")}{" "}
                <strong>{Math.min(start + 1, filtered.length)}</strong> -{" "}
                <strong>
                  {Math.min(start + paginated.length, filtered.length)}
                </strong>{" "}
                {t("pagination.of", "de")} {filtered.length}
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
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {modalMode === "create"
                ? t("tags.modal.create", "Crear etiqueta")
                : t("tags.modal.edit", "Editar etiqueta")}
            </h3>
            <label className="block text-sm text-gray-700 mb-2">
              {t("tags.name", "Nombre")}
            </label>
            <input
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder={t("tags.name", "Nombre")}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                {t("cancel", "Cancelar")}
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {t("save", "Guardar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTagsPage;
