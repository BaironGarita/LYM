<?php
require_once __DIR__ . '/../controllers/core/MySqlConnect.php';

class CarritoModel {
    private $db;
    public function __construct() {
        $this->db = new MySqlConnect();
    }

    public function getByUsuario($usuario_id) {
        $sql = 'SELECT * FROM carrito WHERE usuario_id = ?';
        return $this->db->runQuery($sql, [$usuario_id]);
    }

    public function addOrUpdate($data) {
        $sqlCheck = 'SELECT id FROM carrito WHERE usuario_id = ? AND producto_id = ?';
        $rows = $this->db->runQuery($sqlCheck, [$data['usuario_id'], $data['producto_id']]);
        if ($rows && count($rows) > 0) {
            $sqlUpdate = 'UPDATE carrito SET cantidad = ?, personalizaciones = ?, updated_at = NOW() WHERE id = ?';
            $this->db->runUpdate($sqlUpdate, [
                $data['cantidad'],
                isset($data['personalizaciones']) ? $data['personalizaciones'] : null,
                $rows[0]['id']
            ]);
            return ['updated' => true, 'id' => $rows[0]['id']];
        } else {
            $sqlInsert = 'INSERT INTO carrito (usuario_id, producto_id, cantidad, personalizaciones, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
            $res = $this->db->runInsert($sqlInsert, [
                $data['usuario_id'],
                $data['producto_id'],
                $data['cantidad'],
                isset($data['personalizaciones']) ? $data['personalizaciones'] : null
            ]);
            return ['inserted' => true, 'id' => $res['id']];
        }
    }

    public function remove($id) {
        $sql = 'DELETE FROM carrito WHERE id = ?';
        $this->db->runDelete($sql, [$id]);
        return ['deleted' => true];
    }
}
