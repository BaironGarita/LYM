<?php

require_once "models/ResenaModel.php";
require_once "models/UsuarioModel.php";
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
            $limit = $request->get('limit') ? intval($request->get('limit')) : 50; // Aumentar límite por defecto
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
            if (!isset($data->pedido_id) || empty($data->pedido_id)) {
                return $this->createSimple();
            }

            // Validar campos requeridos para el método completo
            $requiredFields = ['usuario_id', 'producto_id', 'pedido_id', 'valoracion'];
            foreach ($requiredFields as $field) {
                if (!isset($data->$field) || empty($data->$field)) {
                    $this->response->status(400)->toJSON(['error' => "El campo $field es requerido"]);
                    return;
                }
            }

            // Validar valoración
            $valoracion = intval($data->valoracion);
            if ($valoracion < 1 || $valoracion > 5) {
                $this->response->status(400)->toJSON(['error' => 'La valoración debe estar entre 1 y 5']);
                return;
            }

            // Verificar si el usuario puede dejar reseña
            if (!$this->model->canUserReview($data->usuario_id, $data->producto_id)) {
                $this->response->status(403)->toJSON(['error' => 'No puedes reseñar un producto que no has comprado']);
                return;
            }

            $comentario = isset($data->comentario) ? $data->comentario : '';
            
            $result = $this->model->createResena(
                $data->usuario_id,
                $data->producto_id,
                $data->pedido_id,
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
            


            // Validar campos requeridos
            $requiredFields = ['usuario_id', 'producto_id', 'valoracion', 'comentario'];
            foreach ($requiredFields as $field) {
                if (!isset($data->$field) || 
                    (is_string($data->$field) && trim($data->$field) === '') ||
                    (is_numeric($data->$field) && $data->$field <= 0)) {
                    $this->response->status(400)->toJSON(['error' => "El campo $field es requerido y debe tener un valor válido"]);
                    return;
                }
            }

            // Validar que el usuario exists y está activo
            $usuarioModel = new UsuarioModel();
            $usuario = $usuarioModel->get(intval($data->usuario_id));
            if (!$usuario) {
                $this->response->status(401)->toJSON(['error' => 'Usuario no encontrado']);
                return;
            }

            // Verificar que el usuario tiene un nombre válido
            $usuarioNombre = '';
            if (is_array($usuario) && isset($usuario['nombre'])) {
                $usuarioNombre = trim($usuario['nombre']);
            } elseif (is_object($usuario) && isset($usuario->nombre)) {
                $usuarioNombre = trim($usuario->nombre);
            }
            
            if (empty($usuarioNombre)) {
                $this->response->status(401)->toJSON(['error' => 'Usuario sin nombre válido']);
                return;
            }

            // Validar valoración
            $valoracion = intval($data->valoracion);
            if ($valoracion < 1 || $valoracion > 5) {
                $this->response->status(400)->toJSON(['error' => 'La valoración debe estar entre 1 y 5']);
                return;
            }

            $comentario = trim($data->comentario);
            
            // Validar que el comentario no esté vacío después del trim
            if (empty($comentario) || strlen($comentario) < 3) {
                $this->response->status(400)->toJSON(['error' => 'El comentario debe tener al menos 3 caracteres']);
                return;
            }
            
            $result = $this->model->createResenaSimple(
                intval($data->usuario_id),
                intval($data->producto_id),
                $valoracion,
                $comentario
            );

            if ($result) {
                // Obtener la reseña completa que se acaba de crear
                $nuevaResena = $this->model->getResenaById($result);
                
                // Validar que la reseña se creó correctamente con todos los datos
                if (!$nuevaResena || 
                    !isset($nuevaResena['nombre_usuario']) || 
                    trim($nuevaResena['nombre_usuario']) === '' ||
                    !isset($nuevaResena['comentario']) ||
                    trim($nuevaResena['comentario']) === '') {
                    $this->response->status(500)->toJSON(['error' => 'Error: La reseña se creó pero con datos incompletos']);
                    return;
                }
                
                $this->response->status(201)->toJSON([
                    'success' => true,
                    'message' => 'Reseña creada exitosamente',
                    'id' => $result,
                    'resena' => $nuevaResena
                ]);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al crear la reseña en la base de datos']);
            }
        } catch (Exception $e) {
            error_log("Error completo en createSimple: " . $e->getMessage() . " - " . $e->getTraceAsString());
            $this->response->status(500)->toJSON(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
            handleException($e);
        }
    }
}
