import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  Clock,
  Eye,
  ChevronRight,
  Copy,
  Facebook,
  Twitter,
  Link2,
  Tag,
  Percent
} from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { Button } from "./UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Separator } from "./UI/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./UI/tabs";
import { Alert, AlertDescription } from "./UI/alert";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./UI/tooltip";
import { toast } from "sonner";
import { usePromociones } from "../hooks/usePromociones";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const shareMenuRef = useRef(null);
  const { calcularPrecio } = usePromociones();

  useClickOutside(shareMenuRef, () => setShareMenuOpen(false));

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [productResponse, imagesResponse] = await Promise.all([
          fetch(`http://localhost:81/api_lym/productos?id=${id}`),
          fetch(
            `http://localhost:81/api_lym/productos/imagenes?producto_id=${id}`
          ),
        ]);

        if (!productResponse.ok) {
          throw new Error(
            `Error al obtener el producto: ${productResponse.statusText}`
          );
        }

        const productData = await productResponse.json();
        const imagesData = await imagesResponse.json();

        const productObject = Array.isArray(productData)
          ? productData[0]
          : productData;

        // Enriquecer con información de promoción
        if (productObject) {
          productObject.promocionInfo = calcularPrecio(productObject);
        }

        setProduct(productObject);
        setImagenes(Array.isArray(imagesData) ? imagesData : []);

        if (productObject) {
          setViewCount(Math.floor(Math.random() * 1000) + 100);
        }
      } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, calcularPrecio]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    return product?.promocionInfo?.descuento || 0;
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        await onAddToCart({ 
          ...product, 
          quantity,
          precio: product.promocionInfo.precioFinal,
          precioOriginal: product.promocionInfo.precioOriginal,
          promocionAplicada: product.promocionInfo.promocionAplicada
        });
        toast.success("¡Agregado al carrito!", {
          description: `${product.nombre} (${quantity}) se agregó a tu carrito`,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Error", {
          description: "No se pudo agregar el producto al carrito",
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `¡Mira este producto: ${product.nombre}!`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.info("Enlace copiado", {
          description: "El enlace del producto se copió al portapapeles",
        });
        break;
      default:
        break;
    }
    setShareMenuOpen(false);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Agregado a favoritos", {
        description: "El producto se agregó a tus favoritos",
      });
    } else {
      toast.info("Eliminado de favoritos", {
        description: "El producto se eliminó de tus favoritos",
      });
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        status: "out",
        text: "Sin stock",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    } else if (product.stock <= 5) {
      return {
        status: "low",
        text: `Solo quedan ${product.stock}`,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      };
    } else {
      return {
        status: "in",
        text: "En stock",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    }
  };

  const isOnSale = getDiscountPercentage() > 0;
  const isInStock = product?.stock > 0;
  const stockStatus = product ? getStockStatus() : null;
  const promocionInfo = product?.promocionInfo || {
    precioOriginal: product?.precio || 0,
    precioFinal: product?.precio || 0,
    descuento: 0,
    promocionAplicada: null
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-10 bg-gray-200 rounded w-32 mb-8"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Producto no encontrado
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lo sentimos, el producto que buscas no existe o ha sido eliminado
              de nuestro catálogo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/")}
                className="flex-1 h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Explorar productos
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 h-12 text-lg font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver atrás
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div 
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
        style={{ 
          background: 'linear-gradient(135deg, rgb(249 250 251) 0%, rgb(255 255 255) 100%)',
          position: 'relative',
          zIndex: 0
        }}
      >
        {/* Enhanced Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {product.nombre}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                <span>{viewCount} vistas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Image Gallery */}
            <div className="space-y-4">
              <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                    {isOnSale && (
                      <div className="absolute top-6 left-6 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                          <Tag className="h-4 w-4 mr-2" />
                          -{getDiscountPercentage()}% OFF
                        </Badge>
                      </div>
                    )}

                    {/* Badge de promoción específica */}
                    {promocionInfo.promocionAplicada && (
                      <div className="absolute bottom-6 left-6 z-10">
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                          <Percent className="h-4 w-4 mr-2" />
                          {promocionInfo.promocionAplicada.nombre}
                        </Badge>
                      </div>
                    )}

                    {stockStatus && (
                      <div className="absolute top-6 right-6 z-10">
                        <Badge
                          className={`${stockStatus.color} ${stockStatus.bgColor} border-0 shadow-lg`}
                        >
                          {stockStatus.text}
                        </Badge>
                      </div>
                    )}

                    {imagenes.length > 0 ? (
                      <ImageCarousel
                        key={selectedImage}
                        imagenes={imagenes}
                        nombre={product.nombre}
                        size="large"
                        className="w-full h-full object-cover animate-fade-in"
                        selectedIndex={selectedImage}
                        onSelectImage={setSelectedImage}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Sin imagen disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Thumbnails */}
              {imagenes.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imagenes.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImage === index
                          ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                          : "hover:shadow-md hover:scale-102"
                      }`}
                    >
                      <img
                        src={`http://localhost:81/api_lym/${img.ruta_archivo}`}
                        alt={img.alt_text || product.nombre}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Product Information */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.nombre}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleFavorite}
                          className="h-10 w-10 rounded-full hover:bg-red-50"
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              isFavorite
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isFavorite
                          ? "Quitar de favoritos"
                          : "Agregar a favoritos"}
                      </TooltipContent>
                    </Tooltip>

                    <div className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShareMenuOpen(!shareMenuOpen)}
                            className="h-10 w-10 rounded-full hover:bg-blue-50"
                          >
                            <Share2 className="h-5 w-5 text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Compartir producto</TooltipContent>
                      </Tooltip>

                      {shareMenuOpen && (
                        <Card
                          ref={shareMenuRef}
                          className="absolute right-0 top-12 w-48 shadow-xl border-0 bg-white/95 backdrop-blur-sm z-20"
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare("facebook")}
                                className="w-full justify-start"
                              >
                                <Facebook className="h-4 w-4 mr-2" />
                                Facebook
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare("twitter")}
                                className="w-full justify-start"
                              >
                                <Twitter className="h-4 w-4 mr-2" />
                                Twitter
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare("copy")}
                                className="w-full justify-start"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar enlace
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.promedio_valoracion || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.promedio_valoracion
                      ? `${product.promedio_valoracion.toFixed(1)} (${Math.floor(Math.random() * 100) + 10} reseñas)`
                      : "Sin valoraciones"}
                  </span>
                </div>

                {/* Enhanced Price with Promotion */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      {formatPrice(promocionInfo.precioFinal)}
                    </span>
                    {isOnSale && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-gray-500 line-through">
                          {formatPrice(promocionInfo.precioOriginal)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {isOnSale && (
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                        Ahorras {formatPrice(promocionInfo.ahorroMonetario)}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                        {promocionInfo.descuento}% de descuento
                      </Badge>
                    </div>
                  )}

                  {/* Información de la promoción */}
                  {promocionInfo.promocionAplicada && (
                    <Alert className="border-green-200 bg-green-50">
                      <Tag className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Promoción activa:</strong> {promocionInfo.promocionAplicada.nombre}
                        {promocionInfo.promocionAplicada.fecha_fin && (
                          <span className="block text-sm mt-1">
                            Válida hasta: {new Date(promocionInfo.promocionAplicada.fecha_fin).toLocaleDateString()}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <Separator />

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-0 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Stock</p>
                        <p className={`text-sm ${stockStatus.color}`}>
                          {stockStatus.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Envío</p>
                        <p className="text-sm text-green-600">
                          {product.precio > 50000 ? "Gratis" : "₡2,500"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Add to Cart Button */}
              <Card className="border-0 bg-gray-50">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Cantidad:</span>
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange("decrease")}
                          disabled={quantity <= 1}
                          className="h-10 w-10 rounded-l-xl hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-6 py-2 font-bold text-lg min-w-[4rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange("increase")}
                          disabled={quantity >= product.stock}
                          className="h-10 w-10 rounded-r-xl hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={!isInStock || isAddingToCart}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Agregando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-6 w-6 mr-3" />
                          {isInStock ? 
                            (isOnSale ? 
                              `Añadir por ${formatPrice(promocionInfo.precioFinal * quantity)}` : 
                              "Añadir al carrito"
                            ) : 
                            "Sin stock"
                          }
                        </>
                      )}
                    </Button>

                    {/* Mostrar ahorro total por cantidad */}
                    {isOnSale && quantity > 1 && (
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Ahorro total: {formatPrice(promocionInfo.ahorroMonetario * quantity)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-4">
                <Alert className="border-green-200 bg-green-50">
                  <Truck className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Envío gratis</strong> en pedidos superiores a
                    ₡50,000
                  </AlertDescription>
                </Alert>
                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Garantía de satisfacción</strong> - 30 días para
                    devoluciones
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>

          {/* Enhanced Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="description"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Descripción
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Especificaciones
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Reseñas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {product.descripcion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-8">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Color principal",
                          value: product.color_principal,
                          icon: "🎨",
                        },
                        { label: "Género", value: product.genero, icon: "👤" },
                        {
                          label: "Categoría",
                          value: product.categoria_nombre,
                          icon: "📂",
                        },
                        {
                          label: "Material",
                          value: product.material,
                          icon: "🧵",
                        },
                        {
                          label: "Temporada",
                          value: product.temporada,
                          icon: "🌤️",
                        },
                        {
                          label: "Peso",
                          value: product.peso ? `${product.peso} kg` : null,
                          icon: "⚖️",
                        },
                        {
                          label: "Dimensiones",
                          value: product.dimensiones,
                          icon: "📏",
                        },
                        { label: "SKU", value: product.id, icon: "🔢" },
                      ]
                        .filter((item) => item.value)
                        .map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{spec.icon}</span>
                              <span className="font-medium text-gray-900">
                                {spec.label}
                              </span>
                            </div>
                            <span className="text-gray-700 font-medium">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aún no hay reseñas
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Sé el primero en compartir tu experiencia con este
                        producto
                      </p>
                      <Button variant="outline" className="rounded-full">
                        Escribir reseña
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProductDetail;
