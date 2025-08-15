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
            error_log('Productos obtenidos: ' . json_encode(is_array($productos) ? ['count' => count($productos)] : $productos));
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
            $id = $request->get('id') ?? $request->get('producto_id');

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
            // Leer datos directamente de $_POST (array)
            $data = $_POST;

            // Validaciones básicas
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

            $producto = $this->model->create($data);

            if ($producto && isset($producto['id'])) {
                // Manejo de imágenes después de crear el producto
                error_log('FILES en create: ' . print_r($_FILES, true));
                if (isset($_FILES['imagenes'])) {
                    $this->handleImageUpload($producto['id'], $_FILES['imagenes']);
                }
                // Si subieron campo 'imagen' único (nombre distinto)
                if (isset($_FILES['imagen'])) {
                    $this->handleImageUpload($producto['id'], $_FILES['imagen']);
                }

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
        error_log('handleImageUpload recibio: ' . print_r($files, true));
        if (!isset($files['name'])) {
            error_log('handleImageUpload: no hay clave name en $files');
            return;
        }

        // Normalizar single => array
        $names = is_array($files['name']) ? $files['name'] : [$files['name']];
        $tmp_names = is_array($files['tmp_name']) ? $files['tmp_name'] : [$files['tmp_name']];
        $errors = is_array($files['error']) ? $files['error'] : [$files['error']];

        // Ruta absoluta y segura a uploads
        $uploads_dir = realpath(__DIR__ . '/../uploads');
        if ($uploads_dir === false) {
            $uploads_dir = __DIR__ . '/../uploads';
            if (!is_dir($uploads_dir)) {
                mkdir($uploads_dir, 0755, true);
            }
            $uploads_dir = realpath($uploads_dir);
        }
        $uploads_dir = rtrim($uploads_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        // Reglas básicas de seguridad
        $allowed_ext = ['jpg','jpeg','png','webp','gif','avif'];
        $finfo = false;
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
        }

        foreach ($names as $key => $name) {
            $err = $errors[$key] ?? UPLOAD_ERR_NO_FILE;
            if ($err !== UPLOAD_ERR_OK) {
                error_log("Imagen índice $key ('$name') no subida. Código error: $err");
                continue;
            }

            $tmp = $tmp_names[$key] ?? null;
            if (!$tmp || !file_exists($tmp)) {
                error_log("tmp_name inválido o no existe: " . print_r($tmp, true));
                continue;
            }

            // Determinar mime/extension
            $mime = $finfo ? finfo_file($finfo, $tmp) : null;
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!$ext && $mime) {
                // intento simple para mapear algunos mime
                if ($mime === 'image/jpeg') $ext = 'jpg';
                if ($mime === 'image/png') $ext = 'png';
                if ($mime === 'image/webp') $ext = 'webp';
                if ($mime === 'image/gif') $ext = 'gif';
                if ($mime === 'image/avif') $ext = 'avif';
            }

            if (!in_array($ext, $allowed_ext, true)) {
                error_log("Extensión no permitida ($ext) para archivo $name. mime detectado: $mime");
                continue;
            }

            $nombre_archivo = uniqid('prodimg_') . ($ext ? '.' . $ext : '');
            $ruta_archivo = $uploads_dir . $nombre_archivo;
            $ruta_db = 'uploads/' . $nombre_archivo;

            // Intentar mover: move_uploaded_file (esperado) o fallback a rename/copy
            $moved = false;
            if (is_uploaded_file($tmp)) {
                $moved = @move_uploaded_file($tmp, $ruta_archivo);
            } else {
                // Fallback (por ejemplo pruebas locales): intentar copiar/renombrar
                $moved = @rename($tmp, $ruta_archivo) || @copy($tmp, $ruta_archivo);
            }

            if (!$moved) {
                $errInfo = error_get_last();
                error_log("No se pudo mover archivo temporal para $name. info: " . print_r($errInfo, true));
                continue;
            }

            // Asegurar permisos de lectura pública
            @chmod($ruta_archivo, 0644);

            // Guardar en BD usando la clave 'url_imagen' que espera el modelo
            $this->model->addImagen([
                'producto_id' => $producto_id,
                'url_imagen' => $ruta_db,
                'alt_text' => $name,
                'orden' => $key
            ]);
        }

        if ($finfo) {
            finfo_close($finfo);
        }
    }

    /**
     * PUT /api/productos/{id} - Actualizar producto
     */
    public function update()
    {
        try {
            $request = new Request();
            $data = $request->getBody(); // puede venir como objeto o array
            // El modelo normaliza internamente
            if (is_object($data) && empty($data->id)) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }
            if (is_array($data) && empty($data['id'])) {
                $this->response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }

            $producto = $this->model->update($data);
            if ($producto) {
                $this->response->toJSON($producto);
            } else {
                $this->response->status(500)->toJSON(['error' => 'No se pudo actualizar el producto']);
            }
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
            $categoria_id = $request->get('categoria_id') ?? $request->get('id');

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

            if (!isset($_FILES['imagen']) && !isset($_FILES['imagenes'])) {
                $this->response->status(400)->toJSON(['error' => 'No se envió ninguna imagen']);
                return;
            }

            // Soportar imagen única o múltiples bajo 'imagenes'
            if (isset($_FILES['imagenes'])) {
                $this->handleImageUpload($producto_id, $_FILES['imagenes']);
                $imagenes = $this->model->getImagenes($producto_id);
                $this->response->status(201)->toJSON($imagenes);
                return;
            }

            // Si se envió 'imagen' (única)
            $file = $_FILES['imagen'];
            $alt_text = $_POST['alt_text'] ?? '';
            $orden = (int)($_POST['orden'] ?? 0);
            $es_principal = (int)($_POST['es_principal'] ?? 0);

            // Validar mínimo
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $this->response->status(400)->toJSON(['error' => 'Error en la subida del archivo']);
                return;
            }

            // Validar mime/extension
            $allowed_ext = ['jpg','jpeg','png','webp','gif','avif'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $finfo_mime = function_exists('finfo_open') ? finfo_file(finfo_open(FILEINFO_MIME_TYPE), $file['tmp_name']) : null;
            if (!in_array($ext, $allowed_ext, true)) {
                $this->response->status(400)->toJSON(['error' => 'Tipo de archivo no permitido']);
                return;
            }

            $uploads_dir = realpath(__DIR__ . '/../uploads');
            if ($uploads_dir === false) {
                $uploads_dir = __DIR__ . '/../uploads';
                if (!is_dir($uploads_dir)) {
                    mkdir($uploads_dir, 0755, true);
                }
                $uploads_dir = realpath($uploads_dir);
            }
            $uploads_dir = rtrim($uploads_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

            $nombre_archivo = uniqid('prodimg_') . ($ext ? '.' . $ext : '');
            $ruta_archivo = $uploads_dir . $nombre_archivo;
            $ruta_db = 'uploads/' . $nombre_archivo;

            if (!move_uploaded_file($file['tmp_name'], $ruta_archivo)) {
                $this->response->status(500)->toJSON(['error' => 'Error al guardar la imagen']);
                return;
            }
            @chmod($ruta_archivo, 0644);

            $imagen = $this->model->addImagen([
                'producto_id' => $producto_id,
                'url_imagen' => $ruta_db,
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
