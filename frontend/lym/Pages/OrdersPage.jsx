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
} from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth.jsx";

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchPedidos();
    }
  }, [isAuthenticated]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:81/api_lym/pedidos?usuario_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar los pedidos");
      }

      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pedidos:", err);
    } finally {
      setLoading(false);
    }
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

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Acceso requerido
          </h2>
          <p className="text-gray-500">
            Debes iniciar sesión para ver tus pedidos
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
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
            onClick={fetchPedidos}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Mis Pedidos</h1>
            <p className="text-xl opacity-90">Seguimiento de tus compras</p>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="container mx-auto px-6 py-12">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No tienes pedidos aún
            </h2>
            <p className="text-gray-500 mb-6">
              ¡Explora nuestros productos y realiza tu primera compra!
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ver Productos
            </a>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {pedidos.length} Pedidos
              </h2>
              <p className="text-gray-600">Historial completo de tus compras</p>
            </div>

            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente para cada tarjeta de pedido
const PedidoCard = ({ pedido }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header del pedido */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <Package className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Pedido #{pedido.numero_pedido}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFecha(pedido.fecha_pedido)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}
            >
              {getEstadoIcon(pedido.estado)}
              {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
            </span>
          </div>
        </div>

        {/* Información del pedido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold">
                ₡{pedido.total?.toLocaleString("es-CR") || "0"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {pedido.direccion_envio || "Dirección no disponible"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Actualizado: {formatFecha(pedido.fecha_actualizacion)}
            </span>
          </div>
        </div>

        {/* Resumen de productos */}
        {pedido.items && pedido.items.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              {pedido.items.length} producto{pedido.items.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {pedido.items.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {item.nombre_producto} (x{item.cantidad})
                </span>
              ))}
              {pedido.items.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{pedido.items.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showDetails ? "Ocultar detalles" : "Ver detalles"}
          </button>

          {pedido.estado === "entregado" && (
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Recomprar
            </button>
          )}
        </div>

        {/* Detalles expandidos */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 px-6 py-4">
            <h4 className="font-medium text-gray-800 mb-3">
              Detalles del pedido
            </h4>

            {/* Desglose de precios */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₡{pedido.subtotal?.toLocaleString("es-CR") || "0"}</span>
              </div>
              {pedido.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>
                    -₡{pedido.descuento?.toLocaleString("es-CR") || "0"}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span>₡{pedido.impuestos?.toLocaleString("es-CR") || "0"}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>₡{pedido.total?.toLocaleString("es-CR") || "0"}</span>
              </div>
            </div>

            {/* Lista de productos */}
            {pedido.items && pedido.items.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-800 mb-2">Productos:</h5>
                <div className="space-y-2">
                  {pedido.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">
                        {item.nombre_producto} x {item.cantidad}
                      </span>
                      <span className="font-medium">
                        ₡
                        {(item.precio_unitario * item.cantidad)?.toLocaleString(
                          "es-CR"
                        ) || "0"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
