<?php

/**
 * ================================================================
 * MODELO: Pedido
 * ================================================================
 *
 * Esta clase se encarga de toda la lógica de negocio relacionada
 * con los pedidos. Interactúa directamente con la base de datos
 * para crear, consultar y actualizar la información de los pedidos.
 */
class Pedido {
    // Propiedades del objeto Pedido que coinciden con la tabla 'pedidos'
    public $id;
    public $usuario_id;
    public $direccion_envio_id;
    public $numero_pedido;
    public $estado;
    public $subtotal;
    public $descuento;
    public $impuestos;
    public $total;
    public $fecha_pedido;

    // Propiedades para datos relacionados
    public $items = []; // Array para almacenar los objetos PedidoItem
    public $direccion_envio; // Objeto para almacenar la dirección

    private $conn; // Conexión a la base de datos
    private $tabla = 'pedidos';

    /**
     * Constructor de la clase.
     * @param PDO $db Conexión a la base de datos.
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Crea un nuevo pedido a partir de los datos del carrito.
     * Esta es una operación transaccional para garantizar la integridad de los datos.
     *
     * @param int $usuario_id ID del usuario que realiza el pedido.
     * @param int $direccion_envio_id ID de la dirección de envío.
     * @param array $items_carrito Array de ítems del carrito.
     * @return int|false El ID del pedido creado o false en caso de error.
     */
    public function crearDesdeCarrito($usuario_id, $direccion_envio_id, $items_carrito) {
        if (empty($items_carrito)) {
            return false; // No se puede crear un pedido sin items
        }

        // 1. Calcular totales
        $subtotal = 0;
        foreach ($items_carrito as $item) {
            $subtotal += $item['precio_unitario'] * $item['cantidad'];
        }
        
        // Lógica de negocio para descuentos e impuestos
        $descuento = 0.00; // Aquí iría la lógica para aplicar promociones
        $impuestos = $subtotal * 0.13; // Ejemplo: 13% de impuestos
        $total = ($subtotal - $descuento) + $impuestos;
        $numero_pedido = 'LYM-' . strtoupper(uniqid());

        // Iniciar transacción
        $this->conn->beginTransaction();

        try {
            // 2. Insertar en la tabla 'pedidos'
            $query = "INSERT INTO " . $this->tabla . " 
                      (usuario_id, direccion_envio_id, numero_pedido, estado, subtotal, descuento, impuestos, total) 
                      VALUES (:usuario_id, :direccion_envio_id, :numero_pedido, 'pendiente', :subtotal, :descuento, :impuestos, :total)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':usuario_id', $usuario_id);
            $stmt->bindParam(':direccion_envio_id', $direccion_envio_id);
            $stmt->bindParam(':numero_pedido', $numero_pedido);
            $stmt->bindParam(':subtotal', $subtotal);
            $stmt->bindParam(':descuento', $descuento);
            $stmt->bindParam(':impuestos', $impuestos);
            $stmt->bindParam(':total', $total);

            $stmt->execute();
            $pedido_id = $this->conn->lastInsertId();

            // 3. Insertar cada ítem en 'pedido_items'
            $query_item = "INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario) 
                           VALUES (:pedido_id, :producto_id, :nombre_producto, :cantidad, :precio_unitario)";
            
            foreach ($items_carrito as $item) {
                $stmt_item = $this->conn->prepare($query_item);
                $stmt_item->bindParam(':pedido_id', $pedido_id);
                $stmt_item->bindParam(':producto_id', $item['producto_id']);
                $stmt_item->bindParam(':nombre_producto', $item['nombre_producto']); // Snapshot del nombre
                $stmt_item->bindParam(':cantidad', $item['cantidad']);
                $stmt_item->bindParam(':precio_unitario', $item['precio_unitario']); // Snapshot del precio
                $stmt_item->execute();

                // 4. (Opcional pero recomendado) Actualizar el stock del producto
                $query_stock = "UPDATE productos SET stock = stock - :cantidad WHERE id = :producto_id";
                $stmt_stock = $this->conn->prepare($query_stock);
                $stmt_stock->bindParam(':cantidad', $item['cantidad']);
                $stmt_stock->bindParam(':producto_id', $item['producto_id']);
                $stmt_stock->execute();
            }

            // 5. Registrar el estado inicial en el historial
            $this->registrarCambioEstado($pedido_id, null, 'pendiente', $usuario_id);

            // 6. (Opcional) Limpiar el carrito de compras del usuario
            // Aquí iría la lógica para eliminar los items de la tabla `carrito_items`

            // Si todo fue bien, confirmar la transacción
            $this->conn->commit();

            return $pedido_id;

        } catch (Exception $e) {
            // Si algo falla, revertir la transacción
            $this->conn->rollBack();
            // Opcional: registrar el error en un log
            // error_log($e->getMessage());
            return false;
        }
    }

    /**
     * Busca un pedido por su ID y carga sus datos y los de sus ítems.
     *
     * @param int $id El ID del pedido a buscar.
     * @return Pedido|null El objeto Pedido si se encuentra, o null si no.
     */
    public static function findById($db, $id) {
        $query = "SELECT * FROM pedidos WHERE id = :id LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $pedido = $stmt->fetchObject('Pedido', [$db]);

        if ($pedido) {
            // Cargar los items del pedido
            $query_items = "SELECT * FROM pedido_items WHERE pedido_id = :pedido_id";
            $stmt_items = $db->prepare($query_items);
            $stmt_items->bindParam(':pedido_id', $id);
            $stmt_items->execute();
            $pedido->items = $stmt_items->fetchAll(PDO::FETCH_ASSOC);
        }

        return $pedido;
    }
    
    /**
     * Actualiza el estado de un pedido y registra el cambio en el historial.
     *
     * @param string $nuevo_estado El nuevo estado del pedido.
     * @param int $usuario_cambio_id ID del usuario (generalmente admin) que realiza el cambio.
     * @return bool True si se actualizó correctamente, false en caso contrario.
     */
    public function actualizarEstado($nuevo_estado, $usuario_cambio_id) {
        $estado_anterior = $this->estado;

        $query = "UPDATE " . $this->tabla . " SET estado = :estado WHERE id = :id";
        
        $this->conn->beginTransaction();
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':estado', $nuevo_estado);
            $stmt->bindParam(':id', $this->id);
            $stmt->execute();
            
            $this->registrarCambioEstado($this->id, $estado_anterior, $nuevo_estado, $usuario_cambio_id);
            
            $this->conn->commit();
            $this->estado = $nuevo_estado; // Actualizar el estado en el objeto actual
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    /**
     * Registra un cambio de estado en la tabla 'pedido_historial_estados'.
     *
     * @param int $pedido_id ID del pedido.
     * @param string|null $estado_anterior El estado previo.
     * @param string $estado_nuevo El nuevo estado.
     * @param int $usuario_cambio_id ID del usuario que realiza el cambio.
     */
    private function registrarCambioEstado($pedido_id, $estado_anterior, $estado_nuevo, $usuario_cambio_id) {
        $query = "INSERT INTO pedido_historial_estados (pedido_id, estado_anterior, estado_nuevo, usuario_cambio_id)
                  VALUES (:pedido_id, :estado_anterior, :estado_nuevo, :usuario_cambio_id)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':pedido_id', $pedido_id);
        $stmt->bindParam(':estado_anterior', $estado_anterior);
        $stmt->bindParam(':estado_nuevo', $estado_nuevo);
        $stmt->bindParam(':usuario_cambio_id', $usuario_cambio_id);
        $stmt->execute();
    }
}