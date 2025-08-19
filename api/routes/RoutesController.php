<?php

class RoutesController
{
    private $controllers = [];

    public function __construct()
    {
        // --- Registro de controladores fusionado ---
        $this->controllers = [
            'productos' => 'ProductoController',
            'products' => 'ProductoController', // Alias
            'categorias' => 'CategoriaController',
            'etiquetas' => 'EtiquetaController',
            'promociones' => 'PromocionController',
            'extras' => 'ExtrasController',
            'producto_extras' => 'ProductoExtraController',
            'usuarios' => 'UsuarioController',
            'usuario' => 'UsuarioController', // Alias
            'direcciones' => 'DireccionController',
            'direccion' => 'DireccionController', // Alias
            'opciones' => 'OpcionPersonalizacionController',
            'valores_personalizacion' => 'ValoresPersonalizacionController',
            'producto_personalizacion' => 'ProductoPersonalizacionController',
            'carrito' => 'CarritoController',
            'resenas' => 'ResenaController',
            'resena' => 'ResenaController', // Alias
            'pedidos' => 'PedidoController',
            'pedido' => 'PedidoController'  // Alias
        ];
    }

    public function index()
    {
        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));

        // Permitir rutas con o sin prefijos como 'api', 'admin' o variantes 'api_*' (p.ej. api_lym)
        $first = strtolower($segments[0] ?? '');
        $second = strtolower($segments[1] ?? '');

        // Si el primer segmento es un prefijo conocido, usar el segundo como recurso.
        if (in_array($first, ['api', 'admin']) || preg_match('/^api_\w+$/', $first)) {
            $resource = $second;
            $offset = 1;
        } else {
            $resource = $first;
            $offset = 0;
        }

        // Manejar rutas especiales antes del enrutamiento estándar
        if ($this->handleSpecialRoutes($resource, $segments, $offset)) {
            return;
        }

        // Enrutamiento dinámico
        if (isset($this->controllers[$resource])) {
            $controllerClass = $this->controllers[$resource];

            // Caso especial para el carrito que no sigue el patrón de instancia
            if ($resource === 'carrito') {
                $this->handleCarritoRoutes();
                return;
            }

            // Patrón estándar para la mayoría de controladores
            $controller = new $controllerClass();
            $this->handleStandardRoutes($controller, $resource);
        } else {
            $this->notFound();
        }
    }

    private function handleSpecialRoutes($resource, $segments, $offset)
    {
        // --- Lógica de rutas especiales fusionada ---

        // Rutas para producto_extras
        if ($resource === 'producto_extras') {
            require_once __DIR__ . '/../controllers/ProductoExtraController.php';
            $controller = new ProductoExtraController();
            $method = $_SERVER['REQUEST_METHOD'];

            // /producto_extras/assignments
            if (isset($segments[$offset + 1]) && $segments[$offset + 1] === 'assignments') {
                if ($method === 'GET') {
                    $controller->assignments();
                    return true;
                }
            }

            // GET /producto_extras?producto_id=ID
            if ($method === 'GET' && isset($_GET['producto_id'])) {
                $productoId = (int)$_GET['producto_id'];
                $controller->index($productoId);
                return true;
            }

            // POST /producto_extras (attach)
            if ($method === 'POST') {
                $controller->create();
                return true;
            }

            // DELETE /producto_extras/{productoId}/{extraId}
            if ($method === 'DELETE' && isset($segments[$offset + 1]) && isset($segments[$offset + 2])
                && is_numeric($segments[$offset + 1]) && is_numeric($segments[$offset + 2])) {
                $productoId = (int)$segments[$offset + 1];
                $extraId = (int)$segments[$offset + 2];
                $controller->delete($productoId, $extraId);
                return true;
            }
        }

        // Endpoint para login de usuario (acepta 'usuarios' y 'usuario')
        if (($resource === 'usuarios' || $resource === 'usuario') && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'login') {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $controller = new UsuarioController();
                $controller->login();
                return true;
            }
        }

        // Endpoint para servir imágenes estáticas
        if ($resource === 'images' && isset($segments[$offset + 1])) {
            $this->serveImage($segments[$offset + 1]);
            return true;
        }

        // Endpoint para imágenes de productos
        if ($resource === 'productos' && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'imagenes') {
            $controller = new ProductoController();
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $controller->getImagenes();
            } else {
                $controller->addImagen();
            }
            return true;
        }

        // Endpoint para actualizar estado de pedido: /pedidos/{id}/estado
        if ($resource === 'pedidos' && isset($segments[$offset + 1]) && is_numeric($segments[$offset + 1]) && isset($segments[$offset + 2]) && $segments[$offset + 2] === 'estado') {
            // Solo aceptar PUT para cambio de estado
            if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
                require_once __DIR__ . '/../controllers/PedidoController.php';
                $controller = new PedidoController();
                $id = (int)$segments[$offset + 1];
                // Llamar al método que actualiza el estado pasando el ID
                $controller->actualizarEstadoPedido($id);
                return true;
            }
        }

        // Endpoint para estadísticas: /pedidos/estadisticas
        if ($resource === 'pedidos' && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'estadisticas') {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                require_once __DIR__ . '/../controllers/PedidoController.php';
                $controller = new PedidoController();
                $controller->estadisticasVentas();
                return true;
            }
        }

        return false;
    }

    private function handleStandardRoutes($controller, $resource)
    {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case 'GET':
                $this->handleGetRequest($controller, $resource);
                break;
            case 'POST':
                $controller->create();
                break;
            case 'PUT':
                $controller->update();
                break;
            case 'DELETE':
                // Capturamos el ID de la URL si existe
                $url = $_GET['url'] ?? '';
                $segments = explode('/', trim($url, '/'));
                $id = null;

                // Asumimos que el ID es el último segmento numérico de la URL
                if (count($segments) > 1 && is_numeric(end($segments))) {
                    $id = end($segments);
                }

                // Llamamos al método delete, pasándole el ID si se encontró
                $controller->delete($id);
                break;
            default:
                $this->methodNotAllowed();
                break;
        }
    }

    private function handleGetRequest($controller, $resource)
    {
        // --- Lógica GET fusionada ---
        if (isset($_GET['id'])) {
            $controller->get();
        } elseif ($resource === 'productos' && isset($_GET['categoria_id'])) {
            $controller->getByCategoria();
        } elseif ($resource === 'productos' && isset($_GET['q'])) {
            $controller->buscar();
        } elseif (($resource === 'resenas' || $resource === 'resena') && $this->hasIdInPath()) {
            $controller->get();
        } elseif (($resource === 'resenas' || $resource === 'resena') && isset($_GET['producto_id'])) {
            $controller->getByProducto();
        } else {
            $controller->index();
        }
    }

    private function loadControllerMethod($controllerName, $methodName, ...$params)
    {
        $controllerFile = __DIR__ . '/../controllers/' . $controllerName . '.php';
        if (file_exists($controllerFile)) {
            require_once $controllerFile;
            $controller = new $controllerName();
            // Llamamos al método pasando los parámetros (el ID en este caso)
            $controller->{$methodName}(...$params);
        } else {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(['error' => "Controlador no encontrado: $controllerName"]);
        }
    }

    private function hasIdInPath()
    {
        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));

        // Si hay más de un segmento y el último es numérico
        return count($segments) > 1 && is_numeric(end($segments));
    }

    private function handleCarritoRoutes()
    {
        require_once __DIR__ . '/../controllers/CarritoController.php';
        $method = $_SERVER['REQUEST_METHOD'];
        $usuario_id = $_GET['usuario_id'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($method === 'GET' && $usuario_id) {
            CarritoController::get($usuario_id);
        } elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            CarritoController::addOrUpdate($data);
        } elseif ($method === 'DELETE' && $id) {
            CarritoController::remove($id);
        } else {
            $this->methodNotAllowed();
        }
    }

    private function serveImage($imageName)
    {
        // Sanitizar el nombre del archivo
        $imageName = basename($imageName);
        
        // Construir la ruta completa del archivo
        $imagePath = __DIR__ . '/../uploads/' . $imageName;

        // Verificar que el archivo existe
        if (!file_exists($imagePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'Image not found']);
            return;
        }

        // Verificar que es realmente una imagen
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowedExtensions)) {
            http_response_code(403);
            echo json_encode(['error' => 'File type not allowed']);
            return;
        }

        // Obtener el tipo MIME
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        // Establecer headers para la imagen
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($imagePath));
        header('Cache-Control: max-age=86400'); // Cache por 24 horas
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s \G\M\T', filemtime($imagePath)));

        // Servir el archivo
        readfile($imagePath);
        exit;
    }

    private function notFound()
    {
        http_response_code(404);
        echo json_encode(["error" => "Recurso no encontrado"]);
    }

    private function methodNotAllowed()
    {
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
    }
}