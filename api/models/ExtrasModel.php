<?php
class ExtrasModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM extras WHERE activo = 1";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $id = (int)$id;
            $vSql = "SELECT * FROM extras WHERE id = $id AND activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($datos)
    {
        try {
            $nombre = addslashes($datos->nombre);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : null;
            $precio = isset($datos->precio) ? (float)$datos->precio : 0.00;
            $activo = isset($datos->activo) ? (int)$datos->activo : 1;

            $vSql = "INSERT INTO extras (nombre, descripcion, precio, activo)
                     VALUES ('$nombre', " . ($descripcion !== null ? "'$descripcion'" : "NULL") . ", $precio, $activo)";

            $id = $this->enlace->executeSQL_DML_last($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($datos)
    {
        try {
            $id = (int)$datos->id;
            $nombre = addslashes($datos->nombre);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : null;
            $precio = isset($datos->precio) ? (float)$datos->precio : 0.00;
            $activo = isset($datos->activo) ? (int)$datos->activo : 1;

            $vSql = "UPDATE extras SET
                     nombre = '$nombre',
                     descripcion = " . ($descripcion !== null ? "'$descripcion'" : "NULL") . ",
                     precio = $precio,
                     activo = $activo
                     WHERE id = $id";

            $this->enlace->executeSQL_DML($vSql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $id = (int)$id;
            $vSql = "UPDATE extras SET activo = 0 WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}