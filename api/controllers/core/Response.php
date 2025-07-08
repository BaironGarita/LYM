<?php

class Response
{
    private $status = 200;

    public function status(int $code)
    {
        $this->status = $code;
        return $this;
    }
    public function toJSON($data)
{
    if (headers_sent()) {
        error_log("⚠️ Headers ya enviados antes de toJSON");
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ['http://localhost:5173', 'http://localhost:5174'])) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: http://localhost:5173");
    }
    header("Content-Type: application/json");
    echo json_encode($data);
}

/*    public function toJSON($response = [],$message="")
    {
        
        //Verificar respuesta
        if (isset($response) && !empty($response)) {
            $json = $response;
        } else {
            $this->status =400;
            $json =  $message ?? "No se efectuo la solicitud";
        }
        //Escribir respuesta JSON con código de estado HTTP
        echo json_encode(
            $json,
            http_response_code($this->status)
        );
    } */
}
