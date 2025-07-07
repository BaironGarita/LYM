import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";

const ProductCard = ({ product, onAddToCart }) => {
  const [imagenes, setImagenes] = useState([]);
  const placeholder = "https://via.placeholder.com/200x200?text=Sin+Imagen";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://backend.local:81/productos/imagenes?producto_id=${product.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImagenes(data);
        } else {
          setImagenes([]);
        }
      })
      .catch(() => setImagenes([]));
  }, [product.id]);

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center relative">
      {/* Iconos en la esquina superior derecha */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {/* Ver detalles */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200"
          title="Ver detalles"
          onClick={() => navigate(`/producto/${product.id}`)}
        >
          {/* Icono ojo */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        {/* Añadir al carrito */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200"
          title="Añadir al carrito"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          {/* Icono carrito */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386a2.25 2.25 0 0 1 2.17 1.684l.298 1.192M6.104 5.876l1.347 5.39m0 0l.298 1.192A2.25 2.25 0 0 0 9.919 15h7.331a2.25 2.25 0 0 0 2.22-1.876l1.125-9A2.25 2.25 0 0 0 18.375 2.25H5.25a2.25 2.25 0 0 0-2.22 1.876l-.298 1.192M7.451 11.266h9.098" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="17" cy="20" r="1" />
          </svg>
        </button>
      </div>
      {/* Carrusel de imágenes o imagen principal */}
      <div className="w-full flex justify-center items-center" style={{maxWidth: '220px', minHeight: '180px'}}>
        {imagenes.length > 0 ? (
          <ImageCarousel imagenes={imagenes} nombre={product.nombre} hoverOnly hideDots />
        ) : (
          <img
            src={placeholder}
            alt="Sin imagen"
            className="w-32 h-32 object-contain rounded border"
          />
        )}
      </div>
      <div className="mt-2 w-full flex flex-col items-center">
        <div className="font-bold text-lg mb-1 text-center">{product.nombre}</div>
        <div className="text-primary font-semibold text-md mb-1">₡{Number(product.precio).toLocaleString('es-CR', {minimumFractionDigits:2})}</div>
        {product.color_principal && (
          <div className="text-xs text-gray-600 mb-1">Color: {product.color_principal}</div>
        )}
        {product.material && (
          <div className="text-xs text-gray-600 mb-1">Material: {product.material}</div>
        )}
        {product.temporada && (
          <div className="text-xs text-gray-600 mb-1">Temporada: {product.temporada}</div>
        )}
        {/* Botón de añadir al carrito eliminado */}
      </div>
    </div>
  );
};

export default ProductCard;
