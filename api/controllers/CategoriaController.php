<?php
/**
 * Controlador para la gestión de categorías de productos
 * Basado en el README.md - Dominio de moda y accesorios
 */
class CategoriaController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new CategoriaModel();
        $this->response = new Response();
    }

    /**
     * GET /api/categorias - Obtener todas las categorías
     */
    public function index()
    {
        try {
            $categorias = $this->model->getAll();
            $this->response->toJSON($categorias);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/categorias/{id} - Obtener categoría por ID
     */
    public function get()
    {
        try {
            $request = new Request();
            $id = $request->getParam('id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $categoria = $this->model->get($id);
            if (!$categoria) {
                $this->response->status(404)->toJSON(['error' => 'Categoría no encontrada']);
                return;
            }

            $this->response->toJSON($categoria);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /api/categorias - Crear nueva categoría
     */
    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getBody();

            // Validaciones
            if (empty($data->nombre)) {
                $this->response->status(400)->toJSON(['error' => 'El nombre es obligatorio']);
                return;
            }

            $categoria = $this->model->create($data);
            $this->response->status(201)->toJSON($categoria);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/categorias/{id} - Actualizar categoría
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

            $categoria = $this->model->update($data);
            $this->response->toJSON($categoria);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * DELETE /api/categorias/{id} - Eliminar categoría
     */
    public function delete()
    {
        try {
            $request = new Request();
            $id = $request->getParam('id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $result = $this->model->delete($id);
            if ($result) {
                $this->response->toJSON(['message' => 'Categoría eliminada correctamente']);
            } else {
                $this->response->status(404)->toJSON(['error' => 'Categoría no encontrada']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/categorias/{id}/productos - Obtener productos de una categoría
     */
    public function getProductos()
    {
        try {
            $request = new Request();
            $id = $request->getParam('categoria_id');

            if (empty($id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de categoría es requerido']);
                return;
            }

            $productos = $this->model->getProductos($id);
            $this->response->toJSON($productos);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
