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
     * Crear nuevo producto
     * $datos puede ser array o stdClass
     */
    public function create($datos)
    {
        try {
            $datos = $this->normalize($datos);

            $nombre = $this->enlace->escapeString($datos['nombre'] ?? '');
            if ($nombre === '') {
                throw new Exception('Nombre requerido');
            }

            $descripcion = $this->enlace->escapeString($datos['descripcion'] ?? '');
            $precio = isset($datos['precio']) ? (float)$datos['precio'] : 0.0;
            $categoria_id = isset($datos['categoria_id']) ? (int)$datos['categoria_id'] : 0;
            $stock = (int)($datos['stock'] ?? 0);
            $sku = $this->enlace->escapeString($datos['sku'] ?? $this->generateSKU());
            $peso = (float)($datos['peso'] ?? 0);
            $dimensiones = $this->enlace->escapeString($datos['dimensiones'] ?? '');
            $material = $this->enlace->escapeString($datos['material'] ?? '');
            $color_principal = $this->enlace->escapeString($datos['color_principal'] ?? '');
            $genero = $this->enlace->escapeString($datos['genero'] ?? 'unisex');
            $temporada = $this->enlace->escapeString($datos['temporada'] ?? '');

            $vSql = "INSERT INTO productos (
                        nombre, descripcion, precio, categoria_id, stock, sku,
                        created_at
                    ) VALUES (
                        '$nombre', '$descripcion', $precio, $categoria_id, $stock, '$sku',
                        NOW()
                    )";

            $this->enlace->executeSQL_DML($vSql);
            $id = $this->enlace->getLastId();

            // Manejo de etiquetas: admite array (ids) o cadena separada por comas
            $etiquetas = $datos['etiquetas'] ?? [];
            if (is_string($etiquetas)) {
                $etiquetas = array_filter(array_map('trim', explode(',', $etiquetas)));
            }
            if (is_array($etiquetas) && !empty($etiquetas)) {
                $this->associateEtiquetas($id, $etiquetas);
            }

            return $this->get($id);
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
     */
    public function addImagen($data)
    {
        try {
            $data = $this->normalize($data);
            $producto_id = isset($data['producto_id']) ? (int)$data['producto_id'] : 0;
            if ($producto_id <= 0) {
                throw new Exception('producto_id inválido');
            }

            // Compatibilidad con distintos nombres
            $url_imagen = $data['url_imagen'] ?? $data['ruta_archivo'] ?? null;
            if (!$url_imagen && isset($data['nombre_archivo'])) {
                $url_imagen = 'uploads/' . $this->enlace->escapeString($data['nombre_archivo']);
            }
            $url_imagen = $this->enlace->escapeString($url_imagen ?? '');

            if (empty($url_imagen)) {
                throw new Exception('url_imagen inválida');
            }

            $alt_text = $this->enlace->escapeString($data['alt_text'] ?? 'Imagen de producto');
            $orden = (int)($data['orden'] ?? 0);

            $sql = "INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, orden)
                    VALUES ($producto_id, '$url_imagen', '$alt_text', $orden)";

            $this->enlace->executeSQL_DML($sql);
            $id = $this->enlace->getLastId();

            return [
                'id' => $id,
                'producto_id' => $producto_id,
                'url_imagen' => $url_imagen,
                'alt_text' => $alt_text,
                'orden' => $orden
            ];
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
            $sql = "SELECT * FROM producto_imagenes WHERE producto_id = $producto_id ORDER BY orden ASC, id ASC";
            $imagenes = $this->enlace->executeSQL($sql);
            return $imagenes;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}
