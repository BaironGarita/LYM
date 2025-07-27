import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X } from "lucide-react"; // Usaremos el ícono X para los botones de cierre
import productoService from "../../services/productoService";

// El esquema de validación no cambia
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  descripcion: yup.string().required("La descripción es requerida"),
  precio: yup
    .number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser positivo")
    .required("El precio es requerido"),
  stock: yup
    .number()
    .typeError("El stock debe ser un número")
    .integer("El stock debe ser un entero")
    .min(0, "El stock no puede ser negativo")
    .required("El stock es requerido"),
  categoria_id: yup.string().required("La categoría es requerida"),
  etiquetas: yup.array().min(1, "Selecciona al menos una etiqueta"),
  // Nuevos campos
  peso: yup
    .number()
    .typeError("El peso debe ser un número")
    .min(0, "El peso no puede ser negativo")
    .nullable(),
  dimensiones: yup.string().nullable(),
  material: yup.string().nullable(),
  color: yup.string().nullable(),
  genero: yup.string().nullable(),
  temporada: yup.string().nullable(),
});

const ProductModal = ({
  show,
  handleClose,
  product,
  onSave,
  categories,
  tags,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  useEffect(() => {
    if (product) {
      reset({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        categoria_id: product.categoria_id,
        etiquetas: product.etiquetas ? product.etiquetas.map((t) => t.id) : [],
        peso: product.peso || "",
        dimensiones: product.dimensiones || "",
        material: product.material || "",
        color: product.color || "",
        genero: product.genero || "",
        temporada: product.temporada || "",
      });
      setExistingImages(product.imagenes || []);
    } else {
      reset({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: 0,
        categoria_id: "",
        etiquetas: [],
        peso: "",
        dimensiones: "",
        material: "",
        color: "",
        genero: "",
        temporada: "",
      });
      setExistingImages([]);
    }
    setNewImagesPreview([]);
    setNewImageFiles([]);
  }, [product, show, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreview(previewUrls);
  };

  const handleDeleteExistingImage = async (imageId, e) => {
    e.preventDefault();
    if (window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
        await productoService.deleteProductImage(imageId);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        alert("No se pudo eliminar la imagen.");
      }
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "etiquetas") {
        data[key].forEach((tagId) => formData.append("etiquetas[]", tagId));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (newImageFiles.length > 0) {
      newImageFiles.forEach((file) => {
        formData.append("imagenes[]", file);
      });
    }

    onSave(formData, product ? product.id : null);
  };

  const tagOptions = tags.map((tag) => ({ value: tag.id, label: tag.nombre }));
  const defaultTagValues =
    product?.etiquetas?.map((t) => ({ value: t.id, label: t.nombre })) || [];

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">
            {product ? "Editar Producto" : "Crear Producto"}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-grow overflow-y-auto"
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {product && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Promedio Valoraciones
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${parseFloat(
                      product.promedio_valoracion || 0
                    ).toFixed(
                      1
                    )} / 5.0 (${product.total_resenas || 0} reseñas)`}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  {...register("nombre")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  {...register("descripcion")}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="precio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="precio"
                    {...register("precio")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.precio && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.precio.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    {...register("stock")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Nuevos Campos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="peso"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="peso"
                    {...register("peso")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.peso && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.peso.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="dimensiones"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dimensiones/Talla
                  </label>
                  <input
                    type="text"
                    id="dimensiones"
                    {...register("dimensiones")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="material"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Material
                  </label>
                  <input
                    type="text"
                    id="material"
                    {...register("material")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Color Principal
                  </label>
                  <input
                    type="text"
                    id="color"
                    {...register("color")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="genero"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Género
                  </label>
                  <select
                    id="genero"
                    {...register("genero")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="temporada"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Temporada
                  </label>
                  <select
                    id="temporada"
                    {...register("temporada")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccione</option>
                    <option value="Verano">Verano</option>
                    <option value="Otoño">Otoño</option>
                    <option value="Invierno">Invierno</option>
                    <option value="Primavera">Primavera</option>
                    <option value="Todo el año">Todo el año</option>
                  </select>
                </div>
              </div>
              {/* Fin Nuevos Campos */}
              <div>
                <label
                  htmlFor="categoria_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <select
                  id="categoria_id"
                  {...register("categoria_id")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoria_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categoria_id.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Etiquetas
                </label>
                <Controller
                  name="etiquetas"
                  control={control}
                  defaultValue={defaultTagValues.map((t) => t.value)}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={tagOptions}
                      defaultValue={defaultTagValues}
                      onChange={(options) =>
                        field.onChange(options.map((o) => o.value))
                      }
                      className="mt-1"
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.etiquetas && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.etiquetas.message}
                  </p>
                )}
              </div>
            </div>

            {/* Columna Derecha - Imágenes */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes del Producto
                </label>
                <div className="mt-1 p-2 border-2 border-dashed border-gray-300 rounded-md">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${image.url_imagen}`}
                      alt="Imagen existente"
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <button
                      onClick={(e) => handleDeleteExistingImage(image.id, e)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {newImagesPreview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt="Previsualización"
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Nueva
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end items-center p-4 border-t space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
