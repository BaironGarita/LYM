<?php

require_once "models/ResenaModel.php";
require_once "controllers/core/Response.php";
require_once "controllers/core/Request.php";

class ResenaController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new ResenaModel();
        $this->response = new Response();
    }

    /**
     * Obtener todas las reseñas (para admin)
     */
    public function index()
    {
        try {
            $request = new Request();
            $limit = $request->get('limit') ? intval($request->get('limit')) : 10;
            $offset = $request->get('offset') ? intval($request->get('offset')) : 0;

            $resenas = $this->model->getAllResenas($limit, $offset);
            $this->response->toJSON($resenas);
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Obtener reseñas de un producto específico
     */
    public function getByProducto()
    {
        try {
            $request = new Request();
            $productoId = $request->get('producto_id');

            if (!$productoId) {
                $this->response->status(400)->toJSON(['error' => 'producto_id es requerido']);
                return;
            }

            $resenas = $this->model->getResenasByProducto($productoId);
            $this->response->toJSON($resenas);
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Obtener una reseña por ID (alias para show)
     */
    public function get()
    {
        $this->show();
    }

    /**
     * Obtener una reseña específica por ID
     */
    public function show()
    {
        try {
            $url = $_GET['url'] ?? '';
            $segments = explode('/', trim($url, '/'));
            $id = end($segments);

            if (!$id || !is_numeric($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de reseña inválido']);
                return;
            }

            $resena = $this->model->getResenaById($id);
            if (!$resena) {
                $this->response->status(404)->toJSON(['error' => 'Reseña no encontrada']);
                return;
            }

            $this->response->toJSON($resena);
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Crear una nueva reseña
     */
    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            // Si no hay pedido_id, usar el método simple
            if (!isset($data['pedido_id']) || empty($data['pedido_id'])) {
                return $this->createSimple();
            }

            // Validar campos requeridos para el método completo
            $requiredFields = ['usuario_id', 'producto_id', 'pedido_id', 'valoracion'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $this->response->status(400)->toJSON(['error' => "El campo $field es requerido"]);
                    return;
                }
            }

            // Validar valoración
            $valoracion = intval($data['valoracion']);
            if ($valoracion < 1 || $valoracion > 5) {
                $this->response->status(400)->toJSON(['error' => 'La valoración debe estar entre 1 y 5']);
                return;
            }

            // Verificar si el usuario puede dejar reseña
            if (!$this->model->canUserReview($data['usuario_id'], $data['producto_id'])) {
                $this->response->status(403)->toJSON(['error' => 'No puedes reseñar un producto que no has comprado']);
                return;
            }

            $comentario = isset($data['comentario']) ? $data['comentario'] : '';
            
            $result = $this->model->createResena(
                $data['usuario_id'],
                $data['producto_id'],
                $data['pedido_id'],
                $valoracion,
                $comentario
            );

            if ($result) {
                $this->response->status(201)->toJSON([
                    'message' => 'Reseña creada exitosamente',
                    'id' => $result
                ]);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al crear la reseña']);
            }
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Actualizar una reseña
     */
    public function update()
    {
        try {
            $url = $_GET['url'] ?? '';
            $segments = explode('/', trim($url, '/'));
            $id = end($segments);

            if (!$id || !is_numeric($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de reseña inválido']);
                return;
            }

            $request = new Request();
            $data = $request->getBody();

            // Validar que la reseña existe
            $resenaExistente = $this->model->getResenaById($id);
            if (!$resenaExistente) {
                $this->response->status(404)->toJSON(['error' => 'Reseña no encontrada']);
                return;
            }

            // Validar valoración si se proporciona
            if (isset($data['valoracion'])) {
                $valoracion = intval($data['valoracion']);
                if ($valoracion < 1 || $valoracion > 5) {
                    $this->response->status(400)->toJSON(['error' => 'La valoración debe estar entre 1 y 5']);
                    return;
                }
            } else {
                $valoracion = $resenaExistente['valoracion'];
            }

            $comentario = isset($data['comentario']) ? $data['comentario'] : $resenaExistente['comentario'];

            $result = $this->model->updateResena($id, $valoracion, $comentario);

            if ($result) {
                $this->response->toJSON(['message' => 'Reseña actualizada exitosamente']);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al actualizar la reseña']);
            }
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Eliminar una reseña
     */
    public function delete()
    {
        try {
            $url = $_GET['url'] ?? '';
            $segments = explode('/', trim($url, '/'));
            $id = end($segments);

            if (!$id || !is_numeric($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de reseña inválido']);
                return;
            }

            // Validar que la reseña existe
            $resenaExistente = $this->model->getResenaById($id);
            if (!$resenaExistente) {
                $this->response->status(404)->toJSON(['error' => 'Reseña no encontrada']);
                return;
            }

            $result = $this->model->deleteResena($id);

            if ($result) {
                $this->response->toJSON(['message' => 'Reseña eliminada exitosamente']);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al eliminar la reseña']);
            }
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Obtener estadísticas de reseñas de un producto
     */
    public function getStats()
    {
        try {
            $request = new Request();
            $productoId = $request->get('producto_id');

            if (!$productoId) {
                $this->response->status(400)->toJSON(['error' => 'producto_id es requerido']);
                return;
            }

            $stats = $this->model->getResenaStats($productoId);
            $this->response->toJSON($stats);
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            handleException($e);
        }
    }

    /**
     * Crear reseña simple (sin restricciones de compra)
     */
    public function createSimple()
    {
        try {
            $request = new Request();
            $data = $request->getJSON();
            
            // Convertir objeto a array para facilitar el manejo
            $data = (array) $data;

            // Validar campos requeridos
            $requiredFields = ['usuario_id', 'producto_id', 'valoracion'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $this->response->status(400)->toJSON(['error' => "El campo $field es requerido"]);
                    return;
                }
            }

            // Validar valoración
            $valoracion = intval($data['valoracion']);
            if ($valoracion < 1 || $valoracion > 5) {
                $this->response->status(400)->toJSON(['error' => 'La valoración debe estar entre 1 y 5']);
                return;
            }

            $comentario = isset($data['comentario']) ? trim($data['comentario']) : '';
            
            $result = $this->model->createResenaSimple(
                $data['usuario_id'],
                $data['producto_id'],
                $valoracion,
                $comentario
            );

            if ($result) {
                $this->response->status(201)->toJSON([
                    'success' => true,
                    'message' => 'Reseña creada exitosamente',
                    'id' => $result
                ]);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al crear la reseña']);
            }
        } catch (Exception $e) {
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
            handleException($e);
        }
    }
}
