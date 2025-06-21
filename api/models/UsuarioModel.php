<?php
class UsuarioModel
{
    // Conexión a la base de datos
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todos los usuarios activos
     * @return array - Lista de usuarios (sin contraseñas)
     */
    public function all()
    {
        try {
            $vSql = "SELECT id, nombre, correo, rol, activo 
                     FROM usuarios WHERE activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener un usuario por su ID
     * @param $id - ID del usuario
     * @return object - Datos del usuario (sin contraseña)
     */
    public function get($id)
    {
        try {
            $vSql = "SELECT id, nombre, correo, rol, activo 
                     FROM usuarios WHERE id = $id AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear un nuevo usuario
     * @param $datos - Datos del usuario a crear
     * @return object - Datos del usuario creado
     */
    public function create($datos)
    {
        try {
            // Validar y escapar datos
            $nombre = addslashes($datos->nombre);
            $correo = addslashes($datos->correo);
            $contrasena = password_hash($datos->contrasena, PASSWORD_DEFAULT);
            $rol = isset($datos->rol) ? addslashes($datos->rol) : 'cliente';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            // Verificar si el correo ya existe
            $vSqlCheck = "SELECT id FROM usuarios WHERE correo = '$correo'";
            $vCheck = $this->enlace->ExecuteSQL($vSqlCheck);
            if (!empty($vCheck)) {
                throw new Exception("El correo electrónico ya está registrado");
            }

            // Consulta SQL para insertar
            $vSql = "INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
                     VALUES ('$nombre', '$correo', '$contrasena', '$rol', $activo)";

            // Ejecutar la consulta y obtener el ID del último insert
            $idUsuario = $this->enlace->executeSQL_DML_last($vSql);

            // Retornar el usuario creado
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar un usuario existente
     * @param $datos - Datos del usuario a actualizar
     * @return object - Datos del usuario actualizado
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = addslashes($datos->nombre);
            $correo = addslashes($datos->correo);
            $rol = isset($datos->rol) ? addslashes($datos->rol) : 'cliente';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;


            // Verificar si el correo ya existe en otro usuario
            $vSqlCheck = "SELECT id FROM usuarios WHERE correo = '$correo' AND id != $id";
            $vCheck = $this->enlace->ExecuteSQL($vSqlCheck);
            if (!empty($vCheck)) {
                throw new Exception("El correo electrónico ya está registrado por otro usuario");
            }

            $vSql = "UPDATE usuarios SET 
                     nombre = '$nombre',
                     correo = '$correo',
                     rol = '$rol',
                     activo = $activo
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar contraseña de usuario
     * @param $datos - ID y nueva contraseña
     * @return bool - True si se actualizó correctamente
     */
    public function updatePassword($datos)
    {
        try {
            $id = (int) $datos->id;
            $contrasena = password_hash($datos->contrasena, PASSWORD_DEFAULT);

            $vSql = "UPDATE usuarios SET contrasena = '$contrasena' WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar lógicamente un usuario
     * @param $id - ID del usuario a eliminar
     * @return bool - True si se eliminó correctamente
     */
    public function delete($id)
    {
        try {
            $vSql = "UPDATE usuarios SET activo = 0 WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Autenticar usuario (login)
     * @param $datos - Correo y contraseña
     * @return object - Datos del usuario autenticado o null
     */
    public function login($datos)
    {
        try {
            $correo = addslashes($datos->correo);

            $vSql = "SELECT id, nombre, correo, contrasena, rol, activo 
                     FROM usuarios WHERE correo = '$correo' AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (!empty($vResultado)) {
                $usuario = $vResultado[0];

                // Verificar contraseña
                if (password_verify($datos->contrasena, $usuario->contrasena)) {
                    // Remover contraseña del resultado
                    unset($usuario->contrasena);
                    return $usuario;
                }
            }

            return null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener usuario por correo electrónico
     * @param $correo - Correo del usuario
     * @return object - Datos del usuario (sin contraseña)
     */
    public function getByEmail($correo)
    {
        try {
            $correo = addslashes($correo);
            $vSql = "SELECT id, nombre, correo, rol, activo
                     FROM usuarios WHERE correo = '$correo' AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener usuarios por rol
     * @param $rol - Rol del usuario ('administrador' o 'cliente')
     * @return array - Lista de usuarios con ese rol
     */
    public function getByRole($rol)
    {
        try {
            $rol = addslashes($rol);
            $vSql = "SELECT id, nombre, correo, rol, activo 
                     FROM usuarios WHERE rol = '$rol' AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}