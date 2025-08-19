import { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
} from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth.jsx";
import { useI18n } from "../../shared/hooks/useI18n.js";

const AdminOrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t, i18n } = useI18n();
  // keep existing calls that expect getCurrentLanguage() by providing a small helper
  const getCurrentLanguage = () => {
    try {
      return i18n && i18n.language ? i18n.language : "en";
    } catch (e) {
      return "en";
    }
  };

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchAllPedidos();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchAllPedidos = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:81/api_lym/admin/pedidos`;
      const token = localStorage.getItem("token");
      console.log("[AdminOrdersPage] fetching orders from:", url);
      console.log("[AdminOrdersPage] token present:", !!token);

      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Try to extract error message from body
        let bodyText = "";
        try {
          const ct = response.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const json = await response.json();
            bodyText = JSON.stringify(json);
          } else {
            bodyText = await response.text();
          }
        } catch (e) {
          bodyText = `<unable to read body: ${e.message}>`;
        }
        const errMsg = `HTTP ${response.status} ${response.statusText} - ${bodyText}`;
        console.error("[AdminOrdersPage] fetch error:", errMsg);
        throw new Error(errMsg);
      }

      const data = await response.json();
      // Defensive parsing: API may return either an array or an object wrapper
      let parsed = [];

      if (Array.isArray(data)) {
        parsed = data;
      } else if (data && typeof data === "object") {
        // common wrappers: { pedidos: [...] }, { data: [...] }, { orders: [...] }
        if (Array.isArray(data.pedidos)) parsed = data.pedidos;
        else if (Array.isArray(data.data)) parsed = data.data;
        else if (Array.isArray(data.orders)) parsed = data.orders;
        else if (Array.isArray(data.result)) parsed = data.result;
        else {
          // If object isn't an expected wrapper, attempt to find first array value
          const firstArray = Object.values(data).find((v) => Array.isArray(v));
          if (firstArray) parsed = firstArray;
        }
      }

      if (!Array.isArray(parsed)) {
        console.warn(
          "[AdminOrdersPage] Unexpected pedidos payload, setting empty array:",
          data
        );
        parsed = [];
      }

      setPedidos(parsed);
    } catch (err) {
      setError(err.message || t("orders.error"));
      console.error("Error fetching pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numero_pedido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || pedido.estado === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "todos") {
      const pedidoDate = new Date(pedido.fecha_pedido);
      const now = new Date();

      switch (dateFilter) {
        case "hoy":
          matchesDate = pedidoDate.toDateString() === now.toDateString();
          break;
        case "semana":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = pedidoDate >= weekAgo;
          break;
        case "mes":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = pedidoDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Estadísticas
  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter((p) => p.estado === "pendiente").length,
    procesando: pedidos.filter((p) => p.estado === "procesando").length,
    enviados: pedidos.filter((p) => p.estado === "enviado").length,
    entregados: pedidos.filter((p) => p.estado === "entregado").length,
    cancelados: pedidos.filter((p) => p.estado === "cancelado").length,
    totalVentas: pedidos.reduce((sum, p) => sum + (p.total || 0), 0),
  };

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            {t("orders.accessDenied")}
          </h2>
          <p className="text-gray-500">{t("orders.adminOnly")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("orders.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchAllPedidos}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {t("orders.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t("orders.title")}</h1>
              <p className="text-xl opacity-90">{t("orders.subtitle")}</p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t("orders.export")}
              </button>
              <button
                onClick={fetchAllPedidos}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t("orders.update")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatsCard
            title={t("orders.stats.total")}
            value={stats.total}
            color="blue"
          />
          <StatsCard
            title={t("orders.stats.pending")}
            value={stats.pendientes}
            color="yellow"
          />
          <StatsCard
            title={t("orders.stats.processing")}
            value={stats.procesando}
            color="blue"
          />
          <StatsCard
            title={t("orders.stats.shipped")}
            value={stats.enviados}
            color="purple"
          />
          <StatsCard
            title={t("orders.stats.delivered")}
            value={stats.entregados}
            color="green"
          />
          <StatsCard
            title={t("orders.stats.cancelled")}
            value={stats.cancelados}
            color="red"
          />
          <StatsCard
            title={t("orders.stats.totalSales")}
            value={`${t("common.currency")}${stats.totalVentas.toLocaleString(getCurrentLanguage() === "es" ? "es-CR" : "en-US")}`}
            color="green"
            isMonetary={true}
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("orders.filters.search")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("orders.filters.searchPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("orders.filters.status")}
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">{t("orders.filters.allStatuses")}</option>
                <option value="pendiente">{t("orders.status.pending")}</option>
                <option value="procesando">
                  {t("orders.status.processing")}
                </option>
                <option value="enviado">{t("orders.status.shipped")}</option>
                <option value="entregado">
                  {t("orders.status.delivered")}
                </option>
                <option value="cancelado">
                  {t("orders.status.cancelled")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("orders.filters.date")}
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="todos">{t("orders.filters.allDates")}</option>
                <option value="hoy">{t("orders.filters.today")}</option>
                <option value="semana">{t("orders.filters.lastWeek")}</option>
                <option value="mes">{t("orders.filters.lastMonth")}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setDateFilter("todos");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("orders.filters.clearFilters")}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              {t("orders.ordersCount")} ({filteredPedidos.length})
            </h2>
          </div>

          {filteredPedidos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("orders.noOrders")}
              </h3>
              <p className="text-gray-500">{t("orders.noOrdersMessage")}</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredPedidos.map((pedido) => (
                <AdminPedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para las estadísticas
const StatsCard = ({ title, value, color, isMonetary = false }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p
        className={`text-lg font-bold ${isMonetary ? "text-xs sm:text-sm lg:text-lg" : ""}`}
      >
        {value}
      </p>
    </div>
  );
};

// Componente para cada tarjeta de pedido en admin
const AdminPedidoCard = ({ pedido }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { t, i18n } = useI18n();
  const getCurrentLanguage = () => {
    try {
      return i18n && i18n.language ? i18n.language : "en";
    } catch (e) {
      return "en";
    }
  };

  const formatFecha = (fecha) => {
    const locale = getCurrentLanguage() === "es" ? "es-ES" : "en-US";
    return new Date(fecha).toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "text-yellow-600 bg-yellow-100";
      case "procesando":
        return "text-blue-600 bg-blue-100";
      case "enviado":
        return "text-purple-600 bg-purple-100";
      case "entregado":
        return "text-green-600 bg-green-100";
      case "cancelado":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="h-4 w-4" />;
      case "procesando":
        return <Package className="h-4 w-4" />;
      case "enviado":
        return <Truck className="h-4 w-4" />;
      case "entregado":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelado":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getEstadoTexto = (estado) => {
    return t(`orders.status.${estado}`);
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* Header del pedido */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex items-center gap-4 mb-3 lg:mb-0">
          <Package className="h-5 w-5 text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-800">
              {t("orders.orderNumber")}
              {pedido.numero_pedido}
            </h3>
            <p className="text-sm text-gray-500">
              {formatFecha(pedido.fecha_pedido)}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{pedido.usuario_nombre || "Usuario N/A"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}
          >
            {getEstadoIcon(pedido.estado)}
            {getEstadoTexto(pedido.estado)}
          </span>
          <span className="text-lg font-bold text-gray-800">
            {t("common.currency")}
            {pedido.total?.toLocaleString(
              getCurrentLanguage() === "es" ? "es-CR" : "en-US"
            ) || "0"}
          </span>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{pedido.usuario_email || "Email N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{pedido.direccion_envio || `${t("orders.address")} N/A`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {t("orders.updated")}: {formatFecha(pedido.fecha_actualizacion)}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          {showDetails ? t("orders.hideDetails") : t("orders.viewDetails")}
        </button>
        <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1">
          <Edit className="h-4 w-4" />
          {t("orders.editStatus")}
        </button>
      </div>

      {/* Detalles expandidos */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 px-6 py-4">
          <h4 className="font-medium text-gray-800 mb-3">
            {t("orders.orderDetails")}
          </h4>

          {/* Productos si están disponibles */}
          {pedido.items && pedido.items.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">
                {t("orders.products")}:
              </h5>
              {pedido.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.nombre_producto} x {item.cantidad}
                  </span>
                  <span>
                    {t("common.currency")}
                    {(item.precio_unitario * item.cantidad)?.toLocaleString(
                      getCurrentLanguage() === "es" ? "es-CR" : "en-US"
                    ) || "0"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
