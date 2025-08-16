import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { cartActions, addItem } from "@/App/store/cartSlice";
import { Button } from "@/shared/components/UI/button";
import { ScrollArea } from "@/shared/components/UI/scroll-area";
import { Separator } from "@/shared/components/UI/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  Loader2,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils.js";
import { toast } from "sonner";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
  }).format(price);

const CartDropdown = ({ onClose }) => {
  const [isAnimating, setIsAnimating] = useState({});
  const [isRemoving, setIsRemoving] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity, status, error } = useSelector(
    (state) => state.cart
  );

  const isLoading = status === "loading";

  // Helper para determinar si un item está en oferta real
  const isItemOnOffer = (item) => {
    try {
      const promoPrice = item.promocionInfo?.precioFinal;
      const origPrice = item.precio;
      if (!promoPrice) return false;
      const p = parseFloat(promoPrice);
      const o = parseFloat(origPrice);
      if (Number.isNaN(p) || Number.isNaN(o)) return false;
      return p < o;
    } catch (e) {
      return false;
    }
  };

  const getDiscountPercent = (item) => {
    const promoPrice = parseFloat(item.promocionInfo?.precioFinal || 0);
    const origPrice = parseFloat(item.precio || 0);
    if (!promoPrice || !origPrice || promoPrice >= origPrice) return null;
    const pct = Math.round(((origPrice - promoPrice) / origPrice) * 100);
    return pct > 0 ? pct : null;
  };

  const handleGoToCheckout = () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    navigate("/checkout");
    if (onClose) onClose();
  };

  const handleIncrease = (item) => {
    if (item.quantity >= (item.stock || 99)) {
      toast.warning(`Solo hay ${item.stock} unidades disponibles`);
      return;
    }
    setIsAnimating((prev) => ({ ...prev, [item.id]: "increase" }));
    // Use the prepared action creator directly to ensure the payload
    // shape matches the reducer's expectations (item, quantity)
    dispatch(addItem(item, 1));
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      handleDelete(item);
      return;
    }
    setIsAnimating((prev) => ({ ...prev, [item.id]: "decrease" }));
    dispatch(cartActions.removeFromCart(item.id));
  };

  const handleDelete = (item) => {
    setIsRemoving(item.id);
    dispatch(cartActions.deleteFromCart(item.id));
  };

  useEffect(() => {
    // Reset animation state after it completes
    const timer = setTimeout(() => {
      setIsAnimating({});
      setIsRemoving(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <motion.div
      className="w-80 md:w-96 bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 flex justify-between items-center border-b bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Tu Carrito{" "}
            <span className="text-purple-600">({totalQuantity})</span>
          </h3>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-purple-50 text-gray-500 hover:text-purple-600"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-500">Actualizando carrito...</p>
        </div>
      ) : items.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-64 text-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative mb-6">
            <ShoppingBag className="h-20 w-20 text-gray-200" />
            <div className="absolute -inset-2 border-2 border-dashed border-gray-200 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg mb-2">
            Tu carrito está vacío
          </p>
          <p className="text-sm text-gray-400 max-w-xs mb-6">
            Explora nuestros productos y añade algo especial a tu carrito
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => {
              navigate("/products");
              if (onClose) onClose();
            }}
          >
            Ver Productos
          </Button>
        </motion.div>
      ) : (
        <>
          <ScrollArea className="flex-grow" style={{ height: "350px" }}>
            <div className="p-2">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={cn(
                      "flex items-start p-3 rounded-lg relative overflow-hidden",
                      isRemoving === item.id ? "opacity-50" : "",
                      "hover:bg-gray-50 transition-colors duration-200"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.2 },
                    }}
                    exit={{
                      opacity: 0,
                      x: -100,
                      transition: { duration: 0.2 },
                    }}
                    layout
                  >
                    {isRemoving === item.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                        <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                      </div>
                    )}

                    <div className="relative">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded-md mr-4 border border-gray-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                      {isItemOnOffer(item) && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {getDiscountPercent(item)
                            ? `${getDiscountPercent(item)}%`
                            : "Oferta"}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm text-gray-800 line-clamp-1 pr-2">
                          {item.nombre}
                        </p>
                        <div className="flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            {formatPrice(
                              item.promocionInfo?.precioFinal || item.precio
                            )}
                          </p>
                          {isItemOnOffer(item) &&
                            item.promocionInfo?.precioOriginal && (
                              <p className="text-xs text-gray-400 line-through text-right">
                                {formatPrice(item.promocionInfo.precioOriginal)}
                              </p>
                            )}
                        </div>
                      </div>

                      {item.stock !== undefined && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(100, (item.stock / 10) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.stock < 5
                              ? `¡Solo quedan ${item.stock}!`
                              : `${item.stock} disponibles`}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-md overflow-hidden bg-white shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7 transition-transform",
                              isAnimating[item.id] === "decrease"
                                ? "scale-90"
                                : ""
                            )}
                            onClick={() => handleDecrease(item)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm font-bold min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7 transition-transform",
                              isAnimating[item.id] === "increase"
                                ? "scale-90"
                                : ""
                            )}
                            onClick={() => handleIncrease(item)}
                            disabled={
                              isLoading ||
                              (item.stock !== undefined &&
                                item.quantity >= item.stock)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 text-gray-400 hover:text-red-500 transition-colors",
                            isRemoving === item.id ? "text-red-500" : ""
                          )}
                          onClick={() => handleDelete(item)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Subtotal ({totalQuantity}{" "}
                {totalQuantity === 1 ? "artículo" : "artículos"})
              </span>
              <span className="font-bold text-lg text-purple-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <Button
              className={cn(
                "w-full py-2 h-auto text-base font-semibold transition-all duration-200",
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              )}
              onClick={handleGoToCheckout}
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Proceder al pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {items.length > 0 && (
              <p className="mt-3 text-xs text-center text-gray-500">
                O{" "}
                <button
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => {
                    navigate("/cart");
                    if (onClose) onClose();
                  }}
                >
                  ver carrito detallado
                </button>
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CartDropdown;
