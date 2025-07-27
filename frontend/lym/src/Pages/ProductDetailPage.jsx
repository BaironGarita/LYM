import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import { Star, Truck, ShoppingCart, ChevronLeft } from "lucide-react";
import ProductoService from "@/services/productoService";

export const ProductDetail = ({ addToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Obtiene el ID del producto de la URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ProductoService.getProductoById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">Cargando detalles del producto...</div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Producto no encontrado.</div>;
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link to="/products">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a Productos
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de Imágenes */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {product.nombre}
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              {product.categoria_nombre}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-md text-gray-700 font-medium">
                4.5 (120 reseñas)
              </span>
            </div>
            <div className="h-6 border-l border-gray-300"></div>
            <span className="text-green-600 font-semibold">En Stock</span>
          </div>

          <p className="text-gray-700 text-base leading-relaxed">
            {product.descripcion}
          </p>

          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-primary">
              ₡{Number(product.precio).toLocaleString("es-CR")}
            </p>
            <div className="flex items-center gap-2 text-green-700">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">
                Envío gratis en órdenes superiores a ₡30,000
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="w-full py-6 text-lg"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Añadir al Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
