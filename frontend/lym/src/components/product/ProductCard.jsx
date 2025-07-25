import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Heart, Star, Truck, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ImageCarousel from "./ImageCarousel";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { Skeleton } from "@/components/UI/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/UI/tooltip";

export function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
    </motion.div>
  );
}

const ProductCard = ({ product, onAddToCart }) => {
  const [imagenes, setImagenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const placeholder = "https://via.placeholder.com/200x200?text=Sin+Imagen";
  const navigate = useNavigate();

  // Obtener información de promoción del producto
  const promocionInfo = product.promocionInfo || {
    precioOriginal: product.precio,
    precioFinal: product.precio,
    descuento: 0,
    promocionAplicada: null,
  };

  const isOnSale = promocionInfo.descuento > 0;

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:81/api_lym/productos/imagenes&producto_id=${product.id}`
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

  const handleNavigateToDetail = async () => {
    setIsNavigating(true);
    // Pequeña pausa para mostrar la animación
    await new Promise((resolve) => setTimeout(resolve, 200));
    navigate(`/producto/${product.id}`);
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        // Enviar producto con precio promocional
        await onAddToCart({
          ...product,
          precio: promocionInfo.precioFinal,
          precioOriginal: promocionInfo.precioOriginal,
          promocionAplicada: promocionInfo.promocionAplicada,
        });

        // Mostrar toast de éxito
        toast.success(`${product.nombre} agregado al carrito`, {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#10B981",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Mostrar toast de error
        toast.error("Error al agregar al carrito", {
          duration: 3000,
          position: "bottom-right",
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  // Variantes de animación
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: isNavigating ? 0.7 : 1,
      y: 0,
      scale: isNavigating ? 0.95 : 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        exit="exit"
        layout
        className="group w-full max-w-sm mx-auto"
      >
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 shadow-md">
          <CardContent className="p-0">
            <div className="relative overflow-hidden">
              {/* Badge de descuento mejorado */}
              <AnimatePresence>
                {isOnSale && (
                  <motion.div
                    className="absolute top-3 left-3 z-20"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1 text-xs shadow-lg">
                      <Tag className="h-3 w-3 mr-1" />-{promocionInfo.descuento}
                      % OFF
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badge de promoción específica */}
              <AnimatePresence>
                {promocionInfo.promocionAplicada && (
                  <motion.div
                    className="absolute bottom-3 left-3 z-20"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-2 py-1 text-xs shadow-lg">
                      {promocionInfo.promocionAplicada.nombre}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botones de acción flotantes */}
              <motion.div
                className="absolute top-3 right-3 flex flex-col gap-2 z-10"
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
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
                      <p>
                        {isFavorite
                          ? "Quitar de favoritos"
                          : "Añadir a favoritos"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: 0.1 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToDetail();
                        }}
                      >
                        <Eye className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver detalles</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </motion.div>

              {/* Imagen del producto */}
              <motion.div
                className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 cursor-pointer"
                onClick={handleNavigateToDetail}
                variants={imageVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {imagenes.length > 0 ? (
                    <motion.div
                      key="with-images"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <ImageCarousel
                        imagenes={imagenes}
                        nombre={product.nombre}
                        hoverOnly
                        hideDots
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </motion.div>
                  ) : (
                    <motion.img
                      key="placeholder"
                      src={placeholder}
                      alt="Sin imagen"
                      className="w-full h-full object-contain rounded-lg opacity-60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.div
              className="p-5 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Rating y envío */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs font-medium">Envío gratis</span>
                </div>
              </motion.div>

              {/* Título del producto */}
              <motion.h3
                className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900 cursor-pointer hover:text-primary transition-colors"
                onClick={handleNavigateToDetail}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
              >
                {product.nombre}
              </motion.h3>

              {/* Precio mejorado con promoción */}
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-2xl font-bold text-primary"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    {formatPrice(promocionInfo.precioFinal)}
                  </motion.span>
                  <AnimatePresence>
                    {isOnSale && (
                      <motion.span
                        className="text-sm text-gray-500 line-through"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatPrice(promocionInfo.precioOriginal)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {isOnSale && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        Ahorras {formatPrice(promocionInfo.ahorroMonetario)}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Badges de propiedades */}
              <motion.div
                className="flex flex-wrap gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, staggerChildren: 0.1 }}
              >
                <AnimatePresence>
                  {product.color_principal && (
                    <motion.div
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {product.color_principal}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {product.material && (
                    <motion.div
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-200 text-gray-600"
                      >
                        {product.material}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {product.temporada && (
                    <motion.div
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-200 text-gray-600"
                      >
                        {product.temporada}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Botón de agregar al carrito */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <AnimatePresence mode="wait">
                    {isAddingToCart ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Agregando...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add-to-cart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isOnSale
                          ? `Añadir por ${formatPrice(
                              promocionInfo.precioFinal
                            )}`
                          : "Añadir al carrito"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Advertencia de stock */}
              <AnimatePresence>
                {product.stock && product.stock < 5 && (
                  <motion.p
                    className="text-xs text-orange-600 font-medium text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    ¡Solo quedan {product.stock} unidades!
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default ProductCard;
