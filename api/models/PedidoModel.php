<?php
/**
 * Modelo para la gestión de pedidos
 */
class PedidoModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todos los pedidos
     */
    public function getAll()
    {
        try {
            $vSql = "SELECT 
                        p.id,
                        p.usuario_id,
                        u.nombre as cliente_nombre,
                        u.correo as cliente_correo,
                        p.direccion_envio_id,
                        CONCAT(d.ciudad, ', ', d.provincia) as direccion_envio,
                        p.subtotal,
                        p.impuestos,
                        p.envio,
                        p.descuento,
                        p.total,
                        p.estado,
                        p.metodo_pago,
                        p.created_at,
                        p.updated_at,
                        COUNT(pd.id) as total_items
                     FROM pedidos p
                     JOIN usuarios u ON p.usuario_id = u.id
                     JOIN direcciones d ON p.direccion_envio_id = d.id
                     LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
                     GROUP BY p.id
                     ORDER BY p.created_at DESC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener pedido por ID con detalles
     */
    public function get($id)
    {
        try {
            // Obtener datos del pedido
            $id = $this->enlace->escapeString($id);
            $vSql = "SELECT 
                        p.*,
                        u.nombre as cliente_nombre,
                        u.correo as cliente_correo,
                        d.provincia,
                        d.ciudad,
                        d.direccion_1,
                        d.direccion_2,
                        d.codigo_postal,
                        d.telefono
                     FROM pedidos p
                     JOIN usuarios u ON p.usuario_id = u.id
                     JOIN direcciones d ON p.direccion_envio_id = d.id
                     WHERE p.id = '$id'";

            $pedido = $this->enlace->executeSQL($vSql);
            if (empty($pedido)) {
                return null;
            }

            $pedido = $pedido[0];

            // Obtener detalles del pedido
            $vSqlDetalles = "SELECT 
                                pd.*,
                                pr.nombre as producto_nombre,
                                pr.sku as producto_sku
                             FROM pedido_detalles pd
                             JOIN productos pr ON pd.producto_id = pr.id
                             WHERE pd.pedido_id = '$id'
                             ORDER BY pd.id";

            $detalles = $this->enlace->executeSQL($vSqlDetalles);
            $pedido->detalles = $detalles;

            return $pedido;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener pedidos por usuario
     */
    public function getByUsuario($usuario_id)
    {
        try {
            $usuario_id = $this->enlace->escapeString($usuario_id);
            $vSql = "SELECT 
                        p.*,
                        COUNT(pd.id) as total_items
                     FROM pedidos p
                     LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
                     WHERE p.usuario_id = '$usuario_id'
                     GROUP BY p.id
                     ORDER BY p.created_at DESC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear nuevo pedido
     */
    public function create($datos)
    {
        try {
            $usuario_id = (int) $datos->usuario_id;
            $direccion_envio_id = (int) $datos->direccion_envio_id;
            $subtotal = (float) $datos->subtotal;
            $impuestos = (float) ($datos->impuestos ?? 0);
            $envio = (float) ($datos->envio ?? 0);
            $descuento = (float) ($datos->descuento ?? 0);
            $total = (float) $datos->total;
            $metodo_pago = $this->enlace->escapeString($datos->metodo_pago ?? 'pendiente');

            // Insertar pedido
            $vSql = "INSERT INTO pedidos (
                        usuario_id, direccion_envio_id, subtotal, impuestos, 
                        envio, descuento, total, estado, metodo_pago, created_at, updated_at
                     ) VALUES (
                        $usuario_id, $direccion_envio_id, $subtotal, $impuestos,
                        $envio, $descuento, $total, 'en_proceso', '$metodo_pago', NOW(), NOW()
                     )";

            $this->enlace->executeSQL_DML($vSql);
            $pedido_id = $this->enlace->getLastId();

            // Insertar detalles del pedido
            foreach ($datos->detalles as $detalle) {
                $this->addDetalle($pedido_id, $detalle);
            }

            // Agregar al historial
            $this->addHistorial($pedido_id, null, 'en_proceso', 'Pedido creado');

            return $this->get($pedido_id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Agregar detalle al pedido
     */
    private function addDetalle($pedido_id, $detalle)
    {
        try {
            $producto_id = (int) $detalle->producto_id;
            $cantidad = (int) $detalle->cantidad;
            $precio_unitario = (float) $detalle->precio_unitario;
            $subtotal = $cantidad * $precio_unitario;

            $vSql = "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                     VALUES ($pedido_id, $producto_id, $cantidad, $precio_unitario, $subtotal)";

            $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar estado del pedido
     */
    public function updateEstado($id, $nuevo_estado, $comentario = '')
    {
        try {
            // Obtener estado actual
            $pedido_actual = $this->get($id);
            if (!$pedido_actual) {
                throw new Exception("Pedido no encontrado");
            }

            $estado_anterior = $pedido_actual->estado;
            $id = $this->enlace->escapeString($id);
            $nuevo_estado = $this->enlace->escapeString($nuevo_estado);

            // Actualizar pedido
            $vSql = "UPDATE pedidos SET estado = '$nuevo_estado', updated_at = NOW() WHERE id = '$id'";
            $this->enlace->executeSQL_DML($vSql);

            // Agregar al historial
            $this->addHistorial($id, $estado_anterior, $nuevo_estado, $comentario);

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Agregar entrada al historial
     */
    private function addHistorial($pedido_id, $estado_anterior, $estado_nuevo, $comentario)
    {
        try {
            $pedido_id = $this->enlace->escapeString($pedido_id);
            $estado_anterior = $estado_anterior ? "'" . $this->enlace->escapeString($estado_anterior) . "'" : 'NULL';
            $estado_nuevo = $this->enlace->escapeString($estado_nuevo);
            $comentario = $this->enlace->escapeString($comentario);

            $vSql = "INSERT INTO pedido_historial (pedido_id, estado_anterior, estado_nuevo, comentario, created_at)
                     VALUES ('$pedido_id', $estado_anterior, '$estado_nuevo', '$comentario', NOW())";

            $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener historial del pedido
     */
    public function getHistorial($pedido_id)
    {
        try {
            $pedido_id = $this->enlace->escapeString($pedido_id);
            $vSql = "SELECT * FROM pedido_historial 
                     WHERE pedido_id = '$pedido_id' 
                     ORDER BY created_at ASC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}