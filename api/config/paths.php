<?php
// Detectar el entorno
$isXampp = strpos(__DIR__, 'xampp') !== false;
$isRepo = strpos(__DIR__, 'LYM') !== false;

if ($isXampp) {
    // Configuración para XAMPP
    define('BASE_URL', 'http://localhost/api_lym/');
    define('BASE_PATH', '/api_lym/');
} else {
    // Configuración para desarrollo desde repositorio
    define('BASE_URL', 'http://localhost/LYM/api/');
    define('BASE_PATH', '/LYM/api/');
}

// URLs de la API
define('API_URL', BASE_URL);