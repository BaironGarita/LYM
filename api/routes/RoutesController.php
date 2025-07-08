<?php

class RoutesController
{
    public function index()
    {
        error_log("👀 Llamó a ProductoController::index");

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

        // MOVER ESTA LÓGICA ANTES DEL SWITCH PARA EVITAR RESPUESTAS DOBLES
        // Endpoint para obtener imágenes de un producto: /productos/imagenes?producto_id=ID
        if ($resource === 'productos' && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'imagenes' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller = new ProductoController();
            $controller->getImagenes();
            return;
        }

        if ($resource === 'productos' && isset($segments[$offset + 1]) && $segments[$offset + 1] === 'imagenes') {
            $controller = new ProductoController();
            $controller->addImagen();
            return; // IMPORTANTE: Detener ejecución para evitar doble respuesta
        }

        switch ($resource) {
            case 'productos':
            case 'products': // Permitir también la ruta en inglés
                $controller = new ProductoController();
                $this->handleProductoRoutes($controller);
                break;
            case 'carrito':
                require_once __DIR__ . '/../controllers/CarritoController.php';
                $this->handleCarritoRoutes();
                break;
            case 'categorias':
                $controller = new CategoriaController();
                $this->handleCategoriaRoutes($controller);
                break;
            case 'etiquetas':
                $controller = new EtiquetaController();
                $this->handleEtiquetaRoutes($controller);
                break;
            case 'promociones':
                $controller = new PromocionController();
                $this->handlePromocionRoutes($controller);
                break;
            default:
                $this->notFound();
                break;
        }
    }

    private function handleProductoRoutes($controller)
    {
        error_log("✅ Entró a handleProductoRoutes");
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            if (isset($_GET['id'])) {
                $controller->get();
            } elseif (isset($_GET['categoria_id'])) {
                $controller->getByCategoria();
            } elseif (isset($_GET['q'])) {
                $controller->buscar();
            } else {
                $controller->index();
            }
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT') {
            $controller->update();
        } elseif ($method === 'DELETE') {
            $controller->delete();
        } else {
            $this->methodNotAllowed();
        }
    }

    private function handleCarritoRoutes()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $segments = explode('/', trim($_GET['url'] ?? '', '/'));
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

    private function handleCategoriaRoutes($controller)
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            if (isset($_GET['id'])) {
                $controller->get();
            } else {
                $controller->index();
            }
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT') {
            $controller->update();
        } elseif ($method === 'DELETE') {
            $controller->delete();
        } else {
            $this->methodNotAllowed();
        }
    }

    private function handleEtiquetaRoutes($controller)
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            if (isset($_GET['id'])) {
                $controller->get();
            } else {
                $controller->index();
            }
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT') {
            $controller->update();
        } elseif ($method === 'DELETE') {
            $controller->delete();
        } else {
            $this->methodNotAllowed();
        }
    }

    private function handlePromocionRoutes($controller)
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            if (isset($_GET['id'])) {
                $controller->get();
            } else {
                $controller->index();
            }
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT') {
            $controller->update();
        } elseif ($method === 'DELETE') {
            $controller->delete();
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
