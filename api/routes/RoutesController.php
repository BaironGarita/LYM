<?php
class RoutesController
{
    private $authMiddleware;
    private $protectedRoutes = [];

    public function __construct()
    {
        //$this->authMiddleware = new AuthMiddleware();
        $this->registerRoutes();
        $this->routes();
    }

    private function registerRoutes()
    {
        // ============ RUTAS PARA DOMINIO DE MODA - LYM ============

        // Rutas para Etiquetas
        $this->addProtectedRoute('GET', '/api/etiquetas', 'etiqueta', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api/etiquetas/get', 'etiqueta', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api/etiquetas/create', 'etiqueta', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api/etiquetas/update', 'etiqueta', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api/etiquetas/delete', 'etiqueta', 'delete', ['Administrador']);

        // Rutas para Productos
        $this->addProtectedRoute('GET', '/api/productos', 'producto', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api/productos/get', 'producto', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api/productos/create', 'producto', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api/productos/update', 'producto', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api/productos/delete', 'producto', 'delete', ['Administrador']);
        $this->addProtectedRoute('GET', '/api/productos/categoria', 'producto', 'getByCategoria', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api/productos/buscar', 'producto', 'buscar', ['Administrador', 'Cliente']);

        // Rutas para Categorías
        $this->addProtectedRoute('GET', '/api/categorias', 'categoria', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api/categorias/get', 'categoria', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api/categorias/create', 'categoria', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api/categorias/update', 'categoria', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api/categorias/delete', 'categoria', 'delete', ['Administrador']);
        $this->addProtectedRoute('GET', '/api/categorias/productos', 'categoria', 'getProductos', ['Administrador', 'Cliente']);

        // ============ RUTAS LEGACY (MANTENER TEMPORALMENTE) ============
        // Rutas antiguas de películas - DEPRECATED
        $this->addProtectedRoute('GET', '/apimovie/actor', 'actor', 'index', ['Administrador']);
        $this->addProtectedRoute('GET', '/apimovie/etiqueta', 'etiqueta', 'index', ['Administrador']);
        $this->addProtectedRoute('GET', '/apimovie/etiqueta/get', 'etiqueta', 'get', ['Administrador']);
        $this->addProtectedRoute('POST', '/apimovie/etiqueta/create', 'etiqueta', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/apimovie/etiqueta/update', 'etiqueta', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/apimovie/etiqueta/delete', 'etiqueta', 'delete', ['Administrador']);
    }

    public function routes()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = strtolower($_SERVER['REQUEST_URI']);

        // Si la ruta es protegida, aplicar autenticación
        if ($this->isProtectedRoute($method, $path)) {
            $route = $this->protectedRoutes["$method:$path"];
            //Verifica los roles autorizados con los del usuario del token
            if (!$this->authMiddleware->handle($route['requiredRole'])) {
                return;
            }

        }
    }

    private function addProtectedRoute($method, $path, $controllerName, $action, $requiredRole)
    {
        $this->protectedRoutes["$method:$path"] = [
            'controller' => $controllerName,
            'action' => $action,
            'requiredRole' => $requiredRole
        ];
    }

    private function isProtectedRoute($method, $path)
    {
        return isset($this->protectedRoutes["$method:$path"]);
    }
    public function index()
    {
        //include "routes/routes.php";
        if (isset($_SERVER['REQUEST_URI']) && !empty($_SERVER['REQUEST_URI'])) {
            //Gestion de imagenes
            if (strpos($_SERVER['REQUEST_URI'], '/uploads/') === 0) {
                $filePath = __DIR__ . $_SERVER['REQUEST_URI'];

                // Verificar si el archivo existe
                if (file_exists($filePath)) {
                    header('Content-Type: ' . mime_content_type($filePath));
                    readfile($filePath);
                    exit;
                } else {
                    http_response_code(404);
                    echo 'Archivo no encontrado.';
                }
            }
            //FIN Gestion de imagenes
            //Solicitud preflight
            if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
                // Terminar la solicitud de preflight
                http_response_code(200);
                exit();
            }
            $routesArray = explode("/", $_SERVER['REQUEST_URI']);
            // Eliminar elementos vacíos del array
            $routesArray = array_filter($routesArray);

            if (count($routesArray) < 2) {
                $json = array(
                    'status' => 404,
                    'result' => 'Controlador no especificado'
                );
                echo json_encode($json, http_response_code($json["status"]));
                return;
            }

            if (isset($_SERVER['REQUEST_METHOD'])) {
                $controller = $routesArray[2] ?? null;
                $action = $routesArray[3] ?? null;
                $param1 = $routesArray[4] ?? null;
                $param2 = $routesArray[5] ?? null;
                if ($controller) {
                    try {
                        if (class_exists($controller)) {
                            $response = new $controller();
                            switch ($_SERVER['REQUEST_METHOD']) {
                                case 'GET':
                                    if ($param1 && $param2) {
                                        $response->$action($param1, $param2);
                                    } elseif ($param1 && !isset($action)) {
                                        $response->get($param1);
                                    } elseif ($param1 && isset($action)) {
                                        $response->$action($param1);
                                    } elseif (!isset($action)) {
                                        $response->index();
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } elseif (count($routesArray) == 3) {
                                            $response->get($action);
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        // Llamar a la acción index si no hay acción ni parámetro
                                        $response->index();
                                    }
                                    break;

                                case 'POST':
                                    if ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->create();
                                    }
                                    break;

                                case 'PUT':
                                case 'PATCH':
                                    if ($param1) {
                                        $response->update($param1);
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->update();
                                    }
                                    break;

                                case 'DELETE':
                                    if ($param1) {
                                        $response->delete($param1);
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->delete();
                                    }
                                    break;

                                default:
                                    $json = array(
                                        'status' => 405,
                                        'result' => 'Método HTTP no permitido'
                                    );
                                    echo json_encode($json, http_response_code($json["status"]));
                                    break;
                            }
                        } else {
                            $json = array(
                                'status' => 404,
                                'result' => 'Controlador no encontrado'
                            );
                            echo json_encode($json, http_response_code($json["status"]));
                        }
                    } catch (\Throwable $th) {
                        $json = array(
                            'status' => 404,
                            'result' => $th->getMessage()
                        );
                        echo json_encode($json, http_response_code($json["status"]));
                    }
                } else {
                    $json = array(
                        'status' => 404,
                        'result' => 'Controlador o acción no especificados'
                    );
                    echo json_encode($json, http_response_code($json["status"]));
                }
            }
        }
    }
}
