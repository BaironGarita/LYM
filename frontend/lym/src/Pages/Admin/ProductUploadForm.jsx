import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Upload, Save } from "lucide-react";
import ProductoService from "@/services/productoService";

const ProductUploadForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    stock: "0",
    sku: "",
    imagen: null,
  });
  const [categorias, setCategorias] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await ProductoService.getCategorias();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("No se pudieron cargar las categorías.");
      }
    };
    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, categoria_id: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imagen) {
      toast.error("Por favor, selecciona una imagen para el producto.");
      return;
    }
    setSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await ProductoService.createProducto(data);
      toast.success("¡Producto creado exitosamente!");
      navigate("/admin/productos");
    } catch (error) {
      toast.error(`Error al crear el producto: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Upload className="h-8 w-8 text-blue-600" />
          Subir Nuevo Producto
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md space-y-8"
      >
        {/* --- Información Básica --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Información Básica
          </h2>
          <div>
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Camiseta de Algodón Premium"
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe las características, materiales, etc."
            />
          </div>
        </div>

        {/* --- Precios y Stock --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Precios y Stock
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="precio">Precio *</Label>
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
              <Label htmlFor="stock">Stock *</Label>
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
            Organización
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="categoria_id">Categoría *</Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger id="categoria_id">
                  <SelectValue placeholder="Seleccionar categoría" />
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
              <Label htmlFor="sku">SKU (Opcional)</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Código único del producto"
              />
            </div>
          </div>
        </div>

        {/* --- Imagen --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Imagen del Producto
          </h2>
          <div>
            <Label htmlFor="imagen">Subir imagen principal *</Label>
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
                Archivo seleccionado: {formData.imagen.name}
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
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Producto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUploadForm;
