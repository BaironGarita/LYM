import { useState } from "react";
import {
  Upload,
  Package,
  DollarSign,
  Hash,
  Tag,
  FileText,
  Image,
} from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { useI18n } from "../../shared/hooks/useI18n";
import { toast } from "sonner";

// El componente InputField se mueve aquí, fuera de UploadProductPage.
const InputField = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
    />
  </div>
);

export function UploadProductPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    // previews
    const previews = files.map((f) => URL.createObjectURL(f));
    // limpiar previos revocados si hubiera
    imagePreview.forEach((url) => URL.revokeObjectURL(url));
    setImagePreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.nombre || imageFiles.length === 0) {
      setError("Nombre y al menos una imagen son requeridos");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("precio", product.precio);
      formData.append("stock", product.stock);
      formData.append("categoria_id", product.categoria_id);

      // Agregar archivos; usar 'imagenes[]' o 'imagenes' ambos son aceptados por PHP
      imageFiles.forEach((file) => formData.append("imagenes[]", file));

      const res = await fetch("http://localhost:81/api/productos", {
        method: "POST",
        // NO poner 'Content-Type': el navegador lo añade
        // headers: { Authorization: `Bearer ${user?.token}` }, // descomenta si tu API exige auth
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        console.error("API error:", res.status, data);
        throw new Error(data.error || data.message || `HTTP ${res.status}`);
      }

      console.log("Producto creado:", data);
      setSuccess("Producto creado");
      // limpiar previews
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreview([]);
      setProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria_id: "",
      });
    } catch (err) {
      console.error("Error upload:", err);
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Upload className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.uploadProduct.title", "Subir Nuevo Producto")}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t(
            "admin.uploadProduct.subtitle",
            "Completa el formulario para agregar un nuevo artículo al inventario."
          )}
        </p>
      </div>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <InputField
          id="nombre"
          name="nombre"
          type="text"
          placeholder={t(
            "admin.uploadProduct.fields.name",
            "Nombre del Producto"
          )}
          value={product.nombre}
          onChange={handleChange}
          icon={Package}
        />

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="descripcion"
            name="descripcion"
            value={product.descripcion}
            onChange={handleChange}
            placeholder={t(
              "admin.uploadProduct.fields.description",
              "Descripción del Producto"
            )}
            rows={4}
            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            placeholder={t("admin.uploadProduct.fields.price", "Precio")}
            value={product.precio}
            onChange={handleChange}
            icon={DollarSign}
          />
          <InputField
            id="stock"
            name="stock"
            type="number"
            min="0"
            placeholder={t("admin.uploadProduct.fields.stock", "Stock")}
            value={product.stock}
            onChange={handleChange}
            icon={Hash}
          />
        </div>

        <InputField
          id="categoria_id"
          name="categoria_id"
          type="number"
          min="1"
          placeholder={t(
            "admin.uploadProduct.fields.categoryId",
            "ID de Categoría"
          )}
          value={product.categoria_id}
          onChange={handleChange}
          icon={Tag}
        />

        {/* Campo de imágenes mejorado */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Imágenes del Producto *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Image className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="file"
              name="imagenes[]"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              required
            />
          </div>

          {/* Preview de imágenes */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Selecciona una o más imágenes (JPG, PNG, WEBP, GIF). Máximo 5MB por
            imagen.
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("admin.uploadProduct.uploading", "Subiendo...")}
              </div>
            ) : (
              t("admin.uploadProduct.addButton", "Agregar Producto")
            )}
          </button>
        </div>

        {success && <p className="text-center text-green-600">{success}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
}
