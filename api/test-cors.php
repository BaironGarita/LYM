<?php
// header("Access-Control-Allow-Origin: http://localhost:81");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

echo json_encode(["mensaje" => "¡CORS funcionando!"]);
