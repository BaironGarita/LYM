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

            // Validaciones básicas
            if (empty($data->nombre) || empty($data->tipo) || empty($data->porcentaje) || empty($data->fecha_inicio) || empty($data->fecha_fin)) {
                $this->response->status(400)->toJSON(['error' => 'Faltan campos obligatorios: nombre, tipo, porcentaje, fecha_inicio, fecha_fin.']);
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