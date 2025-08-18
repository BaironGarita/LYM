<?php

class PedidoController {
    public function __construct()
    {
        // Constructor vacío; cada método obtiene conexión según necesidad.
    }

    // Crear pedido (POST)
    public function crear()
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw);

        // normalizar: $data puede ser objeto (stdClass) o array
        $usuario_autenticado_id = isset($data->usuario_id) ? (int)$data->usuario_id : (isset($data['usuario_id']) ? (int)$data['usuario_id'] : 1);

        $direccion_envio_id = null;
        if (isset($data->direccion_envio_id)) $direccion_envio_id = (int)$data->direccion_envio_id;
        if ($direccion_envio_id === null && isset($data['direccion_envio_id'])) $direccion_envio_id = (int)$data['direccion_envio_id'];

        $items_carrito = [];
        if (isset($data->items_carrito) && $data->items_carrito) {
            $items_carrito = $data->items_carrito;
        } elseif (isset($data['items_carrito']) && $data['items_carrito']) {
            $items_carrito = $data['items_carrito'];
        }

        // Validar
        if (!$data || !$direccion_envio_id || empty($items_carrito)) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Datos incompletos para crear el pedido.']);
            return;
        }

        // Conexión PDO usando config.php
        $configPath = __DIR__ . '/../config.php';
        if (!file_exists($configPath)) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Falta configuración de BD']);
            return;
        }
        $config = require $configPath;
        try {
            // Usar el wrapper MySqlConnect (mysqli) en lugar de crear PDO aquí
            require_once __DIR__ . '/core/MySqlConnect.php';
            $mysql = new MySqlConnect();
            $db = $mysql; // pasaremos la instancia al modelo

            // Verificar conexión mínima (runQuery devuelve NULL si falla internamente)
            $test = $db->runQuery('SELECT 1', []);
            if ($test === null) {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
            return;
        }

    require_once __DIR__ . '/../models/PedidoModel.php';
    error_log('[PedidoController::crear] items_carrito count=' . (is_array($items_carrito) ? count($items_carrito) : 0));
    $pedidoModel = new Pedido($db);

        // Asegurar que items_carrito sea un array de arrays/objetos utilizables
        if (is_object($items_carrito)) {
            // si viene como stdClass con claves numéricas, convertir
            $items_carrito = json_decode(json_encode($items_carrito), true);
        }

        try {
            $nuevo_pedido_id = $pedidoModel->crearDesdeCarrito(
                $usuario_autenticado_id,
                (int)$direccion_envio_id,
                $items_carrito
            );
        } catch (Exception $e) {
            // Log y devolver detalle para debug (temporal)
            error_log('[PedidoController::crear] Excepción: ' . $e->getMessage());
            if ($e->getPrevious()) {
                error_log('[PedidoController::crear] Previous: ' . $e->getPrevious()->getMessage());
            }
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al crear pedido', 'error' => $e->getMessage()]);
            return;
        }

        if ($nuevo_pedido_id) {
            http_response_code(201);
            echo json_encode([
                'mensaje' => 'Pedido creado exitosamente.',
                'pedido_id' => $nuevo_pedido_id,
            ]);
            return;
        }

        http_response_code(500);
        echo json_encode(['mensaje' => 'No se pudo procesar el pedido.']);
    }

    // Obtener pedido por ID
    public function obtenerPorId($id)
    {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'ID no proporcionado']);
            return;
        }

        $configPath = __DIR__ . '/../config.php';
        if (!file_exists($configPath)) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Falta configuración de BD']);
            return;
        }
        $config = require $configPath;
        try {
            // Usar el wrapper MySqlConnect (mysqli) en lugar de crear PDO aquí
            require_once __DIR__ . '/core/MySqlConnect.php';
            $mysql = new MySqlConnect();
            $db = $mysql; // pasaremos la instancia al modelo

            // Verificar conexión mínima
            $test = $db->runQuery('SELECT 1', []);
            if ($test === null) {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
            return;
        }

        require_once __DIR__ . '/../models/PedidoModel.php';
        $pedido = Pedido::findById($db, (int)$id);

        if ($pedido) {
            http_response_code(200);
            echo json_encode($pedido);
        } else {
            http_response_code(404);
            echo json_encode(['mensaje' => 'Pedido no encontrado.']);
        }
    }

    // Actualizar estado del pedido (PUT)
    public function actualizarEstadoPedido($id)
    {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'ID no proporcionado']);
            return;
        }

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (!$data || !isset($data['nuevo_estado'])) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Falta el nuevo estado del pedido.']);
            return;
        }

        $configPath = __DIR__ . '/../config.php';
        if (!file_exists($configPath)) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Falta configuración de BD']);
            return;
        }
        $config = require $configPath;
        try {
            // Usar el wrapper MySqlConnect (mysqli) en lugar de crear PDO aquí
            require_once __DIR__ . '/core/MySqlConnect.php';
            $mysql = new MySqlConnect();
            $db = $mysql; // pasaremos la instancia al modelo

            // Verificar conexión mínima
            $test = $db->runQuery('SELECT 1', []);
            if ($test === null) {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
            return;
        }

        require_once __DIR__ . '/../models/PedidoModel.php';
        $pedido = Pedido::findById($db, (int)$id);

        if (!$pedido) {
            http_response_code(404);
            echo json_encode(['mensaje' => 'Pedido no encontrado.']);
            return;
        }

        $usuario_autenticado_id = 10; // Simulación
        $result = $pedido->actualizarEstado($data['nuevo_estado'], $usuario_autenticado_id);

        if ($result) {
            http_response_code(200);
            echo json_encode(['mensaje' => 'Estado del pedido actualizado correctamente.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al actualizar el estado del pedido.']);
        }
    }

    // Wrappers para el router
    public function create()
    {
        $this->crear();
    }

    public function get()
    {
        if (isset($_GET['id'])) {
            $this->obtenerPorId((int)$_GET['id']);
            return;
        }

        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));
        $last = end($segments);
        if (is_numeric($last)) {
            $this->obtenerPorId((int)$last);
            return;
        }

        http_response_code(200);
        echo json_encode(['mensaje' => 'Endpoint de listado de pedidos (implementar según necesidad).']);
    }

    public function update()
    {
        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));
        $last = end($segments);
        if (is_numeric($last)) {
            $this->actualizarEstadoPedido((int)$last);
            return;
        }

        http_response_code(400);
        echo json_encode(['mensaje' => 'ID de pedido no proporcionado para actualización.']);
    }

    public function delete($id = null)
    {
        http_response_code(405);
        echo json_encode(['mensaje' => 'Eliminar pedido no soportado via esta ruta.']);
    }

    public function index()
    {
        http_response_code(200);
        echo json_encode(['mensaje' => 'Endpoint de listado de pedidos (implementar según necesidad).']);
    }

    /**
     * Estadísticas de ventas: total ventas, costo estimado, ganancia y porcentaje.
     * Opcionales GET params: start_date, end_date (ISO 8601)
     */
    public function estadisticasVentas()
    {
        $configPath = __DIR__ . '/../config.php';
        if (!file_exists($configPath)) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Falta configuración de BD']);
            return;
        }

        try {
            require_once __DIR__ . '/core/MySqlConnect.php';
            $mysql = new MySqlConnect();
            $pdo = $mysql->getPdo();
            if (!$pdo) {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
            return;
        }

        // Filtros opcionales por fecha
        $start = isset($_GET['start_date']) ? $_GET['start_date'] : null;
        $end = isset($_GET['end_date']) ? $_GET['end_date'] : null;

        $where = "1=1 AND (estado IS NULL OR estado <> 'cancelado')"; // excluir cancelados
        $params = [];
        if ($start) {
            $where .= " AND fecha_pedido >= :start";
            $params[':start'] = $start;
        }
        if ($end) {
            $where .= " AND fecha_pedido <= :end";
            $params[':end'] = $end;
        }

        try {
            $stmt = $pdo->prepare("SELECT id, COALESCE(total,0) as total FROM pedidos WHERE $where");
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->execute();
            $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $totalVentas = 0.0;
            $totalCosto = 0.0;
            $totalPedidos = count($pedidos);

            // Cargar columnas de productos para decidir si existe campo de costo real
            $productoCols = [];
            try {
                $colsStmt = $pdo->query("SHOW COLUMNS FROM productos");
                $cols = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($cols as $c) {
                    if (!empty($c['Field'])) $productoCols[] = $c['Field'];
                }
            } catch (Exception $_) {
                // ignorar si tabla no existe o falla
            }

            $productCostCache = [];

            foreach ($pedidos as $p) {
                $pedidoId = (int)$p['id'];
                $totalVentas += (float)$p['total'];

                // Obtener items del pedido (intentar ambas tablas conocidas)
                $items = [];
                try {
                    $stmtItems = $pdo->prepare("SELECT producto_id, cantidad, precio_unitario, subtotal FROM pedido_items WHERE pedido_id = :pid");
                    $stmtItems->bindValue(':pid', $pedidoId, PDO::PARAM_INT);
                    $stmtItems->execute();
                    $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
                } catch (Exception $_) {
                    // intentar tabla alternativa 'pedido_detalles'
                    try {
                        $stmtItems = $pdo->prepare("SELECT producto_id, cantidad, precio_unitario, subtotal FROM pedido_detalles WHERE pedido_id = :pid");
                        $stmtItems->bindValue(':pid', $pedidoId, PDO::PARAM_INT);
                        $stmtItems->execute();
                        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
                    } catch (Exception $__) {
                        $items = [];
                    }
                }

                foreach ($items as $it) {
                    $productoId = (int)($it['producto_id'] ?? 0);
                    $cantidad = (int)($it['cantidad'] ?? 0);
                    $precioUnit = (float)($it['precio_unitario'] ?? 0.0);

                    if ($cantidad <= 0) continue;

                    // Obtener costo por unidad con cache
                    if (!isset($productCostCache[$productoId])) {
                        $costPerUnit = null;

                        // Si existe columna 'costo' o 'precio_compra' en tabla productos, usarla
                        if (in_array('costo', $productoCols) || in_array('precio_compra', $productoCols) || in_array('precio_proveedor', $productoCols)) {
                            $col = in_array('costo', $productoCols) ? 'costo' : (in_array('precio_compra', $productoCols) ? 'precio_compra' : 'precio_proveedor');
                            try {
                                $pstmt = $pdo->prepare("SELECT $col, precio FROM productos WHERE id = :pid LIMIT 1");
                                $pstmt->bindValue(':pid', $productoId, PDO::PARAM_INT);
                                $pstmt->execute();
                                $prow = $pstmt->fetch(PDO::FETCH_ASSOC);
                                if ($prow) {
                                    $val = isset($prow[$col]) ? (float)$prow[$col] : null;
                                    if ($val && $val > 0) {
                                        $costPerUnit = $val;
                                    } else {
                                        $pricePublic = isset($prow['precio']) ? (float)$prow['precio'] : $precioUnit;
                                        $costPerUnit = $pricePublic * 0.6; // fallback heuristic
                                    }
                                }
                            } catch (Exception $_) {
                                $costPerUnit = $precioUnit * 0.6;
                            }
                        } else {
                            // No hay columna de costo: usar heurística (60% del precio de venta)
                            $costPerUnit = $precioUnit * 0.6;
                        }

                        // última salvaguarda
                        if (!$costPerUnit || $costPerUnit <= 0) $costPerUnit = $precioUnit * 0.6;
                        $productCostCache[$productoId] = $costPerUnit;
                    }

                    $totalCosto += $productCostCache[$productoId] * $cantidad;
                }
            }

            $ganancia = $totalVentas - $totalCosto;
            $porcentaje = ($totalCosto > 0) ? ($ganancia / $totalCosto) * 100 : null;

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode([
                'totalPedidos' => $totalPedidos,
                'totalVentas' => round($totalVentas, 2),
                'totalCostoEstimado' => round($totalCosto, 2),
                'ganancia' => round($ganancia, 2),
                'porcentajeGanancia' => is_null($porcentaje) ? null : round($porcentaje, 2),
                'start_date' => $start,
                'end_date' => $end,
                'nota' => 'Si no existe campo de costo en productos, se usa heurística (costo = 60% del precio de venta).'
            ]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al calcular estadísticas', 'error' => $e->getMessage()]);
            return;
        }
    }
}
