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
            $this->validatePromoData($datos);

            $nombre = $this->enlace->escapeString($datos->nombre);
            $descripcion = isset($datos->descripcion) ? $this->enlace->escapeString($datos->descripcion) : '';
            $tipo = $this->enlace->escapeString($datos->tipo);
            $categoria_id = isset($datos->categoria_id) ? (int)$datos->categoria_id : 'NULL';
            $producto_id = isset($datos->producto_id) ? (int)$datos->producto_id : 'NULL';
            $porcentaje = isset($datos->porcentaje) ? (float)$datos->porcentaje : 0.0;
            $monto_fijo = isset($datos->monto_fijo) ? (float)$datos->monto_fijo : 0.0;
            $monto_minimo = isset($datos->monto_minimo) ? (float)$datos->monto_minimo : 0.0;
            $fecha_inicio = $this->enlace->escapeString($datos->fecha_inicio);
            $fecha_fin = isset($datos->fecha_fin) ? $this->enlace->escapeString($datos->fecha_fin) : null;
            $activo = isset($datos->activo) ? (int)$datos->activo : 1;

            $vSql = "INSERT INTO promociones (nombre, descripcion, tipo, categoria_id, producto_id, porcentaje, monto_fijo, monto_minimo, fecha_inicio, fecha_fin, activo) 
                     VALUES ('$nombre', '$descripcion', '$tipo', $categoria_id, $producto_id, $porcentaje, $monto_fijo, $monto_minimo, '$fecha_inicio', " . ($fecha_fin ? "'$fecha_fin'" : "NULL") . ", $activo)";
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
            $id = (int)$datos->id;
            $this->validatePromoData($datos);

            $nombre = $this->enlace->escapeString($datos->nombre);
            $descripcion = isset($datos->descripcion) ? $this->enlace->escapeString($datos->descripcion) : '';
            $tipo = $this->enlace->escapeString($datos->tipo);
            $categoria_id = isset($datos->categoria_id) ? (int)$datos->categoria_id : 'NULL';
            $producto_id = isset($datos->producto_id) ? (int)$datos->producto_id : 'NULL';
            $porcentaje = isset($datos->porcentaje) ? (float)$datos->porcentaje : 0.0;
            $monto_fijo = isset($datos->monto_fijo) ? (float)$datos->monto_fijo : 0.0;
            $monto_minimo = isset($datos->monto_minimo) ? (float)$datos->monto_minimo : 0.0;
            $fecha_inicio = $this->enlace->escapeString($datos->fecha_inicio);
            $fecha_fin = isset($datos->fecha_fin) ? $this->enlace->escapeString($datos->fecha_fin) : null;
            $activo = isset($datos->activo) ? (int)$datos->activo : 1;

            $vSql = "UPDATE promociones SET
                        nombre = '$nombre',
                        descripcion = '$descripcion',
                        tipo = '$tipo',
                        categoria_id = $categoria_id,
                        producto_id = $producto_id,
                        porcentaje = $porcentaje,
                        monto_fijo = $monto_fijo,
                        monto_minimo = $monto_minimo,
                        fecha_inicio = '$fecha_inicio',
                        fecha_fin = " . ($fecha_fin ? "'$fecha_fin'" : "NULL") . ",
                        activo = $activo
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
        $tipo = $datos->tipo ?? '';
        $porcentaje = isset($datos->porcentaje) ? (float)$datos->porcentaje : 0.0;
        $monto_fijo = isset($datos->monto_fijo) ? (float)$datos->monto_fijo : 0.0;

        if (!in_array($tipo, ['producto','categoria','total'])) {
            throw new Exception("Tipo de promoción inválido");
        }
        if ($tipo === 'producto' && empty($datos->producto_id)) {
            throw new Exception("producto_id requerido para tipo producto");
        }
        if ($tipo === 'categoria' && empty($datos->categoria_id)) {
            throw new Exception("categoria_id requerido para tipo categoria");
        }
        if ($tipo === 'total' && (!empty($datos->producto_id) || !empty($datos->categoria_id))) {
            throw new Exception("No debe enviar producto_id / categoria_id para tipo total");
        }
        if ($porcentaje <= 0 && $monto_fijo <= 0) {
            throw new Exception("Debe definir porcentaje > 0 o monto_fijo > 0");
        }
        if (!isset($datos->fecha_inicio) || trim($datos->fecha_inicio) === '') {
            throw new Exception("fecha_inicio requerida");
        }
    }
}
