<?php
/**
 * Controlador para la gestión de opciones de personalización de productos
 */
class OpcionPersonalizacionController
{
    //GET listar todas las opciones
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $opcionM = new OpcionPersonalizacionModel();
            //Método del modelo
            $result = $opcionM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET listar opciones con sus valores
    public function indexWithValues()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $opcionM = new OpcionPersonalizacionModel();
            //Método del modelo
            $result = $opcionM->allWithValues();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener una opción específica
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener una opción con sus valores
    public function getWithValues($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->getWithValues($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear nueva opción
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //PUT actualizar opción
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar opción
    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET obtener opciones por tipo
    public function getByType($tipo)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $opcion = new OpcionPersonalizacionModel();
            //Acción del modelo a ejecutar
            $result = $opcion->getByType($tipo);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}