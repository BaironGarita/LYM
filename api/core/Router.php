<?php

namespace Core;

class Router
{
    private array $routes = [];
    private string $prefix = '';

    public function __construct(string $prefix = '')
    {
        $this->prefix = rtrim($prefix, '/');
    }

    public function get(string $uri, $action)    { $this->addRoute('GET', $uri, $action); }
    public function post(string $uri, $action)   { $this->addRoute('POST', $uri, $action); }
    public function put(string $uri, $action)    { $this->addRoute('PUT', $uri, $action); }
    public function delete(string $uri, $action) { $this->addRoute('DELETE', $uri, $action); }

    public function resource(string $base, string $controller)
    {
        $base = '/' . trim($base, '/');
        $this->get($base, $controller.'@index');
        $this->get($base.'/{id}', $controller.'@get');
        $this->post($base, $controller.'@create');
        $this->put($base, $controller.'@update');
        $this->put($base.'/{id}', $controller.'@update');
        $this->delete($base.'/{id}', $controller.'@delete');
    }

    private function addRoute(string $method, string $uri, $action)
    {
        $uri = '/' . ltrim($uri, '/');
        $full = $this->prefix . $uri;
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[a-zA-Z0-9_\-]+)', $full);
        $this->routes[] = [
            'method' => $method,
            'regex'  => '#^' . rtrim($pattern, '/') . '/?$#',
            'action' => $action
        ];
    }

    public function dispatch()
    {
        $reqMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        foreach ($this->routes as $route) {
            if ($reqMethod !== $route['method']) {
                continue;
            }
            if (preg_match($route['regex'], $path, $matches)) {
                $params = array_filter($matches, fn($k) => !is_int($k), ARRAY_FILTER_USE_KEY);
                return $this->runAction($route['action'], $params);
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Recurso no encontrado']);
    }

    private function runAction($action, array $params)
    {
        if (is_string($action) && str_contains($action, '@')) {
            [$controller, $method] = explode('@', $action, 2);
        } elseif (is_array($action)) {
            [$controller, $method] = $action;
        } else {
            throw new \RuntimeException('Formato de acción inválido');
        }

        $controllerFile = __DIR__ . '/../controllers/' . $controller . '.php';
        if (!class_exists($controller) && file_exists($controllerFile)) {
            require_once $controllerFile;
        }

        if (!class_exists($controller)) {
            http_response_code(500);
            echo json_encode(['error' => "Controlador no encontrado: $controller"]);
            return;
        }

        $instance = new $controller();
        if (!method_exists($instance, $method)) {
            http_response_code(500);
            echo json_encode(['error' => "Método no encontrado: $controller::$method"]);
            return;
        }

        return call_user_func_array([$instance, $method], array_values($params));
    }
}

/* --- Core / Helpers --- */
require_once __DIR__ . "/../controllers/core/Config.php";
require_once __DIR__ . "/../controllers/core/HandleException.php";
require_once __DIR__ . "/../controllers/core/Logger.php";
require_once __DIR__ . "/../controllers/core/MySqlConnect.php";
require_once __DIR__ . "/../controllers/core/Request.php";
require_once __DIR__ . "/../controllers/core/Response.php";

/* --- Modelos --- */
require_once __DIR__ . "/../models/EtiquetaModel.php";
require_once __DIR__ . "/../models/ProductoModel.php";
require_once __DIR__ . "/../models/CategoriaModel.php";
require_once __DIR__ . "/../models/DireccionModel.php";
require_once __DIR__ . "/../models/OpcionPersonalizacionModel.php";
require_once __DIR__ . "/../models/UsuarioModel.php";
require_once __DIR__ . "/../models/PromocionModel.php";
require_once __DIR__ . "/../models/ResenaModel.php";
require_once __DIR__ . "/../models/PedidoModel.php";
require_once __DIR__ . "/../models/ValoresPersonalizacionModel.php";
require_once __DIR__ . "/../models/ProductoPersonalizacionModel.php";
require_once __DIR__ . "/../models/ExtrasModel.php";
require_once __DIR__ . "/../models/ProductoExtraModel.php";

/* --- Controladores --- */
require_once __DIR__ . "/../controllers/EtiquetaController.php";
require_once __DIR__ . "/../controllers/ProductoController.php";
require_once __DIR__ . "/../controllers/CategoriaController.php";
require_once __DIR__ . "/../controllers/DireccionController.php";
require_once __DIR__ . "/../controllers/OpcionPersonalizacionController.php";
require_once __DIR__ . "/../controllers/UsuarioController.php";
require_once __DIR__ . "/../controllers/PromocionController.php";
require_once __DIR__ . "/../controllers/ResenaController.php";
require_once __DIR__ . "/../controllers/PedidoController.php";
require_once __DIR__ . "/../controllers/ValoresPersonalizacionController.php";
require_once __DIR__ . "/../controllers/ProductoPersonalizacionController.php";
require_once __DIR__ . "/../controllers/ExtrasController.php";
require_once __DIR__ . "/../controllers/ProductoExtraController.php";

/* --- Alias --- */
class_alias('EtiquetaController', 'etiqueta');
class_alias('ProductoController', 'producto');
class_alias('CategoriaController', 'categoria');
class_alias('DireccionController', 'direccion');
class_alias('OpcionPersonalizacionController', 'opcionpersonalizacion');
class_alias('UsuarioController', 'usuario');
class_alias('PromocionController', 'promocion');
class_alias('ResenaController', 'resena');
class_alias('PedidoController', 'pedido_controller');
class_alias('ValoresPersonalizacionController', 'valores_personalizacion');
class_alias('ProductoPersonalizacionController', 'producto_personalizacion');
class_alias('ExtrasController', 'extras');
class_alias('ProductoExtraController', 'producto_extra');

/* --- Rutas especiales (recomendado mover a index.php) --- */
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

if (strpos($requestUri, '/verify-images') !== false) {
    try {
        $db = new \MySqlConnect();
        $sql = "SELECT pi.*, p.nombre AS producto_nombre
                FROM producto_imagenes pi
                JOIN productos p ON pi.producto_id = p.id
                WHERE p.eliminado = 0
                ORDER BY pi.producto_id, pi.orden";
        $imagenes = $db->runQuery($sql);

        $resultado = [
            'total_imagenes' => count($imagenes),
            'imagenes' => [],
            'errores' => []
        ];

        $uploadsDir = dirname(__DIR__) . '/uploads/'; // Ajuste ruta correcta

        foreach ($imagenes as $imagen) {
            $rutaRelativa = $imagen['ruta_archivo'];
            $archivoBase = basename($rutaRelativa);
            $rutaCompleta = $uploadsDir . $archivoBase;

            $existe = file_exists($rutaCompleta);
            $tam = $existe ? filesize($rutaCompleta) : 0;

            $info = [
                'id' => $imagen['id'],
                'producto_id' => $imagen['producto_id'],
                'producto_nombre' => $imagen['producto_nombre'],
                'nombre_archivo' => $imagen['nombre_archivo'],
                'ruta_archivo' => $rutaRelativa,
                'archivo_existe' => $existe,
                'tamaño_bytes' => $tam,
                'url_acceso' => "http://localhost:81/api_lym/" . $rutaRelativa
            ];

            if (!$existe) {
                $resultado['errores'][] = "Archivo no encontrado: " . $rutaCompleta;
            }

            $resultado['imagenes'][] = $info;
        }

        header('Content-Type: application/json');
        echo json_encode($resultado, JSON_PRETTY_PRINT);
        exit;
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al verificar imágenes',
            'mensaje' => $e->getMessage()
        ]);
        exit;
    }
}

// Servir archivos de imagen (ajuste ruta base)
if (preg_match('/\/uploads\/([^\/]+\.(jpg|jpeg|png|gif|webp))$/i', $requestUri, $m)) {
    $imageName = $m[1];
    $imagePath = dirname(__DIR__) . '/uploads/' . basename($imageName);
    if (file_exists($imagePath)) {
        $ext = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
        $mime = [
            'jpg' => 'image/jpeg',
            'jpeg'=> 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp'=> 'image/webp'
        ][$ext] ?? 'application/octet-stream';

        header('Content-Type: '.$mime);
        header('Content-Length: '.filesize($imagePath));
        header('Cache-Control: max-age=86400');
        header('Last-Modified: '.gmdate('D, d M Y H:i:s \G\M\T', filemtime($imagePath)));
        readfile($imagePath);
        exit;
    }
}