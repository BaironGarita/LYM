import { useEffect, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        setProducts(data);
      })
      .catch((err) => {
        console.error("❌ Error al obtener productos:", err);
        setProducts([]); // Limpiar productos en caso de error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCategory]);

  return (
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
  );
};

export default ProductList;
