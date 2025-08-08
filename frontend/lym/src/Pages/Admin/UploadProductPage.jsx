import { useState } from "react";
import { Upload, Package, DollarSign, Hash, Tag, FileText } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";

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
  const { user } = useAuth(); // Obtenemos el objeto 'user' completo
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    imagen_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/productos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Usamos user.token para obtener el token
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            ...product,
            precio: parseFloat(product.precio),
            stock: parseInt(product.stock, 10),
            categoria_id: parseInt(product.categoria_id, 10),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir el producto.");
      }

      setSuccess("¡Producto subido exitosamente!");
      setProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria_id: "",
        imagen_url: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // La definición de InputField se ha movido fuera del componente.

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Upload className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold tracking-tight">
            Subir Nuevo Producto
          </h1>
        </div>
        <p className="text-muted-foreground">
          Completa el formulario para agregar un nuevo artículo al inventario.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <InputField
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Nombre del Producto"
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
            placeholder="Descripción del Producto"
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
            placeholder="Precio"
            value={product.precio}
            onChange={handleChange}
            icon={DollarSign}
          />
          <InputField
            id="stock"
            name="stock"
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            icon={Hash}
          />
        </div>

        <InputField
          id="categoria_id"
          name="categoria_id"
          type="number"
          placeholder="ID de Categoría"
          value={product.categoria_id}
          onChange={handleChange}
          icon={Tag}
        />
        <InputField
          id="imagen_url"
          name="imagen_url"
          type="text"
          placeholder="URL de la Imagen"
          value={product.imagen_url}
          onChange={handleChange}
          icon={Upload}
        />

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Subiendo..." : "Agregar Producto"}
          </button>
        </div>

        {success && <p className="text-center text-green-600">{success}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
}
