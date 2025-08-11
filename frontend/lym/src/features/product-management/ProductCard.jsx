import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Heart, Star, Truck, Tag } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { Button } from "@/shared/components/UI/button";
import { Card, CardContent } from "@/shared/components/UI/card";
import { Badge } from "@/shared/components/UI/badge";
import { Skeleton } from "@/shared/components/UI/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/UI/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/App/store/fashionSlice";
import { cartActions } from "@/App/store/cartSlice"; // Importar cartActions completo
import { toast } from "sonner";
import { useI18n } from "@/shared/hooks/useI18n";

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

const ProductCard = ({ product }) => {
  const { t } = useI18n();
  const [imagenes, setImagenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const placeholder = "https://via.placeholder.com/200x200?text=Sin+Imagen";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtener el estado de la wishlist y cart desde Redux
  const wishlistItems = useSelector((state) => state.fashion.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  // Obtener información de promoción del producto
  const promocionInfo = product.promocionInfo || {
    precioOriginal: product.precio,
    precioFinal: product.precio,
    descuento: 0,
    promocionAplicada: null,
    ahorroMonetario: 0,
  };

  const isOnSale = promocionInfo.descuento > 0;
  const isInStock = product.stock > 0;

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

  const getRatingValue = (rating) => {
    if (rating === null || rating === undefined) return 0;
    const numRating = Number(rating);
    return isNaN(numRating) ? 0 : numRating;
  };

  // Usar Redux para agregar al carrito
  const handleAddToCart = async () => {
    if (!isInStock) {
      toast.error(t("productCard.product.outOfStock"));
      return;
    }

    setIsAddingToCart(true);
    try {
      const productToAdd = {
        ...product,
        quantity: quantity || 1, // Usar solo quantity
        precio: promocionInfo.precioFinal,
        promocionInfo,
        imagen:
          imagenes.length > 0
            ? `${API_BASE_URL}/${imagenes[0].ruta_archivo}`
            : null,
      };

      dispatch(cartActions.addToCart(productToAdd, quantity || 1));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("productCard.errors.addToCart"));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product));
  };

  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  return (
    <TooltipProvider>
      <Card className="group w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            {/* Badge de descuento mejorado */}
            {isOnSale && (
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1 text-xs shadow-lg">
                  <Tag className="h-3 w-3 mr-1" />-{promocionInfo.descuento}%{" "}
                  {t("productCard.badges.off")}
                </Badge>
              </div>
            )}

            {/* Badge de Sin Stock */}
            {!isInStock && (
              <div className="absolute top-3 right-3 z-20">
                <Badge
                  variant="destructive"
                  className="bg-red-600 text-white font-bold px-3 py-1 text-xs shadow-lg"
                >
                  {t("productCard.product.outOfStock")}
                </Badge>
              </div>
            )}

            {/* Badge de promoción específica */}
            {promocionInfo.promocionAplicada && (
              <div className="absolute bottom-3 left-3 z-20">
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-2 py-1 text-xs shadow-lg">
                  {promocionInfo.promocionAplicada.nombre}
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
                      handleWishlistToggle();
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isWishlisted
                      ? t("productCard.actions.removeFromWishlist")
                      : t("productCard.actions.addToWishlist")}
                  </p>
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
                  <p>{t("productCard.actions.viewDetails")}</p>
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
                  alt={t("productCard.product.unavailable")}
                  className="w-full h-full object-contain rounded-lg opacity-60 group-hover:opacity-80 transition-opacity"
                />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">
                  {getRatingValue(product.promedio_valoracion).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.total_resenas || 0})
                </span>
              </div>
              {product.precio > 50000 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {t("productCard.product.freeShipping")}
                  </span>
                </div>
              )}
            </div>

            <h3
              className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900 cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              {product.nombre}
            </h3>

            {/* Precio mejorado con promoción */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(promocionInfo.precioFinal)}
                </span>
                {isOnSale && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(promocionInfo.precioOriginal)}
                  </span>
                )}
              </div>
              {isOnSale && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-semibold px-2 py-1">
                    {t("productCard.product.save", {
                      amount: formatPrice(promocionInfo.ahorroMonetario),
                    })}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
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

            <Button
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !isInStock}
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("productCard.actions.adding")}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInStock
                    ? t("productCard.actions.addToCart")
                    : t("productCard.actions.outOfStock")}
                </>
              )}
            </Button>

            {isInStock && product.stock < 5 && (
              <p className="text-xs text-orange-600 font-medium text-center pt-1">
                {t("productCard.product.lowStock", { count: product.stock })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProductCard;
