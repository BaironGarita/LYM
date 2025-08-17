<?php

class ProductoExtraController
{
    // GET /producto/{id}/extras
    public function index($productoId)
    {
        try {
            $response = new Response();
            $model = new ProductoExtraModel();
            $result = $model->allByProduct($productoId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST asignar extra (body: { producto_id, extra_id })
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $input = $request->getJSON();
            $model = new ProductoExtraModel();
            $ok = $model->attach($input->producto_id, $input->extra_id);
            $response->toJSON(['success' => $ok]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // DELETE quitar extra (podría recibir productoId y extraId por ruta)
    public function delete($productoId, $extraId)
    {
        try {
            $response = new Response();
            $model = new ProductoExtraModel();
            $ok = $model->detach($productoId, $extraId);
            $response->toJSON(['success' => $ok]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Opcional: listar todas las asignaciones
    public function assignments()
    {
        try {
            $response = new Response();
            $model = new ProductoExtraModel();
            $result = $model->allAssignments();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}