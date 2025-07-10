<?php
/**
 * Controlador para la gestión de pedidos del sistema LYM
 */
class PedidoController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new PedidoModel();
        $this->response = new Response();
    }

    /**
     * GET /api/pedidos - Obtener todos los pedidos
     */
    public function index()
    {
        try {
            $pedidos = $this->model->getAll();
            $this->response->toJSON($pedidos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/pedidos/{id} - Obtener pedido por ID
     */
    public function get()
    {
        try {
            $request = new Request();
            $id = $request->get('id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $pedido = $this->model->get($id);
            if (!$pedido) {
                $this->response->status(404)->toJSON(['error' => 'Pedido no encontrado']);
                return;
            }

            $this->response->toJSON($pedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/pedidos/usuario/{id} - Obtener pedidos por usuario
     */
    public function getByUsuario()
    {
        try {
            $request = new Request();
            $usuario_id = $request->get('usuario_id');

            if (empty($usuario_id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de usuario es requerido']);
                return;
            }

            $pedidos = $this->model->getByUsuario($usuario_id);
            $this->response->toJSON($pedidos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /api/pedidos - Crear nuevo pedido
     */
    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            // Validaciones básicas
            if (empty($data->usuario_id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de usuario es obligatorio']);
                return;
            }

            if (empty($data->direccion_envio_id)) {
                $this->response->status(400)->toJSON(['error' => 'Dirección de envío es obligatoria']);
                return;
            }

            if (empty($data->detalles) || !is_array($data->detalles)) {
                $this->response->status(400)->toJSON(['error' => 'Los detalles del pedido son obligatorios']);
                return;
            }

            $pedido = $this->model->create($data);
            $this->response->status(201)->toJSON($pedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/pedidos/{id} - Actualizar pedido
     */
    public function update()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            if (empty($data->id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $pedido = $this->model->update($data);
            $this->response->toJSON($pedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/pedidos/{id}/estado - Actualizar estado del pedido
     */
    public function updateEstado()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            if (empty($data->id) || empty($data->estado)) {
                $this->response->status(400)->toJSON(['error' => 'ID y estado son requeridos']);
                return;
            }

            $resultado = $this->model->updateEstado($data->id, $data->estado, $data->comentario ?? '');
            $this->response->toJSON($resultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/pedidos/{id}/historial - Obtener historial del pedido
     */
    public function getHistorial()
    {
        try {
            $request = new Request();
            $id = $request->get('id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $historial = $this->model->getHistorial($id);
            $this->response->toJSON($historial);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}