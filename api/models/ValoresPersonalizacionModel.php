<?php
class ValoresPersonalizacionModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getByOpcion($opcion_id)
    {
        try {
            $opcion_id = (int)$this->enlace->escapeString($opcion_id);
            $sql = "SELECT * FROM valores_personalizacion WHERE opcion_id = $opcion_id AND activo = 1 ORDER BY valor";
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
            $sql = "SELECT * FROM valores_personalizacion WHERE id = $id LIMIT 1";
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
            $opcion_id = isset($datos['opcion_id']) ? (int)$datos['opcion_id'] : 0;
            $valor = $this->enlace->escapeString($datos['valor'] ?? '');
            $precio_adicional = isset($datos['precio_adicional']) ? (float)$datos['precio_adicional'] : 0.00;
            $activo = isset($datos['activo']) ? (int)$datos['activo'] : 1;

            if ($opcion_id <= 0 || $valor === '') {
                throw new Exception('opcion_id y valor son requeridos');
            }

            $sql = "INSERT INTO valores_personalizacion (opcion_id, valor, precio_adicional, activo) VALUES ($opcion_id, '$valor', $precio_adicional, $activo)";
            $id = $this->enlace->executeSQL_DML_last($sql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function update($datos)
    {
        try {
            if (is_object($datos)) $datos = json_decode(json_encode($datos), true);
            $id = isset($datos['id']) ? (int)$datos['id'] : 0;
            if ($id <= 0) throw new Exception('ID inválido');

            $valor = $this->enlace->escapeString($datos['valor'] ?? '');
            $precio_adicional = isset($datos['precio_adicional']) ? (float)$datos['precio_adicional'] : 0.00;
            $activo = isset($datos['activo']) ? (int)$datos['activo'] : 1;

            $sql = "UPDATE valores_personalizacion SET valor = '$valor', precio_adicional = $precio_adicional, activo = $activo WHERE id = $id";
            $this->enlace->executeSQL_DML($sql);
            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $id = (int)$id;
            $sql = "UPDATE valores_personalizacion SET activo = 0 WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}
