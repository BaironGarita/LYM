<?php
/**
 * Controlador para la gestión de productos de moda
 * Basado en el README.md - Dominio de moda y accesorios
 */
class ProductoController
{
    //GET listar todos los productos
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $productoM = new ProductoModel();
            //Método del modelo
            $result = $productoM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener producto por ID
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear nuevo producto
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //PUT actualizar producto
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //DELETE eliminar producto
    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET productos por categoría
    public function getByCategoria($categoria_id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->getByCategoria($categoria_id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET buscar productos
    public function buscar()
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener parámetros de búsqueda
            $filters = [
                'q' => $request->get('q'),
                'categoria' => $request->get('categoria'),
                'precio_min' => $request->get('precio_min'),
                'precio_max' => $request->get('precio_max'),
                'etiquetas' => $request->get('etiquetas'),
                'material' => $request->get('material'),
                'color' => $request->get('color'),
                'genero' => $request->get('genero')
            ];

            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->buscar($filters);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET productos con etiquetas
    public function indexWithEtiquetas()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $productoM = new ProductoModel();
            //Método del modelo
            $result = $productoM->allWithEtiquetas();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET producto con etiquetas por ID
    public function getWithEtiquetas($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->getWithEtiquetas($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
