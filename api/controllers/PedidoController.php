<?php

// Incluir el modelo y la configuración de la base de datos
// require_once 'config/Database.php'; // Asumiendo que tienes un archivo para la conexión
// require_once 'models/Pedido.php';

/**
 * ================================================================
 * CONTROLADOR: PedidoController
 * ================================================================
 *
 * Esta clase maneja las solicitudes HTTP relacionadas con los pedidos.
 * Actúa como intermediario entre la vista (el cliente) y el modelo (Pedido.php).
 */
class PedidoController {
    private $db;
    private $pedido;

    /**
     * Constructor para inicializar la conexión a la BD y el modelo.
     */
    public function __construct() {
        // En una aplicación real, la conexión a la BD se gestionaría de forma centralizada.
        // $database = new Database();
        // $this->db = $database->connect();
        // $this->pedido = new Pedido($this->db);
        
        // Para este ejemplo, simularemos la conexión
        // $this->db = new PDO(...); 
        // $this->pedido = new Pedido($this->db);
    }

    /**
     * Endpoint para crear un nuevo pedido.
     * Recibe los datos por POST en formato JSON.
     *
     * Ejemplo de JSON esperado:
     * {
     * "direccion_envio_id": 1,
     * "items_carrito": [
     * { "producto_id": 1, "nombre_producto": "Bolso Milano", "cantidad": 1, "precio_unitario": 299.99 },
     * { "producto_id": 2, "nombre_producto": "Cinturón Clásico", "cantidad": 1, "precio_unitario": 79.50 }
     * ]
     * }
     */
    public function crear() {
        // Obtener los datos enviados en el cuerpo de la solicitud
        $raw = file_get_contents("php://input");
        $data = json_decode($raw);

        // Si el frontend envía usuario_id (temporal) úsalo, si no usar auth real en su lugar
        $usuario_autenticado_id = isset($data->usuario_id) ? (int)$data->usuario_id : 1; // reemplazar por extracción de token/session en producción

        if (!$data || !isset($data->direccion_envio_id) || empty($data->items_carrito)) {
            http_response_code(400); // Bad Request
            echo json_encode(['mensaje' => 'Datos incompletos para crear el pedido.']);
            return;
        }

        // Crear una instancia del modelo (asumiendo que $this->db está disponible)
        $pedido = new Pedido($this->db);

        // Intentar crear el pedido
        $nuevo_pedido_id = $pedido->crearDesdeCarrito(
            $usuario_autenticado_id,
            $data->direccion_envio_id,
            (array) $data->items_carrito
        );

        if ($nuevo_pedido_id) {
            http_response_code(201); // Created
            echo json_encode([
                'mensaje' => 'Pedido creado exitosamente.',
                'pedido_id' => $nuevo_pedido_id
            ]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['mensaje' => 'No se pudo procesar el pedido.']);
        }
    }

    /**
     * Endpoint para obtener los detalles de un pedido específico.
     * El ID del pedido se pasa por la URL (ej: /api/pedidos/123).
     *
     * @param int $id El ID del pedido.
     */
    public function obtenerPorId($id) {
        // Simular la obtención del ID de usuario autenticado
        $usuario_autenticado_id = 1;
        $rol_usuario = 'cliente'; // o 'administrador'

        $pedido = Pedido::findById($this->db, $id);

        if ($pedido) {
            // Validar permisos: el usuario debe ser el dueño del pedido o un administrador
            if ($pedido->usuario_id == $usuario_autenticado_id || $rol_usuario === 'administrador') {
                http_response_code(200); // OK
                echo json_encode($pedido);
            } else {
                http_response_code(403); // Forbidden
                echo json_encode(['mensaje' => 'No tienes permiso para ver este pedido.']);
            }
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['mensaje' => 'Pedido no encontrado.']);
        }
    }

    /**
     * Endpoint para actualizar el estado de un pedido (solo para administradores).
     *
     * @param int $id El ID del pedido.
     */
    public function actualizarEstadoPedido($id) {
        // Simular la obtención del usuario autenticado
        $usuario_autenticado_id = 10; // ID de un administrador
        $rol_usuario = 'administrador';

        if ($rol_usuario !== 'administrador') {
            http_response_code(403);
            echo json_encode(['mensaje' => 'Acción no autorizada.']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));
        if (!$data || !isset($data->nuevo_estado)) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Falta el nuevo estado del pedido.']);
            return;
        }

        $pedido = Pedido::findById($this->db, $id);

        if ($pedido) {
            if ($pedido->actualizarEstado($data->nuevo_estado, $usuario_autenticado_id)) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Estado del pedido actualizado correctamente.']);
            } else {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Error al actualizar el estado del pedido.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['mensaje' => 'Pedido no encontrado.']);
        }
    }
}