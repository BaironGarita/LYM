import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "../../shared/hooks/useI18n.js";
import ExtrasService from "../../shared/api/extrasService.js";
import { Button } from "../../shared/components/UI/button.jsx";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminExtrasPage = () => {
  const { t } = useI18n();
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalValues, setModalValues] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ExtrasService.getExtras();
      setExtras(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(t("extras.errors.load", "No se pudo cargar extras"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setModalValues({ nombre: "", descripcion: "", precio: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (ex) => {
    setModalMode("edit");
    setModalValues({
      nombre: ex.nombre || "",
      descripcion: ex.descripcion || "",
      precio: (ex.precio || 0).toString(),
    });
    setEditingId(ex.id);
    setShowModal(true);
  };

  const handleModalSave = async () => {
    const nombre = (modalValues.nombre || "").trim();
    if (!nombre) {
      toast.error(t("extras.errors.required", "El nombre es requerido"));
      return;
    }
    const payload = {
      nombre,
      descripcion: modalValues.descripcion || null,
      precio: parseFloat(modalValues.precio || 0) || 0,
    };
    try {
      if (modalMode === "create") {
        await ExtrasService.createExtra(payload);
        toast.success(t("extras.created", "Extra creado"));
      } else {
        await ExtrasService.updateExtra(editingId, payload);
        toast.success(t("extras.updated", "Extra actualizado"));
      }
      setShowModal(false);
      await fetchData();
    } catch (err) {
      toast.error(
        err.message || t("extras.errors.process", "Error al procesar")
      );
    }
  };

  const handleDelete = async (ex) => {
    if (!window.confirm(t("extras.confirmDelete", "¿Eliminar extra?"))) return;
    try {
      await ExtrasService.deleteExtra(ex.id);
      toast.success(t("extras.deleted", "Extra eliminado"));
      await fetchData();
    } catch (err) {
      toast.error(err.message || t("extras.errors.delete"));
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

  const filtered = extras.filter((it) =>
    it.nombre?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("extras.title", "Extras")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("extras.subtitle", "Gestiona los extras disponibles")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              aria-label="Buscar extras"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t(
                "admin.extras.searchPlaceholder",
                "Buscar por nombre..."
              )}
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-64"
            />
          </div>
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("admin.extras.new", "Nuevo extra")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {extras.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-600 mb-4">
              {t("admin.extras.empty", "No hay extras")}
            </p>
            <Button onClick={openCreateModal}>
              {t("admin.extras.new", "Crear primer extra")}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-2">ID</th>
                    <th className="py-2">{t("admin.extras.name", "Nombre")}</th>
                    <th className="py-2">
                      {t("admin.extras.price", "Precio")}
                    </th>
                    <th className="py-2 text-right">
                      {t("actions", "Acciones")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((ex) => (
                    <tr key={ex.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 text-sm text-gray-700">{ex.id}</td>
                      <td className="py-2 text-sm text-gray-800">
                        {ex.nombre}
                      </td>
                      <td className="py-2 text-sm text-gray-800">
                        ${Number(ex.precio ?? 0).toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(ex)}
                            className="inline-flex items-center gap-2 px-2 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50"
                            aria-label={`Editar ${ex.nombre}`}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("common.edit", "Editar")}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(ex)}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm text-red-700 hover:bg-red-50"
                            aria-label={`Eliminar ${ex.nombre}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("common.delete", "Eliminar")}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {modalMode === "create"
                ? t("extras.modal.create", "Crear extra")
                : t("extras.modal.edit", "Editar extra")}
            </h3>
            <label className="block text-sm text-gray-700 mb-2">
              {t("extras.name", "Nombre")}
            </label>
            <input
              value={modalValues.nombre}
              onChange={(e) =>
                setModalValues((s) => ({ ...s, nombre: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder={t("extras.name", "Nombre")}
            />
            <label className="block text-sm text-gray-700 mb-2">
              {t("extras.description", "Descripción")}
            </label>
            <textarea
              value={modalValues.descripcion}
              onChange={(e) =>
                setModalValues((s) => ({ ...s, descripcion: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder={t("extras.description", "Descripción")}
            ></textarea>
            <label className="block text-sm text-gray-700 mb-2">
              {t("extras.price", "Precio")}
            </label>
            <input
              type="number"
              step="0.01"
              value={modalValues.precio}
              onChange={(e) =>
                setModalValues((s) => ({ ...s, precio: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder={t("extras.price", "Precio")}
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

export default AdminExtrasPage;
