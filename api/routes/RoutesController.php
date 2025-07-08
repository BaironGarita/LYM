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
            'carrito' => 'CarritoController'
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
        } else {
            $controller->index();
        }
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
