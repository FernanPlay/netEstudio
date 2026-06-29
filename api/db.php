<?php
declare(strict_types=1);

function database(): PDO
{
    $directory = __DIR__ . '/../assets/bd';
    $path = $directory . '/datos.db';

    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    return $pdo;
}

function request_data(): array
{
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?: '', true);

    return is_array($data) ? $data : [];
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}
