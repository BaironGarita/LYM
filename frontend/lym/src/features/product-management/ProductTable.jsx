import { Package, Edit, Trash2, DollarSign, ShoppingBag } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

const ProductTable = ({ productos, onEdit, onDelete }) => {
  const { t } = useI18n();
  const getStatusColor = (stock) => {
    if (stock === 0) return "text-red-600 bg-red-100";
    if (stock < 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusText = (stock) => {
    if (stock === 0) return t("productTable.table.status.outOfStock");
    if (stock < 10) return t("productTable.table.status.lowStock");
    return t("productTable.table.status.inStock");
  };

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-12 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t("productTable.table.empty.title")}</p>
          <p className="text-gray-400">{t("productTable.table.empty.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.product")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.category")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.price")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.stock")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("productTable.table.headers.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {producto.imagen_url ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={producto.imagen_url}
                          alt={producto.nombre}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {producto.sku || t("productTable.table.noSku")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {producto.categoria_nombre || t("productTable.table.noCategory")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />$
                    {parseFloat(producto.precio).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {producto.stock} {t("productTable.table.units")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      producto.stock
                    )}`}
                  >
                    {getStatusText(producto.stock)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(producto)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title={t("common.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(producto.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title={t("common.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
