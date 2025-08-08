import { useEffect, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard/ProductCard";
import CategoryFilter from "./CategoryFilter";
import { usePromociones } from "@/hooks/usePromociones";
import { TooltipProvider } from "@/components/UI/tooltip";

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { promociones, calcularPrecio } = usePromociones();

  useEffect(() => {
    setIsLoading(true);
    let url = "http://localhost:81/api_lym/productos";
    if (selectedCategory) {
      url += `?categoria_id=${selectedCategory}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Respuesta no válida del backend");
        return res.json();
      })
      .then((data) => {
        console.log("🛍️ Productos recibidos:", data);
        // Enriquecer productos con información de promociones
        const productosConPromociones = data.map((producto) => ({
          ...producto,
          promocionInfo: calcularPrecio(producto),
        }));
        setProducts(productosConPromociones);
      })
      .catch((err) => {
        console.error("❌ Error al obtener productos:", err);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCategory, promociones, calcularPrecio]);

  return (
    <TooltipProvider>
      <div>
        <div className="mt-8">
          <CategoryFilter onChange={setSelectedCategory} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProductList;
