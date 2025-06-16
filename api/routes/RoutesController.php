<?php
class RoutesController
{
    private $authMiddleware;
    private $protectedRoutes = [];

    public function __construct()
    {
        // Comentar temporalmente la autenticación
        // $this->authMiddleware = new AuthMiddleware();
        //$this->registerRoutes();
        $this->routes();
    }
    private function registerRoutes()
    {
        // ============ RUTAS PARA DOMINIO DE MODA - LYM ============

        // Rutas para Etiquetas
        $this->addProtectedRoute('GET', '/api_lym/etiquetas', 'etiqueta', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api_lym/etiquetas/get', 'etiqueta', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api_lym/etiquetas/create', 'etiqueta', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api_lym/etiquetas/update', 'etiqueta', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api_lym/etiquetas/delete', 'etiqueta', 'delete', ['Administrador']);

        // Rutas para Productos
        $this->addProtectedRoute('GET', '/api_lym/productos', 'producto', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api_lym/productos/get', 'producto', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api_lym/productos/create', 'producto', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api_lym/productos/update', 'producto', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api_lym/productos/delete', 'producto', 'delete', ['Administrador']);
        $this->addProtectedRoute('GET', '/api_lym/productos/categoria', 'producto', 'getByCategoria', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api_lym/productos/buscar', 'producto', 'buscar', ['Administrador', 'Cliente']);

        // Rutas para Categorías
        $this->addProtectedRoute('GET', '/api_lym/categorias', 'categoria', 'index', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('GET', '/api_lym/categorias/get', 'categoria', 'get', ['Administrador', 'Cliente']);
        $this->addProtectedRoute('POST', '/api_lym/categorias/create', 'categoria', 'create', ['Administrador']);
        $this->addProtectedRoute('PUT', '/api_lym/categorias/update', 'categoria', 'update', ['Administrador']);
        $this->addProtectedRoute('DELETE', '/api_lym/categorias/delete', 'categoria', 'delete', ['Administrador']);
        $this->addProtectedRoute('GET', '/api_lym/categorias/productos', 'categoria', 'getProductos', ['Administrador', 'Cliente']);

    }

    public function routes()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = strtolower($_SERVER['REQUEST_URI']);

        // Comentar temporalmente la verificación de rutas protegidas
        /*
        if ($this->isProtectedRoute($method, $path)) {
            $route = $this->protectedRoutes["$method:$path"];
            if(!$this->authMiddleware->handle($route['requiredRole'])){
                return;
            }
        }
        */
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
                        // Convertir el nombre del controlador al formato correcto
                        $controllerClass = ucfirst($controller) . 'Controller';

                        if (class_exists($controllerClass)) {
                            $response = new $controllerClass();
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
                                'result' => 'Controlador no encontrado: ' . $controllerClass
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
