<?php
/**
 * Controlador para la gestión de usuarios del sistema LYM
 * Maneja administradores y clientes
 */
class UsuarioController
{
    //GET listar todos los usuarios
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $usuarioM = new UsuarioModel();
            //Método del modelo
            $result = $usuarioM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener usuario por ID
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear nuevo usuario (registro)
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            
            // Validaciones básicas
            if (empty($inputJSON->nombre)) {
                $response->status(400)->toJSON(['error' => 'El nombre es obligatorio']);
                return;
            }
            
            if (empty($inputJSON->correo)) {
                $response->status(400)->toJSON(['error' => 'El correo es obligatorio']);
                return;
            }
            
            if (empty($inputJSON->contrasena)) {
                $response->status(400)->toJSON(['error' => 'La contraseña es obligatoria']);
                return;
            }
            
            if (strlen($inputJSON->contrasena) < 6) {
                $response->status(400)->toJSON(['error' => 'La contraseña debe tener al menos 6 caracteres']);
                return;
            }
            
            // Validar formato de correo
            if (!filter_var($inputJSON->correo, FILTER_VALIDATE_EMAIL)) {
                $response->status(400)->toJSON(['error' => 'El formato del correo no es válido']);
                return;
            }
            
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->create($inputJSON);
            
            if ($result) {
                $response->status(201)->toJSON([
                    'success' => true,
                    'message' => 'Usuario registrado exitosamente',
                    'usuario' => $result
                ]);
            } else {
                $response->status(500)->toJSON(['error' => 'Error al crear el usuario']);
            }
        } catch (Exception $e) {
            $response = new Response();
            if (strpos($e->getMessage(), 'ya está registrado') !== false) {
                $response->status(409)->toJSON(['error' => $e->getMessage()]);
            } else {
                $response->status(500)->toJSON(['error' => 'Error interno del servidor']);
            }
        }
    }

    //PUT actualizar usuario
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar usuario (lógico)
    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Login de usuario
    public function login()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            
            // Validaciones básicas
            if (empty($inputJSON->correo)) {
                $response->status(400)->toJSON(['error' => 'El correo es obligatorio']);
                return;
            }
            
            if (empty($inputJSON->contrasena)) {
                $response->status(400)->toJSON(['error' => 'La contraseña es obligatoria']);
                return;
            }
            
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->login($inputJSON);
            
            if ($result) {
                $response->toJSON([
                    'success' => true,
                    'message' => 'Login exitoso',
                    'usuario' => $result
                ]);
            } else {
                $response->status(401)->toJSON([
                    'error' => 'Credenciales incorrectas'
                ]);
            }
        } catch (Exception $e) {
            $response = new Response();
            $response->status(500)->toJSON(['error' => 'Error interno del servidor']);
        }
    }
}