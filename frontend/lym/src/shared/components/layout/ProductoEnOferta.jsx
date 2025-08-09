import { useState, useEffect } from "react";
import { Percent, ShoppingCart, Heart } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

const ProductoEnOferta = ({ producto, oferta }) => {
  const [enFavoritos, setEnFavoritos] = useState(false);
  const { t } = useI18n();

  const precioOriginal = producto.precio;
  const precioConDescuento = precioOriginal * (1 - oferta.porcentaje / 100);
  const ahorro = precioOriginal - precioConDescuento;

  const diasRestantes = Math.ceil(
    (new Date(oferta.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const handleAddToCart = () => {
    // Lógica para agregar al carrito
    console.log(t("productoEnOferta.addingToCart"), producto.id);
  };

  const toggleFavorito = () => {
    setEnFavoritos(!enFavoritos);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 group">
      {/* Badge de descuento y favorito */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {t("productoEnOferta.discount", { percentage: oferta.porcentaje })}
          </div>
        </div>

        <button
          onClick={toggleFavorito}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${enFavoritos ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Imagen del producto */}
        <div className="h-64 bg-gray-100 overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Percent className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.nombre}
        </h3>

        {/* Categoría */}
        <p className="text-sm text-gray-500 mb-3">{producto.categoria}</p>

        {/* Precios */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-600">
              ${precioConDescuento.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ${precioOriginal.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-green-600 font-medium">
            {t("productoEnOferta.youSave", { amount: ahorro.toFixed(2) })}
          </p>
        </div>

        {/* Tiempo restante */}
        <div className="mb-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              diasRestantes <= 3
                ? "bg-red-100 text-red-700"
                : diasRestantes <= 7
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {diasRestantes > 0
              ? t("productoEnOferta.daysLeft", { days: diasRestantes })
              : t("productoEnOferta.lastDay")}
          </span>
        </div>

        {/* Botón de compra */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("productoEnOferta.addToCart")}
        </button>
      </div>
    </div>
  );
};

export default ProductoEnOferta;
