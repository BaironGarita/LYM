import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  Eye, 
  User, 
  Calendar, 
  Package,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Button } from "./UI/button";
import { Skeleton } from "./UI/skeleton";

const ResenasList = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResenas();
  }, []);

  const fetchResenas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:81/?url=resenas");
      
      if (!response.ok) {
        throw new Error("Error al cargar las reseñas");
      }

      const data = await response.json();
      setResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reseñas:", err);
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
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderStars = (valoracion) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < valoracion
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const ResenaCard = ({ resena }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {resena.nombre_usuario}
              </h3>
              <div className="flex items-center gap-1">
                {renderStars(resena.valoracion)}
                <span className="text-sm text-gray-600 ml-1">
                  ({resena.valoracion}/5)
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/resenas/${resena.id}`)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Ver detalle
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span className="font-medium">{resena.nombre_producto}</span>
            <Badge variant="secondary" className="text-xs">
              ₡{new Intl.NumberFormat("es-CR").format(resena.precio_producto)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(resena.created_at)}</span>
          </div>

          {resena.comentario && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {resena.comentario}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ResenaSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ResenaSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <MessageSquare className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar las reseñas
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchResenas}>Intentar de nuevo</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Todas las Reseñas
        </h1>
        <p className="text-gray-600">
          Explora las opiniones y experiencias de nuestros clientes
        </p>
      </div>

      {resenas.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Star className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No hay reseñas disponibles
          </h2>
          <p className="text-gray-600">
            Aún no se han registrado reseñas en el sistema
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {resenas.length} reseña{resenas.length !== 1 ? "s" : ""} encontrada{resenas.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Ordenado por fecha (más recientes primero)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resenas.map((resena) => (
              <ResenaCard key={resena.id} resena={resena} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResenasList;
