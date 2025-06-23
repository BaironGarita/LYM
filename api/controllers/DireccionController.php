<?php
/**
 * Controlador para la gestión de direcciones de usuarios del sistema LYM
 * Maneja las direcciones de envío y facturación
 */
class DireccionController
{
    //GET listar todas las direcciones (solo administradores)
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $direccionM = new DireccionModel();
            //Método del modelo
            $result = $direccionM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener dirección por ID
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener direcciones de un usuario específico
    public function getByUser($usuarioId)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->getByUserId($usuarioId);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear nueva dirección
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();

            // Validar campos requeridos
            if (
                empty($inputJSON->usuario_id) || empty($inputJSON->provincia) ||
                empty($inputJSON->ciudad) || empty($inputJSON->direccion_1)
            ) {
                throw new Exception("Faltan campos requeridos: usuario_id, provincia, ciudad, direccion_1");
            }

            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //PUT actualizar dirección
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();

            // Validar campos requeridos
            if (
                empty($inputJSON->id) || empty($inputJSON->usuario_id) ||
                empty($inputJSON->provincia) || empty($inputJSON->ciudad) ||
                empty($inputJSON->direccion_1)
            ) {
                throw new Exception("Faltan campos requeridos: id, usuario_id, provincia, ciudad, direccion_1");
            }

            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar dirección (lógico)
    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar dirección de un usuario específico
    public function deleteUserAddress($id, $usuarioId)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar (con validación de propietario)
            $result = $direccion->delete($id, $usuarioId);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET buscar direcciones por término
    public function search($termino)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $direccion = new DireccionModel();
            //Acción del modelo a ejecutar
            $result = $direccion->search($termino);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}