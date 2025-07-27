import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Edit, Trash2 } from "lucide-react";

const PromotionsTable = ({ promotions, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CR");
  };

  const getStatus = (promo) => {
    const now = new Date();
    const startDate = new Date(promo.fecha_inicio);
    const endDate = new Date(promo.fecha_fin);

    if (now > endDate) {
      return <Badge variant="destructive">Finalizada</Badge>;
    }
    if (now >= startDate && now <= endDate) {
      return <Badge className="bg-green-500">Activa</Badge>;
    }
    return <Badge variant="secondary">Programada</Badge>;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descuento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vigencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {promotions.map((promo) => (
            <tr key={promo.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {promo.nombre}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  Aplica a:{" "}
                  {promo.producto_nombre || promo.categoria_nombre || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {promo.tipo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {promo.porcentaje}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(promo.fecha_inicio)} - {formatDate(promo.fecha_fin)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatus(promo)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(promo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => onDelete(promo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionsTable;
