<?php
require_once __DIR__ . '/controllers/core/Config.php';
require_once __DIR__ . '/controllers/core/MySqlConnect.php';

$mysql = new MySqlConnect();
$cols = $mysql->runQuery('SHOW COLUMNS FROM pedidos', []);
var_dump($cols);
