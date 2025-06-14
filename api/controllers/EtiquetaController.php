<?php
/**
 * Controlador para la gestión de etiquetas de productos de moda
 * Actualizado para el dominio de moda y accesorios según README.md
 */
class EtiquetaController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new EtiquetaModel();
        $this->response = new Response();
    }

    /**
     * GET /api/etiquetas - Obtener todas las etiquetas
     */
    public function index()
    {
        try {
            $etiquetas = $this->model->all();
            $this->response->toJSON($etiquetas);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/etiquetas/{id} - Obtener etiqueta por ID
     */
    public function get()
    {
        try {
            $id = $_GET['id'] ?? null;

            if (!$id) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $result = $this->model->get($id);

            if ($result) {
                $this->response->toJSON($result);
            } else {
                $this->response->status(404)->toJSON(['error' => 'Etiqueta no encontrada']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }    /**
         * POST /api/etiquetas - Crear nueva etiqueta
         */
    public function create()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            if (empty($inputJSON->nombre)) {
                $this->response->status(400)->toJSON(['error' => 'El nombre es obligatorio']);
                return;
            }

            $result = $this->model->create($inputJSON);
            $this->response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/etiquetas/{id} - Actualizar etiqueta
     */
    public function update()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            if (empty($inputJSON->id) || empty($inputJSON->nombre)) {
                $this->response->status(400)->toJSON(['error' => 'ID y nombre son obligatorios']);
                return;
            }

            $result = $this->model->update($inputJSON);
            $this->response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * DELETE /api/etiquetas/{id} - Eliminar etiqueta
     */
    public function delete()
    {
        try {
            $id = $_GET['id'] ?? null;

            if (!$id) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }
            $result = $this->model->delete($id);

            if ($result) {
                $this->response->toJSON(['message' => 'Etiqueta eliminada correctamente']);
            } else {
                $this->response->status(500)->toJSON(['error' => 'Error al eliminar la etiqueta']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
}