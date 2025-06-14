<?php
/**
 * Modelo para la gestión de categorías de productos
 */
class CategoriaModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las categorías activas
     */
    public function getAll()
    {
        try {
            $vSql = "SELECT c.*, 
                           COUNT(p.id) as total_productos
                    FROM categorias c 
                    LEFT JOIN productos p ON c.id = p.categoria_id AND p.eliminado = 0
                    WHERE c.activo = 1 
                    GROUP BY c.id
                    ORDER BY c.orden ASC, c.nombre ASC";
            return $this->enlace->executeSQL_DQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener categoría por ID
     */
    public function get($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "SELECT c.*, 
                           COUNT(p.id) as total_productos
                    FROM categorias c 
                    LEFT JOIN productos p ON c.id = p.categoria_id AND p.eliminado = 0
                    WHERE c.id = '$id' AND c.activo = 1
                    GROUP BY c.id";
            $result = $this->enlace->executeSQL_DQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear nueva categoría
     */
    public function create($datos)
    {
        try {
            $nombre = $this->enlace->escapeString($datos->nombre);
            $descripcion = $this->enlace->escapeString($datos->descripcion ?? '');
            $icono = $this->enlace->escapeString($datos->icono ?? '');
            $color = $this->enlace->escapeString($datos->color ?? '#000000');
            $orden = (int) ($datos->orden ?? 0);
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            $vSql = "INSERT INTO categorias (
                        nombre, descripcion, icono, color, orden, activo, created_at
                    ) VALUES (
                        '$nombre', '$descripcion', '$icono', '$color', $orden, $activo, NOW()
                    )";

            $this->enlace->executeSQL_DML($vSql);
            $id = $this->enlace->getLastId();
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar categoría
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = $this->enlace->escapeString($datos->nombre);
            $descripcion = $this->enlace->escapeString($datos->descripcion ?? '');
            $icono = $this->enlace->escapeString($datos->icono ?? '');
            $color = $this->enlace->escapeString($datos->color ?? '#000000');
            $orden = (int) ($datos->orden ?? 0);
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            $vSql = "UPDATE categorias SET 
                        nombre = '$nombre',
                        descripcion = '$descripcion',
                        icono = '$icono',
                        color = '$color',
                        orden = $orden,
                        activo = $activo,
                        updated_at = NOW()
                    WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar categoría (soft delete)
     */
    public function delete($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "UPDATE categorias SET activo = 0, updated_at = NOW() WHERE id = '$id'";
            return $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener productos de una categoría
     */
    public function getProductos($categoria_id)
    {
        try {
            $categoria_id = $this->enlace->escapeString($categoria_id);
            $vSql = "SELECT p.*, 
                           COUNT(r.id) as total_resenas,
                           AVG(r.valoracion) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.categoria_id = '$categoria_id' AND p.eliminado = 0
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";
            return $this->enlace->executeSQL_DQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
