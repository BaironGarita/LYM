import React, { useState, useEffect } from "react";
import { Star, User, Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/UI/card";
import { Badge } from "@/shared/components/UI/badge";
import { Separator } from "@/shared/components/UI/separator";
import { StarRating } from "./CreateReviewForm";

const ProductReviewsDisplay = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Escuchar eventos personalizados para agregar nuevas reseñas instantáneamente
  useEffect(() => {
    const handleReviewCreated = (event) => {
      if (event.detail?.productId === productId) {
        const newReview = event.detail?.newReview;

        if (newReview && newReview.id) {
          setReviews((prevReviews) => {
            // SOLO evitar duplicados por ID exacto, NO por usuario
            const existingReviewById = prevReviews.find(
              (review) =>
                review.id && newReview.id && review.id === newReview.id
            );

            if (existingReviewById) {
              return prevReviews;
            }

            // Filtrar cualquier reseña que pudiera tener datos incorrectos o vacíos
            // Verificar tanto usuario_nombre como nombre_usuario para compatibilidad
            const usuarioNombre =
              newReview.usuario_nombre || newReview.nombre_usuario;
            if (
              !usuarioNombre ||
              !newReview.comentario ||
              !newReview.valoracion ||
              usuarioNombre.trim() === "" ||
              newReview.comentario.trim() === ""
            ) {
              return prevReviews;
            }

            const updatedReviews = [newReview, ...prevReviews];

            // Recalcular totales y promedio
            setTotalReviews(updatedReviews.length);

            if (updatedReviews.length > 0) {
              const sum = updatedReviews.reduce((acc, review) => {
                const rating = Number(review.valoracion) || 0;
                return acc + rating;
              }, 0);
              const average = sum / updatedReviews.length;
              setAverageRating(Math.round(average * 10) / 10);
            }

            return updatedReviews;
          });
        } else {
          fetchReviews();
        }
      }
    };

    window.addEventListener("reviewCreated", handleReviewCreated);

    return () => {
      window.removeEventListener("reviewCreated", handleReviewCreated);
    };
  }, [productId]);

  const fetchReviews = async () => {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);

      const url = `http://localhost:81/api_lym/resenas&producto_id=${productId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reviewsArray = Array.isArray(data) ? data : [];

      setReviews(reviewsArray);
      setTotalReviews(reviewsArray.length);

      // Calcular promedio de valoraciones
      if (reviewsArray.length > 0) {
        const sum = reviewsArray.reduce((acc, review) => {
          const rating = Number(review.valoracion) || 0;
          return acc + rating;
        }, 0);
        const average = sum / reviewsArray.length;
        setAverageRating(Math.round(average * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Fecha no disponible";
    }

    try {
      // Intentar diferentes formatos de fecha
      let date;

      // Si ya es un objeto Date
      if (dateString instanceof Date) {
        date = dateString;
      }
      // Si es un timestamp de Unix (número)
      else if (!isNaN(dateString) && dateString.toString().length === 10) {
        date = new Date(dateString * 1000);
      }
      // Si es un timestamp de milisegundos
      else if (!isNaN(dateString) && dateString.toString().length === 13) {
        date = new Date(parseInt(dateString));
      }
      // Formato ISO o string de fecha
      else {
        date = new Date(dateString);
      }

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return "Fecha no válida";
      }

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      const rating = Number(review.valoracion);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    return distribution;
  };

  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de valoraciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Valoraciones de clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promedio general */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} readonly />
              <p className="text-sm text-gray-600 mt-2">
                Basado en {totalReviews}{" "}
                {totalReviews === 1 ? "reseña" : "reseñas"}
              </p>
            </div>

            {/* Distribución de estrellas */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width:
                          totalReviews > 0
                            ? `${(distribution[stars] / totalReviews) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{distribution[stars]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de reseñas */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reseñas ({totalReviews})</h3>

          {reviews.map((review, index) => (
            <Card key={review.id || index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header con usuario y fecha */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.usuario_nombre ||
                            review.nombre_usuario ||
                            "Usuario"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.fecha_resena)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <StarRating rating={Number(review.valoracion)} readonly />
                    </Badge>
                  </div>

                  <Separator />

                  {/* Comentario */}
                  <div className="space-y-2">
                    <p className="text-gray-700 leading-relaxed">
                      {review.comentario}
                    </p>
                  </div>

                  {/* Información adicional */}
                  {review.producto_nombre && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Producto: {review.producto_nombre}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Aún no hay reseñas para este producto
              </p>
              <p className="text-sm text-gray-500">
                ¡Sé el primero en escribir una reseña!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductReviewsDisplay;
