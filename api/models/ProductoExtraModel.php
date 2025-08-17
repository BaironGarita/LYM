<?php

class ProductoExtraModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener extras asignados a un producto
    public function allByProduct($productoId)
    {
        try {
            $productoId = (int)$productoId;
            $vSql = "SELECT e.* FROM extras e
                     JOIN producto_extras pe ON pe.extra_id = e.id
                     WHERE pe.producto_id = $productoId";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Asignar extra a un producto (no duplica)
    public function attach($productoId, $extraId)
    {
        try {
            $productoId = (int)$productoId;
            $extraId = (int)$extraId;
            $vSql = "INSERT IGNORE INTO producto_extras (producto_id, extra_id) VALUES ($productoId, $extraId)";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Quitar extra de un producto
    public function detach($productoId, $extraId)
    {
        try {
            $productoId = (int)$productoId;
            $extraId = (int)$extraId;
            $vSql = "DELETE FROM producto_extras WHERE producto_id = $productoId AND extra_id = $extraId";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Listar todas las asignaciones (opcional)
    public function allAssignments()
    {
        try {
            $vSql = "SELECT * FROM producto_extras";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}