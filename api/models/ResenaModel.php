<?php

require_once "controllers/core/MySqlConnect.php";

class ResenaModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las reseñas con información del usuario y producto
     */
    public function getAllResenas($limit = null, $offset = null)
    {
        try {
            $sql = "SELECT r.*, 
                           u.nombre as nombre_usuario, 
                           u.correo as email_usuario,
                           p.nombre as nombre_producto,
                           p.precio as precio_producto
                    FROM resenas r
                    INNER JOIN usuarios u ON r.usuario_id = u.id
                    INNER JOIN productos p ON r.producto_id = p.id
                    ORDER BY r.created_at DESC";
            
            if ($limit !== null) {
                $sql .= " LIMIT " . intval($limit);
                if ($offset !== null) {
                    $sql .= " OFFSET " . intval($offset);
                }
            }

            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            error_log("Error en getAllResenas: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener reseñas por producto ID
     */
    public function getResenasByProducto($productoId)
    {
        try {
            $sql = "SELECT r.*, 
                           u.nombre as nombre_usuario, 
                           u.correo as email_usuario
                    FROM resenas r
                    INNER JOIN usuarios u ON r.usuario_id = u.id
                    WHERE r.producto_id = $productoId AND r.aprobado = 1
                    ORDER BY r.created_at DESC";

            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            error_log("Error en getResenasByProducto: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener una reseña por ID
     */
    public function getResenaById($id)
    {
        try {
            $sql = "SELECT r.*, 
                           u.nombre as nombre_usuario, 
                           u.correo as email_usuario,
                           p.nombre as nombre_producto,
                           p.precio as precio_producto,
                           p.categoria_id
                    FROM resenas r
                    INNER JOIN usuarios u ON r.usuario_id = u.id
                    INNER JOIN productos p ON r.producto_id = p.id
                    WHERE r.id = $id";

            $result = $this->enlace->executeSQL($sql);
            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            error_log("Error en getResenaById: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Crear una nueva reseña
     */
    public function createResena($usuarioId, $productoId, $pedidoId, $valoracion, $comentario)
    {
        try {
            $comentario = $this->enlace->escapeString($comentario);
            $sql = "INSERT INTO resenas (usuario_id, producto_id, pedido_id, valoracion, comentario) 
                    VALUES ($usuarioId, $productoId, $pedidoId, $valoracion, '$comentario')";

            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            error_log("Error en createResena: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Actualizar una reseña
     */
    public function updateResena($id, $valoracion, $comentario)
    {
        try {
            $comentario = $this->enlace->escapeString($comentario);
            $sql = "UPDATE resenas SET valoracion = $valoracion, comentario = '$comentario', fecha_actualizacion = NOW() 
                    WHERE id = $id";

            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            error_log("Error en updateResena: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Eliminar una reseña
     */
    public function deleteResena($id)
    {
        try {
            $sql = "DELETE FROM resenas WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            error_log("Error en deleteResena: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener estadísticas de reseñas de un producto
     */
    public function getResenaStats($productoId)
    {
        try {
            $sql = "SELECT 
                        COUNT(*) as total_resenas,
                        AVG(valoracion) as promedio_valoracion,
                        MIN(valoracion) as valoracion_minima,
                        MAX(valoracion) as valoracion_maxima
                    FROM resenas 
                    WHERE producto_id = $productoId AND aprobado = 1";

            $result = $this->enlace->executeSQL($sql);
            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            error_log("Error en getResenaStats: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Verificar si un usuario puede dejar reseña (ha comprado el producto)
     */
    public function canUserReview($usuarioId, $productoId)
    {
        try {
            $sql = "SELECT COUNT(*) as count
                    FROM pedidos p
                    INNER JOIN detalle_pedidos dp ON p.id = dp.pedido_id
                    WHERE p.usuario_id = $usuarioId 
                    AND dp.producto_id = $productoId 
                    AND p.estado IN ('entregado', 'completado')";

            $result = $this->enlace->executeSQL($sql);
            return !empty($result) && $result[0]['count'] > 0;
        } catch (Exception $e) {
            error_log("Error en canUserReview: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Crear reseña simple (sin restricciones de compra)
     */
    public function createResenaSimple($usuarioId, $productoId, $valoracion, $comentario = '')
    {
        try {
            // Escapar el comentario para evitar inyección SQL
            $comentario = $this->enlace->escapeString($comentario);
            
            // Construir la query SQL directamente
            $sql = "INSERT INTO resenas (usuario_id, producto_id, valoracion, comentario, aprobado, created_at, updated_at) VALUES ($usuarioId, $productoId, $valoracion, '$comentario', 1, NOW(), NOW())";

            // Usar executeSQL_DML para INSERT
            $result = $this->enlace->executeSQL_DML($sql);
            
            if ($result > 0) {
                // Obtener el último ID insertado
                $lastId = $this->enlace->getLastId();
                return $lastId ? $lastId : true;
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error en createResenaSimple: " . $e->getMessage());
            error_log("SQL que falló: INSERT INTO resenas (usuario_id, producto_id, valoracion, comentario, aprobado, created_at, updated_at) VALUES ($usuarioId, $productoId, $valoracion, '$comentario', 1, NOW(), NOW())");
            return false;
        }
    }
}
