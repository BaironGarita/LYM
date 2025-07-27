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
            error_log('Entrando a index de ProductoController');
            $productos = $this->model->getAll();
            $this->response->toJSON($productos);
            error_log('Productos obtenidos: ' . json_encode($productos));
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
            // 1. Leer los datos directamente de $_POST. Esta es la corrección clave.
            $data = $_POST;

            // 2. Realizar las validaciones sobre el array $data
            if (empty($data['nombre'])) {
                $this->response->status(400)->toJSON(['error' => 'El nombre es obligatorio']);
                return;
            }

            if (empty($data['precio'])) {
                $this->response->status(400)->toJSON(['error' => 'El precio es obligatorio']);
                return;
            }

            if (empty($data['categoria_id'])) {
                $this->response->status(400)->toJSON(['error' => 'La categoría es obligatoria']);
                return;
            }

            // 3. El modelo ahora recibe el array de datos.
            // Asegúrate que tu modelo espera un array ($datos['nombre']) en lugar de un objeto ($datos->nombre).
            $producto = $this->model->create($data);

            if ($producto && isset($producto['id'])) {
                // 4. Manejo de la subida de imágenes DESPUÉS de crear el producto
                if (isset($_FILES['imagenes'])) {
                    // Lógica para manejar múltiples imágenes
                    $this->handleImageUpload($producto['id'], $_FILES['imagenes']);
                }
                
                // Devolver el producto completo recién creado
                $productoCompleto = $this->model->get($producto['id']);
                $this->response->status(201)->toJSON($productoCompleto);

            } else {
                $this->response->status(500)->toJSON(['error' => 'No se pudo crear el producto en la base de datos.']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function handleImageUpload($producto_id, $files) {
        // Reutiliza la lógica de la función addImagen que ya tienes
        // Itera sobre el array de archivos si se suben múltiples
        foreach ($files['name'] as $key => $name) {
            if ($files['error'][$key] === UPLOAD_ERR_OK) {
                $uploads_dir = __DIR__ . '/../uploads/';
                if (!is_dir($uploads_dir)) {
                    mkdir($uploads_dir, 0777, true);
                }
                $tmp_name = $files['tmp_name'][$key];
                $ext = pathinfo($name, PATHINFO_EXTENSION);
                $nombre_archivo = uniqid('prodimg_') . '.' . $ext;
                $ruta_archivo = $uploads_dir . $nombre_archivo;
                $ruta_db = 'uploads/' . $nombre_archivo;

                if (move_uploaded_file($tmp_name, $ruta_archivo)) {
                    $this->model->addImagen([
                        'producto_id' => $producto_id,
                        'url_imagen' => $ruta_db,
                        'alt_text' => $name,
                        'orden' => $key
                    ]);
                }
            }
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
    public function delete($id)
    {
        try {
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

    /**
     * POST /api/productos/{id}/imagenes - Subir imagen para un producto
     */
    public function addImagen()
    {
        try {
            error_log('FILES: ' . print_r($_FILES, true));
            error_log('POST: ' . print_r($_POST, true));
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                $this->response->status(405)->toJSON(['error' => 'Método no permitido']);
                return;
            }
            $producto_id = $_POST['producto_id'] ?? null;
            if (!$producto_id) {
                $this->response->status(400)->toJSON(['error' => 'producto_id es requerido']);
                return;
            }
            if (!isset($_FILES['imagen'])) {
                $this->response->status(400)->toJSON(['error' => 'No se envió ninguna imagen']);
                return;
            }
            $file = $_FILES['imagen'];
            $alt_text = $_POST['alt_text'] ?? '';
            $orden = $_POST['orden'] ?? 1;
            $es_principal = $_POST['es_principal'] ?? 0;

            // Validar y mover archivo
            $uploads_dir = __DIR__ . '/../uploads/';
            if (!is_dir($uploads_dir)) {
                mkdir($uploads_dir, 0777, true);
            }
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $nombre_archivo = uniqid('prodimg_') . '.' . $ext;
            $ruta_archivo = $uploads_dir . $nombre_archivo;
            $ruta_db = 'uploads/' . $nombre_archivo;

            if (!move_uploaded_file($file['tmp_name'], $ruta_archivo)) {
                $this->response->status(500)->toJSON(['error' => 'Error al guardar la imagen']);
                return;
            }

            $imagen = $this->model->addImagen([
                'producto_id' => $producto_id,
                'nombre_archivo' => $nombre_archivo,
                'ruta_archivo' => $ruta_db,
                'alt_text' => $alt_text,
                'orden' => $orden,
                'es_principal' => $es_principal
            ]);
            $this->response->status(201)->toJSON($imagen);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /api/productos/{id}/imagenes - Obtener imágenes de un producto
     */
    public function getImagenes()
    {
        try {
            $request = new Request();
            $producto_id = $request->get('producto_id') ?? $request->get('id');
            if (!$producto_id) {
                $this->response->status(400)->toJSON(['error' => 'producto_id es requerido']);
                return;
            }
            $imagenes = $this->model->getImagenes($producto_id);
            $this->response->toJSON($imagenes);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
