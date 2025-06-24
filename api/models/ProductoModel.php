<?php
/**
 * Modelo para la gestión de productos de moda
 * Basado en el README.md - Sistema de e-commerce de moda
 */
class ProductoModel
{
    // Conexión a la base de datos
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Obtener todos los productos activos
     * @return array - Lista de productos
     */
    public function all()
    {
        try {
            $vSql = "SELECT p.*, c.nombre as categoria_nombre
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE p.eliminado = 0 AND p.activo = 1
                    ORDER BY p.id DESC";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener todos los productos con sus etiquetas
     * @return array - Lista de productos con etiquetas
     */
    public function allWithEtiquetas()
    {
        try {
            $vSql = "SELECT 
                        p.id,
                        p.nombre,
                        p.descripcion,
                        p.precio,
                        p.stock,
                        p.activo,
                        c.nombre as categoria_nombre,
                        JSON_ARRAYAGG(
                            CASE 
                                WHEN e.id IS NOT NULL THEN
                                    JSON_OBJECT(
                                        'id', e.id,
                                        'nombre', e.nombre,
                                        'activo', e.activo
                                    )
                                ELSE NULL
                            END
                        ) as etiquetas
                     FROM productos p
                     LEFT JOIN categorias c ON p.categoria_id = c.id
                     LEFT JOIN producto_etiquetas pe ON p.id = pe.producto_id
                     LEFT JOIN etiquetas e ON pe.etiqueta_id = e.id AND e.activo = 1
                     WHERE p.eliminado = 0 AND p.activo = 1
                     GROUP BY p.id, p.nombre, p.descripcion, p.precio, p.stock, p.activo, c.nombre
                     ORDER BY p.id DESC";
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Procesar el JSON de etiquetas
            foreach ($vResultado as &$producto) {
                $etiquetas = json_decode($producto['etiquetas'], true);
                // Filtrar etiquetas nulas
                $producto['etiquetas'] = array_filter($etiquetas, function ($etiqueta) {
                    return $etiqueta !== null;
                });
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener producto por ID
     * @param $id - ID del producto
     * @return object - Datos del producto
     */
    public function get($id)
    {
        try {
            $vSql = "SELECT p.*, c.nombre as categoria_nombre
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE p.id = $id AND p.eliminado = 0 AND p.activo = 1";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener producto con etiquetas por ID
     * @param $id - ID del producto
     * @return object - Datos del producto con etiquetas
     */
    public function getWithEtiquetas($id)
    {
        try {
            $producto = $this->get($id);
            if ($producto) {
                $vSql = "SELECT e.* FROM etiquetas e
                        INNER JOIN producto_etiquetas pe ON e.id = pe.etiqueta_id
                        WHERE pe.producto_id = $id AND e.activo = 1
                        ORDER BY e.nombre";
                $etiquetas = $this->enlace->ExecuteSQL($vSql);
                $producto['etiquetas'] = $etiquetas;
            }
            return $producto;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear nuevo producto
     * @param $datos - Datos del producto a crear
     * @return object - Datos del producto creado
     */
    public function create($datos)
    {
        try {
            // Escapar y validar datos
            $nombre = addslashes($datos->nombre);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : '';
            $precio = (float) $datos->precio;
            $categoria_id = (int) $datos->categoria_id;
            $stock = isset($datos->stock) ? (int) $datos->stock : 0;
            $sku = isset($datos->sku) ? addslashes($datos->sku) : $this->generateSKU();
            $peso = isset($datos->peso) ? (float) $datos->peso : 0;
            $dimensiones = isset($datos->dimensiones) ? addslashes($datos->dimensiones) : '';
            $material = isset($datos->material) ? addslashes($datos->material) : '';
            $color_principal = isset($datos->color_principal) ? addslashes($datos->color_principal) : '';
            $genero = isset($datos->genero) ? addslashes($datos->genero) : 'unisex';
            $temporada = isset($datos->temporada) ? addslashes($datos->temporada) : '';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

            // Consulta SQL para insertar
            $vSql = "INSERT INTO productos (
                        nombre, descripcion, precio, categoria_id, stock, sku,
                        peso, dimensiones, material, color_principal, genero, temporada, activo
                    ) VALUES (
                        '$nombre', '$descripcion', $precio, $categoria_id, $stock, '$sku',
                        $peso, '$dimensiones', '$material', '$color_principal', '$genero', '$temporada', $activo
                    )";

            // Ejecutar la consulta y obtener el ID del último insert
            $idProducto = $this->enlace->executeSQL_DML_last($vSql);

            // Si hay etiquetas, las asociamos
            if (isset($datos->etiquetas) && is_array($datos->etiquetas)) {
                $this->associateEtiquetas($idProducto, $datos->etiquetas);
            }

            // Retornar el producto creado
            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar producto existente
     * @param $datos - Datos del producto a actualizar
     * @return object - Datos del producto actualizado
     */
    public function update($datos)
    {
        try {
            $id = (int) $datos->id;
            $nombre = addslashes($datos->nombre);
            $descripcion = isset($datos->descripcion) ? addslashes($datos->descripcion) : '';
            $precio = (float) $datos->precio;
            $categoria_id = (int) $datos->categoria_id;
            $stock = isset($datos->stock) ? (int) $datos->stock : 0;
            $peso = isset($datos->peso) ? (float) $datos->peso : 0;
            $dimensiones = isset($datos->dimensiones) ? addslashes($datos->dimensiones) : '';
            $material = isset($datos->material) ? addslashes($datos->material) : '';
            $color_principal = isset($datos->color_principal) ? addslashes($datos->color_principal) : '';
            $genero = isset($datos->genero) ? addslashes($datos->genero) : 'unisex';
            $temporada = isset($datos->temporada) ? addslashes($datos->temporada) : '';
            $activo = isset($datos->activo) ? (int) $datos->activo : 1;

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
                        activo = $activo
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
     * Eliminar lógicamente un producto
     * @param $id - ID del producto a eliminar
     * @return bool - True si se eliminó correctamente
     */
    public function delete($id)
    {
        try {
            $vSql = "UPDATE productos SET eliminado = 1 WHERE id = $id";
            $this->enlace->executeSQL_DML($vSql);
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener productos por categoría
     * @param $categoria_id - ID de la categoría
     * @return array - Lista de productos de la categoría
     */
    public function getByCategoria($categoria_id)
    {
        try {
            $vSql = "SELECT p.*, c.nombre as categoria_nombre
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE p.categoria_id = $categoria_id AND p.eliminado = 0 AND p.activo = 1
                    ORDER BY p.id DESC";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Buscar productos con filtros
     * @param $filters - Array de filtros de búsqueda
     * @return array - Lista de productos que coinciden con los filtros
     */
    public function buscar($filters)
    {
        try {
            $conditions = ["p.eliminado = 0", "p.activo = 1"];

            if (!empty($filters['q'])) {
                $q = addslashes($filters['q']);
                $conditions[] = "(p.nombre LIKE '%$q%' OR p.descripcion LIKE '%$q%' OR p.material LIKE '%$q%')";
            }

            if (!empty($filters['categoria'])) {
                $categoria = (int) $filters['categoria'];
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

            if (!empty($filters['material'])) {
                $material = addslashes($filters['material']);
                $conditions[] = "p.material LIKE '%$material%'";
            }

            if (!empty($filters['color'])) {
                $color = addslashes($filters['color']);
                $conditions[] = "p.color_principal LIKE '%$color%'";
            }

            if (!empty($filters['genero'])) {
                $genero = addslashes($filters['genero']);
                $conditions[] = "p.genero = '$genero'";
            }

            if (!empty($filters['etiquetas'])) {
                $etiquetas = explode(',', $filters['etiquetas']);
                $etiqueta_conditions = [];
                foreach ($etiquetas as $etiqueta) {
                    $etiqueta = (int) trim($etiqueta);
                    $etiqueta_conditions[] = "pe.etiqueta_id = $etiqueta";
                }
                if (!empty($etiqueta_conditions)) {
                    $conditions[] = "EXISTS (
                        SELECT 1 FROM producto_etiquetas pe 
                        WHERE pe.producto_id = p.id AND (" . implode(' OR ', $etiqueta_conditions) . ")
                    )";
                }
            }

            $where_clause = implode(' AND ', $conditions);

            $vSql = "SELECT p.*, c.nombre as categoria_nombre
                    FROM productos p 
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE $where_clause
                    ORDER BY p.id DESC";

            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Asociar etiquetas a un producto
     * @param $producto_id - ID del producto
     * @param $etiquetas - Array de IDs de etiquetas
     */
    private function associateEtiquetas($producto_id, $etiquetas)
    {
        try {
            foreach ($etiquetas as $etiqueta_id) {
                $etiqueta_id = (int) $etiqueta_id;
                $vSql = "INSERT IGNORE INTO producto_etiquetas (producto_id, etiqueta_id) 
                        VALUES ($producto_id, $etiqueta_id)";
                $this->enlace->executeSQL_DML($vSql);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar etiquetas de un producto
     * @param $producto_id - ID del producto
     * @param $etiquetas - Array de IDs de etiquetas
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
     * @return string - SKU generado
     */
    private function generateSKU()
    {
        return 'LYM-' . strtoupper(substr(uniqid(), -8));
    }
}
