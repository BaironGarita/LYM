<?php
require_once __DIR__ . '/controllers/core/Config.php';

var_dump(\Config::get('DB_USERNAME'));
var_dump(\Config::get('DB_PASSWORD'));
var_dump(\Config::get('DB_HOST'));
var_dump(\Config::get('DB_DBNAME'));
