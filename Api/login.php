<?php
require_once __DIR__ . '/cors.php';
sendCorsHeaders('POST');

require 'db.php';
session_start();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Données manquantes"
        ]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Identifiants incorrects"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur"
    ]);
}

exit;
?>