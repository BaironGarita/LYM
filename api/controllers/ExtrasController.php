<?php
class ExtrasController
{
    // GET listar
    public function index()
    {
        try {
            $response = new Response();
            $model = new ExtrasModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET obtener
    public function get($id)
    {
        try {
            $response = new Response();
            $model = new ExtrasModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new ExtrasModel();
            $result = $model->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new ExtrasModel();
            $result = $model->update($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // DELETE eliminar (lógico)
    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new ExtrasModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}