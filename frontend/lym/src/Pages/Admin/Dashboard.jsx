import { Link } from "react-router-dom";
import { DollarSign, Package, Tag, Users, Upload } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useI18n } from "@/shared/hooks/useI18n";

// Un componente reutilizable para las tarjetas de estadísticas
const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {t("admin.dashboard.welcomeBack", "Bienvenido de nuevo")}, {user?.nombre || "Admin"}!
        </h1>
        <p className="mt-2 text-gray-600">
          {t("admin.dashboard.summary", "Aquí tienes un resumen de la actividad de tu tienda.")}
        </p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title={t("admin.dashboard.stats.totalSales", "Ventas Totales")}
          value="S/15,231.89"
          description={t("admin.dashboard.stats.salesIncrease", "+20.1% desde el mes pasado")}
          color="bg-green-500"
        />
        <StatCard
          icon={Package}
          title={t("admin.dashboard.stats.totalProducts", "Total Productos")}
          value="235"
          description={t("admin.dashboard.stats.inStock", "Actualmente en stock")}
          color="bg-blue-500"
        />
        <StatCard
          icon={Tag}
          title={t("admin.dashboard.stats.activePromotions", "Promociones Activas")}
          value="5"
          description={t("admin.dashboard.stats.currentOffers", "Ofertas vigentes")}
          color="bg-orange-500"
        />
        <StatCard
          icon={Users}
          title={t("admin.dashboard.stats.newCustomers", "Nuevos Clientes")}
          value="12"
          description={t("admin.dashboard.stats.thisMonth", "Este mes")}
          color="bg-purple-500"
        />
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("admin.dashboard.quickActions", "Acciones Rápidas")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/productos"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Package className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-700">{t("navbar.admin.manageProducts", "Gestionar Productos")}</p>
          </Link>
          <Link
            to="/admin/promotions"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Tag className="mx-auto h-8 w-8 text-orange-600 mb-2" />
            <p className="font-semibold text-gray-700">{t("admin.dashboard.actions.viewPromotions", "Ver Promociones")}</p>
          </Link>
          <Link
            to="/admin/upload"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <p className="font-semibold text-gray-700">{t("admin.dashboard.actions.uploadNewProduct", "Subir Nuevo Producto")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
