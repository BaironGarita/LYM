import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let url = 'http://backend.local:81/productos';
    if (selectedCategory) {
      url += `?categoria_id=${selectedCategory}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Respuesta no válida del backend');
        return res.json();
      })
      .then((data) => {
        console.log('🛍️ Productos recibidos:', data);
        setProducts(data);
      })
      .catch((err) => {
        console.error('❌ Error al obtener productos:', err);
      });
  }, [selectedCategory]);

  return (
    <div>
      <div className="mt-8">
        <CategoryFilter onChange={setSelectedCategory} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
