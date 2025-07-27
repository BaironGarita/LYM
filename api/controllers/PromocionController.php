<?php
/**
 * Controlador para la gestión de promociones.
 */
class PromocionController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new PromocionModel();
        $this->response = new Response();
    }

    /**
     * GET /api/promociones - Obtener todas las promociones
     */
    public function index()
    {
        try {
            $promociones = $this->model->getAll();
            $this->response->toJSON($promociones);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/promociones/{id} - Obtener promoción por ID
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

            $promocion = $this->model->get($id);
            if (!$promocion) {
                $this->response->status(404)->toJSON(['error' => 'Promoción no encontrada']);
                return;
            }

            $this->response->toJSON($promocion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /api/promociones - Crear nueva promoción
     */
    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            // --- INICIO DE LA CORRECCIÓN ---
            // Validar que los datos JSON se recibieron y decodificaron correctamente
            if (is_null($data)) {
                $this->response->status(400)->toJSON([
                    'error' => 'No se recibieron datos o el formato JSON es inválido.',
                    'raw_input' => file_get_contents('php://input') // Para debugging
                ]);
                return;
            }
            // --- FIN DE LA CORRECCIÓN ---

            // Validaciones mejoradas
            $errores = [];
            
            if (!isset($data->nombre) || trim($data->nombre) === '') {
                $errores[] = 'nombre';
            }
            
            if (!isset($data->tipo) || !in_array($data->tipo, ['categoria', 'producto'])) {
                $errores[] = 'tipo válido (categoria o producto)';
            } else {
                // --- INICIO DE LA CORRECCIÓN ---
                // Validar que el ID correspondiente al tipo exista
                if ($data->tipo === 'categoria' && empty($data->categoria_id)) {
                    $errores[] = 'categoria_id';
                }
                if ($data->tipo === 'producto' && empty($data->producto_id)) {
                    $errores[] = 'producto_id';
                }
                // --- FIN DE LA CORRECCIÓN ---
            }
            
            if (!isset($data->porcentaje) || !is_numeric($data->porcentaje) || $data->porcentaje <= 0) {
                $errores[] = 'porcentaje válido';
            }
            
            if (!isset($data->fecha_inicio) || trim($data->fecha_inicio) === '') {
                $errores[] = 'fecha_inicio';
            }
            
            if (!isset($data->fecha_fin) || trim($data->fecha_fin) === '') {
                $errores[] = 'fecha_fin';
            }

            if (!empty($errores)) {
                $this->response->status(400)->toJSON([
                    'error' => 'Faltan campos obligatorios: ' . implode(', ', $errores),
                    'datos_recibidos' => $data // Para debugging
                ]);
                return;
            }

            $promocion = $this->model->create($data);
            $this->response->status(201)->toJSON($promocion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/promociones/{id} - Actualizar promoción
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

            $promocion = $this->model->update($data);
            $this->response->toJSON($promocion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * DELETE /api/promociones/{id} - Eliminar promoción
     */
    public function delete()
    {
        try {
            $request = new Request();
            $id = $request->get('id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $result = $this->model->delete($id);
            if ($result) {
                $this->response->toJSON(['message' => 'Promoción eliminada correctamente']);
            } else {
                $this->response->status(404)->toJSON(['error' => 'Promoción no encontrada o no se pudo eliminar']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
}