<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/db.php';

if (empty($_SESSION['user'])) {
    json_response(['message' => 'Sesion no iniciada.'], 401);
}

json_response(['user' => $_SESSION['user']]);
