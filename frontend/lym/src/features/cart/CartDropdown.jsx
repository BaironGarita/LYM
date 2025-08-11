import { useSelector, useDispatch } from "react-redux";
import {
  removeItemFromCart,
  addToCart,
  deleteItemFromCart,
} from "@/App/store/cartSlice";
import { Button } from "@/shared/components/UI/button";
import { ScrollArea } from "@/shared/components/UI/scroll-area";
import { Separator } from "@/shared/components/UI/separator";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity } = useSelector(
    (state) => state.cart
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);

  const handleGoToCheckout = () => {
    navigate("/checkout");
    if (onClose) onClose();
  };

  const handleIncrease = (item) => {
    // Para aumentar, añadimos una copia del producto con cantidad 1
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleDecrease = (item) => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleDelete = (item) => {
    dispatch(deleteItemFromCart(item.id));
  };

  return (
    <div className="w-80 md:w-96 bg-white rounded-lg shadow-2xl border flex flex-col">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Carrito de Compras ({totalQuantity})
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Tu carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-1">
            Añade productos para verlos aquí.
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-grow" style={{ height: "350px" }}>
            <div className="p-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start p-2 rounded-lg">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-sm text-gray-800 line-clamp-1">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(
                        item.promocionInfo?.precioFinal || item.precio
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDecrease(item)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleIncrease(item)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-4 space-y-4">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">{formatPrice(totalAmount)}</span>
            </div>
            <Button
              className="w-full h-11 text-base"
              onClick={handleGoToCheckout}
            >
              Ir a Pagar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
