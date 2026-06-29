<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => 'Metodo no permitido.'], 405);
}

$data = request_data();
$name = trim((string)($data['name'] ?? ''));
$username = trim((string)($data['username'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($name === '' || $username === '' || $email === '' || $password === '') {
    json_response(['message' => 'Completa todos los campos.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['message' => 'Ingresa un correo valido.'], 422);
}

if (strlen($password) < 6) {
    json_response(['message' => 'La contrasena debe tener minimo 6 caracteres.'], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare(
        'INSERT INTO users (name, username, email, password_hash)
         VALUES (:name, :username, :email, :password_hash)'
    );
    $statement->execute([
        ':name' => $name,
        ':username' => $username,
        ':email' => $email,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    $_SESSION['user'] = [
        'id' => (int)$pdo->lastInsertId(),
        'name' => $name,
        'username' => $username,
        'email' => $email,
    ];

    json_response(['message' => 'Cuenta creada correctamente.', 'user' => $_SESSION['user']], 201);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        json_response(['message' => 'El usuario o correo ya existe.'], 409);
    }

    json_response(['message' => 'No se pudo guardar el registro.'], 500);
}
