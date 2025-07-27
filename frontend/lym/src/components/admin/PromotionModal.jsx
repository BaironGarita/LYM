import { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { toast } from "sonner";

const PromotionModal = ({
  show,
  onClose,
  onSubmit,
  editingPromotion,
  productos,
  categorias,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "categoria",
    porcentaje: "",
    fecha_inicio: "",
    fecha_fin: "",
    aplica_a_id: "",
  });
  const [errors, setErrors] = useState({});

  const isPastPromotion =
    editingPromotion && new Date(editingPromotion.fecha_inicio) < new Date();

  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        nombre: editingPromotion.nombre || "",
        tipo: editingPromotion.tipo || "categoria",
        porcentaje: editingPromotion.porcentaje || "",
        fecha_inicio: editingPromotion.fecha_inicio
          ? editingPromotion.fecha_inicio.split(" ")[0]
          : "",
        fecha_fin: editingPromotion.fecha_fin
          ? editingPromotion.fecha_fin.split(" ")[0]
          : "",
        aplica_a_id:
          editingPromotion.producto_id || editingPromotion.categoria_id || "",
      });
    } else {
      setFormData({
        nombre: "",
        tipo: "categoria",
        porcentaje: "",
        fecha_inicio: "",
        fecha_fin: "",
        aplica_a_id: "",
      });
    }
    setErrors({});
  }, [editingPromotion, show]);

  if (!show) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido.";
    if (
      !formData.porcentaje ||
      isNaN(formData.porcentaje) ||
      formData.porcentaje <= 0
    ) {
      newErrors.porcentaje = "El descuento debe ser un número positivo.";
    }
    if (!formData.fecha_inicio)
      newErrors.fecha_inicio = "La fecha de inicio es requerida.";
    if (!formData.fecha_fin)
      newErrors.fecha_fin = "La fecha de fin es requerida.";

    if (
      formData.fecha_inicio &&
      formData.fecha_fin &&
      new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)
    ) {
      newErrors.fecha_fin =
        "La fecha de fin no puede ser anterior a la de inicio.";
    }
    if (
      !editingPromotion &&
      new Date(formData.fecha_inicio) < new Date().setHours(0, 0, 0, 0)
    ) {
      newErrors.fecha_inicio = "La fecha de inicio no puede ser en el pasado.";
    }
    if (!formData.aplica_a_id)
      newErrors.aplica_a_id = `Debe seleccionar un ${formData.tipo}.`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPastPromotion) {
      toast.error("No se pueden modificar promociones pasadas.");
      return;
    }
    if (validate()) {
      // Extraemos 'aplica_a_id' para no enviarlo directamente
      const { aplica_a_id, ...restOfData } = formData;

      // Creamos el objeto de datos final para el envío
      const submissionData = {
        ...restOfData,
        // Añadimos dinámicamente 'producto_id' o 'categoria_id'
        ...(formData.tipo === "producto"
          ? { producto_id: aplica_a_id }
          : { categoria_id: aplica_a_id }),
      };

      onSubmit(submissionData); // Enviamos el objeto corregido
    } else {
      toast.error("Por favor, corrige los errores en el formulario.");
    }
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, tipo: value, aplica_a_id: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingPromotion ? "Editar" : "Crear"} Promoción
          </h2>
          {isPastPromotion && (
            <div className="p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md text-sm">
              Esta promoción ya no puede ser modificada.
            </div>
          )}

          <div>
            <Label htmlFor="nombre">Nombre de la Promoción</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              disabled={isPastPromotion}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Promoción</Label>
              <Select
                value={formData.tipo}
                onValueChange={handleTypeChange}
                disabled={isPastPromotion}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categoria">Categoría</SelectItem>
                  <SelectItem value="producto">Producto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aplica_a_id">Aplica a</Label>
              <Select
                value={formData.aplica_a_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, aplica_a_id: value })
                }
                disabled={isPastPromotion}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Seleccionar ${formData.tipo}`} />
                </SelectTrigger>
                <SelectContent>
                  {(formData.tipo === "categoria" ? categorias : productos).map(
                    (item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.nombre}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.aplica_a_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.aplica_a_id}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="porcentaje">Porcentaje de Descuento (%)</Label>
            <Input
              id="porcentaje"
              type="number"
              value={formData.porcentaje}
              onChange={(e) =>
                setFormData({ ...formData, porcentaje: e.target.value })
              }
              disabled={isPastPromotion}
            />
            {errors.porcentaje && (
              <p className="text-red-500 text-xs mt-1">{errors.porcentaje}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                disabled={isPastPromotion}
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_inicio}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.target.value })
                }
                disabled={isPastPromotion}
              />
              {errors.fecha_fin && (
                <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPastPromotion}>
              {editingPromotion ? "Guardar Cambios" : "Crear Promoción"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionModal;
