<?php
use Core\Router;

// Se asume que index.php ya cargó autoload y los controllers necesarios.
$router = new Router('/api');

/*
 |-------------------------------------------------------
 | Rutas de Usuario
 |-------------------------------------------------------
*/
$router->post('/usuarios/login', 'UsuarioController@login');
$router->get('/usuarios', 'UsuarioController@index');
$router->get('/usuarios/{id}', 'UsuarioController@get');
$router->post('/usuarios', 'UsuarioController@create');
$router->put('/usuarios', 'UsuarioController@update');       // Tu convención original
$router->put('/usuarios/{id}', 'UsuarioController@update');  // Soporte adicional
$router->delete('/usuarios/{id}', 'UsuarioController@delete');

/*
 |-------------------------------------------------------
 | Productos
 |-------------------------------------------------------
*/
$router->get('/productos', 'ProductoController@index');
$router->get('/productos/{id}', 'ProductoController@get');
$router->post('/productos', 'ProductoController@create');
$router->put('/productos', 'ProductoController@update');
$router->put('/productos/{id}', 'ProductoController@update');
$router->delete('/productos/{id}', 'ProductoController@delete');

// Búsqueda y filtrado
$router->get('/productos/buscar', 'ProductoController@buscar');          // ?q=
$router->get('/productos/categoria/{id}', 'ProductoController@getByCategoria');

// Imágenes de productos (antes en RoutesController)
$router->get('/productos/imagenes', 'ProductoController@getImagenes');
$router->post('/productos/imagenes', 'ProductoController@addImagen');

/*
 |-------------------------------------------------------
 | Pedidos
 |-------------------------------------------------------
*/
$router->get('/pedidos', 'PedidoController@index');
$router->get('/pedidos/{id}', 'PedidoController@get');
$router->put('/pedidos/{id}/estado', 'PedidoController@actualizarEstadoPedido');

/*
 |-------------------------------------------------------
 | Extras y Producto-Extras
 |-------------------------------------------------------
*/
$router->get('/extras', 'ExtrasController@index');
$router->get('/extras/{id}', 'ExtrasController@get');
$router->post('/extras', 'ExtrasController@create');
$router->put('/extras', 'ExtrasController@update');
$router->put('/extras/{id}', 'ExtrasController@update');
$router->delete('/extras/{id}', 'ExtrasController@delete');

// Listar extras de un producto
$router->get('/productos/{productoId}/extras', 'ProductoExtraController@index');

// Asignaciones pivot
$router->post('/producto-extras', 'ProductoExtraController@create');
$router->delete('/producto-extras/{productoId}/{extraId}', 'ProductoExtraController@delete');
// (Opcional) listar todas las asignaciones si tienes método:
if (method_exists('ProductoExtraController', 'assignments')) {
    $router->get('/producto-extras', 'ProductoExtraController@assignments');
}

/*
 |-------------------------------------------------------
 | Reseñas (ejemplo de alias resenas / resena)
 |-------------------------------------------------------
*/
$router->get('/resenas', 'ResenaController@index');
$router->get('/resenas/{id}', 'ResenaController@get');
$router->post('/resenas', 'ResenaController@create');
$router->put('/resenas', 'ResenaController@update');
$router->put('/resenas/{id}', 'ResenaController@update');
$router->delete('/resenas/{id}', 'ResenaController@delete');

$router->get('/resena', 'ResenaController@index');
$router->get('/resena/{id}', 'ResenaController@get');

/*
 |-------------------------------------------------------
 | Otros recursos (agrega según necesidad)
 | Ejemplo rápido usando helper resource() si decides usarlo:
 | $router->resource('categorias', 'CategoriaController');
 |-------------------------------------------------------
*/

/*
 |-------------------------------------------------------
 | Despachar
 |-------------------------------------------------------
*/
$router->dispatch();