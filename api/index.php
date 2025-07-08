<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Composer autoloader
require_once 'vendor/autoload.php';

/* Requerimientos Clases o librerías */
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";

/* Modelos */
require_once "models/EtiquetaModel.php";
require_once "models/ProductoModel.php";
require_once "models/CategoriaModel.php";
require_once "models/DireccionModel.php";
require_once "models/OpcionPersonalizacionModel.php";
require_once "models/UsuarioModel.php";
require_once "models/PromocionModel.php";

/* Controladores */
require_once "controllers/EtiquetaController.php";
require_once "controllers/ProductoController.php";
require_once "controllers/CategoriaController.php";
require_once "controllers/DireccionController.php";
require_once "controllers/OpcionPersonalizacionController.php";
require_once "controllers/UsuarioController.php";
require_once "controllers/PromocionController.php";

/* Alias para enrutador */
class_alias('EtiquetaController', 'etiqueta');
class_alias('ProductoController', 'producto');
class_alias('CategoriaController', 'categoria');
class_alias('DireccionController', 'direccion');
class_alias('OpcionPersonalizacionController', 'opcionpersonalizacion');
class_alias('UsuarioController', 'usuario');
class_alias('PromocionController', 'promocion');

/* Enrutador */
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();
