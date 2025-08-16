<?php
class ProductoPersonalizacionModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getByProducto($producto_id)
    {
        try {
            $producto_id = (int)$this->enlace->escapeString($producto_id);
            $sql = "SELECT pp.*, op.nombre as opcion_nombre, op.tipo FROM producto_personalizacion pp LEFT JOIN opciones_personalizacion op ON pp.opcion_id = op.id WHERE pp.producto_id = $producto_id";
            return $this->enlace->executeSQL($sql, 'asoc');
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function get($id)
    {
        try {
            $id = (int)$this->enlace->escapeString($id);
            $sql = "SELECT * FROM producto_personalizacion WHERE id = $id LIMIT 1";
            $r = $this->enlace->executeSQL($sql, 'asoc');
            return !empty($r) ? $r[0] : null;
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    public function create($datos)
    {
        try {
            if (is_object($datos)) $datos = json_decode(json_encode($datos), true);
            $producto_id = isset($datos['producto_id']) ? (int)$datos['producto_id'] : 0;
            $opcion_id = isset($datos['opcion_id']) ? (int)$datos['opcion_id'] : 0;
            $obligatorio = isset($datos['obligatorio']) ? ((int)$datos['obligatorio'] ? 1 : 0) : 0;

            if ($producto_id <= 0 || $opcion_id <= 0) {
                throw new Exception('producto_id y opcion_id son requeridos');
            }

            $sql = "INSERT IGNORE INTO producto_personalizacion (producto_id, opcion_id, obligatorio) VALUES ($producto_id, $opcion_id, $obligatorio)";
            $this->enlace->executeSQL_DML($sql);
            // devolver lista actualizada
            return $this->getByProducto($producto_id);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $id = (int)$id;
            $sql = "DELETE FROM producto_personalizacion WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function deleteByProductoOpcion($producto_id, $opcion_id)
    {
        try {
            $producto_id = (int)$producto_id;
            $opcion_id = (int)$opcion_id;
            $sql = "DELETE FROM producto_personalizacion WHERE producto_id = $producto_id AND opcion_id = $opcion_id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}
