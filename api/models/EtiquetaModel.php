<?php
class EtiquetaModel
{
    // Conexión a la base de datos
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todas las etiquetas
     * @return array - Lista de etiquetas
     */
    public function all()
    {
        try {
            $vSql = "SELECT * FROM etiquetas WHERE activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una etiqueta por su ID
     * @param $id - ID de la etiqueta
     * @return object - Datos de la etiqueta
     */
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM etiquetas WHERE id = $id AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear una nueva etiqueta
     * @param $datos - Datos de la etiqueta a crear
     * @return object - Datos de la etiqueta creada
     */
    public function create($datos)
    {
        try {
            // Escapar y validar datos usando funciones nativas de PHP
            $nombre = addslashes($datos->nombre);
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            // Consulta SQL para insertar
            $vSql = "INSERT INTO etiquetas (nombre, activo) 
                     VALUES ('$nombre', $activo)";

            // Ejecutar la consulta y obtener el ID del último insert
            $idEtiqueta = $this->enlace->executeSQL_DML_last($vSql);

            // Retornar la etiqueta creada
            return $this->get($idEtiqueta);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar una etiqueta existente
     * @param $datos - Datos de la etiqueta a actualizar
     * @return object - Datos de la etiqueta actualizada
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = addslashes($datos->nombre);
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            $vSql = "UPDATE etiquetas SET 
                     nombre = '$nombre',
                     activo = $activo
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar lógicamente una etiqueta
     * @param $id - ID de la etiqueta a eliminar
     * @return bool - True si se eliminó correctamente
     */
    public function delete($id)
    {
        try {
            $vSql = "UPDATE etiquetas SET activo = 0 WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}