import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  User, 
  Calendar, 
  Package,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Button } from "./UI/button";
import { Skeleton } from "./UI/skeleton";
import { Separator } from "./UI/separator";

const ResenaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resena, setResena] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResena();
  }, [id]);

  const fetchResena = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/?url=resenas/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Reseña no encontrada");
        }
        throw new Error("Error al cargar la reseña");
      }

      const data = await response.json();
      setResena(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reseña:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Fecha no válida";
    }
    
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (valoracion) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 ${
          index < valoracion
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getValorationText = (valoracion) => {
    const texts = {
      1: "Muy malo",
      2: "Malo", 
      3: "Regular",
      4: "Bueno",
      5: "Excelente"
    };
    return texts[valoracion] || "Sin calificación";
  };

  const getValorationColor = (valoracion) => {
    if (valoracion >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (valoracion >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <Card className="p-12 text-center">
          <div className="text-red-500 mb-4">
            <MessageSquare className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {error}
          </h2>
          <p className="text-gray-600 mb-6">
            No pudimos cargar los detalles de esta reseña
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchResena}>Intentar de nuevo</Button>
            <Button variant="outline" onClick={() => navigate("/resenas")}>
              Ver todas las reseñas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!resena) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Reseña de {resena.nombre_usuario}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ID: {resena.id}
                </Badge>
                <Badge 
                  className={`text-xs border ${getValorationColor(resena.valoracion)}`}
                >
                  {getValorationText(resena.valoracion)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                {renderStars(resena.valoracion)}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {resena.valoracion}/5
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Información del usuario */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Usuario
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {resena.nombre_usuario}
                  </h4>
                  <p className="text-gray-600">{resena.email_usuario}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Reseña publicada el {formatDate(resena.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Información del producto */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Producto Reseñado
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {resena.nombre_producto}
                  </h4>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {formatPrice(resena.precio_producto)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/producto/${resena.producto_id}`)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver producto
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comentario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentario de la Reseña
            </h3>
            {resena.comentario ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <blockquote className="text-gray-700 text-lg leading-relaxed italic">
                  "{resena.comentario}"
                </blockquote>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  El usuario no dejó comentarios adicionales
                </p>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Pedido</h4>
              <p className="text-blue-700 text-sm">
                ID del Pedido: #{resena.pedido_id}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Estado</h4>
              <p className="text-green-700 text-sm">
                Reseña verificada de compra
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResenaDetail;
