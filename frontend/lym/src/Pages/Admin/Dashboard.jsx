import React, { useMemo, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Package, Tag, Users } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useI18n } from "@/shared/hooks/useI18n";

// Small sparkline (svg) used inside cards — pure SVG so no extra deps
const Sparkline = ({
  data = [],
  color = "#10B981",
  strokeWidth = 2,
  width = 160,
  height = 36,
}) => {
  if (!data || data.length === 0) return null;
  const uid = useMemo(
    () => `spark-${Math.random().toString(36).slice(2, 9)}`,
    []
  );
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const len = data.length;

  // calculate points safely (handle len === 1)
  const stepX = len > 1 ? width / (len - 1) : width / 2;

  const coords = data.map((d, i) => {
    const x = len > 1 ? i * stepX : width / 2;
    const y = height - ((d - min) / range) * height;
    return { x, y };
  });

  // build smooth path using Catmull-Rom to Bezier conversion when possible
  const buildSmoothPath = (pts) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    if (pts.length === 2)
      return pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    // Catmull-Rom to Bezier
    const cr2bezier = (p0, p1, p2, p3) => {
      const bp1x = p1.x + (p2.x - p0.x) / 6;
      const bp1y = p1.y + (p2.y - p0.y) / 6;
      const bp2x = p2.x - (p3.x - p1.x) / 6;
      const bp2y = p2.y - (p3.y - p1.y) / 6;
      return `C ${bp1x} ${bp1y} ${bp2x} ${bp2y} ${p2.x} ${p2.y}`;
    };

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      d += cr2bezier(p0, p1, p2, p3);
    }
    return d;
  };

  const pathD = buildSmoothPath(coords);

  // closed path for fill (works even for single point)
  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const pathRef = useRef(null);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    try {
      const length = el.getTotalLength();
      el.style.strokeDasharray = length;
      el.style.strokeDashoffset = length;
      // trigger a frame then animate to 0
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 800ms ease";
        el.style.strokeDashoffset = 0;
      });
    } catch (e) {
      // ignore if path not available
    }
  }, [pathD]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mt-3"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={fillD} fill={`url(#${uid}-grad)`} opacity="0.9" />
      {/* draw small points with native tooltip (title) */}
      {coords.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill={color}
          stroke="#fff"
          strokeWidth={0.8}
        >
          <title>{String(data[i])}</title>
        </circle>
      ))}
    </svg>
  );
};

// Tiny bar chart for small summaries
const MiniBarChart = ({ data = [], color = "#3B82F6" }) => {
  if (!data || data.length === 0) return null;
  const maxRaw = Math.max(...data);
  const max = maxRaw > 0 ? maxRaw : 1; // avoid div by zero
  const total = data.reduce((s, v) => s + v, 0);
  // compute bar width (responsive to number of bars) — smaller base to fit inside cards
  const barWidth = Math.min(12, Math.max(4, Math.floor(100 / data.length)));
  return (
    <div
      className="mt-3 flex items-end gap-1 h-10"
      role="img"
      aria-label={`Mini bar chart: ${data.length} bars, max ${max}, total ${total}`}
    >
      {data.map((d, i) => {
        const ratio = d / max;
        const h = Math.max(2, Math.round(ratio * 40));
        return (
          <div
            key={`${i}-${d}`}
            style={{
              height: `${h}px`,
              backgroundColor: color,
              width: `${barWidth}px`,
            }}
            className="rounded-sm transition-transform duration-150 hover:scale-110"
            title={String(d)}
          />
        );
      })}
    </div>
  );
};

// Componente reutilizable para las tarjetas de estadísticas
const StatCard = ({ icon: Icon, title, value, description, color, chart }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-start">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
        {chart}
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useI18n();

  const [ventasStats, setVentasStats] = useState({
    loading: true,
    totalVentas: null,
    totalCostoEstimado: null,
    ganancia: null,
    porcentajeGanancia: null,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:81/api_lym/pedidos/estadisticas",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error fetching stats");
        const data = await res.json();
        if (!mounted) return;
        setVentasStats({
          loading: false,
          totalVentas: data.totalVentas ?? null,
          totalCostoEstimado: data.totalCostoEstimado ?? null,
          ganancia: data.ganancia ?? null,
          porcentajeGanancia: data.porcentajeGanancia ?? null,
          error: null,
        });
      } catch (err) {
        if (!mounted) return;
        setVentasStats((s) => ({ ...s, loading: false, error: err.message }));
      }
    };
    fetchStats();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.dashboard.title", "Panel de Administración")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard.welcome", "Bienvenido de nuevo")}, {user?.nombre}.{" "}
          {t(
            "admin.dashboard.summary",
            "Aquí tienes un resumen de la actividad de tu tienda."
          )}
        </p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title={t("admin.dashboard.stats.totalSales", "Ventas Totales")}
          value={
            ventasStats.loading
              ? "..."
              : ventasStats.totalVentas !== null
                ? `${t("common.currency", "₡")}${Number(ventasStats.totalVentas).toLocaleString(i18n?.language && i18n.language.startsWith("es") ? "es-CR" : "en-US")}`
                : "N/A"
          }
          description={
            ventasStats.loading
              ? t("admin.dashboard.stats.salesLoading", "Cargando...")
              : ventasStats.error
                ? t(
                    "admin.dashboard.stats.salesError",
                    "Error al cargar estadísticas"
                  )
                : ventasStats.porcentajeGanancia !== null
                  ? `${ventasStats.ganancia >= 0 ? "Ganancia" : "Pérdida"}: ${t("common.currency", "₡")}${Math.abs(ventasStats.ganancia).toLocaleString(i18n?.language && i18n.language.startsWith("es") ? "es-CR" : "en-US")} (${ventasStats.porcentajeGanancia}% )`
                  : t("admin.dashboard.stats.salesNoData", "Sin datos")
          }
          color="bg-green-500"
          chart={
            <div className="mt-3 w-32">
              <Sparkline
                data={[1200, 1500, 1400, 1600, 1800, 1700, 1900]}
                color="#10B981"
                width={120}
                height={28}
              />
            </div>
          }
        />
        <StatCard
          icon={Package}
          title={t("admin.dashboard.stats.totalProducts", "Total Productos")}
          value="235"
          description={t(
            "admin.dashboard.stats.inStock",
            "Actualmente en stock"
          )}
          color="bg-blue-500"
          chart={
            <div className="mt-3 w-32">
              <MiniBarChart
                data={[12, 18, 9, 20, 14, 22, 16]}
                color="#3B82F6"
              />
            </div>
          }
        />
        <StatCard
          icon={Tag}
          title={t(
            "admin.dashboard.stats.activePromotions",
            "Promociones Activas"
          )}
          value="5"
          description={t(
            "admin.dashboard.stats.currentOffers",
            "Ofertas vigentes"
          )}
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
        <h2 className="text-xl font-bold">
          {t("admin.dashboard.quickActions.title", "Acciones Rápidas")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/productos"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Package className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h3 className="text-lg font-medium">
              {t(
                "admin.dashboard.quickActions.manageProducts",
                "Gestionar Productos"
              )}
            </h3>
          </Link>
          <Link
            to="/admin/promotions"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Tag className="mx-auto h-8 w-8 text-orange-600 mb-2" />
            <h3 className="text-lg font-medium">
              {t(
                "admin.dashboard.quickActions.viewPromotions",
                "Ver Promociones"
              )}
            </h3>
          </Link>
          {/* acción de productos personalizados removida */}
        </div>
      </div>
    </div>
  );
};
