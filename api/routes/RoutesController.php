<?php

class RoutesController
{
    private $controllers = [];
    
    public function __construct()
    {
        // Auto-registro de controladores disponibles
        $this->controllers = [
            'productos' => 'ProductoController',
            'products' => 'ProductoController',
            'categorias' => 'CategoriaController',
            'etiquetas' => 'EtiquetaController',
            'promociones' => 'PromocionController',
            'usuarios' => 'UsuarioController',
            'usuario' => 'UsuarioController',
            'direcciones' => 'DireccionController',
            'direccion' => 'DireccionController',
            'opciones' => 'OpcionPersonalizacionController',
            'carrito' => 'CarritoController',
            'resenas' => 'ResenaController',
            'resena' => 'ResenaController'
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

        // Manejar rutas especiales antes del switch
        if ($this->handleSpecialRoutes($resource, $segments, $offset)) {
            return;
        }

        // Enrutamiento dinámico
        if (isset($this->controllers[$resource])) {
            $controllerClass = $this->controllers[$resource];
            
            // Casos especiales que no siguen el patrón estándar
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
        // Lógica específica para diferentes tipos de GET
        if (isset($_GET['id'])) {
            $controller->get();
        } elseif ($resource === 'productos' && isset($_GET['categoria_id'])) {
            $controller->getByCategoria();
        } elseif ($resource === 'productos' && isset($_GET['q'])) {
            $controller->buscar();
        } elseif ($resource === 'resenas' && $this->hasIdInPath()) {
            $controller->get();
        } elseif ($resource === 'resenas' && isset($_GET['producto_id'])) {
            $controller->getByProducto();
        } else {
            $controller->index();
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