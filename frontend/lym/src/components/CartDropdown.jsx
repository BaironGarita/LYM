import { ShoppingCart, X } from "lucide-react";

export default function CartDropdown({ cart = [], removeFromCart, clearCart, onClose }) {
  const totalPrice = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-bold text-lg flex items-center"><ShoppingCart className="h-5 w-5 mr-2" /> Carrito</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X className="h-5 w-5" /></button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="p-4 text-center text-gray-500">El carrito está vacío</div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2 border-b last:border-b-0">
              <div>
                <div className="font-semibold">{item.nombre}</div>
                <div className="text-xs text-gray-500">Cantidad: {item.cantidad}</div>
                <div className="text-xs text-gray-500">Precio: ₡{item.precio.toLocaleString('es-CR', {minimumFractionDigits:2})}</div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline text-xs">Quitar</button>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t flex items-center justify-between">
        <span className="font-bold">Total:</span>
        <span className="font-bold">₡{totalPrice.toLocaleString('es-CR', {minimumFractionDigits:2})}</span>
      </div>
      <div className="p-4 pt-0 flex justify-between gap-2">
        <button onClick={clearCart} className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm">Vaciar carrito</button>
        <button className="bg-primary text-white rounded px-3 py-1 text-sm hover:bg-primary-dark">Comprar</button>
      </div>
    </div>
  );
}
