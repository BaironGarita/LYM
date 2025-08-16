<?php 
class Config
{
    private static $config;

    public static function get($key, $default = null)
    {
        if (is_null(self::$config)) {
            // Intentar resolver la ruta absoluta a config.php correctamente
            $possible = realpath(__DIR__ . '/../../config.php');
            if ($possible && file_exists($possible)) {
                self::$config = require $possible;
            } else {
                // Fallback relativo (si el proyecto se ejecuta desde otra carpeta)
                $fallback = __DIR__ . '/../../config.php';
                if (file_exists($fallback)) {
                    self::$config = require $fallback;
                } else {
                    // Evitar errores posteriores; devolver arreglo vacío
                    self::$config = [];
                }
            }
        }

        return !empty(self::$config[$key]) ? self::$config[$key] : $default;
    }
}
