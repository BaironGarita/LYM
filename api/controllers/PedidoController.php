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
}
