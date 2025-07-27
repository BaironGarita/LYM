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
     * Obtener todos los productos activos
    */
    public function getAll()
    {
        error_log('Antes de ejecutar SQL en getAll');

        try {
           $vSql = "SELECT p.*, c.nombre as categoria_nombre, 
                           COUNT(r.id) as total_resenas,
                           AVG(r.valoracion) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.eliminado = 0 
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";
                    
            
            return $this->enlace->executeSQL($vSql);
            error_log('Después de ejecutar SQL en getAll');

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener producto por ID
     */
    public function get($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "SELECT p.*, c.nombre as categoria_nombre,
                           COUNT(r.id) as total_resenas,
                           AVG(r.valoracion) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.id = '$id' AND p.eliminado = 0
                    GROUP BY p.id";
            $result = $this->enlace->executeSQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear nuevo producto
     */
    public function create($datos)
    {
        try {
            $nombre = $this->enlace->escapeString($datos['nombre']);
            $descripcion = $this->enlace->escapeString($datos['descripcion'] ?? '');
            $precio = (float) $datos['precio'];
            $categoria_id = (int) $datos['categoria_id'];
            $stock = (int) ($datos['stock'] ?? 0);
            $sku = $this->enlace->escapeString($datos['sku'] ?? $this->generateSKU());
            $peso = (float) ($datos['peso'] ?? 0);
            $dimensiones = $this->enlace->escapeString($datos['dimensiones'] ?? '');
            $material = $this->enlace->escapeString($datos['material'] ?? '');
            $color_principal = $this->enlace->escapeString($datos['color_principal'] ?? '');
            $genero = $this->enlace->escapeString($datos['genero'] ?? 'unisex');
            $temporada = $this->enlace->escapeString($datos['temporada'] ?? '');

            $vSql = "INSERT INTO productos (
                        nombre, descripcion, precio, categoria_id, stock, sku,
                        peso, dimensiones, material, color_principal, genero, temporada,
                        created_at
                    ) VALUES (
                        '$nombre', '$descripcion', $precio, $categoria_id, $stock, '$sku',
                        $peso, '$dimensiones', '$material', '$color_principal', '$genero', '$temporada',
                        NOW()
                    )";

            $this->enlace->executeSQL_DML($vSql);
            $id = $this->enlace->getLastId();

            // Si hay etiquetas, las asociamos
            if (isset($datos->etiquetas) && is_array($datos->etiquetas)) {
                $this->associateEtiquetas($id, $datos->etiquetas);
            }

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar producto
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = $this->enlace->escapeString($datos->nombre);
            $descripcion = $this->enlace->escapeString($datos->descripcion ?? '');
            $precio = (float) $datos->precio;
            $categoria_id = (int) $datos->categoria_id;
            $stock = (int) ($datos->stock ?? 0);
            $peso = (float) ($datos->peso ?? 0);
            $dimensiones = $this->enlace->escapeString($datos->dimensiones ?? '');
            $material = $this->enlace->escapeString($datos->material ?? '');
            $color_principal = $this->enlace->escapeString($datos->color_principal ?? '');
            $genero = $this->enlace->escapeString($datos->genero ?? 'unisex');
            $temporada = $this->enlace->escapeString($datos->temporada ?? '');

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

            // Actualizar etiquetas si se proporcionan
            if (isset($datos->etiquetas) && is_array($datos->etiquetas)) {
                $this->updateEtiquetas($id, $datos->etiquetas);
            }

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Eliminar producto (soft delete)
     */
    public function delete($id)
    {
        try {
            $id = $this->enlace->escapeString($id);
            $vSql = "UPDATE productos SET eliminado = 1, updated_at = NOW() WHERE id = '$id'";
            return $this->enlace->executeSQL_DML($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener productos por categoría
     */
    public function getByCategoria($categoria_id)
    {
        try {
            $categoria_id = $this->enlace->escapeString($categoria_id);
            $vSql = "SELECT p.*, c.nombre as categoria_nombre,
                           COUNT(r.id) as total_resenas,
                           AVG(r.valoracion) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE p.categoria_id = '$categoria_id' AND p.eliminado = 0
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";
            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
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
                $categoria = $this->enlace->escapeString($filters['categoria']);
                $conditions[] = "p.categoria_id = '$categoria'";
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
                $etiquetas = explode(',', $filters['etiquetas']);
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
                           AVG(r.valoracion) as promedio_valoracion
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN resenas r ON p.id = r.producto_id
                    WHERE $where_clause
                    GROUP BY p.id
                    ORDER BY p.created_at DESC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
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
            // Eliminar etiquetas existentes
            $vSql = "DELETE FROM producto_etiquetas WHERE producto_id = $producto_id";
            $this->enlace->executeSQL_DML($vSql);

            // Agregar nuevas etiquetas
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
     * CORREGIDO: Alineado con el script lym_2025_final_script.sql
     */
    public function addImagen($data)
    {
        try {
            $producto_id = (int)$data['producto_id'];
            $url_imagen = $this->enlace->escapeString($data['url_imagen']);
            $alt_text = $this->enlace->escapeString($data['alt_text'] ?? 'Imagen de producto');
            $orden = (int)($data['orden'] ?? 0); // Se alinea con la columna 'orden' de tu tabla

            // La consulta ahora coincide exactamente con las columnas de tu tabla 'producto_imagenes'
            $sql = "INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, orden)
                    VALUES ($producto_id, '$url_imagen', '$alt_text', $orden)";
            
            $this->enlace->executeSQL_DML($sql);
            $id = $this->enlace->getLastId();
            
            return [
                'id' => $id,
                'producto_id' => $producto_id,
                'url_imagen' => $url_imagen
            ];
        } catch (Exception $e) {
            handleException($e);
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
        }
    }
}
