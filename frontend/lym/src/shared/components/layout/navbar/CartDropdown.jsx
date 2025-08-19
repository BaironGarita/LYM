import { X, Trash2, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { useI18n } from "@/shared/hooks/useI18n";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.jsx";

export function CartDropdown({ removeFromCart, clearCart, onClose }) {
  const { t } = useI18n();
  const { isAuthenticated, isAdmin } = useAuth();
  // Leer el carrito desde Redux
  const cart = useSelector((state) => state.cart.items);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * (item.quantity || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {t("navbar.cart.shoppingCart")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t("navbar.cart.empty")}</p>
            <p className="text-sm text-gray-400 mt-1">
              {t("navbar.cart.addProducts")}
            </p>
            {isAuthenticated() && (
              <div className="mt-4">
                <Link
                  to={isAdmin() ? "/admin/pedidos" : "/orders"}
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {isAdmin()
                    ? t("navbar.admin.orders", "Pedidos")
                    : t("navbar.menu.myOrders")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {t("navbar.cart.shoppingCart")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-2 border rounded-lg"
            >
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.nombre}</h4>
                <p className="text-sm text-gray-500">
                  {item.cantidad || 1} x ₡{item.precio?.toLocaleString("es-CR")}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">{t("navbar.cart.total")}</span>
            <span className="font-bold text-lg">
              ₡
              {totalPrice.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={clearCart}
              className="w-full py-2 px-4 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("navbar.cart.clearCart")}
            </button>

            <button
              onClick={() => {
                // Aquí iría la lógica para proceder al checkout
                onClose();
                window.location.href = "/checkout";
              }}
              className="w-full py-2 px-4 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {t("navbar.cart.checkout")}
            </button>
            {isAuthenticated() && (
              <Link
                to={isAdmin() ? "/admin/pedidos" : "/orders"}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center py-2 px-4 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
              >
                {isAdmin()
                  ? t("navbar.admin.orders", "Gestionar pedidos")
                  : t("navbar.menu.myOrders")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
