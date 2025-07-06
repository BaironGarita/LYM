import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "./ImageCarousel"; // Asegúrate de que la ruta sea correcta

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`http://backend.local:81/productos?id=${id}`).then(res => res.json()),
      fetch(`http://backend.local:81/productos/imagenes?producto_id=${id}`).then(res => res.json())
    ]).then(([prod, imgs]) => {
      setProduct(prod);
      setImagenes(Array.isArray(imgs) ? imgs : []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          {/* Carrusel de imágenes */}
          {imagenes.length > 0 ? (
            <ImageCarousel imagenes={imagenes} nombre={product.nombre} size="large" />
          ) : (
            <img
              src="https://via.placeholder.com/384x384?text=Sin+Imagen"
              alt="Sin imagen"
              className="max-h-96 rounded shadow border bg-white mb-4"
              style={{objectFit:'contain', maxHeight:'384px'}}
            />
          )}
          <div className="flex gap-2 mt-2">
            {imagenes.map(img => (
              <img
                key={img.id}
                src={`http://backend.local:81/${img.ruta_archivo}`}
                alt={img.alt_text || product.nombre}
                className="w-14 h-14 object-contain rounded border cursor-pointer hover:shadow"
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2>
          <p className="text-gray-600 mb-2">{product.descripcion}</p>
          <p className="text-primary font-semibold text-xl mb-2">₡{Number(product.precio).toLocaleString('es-CR', {minimumFractionDigits:2})}</p>
          <div className="w-full mb-2">
            {/* Renderizado en dos columnas verticales, llenando de arriba a abajo */}
            {(() => {
              const fields = [
                { label: 'Existencias', value: product.stock },
                { label: 'Color', value: product.color_principal },
                { label: 'Género', value: product.genero },
                { label: 'Categoría', value: product.categoria_nombre },
                product.peso && product.peso !== 0 ? { label: 'Peso', value: product.peso + ' kg' } : null,
                product.dimensiones ? { label: 'Dimensiones', value: product.dimensiones } : null,
                product.material ? { label: 'Material', value: product.material } : null,
                product.temporada ? { label: 'Temporada', value: product.temporada } : null,
                { label: 'Valoración media', value: product.promedio_valoracion ? product.promedio_valoracion.toFixed(1) : 'N/A' },
              ].filter(Boolean);
              // Repartir los campos en dos columnas verticales
              const mid = Math.ceil(fields.length / 2);
              const col1 = fields.slice(0, mid);
              const col2 = fields.slice(mid);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-700 mb-2">
                  <div className="flex flex-col gap-y-1">
                    {col1.map((f, i) => (
                      <span key={i}><b>{f.label}:</b> {f.value}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-y-1">
                    {col2.map((f, i) => (
                      <span key={i}><b>{f.label}:</b> {f.value}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark" onClick={() => onAddToCart && onAddToCart(product)}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
