<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";


/***--- Agregar todos los modelos*/
require_once "models/EtiquetaModel.php";
require_once "models/ProductoModel.php";
require_once "models/CategoriaModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/EtiquetaController.php";
require_once "controllers/ProductoController.php";
require_once "controllers/CategoriaController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Router básico
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Limpiar URI
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api/', '', $path);

try {
    // Rutas para etiquetas
    if (preg_match('/^etiqueta$/', $path) && $requestMethod === 'GET') {
        $controller = new EtiquetaController();
        $controller->index();
    } elseif (preg_match('/^etiqueta\/create$/', $path) && $requestMethod === 'POST') {
        $controller = new EtiquetaController();
        $controller->create();
    } elseif (preg_match('/^etiqueta\/get$/', $path) && $requestMethod === 'GET') {
        $controller = new EtiquetaController();
        $controller->get();
    } elseif (preg_match('/^etiqueta\/update$/', $path) && $requestMethod === 'PUT') {
        $controller = new EtiquetaController();
        $controller->update();
    } elseif (preg_match('/^etiqueta\/delete$/', $path) && $requestMethod === 'DELETE') {
        $controller = new EtiquetaController();
        $controller->delete();
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}


