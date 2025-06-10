<?php
class EtiquetaController
{
    // GET /apimovie/etiqueta
    public function index()
    {
        try {
            $response = new Response();
            $etiquetaM = new EtiquetaModel();
            $result = $etiquetaM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET /apimovie/etiqueta/get?id=1
    public function get()
    {
        try {
            $response = new Response();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                $response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }
            
            $etiqueta = new EtiquetaModel();
            $result = $etiqueta->get($id);
            
            if ($result) {
                $response->toJSON($result);
            } else {
                $response->status(404)->toJSON(['error' => 'Etiqueta no encontrada']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST /apimovie/etiqueta/create
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            
            $inputJSON = $request->getJSON();
            
            if (empty($inputJSON->nombre)) {
                $response->status(400)->toJSON(['error' => 'El nombre es obligatorio']);
                return;
            }
            
            $etiqueta = new EtiquetaModel();
            $result = $etiqueta->create($inputJSON);
            $response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT /apimovie/etiqueta/update
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            
            $inputJSON = $request->getJSON();
            
            if (empty($inputJSON->id) || empty($inputJSON->nombre)) {
                $response->status(400)->toJSON(['error' => 'ID y nombre son obligatorios']);
                return;
            }
            
            $etiqueta = new EtiquetaModel();
            $result = $etiqueta->update($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // DELETE /apimovie/etiqueta/delete?id=1
    public function delete()
    {
        try {
            $response = new Response();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                $response->status(400)->toJSON(['error' => 'ID es requerido']);
                return;
            }
            
            $etiqueta = new EtiquetaModel();
            $result = $etiqueta->delete($id);
            
            if ($result) {
                $response->toJSON(['message' => 'Etiqueta eliminada correctamente']);
            } else {
                $response->status(500)->toJSON(['error' => 'Error al eliminar la etiqueta']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
}