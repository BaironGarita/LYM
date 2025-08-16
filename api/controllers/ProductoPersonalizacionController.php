<?php
class ProductoPersonalizacionController
{
    public function getByProducto()
    {
        try {
            $request = new Request();
            $producto_id = $request->get('producto_id') ?? $request->get('id');
            $model = new ProductoPersonalizacionModel();
            $result = $model->getByProducto($producto_id);
            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $data = $request->getJSON();
            $model = new ProductoPersonalizacionModel();
            $result = $model->create($data);
            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id = null)
    {
        try {
            $request = new Request();
            // Puede eliminar por id o por producto/opcion
            if ($id) {
                $model = new ProductoPersonalizacionModel();
                $res = $model->delete($id);
                (new Response())->toJSON($res);
                return;
            }

            $producto_id = $request->get('producto_id');
            $opcion_id = $request->get('opcion_id');
            $model = new ProductoPersonalizacionModel();
            if ($producto_id && $opcion_id) {
                $res = $model->deleteByProductoOpcion($producto_id, $opcion_id);
                (new Response())->toJSON($res);
                return;
            }

            (new Response())->toJSON(['error' => 'Parámetros insuficientes para eliminar']);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
