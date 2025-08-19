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
    private $mysql; // Optional MySqlConnect wrapper instance
    private $tabla = 'pedidos';

    /**
     * Constructor de la clase.
     * Acepta una instancia de PDO o el wrapper MySqlConnect.
     * @param mixed $db PDO|MySqlConnect
     */
    public function __construct($db) {
        // Si se pasa el wrapper MySqlConnect
        if (is_object($db) && get_class($db) === 'MySqlConnect') {
            $this->mysql = $db;
            $pdo = $db->getPdo();
            if (!$pdo) {
                throw new Exception('No se pudo obtener PDO desde MySqlConnect');
            }
            $this->conn = $pdo;
        } else {
            // Suponemos que es PDO u otro objeto compatible
            $this->conn = $db;
        }
    }

    /**
     * Helper: obtiene un valor de un item que puede ser array o stdClass
     */
    private function getItemVal($item, $key)
    {
        if (is_array($item)) {
            return isset($item[$key]) ? $item[$key] : null;
        }
        if (is_object($item)) {
            return isset($item->{$key}) ? $item->{$key} : null;
        }
        return null;
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
            return false;
        }

        // Validaciones básicas de items
        foreach ($items_carrito as $i => $item) {
            $producto_id = $this->getItemVal($item, 'producto_id');
            $cantidad = (int)($this->getItemVal($item, 'cantidad') ?? 0);
            $precio_unitario = (float)($this->getItemVal($item, 'precio_unitario') ?? 0);
            if (!$producto_id || $cantidad <= 0 || $precio_unitario < 0) {
                throw new InvalidArgumentException("Item inválido en posición {$i}");
            }
        }

        // 1. Calcular totales
        $subtotal = 0;
        foreach ($items_carrito as $item) {
            $precio_unitario = (float)($this->getItemVal($item, 'precio_unitario') ?? 0);
            $cantidad = (int)($this->getItemVal($item, 'cantidad') ?? 0);
            $subtotal += $precio_unitario * $cantidad;
        }

        $descuento = 0.00;
        $impuestos = $subtotal * 0.13;
        $total = ($subtotal - $descuento) + $impuestos;
        $numero_pedido = 'LYM-' . strtoupper(uniqid());

        // Obtener lista de columnas reales de la tabla pedidos
        $availableCols = [];
        try {
            $colsStmt = $this->conn->prepare("SHOW COLUMNS FROM " . $this->tabla);
            $colsStmt->execute();
            $cols = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($cols as $c) {
                if (!empty($c['Field'])) $availableCols[] = $c['Field'];
            }
        } catch (Exception $e) {
            // Si falla, asumimos la tabla está muy incompleta; procedemos con columnas mínimas
            $availableCols = ['id', 'usuario_id', 'direccion_envio_id'];
        }

        // Construir INSERT dinámico según columnas disponibles
        $columnsWanted = ['usuario_id', 'direccion_envio_id', 'numero_pedido', 'estado', 'subtotal', 'descuento', 'impuestos', 'total'];
        $insertCols = [];
        $placeholders = [];
        $bindings = [];

        foreach ($columnsWanted as $col) {
            if (in_array($col, $availableCols)) {
                $insertCols[] = $col;
                $placeholders[] = ':' . $col;
            }
        }

        // usuario_id y direccion_envio_id son obligatorios para crear pedido
        if (!in_array('usuario_id', $insertCols) || !in_array('direccion_envio_id', $insertCols)) {
            // No es posible crear el pedido en este esquema
            throw new Exception('Esquema de tabla pedidos no contiene columnas mínimas necesarias');
        }

        $this->conn->beginTransaction();

        try {
            $sql = "INSERT INTO " . $this->tabla . " (" . implode(',', $insertCols) . ") VALUES (" . implode(',', $placeholders) . ")";
            $stmt = $this->conn->prepare($sql);

            // Bind comunes
            if (in_array('usuario_id', $insertCols)) $stmt->bindValue(':usuario_id', $usuario_id, PDO::PARAM_INT);
            if (in_array('direccion_envio_id', $insertCols)) $stmt->bindValue(':direccion_envio_id', $direccion_envio_id, PDO::PARAM_INT);
            if (in_array('numero_pedido', $insertCols)) $stmt->bindValue(':numero_pedido', $numero_pedido);
            // Ajuste: usar estado válido según enum en la BD (por defecto 'en_proceso')
            if (in_array('estado', $insertCols)) $stmt->bindValue(':estado', 'en_proceso');
            if (in_array('subtotal', $insertCols)) $stmt->bindValue(':subtotal', $subtotal);
            if (in_array('descuento', $insertCols)) $stmt->bindValue(':descuento', $descuento);
            if (in_array('impuestos', $insertCols)) $stmt->bindValue(':impuestos', $impuestos);
            if (in_array('total', $insertCols)) $stmt->bindValue(':total', $total);

            $stmt->execute();
            $pedido_id = $this->conn->lastInsertId();

            // Verificar existencia de tabla pedido_detalles (antes se usaba pedido_items)
            try {
                $tblStmt = $this->conn->prepare("SHOW TABLES LIKE 'pedido_detalles'");
                $tblStmt->execute();
                $hasPedidoDetalles = (bool)$tblStmt->fetch(PDO::FETCH_NUM);
            } catch (Exception $e) {
                $hasPedidoDetalles = false;
            }

            if ($hasPedidoDetalles) {
                $query_item = "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizaciones)
                               VALUES (:pedido_id, :producto_id, :cantidad, :precio_unitario, :subtotal, :personalizaciones)";
                $stmt_item = $this->conn->prepare($query_item);

                $query_stock_select = "SELECT stock FROM productos WHERE id = :producto_id FOR UPDATE";
                $stmt_stock_select = $this->conn->prepare($query_stock_select);

                $query_stock_update = "UPDATE productos SET stock = stock - :cantidad WHERE id = :producto_id";
                $stmt_stock_update = $this->conn->prepare($query_stock_update);
            }

            foreach ($items_carrito as $item) {
                $producto_id = (int)$this->getItemVal($item, 'producto_id');
                $cantidad = (int)($this->getItemVal($item, 'cantidad') ?? 0);
                $precio_unitario = (float)($this->getItemVal($item, 'precio_unitario') ?? 0.0);
                $personalizaciones = $this->getItemVal($item, 'personalizaciones');
                $personalizaciones = $personalizaciones ? (is_string($personalizaciones) ? $personalizaciones : json_encode($personalizaciones)) : null;

                if ($hasPedidoDetalles) {
                    // Bloquear fila y verificar stock solo si la tabla productos tiene stock
                    $stockOk = false;
                    try {
                        $stockCheck = $this->conn->prepare("SHOW COLUMNS FROM productos LIKE 'stock'");
                        $stockCheck->execute();
                        $hasStockCol = (bool)$stockCheck->fetch(PDO::FETCH_NUM);
                    } catch (Exception $e) {
                        $hasStockCol = false;
                    }

                    if ($hasStockCol) {
                        $stmt_stock_select->bindValue(':producto_id', $producto_id, PDO::PARAM_INT);
                        $stmt_stock_select->execute();
                        $row = $stmt_stock_select->fetch(PDO::FETCH_ASSOC);
                        if ($row === false) {
                            throw new Exception("Producto {$producto_id} no encontrado");
                        }
                        $stock_actual = (int)$row['stock'];
                        if ($stock_actual < $cantidad) {
                            throw new Exception("Stock insuficiente para producto {$producto_id}");
                        }
                        $stockOk = true;
                    }

                    // Insert detalle (sin nombre_producto, añadir subtotal y personalizaciones)
                    $stmt_item->bindValue(':pedido_id', $pedido_id, PDO::PARAM_INT);
                    $stmt_item->bindValue(':producto_id', $producto_id, PDO::PARAM_INT);
                    $stmt_item->bindValue(':cantidad', $cantidad, PDO::PARAM_INT);
                    $stmt_item->bindValue(':precio_unitario', $precio_unitario);
                    $stmt_item->bindValue(':subtotal', $cantidad * $precio_unitario);
                    $stmt_item->bindValue(':personalizaciones', $personalizaciones);
                    $stmt_item->execute();

                    // Actualizar stock si corresponde
                    if ($hasStockCol && $stockOk) {
                        $stmt_stock_update->bindValue(':cantidad', $cantidad, PDO::PARAM_INT);
                        $stmt_stock_update->bindValue(':producto_id', $producto_id, PDO::PARAM_INT);
                        $stmt_stock_update->execute();
                    }
                }
            }

            // Registrar historial y commit
            // Ajuste: usar estado válido 'en_proceso'
            $this->registrarCambioEstado($pedido_id, null, 'en_proceso', $usuario_id);
            $this->conn->commit();
            return $pedido_id;

        } catch (Exception $e) {
            // Rollback y log detallado
            try { $this->conn->rollBack(); } catch (Exception $_) {}
            error_log('[PedidoModel::crearDesdeCarrito] Excepción: ' . $e->getMessage());
            if ($e instanceof PDOException && property_exists($e, 'errorInfo')) {
                error_log('[PedidoModel::crearDesdeCarrito] errorInfo: ' . print_r($e->errorInfo, true));
            }
            // Re-lanzar excepción para que el controlador pueda responder con detalle en modo debug
            throw new Exception('Error al crear pedido: ' . $e->getMessage(), (int)$e->getCode(), $e);
        }
    }

    /**
     * Busca un pedido por su ID y carga sus datos y los de sus ítems.
     *
     * @param int $id El ID del pedido a buscar.
     * @return Pedido|null El objeto Pedido si se encuentra, o null si no.
     */
    public static function findById($db, $id) {
        // Aceptar MySqlConnect o PDO
        $pdo = $db;
        if (is_object($db) && get_class($db) === 'MySqlConnect') {
            $pdo = $db->getPdo();
            if (!$pdo) return null;
        }

        $query = "SELECT * FROM pedidos WHERE id = :id LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $pedido = $stmt->fetchObject('Pedido', [$pdo]);

        if ($pedido) {
            // Cargar los items del pedido: preferir pedido_detalles, fallback a pedido_items
            $items = [];
            try {
                $stmt_items = $pdo->prepare("SELECT * FROM pedido_detalles WHERE pedido_id = :pedido_id");
                $stmt_items->bindParam(':pedido_id', $id, PDO::PARAM_INT);
                $stmt_items->execute();
                $items = $stmt_items->fetchAll(PDO::FETCH_ASSOC);
                if (empty($items)) {
                    // intentar tabla alternativa 'pedido_items'
                    $stmt_items2 = $pdo->prepare("SELECT * FROM pedido_items WHERE pedido_id = :pedido_id");
                    $stmt_items2->bindParam(':pedido_id', $id, PDO::PARAM_INT);
                    $stmt_items2->execute();
                    $items = $stmt_items2->fetchAll(PDO::FETCH_ASSOC);
                }
            } catch (Exception $e) {
                // en caso de error, devolver items vacíos
                $items = [];
            }
            $pedido->items = $items;
        }

        return $pedido;
    }

    /**
     * Devuelve un listado básico de pedidos (para administración).
     * @param mixed $db PDO|MySqlConnect
     * @return array
     */
    public static function getAll($db) {
        // Aceptar MySqlConnect (wrapper) o PDO
        $pdo = $db;
        if (is_object($db) && get_class($db) === 'MySqlConnect') {
            $pdo = $db->getPdo();
            if (!$pdo) {
                // Intentar usar el wrapper directamente (runQuery devuelve array o null)
                try {
                    // Ajuste: ordenar por created_at (columna real en la tabla pedidos)
                    $rows = $db->runQuery('SELECT * FROM pedidos ORDER BY created_at DESC', []);
                    return $rows ?: [];
                } catch (Exception $e) {
                    error_log('[PedidoModel::getAll] wrapper-runQuery error: ' . $e->getMessage());
                    return [];
                }
            }
        }

        try {
            // Ajuste: ordenar por created_at en lugar de fecha_pedido
            $stmt = $pdo->prepare('SELECT * FROM pedidos ORDER BY created_at DESC');
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $rows ?: [];
        } catch (Exception $e) {
            error_log('[PedidoModel::getAll] PDO error: ' . $e->getMessage());
            return [];
        }
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
     * Registra un cambio de estado en la tabla 'pedido_historial'.
     *
     * @param int $pedido_id ID del pedido.
     * @param string|null $estado_anterior El estado previo.
     * @param string $estado_nuevo El nuevo estado.
     * @param int $usuario_cambio_id ID del usuario que realiza el cambio.
     */
    private function registrarCambioEstado($pedido_id, $estado_anterior, $estado_nuevo, $usuario_cambio_id) {
        // Nombre "oficial" según el script proporcionado
        static $historialTableName = null; // cache por request

        if ($historialTableName === null) {
            $historialTableName = $this->descubrirTablaHistorial();
        }

        if (!$historialTableName) {
            // No existe ninguna tabla de historial compatible: evitar romper el flujo
            error_log('[PedidoModel::registrarCambioEstado] Tabla de historial no encontrada, se omite registro');
            return; // silencioso; no es crítico para terminar el pedido
        }

        // Detectar columnas disponibles en la tabla de historial
        $cols = [];
        try {
            $colsStmt = $this->conn->prepare("SHOW COLUMNS FROM {$historialTableName}");
            $colsStmt->execute();
            $colsRaw = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($colsRaw as $c) {
                if (!empty($c['Field'])) $cols[] = $c['Field'];
            }
        } catch (Exception $e) {
            $cols = [];
        }

        try {
            if (in_array('usuario_cambio_id', $cols)) {
                // Tabla antigua/extendida: soporta usuario_cambio_id
                $query = "INSERT INTO {$historialTableName} (pedido_id, estado_anterior, estado_nuevo, usuario_cambio_id)
                          VALUES (:pedido_id, :estado_anterior, :estado_nuevo, :usuario_cambio_id)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
                $stmt->bindParam(':estado_anterior', $estado_anterior);
                $stmt->bindParam(':estado_nuevo', $estado_nuevo);
                $stmt->bindParam(':usuario_cambio_id', $usuario_cambio_id, PDO::PARAM_INT);
                $stmt->execute();
            } elseif (in_array('comentario', $cols)) {
                // Schema actual del dump: insertar comentario con referencia al usuario si se quiere
                $comentario = $usuario_cambio_id ? "Usuario: {$usuario_cambio_id}" : null;
                $query = "INSERT INTO {$historialTableName} (pedido_id, estado_anterior, estado_nuevo, comentario)
                          VALUES (:pedido_id, :estado_anterior, :estado_nuevo, :comentario)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
                $stmt->bindParam(':estado_anterior', $estado_anterior);
                $stmt->bindParam(':estado_nuevo', $estado_nuevo);
                $stmt->bindParam(':comentario', $comentario);
                $stmt->execute();
            } else {
                // Fallback: insertar solo lo mínimo (si la tabla sólo tuviera pedido_id/estado_nuevo)
                $query = "INSERT INTO {$historialTableName} (pedido_id, estado_nuevo)
                          VALUES (:pedido_id, :estado_nuevo)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
                $stmt->bindParam(':estado_nuevo', $estado_nuevo);
                $stmt->execute();
            }
        } catch (Exception $e) {
            // Loguear y continuar sin interrumpir la transacción principal
            error_log('[PedidoModel::registrarCambioEstado] Error al insertar historial: ' . $e->getMessage());
        }
    }

    /**
     * Intenta encontrar la tabla de historial de estados probando variaciones de nombre comunes.
     * Devuelve el nombre de la tabla existente o null si no se encuentra.
     */
    private function descubrirTablaHistorial() {
        $candidatas = [
            'pedido_historial',              // nuevo nombre oficial
            'pedido_historial_estados',      // nombre legacy (anterior)
            'pedidos_historial_estados',     // variación pluralizada
            'historial_pedidos',             // versión acortada
            'pedido_estados_historial',      // otra posible permutación
        ];
        foreach ($candidatas as $tabla) {
            if ($this->existeTabla($tabla)) {
                if ($tabla !== 'pedido_historial') {
                    error_log('[PedidoModel] Usando tabla de historial alternativa detectada: ' . $tabla);
                }
                return $tabla;
            }
        }
        return null;
    }

    /**
     * Verifica si una tabla existe en la base de datos actual.
     */
    private function existeTabla($nombreTabla) {
        try {
            $stmt = $this->conn->prepare("SHOW TABLES LIKE :t");
            $stmt->bindValue(':t', $nombreTabla);
            $stmt->execute();
            return (bool)$stmt->fetch(PDO::FETCH_NUM);
        } catch (Exception $e) {
            return false;
        }
    }
}