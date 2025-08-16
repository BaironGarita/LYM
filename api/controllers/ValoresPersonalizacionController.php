<?php
class ValoresPersonalizacionController
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new ValoresPersonalizacionModel();
            $result = $model->getByOpcion($_GET['opcion_id'] ?? null);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new ValoresPersonalizacionModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getJSON();
            $model = new ValoresPersonalizacionModel();
            $result = $model->create($data);
            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $data = $request->getJSON();
            $model = new ValoresPersonalizacionModel();
            $result = $model->update($data);
            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $model = new ValoresPersonalizacionModel();
            $result = $model->delete($id);
            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
