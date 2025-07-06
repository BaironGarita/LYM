<?php
require_once __DIR__ . '/../controllers/core/Response.php';
require_once __DIR__ . '/../models/CarritoModel.php';

class CarritoController {
    public static function get($usuario_id) {
        $model = new CarritoModel();
        $carrito = $model->getByUsuario($usuario_id);
        (new Response())->toJSON($carrito);
    }

    public static function addOrUpdate($data) {
        $model = new CarritoModel();
        $result = $model->addOrUpdate($data);
        (new Response())->toJSON($result);
    }

    public static function remove($id) {
        $model = new CarritoModel();
        $result = $model->remove($id);
        (new Response())->toJSON($result);
    }
}
