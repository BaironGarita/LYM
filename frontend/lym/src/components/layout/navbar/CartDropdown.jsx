import { X, Trash2, ShoppingBag } from "lucide-react";

export function CartDropdown({ cart, removeFromCart, clearCart, onClose }) {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Carrito de Compras</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400 mt-1">
              Agrega algunos productos para empezar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Carrito de Compras</h3>
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
            <span className="font-semibold">Total:</span>
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
              Vaciar Carrito
            </button>

            <button
              onClick={() => {
                // Aquí iría la lógica para proceder al checkout
                onClose();
                window.location.href = "/checkout";
              }}
              className="w-full py-2 px-4 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
