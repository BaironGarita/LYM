import { Badge } from "@/shared/components/UI/badge";
import { Button } from "@/shared/components/UI/button";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const PromotionsTable = ({ promotions, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CR");
  };

  const getStatus = (promo) => {
    const now = new Date();
    const startDate = new Date(promo.fecha_inicio);
    const endDate = new Date(promo.fecha_fin);

    if (now > endDate) {
      return (
        <Badge variant="destructive">{t("admin.promotions.finished")}</Badge>
      );
    }
    if (now >= startDate && now <= endDate) {
      return (
        <Badge className="bg-green-500">{t("admin.promotions.active")}</Badge>
      );
    }
    return <Badge variant="secondary">{t("admin.promotions.scheduled")}</Badge>;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.type")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.discount")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.validity")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.status")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin.promotions.actions")}
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
                  {t("admin.promotions.appliesTo")}:{" "}
                  {promo.producto_nombre || promo.categoria_nombre || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {t(`admin.promotions.${promo.tipo}`)}
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
                  title={t("common.edit")}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => onDelete(promo.id)}
                  title={t("common.delete")}
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
