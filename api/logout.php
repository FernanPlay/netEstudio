<?php
declare(strict_types=1);

session_start();
$_SESSION = [];
session_destroy();

require __DIR__ . '/db.php';

json_response(['message' => 'Sesion cerrada.']);
