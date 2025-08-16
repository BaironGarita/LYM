<?php
class DireccionModel
{
    // Conexión a la base de datos
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las direcciones activas de un usuario
     * @param $usuarioId - ID del usuario
     * @return array - Lista de direcciones del usuario
     */
    public function getByUserId($usuarioId)
    {
        try {
            $usuarioId = (int) $usuarioId;
            $vSql = "SELECT id, usuario_id, provincia, ciudad, direccion_1, direccion_2, 
                     codigo_postal, telefono, activo 
                     FROM direcciones 
                     WHERE usuario_id = $usuarioId AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
            return [];
        }
    }

    /**
     * Obtener una dirección específica por ID
     * @param $id - ID de la dirección
     * @return object - Datos de la dirección
     */
    public function get($id)
    {
        try {
            $id = (int) $id;
            $vSql = "SELECT id, usuario_id, provincia, ciudad, direccion_1, direccion_2, 
                     codigo_postal, telefono, activo 
                     FROM direcciones 
                     WHERE id = $id AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    /**
     * Crear una nueva dirección
     * @param $datos - Datos de la dirección a crear
     * @return object - Datos de la dirección creada
     */
    public function create($datos)
    {
        try {
            // Validar y escapar datos. $datos puede ser array o stdClass
            if (is_array($datos)) {
                $get = function ($k, $d = null) use ($datos) { return isset($datos[$k]) ? $datos[$k] : $d; };
            } else {
                $get = function ($k, $d = null) use ($datos) { return isset($datos->{$k}) ? $datos->{$k} : $d; };
            }

            $usuarioId = (int) $get('usuario_id');
            $provincia = addslashes($get('provincia', ''));
            $ciudad = addslashes($get('ciudad', ''));
            $direccion1 = addslashes($get('direccion_1', ''));
            $direccion2 = $get('direccion_2', null) !== null ? addslashes($get('direccion_2')) : null;
            $codigoPostal = $get('codigo_postal', null) !== null ? addslashes($get('codigo_postal')) : null;
            $telefono = $get('telefono', null) !== null ? addslashes($get('telefono')) : null;
            $activo = $get('activo', null) !== null ? (int) $get('activo') : 1;

            // Verificar que el usuario existe
            $vSqlCheck = "SELECT id FROM usuarios WHERE id = $usuarioId AND activo = 1";
            $vCheck = $this->enlace->ExecuteSQL($vSqlCheck);
            if (empty($vCheck)) {
                throw new Exception("El usuario especificado no existe o no está activo");
            }

            // Construir la consulta SQL
            $campos = "usuario_id, provincia, ciudad, direccion_1, activo";
            $valores = "$usuarioId, '$provincia', '$ciudad', '$direccion1', $activo";

            if ($direccion2 !== null) {
                $campos .= ", direccion_2";
                $valores .= ", '$direccion2'";
            }
            if ($codigoPostal !== null) {
                $campos .= ", codigo_postal";
                $valores .= ", '$codigoPostal'";
            }
            if ($telefono !== null) {
                $campos .= ", telefono";
                $valores .= ", '$telefono'";
            }

            $vSql = "INSERT INTO direcciones ($campos) VALUES ($valores)";

            // Ejecutar la consulta y obtener el ID del último insert
            $idDireccion = $this->enlace->executeSQL_DML_last($vSql);

            // Retornar la dirección creada
            $created = $this->get($idDireccion);
            // Si el caller espera un objeto con insertId, proveer compatibilidad
            if ($created && is_object($created)) {
                return $created;
            }
            return $created;
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    /**
     * Actualizar una dirección existente
     * @param $datos - Datos de la dirección a actualizar
     * @return object - Datos de la dirección actualizada
     */
    public function update($datos)
    {
        try {
            // $datos puede ser array o stdClass
            if (is_array($datos)) {
                $get = function ($k, $d = null) use ($datos) { return isset($datos[$k]) ? $datos[$k] : $d; };
            } else {
                $get = function ($k, $d = null) use ($datos) { return isset($datos->{$k}) ? $datos->{$k} : $d; };
            }

            $id = (int) $get('id');
            $usuarioId = (int) $get('usuario_id');
            $provincia = addslashes($get('provincia', ''));
            $ciudad = addslashes($get('ciudad', ''));
            $direccion1 = addslashes($get('direccion_1', ''));
            $direccion2 = $get('direccion_2', null) !== null ? addslashes($get('direccion_2')) : null;
            $codigoPostal = $get('codigo_postal', null) !== null ? addslashes($get('codigo_postal')) : null;
            $telefono = $get('telefono', null) !== null ? addslashes($get('telefono')) : null;
            $activo = $get('activo', null) !== null ? (int) $get('activo') : 1;

            // Verificar que la dirección pertenece al usuario
            $vSqlCheck = "SELECT id FROM direcciones WHERE id = $id AND usuario_id = $usuarioId";
            $vCheck = $this->enlace->ExecuteSQL($vSqlCheck);
            if (empty($vCheck)) {
                throw new Exception("La dirección no existe o no pertenece al usuario especificado");
            }

            $vSql = "UPDATE direcciones SET 
                     provincia = '$provincia',
                     ciudad = '$ciudad',
                     direccion_1 = '$direccion1',
                     direccion_2 = " . ($direccion2 ? "'$direccion2'" : "NULL") . ",
                     codigo_postal = " . ($codigoPostal ? "'$codigoPostal'" : "NULL") . ",
                     telefono = " . ($telefono ? "'$telefono'" : "NULL") . ",
                     activo = $activo
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    /**
     * Eliminar lógicamente una dirección
     * @param $id - ID de la dirección a eliminar
     * @param $usuarioId - ID del usuario propietario (para validación)
     * @return bool - True si se eliminó correctamente
     */
    public function delete($id, $usuarioId = null)
    {
        try {
            $id = (int) $id;
            $whereClause = "id = $id";

            // Si se proporciona el ID del usuario, verificar que la dirección le pertenece
            if ($usuarioId !== null) {
                $usuarioId = (int) $usuarioId;
                $whereClause .= " AND usuario_id = $usuarioId";
            }

            $vSql = "UPDATE direcciones SET activo = 0 WHERE $whereClause";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Obtener todas las direcciones (solo para administradores)
     * @return array - Lista de todas las direcciones
     */
    public function all()
    {
        try {
            $vSql = "SELECT d.id, d.usuario_id, u.nombre as usuario_nombre, d.provincia, 
                     d.ciudad, d.direccion_1, d.direccion_2, d.codigo_postal, d.telefono, d.activo
                     FROM direcciones d
                     INNER JOIN usuarios u ON d.usuario_id = u.id
                     WHERE d.activo = 1
                     ORDER BY d.id DESC";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
            return [];
        }
    }

    /**
     * Buscar direcciones por provincia o ciudad
     * @param $termino - Término de búsqueda
     * @return array - Lista de direcciones que coinciden
     */
    public function search($termino)
    {
        try {
            $termino = addslashes($termino);
            $vSql = "SELECT d.id, d.usuario_id, u.nombre as usuario_nombre, d.provincia, 
                     d.ciudad, d.direccion_1, d.direccion_2, d.codigo_postal, d.telefono, d.activo
                     FROM direcciones d
                     INNER JOIN usuarios u ON d.usuario_id = u.id
                     WHERE d.activo = 1 
                     AND (d.provincia LIKE '%$termino%' OR d.ciudad LIKE '%$termino%')
                     ORDER BY d.provincia, d.ciudad";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
            return [];
        }
    }
}