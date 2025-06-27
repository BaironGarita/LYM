import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost/LYM/api/productos"; // Ajusta esta URL si es necesario

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
    {/* Puedes agregar una imagen aquí si la API la proporciona */}
    {/* <img src={product.imagen_url} alt={product.nombre} className="w-full h-48 object-cover rounded-t-lg" /> */}
    <div className="p-2">
      <h3 className="text-xl font-bold text-primary">{product.nombre}</h3>
      <p className="text-muted-foreground mt-2">{product.descripcion}</p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-semibold">${Number(product.precio).toFixed(2)}</p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Ver Detalles
        </button>
      </div>
    </div>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        // La respuesta de la API parece estar anidada en una propiedad 'data'
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        } else {
          // Si la estructura es plana, usa response.data directamente
          setProducts(response.data);
        }
      } catch (err) {
        setError("No se pudieron cargar los productos. Asegúrate de que la API esté funcionando.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-destructive">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Nuestros Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;