<?php
class Request
{
    public $params;
    public $reqMethod;
    public $contentType;

    public function __construct($params = [])
    {
        $this->params = $params;
        $this->reqMethod = trim($_SERVER['REQUEST_METHOD']);
        $this->contentType = !empty($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    }

    public function getBody()
    {
        $input = file_get_contents('php://input');
        
        // CORRECCIÓN: Elimina el ", true" para que devuelva un objeto.
        $data = json_decode($input);

        return $data;
    }

    public function getJSON()
    {

        $content = trim(file_get_contents("php://input"));
        $decoded = json_decode($content);

        return $decoded;
    }

    public function get($key, $default = null)
    {
        // Primero busca en los parámetros de la URL (GET)
        if (isset($_GET[$key])) {
            return $_GET[$key];
        }
        // Luego busca en POST
        if (isset($_POST[$key])) {
            return $_POST[$key];
        }
        // Si tienes parámetros personalizados en $this->params
        if (isset($this->params[$key])) {
            return $this->params[$key];
        }
        // Si no existe, retorna el valor por defecto
        return $default;
    }
}
