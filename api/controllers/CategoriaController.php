<?php
class CategoriaController
{
    // GET /categoria
    public function index()
    {
        try {
            $response = new Response();
            $model = new CategoriaModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET /categoria/{id}
    public function get()
    {
        try {
            $response = new Response();

            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if (!$id) {
                throw new Exception("Parámetro 'id' requerido.");
            }

            $model = new CategoriaModel();
            $categoria = $model->get($id);

            if (!$categoria) {
                throw new Exception("Categoría no encontrada.");
            }

            $response->toJSON($categoria);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST /categoria
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $data = json_decode(json_encode($request->getJSON()), true);

            $model = new CategoriaModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT /categoria/{id}
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();

            $data = json_decode(json_encode($request->getJSON()), true);

            $id = $data["id"] ?? null;
            if (!$id) throw new Exception("ID no proporcionado para actualizar", 400);

            $model = new CategoriaModel();
            $result = $model->update($id, $data);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    // DELETE /categoria/{id}
    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new CategoriaModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
