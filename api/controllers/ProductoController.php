<?php
/**
 * Controlador para la gestión de productos de moda
 * Basado en el README.md - Dominio de moda y accesorios
 */
class ProductoController
{
    private $model;
    private $response;

    public function __construct()
    {
        $this->model = new ProductoModel();
        $this->response = new Response();
    }

    /**
     * GET /api/productos - Obtener todos los productos
     */
    public function index()
    {
        try {
            $productos = $this->model->getAll();
            $this->response->toJSON($productos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/productos/{id} - Obtener producto por ID
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

            $producto = $this->model->get($id);
            if (!$producto) {
                $this->response->status(404)->toJSON(['error' => 'Producto no encontrado']);
                return;
            }

            $this->response->toJSON($producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /api/productos - Crear nuevo producto
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

            if (empty($data->precio)) {
                $this->response->status(400)->toJSON(['error' => 'El precio es obligatorio']);
                return;
            }

            if (empty($data->categoria_id)) {
                $this->response->status(400)->toJSON(['error' => 'La categoría es obligatoria']);
                return;
            }

            $producto = $this->model->create($data);
            $this->response->status(201)->toJSON($producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /api/productos/{id} - Actualizar producto
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

            $producto = $this->model->update($data);
            $this->response->toJSON($producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * DELETE /api/productos/{id} - Eliminar producto (soft delete)
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
                $this->response->toJSON(['message' => 'Producto eliminado correctamente']);
            } else {
                $this->response->status(404)->toJSON(['error' => 'Producto no encontrado']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/productos/categoria/{id} - Productos por categoría
     */
    public function getByCategoria()
    {
        try {
            $request = new Request();
            $categoria_id = $request->get('categoria_id');

            if (empty($categoria_id)) {
                $this->response->status(400)->toJSON(['error' => 'ID de categoría es requerido']);
                return;
            }

            $productos = $this->model->getByCategoria($categoria_id);
            $this->response->toJSON($productos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/productos/buscar - Buscar productos
     */
    public function buscar()
    {
        try {
            $request = new Request();
            $filters = [
                'q' => $request->get('q'),
                'categoria' => $request->get('categoria'),
                'precio_min' => $request->get('precio_min'),
                'precio_max' => $request->get('precio_max'),
                'etiquetas' => $request->get('etiquetas')
            ];

            $productos = $this->model->buscar($filters);
            $this->response->toJSON($productos);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
