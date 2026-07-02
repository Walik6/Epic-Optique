<?php
require_once __DIR__ . '/cors.php';

// À appeler après sendCorsHeaders() sur toute route réservée à l'admin.
function requireAdmin() {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    if (empty($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'admin') {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Non autorisé, veuillez vous reconnecter']);
        exit;
    }
}
