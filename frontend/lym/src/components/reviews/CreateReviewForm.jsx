import React, { useState } from 'react';
import { Star, User, Calendar, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (!readonly) {
      setHoveredRating(value);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            readonly ? 'cursor-default' : 'hover:scale-110'
          } ${
            star <= (hoveredRating || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
        />
      ))}
    </div>
  );
};

const CreateReviewForm = ({ productId, onReviewCreated }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = user;

  // Validar que el usuario tenga datos válidos
  if (!currentUser?.id || !currentUser?.nombre || currentUser.nombre.trim() === '') {
    return null;
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (rating === 0) {
      toast.error('Por favor selecciona una valoración');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    // Mostrar indicador de carga
    setIsSubmitting(true);

    try {
      // Validar datos antes de enviar
      if (!currentUser.id || !currentUser.nombre || currentUser.nombre.trim() === '') {
        toast.error('Error: Usuario no válido');
        return;
      }

      if (!productId || productId <= 0) {
        toast.error('Error: Producto no válido');
        return;
      }

      const reviewData = {
        usuario_id: parseInt(currentUser.id),
        producto_id: parseInt(productId),
        valoracion: parseInt(rating),
        comentario: comment.trim(),
        fecha_resena: new Date().toISOString().split('T')[0]
      };

      // Validar que todos los campos requeridos estén presentes
      if (!reviewData.usuario_id || !reviewData.producto_id || !reviewData.valoracion || !reviewData.comentario) {
        toast.error('Error: Datos incompletos');
        return;
      }

      const response = await fetch('http://localhost:8000/?url=resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la reseña');
      }

      const responseData = await response.json();
      
      // Validar que la respuesta tenga la estructura esperada
      if (!responseData.success || !responseData.resena) {
        throw new Error('Respuesta del servidor inválida');
      }

      const newReview = responseData.resena;
      
      // Validar los datos de la nueva reseña antes de procesarla
      // Verificar tanto usuario_nombre como nombre_usuario para compatibilidad
      const usuarioNombre = newReview.usuario_nombre || newReview.nombre_usuario;
      if (!newReview.id || 
          !usuarioNombre || 
          !newReview.comentario ||
          !newReview.valoracion ||
          usuarioNombre.trim() === '' ||
          newReview.comentario.trim() === '') {
        throw new Error('La reseña creada tiene datos inválidos');
      }

      // Limpiar formulario
      setRating(0);
      setComment('');
      setIsSubmitting(false);
      
      // Mostrar mensaje de éxito
      toast.success('¡Reseña creada con éxito!', {
        description: 'Tu reseña se ha publicado correctamente',
        duration: 3000,
      });
      
      // Ejecutar callback y disparar evento
      if (onReviewCreated && typeof onReviewCreated === 'function') {
        onReviewCreated(newReview);
      }
      
      // Disparar evento personalizado para refrescar reseñas
      const event = new CustomEvent('reviewCreated', { 
        detail: { 
          productId: parseInt(productId),
          newReview: {
            ...newReview,
            producto_id: parseInt(productId),
            usuario_id: parseInt(currentUser.id)
          }
        }
      });
      window.dispatchEvent(event);

    } catch (error) {
      toast.error('Error al guardar la reseña', {
        description: 'Por favor, inténtalo de nuevo',
        duration: 4000,
      });
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Inicia sesión para escribir una reseña
            </p>
            <Button variant="outline">
              Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Escribir una reseña
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Usuario (Solo lectura) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Usuario
            </label>
            <div className="px-3 py-2 bg-gray-50 border rounded-md text-gray-600">
              {currentUser.nombre || currentUser.email}
            </div>
          </div>

          {/* Fecha (Solo lectura) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </label>
            <div className="px-3 py-2 bg-gray-50 border rounded-md text-gray-600">
              {getCurrentDate()}
            </div>
          </div>

          {/* Valoración */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Valoración *
            </label>
            <div className="flex items-center gap-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
              />
              <span className="text-sm text-gray-600 ml-2">
                {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona una valoración'}
              </span>
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Comentario *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu reseña sobre este producto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500 caracteres
            </div>
          </div>

          {/* Botón de envío */}
          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="w-full"
            onClick={(e) => {
              // Prevenir cualquier comportamiento de desplazamiento
              e.stopPropagation();
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publicar Reseña
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { CreateReviewForm, StarRating };
export default CreateReviewForm;
