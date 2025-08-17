<?php

/**
 * Modelo para la gestión de productos de moda
 * Basado en el README.md - Sistema de e-commerce de moda
 */
class ProductoModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Normaliza datos: acepta array o stdClass y devuelve array
     */
    private function normalize($datos)
    {
        if (is_object($datos)) {
            return json_decode(json_encode($datos), true);
        }
        return is_array($datos) ? $datos : [];
    }

    /**
     * Obtener todos los productos activos
     * Retorna array (posible vacío) o false en error
     */
    public function getAll()
    {
        error_log('ProductoModel::getAll - preparando consulta');
        try {
            $vSql = "SELECT p.*, c.nombre as categoria_nombre, 
                           COUNT(r.id) as total_resenas,
                           COALESCE(AVG(r.valoracion),0) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.eliminado = 0 
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";

            $result = $this->enlace->executeSQL($vSql);
            // Evitar llamar a count() sobre valores no contables (por ejemplo false)
            if (function_exists('is_countable')) {
                $filas = is_countable($result) ? count($result) : ($result === false ? 'false' : 0);
            } else {
                $filas = is_array($result) ? count($result) : ($result === false ? 'false' : 0);
            }
            error_log('ProductoModel::getAll - filas obtenidas: ' . $filas);
            return $result;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Obtener producto por ID
     */
    public function get($id)
    {
        try {
            $id = (int)$this->enlace->escapeString($id);
            $vSql = "SELECT p.*, c.nombre as categoria_nombre,
                           COUNT(r.id) as total_resenas,
                           COALESCE(AVG(r.valoracion),0) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.id = $id AND p.eliminado = 0
                    GROUP BY p.id
                    LIMIT 1";
            $result = $this->enlace->executeSQL($vSql);
            return (!empty($result) ? $result[0] : null);
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    /**
     * Crear producto y devolver ['id'=>int] o false en error
     */
    public function create($datos)
    {
        try {
            $data = $this->normalize($datos);

            // Campos básicos (ajusta según tu esquema)
            $nombre = $data['nombre'] ?? '';
            $descripcion = $data['descripcion'] ?? '';
            $precio = isset($data['precio']) ? (float)$data['precio'] : 0.0;
            $categoria_id = isset($data['categoria_id']) ? (int)$data['categoria_id'] : 0;
            $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
            $sku = $this->generateSKU();
            $peso = isset($data['peso']) ? (float)$data['peso'] : 0.0;
            $dimensiones = isset($data['dimensiones']) ? $this->enlace->escapeString($data['dimensiones']) : '';
            $material = $this->enlace->escapeString($data['material'] ?? '');
            $color_principal = $this->enlace->escapeString($data['color_principal'] ?? '');
            $genero = $this->enlace->escapeString($data['genero'] ?? 'unisex');
            $temporada = $this->enlace->escapeString($data['temporada'] ?? '');

            // Usar runInsert para obtener el ID de forma segura (prepared stmt)
            $sql = "INSERT INTO productos (nombre, descripcion, precio, categoria_id, sku, stock, peso, dimensiones, material, color_principal, genero, temporada)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $params = [$nombre, $descripcion, $precio, $categoria_id, $sku, $stock, $peso, $dimensiones, $material, $color_principal, $genero, $temporada];

            $res = $this->enlace->runInsert($sql, $params);
            $id = isset($res['id']) ? (int)$res['id'] : 0;

            if ($id <= 0) {
                error_log('ProductoModel::create - insert no devolvió id. runInsert result: ' . json_encode($res));
                return false;
            }

            return ['id' => $id];
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Actualizar producto
     * $datos puede ser array o stdClass
     */
    public function update($datos)
    {
        try {
            $datos = $this->normalize($datos);

            $id = isset($datos['id']) ? (int)$datos['id'] : 0;
            if ($id <= 0) {
                throw new Exception('ID inválido');
            }

            $nombre = $this->enlace->escapeString($datos['nombre'] ?? '');
            $descripcion = $this->enlace->escapeString($datos['descripcion'] ?? '');
            $precio = isset($datos['precio']) ? (float)$datos['precio'] : 0.0;
            $categoria_id = isset($datos['categoria_id']) ? (int)$datos['categoria_id'] : 0;
            $stock = (int)($datos['stock'] ?? 0);
            $peso = (float)($datos['peso'] ?? 0);
            $dimensiones = $this->enlace->escapeString($datos['dimensiones'] ?? '');
            $material = $this->enlace->escapeString($datos['material'] ?? '');
            $color_principal = $this->enlace->escapeString($datos['color_principal'] ?? '');
            $genero = $this->enlace->escapeString($datos['genero'] ?? 'unisex');
            $temporada = $this->enlace->escapeString($datos['temporada'] ?? '');

            $vSql = "UPDATE productos SET 
                        nombre = '$nombre',
                        descripcion = '$descripcion',
                        precio = $precio,
                        categoria_id = $categoria_id,
                        stock = $stock,
                        peso = $peso,
                        dimensiones = '$dimensiones',
                        material = '$material',
                        color_principal = '$color_principal',
                        genero = '$genero',
                        temporada = '$temporada',
                        updated_at = NOW()
                    WHERE id = $id AND eliminado = 0";

            $this->enlace->executeSQL_DML($vSql);

            // Actualizar etiquetas si se proporcionan (array o csv)
            $etiquetas = $datos['etiquetas'] ?? null;
            if (!is_null($etiquetas)) {
                if (is_string($etiquetas)) {
                    $etiquetas = array_filter(array_map('trim', explode(',', $etiquetas)));
                }
                if (is_array($etiquetas)) {
                    $this->updateEtiquetas($id, $etiquetas);
                }
            }

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Eliminar producto (soft delete)
     */
    public function delete($id)
    {
        try {
            $id = (int)$this->enlace->escapeString($id);
            $vSql = "UPDATE productos SET eliminado = 1, updated_at = NOW() WHERE id = $id";
            return $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Obtener productos por categoría
     */
    public function getByCategoria($categoria_id)
    {
        try {
            $categoria_id = (int)$this->enlace->escapeString($categoria_id);
            $vSql = "SELECT p.*, c.nombre as categoria_nombre,
                           COUNT(r.id) as total_resenas,
                           COALESCE(AVG(r.valoracion),0) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.categoria_id = $categoria_id AND p.eliminado = 0
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";
            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Buscar productos con filtros
     */
    public function buscar($filters)
    {
        try {
            $conditions = ["p.eliminado = 0"];

            if (!empty($filters['q'])) {
                $q = $this->enlace->escapeString($filters['q']);
                $conditions[] = "(p.nombre LIKE '%$q%' OR p.descripcion LIKE '%$q%' OR p.material LIKE '%$q%')";
            }

            if (!empty($filters['categoria'])) {
                $categoria = (int)$this->enlace->escapeString($filters['categoria']);
                $conditions[] = "p.categoria_id = $categoria";
            }

            if (!empty($filters['precio_min'])) {
                $precio_min = (float) $filters['precio_min'];
                $conditions[] = "p.precio >= $precio_min";
            }

            if (!empty($filters['precio_max'])) {
                $precio_max = (float) $filters['precio_max'];
                $conditions[] = "p.precio <= $precio_max";
            }

            if (!empty($filters['etiquetas'])) {
                $etiquetas = is_array($filters['etiquetas']) ? $filters['etiquetas'] : explode(',', $filters['etiquetas']);
                $etiqueta_conditions = [];
                foreach ($etiquetas as $etiqueta) {
                    $etiqueta = $this->enlace->escapeString(trim($etiqueta));
                    $etiqueta_conditions[] = "pe.etiqueta_id = '$etiqueta'";
                }
                if (!empty($etiqueta_conditions)) {
                    $conditions[] = "EXISTS (
                        SELECT 1 FROM producto_etiquetas pe 
                        WHERE pe.producto_id = p.id AND (" . implode(' OR ', $etiqueta_conditions) . ")
                    )";
                }
            }

            $where_clause = implode(' AND ', $conditions);

            $vSql = "SELECT p.*, c.nombre as categoria_nombre,
                           COUNT(r.id) as total_resenas,
                           COALESCE(AVG(r.valoracion),0) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE $where_clause
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Asociar etiquetas a un producto
     */
    private function associateEtiquetas($producto_id, $etiquetas)
    {
        try {
            foreach ($etiquetas as $etiqueta_id) {
                $etiqueta_id = $this->enlace->escapeString($etiqueta_id);
                $vSql = "INSERT IGNORE INTO producto_etiquetas (producto_id, etiqueta_id) 
                        VALUES ($producto_id, '$etiqueta_id')";
                $this->enlace->executeSQL_DML($vSql);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar etiquetas de un producto
     */
    private function updateEtiquetas($producto_id, $etiquetas)
    {
        try {
            $vSql = "DELETE FROM producto_etiquetas WHERE producto_id = $producto_id";
            $this->enlace->executeSQL_DML($vSql);
            $this->associateEtiquetas($producto_id, $etiquetas);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Generar SKU único para el producto
     */
    private function generateSKU()
    {
        return 'LYM-' . strtoupper(substr(uniqid(), -8));
    }

    /**
     * Insertar imagen de producto en la base de datos
     * Acepta claves: 'url_imagen' o 'ruta_archivo' o 'nombre_archivo'
     * Devuelve la fila insertada o false en error
     */
    public function addImagen($data)
    {
        try {
            $data = $this->normalize($data);

            $producto_id    = isset($data['producto_id']) ? (int)$data['producto_id'] : 0;
            if ($producto_id <= 0) {
                error_log('ProductoModel::addImagen - producto_id inválido');
                return false;
            }

            $nombre_archivo = $data['nombre_archivo'] ?? '';
            $ruta_archivo   = $data['ruta_archivo']   ?? ''; // debe ser algo como "uploads/archivo.ext"
            $alt_text       = $data['alt_text']       ?? null;
            $orden          = isset($data['orden']) ? (int)$data['orden'] : 0;
            $es_principal   = isset($data['es_principal']) ? (int)$data['es_principal'] : 0;


            // Alineado con la estructura de la tabla (incluye created_at)
            $sql = "INSERT INTO producto_imagenes
                    (producto_id, nombre_archivo, ruta_archivo, alt_text, `orden`, es_principal)
                    VALUES (?, ?, ?, ?, ?, ?)";
            $params = [
                $producto_id,
                $nombre_archivo,
                $ruta_archivo,
                $alt_text,
                $orden, 
                $es_principal,
            ];

            // runInsert debe devolver ['id' => int]
            $res = $this->enlace->runInsert($sql, $params);
            $id = isset($res['id']) ? (int)$res['id'] : 0;
            if ($id <= 0) {
                error_log('ProductoModel::addImagen - runInsert no devolvió id. res: ' . json_encode($res));
                return false;
            }

            // Devolver la fila insertada
            $row = $this->enlace->runQuery("SELECT * FROM producto_imagenes WHERE id = ?", [$id]);
            return (!empty($row) && is_array($row)) ? $row[0] : false;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
    
    /**
     * Obtener imágenes de un producto
     */
    public function getImagenes($producto_id)
    {
        try {
            $producto_id = (int)$producto_id;
            if ($producto_id <= 0) {
                return [];
            }

            $vSql = "SELECT * FROM producto_imagenes WHERE producto_id = {$producto_id} ORDER BY `orden` ASC, id ASC";
            $result = $this->enlace->executeSQL($vSql);
            if ($result === false) {
                return [];
            }
            return $result;
        } catch (Exception $e) {
            handleException($e);
            return [];
        }
    }

    // Aliases para compatibilidad con controlador
    public function getImages($producto_id)
    {
        return $this->getImagenes($producto_id);
    }

    public function getImagenesByProducto($producto_id)
    {
        return $this->getImagenes($producto_id);
    }
}

