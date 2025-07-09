import { useState, useEffect } from "react";
import { Percent, Calendar, Tag, ShoppingCart } from "lucide-react";

const OffersPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:81/promociones");

      if (!response.ok) {
        throw new Error("Error al cargar las ofertas");
      }

      const data = await response.json();
      // Filtrar solo promociones activas y vigentes
      const ofertasActivas = data.filter((promo) => {
        const hoy = new Date();
        const fechaInicio = new Date(promo.fecha_inicio);
        const fechaFin = new Date(promo.fecha_fin);
        return promo.activo && hoy >= fechaInicio && hoy <= fechaFin;
      });

      setOfertas(ofertasActivas);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching ofertas:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchOfertas}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Percent className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Ofertas Especiales</h1>
            <p className="text-xl opacity-90">
              Descubre las mejores promociones en moda
            </p>
          </div>
        </div>
      </div>

      {/* Grid de ofertas */}
      <div className="container mx-auto px-6 py-12">
        {ofertas.length === 0 ? (
          <div className="text-center py-12">
            <Percent className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No hay ofertas disponibles
            </h2>
            <p className="text-gray-500">
              Vuelve pronto para descubrir nuevas promociones
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {ofertas.length} Ofertas Activas
              </h2>
              <p className="text-gray-600">
                ¡Aprovecha estos descuentos antes de que expiren!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ofertas.map((oferta) => (
                <OfertaCard key={oferta.id} oferta={oferta} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente para cada tarjeta de oferta
const OfertaCard = ({ oferta }) => {
  const diasRestantes = Math.ceil(
    (new Date(oferta.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const handleVerOferta = () => {
    // Redirigir según el tipo de promoción
    if (oferta.tipo === "categoria" && oferta.categoria_id) {
      window.location.href = `/products?categoria=${oferta.categoria_id}`;
    } else if (oferta.tipo === "producto" && oferta.producto_id) {
      window.location.href = `/product/${oferta.producto_id}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Badge de descuento */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold">
            -{oferta.porcentaje}%
          </div>
        </div>

        {/* Imagen placeholder o fondo degradado */}
        <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
          <Percent className="h-16 w-16 text-red-400" />
        </div>
      </div>

      <div className="p-6">
        {/* Título de la oferta */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {oferta.nombre}
        </h3>

        {/* Descripción */}
        {oferta.descripcion && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {oferta.descripcion}
          </p>
        )}

        {/* Tipo y categoría/producto */}
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 capitalize">
            {oferta.tipo === "categoria"
              ? `Categoría: ${oferta.categoria_nombre || "Todas"}`
              : `Producto: ${oferta.producto_nombre || "Específico"}`}
          </span>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Hasta el {new Date(oferta.fecha_fin).toLocaleDateString("es-ES")}
          </span>
        </div>

        {/* Días restantes */}
        <div className="mb-4">
          <span
            className={`text-sm font-medium ${
              diasRestantes <= 3
                ? "text-red-600"
                : diasRestantes <= 7
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {diasRestantes > 0
              ? `${diasRestantes} días restantes`
              : "Último día"}
          </span>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleVerOferta}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Ver Ofertas
        </button>
      </div>
    </div>
  );
};

export default OffersPage;