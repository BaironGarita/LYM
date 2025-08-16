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
                           r.created_at as fecha_resena,
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

            return $this->enlace->executeSQL($sql, "asoc"); // Usar asoc para arrays
        } catch (Exception $e) {
            error_log("Error en getAllResenas: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener reseñas por producto ID con validación estricta
     */
    public function getResenasByProducto($productoId)
    {
        try {
            $productoId = intval($productoId);
            if ($productoId <= 0) {
                return [];
            }

            $sql = "SELECT r.id, r.usuario_id, r.producto_id, r.valoracion, r.comentario, 
                           r.created_at as fecha_resena,
                           u.nombre as nombre_usuario, 
                           u.correo as email_usuario
                    FROM resenas r
                    INNER JOIN usuarios u ON r.usuario_id = u.id
                    WHERE r.producto_id = $productoId 
                    AND r.aprobado = 1 
                    AND u.nombre IS NOT NULL 
                    AND u.nombre != '' 
                    AND r.comentario IS NOT NULL 
                    AND r.comentario != ''
                    ORDER BY r.created_at DESC";

            $result = $this->enlace->executeSQL($sql, "asoc"); // Usar asoc para arrays
            
            // Verificar que result es un array antes de iterarlo
            if (!is_array($result)) {
                return [];
            }
            
            // Filtrar resultados para asegurar datos válidos
            $validResults = [];
            foreach ($result as $resena) {
                if (is_array($resena) &&
                    isset($resena['nombre_usuario']) && 
                    trim($resena['nombre_usuario']) !== '' &&
                    isset($resena['comentario']) && 
                    trim($resena['comentario']) !== '' &&
                    isset($resena['valoracion']) && 
                    $resena['valoracion'] >= 1 && 
                    $resena['valoracion'] <= 5) {
                    $validResults[] = $resena;
                }
            }
            
            return $validResults;
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
                           r.created_at as fecha_resena,
                           u.nombre as nombre_usuario, 
                           u.correo as email_usuario,
                           p.nombre as nombre_producto,
                           p.precio as precio_producto,
                           p.categoria_id
                    FROM resenas r
                    INNER JOIN usuarios u ON r.usuario_id = u.id
                    INNER JOIN productos p ON r.producto_id = p.id
                    WHERE r.id = $id";

            $result = $this->enlace->executeSQL($sql, "asoc"); // Usar asoc para arrays
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
            $sql = "UPDATE resenas 
                    SET valoracion = $valoracion, comentario = '$comentario', updated_at = NOW() 
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
     * Crear reseña simple con validación estricta
     */
    public function createResenaSimple($usuarioId, $productoId, $valoracion, $comentario = '')
    {
        try {
            // Validar parámetros de entrada
            $usuarioId = intval($usuarioId);
            $productoId = intval($productoId);
            $valoracion = intval($valoracion);
            $comentario = trim($comentario);
            
            if ($usuarioId <= 0 || $productoId <= 0 || $valoracion < 1 || $valoracion > 5 || empty($comentario)) {
                error_log("Parámetros inválidos para createResenaSimple: usuarioId=$usuarioId, productoId=$productoId, valoracion=$valoracion, comentario='$comentario'");
                return false;
            }

            // Escapar el comentario para evitar inyección SQL
            $comentario = $this->enlace->escapeString($comentario);
            
            // Construir la query SQL con validaciones adicionales
            $sql = "INSERT INTO resenas (usuario_id, producto_id, valoracion, comentario, aprobado, created_at, updated_at) 
                    VALUES ($usuarioId, $productoId, $valoracion, '$comentario', 1, NOW(), NOW())";

            // Usar executeSQL_DML_last para obtener el ID insertado
            $lastId = $this->enlace->executeSQL_DML_last($sql);
            
            if ($lastId && $lastId > 0) {
                return intval($lastId);
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error en createResenaSimple: " . $e->getMessage());
            error_log("SQL que falló: INSERT INTO resenas (usuario_id, producto_id, valoracion, comentario, aprobado, created_at, updated_at) VALUES ($usuarioId, $productoId, $valoracion, '$comentario', 1, NOW(), NOW())");
            return false;
        }
    }
}
