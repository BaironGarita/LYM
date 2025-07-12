import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  User,
  Calendar,
  MessageSquare,
  ExternalLink,
  Plus,
  Send,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Button } from "./UI/button";
import { Skeleton } from "./UI/skeleton";
import { Separator } from "./UI/separator";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const ProductReviews = ({ productId }) => {
  const [resenas, setResenas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    valoracion: 5,
    comentario: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (productId) {
      fetchResenas();
      fetchStats();
    }
  }, [productId]);

  // Cerrar el formulario si el usuario cierra sesión
  useEffect(() => {
    if (!isAuthenticated() && showForm) {
      setShowForm(false);
    }
  }, [isAuthenticated, showForm]);

  const fetchResenas = async () => {
    try {
      const response = await fetch(
        `http://localhost:81/api_lym/resenas&producto_id=${productId}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar las reseñas");
      }

      const data = await response.json();
      setResenas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching product reviews:", err);
      setError(err.message);
      setResenas([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:81/api_lym/resenas/stats&producto_id=${productId}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching review stats:", err);
      setStats(null);
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
      month: "short",
      day: "numeric",
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
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {resena.nombre_usuario}
              </h4>
              <div className="flex items-center gap-1">
                {renderStars(resena.valoracion)}
                <span className="text-sm text-gray-600 ml-1">
                  ({resena.valoracion}/5)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {formatDate(resena.created_at)}
            </span>
          </div>
        </div>

        {resena.comentario && (
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{resena.comentario}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            Compra verificada
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/resenas/${resena.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver detalle
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ReviewStats = ({ stats }) => {
    if (!stats || stats.total_resenas === 0) return null;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(stats.promedio_valoracion))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {parseFloat(stats.promedio_valoracion).toFixed(1)}
              </span>
              <span className="text-gray-600">de 5</span>
            </div>
            <p className="text-gray-600">
              Basado en {stats.total_resenas} reseña
              {stats.total_resenas !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/resenas")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Ver todas las reseñas
          </Button>
        </div>
      </div>
    );
  };

  const handleSubmitResena = async (e) => {
    e.preventDefault();

    // Verificar que el usuario esté autenticado
    if (!isAuthenticated() || !user?.id) {
      toast.error("Debes iniciar sesión para escribir una reseña");
      return;
    }

    if (!formData.comentario.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:81/api_lym/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productId,
          usuario_id: user.id,
          valoracion: formData.valoracion,
          comentario: formData.comentario.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("¡Reseña enviada exitosamente!");

        // Simplemente recargar la página completa para evitar errores de React
        window.location.reload();
      } else {
        throw new Error(result.error || "Error al enviar la reseña");
      }
    } catch (err) {
      toast.error("Error al enviar la reseña: " + err.message);
      console.error("Error submitting review:", err);
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, valoracion: rating }));
  };

  const handleComentarioChange = (e) => {
    setFormData((prev) => ({ ...prev, comentario: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      valoracion: 5,
      comentario: "",
    });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 mb-4">
          <MessageSquare className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar las reseñas
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={() => {
            fetchResenas();
            fetchStats();
          }}
        >
          Intentar de nuevo
        </Button>
      </Card>
    );
  }

  if (resenas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aún no hay reseñas
          </h3>
          <p className="text-gray-600 mb-6">
            Sé el primero en compartir tu experiencia con este producto
          </p>

          {isAuthenticated() ? (
            !showForm && (
              <Button
                className="flex items-center gap-2 mx-auto"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4" />
                Crear reseña
              </Button>
            )
          ) : (
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                ¿Tienes experiencia con este producto?
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Inicia sesión para escribir tu primera reseña
              </p>
            </div>
          )}
        </div>

        {/* Formulario de reseña */}
        {showForm && isAuthenticated() && (
          <ResenaForm
            key={`resena-form-empty-${productId}`}
            formData={formData}
            submitting={submitting}
            handleSubmitResena={handleSubmitResena}
            handleRatingClick={handleRatingClick}
            handleComentarioChange={handleComentarioChange}
            resetForm={resetForm}
          />
        )}

        {/* Mensaje de autenticación si el formulario se intenta mostrar sin login */}
        {showForm && !isAuthenticated() && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center">
              <span className="font-medium">¡Ups!</span> Necesitas iniciar
              sesión para escribir una reseña.
            </p>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="text-yellow-700 border-yellow-300"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewStats stats={stats} />

      {/* Botón para escribir reseña */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Reseñas de clientes
        </h3>

        {isAuthenticated() ? (
          !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear reseña
            </Button>
          )
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-md">
            <User className="h-4 w-4" />
            <span>
              <span className="text-blue-600 font-medium">Inicia sesión</span>{" "}
              para escribir una reseña
            </span>
          </div>
        )}
      </div>

      {/* Formulario de reseña */}
      {showForm && isAuthenticated() && (
        <ResenaForm
          key={`resena-form-${productId}`}
          formData={formData}
          submitting={submitting}
          handleSubmitResena={handleSubmitResena}
          handleRatingClick={handleRatingClick}
          handleComentarioChange={handleComentarioChange}
          resetForm={resetForm}
        />
      )}

      {/* Mensaje de autenticación si el formulario se intenta mostrar sin login */}
      {showForm && !isAuthenticated() && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-center">
            <span className="font-medium">¡Ups!</span> Necesitas iniciar sesión
            para escribir una reseña.
          </p>
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="text-yellow-700 border-yellow-300"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {resenas.slice(0, 3).map((resena) => (
          <ResenaCard key={resena.id} resena={resena} />
        ))}
      </div>

      {resenas.length > 3 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/resenas")}
            className="flex items-center gap-2 mx-auto"
          >
            <MessageSquare className="h-4 w-4" />
            Ver todas las {resenas.length} reseñas
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente separado para el formulario de reseñas
const ResenaForm = ({
  formData,
  submitting,
  handleSubmitResena,
  handleRatingClick,
  handleComentarioChange,
  resetForm,
}) => (
  <Card className="border-2 border-blue-200 bg-blue-50/50">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Escribir una reseña
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetForm}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmitResena} className="space-y-4">
        {/* Rating selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRatingClick(index + 1)}
                className="transition-colors hover:scale-110 transform"
              >
                <Star
                  className={`h-6 w-6 ${
                    index < formData.valoracion
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({formData.valoracion}/5)
            </span>
          </div>
        </div>

        {/* Comment field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario
          </label>
          <textarea
            value={formData.comentario}
            onChange={handleComentarioChange}
            placeholder="Comparte tu experiencia con este producto..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.comentario.length}/500 caracteres
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting || !formData.comentario.trim()}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar reseña
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={submitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default ProductReviews;
