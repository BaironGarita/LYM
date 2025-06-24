<?php
class CategoriaModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function all()
    {
        $query = "SELECT * FROM categorias ORDER BY orden ASC";
        return $this->db->runQuery($query);
    }

   public function get($id)
{
    $query = "SELECT * FROM categorias WHERE id = ?";
    $result = $this->db->runQuery($query, [$id]);

    if (count($result) > 0) {
        return $result[0]; 
    }

    return null;
}


    public function create($data)
    {
        $query = "INSERT INTO categorias (nombre, descripcion, icono, color, orden) VALUES (?, ?, ?, ?, ?)";
        $params = [
            $data["nombre"] ?? '',
            $data["descripcion"] ?? '',
            $data["icono"] ?? '',
            $data["color"] ?? '',
            $data["orden"] ?? 0
        ];

        $result = $this->db->runInsert($query, $params);

        $id = $result["id"];

        return $this->get($id);
    }


    public function update($id, $data)
    {
        $actual = $this->get($id);
        if (!$actual) {
            throw new Exception("Categoría con ID $id no encontrada.");
        }

        $nombre = $data["nombre"] ?? $actual["nombre"];
        $descripcion = $data["descripcion"] ?? $actual["descripcion"];
        $icono = $data["icono"] ?? $actual["icono"];
        $color = $data["color"] ?? $actual["color"];
        $orden = $data["orden"] ?? $actual["orden"];

        $query = "UPDATE categorias SET nombre = ?, descripcion = ?, icono = ?, color = ?, orden = ? WHERE id = ?";
        $result = $this->db->runUpdate($query, [$nombre, $descripcion, $icono, $color, $orden, $id]);

        return $this->get($id);
    }


    public function delete($id)
    {
        $query = "DELETE FROM categorias WHERE id = ?";
        return $this->db->runDelete($query, [$id]);
    }
}
