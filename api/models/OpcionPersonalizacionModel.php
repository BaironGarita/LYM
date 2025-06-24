<?php
class OpcionPersonalizacionModel
{
    // Conexión a la base de datos
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las opciones de personalización
     * @return array - Lista de opciones
     */
    public function all()
    {
        try {
            $vSql = "SELECT * FROM opciones_personalizacion WHERE activo = 1 ORDER BY tipo, nombre";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener todas las opciones con sus valores
     * @return array - Lista de opciones con valores
     */
    public function allWithValues()
    {
        try {
            $vSql = "SELECT 
                        op.id,
                        op.nombre,
                        op.tipo,
                        op.descripcion,
                        op.activo,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', vp.id,
                                'valor', vp.valor,
                                'precio_adicional', vp.precio_adicional,
                                'activo', vp.activo
                            )
                        ) as valores
                     FROM opciones_personalizacion op
                     LEFT JOIN valores_personalizacion vp ON op.id = vp.opcion_id AND vp.activo = 1
                     WHERE op.activo = 1
                     GROUP BY op.id, op.nombre, op.tipo, op.descripcion, op.activo
                     ORDER BY op.tipo, op.nombre";
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Procesar el JSON de valores
            foreach ($vResultado as &$opcion) {
                $opcion['valores'] = json_decode($opcion['valores'], true);
                // Filtrar valores nulos si no hay valores asociados
                if ($opcion['valores'][0]['id'] === null) {
                    $opcion['valores'] = [];
                }
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una opción por su ID
     * @param $id - ID de la opción
     * @return object - Datos de la opción
     */
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM opciones_personalizacion WHERE id = $id AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una opción con sus valores
     * @param $id - ID de la opción
     * @return object - Datos de la opción con valores
     */
    public function getWithValues($id)
    {
        try {
            $opcion = $this->get($id);
            if ($opcion) {
                $vSql = "SELECT * FROM valores_personalizacion WHERE opcion_id = $id AND activo = 1 ORDER BY valor";
                $valores = $this->enlace->ExecuteSQL($vSql);
                $opcion['valores'] = $valores;
            }
            return $opcion;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear una nueva opción de personalización
     * @param $datos - Datos de la opción a crear
     * @return object - Datos de la opción creada
     */
    public function create($datos)
    {
        try {
            // Escapar y validar datos
            $nombre = addslashes($datos->nombre);
            $tipo = addslashes($datos->tipo);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : '';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            // Validar tipo permitido
            $tiposPermitidos = ['Color', 'Talla', 'Material', 'Otro'];
            if (!in_array($datos->tipo, $tiposPermitidos)) {
                throw new Exception("Tipo de opción no válido");
            }

            // Consulta SQL para insertar
            $vSql = "INSERT INTO opciones_personalizacion (nombre, tipo, descripcion, activo) 
                     VALUES ('$nombre', '$tipo', '$descripcion', $activo)";

            // Ejecutar la consulta y obtener el ID del último insert
            $idOpcion = $this->enlace->executeSQL_DML_last($vSql);

            // Retornar la opción creada
            return $this->get($idOpcion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar una opción existente
     * @param $datos - Datos de la opción a actualizar
     * @return object - Datos de la opción actualizada
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = addslashes($datos->nombre);
            $tipo = addslashes($datos->tipo);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : '';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            // Validar tipo permitido
            $tiposPermitidos = ['Color', 'Talla', 'Material', 'Otro'];
            if (!in_array($datos->tipo, $tiposPermitidos)) {
                throw new Exception("Tipo de opción no válido");
            }

            $vSql = "UPDATE opciones_personalizacion SET 
                     nombre = '$nombre',
                     tipo = '$tipo',
                     descripcion = '$descripcion',
                     activo = $activo
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar lógicamente una opción
     * @param $id - ID de la opción a eliminar
     * @return bool - True si se eliminó correctamente
     */
    public function delete($id)
    {
        try {
            $vSql = "UPDATE opciones_personalizacion SET activo = 0 WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener opciones por tipo
     * @param $tipo - Tipo de opción (Color, Talla, Material, Otro)
     * @return array - Lista de opciones del tipo especificado
     */
    public function getByType($tipo)
    {
        try {
            $tipo = addslashes($tipo);
            $vSql = "SELECT * FROM opciones_personalizacion WHERE tipo = '$tipo' AND activo = 1 ORDER BY nombre";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}