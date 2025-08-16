import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/shared/components/UI/button";
import { Input } from "@/shared/components/UI/input";
import { Label } from "@/shared/components/UI/label";
import { Textarea } from "@/shared/components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/UI/select";
import { Upload, Save } from "lucide-react";
import ProductoService from "@/shared/api/productoService";
import { useI18n } from "@/shared/hooks/useI18n";

const ProductUploadForm = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    stock: "0",
    sku: "",
  imagen: null,
  etiquetas: [],
  });
  const [categorias, setCategorias] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [selectedOpciones, setSelectedOpciones] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await ProductoService.getCategorias();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          t(
            "admin.productUpload.errors.loadCategories",
            "No se pudieron cargar las categorías."
          )
        );
      }
    };
    fetchCategorias();

    const fetchOpciones = async () => {
      try {
        const data = await ProductoService.getOpcionesPersonalizacion();
        setOpciones(Array.isArray(data) ? data : []);
      } catch (error) {
        // Silencioso: no bloquear creación de producto por falta de opciones
        console.warn(
          "No se pudieron cargar opciones de personalización",
          error
      );
      }
    };
    fetchOpciones();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, categoria_id: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length) {
      // Single file expected by backend under 'imagen'
      setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, imagen: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imagen) {
      toast.error(
        t(
          "admin.productUpload.errors.noImage",
          "Por favor, selecciona una imagen para el producto."
        )
      );
      return;
    }
    setSubmitting(true);

    const data = new FormData();
    // Append scalar fields
    data.append('nombre', formData.nombre || '');
    data.append('descripcion', formData.descripcion || '');
    data.append('precio', formData.precio || '0');
    data.append('categoria_id', formData.categoria_id || '');
    data.append('stock', formData.stock || '0');
    if (formData.sku) data.append('sku', formData.sku);

    // File field expected as 'imagen'
    if (formData.imagen) {
      data.append('imagen', formData.imagen, formData.imagen.name);
    }

    // Etiquetas (array) -> enviar como CSV y como índices separados
    if (Array.isArray(formData.etiquetas) && formData.etiquetas.length > 0) {
      // backend ProductoModel.create acepta etiquetas como CSV o array ids, so send as CSV
      data.append('etiquetas', formData.etiquetas.join(','));
      formData.etiquetas.forEach((val) => data.append('etiquetas[]', val));
    }

    // Opciones de personalización seleccionadas
    if (Array.isArray(selectedOpciones) && selectedOpciones.length > 0) {
      data.append('opciones', selectedOpciones.join(','));
      selectedOpciones.forEach((val) => data.append('opciones[]', val));
    }

    try {
      const created = await ProductoService.createProducto(data);
  // ProductoService.createProducto should detect FormData and post without setting Content-Type
      // Si el backend devuelve el id del producto creado
      const productoId =
        created?.id || created?.insertId || created?.result?.id;

      // Asociar opciones de personalización seleccionadas
      if (selectedOpciones && selectedOpciones.length > 0 && productoId) {
        for (const opcionId of selectedOpciones) {
          try {
            await ProductoService.createProductoPersonalizacion({
              producto_id: productoId,
              opcion_id: opcionId,
              obligatorio: 0,
            });
          } catch (err) {
            console.warn("No se pudo asociar opcion", opcionId, err);
          }
        }
        // If API requires separate endpoints to associate options, call them here.
        // Placeholder: ProductoService.associateOpciones(productoId, selectedOpciones)
        if (ProductoService.associateOpciones) {
          await ProductoService.associateOpciones(productoId, selectedOpciones);
        }
      }

      toast.success(
        t(
          "admin.productUpload.success.created",
          "¡Producto creado exitosamente!"
        )
      );
      navigate("/admin/productos");
    } catch (error) {
      toast.error(
        t(
          "admin.productUpload.errors.create",
          "Error al crear el producto: {{message}}",
          { message: error.message }
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Upload className="h-8 w-8 text-blue-600" />
          {t("admin.productUpload.title", "Subir Nuevo Producto")}
        </h1>
      </div>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md space-y-8"
      >
        {/* --- Información Básica --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            {t("admin.productUpload.sections.basicInfo", "Información Básica")}
          </h2>
          <div>
            <Label htmlFor="nombre">
              {t("admin.productUpload.fields.name", "Nombre del Producto")} *
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder={t(
                "admin.productUpload.placeholders.name",
                "Ej: Camiseta de Algodón Premium"
              )}
            />
          </div>
          <div>
            <Label htmlFor="descripcion">
              {t("admin.productUpload.fields.description", "Descripción")}
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder={t(
                "admin.productUpload.placeholders.description",
                "Describe las características, materiales, etc."
              )}
            />
          </div>
        </div>

        {/* --- Precios y Stock --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            {t("admin.productUpload.sections.priceStock", "Precios y Stock")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="precio">
                {t("admin.productUpload.fields.price", "Precio")} *
              </Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">
                {t("admin.productUpload.fields.stock", "Stock")} *
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* --- Organización --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            {t("admin.productUpload.sections.organization", "Organización")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="categoria_id">
                {t("admin.productUpload.fields.category", "Categoría")} *
              </Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger id="categoria_id">
                  <SelectValue
                    placeholder={t(
                      "admin.productUpload.placeholders.category",
                      "Seleccionar categoría"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sku">
                {t("admin.productUpload.fields.sku", "SKU (Opcional)")}
              </Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder={t(
                  "admin.productUpload.placeholders.sku",
                  "Código único del producto"
                )}
              />
            </div>
          </div>
        </div>

        {/* --- Personalizaciones --- */}
        {opciones.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
              {t(
                "admin.productUpload.sections.personalization",
                "Personalizaciones"
              )}
            </h2>
            <p className="text-sm text-gray-600">
              Seleccione las opciones que aplican a este producto (opcional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opciones.map((op) => (
                <label key={op.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={op.id}
                    checked={selectedOpciones.includes(String(op.id))}
                    onChange={(e) => {
                      const val = String(op.id);
                      setSelectedOpciones((prev) =>
                        prev.includes(val)
                          ? prev.filter((p) => p !== val)
                          : [...prev, val]
                      );
                    }}
                  />
                  <span className="font-medium">
                    {op.nombre} ({op.tipo})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* --- Imagen --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            {t("admin.productUpload.sections.image", "Imagen del Producto")}
          </h2>
          <div>
            <Label htmlFor="imagen">
              {t("admin.productUpload.fields.image", "Subir imagen principal")}{" "}
              *
            </Label>
            <Input
              id="imagen"
              name="imagen"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.imagen && (
              <p className="text-sm text-gray-500 mt-2">
                {t(
                  "admin.productUpload.selectedFile",
                  "Archivo seleccionado: {{name}}",
                  { name: formData.imagen.name }
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2 px-6 py-3"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("admin.productUpload.saving", "Guardando...")}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t("admin.productUpload.saveButton", "Guardar Producto")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUploadForm;
