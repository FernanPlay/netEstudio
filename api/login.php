<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => 'Metodo no permitido.'], 405);
}

$data = request_data();
$login = trim((string)($data['login'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($login === '' || $password === '') {
    json_response(['message' => 'Completa usuario/correo y contrasena.'], 422);
}

$pdo = database();
$statement = $pdo->prepare(
    'SELECT id, name, username, email, password_hash
     FROM users
     WHERE username = :login OR email = :login
     LIMIT 1'
);
$statement->execute([':login' => $login]);
$user = $statement->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['message' => 'Usuario o contrasena incorrectos.'], 401);
}

$_SESSION['user'] = [
    'id' => (int)$user['id'],
    'name' => $user['name'],
    'username' => $user['username'],
    'email' => $user['email'],
];

json_response(['message' => 'Inicio de sesion correcto.', 'user' => $_SESSION['user']]);
