import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Heart, Star, Truck } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { Button } from "./UI/button";
import { Card, CardContent } from "./UI/card";
import { Badge } from "./UI/badge";
import { Skeleton } from "./UI/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./UI/tooltip";

export function ProductCardSkeleton() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-0">
        <Skeleton className="h-64 w-full rounded-t-lg" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

const ProductCard = ({ product, onAddToCart }) => {
  const [imagenes, setImagenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const placeholder = "https://via.placeholder.com/200x200?text=Sin+Imagen";
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:81/api_lym/productos/imagenes?producto_id=${product.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImagenes(data);
        } else {
          setImagenes([]);
        }
      })
      .catch(() => setImagenes([]))
      .finally(() => setIsLoading(false));
  }, [product.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        await onAddToCart(product);
        // Opcional: mostrar feedback visual
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const getDiscountPercentage = () => {
    if (product.precio_original && product.precio_original > product.precio) {
      return Math.round(
        ((product.precio_original - product.precio) / product.precio_original) *
          100
      );
    }
    return 0;
  };

  const isOnSale = getDiscountPercentage() > 0;

  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  return (
    <TooltipProvider>
      <Card className="group w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md">
        <CardContent className="p-0">
          {/* Contenedor de imagen con overlay */}
          <div className="relative overflow-hidden">
            {/* Badge de descuento */}
            {isOnSale && (
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
                  -{getDiscountPercentage()}%
                </Badge>
              </div>
            )}

            {/* Botones de acción flotantes */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorite(!isFavorite);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/producto/${product.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalles</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Imagen del producto */}
            <div
              className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              {imagenes.length > 0 ? (
                <ImageCarousel
                  imagenes={imagenes}
                  nombre={product.nombre}
                  hoverOnly
                  hideDots
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <img
                  src={placeholder}
                  alt="Sin imagen"
                  className="w-full h-full object-contain rounded-lg opacity-60 group-hover:opacity-80 transition-opacity"
                />
              )}
            </div>

            {/* Overlay gradiente mejorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Información del producto */}
          <div className="p-5 space-y-3">
            {/* Rating y envío (opcional) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="h-4 w-4" />
                <span className="text-xs font-medium">Envío gratis</span>
              </div>
            </div>

            {/* Nombre del producto */}
            <h3
              className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900 cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              {product.nombre}
            </h3>

            {/* Precio mejorado */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.precio)}
              </span>
              {isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.precio_original)}
                </span>
              )}
            </div>

            {/* Características del producto mejoradas */}
            <div className="flex flex-wrap gap-1.5">
              {product.color_principal && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {product.color_principal}
                </Badge>
              )}
              {product.material && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-200 text-gray-600"
                >
                  {product.material}
                </Badge>
              )}
              {product.temporada && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-200 text-gray-600"
                >
                  {product.temporada}
                </Badge>
              )}
            </div>

            {/* Botón de añadir al carrito mejorado */}
            <Button
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir al carrito
                </>
              )}
            </Button>

            {/* Mensaje de stock (opcional) */}
            {product.stock && product.stock < 5 && (
              <p className="text-xs text-orange-600 font-medium text-center">
                ¡Solo quedan {product.stock} unidades!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProductCard;
