<?php
/**
 * Controlador para la gestión de etiquetas de productos de moda
 * Actualizado para el dominio de moda y accesorios según README.md
 */
class EtiquetaController
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $etiquetaM = new EtiquetaModel();
            //Método del modelo
            $result = $etiquetaM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener 
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $etiqueta = new EtiquetaModel();
            //Acción del modelo a ejecutar
            $result = $etiqueta->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $etiqueta = new EtiquetaModel();
            //Acción del modelo a ejecutar
            $result = $etiqueta->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $etiqueta = new EtiquetaModel();
            //Acción del modelo a ejecutar
            $result = $etiqueta->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar
    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $etiqueta = new EtiquetaModel();
            //Acción del modelo a ejecutar
            $result = $etiqueta->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}