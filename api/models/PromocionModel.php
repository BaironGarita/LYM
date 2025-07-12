<?php
/**
 * Modelo para la gestión de promociones.
 */
class PromocionModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las promociones.
     */
    public function getAll()
    {
        try {
            $vSql = "SELECT 
                        promo.*, 
                        c.nombre as categoria_nombre, 
                        p.nombre as producto_nombre 
                     FROM promociones promo
                     LEFT JOIN categorias c ON promo.categoria_id = c.id
                     LEFT JOIN productos p ON promo.producto_id = p.id
                     ORDER BY promo.fecha_inicio DESC";
            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener promoción por ID.
     */
    public function get($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "SELECT 
                        promo.*, 
                        c.nombre as categoria_nombre, 
                        p.nombre as producto_nombre 
                     FROM promociones promo
                     LEFT JOIN categorias c ON promo.categoria_id = c.id
                     LEFT JOIN productos p ON promo.producto_id = p.id
                     WHERE promo.id = '$id'";
            $result = $this->enlace->executeSQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear nueva promoción.
     */
    public function create($datos)
    {
        try {
            // Validar la lógica de la promoción
            $this->validatePromoData($datos);

            $nombre = $this->enlace->escapeString($datos->nombre);
            $tipo = $this->enlace->escapeString($datos->tipo);
            $categoria_id = isset($datos->categoria_id) ? (int) $datos->categoria_id : 'NULL';
            $producto_id = isset($datos->producto_id) ? (int) $datos->producto_id : 'NULL';
            $porcentaje = (float) $datos->porcentaje;
            $fecha_inicio = $this->enlace->escapeString($datos->fecha_inicio);
            $fecha_fin = $this->enlace->escapeString($datos->fecha_fin);
            $activa = isset($datos->activa) ? (int) $datos->activa : 1;

            $vSql = "INSERT INTO promociones (nombre, tipo, categoria_id, producto_id, porcentaje, fecha_inicio, fecha_fin, activa) 
                     VALUES ('$nombre', '$tipo', $categoria_id, $producto_id, $porcentaje, '$fecha_inicio', '$fecha_fin', $activa)";

            $this->enlace->executeSQL_DML($vSql);
            $id = $this->enlace->getLastId();
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar promoción.
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $this->validatePromoData($datos);

            $nombre = $this->enlace->escapeString($datos->nombre);
            $tipo = $this->enlace->escapeString($datos->tipo);
            $categoria_id = isset($datos->categoria_id) ? (int) $datos->categoria_id : 'NULL';
            $producto_id = isset($datos->producto_id) ? (int) $datos->producto_id : 'NULL';
            $porcentaje = (float) $datos->porcentaje;
            $fecha_inicio = $this->enlace->escapeString($datos->fecha_inicio);
            $fecha_fin = $this->enlace->escapeString($datos->fecha_fin);
            $activa = isset($datos->activa) ? (int) $datos->activa : 1;

            $vSql = "UPDATE promociones SET
                        nombre = '$nombre',
                        tipo = '$tipo',
                        categoria_id = $categoria_id,
                        producto_id = $producto_id,
                        porcentaje = $porcentaje,
                        fecha_inicio = '$fecha_inicio',
                        fecha_fin = '$fecha_fin',
                        activa = $activa
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar promoción.
     */
    public function delete($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "DELETE FROM promociones WHERE id = '$id'";
            return $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Valida que los datos de la promoción sean consistentes con la restricción CHECK de la BD.
     */
    private function validatePromoData($datos)
    {
        if ($datos->tipo === 'categoria' && (empty($datos->categoria_id) || !empty($datos->producto_id))) {
            throw new Exception("Para tipo 'categoria', se requiere 'categoria_id' y 'producto_id' debe ser nulo.", 400);
        }
        if ($datos->tipo === 'producto' && (empty($datos->producto_id) || !empty($datos->categoria_id))) {
            throw new Exception("Para tipo 'producto', se requiere 'producto_id' y 'categoria_id' debe ser nulo.", 400);
        }
    }
}
