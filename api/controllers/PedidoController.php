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
        $data = json_decode($raw, true);

        $usuario_autenticado_id = isset($data['usuario_id']) ? (int)$data['usuario_id'] : 1;

        if (!$data || !isset($data['direccion_envio_id']) || empty($data['items_carrito'])) {
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
            $db = new PDO(
                "mysql:host={$config['DB_HOST']};dbname={$config['DB_DBNAME']}",
                $config['DB_USERNAME'],
                $config['DB_PASSWORD']
            );
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Fallo al conectar a BD']);
            return;
        }

        require_once __DIR__ . '/../models/PedidoModel.php';
        $pedidoModel = new Pedido($db);
        $nuevo_pedido_id = $pedidoModel->crearDesdeCarrito(
            $usuario_autenticado_id,
            (int)$data['direccion_envio_id'],
            $data['items_carrito']
        );

        if ($nuevo_pedido_id) {
            http_response_code(201);
            echo json_encode(['mensaje' => 'Pedido creado exitosamente.', 'pedido_id' => $nuevo_pedido_id]);
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
            $db = new PDO(
                "mysql:host={$config['DB_HOST']};dbname={$config['DB_DBNAME']}",
                $config['DB_USERNAME'],
                $config['DB_PASSWORD']
            );
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
            $db = new PDO(
                "mysql:host={$config['DB_HOST']};dbname={$config['DB_DBNAME']}",
                $config['DB_USERNAME'],
                $config['DB_PASSWORD']
            );
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
