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
            'usuarios' => 'UsuarioController',
            'usuario' => 'UsuarioController', // Alias
            'direcciones' => 'DireccionController',
            'direccion' => 'DireccionController', // Alias
            'opciones' => 'OpcionPersonalizacionController',
            'carrito' => 'CarritoController',
            'resenas' => 'ResenaController', // Del primer archivo
            'resena' => 'ResenaController', // Alias del primer archivo
            'pedidos' => 'PedidoController', // Del segundo archivo
            'pedido' => 'PedidoController'  // Alias del segundo archivo
        ];
    }

    public function index()
    {
        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));

        // Permitir rutas con o sin el prefijo 'api'
        $first = strtolower($segments[0] ?? '');
        $second = strtolower($segments[1] ?? '');

        if ($first === 'api') {
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

        // Endpoint para login de usuario (acepta 'usuarios' y 'usuario')
        if (($resource === 'usuarios' || $resource === 'usuario') && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'login') {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $controller = new UsuarioController();
                $controller->login();
                return true;
            }
        }

        // Endpoint para servir imágenes estáticas (del primer archivo)
        if ($resource === 'images' && isset($segments[$offset + 1])) {
            $this->serveImage($segments[$offset + 1]);
            return true;
        }

        // Endpoint para imágenes de productos (lógica idéntica en ambos)
        if ($resource === 'productos' && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'imagenes') {
            $controller = new ProductoController();
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $controller->getImagenes();
            } else {
                $controller->addImagen();
            }
            return true;
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
                $controller->delete();
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
        } elseif (($resource === 'resenas' || $resource === 'resena') && $this->hasIdInPath()) { // Lógica para reseñas por ID en URL
            $controller->get();
        } elseif (($resource === 'resenas' || $resource === 'resena') && isset($_GET['producto_id'])) { // Lógica para reseñas por producto
            $controller->getByProducto();
        } else {
            $controller->index();
        }
    }

    // Método auxiliar del primer archivo, necesario para `handleGetRequest`
    private function hasIdInPath()
    {
        $url = $_GET['url'] ?? '';
        $segments = explode('/', trim($url, '/'));

        // Si hay más de un segmento y el último es numérico
        return count($segments) > 1 && is_numeric(end($segments));
    }

    private function handleCarritoRoutes()
    {
        // Esta función era idéntica en ambos archivos
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

    // Método para servir imágenes del primer archivo
    private function serveImage($imageName)
    {
        $imageName = basename($imageName);
        $imagePath = __DIR__ . '/../uploads/' . $imageName;

        if (!file_exists($imagePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'Image not found']);
            return;
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowedExtensions)) {
            http_response_code(403);
            echo json_encode(['error' => 'File type not allowed']);
            return;
        }

        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($imagePath));
        header('Cache-Control: max-age=86400');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s \G\M\T', filemtime($imagePath)));

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