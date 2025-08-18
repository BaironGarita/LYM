<?php

// Configuración de errores para desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- Configuración de CORS ---
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177',
    'http://127.0.0.1:5178',
    'http://127.0.0.1:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback para otros entornos si es necesario
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// --- Manejo de Solicitudes Preflight (OPTIONS) ---
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// Composer autoloader
require_once 'vendor/autoload.php';

/* --- Requerimientos de Clases o Librerías --- */
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";

/* --- Modelos --- */
require_once "models/EtiquetaModel.php";
require_once "models/ProductoModel.php";
require_once "models/CategoriaModel.php";
require_once "models/DireccionModel.php";
require_once "models/OpcionPersonalizacionModel.php";
require_once "models/UsuarioModel.php";
require_once "models/PromocionModel.php";
require_once "models/ResenaModel.php";
require_once "models/PedidoModel.php";
require_once "models/ValoresPersonalizacionModel.php";
require_once "models/ProductoPersonalizacionModel.php";

require_once "models/ProductoExtraModel.php";
require_once "models/ExtrasModel.php";

/* --- Controladores --- */
require_once "controllers/EtiquetaController.php";
require_once "controllers/ProductoController.php";
require_once "controllers/CategoriaController.php";
require_once "controllers/DireccionController.php";
require_once "controllers/OpcionPersonalizacionController.php";
require_once "controllers/UsuarioController.php";
require_once "controllers/PromocionController.php";
require_once "controllers/ResenaController.php";
require_once "controllers/PedidoController.php";
require_once "controllers/ValoresPersonalizacionController.php";
require_once "controllers/ProductoPersonalizacionController.php";
require_once "controllers/ProductoExtraController.php";
require_once "controllers/ExtrasController.php";

/* --- Alias para el enrutador --- */
class_alias('EtiquetaController', 'etiqueta');
class_alias('ProductoController', 'producto');
class_alias('CategoriaController', 'categoria');
class_alias('DireccionController', 'direccion');
class_alias('OpcionPersonalizacionController', 'opcionpersonalizacion');
class_alias('UsuarioController', 'usuario');
class_alias('PromocionController', 'promocion');
class_alias('ResenaController', 'resena');
// Evitar colisión con la clase modelo `Pedido` (nombre de clase insensible a mayúsculas).
// Usamos un alias diferente para el controlador.
class_alias('PedidoController', 'pedido_controller');
class_alias('ValoresPersonalizacionController', 'valores_personalizacion');
class_alias('ProductoPersonalizacionController', 'producto_personalizacion');

/* --- Manejo de rutas especiales antes del enrutador --- */
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

// Endpoint para verificar imágenes
if (strpos($requestUri, '/verify-images') !== false) {
    try {
        $config = require_once 'config.php';

        $conn = new PDO(
            "mysql:host={$config['DB_HOST']};dbname={$config['DB_DBNAME']}",
            $config['DB_USERNAME'],
            $config['DB_PASSWORD']
        );
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT pi.*, p.nombre as producto_nombre 
                FROM producto_imagenes pi 
                JOIN productos p ON pi.producto_id = p.id 
                WHERE p.eliminado = 0
                ORDER BY pi.producto_id, pi.orden";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $resultado = [
            'total_imagenes' => count($imagenes),
            'imagenes' => [],
            'errores' => []
        ];

        foreach ($imagenes as $imagen) {
            $rutaCompleta = __DIR__ . '/uploads/' . basename($imagen['ruta_archivo']);
            $existe = file_exists($rutaCompleta);
            $tamaño = $existe ? filesize($rutaCompleta) : 0;

            $info = [
                'id' => $imagen['id'],
                'producto_id' => $imagen['producto_id'],
                'producto_nombre' => $imagen['producto_nombre'],
                'nombre_archivo' => $imagen['nombre_archivo'],
                'ruta_archivo' => $imagen['ruta_archivo'],
                'archivo_existe' => $existe,
                'tamaño_bytes' => $tamaño,
                'url_acceso' => "http://localhost:81/api_lym/" . $imagen['ruta_archivo']
            ];

            if (!$existe) {
                $resultado['errores'][] = "Archivo no encontrado: " . $rutaCompleta;
            }

            $resultado['imagenes'][] = $info;
        }

        header('Content-Type: application/json');
        echo json_encode($resultado, JSON_PRETTY_PRINT);
        exit;

    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Error al verificar imágenes',
            'mensaje' => $e->getMessage()
        ]);
        exit;
    }
}

// Servir archivos de imagen directamente
if (preg_match('/\/uploads\/([^\/]+\.(jpg|jpeg|png|gif|webp))$/i', $requestUri, $matches)) {
    $imageName = $matches[1];
    $imagePath = __DIR__ . '/uploads/' . basename($imageName);

    if (file_exists($imagePath)) {
        $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
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
}

/* --- Enrutador Principal --- */
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();