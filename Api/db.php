<?php
$config = require __DIR__ . '/config.php';

try {
    $conn = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8",
        $config['user'],
        $config['pass']
    );
    $conn->exec("SET time_zone = '+01:00'");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données"]);
    exit;
}
